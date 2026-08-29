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
        'E Standard', 'D# Standard', 'C Standard',
        'Drop D', 'Drop C#', 'Drop C', 'DADGAD', 'Baritone', 'Custom',
      ]),
    )
  })

  it('has the required 7-string options', () => {
    const labels = TUNING_PRESETS[7].map((p) => p.label)
    expect(labels).toEqual(
      expect.arrayContaining(['B Standard', 'A# Standard', 'A Standard', 'Drop A', 'Drop G#', 'Drop G', 'Custom']),
    )
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
