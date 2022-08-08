import { Byte, isValidByte, Nybble, isValidNybble } from '../helpers';
import { MidiEventBase, EventTypeData, isOfType } from "./midi-event";
import { MIDIParser } from '../midi-parser';

export type ChannelEventType = "NoteOff" | "NoteOn" | "KeyAfterTouch" | "ControlChange" | "ProgramChange" | "ChannelAfterTouch" | "Pitchbend";
export type ChannelEvent = | NoteOff
  | NoteOn
  | KeyAfterTouch
  | ControlChange
  | ProgramChange
  | ChannelAfterTouch
  | Pitchbend;

export interface NoteOff extends MidiEventBase {
  type: "NoteOff",
  channel: Nybble,
  noteNumber: Byte,
  velocity: Byte,
}
export interface NoteOn extends MidiEventBase {
  type: "NoteOn",
  channel: Nybble,
  noteNumber: Byte,
  velocity: Byte,
}
export interface KeyAfterTouch extends MidiEventBase {
  type: "KeyAfterTouch",
  channel: Nybble,
  noteNumber: Byte,
  velocity: Byte,
}
export interface ControlChange extends MidiEventBase {
  type: "ControlChange",
  channel: Nybble,
  controllerNumber: Byte,
  value: Byte,
}
export interface ProgramChange extends MidiEventBase {
  type: "ProgramChange",
  channel: Nybble,
  programNumber: Byte,
}
export interface ChannelAfterTouch extends MidiEventBase {
  type: "ChannelAfterTouch",
  channel: Nybble,
  value: Byte,
}
export interface Pitchbend extends MidiEventBase {
  type: "Pitchbend",
  channel: Nybble,
  value: Byte,
}

export const ChannelEventTypes: Record<ChannelEventType, EventTypeData> = {
  NoteOff: {
    identifier: 0x80,
    toBytes(evt: MidiEventBase) {
      if (!isOfType(evt, "NoteOff"))
        throw "Invalid event type";

      let channel = 0x80 + evt.channel;
      if (!isValidByte(channel))
        throw "Invalid channel";

      return [channel, evt.noteNumber, evt.velocity];
    },
    parse(instance, ticks) {
      const [channel, noteNumber, velocity] = parseChannelEvent(instance, this)
      return {
        type: "NoteOff",
        ticks,
        channel,
        noteNumber,
        velocity,
      }
    }
  },
  NoteOn: {
    identifier: 0x90,
    toBytes(evt: MidiEventBase) {
      if (!isOfType(evt, "NoteOn"))
        throw "Invalid event type";

      let channel = 0x90 + evt.channel;
      if (!isValidByte(channel))
        throw "Invalid channel";

      return [channel, evt.noteNumber, evt.velocity];
    },
    parse(instance, ticks) {
      const [channel, noteNumber, velocity] = parseChannelEvent(instance, this)
      return {
        type: "NoteOn",
        ticks,
        channel,
        noteNumber,
        velocity,
      }
    }
  },
  KeyAfterTouch: {
    identifier: 0xA0,
    toBytes(evt: MidiEventBase) {
      if (!isOfType(evt, "KeyAfterTouch"))
        throw "Invalid event type";

      let channel = 0xA0 + evt.channel;
      if (!isValidByte(channel))
        throw "Invalid channel";

      return [channel, evt.noteNumber, evt.velocity];
    },
    parse(instance, ticks) {
      const [channel, noteNumber, velocity] = parseChannelEvent(instance, this)
      return {
        type: "KeyAfterTouch",
        ticks,
        channel,
        noteNumber,
        velocity,
      }
    }
  },
  ControlChange: {
    identifier: 0xB0,
    toBytes(evt: MidiEventBase) {
      if (!isOfType(evt, "ControlChange"))
        throw "Invalid event type";
      let channel = 0xB0 + evt.channel;
      if (!isValidByte(channel))
        throw "Invalid channel";

      return [channel, evt.controllerNumber, evt.value];
    },
    parse(instance, ticks) {
      const [channel, noteNumber, velocity] = parseChannelEvent(instance, this)
      return {
        type: "KeyAfterTouch",
        ticks,
        channel,
        noteNumber,
        velocity
      }
    }
  },
  ProgramChange: {
    identifier: 0xC0,
    toBytes(evt: MidiEventBase) {
      if (!isOfType(evt, "ProgramChange"))
        throw "Invalid event type";
      let channel = 0xC0 + evt.channel;
      if (!isValidByte(channel))
        throw "Invalid channel";

      return [channel, evt.programNumber];
    },
    parse(instance, ticks) {
      const [channel, programNumber] = parseChannelEvent(instance, this, 1)
      return {
        type: "ProgramChange",
        ticks,
        channel,
        programNumber,
      }
    }
  },
  ChannelAfterTouch: {
    identifier: 0xD0,
    toBytes(evt: MidiEventBase) {
      if (!isOfType(evt, "ChannelAfterTouch"))
        throw "Invalid event type";
      let channel = 0xD0 + evt.channel;
      if (!isValidByte(channel))
        throw "Invalid channel";

      return [channel, evt.value];
    },
    parse(instance, ticks) {
      const [channel, value] = parseChannelEvent(instance, this, 1)
      return {
        type: "ChannelAfterTouch",
        ticks,
        channel,
        value,
      }
    }
  },
  Pitchbend: {
    identifier: 0xE0,
    toBytes(evt: MidiEventBase) {
      if (!isOfType(evt, "Pitchbend"))
        throw "Invalid event type";
      let channel = 0xE0 + evt.channel;
      if (!isValidByte(channel))
        throw "Invalid channel";

      return [channel, evt.value];
    },
    parse(instance, ticks) {
      const [channel, value] = parseChannelEvent(instance, this, 1)
      return {
        type: "Pitchbend",
        ticks,
        channel,
        value
      }
    }
  }
}

function parseChannelEvent(instance: MIDIParser, self: EventTypeData, len = 2): [Nybble, ...Byte[]] {
  instance.bytePointer = instance.eventStartPointer;
  const channel = instance.nextByte() - self.identifier;
  if (!isValidNybble(channel))
    throw "Invalid channel";

  return [channel, ...instance.read(len)];
}