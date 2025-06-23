import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GroupForm, { type GroupFormValues } from '@/components/forms/group-form';
import { createGroup, updateGroup } from '@/services/groupService';

jest.mock('@/services/groupService');
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const baseData: GroupFormValues = {
  name: 'Grupo Teste',
  description: '',
  psychologistId: 'psy1',
  patientIds: ['1'],
  dayOfWeek: 'monday',
  startTime: '18:00',
  endTime: '19:30',
  meetingAgenda: '',
};

describe('GroupForm flows', () => {
  it('chama createGroup ao submeter novo grupo', async () => {
    (createGroup as jest.Mock).mockResolvedValue('1');
    render(<GroupForm initialData={baseData} />);
    await userEvent.click(screen.getByRole('button', { name: /criar grupo/i }));
    expect(createGroup).toHaveBeenCalledWith(baseData);
  });

  it('chama updateGroup ao editar grupo', async () => {
    (updateGroup as jest.Mock).mockResolvedValue(undefined);
    render(<GroupForm initialData={baseData} groupId="grp1" />);
    await userEvent.click(screen.getByRole('button', { name: /salvar alterações/i }));
    expect(updateGroup).toHaveBeenCalledWith('grp1', baseData);
  });
});
