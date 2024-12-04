import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { RadioGroup, RadioGroupItem } from "../radio-group";

describe("RadioGroup", () => {
  it("renders radio group with items", () => {
    render(
      <RadioGroup defaultValue="option1">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option1" id="option1" />
          <label htmlFor="option1">Option 1</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option2" id="option2" />
          <label htmlFor="option2">Option 2</label>
        </div>
      </RadioGroup>
    );

    expect(screen.getByLabelText("Option 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Option 2")).toBeInTheDocument();
  });

  it("handles value changes", () => {
    const onValueChange = jest.fn();
    render(
      <RadioGroup onValueChange={onValueChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option1" id="option1" />
          <label htmlFor="option1">Option 1</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option2" id="option2" />
          <label htmlFor="option2">Option 2</label>
        </div>
      </RadioGroup>
    );

    fireEvent.click(screen.getByLabelText("Option 1"));
    expect(onValueChange).toHaveBeenCalledWith("option1");

    fireEvent.click(screen.getByLabelText("Option 2"));
    expect(onValueChange).toHaveBeenCalledWith("option2");
  });

  it("displays helper text when provided", () => {
    const helperText = "Please select an option";
    render(
      <RadioGroup helperText={helperText}>
        <RadioGroupItem value="option1" />
      </RadioGroup>
    );

    expect(screen.getByText(helperText)).toBeInTheDocument();
  });

  it("displays error state correctly", () => {
    const errorText = "This field is required";
    render(
      <RadioGroup error helperText={errorText}>
        <RadioGroupItem value="option1" error />
      </RadioGroup>
    );

    const helperElement = screen.getByText(errorText);
    expect(helperElement).toHaveClass("text-destructive");

    const radioItem = screen.getByRole("radio");
    expect(radioItem).toHaveClass("border-destructive");
  });

  it("handles disabled state", () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="option1" disabled />
      </RadioGroup>
    );

    const radio = screen.getByRole("radio");
    expect(radio).toBeDisabled();
    expect(radio).toHaveClass(
      "disabled:cursor-not-allowed",
      "disabled:opacity-50"
    );
  });

  it("combines className prop with default classes", () => {
    render(
      <RadioGroup className="group-class">
        <RadioGroupItem value="option1" className="item-class" />
      </RadioGroup>
    );

    expect(screen.getByRole("radiogroup")).toHaveClass(
      "group-class",
      "grid",
      "gap-2"
    );
    expect(screen.getByRole("radio")).toHaveClass("item-class", "h-4", "w-4");
  });

  it("forwards refs correctly", () => {
    const groupRef = React.createRef<HTMLDivElement>();
    const itemRef = React.createRef<HTMLButtonElement>();

    render(
      <RadioGroup ref={groupRef}>
        <RadioGroupItem ref={itemRef} value="option1" />
      </RadioGroup>
    );

    expect(groupRef.current).toBeInstanceOf(HTMLDivElement);
    expect(itemRef.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("handles keyboard navigation", () => {
    const onValueChange = jest.fn();
    render(
      <RadioGroup onValueChange={onValueChange}>
        <RadioGroupItem value="option1" id="option1" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    );

    const firstRadio = screen.getByRole("radio", { name: "" });
    firstRadio.focus();
    expect(firstRadio).toHaveFocus();

    // Arrow down should move to next option
    fireEvent.keyDown(firstRadio, { key: "ArrowDown" });
    expect(onValueChange).toHaveBeenCalledWith("option2");

    // Arrow up should move to previous option
    fireEvent.keyDown(screen.getByRole("radio", { name: "" }), {
      key: "ArrowUp",
    });
    expect(onValueChange).toHaveBeenCalledWith("option1");
  });

  it("maintains accessibility attributes", () => {
    render(
      <RadioGroup aria-label="Options" aria-required="true">
        <RadioGroupItem
          value="option1"
          aria-describedby="description"
          aria-label="First option"
        />
      </RadioGroup>
    );

    expect(screen.getByRole("radiogroup")).toHaveAttribute(
      "aria-label",
      "Options"
    );
    expect(screen.getByRole("radiogroup")).toHaveAttribute(
      "aria-required",
      "true"
    );

    const radio = screen.getByRole("radio");
    expect(radio).toHaveAttribute("aria-describedby", "description");
    expect(radio).toHaveAttribute("aria-label", "First option");
  });
});
