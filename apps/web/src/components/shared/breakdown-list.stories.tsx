import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SEVERITY_COLORS } from "@/lib/severity";
import { BreakdownList } from "./breakdown-list";

const meta = {
  title: "Shared/BreakdownList",
  component: BreakdownList,
  args: {
    items: [
      { id: "c", label: "بحرانی", value: 4, color: SEVERITY_COLORS.CRITICAL },
      { id: "h", label: "بالا", value: 13, color: SEVERITY_COLORS.HIGH },
      { id: "m", label: "متوسط", value: 8, color: SEVERITY_COLORS.MEDIUM },
      { id: "l", label: "پایین", value: 7, color: SEVERITY_COLORS.LOW },
      { id: "i", label: "اطلاعاتی", value: 0, color: SEVERITY_COLORS.INFO },
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BreakdownList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Severity: Story = {};
