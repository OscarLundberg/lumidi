import * as midi from 'midi';
import { toBytes } from './events/midi-event';
import { toMidiMessage } from './helpers';
import { MidiFile } from './midi-file';


export class MIDIPlayer {
  static midiOutput: midi.Output;
  static get listOfPorts() {
    const outp = new midi.Output();
    const count = outp.getPortCount();
    let list: string[] = [];
    for (let i = 0; i < count; i++) {
      list = [...list, outp.getPortName(i)];
    }
    return list;
  }
  output: number;

  /**
   * Creates a MidiPlayer that plays on the specified port
   * @param port The port index to use
   * @param virtual open a virtual port, if true, the player will use a virtual port with the specified name, if false (default) the player will use the port with the specified name if it exists.
   */
  constructor(port: number)
  /**
  * Creates a MidiPlayer that plays on the specified port
  * @param name The port name
  * @param virtual open a virtual port, if true, the player will use a virtual port with the specified name, if false (default) the player will use the port with the specified name if it exists.
  */
  constructor(name: string, virtualPort?: boolean)
  constructor(port: string | number = 0, virtual: boolean = false) {
    if (MIDIPlayer.midiOutput == null)
      MIDIPlayer.midiOutput = new midi.Output();

    const noOfOutputs = MIDIPlayer.midiOutput.getPortCount()
    let outputIndex = -1;

    if (typeof port === 'number') {
      if (port >= noOfOutputs)
        throw new Error(`No output port with index ${port}`);
      outputIndex = port;
    }
    else {
      for (let i = 0; i < noOfOutputs; i++) {
        if (MIDIPlayer.midiOutput.getPortName(i) === port) {
          outputIndex = i;
          break;
        }
      }
    }
    if (outputIndex === -1)
      throw new Error(`No output port with name ${port}`);
    this.output = outputIndex;
  }

  private sequence(file: MidiFile): Sequence {
    let sequence: Sequence = []
    let tpq = file.ticksPerQuarter;
    let microSecondsPerQuarter = 600000; // base tempo 100bpm
    let tickDuration = () => microSecondsPerQuarter / tpq;
    for (let track of file.tracks) {
      let currentTick = 0;
      for (let event of track) {
        currentTick += event.ticks;
        if (event.type === 'SetTempo') {
          microSecondsPerQuarter = event.microSecondsPerQuarter;
        }
        let message = toMidiMessage(event);
        if (message) {
          let millis = (tickDuration() * currentTick) / 1000;
          sequence = [...sequence, [message, millis]];
        }
        else {
          console.log(`Unsupported realtime event: ${event.type}`);
        }
      }
    }
    return sequence.sort((a, b) => a[1] - b[1]);
  }

  async playback(sequence: Sequence, absoluteTime = 0, eventPointer = 0): Promise<void> {
    if (eventPointer < sequence.length) {
      const nextTime = sequence[eventPointer][1];
      if (absoluteTime < nextTime) {
        const delay = nextTime - absoluteTime;
        console.log({ delay });
        await this.delay(delay);
      }
      MIDIPlayer.midiOutput.send(sequence[eventPointer][0]);
      return this.playback(sequence, nextTime, eventPointer + 1);
    } else {
      MIDIPlayer.midiOutput.closePort();
    }
  }

  play(file: MidiFile): Promise<void> {
    MIDIPlayer.midiOutput.openPort(this.output);
    const sequence = this.sequence(file);
    return this.playback(sequence);
  }

  static play(file: MidiFile, port: number | string) {
    const player = (typeof port === 'number') ? new MIDIPlayer(port) : new MIDIPlayer(port, true);
    return player.play(file);
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

type Sequence = [message: midi.MidiMessage, absoluteTime: number][];

