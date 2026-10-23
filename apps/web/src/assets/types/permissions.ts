import type { Schemas } from "./api";

export type Permission = Schemas["Permission"];

type ResourceOf<P> = P extends `${infer Resource}:${string}` ? Resource : never;

type ActionOf<
  P,
  Resource extends string,
> = P extends `${Resource}:${infer Action}` ? Action : never;

export type PermissionResource = ResourceOf<Permission>;

export type PermissionAction<Resource extends PermissionResource> = ActionOf<
  Permission,
  Resource
>;
