import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StatusBadge } from "./status-badge";

const meta = {
  title: "Shared/StatusBadge",
  component: StatusBadge,
  args: { label: "در حال بررسی", tone: "active" },
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["neutral", "active", "positive", "inactive"],
    },
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {};

/** The four tones: not started, under way, done, set aside. */
export const AllTones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <StatusBadge label="باز" tone="neutral" />
      <StatusBadge label="در حال بررسی" tone="active" />
      <StatusBadge label="رفع‌شده" tone="positive" />
      <StatusBadge label="ریسک پذیرفته‌شده" tone="inactive" />
    </div>
  ),
};
