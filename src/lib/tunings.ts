import { transpose } from './notes'

export interface TuningPreset {
  /** User-facing label shown in the dropdown. */
  label: string
  /** Note names low string -> high string. */
  notes: string[]
  /** Internal stable id. */
  id: string
}

export const E_STANDARD_NOTES = ['E', 'A', 'D', 'G', 'B', 'E']

/** Presets per string count. Last entry is always Custom. */
export const TUNING_PRESETS: Record<number, TuningPreset[]> = {
  4: [
    { label: 'Four-String Bass', notes: ['E', 'A', 'D', 'G'], id: 'bass-4' },
    { label: 'D# Standard (4)', notes: ['D#', 'G#', 'C#', 'F#'], id: 'dsharp-standard-4' },
    { label: 'D Standard (4)', notes: ['D', 'G', 'C', 'F'], id: 'd-standard-4' },
    { label: 'Drop D (4)', notes: ['D', 'A', 'D', 'G'], id: 'drop-d-4' },
    { label: 'Drop C# (4)', notes: ['C#', 'G#', 'C#', 'F#'], id: 'drop-csharp-4' },
    { label: 'Drop C (4)', notes: ['C', 'G', 'C', 'F'], id: 'drop-c-4' },
    { label: 'Custom', notes: ['E', 'A', 'D', 'G'], id: 'custom' },
  ],
  5: [
    { label: 'Five-String Bass', notes: ['B', 'E', 'A', 'D', 'G'], id: 'b-standard-5' },
    { label: 'A# Standard (5)', notes: ['A#', 'D#', 'G#', 'C#', 'F#'], id: 'asharp-standard-5' },
    { label: 'D Standard (5)', notes: ['A', 'D', 'G', 'C', 'F'], id: 'd-standard-5' },
    { label: 'Drop A (5)', notes: ['A', 'E', 'A', 'D', 'G'], id: 'drop-a-5' },
    { label: 'Drop G# (5)', notes: ['G#', 'D#', 'G#', 'C#', 'F#'], id: 'drop-gsharp-5' },
    { label: 'Drop G (5)', notes: ['G', 'D', 'G', 'C', 'F'], id: 'drop-g-5' },
    { label: 'Custom', notes: ['B', 'E', 'A', 'D', 'G'], id: 'custom' },
  ],
  6: [
    { label: 'E Standard', notes: ['E', 'A', 'D', 'G', 'B', 'E'], id: 'e-standard' },
    { label: 'D# Standard', notes: ['D#', 'G#', 'C#', 'F#', 'A#', 'D#'], id: 'dsharp-standard' },
    { label: 'D Standard', notes: ['D', 'G', 'C', 'F', 'A', 'D'], id: 'd-standard' },
    { label: 'Drop D', notes: ['D', 'A', 'D', 'G', 'B', 'E'], id: 'drop-d' },
    { label: 'Drop C#', notes: ['C#', 'G#', 'C#', 'F#', 'A#', 'D#'], id: 'drop-csharp' },
    { label: 'Drop C', notes: ['C', 'G', 'C', 'F', 'A', 'D'], id: 'drop-c' },
    { label: 'DADGAD', notes: ['D', 'A', 'D', 'G', 'A', 'D'], id: 'dadgad' },
    { label: 'Baritone', notes: ['B', 'E', 'A', 'D', 'F#', 'B'], id: 'baritone' },
    { label: 'Custom', notes: E_STANDARD_NOTES, id: 'custom' },
  ],
  7: [
    { label: 'B Standard', notes: ['B', 'E', 'A', 'D', 'G', 'B', 'E'], id: 'b-standard' },
    { label: 'A# Standard', notes: ['A#', 'D#', 'G#', 'C#', 'F#', 'A#', 'D#'], id: 'asharp-standard' },
    { label: 'A Standard', notes: ['A', 'D', 'G', 'C', 'F', 'A', 'D'], id: 'a-standard' },
    { label: 'Drop A', notes: ['A', 'E', 'A', 'D', 'G', 'B', 'E'], id: 'drop-a' },
    { label: 'Drop G#', notes: ['G#', 'D#', 'G#', 'C#', 'F#', 'A#', 'D#'], id: 'drop-gsharp' },
    { label: 'Drop G', notes: ['G', 'D', 'G', 'C', 'F', 'A', 'D'], id: 'drop-g' },
    { label: 'Custom', notes: ['B', 'E', 'A', 'D', 'G', 'B', 'E'], id: 'custom' },
  ],
  8: [
    { label: 'Eight-String Standard', notes: ['F#', 'B', 'E', 'A', 'D', 'G', 'B', 'E'], id: '8-standard' },
    { label: 'F Standard (8)', notes: ['F', 'A#', 'D#', 'G#', 'C#', 'F#', 'A#', 'D#'], id: 'f-standard-8' },
    { label: 'E Standard (8)', notes: ['E', 'A', 'D', 'G', 'C', 'F', 'A', 'D'], id: 'e-standard-8' },
    { label: 'Drop E (8)', notes: ['E', 'B', 'E', 'A', 'D', 'G', 'B', 'E'], id: 'drop-e-8' },
    { label: 'Drop D# (8)', notes: ['D#', 'A#', 'D#', 'G#', 'C#', 'F#', 'A#', 'D#'], id: 'drop-dsharp-8' },
    { label: 'Drop D (8)', notes: ['D', 'A', 'D', 'G', 'C', 'F', 'A', 'D'], id: 'drop-d-8' },
    { label: 'Custom', notes: ['F#', 'B', 'E', 'A', 'D', 'G', 'B', 'E'], id: 'custom' },
  ],
  9: [
    { label: 'Nine-String Standard', notes: ['C#', 'F#', 'B', 'E', 'A', 'D', 'G', 'B', 'E'], id: '9-standard' },
    { label: 'C Standard (9)', notes: ['C', 'F', 'A#', 'D#', 'G#', 'C#', 'F#', 'A#', 'D#'], id: 'c-standard-9' },
    { label: 'B Standard (9)', notes: ['B', 'E', 'A', 'D', 'G', 'C', 'F', 'A', 'D'], id: 'b-standard-9' },
    { label: 'Drop B (9)', notes: ['B', 'F#', 'B', 'E', 'A', 'D', 'G', 'B', 'E'], id: 'drop-b-9' },
    { label: 'Drop A# (9)', notes: ['A#', 'F', 'A#', 'D#', 'G#', 'C#', 'F#', 'A#', 'D#'], id: 'drop-asharp-9' },
    { label: 'Drop A (9)', notes: ['A', 'E', 'A', 'D', 'G', 'C', 'F', 'A', 'D'], id: 'drop-a-9' },
    { label: 'Custom', notes: ['C#', 'F#', 'B', 'E', 'A', 'D', 'G', 'B', 'E'], id: 'custom' },
  ],
}

export const CUSTOM_ID = 'custom'

/** Default tuning preset for a given string count (first non-custom, or custom fallback). */
export function defaultTuningForCount(count: number): string[] {
  const presets = TUNING_PRESETS[count] ?? TUNING_PRESETS[6]
  const nonCustom = presets.find((p) => p.id !== CUSTOM_ID)
  return nonCustom ? nonCustom.notes : presets[0].notes
}

/**
 * Build custom notes for an arbitrary string count based on E Standard:
 * the natural extension is low-to-high around the 6-string E Standard layout.
 */
export function defaultCustomNotes(count: number): string[] {
  if (count === 6) return E_STANDARD_NOTES
  const notes = defaultTuningForCount(count)
  return notes.slice(0, count)
}

/** Find the preset (or 'custom') for a set of notes at a given string count. */
export function findPresetId(notes: string[]): string {
  const count = notes.length
  const presets = TUNING_PRESETS[count] ?? []
  const match = presets.find((p) => p.id !== CUSTOM_ID && sameNotes(p.notes, notes))
  return match ? match.id : CUSTOM_ID
}

function sameNotes(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false
  return true
}

/** Whether a preset with the ID exists for the count. */
export function presetExists(count: number, id: string): boolean {
  return (TUNING_PRESETS[count] ?? []).some((p) => p.id === id)
}

export { transpose }
