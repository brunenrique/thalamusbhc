"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import * as Sentry from '@sentry/nextjs';
import logger from '@/lib/logger';
import type { Patient } from '@/types/patient';
import { fetchPatient } from '@/services/patientService';

export default function PatientDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        if (id) {
          const data = await fetchPatient(id);
          setPatient(data);
        }
      } catch (err) {
        Sentry.captureException(err);
        logger.error({ action: 'fetch_patient_page_error', meta: { error: err } });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <p className="p-4">Carregando...</p>;
  if (!patient) return <p className="p-4">Paciente nao encontrado</p>;

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">{patient.name}</h1>
      <p className="text-muted-foreground">{patient.email}</p>
      <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
        <Link href={`/clinical-map/${patient.id}/initialTab`}>
          Abrir Prontuário
        </Link>
      </Button>
    </div>
  );
}
