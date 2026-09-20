import { useState, useEffect } from 'react'
import Fretboard, { type FretCell, type FretLabel } from './components/Fretboard'
import Controls, { type ViewMode, type TuningState } from './components/Controls'
import SettingsPanel from './components/SettingsPanel'
import { scaleTones, degreeIndex } from './lib/scales'
import { cagedBarreFrets } from './lib/caged'
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
    const rootIc = chromaticIndex(keyNote)
    for (const row of cells) {
      for (const cell of row) {
        const ic = chromaticIndex(cell.note)
        if (tones.has(ic)) {
          const rel = (ic - rootIc + 12) % 12
          const degree = settings.colorByInterval ? degreeIndex(mode, rel) : -1
          const cls = degree >= 0 ? `degree-${degree + 1}` : 'single'
          cell.dots.push({ className: cls, isRoot: degree === 0 })
        }
      }
    }
  }

  const annotateCaged = (cells: FretCell[][]) => {
    const barres = cagedBarreFrets(keyNote, settings.numFrets)
    for (const { fret, shapes } of barres) {
      const colors = shapes.map((s) => `var(--caged-${s.toLowerCase()})`)
      const background =
        colors.length === 1
          ? colors[0]
          : `linear-gradient(to right, ${colors
              .map(
                (c, i) =>
                  `${c} ${(100 * i) / colors.length}%, ${c} ${(100 * (i + 1)) / colors.length}%`,
              )
              .join(', ')})`
      for (const row of cells) {
        const cell = row[fret]
        if (cell) cell.backgroundColor = background
      }
    }
  }

  const cagedLabels: FretLabel[] = cagedBarreFrets(keyNote, settings.numFrets).map(
    ({ fret, shapes }) => ({ fret, shapes }),
  )

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
          fretLabels={view === 'caged' ? cagedLabels : undefined}
        />
      </div>

      <p className="legend">
        {view === 'scale' ? (
          settings.colorByInterval ? (
            <>
              Scale in <b>{keyNote} {modeName}</b>:{' '}
              <KeyDot c="degree-1" /> 1
              <KeyDot c="degree-2" /> 2
              <KeyDot c="degree-3" /> 3
              <KeyDot c="degree-4" /> 4
              <KeyDot c="degree-5" /> 5
              <KeyDot c="degree-6" /> 6
              <KeyDot c="degree-7" /> 7
            </>
          ) : (
            <>Showing <b>{keyNote} {modeName}</b> scale notes</>
          )
        ) : (
          <>
            CAGED barre positions for <b>{keyNote}</b>{' '}
            <KeyDot c="caged-c" /> C
            <KeyDot c="caged-a" /> A
            <KeyDot c="caged-g" /> G
            <KeyDot c="caged-e" /> E
            <KeyDot c="caged-d" /> D
          </>
        )}
      </p>

      {view === 'caged' && (
        <div className="caged-explainer">
          <h2>How the CAGED system works</h2>
          <p>
            CAGED maps the neck using the five open chord shapes{' '}
            <span className="caged-letter caged-c">C</span>{' '}
            <span className="caged-letter caged-a">A</span>{' '}
            <span className="caged-letter caged-g">G</span>{' '}
            <span className="caged-letter caged-e">E</span>{' '}
            <span className="caged-letter caged-d">D</span>, each of which turns
            into a movable barre chord. The shapes always follow that same order
            up the neck, so the five positions together cover the current key
            across all 12 frets.
          </p>
          <ul>
            <li>
              <b>Colored with a letter below the fretboard:</b> each column marks
              where that shape's barre sits, color-coded with its letter shown
              underneath.
            </li>
            <li>
              <b>At the nut (fret 0):</b> the shape is the open chord of the key
              (open C for key C, open A for key A, and so on) — no barre needed.
            </li>
            <li>
              <b>C and G shapes:</b> these only barre across the high strings, so
              their barre sits below the full position; the column still marks
              the exact fret to barre.
            </li>
          </ul>
          <p className="last">
            <b>How to use it:</b> pick a key above, then play each CAGED position
            in order up the neck — C&nbsp;→&nbsp;A&nbsp;→&nbsp;G&nbsp;→&nbsp;E&nbsp;→&nbsp;D
            (wrapping around as they rise). Learning to move between the barre
            positions keeps you in the same key from any spot on the fretboard.
          </p>
        </div>
      )}
    </div>
  )
}

function KeyDot({ c }: { c: string }) {
  return <span className={`keydot ${c}`} />
}

export default App
