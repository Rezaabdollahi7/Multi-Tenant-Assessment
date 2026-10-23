import type { CurrentUser, Permission } from "@/lib/api/types";

/**
 * Whether the User holds every given Permission. Decides what the UI offers;
 * the API enforces the same rules on every request.
 */
export function hasPermissions(
  user: CurrentUser | null,
  ...required: Permission[]
): boolean {
  return (
    user !== null &&
    required.every((permission) => user.permissions.includes(permission))
  );
}
