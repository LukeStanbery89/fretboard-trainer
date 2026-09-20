import { describe, it, expect } from 'vitest'
import { MODES, scaleTones, degreeIndex, SCALE_ROOTS } from '../scales'

describe('MODES', () => {
  it('exposes all 7 church modes', () => {
    expect(MODES.map((m) => m.name)).toEqual([
      'Ionian (Major)',
      'Dorian',
      'Phrygian',
      'Lydian',
      'Mixolydian',
      'Aeolian (Minor)',
      'Locrian',
    ])
  })

  it('has equal length intervals per mode', () => {
    MODES.forEach((m) => {
      expect(m.intervals.length).toBe(7)
      expect(m.intervals[0]).toBe(0)
      expect(m.intervals).toEqual([...m.intervals].sort((a, b) => a - b))
    })
  })
})

describe('scaleTones', () => {
  it('C Ionian = C major (C D E F G A B)', () => {
    const tones = scaleTones('C', MODES[0])
    expect(tones.has(0)).toBe(true) // C
    expect(tones.has(2)).toBe(true) // D
    expect(tones.has(4)).toBe(true) // E
    expect(tones.has(5)).toBe(true) // F
    expect(tones.has(7)).toBe(true) // G
    expect(tones.has(9)).toBe(true) // A
    expect(tones.has(11)).toBe(true) // B
    expect(tones.has(1)).toBe(false) // C#
  })

  it('A Aeolian (Minor) = A natural minor', () => {
    const tones = scaleTones('A', MODES[5])
    const expected = [9, 11, 0, 2, 4, 5, 7] // A B C D E F G
    expected.forEach((t) => expect(tones.has(t)).toBe(true))
    expect(tones.has(10)).toBe(false) // A#
  })

  it('G Ionian has an F# (leading tone)', () => {
    const tones = scaleTones('G', MODES[0])
    expect(tones.has(6)).toBe(true) // F#
    expect(tones.has(5)).toBe(false) // F natural
  })

  it('different modes share a key but differ in tone set', () => {
    const lydian = scaleTones('C', MODES[3]) // C Lydian has F#
    const ionian = scaleTones('C', MODES[0])
    expect(lydian.has(6)).toBe(true)
    expect(ionian.has(6)).toBe(false)
  })

  it('handles sharp keys like E', () => {
    const tones = scaleTones('E', MODES[0]) // E major
    ;[4, 6, 8, 9, 11, 1, 3].forEach((t) => expect(tones.has(t)).toBe(true))
    expect(tones.has(5)).toBe(false) // F natural
  })
})

describe('SCALE_ROOTS', () => {
  it('has all 12 chromatic notes', () => {
    expect(SCALE_ROOTS).toHaveLength(12)
    expect(SCALE_ROOTS).toContain('C')
    expect(SCALE_ROOTS).toContain('F#')
    expect(SCALE_ROOTS).toContain('B')
  })
})

describe('degreeIndex', () => {
  it('maps each mode interval to its 0-based scale degree', () => {
    for (const mode of MODES) {
      mode.intervals.forEach((iv, degree) => {
        expect(degreeIndex(mode, iv), `${mode.name} interval ${iv}`).toBe(degree)
      })
    }
  })

  it('returns -1 for non-scale intervals', () => {
    expect(degreeIndex(MODES[0], 6)).toBe(-1) // no F# in C Ionian
    expect(degreeIndex(MODES[0], 1)).toBe(-1) // no C# in C Ionian
  })

  it('normalizes wrapped intervals', () => {
    expect(degreeIndex(MODES[0], 12)).toBe(0) // same class as the tonic
    expect(degreeIndex(MODES[0], 14)).toBe(1) // wraps to the 2nd (D) in C Ionian
    expect(degreeIndex(MODES[0], -10)).toBe(1) // negative offset wraps too
  })
})
