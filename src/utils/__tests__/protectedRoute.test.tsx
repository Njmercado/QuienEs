import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProtectedRoute } from '../protectedRoute'

// Mock AuthContext
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}))
// Mock the Login and PasswordResetModal so we avoid heavy rendering
vi.mock('../../components/pages/Login', () => ({
  Login: () => <div data-testid="login-page">Login</div>,
}))
vi.mock('../../components/molecules/PasswordResetModal', () => ({
  PasswordResetModal: () => <div data-testid="password-reset-modal">Reset</div>,
}))

import { useAuth } from '../../contexts/AuthContext'
const mockUseAuth = vi.mocked(useAuth)

function renderProtectedRoute(children = <div data-testid="protected-content">Protected</div>) {
  return render(
    <MemoryRouter>
      <ProtectedRoute>{children}</ProtectedRoute>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  afterEach(() => vi.clearAllMocks())

  it('shows a loading spinner while auth is being resolved', () => {
    mockUseAuth.mockReturnValue({ session: null, user: null, loading: true, requiresPasswordChange: false })
    renderProtectedRoute()
    // MUI CircularProgress renders a role="progressbar"
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders Login when there is no session', () => {
    mockUseAuth.mockReturnValue({ session: null, user: null, loading: false, requiresPasswordChange: false })
    renderProtectedRoute()
    expect(screen.getByTestId('login-page')).toBeInTheDocument()
  })

  it('renders PasswordResetModal when requiresPasswordChange is true', () => {
    mockUseAuth.mockReturnValue({
      session: { user: { id: 'u1' } } as any,
      user: { id: 'u1' } as any,
      loading: false,
      requiresPasswordChange: true,
    })
    renderProtectedRoute()
    expect(screen.getByTestId('password-reset-modal')).toBeInTheDocument()
  })

  it('renders children when authenticated and no password change required', () => {
    mockUseAuth.mockReturnValue({
      session: { user: { id: 'u1' } } as any,
      user: { id: 'u1' } as any,
      loading: false,
      requiresPasswordChange: false,
    })
    renderProtectedRoute()
    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
  })
})
