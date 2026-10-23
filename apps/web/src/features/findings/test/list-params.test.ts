import { describe, expect, it } from "vitest";
import { PROJECT_ID } from "@/test/fixtures";
import { findingListParamsSchema } from "../lib/schemas";

describe("findingListParamsSchema", () => {
  it("keeps valid filters from the URL", () => {
    expect(
      findingListParamsSchema.parse({
        search: " sql ",
        severity: "HIGH",
        status: "OPEN",
        projectId: PROJECT_ID,
        page: "2",
      }),
    ).toEqual({
      search: "sql",
      severity: "HIGH",
      status: "OPEN",
      projectId: PROJECT_ID,
      page: 2,
    });
  });

  it("repairs a hand-edited URL instead of failing", () => {
    expect(
      findingListParamsSchema.parse({
        search: "   ",
        severity: "SEVERE",
        projectId: "not-a-uuid",
        page: "-3",
      }),
    ).toEqual({ page: 1 });
  });
});
