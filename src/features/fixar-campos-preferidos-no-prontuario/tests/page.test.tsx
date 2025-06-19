import { render, screen, fireEvent } from "@testing-library/react";
import Page from "../pages/Page";

beforeEach(() => {
  localStorage.clear();
});

describe("PreferredFieldsPage", () => {
  it("renders pinned fields", () => {
    render(<Page />);
    expect(screen.getByText("Plano da Última Sessão")).toBeInTheDocument();
  });

  it("opens customization form", () => {
    render(<Page />);
    fireEvent.click(screen.getByText("Personalizar Visualização"));
    expect(screen.getByRole("form")).toBeInTheDocument();
  });
});
