import { collection, getDocs, query, where, type Firestore } from 'firebase/firestore';
import { parse, getDay } from 'date-fns';
import { db } from './firebase';
import { FIRESTORE_COLLECTIONS } from './firestore-collections';

const dayOfWeekMap: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export interface ConflictCheckInput {
  appointmentDate: string; // yyyy-MM-dd
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  psychologistId: string;
  isBlockTime?: boolean;
}

export async function checkScheduleConflict(
  data: ConflictCheckInput,
  firestore: Firestore = db
): Promise<boolean> {
  const { appointmentDate, startTime, endTime, psychologistId, isBlockTime = false } = data;

  const apptQuery = query(
    collection(firestore, FIRESTORE_COLLECTIONS.APPOINTMENTS),
    where('psychologistId', '==', psychologistId),
    where('appointmentDate', '==', appointmentDate)
  );
  const apptSnap = await getDocs(apptQuery);
  const timeOverlap = (aStart: string, aEnd: string) => startTime < aEnd && endTime > aStart;

  const individualConflict = apptSnap.docs.some((doc) => {
    const appt = doc.data() as Record<string, any>;
    if (appt.status === 'CancelledByPatient' || appt.status === 'CancelledByClinic') {
      return false;
    }
    if (isBlockTime && appt.type === 'Blocked Slot') {
      return false;
    }
    if (!isBlockTime && appt.type === 'Blocked Slot') {
      return timeOverlap(appt.startTime, appt.endTime);
    }
    return timeOverlap(appt.startTime, appt.endTime);
  });

  if (individualConflict) return true;

  const dayIndex = getDay(parse(appointmentDate, 'yyyy-MM-dd', new Date()));
  const groupQuery = query(
    collection(firestore, FIRESTORE_COLLECTIONS.GROUPS),
    where('psychologistId', '==', psychologistId)
  );
  const groupSnap = await getDocs(groupQuery);

  const groupConflict = groupSnap.docs.some((doc) => {
    const group = doc.data() as Record<string, any>;
    const groupDay = dayOfWeekMap[(group.dayOfWeek || '').toLowerCase()];
    if (groupDay !== dayIndex) return false;
    return timeOverlap(group.startTime, group.endTime);
  });

  return groupConflict;
}
