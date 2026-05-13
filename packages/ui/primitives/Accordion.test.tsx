import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Accordion, AccordionItem } from "./Accordion";

describe("Accordion", () => {
  it("toggles open on click", () => {
    render(
      <Accordion>
        <AccordionItem question="Does this work?">It works.</AccordionItem>
      </Accordion>,
    );
    const trigger = screen.getByRole("button", { name: /does this work/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("It works.")).toBeVisible();
  });

  it("supports keyboard activation", () => {
    render(
      <Accordion>
        <AccordionItem question="Q1">A1</AccordionItem>
      </Accordion>,
    );
    const trigger = screen.getByRole("button");
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });
});
