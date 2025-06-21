import { render, screen } from "@testing-library/react";
import useAuth from "@/hooks/use-auth";

jest.mock("@/hooks/use-auth", () => ({
  __esModule: true,
  default: () => {
    throw new Error("Firebase Auth Failed");
  },
}));

function ErrorBoundaryTest() {
  try {
    useAuth();
    return <div>Autenticado</div>;
  } catch (e) {
    return <div>Erro: {(e as Error).message}</div>;
  }
}

describe("Erro de Firebase Auth", () => {
  it("exibe mensagem de erro se auth falhar", () => {
    render(<ErrorBoundaryTest />);
    expect(screen.getByText(/Erro: Firebase Auth Failed/i)).toBeInTheDocument();
  });
});
