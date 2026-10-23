import { screen, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import type { TrendPoint } from "@/lib/api/types";
import { apiUrl, server } from "@/test/msw/server";
import { renderWithProviders } from "@/test/render";
import { FindingTrendChart } from "./finding-trend-chart";

const NONE = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, INFO: 0 };

const points: TrendPoint[] = [
  { date: "2026-10-20", total: 1, bySeverity: { ...NONE, LOW: 1 } },
  {
    date: "2026-10-21",
    total: 4,
    bySeverity: { ...NONE, CRITICAL: 1, HIGH: 3 },
  },
  { date: "2026-10-22", total: 0, bySeverity: NONE },
];

const trendUrl = apiUrl("/dashboard/trend");

describe("FindingTrendChart", () => {
  it("summarises the trend and offers the data as a table", async () => {
    server.use(http.get(trendUrl, () => HttpResponse.json(points)));
    renderWithProviders(<FindingTrendChart />);

    expect(
      await screen.findByText(
        "5 Findings reported; the busiest day was Oct 21 with 4.",
      ),
    ).toBeInTheDocument();

    const table = screen.getByRole("table", {
      name: "Findings reported per day",
    });
    const busiestDay = within(table).getByRole("row", { name: /Oct 21/ });
    expect(
      within(busiestDay)
        .getAllByRole("cell")
        .map((cell) => cell.textContent),
    ).toEqual(["4", "1", "3", "0", "0", "0"]);
  });

  it("says so when no Findings were reported in the window", async () => {
    server.use(
      http.get(trendUrl, () =>
        HttpResponse.json(points.map((point) => ({ ...point, total: 0 }))),
      ),
    );
    renderWithProviders(<FindingTrendChart />);

    expect(
      await screen.findByText("No Findings in the last 30 days"),
    ).toBeInTheDocument();
  });
});
