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
import { getTasks } from '@/services/taskService';
import type { Task } from '@/types';

export default function TasksWidget() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasks().then((t) => setTasks(t.slice(0, 5)));
  }, []);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="font-headline">Tarefas Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length ? (
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
        ) : (
          <p className="text-sm text-muted-foreground">Sem tarefas.</p>
        )}
      </CardContent>
    </Card>
  );
}
