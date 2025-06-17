
"use client";

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import FormulationMapWrapper from '@/components/clinical-formulation/FormulationMap';
import { useClinicalStore } from '@/stores/clinicalStore';
import { APP_ROUTES } from '@/lib/routes'; // Ensure APP_ROUTES is correctly imported if used
import { mockPatient } from '@/app/(app)/patients/[id]/page'; // Ensure mockPatient is correctly imported if used

// Helper to extract patientId and tabId. In a real app, you'd get this from route params
// and ensure they are strings.
function getRouteParams(): { patientId: string; tabId: string } {
  const params = useParams();
  const patientId = Array.isArray(params.patientId) ? params.patientId[0] : params.patientId;
  const tabId = Array.isArray(params.tabId) ? params.tabId[0] : params.tabId;
  return { 
    patientId: patientId || mockPatient.id, // Fallback for safety, adjust as needed
    tabId: tabId || useClinicalStore.getState().tabs[0]?.id || 'initialTab' // Fallback for safety
  };
}


export default function ClinicalMapFullscreenPage() {
  const { setActiveTab, fetchClinicalData } = useClinicalStore();
  const { patientId, tabId } = getRouteParams();

  useEffect(() => {
    if (patientId && tabId) {
      // console.log(`Fullscreen: Setting active tab to ${tabId} for patient ${patientId}`);
      setActiveTab(tabId);
      fetchClinicalData(patientId, tabId);
    }
  }, [patientId, tabId, setActiveTab, fetchClinicalData]);
  
  // Ensure store has data for this tab before rendering, or show loading.
  // For simplicity, this example assumes data will be loaded by FormulationMapWrapper
  // or through the fetchClinicalData call. A more robust solution might involve
  // checking loading state from the store.

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
