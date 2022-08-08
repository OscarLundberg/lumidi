import { Byte, isValidByte, numberToWord, numberAsVariableLengthQty } from '../helpers';
import { MidiEventBase, isOfType, EventTypeData } from "./midi-event";
import { TextEvent, TextEventType, TextEventTypes } from "./text-events";

export type MetaEventType = TextEventType | "SetTrackSequenceNumber" | "MidiChannelPrefix" | "TrackEnd" | "SetTempo" | "SetTimeSignature" | "SetKeySignature" | "SequencerSpecific";
export type MetaEvent =
  | TextEvent
  | SetTrackSequenceNumber
  | MidiChannelPrefix
  | TrackEnd
  | SetTempo
  | SetTimeSignature
  | SetKeySignature
  | SequencerSpecific


export interface SetTrackSequenceNumber extends MidiEventBase {
  type: "SetTrackSequenceNumber",
  sequenceNumber: number,
}
export interface MidiChannelPrefix extends MidiEventBase {
  type: "MidiChannelPrefix",
  channel: Byte,
}
export interface TrackEnd extends MidiEventBase {
  type: "TrackEnd",
}
export interface SetTempo extends MidiEventBase {
  type: "SetTempo",
  microSecondsPerQuarter: number,
}
export interface SetTimeSignature extends MidiEventBase {
  type: "SetTimeSignature",
  numerator: Byte,
  denominator: Byte,
  ticksPerClick: Byte,
  thirtySecondNotesPerQuarter: Byte,
}
export interface SetKeySignature extends MidiEventBase {
  type: "SetKeySignature",
  key: Byte,
  scale: Byte,
}
export interface SequencerSpecific extends MidiEventBase {
  type: "SequencerSpecific",
  data: Byte[],
};


export const MetaEventTypes: Record<MetaEventType, EventTypeData> = {
  ...TextEventTypes,
  SetTrackSequenceNumber: {
    identifier: 0x00,
    toBytes: (evt: MidiEventBase) => {
      if (!isOfType(evt, "SetTrackSequenceNumber")) throw "Invalid event type";
      return [0xFF, 0x00, 0x02, ...numberToWord(evt.sequenceNumber, 2)];
    },
    parse(instance, ticks) {
      instance.bytePointer = instance.eventStartPointer + 3;
      const sequenceNumber = instance.nextWord();
      return {
        ticks,
        type: "SetTrackSequenceNumber",
        sequenceNumber: sequenceNumber,
      }
    }
  },
  MidiChannelPrefix: {
    identifier: 0x20,
    toBytes: (evt: MidiEventBase) => {
      if (!isOfType(evt, "MidiChannelPrefix")) throw "Invalid event type";
      return [0xFF, 0x20, 0x01, evt.channel];
    },
    parse(instance, ticks) {
      instance.bytePointer = instance.eventStartPointer + 3;
      const channel = instance.nextByte();
      return {
        ticks,
        type: "MidiChannelPrefix",
        channel: channel,
      }
    }
  },
  TrackEnd: {
    identifier: 0x2F,
    toBytes: (evt: MidiEventBase) => {
      if (!isOfType(evt, "TrackEnd")) throw "Invalid event type";
      return [0xFF, 0x2F, 0x00]
    },
    parse(instance, ticks) {
      instance.bytePointer = instance.eventStartPointer + 3;
      return {
        ticks,
        type: "TrackEnd",
      }
    }
  },
  SetTempo: {
    identifier: 0x51,
    toBytes: (evt: MidiEventBase) => {
      if (!isOfType(evt, "SetTempo")) throw "Invalid event type";
      return [0xFF, 0x51, 0x03, ...numberToWord(evt.microSecondsPerQuarter, 3)]
    },
    parse(instance, ticks) {
      instance.bytePointer = instance.eventStartPointer + 3;
      return {
        ticks,
        type: "SetTempo",
        microSecondsPerQuarter: instance.nextWord(3),
      }
    }
  },
  SetTimeSignature: {
    identifier: 0x58,
    toBytes: (evt: MidiEventBase) => {
      if (!isOfType(evt, "SetTimeSignature")) throw "Invalid event type";
      return [0xFF, 0x58, 0x04, evt.numerator, evt.denominator, evt.ticksPerClick, evt.thirtySecondNotesPerQuarter]
    },
    parse(instance, ticks) {
      instance.bytePointer = instance.eventStartPointer + 3;
      const [n, d, c, b] = instance.read(4);
      return {
        ticks,
        type: "SetTimeSignature",
        numerator: n,
        denominator: d,
        ticksPerClick: c,
        thirtySecondNotesPerQuarter: b,
      }
    }
  },
  SetKeySignature: {
    identifier: 0x59,
    toBytes: (evt: MidiEventBase) => {
      if (!isOfType(evt, "SetKeySignature")) throw "Invalid event type";
      return [0xFF, 0x59, 0x02, evt.key, evt.scale]
    },
    parse(instance, ticks) {
      instance.bytePointer = instance.eventStartPointer + 3;
      const [sf, mi] = instance.read(2);
      return {
        ticks,
        type: "SetKeySignature",
        key: sf,
        scale: mi,
      }
    }
  },
  SequencerSpecific: {
    identifier: 0x7F,
    toBytes: (evt: MidiEventBase) => {
      if (!isOfType(evt, "SequencerSpecific")) throw "Invalid event type";
      return [0xFF, 0x7F, ...numberAsVariableLengthQty(evt.data.length), ...evt.data];
    },
    parse(instance, ticks) {
      instance.bytePointer = instance.eventStartPointer + 2;
      const len = instance.readVariableLengthQty();
      const data = instance.read(len);
      return {
        ticks,
        type: "SequencerSpecific",
        data: data,
      }
    }
  }
}
