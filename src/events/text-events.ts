import { Byte, isValidByte, numberAsVariableLengthQty } from '../helpers';
import { MIDIParser } from '../midi-parser';
import { MidiEventBase, EventTypeData, isOfType, EventType, MidiEvent } from './midi-event';

export type TextEventType = "Text" | "CopyrightInfo" | "SequenceOrTrackName" | "TrackInstrumentName" | "Lyric" | "Marker" | "CuePoint";
export type TextEvent =
  | Text
  | CopyrightInfo
  | SequenceOrTrackName
  | TrackInstrumentName
  | Lyric
  | Marker
  | CuePoint

export interface Text extends MidiEventBase {
  type: "Text",
  text: string,
}
export interface CopyrightInfo extends MidiEventBase {
  type: "CopyrightInfo",
  text: string,
}
export interface SequenceOrTrackName extends MidiEventBase {
  type: "SequenceOrTrackName",
  text: string,
}
export interface TrackInstrumentName extends MidiEventBase {
  type: "TrackInstrumentName",
  text: string,
}
export interface Lyric extends MidiEventBase {
  type: "Lyric",
  text: string,
}
export interface Marker extends MidiEventBase {
  type: "Marker",
  text: string,
}
export interface CuePoint extends MidiEventBase {
  type: "CuePoint",
  text: string,
}

export const TextEventTypes: Record<TextEventType, EventTypeData> = {
  Text: {
    identifier: 0x01,
    toBytes: (evt: MidiEventBase) => {
      if (!isOfType(evt, "Text")) throw "Invalid event type"
      return midiText(evt.text, 0x01)
    },
    parse(instance: MIDIParser, ticks: number): MidiEvent {
      instance.bytePointer = instance.eventStartPointer + 2;
      const bytesToRead = instance.readVariableLengthQty();
      const text = Buffer.from(instance.read(bytesToRead)).toString();
      return {
        type: "Text",
        ticks,
        text: text,
      }
    }
  },
  CopyrightInfo: {
    identifier: 0x02,
    toBytes: (evt: MidiEventBase) => {
      if (!isOfType(evt, "CopyrightInfo")) throw "Invalid event type"
      return midiText(evt.text, 0x02)
    },
    parse(instance: MIDIParser, ticks: number): MidiEvent {
      instance.bytePointer = instance.eventStartPointer + 2;
      const bytesToRead = instance.readVariableLengthQty();
      const text = Buffer.from(instance.read(bytesToRead)).toString();
      return {
        type: "CopyrightInfo",
        ticks,
        text: text,
      }
    }
  },
  SequenceOrTrackName: {
    identifier: 0x03,
    toBytes: (evt: MidiEventBase) => {
      if (!isOfType(evt, "SequenceOrTrackName")) throw "Invalid event type"
      return midiText(evt.text, 0x03)
    },
    parse(instance: MIDIParser, ticks: number): MidiEvent {
      instance.bytePointer = instance.eventStartPointer + 2;
      const bytesToRead = instance.readVariableLengthQty();
      const text = Buffer.from(instance.read(bytesToRead)).toString();
      return {
        type: "SequenceOrTrackName",
        ticks,
        text: text,
      }
    }
  },
  TrackInstrumentName: {
    identifier: 0x04,
    toBytes: (evt: MidiEventBase) => {
      if (!isOfType(evt, "TrackInstrumentName")) throw "Invalid event type"
      return midiText(evt.text, 0x04)
    },
    parse(instance: MIDIParser, ticks: number): MidiEvent {
      instance.bytePointer = instance.eventStartPointer + 2;
      const bytesToRead = instance.readVariableLengthQty();
      const text = Buffer.from(instance.read(bytesToRead)).toString();
      return {
        type: "TrackInstrumentName",
        ticks,
        text: text,
      }
    }
  },
  Lyric: {
    identifier: 0x05,
    toBytes: (evt: MidiEventBase) => {
      if (!isOfType(evt, "Lyric")) throw "Invalid event type"
      return midiText(evt.text, 0x05)
    },
    parse(instance: MIDIParser, ticks: number): MidiEvent {
      instance.bytePointer = instance.eventStartPointer + 2;
      const bytesToRead = instance.readVariableLengthQty();
      const text = Buffer.from(instance.read(bytesToRead)).toString();
      return {
        type: "Lyric",
        ticks,
        text: text,
      }
    }
  },
  Marker: {
    identifier: 0x06,
    toBytes: (evt: MidiEventBase) => {
      if (!isOfType(evt, "Marker")) throw "Invalid event type"
      return midiText(evt.text, 0x06)
    },
    parse(instance: MIDIParser, ticks: number): MidiEvent {
      instance.bytePointer = instance.eventStartPointer + 2;
      const bytesToRead = instance.readVariableLengthQty();
      const text = Buffer.from(instance.read(bytesToRead)).toString();
      return {
        type: "Marker",
        ticks,
        text: text,
      }
    }
  },
  CuePoint: {
    identifier: 0x07,
    toBytes: (evt: MidiEventBase) => {
      if (!isOfType(evt, "CuePoint")) throw "Invalid event type"
      return midiText(evt.text, 0x07)
    },
    parse(instance: MIDIParser, ticks: number): MidiEvent {
      instance.bytePointer = instance.eventStartPointer + 2;
      const bytesToRead = instance.readVariableLengthQty();
      const text = Buffer.from(instance.read(bytesToRead)).toString();
      return {
        type: "CuePoint",
        ticks,
        text: text,
      }
    }
  }
};

export function midiText(text: string, prefix: Byte): Byte[] {
  const bytes = Array.from(Buffer.from(text, "ascii")).slice(0, 0xFF) as Byte[];
  return [0xFF, prefix, ...numberAsVariableLengthQty(bytes.length), ...bytes];
}
