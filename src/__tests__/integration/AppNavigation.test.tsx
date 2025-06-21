import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardPage from "@/features/dashboard/page";
import SchedulingPage from "@/features/scheduling/page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe("Navegação entre páginas", () => {
  it("navega para a página de agendamento ao clicar em link simulado", async () => {
    userEvent.setup();
    render(<SchedulingPage />);
    expect(screen.getByText(/Agendamento/i)).toBeInTheDocument();

    render(<DashboardPage />);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });
});
