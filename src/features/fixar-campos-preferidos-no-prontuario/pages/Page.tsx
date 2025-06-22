"use client";

import React from "react";
import { useState } from "react";
import PreferencesForm from "../components/PreferencesForm";
import { usePreferredFields } from "../hooks/usePreferredFields";
import { DEFAULT_FIELDS } from "../schemas";

export default function PreferredFieldsPage() {
  const { fields, save } = usePreferredFields(DEFAULT_FIELDS);
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <PreferencesForm
        initialFields={fields}
        onSave={(f) => {
          save(f);
          setEditing(false);
        }}
      />
    );
  }

  const pinned = fields.filter((f) => f.pinned);

  return (
    <div>
      <h1>Campos Fixados</h1>
      <ul>
        {pinned.map((f) => (
          <li key={f.id}>{f.label}</li>
        ))}
      </ul>
      <button onClick={() => setEditing(true)}>Personalizar Visualização</button>
    </div>
  );
}
