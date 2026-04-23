import Link from 'next/link';
import { buttonClass } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="centered-page">
      <div className="card" style={{ maxWidth: 560, width: '100%' }}>
        <h1>Không tìm thấy trang</h1>
        <p className="muted">Trang bạn yêu cầu không tồn tại hoặc đã được di chuyển.</p>
        <div className="form-actions" style={{ justifyContent: 'flex-start' }}>
          <Link href="/dashboard" className={buttonClass('primary')}>
            Quay về bảng điều khiển
          </Link>
        </div>
      </div>
    </div>
  );
}
