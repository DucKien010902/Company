'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi, LoginPayload } from '@/features/auth/api';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';

export function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginPayload>({
    defaultValues: { email: '', password: '' },
  });

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: () => {
      toast.success('Đăng nhập thành công');
      router.replace('/dashboard');
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Đăng nhập thất bại');
    },
  });

  return (
    <form className="form-grid" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
      <FormField label="Email công việc" error={form.formState.errors.email?.message}>
        <Input type="email" placeholder="owner@company.com" {...form.register('email', { required: 'Email là bắt buộc' })} />
      </FormField>

      <FormField label="Mật khẩu" error={form.formState.errors.password?.message}>
        <Input type="password" placeholder="Nhập mật khẩu" {...form.register('password', { required: 'Mật khẩu là bắt buộc' })} />
      </FormField>

      <div className="form-actions" style={{ justifyContent: 'space-between' }}>
        <Link href="/setup/bootstrap" className="muted">
          Cần thiết lập lần đầu?
        </Link>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
      </div>
    </form>
  );
}
