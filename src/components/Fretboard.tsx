import { transpose } from '../lib/notes'
import { inlayDots, fretNumbers } from '../lib/fretboard'
import type { CSSProperties } from 'react'

export interface FretDot {
  className: string
  label?: string
  isRoot?: boolean
}

export interface FretCell {
  /** 0 = open string (nut), 1+ = fret. */
  fret: number
  /** Index into tuning, 0 = lowest string. */
  stringIndex: number
  note: string
  /** Highlight dots positioned on this cell (0, 1, or more for shared notes). */
  dots: FretDot[]
  /** Optional CSS background override (e.g. a CAGED barre-color column). */
  backgroundColor?: string
}

export interface FretLabel {
  /** Fret column (0 = open/nut column). */
  fret: number
  /** Shape letter(s) to show, in order (e.g. ['C','A'] for a shared barre fret). */
  shapes: string[]
}

export interface FretboardProps {
  tuning: string[]
  numFrets: number
  showNoteNames: boolean
  /** Fill cells with scale note dots (mutates the cells array in place). */
  annotate: (cells: FretCell[][]) => void
  /** Optional letters rendered in a row below the fretboard, aligned to frets. */
  fretLabels?: FretLabel[]
  onCellClick?: (cell: FretCell) => void
}

export default function Fretboard({
  tuning,
  numFrets,
  showNoteNames,
  annotate,
  fretLabels,
  onCellClick,
}: FretboardProps) {
  const frets = fretNumbers(numFrets)
  const numCols = numFrets + 1 // +1 for the nut/open column

  // Frets narrow as they ascend: each fret scales by the equal-temperament
  // semitone ratio, mirroring physical string division. Using fr units lets the
  // rows fill the full board width while keeping the progressive taper, with a
  // minmax floor so high frets stay legible.
  const colTemplates = [
    'minmax(30px, 40px)',
    ...frets.map((f) => `minmax(28px, ${(1 / Math.pow(2, f / 12)).toFixed(4)}fr)`),
  ]

  const cells: FretCell[][] = tuning.map((open, si) => [
    { fret: 0, stringIndex: si, note: open, dots: [] },
    ...frets.map((f) => ({ fret: f, stringIndex: si, note: transpose(open, f), dots: [] })),
  ])

  annotate(cells)

  const gridStyle = {
    '--num-frets': numFrets,
    '--num-strings': tuning.length,
    '--num-cols': numCols,
  } as CSSProperties

  // The fret-marker row (inlay dots) sits below all the strings.
  const markerRow = tuning.length + 1

  return (
    <div className="fretboard" style={gridStyle}>
      <div className="fb-grid" style={{ gridTemplateColumns: colTemplates.join(' ') }}>
        {/* body rows: each string is a grid row, lowest string at the bottom */}
        {[...cells].reverse().map((row, si) =>
          row.map((cell) => {
            const isNut = cell.fret === 0
            return (
              <div
                key={`${si}-${cell.fret}`}
                className={[
                  'fb-cell',
                  isNut ? 'nut-cell' : '',
                  cell.fret % 2 === 0 && cell.fret !== 0 ? 'even-fret' : '',
                ].join(' ')}
                style={{
                  gridRow: si + 1,
                  gridColumn: cell.fret + 1,
                  ...(cell.backgroundColor ? { background: cell.backgroundColor } : {}),
                }}
                onClick={onCellClick ? () => onCellClick(cell) : undefined}
              >
                {isNut && <div className="nut" />}
                {cell.dots.map((dot, di) => (
                  <div
                    key={di}
                    className={`note-dot ${dot.className} ${dot.isRoot ? 'root' : ''} ${
                      cell.dots.length > 1 ? 'stacked' : ''
                    }`}
                  >
                    {(dot.label ?? (showNoteNames ? cell.note : null)) && (
                      <span className="dot-label">
                        {dot.label ?? cell.note}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )
          }),
        )}

        {/* fret-marker row (inlay dots like a real guitar) at the bottom */}
        <div className="fb-cell fb-marker nut-marker" style={{ gridRow: markerRow, gridColumn: 1 }} />
        {frets.map((f) => {
          const inlays = inlayDots(f)
          return (
            <div
              key={`m${f}`}
              className="fb-cell fb-marker"
              style={{ gridRow: markerRow, gridColumn: f + 1 }}
            >
              {inlays === 2 && (
                <div className="inlay-dots inlay-marker inlay-2">
                  <i className="inlay-dot" />
                  <i className="inlay-dot" />
                </div>
              )}
              {inlays === 1 && (
                <div className="inlay-dots inlay-marker inlay-1">
                  <i className="inlay-dot" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {fretLabels && fretLabels.length > 0 && (
        <div className="fretboard-labels" style={{ gridTemplateColumns: colTemplates.join(' ') }}>
          {fretLabels.map((label) => (
            <div
              key={`l${label.fret}-${label.shapes.join('')}`}
              className="fret-label"
              style={{ gridColumn: label.fret + 1 }}
            >
              {label.shapes.map((shape) => (
                <span key={shape} className={`fret-label-letter caged-${shape.toLowerCase()}`}>
                  {shape}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
