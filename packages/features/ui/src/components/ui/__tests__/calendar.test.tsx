import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Calendar } from "../calendar";

describe("Calendar", () => {
  it("renders calendar with navigation", () => {
    render(<Calendar />);

    expect(screen.getByRole("grid")).toBeInTheDocument();
    expect(screen.getByLabelText("Previous month")).toBeInTheDocument();
    expect(screen.getByLabelText("Next month")).toBeInTheDocument();
  });

  it("handles date selection", () => {
    const onSelect = jest.fn();
    render(<Calendar mode="single" onSelect={onSelect} />);

    const dayButton = screen.getByRole("button", { name: /15/i });
    fireEvent.click(dayButton);

    expect(onSelect).toHaveBeenCalled();
    expect(dayButton).toHaveAttribute("aria-selected", "true");
  });

  it("handles month navigation", () => {
    render(<Calendar />);

    const prevButton = screen.getByLabelText("Previous month");
    const nextButton = screen.getByLabelText("Next month");

    fireEvent.click(nextButton);
    fireEvent.click(prevButton);

    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("shows outside days when enabled", () => {
    render(<Calendar showOutsideDays />);

    const outsideDays = screen
      .getAllByRole("button", {
        name: /\d+/,
      })
      .filter((button) => button.classList.contains("day-outside"));

    expect(outsideDays.length).toBeGreaterThan(0);
  });

  it("applies custom styles", () => {
    render(
      <Calendar
        className="custom-calendar"
        classNames={{
          months: "custom-months",
          month: "custom-month",
          caption: "custom-caption",
        }}
      />
    );

    expect(screen.getByRole("grid").parentElement).toHaveClass(
      "custom-calendar"
    );
    expect(screen.getByRole("grid").parentElement).toHaveClass("custom-months");
  });

  it("handles keyboard navigation", () => {
    render(<Calendar />);

    const dayButton = screen.getByRole("button", { name: /15/i });
    dayButton.focus();

    fireEvent.keyDown(dayButton, { key: "ArrowRight" });
    expect(document.activeElement).toHaveAttribute(
      "aria-label",
      expect.stringContaining("16")
    );

    fireEvent.keyDown(document.activeElement!, { key: "ArrowLeft" });
    expect(document.activeElement).toHaveAttribute(
      "aria-label",
      expect.stringContaining("15")
    );
  });

  it("handles different selection modes", () => {
    const { rerender } = render(<Calendar mode="single" />);
    expect(screen.getByRole("grid")).toBeInTheDocument();

    rerender(<Calendar mode="multiple" />);
    expect(screen.getByRole("grid")).toBeInTheDocument();

    rerender(<Calendar mode="range" />);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });
});
