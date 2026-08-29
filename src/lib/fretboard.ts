/** Standard fretboard inlay marker positions (fret numbers that get dots). */
export const INLAY_FRETS = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24]

/** Frets near the 12th fret get two dots. */
export function inlayDots(fret: number): 1 | 2 | 0 {
  if (fret === 12 || fret === 24) return 2
  if (INLAY_FRETS.includes(fret)) return 1
  return 0
}

/** Fret numbers to render. */
export function fretNumbers(numFrets: number): number[] {
  const arr: number[] = []
  for (let i = 1; i <= numFrets; i++) arr.push(i)
  return arr
}
