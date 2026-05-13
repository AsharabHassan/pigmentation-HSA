import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NavBar } from "./NavBar";

describe("NavBar", () => {
  it("renders logo + primary nav + CTA", () => {
    render(<NavBar />);
    expect(screen.getByText(/harley street medics/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /treatments/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /the doctor/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /book now/i })).toBeInTheDocument();
  });
});
