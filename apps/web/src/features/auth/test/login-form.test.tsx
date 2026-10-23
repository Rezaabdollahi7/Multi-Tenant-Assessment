import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { apiUrl, server } from "@/test/msw/server";
import { router } from "@/test/router";
import { LoginForm } from "../components/block/login-form";

function codeSent() {
  const requested = vi.fn();
  server.use(
    http.post(apiUrl("/auth/request-otp"), async ({ request }) => {
      requested(await request.json());
      return HttpResponse.json({
        message: "Verification code sent",
        remainingAttempts: 5,
        code: "00000",
      });
    }),
  );
  return requested;
}

async function reachCodeStep(phone = "09911110002") {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("شمارهٔ موبایل"), phone);
  await user.click(screen.getByRole("button", { name: "ارسال کد" }));
  await screen.findByLabelText("کد تأیید");
  return user;
}

describe("LoginForm", () => {
  it("rejects a malformed phone number without calling the API", async () => {
    const requested = codeSent();
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("شمارهٔ موبایل"), "12345");
    await user.click(screen.getByRole("button", { name: "ارسال کد" }));

    expect(
      await screen.findByText(
        "شمارهٔ موبایل ۱۱ رقمی که با ۰۹ شروع می‌شود را وارد کنید",
      ),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("شمارهٔ موبایل")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(requested).not.toHaveBeenCalled();
  });

  it("asks for the code once it has been sent, showing the demo code", async () => {
    const requested = codeSent();
    render(<LoginForm />);

    await reachCodeStep();

    expect(requested).toHaveBeenCalledWith({ phone: "09911110002" });
    expect(screen.getByText(/کد دمو:/)).toHaveTextContent("00000");
  });

  it("says on the code field when the code is wrong", async () => {
    codeSent();
    server.use(
      http.post(apiUrl("/auth/verify-otp"), () =>
        HttpResponse.json(
          { statusCode: 401, message: "Invalid code. 4 attempts remaining." },
          { status: 401 },
        ),
      ),
    );
    render(<LoginForm />);
    const user = await reachCodeStep();

    await user.keyboard("11111");

    expect(
      await screen.findByText("کد اشتباه است یا منقضی شده است."),
    ).toBeInTheDocument();
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("explains throttling at the top of the form", async () => {
    server.use(
      http.post(apiUrl("/auth/request-otp"), () =>
        HttpResponse.json(
          {
            statusCode: 429,
            message: "Too many requests. Please try again later.",
          },
          { status: 429 },
        ),
      ),
    );
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("شمارهٔ موبایل"), "09911110001");
    await user.click(screen.getByRole("button", { name: "ارسال کد" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "تلاش‌ها بیش از حد مجاز بود. چند دقیقه صبر کنید و دوباره تلاش کنید.",
    );
  });

  it("returns to the requested page after signing in", async () => {
    codeSent();
    server.use(
      http.post(apiUrl("/auth/verify-otp"), () =>
        HttpResponse.json({ success: true }),
      ),
    );
    render(<LoginForm next="/findings?severity=HIGH" />);
    const user = await reachCodeStep();

    await user.keyboard("00000");

    await waitFor(() =>
      expect(router.replace).toHaveBeenCalledWith("/findings?severity=HIGH"),
    );
  });

  it("fills the phone number from a demo account", async () => {
    const user = userEvent.setup();
    render(<LoginForm showDemoAccounts />);

    await user.click(screen.getByRole("button", { name: /Reza Karimi/ }));

    expect(screen.getByLabelText("شمارهٔ موبایل")).toHaveValue("09911110003");
  });
});
