import { describe, it, expect } from 'vitest'
import {
  transpose,
  CHROMATIC,
  chromaticIndex,
  noteFromChromaticIndex,
} from '../notes'

describe('transpose', () => {
  it('moves up the chromatic scale', () => {
    expect(transpose('C', 1)).toBe('C#')
    expect(transpose('E', 1)).toBe('F')
    expect(transpose('B', 1)).toBe('C')
    expect(transpose('C', 12)).toBe('C')
  })

  it('wraps around past the top', () => {
    expect(transpose('C', 12)).toBe('C')
    expect(transpose('C', 13)).toBe('C#')
  })

  it('moves down with negatives', () => {
    expect(transpose('C', -1)).toBe('B')
    expect(transpose('A', -2)).toBe('G')
  })

  it('returns the note unchanged for unknown input', () => {
    expect(transpose('Z', 3)).toBe('Z')
  })
})

describe('chromaticIndex / noteFromChromaticIndex', () => {
  it('indexes C=0 up through B=11', () => {
    expect(chromaticIndex('C')).toBe(0)
    expect(chromaticIndex('C#')).toBe(1)
    expect(chromaticIndex('A')).toBe(9)
    expect(chromaticIndex('B')).toBe(11)
  })

  it('round-trips through noteFromChromaticIndex', () => {
    CHROMATIC.forEach((n, i) => {
      expect(noteFromChromaticIndex(i)).toBe(n)
      expect(noteFromChromaticIndex(chromaticIndex(n))).toBe(n)
    })
  })

  it('wraps indices in noteFromChromaticIndex', () => {
    expect(noteFromChromaticIndex(12)).toBe('C')
    expect(noteFromChromaticIndex(-1)).toBe('B')
  })
})
