import { MODES, type Mode } from './scales'
import {
  E_STANDARD_NOTES,
  defaultCustomNotes,
  presetExists,
  CUSTOM_ID,
  TUNING_PRESETS,
} from './tunings'
import type { ViewMode } from '../components/Controls'

export interface Settings {
  numFrets: number
  showNoteNames: boolean
  colorByInterval: boolean
  theme: 'dark' | 'light'
}

export interface AppState {
  strings: number
  tuningId: string
  tuningNotes: string[]
  key: string
  modeName: string
  view: ViewMode
  settings: Settings
}

const STORAGE_KEY = 'fretboard-trainer-state'

export const DEFAULT_STATE: AppState = {
  strings: 6,
  tuningId: 'e-standard',
  tuningNotes: E_STANDARD_NOTES,
  key: 'C',
  modeName: 'Ionian (Major)',
  view: 'scale',
  settings: {
    numFrets: 24,
    showNoteNames: true,
    colorByInterval: true,
    theme: 'dark',
  },
}

function sanitize(raw: unknown): AppState {
  if (!raw || typeof raw !== 'object') return DEFAULT_STATE
  const r = raw as Record<string, unknown>
  const s = (r.settings ?? {}) as Record<string, unknown>

  const strings =
    typeof r.strings === 'number' && r.strings >= 4 && r.strings <= 9
      ? r.strings
      : DEFAULT_STATE.strings

  // Tuning: keep stored notes if they're valid and preset exists, else fallback.
  let tuningId = typeof r.tuningId === 'string' ? r.tuningId : DEFAULT_STATE.tuningId
  let tuningNotes = Array.isArray(r.tuningNotes) && r.tuningNotes.length === strings
    ? (r.tuningNotes as string[])
    : defaultCustomNotes(strings)

  if (tuningId !== CUSTOM_ID && !presetExists(strings, tuningId)) {
    tuningId = CUSTOM_ID
  }
  // For a real preset, always use its canonical notes for this string count.
  if (tuningId !== CUSTOM_ID) {
    const preset = (TUNING_PRESETS[strings] ?? []).find((p) => p.id === tuningId)
    tuningNotes = preset ? [...preset.notes] : defaultCustomNotes(strings)
  }
  const modeName =
    typeof r.modeName === 'string' && MODES.some((m) => m.name === r.modeName)
      ? r.modeName
      : DEFAULT_STATE.modeName
  const key = typeof r.key === 'string' ? r.key : DEFAULT_STATE.key
  const view = r.view === 'caged' ? 'caged' : 'scale'

  return {
    strings,
    tuningId,
    tuningNotes,
    key,
    modeName,
    view,
    settings: {
      numFrets: s.numFrets === 22 || s.numFrets === 24 ? s.numFrets : DEFAULT_STATE.settings.numFrets,
      showNoteNames:
        typeof s.showNoteNames === 'boolean'
          ? s.showNoteNames
          : DEFAULT_STATE.settings.showNoteNames,
      colorByInterval:
        typeof s.colorByInterval === 'boolean'
          ? s.colorByInterval
          : DEFAULT_STATE.settings.colorByInterval,
      theme: s.theme === 'light' ? 'light' : 'dark',
    },
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    return sanitize(JSON.parse(raw))
  } catch {
    return DEFAULT_STATE
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore quota/security errors
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function modeFromName(name: string): Mode {
  return MODES.find((m) => m.name === name) ?? MODES[0]
}

export { CUSTOM_ID }
