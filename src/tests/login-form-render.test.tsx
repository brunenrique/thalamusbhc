import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock('@/lib/firebase', () => ({ auth: {} }));

import LoginForm from '@/components/forms/auth/login-form';

describe('LoginForm rendering', () => {
  it('exibe r\u00f3tulos e mensagens de erro', async () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/lembrar-me/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

    expect(
      await screen.findByText('Por favor, insira um endere\u00e7o de e-mail v\u00e1lido.')
    ).toBeInTheDocument();
    expect(
      await screen.findByText('A senha deve ter pelo menos 6 caracteres.')
    ).toBeInTheDocument();
  });
});
