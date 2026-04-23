'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { employeesApi } from '@/features/employees/api';
import { Employee } from '@/types';
import { formatDate, relationLabel } from '@/lib/utils';
import { buttonClass, Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { DataTable, Column } from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Pagination } from '@/components/ui/pagination';

export function EmployeesListPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const query = useQuery({ queryKey: ['employees', page, search], queryFn: () => employeesApi.list({ page, limit: 20, search: search || undefined }) });
  const remove = useMutation({ mutationFn: (id: string) => employeesApi.remove(id), onSuccess: () => { toast.success('Đã xóa nhân viên'); queryClient.invalidateQueries({ queryKey: ['employees'] }); }, onError: (error: Error) => toast.error(error.message) });

  const columns: Column<Employee>[] = [
    { key: 'employee', header: 'Nhân viên', cell: (row) => <div><strong>{row.fullName}</strong><div className="kbd-note">{row.employeeCode}</div></div> },
    { key: 'contact', header: 'Liên hệ', cell: (row) => row.email || row.phone || '-' },
    { key: 'structure', header: 'Cơ cấu', cell: (row) => <div>{relationLabel(row.branchId as never)} / {relationLabel(row.orgUnitId as never)}</div> },
    { key: 'position', header: 'Chức danh', cell: (row) => relationLabel(row.positionId as never) },
    { key: 'hireDate', header: 'Ngày vào làm', cell: (row) => formatDate(row.hireDate) },
    { key: 'status', header: 'Trạng thái', cell: (row) => row.workStatus },
    { key: 'actions', header: 'Thao tác', cell: (row) => <div className="inline-actions"><Link href={`/dashboard/hr/employees/${row._id}/edit`} className={buttonClass('secondary')}>Sửa</Link><Button variant="ghost" onClick={() => window.confirm(`Xóa nhân viên ${row.fullName}?`) && remove.mutate(row._id)}>Xóa</Button></div> },
  ];

  return (
    <div className="stack">
      <PageHeader title="Nhân viên" description="Hồ sơ nhân sự cốt lõi dùng chung giữa các phòng ban, chi nhánh và quy trình sau này." actions={<Link href="/dashboard/hr/employees/new" className={buttonClass('primary')}>Thêm nhân viên</Link>} />
      <Card>
        <CardHeader title="Danh sách nhân viên" description="Trang này đang map với các route CRUD `/employees` hiện tại của backend." />
        <div className="toolbar"><Input placeholder="Tìm theo mã nhân viên, tên, email hoặc số điện thoại" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} /></div>
        {query.isPending ? <div>Đang tải danh sách nhân viên...</div> : null}
        {query.data?.items.length ? <DataTable columns={columns} rows={query.data.items} /> : null}
        {query.data && !query.data.items.length ? <EmptyState title="Chưa có nhân viên nào" description="Hãy thêm nhân viên đầu tiên để bắt đầu xây dựng dữ liệu nhân sự." /> : null}
        {query.data ? <Pagination meta={query.data.meta} onChange={setPage} /> : null}
      </Card>
    </div>
  );
}
