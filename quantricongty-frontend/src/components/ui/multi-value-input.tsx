'use client';

import { KeyboardEvent, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function MultiValueInput({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState('');

  function commit() {
    const next = draft.trim();
    if (!next) return;
    if (values.includes(next)) {
      setDraft('');
      return;
    }
    onChange([...values, next]);
    setDraft('');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      commit();
    }
  }

  return (
    <div className="stack">
      <div className="helper-row">
        <Input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={handleKeyDown} placeholder={placeholder} />
        <Button type="button" variant="secondary" onClick={commit}>
          Thêm
        </Button>
      </div>
      <div className="helper-row" style={{ justifyContent: 'flex-start' }}>
        {values.length ? (
          values.map((value) => (
            <button key={value} type="button" className="button button-ghost" onClick={() => onChange(values.filter((item) => item !== value))}>
              <Badge>{value}</Badge>
            </button>
          ))
        ) : (
          <span className="kbd-note">Chưa có giá trị nào được thêm.</span>
        )}
      </div>
    </div>
  );
}
