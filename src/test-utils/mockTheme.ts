/**
 * Shared MUI theme mock for use in component tests.
 * Spread-or-override in vi.mock('@mui/material/styles') calls.
 */
export const mockTheme = {
  palette: {
    custom: {
      primary: {
        100: '#006E2A',
        30: 'rgba(0,110,42,0.3)',
        20: 'rgba(0,110,42,0.2)',
        10: 'rgba(0,110,42,0.1)',
        5: 'rgba(0,110,42,0.05)',
      },
      tertiary: {
        100: '#C62828',
        20: 'rgba(198,40,40,0.2)',
        10: 'rgba(198,40,40,0.1)',
        5: 'rgba(198,40,40,0.05)',
      },
      neutral: {
        100: '#EEEEF0',
        90: 'rgba(238,238,240,0.9)',
      },
      secondary: {
        100: '#E8F5E9',
      },
      metal: {
        base: '#B8BCC4',
        light: '#D4D8E0',
        dark: '#8A8E96',
        border: 'rgba(255,255,255,0.3)',
        text: '#2C2E33',
      },
    },
    background: { paper: '#FFFFFF', default: '#F8F9FA' },
    text: { primary: '#1A1A1A', secondary: '#6B7280' },
    divider: 'rgba(0,0,0,0.12)',
  },
  customSizes: {
    font: {
      tiny: '0.625rem',
      small: '0.75rem',
      base: '0.9375rem',
      lg: '1.125rem',
      xl: '1.5rem',
      h1: '3rem',
    },
    radius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      pill: '100px',
      circle: '50%',
    },
  },
  size: (n: number) => `${n * 0.25}rem`,
}
