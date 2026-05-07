import { render, screen, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../AuthContext'

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
  },
}))

import { supabase } from '../../lib/supabase'
const mockGetSession = vi.mocked(supabase.auth.getSession)
const mockOnAuthStateChange = vi.mocked(supabase.auth.onAuthStateChange)

function TestConsumer() {
  const { session, loading, requiresPasswordChange } = useAuth()
  return (
    <div>
      <span data-testid="session">{session ? 'authenticated' : 'unauthenticated'}</span>
      <span data-testid="loading">{loading ? 'loading' : 'ready'}</span>
      <span data-testid="requires-change">{requiresPasswordChange ? 'yes' : 'no'}</span>
    </div>
  )
}

describe('AuthProvider', () => {
  afterEach(() => vi.clearAllMocks())

  it('starts with loading=true and no session', async () => {
    mockGetSession.mockImplementationOnce(() => new Promise(() => {}))
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )
    expect(screen.getByTestId('loading').textContent).toBe('loading')
    expect(screen.getByTestId('session').textContent).toBe('unauthenticated')
  })

  it('sets loading=false and session after getSession resolves', async () => {
    const fakeSession = { user: { id: 'u1', user_metadata: {} } } as any
    mockGetSession.mockResolvedValueOnce({ data: { session: fakeSession }, error: null } as any)
    await act(async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      )
    })
    expect(screen.getByTestId('loading').textContent).toBe('ready')
    expect(screen.getByTestId('session').textContent).toBe('authenticated')
  })

  it('sets requiresPasswordChange=true from user metadata', async () => {
    const fakeSession = {
      user: { id: 'u1', user_metadata: { requires_password_change: true } },
    } as any
    mockGetSession.mockResolvedValueOnce({ data: { session: fakeSession }, error: null } as any)
    await act(async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      )
    })
    expect(screen.getByTestId('requires-change').textContent).toBe('yes')
  })

  it('subscribes to onAuthStateChange on mount and unsubscribes on unmount', async () => {
    const unsubscribeMock = vi.fn()
    mockOnAuthStateChange.mockReturnValueOnce({
      data: { subscription: { unsubscribe: unsubscribeMock } },
    } as any)
    mockGetSession.mockResolvedValueOnce({ data: { session: null }, error: null })

    let unmount: () => void
    await act(async () => {
      const result = render(<AuthProvider><TestConsumer /></AuthProvider>)
      unmount = result.unmount
    })
    unmount!()
    expect(unsubscribeMock).toHaveBeenCalled()
  })

  it('useAuth returns context values via hook', async () => {
    mockGetSession.mockResolvedValueOnce({ data: { session: null }, error: null })
    await act(async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      )
    })
    expect(screen.getByTestId('session')).toBeInTheDocument()
  })
})
