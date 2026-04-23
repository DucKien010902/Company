'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { orgUnitsApi, OrgUnitPayload, branchesApi } from '@/features/org/api';
import { employeesApi } from '@/features/employees/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Select } from '@/components/ui/select';
import { relationLabel } from '@/lib/utils';

export function OrgUnitFormPage({ mode, id }: { mode: 'create' | 'edit'; id?: string }) {
  const router = useRouter();
  const form = useForm<OrgUnitPayload>({ defaultValues: { code: '', name: '', parentId: '', branchId: '', managerEmployeeId: '', status: 'active' } });

  const orgUnitQuery = useQuery({ enabled: mode === 'edit' && !!id, queryKey: ['org-unit', id], queryFn: () => orgUnitsApi.get(id as string) });
  const branchesQuery = useQuery({ queryKey: ['branch-options'], queryFn: () => branchesApi.list({ page: 1, limit: 100 }) });
  const parentsQuery = useQuery({ queryKey: ['org-unit-options'], queryFn: () => orgUnitsApi.list({ page: 1, limit: 100 }) });
  const managersQuery = useQuery({ queryKey: ['employee-options-for-org-unit'], queryFn: () => employeesApi.list({ page: 1, limit: 100 }) });

  useEffect(() => {
    if (orgUnitQuery.data) {
      form.reset({
        code: orgUnitQuery.data.code,
        name: orgUnitQuery.data.name,
        parentId: typeof orgUnitQuery.data.parentId === 'string' ? orgUnitQuery.data.parentId : orgUnitQuery.data.parentId?._id || '',
        branchId: typeof orgUnitQuery.data.branchId === 'string' ? orgUnitQuery.data.branchId : orgUnitQuery.data.branchId?._id || '',
        managerEmployeeId: typeof orgUnitQuery.data.managerEmployeeId === 'string' ? orgUnitQuery.data.managerEmployeeId : orgUnitQuery.data.managerEmployeeId?._id || '',
        status: orgUnitQuery.data.status,
      });
    }
  }, [form, orgUnitQuery.data]);

  const mutation = useMutation({
    mutationFn: (payload: OrgUnitPayload) => (mode === 'create' ? orgUnitsApi.create(payload) : orgUnitsApi.update(id as string, payload)),
    onSuccess: () => {
      toast.success(mode === 'create' ? 'Đã tạo đơn vị tổ chức' : 'Đã cập nhật đơn vị tổ chức');
      router.push('/dashboard/org/units');
      router.refresh();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="stack">
      <PageHeader title={mode === 'create' ? 'Thêm đơn vị tổ chức' : 'Chỉnh sửa đơn vị tổ chức'} description="Dùng tham chiếu đơn vị cha, chi nhánh và người quản lý để mô hình hóa cây tổ chức." />
      <Card>
        <CardHeader title="Thông tin đơn vị tổ chức" description="Chỉ chọn đơn vị cha khi đơn vị này trực thuộc một đơn vị khác." />
        <form className="form-grid two-cols" onSubmit={form.handleSubmit((values) => {
    const payload: OrgUnitPayload = {
      code: values.code,
      name: values.name,
      status: values.status,
      ...(values.parentId ? { parentId: values.parentId } : {}),
      ...(values.branchId ? { branchId: values.branchId } : {}),
      ...(values.managerEmployeeId ? { managerEmployeeId: values.managerEmployeeId } : {}),
    };

    mutation.mutate(payload);
  })}>
          <FormField label="Mã"><Input {...form.register('code', { required: 'Mã là bắt buộc' })} /></FormField>
          <FormField label="Tên"><Input {...form.register('name', { required: 'Tên là bắt buộc' })} /></FormField>
          <FormField label="Đơn vị cha">
            <Select {...form.register('parentId')}>
              <option value="">Không có</option>
              {(parentsQuery.data?.items ?? []).filter((item) => item._id !== id).map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
            </Select>
          </FormField>
          <FormField label="Chi nhánh">
            <Select {...form.register('branchId')}>
              <option value="">Không có</option>
              {(branchesQuery.data?.items ?? []).map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
            </Select>
          </FormField>
          <FormField label="Quản lý">
            <Select {...form.register('managerEmployeeId')}>
              <option value="">Không có</option>
              {(managersQuery.data?.items ?? []).map((item) => <option key={item._id} value={item._id}>{relationLabel(item)}</option>)}
            </Select>
          </FormField>
          <FormField label="Trạng thái">
            <Select {...form.register('status')}><option value="active">Hoạt động</option><option value="inactive">Ngừng hoạt động</option></Select>
          </FormField>
          <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
            <Link href="/dashboard/org/units" className="button button-secondary">Hủy</Link>
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Đang lưu...' : mode === 'create' ? 'Tạo đơn vị tổ chức' : 'Cập nhật đơn vị tổ chức'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
