"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { routes } from "@/lib/routes";
import { signOut } from "../lib/auth-api";

export function useSignOut() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function signOutAndLeave() {
    startTransition(async () => {
      await signOut().catch(() => undefined);
      router.replace(routes.login({ reason: "signed_out" }));
      router.refresh();
    });
  }

  return { signOut: signOutAndLeave, pending };
}
