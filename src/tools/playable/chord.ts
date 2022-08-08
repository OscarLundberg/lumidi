import { infer, InferrablePitches } from "../helpers";
import { Interval } from "../interval";
import { Note } from "../note";
import { Pitch } from "../pitch";
import { Playable } from "./playable";
import { Rhythm } from "../rhythm";

/**
 * Represents a chord including multiple notes
 */
 export class Chord implements Playable {
  pitches: Pitch[];
  constructor(...pitches: InferrablePitches) {
    this.pitches = infer(pitches);
    this.rhythm = new Rhythm(1);
  }

  rhythm: Rhythm;
  play(start: number): Note[] {
    let notes: Note[] = [];
    for (let pitch of this.pitches) {
      notes.push(new Note(pitch, this.rhythm.nextDuration, start));
    }
    return notes;
  }


  static maj(pitch: Pitch): Chord {
    return new Chord(pitch, Interval.Maj3, Interval.Fifth);
  }
  static min(pitch: Pitch): Chord {
    return new Chord(pitch, Interval.min3, Interval.Fifth);
  }

  static aug(pitch: Pitch): Chord {
    return new Chord(pitch, Interval.Maj3, Interval.min6);
  }

  static dim(pitch: Pitch): Chord {
    return new Chord(pitch, Interval.min3, Interval.Tritone);
  }

  static maj7(pitch: Pitch): Chord {
    return new Chord(pitch, Interval.Maj3, Interval.Fifth, Interval.Maj7);
  }
  static m7(pitch: Pitch): Chord {
    return new Chord(pitch, Interval.Maj3, Interval.Fifth, Interval.Maj7);
  }
}
