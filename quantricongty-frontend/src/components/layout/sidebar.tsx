'use client';

import { MouseEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useRouteLoading } from '@/components/loading/route-loading-provider';
import { NAV_SECTIONS } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { useSessionUser } from '@/components/session-provider';
import { Badge } from '@/components/ui/badge';

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const { hasPermission } = useSessionUser();
  const { startRouteLoading } = useRouteLoading();

  function handleNavigation(nextHref: string, event: MouseEvent<HTMLAnchorElement>) {
    if (
      pathname === nextHref ||
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    startRouteLoading();
  }

  return (
    <aside className={cn('sidebar', collapsed && 'sidebar-collapsed')}>
      <div className="brand-block">
        <span className="brand-mark">CC</span>
        <div className="brand-copy">
          <strong>Company Core</strong>
          <p>Nền tảng quản trị</p>
        </div>
        <button
          type="button"
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={collapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'}
          title={collapsed ? 'Mở rộng' : 'Thu gọn'}
        >
          {collapsed ? <PanelLeftOpen className="icon" /> : <PanelLeftClose className="icon" />}
        </button>
      </div>

      {NAV_SECTIONS.map((section) => {
        const items = section.items.filter((item) => !item.permission || hasPermission(item.permission));
        if (!items.length) return null;

        return (
          <div className="nav-section" key={section.title}>
            <p className="nav-section-title">{section.title}</p>
            <nav>
              {items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn('nav-link', active && 'nav-link-active')}
                    onClick={(event) => handleNavigation(item.href, event)}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="nav-link-main">
                      <Icon className="icon" />
                      <span className="nav-label">{item.label}</span>
                    </span>
                    {item.note ? <Badge tone="warning">{item.note}</Badge> : null}
                  </Link>
                );
              })}
            </nav>
          </div>
        );
      })}
    </aside>
  );
}
