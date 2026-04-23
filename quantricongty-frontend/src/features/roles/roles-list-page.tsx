'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { rolesApi } from '@/features/roles/api';
import { Badge } from '@/components/ui/badge';
import { buttonClass, Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { DataTable, Column } from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { Pagination } from '@/components/ui/pagination';
import { PermissionGate } from '@/components/ui/permission-gate';
import { Input } from '@/components/ui/input';
import { Role } from '@/types';

export function RolesListPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const rolesQuery = useQuery({
    queryKey: ['roles', page, search],
    queryFn: () => rolesApi.list({ page, limit: 20, search: search || undefined }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => rolesApi.remove(id),
    onSuccess: () => {
      toast.success('Đã xóa vai trò');
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const columns: Column<Role>[] = [
    { key: 'name', header: 'Vai trò', cell: (role) => <div><strong>{role.name}</strong><div className="kbd-note">{role.key}</div></div> },
    { key: 'description', header: 'Mô tả', cell: (role) => role.description || '-' },
    { key: 'permissions', header: 'Số quyền', cell: (role) => <Badge>{role.permissions.length}</Badge> },
    { key: 'system', header: 'Loại', cell: (role) => <Badge tone={role.isSystem ? 'warning' : 'neutral'}>{role.isSystem ? 'Hệ thống' : 'Tùy chỉnh'}</Badge> },
    {
      key: 'actions',
      header: 'Thao tác',
      cell: (role) => (
        <div className="inline-actions">
          <Link href={`/dashboard/iam/roles/${role._id}/edit`} className={buttonClass('secondary')}>
            Sửa
          </Link>
          {!role.isSystem ? (
            <Button variant="ghost" onClick={() => {
              if (window.confirm(`Xóa vai trò ${role.name}?`)) deleteMutation.mutate(role._id);
            }}>
              Xóa
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="stack">
      <PageHeader
        title="Vai trò"
        description="Tạo các mẫu phân quyền dùng lại được. Backend vẫn là nơi kiểm tra quyền chính, còn giao diện sẽ ẩn bớt thao tác theo quyền hiện tại."
        actions={
          <PermissionGate permission="roles.create">
            <Link href="/dashboard/iam/roles/new" className={buttonClass('primary')}>
              Thêm vai trò
            </Link>
          </PermissionGate>
        }
      />

      <Card>
        <CardHeader title="Danh sách vai trò" description="Trang này đang dùng route backend `GET /roles`." />
        <div className="toolbar">
          <Input placeholder="Tìm theo mã hoặc tên vai trò" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} />
        </div>
        {rolesQuery.isPending ? <div>Đang tải danh sách vai trò...</div> : null}
        {rolesQuery.data?.items.length ? <DataTable columns={columns} rows={rolesQuery.data.items} /> : null}
        {rolesQuery.data && !rolesQuery.data.items.length ? <EmptyState title="Chưa có vai trò nào" description="Hãy tạo vai trò tùy chỉnh đầu tiên hoặc thay đổi từ khóa tìm kiếm." /> : null}
        {rolesQuery.data ? <Pagination meta={rolesQuery.data.meta} onChange={setPage} /> : null}
      </Card>
    </div>
  );
}
