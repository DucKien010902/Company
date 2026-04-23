'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi, BootstrapPayload } from '@/features/auth/api';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';

export function BootstrapForm() {
  const router = useRouter();
  const form = useForm<BootstrapPayload>({
    defaultValues: {
      company: {
        name: '',
        legalName: '',
        code: '',
        taxCode: '',
        phone: '',
        email: '',
        website: '',
        address: '',
      },
      owner: {
        fullName: '',
        email: '',
        phone: '',
        password: '',
      },
    },
  });

  const mutation = useMutation({
    mutationFn: authApi.bootstrap,
    onSuccess: () => {
      toast.success('Khởi tạo hệ thống thành công');
      router.replace('/dashboard');
      router.refresh();
    },
    onError: (error: Error) => toast.error(error.message || 'Khởi tạo hệ thống thất bại'),
  });

  return (
    <form className="stack" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
      <div className="card surface-alt">
        <h3>Công ty</h3>
        <div className="form-grid two-cols">
          <FormField label="Tên công ty">
            <Input {...form.register('company.name', { required: 'Tên công ty là bắt buộc' })} />
          </FormField>
          <FormField label="Tên pháp lý">
            <Input {...form.register('company.legalName')} />
          </FormField>
          <FormField label="Mã công ty">
            <Input {...form.register('company.code')} />
          </FormField>
          <FormField label="Mã số thuế">
            <Input {...form.register('company.taxCode')} />
          </FormField>
          <FormField label="Số điện thoại">
            <Input {...form.register('company.phone')} />
          </FormField>
          <FormField label="Email">
            <Input type="email" {...form.register('company.email')} />
          </FormField>
          <FormField label="Website">
            <Input {...form.register('company.website')} />
          </FormField>
          <FormField label="Địa chỉ">
            <Input {...form.register('company.address')} />
          </FormField>
        </div>
      </div>

      <div className="card surface-alt">
        <h3>Chủ hệ thống</h3>
        <div className="form-grid two-cols">
          <FormField label="Họ và tên">
            <Input {...form.register('owner.fullName', { required: 'Họ và tên chủ hệ thống là bắt buộc' })} />
          </FormField>
          <FormField label="Email chủ hệ thống">
            <Input type="email" {...form.register('owner.email', { required: 'Email chủ hệ thống là bắt buộc' })} />
          </FormField>
          <FormField label="Số điện thoại">
            <Input {...form.register('owner.phone')} />
          </FormField>
          <FormField label="Mật khẩu ban đầu">
            <Input type="password" {...form.register('owner.password', { required: 'Mật khẩu là bắt buộc', minLength: 6 })} />
          </FormField>
        </div>
      </div>

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={() => router.push('/login')}>
          Quay lại đăng nhập
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Đang tạo...' : 'Khởi tạo hệ thống'}
        </Button>
      </div>
    </form>
  );
}
