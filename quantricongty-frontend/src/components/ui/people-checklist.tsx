'use client';

import { RelatedRecord } from '@/types';
import { relationLabel } from '@/lib/utils';

export function PeopleChecklist({
  people,
  value,
  onChange,
}: {
  people: RelatedRecord[];
  value: string[];
  onChange: (value: string[]) => void;
}) {
  function toggle(id: string) {
    if (value.includes(id)) {
      onChange(value.filter((item) => item !== id));
      return;
    }
    onChange([...value, id]);
  }

  return (
    <div className="checkbox-grid">
      {people.map((person) => (
        <label key={person._id} className="checkbox-card">
          <input type="checkbox" checked={value.includes(person._id)} onChange={() => toggle(person._id)} /> {relationLabel(person)}
        </label>
      ))}
    </div>
  );
}
