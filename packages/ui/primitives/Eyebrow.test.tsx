import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Eyebrow } from "./Eyebrow";
import { Pill } from "./Pill";

describe("Eyebrow", () => {
  it("renders text in uppercase styling", () => {
    render(<Eyebrow>Pigmentation Clinic</Eyebrow>);
    expect(screen.getByText("Pigmentation Clinic")).toHaveClass("uppercase");
  });
});

describe("Pill", () => {
  it("renders text", () => {
    render(<Pill>GMC ✓</Pill>);
    expect(screen.getByText("GMC ✓")).toBeInTheDocument();
  });
});
