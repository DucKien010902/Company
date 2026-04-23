'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { rolesApi, RolePayload } from '@/features/roles/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { PermissionPicker } from '@/components/ui/permission-picker';
import { Textarea } from '@/components/ui/textarea';

export function RoleFormPage({ mode, id }: { mode: 'create' | 'edit'; id?: string }) {
  const router = useRouter();
  const form = useForm<RolePayload>({
    defaultValues: {
      key: '',
      name: '',
      description: '',
      permissions: [],
      isSystem: false,
    },
  });

  const roleQuery = useQuery({
    enabled: mode === 'edit' && !!id,
    queryKey: ['role', id],
    queryFn: () => rolesApi.get(id as string),
  });

  useEffect(() => {
    if (roleQuery.data) {
      form.reset({
        key: roleQuery.data.key,
        name: roleQuery.data.name,
        description: roleQuery.data.description,
        permissions: roleQuery.data.permissions,
        isSystem: roleQuery.data.isSystem,
      });
    }
  }, [form, roleQuery.data]);

  const mutation = useMutation({
    mutationFn: (payload: RolePayload) => (mode === 'create' ? rolesApi.create(payload) : rolesApi.update(id as string, payload)),
    onSuccess: () => {
      toast.success(mode === 'create' ? 'Đã tạo vai trò' : 'Đã cập nhật vai trò');
      router.push('/dashboard/iam/roles');
      router.refresh();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="stack">
      <PageHeader title={mode === 'create' ? 'Thêm vai trò' : 'Chỉnh sửa vai trò'} description="Thiết kế một gói quyền để có thể gán cho tài khoản sau này." />
      <Card>
        <CardHeader title="Thông tin vai trò" description="Biểu mẫu này map trực tiếp tới `POST/PATCH /roles`." />
        <form className="stack" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          <div className="form-grid two-cols">
            <FormField label="Mã vai trò">
              <Input {...form.register('key', { required: 'Mã vai trò là bắt buộc' })} />
            </FormField>
            <FormField label="Tên vai trò">
              <Input {...form.register('name', { required: 'Tên vai trò là bắt buộc' })} />
            </FormField>
          </div>
          <FormField label="Mô tả">
            <Textarea {...form.register('description')} />
          </FormField>
          <label className="checkbox-card">
            <input type="checkbox" {...form.register('isSystem')} /> Vai trò hệ thống
          </label>
          <FormField label="Quyền" description="Chọn tất cả thao tác mà vai trò này được phép sử dụng.">
            <PermissionPicker value={form.watch('permissions') ?? []} onChange={(next) => form.setValue('permissions', next, { shouldDirty: true })} />
          </FormField>
          <div className="form-actions">
            <Link href="/dashboard/iam/roles" className="button button-secondary">
              Hủy
            </Link>
            <Button type="submit" disabled={mutation.isPending || (mode === 'edit' && roleQuery.isPending)}>
              {mutation.isPending ? 'Đang lưu...' : mode === 'create' ? 'Tạo vai trò' : 'Cập nhật vai trò'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
