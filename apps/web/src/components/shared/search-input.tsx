"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 300;

type SearchInputProps = {
  /** Accessible name, also the placeholder. */
  label: string;
  /** The applied search, e.g. from the URL. */
  value: string;
  /** Called once typing pauses, with the trimmed text. */
  onSearch: (value: string) => void;
  className?: string;
};

/** A search box that waits for a pause in typing before searching. */
export function SearchInput({
  label,
  value,
  onSearch,
  className,
}: SearchInputProps) {
  const [draft, setDraft] = useState(value);
  const [applied, setApplied] = useState(value);

  // The value can change from outside (back button, "Clear filters").
  if (value !== applied) {
    setApplied(value);
    setDraft(value);
  }

  useEffect(() => {
    const search = draft.trim();
    if (search === applied) return;
    const timer = setTimeout(() => onSearch(search), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [draft, applied, onSearch]);

  return (
    <div className={cn("relative", className)}>
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 start-2.5 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        aria-label={label}
        placeholder={label}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        className="ps-8"
      />
    </div>
  );
}
