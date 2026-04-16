import { Button, Grid } from "@mui/material"
import { FormInput } from "./FormInput"
import { FormSelect } from "./FormSelect"
import { useGetUserQuery, useUpdateUserMutation } from "../../store/endpoints/usersApi"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import type { User } from "../../objects/user"

export function UpdateUserSettings() {
  const { data: user } = useGetUserQuery()
  const [updateUser] = useUpdateUserMutation()
  const [form, setForm] = useState<User | null>(null)

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value } as User)
  }

  useEffect(() => {
    if (user) {
      setForm(user)
    }
  }, [user])

  return (
    <Grid container columns={12} spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormInput
          label="Nombre"
          name="name"
          value={form?.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormInput
          label="Apellido"
          name="last_name"
          value={form?.last_name}
          onChange={(e) => handleChange('last_name', e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormSelect
          label="Tipo de Documento"
          name="id_type"
          value={form?.id_type}
          onChange={(e) => handleChange('id_type', e.target.value)}
          options={['CC', 'CE', 'PAS', 'TI']}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormInput
          label="Número de Documento"
          name="id_number"
          value={form?.id_number}
          onChange={(e) => handleChange('id_number', e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormSelect
          label="Tipo de Sangre"
          name="rh"
          value={form?.rh}
          onChange={(e) => handleChange('rh', e.target.value)}
          options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormSelect
          label="Sexo"
          name="sex"
          value={form?.sex}
          onChange={(e) => handleChange('sex', e.target.value)}
          options={['Masculino', 'Femenino', 'Otro']}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormInput
          label="Lugar de Nacimiento"
          name="from"
          value={form?.from}
          onChange={(e) => handleChange('from', e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormInput
          label="Vivo en"
          name="living_in"
          value={form?.living_in}
          onChange={(e) => handleChange('living_in', e.target.value)}
        />
      </Grid>
      <Grid size={2}>
        <FormInput
          label="Indicativo"
          name="personal_phone_indicative"
          value={form?.personal_phone_indicative}
          onChange={(e) => handleChange('personal_phone_indicative', e.target.value)}
        />
      </Grid>
      <Grid size={10}>
        <FormInput
          label="Teléfono"
          name="personal_phone_number"
          value={form?.personal_phone_number}
          onChange={(e) => handleChange('personal_phone_number', e.target.value)}
        />
      </Grid>
      <Grid size={12} display='flex' justifyContent='flex-end'>
        <Button
          variant="contained"
          onClick={async () => {
            try {
              await updateUser(form as User).unwrap()
              toast.success('Usuario actualizado correctamente')
            } catch {
              toast.error('Error al actualizar el usuario')
            }
          }}
        >
          Actualizar
        </Button>
      </Grid>
    </Grid>
  )
}