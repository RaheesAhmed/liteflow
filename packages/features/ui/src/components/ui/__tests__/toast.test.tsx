import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from "../toast";

describe("Toast", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("renders toast with all components", () => {
    render(
      <ToastProvider>
        <Toast>
          <ToastTitle>Test Title</ToastTitle>
          <ToastDescription>Test Description</ToastDescription>
          <ToastAction altText="Test action">Action</ToastAction>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("handles different variants", () => {
    const { rerender } = render(
      <ToastProvider>
        <Toast variant="default">Default Toast</Toast>
        <ToastViewport />
      </ToastProvider>
    );
    expect(screen.getByText("Default Toast")).toHaveClass("bg-background");

    rerender(
      <ToastProvider>
        <Toast variant="destructive">Destructive Toast</Toast>
        <ToastViewport />
      </ToastProvider>
    );
    expect(screen.getByText("Destructive Toast")).toHaveClass("destructive");

    rerender(
      <ToastProvider>
        <Toast variant="success">Success Toast</Toast>
        <ToastViewport />
      </ToastProvider>
    );
    expect(screen.getByText("Success Toast")).toHaveClass("success");
  });

  it("handles toast actions", () => {
    const onAction = jest.fn();
    render(
      <ToastProvider>
        <Toast>
          <ToastAction altText="Test action" onClick={onAction}>
            Action
          </ToastAction>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText("Action"));
    expect(onAction).toHaveBeenCalled();
  });

  it("handles close button", () => {
    const onClose = jest.fn();
    render(
      <ToastProvider>
        <Toast onOpenChange={onClose}>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalledWith(false);
  });

  it("auto-dismisses after duration", () => {
    const onClose = jest.fn();
    render(
      <ToastProvider>
        <Toast duration={2000} onOpenChange={onClose}>
          Test Toast
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    expect(screen.getByText("Test Toast")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(onClose).toHaveBeenCalledWith(false);
  });

  it("applies correct classes to components", () => {
    render(
      <ToastProvider>
        <Toast className="toast-class">
          <ToastTitle className="title-class">Title</ToastTitle>
          <ToastDescription className="desc-class">
            Description
          </ToastDescription>
          <ToastAction className="action-class" altText="Test">
            Action
          </ToastAction>
          <ToastClose className="close-class" />
        </Toast>
        <ToastViewport className="viewport-class" />
      </ToastProvider>
    );

    expect(screen.getByText("Title").parentElement).toHaveClass("toast-class");
    expect(screen.getByText("Title")).toHaveClass("title-class");
    expect(screen.getByText("Description")).toHaveClass("desc-class");
    expect(screen.getByText("Action")).toHaveClass("action-class");
    expect(screen.getByRole("button", { name: /close/i })).toHaveClass(
      "close-class"
    );
  });

  it("forwards refs correctly", () => {
    const toastRef = React.createRef<HTMLDivElement>();
    const titleRef = React.createRef<HTMLDivElement>();
    const descRef = React.createRef<HTMLDivElement>();
    const actionRef = React.createRef<HTMLButtonElement>();
    const closeRef = React.createRef<HTMLButtonElement>();

    render(
      <ToastProvider>
        <Toast ref={toastRef}>
          <ToastTitle ref={titleRef}>Title</ToastTitle>
          <ToastDescription ref={descRef}>Description</ToastDescription>
          <ToastAction ref={actionRef} altText="Test">
            Action
          </ToastAction>
          <ToastClose ref={closeRef} />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    expect(toastRef.current).toBeInstanceOf(HTMLDivElement);
    expect(titleRef.current).toBeInstanceOf(HTMLDivElement);
    expect(descRef.current).toBeInstanceOf(HTMLDivElement);
    expect(actionRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(closeRef.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("handles swipe gestures", () => {
    const onClose = jest.fn();
    render(
      <ToastProvider>
        <Toast onOpenChange={onClose}>Test Toast</Toast>
        <ToastViewport />
      </ToastProvider>
    );

    const toast = screen.getByText("Test Toast").parentElement!;

    // Simulate swipe
    fireEvent.touchStart(toast, {
      touches: [{ clientX: 0, clientY: 0 }],
    });
    fireEvent.touchMove(toast, {
      touches: [{ clientX: 200, clientY: 0 }],
    });
    fireEvent.touchEnd(toast);

    expect(onClose).toHaveBeenCalledWith(false);
  });
});
