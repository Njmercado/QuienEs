import { buildQRUrl } from '../buildQRUrl'

describe('buildQRUrl', () => {
  beforeEach(() => {
    // jsdom sets window.location.origin to 'http://localhost'
    Object.defineProperty(window, 'location', {
      value: { origin: 'http://localhost' },
      writable: true,
    })
  })

  it('builds a valid qrserver.com URL', () => {
    const url = buildQRUrl('/public/abc123')
    expect(url).toMatch(/^https:\/\/api\.qrserver\.com\/v1\/create-qr-code\//)
  })

  it('includes the full origin + path as encoded data param', () => {
    const url = buildQRUrl('/public/abc123')
    const expected = encodeURIComponent('http://localhost/public/abc123')
    expect(url).toContain(`data=${expected}`)
  })

  it('includes size, margin, format and ecc params', () => {
    const url = buildQRUrl('/p/test')
    expect(url).toContain('size=200x200')
    expect(url).toContain('margin=20')
    expect(url).toContain('format=png')
    expect(url).toContain('ecc=L')
  })

  it('properly encodes paths with special characters', () => {
    const url = buildQRUrl('/public/user@123')
    expect(url).toContain(encodeURIComponent('http://localhost/public/user@123'))
  })
})
