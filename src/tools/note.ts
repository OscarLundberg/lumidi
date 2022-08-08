import { NoteOff, NoteOn } from '../events/channel-events';
import { Pitch } from "./pitch";
import { NoteValue } from './note-value';
import { microSecondsPerWhole } from './config';

export class Note {
  duration: number;
  constructor(public pitch: Pitch, duration: NoteValue, public start: number = 0) {
    this.duration = microSecondsPerWhole() * duration
  }
  toMidi(): [NoteOn, NoteOff] {
    return [{
      type: "NoteOn",
      channel: 0,
      noteNumber: this.pitch.midi,
      velocity: 127,
      ticks: this.start
    },
    {
      type: "NoteOff",
      channel: 0,
      noteNumber: this.pitch.midi,
      velocity: 127,
      ticks: this.start + this.duration
    }];
  }
}
