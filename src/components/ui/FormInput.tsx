import { type ComponentProps } from 'react'
import { TextField } from '@mui/material'

interface FormInputProps extends Omit<ComponentProps<'input'>, 'onChange'> {
  label: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function FormInput({ label, value, onChange, onClick, type = 'text', placeholder, ...props }: FormInputProps) {
  return (
    <TextField
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      onClick={onClick as React.MouseEventHandler<HTMLDivElement>}
      placeholder={placeholder}
      fullWidth
      variant="standard"
      InputLabelProps={{
        sx: { textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.15em' },
      }}
      inputProps={props}
    />
  )
}
