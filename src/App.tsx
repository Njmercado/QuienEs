import { Routes, Route } from 'react-router-dom'
import { Login } from './components/Login'
import { SignUp } from './components/SignUp'
import { Dashboard } from './components/Dashboard'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Public } from './components/Public'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider, createTheme, CssBaseline, CircularProgress, Box } from '@mui/material'

declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      glassBg: string;
      glassBorder: string;
      glassHoverBg: string;
      glassHoverBorder: string;
      glassFocusBorder: string;
      glowShadow: string;
      errorBg: string;
      errorBorder: string;
      errorLight: string;
      greyLight: string;
      greyMedium: string;
      greyDark: string;
      gold: string;
      goldGlow: string;
    }
  }
  interface PaletteOptions {
    custom?: Partial<Palette['custom']>;
  }
}
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
      contrastText: '#000000',
    },
    secondary: {
      main: '#ef5350',
    },
    background: {
      default: '#000000',
      paper: '#0a0a0a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#9e9e9e',
      disabled: '#666666',
    },
    divider: 'rgba(255, 255, 255, 0.1)',
    warning: {
      main: '#eab308',
    },
    error: {
      main: '#d32f2f',
    },
    custom: {
      glassBg: 'rgba(255,255,255,0.04)',
      glassBorder: 'rgba(255,255,255,0.2)',
      glassHoverBg: 'rgba(255,255,255,0.08)',
      glassHoverBorder: 'rgba(255,255,255,0.5)',
      glassFocusBorder: 'rgba(255,255,255,0.7)',
      glowShadow: '0 0 50px rgba(255,255,255,0.07)',
      errorBg: 'rgba(211, 47, 47, 0.1)',
      errorBorder: 'rgba(211, 47, 47, 0.3)',
      errorLight: '#ef9a9a',
      greyLight: '#555555',
      greyMedium: '#444444',
      greyDark: '#666666',
      gold: '#eab308',
      goldGlow: '0 0 20px rgba(234,179,8,0.1)',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 700,
          borderRadius: 0,
        },
        containedPrimary: {
          backgroundColor: '#ffffff',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#e0e0e0',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'standard',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.custom.glassBorder,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.custom.glassHoverBorder,
          },
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          backgroundImage: 'none',
          borderLeft: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          backgroundImage: 'none',
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
  },
})

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    )
  }

  if (!session) {
    return <Login />
  }

  return <>{children}</>
}

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: darkTheme.palette.background.paper,
              color: darkTheme.palette.text.primary,
              border: `1px solid ${darkTheme.palette.divider}`,
              borderRadius: '8px',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: darkTheme.palette.text.primary,
                secondary: darkTheme.palette.background.default,
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/public/:token" element={<Public />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
