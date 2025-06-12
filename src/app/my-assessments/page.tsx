"use client";
import { useEffect, useState } from 'react';
import AssessmentCard from '@/components/assessments/assessment-card';
import { getAssessmentsByPatient } from '@/services/assessmentService';
import type { Assessment } from '@/types/assessment';
import { ClipboardList } from 'lucide-react';

export default function MyAssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const patientId = 'demoPatient'; // In real app, derive from auth

  useEffect(() => {
    getAssessmentsByPatient(patientId).then(setAssessments).catch(() => setAssessments([]));
  }, [patientId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ClipboardList className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Minhas Avaliações</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assessments.map(a => (
          <AssessmentCard key={a.id} assessment={{
            id: a.id,
            name: a.templateName,
            description: undefined,
            patientName: undefined,
            dateSent: a.createdAt,
            status: a.status === 'completed' ? 'Completed' : a.status === 'assigned' ? 'Sent' : 'Pending',
            score: a.score ? String(a.score) : undefined,
          }} />
        ))}
        {assessments.length === 0 && (
          <p className="text-muted-foreground">Nenhuma avaliação disponível.</p>
        )}
      </div>
    </div>
  );
}
