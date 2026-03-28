import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useProfiles } from '../hooks/useProfiles'
import { type Profile as ProfileType } from '../objects/profile'
import { useEffect, useState } from 'react'
import { Profile } from './ui/Profile'
import toast from 'react-hot-toast'
import { SideDrawer } from './ui/SideDrawer'
import { ProfileCard } from './ui/ProfileCard'
import {
  Box,
  Button,
  Typography,
  useTheme,
  Card,
  CardContent,
  Paper,
  Grid
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import MenuIcon from '@mui/icons-material/Menu'
import { useQR } from '../hooks/useQR'
import { EmptyProfile } from './ui/EmptyProfiles'
import { ProfileChosenCard } from './ui/ProfileChosenCard'

export function Dashboard() {
  const [openProfileDrawer, setOpenProfileDrawer] = useState(false)
  const { qrCode, generateQR } = useQR()
  const { user } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()
  const { profiles, loadProfiles, removeProfile, chooseProfile } = useProfiles()
  const [editingProfile, setEditingProfile] = useState<ProfileType>()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const reloadProfiles = () => {
    if (!user) return
    supabase.from('PublicUser').select('*').eq('user_id', user.id).then(({ data }) => {
      loadProfiles(data ?? [])
    })
  }

  useEffect(() => {
    generateQR(user?.id)
    reloadProfiles()
  }, [])

  const createProfile = async (profile: ProfileType) => {
    const { error } = await supabase.from('PublicUser').insert({
      profile_description: profile.profile_description,
      profile_title: profile.profile_title,
      data: profile.data,
      chosen: profile.chosen,
      user_id: user?.id,
    })

    if (error) {
      toast.error('Error saving profile')
      return
    }

    reloadProfiles()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    toast.success(`Perfil ${profile.profile_title} guardado`)
  }

  const updateProfile = async (profile: ProfileType) => {
    const { error } = await supabase
      .from('PublicUser')
      .update({
        profile_description: profile.profile_description,
        profile_title: profile.profile_title,
        data: profile.data,
        chosen: profile.chosen,
      })
      .eq('id', profile.id)
      .eq('user_id', user?.id)

    if (error) {
      toast.error('Error updating profile')
      return
    }

    toast.success(`Perfil ${profile.profile_title} actualizado`)
  }

  const updateChosenStatus = async (id: string, profile: ProfileType) => {
    const { error } = await supabase
      .from('PublicUser')
      .update({ chosen: true })
      .eq('id', id)
      .eq('user_id', user?.id)

    if (error) {
      toast.error('Error updating profile')
      return
    }

    chooseProfile(id)
    toast.success(`Cambios guardados para: ${profile.profile_title}`)
  }

  const handleDeleteProfile = async (id: string) => {
    const profile = profiles.find((p) => p.id == id)
    if (profile?.chosen) {
      toast.error('No puedes eliminar el perfil activo, primero cambia de perfil y luego elimina')
      return
    }

    const { error } = await supabase.from('PublicUser').delete().eq('id', id).eq('user_id', user?.id)

    if (error) {
      toast.error('Error deleting profile')
      return
    }

    removeProfile(id)
    toast.success('Perfil eliminado')
  }

  const createNewProfileButton = () => {
    return (
      <Button
        onClick={() => setOpenProfileDrawer(true)}
        variant="contained"
        size="small"
        startIcon={<AddIcon />}
        sx={{
          bgcolor: theme.palette.custom.accentDark,
        }}
      >
        Crear Nuevo Perfil
      </Button>
    )
  }

  const handleOnCloseDrawer = () => {
    setEditingProfile(undefined)
    setOpenProfileDrawer(false)
  }

  const handleShareProfile = (id: string) => {
    window.open(`/public/${id}`, '_blank');
  }

  const mainProfile = profiles.find((p) => p.chosen);
  const otherProfiles = profiles.filter((p) => !p.chosen);

  if (profiles.length === 0 || !mainProfile || !otherProfiles) {
    return <EmptyProfile />
  }

  return (
    <Box component="main">
      {/* Header */}
      <Box component="header" sx={{ bgcolor: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 4, p: 4 }}>
        <MenuIcon sx={{ fontSize: theme.customSizes.font.h3, color: theme.palette.custom.accentDark }} />
        <Typography
          fontWeight={600}
          sx={{ color: theme.palette.custom.accentDark, fontSize: theme.customSizes.font.xl }}>
          INFORMACION DE EMERGENCIA
        </Typography>
      </Box>

      <Box sx={{ maxWidth: '80%', mx: 'auto', p: 4 }}>
        {/* User information */}
        <Box component="header" sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontSize: theme => theme.customSizes.font.small, fontWeight: 700, color: theme => theme.palette.custom.neutralDark }}> PANEL DE CONTROL </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="h3" fontWeight={700} sx={{ flexGrow: 1, color: theme => theme.palette.primary.main }}>
                Hola, {user?.identities?.[0].identity_data?.display_name}
              </Typography>
            </Box>
          </Box>
          {createNewProfileButton()}
        </Box>

        {/* Profile content*/}
        <Box>
          {/* MAIN PROFILE */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 2 }}>
            <ProfileChosenCard
              profile={mainProfile}
              onEdit={(profile: ProfileType) => {
                setEditingProfile(profile)
                setOpenProfileDrawer(true)
              }}
              onShare={(id: string) => {
                handleShareProfile(id)
              }}
            />

            {/* QR INFORMATION AND BAND ID */}
            <Card sx={{ bgcolor: theme.palette.custom.accentDark }}>
              <CardContent sx={{ display: 'grid', gridTemplateRows: '1fr 3fr 1fr', gap: 1 }}>
                <Typography sx={{ color: theme.palette.primary.contrastText, fontWeight: 700, fontSize: theme.customSizes.font.xl, textAlign: 'center' }}>INFORMACION QR</Typography>
                <Box display='flex' alignItems='center' justifyContent='center'>
                  <img src={qrCode} alt="QR Code" style={{ borderRadius: '10px', border: '1px solid white' }} />
                </Box>
                <Paper sx={{ bgcolor: theme.palette.custom.transparent, p: 2, display: 'flex', gap: 2, flexDirection: 'column', textAlign: 'center' }}>
                  <Typography sx={{ color: theme.palette.primary.contrastText, fontWeight: 700, fontSize: theme.customSizes.font.small }}>ID BANDA</Typography>
                  {/* TODO: Add band id, this current one is just for testing */}
                  <Typography sx={{ color: theme.palette.custom.neutralLight, fontSize: theme.customSizes.font.lg }}>KGD-772-NM</Typography>
                </Paper>
              </CardContent>
            </Card>
          </Box>
        </Box>

        <Grid container columns={12} spacing={2} aria-label="Profiles List" mt={4}>
          {otherProfiles.map((profile) => (
            <Grid key={profile.id} size={{ xs: 12, sm: 6, md: 4, lg: 6 }}>
              <ProfileCard
                profile={profile}
                onEdit={(profile: ProfileType) => {
                  setEditingProfile(profile)
                  setOpenProfileDrawer(true)
                }}
                onDelete={(id: string) => handleDeleteProfile(id)}
                onSelect={(id: string) => updateChosenStatus(id, profile)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Profile Drawer */}
      <SideDrawer isOpen={openProfileDrawer} onClose={handleOnCloseDrawer} title="Nuevo Perfil">
        <Profile
          onSave={(profile: ProfileType) => {
            if (profile.id) {
              updateProfile(profile)
            } else {
              createProfile(profile)
            }
            handleOnCloseDrawer()
          }}
          onDelete={(id: string) => {
            handleDeleteProfile(id)
            handleOnCloseDrawer()
          }}
          profile={editingProfile}
        />
      </SideDrawer>
    </Box>
  )
}
