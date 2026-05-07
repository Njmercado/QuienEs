import { render, screen, fireEvent } from '@testing-library/react'
import { EngravingForm } from '../EngravingForm'
import { INITIAL_ENGRAVING } from '../../../objects/engraving'
import { mockTheme } from '../../../test-utils/mockTheme'

vi.mock('@mui/material/styles', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@mui/material/styles')>()
  return { ...actual, useTheme: () => mockTheme }
})

vi.mock('../../atoms/FormInput', () => ({
  FormInput: ({ placeholder, value, onChange }: {
    placeholder?: string; value: string; onChange?: (v: string) => void
  }) => (
    <input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      data-testid={`input-${placeholder}`}
    />
  ),
}))

vi.mock('../../atoms/FormSelect', () => ({
  FormSelect: ({ placeholder, value, onChange, options }: {
    placeholder?: string; value: string
    onChange?: (e: { target: { value: string } }) => void; options: any[]
  }) => (
    <select
      data-testid={`select-${placeholder}`}
      value={value}
      onChange={(e) => onChange?.(e)}
    >
      <option value="">—</option>
      {options.map((o: any) => {
        const v = typeof o === 'string' ? o : o.value
        const l = typeof o === 'string' ? o : o.label
        return <option key={v} value={v}>{l}</option>
      })}
    </select>
  ),
}))

describe('EngravingForm', () => {
  const onChange = vi.fn()
  afterEach(() => vi.clearAllMocks())

  it('renders all engraving input fields', () => {
    render(<EngravingForm data={INITIAL_ENGRAVING} onChange={onChange} />)
    expect(screen.getByTestId('input-Número de identificación')).toBeInTheDocument()
    expect(screen.getByTestId('input-Condición médica')).toBeInTheDocument()
    expect(screen.getByTestId('input-Número de teléfono')).toBeInTheDocument()
    expect(screen.getByTestId('select-Tipo de sangre')).toBeInTheDocument()
    expect(screen.getByTestId('select-Parentesco')).toBeInTheDocument()
  })

  it('calls onChange with idNumber field when ID input changes', () => {
    render(<EngravingForm data={INITIAL_ENGRAVING} onChange={onChange} />)
    fireEvent.change(screen.getByTestId('input-Número de identificación'), {
      target: { value: '12345678' },
    })
    // stub calls onChange(value) only, so error=undefined propagates
    expect(onChange).toHaveBeenCalledWith('idNumber', '12345678', undefined)
  })

  it('calls onChange with condition field when condition input changes', () => {
    render(<EngravingForm data={INITIAL_ENGRAVING} onChange={onChange} />)
    fireEvent.change(screen.getByTestId('input-Condición médica'), {
      target: { value: 'Diabetes' },
    })
    expect(onChange).toHaveBeenCalledWith('condition', 'Diabetes', undefined)
  })

  it('calls onChange with rh field when blood type is selected', () => {
    render(<EngravingForm data={INITIAL_ENGRAVING} onChange={onChange} />)
    fireEvent.change(screen.getByTestId('select-Tipo de sangre'), {
      target: { value: 'O+' },
    })
    // rh select calls handle('rh')(value) — no error param, so third arg is undefined
    expect(onChange).toHaveBeenCalledWith('rh', 'O+', undefined)
  })
})
