import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../dialog";

describe("Dialog", () => {
  it("renders dialog with all components", () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Title</DialogTitle>
            <DialogDescription>Test Description</DialogDescription>
          </DialogHeader>
          <div>Test Content</div>
          <DialogFooter>Test Footer</DialogFooter>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByText("Open Dialog")).toBeInTheDocument();

    // Click trigger to open dialog
    fireEvent.click(screen.getByText("Open Dialog"));

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(screen.getByText("Test Footer")).toBeInTheDocument();
  });

  it("opens and closes dialog on trigger click", () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    // Initially dialog content should not be visible
    expect(screen.queryByText("Test Dialog")).not.toBeInTheDocument();

    // Open dialog
    fireEvent.click(screen.getByText("Open Dialog"));
    expect(screen.getByText("Test Dialog")).toBeInTheDocument();

    // Close dialog using close button
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByText("Test Dialog")).not.toBeInTheDocument();
  });

  it("applies correct classes to dialog components", () => {
    render(
      <Dialog>
        <DialogTrigger className="trigger-class">Open</DialogTrigger>
        <DialogContent className="content-class">
          <DialogHeader className="header-class">
            <DialogTitle className="title-class">Title</DialogTitle>
            <DialogDescription className="desc-class">
              Description
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="footer-class">Footer</DialogFooter>
        </DialogContent>
      </Dialog>
    );

    fireEvent.click(screen.getByText("Open"));

    expect(screen.getByText("Open")).toHaveClass("trigger-class");
    expect(screen.getByRole("dialog")).toHaveClass("content-class");
    expect(screen.getByText("Title").parentElement).toHaveClass("header-class");
    expect(screen.getByText("Title")).toHaveClass("title-class");
    expect(screen.getByText("Description")).toHaveClass("desc-class");
    expect(screen.getByText("Footer")).toHaveClass("footer-class");
  });

  it("closes dialog on overlay click", () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    // Open dialog
    fireEvent.click(screen.getByText("Open Dialog"));
    expect(screen.getByText("Test Dialog")).toBeInTheDocument();

    // Click overlay to close
    fireEvent.click(document.querySelector("[data-radix-dialog-overlay]")!);
    expect(screen.queryByText("Test Dialog")).not.toBeInTheDocument();
  });

  it("closes dialog on escape key", () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    // Open dialog
    fireEvent.click(screen.getByText("Open Dialog"));
    expect(screen.getByText("Test Dialog")).toBeInTheDocument();

    // Press escape to close
    fireEvent.keyDown(document.body, { key: "Escape" });
    expect(screen.queryByText("Test Dialog")).not.toBeInTheDocument();
  });

  it("forwards refs correctly", () => {
    const triggerRef = React.createRef<HTMLButtonElement>();
    const contentRef = React.createRef<HTMLDivElement>();
    const titleRef = React.createRef<HTMLHeadingElement>();
    const descRef = React.createRef<HTMLParagraphElement>();

    render(
      <Dialog>
        <DialogTrigger ref={triggerRef}>Open</DialogTrigger>
        <DialogContent ref={contentRef}>
          <DialogTitle ref={titleRef}>Title</DialogTitle>
          <DialogDescription ref={descRef}>Description</DialogDescription>
        </DialogContent>
      </Dialog>
    );

    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);

    // Open dialog to check other refs
    fireEvent.click(screen.getByText("Open"));

    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
    expect(titleRef.current).toBeInstanceOf(HTMLHeadingElement);
    expect(descRef.current).toBeInstanceOf(HTMLParagraphElement);
  });
});
