import { render, screen } from "@testing-library/react";
import SchedulingPage from "../page";

describe("SchedulingPage", () => {
  it("renderiza título de agendamento", () => {
    render(<SchedulingPage />);
    expect(screen.getByText(/Agendamento/i)).toBeInTheDocument();
  });
});
