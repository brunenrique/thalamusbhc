// src/app/patients/[patientId]/page.tsx
"use client";

import { PatientHub } from "@/features/patient-hub";

interface PatientDetailPageProps {
  params: {
    patientId: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function PatientDetailPage({ params }: PatientDetailPageProps) {
  const { patientId } = params;

  return (
    <div className="flex-1 p-6">
      <PatientHub />
    </div>
  );
}