import { Box, Typography, useTheme } from '@mui/material'
import MonitorHeartRoundedIcon from '@mui/icons-material/MonitorHeartRounded'

export interface PageErrorProps {
  message?: string
  code?: string
}

export function PageError({ message = 'No se encontró la información solicitada.', code = '404' }: PageErrorProps) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Box
        sx={{
          p: 4,
          borderRadius: theme.customSizes.radius.xl,
          textAlign: 'center',
          maxWidth: 400,
          width: '100%',
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <MonitorHeartRoundedIcon sx={{ color: 'text.disabled', fontSize: 48, mb: 2 }} />
        <Typography variant="h2" fontWeight={900} sx={{ color: 'text.disabled' }}>
          {code}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontWeight: 600 }}>
          {message}
        </Typography>
      </Box>
    </Box>
  )
}
