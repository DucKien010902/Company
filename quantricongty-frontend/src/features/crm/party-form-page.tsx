'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { employeesApi } from '@/features/employees/api';
import { partiesApi, PartyPayload } from '@/features/crm/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MultiValueInput } from '@/components/ui/multi-value-input';
import { PageHeader } from '@/components/ui/page-header';
import { PeopleChecklist } from '@/components/ui/people-checklist';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { safeParseJson, stringifyJson } from '@/lib/utils';

interface PartyFormValues extends PartyPayload {
  phones: string[];
  emails: string[];
  addresses: string[];
  tags: string[];
  relationshipTypes: string[];
  assignedEmployeeIds: string[];
  customFieldsText: string;
}

export function PartyFormPage({ mode, id }: { mode: 'create' | 'edit'; id?: string }) {
  const router = useRouter();
  const form = useForm<PartyFormValues>({
    defaultValues: {
      code: '',
      partyType: 'company',
      relationshipTypes: [],
      displayName: '',
      legalName: '',
      taxCode: '',
      website: '',
      phones: [],
      emails: [],
      addresses: [],
      ownerEmployeeId: '',
      assignedEmployeeIds: [],
      source: '',
      lifecycleStatus: 'lead',
      tags: [],
      customFieldsText: '{}',
      notes: '',
    },
  });

  const partyQuery = useQuery({ enabled: mode === 'edit' && !!id, queryKey: ['party', id], queryFn: () => partiesApi.get(id as string) });
  const employeesQuery = useQuery({ queryKey: ['employee-options-for-party'], queryFn: () => employeesApi.list({ page: 1, limit: 100 }) });

  useEffect(() => {
    if (partyQuery.data) {
      form.reset({
        code: partyQuery.data.code,
        partyType: partyQuery.data.partyType,
        relationshipTypes: partyQuery.data.relationshipTypes ?? [],
        displayName: partyQuery.data.displayName,
        legalName: partyQuery.data.legalName,
        taxCode: partyQuery.data.taxCode,
        website: partyQuery.data.website,
        phones: partyQuery.data.phones ?? [],
        emails: partyQuery.data.emails ?? [],
        addresses: partyQuery.data.addresses ?? [],
        ownerEmployeeId: typeof partyQuery.data.ownerEmployeeId === 'string' ? partyQuery.data.ownerEmployeeId : partyQuery.data.ownerEmployeeId?._id || '',
        assignedEmployeeIds: (partyQuery.data.assignedEmployeeIds ?? []).map((item) => typeof item === 'string' ? item : item._id),
        source: partyQuery.data.source,
        lifecycleStatus: partyQuery.data.lifecycleStatus,
        tags: partyQuery.data.tags ?? [],
        customFieldsText: stringifyJson(partyQuery.data.customFields),
        notes: partyQuery.data.notes,
      });
    }
  }, [form, partyQuery.data]);

  const mutation = useMutation({
    mutationFn: (payload: PartyPayload) => (mode === 'create' ? partiesApi.create(payload) : partiesApi.update(id as string, payload)),
    onSuccess: () => {
      toast.success(mode === 'create' ? 'Đã tạo đối tác' : 'Đã cập nhật đối tác');
      router.push('/dashboard/crm/parties');
      router.refresh();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="stack">
      <PageHeader title={mode === 'create' ? 'Thêm đối tác' : 'Chỉnh sửa đối tác'} description="Dùng một mô hình thực thể linh hoạt cho khách hàng, đối tác, nhà cung cấp và khách tiềm năng." />
      <Card>
        <CardHeader title="Thông tin đối tác" description="Các danh sách như số điện thoại, email, địa chỉ, nhãn và loại quan hệ đều có thể chỉnh ngay trên cùng trang." />
        <form className="stack" onSubmit={form.handleSubmit((values) => {
          try {
            const payload: PartyPayload = {
              code: values.code,
              partyType: values.partyType,
              relationshipTypes: values.relationshipTypes,
              displayName: values.displayName,
              legalName: values.legalName,
              taxCode: values.taxCode,
              website: values.website,
              phones: values.phones,
              emails: values.emails,
              addresses: values.addresses,
              ownerEmployeeId: values.ownerEmployeeId || undefined,
              assignedEmployeeIds: values.assignedEmployeeIds,
              source: values.source,
              lifecycleStatus: values.lifecycleStatus,
              tags: values.tags,
              customFields: safeParseJson(values.customFieldsText || '{}'),
              notes: values.notes,
            };
            mutation.mutate(payload);
          } catch (error) {
            toast.error(error instanceof Error ? error.message : 'JSON của trường tùy chỉnh không hợp lệ');
          }
        })}>
          <div className="form-grid three-cols">
            <FormField label="Mã"><Input {...form.register('code', { required: 'Mã là bắt buộc' })} /></FormField>
            <FormField label="Tên hiển thị"><Input {...form.register('displayName', { required: 'Tên hiển thị là bắt buộc' })} /></FormField>
            <FormField label="Loại đối tác"><Select {...form.register('partyType')}><option value="company">Công ty</option><option value="person">Cá nhân</option></Select></FormField>
            <FormField label="Tên pháp lý"><Input {...form.register('legalName')} /></FormField>
            <FormField label="Mã số thuế"><Input {...form.register('taxCode')} /></FormField>
            <FormField label="Website"><Input {...form.register('website')} /></FormField>
            <FormField label="Người phụ trách"><Select {...form.register('ownerEmployeeId')}><option value="">Không có</option>{(employeesQuery.data?.items ?? []).map((item) => <option key={item._id} value={item._id}>{item.fullName}</option>)}</Select></FormField>
            <FormField label="Nguồn"><Input {...form.register('source')} /></FormField>
            <FormField label="Trạng thái vòng đời"><Select {...form.register('lifecycleStatus')}><option value="lead">Khách tiềm năng</option><option value="active">Đang hoạt động</option><option value="inactive">Ngừng hoạt động</option><option value="blocked">Bị chặn</option></Select></FormField>
          </div>
          <FormField label="Loại quan hệ"><MultiValueInput values={form.watch('relationshipTypes') ?? []} onChange={(next) => form.setValue('relationshipTypes', next, { shouldDirty: true })} placeholder="customer, supplier, partner" /></FormField>
          <FormField label="Số điện thoại"><MultiValueInput values={form.watch('phones') ?? []} onChange={(next) => form.setValue('phones', next, { shouldDirty: true })} placeholder="Mỗi lần nhập một số" /></FormField>
          <FormField label="Email"><MultiValueInput values={form.watch('emails') ?? []} onChange={(next) => form.setValue('emails', next, { shouldDirty: true })} placeholder="Mỗi lần nhập một email" /></FormField>
          <FormField label="Địa chỉ"><MultiValueInput values={form.watch('addresses') ?? []} onChange={(next) => form.setValue('addresses', next, { shouldDirty: true })} placeholder="Mỗi lần nhập một địa chỉ" /></FormField>
          <FormField label="Nhãn"><MultiValueInput values={form.watch('tags') ?? []} onChange={(next) => form.setValue('tags', next, { shouldDirty: true })} placeholder="vip, retail, wholesale" /></FormField>
          <FormField label="Nhân viên phụ trách" description="Hữu ích cho việc sở hữu tài khoản, phối hợp hoặc cùng chăm sóc.">
            <PeopleChecklist people={employeesQuery.data?.items ?? []} value={form.watch('assignedEmployeeIds') ?? []} onChange={(next) => form.setValue('assignedEmployeeIds', next, { shouldDirty: true })} />
          </FormField>
          <FormField label="Trường tùy chỉnh JSON"><Textarea {...form.register('customFieldsText')} /></FormField>
          <FormField label="Ghi chú"><Textarea {...form.register('notes')} /></FormField>
          <div className="form-actions">
            <Link href="/dashboard/crm/parties" className="button button-secondary">Hủy</Link>
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Đang lưu...' : mode === 'create' ? 'Tạo đối tác' : 'Cập nhật đối tác'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
