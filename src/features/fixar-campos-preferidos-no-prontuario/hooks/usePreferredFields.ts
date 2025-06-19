"use client";

import { useEffect, useState } from "react";
import { Field, fieldsSchema } from "../schemas";

const STORAGE_KEY = "preferredFields";

export function usePreferredFields(defaultFields: Field[]) {
  const [fields, setFields] = useState<Field[]>(defaultFields);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = fieldsSchema.parse(JSON.parse(stored));
        setFields(parsed);
      } catch {
        setFields(defaultFields);
      }
    }
  }, [defaultFields]);

  const save = (newFields: Field[]) => {
    setFields(newFields);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFields));
  };

  return { fields, save };
}
