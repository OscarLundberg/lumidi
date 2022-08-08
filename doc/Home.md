# lumidi

## Parser
> Convert MIDI-data to JSON. 

This library converts data in Standard Midi File-format (SMF, ".mid") into a JSON object

It adheres to the the MIDI Associations' SMF specification which you can find on https://midi.org/

Some features are not implemented, for example sysex events / multi packet events.

### Usage

- Parse file asynchronously
```ts
async function parseMIDIFile() {
  const parsedFile = await MIDIParser.parse("test.mid");
}
```

- Parse from buffer synchronously
```ts
  const midiData = fs.readFileSync("test.mid"); // read a midi-file into buffer

  const parsedData = MIDIParser.parse(midiData)
```

## Converter 
> Convert JSON data into a MIDI file

> Format [MidiFile](../wiki/MidiFile)

> Usage
```ts
const myMidiFile: MidiFile = {
  type: MIDIFileFormat.MultipleTracksSync,
  ticksPerQuarter: 480,
  tracks: [
    // Tracks contain event objects
    [{ type: "TrackEnd", ticks: 0 }]
  ]
}

const buf: Buffer = generateFile(myMidiFile);
writeFileSync("myMidiFile.mid", buf);
```

Most MIDI events are supported 
- [ChannelEvents](../wiki/Exports#channelevent)
- [MetaEvents](../wiki/Exports#metaevent)
  - [TextEvents](../wiki/Exports#textevent)
