import type { Settings } from '../lib/storage'

export interface SettingsPanelProps {
  settings: Settings
  onSettingsChange: (s: Settings) => void
  onReset: () => void
  open: boolean
  onToggleOpen: () => void
}

export default function SettingsPanel({
  settings,
  onSettingsChange,
  onReset,
  open,
  onToggleOpen,
}: SettingsPanelProps) {
  const set = (patch: Partial<Settings>) => onSettingsChange({ ...settings, ...patch })

  return (
    <div className="settings">
      <button className="settings-toggle" onClick={onToggleOpen}>
        ⚙ Settings
      </button>
      {open && (
        <div className="settings-panel">
          <label className="field">
            <span>Number of frets</span>
            <select value={settings.numFrets} onChange={(e) => set({ numFrets: Number(e.target.value) })}>
              <option value={22}>22</option>
              <option value={24}>24</option>
            </select>
          </label>

          <label className="field">
            <span>Appearance</span>
            <select
              value={settings.theme}
              onChange={(e) => set({ theme: e.target.value as 'dark' | 'light' })}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </label>

          <label className="field checkbox">
            <input
              type="checkbox"
              checked={settings.showNoteNames}
              onChange={(e) => set({ showNoteNames: e.target.checked })}
            />
            <span>Show note names on fretboard</span>
          </label>

          <label className="field checkbox">
            <input
              type="checkbox"
              checked={settings.colorByInterval}
              onChange={(e) => set({ colorByInterval: e.target.checked })}
            />
            <span>Color by interval</span>
          </label>

          <button className="reset-btn" onClick={onReset}>
            Reset to Defaults
          </button>
        </div>
      )}
    </div>
  )
}
