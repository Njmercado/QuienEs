import { licenseApi } from '../licenseApi'
import { createTestStore } from '../../../test-utils/createTestStore'

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    auth: { signUp: vi.fn(), signInWithPassword: vi.fn() },
    from: vi.fn(),
    rpc: vi.fn(),
  },
}))

import { supabase } from '../../../lib/supabase'
const mockFrom = vi.mocked(supabase.from)
const mockSignUp = vi.mocked(supabase.auth.signUp)
const mockSignIn = vi.mocked(supabase.auth.signInWithPassword)
const mockRpc = vi.mocked(supabase.rpc)

const mockLicense = {
  id: 'l1', license_id: 'LIC-001', temporary_password: 'temp123',
  is_activated: false, user_email: 'test@test.com',
  user_name: 'Juan', user_last_name: 'Pérez', username: 'JUANP',
  user_id: null, created_at: '', updated_at: '',
}

function makeSingleBuilder(resolvedValue: object) {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(resolvedValue),
  } as any
}

beforeEach(() => vi.clearAllMocks())

describe('getLicense', () => {
  it('returns license for valid id', async () => {
    mockFrom.mockReturnValue(makeSingleBuilder({ data: mockLicense, error: null }))
    const store = createTestStore()
    const result = await store.dispatch(licenseApi.endpoints.getLicense.initiate('LIC-001'))
    expect(result.data).toEqual(mockLicense)
  })

  it('returns error when license not found', async () => {
    mockFrom.mockReturnValue(makeSingleBuilder({ data: null, error: { message: 'Not found' } }))
    const store = createTestStore()
    const result = await store.dispatch(licenseApi.endpoints.getLicense.initiate('BAD'))
    expect(result.error).toMatchObject({ status: 500 })
  })
})

describe('activateLicense', () => {
  it('returns 404 when license fetch fails', async () => {
    mockFrom.mockReturnValue(makeSingleBuilder({ data: null, error: { message: 'Not found' } }))
    const store = createTestStore()
    const result = await store.dispatch(licenseApi.endpoints.activateLicense.initiate('BAD'))
    expect(result.error).toMatchObject({ status: 404 })
  })

  it('returns 409 when already activated', async () => {
    mockFrom.mockReturnValue(
      makeSingleBuilder({ data: { ...mockLicense, is_activated: true }, error: null })
    )
    const store = createTestStore()
    const result = await store.dispatch(licenseApi.endpoints.activateLicense.initiate('LIC-001'))
    expect(result.error).toMatchObject({ status: 409 })
  })

  it('returns 500 when signUp fails', async () => {
    mockFrom.mockReturnValue(makeSingleBuilder({ data: mockLicense, error: null }))
    mockSignUp.mockResolvedValueOnce({ data: { user: null }, error: { message: 'Email taken' } } as any)
    const store = createTestStore()
    const result = await store.dispatch(licenseApi.endpoints.activateLicense.initiate('LIC-001'))
    expect(result.error).toMatchObject({ status: 500 })
  })

  it('calls activate_license rpc after successful signup and login', async () => {
    mockFrom.mockReturnValue(makeSingleBuilder({ data: mockLicense, error: null }))
    mockSignUp.mockResolvedValueOnce({ data: { user: { id: 'new-id' } }, error: null } as any)
    mockSignIn.mockResolvedValueOnce({ error: null } as any)
    mockRpc.mockResolvedValueOnce({ data: null, error: null } as any)
    const store = createTestStore()
    await store.dispatch(licenseApi.endpoints.activateLicense.initiate('LIC-001'))
    expect(mockRpc).toHaveBeenCalledWith('activate_license', {
      license_id: 'LIC-001', user_id: 'new-id',
    })
  })
})
