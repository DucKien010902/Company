'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { branchesApi } from '@/features/org/api';
import { Branch } from '@/types';
import { buttonClass, Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { DataTable, Column } from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Pagination } from '@/components/ui/pagination';

export function BranchesListPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const query = useQuery({
    queryKey: ['branches', page, search],
    queryFn: () => branchesApi.list({ page, limit: 20, search: search || undefined }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => branchesApi.remove(id),
    onSuccess: () => {
      toast.success('Đã xóa chi nhánh');
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const columns: Column<Branch>[] = [
    { key: 'code', header: 'Chi nhánh', cell: (row) => <div><strong>{row.name}</strong><div className="kbd-note">{row.code}</div></div> },
    { key: 'type', header: 'Loại', cell: (row) => row.type || '-' },
    { key: 'contact', header: 'Liên hệ', cell: (row) => row.phone || row.email || '-' },
    { key: 'status', header: 'Trạng thái', cell: (row) => row.status || '-' },
    {
      key: 'actions',
      header: 'Thao tác',
      cell: (row) => (
        <div className="inline-actions">
          <Link href={`/dashboard/org/branches/${row._id}/edit`} className={buttonClass('secondary')}>Sửa</Link>
          <Button variant="ghost" onClick={() => window.confirm(`Xóa chi nhánh ${row.name}?`) && remove.mutate(row._id)}>Xóa</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="stack">
      <PageHeader title="Chi nhánh" description="Quản lý các địa điểm hoạt động như cửa hàng, văn phòng, phòng khám hoặc kho." actions={<Link href="/dashboard/org/branches/new" className={buttonClass('primary')}>Thêm chi nhánh</Link>} />
      <Card>
        <CardHeader title="Danh sách chi nhánh" description="Các route backend hiện tại: `GET /branches`, `POST /branches`, `PATCH /branches/:id`." />
        <div className="toolbar">
          <Input placeholder="Tìm theo mã hoặc tên chi nhánh" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} />
        </div>
        {query.isPending ? <div>Đang tải danh sách chi nhánh...</div> : null}
        {query.data?.items.length ? <DataTable columns={columns} rows={query.data.items} /> : null}
        {query.data && !query.data.items.length ? <EmptyState title="Chưa có chi nhánh nào" description="Hãy tạo chi nhánh đầu tiên để bắt đầu dựng cấu trúc tổ chức." /> : null}
        {query.data ? <Pagination meta={query.data.meta} onChange={setPage} /> : null}
      </Card>
    </div>
  );
}
