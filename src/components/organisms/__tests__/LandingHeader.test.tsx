import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { LandingHeader } from '../LandingHeader'
import { mockTheme } from '../../../test-utils/mockTheme'

const testTheme = createTheme({
  palette: mockTheme.palette as any,
  ...{ customSizes: mockTheme.customSizes },
} as any)

function renderHeader() {
  return render(
    <ThemeProvider theme={testTheme}>
      <MemoryRouter>
        <LandingHeader />
      </MemoryRouter>
    </ThemeProvider>
  )
}

describe('LandingHeader', () => {
  it('renders the QuienEs brand name', () => {
    renderHeader()
    expect(screen.getByText('QuienEs')).toBeInTheDocument()
  })

  it('renders the Comprar CTA button', () => {
    renderHeader()
    expect(screen.getByText('Comprar')).toBeInTheDocument()
  })

  it('renders the Login button', () => {
    renderHeader()
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('Comprar button links to /buy route', () => {
    renderHeader()
    const comprarLink = screen.getByText('Comprar').closest('a')
    expect(comprarLink).toHaveAttribute('href', '/buy')
  })
})
