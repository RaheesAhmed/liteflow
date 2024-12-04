import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipArrow,
} from "../tooltip";

describe("Tooltip", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("renders tooltip with all components", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>
            Tooltip content
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    expect(screen.getByText("Hover me")).toBeInTheDocument();

    // Tooltip content should not be visible initially
    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
  });

  it("shows tooltip on hover", async () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    // Hover over trigger
    fireEvent.mouseEnter(screen.getByText("Hover me"));

    // Wait for animation
    act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByText("Tooltip content")).toBeInTheDocument();

    // Mouse leave
    fireEvent.mouseLeave(screen.getByText("Hover me"));

    act(() => {
      jest.runAllTimers();
    });

    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
  });

  it("shows tooltip on focus", async () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Focus me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    // Focus trigger
    fireEvent.focus(screen.getByText("Focus me"));

    act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByText("Tooltip content")).toBeInTheDocument();

    // Blur trigger
    fireEvent.blur(screen.getByText("Focus me"));

    act(() => {
      jest.runAllTimers();
    });

    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
  });

  it("applies correct styles to components", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="trigger-class">Hover me</TooltipTrigger>
          <TooltipContent className="content-class">
            Tooltip content
            <TooltipArrow className="arrow-class" />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    fireEvent.mouseEnter(screen.getByText("Hover me"));

    act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByText("Hover me")).toHaveClass("trigger-class");
    expect(screen.getByText("Tooltip content")).toHaveClass(
      "content-class",
      "z-50",
      "overflow-hidden"
    );
    expect(screen.getByRole("presentation")).toHaveClass(
      "arrow-class",
      "fill-current",
      "text-primary"
    );
  });

  it("handles side offset prop", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent sideOffset={8}>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    fireEvent.mouseEnter(screen.getByText("Hover me"));

    act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByText("Tooltip content")).toHaveAttribute(
      "data-side-offset",
      "8"
    );
  });

  it("forwards refs correctly", () => {
    const triggerRef = React.createRef<HTMLButtonElement>();
    const contentRef = React.createRef<HTMLDivElement>();
    const arrowRef = React.createRef<HTMLDivElement>();

    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger ref={triggerRef}>Hover me</TooltipTrigger>
          <TooltipContent ref={contentRef}>
            Tooltip content
            <TooltipArrow ref={arrowRef} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    fireEvent.mouseEnter(screen.getByText("Hover me"));

    act(() => {
      jest.runAllTimers();
    });

    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
    expect(arrowRef.current).toBeInstanceOf(HTMLDivElement);
  });

  it("maintains accessibility attributes", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger aria-label="Help">Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const trigger = screen.getByText("Hover me");
    expect(trigger).toHaveAttribute("aria-label", "Help");

    fireEvent.mouseEnter(trigger);

    act(() => {
      jest.runAllTimers();
    });

    const content = screen.getByText("Tooltip content");
    expect(content).toHaveAttribute("role", "tooltip");
  });
});
