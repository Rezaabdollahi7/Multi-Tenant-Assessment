import type { ReactNode } from "react";
import { Panel } from "@/components/shared/panel";
import { Muted, P } from "@/components/shared/typography";
import type { Finding } from "@/assets/types/finding";
import { revealOrder } from "@/lib/motion";
import { FindingHeader } from "../ui/finding-header";
import { FindingMetaPanel } from "../ui/finding-meta-panel";

type FindingDetailsProps = {
  finding: Finding;
  actions?: ReactNode;
};

export function FindingDetails({ finding, actions }: FindingDetailsProps) {
  return (
    <article className="space-y-8">
      <FindingHeader finding={finding} actions={actions} />

      <div
        className="reveal grid items-start gap-6 lg:grid-cols-3"
        style={revealOrder(1)}
      >
        <Panel title="توضیحات" className="lg:col-span-2">
          {finding.description ? (
            <P dir="auto" className="leading-loose whitespace-pre-wrap">
              {finding.description}
            </P>
          ) : (
            <Muted>هنوز توضیحی ثبت نشده است.</Muted>
          )}
        </Panel>
        <FindingMetaPanel finding={finding} />
      </div>
    </article>
  );
}
