import Link from "next/link";
import { DetailList } from "@/components/shared/detail-list";
import { Panel } from "@/components/shared/panel";
import type { Finding } from "@/assets/types/finding";
import { formatDate, formatDateTime } from "@/lib/format";
import { routes } from "@/lib/routes";

export function FindingMetaPanel({ finding }: { finding: Finding }) {
  return (
    <Panel title="دربارهٔ این یافته">
      <DetailList
        details={[
          {
            label: "پروژه",
            value: (
              <Link
                href={routes.project(finding.project.id)}
                className="underline decoration-border-strong underline-offset-4 hover:decoration-foreground"
              >
                <bdi>{finding.project.name}</bdi>
              </Link>
            ),
          },
          {
            label: "ثبت‌کننده",
            value: <bdi>{finding.createdBy.name ?? "کاربر بی‌نام"}</bdi>,
          },
          {
            label: "تاریخ ثبت",
            value: (
              <time dateTime={finding.createdAt}>
                {formatDate(finding.createdAt)}
              </time>
            ),
          },
          {
            label: "آخرین به‌روزرسانی",
            value: (
              <time dateTime={finding.updatedAt}>
                {formatDateTime(finding.updatedAt)}
              </time>
            ),
          },
        ]}
      />
    </Panel>
  );
}
