import { Box, Button, Typography } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'

export interface QRProps {
  qrCode: string
}

export const QR = ({ qrCode }: QRProps) => {
  const downloadImage = () => {
    const link = document.createElement('a')
    link.href = qrCode
    link.download = 'qr-code.png'
    link.click()
  }

  return (
    <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <Box
        sx={{
          position: 'relative',
          width: 192,
          height: 192,
          bgcolor: 'white',
          p: 1,
          borderRadius: 2,
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            bgcolor: 'white',
            filter: 'blur(24px)',
            opacity: 0.2,
            borderRadius: 2,
            transition: 'opacity 0.3s',
          },
          '&:hover::before': {
            opacity: 0.4,
          },
        }}
      >
        <Box
          component="img"
          src={qrCode}
          alt="Tu clave QR personal"
          sx={{ width: '100%', height: '100%', objectFit: 'contain', position: 'relative', zIndex: 1 }}
        />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280 }}>
        Escanea este código para acceder instantáneamente a tu perfil público.
      </Typography>

      <Button
        onClick={downloadImage}
        variant="text"
        startIcon={<DownloadIcon />}
        sx={{
          color: 'text.secondary',
          letterSpacing: '0.1em',
          '&:hover': { color: 'text.primary' },
        }}
      >
        Descargar QR
      </Button>
    </Box>
  )
}