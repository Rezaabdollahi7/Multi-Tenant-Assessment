import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const ROW_CLASSES =
  "border-0 transition-colors hover:bg-highlight-subtle [&>td:first-child]:rounded-s-full [&>td:last-child]:rounded-e-full";

const ROW_ENTRANCE =
  "animate-in fade-in slide-in-from-bottom-1 fill-mode-both duration-300";

export type DataTableColumn<Row> = {
  id: string;
  header: string;
  cell: (row: Row) => ReactNode;
  className?: string;
};

type DataTableProps<Row> = {
  caption: string;
  columns: DataTableColumn<Row>[];
  rows: Row[];
  getRowId: (row: Row) => string;
};

export function DataTable<Row>({
  caption,
  columns,
  rows,
  getRowId,
}: DataTableProps<Row>) {
  return (
    <Table>
      <TableCaption className="sr-only">{caption}</TableCaption>
      <TableHeader>
        <TableRow className="border-b border-dashed border-border-strong hover:bg-transparent">
          {columns.map((column) => (
            <TableHead
              key={column.id}
              scope="col"
              className={cn(
                "h-12 font-normal text-muted-foreground",
                column.className,
              )}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow
            key={getRowId(row)}
            className={cn(ROW_CLASSES, ROW_ENTRANCE)}
            style={{ animationDelay: `${index * 30}ms` }}
          >
            {columns.map((column) => (
              <TableCell
                key={column.id}
                className={cn("py-3.5", column.className)}
              >
                {column.cell(row)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
