import { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  InputLabel,
  Button,
  Card,
  Chip,
  useTheme,
} from '@mui/material'
import type { Theme } from '@mui/material/styles'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import WatchIcon from '@mui/icons-material/Watch'

const WHATSAPP_PHONE = '573000000000'

interface BuyFormData {
  name: string
  lastName: string
  email: string
  phone: string
}

const INITIAL_FORM: BuyFormData = {
  name: '',
  lastName: '',
  email: '',
  phone: '',
}

function buildWhatsAppUrl(form: BuyFormData): string {
  const message = [
    '*Nueva solicitud de compra -- QuienEs*',
    '',
    '*Nombre:* ' + form.name + ' ' + form.lastName,
    '*Email:* ' + form.email,
    '*Telefono:* ' + form.phone,
    '',
    'Hola, estoy interesado(a) en adquirir la pulsera de identificacion medica QuienEs. Me podrian dar mas informacion sobre disponibilidad y opciones de pago?',
  ].join('\n')

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`
}

export function PurchaseForm() {
  const theme = useTheme()
  const [form, setForm] = useState<BuyFormData>(() => ({ ...INITIAL_FORM }))
  const [submitted, setSubmitted] = useState(false)

  const isFormValid =
    form.name.trim() !== '' &&
    form.lastName.trim() !== '' &&
    form.email.trim() !== '' &&
    form.phone.trim() !== ''

  const handleChange = (field: keyof BuyFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setSubmitted(true)

    // Small delay so the user sees the success state before redirect
    setTimeout(() => {
      window.open(buildWhatsAppUrl(form), '_blank', 'noopener,noreferrer')
    }, 600)
  }

  const handleReset = () => {
    setForm({ ...INITIAL_FORM })
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <Card
        sx={{
          p: { xs: 4, md: 5 },
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        {/* Success animation circle */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: theme.customSizes.radius.circle,
            bgcolor: (t: Theme) => t.palette.custom.primary[10],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { boxShadow: '0 0 0 0 rgba(0, 110, 42, 0.3)' },
              '70%': { boxShadow: '0 0 0 16px rgba(0, 110, 42, 0)' },
              '100%': { boxShadow: '0 0 0 0 rgba(0, 110, 42, 0)' },
            },
          }}
        >
          <WhatsAppIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            fontSize: theme.customSizes.font.xl,
          }}
        >
          ¡Redirigiendo a WhatsApp!
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: theme.customSizes.font.base,
            maxWidth: 360,
            lineHeight: 1.6,
          }}
        >
          Tu información ha sido preparada. Serás redirigido a WhatsApp para continuar con el proceso
          de compra.
        </Typography>
        <Button
          variant="outlined"
          onClick={handleReset}
          sx={{
            borderRadius: theme.customSizes.radius.pill,
            px: 4,
            mt: 1,
          }}
        >
          Enviar otra solicitud
        </Button>
      </Card>
    )
  }

  return (
    <Card sx={{ p: 4 }}>
      {/* Product badge — mobile only */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 3,
          pb: 3,
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            bgcolor: (t: Theme) => t.palette.custom.primary[10],
            borderRadius: theme.customSizes.radius.lg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <WatchIcon sx={{ color: 'primary.main', fontSize: 24 }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: theme.customSizes.font.lg, color: 'text.primary' }}>
            Pulsera QuienEs
          </Typography>
          <Typography sx={{ fontSize: theme.customSizes.font.small, color: 'text.secondary' }}>
            Identificación médica de emergencia
          </Typography>
        </Box>
      </Box>

      {/* Form header */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: 'text.primary',
          mb: 1,
          fontSize: theme.customSizes.font.xl,
        }}
      >
        Datos de contacto
      </Typography>
      <Typography
        sx={{
          color: 'text.secondary',
          fontSize: theme.customSizes.font.base,
          mb: 4,
          lineHeight: 2,
        }}
      >
        Completa tus datos y te contactaremos por WhatsApp para finalizar tu compra.
      </Typography>

      {/* Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: (t: Theme) => t.size(6),
        }}
      >
        {/* Name row */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          <Box>
            <InputLabel shrink htmlFor="buy-name">NOMBRE *</InputLabel>
            <TextField
              id="buy-name"
              fullWidth
              value={form.name}
              onChange={handleChange('name')}
              placeholder="Ej: Juan"
              required
            />
          </Box>
          <Box>
            <InputLabel shrink htmlFor="buy-lastname">APELLIDO *</InputLabel>
            <TextField
              id="buy-lastname"
              fullWidth
              value={form.lastName}
              onChange={handleChange('lastName')}
              placeholder="Ej: Pérez"
              required
            />
          </Box>
        </Box>

        {/* Email */}
        <Box>
          <InputLabel shrink htmlFor="buy-email">EMAIL *</InputLabel>
          <TextField
            id="buy-email"
            fullWidth
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="nombre@ejemplo.com"
            required
          />
        </Box>

        {/* Phone */}
        <Box>
          <InputLabel shrink htmlFor="buy-phone">TELÉFONO *</InputLabel>
          <TextField
            id="buy-phone"
            fullWidth
            type="tel"
            value={form.phone}
            onChange={handleChange('phone')}
            placeholder="300 123 4567"
            required
          />
        </Box>

        {/* Submit */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={!isFormValid}
          startIcon={<WhatsAppIcon />}
          sx={{
            mt: 2,
            py: 2,
            fontSize: theme.customSizes.font.lg,
            borderRadius: theme.customSizes.radius.pill,
            boxShadow: '0 8px 24px rgba(0, 110, 42, 0.2)',
          }}
        >
          Continuar por WhatsApp
        </Button>

        {/* Trust badges */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1,
            mt: 1,
          }}
        >
          <Chip
            icon={<LocalShippingIcon sx={{ fontSize: 16 }} />}
            label="Envío nacional"
            size="small"
            sx={{
              bgcolor: (t: Theme) => t.palette.custom.neutral[100],
              color: 'text.secondary',
              fontSize: theme.customSizes.font.tiny,
              fontWeight: 600,
            }}
          />
          <Chip
            icon={<VerifiedUserIcon sx={{ fontSize: 16 }} />}
            label="Compra segura"
            size="small"
            sx={{
              bgcolor: (t: Theme) => t.palette.custom.neutral[100],
              color: 'text.secondary',
              fontSize: theme.customSizes.font.tiny,
              fontWeight: 600,
            }}
          />
          <Chip
            icon={<WhatsAppIcon sx={{ fontSize: 16 }} />}
            label="Atención directa"
            size="small"
            sx={{
              bgcolor: (t: Theme) => t.palette.custom.neutral[100],
              color: 'text.secondary',
              fontSize: theme.customSizes.font.tiny,
              fontWeight: 600,
            }}
          />
        </Box>
      </Box>
    </Card>
  )
}
