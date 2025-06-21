import React from "react";

interface PatientPreviewCardProps {
  name: string;
  lastSession: string;
  focus: string;
  tasks: string[];
}

export function PatientPreviewCard({
  name,
  lastSession,
  focus,
  tasks,
}: PatientPreviewCardProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Última sessão: {lastSession}</p>
      <p>{focus}</p>
      <ul>
        {tasks.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
