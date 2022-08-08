import { Byte, byteArrayToHexStr, byteToHexStr, bitClear } from './helpers';
import { MidiFile } from "./midi-file";
import fs from 'fs/promises';
import { HEADER } from "./midi-convert";
import { MidiEvent, EventTypes, EventType, EventTypeData } from './events/midi-event';

enum ChunkType {
  Header = "MThd",
  Track = "MTrk",
  Unknown = "Unknown"
}
export class MIDIParser {
  bytePointer: number;
  /**
   * While handling an event, this number should be set to the index of `data` pointing to the first byte of the current event's data, not including deltaTime
   */
  eventStartPointer: number;
  data: Byte[] = [];
  fileDraft: MidiFile;
  trackDraft: MidiEvent[] = [];
  runningStatus: Byte;
  constructor() {
    this.bytePointer = 0;
    this.eventStartPointer = 0;
    this.runningStatus = 0;
    this.fileDraft = {
      type: 1,
      ticksPerQuarter: 0,
      tracks: [],
    }
  }

  /**
   * Read the next n bytes and return them as an array, advances the pointer
   */
  read(length: number) {
    const result = this.data.slice(this.bytePointer, this.bytePointer + length);
    let cacheBytePointer = this.bytePointer;
    this.bytePointer += length;
    console.log(`At ${cacheBytePointer} - read ${byteArrayToHexStr(result)} until position ${this.bytePointer}`);
    return result;
  }

  /**
   * Read the next byte
   */
  nextByte() {
    const result = this.data[this.bytePointer];
    console.log(`Read byte ${byteToHexStr(result)} at position ${this.bytePointer}`);
    this.bytePointer++;
    return result;
  }

  /**
   * read the next n-byte word
   */
  nextWord(length: number = 2) {
    const hexStr = this.read(length).reduce((prev, cur) => prev + byteToHexStr(cur), "0x");
    let value = parseInt(hexStr);
    return value;
  }

  /**
   * Reads a variable length quantity
   */
  readVariableLengthQty(): number {
    let str = "";
    let cacheBytePointer = this.bytePointer;
    while (this.data[this.bytePointer] > 127) {
      let b = this.data[this.bytePointer].toString(2).padStart(8, "0").slice(1);
      str += b
      this.bytePointer++
    }
    str += this.data[this.bytePointer].toString(2).padStart(8, "0").slice(1);
    this.bytePointer++;
    let val = parseInt(str, 2)
    console.log(`Read variable length quantity ${val} in ${this.bytePointer - cacheBytePointer} bytes`);
    return val;
  }

  /**
   * parse a MIDI file asynchronously, returning a promise that resolves to a MidiFile
   */
  public async parseFile(path: string): Promise<MidiFile> {
    const data = await fs.readFile(path);
    return this.parseData(data);
  }

  public parseData(data: Buffer): MidiFile {
    this.data = Array.from(data) as Byte[];
    while (this.bytePointer < this.data.length) {
      this.parseChunk();
    }
    return this.fileDraft as MidiFile;
  }

  public static parse(file: string): Promise<MidiFile>
  public static parse(data: Buffer): MidiFile
  public static parse(input: Buffer | string): Promise<MidiFile> | MidiFile {
    const parser = new MIDIParser();
    if (Buffer.isBuffer(input))
      return parser.parseData(input);

    return parser.parseFile(input);
  }

  private getChunkType() {
    let type = Buffer.from(this.read(4)).toString("ascii");
    if (type === "MTrk") {
      return ChunkType.Track;
    } else if (type === "MThd") {
      return ChunkType.Header;
    } else {
      return ChunkType.Unknown;
    }
  }

  private parseChunk() {
    let type = this.getChunkType();
    let len = this.nextWord(4);
    switch (type) {
      case ChunkType.Header:
        const type = this.nextWord();
        const noOfTracks = this.nextWord();
        const ticksPerQuarter = this.nextWord();
        this.fileDraft.type = type;
        this.fileDraft.ticksPerQuarter = ticksPerQuarter;
        console.log(`--- Parsed header ---`);

        break;
      case ChunkType.Track:
        let eventTypeByte: Byte = 0x00;
        while (eventTypeByte != EventTypes().TrackEnd.identifier) {
          const ticks = this.readVariableLengthQty();
          this.eventStartPointer = this.bytePointer;

          // find event type
          eventTypeByte = this.nextByte();
          if (eventTypeByte == 0xFF) {
            // Meta event
            eventTypeByte = this.nextByte();
          } else if (eventTypeByte == 0xF0 || eventTypeByte == 0x7F) {
            // sysex / multipacket event
            throw "sysex / multipacket event not implemented";
          } else if (eventTypeByte > 0x7F) {

            const matchingEvent = Object.entries(EventTypes()).find(([key, val]) => {
              let diff = eventTypeByte - val.identifier;
              return diff >= 0 && diff < 16
            })?.[1]
            if (!matchingEvent)
              throw `Unknown event type ${byteToHexStr(eventTypeByte)}`

            eventTypeByte = matchingEvent.identifier
            this.runningStatus = eventTypeByte;
          } else {
            // Running status
            eventTypeByte = this.runningStatus;
          }
          const matchingType = Object.entries(EventTypes()).find(([key, val]) => {
            return val.identifier == eventTypeByte
          });

          if (!matchingType)
            throw `Unknown event type ${eventTypeByte} at ${this.bytePointer}`;

          console.log("Found event: ", matchingType[0]);
          const [type, typeData] = matchingType as [EventType, EventTypeData];
          this.trackDraft = [...this.trackDraft, typeData.parse(this, ticks)];
        }
        this.fileDraft.tracks.push(this.trackDraft);
        this.trackDraft = [];
        console.log(`--- Parsed track ---`);
        break;
      default:
        this.bytePointer += len;
        break;
    }
  }
}

