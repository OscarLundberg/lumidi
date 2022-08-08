# lumidi

## Table of contents

### Classes

- [MIDIParser](../wiki/MIDIParser)
- [MIDIPlayer](../wiki/MIDIPlayer)

### Interfaces

- [MidiFile](../wiki/MidiFile)

### Type Aliases

- [ChannelEvent](../wiki/Exports#channelevent)
- [MetaEvent](../wiki/Exports#metaevent)
- [TextEvent](../wiki/Exports#textevent)

### Functions

- [generateFile](../wiki/Exports#generatefile)

## Type Aliases

### ChannelEvent

Ƭ **ChannelEvent**: `NoteOff` \| `NoteOn` \| `KeyAfterTouch` \| `ControlChange` \| `ProgramChange` \| `ChannelAfterTouch` \| `Pitchbend`

#### Defined in

[events/channel-events.ts:6](https://github.com/OscarLundberg/wave-function-collapse-mx/blob/9f12d93/src/events/channel-events.ts#L6)

___

### MetaEvent

Ƭ **MetaEvent**: [`TextEvent`](../wiki/Exports#textevent) \| `SetTrackSequenceNumber` \| `MidiChannelPrefix` \| `TrackEnd` \| `SetTempo` \| `SetTimeSignature` \| `SetKeySignature` \| `SequencerSpecific`

#### Defined in

[events/meta-events.ts:6](https://github.com/OscarLundberg/wave-function-collapse-mx/blob/9f12d93/src/events/meta-events.ts#L6)

___

### TextEvent

Ƭ **TextEvent**: `Text` \| `CopyrightInfo` \| `SequenceOrTrackName` \| `TrackInstrumentName` \| `Lyric` \| `Marker` \| `CuePoint`

#### Defined in

[events/text-events.ts:6](https://github.com/OscarLundberg/wave-function-collapse-mx/blob/9f12d93/src/events/text-events.ts#L6)

## Functions

### generateFile

▸ **generateFile**(`file`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `file` | [`MidiFile`](../wiki/MidiFile) |

#### Returns

`Buffer`

#### Defined in

[midi-convert.ts:7](https://github.com/OscarLundberg/wave-function-collapse-mx/blob/9f12d93/src/midi-convert.ts#L7)
