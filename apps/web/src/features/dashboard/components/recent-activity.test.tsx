import { screen, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import type { Activity } from "@/lib/api/types";
import { apiUrl, server } from "@/test/msw/server";
import { renderWithProviders } from "@/test/render";
import { RecentActivity } from "./recent-activity";

const actor = {
  id: "0b9f1c52-34b4-4c5e-9d0a-0c6f1f6b2a11",
  name: "Sara Mohammadi",
};

function activity(
  action: Activity["action"],
  targetName: string,
  id: string,
): Activity {
  return {
    id,
    action,
    actor,
    target: { type: "finding", id: `${id}-target`, name: targetName },
    createdAt: new Date().toISOString(),
  };
}

const activitiesUrl = apiUrl("/dashboard/activities");

describe("RecentActivity", () => {
  it("shows a placeholder while the Activities load", () => {
    server.use(http.get(activitiesUrl, () => new Promise<never>(() => {})));
    renderWithProviders(<RecentActivity />);

    const panel = screen.getByRole("region", { name: "Recent Activity" });
    expect(panel.querySelector("[aria-busy='true']")).toBeInTheDocument();
  });

  it("describes who did what, linking to Findings that still exist", async () => {
    server.use(
      http.get(activitiesUrl, () =>
        HttpResponse.json([
          activity("finding.created", "SQL injection in search", "a1"),
          activity("finding.deleted", "Verbose error page", "a2"),
        ]),
      ),
    );
    renderWithProviders(<RecentActivity />);

    const [created, deleted] = await screen.findAllByRole("listitem");
    expect(created).toHaveTextContent(
      "Sara Mohammadi reported SQL injection in search",
    );
    expect(
      within(created).getByRole("link", { name: "SQL injection in search" }),
    ).toHaveAttribute("href", "/findings/a1-target");

    expect(deleted).toHaveTextContent(
      "Sara Mohammadi deleted Verbose error page",
    );
    expect(within(deleted).queryByRole("link")).not.toBeInTheDocument();
  });

  it("says so when nothing has happened yet", async () => {
    server.use(http.get(activitiesUrl, () => HttpResponse.json([])));
    renderWithProviders(<RecentActivity />);

    expect(await screen.findByText("No Activity yet")).toBeInTheDocument();
  });

  it("follows Persian word order in the Persian locale", async () => {
    server.use(
      http.get(activitiesUrl, () =>
        HttpResponse.json([
          activity("finding.updated", "SQL injection in search", "a1"),
        ]),
      ),
    );
    renderWithProviders(<RecentActivity />, { locale: "fa" });

    expect(await screen.findByRole("listitem")).toHaveTextContent(
      "Sara Mohammadi یافتهٔ SQL injection in search را ویرایش کرد",
    );
  });
});
