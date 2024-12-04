import React from "react";
import { render, screen } from "@testing-library/react";
import { Breadcrumbs, BreadcrumbItem } from "../breadcrumb";

describe("Breadcrumbs", () => {
  it("renders breadcrumbs with items", () => {
    render(
      <Breadcrumbs>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Category</BreadcrumbItem>
        <BreadcrumbItem isCurrent>Current Page</BreadcrumbItem>
      </Breadcrumbs>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Current Page")).toBeInTheDocument();
  });

  it("handles collapsed state with many items", () => {
    render(
      <Breadcrumbs maxItems={3}>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Category</BreadcrumbItem>
        <BreadcrumbItem>Subcategory</BreadcrumbItem>
        <BreadcrumbItem>Product</BreadcrumbItem>
        <BreadcrumbItem isCurrent>Details</BreadcrumbItem>
      </Breadcrumbs>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.queryByText("Category")).not.toBeInTheDocument();
    expect(screen.queryByText("Subcategory")).not.toBeInTheDocument();
    expect(screen.getByText("Details")).toBeInTheDocument();
  });

  it("supports custom separator", () => {
    render(
      <Breadcrumbs separator="-">
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem isCurrent>Current</BreadcrumbItem>
      </Breadcrumbs>
    );

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("applies variant styles to items", () => {
    render(
      <Breadcrumbs>
        <BreadcrumbItem variant="default">Default</BreadcrumbItem>
        <BreadcrumbItem variant="ghost">Ghost</BreadcrumbItem>
        <BreadcrumbItem variant="link">Link</BreadcrumbItem>
      </Breadcrumbs>
    );

    expect(screen.getByText("Default")).toHaveClass(
      "text-muted-foreground",
      "hover:text-foreground"
    );
    expect(screen.getByText("Ghost")).toHaveClass("hover:text-foreground/80");
    expect(screen.getByText("Link")).toHaveClass(
      "text-primary",
      "underline-offset-4",
      "hover:underline"
    );
  });

  it("renders links when href is provided", () => {
    render(
      <Breadcrumbs>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/category">Category</BreadcrumbItem>
      </Breadcrumbs>
    );

    const homeLink = screen.getByText("Home").closest("a");
    const categoryLink = screen.getByText("Category").closest("a");

    expect(homeLink).toHaveAttribute("href", "/");
    expect(categoryLink).toHaveAttribute("href", "/category");
  });

  it("marks current item with aria-current", () => {
    render(
      <Breadcrumbs>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem isCurrent>Current</BreadcrumbItem>
      </Breadcrumbs>
    );

    expect(screen.getByText("Current").closest("li")).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("combines custom className with default styles", () => {
    render(
      <Breadcrumbs className="custom-class">
        <BreadcrumbItem className="item-class">Item</BreadcrumbItem>
      </Breadcrumbs>
    );

    expect(screen.getByRole("navigation")).toHaveClass(
      "custom-class",
      "relative"
    );
    expect(screen.getByText("Item").closest("li")).toHaveClass(
      "item-class",
      "flex",
      "items-center",
      "gap-1.5",
      "text-sm"
    );
  });
});
