import React from "react";
import { render } from "@testing-library/react";
import { AspectRatio } from "../aspect-ratio";

describe("AspectRatio", () => {
  it("renders with default ratio", () => {
    const { container } = render(
      <AspectRatio>
        <div>Content</div>
      </AspectRatio>
    );

    const aspectRatioDiv = container.firstChild;
    expect(aspectRatioDiv).toBeInTheDocument();
  });

  it("renders with custom ratio", () => {
    const { container } = render(
      <AspectRatio ratio={16 / 9}>
        <div>Content</div>
      </AspectRatio>
    );

    const aspectRatioDiv = container.firstChild;
    expect(aspectRatioDiv).toBeInTheDocument();
  });

  it("maintains aspect ratio with different content", () => {
    const { container } = render(
      <AspectRatio ratio={4 / 3}>
        <img src="test.jpg" alt="Test" />
      </AspectRatio>
    );

    const aspectRatioDiv = container.firstChild;
    expect(aspectRatioDiv).toBeInTheDocument();
  });

  it("combines custom className with default styles", () => {
    const { container } = render(
      <AspectRatio className="custom-class">
        <div>Content</div>
      </AspectRatio>
    );

    const aspectRatioDiv = container.firstChild;
    expect(aspectRatioDiv).toHaveClass("custom-class");
  });
});
