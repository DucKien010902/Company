'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { partiesApi } from '@/features/crm/api';
import { ExternalParty } from '@/types';
import { relationLabel } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { buttonClass, Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { DataTable, Column } from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Pagination } from '@/components/ui/pagination';

export function PartiesListPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const query = useQuery({ queryKey: ['parties', page, search], queryFn: () => partiesApi.list({ page, limit: 20, search: search || undefined }) });
  const remove = useMutation({ mutationFn: (id: string) => partiesApi.remove(id), onSuccess: () => { toast.success('Đã xóa đối tác'); queryClient.invalidateQueries({ queryKey: ['parties'] }); }, onError: (error: Error) => toast.error(error.message) });

  const columns: Column<ExternalParty>[] = [
    { key: 'display', header: 'Đối tác', cell: (row) => <div><strong>{row.displayName}</strong><div className="kbd-note">{row.code}</div></div> },
    { key: 'type', header: 'Loại', cell: (row) => <Badge>{row.partyType}</Badge> },
    { key: 'relationships', header: 'Quan hệ', cell: (row) => row.relationshipTypes.join(', ') || '-' },
    { key: 'owner', header: 'Phụ trách', cell: (row) => relationLabel(row.ownerEmployeeId as never) },
    { key: 'status', header: 'Vòng đời', cell: (row) => row.lifecycleStatus || '-' },
    { key: 'actions', header: 'Thao tác', cell: (row) => <div className="inline-actions"><Link href={`/dashboard/crm/parties/${row._id}/edit`} className={buttonClass('secondary')}>Sửa</Link><Button variant="ghost" onClick={() => window.confirm(`Xóa đối tác ${row.displayName}?`) && remove.mutate(row._id)}>Xóa</Button></div> },
  ];

  return (
    <div className="stack">
      <PageHeader title="Đối tác" description="Quản lý khách hàng, khách tiềm năng, nhà cung cấp hoặc đối tác trong cùng một cấu trúc CRM." actions={<Link href="/dashboard/crm/parties/new" className={buttonClass('primary')}>Thêm đối tác</Link>} />
      <Card>
        <CardHeader title="Danh sách đối tác" description="Mô hình backend đủ linh hoạt để hỗ trợ khách hàng, nhà cung cấp và đối tác bằng cùng một thực thể." />
        <div className="toolbar"><Input placeholder="Tìm theo tên, mã, số điện thoại hoặc email" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} /></div>
        {query.isPending ? <div>Đang tải đối tác...</div> : null}
        {query.data?.items.length ? <DataTable columns={columns} rows={query.data.items} /> : null}
        {query.data && !query.data.items.length ? <EmptyState title="Chưa có đối tác nào" description="Hãy tạo bản ghi khách hàng, đối tác hoặc nhà cung cấp đầu tiên." /> : null}
        {query.data ? <Pagination meta={query.data.meta} onChange={setPage} /> : null}
      </Card>
    </div>
  );
}
