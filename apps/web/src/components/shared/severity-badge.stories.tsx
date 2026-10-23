import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SEVERITIES } from "@/lib/severity";
import { SeverityBadge } from "./severity-badge";

const meta = {
  title: "Shared/SeverityBadge",
  component: SeverityBadge,
  args: { severity: "CRITICAL" },
  argTypes: { severity: { control: "select", options: SEVERITIES } },
} satisfies Meta<typeof SeverityBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Critical: Story = {};

export const AllLevels: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {SEVERITIES.map((severity) => (
        <SeverityBadge key={severity} severity={severity} />
      ))}
    </div>
  ),
};
