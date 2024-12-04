import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "../sidebar";

describe("Sidebar", () => {
  it("renders sidebar with all components", () => {
    render(
      <Sidebar>
        <SidebarHeader>Header</SidebarHeader>
        <SidebarContent>Content</SidebarContent>
        <SidebarFooter>Footer</SidebarFooter>
      </Sidebar>
    );

    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("handles collapsed state", () => {
    render(
      <Sidebar collapsed>
        <SidebarContent>Content</SidebarContent>
      </Sidebar>
    );

    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toHaveClass("w-[80px]");
  });

  it("handles toggled state and backdrop click", () => {
    const onBackdropClick = jest.fn();
    render(
      <Sidebar toggled onBackdropClick={onBackdropClick}>
        <SidebarContent>Content</SidebarContent>
      </Sidebar>
    );

    const backdrop = screen.getByRole("complementary").previousSibling;
    expect(backdrop).toHaveClass("bg-black/50");

    fireEvent.click(backdrop as Element);
    expect(onBackdropClick).toHaveBeenCalled();
  });

  it("supports different positions", () => {
    const { rerender } = render(
      <Sidebar position="left">
        <SidebarContent>Content</SidebarContent>
      </Sidebar>
    );

    let sidebar = screen.getByRole("complementary");
    expect(sidebar).toHaveClass("left-0");

    rerender(
      <Sidebar position="right">
        <SidebarContent>Content</SidebarContent>
      </Sidebar>
    );

    sidebar = screen.getByRole("complementary");
    expect(sidebar).toHaveClass("right-0");
  });

  it("applies custom width", () => {
    render(
      <Sidebar width="300px">
        <SidebarContent>Content</SidebarContent>
      </Sidebar>
    );

    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toHaveClass("w-[300px]");
  });

  it("applies custom breakpoint", () => {
    render(
      <Sidebar breakPoint="md">
        <SidebarContent>Content</SidebarContent>
      </Sidebar>
    );

    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toHaveClass("md:relative", "md:z-0", "max-md:hidden");
  });

  it("combines custom className with default styles", () => {
    render(
      <Sidebar className="custom-class">
        <SidebarContent>Content</SidebarContent>
      </Sidebar>
    );

    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toHaveClass("custom-class");
    expect(sidebar).toHaveClass("fixed", "top-0", "bottom-0", "z-50");
  });
});
