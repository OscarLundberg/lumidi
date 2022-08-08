import { Note } from "../note";
import { Rhythm } from "../rhythm";

export interface Playable {
  play(start: number): Note[];
  rhythm?: Rhythm;
}
