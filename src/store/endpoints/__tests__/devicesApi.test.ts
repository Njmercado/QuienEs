import { devicesApi } from '../devicesApi'
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
const mockDevice = { id: 1, user_id: 'user-123', type: 'Band', created_at: '', updated_at: '' }

function makeSingleBuilder(resolvedValue: object) {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(resolvedValue),
  } as any
}

beforeEach(() => vi.clearAllMocks())

describe('getDevices', () => {
  it('returns 401 when unauthenticated', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } } as any)
    const store = createTestStore()
    const result = await store.dispatch(devicesApi.endpoints.getDevices.initiate())
    expect(result.error).toMatchObject({ status: 401 })
  })

  it('returns device for authenticated user', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } } as any)
    mockFrom.mockReturnValue(makeSingleBuilder({ data: mockDevice, error: null }))
    const store = createTestStore()
    const result = await store.dispatch(devicesApi.endpoints.getDevices.initiate())
    expect(result.data).toEqual(mockDevice)
  })
})

describe('getDeviceById', () => {
  it('returns 401 when unauthenticated', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } } as any)
    const store = createTestStore()
    const result = await store.dispatch(devicesApi.endpoints.getDeviceById.initiate('1'))
    expect(result.error).toMatchObject({ status: 401 })
  })

  it('returns null for PGRST116 (device not found)', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } } as any)
    mockFrom.mockReturnValue(
      makeSingleBuilder({ data: null, error: { code: 'PGRST116', message: 'No rows' } })
    )
    const store = createTestStore()
    const result = await store.dispatch(devicesApi.endpoints.getDeviceById.initiate('999'))
    expect(result.data).toBeNull()
    expect(result.error).toBeUndefined()
  })

  it('returns device by id for authenticated user', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } } as any)
    mockFrom.mockReturnValue(makeSingleBuilder({ data: mockDevice, error: null }))
    const store = createTestStore()
    const result = await store.dispatch(devicesApi.endpoints.getDeviceById.initiate('1'))
    expect(result.data).toEqual(mockDevice)
  })
})
