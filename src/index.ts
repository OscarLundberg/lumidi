import { MidiFile, MIDIFileFormat } from './midi-file';
import { MIDIPlayer } from "./midi-player";
import { NoteOff, NoteOn } from './events/channel-events';
import { Byte, Nybble } from './helpers';

function notesFrom(numbers: number[], duration: Byte = 15, channel: Nybble = 0): (NoteOn | NoteOff)[] {
  return numbers.flatMap(n => {
    return [{
      type: "NoteOn",
      channel,
      duration,
      noteNumber: n as Byte,
      velocity: 127,
      ticks: duration
    }, {
      type: "NoteOff",
      channel,
      duration,
      noteNumber: n as Byte,
      velocity: 127,
      ticks: duration
    }]
  });
}

(async () => {
  const wt = [45, 52, 59, 66, 73];
  const wt2 = wt.map(n => n + 22)
  const phrase = [...wt, ...wt2, ...wt2.reverse(), ...wt.reverse()];
  const up = (arr: number[]) => arr.map(n => n + 2);
  const dn = (arr: number[]) => arr.map(n => n - 2);
  const p2 = [...phrase, ...up(phrase), ...phrase, ...dn(phrase)]
  const f: MidiFile = {


    type: MIDIFileFormat.SingleTrack,
    ticksPerQuarter: 480,
    tracks: [
      [
        ...notesFrom(p2)
      ]
    ]
  };
  await MIDIPlayer.play(f, 2);
})();