import { screen } from "@testing-library/react";
import { FolderKanban } from "lucide-react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test/render";
import { HeadlineStat } from "./headline-stat";

describe("HeadlineStat", () => {
  it("gives assistive technology the final figure while it counts up", () => {
    renderWithProviders(
      <dl>
        <HeadlineStat label="Projects" value={36} icon={FolderKanban} />
      </dl>,
    );

    const figure = screen.getByRole("definition");
    expect(figure).toHaveTextContent("36");
    expect(screen.getByRole("term")).toHaveTextContent("Projects");
  });

  it("shows a placeholder until the figure arrives", () => {
    renderWithProviders(
      <dl>
        <HeadlineStat label="Projects" icon={FolderKanban} />
      </dl>,
    );

    expect(screen.getByRole("term").parentElement).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });
});
