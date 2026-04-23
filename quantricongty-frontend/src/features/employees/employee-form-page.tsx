'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { employeesApi, EmployeePayload } from '@/features/employees/api';
import { branchesApi, orgUnitsApi, positionsApi } from '@/features/org/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { EmergencyContactsField } from '@/components/ui/emergency-contacts-field';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MultiValueInput } from '@/components/ui/multi-value-input';
import { PageHeader } from '@/components/ui/page-header';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { safeParseJson, stringifyJson } from '@/lib/utils';

interface EmployeeFormValues extends EmployeePayload {
  tags: string[];
  customFieldsText: string;
}

function dateOnly(value?: string | null) {
  return value ? value.slice(0, 10) : '';
}

export function EmployeeFormPage({ mode, id }: { mode: 'create' | 'edit'; id?: string }) {
  const router = useRouter();
  const methods = useForm<EmployeeFormValues>({
    defaultValues: {
      employeeCode: '',
      fullName: '',
      email: '',
      phone: '',
      gender: '',
      dateOfBirth: '',
      nationalId: '',
      address: '',
      branchId: '',
      orgUnitId: '',
      positionId: '',
      managerEmployeeId: '',
      employmentType: '',
      workStatus: 'active',
      hireDate: '',
      leaveDate: '',
      tags: [],
      emergencyContacts: [],
      customFields: {},
      customFieldsText: '{}',
      notes: '',
    },
  });

  const employeeQuery = useQuery({ enabled: mode === 'edit' && !!id, queryKey: ['employee', id], queryFn: () => employeesApi.get(id as string) });
  const branchesQuery = useQuery({ queryKey: ['branch-options-for-employee'], queryFn: () => branchesApi.list({ page: 1, limit: 100 }) });
  const orgUnitsQuery = useQuery({ queryKey: ['org-unit-options-for-employee'], queryFn: () => orgUnitsApi.list({ page: 1, limit: 100 }) });
  const positionsQuery = useQuery({ queryKey: ['position-options-for-employee'], queryFn: () => positionsApi.list({ page: 1, limit: 100 }) });
  const managersQuery = useQuery({ queryKey: ['manager-options-for-employee'], queryFn: () => employeesApi.list({ page: 1, limit: 100 }) });

  useEffect(() => {
    if (employeeQuery.data) {
      methods.reset({
        employeeCode: employeeQuery.data.employeeCode,
        fullName: employeeQuery.data.fullName,
        email: employeeQuery.data.email,
        phone: employeeQuery.data.phone,
        gender: employeeQuery.data.gender,
        dateOfBirth: dateOnly(employeeQuery.data.dateOfBirth),
        nationalId: employeeQuery.data.nationalId,
        address: employeeQuery.data.address,
        branchId: typeof employeeQuery.data.branchId === 'string' ? employeeQuery.data.branchId : employeeQuery.data.branchId?._id || '',
        orgUnitId: typeof employeeQuery.data.orgUnitId === 'string' ? employeeQuery.data.orgUnitId : employeeQuery.data.orgUnitId?._id || '',
        positionId: typeof employeeQuery.data.positionId === 'string' ? employeeQuery.data.positionId : employeeQuery.data.positionId?._id || '',
        managerEmployeeId: typeof employeeQuery.data.managerEmployeeId === 'string' ? employeeQuery.data.managerEmployeeId : employeeQuery.data.managerEmployeeId?._id || '',
        employmentType: employeeQuery.data.employmentType,
        workStatus: employeeQuery.data.workStatus,
        hireDate: dateOnly(employeeQuery.data.hireDate),
        leaveDate: dateOnly(employeeQuery.data.leaveDate),
        tags: employeeQuery.data.tags ?? [],
        emergencyContacts: employeeQuery.data.emergencyContacts ?? [],
        customFieldsText: stringifyJson(employeeQuery.data.customFields),
        notes: employeeQuery.data.notes,
      });
    }
  }, [employeeQuery.data, methods]);

  const mutation = useMutation({
    mutationFn: (payload: EmployeePayload) => (mode === 'create' ? employeesApi.create(payload) : employeesApi.update(id as string, payload)),
    onSuccess: () => {
      toast.success(mode === 'create' ? 'Đã tạo nhân viên' : 'Đã cập nhật nhân viên');
      router.push('/dashboard/hr/employees');
      router.refresh();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const tags = methods.watch('tags') ?? [];

  return (
    <FormProvider {...methods}>
      <div className="stack">
        <PageHeader title={mode === 'create' ? 'Thêm nhân viên' : 'Chỉnh sửa nhân viên'} description="Quản lý hồ sơ nhân sự cốt lõi mà chưa gắn với chấm công hay bảng lương." />
        <Card>
          <CardHeader title="Hồ sơ nhân viên" description="Biểu mẫu này bám theo schema HRM hiện tại mà backend đang cung cấp." />
          <form className="stack" onSubmit={methods.handleSubmit((values) => {
            try {
              const payload: EmployeePayload = {
                employeeCode: values.employeeCode,
                fullName: values.fullName,
                email: values.email,
                phone: values.phone,
                gender: values.gender,
                dateOfBirth: values.dateOfBirth || undefined,
                nationalId: values.nationalId,
                address: values.address,
                branchId: values.branchId || undefined,
                orgUnitId: values.orgUnitId || undefined,
                positionId: values.positionId || undefined,
                managerEmployeeId: values.managerEmployeeId || undefined,
                employmentType: values.employmentType,
                workStatus: values.workStatus,
                hireDate: values.hireDate || undefined,
                leaveDate: values.leaveDate || undefined,
                tags: values.tags ?? [],
                emergencyContacts: values.emergencyContacts ?? [],
                customFields: safeParseJson(values.customFieldsText || '{}'),
                notes: values.notes,
              };
              mutation.mutate(payload);
            } catch (error) {
              toast.error(error instanceof Error ? error.message : 'JSON của trường tùy chỉnh không hợp lệ');
            }
          })}>
            <div className="form-grid three-cols">
              <FormField label="Mã nhân viên"><Input {...methods.register('employeeCode', { required: 'Mã nhân viên là bắt buộc' })} /></FormField>
              <FormField label="Họ và tên"><Input {...methods.register('fullName', { required: 'Họ và tên là bắt buộc' })} /></FormField>
              <FormField label="Giới tính"><Select {...methods.register('gender')}><option value="">Không xác định</option><option value="male">Nam</option><option value="female">Nữ</option><option value="other">Khác</option></Select></FormField>
              <FormField label="Email"><Input type="email" {...methods.register('email')} /></FormField>
              <FormField label="Số điện thoại"><Input {...methods.register('phone')} /></FormField>
              <FormField label="Ngày sinh"><Input type="date" {...methods.register('dateOfBirth')} /></FormField>
              <FormField label="CCCD/CMND"><Input {...methods.register('nationalId')} /></FormField>
              <FormField label="Loại hình làm việc"><Input placeholder="full_time / contract / owner" {...methods.register('employmentType')} /></FormField>
              <FormField label="Trạng thái làm việc"><Select {...methods.register('workStatus')}><option value="active">Đang làm việc</option><option value="inactive">Ngừng hoạt động</option><option value="on_leave">Đang nghỉ phép</option><option value="resigned">Đã nghỉ việc</option></Select></FormField>
              <FormField label="Ngày vào làm"><Input type="date" {...methods.register('hireDate')} /></FormField>
              <FormField label="Ngày nghỉ việc"><Input type="date" {...methods.register('leaveDate')} /></FormField>
              <FormField label="Chi nhánh"><Select {...methods.register('branchId')}><option value="">Không có</option>{(branchesQuery.data?.items ?? []).map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</Select></FormField>
              <FormField label="Đơn vị tổ chức"><Select {...methods.register('orgUnitId')}><option value="">Không có</option>{(orgUnitsQuery.data?.items ?? []).map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</Select></FormField>
              <FormField label="Chức danh"><Select {...methods.register('positionId')}><option value="">Không có</option>{(positionsQuery.data?.items ?? []).map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</Select></FormField>
              <FormField label="Quản lý"><Select {...methods.register('managerEmployeeId')}><option value="">Không có</option>{(managersQuery.data?.items ?? []).filter((item) => item._id !== id).map((item) => <option key={item._id} value={item._id}>{item.fullName}</option>)}</Select></FormField>
            </div>
            <FormField label="Địa chỉ"><Input {...methods.register('address')} /></FormField>
            <FormField label="Nhãn" description="Dùng nhãn để phân nhóm nhanh như remote, senior, probation hoặc sales-team."><MultiValueInput values={tags} onChange={(next) => methods.setValue('tags', next, { shouldDirty: true })} placeholder="Nhập nhãn rồi nhấn Enter" /></FormField>
            <EmergencyContactsField />
            <FormField label="Trường tùy chỉnh JSON"><Textarea {...methods.register('customFieldsText')} /></FormField>
            <FormField label="Ghi chú"><Textarea {...methods.register('notes')} /></FormField>
            <div className="form-actions">
              <Link href="/dashboard/hr/employees" className="button button-secondary">Hủy</Link>
              <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Đang lưu...' : mode === 'create' ? 'Tạo nhân viên' : 'Cập nhật nhân viên'}</Button>
            </div>
          </form>
      </Card>
      </div>
    </FormProvider>
  );
}
