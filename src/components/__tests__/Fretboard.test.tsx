import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Fretboard, { type FretCell } from '../Fretboard'

function noop() {}

describe('Fretboard', () => {
  it('renders one row per string plus a marker row', () => {
    const { container } = render(
      <Fretboard tuning={['E', 'A', 'D', 'G', 'B', 'E']} numFrets={24} showNoteNames={false} annotate={noop} />,
    )
    // 6 strings × 25 cells (nut + 24 frets) = 150, plus 25 marker cells
    expect(container.querySelectorAll('.fb-cell').length).toBe(175)
  })

  it('renders the nut cell and framer marker row', () => {
    const { container } = render(
      <Fretboard tuning={['E', 'A']} numFrets={22} showNoteNames={false} annotate={noop} />,
    )
    expect(container.querySelectorAll('.nut-cell').length).toBe(2)
    expect(container.querySelectorAll('.fb-marker').length).toBe(23) // nut marker + 22 frets
  })

  it('shows double marker dots at 12 and 24', () => {
    const { container } = render(
      <Fretboard tuning={['E', 'A', 'D', 'G', 'B', 'E']} numFrets={24} showNoteNames={false} annotate={noop} />,
    )
    expect(container.querySelectorAll('.fb-marker .inlay-2').length).toBe(2)
    expect(container.querySelectorAll('.fb-marker .inlay-1').length).toBe(8)
  })

  it('renders annotate-provided dots and shows note labels when enabled', () => {
    const annotate = (cells: FretCell[][]) => {
      cells[0][1].dots.push({ className: 'tonic' }) // lowest string, fret 1 (F)
      cells[2][5].dots.push({ className: 'fifth' }) // D string, fret 5
    }
    const { container } = render(
      <Fretboard tuning={['E', 'A', 'D', 'G', 'B', 'E']} numFrets={24} showNoteNames={true} annotate={annotate} />,
    )
    const tonic = container.querySelector('.note-dot.tonic')
    const fifth = container.querySelector('.note-dot.fifth')
    expect(container.querySelectorAll('.note-dot').length).toBe(2)
    expect(tonic).not.toBeNull()
    expect(fifth).not.toBeNull()
    expect(tonic!.querySelector('.dot-label')?.textContent).toBe('F') // E string fret 1
    expect(fifth!.querySelector('.dot-label')?.textContent).toBe('G') // D string fret 5
  })

  it('hides note labels inside dots when showNoteNames is false', () => {
    const annotate = (cells: FretCell[][]) => {
      cells[0][1].dots.push({ className: 'tonic' })
    }
    const { container } = render(
      <Fretboard tuning={['E', 'A', 'D', 'G', 'B', 'E']} numFrets={24} showNoteNames={false} annotate={annotate} />,
    )
    expect(container.querySelector('.note-dot .dot-label')).toBeNull()
  })

  it('shows a explicit dot label when provided regardless of showNoteNames', () => {
    const annotate = (cells: FretCell[][]) => {
      cells[0][1].dots.push({ className: 'caged-c', label: 'C' })
    }
    const { container } = render(
      <Fretboard tuning={['E', 'A', 'D', 'G', 'B', 'E']} numFrets={24} showNoteNames={false} annotate={annotate} />,
    )
    const dot = container.querySelector('.note-dot.caged-c')!
    expect(dot.querySelector('.dot-label')?.textContent).toBe('C')
  })

  it('renders multiple dots on one cell when they share a note position', () => {
    const annotate = (cells: FretCell[][]) => {
      cells[1][3].dots.push({ className: 'caged-c', label: 'C' })
      cells[1][3].dots.push({ className: 'caged-a', label: 'A' })
    }
    const { container } = render(
      <Fretboard tuning={['E', 'A', 'D', 'G', 'B', 'E']} numFrets={24} showNoteNames={false} annotate={annotate} />,
    )
    expect(container.querySelectorAll('.note-dot').length).toBe(2)
    expect(container.querySelectorAll('.note-dot.stacked').length).toBe(2)
  })

  it('puts the lowest string (E) at the bottom row', () => {
    const annotate = (cells: FretCell[][]) => {
      cells[0][1].dots.push({ className: 'tonic' }) // lowest string fret 1
    }
    const { container } = render(
      <Fretboard tuning={['E', 'A', 'D', 'G', 'B', 'E']} numFrets={24} showNoteNames={true} annotate={annotate} />,
    )
    // The dot for the lowest string should be in the row just above the marker row.
    const dot = container.querySelector('.note-dot')!
    const style = (dot.parentElement as HTMLElement).style
    // bottom row = (6 strings + 1 marker) so lowest string row = 6
    expect(style.gridRow).toBe('6')
  })
})
