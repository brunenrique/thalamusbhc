// src/app/patients/[patientId]/page.tsx
"use client";

import { PatientHub } from "@/features/patient-hub";

import React from "react";

export default function PatientDetailPage() {
  return (
    <div className="flex-1 p-6">
      <PatientHub />
    </div>
  );
}