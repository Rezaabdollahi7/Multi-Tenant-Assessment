import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import type { ProjectList } from "@/lib/api/types";
import { finding, PROJECT_ID } from "@/test/fixtures";
import { apiUrl, server } from "@/test/msw/server";
import { renderWithProviders } from "@/test/render";
import { router } from "@/test/router";
import { CreateFindingForm, EditFindingForm } from "./finding-form";

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

async function choose(label: string, option: string) {
  await userEvent.click(screen.getByRole("combobox", { name: label }));
  await userEvent.click(await screen.findByRole("option", { name: option }));
}

describe("CreateFindingForm", () => {
  it("explains every invalid field without calling the API", async () => {
    let posted = false;
    server.use(
      http.get(apiUrl("/projects"), () => HttpResponse.json(projects)),
      http.post(apiUrl("/findings"), () => {
        posted = true;
        return HttpResponse.json(finding, { status: 201 });
      }),
    );
    renderWithProviders(<CreateFindingForm />);

    await userEvent.type(screen.getByLabelText("Title"), "ab");
    await userEvent.click(
      screen.getByRole("button", { name: "Report Finding" }),
    );

    expect(
      await screen.findByRole("combobox", { name: "Project" }),
    ).toHaveAccessibleDescription("Choose a Project");
    expect(
      screen.getByRole("combobox", { name: "Severity" }),
    ).toHaveAccessibleDescription("Choose a Severity");
    expect(screen.getByLabelText("Title")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByLabelText("Title")).toHaveAccessibleDescription(
      "3 to 200 characters Enter at least 3 characters",
    );
    expect(posted).toBe(false);
  });

  it("shows the API's validation messages on their fields", async () => {
    server.use(
      http.get(apiUrl("/projects"), () => HttpResponse.json(projects)),
      http.post(apiUrl("/findings"), () =>
        HttpResponse.json(
          {
            statusCode: 400,
            message: "Validation failed",
            errors: { title: ["title must be at most 200 characters"] },
          },
          { status: 400 },
        ),
      ),
    );
    renderWithProviders(<CreateFindingForm defaultProjectId={PROJECT_ID} />);

    await userEvent.type(screen.getByLabelText("Title"), "Stored XSS");
    await choose("Severity", "High");
    await userEvent.click(
      screen.getByRole("button", { name: "Report Finding" }),
    );

    expect(
      await screen.findByText("title must be at most 200 characters"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("reports the Finding and opens it", async () => {
    let body: unknown;
    server.use(
      http.get(apiUrl("/projects"), () => HttpResponse.json(projects)),
      http.post(apiUrl("/findings"), async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(finding, { status: 201 });
      }),
    );
    renderWithProviders(<CreateFindingForm />);

    await choose("Project", "Web Platform");
    await userEvent.type(screen.getByLabelText("Title"), "  Stored XSS  ");
    await userEvent.type(screen.getByLabelText("Description"), "In comments.");
    await choose("Severity", "High");
    await userEvent.click(
      screen.getByRole("button", { name: "Report Finding" }),
    );

    await vi.waitFor(() =>
      expect(router.push).toHaveBeenCalledWith(`/findings/${finding.id}`),
    );
    expect(body).toEqual({
      projectId: PROJECT_ID,
      title: "Stored XSS",
      description: "In comments.",
      severity: "HIGH",
    });
  });
});

describe("EditFindingForm", () => {
  it("starts from the Finding and saves the changed Finding Status", async () => {
    let body: unknown;
    server.use(
      http.patch(apiUrl(`/findings/${finding.id}`), async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ ...finding, status: "ACCEPTED" });
      }),
    );
    renderWithProviders(<EditFindingForm finding={finding} />);

    expect(screen.getByLabelText("Title")).toHaveValue(finding.title);
    await choose("Finding Status", "Risk Accepted");
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await vi.waitFor(() =>
      expect(router.push).toHaveBeenCalledWith(`/findings/${finding.id}`),
    );
    expect(body).toEqual({
      title: finding.title,
      description: finding.description,
      severity: "CRITICAL",
      status: "ACCEPTED",
    });
  });
});
