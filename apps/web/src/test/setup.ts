import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { server } from "./msw/server";
import "./router";

// jsdom does no layout, so it lacks elementFromPoint; input-otp calls it from a
// timer to detect password-manager badges. Nothing is ever "at" a point here.
if (typeof document !== "undefined") {
  document.elementFromPoint ??= () => null;
}

// jsdom has no media queries; tests run at desktop width with no preferences.
if (typeof window !== "undefined") {
  window.matchMedia ??= (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) satisfies MediaQueryList;
}

beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
afterEach(() => {
  server.resetHandlers();
  cleanup();
  vi.clearAllMocks();
});
afterAll(() => server.close());
