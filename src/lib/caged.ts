import { chromaticIndex } from './notes'

export type ShapeName = 'C' | 'A' | 'G' | 'E' | 'D'

export const CAGED_SHAPES: ShapeName[] = ['C', 'A', 'G', 'E', 'D']

/**
 * The string that each CAGED shape is anchored on — where its root sits.
 * - E & G anchor on the low E string
 * - C & A anchor on the A string
 * - D anchors on the D string
 */
export const SHAPE_ANCHOR_STRINGS: Record<ShapeName, number> = {
  C: 1,
  A: 1,
  G: 0,
  E: 0,
  D: 2,
}

/** Chromatic index of each string's open note, indexed by string (0 = low E). */
export const OPEN_STRING_INDICES = [4, 9, 2, 7, 11, 4] // E A D G B E

const stringFret = (ri: number, stringOpen: number): number => {
  const fret = ((ri - stringOpen) % 12 + 12) % 12
  // An otherwise-open movable root sits an octave up so a barre voicing exists.
  return fret === 0 ? 12 : fret
}

const anchorFretFor = (shape: ShapeName, root: string): number => {
  const ri = chromaticIndex(root)
  // The C and G shapes only partial-barre the high strings; their barre sits 3
  // frets below the shape's root (C: A-string root, G: low-E root). When that
  // would fall below the nut, wrap up an octave so the shape stays on the board
  // (e.g. F major: G shape low-E root @1 -> barre -2 -> 10). For the eponymous
  // open root this naturally resolves to the nut (e.g. C: 3-3=0).
  if (shape === 'C') {
    const barre = stringFret(ri, OPEN_STRING_INDICES[1]) - 3
    return barre < 0 ? barre + 12 : barre
  }
  if (shape === 'G') {
    const barre = stringFret(ri, OPEN_STRING_INDICES[0]) - 3
    return barre < 0 ? barre + 12 : barre
  }
  // When the tonic equals the shape's letter, the shape is the eponymous open
  // chord (open A, open E, open D) — its home is the nut (0).
  if (shape === root) return 0
  const anchorOpen = OPEN_STRING_INDICES[SHAPE_ANCHOR_STRINGS[shape]]
  return stringFret(ri, anchorOpen)
}

/** The fret at which each CAGED shape should be barred, grouped by fret. */
export function cagedBarreFrets(
  root: string,
  numFrets: number,
): { fret: number; shapes: ShapeName[] }[] {
  const byFret = new Map<number, ShapeName[]>()
  for (const shape of CAGED_SHAPES) {
    const fret = anchorFretFor(shape, root)
    if (fret <= numFrets) {
      const list = byFret.get(fret) ?? []
      list.push(shape)
      byFret.set(fret, list)
    }
  }
  return [...byFret.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([fret, shapes]) => ({ fret, shapes }))
}
