import { Byte, numberToWord } from "./helpers";
import { MidiEvent, toBytes } from "./events/midi-event";
import { MidiFile } from './midi-file';
export const HEADER = [0x4D, 0x54, 0x68, 0x64, 0x00, 0x00, 0x00, 0x06] as Byte[];
const TRACK_HEADER = [0x4D, 0x54, 0x72, 0x6B];

export function generateFile(file: MidiFile) {

  const format = numberToWord(file.tracks.length > 1 ? 0x01 : 0x00, 2);
  const noOfTracks = numberToWord(file.tracks.length, 2);
  const ticksPerQ = numberToWord(file.ticksPerQuarter, 2);

  const tracks = file.tracks.reduce((prev, cur) =>
    [...prev, ...generateTrack(cur)], [] as number[]
  );

  return Buffer.from([
    ...HEADER,            // base header
    ...format,            // file format
    ...noOfTracks,        // number of tracks
    ...ticksPerQ,         // ticks per beat
    ...tracks
  ])
}

function generateTrack(events: MidiEvent[]) {
  // Add track end message if missing
  if (events.length <= 0 || events.slice(-1)[0].type !== "TrackEnd")
    events = [...events, { type: "TrackEnd", ticks: 0 }];

  const trackEvents = events.reduce((prev, cur) =>
    [...prev,
    ...toBytes(cur)], [] as number[]
  );

  return [
    ...TRACK_HEADER,
    ...numberToWord(trackEvents.length, 4),
    ...trackEvents
  ];
}
