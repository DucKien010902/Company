'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { contactsApi } from '@/features/crm/api';
import { ContactPerson } from '@/types';
import { relationLabel } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { buttonClass, Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { DataTable, Column } from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Pagination } from '@/components/ui/pagination';

export function ContactsListPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const query = useQuery({ queryKey: ['contacts', page, search], queryFn: () => contactsApi.list({ page, limit: 20, search: search || undefined }) });
  const remove = useMutation({ mutationFn: (id: string) => contactsApi.remove(id), onSuccess: () => { toast.success('Đã xóa liên hệ'); queryClient.invalidateQueries({ queryKey: ['contacts'] }); }, onError: (error: Error) => toast.error(error.message) });

  const columns: Column<ContactPerson>[] = [
    { key: 'fullName', header: 'Liên hệ', cell: (row) => <div><strong>{row.fullName}</strong><div className="kbd-note">{row.title || row.department || '-'}</div></div> },
    { key: 'party', header: 'Đối tác', cell: (row) => relationLabel(row.partyId as never) },
    { key: 'contactInfo', header: 'Thông tin liên hệ', cell: (row) => row.email || row.phone || '-' },
    { key: 'primary', header: 'Chính', cell: (row) => row.isPrimary ? <Badge tone="success">Có</Badge> : <Badge>Không</Badge> },
    { key: 'actions', header: 'Thao tác', cell: (row) => <div className="inline-actions"><Link href={`/dashboard/crm/contacts/${row._id}/edit`} className={buttonClass('secondary')}>Sửa</Link><Button variant="ghost" onClick={() => window.confirm(`Xóa liên hệ ${row.fullName}?`) && remove.mutate(row._id)}>Xóa</Button></div> },
  ];

  return (
    <div className="stack">
      <PageHeader title="Liên hệ" description="Danh bạ đầu mối gắn với đối tác CRM như khách hàng, nhà cung cấp hoặc đối tác." actions={<Link href="/dashboard/crm/contacts/new" className={buttonClass('primary')}>Thêm liên hệ</Link>} />
      <Card>
        <CardHeader title="Danh sách liên hệ" description="Tách danh bạ cá nhân khỏi hồ sơ công ty để một công ty có thể có nhiều đầu mối liên hệ." />
        <div className="toolbar"><Input placeholder="Tìm theo tên, email hoặc số điện thoại" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} /></div>
        {query.isPending ? <div>Đang tải danh sách liên hệ...</div> : null}
        {query.data?.items.length ? <DataTable columns={columns} rows={query.data.items} /> : null}
        {query.data && !query.data.items.length ? <EmptyState title="Chưa có liên hệ nào" description="Hãy thêm người liên hệ dưới các đối tác để phục vụ quy trình CRM." /> : null}
        {query.data ? <Pagination meta={query.data.meta} onChange={setPage} /> : null}
      </Card>
    </div>
  );
}
