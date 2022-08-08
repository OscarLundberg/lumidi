import { get } from "http";
import { Chord } from "./playable/chord";
import { Interval } from "./interval";
import { Note } from "./note";
import { NoteName } from "./note-name";
import { Pitch } from "./pitch";

export type Octave = number | "Inferred";
export type InferrablePitches = Pitch[] | [Pitch, ...Interval[]]
export type InferrableChords = Chord[];


export function notesToMidi(...notes: Note[]): number[] {
  /// infer octaves if not present
  const root = notes[0];
  return notes.map(n => n.pitch.midi);
}

export function transpose(root: NoteName, steps: number): [note: NoteName, octaveDelta: number] {
  let res = root + steps;
  let octaveDelta = 0;
  if (res > NoteName.B) {
    res = res - 12;
    octaveDelta = 1;
  } else if (res < NoteName.C) {
    res = res + 12;
    octaveDelta = -1;
  }
  return [res, octaveDelta];
}


export function infer(pitches: InferrablePitches): Pitch[] {
  const root = pitches[0];
  return pitches.map(p => {
    if (isValidPitch(p)) {
      return p;
    } else {
      return root.interval(p);
    }
  });
}


export function isValidPitch(p: Pitch | Interval): p is Pitch {
  return typeof p === "object";
}

