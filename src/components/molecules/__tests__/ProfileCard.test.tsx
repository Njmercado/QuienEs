import { render, screen, fireEvent } from '@testing-library/react'
import { ProfileCard } from '../ProfileCard'
import type { Profile } from '../../../objects/profile'
import { mockTheme } from '../../../test-utils/mockTheme'

vi.mock('@mui/material/styles', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@mui/material/styles')>()
  return { ...actual, useTheme: () => mockTheme }
})

const mockProfile: Profile = {
  id: 'p1',
  profile_title: 'Perfil Principal',
  profile_description: 'Mi perfil de emergencia',
  chosen: false,
  medical_conditions: [],
  sos_contacts: [],
  insurance_name: '',
  insurance_number: '',
}

describe('ProfileCard', () => {
  const onEdit = vi.fn()
  const onDelete = vi.fn()
  const onSelect = vi.fn()
  afterEach(() => vi.clearAllMocks())

  it('renders profile title and description', () => {
    render(<ProfileCard profile={mockProfile} onEdit={onEdit} onDelete={onDelete} onSelect={onSelect} />)
    expect(screen.getByText('Perfil Principal')).toBeInTheDocument()
    expect(screen.getByText('Mi perfil de emergencia')).toBeInTheDocument()
  })

  it('calls onEdit when "Editar" menu item is clicked', () => {
    render(<ProfileCard profile={mockProfile} onEdit={onEdit} onDelete={onDelete} onSelect={onSelect} />)
    fireEvent.click(screen.getByLabelText('more options'))
    fireEvent.click(screen.getByText('Editar'))
    expect(onEdit).toHaveBeenCalledWith(mockProfile)
  })

  it('calls onDelete when "Eliminar" menu item is clicked', () => {
    render(<ProfileCard profile={mockProfile} onEdit={onEdit} onDelete={onDelete} onSelect={onSelect} />)
    fireEvent.click(screen.getByLabelText('more options'))
    fireEvent.click(screen.getByText('Eliminar'))
    expect(onDelete).toHaveBeenCalledWith('p1')
  })

  it('calls onSelect when "Activar este perfil" button is clicked', () => {
    render(<ProfileCard profile={mockProfile} onEdit={onEdit} onDelete={onDelete} onSelect={onSelect} />)
    fireEvent.click(screen.getByText(/Activar este perfil/))
    expect(onSelect).toHaveBeenCalledWith('p1')
  })
})
