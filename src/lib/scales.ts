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

/** Interval class (0-11) -> label used for coloring (tonic, 3rd, 5th, ...). */
export function intervalClassName(ic: number): string {
  switch (ic % 12) {
    case 0: return 'tonic'
    case 2: case 4: return 'third'
    case 7: return 'fifth'
    case 1: case 3: case 6: case 8: case 10: return 'dissonant'
    default: return 'seventh'
  }
}

/** Chromatic indices (0-11) that belong to a scale. */
export function scaleTones(key: string, mode: Mode): Set<number> {
  const root = chromaticIndex(key)
  return new Set(mode.intervals.map((iv) => (root + iv) % 12))
}

export const SCALE_ROOTS: string[] = CHROMATIC
export { noteFromChromaticIndex }
