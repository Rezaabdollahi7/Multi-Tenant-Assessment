import type { CurrentUser, Finding, Permission, Role } from "@/lib/api/types";

/** Mirrors ROLE_PERMISSIONS in apps/api/src/common/constants/permissions.constants.ts. */
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  VIEWER: [
    "dashboard:read",
    "project:read",
    "member:read",
    "finding:read",
    "activity:read",
  ],
  ANALYST: [
    "dashboard:read",
    "project:read",
    "member:read",
    "finding:read",
    "activity:read",
    "finding:create",
    "finding:update",
  ],
  ADMIN: [
    "dashboard:read",
    "project:read",
    "member:read",
    "finding:read",
    "activity:read",
    "finding:create",
    "finding:update",
    "finding:delete",
  ],
};

export function userWithRole(role: Role): CurrentUser {
  return {
    id: "d7e9694b-6b5f-4879-96cd-d523fae88e9c",
    name: "Sara Mohammadi",
    phone: "09911110002",
    role,
    organization: { id: "00befd63-4ab7-4cef-81dc-d871fb5dd001", name: "Org A" },
    permissions: ROLE_PERMISSIONS[role],
  };
}

export const PROJECT_ID = "98475976-de7a-4ba4-bfcc-1518617fa939";

export const finding: Finding = {
  id: "5f0c2a8e-1b7d-4a53-9c1e-2f6d8b4a7c90",
  title: "SQL injection in search parameter",
  description: "The q parameter is concatenated into a raw query.",
  severity: "CRITICAL",
  status: "OPEN",
  project: { id: PROJECT_ID, name: "Web Platform" },
  createdBy: {
    id: "d7e9694b-6b5f-4879-96cd-d523fae88e9c",
    name: "Sara Mohammadi",
  },
  createdAt: "2026-10-20T09:30:00.000Z",
  updatedAt: "2026-10-21T14:00:00.000Z",
};
