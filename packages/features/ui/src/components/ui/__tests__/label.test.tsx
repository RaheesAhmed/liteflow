import React from "react";
import { render, screen } from "@testing-library/react";
import { Label } from "../label";

describe("Label", () => {
  it("renders label with text", () => {
    render(<Label>Test Label</Label>);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("applies default styles", () => {
    render(<Label>Test Label</Label>);
    const label = screen.getByText("Test Label");
    expect(label).toHaveClass("text-sm", "font-medium", "leading-none");
  });

  it("combines custom className with default styles", () => {
    render(<Label className="custom-class">Test Label</Label>);
    const label = screen.getByText("Test Label");
    expect(label).toHaveClass("custom-class");
    expect(label).toHaveClass("text-sm", "font-medium", "leading-none");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Test Label</Label>);
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });

  it("applies disabled styles when used with disabled form control", () => {
    render(
      <div>
        <Label htmlFor="test-input">Test Label</Label>
        <input id="test-input" disabled />
      </div>
    );
    const label = screen.getByText("Test Label");
    expect(label).toHaveClass(
      "peer-disabled:cursor-not-allowed",
      "peer-disabled:opacity-70"
    );
  });

  it("handles htmlFor attribute", () => {
    render(
      <div>
        <Label htmlFor="test-input">Test Label</Label>
        <input id="test-input" />
      </div>
    );
    const label = screen.getByText("Test Label");
    expect(label).toHaveAttribute("for", "test-input");
  });
});
