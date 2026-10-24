export const GAP = "gap" as const;

export type PageItem = number | typeof GAP;

export function pageItems(
  page: number,
  totalPages: number,
): PageItem[] {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const shown = [...pages]
    .filter((candidate) => candidate >= 1 && candidate <= totalPages)
    .sort((a, b) => a - b);
  return shown.flatMap((current, index) => {
    const previous = shown[index - 1];
    return previous !== undefined && current - previous > 1
      ? [GAP, current]
      : [current];
  });
}
