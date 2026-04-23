'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { orgUnitsApi } from '@/features/org/api';
import { OrgUnit } from '@/types';
import { relationLabel } from '@/lib/utils';
import { buttonClass, Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { DataTable, Column } from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Pagination } from '@/components/ui/pagination';

export function OrgUnitsListPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const query = useQuery({ queryKey: ['org-units', page, search], queryFn: () => orgUnitsApi.list({ page, limit: 20, search: search || undefined }) });
  const remove = useMutation({
    mutationFn: (id: string) => orgUnitsApi.remove(id),
    onSuccess: () => {
      toast.success('Đã xóa đơn vị tổ chức');
      queryClient.invalidateQueries({ queryKey: ['org-units'] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const columns: Column<OrgUnit>[] = [
    { key: 'name', header: 'Đơn vị tổ chức', cell: (row) => <div><strong>{row.name}</strong><div className="kbd-note">{row.code}</div></div> },
    { key: 'parent', header: 'Cấp cha', cell: (row) => relationLabel(row.parentId as never) },
    { key: 'branch', header: 'Chi nhánh', cell: (row) => relationLabel(row.branchId as never) },
    { key: 'manager', header: 'Quản lý', cell: (row) => relationLabel(row.managerEmployeeId as never) },
    {
      key: 'actions',
      header: 'Thao tác',
      cell: (row) => (
        <div className="inline-actions">
          <Link href={`/dashboard/org/units/${row._id}/edit`} className={buttonClass('secondary')}>Sửa</Link>
          <Button variant="ghost" onClick={() => window.confirm(`Xóa đơn vị tổ chức ${row.name}?`) && remove.mutate(row._id)}>Xóa</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="stack">
      <PageHeader title="Đơn vị tổ chức" description="Xây dựng cơ cấu báo cáo như phòng ban, nhóm, khối hoặc chức năng." actions={<Link href="/dashboard/org/units/new" className={buttonClass('primary')}>Thêm đơn vị</Link>} />
      <Card>
        <CardHeader title="Danh sách đơn vị tổ chức" description="Các đơn vị có thể tạo thành cây phân cấp theo quan hệ cha con." />
        <div className="toolbar"><Input placeholder="Tìm theo mã hoặc tên" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} /></div>
        {query.isPending ? <div>Đang tải đơn vị tổ chức...</div> : null}
        {query.data?.items.length ? <DataTable columns={columns} rows={query.data.items} /> : null}
        {query.data && !query.data.items.length ? <EmptyState title="Chưa có đơn vị tổ chức nào" description="Hãy bắt đầu với các phòng ban cấp cao, rồi thêm đơn vị con sau." /> : null}
        {query.data ? <Pagination meta={query.data.meta} onChange={setPage} /> : null}
      </Card>
    </div>
  );
}
