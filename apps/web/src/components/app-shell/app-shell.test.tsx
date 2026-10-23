import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { ThemeProvider } from "next-themes";
import { beforeEach, describe, expect, it } from "vitest";
import { SessionProvider } from "@/lib/session/session-provider";
import type { CurrentUser } from "@/lib/api/types";
import { apiUrl, server } from "@/test/msw/server";
import { renderWithProviders } from "@/test/render";
import { navigation, router } from "@/test/router";
import { AppShell } from "./app-shell";

const analyst: CurrentUser = {
  id: "d7e9694b-6b5f-4879-96cd-d523fae88e9c",
  name: "Sara Mohammadi",
  phone: "09911110002",
  role: "ANALYST",
  organization: { id: "00befd63-4ab7-4cef-81dc-d871fb5dd001", name: "Org A" },
  permissions: [
    "dashboard:read",
    "project:read",
    "finding:read",
    "finding:create",
  ],
};

function renderShell(user: CurrentUser = analyst) {
  return renderWithProviders(
    <ThemeProvider attribute="class">
      <SessionProvider user={user}>
        <AppShell sidebarOpen>
          <p>Page content</p>
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
    const nav = screen.getByRole("navigation", { name: "Main" });

    expect(within(nav).getByRole("link", { name: "Projects" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      within(nav).getByRole("link", { name: "Dashboard" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("only links to sections the User has Permission for", () => {
    renderShell({ ...analyst, permissions: ["dashboard:read"] });
    const nav = screen.getByRole("navigation", { name: "Main" });

    expect(
      within(nav)
        .getAllByRole("link")
        .map((l) => l.textContent),
    ).toEqual(["Dashboard"]);
  });

  it("offers a skip link to the main content", () => {
    renderShell();

    expect(
      screen.getByRole("link", { name: "Skip to content" }),
    ).toHaveAttribute("href", "#main-content");
    expect(screen.getByRole("main")).toHaveTextContent("Page content");
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
      screen.getByRole("button", {
        name: "User menu for Sara Mohammadi",
      }),
    );
    await user.click(await screen.findByRole("menuitem", { name: "Sign out" }));

    await expect
      .poll(() => router.replace.mock.calls)
      .toEqual([["/login?reason=signed_out"]]);
  });

  it("switches to the dark theme", async () => {
    const user = userEvent.setup();
    renderShell();

    await user.click(screen.getByRole("button", { name: "Change theme" }));
    await user.click(
      await screen.findByRole("menuitemradio", { name: "Dark" }),
    );

    expect(document.documentElement).toHaveClass("dark");
  });
});
