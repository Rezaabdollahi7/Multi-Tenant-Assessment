import { Users } from "lucide-react";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Panel } from "@/components/shared/panel";
import type { Member } from "@/lib/api/types";
import { formatDate } from "@/lib/format";
import { ROLE_LABELS } from "@/lib/roles";
import { displayName } from "@/lib/users";

const COLUMNS: DataTableColumn<Member>[] = [
  {
    id: "name",
    header: "Name",
    cell: (member) => (
      <span className="font-medium">{displayName(member.name)}</span>
    ),
  },
  {
    id: "roleInProject",
    header: "Role in Project",
    cell: (member) => member.roleInProject ?? "—",
  },
  {
    id: "role",
    header: "Role",
    cell: (member) => ROLE_LABELS[member.role],
    className: "hidden sm:table-cell",
  },
  {
    id: "joined",
    header: "Joined",
    cell: (member) => formatDate(member.joinedAt),
    className: "hidden md:table-cell",
  },
];

export function ProjectMembers({ members }: { members: Member[] }) {
  return (
    <Panel title="Members" description="Users assigned to this Project">
      {members.length === 0 ? (
        <EmptyState icon={Users} title="No Members assigned" />
      ) : (
        <DataTable
          caption="Project Members"
          columns={COLUMNS}
          rows={members}
          getRowId={(member) => member.userId}
        />
      )}
    </Panel>
  );
}
