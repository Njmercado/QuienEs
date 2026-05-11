import type { RH } from '../constants'

export interface EngravingData {
  rh: keyof typeof RH | ''
  condition: string
  sosRelationship: string
  sosPhone: string
}
