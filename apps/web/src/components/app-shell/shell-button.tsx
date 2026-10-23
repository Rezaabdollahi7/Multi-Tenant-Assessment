import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** The round glass buttons at the end of the top bar. */
export function ShellButton({
  className,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "glass size-11 rounded-full hover:bg-card-solid",
        className,
      )}
      {...props}
    />
  );
}
