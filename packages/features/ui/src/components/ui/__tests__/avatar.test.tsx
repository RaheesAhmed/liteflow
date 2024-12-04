import React from "react";
import { render, screen } from "@testing-library/react";
import { Avatar, AvatarImage, AvatarFallback } from "../avatar";

describe("Avatar", () => {
  it("renders avatar with image", () => {
    render(
      <Avatar>
        <AvatarImage src="test.jpg" alt="Test Avatar" />
      </Avatar>
    );

    expect(screen.getByRole("img")).toHaveAttribute("src", "test.jpg");
    expect(screen.getByRole("img")).toHaveAttribute("alt", "Test Avatar");
  });

  it("renders fallback when image fails to load", () => {
    render(
      <Avatar>
        <AvatarImage src="invalid.jpg" alt="Invalid Avatar" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );

    const img = screen.getByRole("img");
    img.dispatchEvent(new Event("error"));

    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("applies default styles to avatar", () => {
    render(
      <Avatar>
        <AvatarImage src="test.jpg" alt="Test Avatar" />
      </Avatar>
    );

    const avatar = screen.getByRole("img").parentElement;
    expect(avatar).toHaveClass(
      "relative",
      "flex",
      "h-10",
      "w-10",
      "shrink-0",
      "overflow-hidden",
      "rounded-full"
    );
  });

  it("applies styles to avatar image", () => {
    render(
      <Avatar>
        <AvatarImage src="test.jpg" alt="Test Avatar" />
      </Avatar>
    );

    const image = screen.getByRole("img");
    expect(image).toHaveClass("aspect-square", "h-full", "w-full");
  });

  it("applies styles to avatar fallback", () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );

    const fallback = screen.getByText("JD");
    expect(fallback).toHaveClass(
      "flex",
      "h-full",
      "w-full",
      "items-center",
      "justify-center",
      "rounded-full",
      "bg-muted"
    );
  });

  it("combines custom className with default styles", () => {
    render(
      <Avatar className="avatar-class">
        <AvatarImage className="image-class" src="test.jpg" alt="Test Avatar" />
        <AvatarFallback className="fallback-class">JD</AvatarFallback>
      </Avatar>
    );

    const avatar = screen.getByRole("img").parentElement;
    const image = screen.getByRole("img");
    const fallback = screen.getByText("JD");

    expect(avatar).toHaveClass("avatar-class");
    expect(image).toHaveClass("image-class");
    expect(fallback).toHaveClass("fallback-class");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Avatar ref={ref}>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
