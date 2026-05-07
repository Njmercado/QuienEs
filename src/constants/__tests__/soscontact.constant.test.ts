import { RELATIONSHIP_OPTIONS } from '../soscontact.constant'

describe('RELATIONSHIP_OPTIONS', () => {
  it('is an array of strings with 11 entries', () => {
    expect(Array.isArray(RELATIONSHIP_OPTIONS)).toBe(true)
    expect(RELATIONSHIP_OPTIONS).toHaveLength(11)
    RELATIONSHIP_OPTIONS.forEach((r) => expect(typeof r).toBe('string'))
  })

  it('contains expected relationship labels', () => {
    expect(RELATIONSHIP_OPTIONS).toContain('Padre')
    expect(RELATIONSHIP_OPTIONS).toContain('Madre')
    expect(RELATIONSHIP_OPTIONS).toContain('Esposo/a')
  })
})
