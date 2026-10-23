import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/ui/button";
import { PermissionDenied } from "./permission-denied";

const meta = {
  title: "Shared/PermissionDenied",
  component: PermissionDenied,
  args: { title: "شما نمی‌توانید یافته گزارش کنید" },
  argTypes: { action: { control: false } },
} satisfies Meta<typeof PermissionDenied>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithWayBack: Story = {
  args: {
    action: (
      <Button variant="outline" size="sm">
        بازگشت به پروژه
      </Button>
    ),
  },
};
