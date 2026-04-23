'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { branchesApi, BranchPayload } from '@/features/org/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Select } from '@/components/ui/select';

export function BranchFormPage({ mode, id }: { mode: 'create' | 'edit'; id?: string }) {
  const router = useRouter();
  const form = useForm<BranchPayload>({ defaultValues: { code: '', name: '', type: '', phone: '', email: '', address: '', status: 'active' } });
  const query = useQuery({ enabled: mode === 'edit' && !!id, queryKey: ['branch', id], queryFn: () => branchesApi.get(id as string) });

  useEffect(() => {
    if (query.data) {
      form.reset({
        code: query.data.code,
        name: query.data.name,
        type: query.data.type,
        phone: query.data.phone,
        email: query.data.email,
        address: query.data.address,
        status: query.data.status,
      });
    }
  }, [form, query.data]);

  const mutation = useMutation({
    mutationFn: (payload: BranchPayload) => (mode === 'create' ? branchesApi.create(payload) : branchesApi.update(id as string, payload)),
    onSuccess: () => {
      toast.success(mode === 'create' ? 'Đã tạo chi nhánh' : 'Đã cập nhật chi nhánh');
      router.push('/dashboard/org/branches');
      router.refresh();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="stack">
      <PageHeader title={mode === 'create' ? 'Thêm chi nhánh' : 'Chỉnh sửa chi nhánh'} description="Chi nhánh có thể là cửa hàng, văn phòng, phòng khám, kho hoặc bất kỳ địa điểm vận hành nào." />
      <Card>
        <CardHeader title="Thông tin chi nhánh" description="Nên giữ mã ngắn gọn và ổn định vì thường được dùng trong báo cáo và tích hợp." />
        <form className="form-grid two-cols" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          <FormField label="Mã chi nhánh"><Input {...form.register('code', { required: 'Mã là bắt buộc' })} /></FormField>
          <FormField label="Tên chi nhánh"><Input {...form.register('name', { required: 'Tên là bắt buộc' })} /></FormField>
          <FormField label="Loại"><Input {...form.register('type')} /></FormField>
          <FormField label="Trạng thái"><Select {...form.register('status')}><option value="active">Hoạt động</option><option value="inactive">Ngừng hoạt động</option></Select></FormField>
          <FormField label="Số điện thoại"><Input {...form.register('phone')} /></FormField>
          <FormField label="Email"><Input type="email" {...form.register('email')} /></FormField>
          <div style={{ gridColumn: '1 / -1' }}>
            <FormField label="Địa chỉ"><Input {...form.register('address')} /></FormField>
          </div>
          <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
            <Link href="/dashboard/org/branches" className="button button-secondary">Hủy</Link>
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Đang lưu...' : mode === 'create' ? 'Tạo chi nhánh' : 'Cập nhật chi nhánh'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
