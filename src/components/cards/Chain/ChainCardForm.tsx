"use client";

import React, { useState } from "react";

interface Step {
  question: string;
  answer: string;
}

const initialSteps: Step[] = [
  { question: "Situação", answer: "" },
  { question: "Resposta emocional", answer: "" },
  { question: "Consequência", answer: "" },
];

const ChainCardForm: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [error, setError] = useState("");

  const updateStep = (index: number, value: string) => {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, answer: value } : s)));
  };

  const isComplete = steps.every((step) => step.answer?.length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) {
      setError("Preencha todos os passos da cadeia comportamental.");
      return;
    }
    setError("");
    // TODO(medium): persistir dados
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {steps.map((step, i) =>
        (i === 0 || steps[i - 1].answer.length > 0) ? (
          <div key={step.question} className="flex flex-col gap-1">
            <label htmlFor={`step-${i}`} className="text-sm font-medium">
              {step.question}
            </label>
            <input
              id={`step-${i}`}
              className="border rounded p-2"
              value={step.answer}
              onChange={(e) => updateStep(i, e.target.value)}
            />
          </div>
        ) : null
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button type="submit" className="bg-primary text-primary-foreground px-3 py-1 rounded">
        Salvar
      </button>
    </form>
  );
};

export default ChainCardForm;
