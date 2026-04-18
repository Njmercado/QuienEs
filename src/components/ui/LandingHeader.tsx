import { Box, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import { ROUTES } from '../../constants'

export function LandingHeader() {
  return (
    <Box
      component="header"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 50,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: { xs: 3, md: 4 },
        height: 64,
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <MedicalServicesIcon
          sx={{ color: 'primary.main', fontSize: 28 }}
        />
        <Typography
          sx={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'primary.main',
            letterSpacing: '-0.02em',
          }}
        >
          QuienEs
        </Typography>
      </Box>
      <Button
        component={Link}
        to={ROUTES.LOG_IN}
        variant="contained"
        color="primary"
        sx={{
          borderRadius: theme => theme.customSizes.radius.pill,
          px: 3,
          py: 1,
        }}
      >
        Login
      </Button>
    </Box>
  )
}
