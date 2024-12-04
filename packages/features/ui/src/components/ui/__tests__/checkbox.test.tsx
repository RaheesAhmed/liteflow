import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Checkbox } from "../checkbox";

describe("Checkbox", () => {
  it("renders correctly", () => {
    render(<Checkbox aria-label="Test checkbox" />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("handles checked state", () => {
    const onCheckedChange = jest.fn();
    render(
      <Checkbox onCheckedChange={onCheckedChange} aria-label="Test checkbox" />
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalledWith(true);

    fireEvent.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it("displays helper text when provided", () => {
    const helperText = "This is helper text";
    render(<Checkbox helperText={helperText} aria-label="Test checkbox" />);
    expect(screen.getByText(helperText)).toBeInTheDocument();
  });

  it("displays error state correctly", () => {
    const errorText = "This field is required";
    render(
      <Checkbox error helperText={errorText} aria-label="Test checkbox" />
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveClass("border-destructive");

    const helperElement = screen.getByText(errorText);
    expect(helperElement).toHaveClass("text-destructive");
  });

  it("handles disabled state", () => {
    render(<Checkbox disabled aria-label="Test checkbox" />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveClass(
      "disabled:cursor-not-allowed",
      "disabled:opacity-50"
    );
  });

  it("combines className prop with default classes", () => {
    render(<Checkbox className="custom-class" aria-label="Test checkbox" />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toHaveClass("custom-class");
    expect(checkbox).toHaveClass("peer", "h-4", "w-4");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Checkbox ref={ref} aria-label="Test checkbox" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("handles keyboard interaction", () => {
    const onCheckedChange = jest.fn();
    render(
      <Checkbox onCheckedChange={onCheckedChange} aria-label="Test checkbox" />
    );

    const checkbox = screen.getByRole("checkbox");
    checkbox.focus();
    expect(checkbox).toHaveFocus();

    fireEvent.keyDown(checkbox, { key: " " });
    expect(onCheckedChange).toHaveBeenCalledWith(true);

    fireEvent.keyDown(checkbox, { key: " " });
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it("maintains accessibility attributes", () => {
    render(
      <Checkbox
        aria-label="Test checkbox"
        aria-required="true"
        aria-describedby="test-desc"
      />
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-required", "true");
    expect(checkbox).toHaveAttribute("aria-describedby", "test-desc");
  });
});
