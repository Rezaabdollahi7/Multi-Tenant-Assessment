import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/ui/button";
import { Panel } from "./panel";

const meta = {
  title: "Shared/Panel",
  component: Panel,
  args: {
    title: "یافته‌ها بر اساس شدت",
    description: "در همه پروژه‌های شما",
    variant: "glass",
    children: <p className="text-sm">محتوای بخش اینجا قرار می‌گیرد.</p>,
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["glass", "ink"] },
    action: { control: false },
    children: { control: false },
  },
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Glass: Story = {};

/** The dark feature card; one per page at most. */
export const Ink: Story = {
  args: { variant: "ink", title: "فعالیت اخیر" },
};

export const WithAction: Story = {
  args: {
    action: (
      <Button variant="outline" size="sm">
        مشاهده همه
      </Button>
    ),
  },
};
