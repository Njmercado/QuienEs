import { sosContactsApi } from '../sosContactsApi'
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
const mockContact = {
  id: 'sc1', name: 'María', last_name: 'García',
  phone_number: '3001234567', phone_indicative: '+57',
  location: 'Bogotá', relationship: 'Madre', user_id: 'user-123',
}

function makeBuilder(resolvedValue: object, extraMethods: Record<string, any> = {}) {
  const builder: any = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    then: (resolve: any, reject: any) =>
      Promise.resolve(resolvedValue).then(resolve, reject),
    ...extraMethods,
  }
  return builder
}

beforeEach(() => vi.clearAllMocks())

describe('getSOSContacts', () => {
  it('returns empty array when unauthenticated', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } } as any)
    const store = createTestStore()
    const result = await store.dispatch(sosContactsApi.endpoints.getSOSContacts.initiate())
    expect(result.data).toEqual([])
  })

  it('returns contacts for authenticated user', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } } as any)
    mockFrom.mockReturnValue(makeBuilder({ data: [mockContact], error: null }))
    const store = createTestStore()
    const result = await store.dispatch(sosContactsApi.endpoints.getSOSContacts.initiate())
    expect(result.data).toEqual([mockContact])
  })

  it('applies search filter when provided', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } } as any)
    const builder = makeBuilder({ data: [], error: null })
    mockFrom.mockReturnValue(builder)
    const store = createTestStore()
    await store.dispatch(sosContactsApi.endpoints.getSOSContacts.initiate({ search: 'María' }))
    expect(builder.or).toHaveBeenCalledWith(expect.stringContaining('María'))
  })

  it('applies relationship filter when provided', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } } as any)
    const builder = makeBuilder({ data: [], error: null })
    mockFrom.mockReturnValue(builder)
    const store = createTestStore()
    await store.dispatch(sosContactsApi.endpoints.getSOSContacts.initiate({ relationship: 'Madre' }))
    expect(builder.eq).toHaveBeenCalledWith('relationship', 'Madre')
  })
})

describe('createSOSContact', () => {
  it('returns 401 when unauthenticated', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } } as any)
    const store = createTestStore()
    const result = await store.dispatch(
      sosContactsApi.endpoints.createSOSContact.initiate(mockContact)
    )
    expect(result.error).toMatchObject({ status: 401 })
  })

  it('calls insert with contact data + user_id', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } } as any)
    const builder = makeBuilder({ error: null })
    mockFrom.mockReturnValue(builder)
    const store = createTestStore()
    await store.dispatch(sosContactsApi.endpoints.createSOSContact.initiate(mockContact))
    expect(builder.insert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'user-123', name: 'María' })
    )
  })
})

describe('deleteSOSContact', () => {
  it('returns 401 when unauthenticated', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } } as any)
    const store = createTestStore()
    const result = await store.dispatch(sosContactsApi.endpoints.deleteSOSContact.initiate('sc1'))
    expect(result.error).toMatchObject({ status: 401 })
  })
})

describe('updateSOSContact', () => {
  it('returns 401 when unauthenticated', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } } as any)
    const store = createTestStore()
    const result = await store.dispatch(
      sosContactsApi.endpoints.updateSOSContact.initiate({ id: 'sc1', contact: mockContact })
    )
    expect(result.error).toMatchObject({ status: 401 })
  })
})
