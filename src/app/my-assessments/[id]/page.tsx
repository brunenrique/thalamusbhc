"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitAssessmentResponses } from '@/services/assessmentService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Alterado de @/services/firebase
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function AssessmentResponsePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, 'assessments', params.id));
      if (snap.exists()) {
        const data = snap.data() as any;
        if (Array.isArray(data.questions)) {
          setQuestions(data.questions as string[]);
        }
      }
    }
    load();
  }, [params.id]);

  const handleSubmit = async () => {
    await submitAssessmentResponses(params.id, answers);
    router.push('/my-assessments');
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Responder Avaliação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {questions.map((q, idx) => (
          <div key={q} className="space-y-2">
            <p className="font-medium">{q}</p>
            <Textarea
              value={answers[idx] || ''}
              onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
              rows={3}
            />
          </div>
        ))}
        {questions.length === 0 && <p>Nenhuma pergunta encontrada.</p>}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmit} disabled={questions.length === 0}>Enviar Respostas</Button>
      </CardFooter>
    </Card>
  );
}
