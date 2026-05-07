import { usersApi } from '../usersApi'
import { createTestStore } from '../../../test-utils/createTestStore'

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    auth: { getUser: vi.fn() },
    from: vi.fn(),
  },
}))

import { supabase } from '../../../lib/supabase'
const mockGetUser = vi.mocked(supabase.auth.getUser)
const mockFrom = vi.mocked(supabase.from)

const mockUser = { id: 'user-123' }
const mockUserRecord = {
  id: 'ur1', user_id: 'user-123', name: 'Juan', last_name: 'Pérez',
  full_name: 'Juan Pérez', rh: 'O+' as const, sex: 'Masculino',
  personal_phone_number: '3001234567', personal_phone_indicative: '+57',
  id_type: 'CC', id_number: '123456', from: 'Bogotá', living_in: 'Medellín',
  username: 'juanp', code: 1, created_at: '', public_username: 'JUANP',
}

function makeBuilder(resolvedValue: object) {
  const builder: any = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(resolvedValue),
    then: (resolve: any, reject: any) =>
      Promise.resolve(resolvedValue).then(resolve, reject),
  }
  return builder
}

beforeEach(() => vi.clearAllMocks())

describe('getUser', () => {
  it('returns null when unauthenticated', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } } as any)
    const store = createTestStore()
    const result = await store.dispatch(usersApi.endpoints.getUser.initiate())
    expect(result.data).toBeNull()
  })

  it('returns user record for authenticated user', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } } as any)
    mockFrom.mockReturnValue(makeBuilder({ data: mockUserRecord, error: null }))
    const store = createTestStore()
    const result = await store.dispatch(usersApi.endpoints.getUser.initiate())
    expect(result.data).toEqual(mockUserRecord)
  })

  it('returns null for PGRST116 (no rows) instead of error', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } } as any)
    mockFrom.mockReturnValue(makeBuilder({ data: null, error: { code: 'PGRST116', message: 'No rows' } }))
    const store = createTestStore()
    const result = await store.dispatch(usersApi.endpoints.getUser.initiate())
    expect(result.data).toBeNull()
    expect(result.error).toBeUndefined()
  })

  it('propagates non-PGRST116 errors', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } } as any)
    mockFrom.mockReturnValue(makeBuilder({ data: null, error: { code: 'OTHER', message: 'DB Error' } }))
    const store = createTestStore()
    const result = await store.dispatch(usersApi.endpoints.getUser.initiate())
    expect(result.error).toMatchObject({ status: 500 })
  })
})

describe('createUser', () => {
  it('inserts user record into supabase', async () => {
    const builder = makeBuilder({ error: null })
    mockFrom.mockReturnValue(builder)
    const store = createTestStore()
    await store.dispatch(usersApi.endpoints.createUser.initiate({
      user_id: 'u1', name: 'Juan', last_name: 'Pérez', full_name: 'Juan Pérez',
    }))
    expect(builder.insert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'u1', name: 'Juan' })
    )
  })
})

describe('updateUser', () => {
  it('returns 401 when unauthenticated', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } } as any)
    const store = createTestStore()
    const result = await store.dispatch(usersApi.endpoints.updateUser.initiate(mockUserRecord))
    expect(result.error).toMatchObject({ status: 401 })
  })

  it('calls update with user data for authenticated user', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } } as any)
    const builder = makeBuilder({ error: null, status: 200 })
    mockFrom.mockReturnValue(builder)
    const store = createTestStore()
    await store.dispatch(usersApi.endpoints.updateUser.initiate(mockUserRecord))
    expect(builder.update).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Juan', public_username: 'JUANP' })
    )
  })
})
