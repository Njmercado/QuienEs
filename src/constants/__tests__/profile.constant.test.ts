import { RH_LABEL, ID_TYPE, INITIAL_PROFILE_DATA } from '../profile.constant'

describe('RH_LABEL', () => {
  it('has exactly 8 blood type entries', () => {
    expect(Object.keys(RH_LABEL)).toHaveLength(8)
  })

  it('contains all standard ABO+Rh combinations', () => {
    const expected = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    expect(Object.keys(RH_LABEL)).toEqual(expect.arrayContaining(expected))
  })

  it('maps blood types to readable Spanish labels', () => {
    expect(RH_LABEL['O+']).toBe('O Positivo')
    expect(RH_LABEL['AB-']).toBe('A B Negativo')
  })
})

describe('ID_TYPE', () => {
  it('has exactly 4 document types', () => {
    expect(Object.keys(ID_TYPE)).toHaveLength(4)
  })

  it('contains CC, TI, CE and PAS', () => {
    expect(ID_TYPE.CC).toBe('CC')
    expect(ID_TYPE.TI).toBe('TI')
    expect(ID_TYPE.CE).toBe('CE')
    expect(ID_TYPE.PAS).toBe('PAS')
  })
})

describe('INITIAL_PROFILE_DATA', () => {
  it('has all fields initialised to empty string', () => {
    Object.values(INITIAL_PROFILE_DATA).forEach((val) => {
      expect(val).toBe('')
    })
  })
})
