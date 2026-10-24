import type { ReactNode } from "react";

type PagesContainerProps = {
  children: ReactNode;
};

function PagesContainer({ children }: PagesContainerProps) {
  return <div className="pages-container">{children}</div>;
}

export default PagesContainer;
