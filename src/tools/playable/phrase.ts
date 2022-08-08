import { InferrablePitches, infer } from "../helpers";
import { Note } from "../note";
import { Pitch } from "../pitch";
import { Rhythm } from "../rhythm";
import { Playable } from "./playable";

/**
 * Represents a set of related notes
 */
 export class Phrase implements Playable {
  rhythm?: Rhythm;
  notes: Pitch[];
  constructor(...notes: InferrablePitches) {
    this.notes = infer(notes);
  }

  play(start: number): Note[] {
    return this.notes.map(n => new Note(n, 1, start));
  }
}