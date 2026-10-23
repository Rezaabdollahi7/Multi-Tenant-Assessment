import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { CurrentUser } from "@/lib/api/types";
import { Can, SessionProvider } from "./session-provider";

const viewer: CurrentUser = {
  id: "5cf427c3-0bc9-49c0-bb3f-556d36a514cd",
  name: "Reza Karimi",
  phone: "09911110003",
  role: "VIEWER",
  organization: { id: "00befd63-4ab7-4cef-81dc-d871fb5dd001", name: "Org A" },
  permissions: ["dashboard:read", "project:read", "finding:read"],
};

function renderAs(user: CurrentUser) {
  render(
    <SessionProvider user={user}>
      <Can permission="finding:read">
        <button>View findings</button>
      </Can>
      <Can permission="finding:create" fallback={<p>Read-only access</p>}>
        <button>New finding</button>
      </Can>
      <Can permission={["finding:read", "finding:delete"]}>
        <button>Delete finding</button>
      </Can>
    </SessionProvider>,
  );
}

describe("Can", () => {
  it("shows only what a Viewer's Permissions allow", () => {
    renderAs(viewer);

    expect(screen.getByRole("button", { name: "View findings" })).toBeVisible();
    expect(screen.queryByRole("button", { name: "New finding" })).toBeNull();
    expect(screen.getByText("Read-only access")).toBeVisible();
    expect(screen.queryByRole("button", { name: "Delete finding" })).toBeNull();
  });

  it("shows actions once the Permissions are granted", () => {
    renderAs({
      ...viewer,
      role: "ADMIN",
      permissions: [...viewer.permissions, "finding:create", "finding:delete"],
    });

    expect(screen.getByRole("button", { name: "New finding" })).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Delete finding" }),
    ).toBeVisible();
    expect(screen.queryByText("Read-only access")).toBeNull();
  });
});
