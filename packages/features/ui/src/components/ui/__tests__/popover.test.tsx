import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Popover, PopoverTrigger, PopoverContent } from "../popover";

describe("Popover", () => {
  it("renders popover with trigger and content", () => {
    render(
      <Popover>
        <PopoverTrigger>Click me</PopoverTrigger>
        <PopoverContent>Popover content</PopoverContent>
      </Popover>
    );

    expect(screen.getByText("Click me")).toBeInTheDocument();
    expect(screen.queryByText("Popover content")).not.toBeInTheDocument();
  });

  it("shows content when trigger is clicked", () => {
    render(
      <Popover>
        <PopoverTrigger>Click me</PopoverTrigger>
        <PopoverContent>Popover content</PopoverContent>
      </Popover>
    );

    fireEvent.click(screen.getByText("Click me"));
    expect(screen.getByText("Popover content")).toBeInTheDocument();
  });

  it("hides content when clicked outside", () => {
    render(
      <div>
        <Popover>
          <PopoverTrigger>Click me</PopoverTrigger>
          <PopoverContent>Popover content</PopoverContent>
        </Popover>
        <div data-testid="outside">Outside</div>
      </div>
    );

    fireEvent.click(screen.getByText("Click me"));
    expect(screen.getByText("Popover content")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("outside"));
    expect(screen.queryByText("Popover content")).not.toBeInTheDocument();
  });

  it("applies custom classes to content", () => {
    render(
      <Popover>
        <PopoverTrigger>Click me</PopoverTrigger>
        <PopoverContent className="custom-class">
          Popover content
        </PopoverContent>
      </Popover>
    );

    fireEvent.click(screen.getByText("Click me"));
    expect(screen.getByText("Popover content").parentElement).toHaveClass(
      "custom-class"
    );
  });

  it("supports different alignments", () => {
    render(
      <Popover>
        <PopoverTrigger>Click me</PopoverTrigger>
        <PopoverContent align="start">Popover content</PopoverContent>
      </Popover>
    );

    fireEvent.click(screen.getByText("Click me"));
    expect(screen.getByText("Popover content").parentElement).toHaveAttribute(
      "data-align",
      "start"
    );
  });
});
