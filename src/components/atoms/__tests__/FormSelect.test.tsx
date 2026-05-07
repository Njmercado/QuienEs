import { render, screen, fireEvent } from '@testing-library/react'
import { FormSelect } from '../FormSelect'

describe('FormSelect', () => {
  it('renders a label when provided', () => {
    render(<FormSelect label="Tipo de sangre" options={['O+', 'A+']} value="" />)
    expect(screen.getByText('Tipo de sangre')).toBeInTheDocument()
  })

  it('renders all string options', () => {
    render(<FormSelect options={['O+', 'A+', 'B+']} value="" />)
    // Open the select
    fireEvent.mouseDown(screen.getByRole('combobox'))
    expect(screen.getByText('O+')).toBeInTheDocument()
    expect(screen.getByText('A+')).toBeInTheDocument()
    expect(screen.getByText('B+')).toBeInTheDocument()
  })

  it('renders object options with label and value', () => {
    const options = [
      { label: 'Cédula de Ciudadanía', value: 'CC' },
      { label: 'Pasaporte', value: 'PAS' },
    ]
    render(<FormSelect options={options} value="" />)
    fireEvent.mouseDown(screen.getByRole('combobox'))
    expect(screen.getByText('Cédula de Ciudadanía')).toBeInTheDocument()
    expect(screen.getByText('Pasaporte')).toBeInTheDocument()
  })

  it('calls onChange when a new option is selected', () => {
    const onChange = vi.fn()
    render(<FormSelect options={['O+', 'A+']} value="" onChange={onChange} />)
    fireEvent.mouseDown(screen.getByRole('combobox'))
    fireEvent.click(screen.getByText('O+'))
    expect(onChange).toHaveBeenCalled()
  })
})
