import { Box, Typography, Link as MuiLink } from '@mui/material'

const FOOTER_LINKS = ['Producto', 'Accesorios', 'Privacidad', 'Términos', 'Soporte']

export function LandingFooter() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        py: 6,
        px: { xs: 3, md: 4 },
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 3,
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'center', md: 'flex-start' },
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: theme => theme.customSizes.font.lg,
            fontWeight: 800,
            color: 'primary.main',
          }}
        >
          QuienEs
        </Typography>
        <Typography
          sx={{
            fontSize: theme => theme.customSizes.font.small,
            color: 'text.secondary',
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          © 2025 QuienEs. Mejorando la atención de emergencias.
        </Typography>
      </Box>

      <Box
        component="nav"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 3,
        }}
      >
        {FOOTER_LINKS.map((item) => (
          <MuiLink
            key={item}
            href="#"
            underline="hover"
            sx={{
              fontSize: theme => theme.customSizes.font.base,
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
            }}
          >
            {item}
          </MuiLink>
        ))}
      </Box>
    </Box>
  )
}
