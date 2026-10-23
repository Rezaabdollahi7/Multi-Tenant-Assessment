import { describe, expect, it } from "vitest";
import { formatCount, formatDay, formatRelativeTime } from "./format";

const NOW = new Date("2026-10-22T12:00:00Z");

describe("formatRelativeTime", () => {
  it.each([
    ["2026-10-22T11:59:30Z", "just now"],
    ["2026-10-22T11:15:00Z", "45 minutes ago"],
    ["2026-10-22T09:00:00Z", "3 hours ago"],
    ["2026-10-21T10:00:00Z", "yesterday"],
    ["2026-10-08T12:00:00Z", "2 weeks ago"],
  ])("describes %s as %s", (date, expected) => {
    expect(formatRelativeTime(date, NOW)).toBe(expected);
  });
});

describe("formatDay", () => {
  it("formats a UTC calendar day without shifting it", () => {
    expect(formatDay("2026-10-01")).toBe("Oct 1");
  });
});

describe("formatCount", () => {
  it("uses the singular only for one", () => {
    expect(formatCount(1, "Finding")).toBe("1 Finding");
    expect(formatCount(0, "Finding")).toBe("0 Findings");
    expect(formatCount(2, "Activity", "Activities")).toBe("2 Activities");
  });
});
