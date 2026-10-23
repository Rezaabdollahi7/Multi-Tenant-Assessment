import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import type { DashboardSummary } from "@/lib/api/types";
import { apiUrl, server } from "@/test/msw/server";
import { renderWithProviders } from "@/test/render";
import { SeverityBreakdown } from "./severity-breakdown";

const summary: DashboardSummary = {
  projectsCount: 4,
  findingsCount: 20,
  severityBreakdown: { CRITICAL: 2, HIGH: 6, MEDIUM: 8, LOW: 3, INFO: 1 },
  projectStatusBreakdown: {
    PLANNED: 1,
    IN_PROGRESS: 2,
    COMPLETED: 1,
    ARCHIVED: 0,
  },
};

const summaryUrl = apiUrl("/dashboard/summary");

describe("SeverityBreakdown", () => {
  it("lists every Severity, most serious first, with its count and share", async () => {
    server.use(http.get(summaryUrl, () => HttpResponse.json(summary)));
    renderWithProviders(<SeverityBreakdown />);

    const rows = await screen.findAllByRole("listitem");
    expect(rows.map((row) => row.textContent)).toEqual([
      "Critical210%",
      "High630%",
      "Medium840%",
      "Low315%",
      "Info15%",
    ]);
  });

  it("says so when the Organization has no Findings", async () => {
    server.use(
      http.get(summaryUrl, () =>
        HttpResponse.json({
          ...summary,
          findingsCount: 0,
          severityBreakdown: {
            CRITICAL: 0,
            HIGH: 0,
            MEDIUM: 0,
            LOW: 0,
            INFO: 0,
          },
        }),
      ),
    );
    renderWithProviders(<SeverityBreakdown />);

    expect(
      await screen.findByText("No Findings reported yet"),
    ).toBeInTheDocument();
  });

  it("shows the API error and recovers when the User retries", async () => {
    let attempts = 0;
    server.use(
      http.get(summaryUrl, () =>
        ++attempts === 1
          ? HttpResponse.json(
              { statusCode: 403, message: "Missing Permission" },
              { status: 403 },
            )
          : HttpResponse.json(summary),
      ),
    );
    renderWithProviders(<SeverityBreakdown />);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Could not load the Severity breakdown");
    expect(alert).toHaveTextContent(
      "Your Role does not have Permission for this.",
    );

    await userEvent.click(
      within(alert).getByRole("button", { name: "Try again" }),
    );

    expect(await screen.findByText("Critical")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("reads in Persian, with Persian digits, in the Persian locale", async () => {
    server.use(http.get(summaryUrl, () => HttpResponse.json(summary)));
    renderWithProviders(<SeverityBreakdown />, { locale: "fa" });

    expect(
      await screen.findByRole("region", { name: "یافته‌ها بر اساس شدت" }),
    ).toBeInTheDocument();
    const [critical] = await screen.findAllByRole("listitem");
    expect(critical).toHaveTextContent("بحرانی");
    expect(critical).toHaveTextContent("۲");
    expect(critical).toHaveTextContent("۱۰٪");
  });
});
