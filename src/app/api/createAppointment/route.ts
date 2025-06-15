
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { firestoreAdmin } from '@/lib/firebaseAdmin';
import { mockTherapeuticGroups } from '@/app/(app)/groups/page'; // Import mock group data
import { parse, getDay } from 'date-fns';

const AppointmentSchema = z.object({
  appointmentDate: z.string(), // YYYY-MM-DD
  startTime: z.string(), // HH:mm
  endTime: z.string(), // HH:mm
  psychologistId: z.string(),
  patient: z.string().optional(),
  type: z.string(),
  notes: z.string().optional(),
  isBlockTime: z.boolean().optional().default(false),
});

const dayOfWeekMappingApi: Record<string, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6,
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = AppointmentSchema.parse(body);

    // 1. Check for conflicts with existing individual appointments
    const qSnapshot = await firestoreAdmin
      .collection('appointments')
      .where('psychologistId', '==', data.psychologistId)
      .where('appointmentDate', '==', data.appointmentDate)
      .get();

    const individualConflict = qSnapshot.docs.some(doc => {
      const appt = doc.data() as any;
      if (appt.status === 'CancelledByPatient' || appt.status === 'CancelledByClinic') {
        return false;
      }
      if (data.isBlockTime || appt.type === 'Blocked Slot') {
         return data.startTime < appt.endTime && data.endTime > appt.startTime;
      }
      return data.startTime < appt.endTime && data.endTime > appt.startTime;
    });

    if (individualConflict) {
      return NextResponse.json({ error: 'Já existe um agendamento ou bloqueio individual para este(a) psicólogo(a) no intervalo selecionado.' }, { status: 409 });
    }

    // 2. Check for conflicts with group sessions
    const appointmentDayOfWeek = getDay(parse(data.appointmentDate, 'yyyy-MM-dd', new Date())); // 0 for Sunday, 1 for Monday...

    const groupConflict = mockTherapeuticGroups.some(group => {
      if (group.psychologistId !== data.psychologistId) {
        return false;
      }
      const groupDayJsIndex = dayOfWeekMappingApi[group.dayOfWeek.toLowerCase()];
      if (groupDayJsIndex !== appointmentDayOfWeek) {
        return false;
      }
      // Check time overlap
      return data.startTime < group.endTime && data.endTime > group.startTime;
    });

    if (groupConflict) {
      return NextResponse.json({ error: 'O horário selecionado conflita com uma sessão de grupo agendada para este(a) psicólogo(a).' }, { status: 409 });
    }

    const docRef = await firestoreAdmin.collection('appointments').add({
      ...data,
      status: data.isBlockTime ? 'Blocked' : 'Scheduled',
    });

    return NextResponse.json({ id: docRef.id });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados de entrada inválidos.', details: e.errors }, { status: 400 });
    }
    console.error("Error creating appointment:", e);
    return NextResponse.json({ error: 'Erro interno ao criar agendamento.' }, { status: 500 });
  }
}
