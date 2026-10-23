import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { userWithRole } from "@/test/fixtures";
import { can } from "./permissions";
import { SessionProvider, useCan } from "./session-provider";

describe("can", () => {
  it("follows each Role's Permissions", () => {
    const viewer = userWithRole("VIEWER");
    const analyst = userWithRole("ANALYST");
    const admin = userWithRole("ADMIN");

    expect(can(viewer, "finding", "read")).toBe(true);
    expect(can(viewer, "finding", "create")).toBe(false);
    expect(can(analyst, "finding", "update")).toBe(true);
    expect(can(analyst, "finding", "delete")).toBe(false);
    expect(can(admin, "finding", "delete")).toBe(true);
  });

  it("allows nothing without a signed-in User", () => {
    expect(can(null, "dashboard", "read")).toBe(false);
  });
});

function DeleteButton() {
  return useCan("finding", "delete") ? <button>حذف</button> : null;
}

describe("useCan", () => {
  it("reads the signed-in User from the session", () => {
    const { rerender } = render(
      <SessionProvider user={userWithRole("ANALYST")}>
        <DeleteButton />
      </SessionProvider>,
    );
    expect(screen.queryByRole("button", { name: "حذف" })).toBeNull();

    rerender(
      <SessionProvider user={userWithRole("ADMIN")}>
        <DeleteButton />
      </SessionProvider>,
    );
    expect(screen.getByRole("button", { name: "حذف" })).toBeVisible();
  });
});
