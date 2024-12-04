import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "../alert-dialog";

describe("AlertDialog", () => {
  it("renders alert dialog with all components", () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Test Title</AlertDialogTitle>
            <AlertDialogDescription>Test Description</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByText("Open Dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Open Dialog"));

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Continue")).toBeInTheDocument();
  });

  it("handles dialog actions", () => {
    const onAction = jest.fn();
    const onCancel = jest.fn();

    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onAction}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    fireEvent.click(screen.getByText("Open Dialog"));
    fireEvent.click(screen.getByText("Continue"));
    expect(onAction).toHaveBeenCalled();

    fireEvent.click(screen.getByText("Open Dialog"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalled();
  });

  it("applies correct styles to components", () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger className="trigger-class">Open</AlertDialogTrigger>
        <AlertDialogContent className="content-class">
          <AlertDialogHeader className="header-class">
            <AlertDialogTitle className="title-class">Title</AlertDialogTitle>
            <AlertDialogDescription className="desc-class">
              Description
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="footer-class">
            <AlertDialogCancel className="cancel-class">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="action-class">
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    fireEvent.click(screen.getByText("Open"));

    expect(screen.getByText("Open")).toHaveClass("trigger-class");
    expect(screen.getByRole("alertdialog")).toHaveClass("content-class");
    expect(screen.getByText("Title").parentElement).toHaveClass("header-class");
    expect(screen.getByText("Title")).toHaveClass("title-class");
    expect(screen.getByText("Description")).toHaveClass("desc-class");
    expect(screen.getByText("Cancel").parentElement).toHaveClass(
      "footer-class"
    );
    expect(screen.getByText("Cancel")).toHaveClass("cancel-class");
    expect(screen.getByText("Continue")).toHaveClass("action-class");
  });

  it("handles keyboard interactions", () => {
    const onCancel = jest.fn();

    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    );

    fireEvent.click(screen.getByText("Open Dialog"));
    fireEvent.keyDown(screen.getByRole("alertdialog"), { key: "Escape" });
    expect(onCancel).toHaveBeenCalled();
  });
});
