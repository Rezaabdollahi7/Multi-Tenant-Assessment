"use client";

import { Loader2Icon, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSignOut } from "../hooks/use-sign-out";

export function SignOutButton() {
  const signOut = useSignOut();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => signOut.mutate()}
      disabled={signOut.isPending}
    >
      {signOut.isPending ? (
        <Loader2Icon className="animate-spin" aria-hidden />
      ) : (
        <LogOutIcon aria-hidden />
      )}
      Sign out
    </Button>
  );
}
