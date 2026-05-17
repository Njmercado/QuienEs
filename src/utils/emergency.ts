export function buildGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`
}

export function buildHospitalsNearbyUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/hospitales+cerca/@${lat},${lng},15z`
}

export function formatDateTime(isoString?: string): string {
  if (!isoString) return 'Fecha desconocida'
  const date = new Date(isoString)
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatCoordinate(value: number, type: 'lat' | 'lng'): string {
  const abs = Math.abs(value).toFixed(6)
  if (type === 'lat') return value >= 0 ? `${abs}° N` : `${abs}° S`
  return value >= 0 ? `${abs}° E` : `${abs}° O`
}
