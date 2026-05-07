import { profilesApi } from '../profilesApi'
import { createTestStore } from '../../../test-utils/createTestStore'

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    auth: { getUser: vi.fn() },
    from: vi.fn(),
    rpc: vi.fn(),
  },
}))

import { supabase } from '../../../lib/supabase'
const mockGetUser = vi.mocked(supabase.auth.getUser)
const mockFrom = vi.mocked(supabase.from)
const mockRpc = vi.mocked(supabase.rpc)

const mockUser = { id: 'user-123' }
const mockProfile = {
  id: 'p1',
  profile_title: 'Mi perfil',
  profile_description: 'Test',
  chosen: false,
  medical_conditions: [],
  sos_contacts: [],
  insurance_name: '',
  insurance_number: '',
}

function makeBuilder(resolvedValue: object) {
  const builder: any = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(resolvedValue),
    then: (resolve: any, reject: any) =>
      Promise.resolve(resolvedValue).then(resolve, reject),
  }
  return builder
}

beforeEach(() => vi.clearAllMocks())

describe('getProfiles', () => {
  it('returns empty array when user is unauthenticated', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } } as any)
    const store = createTestStore()
    const result = await store.dispatch(profilesApi.endpoints.getProfiles.initiate())
    expect(result.data).toEqual([])
  })

  it('returns profiles for authenticated user', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } } as any)
    mockFrom.mockReturnValue(makeBuilder({ data: [mockProfile], error: null }))
    const store = createTestStore()
    const result = await store.dispatch(profilesApi.endpoints.getProfiles.initiate())
    expect(result.data).toEqual([mockProfile])
    expect(mockFrom).toHaveBeenCalledWith('Profile')
  })

  it('propagates supabase errors', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } } as any)
    mockFrom.mockReturnValue(makeBuilder({ data: null, error: { message: 'DB Error' } }))
    const store = createTestStore()
    const result = await store.dispatch(profilesApi.endpoints.getProfiles.initiate())
    expect(result.error).toMatchObject({ status: 500, data: 'DB Error' })
  })
})

describe('createProfile', () => {
  it('returns 401 when user is unauthenticated', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } } as any)
    const store = createTestStore()
    const result = await store.dispatch(
      profilesApi.endpoints.createProfile.initiate(mockProfile)
    )
    expect(result.error).toMatchObject({ status: 401 })
  })

  it('calls supabase insert for authenticated user', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } } as any)
    const builder = makeBuilder({ error: null })
    mockFrom.mockReturnValue(builder)
    const store = createTestStore()
    await store.dispatch(profilesApi.endpoints.createProfile.initiate(mockProfile))
    expect(builder.insert).toHaveBeenCalled()
  })
})

describe('updateProfile', () => {
  it('returns 401 when user is unauthenticated', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } } as any)
    const store = createTestStore()
    const result = await store.dispatch(
      profilesApi.endpoints.updateProfile.initiate({ ...mockProfile, id: 'p1' })
    )
    expect(result.error).toMatchObject({ status: 401 })
  })

  it('calls supabase update for authenticated user', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } } as any)
    const builder = makeBuilder({ error: null })
    mockFrom.mockReturnValue(builder)
    const store = createTestStore()
    await store.dispatch(
      profilesApi.endpoints.updateProfile.initiate({ ...mockProfile, id: 'p1' })
    )
    expect(builder.update).toHaveBeenCalled()
  })
})

describe('deleteProfile', () => {
  it('returns 401 when user is unauthenticated', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } } as any)
    const store = createTestStore()
    const result = await store.dispatch(profilesApi.endpoints.deleteProfile.initiate('p1'))
    expect(result.error).toMatchObject({ status: 401 })
  })
})

describe('updateChosenStatus', () => {
  it('calls supabase rpc update_chosen_profile', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } } as any)
    mockRpc.mockResolvedValueOnce({ data: null, error: null } as any)
    const store = createTestStore()
    await store.dispatch(
      profilesApi.endpoints.updateChosenStatus.initiate({ id: 'p1' })
    )
    expect(mockRpc).toHaveBeenCalledWith('update_chosen_profile', expect.objectContaining({ new_chosen_profile_id: 'p1' }))
  })
})
