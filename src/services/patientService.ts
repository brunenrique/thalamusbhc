import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  addDoc,
  setDoc,
  type Firestore,
  Timestamp,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { writeAuditLog } from './auditLogService';
import type { Patient } from '@/types/patient';
import { FIRESTORE_COLLECTIONS } from '@/lib/firestore-collections';
import { encrypt, decrypt, type EncryptionResult } from '@/lib/crypto-utils';
import { getEncryptionKey } from '@/lib/encryptionKey';
import logger from '@/lib/logger';
import { ServiceError } from '@/lib/errors';

interface FirestorePatient {
  ownerId: string;
  name: string;
  email: string;
  birthdate?: Timestamp | null;
  phoneEnc?: EncryptionResult | null;
  addressEnc?: EncryptionResult | null;
  identifierEnc?: EncryptionResult | null;
  notes?: string;
  lastSession?: string | null;
  nextAppointment?: string | null;
  avatarUrl?: string;
  dataAiHint?: string;
  lastAppointmentDate?: Timestamp | null;
}

export interface PatientInput {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  identifier?: string;
  dob?: Date | null;
  notes?: string;
}

export async function fetchPatients(): Promise<Patient[]> {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) return [];
    const q = query(collection(db, FIRESTORE_COLLECTIONS.PATIENTS), where('ownerId', '==', uid));
    const snap = await getDocs(q);
    const key = getEncryptionKey();
    return snap.docs.map((d) => {
      const data = d.data() as FirestorePatient;
      return {
        id: d.id,
        name: data.name,
        email: data.email,
        phone: data.phoneEnc ? decrypt(data.phoneEnc, key) : undefined,
        address: data.addressEnc ? decrypt(data.addressEnc, key) : undefined,
        identifier: data.identifierEnc ? decrypt(data.identifierEnc, key) : undefined,
        dob: data.birthdate ?? null,
        notes: data.notes,
        lastSession: data.lastSession,
        nextAppointment: data.nextAppointment,
        avatarUrl: data.avatarUrl,
        dataAiHint: data.dataAiHint,
        lastAppointmentDate: data.lastAppointmentDate ?? null,
      } as Patient;
    });
  } catch (error) {
    logger.error({ action: 'fetch_patients_error', meta: { error, service: 'patientService' } });
    throw new ServiceError('Não foi possível obter a lista de pacientes. Tente novamente mais tarde.', error);
  }
}

export async function fetchPatient(id: string): Promise<Patient | null> {
  try {
    const ref = doc(db, FIRESTORE_COLLECTIONS.PATIENTS, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data() as FirestorePatient;
    const key = getEncryptionKey();
    return {
      id: snap.id,
      name: data.name,
      email: data.email,
      phone: data.phoneEnc ? decrypt(data.phoneEnc, key) : undefined,
      address: data.addressEnc ? decrypt(data.addressEnc, key) : undefined,
      identifier: data.identifierEnc ? decrypt(data.identifierEnc, key) : undefined,
      dob: data.birthdate ?? null,
      notes: data.notes,
      lastSession: data.lastSession,
      nextAppointment: data.nextAppointment,
      avatarUrl: data.avatarUrl,
      dataAiHint: data.dataAiHint,
      lastAppointmentDate: data.lastAppointmentDate ?? null,
    } as Patient;
  } catch (error) {
    logger.error({ action: 'fetch_patient_error', meta: { error, service: 'patientService' } });
    throw new ServiceError('Não foi possível obter o paciente. Tente novamente mais tarde.', error);
  }
}

export async function createPatient(
  data: PatientInput,
  firestore: Firestore = db
): Promise<string> {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new ServiceError('Usuário não autenticado');
    const key = getEncryptionKey();
    const docData: FirestorePatient = {
      ownerId: uid,
      name: data.name,
      email: data.email,
    };
    if (data.dob) docData.birthdate = Timestamp.fromDate(data.dob);
    if (data.phone) docData.phoneEnc = encrypt(data.phone, key);
    if (data.address) docData.addressEnc = encrypt(data.address, key);
    if (data.identifier) docData.identifierEnc = encrypt(data.identifier, key);
    if (data.notes) docData.notes = data.notes;
    const ref = await addDoc(collection(firestore, FIRESTORE_COLLECTIONS.PATIENTS), docData);
    await writeAuditLog(
      {
        userId: uid,
        actionType: 'createPatient',
        timestamp: new Date().toISOString(),
        targetResourceId: ref.id,
      },
      firestore
    );
    return ref.id;
  } catch (error) {
    logger.error({ action: 'create_patient_error', meta: { error, service: 'patientService' } });
    throw new ServiceError('Não foi possível criar o paciente. Tente novamente mais tarde.', error);
  }
}

export async function updatePatient(
  id: string,
  data: PatientInput,
  firestore: Firestore = db
): Promise<void> {
  try {
    const key = getEncryptionKey();
    const ref = doc(firestore, FIRESTORE_COLLECTIONS.PATIENTS, id);
    const update: Partial<FirestorePatient> = {
      name: data.name,
      email: data.email,
    };
    if (data.dob !== undefined) {
      update.birthdate = data.dob ? Timestamp.fromDate(data.dob) : null;
    }
    if (data.phone !== undefined) {
      update.phoneEnc = data.phone ? encrypt(data.phone, key) : null;
    }
    if (data.address !== undefined) {
      update.addressEnc = data.address ? encrypt(data.address, key) : null;
    }
    if (data.identifier !== undefined) {
      update.identifierEnc = data.identifier ? encrypt(data.identifier, key) : null;
    }
    if (data.notes !== undefined) {
      update.notes = data.notes;
    }
    await setDoc(ref, update, { merge: true });
    const uid = auth.currentUser?.uid;
    if (uid) {
      await writeAuditLog(
        {
          userId: uid,
          actionType: 'updatePatient',
          timestamp: new Date().toISOString(),
          targetResourceId: id,
        },
        firestore
      );
    }
  } catch (error) {
    logger.error({ action: 'update_patient_error', meta: { error, service: 'patientService', id } });
    throw new ServiceError('Não foi possível atualizar o paciente. Tente novamente mais tarde.', error);
  }
}
