import { Users } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { EmptyState } from "@/components/shared/empty-state";
import { Panel } from "@/components/shared/panel";
import { UserAvatar } from "@/components/shared/user-avatar";
import type { Member } from "@/lib/api/types";

export function ProjectMembers({ members }: { members: Member[] }) {
  const t = useTranslations();
  const format = useFormatter();

  return (
    <Panel
      title={t("projects.members.title")}
      description={t("projects.members.description")}
    >
      {members.length === 0 ? (
        <EmptyState icon={Users} title={t("projects.members.empty")} />
      ) : (
        <ul aria-label={t("projects.members.caption")} className="space-y-1">
          {members.map((member) => (
            <li
              key={member.userId}
              className="flex items-center gap-3 rounded-full py-1.5 pe-3"
            >
              <UserAvatar name={member.name} fallback={member.userId} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  <bdi>{member.name ?? t("common.unnamedUser")}</bdi>
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  <bdi>{member.roleInProject ?? t("common.none")}</bdi> ·{" "}
                  {t(`roles.${member.role}`)}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                <span className="sr-only">
                  {t("projects.members.joined")}:{" "}
                </span>
                {format.dateTime(new Date(member.joinedAt), "date")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
