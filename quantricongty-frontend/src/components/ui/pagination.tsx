import { PaginationMeta } from '@/types';
import { Button } from '@/components/ui/button';

export function Pagination({ meta, onChange }: { meta: PaginationMeta; onChange: (page: number) => void }) {
  return (
    <div className="pagination">
      <span>
        Trang {meta.page} / {meta.totalPages || 1} - {meta.total} bản ghi
      </span>
      <div className="pagination-actions">
        <Button variant="secondary" disabled={meta.page <= 1} onClick={() => onChange(meta.page - 1)}>
          Trước
        </Button>
        <Button variant="secondary" disabled={meta.page >= meta.totalPages} onClick={() => onChange(meta.page + 1)}>
          Sau
        </Button>
      </div>
    </div>
  );
}
