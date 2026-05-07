import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { LandingFooter } from '../LandingFooter'
import { mockTheme } from '../../../test-utils/mockTheme'

const testTheme = createTheme({
  palette: mockTheme.palette as any,
  ...{ customSizes: mockTheme.customSizes },
} as any)

function renderFooter() {
  return render(
    <ThemeProvider theme={testTheme}>
      <LandingFooter />
    </ThemeProvider>
  )
}

describe('LandingFooter', () => {
  it('renders the QuienEs brand in footer', () => {
    renderFooter()
    expect(screen.getByText('QuienEs')).toBeInTheDocument()
  })

  it('renders copyright notice with year', () => {
    renderFooter()
    expect(screen.getByText(/© 2026 QuienEs/i)).toBeInTheDocument()
  })

  it('renders developer attribution link', () => {
    renderFooter()
    expect(screen.getByText(/Nino Mercado/i)).toBeInTheDocument()
  })
})
