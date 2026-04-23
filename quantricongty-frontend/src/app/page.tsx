import { redirect } from 'next/navigation';
import { getServerSessionUser } from '@/lib/session-server';

export default async function HomePage() {
  const sessionUser = await getServerSessionUser();
  redirect(sessionUser ? '/dashboard' : '/login');
}
