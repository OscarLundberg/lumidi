import { isValidByte } from '../helpers';
import { Octave, transpose } from "./helpers";
import { Interval } from "./interval";
import { NoteName } from "./note-name";
import { Chord } from './playable/chord';


export class Pitch {
  /**
   * The note's pitch
   */
  noteName: NoteName;
  octave: Octave;
  constructor(noteName: NoteName, octave: Octave) {
    this.noteName = noteName;
    this.octave = octave;
  }

  valueOf() {
    return;
  }

  interval(i: Interval): Pitch {
    let [target, octaveDelta] = transpose(this.noteName, i);
    if (this.octave != "Inferred") {
      return new Pitch(target, this.octave + octaveDelta);
    } else {
      return new Pitch(target, "Inferred");
    }
  }

  get midi() {
    if (this.octave == "Inferred") {
      this.octave = 4;
    }
    let res = ((this.octave) * 12) + this.noteName + 12;
    if (isValidByte(res))
      return res;

    else
      throw new Error("Invalid midi value");
  }

  get maj7(): Chord {
    return Chord.maj7(this);
  }

  get m7(): Chord {
    return Chord.m7(this);
  }


}
