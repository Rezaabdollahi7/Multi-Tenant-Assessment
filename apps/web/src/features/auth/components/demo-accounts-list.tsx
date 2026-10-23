import { ROLE_LABELS } from "@/lib/roles";
import { DEMO_ACCOUNTS } from "../demo-accounts";

type DemoAccountsListProps = {
  onSelect: (phone: string) => void;
};

/** Seeded Users for evaluators: choosing one fills in the phone number. */
export function DemoAccountsList({ onSelect }: DemoAccountsListProps) {
  return (
    <section aria-labelledby="demo-accounts-heading" className="space-y-2">
      <h2
        id="demo-accounts-heading"
        className="text-muted-foreground text-xs font-medium tracking-wide uppercase"
      >
        Demo accounts · code 00000
      </h2>
      <ul className="divide-border border-border divide-y rounded-md border text-sm">
        {DEMO_ACCOUNTS.map((account) => (
          <li key={account.phone}>
            <button
              type="button"
              onClick={() => onSelect(account.phone)}
              className="hover:bg-accent focus-visible:bg-accent flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-2 text-left transition-colors outline-none"
            >
              <span>
                <span className="font-medium">{account.name}</span>
                <span className="text-muted-foreground">
                  {" "}
                  · {account.organization} {ROLE_LABELS[account.role]}
                </span>
              </span>
              <span className="text-muted-foreground font-mono text-xs">
                {account.phone}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
