'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, AlertTriangle } from 'lucide-react';
import FormulationMapWrapper from '@/components/clinical-formulation/FormulationMap';
import { useClinicalStore } from '@/stores/clinicalStore';
import { mockPatient } from '@/app/(app)/patients/[id]/page';

// Helper to extract patientId and tabId. In a real app, you'd get this from route params
// and ensure they are strings.
function getRouteParams(defaultTabId: string | undefined): { patientId: string; tabId: string } {
  const params = useParams();
  const patientId = Array.isArray(params.patientId) ? params.patientId[0] : params.patientId;
  const tabId = Array.isArray(params.tabId) ? params.tabId[0] : params.tabId;
  return {
    patientId: patientId || mockPatient.id,
    tabId: tabId || defaultTabId || 'initialTab',
  };
}

export default function ClinicalMapFullscreenPage() {
  const { setActiveTab, fetchClinicalData, tabs, isLoadingClinicalData, clinicalDataError } =
    useClinicalStore((s) => ({
      setActiveTab: s.setActiveTab,
      fetchClinicalData: s.fetchClinicalData,
      tabs: s.tabs,
      isLoadingClinicalData: s.isLoadingClinicalData,
      clinicalDataError: s.clinicalDataError,
    }));
  const { patientId, tabId } = getRouteParams(tabs[0]?.id);

  useEffect(() => {
    if (patientId && tabId) {
      // console.log(`Fullscreen: Setting active tab to ${tabId} for patient ${patientId}`);
      setActiveTab(tabId);
      fetchClinicalData(patientId, tabId);
    }
  }, [patientId, tabId, setActiveTab, fetchClinicalData]);

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
      {/*
        Pass patientId and tabId if FormulationMapWrapper needs them directly.
        However, it should primarily rely on the activeTabId from the store.
      */}
      <FormulationMapWrapper />
    </div>
  );
}
