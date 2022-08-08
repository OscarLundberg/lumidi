import { NoteValue } from "./note-value";

/**
 * Represents a rhythm pattern
 */
export class Rhythm {
  noteValues: NoteValue[];
  pointer: number;
  constructor(...noteValues: NoteValue[]) {
    this.noteValues = noteValues;
    this.pointer = 0;
  }

  get nextDuration(): number {
    let res = this.noteValues[this.pointer];
    this.pointer++;
    if (this.pointer >= this.noteValues.length - 1) {
      this.pointer = 0;
    }
    return res;
  }
}
