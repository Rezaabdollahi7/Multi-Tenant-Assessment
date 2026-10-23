import { cn } from "@/lib/utils";

export function initials(name: string | null, fallback: string): string {
  return (name ?? fallback)
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type UserAvatarProps = {
  name: string | null;
  fallback: string;
  className?: string;
};

export function UserAvatar({ name, fallback, className }: UserAvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full bg-highlight-subtle text-xs font-medium",
        className,
      )}
    >
      {initials(name, fallback)}
    </span>
  );
}
