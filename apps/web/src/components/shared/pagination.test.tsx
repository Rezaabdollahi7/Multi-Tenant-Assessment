import { describe, expect, it } from "vitest";
import { pageItems } from "./pagination";

describe("pageItems", () => {
  it.each([
    [1, 1, [1]],
    [1, 3, [1, 2, 3]],
    [1, 9, [1, 2, "gap", 9]],
    [5, 9, [1, "gap", 4, 5, 6, "gap", 9]],
    [9, 9, [1, "gap", 8, 9]],
    [3, 9, [1, 2, 3, 4, "gap", 9]],
  ])("on page %i of %i offers %j", (page, total, expected) => {
    expect(pageItems(page, total)).toEqual(expected);
  });
});
