'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { positionsApi, PositionPayload } from '@/features/org/api';
import { rolesApi } from '@/features/roles/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export function PositionFormPage({ mode, id }: { mode: 'create' | 'edit'; id?: string }) {
  const router = useRouter();
  const form = useForm<PositionPayload>({
    defaultValues: {
      code: '',
      name: '',
      level: '',
      description: '',
      status: 'active',
      defaultRoleId: '',
    },
  });

  const positionQuery = useQuery({
    enabled: mode === 'edit' && !!id,
    queryKey: ['position', id],
    queryFn: () => positionsApi.get(id as string),
  });

  const rolesQuery = useQuery({
    queryKey: ['role-options-for-position'],
    queryFn: () => rolesApi.list({ page: 1, limit: 100 }),
  });

  useEffect(() => {
    if (!positionQuery.data) return;

    form.reset({
      code: positionQuery.data.code,
      name: positionQuery.data.name,
      level: positionQuery.data.level,
      description: positionQuery.data.description,
      status: positionQuery.data.status,
      defaultRoleId:
        typeof positionQuery.data.defaultRoleId === 'string'
          ? positionQuery.data.defaultRoleId
          : positionQuery.data.defaultRoleId?._id ||
            (positionQuery.data.defaultRoleIds ?? []).map((item) => (typeof item === 'string' ? item : item._id))[0] ||
            '',
    });
  }, [form, positionQuery.data]);

  const mutation = useMutation({
    mutationFn: (payload: PositionPayload) => (mode === 'create' ? positionsApi.create(payload) : positionsApi.update(id as string, payload)),
    onSuccess: () => {
      // Sửa lỗi chính tả 'dannh' -> 'danh'
      toast.success(mode === 'create' ? 'Đã tạo chức danh thành công' : 'Đã cập nhật chức danh thành công');
      router.push('/dashboard/org/positions');
      router.refresh();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="stack">
      <PageHeader
        title={mode === 'create' ? 'Thêm chức danh' : 'Chỉnh sửa chức danh'}
        description=""
      />
      <Card>
        <CardHeader title="Thông tin chức danh" description="" />
        <form className="form-grid two-cols" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          <FormField label="Mã">
            <Input {...form.register('code', { required: 'Mã là bắt buộc' })} />
          </FormField>
          <FormField label="Tên">
            <Input {...form.register('name', { required: 'Tên là bắt buộc' })} />
          </FormField>
          <FormField label="Cấp bậc">
            <Input {...form.register('level')} />
          </FormField>
          <FormField label="Trạng thái">
            <Select {...form.register('status')}>
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
            </Select>
          </FormField>
          <div style={{ gridColumn: '1 / -1' }}>
            <FormField label="Role mặc định" description="Chọn 1 role hệ thống cho chức danh này. Mặc định để trống nếu chưa gán.">
              <Select {...form.register('defaultRoleId')}>
                <option value="">Không có role mặc định</option>
                {(rolesQuery.data?.items ?? []).map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.name} ({role.key})
                  </option>
                ))}
              </Select>
            </FormField>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <FormField label="Mô tả">
              <Textarea {...form.register('description')} />
            </FormField>
          </div>
          <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
            <Link href="/dashboard/org/positions" className="button button-secondary">
              Hủy
            </Link>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Đang lưu...' : mode === 'create' ? 'Tạo chức danh' : 'Cập nhật chức danh'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}