import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Section } from "./Section";
import { Container } from "./Container";

describe("Section + Container", () => {
  it("Section renders as <section>", () => {
    render(<Section data-testid="s"><p>Hi</p></Section>);
    expect(screen.getByTestId("s").tagName).toBe("SECTION");
  });

  it("Container constrains width to content default", () => {
    render(<Container data-testid="c"><p>Hi</p></Container>);
    expect(screen.getByTestId("c")).toHaveClass("max-w-[960px]");
  });

  it("Container width=wide swaps max-width", () => {
    render(<Container data-testid="c" width="wide"><p>Hi</p></Container>);
    expect(screen.getByTestId("c")).toHaveClass("max-w-[1240px]");
  });
});
