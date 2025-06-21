import { render, screen } from "@testing-library/react";
import useAuth from "@/hooks/use-auth";

jest.mock("@/hooks/use-auth", () => ({
  __esModule: true,
  default: () => ({
    user: null,
    loading: true,
  }),
}));

function LoadingComponent() {
  const { loading } = useAuth();
  return <div>{loading ? "Carregando..." : "Carregado"}</div>;
}

describe("Loading State", () => {
  it("exibe mensagem de carregamento", () => {
    render(<LoadingComponent />);
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });
});
