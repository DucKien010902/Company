import { DashboardShell } from '@/components/layout/dashboard-shell';
import { requireServerSessionUser } from '@/lib/session-server';

export default async function ProtectedDashboardLayout({ children }: { children: React.ReactNode }) {
  await requireServerSessionUser();
  return <DashboardShell>{children}</DashboardShell>;
}
