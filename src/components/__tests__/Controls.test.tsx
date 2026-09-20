import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Controls, { type ControlsProps, type TuningState } from '../Controls'
import { MODES } from '../../lib/scales'

const props = (overrides: Partial<ControlsProps> = {}): ControlsProps => ({
  strings: 6,
  tuning: { id: 'e-standard', notes: ['E', 'A', 'D', 'G', 'B', 'E'] },
  keyNote: 'C',
  mode: MODES[0],
  view: 'scale',
  onStringsChange: vi.fn(),
  onTuningChange: vi.fn(),
  onKeyChange: vi.fn(),
  onModeChange: vi.fn(),
  onViewChange: vi.fn(),
  ...overrides,
})

describe('Controls', () => {
  it('lists string counts 4 through 9', () => {
    render(<Controls {...props()} />)
    const select = screen.getByLabelText('Strings')
    const options = Array.from(select.querySelectorAll('option')).map((o) => Number(o.value))
    expect(options).toEqual([4, 5, 6, 7, 8, 9])
  })

  it('shows 6-string presets by default and Custom last', () => {
    render(<Controls {...props()} />)
    const select = screen.getByLabelText('Tuning')
    const labels = Array.from(select.querySelectorAll('option')).map((o) => o.textContent)
    expect(labels).toContain('E Standard')
    expect(labels).toContain('Drop D')
    expect(labels).toContain('DADGAD')
    expect(labels.at(-1)).toBe('Custom')
  })

  it('shows 4-string bass presets when 4 strings selected', () => {
    render(
      <Controls {...props({ strings: 4, tuning: { id: 'bass-4', notes: ['E', 'A', 'D', 'G'] } })} />,
    )
    const select = screen.getByLabelText('Tuning')
    const labels = Array.from(select.querySelectorAll('option')).map((o) => o.textContent)
    expect(labels).toContain('Four-String Bass')
    expect(labels).toContain('Drop D (4)')
    expect(labels).not.toContain('E Standard')
    expect(labels.at(-1)).toBe('Custom')
  })

  it('shows 7-string presets when 7 strings selected', () => {
    render(<Controls {...props({ strings: 7, tuning: { id: 'b-standard', notes: ['B','E','A','D','G','B','E'] } })} />)
    const select = screen.getByLabelText('Tuning')
    const labels = Array.from(select.querySelectorAll('option')).map((o) => o.textContent)
    expect(labels).toContain('B Standard')
    expect(labels).toContain('Drop A')
    expect(labels).not.toContain('E Standard')
    expect(labels.at(-1)).toBe('Custom')
  })

  it('renders per-string dropdowns when custom tuning, defaulting to E Standard', () => {
    const custom: TuningState = { id: 'custom', notes: ['E', 'A', 'D', 'G', 'B', 'E'] }
    render(<Controls {...props({ tuning: custom })} />)
    const selects = screen.getAllByLabelText(/^\d+$/)
    expect(selects).toHaveLength(6)
    expect((selects[0] as HTMLSelectElement).value).toBe('E')
    expect((selects[5] as HTMLSelectElement).value).toBe('E')
  })

  it('calls onStringsChange when changing string count', () => {
    const onStringsChange = vi.fn()
    render(<Controls {...props({ onStringsChange })} />)
    fireEvent.change(screen.getByLabelText('Strings'), { target: { value: '7' } })
    expect(onStringsChange).toHaveBeenCalledWith(7)
  })

  it('calls onTuningChange when a preset is chosen', () => {
    const onTuningChange = vi.fn()
    render(<Controls {...props({ onTuningChange })} />)
    fireEvent.change(screen.getByLabelText('Tuning'), { target: { value: 'dadgad' } })
    expect(onTuningChange).toHaveBeenCalledWith({ id: 'dadgad', notes: ['D', 'A', 'D', 'G', 'A', 'D'] })
  })

  it('updates the custom to a changed note value', () => {
    const onTuningChange = vi.fn()
    render(<Controls {...props({ onTuningChange, tuning: { id: 'custom', notes: ['E', 'A', 'D', 'G', 'B', 'E'] } })} />)
    const first = screen.getAllByLabelText(/^\d+$/)[0]
    fireEvent.change(first, { target: { value: 'F#' } })
    expect(onTuningChange).toHaveBeenCalledWith({
      id: 'custom',
      notes: ['F#', 'A', 'D', 'G', 'B', 'E'],
    })
  })

  it('switches the view', () => {
    const onViewChange = vi.fn()
    render(<Controls {...props({ onViewChange })} />)
    fireEvent.change(screen.getByLabelText('View'), { target: { value: 'caged' } })
    expect(onViewChange).toHaveBeenCalledWith('caged')
  })
})
