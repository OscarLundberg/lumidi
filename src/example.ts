import { MidiFile, MIDIFileFormat } from './midi-file';
import { MIDIPlayer } from "./midi-player";
import { NoteOff, NoteOn } from './events/channel-events';
import { Byte, Nybble } from './helpers';
import { generateFile } from './midi-convert';
import { writeFileSync } from 'fs';

function notesFrom(numbers: number[], duration: Byte = 60, channel: Nybble = 0): (NoteOn | NoteOff)[] {
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
  const f: MidiFile = {


    type: MIDIFileFormat.SingleTrack,
    ticksPerQuarter: 480,
    tracks: [
      [
        ...notesFrom(wt)
      ]
    ]
  };
  await MIDIPlayer.play(f, 2);
})();


