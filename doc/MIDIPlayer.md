# Class: MIDIPlayer

## Table of contents

### Constructors

- [constructor](../wiki/MIDIPlayer#constructor)

### Properties

- [output](../wiki/MIDIPlayer#output)
- [midiOutput](../wiki/MIDIPlayer#midioutput)

### Accessors

- [listOfPorts](../wiki/MIDIPlayer#listofports)

### Methods

- [delay](../wiki/MIDIPlayer#delay)
- [play](../wiki/MIDIPlayer#play)
- [playback](../wiki/MIDIPlayer#playback)
- [sequence](../wiki/MIDIPlayer#sequence)
- [play](../wiki/MIDIPlayer#play-1)

## Constructors

### constructor

• **new MIDIPlayer**(`port`)

Creates a MidiPlayer that plays on the specified port

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `port` | `number` | The port index to use |

#### Defined in

[midi-player.ts:25](https://github.com/OscarLundberg/wave-function-collapse-mx/blob/9f12d93/src/midi-player.ts#L25)

• **new MIDIPlayer**(`name`, `virtualPort?`)

Creates a MidiPlayer that plays on the specified port

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The port name |
| `virtualPort?` | `boolean` | - |

#### Defined in

[midi-player.ts:31](https://github.com/OscarLundberg/wave-function-collapse-mx/blob/9f12d93/src/midi-player.ts#L31)

## Properties

### output

• **output**: `number`

#### Defined in

[midi-player.ts:18](https://github.com/OscarLundberg/wave-function-collapse-mx/blob/9f12d93/src/midi-player.ts#L18)

___

### midiOutput

▪ `Static` **midiOutput**: `Output`

#### Defined in

[midi-player.ts:8](https://github.com/OscarLundberg/wave-function-collapse-mx/blob/9f12d93/src/midi-player.ts#L8)

## Accessors

### listOfPorts

• `Static` `get` **listOfPorts**(): `string`[]

#### Returns

`string`[]

#### Defined in

[midi-player.ts:9](https://github.com/OscarLundberg/wave-function-collapse-mx/blob/9f12d93/src/midi-player.ts#L9)

## Methods

### delay

▸ **delay**(`ms`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ms` | `number` |

#### Returns

`Promise`<`unknown`\>

#### Defined in

[midi-player.ts:108](https://github.com/OscarLundberg/wave-function-collapse-mx/blob/9f12d93/src/midi-player.ts#L108)

___

### play

▸ **play**(`file`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `file` | [`MidiFile`](../wiki/MidiFile) |

#### Returns

`Promise`<`void`\>

#### Defined in

[midi-player.ts:97](https://github.com/OscarLundberg/wave-function-collapse-mx/blob/9f12d93/src/midi-player.ts#L97)

___

### playback

▸ **playback**(`sequence`, `absoluteTime?`, `eventPointer?`): `Promise`<`void`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `sequence` | `Sequence` | `undefined` |
| `absoluteTime` | `number` | `0` |
| `eventPointer` | `number` | `0` |

#### Returns

`Promise`<`void`\>

#### Defined in

[midi-player.ts:82](https://github.com/OscarLundberg/wave-function-collapse-mx/blob/9f12d93/src/midi-player.ts#L82)

___

### sequence

▸ `Private` **sequence**(`file`): `Sequence`

#### Parameters

| Name | Type |
| :------ | :------ |
| `file` | [`MidiFile`](../wiki/MidiFile) |

#### Returns

`Sequence`

#### Defined in

[midi-player.ts:57](https://github.com/OscarLundberg/wave-function-collapse-mx/blob/9f12d93/src/midi-player.ts#L57)

___

### play

▸ `Static` **play**(`file`, `port`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `file` | [`MidiFile`](../wiki/MidiFile) |
| `port` | `string` \| `number` |

#### Returns

`Promise`<`void`\>

#### Defined in

[midi-player.ts:103](https://github.com/OscarLundberg/wave-function-collapse-mx/blob/9f12d93/src/midi-player.ts#L103)
