import { Card, CardContent, Typography } from "@mui/material"

export function EmptyProfile() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" fontWeight={700}>No tienes perfiles creados</Typography>
      </CardContent>
    </Card>
  )
}