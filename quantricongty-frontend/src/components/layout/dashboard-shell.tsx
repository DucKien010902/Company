import { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-main">
        <Topbar />
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}
