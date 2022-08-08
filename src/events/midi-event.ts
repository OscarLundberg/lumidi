import { ChannelEventType, ChannelEvent, ChannelEventTypes } from './channel-events';
import { MetaEventType, MetaEvent, MetaEventTypes } from './meta-events';
import { Byte, numberAsVariableLengthQty, toMidiMessage } from '../helpers';
import { MIDIParser } from '../midi-parser';

export type EventType = ChannelEventType | MetaEventType;
export type MidiEventBase = {
  type: EventType
  ticks: number;
}

export type MidiEvent = ChannelEvent | MetaEvent;

export type EventTypeData = {
  identifier: Byte;
  toBytes: (evt: MidiEventBase) => Byte[];
  /**
   * Parses the event using the correct behaviour based on the event type. Should advance the parser's byte pointer so that it is at the start of the next event or chunk.
   */
  parse: (instance: MIDIParser, ticks: number) => MidiEvent;
  toMidiMessage?: (evt: MidiEventBase) => [Byte, Byte, Byte];
}

export function EventTypes(){
  return {
    ...ChannelEventTypes,
    ...MetaEventTypes
  }
}

export function toBytes(event: MidiEvent): Byte[] {
  const eventType = EventTypes()[event.type];
  return [
    ...numberAsVariableLengthQty(event.ticks),
    ...eventType.toBytes(event)
  ];
}

export function isOfType<S extends EventType, T extends (MidiEvent & { type: S })>(evt: MidiEventBase, type: S): evt is T {
  return evt.type == type;
}