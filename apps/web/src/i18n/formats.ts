import type { Formats } from "next-intl";

/** Named formats, so every date and number of a kind looks the same everywhere. */
export const formats = {
  dateTime: {
    /** "Oct 22, 2026" / "۳۰ مهر ۱۴۰۵" */
    date: { dateStyle: "medium" },
    /** "Oct 22, 2026, 4:57 PM" */
    dateTime: { dateStyle: "medium", timeStyle: "short" },
    /** A UTC calendar day such as a trend point: "Oct 22" / "۳۰ مهر" */
    day: { month: "short", day: "numeric", timeZone: "UTC" },
  },
  number: {
    percent: { style: "percent", maximumFractionDigits: 0 },
  },
} satisfies Formats;
