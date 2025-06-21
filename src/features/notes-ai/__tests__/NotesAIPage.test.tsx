import { render, screen } from "@testing-library/react";
import NotesAIPage from "../page";

describe("NotesAIPage", () => {
  it("renderiza título de notas com IA", () => {
    render(<NotesAIPage />);
    expect(screen.getByText(/Notas com IA/i)).toBeInTheDocument();
  });
});
