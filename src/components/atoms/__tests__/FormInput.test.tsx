import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { FormInput } from '../FormInput'
import { mockTheme } from '../../../test-utils/mockTheme'

const testTheme = createTheme({
  palette: mockTheme.palette as any,
  ...{ customSizes: mockTheme.customSizes },
} as any)

function renderInput(props: Parameters<typeof FormInput>[0]) {
  return render(
    <ThemeProvider theme={testTheme}>
      <FormInput {...props} />
    </ThemeProvider>
  )
}

describe('FormInput', () => {
  it('renders a label when provided', () => {
    renderInput({ label: 'Nombre', value: '', id: 'test-name' })
    expect(screen.getByText('Nombre')).toBeInTheDocument()
  })

  it('renders without a label when omitted', () => {
    renderInput({ value: '', id: 'test-no-label' })
    expect(screen.queryByRole('label')).not.toBeInTheDocument()
  })

  it('calls onChange with the new value when user types', () => {
    const onChange = vi.fn()
    renderInput({ label: 'Email', value: '', id: 'test-email', onChange })
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test@test.com' } })
    expect(onChange).toHaveBeenCalledWith('test@test.com', false)
  })

  it('shows validation error message when rule fails', () => {
    const onChange = vi.fn()
    renderInput({
      label: 'Teléfono', value: '', id: 'test-phone', onChange,
      rules: [{ validate: (v) => /^\d+$/.test(v), errorMessage: 'Solo números' }],
    })
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'abc' } })
    expect(screen.getByText(/Solo números/)).toBeInTheDocument()
    expect(onChange).toHaveBeenCalledWith('abc', true)
  })

  it('does not show error when validation passes', () => {
    renderInput({
      label: 'Código', value: '', id: 'test-code',
      rules: [{ validate: (v) => /^\d+$/.test(v), errorMessage: 'Solo números' }],
    })
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '12345' } })
    expect(screen.queryByText(/Solo números/)).not.toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    renderInput({ label: 'Campo', value: 'val', id: 'test-disabled', disabled: true })
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
})
