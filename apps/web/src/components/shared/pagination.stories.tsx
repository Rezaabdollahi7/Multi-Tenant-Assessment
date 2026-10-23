import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Pagination } from "./pagination";

const meta = {
  title: "Shared/Pagination",
  component: Pagination,
  args: {
    meta: { page: 5, limit: 10, totalItems: 90, totalPages: 9 },
    totalLabel: "۹۰ یافته",
    hrefForPage: (page: number) => `?page=${page}`,
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Middle: Story = {};

export const FirstPage: Story = {
  args: { meta: { page: 1, limit: 10, totalItems: 90, totalPages: 9 } },
};

export const SinglePage: Story = {
  args: {
    meta: { page: 1, limit: 10, totalItems: 4, totalPages: 1 },
    totalLabel: "۴ یافته",
  },
};
