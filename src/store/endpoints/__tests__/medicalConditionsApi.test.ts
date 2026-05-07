import { medicalConditionsApi } from '../medicalConditionsApi'
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
const mockCondition = { id: 'c1', title: 'Diabetes', medicines: ['Metformina'], is_allergy: false, user_id: 'user-123' }

function makeBuilder(resolvedValue: object) {
  const builder: any = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    then: (resolve: any, reject: any) =>
      Promise.resolve(resolvedValue).then(resolve, reject),
  }
  return builder
}

beforeEach(() => vi.clearAllMocks())

describe('getMedicalConditions', () => {
  it('returns empty array when unauthenticated', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } } as any)
    const store = createTestStore()
    const result = await store.dispatch(medicalConditionsApi.endpoints.getMedicalConditions.initiate())
    expect(result.data).toEqual([])
  })

  it('returns conditions for authenticated user', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } } as any)
    mockFrom.mockReturnValue(makeBuilder({ data: [mockCondition], error: null }))
    const store = createTestStore()
    const result = await store.dispatch(medicalConditionsApi.endpoints.getMedicalConditions.initiate())
    expect(result.data).toEqual([mockCondition])
    expect(mockFrom).toHaveBeenCalledWith('MedicalCondition')
  })

  it('propagates errors from supabase', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } } as any)
    mockFrom.mockReturnValue(makeBuilder({ data: null, error: { message: 'Query failed' } }))
    const store = createTestStore()
    const result = await store.dispatch(medicalConditionsApi.endpoints.getMedicalConditions.initiate())
    expect(result.error).toMatchObject({ status: 500, data: 'Query failed' })
  })
})

describe('createMedicalCondition', () => {
  it('returns 401 when unauthenticated', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } } as any)
    const store = createTestStore()
    const result = await store.dispatch(
      medicalConditionsApi.endpoints.createMedicalCondition.initiate({ title: 'Asma', medicines: [] })
    )
    expect(result.error).toMatchObject({ status: 401 })
  })

  it('calls insert for authenticated user', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } } as any)
    const builder = makeBuilder({ error: null })
    mockFrom.mockReturnValue(builder)
    const store = createTestStore()
    await store.dispatch(
      medicalConditionsApi.endpoints.createMedicalCondition.initiate({ title: 'Asma', medicines: [] })
    )
    expect(builder.insert).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Asma', user_id: 'user-123' })
    )
  })
})

describe('updateMedicalCondition', () => {
  it('returns 401 when unauthenticated', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } } as any)
    const store = createTestStore()
    const result = await store.dispatch(
      medicalConditionsApi.endpoints.updateMedicalCondition.initiate(mockCondition)
    )
    expect(result.error).toMatchObject({ status: 401 })
  })
})

describe('deleteMedicalCondition', () => {
  it('returns 401 when unauthenticated', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } } as any)
    const store = createTestStore()
    const result = await store.dispatch(
      medicalConditionsApi.endpoints.deleteMedicalCondition.initiate('c1')
    )
    expect(result.error).toMatchObject({ status: 401 })
  })

  it('calls delete with correct condition id', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: mockUser } } as any)
    const builder = makeBuilder({ error: null })
    mockFrom.mockReturnValue(builder)
    const store = createTestStore()
    await store.dispatch(medicalConditionsApi.endpoints.deleteMedicalCondition.initiate('c1'))
    expect(builder.delete).toHaveBeenCalled()
    expect(builder.eq).toHaveBeenCalledWith('id', 'c1')
  })
})
