import { AppShell } from "@/components/AppShell";
import { requireUser } from "@/lib/auth/session";
import { planState } from "@/lib/domain/plans";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireUser();
  const plan = planState(user);
  return (
    <AppShell userName={user.name} plan={plan.plan} trialDaysLeft={plan.trialDaysLeft}>
      {children}
    </AppShell>
  );
}
