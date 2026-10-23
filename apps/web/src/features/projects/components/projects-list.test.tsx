import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Project, ProjectList } from "@/lib/api/types";
import { apiUrl, server } from "@/test/msw/server";
import { renderWithProviders } from "@/test/render";
import { navigation, router } from "@/test/router";
import { ProjectsList } from "./projects-list";

const project: Project = {
  id: "98475976-de7a-4ba4-bfcc-1518617fa939",
  name: "Customer portal web assessment",
  description: null,
  status: "IN_PROGRESS",
  findingsCount: 12,
  membersCount: 3,
  createdAt: "2026-09-01T08:00:00.000Z",
};

function page(
  data: Project[],
  meta: Partial<ProjectList["meta"]> = {},
): ProjectList {
  return {
    data,
    meta: {
      page: 1,
      limit: 10,
      totalItems: data.length,
      totalPages: 1,
      ...meta,
    },
  };
}

const projectsUrl = apiUrl("/projects");

/** Serves `response` and records the query string of every request. */
function serveProjects(response: ProjectList) {
  const queries: URLSearchParams[] = [];
  server.use(
    http.get(projectsUrl, ({ request }) => {
      queries.push(new URL(request.url).searchParams);
      return HttpResponse.json(response);
    }),
  );
  return queries;
}

describe("ProjectsList", () => {
  beforeEach(() => {
    navigation.pathname = "/projects";
    navigation.search = "";
  });

  it("lists Projects with their Project Status and links to each", async () => {
    serveProjects(page([project], { totalItems: 23, totalPages: 3 }));
    renderWithProviders(<ProjectsList />);

    const link = await screen.findByRole("link", {
      name: "Customer portal web assessment",
    });
    expect(link).toHaveAttribute("href", `/projects/${project.id}`);
    const row = screen.getByRole("row", { name: /Customer portal/ });
    expect(within(row).getByText("In Progress")).toBeInTheDocument();

    const pagination = screen.getByRole("navigation", { name: "Pagination" });
    expect(pagination).toHaveTextContent("23 Projects · Page 1 of 3");
    expect(
      within(pagination).getByRole("link", { name: "Next page" }),
    ).toHaveAttribute("href", "/projects?page=2");
    expect(
      within(pagination).getByRole("link", { name: "Page 3 of 3" }),
    ).toHaveAttribute("href", "/projects?page=3");
    expect(
      within(pagination).getByRole("link", { name: "Page 1 of 3" }),
    ).toHaveAttribute("aria-current", "page");
    // There is no page before the first.
    expect(
      within(pagination).queryByRole("link", { name: "Previous page" }),
    ).not.toBeInTheDocument();
  });

  it("applies the search, filter and page from the URL", async () => {
    navigation.search = "search=portal&status=COMPLETED&page=2";
    const queries = serveProjects(page([project], { page: 2, totalPages: 2 }));
    renderWithProviders(<ProjectsList />);

    await screen.findByRole("link", { name: "Customer portal web assessment" });
    expect(Object.fromEntries(queries[0] ?? [])).toEqual({
      search: "portal",
      status: "COMPLETED",
      page: "2",
      limit: "10",
    });
    expect(screen.getByRole("searchbox")).toHaveValue("portal");
    expect(
      screen.getByRole("combobox", { name: "Project Status" }),
    ).toHaveTextContent("Completed");
  });

  it("ignores invalid values in a hand-edited URL", async () => {
    navigation.search = "status=BOGUS&page=-4";
    const queries = serveProjects(page([project]));
    renderWithProviders(<ProjectsList />);

    await screen.findByRole("link", { name: "Customer portal web assessment" });
    expect(Object.fromEntries(queries[0] ?? [])).toEqual({
      page: "1",
      limit: "10",
    });
  });

  it("searches once typing pauses", async () => {
    serveProjects(page([project]));
    renderWithProviders(<ProjectsList />);

    await userEvent.type(
      screen.getByRole("searchbox", { name: "Search Projects by name" }),
      "portal",
    );

    await vi.waitFor(() =>
      expect(router.replace).toHaveBeenCalledWith("/projects?search=portal", {
        scroll: false,
      }),
    );
    expect(router.replace).toHaveBeenCalledTimes(1);
  });

  it("filters by Project Status and returns to the first page", async () => {
    navigation.search = "page=3";
    serveProjects(page([project], { page: 3, totalPages: 3 }));
    renderWithProviders(<ProjectsList />);

    await userEvent.click(
      screen.getByRole("combobox", { name: "Project Status" }),
    );
    await userEvent.click(
      await screen.findByRole("option", { name: "Archived" }),
    );

    expect(router.replace).toHaveBeenCalledWith("/projects?status=ARCHIVED", {
      scroll: false,
    });
  });

  it("offers to clear filters that match nothing", async () => {
    navigation.search = "search=nothing";
    serveProjects(page([]));
    renderWithProviders(<ProjectsList />);

    expect(
      await screen.findByText("No Projects match these filters"),
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "Clear filters" }),
    );

    expect(router.replace).toHaveBeenCalledWith("/projects", { scroll: false });
  });

  it("shows the API error with a way to retry", async () => {
    server.use(
      http.get(projectsUrl, () =>
        HttpResponse.json(
          { statusCode: 500, message: "Internal server error" },
          { status: 500 },
        ),
      ),
    );
    renderWithProviders(<ProjectsList />);

    const alert = await screen.findByRole("alert", {}, { timeout: 5_000 });
    expect(alert).toHaveTextContent("Could not load Projects");
    expect(
      within(alert).getByRole("button", { name: "Try again" }),
    ).toBeInTheDocument();
  });
});
