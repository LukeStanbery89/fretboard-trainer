import { describe, it, expect } from 'vitest'
import { inlayDots, fretNumbers, INLAY_FRETS } from '../fretboard'

describe('fretNumbers', () => {
  it('returns 1..n', () => {
    expect(fretNumbers(24)).toHaveLength(24)
    expect(fretNumbers(24)[0]).toBe(1)
    expect(fretNumbers(24).at(-1)).toBe(24)
    expect(fretNumbers(22)).toHaveLength(22)
  })
})

describe('inlayDots', () => {
  it('returns 2 at the octave double markers', () => {
    expect(inlayDots(12)).toBe(2)
    expect(inlayDots(24)).toBe(2)
  })

  it('returns 1 at single marker frets', () => {
    ;[3, 5, 7, 9, 15, 17, 19, 21].forEach((f) => {
      expect(inlayDots(f)).toBe(1)
    })
  })

  it('returns 0 elsewhere', () => {
    ;[1, 2, 4, 6, 8, 10, 11, 13, 14, 16, 18, 20, 22, 23].forEach((f) => {
      expect(inlayDots(f)).toBe(0)
    })
  })

  it('INLAY_FRETS contains all marker frets', () => {
    expect(INLAY_FRETS).toEqual([3, 5, 7, 9, 12, 15, 17, 19, 21, 24])
  })
})
