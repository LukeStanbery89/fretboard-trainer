import { describe, it, expect } from 'vitest'
import {
  TUNING_PRESETS,
  CUSTOM_ID,
  defaultTuningForCount,
  defaultCustomNotes,
  findPresetId,
  presetExists,
  E_STANDARD_NOTES,
} from '../tunings'

describe('TUNING_PRESETS', () => {
  it('has 6-string E Standard as the first preset', () => {
    expect(TUNING_PRESETS[6][0]).toMatchObject({ id: 'e-standard', label: 'E Standard' })
    expect(TUNING_PRESETS[6][0].notes).toEqual(['E', 'A', 'D', 'G', 'B', 'E'])
  })

  it('has the required 6-string options', () => {
    const labels = TUNING_PRESETS[6].map((p) => p.label)
    expect(labels).toEqual(
      expect.arrayContaining([
        'E Standard', 'D# Standard', 'D Standard',
        'Drop D', 'Drop C#', 'Drop C', 'DADGAD', 'Baritone', 'Custom',
      ]),
    )
  })

  it('uses D Standard (all strings down one step) instead of C Standard', () => {
    const dStandard = TUNING_PRESETS[6].find((p) => p.id === 'd-standard')
    expect(dStandard?.notes).toEqual(['D', 'G', 'C', 'F', 'A', 'D'])
    expect(TUNING_PRESETS[6].some((p) => p.id === 'c-standard')).toBe(false)
  })

  it('offers Standard and Drop variants at 0, 1/2, and 1 step down for each count', () => {
    for (const n of [4, 5, 7, 8, 9]) {
      const presets = TUNING_PRESETS[n].filter((p) => p.id !== CUSTOM_ID)
      expect(presets.map((p) => p.id), `count ${n}`).toHaveLength(6)
    }
    // 6-string has extra DADGAD/Baritone options on top of the standard set.
    expect(TUNING_PRESETS[6].filter((p) => p.id !== CUSTOM_ID).length).toBe(8)
  })

  it('has the required 7-string options', () => {
    const labels = TUNING_PRESETS[7].map((p) => p.label)
    expect(labels).toEqual(
      expect.arrayContaining(['B Standard', 'A# Standard', 'A Standard', 'Drop A', 'Drop G#', 'Drop G', 'Custom']),
    )
  })

  it('treats 4 strings as a bass (E A D G, lowest first)', () => {
    const labels = TUNING_PRESETS[4].map((p) => p.label)
    expect(TUNING_PRESETS[4][0].notes).toEqual(['E', 'A', 'D', 'G'])
    expect(labels).not.toEqual(expect.arrayContaining(['Tenor Standard', 'Baritone Ukulele']))
  })

  it('treats 5 strings as a bass (B E A D G, lowest first)', () => {
    expect(TUNING_PRESETS[5][0].notes).toEqual(['B', 'E', 'A', 'D', 'G'])
  })

  it('always ends with a Custom option for every string count', () => {
    Object.keys(TUNING_PRESETS).forEach((k) => {
      expect(TUNING_PRESETS[Number(k)].at(-1)?.id).toBe(CUSTOM_ID)
    })
  })

  it('custom preset notes match the string count', () => {
    Object.entries(TUNING_PRESETS).forEach(([count, presets]) => {
      presets.forEach((p) => {
        expect(p.notes).toHaveLength(Number(count))
      })
    })
  })
})

describe('defaultTuningForCount', () => {
  it('returns E Standard for 6 strings', () => {
    expect(defaultTuningForCount(6)).toEqual(['E', 'A', 'D', 'G', 'B', 'E'])
  })

  it('returns a preset for each supported count', () => {
    for (let n = 4; n <= 9; n++) {
      expect(defaultTuningForCount(n)).toHaveLength(n)
    }
  })

  it('falls back to the 6-string presets for an unknown count', () => {
    expect(defaultTuningForCount(99).join(',')).not.toBe('')
  })
})

describe('defaultCustomNotes', () => {
  it('returns E Standard notes for 6 strings', () => {
    expect(defaultCustomNotes(6)).toEqual(E_STANDARD_NOTES)
  })

  it('matches the count for any size', () => {
    for (let n = 4; n <= 9; n++) {
      const notes = defaultCustomNotes(n)
      expect(notes).toHaveLength(n)
      expect(notes.every((x) => typeof x === 'string' && x.length > 0)).toBe(true)
    }
  })
})

describe('findPresetId', () => {
  it('identifies E Standard', () => {
    expect(findPresetId(['E', 'A', 'D', 'G', 'B', 'E'])).toBe('e-standard')
  })

  it('identifies Drop D', () => {
    expect(findPresetId(['D', 'A', 'D', 'G', 'B', 'E'])).toBe('drop-d')
  })

  it('returns custom for unknown combos', () => {
    expect(findPresetId(['E', 'E', 'E', 'E', 'E', 'E'])).toBe(CUSTOM_ID)
  })

  it('returns custom when count does not match any preset', () => {
    expect(findPresetId(['E', 'A', 'D'])).toBe(CUSTOM_ID)
  })
})

describe('presetExists', () => {
  it('true for known preset', () => {
    expect(presetExists(6, 'dadgad')).toBe(true)
  })

  it('false for unknown id or wrong count', () => {
    expect(presetExists(6, 'nope')).toBe(false)
    expect(presetExists(7, 'e-standard')).toBe(false)
  })
})
