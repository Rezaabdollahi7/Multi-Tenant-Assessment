import { cn } from "@/lib/utils";

/** Up to two initials from a name, or from the fallback when there is none. */
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
  /** Used for the initials when the User has no name. */
  fallback: string;
  className?: string;
};

/** A round badge with a User's initials; decorative next to their name. */
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
