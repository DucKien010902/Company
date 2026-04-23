import Link from 'next/link';
import { Card, CardHeader } from '@/components/ui/card';
import { buttonClass } from '@/components/ui/button';

export function ProductsPlaceholder() {
  return (
    <Card>
      <CardHeader title="Chỗ giữ chỗ cho module sản phẩm" description="Backend hiện tại chưa cung cấp endpoint sản phẩm, nên trang này được dựng sẵn cho giai đoạn tiếp theo." />
      <div className="stack muted">
        <p>
          Các resource backend nên làm tiếp: <strong>products</strong>, <strong>product categories</strong>, <strong>units</strong>, <strong>price lists</strong> va <strong>inventory snapshots</strong>.
        </p>
        <p>
          Cấu trúc frontend đã sẵn sàng cho `features/products/api.ts`, trang danh sách, trang tạo mới, trang chỉnh sửa và widget dashboard trong tương lai.
        </p>
        <div>
          <Link href="/dashboard" className={buttonClass('primary')}>
            Quay lại bảng điều khiển
          </Link>
        </div>
      </div>
    </Card>
  );
}
