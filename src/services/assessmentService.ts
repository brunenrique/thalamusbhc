'use client';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  type Firestore,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase'; // Alterado de @/services/firebase
import { writeAuditLog } from './auditLogService';
import { FIRESTORE_COLLECTIONS } from '@/lib/firestore-collections';
import type { Assessment } from '@/types/assessment';

export async function createAssessment(
  data: Omit<Assessment, 'id' | 'createdAt' | 'completedAt'>,
  firestore: Firestore = db
): Promise<string> {
  const docRef = await addDoc(collection(firestore, FIRESTORE_COLLECTIONS.ASSESSMENTS), {
    ...data,
    createdAt: new Date().toISOString(),
  });
  await writeAuditLog(
    {
      userId: data.assignedBy,
      actionType: 'createAssessment',
      timestamp: new Date().toISOString(),
      targetResourceId: docRef.id,
    },
    firestore
  );
  return docRef.id;
}

export async function submitAssessmentResponses(
  assessmentId: string,
  responses: Record<string, unknown>,
  firestore: Firestore = db
): Promise<void> {
  await updateDoc(doc(firestore, FIRESTORE_COLLECTIONS.ASSESSMENTS, assessmentId), {
    responses,
    status: 'completed',
    completedAt: new Date().toISOString(),
  });
  const uid = auth.currentUser?.uid;
  if (uid) {
    await writeAuditLog(
      {
        userId: uid,
        actionType: 'submitAssessmentResponses',
        timestamp: new Date().toISOString(),
        targetResourceId: assessmentId,
      },
      firestore
    );
  }
}

export async function getAssessmentsByPatient(patientId: string): Promise<Assessment[]> {
  const q = query(
    collection(db, FIRESTORE_COLLECTIONS.ASSESSMENTS),
    where('patientId', '==', patientId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Assessment, 'id'>) }));
}
