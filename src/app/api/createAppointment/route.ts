import { NextResponse } from 'next/server';
import { z } from 'zod';
import { firestoreAdmin } from '@/lib/firebaseAdmin';

const AppointmentSchema = z.object({
  appointmentDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  psychologistId: z.string(),
  patient: z.string().optional(),
  type: z.string(),
  notes: z.string().optional(),
  isBlockTime: z.boolean().optional().default(false),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = AppointmentSchema.parse(body);

    const qSnapshot = await firestoreAdmin
      .collection('appointments')
      .where('psychologistId', '==', data.psychologistId)
      .where('appointmentDate', '==', data.appointmentDate)
      .get();

    const conflict = qSnapshot.docs.some(doc => {
      const appt = doc.data() as any;
      if (appt.status === 'CancelledByPatient' || appt.status === 'CancelledByClinic') {
        return false;
      }
      if (!data.isBlockTime && appt.type === 'Blocked Slot') {
        return data.startTime < appt.endTime && data.endTime > appt.startTime;
      }
      return data.startTime < appt.endTime && data.endTime > appt.startTime;
    });

    if (conflict) {
      return NextResponse.json({ error: 'Schedule conflict' }, { status: 409 });
    }

    const docRef = await firestoreAdmin.collection('appointments').add({
      ...data,
      status: 'Scheduled',
    });

    return NextResponse.json({ id: docRef.id });
  } catch (e) {
    
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
