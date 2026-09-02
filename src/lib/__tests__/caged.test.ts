import { describe, it, expect } from 'vitest'
import { cagedBarreFrets, CAGED_SHAPES } from '../caged'

describe('cagedBarreFrets', () => {
  it('places each shape correctly for key C (C open 0, A 3, G 5, E 8, D 10)', () => {
    const barres = cagedBarreFrets('C', 24)
    expect(barres).toEqual([
      { fret: 0, shapes: ['C'] },
      { fret: 3, shapes: ['A'] },
      { fret: 5, shapes: ['G'] },
      { fret: 8, shapes: ['E'] },
      { fret: 10, shapes: ['D'] },
    ])
  })

  it('places each shape correctly for key G (G open 0, E 3, D 5, C 7, A 10)', () => {
    const barres = cagedBarreFrets('G', 24)
    expect(barres).toEqual([
      { fret: 0, shapes: ['G'] },
      { fret: 3, shapes: ['E'] },
      { fret: 5, shapes: ['D'] },
      { fret: 7, shapes: ['C'] },
      { fret: 10, shapes: ['A'] },
    ])
  })

  it('places each shape correctly for key C# (C 1, A 4, G 6, E 9, D 11)', () => {
    const barres = cagedBarreFrets('C#', 24)
    expect(barres).toEqual([
      { fret: 1, shapes: ['C'] },
      { fret: 4, shapes: ['A'] },
      { fret: 6, shapes: ['G'] },
      { fret: 9, shapes: ['E'] },
      { fret: 11, shapes: ['D'] },
    ])
  })

  it('wraps low-position G/C shapes up an octave for key F (E 1, D 3, C 5, A 8, G 10)', () => {
    const barres = cagedBarreFrets('F', 24)
    expect(barres).toEqual([
      { fret: 1, shapes: ['E'] },
      { fret: 3, shapes: ['D'] },
      { fret: 5, shapes: ['C'] },
      { fret: 8, shapes: ['A'] },
      { fret: 10, shapes: ['G'] },
    ])
  })

  it('uses the eponymous open position for the chord root', () => {
    // A major -> A shape at the nut, D major -> D shape at the nut, etc.
    expect(cagedBarreFrets('A', 24).find((b) => b.shapes.includes('A'))?.fret).toBe(0)
    expect(cagedBarreFrets('E', 24).find((b) => b.shapes.includes('E'))?.fret).toBe(0)
    expect(cagedBarreFrets('D', 24).find((b) => b.shapes.includes('D'))?.fret).toBe(0)
  })

  it('drops shapes whose barre fret is above the board', () => {
    // On a 5-fret board only the lowest-position shapes remain; each barre is <= 5.
    const barres = cagedBarreFrets('C', 5)
    expect(barres.length).toBeGreaterThan(0)
    for (const b of barres) {
      expect(b.fret).toBeLessThanOrEqual(5)
    }
  })

  it('covers every shape across the grouped result', () => {
    const shapes = new Set(cagedBarreFrets('C', 24).flatMap((b) => b.shapes))
    expect(shapes).toEqual(new Set(CAGED_SHAPES))
  })
})
