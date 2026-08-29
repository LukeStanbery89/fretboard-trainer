import { describe, it, expect } from 'vitest'
import { cagedRegions } from '../caged'

describe('cagedRegions', () => {
  it('places a CAGED root for C at the documented positions (24 frets)', () => {
    const regions = cagedRegions('C', 24)
    const byShape = Object.fromEntries(regions.map((r) => [r.shape, r.rootFret]))
    // C & A root on the A string (fret 3), G & E root on low E (fret 8),
    // D root on the D string (fret 10).
    expect(byShape['C']).toBe(3)
    expect(byShape['A']).toBe(3)
    expect(byShape['G']).toBe(8)
    expect(byShape['E']).toBe(8)
    expect(byShape['D']).toBe(10)
  })

  it('places a CAGED layout for G correctly', () => {
    const regions = cagedRegions('G', 24)
    const byShape = Object.fromEntries(regions.map((r) => [r.shape, r.rootFret]))
    // G: E/G root low E fret 3, D root D string fret 5, C/A root A string fret 10.
    expect(byShape['E']).toBe(3)
    expect(byShape['G']).toBe(3)
    expect(byShape['D']).toBe(5)
    expect(byShape['C']).toBe(10)
    expect(byShape['A']).toBe(10)
  })

  it('produces exactly 5 regions', () => {
    expect(cagedRegions('C', 24)).toHaveLength(5)
    expect(new Set(cagedRegions('C', 24).map((r) => r.shape)).size).toBe(5)
  })

  it('regions are ordered by root fret ascending', () => {
    const regions = cagedRegions('A', 24)
    for (let i = 1; i < regions.length; i++) {
      expect(regions[i].rootFret).toBeGreaterThanOrEqual(regions[i - 1].rootFret)
    }
  })

  it('start is always <= end and within [1, numFrets]', () => {
    for (const root of ['C', 'G', 'A', 'E', 'D', 'F#', 'B']) {
      cagedRegions(root, 22).forEach((r) => {
        expect(r.start).toBeGreaterThanOrEqual(1)
        expect(r.end).toBeLessThanOrEqual(22)
        expect(r.start).toBeLessThanOrEqual(r.end)
      })
    }
  })

  it('respects a smaller fret count', () => {
    const regions = cagedRegions('C', 12)
    regions.forEach((r) => expect(r.end).toBeLessThanOrEqual(12))
  })
})
