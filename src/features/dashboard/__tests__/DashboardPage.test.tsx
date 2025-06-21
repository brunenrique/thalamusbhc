import { render, screen } from "@testing-library/react";
import DashboardPage from "../page";

describe("DashboardPage", () => {
  it("deve exibir os cards principais", () => {
    render(<DashboardPage />);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Sessões da Semana/i)).toBeInTheDocument();
    expect(screen.getByText(/Pacientes Ativos/i)).toBeInTheDocument();
  });
});
