"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 300;

type SearchInputProps = {
  label: string;
  value: string;
  onSearch: (value: string) => void;
  className?: string;
};

export function SearchInput({
  label,
  value,
  onSearch,
  className,
}: SearchInputProps) {
  const [draft, setDraft] = useState(value);
  const [applied, setApplied] = useState(value);

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
        className="pointer-events-none absolute top-1/2 start-4 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        aria-label={label}
        placeholder={label}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        className="ps-10"
      />
    </div>
  );
}
