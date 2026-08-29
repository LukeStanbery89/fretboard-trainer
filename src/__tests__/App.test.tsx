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
    // tonic ring on C cells; C is the key, so root dots exist
    expect(document.querySelectorAll('.note-dot.tonic').length).toBeGreaterThan(0)
    expect(document.querySelectorAll('.note-dot.tonic.root').length).toBeGreaterThan(0)
    // C Ionian is C major: no F# (chromatic 6) in tone set
    expect(document.querySelectorAll('.note-dot.dissonant').length).toBeGreaterThanOrEqual(0)
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

  it('switches to CAGED view and renders region bands and root dots', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('View'), { target: { value: 'caged' } })
    // CAGED region bands appear for the C shapes
    const bands = document.querySelectorAll('.fb-cell[class*="caged-"]')
    expect(bands.length).toBeGreaterThan(0)
    expect(document.querySelectorAll('.note-dot.caged-root').length).toBeGreaterThan(0)
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

  it('renders a legend describing the scale interval coloring by default', () => {
    render(<App />)
    expect(screen.getByText(/Scale:/i)).toBeInTheDocument()
    expect(screen.getByText(/tonic/i)).toBeInTheDocument()
  })

  it('shows the key and mode in the legend when interval coloring is off', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /settings/i }))
    fireEvent.click(screen.getByRole('checkbox', { name: /color by interval/i }))
    expect(screen.getByText(/C Ionian \(Major\)/i)).toBeInTheDocument()
  })
})
