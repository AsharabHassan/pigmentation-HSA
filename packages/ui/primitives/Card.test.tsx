import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  it("renders children inside an article element", () => {
    render(<Card><h3>Treatment</h3></Card>);
    expect(screen.getByRole("article")).toContainElement(screen.getByText("Treatment"));
  });
});
