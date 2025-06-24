import { render, screen, waitFor } from '@/tests/__mocks__/test-utils'
import userEvent from '@testing-library/user-event'
import LoginForm from '@/components/forms/auth/login-form'

const push = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}))

const mockSignIn = jest.fn()
const mockGetIdToken = jest.fn()
const mockSetPersistence = jest.fn()

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: (...args: any[]) => mockSignIn(...args),
  getIdToken: (...args: any[]) => mockGetIdToken(...args),
  setPersistence: (...args: any[]) => mockSetPersistence(...args),
  browserLocalPersistence: 'local',
  browserSessionPersistence: 'session',
}))

const mockLogAction = jest.fn()
jest.mock('@/lib/logger', () => ({
  logAction: (...args: any[]) => mockLogAction(...args),
}))

const mockToast = jest.fn()
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}))

jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
}))

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    globalThis.fetch = jest.fn().mockResolvedValue({ ok: true })
  })

  it('registra log e redireciona em login bem-sucedido', async () => {
    mockSignIn.mockResolvedValue({ user: { uid: '1' } })
    mockGetIdToken.mockResolvedValue('token')

    render(<LoginForm />)

    await userEvent.type(screen.getByLabelText(/email/i), 'a@b.com')
    await userEvent.type(screen.getByLabelText(/senha/i), '123456')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => expect(mockLogAction).toHaveBeenCalledWith('1', 'login_success'))
    expect(push).toHaveBeenCalledWith('/dashboard')
  })

  it('mostra toast ao erro de credencial', async () => {
    mockSignIn.mockRejectedValue({ code: 'auth/invalid-credential' })

    render(<LoginForm />)

    await userEvent.type(screen.getByLabelText(/email/i), 'a@b.com')
    await userEvent.type(screen.getByLabelText(/senha/i), 'errada')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Erro',
          description: 'E-mail ou senha inválidos.',
          variant: 'destructive',
        })
      )
    )
    expect(mockLogAction).not.toHaveBeenCalled()
  })
})
