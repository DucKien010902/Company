import { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
}

export function DataTable<T>({ columns, rows }: { columns: Column<T>[]; rows: T[] }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key}>{column.cell(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
