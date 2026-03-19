import { useState } from 'react'
import { ProfileForm } from './ProfileForm'
import { type Profile as ProfileType } from '../../objects/profile'
import { Box, Button } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

interface CreateProfileProps {
  onSave: (profile: ProfileType) => void
}

export function CreateProfile({ onSave }: CreateProfileProps) {
  const [profile, setProfile] = useState<ProfileType>()

  const onUpdate = (profile: ProfileType) => {
    setProfile(profile)
  }

  const handleSave = () => {
    if (!profile) return
    onSave(profile)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <ProfileForm
        profile={{
          id: '',
          profile_title: '',
          profile_description: '',
          data: {
            fullName: '',
            rh: '',
            idType: '',
            idNumber: '',
            healthInsurance: '',
            healthInsuranceNumber: '',
            extraInfo: '',
            emergencyName: '',
            emergencyContact: '',
            emergencyRelationship: '',
          },
          chosen: false,
        }}
        onUpdate={onUpdate}
      />
      <Button
        onClick={handleSave}
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        startIcon={<AddCircleOutlineIcon />}
        sx={{ py: 1.8 }}
      >
        Crear perfil
      </Button>
    </Box>
  )
}