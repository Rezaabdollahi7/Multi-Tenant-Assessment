import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import type { FindingList, ProjectList } from "@/lib/api/types";
import { finding, PROJECT_ID } from "@/test/fixtures";
import { apiUrl, server } from "@/test/msw/server";
import { renderWithProviders } from "@/test/render";
import { navigation, router } from "@/test/router";
import { FindingsList } from "./findings-list";

const projects: ProjectList = {
  data: [
    {
      id: PROJECT_ID,
      name: "Web Platform",
      description: null,
      status: "IN_PROGRESS",
      findingsCount: 6,
      membersCount: 3,
      createdAt: "2026-08-30T08:00:00.000Z",
    },
  ],
  meta: { page: 1, limit: 100, totalItems: 1, totalPages: 1 },
};

/** Serves `findings` and records the query string of every request. */
function serveFindings(findings: FindingList) {
  const queries: Record<string, string>[] = [];
  server.use(
    http.get(apiUrl("/findings"), ({ request }) => {
      queries.push(Object.fromEntries(new URL(request.url).searchParams));
      return HttpResponse.json(findings);
    }),
    http.get(apiUrl("/projects"), () => HttpResponse.json(projects)),
  );
  return queries;
}

const onePage = (data: FindingList["data"]): FindingList => ({
  data,
  meta: { page: 1, limit: 10, totalItems: data.length, totalPages: 1 },
});

describe("FindingsList", () => {
  beforeEach(() => {
    navigation.pathname = "/findings";
    navigation.search = "";
  });

  it("shows each Finding's Severity and Finding Status as text", async () => {
    serveFindings(onePage([finding]));
    renderWithProviders(<FindingsList />);

    const row = await screen.findByRole("row", { name: /SQL injection/ });
    expect(within(row).getByText("Critical")).toBeInTheDocument();
    expect(within(row).getByText("Open")).toBeInTheDocument();
    expect(
      within(row).getByRole("link", { name: finding.title }),
    ).toHaveAttribute("href", `/findings/${finding.id}`);
  });

  it("sends every filter in the URL to the API", async () => {
    navigation.search = `severity=HIGH&status=ACCEPTED&projectId=${PROJECT_ID}&search=sql`;
    const queries = serveFindings(onePage([finding]));
    renderWithProviders(<FindingsList />);

    await screen.findByRole("row", { name: /SQL injection/ });
    expect(queries[0]).toEqual({
      search: "sql",
      severity: "HIGH",
      status: "ACCEPTED",
      projectId: PROJECT_ID,
      page: "1",
      limit: "10",
    });
    expect(
      screen.getByRole("combobox", { name: "Finding Status" }),
    ).toHaveTextContent("Risk Accepted");
    expect(
      await screen.findByRole("combobox", { name: "Project" }),
    ).toHaveTextContent("Web Platform");
  });

  it("filters by Severity", async () => {
    serveFindings(onePage([finding]));
    renderWithProviders(<FindingsList />);

    await userEvent.click(screen.getByRole("combobox", { name: "Severity" }));
    await userEvent.click(await screen.findByRole("option", { name: "High" }));

    expect(router.replace).toHaveBeenCalledWith("/findings?severity=HIGH", {
      scroll: false,
    });
  });

  it("offers to clear filters that match nothing", async () => {
    navigation.search = "severity=INFO";
    serveFindings(onePage([]));
    renderWithProviders(<FindingsList />);

    await userEvent.click(
      await screen.findByRole("button", { name: "Clear filters" }),
    );
    expect(router.replace).toHaveBeenCalledWith("/findings", { scroll: false });
  });
});
