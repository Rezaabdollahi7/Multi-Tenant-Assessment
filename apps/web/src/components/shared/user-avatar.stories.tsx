import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { UserAvatar } from "./user-avatar";

const meta = {
  title: "Shared/UserAvatar",
  component: UserAvatar,
  args: { name: "Sara Mohammadi", fallback: "09911110002" },
} satisfies Meta<typeof UserAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithName: Story = {};

/** A User without a name gets initials from the fallback. */
export const WithoutName: Story = { args: { name: null } };
