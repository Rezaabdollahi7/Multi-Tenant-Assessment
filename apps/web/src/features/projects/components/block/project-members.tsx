import { Users } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Panel } from "@/components/shared/panel";
import { UserAvatar } from "@/components/shared/user-avatar";
import type { Member } from "@/assets/types/project";
import { formatDate } from "@/lib/format";
import { ROLE_LABELS } from "@/lib/session/roles";

export function ProjectMembers({ members }: { members: Member[] }) {
  return (
    <Panel
      title="اعضا"
      description="کاربرانی که به این پروژه اختصاص داده شده‌اند"
    >
      {members.length === 0 ? (
        <EmptyState icon={Users} title="عضوی اختصاص داده نشده است" />
      ) : (
        <ul aria-label="اعضای پروژه" className="space-y-1">
          {members.map((member) => (
            <li
              key={member.userId}
              className="flex items-center gap-3 rounded-full py-1.5 pe-3"
            >
              <UserAvatar name={member.name} fallback={member.userId} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  <bdi>{member.name ?? "کاربر بی‌نام"}</bdi>
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  <bdi>{member.roleInProject ?? "—"}</bdi> ·{" "}
                  {ROLE_LABELS[member.role]}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                <span className="sr-only">تاریخ پیوستن: </span>
                {formatDate(member.joinedAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
