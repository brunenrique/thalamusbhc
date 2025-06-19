"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fieldsSchema, Field } from "../schemas";

interface Props {
  initialFields: Field[];
  onSave: (fields: Field[]) => void;
}

export default function PreferencesForm({ initialFields, onSave }: Props) {
  const { control, handleSubmit, watch, setValue } = useForm<{ fields: Field[] }>(
    {
      resolver: zodResolver(fieldsSchema),
      defaultValues: { fields: initialFields },
    },
  );

  const fields = watch("fields");

  const move = (from: number, to: number) => {
    const updated = [...fields];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setValue("fields", updated);
  };

  const onSubmit = handleSubmit((data) => onSave(data.fields));

  return (
    <form onSubmit={onSubmit} role="form">
      <ul>
        {fields.map((field, idx) => (
          <li key={field.id} className="mb-2 flex items-center gap-2">
            <Controller
              name={`fields.${idx}.pinned` as const}
              control={control}
              render={({ field }) => <input type="checkbox" {...field} />}
            />
            <span className="flex-1">{field.label}</span>
            <button
              type="button"
              onClick={() => move(idx, idx - 1)}
              disabled={idx === 0}
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => move(idx, idx + 1)}
              disabled={idx === fields.length - 1}
            >
              ↓
            </button>
          </li>
        ))}
      </ul>
      <button type="submit">Salvar</button>
    </form>
  );
}
