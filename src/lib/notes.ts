export const CHROMATIC: string[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F',
  'F#', 'G', 'G#', 'A', 'A#', 'B',
]

export const NOTE_LETTERS: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

export const NOTE_INDEX: Record<string, number> = CHROMATIC.reduce(
  (acc, n, i) => {
    acc[n] = i
    return acc
  },
  {} as Record<string, number>,
)

/** Transpose a note name by semitones (can be negative). Circular over chromatic. */
export function transpose(note: string, semitones: number): string {
  const idx = NOTE_INDEX[note]
  if (idx === undefined) return note
  const len = CHROMATIC.length
  return CHROMATIC[((idx + semitones) % len + len) % len]
}

/** Native note name for a chromatic index (sharps). */
export function noteFromChromaticIndex(idx: number): string {
  return CHROMATIC[((idx % CHROMATIC.length) + CHROMATIC.length) % CHROMATIC.length]
}

/** Chromatic index for a note (0 = C). */
export function chromaticIndex(note: string): number {
  return NOTE_INDEX[note] ?? 0
}
