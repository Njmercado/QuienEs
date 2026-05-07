import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { SideDrawer } from '../SideDrawer'
import { mockTheme } from '../../../test-utils/mockTheme'

const testTheme = createTheme({ palette: mockTheme.palette as any } as any)

function renderDrawer(props: { isOpen: boolean; onClose: () => void; title?: string }) {
  return render(
    <ThemeProvider theme={testTheme}>
      <SideDrawer {...props}>
        <p>Contenido del panel</p>
      </SideDrawer>
    </ThemeProvider>
  )
}

describe('SideDrawer', () => {
  const onClose = vi.fn()
  afterEach(() => vi.clearAllMocks())

  it('renders children when open', () => {
    renderDrawer({ isOpen: true, onClose, title: 'Panel lateral' })
    expect(screen.getByText('Contenido del panel')).toBeInTheDocument()
  })

  it('renders the title in the panel header', () => {
    renderDrawer({ isOpen: true, onClose, title: 'Mi Panel' })
    expect(screen.getByText('Mi Panel')).toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', () => {
    renderDrawer({ isOpen: true, onClose, title: 'Cierre' })
    fireEvent.click(screen.getByLabelText('Cerrar panel'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when Escape is pressed while open', () => {
    renderDrawer({ isOpen: true, onClose, title: 'Escape' })
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })
})
