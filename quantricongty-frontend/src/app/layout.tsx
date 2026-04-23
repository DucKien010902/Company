import type { Metadata } from 'next';
import '@/app/globals.css';
import { Providers } from '@/components/providers';
import { getServerSessionUser } from '@/lib/session-server';

export const metadata: Metadata = {
  title: 'Quản trị doanh nghiệp',
  icons: 'https://png.pngtree.com/png-clipart/20241121/original/pngtree-creative-company-logo-png-image_17276628.png',
  description: 'Trang quản trị doanh nghiệp cho công ty, HRM, CRM và các module nghiệp vụ trong tương lai.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const sessionUser = await getServerSessionUser();

  return (
    <html lang="en">
      <body>
        <Providers sessionUser={sessionUser}>{children}</Providers>
      </body>
    </html>
  );
}
