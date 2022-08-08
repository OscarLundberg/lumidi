
export enum NoteValue {
  Whole = 1,
  Half = 0.5,
  HalfTriplet = NoteValue.Whole / 3,
  DottedHalf = 0.75,
  Quarter = 0.25,
  QuarterTriplet = NoteValue.Whole / 6,
  DottedQuarter = 0.375,
  Eighth = 0.125,
  EighthTriplet = NoteValue.Whole / 12,
  DottedEighth = 0.1875,
  Sixteenth = 0.0625,
  SixteenthTriplet = NoteValue.Whole / 24,
  DottedSixteenth = 0.09375,
  ThirtySecond = 0.03125,
  ThirtySecondTriplet = NoteValue.Whole / 48,
  DottedThirtySecond = 0.046875,
  SixtyFourth = 0.015625,
  SixtyFourthTriplet = NoteValue.Whole / 96,
  DottedSixtyFourth = 0.0234375
}
