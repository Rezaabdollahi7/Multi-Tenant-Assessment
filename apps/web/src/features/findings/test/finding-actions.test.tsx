import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import type { Role } from "@/assets/types/user";
import { SessionProvider } from "@/lib/session/session-provider";
import { finding, userWithRole } from "@/test/fixtures";
import { apiUrl, server } from "@/test/msw/server";
import { router } from "@/test/router";
import { FindingActions } from "../components/ui/finding-actions";

function renderAs(role: Role) {
  return render(
    <SessionProvider user={userWithRole(role)}>
      <FindingActions finding={finding} />
    </SessionProvider>,
  );
}

describe("FindingActions", () => {
  it.each([
    ["VIEWER", [] as string[]],
    ["ANALYST", ["ویرایش"]],
    ["ADMIN", ["ویرایش", "حذف"]],
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

    await userEvent.click(screen.getByRole("button", { name: "حذف" }));
    const dialog = await screen.findByRole("alertdialog", {
      name: "این یافته حذف شود؟",
    });
    expect(deleted).not.toHaveBeenCalled();

    await userEvent.click(
      within(dialog).getByRole("button", { name: "حذف یافته" }),
    );

    await vi.waitFor(() =>
      expect(router.push).toHaveBeenCalledWith("/findings"),
    );
    expect(deleted).toHaveBeenCalledOnce();
  });

  it("does nothing when the deletion is cancelled", async () => {
    renderAs("ADMIN");

    await userEvent.click(screen.getByRole("button", { name: "حذف" }));
    await userEvent.click(
      within(await screen.findByRole("alertdialog")).getByRole("button", {
        name: "انصراف",
      }),
    );

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(router.push).not.toHaveBeenCalled();
  });
});
