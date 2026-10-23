import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./empty-state";

const meta = {
  title: "Shared/EmptyState",
  component: EmptyState,
  args: {
    title: "هنوز یافته‌ای ثبت نشده",
    description: "اولین یافته این پروژه را گزارش کنید.",
    icon: ShieldCheck,
  },
  argTypes: { icon: { control: false }, action: { control: false } },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  args: { action: <Button size="sm">گزارش یافته</Button> },
};

export const TitleOnly: Story = {
  args: { description: undefined, icon: undefined },
};
