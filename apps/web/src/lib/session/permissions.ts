import type {
  PermissionAction,
  PermissionResource,
} from "@/assets/types/permissions";
import type { CurrentUser } from "@/assets/types/user";

export function can<Resource extends PermissionResource>(
  user: CurrentUser | null,
  resource: Resource,
  action: PermissionAction<Resource>,
): boolean {
  const required = `${resource}:${action}`;
  return (
    user?.permissions.some((permission) => permission === required) ?? false
  );
}
