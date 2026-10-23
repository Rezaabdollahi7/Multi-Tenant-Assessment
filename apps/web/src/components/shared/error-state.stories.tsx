import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { ErrorState } from "./error-state";

const meta = {
  title: "Shared/ErrorState",
  component: ErrorState,
  args: {
    title: "بارگذاری یافته‌ها ممکن نشد",
    description: "اتصال به سرور برقرار نشد.",
  },
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** With `onRetry`, a "Try again" button asks for the content once more. */
export const WithRetry: Story = {
  args: { onRetry: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("alert")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "تلاش دوباره" }));
    await expect(args.onRetry).toHaveBeenCalledOnce();
  },
};
