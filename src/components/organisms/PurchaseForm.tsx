import { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  Chip,
  Stepper,
  Step,
  StepLabel,
  useTheme,
} from '@mui/material'
import type { Theme } from '@mui/material/styles'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import WatchIcon from '@mui/icons-material/Watch'
import { type EngravingData, type ContactData } from '../../objects'
import { buildWhatsAppUrl } from '../../utils'
import { ContactDataPurchaseFormStep, EngravingDataPurchaseFormStep } from '../molecules'
import { INITIAL_CONTACT, INITIAL_ENGRAVING } from '../../constants'

const STEPS = {
  CONTACT_DATA: {
    index: 0,
    label: 'Datos de contacto'
  },
  ENGRAVING: {
    index: 1,
    label: 'Grabado'
  },
  CONFIRM: {
    index: 2,
    label: 'Confirmar'
  }
}

function ProductBadge() {
  const theme = useTheme()
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, pb: 3, }}>
      <Box
        sx={{
          width: 48, height: 48,
          bgcolor: (t: Theme) => t.palette.custom.primary[10],
          borderRadius: (t: Theme) => t.customSizes.radius.lg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
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
  )
}

function TrustBadges() {
  const theme = useTheme()
  const chipSx = {
    bgcolor: (t: Theme) => t.palette.custom.neutral[100],
    color: 'text.secondary',
    fontSize: theme.customSizes.font.tiny,
    fontWeight: 600,
  }
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
      <Chip icon={<LocalShippingIcon sx={{ fontSize: 16 }} />} label="Envío nacional" size="small" sx={chipSx} />
      <Chip icon={<VerifiedUserIcon sx={{ fontSize: 16 }} />} label="Compra segura" size="small" sx={chipSx} />
      <Chip icon={<WhatsAppIcon sx={{ fontSize: 16 }} />} label="Atención directa" size="small" sx={chipSx} />
    </Box>
  )
}

function ConfirmRow({ label, value }: { label: string; value?: string }) {
  const theme = useTheme()
  if (!value) return null
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
      <Typography sx={{ fontSize: theme.customSizes.font.small, color: 'text.secondary', fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: theme.customSizes.font.small, color: 'text.primary' }}>
        {value}
      </Typography>
    </Box>
  )
}

export function PurchaseForm() {
  const theme = useTheme()
  const [step, setStep] = useState(0)
  const [contact, setContact] = useState<ContactData>(INITIAL_CONTACT)
  const [wantsEngraving, setWantsEngraving] = useState(true)
  const [engraving, setEngraving] = useState<EngravingData>(INITIAL_ENGRAVING)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<boolean>(true)

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => {
      window.open(buildWhatsAppUrl(contact, engraving, wantsEngraving), '_blank', 'noopener,noreferrer')
    }, 600)
  }

  const handleReset = () => {
    setContact({ ...INITIAL_CONTACT })
    setEngraving({ ...INITIAL_ENGRAVING })
    setWantsEngraving(true)
    setSubmitted(false)
    setStep(0)
  }

  if (submitted) {
    return (
      <Card sx={{ p: { xs: 4, md: 5 }, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
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
              '0%': { boxShadow: '0 0 0 0 rgba(0,110,42,0.3)' },
              '70%': { boxShadow: '0 0 0 16px rgba(0,110,42,0)' },
              '100%': { boxShadow: '0 0 0 0 rgba(0,110,42,0)' },
            },
          }}
        >
          <WhatsAppIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: theme.customSizes.font.xl }}>
          ¡Redirigiendo a WhatsApp!
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: theme.customSizes.font.base, maxWidth: 360, lineHeight: 1.6 }}>
          Tu información ha sido preparada. Serás redirigido a WhatsApp para continuar con el proceso de compra.
        </Typography>
        <Button variant="outlined" onClick={handleReset} sx={{ borderRadius: theme.customSizes.radius.pill, px: 4, mt: 1 }}>
          Enviar otra solicitud
        </Button>
      </Card>
    )
  }

  return (
    <Card sx={{ p: 4 }}>
      <ProductBadge />

      {/* Stepper */}
      <Stepper
        activeStep={step}
        orientation="horizontal"
        alternativeLabel
        sx={{ mb: 4 }}
      >
        {Object.values(STEPS).map((step) => (
          <Step key={step.index}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* ── Step 0: Contact data ── */}
      {step === STEPS.CONTACT_DATA.index && (
        <ContactDataPurchaseFormStep
          data={contact}
          onChange={(data, error) => {
            setContact(data)
            setError(error)
          }}
        />
      )}

      {/* ── Step 1: Engraving */}
      {step === STEPS.ENGRAVING.index && (
        <EngravingDataPurchaseFormStep
          data={engraving}
          contact={contact}
          engrave={wantsEngraving}
          onChange={(data, error) => {
            setEngraving(data)
            setError(error)
          }}
          onEngravingCheck={setWantsEngraving}
        />
      )}

      {/* ── Confirm step ── */}
      {step === STEPS.CONFIRM.index && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: theme.customSizes.font.xl, color: 'text.primary', mb: 1 }}>
              Confirmar pedido
            </Typography>
            <Typography sx={{ fontSize: theme.customSizes.font.base, color: 'text.secondary', mb: 3 }}>
              Revisa tus datos antes de continuar por WhatsApp.
            </Typography>
          </Box>

          {/* Contact summary */}
          <Card sx={{ p: 3, bgcolor: (t: Theme) => t.palette.custom.primary[10] }}>
            <Typography sx={{ fontWeight: 700, fontSize: theme.customSizes.font.small, color: 'primary.main', mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Datos de contacto
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <ConfirmRow label="Nombre" value={`${contact?.name} ${contact?.lastName}`} />
              <ConfirmRow label="Email" value={contact?.email} />
              <ConfirmRow label="Teléfono" value={contact?.phone} />
            </Box>
          </Card>

          {/* Engraving summary — only if user chose engraving */}
          {wantsEngraving && (
            <Card sx={{ p: 3, bgcolor: (t: Theme) => t.palette.custom.neutral[100] }}>
              <Typography sx={{ fontWeight: 700, fontSize: theme.customSizes.font.small, color: 'text.secondary', mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Grabado
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <ConfirmRow label="Tipo de sangre" value={engraving?.rh} />
                <ConfirmRow label="Condición médica" value={engraving?.condition} />
                <ConfirmRow label="Contacto SOS" value={[engraving?.sosRelationship, engraving?.sosPhone].filter(Boolean).join(': ')} />
              </Box>
            </Card>
          )}
          <TrustBadges />
        </Box>
      )}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mt: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<ArrowBackIcon />}
          onClick={() => setStep(step - 1)}
          disabled={step === STEPS.CONTACT_DATA.index}
          sx={{ borderRadius: theme.customSizes.radius.pill, order: { xs: 2, sm: 1 }, py: { xs: 1, sm: 'inherit' } }}
        >
          Atrás
        </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => {
            if (step === STEPS.CONFIRM.index) {
              handleSubmit()
            } else {
              setStep(step + 1)
            }
          }}
          startIcon={step === STEPS.CONFIRM.index && <WhatsAppIcon />}
          endIcon={step !== STEPS.CONFIRM.index && <ArrowForwardIcon />}
          sx={{ py: { xs: 1.5, sm: 2 }, borderRadius: theme.customSizes.radius.pill, order: { xs: 1, sm: 2 } }}
          disabled={error}
        >
          {step === STEPS.CONFIRM.index ? 'Ir a WhatsApp' : 'Continuar'}
        </Button>
      </Box>
    </Card>
  )
}
