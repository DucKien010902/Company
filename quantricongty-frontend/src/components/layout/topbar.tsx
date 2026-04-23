'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useSessionUser } from '@/components/session-provider';
import { Button } from '@/components/ui/button';

export function Topbar() {
  const router = useRouter();
  const { sessionUser } = useSessionUser();

  async function handleLogout() {
    const response = await fetch('/api/session/logout', { method: 'POST' });
    if (!response.ok) {
      toast.error('Khong the dang xuat');
      return;
    }
    toast.success('Da dang xuat');
    router.replace('/login');
    router.refresh();
  }

  return (
    <header className="topbar">
      <div>
        <p className="topbar-title">Bẳng điều hành</p>
        <span className="topbar-subtitle">Đang đăng nhập: {sessionUser?.email ?? 'khach'}</span>
      </div>
      <Button variant="secondary" onClick={handleLogout}>
        <LogOut className="icon" />
        Đâng xuất
      </Button>
    </header>
  );
}
