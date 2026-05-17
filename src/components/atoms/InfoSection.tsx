import { Box, Typography, useTheme } from '@mui/material'

export interface InfoSectionProps {
  title: string
  icon: React.ReactNode
  bgColor: string
  color: string
  shadowColor?: string
  children: React.ReactNode
}

export function InfoSection({ title, icon, bgColor, color, shadowColor = 'rgba(0,0,0,0.05)', children }: InfoSectionProps) {
  const theme = useTheme()
  return (
    <Box sx={{ mb: theme.size(6) }}>
      <Box
        sx={{
          backgroundColor: bgColor,
          color: color,
          borderRadius: theme.customSizes.radius.xl,
          display: 'flex',
          flexDirection: 'column',
          p: 3,
          boxShadow: `0 4px 12px ${shadowColor}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          {icon}
          <Typography
            sx={{
              fontSize: theme.customSizes.font.small,
              fontWeight: 900,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
