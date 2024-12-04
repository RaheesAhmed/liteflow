import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Badge } from "../badge";

describe("Badge", () => {
  it("renders badge with text", () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText("Test Badge")).toBeInTheDocument();
  });

  it("applies variant styles correctly", () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>);
    expect(screen.getByText("Default")).toHaveClass(
      "bg-primary",
      "text-primary-foreground"
    );

    rerender(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText("Secondary")).toHaveClass(
      "bg-secondary",
      "text-secondary-foreground"
    );

    rerender(<Badge variant="destructive">Destructive</Badge>);
    expect(screen.getByText("Destructive")).toHaveClass(
      "bg-destructive",
      "text-destructive-foreground"
    );

    rerender(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText("Outline")).toHaveClass("text-foreground");

    rerender(<Badge variant="success">Success</Badge>);
    expect(screen.getByText("Success")).toHaveClass(
      "bg-green-500",
      "text-white"
    );

    rerender(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByText("Warning")).toHaveClass(
      "bg-yellow-500",
      "text-white"
    );

    rerender(<Badge variant="info">Info</Badge>);
    expect(screen.getByText("Info")).toHaveClass("bg-blue-500", "text-white");
  });

  it("applies size styles correctly", () => {
    const { rerender } = render(<Badge size="default">Default</Badge>);
    expect(screen.getByText("Default")).toHaveClass(
      "px-2.5",
      "py-0.5",
      "text-xs"
    );

    rerender(<Badge size="sm">Small</Badge>);
    expect(screen.getByText("Small")).toHaveClass("px-2", "py-0.5", "text-xs");

    rerender(<Badge size="lg">Large</Badge>);
    expect(screen.getByText("Large")).toHaveClass("px-3", "py-1", "text-sm");
  });

  it("applies rounded styles correctly", () => {
    const { rerender } = render(<Badge rounded="default">Default</Badge>);
    expect(screen.getByText("Default")).toHaveClass("rounded-full");

    rerender(<Badge rounded="sm">Small</Badge>);
    expect(screen.getByText("Small")).toHaveClass("rounded-md");

    rerender(<Badge rounded="lg">Large</Badge>);
    expect(screen.getByText("Large")).toHaveClass("rounded-lg");
  });

  it("handles removable badge", () => {
    const onRemove = jest.fn();
    render(
      <Badge removable onRemove={onRemove}>
        Removable
      </Badge>
    );

    const removeButton = screen.getByRole("button");
    expect(removeButton).toBeInTheDocument();

    fireEvent.click(removeButton);
    expect(onRemove).toHaveBeenCalled();
  });

  it("combines custom className with default styles", () => {
    render(<Badge className="custom-class">Test Badge</Badge>);
    const badge = screen.getByText("Test Badge");
    expect(badge).toHaveClass("custom-class");
    expect(badge).toHaveClass(
      "inline-flex",
      "items-center",
      "rounded-full",
      "border"
    );
  });
});
