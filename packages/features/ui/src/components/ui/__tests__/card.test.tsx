import React from "react";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "../card";

describe("Card", () => {
  it("renders all card components correctly", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
          <CardDescription>Test Description</CardDescription>
        </CardHeader>
        <CardContent>Test Content</CardContent>
        <CardFooter>Test Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(screen.getByText("Test Footer")).toBeInTheDocument();
  });

  it("applies default classes to Card", () => {
    render(<Card>Content</Card>);
    expect(screen.getByText("Content").parentElement).toHaveClass(
      "rounded-xl",
      "border",
      "bg-card"
    );
  });

  it("applies default classes to CardHeader", () => {
    render(<CardHeader>Header</CardHeader>);
    expect(screen.getByText("Header")).toHaveClass(
      "flex",
      "flex-col",
      "space-y-1.5",
      "p-6"
    );
  });

  it("applies default classes to CardTitle", () => {
    render(<CardTitle>Title</CardTitle>);
    expect(screen.getByText("Title")).toHaveClass(
      "font-semibold",
      "leading-none",
      "tracking-tight"
    );
  });

  it("applies default classes to CardDescription", () => {
    render(<CardDescription>Description</CardDescription>);
    expect(screen.getByText("Description")).toHaveClass(
      "text-sm",
      "text-muted-foreground"
    );
  });

  it("applies default classes to CardContent", () => {
    render(<CardContent>Content</CardContent>);
    expect(screen.getByText("Content")).toHaveClass("p-6", "pt-0");
  });

  it("applies default classes to CardFooter", () => {
    render(<CardFooter>Footer</CardFooter>);
    expect(screen.getByText("Footer")).toHaveClass(
      "flex",
      "items-center",
      "p-6",
      "pt-0"
    );
  });

  it("combines custom className with default classes", () => {
    render(
      <Card className="custom-class">
        <CardHeader className="header-class">
          <CardTitle className="title-class">Title</CardTitle>
          <CardDescription className="desc-class">Description</CardDescription>
        </CardHeader>
        <CardContent className="content-class">Content</CardContent>
        <CardFooter className="footer-class">Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText("Title").parentElement?.parentElement).toHaveClass(
      "custom-class"
    );
    expect(screen.getByText("Title").parentElement).toHaveClass("header-class");
    expect(screen.getByText("Title")).toHaveClass("title-class");
    expect(screen.getByText("Description")).toHaveClass("desc-class");
    expect(screen.getByText("Content")).toHaveClass("content-class");
    expect(screen.getByText("Footer")).toHaveClass("footer-class");
  });

  it("forwards refs correctly", () => {
    const cardRef = React.createRef<HTMLDivElement>();
    const headerRef = React.createRef<HTMLDivElement>();
    const titleRef = React.createRef<HTMLHeadingElement>();
    const descRef = React.createRef<HTMLParagraphElement>();
    const contentRef = React.createRef<HTMLDivElement>();
    const footerRef = React.createRef<HTMLDivElement>();

    render(
      <Card ref={cardRef}>
        <CardHeader ref={headerRef}>
          <CardTitle ref={titleRef}>Title</CardTitle>
          <CardDescription ref={descRef}>Description</CardDescription>
        </CardHeader>
        <CardContent ref={contentRef}>Content</CardContent>
        <CardFooter ref={footerRef}>Footer</CardFooter>
      </Card>
    );

    expect(cardRef.current).toBeInstanceOf(HTMLDivElement);
    expect(headerRef.current).toBeInstanceOf(HTMLDivElement);
    expect(titleRef.current).toBeInstanceOf(HTMLHeadingElement);
    expect(descRef.current).toBeInstanceOf(HTMLParagraphElement);
    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
    expect(footerRef.current).toBeInstanceOf(HTMLDivElement);
  });
});
