export function LeftToRight({ children }: { children: string }) {
  return (
    <bdi dir="ltr" className="text-foreground tabular-nums">
      {children}
    </bdi>
  );
}
