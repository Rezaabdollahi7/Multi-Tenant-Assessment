import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StatusBadge } from "./status-badge";
import { DetailList } from "./detail-list";

const meta = {
  title: "Shared/DetailList",
  component: DetailList,
  args: {
    details: [
      {
        label: "وضعیت پروژه",
        value: <StatusBadge label="تکمیل‌شده" tone="positive" />,
      },
      { label: "یافته‌ها", value: "۱۰" },
      { label: "اعضا", value: "۳" },
      { label: "تاریخ ایجاد", value: "۱۹ شهریور ۱۴۰۵" },
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DetailList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProjectInfo: Story = {};
