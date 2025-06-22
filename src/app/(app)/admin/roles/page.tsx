'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { checkUserRole } from '@/services/authRole';
import { getAuth } from 'firebase/auth';

export default function ManageRolesPage() {
  const router = useRouter();
  const [uid, setUid] = useState('');
  const [role, setRole] = useState('Psychologist');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkUserRole('Admin').then((ok) => {
      if (!ok) router.replace('/');
    });
  }, [router]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await getAuth().currentUser?.getIdToken();
      const res = await fetch('/api/admin/setUserRole', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid, role }),
      });
      if (res.ok) {
        alert('Role atualizado');
      } else {
        alert('Falha ao atualizar');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-headline font-bold">Gerenciar Papéis</h1>
      </div>
      <Card className="shadow-sm max-w-md">
        <CardHeader>
          <CardTitle className="font-headline">Definir Papel do Usuário</CardTitle>
          <CardDescription>Informe o UID do usuário e selecione o novo papel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="UID do usuário"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
          />
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Papel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Administrador</SelectItem>
              <SelectItem value="Psychologist">Psicólogo(a)</SelectItem>
              <SelectItem value="Secretary">Secretário(a)</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-accent hover:bg-accent/90 text-accent-foreground w-full"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
