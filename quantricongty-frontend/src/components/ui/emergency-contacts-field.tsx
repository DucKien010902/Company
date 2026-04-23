'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function EmergencyContactsField() {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'emergencyContacts',
  });

  return (
    <div className="list-box">
      <div className="helper-row">
        <strong>Liên hệ khẩn cấp</strong>
        <Button type="button" variant="secondary" onClick={() => append({ name: '', phone: '', relation: '' })}>
          Thêm liên hệ
        </Button>
      </div>
      <div className="segmented">
        {fields.length ? (
          fields.map((field, index) => (
            <div key={field.id} className="list-box-row">
              <div className="grid-2">
                <Input placeholder="Tên" {...register(`emergencyContacts.${index}.name` as const)} />
                <Input placeholder="Số điện thoại" {...register(`emergencyContacts.${index}.phone` as const)} />
              </div>
              <div className="helper-row">
                <Input placeholder="Mối quan hệ" {...register(`emergencyContacts.${index}.relation` as const)} />
                <Button type="button" variant="ghost" onClick={() => remove(index)}>
                  Xóa
                </Button>
              </div>
            </div>
          ))
        ) : (
          <span className="kbd-note">Chưa có liên hệ khẩn cấp.</span>
        )}
      </div>
    </div>
  );
}
