'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { contactsApi, ContactPayload, partiesApi } from '@/features/crm/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export function ContactFormPage({ mode, id }: { mode: 'create' | 'edit'; id?: string }) {
  const router = useRouter();
  const form = useForm<ContactPayload>({ defaultValues: { partyId: '', fullName: '', title: '', department: '', phone: '', email: '', isPrimary: false, notes: '' } });
  const contactQuery = useQuery({ enabled: mode === 'edit' && !!id, queryKey: ['contact', id], queryFn: () => contactsApi.get(id as string) });
  const partiesQuery = useQuery({ queryKey: ['party-options-for-contact'], queryFn: () => partiesApi.list({ page: 1, limit: 100 }) });

  useEffect(() => {
    if (contactQuery.data) {
      form.reset({
        partyId: typeof contactQuery.data.partyId === 'string' ? contactQuery.data.partyId : contactQuery.data.partyId?._id || '',
        fullName: contactQuery.data.fullName,
        title: contactQuery.data.title,
        department: contactQuery.data.department,
        phone: contactQuery.data.phone,
        email: contactQuery.data.email,
        isPrimary: contactQuery.data.isPrimary,
        notes: contactQuery.data.notes,
      });
    }
  }, [contactQuery.data, form]);

  const mutation = useMutation({
    mutationFn: (payload: ContactPayload) => (mode === 'create' ? contactsApi.create(payload) : contactsApi.update(id as string, payload)),
    onSuccess: () => {
      toast.success(mode === 'create' ? 'Đã tạo liên hệ' : 'Đã cập nhật liên hệ');
      router.push('/dashboard/crm/contacts');
      router.refresh();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="stack">
      <PageHeader title={mode === 'create' ? 'Thêm liên hệ' : 'Chỉnh sửa liên hệ'} description="Gắn người liên hệ cụ thể vào hồ sơ đối tác là công ty hoặc cá nhân." />
      <Card>
        <CardHeader title="Thông tin liên hệ" description="Chọn đối tác cha trước, sau đó điền thông tin người liên hệ." />
        <form className="form-grid two-cols" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          <FormField label="Đối tác"><Select {...form.register('partyId', { required: 'Đối tác là bắt buộc' })}><option value="">Chọn đối tác</option>{(partiesQuery.data?.items ?? []).map((item) => <option key={item._id} value={item._id}>{item.displayName}</option>)}</Select></FormField>
          <FormField label="Họ và tên"><Input {...form.register('fullName', { required: 'Họ và tên là bắt buộc' })} /></FormField>
          <FormField label="Chức vụ"><Input {...form.register('title')} /></FormField>
          <FormField label="Phòng ban"><Input {...form.register('department')} /></FormField>
          <FormField label="Số điện thoại"><Input {...form.register('phone')} /></FormField>
          <FormField label="Email"><Input type="email" {...form.register('email')} /></FormField>
          <label className="checkbox-card" style={{ gridColumn: '1 / -1' }}><input type="checkbox" {...form.register('isPrimary')} /> Đánh dấu là liên hệ chính</label>
          <div style={{ gridColumn: '1 / -1' }}><FormField label="Ghi chú"><Textarea {...form.register('notes')} /></FormField></div>
          <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
            <Link href="/dashboard/crm/contacts" className="button button-secondary">Hủy</Link>
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Đang lưu...' : mode === 'create' ? 'Tạo liên hệ' : 'Cập nhật liên hệ'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
