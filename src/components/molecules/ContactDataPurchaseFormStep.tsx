import {
  Box,
  Typography,
  useTheme,
} from '@mui/material'
import { FormInput } from '../atoms'
import { useState } from 'react'
import { type ContactData, type FormError } from '../../objects'
import { INITIAL_CONTACT } from '../../constants'

interface ContactDataPurchaseFormStepProps {
  data?: ContactData
  onChange: (contact: ContactData, error: boolean) => void
}

const INITIAL_CONTACT_ERROR: FormError<ContactData> = {
  name: true,
  lastName: true,
  email: true,
  phone: true,
}

export function ContactDataPurchaseFormStep({ data, onChange }: ContactDataPurchaseFormStepProps) {
  const theme = useTheme()
  const [form, setForm] = useState<ContactData>(data ?? INITIAL_CONTACT);
  const [formError, setFormError] = useState<FormError<ContactData>>(INITIAL_CONTACT_ERROR);

  const handleContactChange = (field: keyof ContactData) => (value: string, error: boolean = false) => {
    const newForm = { ...form, [field]: value };
    const newFormError = { ...formError, [field]: error };
    setForm(newForm);
    setFormError(newFormError)
    onChange(newForm, Object.values(newFormError).some((v) => v))
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: theme.customSizes.font.xl, color: 'text.primary', mb: 1 }}>
          Datos de contacto
        </Typography>
        <Typography sx={{ fontSize: theme.customSizes.font.base, color: 'text.secondary', mb: 3 }}>
          Te contactaremos por WhatsApp para finalizar tu compra.
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <FormInput label="Primer Nombre" id="buy-name" value={form?.name} onChange={handleContactChange('name')} placeholder="Ej: Juan" required />
        <FormInput label="Primer Apellido" id="buy-lastname" value={form?.lastName} onChange={handleContactChange('lastName')} placeholder="Ej: Pérez" required />
      </Box>
      <FormInput
        label="Email"
        id="buy-email"
        value={form?.email}
        onChange={handleContactChange('email')}
        placeholder="nombre@ejemplo.com"
        rules={[
          {
            validate: (v: string) => /^.+@\w+(\.\w+)+$/.test(v),
            errorMessage: 'El email es inválido'
          }
        ]}
        required
      />
      <FormInput
        label="Teléfono"
        id="buy-phone"
        value={form?.phone}
        onChange={handleContactChange('phone')}
        placeholder="300 123 4567"
        rules={[
          {
            validate: (v: string) => /^\d+$/.test(v),
            errorMessage: 'El teléfono debe contener solo números'
          },
          {
            validate: (v: string) => v.length >= 7 && v.length <= 10,
            errorMessage: 'El teléfono debe tener entre 7 y 10 dígitos'
          }
        ]}
        required
      />
    </Box>
  )
}