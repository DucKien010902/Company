'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { positionsApi } from '@/features/org/api';
import { Position } from '@/types';
import { Badge } from '@/components/ui/badge';
import { buttonClass, Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { DataTable, Column } from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Pagination } from '@/components/ui/pagination';

function roleSummary(position: Position) {
  const role = position.defaultRoleId ?? position.defaultRoleIds?.[0];
  if (!role) return '-';
  return typeof role === 'string' ? role : role.name || role.code || role._id;
}

export function PositionsListPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const query = useQuery({
    queryKey: ['positions', page, search],
    queryFn: () => positionsApi.list({ page, limit: 20, search: search || undefined }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => positionsApi.remove(id),
    onSuccess: () => {
      toast.success('Đã xóa chức danh thành công');
      queryClient.invalidateQueries({ queryKey: ['positions'] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const columns: Column<Position>[] = [
    { 
      key: 'name', 
      header: 'Chức danh', 
      cell: (row) => (
        <div>
          <strong>{row.name}</strong>
          <div className="kbd-note">{row.code}</div>
        </div>
      ) 
    },
    { key: 'level', header: 'Cấp bậc', cell: (row) => row.level || '-' },
    { key: 'roles', header: 'Role mặc định', cell: (row) => <Badge>{roleSummary(row)}</Badge> },
    { key: 'description', header: 'Mô tả', cell: (row) => row.description || '-' },
    { key: 'status', header: 'Trạng thái', cell: (row) => row.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động' },
    {
      key: 'actions',
      header: 'Thao tác',
      cell: (row) => (
        <div className="inline-actions">
          <Link href={`/dashboard/org/positions/${row._id}/edit`} className={buttonClass('secondary')}>
            Sửa
          </Link>
          <Button variant="ghost" onClick={() => window.confirm(`Xóa chức danh ${row.name}?`) && remove.mutate(row._id)}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="stack">
      <PageHeader
        title="Chức danh"
        description="Quản lý chức danh và role mặc định để backend có thể suy ra quyền theo vị trí sau này."
        actions={
          <Link href="/dashboard/org/positions/new" className={buttonClass('primary')}>
            Thêm chức danh
          </Link>
        }
      />
      <Card>
        <CardHeader 
          title="Danh sách chức danh" 
          description="Trường role mặc định đã sẵn sàng ở giao diện, backend có thể bổ sung xử lý sau." 
        />
        <div className="toolbar">
          <Input 
            placeholder="Tìm theo mã hoặc tên" 
            value={search} 
            onChange={(event) => { setSearch(event.target.value); setPage(1); }} 
          />
        </div>
        
        {query.isPending ? <div className="p-4 text-center">Đang tải chức danh...</div> : null}
        
        {query.data?.items.length ? (
          <DataTable columns={columns} rows={query.data.items} />
        ) : null}
        
        {query.data && !query.data.items.length ? (
          <EmptyState 
            title="Chưa có chức danh nào" 
            description="Hãy thêm chức danh và gán role mặc định cho từng vị trí để bắt đầu." 
          />
        ) : null}
        
        {query.data ? <Pagination meta={query.data.meta} onChange={setPage} /> : null}
      </Card>
    </div>
  );
}