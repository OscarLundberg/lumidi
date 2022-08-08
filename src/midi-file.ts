import { MidiEvent, MidiEventBase } from './events/midi-event';

export enum MIDIFileFormat {
  SingleTrack = 0,
  MultipleTracksSync = 1,
  MultipleTracksAsync = 2,
}

export interface MidiFile {
  type: MIDIFileFormat;
  ticksPerQuarter: number;
  tracks: MidiEvent[][];
}
