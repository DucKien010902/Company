'use client';

import { PERMISSION_GROUPS } from '@/lib/permissions';

export function PermissionPicker({
  value,
  onChange,
}: {
  value: string[];
  onChange: (value: string[]) => void;
}) {
  function toggle(permission: string) {
    if (value.includes(permission)) {
      onChange(value.filter((item) => item !== permission));
      return;
    }
    onChange([...value, permission]);
  }

  return (
    <div className="stack">
      {PERMISSION_GROUPS.map((group) => (
        <div className="list-box" key={group.label}>
          <strong>{group.label}</strong>
          <div className="checkbox-grid" style={{ marginTop: 12 }}>
            {group.items.map((permission) => (
              <label key={permission} className="checkbox-card">
                <input type="checkbox" checked={value.includes(permission)} onChange={() => toggle(permission)} />{' '}
                {permission}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
