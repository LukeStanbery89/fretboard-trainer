import { useState, useEffect } from 'react'
import Fretboard, { type FretCell } from './components/Fretboard'
import Controls, { type ViewMode, type TuningState } from './components/Controls'
import SettingsPanel from './components/SettingsPanel'
import { scaleTones, intervalClassName } from './lib/scales'
import { cagedRegions } from './lib/caged'
import { chromaticIndex } from './lib/notes'
import { TUNING_PRESETS, defaultTuningForCount, CUSTOM_ID } from './lib/tunings'
import {
  loadState,
  saveState,
  clearState,
  modeFromName,
  DEFAULT_STATE,
  type AppState,
  type Settings,
} from './lib/storage'
import './App.css'

function App() {
  const [initial] = useState<AppState>(() => loadState())
  const [strings, setStrings] = useState(initial.strings)
  const [tuning, setTuning] = useState<TuningState>({
    id: initial.tuningId,
    notes: initial.tuningNotes,
  })
  const [keyNote, setKeyNote] = useState(initial.key)
  const [modeName, setModeName] = useState(initial.modeName)
  const [view, setView] = useState<ViewMode>(initial.view)
  const [settings, setSettings] = useState<Settings>(initial.settings)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const mode = modeFromName(modeName)

  useEffect(() => {
    saveState({
      strings,
      tuningId: tuning.id,
      tuningNotes: tuning.notes,
      key: keyNote,
      modeName,
      view,
      settings,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strings, tuning, keyNote, modeName, view, settings])

  const handleStringsChange = (n: number) => {
    setStrings(n)
    // If current preset no longer exists for the new count, default to a preset.
    const presets = TUNING_PRESETS[n] ?? []
    const exists = presets.some((p) => p.id === tuning.id)
    if (exists && tuning.id !== CUSTOM_ID) {
      // keep current preset id+notes; they should already match count
      return
    }
    const defaultNotes = defaultTuningForCount(n)
    const fallbackId = (TUNING_PRESETS[n] ?? []).find(
      (p) => p.notes.join(',') === defaultNotes.join(','),
    )?.id
    setTuning({ id: fallbackId ?? CUSTOM_ID, notes: defaultNotes })
  }

  const handleTuningChange = (t: TuningState) => setTuning(t)

  const handleReset = () => {
    clearState()
    setStrings(DEFAULT_STATE.strings)
    setTuning({ id: DEFAULT_STATE.tuningId, notes: [...DEFAULT_STATE.tuningNotes] })
    setKeyNote(DEFAULT_STATE.key)
    setModeName(DEFAULT_STATE.modeName)
    setView(DEFAULT_STATE.view)
    setSettings(DEFAULT_STATE.settings)
    setSettingsOpen(false)
  }

  const annotateScale = (cells: FretCell[][]) => {
    const tones = scaleTones(keyNote, mode)
    for (const row of cells) {
      for (const cell of row) {
        const ic = chromaticIndex(cell.note)
        if (tones.has(ic)) {
          const cls = settings.colorByInterval ? intervalClassName(ic) : 'single'
          cell.dotClassName = cls
        }
        if (ic === 0) cell.isRootDot = true
      }
    }
  }

  const annotateCaged = (cells: FretCell[][]) => {
    const regions = cagedRegions(keyNote, settings.numFrets)
    for (const region of regions) {
      const shapeClass = `caged-${region.shape.toLowerCase()}`
      for (const row of cells) {
        for (const cell of row) {
          if (cell.fret >= region.start && cell.fret <= region.end) {
            cell.cellClassName = shapeClass
            if (cell.fret === region.rootFret) {
              cell.dotClassName = 'caged-root'
              cell.dotLabel = region.shape
            }
          }
        }
      }
    }
  }

  const annotate = (cells: FretCell[][]) => {
    if (view === 'caged') annotateCaged(cells)
    else annotateScale(cells)
  }

  return (
    <div className="app" data-theme={settings.theme}>
      <header className="app-header">
        <h1>Fretboard Trainer</h1>
        <SettingsPanel
          settings={settings}
          onSettingsChange={setSettings}
          onReset={handleReset}
          open={settingsOpen}
          onToggleOpen={() => setSettingsOpen((o) => !o)}
        />
      </header>

      <Controls
        strings={strings}
        tuning={tuning}
        keyNote={keyNote}
        mode={mode}
        view={view}
        onStringsChange={handleStringsChange}
        onTuningChange={handleTuningChange}
        onKeyChange={setKeyNote}
        onModeChange={(m) => setModeName(m.name)}
        onViewChange={setView}
      />

      <div className="board-wrap">
        <div className="tuning-rails">
          {[...tuning.notes].reverse().map((n, i) => (
            <span key={i} className="rail-label">
              {n}
            </span>
          ))}
        </div>
        <Fretboard
          tuning={tuning.notes}
          numFrets={settings.numFrets}
          showNoteNames={settings.showNoteNames}
          annotate={annotate}
        />
      </div>

      <p className="legend">
        {view === 'scale' ? (
          settings.colorByInterval ? (
            <>Scale: <KeyDot c="tonic" /> tonic <KeyDot c="third" /> 3rd <KeyDot c="fifth" /> 5th <KeyDot c="seventh" /> 7th <KeyDot c="dissonant" /> other</>
          ) : (
            <>Showing <b>{keyNote} {modeName}</b> scale notes</>
          )
        ) : (
          <>CAGED shapes for <b>{keyNote} {modeName}</b></>
        )}
      </p>
    </div>
  )
}

function KeyDot({ c }: { c: string }) {
  return <span className={`keydot ${c}`} />
}

export default App
