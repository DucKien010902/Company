'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { auditApi } from '@/features/audit/api';
import { Card, CardHeader } from '@/components/ui/card';
import { DataTable, Column } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { AuditLog } from '@/types';
import { formatDateTime } from '@/lib/utils';

export function AuditPage() {
  const [limit, setLimit] = useState('50');
  const query = useQuery({ queryKey: ['audit', limit], queryFn: () => auditApi.list(Number(limit || 50)) });

  const columns: Column<AuditLog>[] = [
    { key: 'action', header: 'Hành động', cell: (row) => row.action },
    { key: 'module', header: 'Phân hệ', cell: (row) => row.module },
    { key: 'entity', header: 'Đối tượng', cell: (row) => row.entityName || '-' },
    { key: 'metadata', header: 'Dữ liệu', cell: (row) => <code>{JSON.stringify(row.metadata)}</code> },
    { key: 'createdAt', header: 'Thời gian tạo', cell: (row) => formatDateTime(row.createdAt) },
  ];

  return (
    <div className="stack">
      <PageHeader title="Nhật ký hệ thống" description="Dòng thời gian vận hành gọn nhẹ lấy từ collection audit log của backend." />
      <Card>
        <CardHeader title="Sự kiện mới nhất" description="Tăng giới hạn khi bạn cần xem lịch sử sâu hơn." />
        <div className="toolbar">
          <Input type="number" min="1" max="500" value={limit} onChange={(event) => setLimit(event.target.value)} />
        </div>
        {query.isPending ? <div>Đang tải nhật ký hệ thống...</div> : null}
        {query.data ? <DataTable columns={columns} rows={query.data} /> : null}
      </Card>
    </div>
  );
}
