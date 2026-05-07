import { ROUTES } from '../routes'

describe('ROUTES', () => {
  it('defines all required application routes', () => {
    expect(ROUTES.LANDING).toBe('/')
    expect(ROUTES.LOG_IN).toBe('/login')
    expect(ROUTES.DASHBOARD).toBe('/dashboard')
    expect(ROUTES.PUBLIC).toBe('/p')
    expect(ROUTES.BUY).toBe('/buy')
    expect(ROUTES.ACTIVATE).toBe('/activate')
    expect(ROUTES.RECOVER_PASSWORD).toBe('/recover-password')
    expect(ROUTES.UPDATE_PASSWORD).toBe('/update-password')
    expect(ROUTES.SETTINGS).toBe('/settings')
    expect(ROUTES.SOS_CONTACTS).toBe('/sos-contact')
    expect(ROUTES.CONDITION).toBe('/condition')
  })

  it('has no duplicate path values', () => {
    const paths = Object.values(ROUTES)
    const unique = new Set(paths)
    expect(unique.size).toBe(paths.length)
  })

  it('every route starts with /', () => {
    Object.values(ROUTES).forEach((route) => {
      expect(route).toMatch(/^\//)
    })
  })
})
