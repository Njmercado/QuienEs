import type { ContactData, EngravingData } from '../objects'

const WHATSAPP_PHONE = import.meta.env.VITE_MARKETING_PHONE || ''

export function buildWhatsAppUrl(contact?: ContactData, engraving?: EngravingData, wantsEngraving: boolean = false): string {
  const sosLine = engraving?.sosRelationship || engraving?.sosPhone
    ? `${engraving?.sosRelationship}${engraving?.sosRelationship && engraving?.sosPhone ? ': ' : ''}${engraving?.sosPhone}`
    : ''

  const message = [
    '*Nueva solicitud de compra — QuienEs*',
    '',
    '*Nombre:* ' + contact?.name + ' ' + contact?.lastName,
    '*Email:* ' + contact?.email,
    '*Telefono:* ' + contact?.phone,
    '',
    wantsEngraving && '*Grabado solicitado:*',
    wantsEngraving && contact?.name + ' ' + contact?.lastName,
    wantsEngraving && engraving?.rh,
    wantsEngraving && engraving?.condition,
    wantsEngraving && sosLine,
    '',
    `Hola, estoy interesado(a) en adquirir la pulsera de identificacion medica QuienEs. ${wantsEngraving ? ' Quisiera que tenga grabado lo siguiente:' : ' No requiero grabado.'}`,
  ].filter(Boolean).join('\n')

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`
}