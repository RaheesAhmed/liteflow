import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
  SelectSeparator,
} from "../select";

describe("Select", () => {
  it("renders select with all components", () => {
    render(
      <Select>
        <SelectTrigger>
          <span>Select option</span>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectSeparator />
            <SelectLabel>Vegetables</SelectLabel>
            <SelectItem value="carrot">Carrot</SelectItem>
            <SelectItem value="potato">Potato</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );

    expect(screen.getByText("Select option")).toBeInTheDocument();

    // Open select
    fireEvent.click(screen.getByText("Select option"));

    // Check if all options are rendered
    expect(screen.getByText("Fruits")).toBeInTheDocument();
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();
    expect(screen.getByText("Vegetables")).toBeInTheDocument();
    expect(screen.getByText("Carrot")).toBeInTheDocument();
    expect(screen.getByText("Potato")).toBeInTheDocument();
  });

  it("handles option selection", () => {
    const onValueChange = jest.fn();

    render(
      <Select onValueChange={onValueChange}>
        <SelectTrigger>
          <span>Select option</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>
    );

    // Open select
    fireEvent.click(screen.getByText("Select option"));

    // Select an option
    fireEvent.click(screen.getByText("Apple"));
    expect(onValueChange).toHaveBeenCalledWith("apple");
  });

  it("applies correct classes to components", () => {
    render(
      <Select>
        <SelectTrigger className="trigger-class">
          <span>Select option</span>
        </SelectTrigger>
        <SelectContent className="content-class">
          <SelectLabel className="label-class">Fruits</SelectLabel>
          <SelectItem className="item-class" value="apple">
            Apple
          </SelectItem>
          <SelectSeparator className="separator-class" />
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveClass("trigger-class");
    expect(trigger).toHaveClass("flex", "h-9", "w-full");

    // Open select to check other elements
    fireEvent.click(trigger);

    expect(screen.getByText("Fruits")).toHaveClass("label-class");
    expect(screen.getByText("Apple")).toHaveClass("item-class");
  });

  it("handles disabled state", () => {
    render(
      <Select>
        <SelectTrigger disabled>
          <span>Select option</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana" disabled>
            Banana
          </SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByRole("combobox");
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveClass(
      "disabled:cursor-not-allowed",
      "disabled:opacity-50"
    );

    // Try to open select (should not work)
    fireEvent.click(trigger);
    expect(screen.queryByText("Apple")).not.toBeInTheDocument();
  });

  it("forwards refs correctly", () => {
    const triggerRef = React.createRef<HTMLButtonElement>();
    const itemRef = React.createRef<HTMLDivElement>();

    render(
      <Select>
        <SelectTrigger ref={triggerRef}>
          <span>Select option</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem ref={itemRef} value="apple">
            Apple
          </SelectItem>
        </SelectContent>
      </Select>
    );

    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);

    // Open select to check item ref
    fireEvent.click(screen.getByText("Select option"));
    expect(itemRef.current).toBeInstanceOf(HTMLDivElement);
  });

  it("closes on escape key", () => {
    render(
      <Select>
        <SelectTrigger>
          <span>Select option</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
    );

    // Open select
    fireEvent.click(screen.getByText("Select option"));
    expect(screen.getByText("Apple")).toBeInTheDocument();

    // Press escape
    fireEvent.keyDown(document.body, { key: "Escape" });
    expect(screen.queryByText("Apple")).not.toBeInTheDocument();
  });
});
