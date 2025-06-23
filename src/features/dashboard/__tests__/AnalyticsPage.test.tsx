import { render, waitFor } from '@testing-library/react';
import AnalyticsHubPage from '@/app/(app)/analytics/page';
import { checkUserRole } from '@/services/authRole';

jest.mock('@/services/authRole');
jest.mock('@/services/metricsService', () => ({
  getTotalPatients: jest.fn().mockResolvedValue(0),
  getSessionsThisMonth: jest.fn().mockResolvedValue(0),
}));

const replaceMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

describe('AnalyticsHubPage', () => {
  it('redireciona se o usuário não tem permissão', async () => {
    (checkUserRole as jest.Mock).mockResolvedValue(false);
    render(<AnalyticsHubPage />);
    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith('/');
    });
  });
});
