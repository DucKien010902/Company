'use client';

import { ReactNode } from 'react';
import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { cn } from '@/lib/utils';

export function DashboardShell({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={cn('dashboard-shell', sidebarCollapsed && 'dashboard-shell-collapsed')}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((value) => !value)} />
      <div className="dashboard-main">
        <Topbar />
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}
