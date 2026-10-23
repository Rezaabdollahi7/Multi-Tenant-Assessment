import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { Input } from "@/components/ui/input";
import { FormField } from "./form-field";

const meta = {
  title: "Shared/FormField",
  component: FormField,
  args: {
    id: "title",
    label: "عنوان",
    hint: "حداکثر ۲۰۰ نویسه.",
    // The field hands its control the id and ARIA attributes to spread.
    children: (control) => <Input {...control} defaultValue="SQL injection" />,
  },
  argTypes: { children: { control: false } },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithHint: Story = {};

/** The error is tied to the control, so a screen reader reads it with the field. */
export const WithError: Story = {
  args: {
    error: "عنوان باید دست‌کم ۳ نویسه باشد.",
    children: (control) => <Input {...control} defaultValue="ab" />,
  },
  play: async ({ canvasElement }) => {
    const field = within(canvasElement).getByLabelText("عنوان");
    await expect(field).toBeInvalid();
    await expect(field).toHaveAccessibleDescription(
      "حداکثر ۲۰۰ نویسه. عنوان باید دست‌کم ۳ نویسه باشد.",
    );
  },
};
