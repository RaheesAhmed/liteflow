import React from "react";
import { render, screen } from "@testing-library/react";
import { Input } from "../input";

describe("Input", () => {
  it("renders correctly", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("applies error styles when error prop is true", () => {
    render(<Input error={true} />);
    expect(screen.getByRole("textbox")).toHaveClass("border-destructive");
  });

  it("displays helper text when provided", () => {
    const helperText = "This is a helper text";
    render(<Input helperText={helperText} />);
    expect(screen.getByText(helperText)).toBeInTheDocument();
  });

  it("displays error helper text with error styles", () => {
    const errorText = "This field is required";
    render(<Input error={true} helperText={errorText} />);
    const helperElement = screen.getByText(errorText);
    expect(helperElement).toHaveClass("text-destructive");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("handles disabled state", () => {
    render(<Input disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("textbox")).toHaveClass("disabled:opacity-50");
  });

  it("combines className prop with default classes", () => {
    render(<Input className="custom-class" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("custom-class");
    expect(input).toHaveClass("flex", "h-9", "w-full");
  });

  it("handles different input types", () => {
    const { rerender } = render(<Input type="text" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");

    rerender(<Input type="password" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "password");

    rerender(<Input type="email" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
  });

  it("handles focus and blur events", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    input.focus();
    expect(input).toHaveFocus();
    input.blur();
    expect(input).not.toHaveFocus();
  });
});
