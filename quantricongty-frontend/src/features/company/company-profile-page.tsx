'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { companyApi } from '@/features/company/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/ui/page-header';
import { safeParseJson, stringifyJson } from '@/lib/utils';
import { Company } from '@/types';

export function CompanyProfilePage() {
  const profileQuery = useQuery({ queryKey: ['company-profile'], queryFn: companyApi.get });
  const form = useForm<Company & { settingsText: string }>();

  const mutation = useMutation({
    mutationFn: (payload: Partial<Company>) => companyApi.update(payload),
    onSuccess: (company) => {
      form.reset({ ...company, settingsText: stringifyJson(company.settings) });
      toast.success('Đã cập nhật hồ sơ công ty');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (profileQuery.isPending) return <Card>Đang tải hồ sơ công ty...</Card>;
  if (profileQuery.isError || !profileQuery.data) return <Card>Không thể tải hồ sơ công ty.</Card>;

  const company = profileQuery.data;
  if (!form.formState.isDirty && !form.getValues('name')) {
    form.reset({ ...company, settingsText: stringifyJson(company.settings) });
  }

  return (
    <div className="stack">
      <PageHeader title="Hồ sơ công ty" description="Quản lý thông tin công ty dùng chung cho HRM, CRM và các module nghiệp vụ sau này." />
      <Card>
        <CardHeader title="Thông tin hồ sơ" description="Trang này đang dùng contract backend `/company/profile`." />
        <form
          className="form-grid two-cols"
          onSubmit={form.handleSubmit((values) => {
            try {
              const payload: Partial<Company> = {
                name: values.name,
                legalName: values.legalName,
                code: values.code,
                taxCode: values.taxCode,
                phone: values.phone,
                email: values.email,
                website: values.website,
                address: values.address,
                timezone: values.timezone,
                currency: values.currency,
                settings: safeParseJson(values.settingsText || '{}'),
              };
              mutation.mutate(payload);
            } catch (error) {
              toast.error(error instanceof Error ? error.message : 'Dữ liệu cấu hình không hợp lệ');
            }
          })}
        >
          <FormField label="Tên công ty">
            <Input {...form.register('name', { required: 'Tên công ty là bắt buộc' })} />
          </FormField>
          <FormField label="Tên pháp lý">
            <Input {...form.register('legalName')} />
          </FormField>
          <FormField label="Mã công ty">
            <Input {...form.register('code')} />
          </FormField>
          <FormField label="Mã số thuế">
            <Input {...form.register('taxCode')} />
          </FormField>
          <FormField label="Số điện thoại">
            <Input {...form.register('phone')} />
          </FormField>
          <FormField label="Email">
            <Input type="email" {...form.register('email')} />
          </FormField>
          <FormField label="Website">
            <Input {...form.register('website')} />
          </FormField>
          <FormField label="Địa chỉ">
            <Input {...form.register('address')} />
          </FormField>
          <FormField label="Múi giờ">
            <Input {...form.register('timezone')} />
          </FormField>
          <FormField label="Tiền tệ">
            <Input {...form.register('currency')} />
          </FormField>
          <div style={{ gridColumn: '1 / -1' }}>
            <FormField label="Cấu hình JSON" description="Đối tượng cấu hình nâng cao, không bắt buộc.">
              <Textarea {...form.register('settingsText')} />
            </FormField>
          </div>
          <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Đang lưu...' : 'Lưu hồ sơ'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
