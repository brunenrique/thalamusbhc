import { generateICS } from '../src/lib/ics-generator';

describe('generateICS', () => {
  it('gera ICS para um unico agendamento', () => {
    const data = {
      '2024-08-15': [
        {
          id: 'a1',
          startTime: '10:00',
          endTime: '11:00',
          patient: 'João',
          type: 'Consulta',
          psychologistId: 'psy1',
          status: 'Scheduled',
        },
      ],
    };

    const ics = generateICS(data);

    expect(ics).toContain('BEGIN:VCALENDAR');
    expect((ics.match(/BEGIN:VEVENT/g) || []).length).toBe(1);
    expect(ics).toContain('SUMMARY:Consulta: João');
    expect(ics).toContain('DTSTART:20240815T130000Z');
    expect(ics).toContain('DTEND:20240815T140000Z');
  });

  it('gera ICS ignorando agendamentos cancelados', () => {
    const data = {
      '2024-08-15': [
        {
          id: 'a1',
          startTime: '10:00',
          endTime: '11:00',
          patient: 'João',
          type: 'Consulta',
          psychologistId: 'psy1',
          status: 'Scheduled',
        },
        {
          id: 'a2',
          startTime: '12:00',
          endTime: '13:00',
          patient: 'Maria',
          type: 'Consulta',
          psychologistId: 'psy1',
          status: 'CancelledByPatient',
        },
        {
          id: 'a3',
          startTime: '14:00',
          endTime: '15:00',
          patient: 'José',
          type: 'Consulta',
          psychologistId: 'psy1',
          status: 'Scheduled',
        },
      ],
    };

    const ics = generateICS(data);

    expect((ics.match(/BEGIN:VEVENT/g) || []).length).toBe(2);
    expect(ics).toContain('DTSTART:20240815T130000Z');
    expect(ics).toContain('DTEND:20240815T140000Z');
    expect(ics).toContain('DTSTART:20240815T170000Z');
    expect(ics).toContain('DTEND:20240815T180000Z');
    expect(ics).not.toContain('Maria');
    expect(ics).not.toContain('CANCELLEDBYPATIENT');
  });
});
