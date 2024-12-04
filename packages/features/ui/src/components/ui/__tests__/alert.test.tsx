import React from "react";
import { render, screen } from "@testing-library/react";
import { Alert, AlertTitle, AlertDescription } from "../alert";

describe("Alert", () => {
  it("renders alert with all components", () => {
    render(
      <Alert>
        <AlertTitle>Test Title</AlertTitle>
        <AlertDescription>Test Description</AlertDescription>
      </Alert>
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("applies variant styles correctly", () => {
    const { rerender } = render(<Alert variant="default">Default Alert</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("bg-background");

    rerender(<Alert variant="destructive">Destructive Alert</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("border-destructive/50");

    rerender(<Alert variant="success">Success Alert</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("border-green-500/50");

    rerender(<Alert variant="warning">Warning Alert</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("border-yellow-500/50");

    rerender(<Alert variant="info">Info Alert</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("border-blue-500/50");
  });

  it("applies title styles correctly", () => {
    render(<AlertTitle>Test Title</AlertTitle>);
    const title = screen.getByText("Test Title");
    expect(title).toHaveClass(
      "mb-1",
      "font-medium",
      "leading-none",
      "tracking-tight"
    );
  });

  it("applies description styles correctly", () => {
    render(<AlertDescription>Test Description</AlertDescription>);
    const description = screen.getByText("Test Description");
    expect(description).toHaveClass("text-sm", "[&_p]:leading-relaxed");
  });

  it("combines custom className with default styles", () => {
    render(
      <Alert className="custom-class">
        <AlertTitle className="title-class">Title</AlertTitle>
        <AlertDescription className="desc-class">Description</AlertDescription>
      </Alert>
    );

    expect(screen.getByRole("alert")).toHaveClass("custom-class");
    expect(screen.getByText("Title")).toHaveClass("title-class");
    expect(screen.getByText("Description")).toHaveClass("desc-class");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Alert ref={ref}>Test Alert</Alert>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
