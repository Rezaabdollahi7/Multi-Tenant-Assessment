import { ROLE_LABELS } from "@/lib/session/roles";
import { DEMO_ACCOUNTS, DEMO_CODE } from "../../lib/demo-accounts";

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
        حساب‌های دمو · کد {DEMO_CODE}
      </h2>
      <ul className="space-y-1 text-sm">
        {DEMO_ACCOUNTS.map((account) => (
          <li key={account.phone}>
            <button
              type="button"
              onClick={() => onSelect(account.phone)}
              className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-full px-4 py-2 text-start transition-colors hover:bg-highlight-subtle focus-visible:bg-highlight-subtle"
            >
              <span>
                <bdi className="font-medium">{account.name}</bdi>
                <span className="text-muted-foreground">
                  {" · "}
                  {ROLE_LABELS[account.role]} ·{" "}
                  <bdi>{account.organization}</bdi>
                </span>
              </span>
              <span
                dir="ltr"
                className="text-muted-foreground text-xs tabular-nums"
              >
                {account.phone}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
