import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BeforeAfterSlider } from "./BeforeAfterSlider";

describe("BeforeAfterSlider", () => {
  const props = {
    beforeSrc: "/before.jpg",
    afterSrc: "/after.jpg",
    beforeAlt: "Before treatment",
    afterAlt: "After 4 sessions",
  };

  it("renders both images with alt text", () => {
    render(<BeforeAfterSlider {...props} />);
    expect(screen.getByAltText("Before treatment")).toBeInTheDocument();
    expect(screen.getByAltText("After 4 sessions")).toBeInTheDocument();
  });

  it("exposes a slider role with 0-100 range", () => {
    render(<BeforeAfterSlider {...props} />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "100");
    expect(slider).toHaveAttribute("aria-valuenow", "50");
  });

  it("updates aria-valuenow on keyboard arrow keys", () => {
    render(<BeforeAfterSlider {...props} />);
    const slider = screen.getByRole("slider");
    slider.focus();
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(slider).toHaveAttribute("aria-valuenow", "55");
    fireEvent.keyDown(slider, { key: "ArrowLeft" });
    fireEvent.keyDown(slider, { key: "ArrowLeft" });
    expect(slider).toHaveAttribute("aria-valuenow", "45");
  });
});
