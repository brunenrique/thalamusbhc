import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserFeedback from '@/components/UserFeedback';

const mockSubmit = jest.fn();
jest.mock('@/services/feedbackService', () => ({
  submitFeedback: (...args: any[]) => mockSubmit(...args),
}));

const mockToast = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
}));

describe('UserFeedback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('envia feedback digitado', async () => {
    mockSubmit.mockResolvedValue('1');
    render(<UserFeedback />);
    await userEvent.type(
      screen.getByLabelText(/sua sessão/i),
      'muito boa'
    );
    await userEvent.click(screen.getByRole('button', { name: /enviar/i }));

    await waitFor(() =>
      expect(mockSubmit).toHaveBeenCalledWith('muito boa')
    );
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Feedback enviado' })
    );
  });
});

