import type { TrendPoint } from "@/assets/types/dashboard";
import { formatDay, formatNumber } from "@/lib/format";
import { SEVERITIES, SEVERITY_LABELS } from "@/lib/severity";

export function TrendTable({ points }: { points: TrendPoint[] }) {
  return (
    <table className="sr-only">
      <caption>یافته‌های ثبت‌شده در هر روز</caption>
      <thead>
        <tr>
          <th scope="col">روز</th>
          <th scope="col">مجموع</th>
          {SEVERITIES.map((severity) => (
            <th key={severity} scope="col">
              {SEVERITY_LABELS[severity]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {points.map((point) => (
          <tr key={point.date}>
            <th scope="row">{formatDay(point.date)}</th>
            <td>{formatNumber(point.total)}</td>
            {SEVERITIES.map((severity) => (
              <td key={severity}>{formatNumber(point.bySeverity[severity])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
