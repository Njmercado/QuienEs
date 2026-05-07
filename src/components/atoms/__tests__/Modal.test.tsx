import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Modal } from '../Modal'
import { mockTheme } from '../../../test-utils/mockTheme'

const testTheme = createTheme({ palette: mockTheme.palette as any } as any)

function renderModal(props: { isOpen: boolean; onClose: () => void; title?: string; children?: React.ReactNode }) {
  return render(
    <ThemeProvider theme={testTheme}>
      <Modal {...props}>{props.children ?? <p>content</p>}</Modal>
    </ThemeProvider>
  )
}

describe('Modal', () => {
  const onClose = vi.fn()
  afterEach(() => vi.clearAllMocks())

  it('renders children when open', () => {
    renderModal({ isOpen: true, onClose, title: 'Título', children: <p>Contenido interno</p> })
    expect(screen.getByText('Contenido interno')).toBeInTheDocument()
  })

  it('renders the title in the dialog header', () => {
    renderModal({ isOpen: true, onClose, title: 'Mi Modal' })
    expect(screen.getByText('Mi Modal')).toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', () => {
    renderModal({ isOpen: true, onClose, title: 'Close test' })
    fireEvent.click(screen.getByLabelText('Cerrar modal'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when Escape key is pressed while open', () => {
    renderModal({ isOpen: true, onClose, title: 'Escape test' })
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('does not render children when closed', () => {
    renderModal({ isOpen: false, onClose, title: 'Closed', children: <p>Hidden content</p> })
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument()
  })
})
