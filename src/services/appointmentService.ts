import type { AppointmentStatus, AppointmentsByDate, Appointment } from '@/types/appointment';
import { addDoc, collection, doc, updateDoc, Timestamp, type Firestore } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FIRESTORE_COLLECTIONS } from '@/lib/firestore-collections';
import { writeAuditLog } from './auditLogService';
import { addDays, format, subDays } from 'date-fns';
import logger from '@/lib/logger';
import { ServiceError } from '@/lib/errors';

const baseMockAppointments: AppointmentsByDate = {
  '2024-08-15': [
    {
      id: 'appt1',
      patientId: '1',
      startTime: '10:00',
      endTime: '11:00',
      patient: 'Alice Wonderland',
      type: 'Consulta',
      psychologistId: 'psy1',
      status: 'Confirmed',
      notes: 'Sessão inicial com Alice.',
    },
    {
      id: 'appt2',
      patientId: '2',
      startTime: '14:00',
      endTime: '15:00',
      patient: 'Bob O Construtor',
      type: 'Acompanhamento',
      psychologistId: 'psy2',
      status: 'Completed',
      notes: 'Revisão de progresso.',
    },
  ],
  '2024-08-16': [
    {
      id: 'appt3',
      startTime: '09:00',
      endTime: '10:00',
      patient: 'Autocuidado',
      type: 'Blocked Slot',
      psychologistId: 'psy1',
      status: 'Blocked',
      blockReason: 'Tempo Pessoal',
    },
  ],
  '2024-08-20': [
    {
      id: 'appt4',
      patientId: '3',
      startTime: '11:00',
      endTime: '12:00',
      patient: 'Charlie Brown',
      type: 'Sessão de Terapia',
      psychologistId: 'psy1',
      status: 'CancelledByPatient',
    },
  ],
};

export function getInitialMockAppointments(): AppointmentsByDate {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayAppointments = [
    {
      id: 'apptToday1',
      patientId: 'apptToday1',
      startTime: '15:00',
      endTime: '16:00',
      patient: 'Paciente Teste Hoje',
      type: 'Consulta Teste',
      psychologistId: 'psy1',
      status: 'Scheduled' as AppointmentStatus,
      notes: 'Consulta de rotina.',
    },
    {
      id: 'apptToday2',
      patientId: '4',
      startTime: '17:00',
      endTime: '17:30',
      patient: 'Diana Prince',
      type: 'Revisão',
      psychologistId: 'psy2',
      status: 'NoShow' as AppointmentStatus,
    },
  ];

  const initialData = JSON.parse(JSON.stringify(baseMockAppointments));

  if (initialData[todayStr]) {
    initialData[todayStr] = [...initialData[todayStr], ...todayAppointments];
  } else {
    initialData[todayStr] = [...todayAppointments];
  }

  const aFewDaysAgo = format(subDays(new Date(), 3), 'yyyy-MM-dd');
  if (!initialData[aFewDaysAgo]) initialData[aFewDaysAgo] = [];
  initialData[aFewDaysAgo] = [
    ...initialData[aFewDaysAgo],
    {
      id: 'apptOld1',
      patientId: 'apptOld1',
      startTime: '10:30',
      endTime: '11:30',
      patient: 'Old Patient',
      type: 'Follow-up',
      psychologistId: 'psy1',
      status: 'Completed',
    },
  ];

  const aFewDaysAhead = format(addDays(new Date(), 3), 'yyyy-MM-dd');
  if (!initialData[aFewDaysAhead]) initialData[aFewDaysAhead] = [];
  initialData[aFewDaysAhead] = [
    ...initialData[aFewDaysAhead],
    {
      id: 'apptFuture1',
      patientId: 'apptFuture1',
      startTime: '16:00',
      endTime: '17:00',
      patient: 'Future Patient',
      type: 'Initial Consultation',
      psychologistId: 'psy2',
      status: 'Confirmed',
    },
  ];

  return initialData;
}

export function hasScheduleConflict(
  appointments: AppointmentsByDate,
  dateKey: string,
  startTime: string,
  endTime: string,
  psychologistId: string,
  isBlockTime: boolean
): boolean {
  const existing = appointments[dateKey] || [];
  return existing.some((appt) => {
    if (appt.psychologistId !== psychologistId) return false;
    if (appt.status === 'CancelledByPatient' || appt.status === 'CancelledByClinic') {
      return false;
    }
    if (!isBlockTime && appt.type === 'Blocked Slot') {
      // Bloqueio impede consulta
      return startTime < appt.endTime && endTime > appt.startTime;
    }
    return startTime < appt.endTime && endTime > appt.startTime;
  });
}

export interface AppointmentPayload extends Omit<Appointment, 'id'> {
  appointmentDate: string;
  patientId: string;
}

export async function createAppointment(
  data: AppointmentPayload,
  firestore: Firestore = db
): Promise<string> {
  try {
    const docRef = await addDoc(
      collection(firestore, FIRESTORE_COLLECTIONS.APPOINTMENTS),
      data
    );
    if (data.patientId) {
      await updateDoc(doc(firestore, FIRESTORE_COLLECTIONS.PATIENTS, data.patientId), {
        lastAppointmentDate: Timestamp.fromDate(new Date(data.appointmentDate)),
      });
    }
    await writeAuditLog({
      userId: data.psychologistId,
      actionType: 'createAppointment',
      timestamp: new Date().toISOString(),
      targetResourceId: docRef.id,
    }, firestore);
    return docRef.id;
  } catch (error) {
    logger.error({ action: 'create_appointment_error', meta: { error, service: 'appointmentService' } });
    throw new ServiceError('Não foi possível criar o agendamento. Tente novamente mais tarde.', error);
  }
}
