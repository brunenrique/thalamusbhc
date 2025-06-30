// src/app/patients/[patientId]/page.tsx
"use client";

import { PatientHub } from "@/features/patient-hub";

interface PatientDetailPageProps {
  params: {
    patientId: string;
  };
}

export default function PatientDetailPage({ params }: PatientDetailPageProps) {
  const { patientId } = params;

  return (
    <div className="flex-1 p-6">
      <PatientHub />
    </div>
  );
}
