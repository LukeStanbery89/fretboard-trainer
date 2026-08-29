import { describe, it, expect, beforeEach } from 'vitest'
import {
  loadState,
  saveState,
  clearState,
  modeFromName,
  DEFAULT_STATE,
  type AppState,
} from '../storage'
import { MODES } from '../scales'

const KEY = 'fretboard-trainer-state'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loadState returns defaults when nothing is stored', () => {
    expect(loadState()).toEqual(DEFAULT_STATE)
  })

  it('round-trips a saved state', () => {
    const state: AppState = {
      strings: 7,
      tuningId: 'drop-a',
      tuningNotes: ['A', 'E', 'A', 'D', 'G', 'B', 'E'],
      key: 'F#',
      modeName: 'Dorian',
      view: 'caged',
      settings: { numFrets: 22, showNoteNames: false, colorByInterval: false, theme: 'light' },
    }
    saveState(state)
    expect(loadState()).toEqual(state)
  })

  it('clearState removes the saved value', () => {
    saveState(DEFAULT_STATE)
    clearState()
    expect(localStorage.getItem(KEY)).toBeNull()
  })

  it('falls back to defaults on corrupt JSON', () => {
    localStorage.setItem(KEY, 'not json at all {{{')
    expect(loadState()).toEqual(DEFAULT_STATE)
  })

  it('sanitizes an out-of-range string count', () => {
    localStorage.setItem(KEY, JSON.stringify({ strings: 99 }))
    expect(loadState().strings).toBe(DEFAULT_STATE.strings)
  })

  it('coerces stored notes to a valid length for the string count', () => {
    localStorage.setItem(KEY, JSON.stringify({ strings: 5, tuningNotes: ['E', 'A'] }))
    const state = loadState()
    expect(state.tuningNotes).toHaveLength(5)
  })

  it('remaps an unknown tuning id to custom', () => {
    localStorage.setItem(KEY, JSON.stringify({ strings: 6, tuningId: 'does-not-exist' }))
    expect(loadState().tuningId).toBe('custom')
  })

  it('uses canonical notes for a valid preset id', () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ strings: 6, tuningId: 'dadgad', tuningNotes: ['X', 'X', 'X', 'X', 'X', 'X'] }),
    )
    expect(loadState().tuningNotes).toEqual(['D', 'A', 'D', 'G', 'A', 'D'])
  })

  it('falls back to the default mode name for stale/renamed modes', () => {
    localStorage.setItem(KEY, JSON.stringify({ modeName: 'Ionian' }))
    // "Ionian" no longer a valid name -> default
    expect(loadState().modeName).toBe(DEFAULT_STATE.modeName)
  })

  it('accepts only 22 or 24 frets', () => {
    localStorage.setItem(KEY, JSON.stringify({ settings: { numFrets: 23 } }))
    expect(loadState().settings.numFrets).toBe(DEFAULT_STATE.settings.numFrets)
    localStorage.setItem(KEY, JSON.stringify({ settings: { numFrets: 22 } }))
    expect(loadState().settings.numFrets).toBe(22)
  })

  it('defaults theme to dark and accepts light', () => {
    expect(loadState().settings.theme).toBe('dark')
    localStorage.setItem(KEY, JSON.stringify({ settings: { theme: 'light' } }))
    expect(loadState().settings.theme).toBe('light')
  })

  it('keeps constants in sync', () => {
    expect(DEFAULT_STATE.settings.numFrets).toBe(24)
    expect(DEFAULT_STATE.strings).toBe(6)
    expect(DEFAULT_STATE.tuningId).toBe('e-standard')
    expect(MODES.map((m) => m.name)).toContain(DEFAULT_STATE.modeName)
  })
})

describe('modeFromName', () => {
  it('resolves a valid mode name', () => {
    expect(modeFromName('Dorian').name).toBe('Dorian')
    expect(modeFromName('Ionian (Major)').intervals).toEqual([0, 2, 4, 5, 7, 9, 11])
  })

  it('falls back to the first mode for unknown names', () => {
    expect(modeFromName('nope').name).toBe(MODES[0].name)
  })
})
