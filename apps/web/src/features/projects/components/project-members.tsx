import { Users } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Panel } from "@/components/shared/panel";
import type { Member } from "@/lib/api/types";

export function ProjectMembers({ members }: { members: Member[] }) {
  const t = useTranslations();
  const format = useFormatter();

  const columns: DataTableColumn<Member>[] = [
    {
      id: "name",
      header: t("projects.members.name"),
      cell: (member) => (
        <span className="font-medium">
          {member.name ?? t("common.unnamedUser")}
        </span>
      ),
    },
    {
      id: "roleInProject",
      header: t("projects.members.roleInProject"),
      cell: (member) => member.roleInProject ?? t("common.none"),
    },
    {
      id: "role",
      header: t("projects.members.role"),
      cell: (member) => t(`roles.${member.role}`),
      className: "hidden sm:table-cell",
    },
    {
      id: "joined",
      header: t("projects.members.joined"),
      cell: (member) => format.dateTime(new Date(member.joinedAt), "date"),
      className: "hidden md:table-cell",
    },
  ];

  return (
    <Panel
      title={t("projects.members.title")}
      description={t("projects.members.description")}
    >
      {members.length === 0 ? (
        <EmptyState icon={Users} title={t("projects.members.empty")} />
      ) : (
        <DataTable
          caption={t("projects.members.caption")}
          columns={columns}
          rows={members}
          getRowId={(member) => member.userId}
        />
      )}
    </Panel>
  );
}
