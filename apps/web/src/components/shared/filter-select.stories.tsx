import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { FilterSelect } from "./filter-select";

type ProjectStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "ARCHIVED";

const OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "PLANNED", label: "برنامه‌ریزی‌شده" },
  { value: "IN_PROGRESS", label: "در حال انجام" },
  { value: "COMPLETED", label: "تکمیل‌شده" },
  { value: "ARCHIVED", label: "بایگانی‌شده" },
];

const meta = {
  title: "Shared/FilterSelect",
  component: FilterSelect<ProjectStatus>,
  args: {
    label: "وضعیت پروژه",
    allLabel: "همه وضعیت‌ها",
    options: OPTIONS,
    value: undefined,
    onChange: fn(),
  },
  argTypes: {
    value: {
      control: "select",
      options: [undefined, ...OPTIONS.map((option) => option.value)],
    },
  },
} satisfies Meta<typeof FilterSelect<ProjectStatus>>;

export default meta;
type Story = StoryObj<typeof meta>;

/** No filter applied: the "all" option shows. */
export const NoFilter: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("combobox", { name: "وضعیت پروژه" }),
    );
    // The listbox is portalled to the document body.
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      await body.findByRole("option", { name: "تکمیل‌شده" }),
    );
    await expect(args.onChange).toHaveBeenCalledWith("COMPLETED");
    // Choosing closes the list and gives the page back to assistive technology.
    await waitFor(() => expect(body.queryByRole("listbox")).toBeNull());
  },
};

export const Applied: Story = { args: { value: "IN_PROGRESS" } };
