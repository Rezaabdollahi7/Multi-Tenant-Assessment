"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import { signOut } from "../api/auth-api";

export function useSignOut() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    // Leave even if the request failed: the cookies may already be gone.
    onSettled() {
      queryClient.clear();
      router.replace(routes.login({ reason: "signed_out" }));
      router.refresh();
    },
  });
}
