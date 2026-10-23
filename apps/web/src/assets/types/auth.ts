import type { Role } from "./user";

export type SignInReason = "session_expired" | "signed_out";

export type DemoAccount = {
  organization: string;
  role: Role;
  name: string;
  phone: string;
};
