import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Switch } from "../switch";

describe("Switch", () => {
  it("renders correctly", () => {
    render(<Switch aria-label="Toggle" />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("handles checked state changes", () => {
    const onCheckedChange = jest.fn();
    render(<Switch onCheckedChange={onCheckedChange} aria-label="Toggle" />);

    const switchElement = screen.getByRole("switch");
    expect(switchElement).not.toBeChecked();

    fireEvent.click(switchElement);
    expect(onCheckedChange).toHaveBeenCalledWith(true);

    fireEvent.click(switchElement);
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it("displays helper text when provided", () => {
    const helperText = "Toggle this switch";
    render(<Switch helperText={helperText} aria-label="Toggle" />);
    expect(screen.getByText(helperText)).toBeInTheDocument();
  });

  it("displays error state correctly", () => {
    const errorText = "This field is required";
    render(<Switch error helperText={errorText} aria-label="Toggle" />);

    const switchElement = screen.getByRole("switch");
    expect(switchElement).toHaveClass("ring-2", "ring-destructive");

    const helperElement = screen.getByText(errorText);
    expect(helperElement).toHaveClass("text-destructive");
  });

  it("handles disabled state", () => {
    render(<Switch disabled aria-label="Toggle" />);
    const switchElement = screen.getByRole("switch");

    expect(switchElement).toBeDisabled();
    expect(switchElement).toHaveClass(
      "disabled:cursor-not-allowed",
      "disabled:opacity-50"
    );

    fireEvent.click(switchElement);
    expect(switchElement).not.toBeChecked();
  });

  it("combines className prop with default classes", () => {
    render(<Switch className="custom-class" aria-label="Toggle" />);
    const switchElement = screen.getByRole("switch");

    expect(switchElement).toHaveClass("custom-class");
    expect(switchElement).toHaveClass("peer", "inline-flex", "h-5", "w-9");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Switch ref={ref} aria-label="Toggle" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("handles keyboard interaction", () => {
    const onCheckedChange = jest.fn();
    render(<Switch onCheckedChange={onCheckedChange} aria-label="Toggle" />);

    const switchElement = screen.getByRole("switch");
    switchElement.focus();
    expect(switchElement).toHaveFocus();

    fireEvent.keyDown(switchElement, { key: " " });
    expect(onCheckedChange).toHaveBeenCalledWith(true);

    fireEvent.keyDown(switchElement, { key: " " });
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it("maintains accessibility attributes", () => {
    render(
      <Switch
        aria-label="Toggle feature"
        aria-required="true"
        aria-describedby="description"
      />
    );

    const switchElement = screen.getByRole("switch");
    expect(switchElement).toHaveAttribute("aria-label", "Toggle feature");
    expect(switchElement).toHaveAttribute("aria-required", "true");
    expect(switchElement).toHaveAttribute("aria-describedby", "description");
  });

  it("handles default checked state", () => {
    render(<Switch defaultChecked aria-label="Toggle" />);
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("updates visual state on check", () => {
    render(<Switch aria-label="Toggle" />);
    const switchElement = screen.getByRole("switch");

    expect(switchElement).toHaveAttribute("data-state", "unchecked");
    fireEvent.click(switchElement);
    expect(switchElement).toHaveAttribute("data-state", "checked");
  });

  it("renders thumb component with correct styles", () => {
    render(<Switch aria-label="Toggle" />);
    const thumb = screen.getByRole("switch").querySelector("span");

    expect(thumb).toHaveClass(
      "pointer-events-none",
      "block",
      "h-4",
      "w-4",
      "rounded-full",
      "bg-background"
    );
  });
});
