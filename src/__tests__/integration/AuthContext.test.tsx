import { render, screen } from "@testing-library/react";
import useAuth from "@/hooks/use-auth";

jest.mock("@/hooks/use-auth", () => ({
  __esModule: true,
  default: () => ({
    user: { uid: "mocked-user", email: "test@example.com" },
    loading: false,
  }),
}));

function AuthComponent() {
  const { user } = useAuth();
  return <div>{user?.email}</div>;
}

describe("AuthContext", () => {
  it("renderiza email do usuário autenticado", () => {
    render(<AuthComponent />);
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });
});
