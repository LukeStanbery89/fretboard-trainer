import { CHROMATIC, chromaticIndex, noteFromChromaticIndex } from './notes'

export interface Mode {
  name: string
  /** Note types / interval quality labels per degree. */
  degreeLabels: string[]
  /** Semitone offsets from the root. */
  intervals: number[]
}

/** The 7 church modes. */
export const MODES: Mode[] = [
  { name: 'Ionian (Major)', degreeLabels: [], intervals: [0, 2, 4, 5, 7, 9, 11] },
  { name: 'Dorian', degreeLabels: [], intervals: [0, 2, 3, 5, 7, 9, 10] },
  { name: 'Phrygian', degreeLabels: [], intervals: [0, 1, 3, 5, 7, 8, 10] },
  { name: 'Lydian', degreeLabels: [], intervals: [0, 2, 4, 6, 7, 9, 11] },
  { name: 'Mixolydian', degreeLabels: [], intervals: [0, 2, 4, 5, 7, 9, 10] },
  { name: 'Aeolian (Minor)', degreeLabels: [], intervals: [0, 2, 3, 5, 7, 8, 10] },
  { name: 'Locrian', degreeLabels: [], intervals: [0, 1, 3, 5, 6, 8, 10] },
]

/** 0-based scale degree (index into mode.intervals) for a relative interval, or -1 if not a scale tone. */
export function degreeIndex(mode: Mode, rel: number): number {
  return mode.intervals.indexOf(((rel % 12) + 12) % 12)
}

/** Chromatic indices (0-11) that belong to a scale. */
export function scaleTones(key: string, mode: Mode): Set<number> {
  const root = chromaticIndex(key)
  return new Set(mode.intervals.map((iv) => (root + iv) % 12))
}

export const SCALE_ROOTS: string[] = CHROMATIC
export { noteFromChromaticIndex }
