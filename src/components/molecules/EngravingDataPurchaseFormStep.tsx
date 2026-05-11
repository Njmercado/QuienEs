import { useState } from 'react'
import { Box, Typography, useTheme, FormControlLabel, Checkbox } from '@mui/material'
import { EngravingTag, FormInput, FormSelect } from '../atoms'
import type { EngravingData, ContactData, FormError } from '../../objects'
import { INITIAL_ENGRAVING, RELATIONSHIP_OPTIONS, RH } from '../../constants'

export interface EngravingDataPurchaseFormStepProps {
  data?: EngravingData
  contact?: ContactData
  engrave?: boolean
  onChange: (data: EngravingData, error: boolean) => void
  onEngravingCheck: (engrave: boolean) => void
}

const INITIAL_ENGRAVING_ERROR: FormError<EngravingData> = {
  rh: true,
  condition: true,
  sosRelationship: true,
  sosPhone: true,
}

export function EngravingDataPurchaseFormStep({ data, contact, engrave, onChange, onEngravingCheck }: EngravingDataPurchaseFormStepProps) {
  const theme = useTheme()
  const [wantsEngraving, setWantsEngraving] = useState(engrave ?? true)
  const [form, setForm] = useState<EngravingData>(data ?? INITIAL_ENGRAVING)
  const [formError, setFormError] = useState<FormError<EngravingData>>(INITIAL_ENGRAVING_ERROR)

  const handle = (field: keyof EngravingData) => (value: string, error: boolean = false) => {
    const newForm = { ...form, [field]: value }
    const newFormError = { ...formError, [field]: error }
    setForm(newForm)
    setFormError(newFormError)
    onChange(newForm, Object.values(newFormError).some((v) => v))
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: theme.customSizes.font.xl, color: 'text.primary' }}>
          Grabado de pulsera
        </Typography>
        <Typography sx={{ fontSize: theme.customSizes.font.base, color: 'text.secondary', mt: 1 }}>
          Todos los campos son opcionales. El QR y tu nombre del paso anterior ya se incluyen.
        </Typography>
      </Box>

      <FormControlLabel
        control={
          <Checkbox
            checked={wantsEngraving}
            onChange={(e) => {
              setWantsEngraving(e.target.checked)
              onEngravingCheck(e.target.checked)
            }}
            sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }}
          />
        }
        label="Quiero personalizar el grabado de mi pulsera"
        sx={{ mt: 1 }}
      />

      {/* Form + Preview Tag — tag above form on xs, form-left/tag-right on sm */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr' },
        gap: { xs: 3, sm: 5 },
        alignItems: 'center',
      }}>
        <Box sx={{ order: { xs: 2, sm: 1 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormSelect
            placeholder="Tipo de sangre"
            value={data?.rh}
            onChange={(e) => handle('rh')(e.target.value)}
            options={Object.keys(RH).map((key) => ({ value: key, label: key }))}
            disabled={!wantsEngraving}
          />
          <FormInput
            placeholder="Condición médica"
            id="eng-condition"
            value={data?.condition}
            onChange={handle('condition')}
            rules={[
              {
                validate: (value) => value.length <= 20,
                errorMessage: 'La condición médica no debe exceder los 20 caracteres',
              },
            ]}
            disabled={!wantsEngraving}
          />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 2 }}>
            <FormSelect
              placeholder="Parentesco"
              value={data?.sosRelationship}
              onChange={(e) => handle('sosRelationship')(e.target.value)}
              options={RELATIONSHIP_OPTIONS}
              disabled={!wantsEngraving}
            />
            <FormInput
              id="eng-sos-phone"
              value={data?.sosPhone}
              onChange={handle('sosPhone')}
              placeholder="Número de teléfono"
              rules={[
                {
                  validate: (value) => /^[0-9]+$/.test(value),
                  errorMessage: 'Por favor ingrese un número de teléfono válido',
                },
                {
                  validate: (value) => value.length >= 7 && value.length <= 10,
                  errorMessage: 'El número de teléfono debe tener entre 7 y 10 dígitos',
                }
              ]}
              disabled={!wantsEngraving}
            />
          </Box>
        </Box>
        <Box sx={{ order: { xs: 1, sm: 2 }, display: 'flex', justifyContent: 'center' }}>
          <EngravingTag name={contact?.name} lastName={contact?.lastName} data={data} showEngraving={wantsEngraving} />
        </Box>
      </Box>
    </Box>
  )
}