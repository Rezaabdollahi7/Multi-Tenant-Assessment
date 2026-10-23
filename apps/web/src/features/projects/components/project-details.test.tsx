import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Member, ProjectDetail } from "@/lib/api/types";
import { renderWithProviders } from "@/test/render";
import { ProjectHeader } from "./project-header";
import { ProjectMembers } from "./project-members";

const project: ProjectDetail = {
  id: "98475976-de7a-4ba4-bfcc-1518617fa939",
  name: "Customer portal web assessment",
  description: "Black-box test of the customer portal.",
  status: "COMPLETED",
  findingsCount: 1,
  membersCount: 2,
  createdAt: "2026-09-01T08:00:00.000Z",
  severityBreakdown: { CRITICAL: 0, HIGH: 1, MEDIUM: 0, LOW: 0, INFO: 0 },
};

describe("Project details", () => {
  it("names the Project, its Project Status and its size", () => {
    renderWithProviders(<ProjectHeader project={project} />);

    expect(
      screen.getByRole("heading", { level: 1, name: project.name }),
    ).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(
      screen.getByText("1 Finding · 2 Members · Created Sep 1, 2026"),
    ).toBeInTheDocument();
    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(
      within(breadcrumb).getByRole("link", { name: "Projects" }),
    ).toHaveAttribute("href", "/projects");
  });

  it("lists Members, including those without a name or a role in the Project", () => {
    const members: Member[] = [
      {
        userId: "d7e9694b-6b5f-4879-96cd-d523fae88e9c",
        name: "Sara Mohammadi",
        role: "ANALYST",
        roleInProject: "Lead tester",
        joinedAt: "2026-09-02T08:00:00.000Z",
      },
      {
        userId: "0b9f1c52-34b4-4c5e-9d0a-0c6f1f6b2a11",
        name: null,
        role: "VIEWER",
        roleInProject: null,
        joinedAt: "2026-09-03T08:00:00.000Z",
      },
    ];
    renderWithProviders(<ProjectMembers members={members} />);

    const [, sara, unnamed] = screen.getAllByRole("row");
    expect(sara).toHaveTextContent(
      "Sara MohammadiLead testerAnalystSep 2, 2026",
    );
    expect(unnamed).toHaveTextContent("Unnamed User—ViewerSep 3, 2026");
  });
});
