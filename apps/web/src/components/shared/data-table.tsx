import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
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

/** Rows have no rules; the hovered one lights up as a yellow pill. */
const ROW_CLASSES =
  "border-0 transition-colors hover:bg-highlight-subtle [&>td:first-child]:rounded-s-full [&>td:last-child]:rounded-e-full";

export type DataTableColumn<Row> = {
  id: string;
  header: string;
  cell: (row: Row) => ReactNode;
  /** Applied to the header and every cell, e.g. alignment or hiding on small screens. */
  className?: string;
};

type DataTableProps<Row> = {
  /** Describes the table to screen readers; visually hidden. */
  caption: string;
  columns: DataTableColumn<Row>[];
  /** Undefined while loading; skeleton rows take their place. */
  rows: Row[] | undefined;
  getRowId: (row: Row) => string;
  /** Number of skeleton rows while loading. */
  loadingRows?: number;
};

/** A semantic table of rows described by column definitions. */
export function DataTable<Row>({
  caption,
  columns,
  rows,
  getRowId,
  loadingRows = 5,
}: DataTableProps<Row>) {
  return (
    <Table aria-busy={rows === undefined}>
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
        {rows === undefined
          ? Array.from({ length: loadingRows }, (_, index) => (
              <TableRow key={index} className="border-0">
                {columns.map((column) => (
                  <TableCell key={column.id} className={column.className}>
                    <Skeleton className="h-4 w-full max-w-40" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          : rows.map((row) => (
              <TableRow key={getRowId(row)} className={ROW_CLASSES}>
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
