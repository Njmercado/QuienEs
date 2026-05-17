import { useParams } from 'react-router-dom'
import { useGetAlertQuery } from '../../store/endpoints/alertLogsApi'
import { Box, Typography, Button, useTheme, Chip } from '@mui/material'
import MonitorHeartRoundedIcon from '@mui/icons-material/MonitorHeartRounded'
import MapRoundedIcon from '@mui/icons-material/MapRounded'
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import PinDropRoundedIcon from '@mui/icons-material/PinDropRounded'
import { ApiStatusHandler, InfoSection } from '../atoms'
import { buildGoogleMapsUrl, buildHospitalsNearbyUrl, formatDateTime, formatCoordinate } from '../../utils'

export function Alert() {
  const { token } = useParams()
  const { data: emergency, isLoading, isError } = useGetAlertQuery(token || '', { skip: !token })

  return (
    <ApiStatusHandler
      isLoading={isLoading}
      isError={isError}
      hasData={!!emergency}
      loadingMessage="CARGANDO ALERTA..."
      errorMessage="No se encontró información de esta alerta."
    >
      {emergency && <AlertContent emergency={emergency} />}
    </ApiStatusHandler>
  )
}

interface AlertContentProps {
  emergency: { latitude: number; longitude: number; name: string; created_at?: string }
}

function AlertContent({ emergency }: AlertContentProps) {
  const theme = useTheme()
  const mapsUrl = buildGoogleMapsUrl(emergency.latitude, emergency.longitude)
  const hospitalsUrl = buildHospitalsNearbyUrl(emergency.latitude, emergency.longitude)
  const dateTimeLabel = formatDateTime(emergency.created_at)
  const latLabel = formatCoordinate(emergency.latitude, 'lat')
  const lngLabel = formatCoordinate(emergency.longitude, 'lng')

  return (
    <Box component="main" sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default, pb: theme.size(12), fontFamily: theme.typography.fontFamily }}>
      {/* Sticky Header Banner */}
      <Box sx={{ backgroundColor: theme.palette.error.main, color: 'white', py: 2, px: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
        <MonitorHeartRoundedIcon fontSize="small" />
        <Typography sx={{ fontWeight: 900, fontSize: theme.customSizes.font.small, letterSpacing: '0.1em' }}>ALERTA DE EMERGENCIA</Typography>
      </Box>

      <Box sx={{ maxWidth: 480, mx: 'auto', p: 2, pt: 4 }}>
        {/* Person Identity Chip */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Chip
            icon={<PlaceRoundedIcon sx={{ fontSize: 16 }} />}
            label={`QR de ${emergency.name}`}
            sx={{ backgroundColor: theme.palette.custom.tertiary[20], color: theme.palette.custom.tertiary[100], fontWeight: 800, fontSize: theme.customSizes.font.small, letterSpacing: '0.05em', px: 1, py: 2.5, borderRadius: theme.customSizes.radius.pill }}
          />
        </Box>

        {/* Context Message */}
        <InfoSection title="¿POR QUÉ RECIBISTE ESTE AVISO?" icon={<InfoOutlinedIcon sx={{ fontSize: 20 }} />} bgColor={theme.palette.custom.primary[10]} color={theme.palette.text.primary} shadowColor={theme.palette.custom.primary[10]}>
          <Typography sx={{ fontSize: theme.customSizes.font.base, fontWeight: 500, lineHeight: 2, color: theme.palette.text.primary }}>
            El código QR de emergencia de{' '}
            <span style={{ fontWeight: 900, color: theme.palette.custom.primary[100] }}>{emergency.name.toUpperCase()}</span>{' '}
            fue escaneado. Como contacto de confianza, recibes este mensaje para que puedas verificar su situación y actuar si es necesario.
          </Typography>
          <Typography sx={{ fontSize: theme.customSizes.font.base, fontWeight: 500, lineHeight: 2, color: theme.palette.text.secondary }}>
            A continuación encontrarás la ubicación aproximada donde ocurrió el escaneo y accesos rápidos para localizar hospitales cercanos.
          </Typography>
        </InfoSection>

        {/* Event Details */}
        <InfoSection title="DETALLES DEL EVENTO" icon={<PinDropRoundedIcon sx={{ fontSize: 20 }} />} bgColor={theme.palette.grey[100]} color={theme.palette.text.primary}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AccessTimeRoundedIcon fontSize="large" sx={{ color: theme.palette.primary.main, bgcolor: 'white', borderRadius: theme.customSizes.radius.md, p: 1 }} />
            <Box>
              <Typography sx={{ fontSize: theme.customSizes.font.small, fontWeight: 800, color: 'text.secondary', letterSpacing: '0.08em' }}>FECHA Y HORA DEL ESCANEO</Typography>
              <Typography sx={{ fontSize: theme.customSizes.font.lg, fontWeight: 900, color: 'text.primary', lineHeight: 1.2 }}>{dateTimeLabel}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PlaceRoundedIcon fontSize="large" sx={{ color: theme.palette.error.main, bgcolor: 'white', borderRadius: theme.customSizes.radius.md, p: 1 }} />
            <Box>
              <Typography sx={{ fontSize: theme.customSizes.font.small, fontWeight: 800, color: 'text.secondary', letterSpacing: '0.08em' }}>COORDENADAS</Typography>
              <Typography sx={{ fontSize: theme.customSizes.font.lg, fontWeight: 900, color: 'text.primary', lineHeight: 1.3, fontVariantNumeric: 'tabular-nums' }}>{latLabel}</Typography>
              <Typography sx={{ fontSize: theme.customSizes.font.lg, fontWeight: 900, color: 'text.primary', lineHeight: 1.3, fontVariantNumeric: 'tabular-nums' }}>{lngLabel}</Typography>
            </Box>
          </Box>
        </InfoSection>

        {/* Quick Action Buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.size(3) }}>
          <Typography sx={{ fontSize: theme.customSizes.font.small, fontWeight: 900, color: 'text.secondary', letterSpacing: '0.1em', textTransform: 'uppercase', mb: 1 }}>
            Acciones rápidas
          </Typography>
          <Button variant="contained" color="primary" fullWidth href={mapsUrl} target="_blank" rel="noopener noreferrer" startIcon={<MapRoundedIcon />}
            sx={{ minHeight: 56, borderRadius: theme.customSizes.radius.lg, fontSize: theme.customSizes.font.base, fontWeight: 900, letterSpacing: '0.05em', boxShadow: `0 4px 16px ${theme.palette.custom.primary[30]}` }}>
            Ver ubicación en mapa
          </Button>
          <Button variant="contained" color="error" fullWidth href={hospitalsUrl} target="_blank" rel="noopener noreferrer" startIcon={<LocalHospitalRoundedIcon />}
            sx={{ minHeight: 56, borderRadius: theme.customSizes.radius.lg, fontSize: theme.customSizes.font.base, fontWeight: 900, letterSpacing: '0.05em', boxShadow: `0 4px 16px ${theme.palette.custom.tertiary[20]}` }}>
            Buscar hospitales cercanos
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
