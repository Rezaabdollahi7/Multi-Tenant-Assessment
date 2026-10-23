const SECOND = 1_000;
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 60 * 60 * SECOND],
  ["month", 30 * 24 * 60 * 60 * SECOND],
  ["week", 7 * 24 * 60 * 60 * SECOND],
  ["day", 24 * 60 * 60 * SECOND],
  ["hour", 60 * 60 * SECOND],
  ["minute", 60 * SECOND],
];

const relativeFormat = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/** "3 hours ago", "yesterday", "just now". */
export function formatRelativeTime(date: Date | string, now = new Date()) {
  const elapsed = new Date(date).getTime() - now.getTime();
  for (const [unit, size] of UNITS) {
    if (Math.abs(elapsed) >= size) {
      return relativeFormat.format(Math.round(elapsed / size), unit);
    }
  }
  return "just now";
}

const dateTimeFormat = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

/** "Oct 22, 2026, 4:57 PM", for titles and tooltips next to relative times. */
export function formatDateTime(date: Date | string) {
  return dateTimeFormat.format(new Date(date));
}

const dayFormat = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

/** "Oct 22" for a UTC calendar day such as "2026-10-22". */
export function formatDay(isoDay: string) {
  return dayFormat.format(new Date(`${isoDay}T00:00:00Z`));
}

const pluralRules = new Intl.PluralRules("en");

/** "1 Finding", "3 Findings". */
export function formatCount(
  count: number,
  singular: string,
  plural = `${singular}s`,
) {
  return `${count} ${pluralRules.select(count) === "one" ? singular : plural}`;
}
