import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FolderKanban, ShieldAlert, Siren } from "lucide-react";
import { HeadlineStat } from "./headline-stat";

const meta = {
  title: "Shared/HeadlineStat",
  component: HeadlineStat,
  args: { label: "یافته‌ها", value: 36, icon: ShieldAlert },
  argTypes: { icon: { control: false } },
  render: (args) => (
    <dl>
      <HeadlineStat {...args} />
    </dl>
  ),
} satisfies Meta<typeof HeadlineStat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Figure: Story = {};

export const Loading: Story = { args: { value: undefined } };

export const Row: Story = {
  render: () => (
    <dl className="flex gap-10">
      <HeadlineStat label="پروژه‌ها" value={5} icon={FolderKanban} />
      <HeadlineStat label="یافته‌ها" value={36} icon={ShieldAlert} />
      <HeadlineStat label="بحرانی و بالا" value={17} icon={Siren} />
    </dl>
  ),
};
