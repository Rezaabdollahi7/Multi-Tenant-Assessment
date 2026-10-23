import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { finding, PROJECT_ID } from "@/test/fixtures";
import { apiUrl, server } from "@/test/msw/server";
import { router } from "@/test/router";
import {
  CreateFindingForm,
  EditFindingForm,
} from "../components/block/finding-form";

const PROJECT_OPTIONS = [{ value: PROJECT_ID, label: "Web Platform" }];

async function choose(label: string, option: string) {
  await userEvent.click(screen.getByRole("combobox", { name: label }));
  await userEvent.click(await screen.findByRole("option", { name: option }));
}

describe("CreateFindingForm", () => {
  it("explains every invalid field without calling the API", async () => {
    const posted = vi.fn();
    server.use(
      http.post(apiUrl("/findings"), () => {
        posted();
        return HttpResponse.json(finding, { status: 201 });
      }),
    );
    render(<CreateFindingForm projectOptions={PROJECT_OPTIONS} />);

    await userEvent.type(screen.getByLabelText("عنوان"), "ab");
    await userEvent.click(screen.getByRole("button", { name: "ثبت یافته" }));

    expect(
      await screen.findByRole("combobox", { name: "پروژه" }),
    ).toHaveAccessibleDescription("پروژه را انتخاب کنید");
    expect(
      screen.getByRole("combobox", { name: "شدت" }),
    ).toHaveAccessibleDescription("شدت را انتخاب کنید");
    expect(screen.getByLabelText("عنوان")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByLabelText("عنوان")).toHaveAccessibleDescription(
      "۳ تا ۲۰۰ نویسه دست‌کم ۳ نویسه وارد کنید",
    );
    expect(posted).not.toHaveBeenCalled();
  });

  it("shows the API's validation messages on their fields", async () => {
    server.use(
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
    render(
      <CreateFindingForm
        projectOptions={PROJECT_OPTIONS}
        defaultProjectId={PROJECT_ID}
      />,
    );

    await userEvent.type(screen.getByLabelText("عنوان"), "Stored XSS");
    await choose("شدت", "بالا");
    await userEvent.click(screen.getByRole("button", { name: "ثبت یافته" }));

    expect(
      await screen.findByText("title must be at most 200 characters"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("reports the Finding and opens it", async () => {
    let body: unknown;
    server.use(
      http.post(apiUrl("/findings"), async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(finding, { status: 201 });
      }),
    );
    render(<CreateFindingForm projectOptions={PROJECT_OPTIONS} />);

    await choose("پروژه", "Web Platform");
    await userEvent.type(screen.getByLabelText("عنوان"), "  Stored XSS  ");
    await userEvent.type(screen.getByLabelText("توضیحات"), "In comments.");
    await choose("شدت", "بالا");
    await userEvent.click(screen.getByRole("button", { name: "ثبت یافته" }));

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
    render(<EditFindingForm finding={finding} />);

    expect(screen.getByLabelText("عنوان")).toHaveValue(finding.title);
    await choose("وضعیت یافته", "ریسک پذیرفته‌شده");
    await userEvent.click(
      screen.getByRole("button", { name: "ذخیرهٔ تغییرات" }),
    );

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
