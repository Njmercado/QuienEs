import { playProfileAudio, stopProfileAudio } from '../audioTTS'
import type { PublicProfileType } from '../../objects/publicProfile'

const mockSpeak = vi.fn()
const mockCancel = vi.fn()
const mockGetVoices = vi.fn(() => [] as any[])

const mockSpeechSynthesis = {
  speak: mockSpeak,
  cancel: mockCancel,
  getVoices: mockGetVoices,
}

const baseProfile: PublicProfileType = {
  user_id: '1',
  name: 'Juan',
  last_name: 'Pérez',
  sex: 'Masculino',
  from: 'Bogotá',
  living_in: 'Medellín',
  id_type: 'CC',
  id_number: '123456789',
  rh: 'O+' as const,
  medical_conditions: [],
  sos_contacts: [],
  username: 'juanp',
  full_name: 'Juan Pérez',
  code: 1,
  personal_phone_number: '3001234567',
  personal_phone_indicative: '+57',
  profile_title: '',
  profile_description: '',
  insurance_name: '',
  insurance_number: '',
}

describe('playProfileAudio', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'speechSynthesis', {
      value: mockSpeechSynthesis,
      writable: true,
    })
  })

  it('returns false and does not speak when speechSynthesis is unavailable', () => {
    Object.defineProperty(window, 'speechSynthesis', { value: undefined, writable: true })
    const result = playProfileAudio(baseProfile)
    expect(result).toBe(false)
    expect(mockSpeak).not.toHaveBeenCalled()
  })

  it('cancels any ongoing speech before starting', () => {
    playProfileAudio(baseProfile)
    expect(mockCancel).toHaveBeenCalled()
  })

  it('calls speak() with a SpeechSynthesisUtterance', () => {
    playProfileAudio(baseProfile)
    expect(mockSpeak).toHaveBeenCalledTimes(1)
    const utterance = mockSpeak.mock.calls[0][0]
    expect(utterance).toBeInstanceOf(SpeechSynthesisUtterance)
  })

  it('returns true on success', () => {
    const result = playProfileAudio(baseProfile)
    expect(result).toBe(true)
  })

  it('includes identity text in the utterance', () => {
    playProfileAudio(baseProfile)
    const utterance = mockSpeak.mock.calls[0][0] as SpeechSynthesisUtterance
    expect(utterance.text).toContain('Juan')
    expect(utterance.text).toContain('Pérez')
  })

  it('includes allergy text when medical conditions exist', () => {
    const profileWithAllergy: PublicProfileType = {
      ...baseProfile,
      medical_conditions: [{ title: 'Penicilina', medicines: ['Amoxicilina'], is_allergy: true }],
    }
    playProfileAudio(profileWithAllergy)
    const utterance = mockSpeak.mock.calls[0][0] as SpeechSynthesisUtterance
    expect(utterance.text).toContain('Penicilina')
  })

  it('includes SOS contact text when contacts exist', () => {
    const profileWithContact: PublicProfileType = {
      ...baseProfile,
      sos_contacts: [{ name: 'María', last_name: 'García', phone_number: '300', phone_indicative: '+57', location: '', relationship: 'Madre' }],
    }
    playProfileAudio(profileWithContact)
    const utterance = mockSpeak.mock.calls[0][0] as SpeechSynthesisUtterance
    expect(utterance.text).toContain('María')
  })

  it('prefers a Spanish voice when available', () => {
    const esVoice = { lang: 'es-CO', name: 'Spanish CO' }
    mockGetVoices.mockReturnValueOnce([esVoice as any])
    playProfileAudio(baseProfile)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const utterance = mockSpeak.mock.calls[0][0] as any
    expect(utterance.voice).toBe(esVoice)
  })
})

describe('stopProfileAudio', () => {
  it('calls speechSynthesis.cancel()', () => {
    Object.defineProperty(window, 'speechSynthesis', { value: mockSpeechSynthesis, writable: true })
    stopProfileAudio()
    expect(mockCancel).toHaveBeenCalled()
  })

  it('does nothing gracefully when speechSynthesis is unavailable', () => {
    Object.defineProperty(window, 'speechSynthesis', { value: undefined, writable: true })
    expect(() => stopProfileAudio()).not.toThrow()
  })
})
