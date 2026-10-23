import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import type { Role } from "@/lib/api/types";
import { SessionProvider } from "@/lib/session/session-provider";
import { finding, userWithRole } from "@/test/fixtures";
import { apiUrl, server } from "@/test/msw/server";
import { renderWithProviders } from "@/test/render";
import { router } from "@/test/router";
import { FindingActions } from "./finding-actions";

function renderAs(role: Role) {
  return renderWithProviders(
    <SessionProvider user={userWithRole(role)}>
      <FindingActions finding={finding} />
    </SessionProvider>,
  );
}

describe("FindingActions", () => {
  it.each([
    ["VIEWER", [] as string[]],
    ["ANALYST", ["Edit"]],
    ["ADMIN", ["Edit", "Delete"]],
  ] as const)("offers a %s only what their Role allows", (role, actions) => {
    renderAs(role);

    expect(
      screen
        .queryAllByRole("link")
        .concat(screen.queryAllByRole("button"))
        .map((control) => control.textContent),
    ).toEqual(actions);
  });

  it("deletes only after confirmation", async () => {
    const deleted = vi.fn();
    server.use(
      http.delete(apiUrl(`/findings/${finding.id}`), () => {
        deleted();
        return new HttpResponse(null, { status: 204 });
      }),
    );
    renderAs("ADMIN");

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    const dialog = await screen.findByRole("alertdialog", {
      name: "Delete this Finding?",
    });
    expect(deleted).not.toHaveBeenCalled();

    await userEvent.click(
      within(dialog).getByRole("button", { name: "Delete Finding" }),
    );

    await vi.waitFor(() =>
      expect(router.push).toHaveBeenCalledWith("/findings"),
    );
    expect(deleted).toHaveBeenCalledOnce();
  });

  it("does nothing when the deletion is cancelled", async () => {
    renderAs("ADMIN");

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    await userEvent.click(
      within(await screen.findByRole("alertdialog")).getByRole("button", {
        name: "Cancel",
      }),
    );

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(router.push).not.toHaveBeenCalled();
  });
});
