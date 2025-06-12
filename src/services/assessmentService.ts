"use client";
import { collection, addDoc, updateDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';
import type { Assessment } from '@/types/assessment';

export async function createAssessment(data: Omit<Assessment, 'id' | 'createdAt' | 'completedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'assessments'), {
    ...data,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function submitAssessmentResponses(assessmentId: string, responses: Record<string, unknown>): Promise<void> {
  await updateDoc(doc(db, 'assessments', assessmentId), {
    responses,
    status: 'completed',
    completedAt: new Date().toISOString(),
  });
}

export async function getAssessmentsByPatient(patientId: string): Promise<Assessment[]> {
  const q = query(collection(db, 'assessments'), where('patientId', '==', patientId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Assessment, 'id'>) }));
}
