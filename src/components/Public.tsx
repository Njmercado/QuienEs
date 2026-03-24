import { supabase } from '../lib/supabase'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { type Profile } from '../objects/profile'
import {
  Box,
  Typography,
  Chip,
  Divider,
  Skeleton,
  Paper,
  alpha,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'

interface InfoFieldProps {
  label: string
  value?: string
}

function InfoField({ label, value }: InfoFieldProps) {
  if (!value) return null
  return (
    <Box>
      <Typography
        variant="caption"
        sx={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, color: (theme) => theme.palette.custom.neutralLight, display: 'block', mb: 0.5 }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        fontWeight={500}
        sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 0.5 }}
      >
        {value}
      </Typography>
    </Box>
  )
}

export function Public() {
  const { token } = useParams()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    supabase
      .from('PublicUser')
      .select('*')
      .eq('user_id', token)
      .eq('chosen', true)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setError(true)
        } else {
          setProfile(data)
        }
        setLoading(false)
      })
  }, [token])

  if (loading) {
    return (
      <Box
        component="main"
        sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <FavoriteIcon sx={{ color: 'text.disabled', fontSize: 32, animation: 'pulse 1.5s ease-in-out infinite' }} />
          <Skeleton variant="text" width={200} height={20} sx={{ bgcolor: 'divider' }} />
          <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.15em', color: 'text.disabled' }}>
            Loading Profile...
          </Typography>
        </Box>
      </Box>
    )
  }

  if (error || !profile) {
    return (
      <Box
        component="main"
        sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
      >
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h2"
            fontWeight={900}
            sx={{ background: (theme) => `linear-gradient(135deg, #fff, ${theme.palette.custom.neutralDark})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            404
          </Typography>
          <Typography variant="body2" color="text.secondary" fontFamily="monospace">
            Profile not found or is private.
          </Typography>
        </Paper>
      </Box>
    )
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        p: { xs: 2, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 500,
          background: (theme) => `linear-gradient(to bottom, ${alpha(theme.palette.common.white, 0.03)}, transparent)`,
          pointerEvents: 'none',
        }}
      />

      <Paper
        component="article"
        sx={{
          width: '100%',
          maxWidth: 672,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: (theme) => theme.palette.custom.glowShadow,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <Box
          component="header"
          sx={{
            p: { xs: 4, md: 6 },
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: (theme) => alpha(theme.palette.common.black, 0.4),
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative blob */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 256,
              height: 256,
              bgcolor: (theme) => theme.palette.custom.glassBg,
              borderRadius: '50%',
              filter: 'blur(60px)',
              transform: 'translate(50%, -50%)',
              pointerEvents: 'none',
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Chip
              label="Miembro MiCuervo"
              size="small"
              sx={{
                bgcolor: (theme) => theme.palette.custom.glassHoverBg,
                border: '1px solid',
                borderColor: (theme) => theme.palette.custom.glassBorder,
                color: 'text.primary',
                fontSize: 10,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                mb: 2,
                fontWeight: 900,
                backdropFilter: 'blur(4px)',
              }}
            />
            <Typography variant="h3" fontWeight={900} letterSpacing="-0.04em" gutterBottom>
              {profile.profile_title || 'Untitled'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480, mx: 'auto', lineHeight: 1.7 }}>
              {profile.profile_description}
            </Typography>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ p: { xs: 4, md: 6 } }}>
          {/* Personal Info */}
          <Box component="section" sx={{ mb: 6 }} aria-label="Personal Information">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'text.secondary', whiteSpace: 'nowrap' }}
              >
                Información Personal
              </Typography>
              <Divider sx={{ flexGrow: 1, borderColor: 'divider' }} />
            </Box>

            <Box
              component="dl"
              sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}
            >
              <InfoField label="Nombre Completo" value={profile.data?.fullName} />
              <InfoField label="Documento" value={`${profile.data?.idType} - ${profile.data?.idNumber}`} />
              <InfoField label="RH" value={profile.data?.rh} />
              <InfoField label="Seguro Médico" value={profile.data?.healthInsurance} />
              {profile.data?.healthInsuranceNumber && (
                <InfoField label="N° Seguro" value={profile.data.healthInsuranceNumber} />
              )}
            </Box>

            {profile.data?.extraInfo && (
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="caption"
                  component="dt"
                  sx={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, color: (theme) => theme.palette.custom.neutralLight, display: 'block', mb: 1 }}
                >
                  Información Extra
                </Typography>
                <Box
                  component="dd"
                  sx={{ bgcolor: (theme) => theme.palette.custom.glassBg, border: '1px solid', borderColor: (theme) => alpha(theme.palette.common.white, 0.05), borderRadius: 2, p: 2 }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {profile.data.extraInfo}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          {/* Emergency Info */}
          <Box component="section" aria-label="Emergency Information">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: (theme) => alpha(theme.palette.error.main, 0.6), whiteSpace: 'nowrap' }}
              >
                Contacto de Emergencia
              </Typography>
              <Divider sx={{ flexGrow: 1, borderColor: (theme) => alpha(theme.palette.error.main, 0.2) }} />
            </Box>

            <Paper
              sx={{
                background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.error.dark, 0.1)}, ${alpha(theme.palette.common.black, 0.5)})`,
                border: '1px solid',
                borderColor: (theme) => alpha(theme.palette.error.dark, 0.15),
                borderRadius: 2,
                p: 3,
                position: 'relative',
                overflow: 'hidden',
                '&:hover::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.04),
                },
              }}
            >
              <Box
                component="dl"
                sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, position: 'relative', zIndex: 1 }}
              >
                <InfoField label="Nombre Contacto" value={profile.data?.emergencyName} />
                <InfoField label="Numero Contacto" value={profile.data?.emergencyContact} />
                <InfoField label="Parentesco" value={profile.data?.emergencyRelationship} />
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center', bgcolor: (theme) => alpha(theme.palette.common.black, 0.4) }}
        >
          <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.15em', color: (theme) => theme.palette.custom.neutralMedium }}>
            Protegido por sistema MiCuervo
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}