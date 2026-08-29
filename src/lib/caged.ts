import { chromaticIndex } from './notes'

export interface CagedRegion {
  shape: 'C' | 'A' | 'G' | 'E' | 'D'
  /** Root fret position (1-based) of the shape. */
  rootFret: number
  /** Region start fret (inclusive). */
  start: number
  /** Region end fret (inclusive). */
  end: number
}

const SHAPE_ORDER: ('C' | 'A' | 'G' | 'E' | 'D')[] = ['C', 'A', 'G', 'E', 'D']

/**
 * Compute the 5 CAGED regions for a given root note.
 *
 * Each shape roots on a specific string (E & G on the low E, C & A on the
 * A string, D on the D string). The fret of that root is derived from where
 * the root note appears on that string. Regions are clamped and ordered
 * ascending so they tile the neck usefully.
 */
export function cagedRegions(root: string, numFrets: number): CagedRegion[] {
  const ri = chromaticIndex(root)
  // Fret on each anchor string for the root (open strings: E=4, A=9, D=2 chromatic).
  const lowERoot = ((ri - 4) % 12 + 12) % 12
  const aRoot = ((ri - 9) % 12 + 12) % 12
  const dRoot = ((ri - 2) % 12 + 12) % 12

  // natural (shallowest) position of the root on its string; 0 maps to fret 12
  const place = (f: number) => {
    const v = f === 0 ? 12 : f
    return Math.max(1, Math.min(numFrets, v))
  }

  // root fret per shape
  const rootFret: Record<'C' | 'A' | 'G' | 'E' | 'D', number> = {
    C: place(aRoot),
    A: place(aRoot),
    G: place(lowERoot),
    E: place(lowERoot),
    D: place(dRoot),
  }

  // Give each shape a region window around its root.
  const window: Record<'C' | 'A' | 'G' | 'E' | 'D', [number, number]> = {
    C: [-3, 3],
    A: [-2, 3],
    G: [-3, 3],
    E: [-2, 3],
    D: [-2, 3],
  }

  const regions: CagedRegion[] = SHAPE_ORDER.map((shape) => {
    const rf = rootFret[shape]
    const [lo, hi] = window[shape]
    return {
      shape,
      rootFret: rf,
      start: Math.max(1, rf + lo),
      end: Math.min(numFrets, rf + hi),
    }
  })

  // Sort ascending by root fret so C-A-G-E-D read top to bottom on the neck.
  regions.sort((a, b) => a.rootFret - b.rootFret)
  return regions.filter((r) => r.start <= r.end)
}
