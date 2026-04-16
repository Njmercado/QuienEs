import { useState } from 'react'
import {
  Box,
  Button,
  Typography,
  Grid,
  useTheme,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import toast from 'react-hot-toast'
import { SideDrawer } from './ui/SideDrawer'
import { Modal } from './ui/Modal'
import { ConditionCard } from './ui/ConditionCard'
import { ConditionForm } from './ui/ConditionForm'
import { 
  useGetMedicalConditionsQuery, 
  useCreateMedicalConditionMutation, 
  useUpdateMedicalConditionMutation, 
  useDeleteMedicalConditionMutation 
} from '../store/endpoints/medicalConditionsApi'
import type { Condition, ConditionData } from '../objects/condition'
import { EmptyState } from './ui/EmptyState'

export function Conditions() {
  const theme = useTheme()
  const { data: conditions = [] } = useGetMedicalConditionsQuery()
  const [editingCondition, setEditingCondition] = useState<Condition>()
  const [deletingId, setDeletingId] = useState<string>()
  const [openDrawer, setOpenDrawer] = useState(false)
  const [createCondition] = useCreateMedicalConditionMutation()
  const [updateCondition] = useUpdateMedicalConditionMutation()
  const [deleteCondition] = useDeleteMedicalConditionMutation()

  const handleOpenCreate = () => {
    setEditingCondition(undefined)
    setOpenDrawer(true)
  }

  const handleOpenEdit = (condition: Condition) => {
    setEditingCondition(condition)
    setOpenDrawer(true)
  }

  const handleCloseDrawer = () => {
    setEditingCondition(undefined)
    setOpenDrawer(false)
  }

  const handleSave = async (data: ConditionData) => {
    try {
      await createCondition(data).unwrap()
      toast.success(`Condición "${data.title}" guardada`)
      handleCloseDrawer()
    } catch {
      toast.error('Error al guardar la condición')
    }
  }

  const handleUpdate = async (data: Condition) => {
    try {
      await updateCondition(data).unwrap()
      toast.success(`Condición "${data.title}" actualizada`)
      handleCloseDrawer()
    } catch {
      toast.error('Error al actualizar la condición')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingId) return
    try {
      await deleteCondition(deletingId).unwrap()
      toast.success('Condición eliminada')
    } catch {
      toast.error('Error al eliminar la condición')
    } finally {
      setDeletingId(undefined)
    }
  }

  const deletingCondition = conditions.find((c) => c.id === deletingId)

  return (
    <Box component="main" height="100vh">
      <Box sx={{ p: 4 }}>
        {/* Header */}
        <Box component="header" sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontSize: theme.customSizes.font.small, fontWeight: 700, color: 'text.primary' }}>
              PANEL DE CONTROL
            </Typography>
            <Typography variant="h3" fontWeight={700} sx={{ color: theme.palette.primary.main }}>
              Condiciones Médicas
            </Typography>
          </Box>
          <Button
            onClick={handleOpenCreate}
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            sx={{ bgcolor: theme.palette.custom.primary[100] }}
          >
            Agregar Condición
          </Button>
        </Box>

        {/* Content */}
        {conditions.length === 0 ? (
          <EmptyState
            title="No tienes condiciones médicas registradas"
            description="Agrega tu primera condición médica para mantener tu perfil de emergencia actualizado"
            color={theme.palette.custom.primary[30]}
          />
        ) : (
          <Grid container columns={12} spacing={2}>
            {conditions.map((condition) => (
              <Grid key={condition.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <ConditionCard
                  condition={condition}
                  onEdit={handleOpenEdit}
                  onDelete={(id) => setDeletingId(id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Create / Edit Drawer */}
      <SideDrawer
        isOpen={openDrawer}
        onClose={handleCloseDrawer}
        title={editingCondition ? 'Editar Condición' : 'Nueva Condición'}
        permanent={false}
      >
        <ConditionForm
          condition={editingCondition}
          onSave={handleSave}
          onUpdate={handleUpdate}
          onCancel={handleCloseDrawer}
        />
      </SideDrawer>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(undefined)}
        title="Eliminar Condición"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography>
            ¿Estás seguro de que deseas eliminar la condición{' '}
            <strong>"{deletingCondition?.title}"</strong>? Esta acción no se puede deshacer.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => setDeletingId(undefined)}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteConfirm}
            >
              Eliminar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}