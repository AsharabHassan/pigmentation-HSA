import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
  it("renders with label", () => {
    render(<Input id="email" label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("shows help text", () => {
    render(<Input id="phone" label="Phone" helpText="Used for booking SMS" />);
    expect(screen.getByText("Used for booking SMS")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<Input id="email" label="Email" error="Required" />);
    expect(screen.getByText("Required")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
  });
});
