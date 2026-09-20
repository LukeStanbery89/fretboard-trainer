import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'

beforeEach(() => {
  localStorage.clear()
})

describe('App integration', () => {
  it('renders a 6-string E Standard board by default', () => {
    const { container } = render(<App />)
    // 6 strings → 6 rows of 25 cells + 25 marker cells
    expect(container.querySelectorAll('.fb-cell').length).toBe(175)
    expect(container.querySelectorAll('.note-dot').length).toBeGreaterThan(0)
  })

  it('shows scale dots for the default C Ionian', () => {
    render(<App />)
    // each scale degree gets its own class; tonic gets the root ring
    for (const d of ['degree-1', 'degree-2', 'degree-3', 'degree-4', 'degree-5', 'degree-6', 'degree-7']) {
      expect(document.querySelectorAll(`.note-dot.${d}`).length).toBeGreaterThan(0)
    }
    expect(document.querySelectorAll('.note-dot.degree-1.root').length).toBeGreaterThan(0)
  })

  it('recolours notes to follow the selected key (G major raises G to tonic)', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Key'), { target: { value: 'G' } })
    // every tonic-coloured dot is a G, and no C is ever coloured as tonic
    const tonicLabels = Array.from(document.querySelectorAll('.note-dot.degree-1 .dot-label')).map(
      (el) => el.textContent,
    )
    expect(tonicLabels.length).toBeGreaterThan(0)
    expect(tonicLabels.every((l) => l === 'G')).toBe(true)
    expect(tonicLabels.includes('C')).toBe(false)
    expect(document.querySelectorAll('.note-dot.degree-1.root').length).toBeGreaterThan(0)
  })

  it('switches string count and updates tuning options', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Strings'), { target: { value: '7' } })
    const tuning = screen.getByLabelText('Tuning')
    const labels = Array.from(tuning.querySelectorAll('option')).map((o) => o.textContent)
    expect(labels).toContain('B Standard')
    expect(labels).toContain('Drop A')
  })

  it('reveals custom per-string dropdowns for E Standard default notes', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Tuning'), { target: { value: 'custom' } })
    const selects = screen.getAllByLabelText(/^\d+$/)
    expect(selects.length).toBe(6)
    expect((selects[0] as HTMLSelectElement).value).toBe('E')
  })

  it('switches to CAGED view and colors the barre-fret columns', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('View'), { target: { value: 'caged' } })
    // Colored columns exist (some body cells get an inline background).
    const colored = Array.from(document.querySelectorAll('.fb-cell')).filter(
      (el) => (el as HTMLElement).style.background !== '',
    )
    expect(colored.length).toBeGreaterThan(0)
    // No chord-tone dots are shown in CAGED view.
    expect(document.querySelectorAll('.note-dot').length).toBe(0)
  })

  it('renders the CAGED letters below the fretboard, grouped by barre fret (key C)', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('View'), { target: { value: 'caged' } })
    const labels = Array.from(document.querySelectorAll('.fret-label')).map((el) =>
      Array.from(el.querySelectorAll('.fret-label-letter')).map((l) => l.textContent),
    )
    // C at open (nut), A at 3, G at 5, E at 8, D at 10 (for key C).
    expect(labels).toContainEqual(['C'])
    expect(labels).toContainEqual(['A'])
    expect(labels).toContainEqual(['G'])
    expect(labels).toContainEqual(['E'])
    expect(labels).toContainEqual(['D'])
  })

  it('hides the Mode dropdown in CAGED view and restores it in Scale view', () => {
    render(<App />)
    expect(screen.getByLabelText('Mode')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Mode'), { target: { value: 'Dorian' } })
    fireEvent.change(screen.getByLabelText('View'), { target: { value: 'caged' } })
    expect(screen.queryByLabelText('Mode')).toBeNull()
    fireEvent.change(screen.getByLabelText('View'), { target: { value: 'scale' } })
    expect((screen.getByLabelText('Mode') as HTMLSelectElement).value).toBe('Dorian')
  })

  it('persists settings to localStorage after interaction', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Strings'), { target: { value: '5' } })
    const stored = JSON.parse(localStorage.getItem('fretboard-trainer-state')!)
    expect(stored.strings).toBe(5)
  })

  it('reset button restores defaults', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Strings'), { target: { value: '8' } })
    fireEvent.click(screen.getByRole('button', { name: /settings/i }))
    fireEvent.click(screen.getByRole('button', { name: /reset to defaults/i }))
    // back to 6 strings
    expect((screen.getByLabelText('Strings') as HTMLSelectElement).value).toBe('6')
  })

  it('renders a legend describing the scale degree coloring by default', () => {
    render(<App />)
    expect(screen.getByText(/Scale in/i)).toBeInTheDocument()
    expect(document.querySelectorAll('.keydot.degree-1').length).toBe(1)
    expect(document.querySelectorAll('.keydot.degree-7').length).toBe(1)
  })

  it('shows the key and mode in the legend when interval coloring is off', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /settings/i }))
    fireEvent.click(screen.getByRole('checkbox', { name: /color by interval/i }))
    expect(screen.getByText(/C Ionian \(Major\)/i)).toBeInTheDocument()
  })
})
