'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import EmptyState from '@/components/ui/empty-state';
import { getTasks } from '@/services/taskService';
import type { Task } from '@/types';

export default function TasksWidget() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasks().then((t) => setTasks(t.slice(0, 5)));
  }, []);

  if (!tasks || tasks.length === 0) {
    return (
      <EmptyState
        title="Nenhuma tarefa pendente"
        description="Parece que não há nada na sua lista de tarefas."
      />
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="font-headline">Tarefas Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.title}</TableCell>
                <TableCell>{t.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
