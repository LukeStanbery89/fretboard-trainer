import { CHROMATIC } from '../lib/notes'
import {
  TUNING_PRESETS,
  CUSTOM_ID,
  type TuningPreset,
} from '../lib/tunings'
import { MODES, SCALE_ROOTS, type Mode } from '../lib/scales'

export type ViewMode = 'scale' | 'caged'

export interface TuningState {
  /** Preset id, or CUSTOM_ID */
  id: string
  /** Note names low -> high string. */
  notes: string[]
}

export interface ControlsProps {
  strings: number
  tuning: TuningState
  keyNote: string
  mode: Mode
  view: ViewMode
  onStringsChange: (n: number) => void
  onTuningChange: (t: TuningState) => void
  onKeyChange: (k: string) => void
  onModeChange: (m: Mode) => void
  onViewChange: (v: ViewMode) => void
}

export default function Controls({
  strings,
  tuning,
  keyNote,
  mode,
  view,
  onStringsChange,
  onTuningChange,
  onKeyChange,
  onModeChange,
  onViewChange,
}: ControlsProps) {
  const presets: TuningPreset[] = TUNING_PRESETS[strings] ?? TUNING_PRESETS[6]
  const isCustom = tuning.id === CUSTOM_ID

  return (
    <div className="controls">
      <label className="field">
        <span>View</span>
        <select value={view} onChange={(e) => onViewChange(e.target.value as ViewMode)}>
          <option value="scale">Scale</option>
          <option value="caged">CAGED</option>
        </select>
      </label>

      <label className="field">
        <span>Strings</span>
        <select
          value={strings}
          onChange={(e) => onStringsChange(Number(e.target.value))}
        >
          {[4, 5, 6, 7, 8, 9].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Tuning</span>
        <select
          value={tuning.id}
          onChange={(e) => {
            const id = e.target.value
            const preset = presets.find((p) => p.id === id)
            if (preset) onTuningChange({ id: preset.id, notes: [...preset.notes] })
          }}
        >
          {presets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </label>

      {isCustom && (
        <div className="custom-tuning">
          {tuning.notes.map((note, i) => (
            <label key={i} className="field custom-string">
              <span>{i + 1}</span>
              <select
                value={note}
                onChange={(e) => {
                  const notes = [...tuning.notes]
                  notes[i] = e.target.value
                  onTuningChange({ id: CUSTOM_ID, notes })
                }}
              >
                {CHROMATIC.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      )}

      <label className="field">
        <span>Key</span>
        <select value={keyNote} onChange={(e) => onKeyChange(e.target.value)}>
          {SCALE_ROOTS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>

      {view !== 'caged' && (
        <label className="field">
          <span>Mode</span>
          <select
            value={mode.name}
            onChange={(e) => {
              const m = MODES.find((x) => x.name === e.target.value)
              if (m) onModeChange(m)
            }}
          >
            {MODES.map((m) => (
              <option key={m.name} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  )
}
