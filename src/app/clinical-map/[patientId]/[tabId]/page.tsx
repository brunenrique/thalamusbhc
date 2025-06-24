import ClinicalMapClient from './ClinicalMapClient';
import { fetchPatient } from '@/services/patientService';
import { fetchClinicalData } from '@/services/clinicalService';
import type { Patient } from '@/types/patient';
import type { TabSpecificFormulationData } from '@/types/clinicalTypes';

interface PageProps {
  params: { patientId: string; tabId: string };
}

export default async function ClinicalMapFullscreenPage({ params }: PageProps) {
  const { patientId, tabId } = params;

  const patient: Patient | null = await fetchPatient(patientId);
  const map: TabSpecificFormulationData | null = await fetchClinicalData(patientId, tabId);

  return (
    <ClinicalMapClient
      patientId={patientId}
      tabId={tabId}
      initialPatient={patient}
      initialMap={map}
    />
  );
}
