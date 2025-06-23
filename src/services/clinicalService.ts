import { doc, getDoc, setDoc, type Firestore } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FIRESTORE_COLLECTIONS } from '@/lib/firestore-collections';
import type { TabSpecificFormulationData } from '@/types/clinicalTypes';
import * as Sentry from '@sentry/nextjs';

export async function fetchClinicalData(
  patientId: string,
  tabId: string,
  firestore: Firestore = db
): Promise<TabSpecificFormulationData | null> {
  try {
    const ref = doc(
      firestore,
      FIRESTORE_COLLECTIONS.PATIENTS,
      patientId,
      FIRESTORE_COLLECTIONS.CLINICAL_DATA,
      tabId
    );
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as TabSpecificFormulationData) : null;
  } catch (err) {
    Sentry.captureException(err);
    console.error('Erro ao buscar dados clínicos', err);
    return null;
  }
}

export async function saveClinicalData(
  patientId: string,
  tabId: string,
  data: Partial<TabSpecificFormulationData>,
  firestore: Firestore = db
): Promise<void> {
  try {
    const ref = doc(
      firestore,
      FIRESTORE_COLLECTIONS.PATIENTS,
      patientId,
      FIRESTORE_COLLECTIONS.CLINICAL_DATA,
      tabId
    );
    await setDoc(ref, data, { merge: true });
  } catch (err) {
    Sentry.captureException(err);
    console.error('Erro ao salvar dados clínicos', err);
    throw err;
  }
}
