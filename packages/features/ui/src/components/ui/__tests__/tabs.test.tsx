import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../tabs";

describe("Tabs", () => {
  it("renders tabs with all components", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Tab 1" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Tab 2" })).toBeInTheDocument();
    expect(screen.getByRole("tabpanel")).toBeInTheDocument();
    expect(screen.getByText("Content 1")).toBeInTheDocument();
  });

  it("handles tab switching", () => {
    const onValueChange = jest.fn();
    render(
      <Tabs defaultValue="tab1" onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    // Initially shows first tab content
    expect(screen.getByText("Content 1")).toBeInTheDocument();
    expect(screen.queryByText("Content 2")).not.toBeInTheDocument();

    // Click second tab
    fireEvent.click(screen.getByRole("tab", { name: "Tab 2" }));
    expect(onValueChange).toHaveBeenCalledWith("tab2");
  });

  it("applies correct styles to active tab", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    const activeTab = screen.getByRole("tab", { name: "Tab 1" });
    const inactiveTab = screen.getByRole("tab", { name: "Tab 2" });

    expect(activeTab).toHaveAttribute("data-state", "active");
    expect(inactiveTab).toHaveAttribute("data-state", "inactive");

    expect(activeTab).toHaveClass("data-[state=active]:bg-background");
    expect(activeTab).toHaveClass("data-[state=active]:text-foreground");
  });

  it("handles disabled tabs", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2" disabled>
            Tab 2
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    const disabledTab = screen.getByRole("tab", { name: "Tab 2" });
    expect(disabledTab).toBeDisabled();
    expect(disabledTab).toHaveClass(
      "disabled:pointer-events-none",
      "disabled:opacity-50"
    );

    fireEvent.click(disabledTab);
    expect(screen.getByText("Content 1")).toBeInTheDocument();
    expect(screen.queryByText("Content 2")).not.toBeInTheDocument();
  });

  it("combines className prop with default classes", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList className="list-class">
          <TabsTrigger value="tab1" className="trigger-class">
            Tab 1
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="content-class">
          Content 1
        </TabsContent>
      </Tabs>
    );

    expect(screen.getByRole("tablist")).toHaveClass(
      "list-class",
      "inline-flex",
      "h-9"
    );
    expect(screen.getByRole("tab")).toHaveClass(
      "trigger-class",
      "inline-flex",
      "items-center"
    );
    expect(screen.getByRole("tabpanel")).toHaveClass("content-class", "mt-2");
  });

  it("forwards refs correctly", () => {
    const listRef = React.createRef<HTMLDivElement>();
    const triggerRef = React.createRef<HTMLButtonElement>();
    const contentRef = React.createRef<HTMLDivElement>();

    render(
      <Tabs defaultValue="tab1">
        <TabsList ref={listRef}>
          <TabsTrigger value="tab1" ref={triggerRef}>
            Tab 1
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" ref={contentRef}>
          Content 1
        </TabsContent>
      </Tabs>
    );

    expect(listRef.current).toBeInstanceOf(HTMLDivElement);
    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
  });

  it("handles keyboard navigation", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    const firstTab = screen.getByRole("tab", { name: "Tab 1" });
    firstTab.focus();
    expect(firstTab).toHaveFocus();

    // Arrow right should move to next tab
    fireEvent.keyDown(firstTab, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveFocus();

    // Arrow left should move to previous tab
    fireEvent.keyDown(screen.getByRole("tab", { name: "Tab 2" }), {
      key: "ArrowLeft",
    });
    expect(firstTab).toHaveFocus();
  });

  it("maintains accessibility attributes", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList aria-label="Main tabs">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>
    );

    expect(screen.getByRole("tablist")).toHaveAttribute(
      "aria-label",
      "Main tabs"
    );
    expect(screen.getByRole("tab")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveAttribute("aria-labelledby");
  });
});
