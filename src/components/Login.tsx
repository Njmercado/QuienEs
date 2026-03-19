import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Divider,
  CircularProgress,
} from '@mui/material'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      navigate('/dashboard')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        bgcolor: 'background.default',
      }}
    >
      {/* Logo / Brand */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mb: 4 }}>
        <Box component="img" src="black.png" alt="crow simple image" sx={{ width: 80 }} />
        <Typography
          variant="h4"
          fontWeight={900}
          letterSpacing="-0.05em"
          color="text.primary"
        >
          CUERVO
        </Typography>
      </Box>

      {/* Card */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 440,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          boxShadow: (theme) => theme.palette.custom.glowShadow,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          {error && (
            <Alert
              severity="error"
              sx={{
                bgcolor: (theme) => theme.palette.custom.errorBg,
                border: '1px solid',
                borderColor: (theme) => theme.palette.custom.errorBorder,
                color: (theme) => theme.palette.custom.errorLight,
                '& .MuiAlert-icon': { color: (theme) => theme.palette.custom.errorLight },
              }}
            >
              {error}
            </Alert>
          )}

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            fullWidth
            required
            variant="standard"
            InputLabelProps={{ sx: { textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.15em' } }}
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            fullWidth
            required
            variant="standard"
            InputLabelProps={{ sx: { textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.15em' } }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            size="large"
            sx={{ py: 1.8 }}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Box>

        <Divider sx={{ '&::before, &::after': { borderColor: 'divider' } }}>
          <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Or continue with
          </Typography>
        </Divider>

        <Button
          variant="outlined"
          fullWidth
          sx={{
            borderColor: 'divider',
            color: 'text.primary',
            '&:hover': { borderColor: (theme) => theme.palette.custom.glassHoverBorder, bgcolor: (theme) => theme.palette.custom.glassBg },
          }}
        >
          Google
        </Button>

        <Typography variant="caption" color="text.secondary" align="center">
          Don't have an account?{' '}
          <Box
            component={Link}
            to="/signup"
            sx={{ color: 'text.primary', textDecoration: 'underline', '&:hover': { color: 'text.secondary' } }}
          >
            Sign up
          </Box>
        </Typography>
      </Box>
    </Box>
  )
}
