import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import PatientsPage from '@/app/(app)/patients/page';
import { fetchPatients } from '@/services/patientService';
import { checkUserRole } from '@/services/authRole';

jest.mock('@/services/patientService');
jest.mock('@/services/authRole');
jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: jest.fn() }),
}));

const mockedPatients = [
  { id: '1', name: 'Alice', email: 'a@b.com' },
  { id: '2', name: 'Bob', email: 'b@c.com' },
];

describe('PatientsPage', () => {
  it('exibe pacientes obtidos do Firestore', async () => {
    (fetchPatients as jest.Mock).mockResolvedValue(mockedPatients);
    (checkUserRole as jest.Mock).mockResolvedValue(true);
    render(<PatientsPage />);
    expect(await screen.findByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('não apresenta violações de acessibilidade', async () => {
    (fetchPatients as jest.Mock).mockResolvedValue(mockedPatients);
    (checkUserRole as jest.Mock).mockResolvedValue(true);
    const { container } = render(<PatientsPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
