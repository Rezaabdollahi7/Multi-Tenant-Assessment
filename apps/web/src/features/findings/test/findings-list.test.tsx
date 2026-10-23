import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import type { FindingList } from "@/assets/types/finding";
import { finding, PROJECT_ID } from "@/test/fixtures";
import { navigation, router } from "@/test/router";
import { FindingsList } from "../components/block/findings-list";

const PROJECT_OPTIONS = [{ value: PROJECT_ID, label: "Web Platform" }];

const onePage = (data: FindingList["data"]): FindingList => ({
  data,
  meta: { page: 1, limit: 10, totalItems: data.length, totalPages: 1 },
});

function renderList(findings: FindingList) {
  return render(
    <FindingsList findings={findings} projectOptions={PROJECT_OPTIONS} />,
  );
}

describe("FindingsList", () => {
  beforeEach(() => {
    navigation.pathname = "/findings";
    navigation.search = "";
  });

  it("shows each Finding's Severity and Finding Status as text", () => {
    renderList(onePage([finding]));

    const row = screen.getByRole("row", { name: /SQL injection/ });
    expect(within(row).getByText("بحرانی")).toBeInTheDocument();
    expect(within(row).getByText("باز")).toBeInTheDocument();
    expect(
      within(row).getByRole("link", { name: finding.title }),
    ).toHaveAttribute("href", `/findings/${finding.id}`);
  });

  it("shows the filters held in the URL", () => {
    navigation.search = `status=ACCEPTED&projectId=${PROJECT_ID}`;
    renderList(onePage([finding]));

    expect(
      screen.getByRole("combobox", { name: "وضعیت یافته" }),
    ).toHaveTextContent("ریسک پذیرفته‌شده");
    expect(screen.getByRole("combobox", { name: "پروژه" })).toHaveTextContent(
      "Web Platform",
    );
  });

  it("filters by Severity through the URL", async () => {
    renderList(onePage([finding]));

    await userEvent.click(screen.getByRole("combobox", { name: "شدت" }));
    await userEvent.click(await screen.findByRole("option", { name: "بالا" }));

    expect(router.replace).toHaveBeenCalledWith("/findings?severity=HIGH", {
      scroll: false,
    });
  });

  it("offers to clear filters that match nothing", async () => {
    navigation.search = "severity=INFO";
    renderList(onePage([]));

    await userEvent.click(
      screen.getByRole("button", { name: "پاک کردن فیلترها" }),
    );
    expect(router.replace).toHaveBeenCalledWith("/findings", { scroll: false });
  });
});
