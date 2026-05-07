import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Menu, MENU_OPTIONS } from '../Menu'
import { mockTheme } from '../../../test-utils/mockTheme'
import { createTestStore } from '../../../test-utils/createTestStore'

const testTheme = createTheme({
  palette: mockTheme.palette as any,
  ...{ customSizes: mockTheme.customSizes },
} as any)

vi.mock('../../../store/endpoints/usersApi', () => ({
  useGetUserQuery: () => ({ data: { full_name: 'Juan Pérez' } }),
}))

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    auth: { signOut: vi.fn().mockResolvedValue({}) },
  },
}))

function renderMenu() {
  return render(
    <Provider store={createTestStore()}>
      <ThemeProvider theme={testTheme}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Menu />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  )
}

describe('Menu (SideMenu)', () => {
  it('renders the user full name', () => {
    renderMenu()
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
  })

  it('renders all navigation menu options', () => {
    renderMenu()
    MENU_OPTIONS.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument()
    })
  })

  it('renders the "Cerrar Sesión" logout button', () => {
    renderMenu()
    expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument()
  })

  it('calls signOut when "Cerrar Sesión" is clicked', async () => {
    const { supabase } = await import('../../../lib/supabase')
    renderMenu()
    fireEvent.click(screen.getByText('Cerrar Sesión'))
    expect(supabase.auth.signOut).toHaveBeenCalled()
  })
})
