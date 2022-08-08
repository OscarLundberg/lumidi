import { InferrableChords } from "../helpers";
import { Note } from "../note";
import { Rhythm } from "../rhythm";
import { Chord } from "./chord";
import { Playable } from "./playable";

/**
 * Represents a set of related chords
 */
class Harmony implements Playable {
  rhythm: Rhythm;
  chords: Chord[];
  constructor(...chords: InferrableChords) {
    this.chords = chords;
    this.rhythm = new Rhythm(1);
  }

  play(start: number): Note[] {
    let notes: Note[] = [];
    let time = start;
    for (let chord of this.chords) {
      notes = [...notes, ...chord.play(time)];
      time += this.rhythm.nextDuration;
    }
    return notes;
  }

}
