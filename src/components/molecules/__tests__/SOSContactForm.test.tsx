import { render, screen, fireEvent } from '@testing-library/react'
import { SOSContactForm } from '../SOSContactForm'
import type { SOSContact } from '../../../objects/sosContact'
import { mockTheme } from '../../../test-utils/mockTheme'

vi.mock('@mui/material/styles', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@mui/material/styles')>()
  return { ...actual, useTheme: () => mockTheme }
})

// Stub atoms so we control rendering
vi.mock('../../atoms/FormInput', () => ({
  FormInput: ({ label, value, onChange, placeholder }: {
    label: string; value: string
    onChange?: (v: string) => void; placeholder?: string
  }) => (
    <div>
      <label htmlFor={label}>{label}</label>
      <input id={label} value={value} placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)} data-testid={`input-${label}`} />
    </div>
  ),
}))
vi.mock('../../atoms/FormSelect', () => ({
  FormSelect: ({ label, value, onChange, options }: {
    label: string; value: string
    onChange?: (e: { target: { value: string } }) => void; options: string[]
  }) => (
    <div>
      <label htmlFor={label}>{label}</label>
      <select id={label} value={value} data-testid={`select-${label}`}
        onChange={(e) => onChange?.(e)}>
        <option value="">Seleccione</option>
        {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  ),
}))

const mockContact: SOSContact = {
  id: 'c-1', name: 'María', last_name: 'García',
  phone_number: '3001234567', phone_indicative: '+57',
  location: 'Bogotá', relationship: 'Madre', user_id: 'user-123',
}

describe('SOSContactForm', () => {
  const onSave = vi.fn()
  const onCancel = vi.fn()
  afterEach(() => vi.clearAllMocks())

  it('renders empty fields in create mode', () => {
    render(<SOSContactForm onSave={onSave} onCancel={onCancel} />)
    expect(screen.getByTestId('input-Nombre')).toHaveValue('')
    expect(screen.getByText('Guardar')).toBeInTheDocument()
  })

  it('pre-fills fields in edit mode', () => {
    render(<SOSContactForm contact={mockContact} onSave={onSave} onCancel={onCancel} />)
    expect(screen.getByTestId('input-Nombre')).toHaveValue('María')
    expect(screen.getByTestId('input-Apellido')).toHaveValue('García')
    expect(screen.getByTestId('input-Teléfono')).toHaveValue('3001234567')
    expect(screen.getByText('Actualizar')).toBeInTheDocument()
  })

  it('calls onSave with updated contact data when editing', () => {
    render(<SOSContactForm contact={mockContact} onSave={onSave} onCancel={onCancel} />)
    fireEvent.change(screen.getByTestId('input-Nombre'), { target: { value: 'Ana' } })
    fireEvent.submit(screen.getByTestId('input-Nombre').closest('form')!)
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ id: 'c-1', name: 'Ana' }))
  })

  it('calls onSave without id in create mode', () => {
    render(<SOSContactForm onSave={onSave} onCancel={onCancel} />)
    fireEvent.change(screen.getByTestId('input-Nombre'), { target: { value: 'Carlos' } })
    fireEvent.submit(screen.getByTestId('input-Nombre').closest('form')!)
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ name: 'Carlos' }))
    expect(onSave).not.toHaveBeenCalledWith(expect.objectContaining({ id: expect.anything() }))
  })

  it('calls onCancel when cancel button is clicked', () => {
    render(<SOSContactForm onSave={onSave} onCancel={onCancel} />)
    fireEvent.click(screen.getByText('Cancelar'))
    expect(onCancel).toHaveBeenCalled()
  })
})
