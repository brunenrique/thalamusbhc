"use client";

import React, { useState } from "react";

const MatrixCardForm: React.FC = () => {
  const [matrix, setMatrix] = useState<string[][]>([
    ["", ""],
    ["", ""],
  ]);
  const [error, setError] = useState("");

  const updateCell = (row: number, col: number, value: string) => {
    setMatrix((prev) => {
      const copy = prev.map((r) => [...r]);
      if (!copy[row]) copy[row] = [];
      copy[row][col] = value;
      return copy;
    });
  };

  const isAligned = matrix.every((r) => r.length === matrix[0].length);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAligned) {
      setError("As linhas da matriz precisam ter o mesmo número de colunas.");
      return;
    }
    setError("");
    // TODO(medium): persistir dados
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {matrix.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {row.map((value, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              aria-label={`Valor linha ${rowIndex + 1} coluna ${colIndex + 1}`}
              className="border rounded p-2 flex-1"
              value={value}
              onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
            />
          ))}
        </div>
      ))}
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button type="submit" className="bg-primary text-primary-foreground px-3 py-1 rounded">
        Salvar
      </button>
    </form>
  );
};

export default MatrixCardForm;
