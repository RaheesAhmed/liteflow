import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../carousel";

describe("Carousel", () => {
  it("renders carousel with all components", () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
          <CarouselItem>Slide 3</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );

    expect(screen.getByText("Slide 1")).toBeInTheDocument();
    expect(screen.getByText("Slide 2")).toBeInTheDocument();
    expect(screen.getByText("Slide 3")).toBeInTheDocument();
    expect(screen.getByLabelText("Previous slide")).toBeInTheDocument();
    expect(screen.getByLabelText("Next slide")).toBeInTheDocument();
  });

  it("handles navigation buttons", () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );

    const prevButton = screen.getByLabelText("Previous slide");
    const nextButton = screen.getByLabelText("Next slide");

    fireEvent.click(nextButton);
    fireEvent.click(prevButton);

    expect(screen.getByText("Slide 1")).toBeInTheDocument();
  });

  it("handles keyboard navigation", () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    const carousel = screen.getByRole("region");
    fireEvent.keyDown(carousel, { key: "ArrowRight" });
    fireEvent.keyDown(carousel, { key: "ArrowLeft" });

    expect(screen.getByText("Slide 1")).toBeInTheDocument();
  });

  it("supports different orientations", () => {
    const { rerender } = render(
      <Carousel orientation="horizontal">
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );

    expect(screen.getByLabelText("Previous slide")).toHaveClass(
      "-left-12",
      "top-1/2"
    );

    rerender(
      <Carousel orientation="vertical">
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );

    expect(screen.getByLabelText("Previous slide")).toHaveClass(
      "-top-12",
      "left-1/2"
    );
  });

  it("applies custom styles", () => {
    render(
      <Carousel className="custom-carousel">
        <CarouselContent className="custom-content">
          <CarouselItem className="custom-item">Slide 1</CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="custom-prev" />
        <CarouselNext className="custom-next" />
      </Carousel>
    );

    expect(screen.getByRole("region")).toHaveClass("custom-carousel");
    expect(screen.getByText("Slide 1").parentElement).toHaveClass(
      "custom-item"
    );
    expect(screen.getByLabelText("Previous slide")).toHaveClass("custom-prev");
    expect(screen.getByLabelText("Next slide")).toHaveClass("custom-next");
  });

  it("handles API callbacks", () => {
    const setApi = jest.fn();
    render(
      <Carousel setApi={setApi}>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    expect(setApi).toHaveBeenCalled();
  });

  it("supports plugins", () => {
    const mockPlugin = jest.fn();
    render(
      <Carousel plugins={[mockPlugin]}>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    expect(mockPlugin).toHaveBeenCalled();
  });
});
