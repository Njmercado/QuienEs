import { Box, Typography, useTheme } from '@mui/material'
import MonitorHeartRoundedIcon from '@mui/icons-material/MonitorHeartRounded'

export interface PageLoadingProps {
  message?: string
}

export function PageLoading({ message = 'CARGANDO...' }: PageLoadingProps) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: theme.customSizes.radius.circle,
          backgroundColor: theme.palette.custom.primary[10],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse 1.5s infinite',
          '@keyframes pulse': {
            '0%, 100%': { opacity: 1, transform: 'scale(1)' },
            '50%': { opacity: 0.6, transform: 'scale(1.1)' },
          },
        }}
      >
        <MonitorHeartRoundedIcon sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
      </Box>
      <Typography
        sx={{
          fontWeight: 800,
          color: 'text.disabled',
          letterSpacing: '0.15em',
          fontSize: theme.customSizes.font.small,
        }}
      >
        {message}
      </Typography>
    </Box>
  )
}
