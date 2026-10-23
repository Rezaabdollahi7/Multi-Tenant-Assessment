import { ShieldCheckIcon } from "lucide-react";
import Link from "next/link";
import { routes } from "@/lib/routes";

export function BrandMark() {
  return (
    <Link
      href={routes.dashboard()}
      className="flex h-11 items-center gap-2 rounded-full border border-border-strong px-4 text-base font-medium transition-colors hover:bg-card"
    >
      <ShieldCheckIcon aria-hidden className="size-5" />
      ارزیابی امنیت
    </Link>
  );
}
