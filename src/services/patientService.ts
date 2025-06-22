import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import type { Patient } from '@/types/patient';
import { FIRESTORE_COLLECTIONS } from '@/lib/firestore-collections';

export async function fetchPatients(): Promise<Patient[]> {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) return [];
    const q = query(
      collection(db, FIRESTORE_COLLECTIONS.PATIENTS),
      where('ownerId', '==', uid)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Patient, 'id'>) }));
  } catch (err) {
    console.error('Erro ao buscar pacientes', err);
    return [];
  }
}

export async function fetchPatient(id: string): Promise<Patient | null> {
  try {
    const ref = doc(db, FIRESTORE_COLLECTIONS.PATIENTS, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as Omit<Patient, 'id'>) };
  } catch (err) {
    console.error('Erro ao buscar paciente', err);
    return null;
  }
}
