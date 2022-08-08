import { SetTempo } from './events/meta-events';
import { NoteOn, NoteOff, ChannelEventTypes, ChannelEvent } from './events/channel-events';
import { MidiEvent } from './events/midi-event';

export type Ran<T extends number> = number extends T ? number : _Range<T, []>;
export type _Range<T extends number, R extends unknown[]> = R['length'] extends T ? R[number] : _Range<T, [R['length'], ...R]>;
export type Byte = Ran<256>;
export type Nybble = Ran<16>;

export function chunk<T>(arr: T[], size: number): T[][] {
  let result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result = [...result, arr.slice(i, i + size)];
  }
  return result;
}

export function numberToWord(number: number, noOfBytes: number) {
  const str = number.toString(16).padStart(noOfBytes * 2, '0');
  const bytes = chunk(Array.from(str), 2).map(e => parseByte("0x" + e.join("")));
  return bytes;
}

export function closestGreaterMultipleOf(num: number, factor: number) {
  return num + factor - 1 - (num + factor - 1) % factor;
}


export function numberAsVariableLengthQty(n: number) {
  if (n <= 127)
    return numberToWord(n, 1);

  let bin = n.toString(2);
  let x: string[] = [];
  let targetLength = closestGreaterMultipleOf(bin.length, 7);
  bin = bin.padStart(targetLength, "0")
  for (let i = 0; i < bin.length; i += 7) {
    let str = bin.slice(i, i + 7)
    let isLastByte = i + 7 >= bin.length;
    let prefix = isLastByte ? '0' : '1';
    x = [...x, prefix + str.padStart(7, '0')];
  }

  return x.map(e => parseByte(e, 2));
}

export function bitTest(num: Byte, bit: Byte) {
  return ((num >> bit) % 2 != 0)
}

export function bitSet(num: Byte, bit: Byte) {
  return num | 1 << bit;
}

export function bitClear(num: Byte, bit: Byte) {
  return num & ~(1 << bit);
}

export function bitToggle(num: Byte, bit: Byte) {
  return bitTest(num, bit) ? bitClear(num, bit) : bitSet(num, bit);
}

export function SetBPM(bpm: number): SetTempo {
  bpm = Math.max(1, bpm);
  return {
    type: "SetTempo",
    microSecondsPerQuarter: Math.round(60000000 / bpm),
    ticks: 0
  }
}

export function byteArrayToHexStr(bytes: Byte[]) {
  return bytes.map(b => b.toString(16).padStart(2, "0")).join(' ');
}

export function byteToHexStr(byte: Byte) {
  return byte.toString(16).padStart(2, "0");
}

export function SingleNote(noteNumber: Byte, duration: number, velocity: Byte = 127, channel: Nybble = 0): [NoteOn, NoteOff] {
  return [
    {
      type: "NoteOn",
      ticks: 0,
      channel,
      noteNumber,
      velocity
    },
    {
      type: "NoteOff",
      ticks: duration,
      channel,
      noteNumber,
      velocity
    }
  ]
}

function isChannelEvent(event: MidiEvent): event is ChannelEvent {
  return ChannelEventTypes.hasOwnProperty(event.type);
}

export function toMidiMessage(event: MidiEvent): [Byte, Byte, Byte] | undefined {
  if (isChannelEvent(event)) {
    let data = ChannelEventTypes[event.type].toBytes(event);
    let bytes: Byte[] = [...data, 0, 0, 0]
    return [
      bytes[0],
      bytes[1],
      bytes[2]
    ];
  }
}

export function isValidByte(n: number): n is Byte {
  if (n < 0 || n > 255)
    return false;
  return true;
}

export function isValidNybble(n: number): n is Nybble {
  if (n < 0 || n > 15)
    return false;
  return true;
}



export function parseByte(n: string, base?: number): Byte {
  let i = parseInt(n, base);
  if (isValidByte(i))
    return i;
  else
    console.warn("Invalid byte: " + n);

  return 0xFF;
}