import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import PagesContainer from "./pages-container";

type SectionLayoutProps = {
  children: ReactNode;
  className?: string;
};

function SectionLayout({ children, className }: SectionLayoutProps) {
  return (
    <section className={cn("section-layout", className)}>
      <PagesContainer>{children}</PagesContainer>
    </section>
  );
}

export default SectionLayout;
