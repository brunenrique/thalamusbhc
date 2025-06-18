
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ListTree } from 'lucide-react'; // Using ListTree as a placeholder icon

interface ActMatrixBuilderProps {
  tabId: string;
}

export default function ActMatrixBuilder({ tabId }: ActMatrixBuilderProps) {
  const rows = 2;
  const cols = 2;
  const [values, setValues] = useState<string[][]>(
    Array.from({ length: rows }, () => Array.from({ length: cols }, () => ''))
  );

  const handleChange = (r: number, c: number, val: string) => {
    setValues((prev) => {
      const copy = prev.map((row) => [...row]);
      copy[r][c] = val;
      return copy;
    });
  };

  return (
    <Card className="h-full flex flex-col" tabIndex={0} aria-label="Construtor da Matriz ACT">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <ListTree className="mr-2 h-6 w-6 text-primary" />
          Matriz da ACT
        </CardTitle>
        <CardDescription>Ferramenta Matriz da ACT - Em Desenvolvimento (Aba ID: {tabId})</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto">
        <table className="w-full text-sm">
          <tbody>
            {values.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((val, colIndex) => (
                  <td key={colIndex} className="p-1">
                    <input
                      aria-label={`Linha ${rowIndex + 1}, Coluna ${colIndex + 1}`}
                      tabIndex={rowIndex * cols + colIndex + 1}
                      className="border p-1 w-full max-w-[120px]"
                      value={val}
                      onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
