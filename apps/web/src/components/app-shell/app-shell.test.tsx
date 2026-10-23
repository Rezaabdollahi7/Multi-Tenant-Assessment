import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { ThemeProvider } from "next-themes";
import { beforeEach, describe, expect, it } from "vitest";
import type { CurrentUser } from "@/assets/types/user";
import { SessionProvider } from "@/lib/session/session-provider";
import { userWithRole } from "@/test/fixtures";
import { apiUrl, server } from "@/test/msw/server";
import { navigation, router } from "@/test/router";
import { AppShell } from "./app-shell";

function renderShell(user: CurrentUser = userWithRole("ANALYST")) {
  return render(
    <ThemeProvider attribute="class">
      <SessionProvider user={user}>
        <AppShell>
          <p>محتوای صفحه</p>
        </AppShell>
      </SessionProvider>
    </ThemeProvider>,
  );
}

describe("AppShell", () => {
  beforeEach(() => {
    navigation.pathname = "/projects/98475976-de7a-4ba4-bfcc-1518617fa939";
  });

  it("marks the current section in the main navigation", () => {
    renderShell();
    const nav = screen.getByRole("navigation", { name: "اصلی" });

    expect(within(nav).getByRole("link", { name: "پروژه‌ها" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      within(nav).getByRole("link", { name: "داشبورد" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("only links to sections the User has Permission for", () => {
    renderShell({ ...userWithRole("VIEWER"), permissions: ["dashboard:read"] });
    const nav = screen.getByRole("navigation", { name: "اصلی" });

    expect(
      within(nav)
        .getAllByRole("link")
        .map((link) => link.textContent),
    ).toEqual(["داشبورد"]);
  });

  it("signs out from the account menu", async () => {
    server.use(
      http.post(apiUrl("/auth/logout"), () =>
        HttpResponse.json({ success: true }),
      ),
    );
    const user = userEvent.setup();
    renderShell();

    await user.click(
      screen.getByRole("button", { name: "منوی کاربری Sara Mohammadi" }),
    );
    await user.click(await screen.findByRole("menuitem", { name: "خروج" }));

    await expect
      .poll(() => router.replace.mock.calls)
      .toEqual([["/login?reason=signed_out"]]);
  });
});
