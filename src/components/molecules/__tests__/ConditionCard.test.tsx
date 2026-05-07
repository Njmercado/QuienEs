import { render, screen, fireEvent } from '@testing-library/react'
import { ConditionCard } from '../ConditionCard'
import type { Condition } from '../../../objects/condition'
import { mockTheme } from '../../../test-utils/mockTheme'

vi.mock('@mui/material/styles', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@mui/material/styles')>()
  return { ...actual, useTheme: () => mockTheme }
})

const mockCondition: Condition = {
  id: 'cond-1', title: 'Diabetes',
  medicines: ['Metformina', 'Insulina'],
  created_at: '2024-01-15T00:00:00Z', user_id: 'user-123',
}

describe('ConditionCard', () => {
  const onEdit = vi.fn()
  const onDelete = vi.fn()
  afterEach(() => vi.clearAllMocks())

  it('renders title and medicine chips', () => {
    render(<ConditionCard condition={mockCondition} onEdit={onEdit} onDelete={onDelete} />)
    expect(screen.getByText('Diabetes')).toBeInTheDocument()
    expect(screen.getByText('Metformina')).toBeInTheDocument()
    expect(screen.getByText('Insulina')).toBeInTheDocument()
  })

  it('calls onEdit when "Editar" menu item is clicked', () => {
    render(<ConditionCard condition={mockCondition} onEdit={onEdit} onDelete={onDelete} />)
    fireEvent.click(screen.getByLabelText('más opciones'))
    fireEvent.click(screen.getByText('Editar'))
    expect(onEdit).toHaveBeenCalledWith(mockCondition)
  })

  it('calls onDelete when "Eliminar" menu item is clicked', () => {
    render(<ConditionCard condition={mockCondition} onEdit={onEdit} onDelete={onDelete} />)
    fireEvent.click(screen.getByLabelText('más opciones'))
    fireEvent.click(screen.getByText('Eliminar'))
    expect(onDelete).toHaveBeenCalledWith('cond-1')
  })
})
