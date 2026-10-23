import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { SearchInput } from "./search-input";

const meta = {
  title: "Shared/SearchInput",
  component: SearchInput,
  args: { label: "جستجوی پروژه‌ها", value: "", onSearch: fn() },
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const box = within(canvasElement).getByRole("searchbox", {
      name: "جستجوی پروژه‌ها",
    });
    await userEvent.type(box, "  portal ");
    await expect(args.onSearch).not.toHaveBeenCalled();
    await waitFor(() => expect(args.onSearch).toHaveBeenCalledOnce());
    await expect(args.onSearch).toHaveBeenCalledWith("portal");
  },
};

export const WithAppliedSearch: Story = { args: { value: "Northwind" } };
