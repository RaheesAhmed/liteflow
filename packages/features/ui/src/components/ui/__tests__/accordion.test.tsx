import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../accordion";

describe("Accordion", () => {
  it("renders accordion with all components", () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByText("Section 1")).toBeInTheDocument();
    expect(screen.getByText("Section 2")).toBeInTheDocument();
    expect(screen.getByText("Content 1")).toBeInTheDocument();
    expect(screen.getByText("Content 2")).toBeInTheDocument();
  });

  it("handles single type accordion", () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger1 = screen.getByText("Section 1");
    const trigger2 = screen.getByText("Section 2");

    // Initially both sections are closed
    expect(trigger1).toHaveAttribute("data-state", "closed");
    expect(trigger2).toHaveAttribute("data-state", "closed");

    // Open first section
    fireEvent.click(trigger1);
    expect(trigger1).toHaveAttribute("data-state", "open");
    expect(trigger2).toHaveAttribute("data-state", "closed");

    // Open second section (first should close)
    fireEvent.click(trigger2);
    expect(trigger1).toHaveAttribute("data-state", "closed");
    expect(trigger2).toHaveAttribute("data-state", "open");
  });

  it("handles multiple type accordion", () => {
    render(
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger1 = screen.getByText("Section 1");
    const trigger2 = screen.getByText("Section 2");

    // Open first section
    fireEvent.click(trigger1);
    expect(trigger1).toHaveAttribute("data-state", "open");
    expect(trigger2).toHaveAttribute("data-state", "closed");

    // Open second section (first should stay open)
    fireEvent.click(trigger2);
    expect(trigger1).toHaveAttribute("data-state", "open");
    expect(trigger2).toHaveAttribute("data-state", "open");
  });

  it("applies correct styles to components", () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item-1" className="item-class">
          <AccordionTrigger className="trigger-class">
            Section 1
          </AccordionTrigger>
          <AccordionContent className="content-class">
            Content 1
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByRole("region").parentElement).toHaveClass(
      "item-class",
      "border-b"
    );
    expect(screen.getByRole("button")).toHaveClass("trigger-class", "flex-1");
    expect(screen.getByRole("region")).toHaveClass(
      "content-class",
      "overflow-hidden"
    );
  });

  it("handles keyboard navigation", () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger1 = screen.getByText("Section 1");
    const trigger2 = screen.getByText("Section 2");

    // Focus first trigger
    trigger1.focus();
    expect(trigger1).toHaveFocus();

    // Arrow down should move to next trigger
    fireEvent.keyDown(trigger1, { key: "ArrowDown" });
    expect(trigger2).toHaveFocus();

    // Arrow up should move to previous trigger
    fireEvent.keyDown(trigger2, { key: "ArrowUp" });
    expect(trigger1).toHaveFocus();

    // Space should toggle section
    fireEvent.keyDown(trigger1, { key: " " });
    expect(trigger1).toHaveAttribute("data-state", "open");
  });

  it("forwards refs correctly", () => {
    const itemRef = React.createRef<HTMLDivElement>();
    const triggerRef = React.createRef<HTMLButtonElement>();
    const contentRef = React.createRef<HTMLDivElement>();

    render(
      <Accordion type="single">
        <AccordionItem ref={itemRef} value="item-1">
          <AccordionTrigger ref={triggerRef}>Section 1</AccordionTrigger>
          <AccordionContent ref={contentRef}>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(itemRef.current).toBeInstanceOf(HTMLDivElement);
    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
  });

  it("maintains accessibility attributes", () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole("button");
    const content = screen.getByRole("region");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-controls");
    expect(content).toHaveAttribute("aria-labelledby");

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });
});
