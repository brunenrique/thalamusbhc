"use client";

import React, { useState } from "react";

export interface GenericField {
  label: string;
  name: string;
}

export interface GenericCardFormConfig {
  fields: GenericField[];
}

interface GenericCardFormProps {
  config?: GenericCardFormConfig;
  onSubmit?: (values: Record<string, string>) => void;
}

const GenericCardForm: React.FC<GenericCardFormProps> = ({ config, onSubmit }) => {
  const [values, setValues] = useState<Record<string, string>>(() => {
    if (!config?.fields) return {};
    const initial: Record<string, string> = {};
    config.fields.forEach((f) => {
      initial[f.name] = "";
    });
    return initial;
  });

  if (!config || !config.fields) {
    return <p>Configuração incompleta</p>;
  }

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {config.fields.map((field) => (
        <div key={field.name} className="flex flex-col gap-1">
          <label htmlFor={field.name} className="text-sm font-medium">
            {field.label}
          </label>
          <input
            id={field.name}
            className="border rounded p-2"
            value={values[field.name] ?? ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        </div>
      ))}
      <button type="submit" className="bg-primary text-primary-foreground px-3 py-1 rounded">
        Salvar
      </button>
    </form>
  );
};

export default GenericCardForm;
