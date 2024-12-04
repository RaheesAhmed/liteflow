import { renderHook, act } from "@testing-library/react";
import {
  useLiteState,
  getLiteState,
  setLiteState,
  createLiteState,
} from "../index";

describe("LiteState", () => {
  beforeEach(() => {
    // Clear any stored state between tests
    jest.clearAllMocks();
  });

  it("should initialize with default value", () => {
    const { result } = renderHook(() => useLiteState("counter", 0));
    expect(result.current[0]).toBe(0);
  });

  it("should update state when setValue is called", () => {
    const { result } = renderHook(() => useLiteState("counter", 0));

    act(() => {
      result.current[1](5);
    });

    expect(result.current[0]).toBe(5);
  });

  it("should share state between hooks with same key", () => {
    const { result: result1 } = renderHook(() =>
      useLiteState("sharedCounter", 0)
    );
    const { result: result2 } = renderHook(() =>
      useLiteState("sharedCounter", 0)
    );

    act(() => {
      result1.current[1](10);
    });

    expect(result1.current[0]).toBe(10);
    expect(result2.current[0]).toBe(10);
  });

  it("should get state using getLiteState", () => {
    const { result } = renderHook(() => useLiteState("testKey", "initial"));

    act(() => {
      result.current[1]("updated");
    });

    expect(getLiteState("testKey")).toBe("updated");
  });

  it("should set state using setLiteState", () => {
    const { result } = renderHook(() => useLiteState("testKey", "initial"));

    act(() => {
      setLiteState("testKey", "external update");
    });

    expect(result.current[0]).toBe("external update");
  });

  it("should create new state using createLiteState", () => {
    createLiteState("newState", "created");
    expect(getLiteState("newState")).toBe("created");
  });

  it("should not override existing state when creating with same key", () => {
    createLiteState("existingState", "initial");
    createLiteState("existingState", "override attempt");
    expect(getLiteState("existingState")).toBe("initial");
  });
});
