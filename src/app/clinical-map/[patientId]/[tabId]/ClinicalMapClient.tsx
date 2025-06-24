'use client';

import React, { useEffect } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import FormulationMapWrapper from '@/components/clinical-formulation/FormulationMap';
import { useClinicalStore } from '@/stores/clinicalStore';
import type { Patient } from '@/types/patient';
import type { TabSpecificFormulationData } from '@/types/clinicalTypes';

interface ClinicalMapClientProps {
  patientId: string;
  tabId: string;
  initialPatient: Patient | null;
  initialMap: TabSpecificFormulationData | null;
}

export default function ClinicalMapClient({
  patientId,
  tabId,
  initialPatient, // eslint-disable-line @typescript-eslint/no-unused-vars
  initialMap,
}: ClinicalMapClientProps) {
  const {
    setActiveTab,
    fetchClinicalData,
    isLoadingClinicalData,
    clinicalDataError,
    formulationTabData,
  } = useClinicalStore((s) => ({
    setActiveTab: s.setActiveTab,
    fetchClinicalData: s.fetchClinicalData,
    isLoadingClinicalData: s.isLoadingClinicalData,
    clinicalDataError: s.clinicalDataError,
    formulationTabData: s.formulationTabData,
  }));

  useEffect(() => {
    if (patientId && tabId) {
      setActiveTab(tabId);
      if (!formulationTabData[tabId]) {
        if (initialMap) {
          useClinicalStore.setState((state) => ({
            formulationTabData: { ...state.formulationTabData, [tabId]: initialMap },
          }));
        } else {
          fetchClinicalData(patientId, tabId);
        }
      }
    }
  }, [patientId, tabId, initialMap, formulationTabData, setActiveTab, fetchClinicalData]);

  if (isLoadingClinicalData) {
    return (
      <div className="h-screen w-screen flex items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span>Carregando dados clínicos...</span>
      </div>
    );
  }

  if (clinicalDataError) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center text-destructive space-y-2 text-center px-4">
        <AlertTriangle className="h-8 w-8" />
        <p className="text-sm font-medium">Erro ao carregar dados clínicos.</p>
        <p className="text-xs">{clinicalDataError}</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <FormulationMapWrapper />
    </div>
  );
}
