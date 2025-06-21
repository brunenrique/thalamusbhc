import { render, screen } from "@testing-library/react";
import { PatientPreviewCard } from "../components/PatientPreviewCard";

describe("PatientPreviewCard", () => {
  it("renderiza dados do paciente corretamente", () => {
    render(
      <PatientPreviewCard
        name="João Silva"
        lastSession="10/06/2025"
        focus="Ansiedade"
        tasks={["Respiração diafragmática", "Registro de pensamentos"]}
      />,
    );
    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText(/\u00daltima sessão/i)).toBeInTheDocument();
    expect(screen.getByText(/Ansiedade/i)).toBeInTheDocument();
    expect(screen.getByText(/Respiração diafragmática/i)).toBeInTheDocument();
  });
});
