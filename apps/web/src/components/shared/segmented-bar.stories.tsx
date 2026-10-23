import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SegmentedBar } from "./segmented-bar";

const meta = {
  title: "Shared/SegmentedBar",
  component: SegmentedBar,
  args: {
    segments: [
      { id: "planned", label: "برنامه‌ریزی‌شده", value: 1, tone: "outline" },
      { id: "progress", label: "در حال انجام", value: 2, tone: "highlight" },
      { id: "done", label: "تکمیل‌شده", value: 1, tone: "ink" },
      { id: "archived", label: "بایگانی‌شده", value: 1, tone: "hatch" },
    ],
    describeValue: (count: number) => `${count} پروژه`,
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof SegmentedBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Project Status on the Dashboard: parts told apart by look as well as label. */
export const ProjectStatus: Story = {};

/** An empty part keeps a small, readable pill. */
export const WithEmptyPart: Story = {
  args: {
    segments: [
      { id: "a", label: "برنامه‌ریزی‌شده", value: 0, tone: "outline" },
      { id: "b", label: "در حال انجام", value: 9, tone: "highlight" },
      { id: "c", label: "تکمیل‌شده", value: 3, tone: "ink" },
    ],
  },
};
