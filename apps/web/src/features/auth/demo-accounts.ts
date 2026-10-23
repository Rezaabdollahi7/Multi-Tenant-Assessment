import type { Role } from "@/lib/api/types";

export type DemoAccount = {
  organization: string;
  role: Role;
  name: string;
  phone: string;
};

/** The fixed one-time code the API accepts in development (`DEV_OTP`). */
export const DEMO_CODE = "00000";

/** The seeded Users (apps/api/src/seed/seed-data.ts), listed on sign-in in demo mode. */
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    organization: "Org A",
    role: "ADMIN",
    name: "Ali Ahmadi",
    phone: "09911110001",
  },
  {
    organization: "Org A",
    role: "ANALYST",
    name: "Sara Mohammadi",
    phone: "09911110002",
  },
  {
    organization: "Org A",
    role: "VIEWER",
    name: "Reza Karimi",
    phone: "09911110003",
  },
  {
    organization: "Org B",
    role: "ADMIN",
    name: "Maryam Hosseini",
    phone: "09922220001",
  },
  {
    organization: "Org B",
    role: "ANALYST",
    name: "Hossein Rezaei",
    phone: "09922220002",
  },
  {
    organization: "Org B",
    role: "VIEWER",
    name: "Zahra Naderi",
    phone: "09922220003",
  },
  {
    organization: "Org C",
    role: "ADMIN",
    name: "Amir Taheri",
    phone: "09933330001",
  },
  {
    organization: "Org C",
    role: "ANALYST",
    name: "Neda Safari",
    phone: "09933330002",
  },
  {
    organization: "Org C",
    role: "VIEWER",
    name: "Kaveh Moradi",
    phone: "09933330003",
  },
];
