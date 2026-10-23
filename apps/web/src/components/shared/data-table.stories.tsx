import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { FindingSeverity } from "@/assets/types/finding";
import { SeverityBadge } from "./severity-badge";
import { StatusBadge } from "./status-badge";
import { DataTable, type DataTableColumn } from "./data-table";

type SampleFinding = {
  id: string;
  title: string;
  severity: FindingSeverity;
  status: string;
};

const COLUMNS: DataTableColumn<SampleFinding>[] = [
  {
    id: "title",
    header: "عنوان",
    cell: (row) => <bdi className="font-medium">{row.title}</bdi>,
  },
  {
    id: "severity",
    header: "شدت",
    cell: (row) => <SeverityBadge severity={row.severity} />,
  },
  {
    id: "status",
    header: "وضعیت",
    cell: (row) => <StatusBadge label={row.status} tone="neutral" />,
    className: "hidden sm:table-cell",
  },
];

const ROWS: SampleFinding[] = [
  {
    id: "1",
    title: "SQL injection in login",
    severity: "CRITICAL",
    status: "باز",
  },
  { id: "2", title: "Stored XSS in comments", severity: "HIGH", status: "باز" },
  { id: "3", title: "Missing rate limit", severity: "MEDIUM", status: "باز" },
  { id: "4", title: "Verbose server banner", severity: "INFO", status: "باز" },
];

const meta = {
  title: "Shared/DataTable",
  component: DataTable<SampleFinding>,
  args: {
    caption: "یافته‌ها",
    columns: COLUMNS,
    rows: ROWS,
    getRowId: (row) => row.id,
  },
  argTypes: { columns: { control: false }, rows: { control: false } },
  parameters: { layout: "padded" },
} satisfies Meta<typeof DataTable<SampleFinding>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rows: Story = {};
