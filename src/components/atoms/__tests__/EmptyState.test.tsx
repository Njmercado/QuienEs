import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { EmptyState } from '../EmptyState'
import { mockTheme } from '../../../test-utils/mockTheme'

const testTheme = createTheme({
  palette: mockTheme.palette as any,
  ...{ customSizes: mockTheme.customSizes },
} as any)

function renderEmpty(props: { title: string; description: string; color?: string }) {
  return render(
    <ThemeProvider theme={testTheme}>
      <EmptyState {...props} />
    </ThemeProvider>
  )
}

describe('EmptyState', () => {
  it('renders title and description text', () => {
    renderEmpty({ title: 'Sin condiciones', description: 'Aún no has agregado ninguna condición.' })
    expect(screen.getByText('Sin condiciones')).toBeInTheDocument()
    expect(screen.getByText('Aún no has agregado ninguna condición.')).toBeInTheDocument()
  })

  it('renders without crashing when color is not provided', () => {
    renderEmpty({ title: 'Vacío', description: 'Nada aquí.' })
    expect(screen.getByText('Vacío')).toBeInTheDocument()
  })

  it('renders without crashing when color prop is provided', () => {
    renderEmpty({ title: 'Error', description: 'Algo salió mal.', color: 'red' })
    expect(screen.getByText('Error')).toBeInTheDocument()
  })
})
