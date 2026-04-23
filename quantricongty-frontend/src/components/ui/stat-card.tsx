import { ReactNode } from 'react';

export function StatCard({ label, value, icon }: { label: string; value: string | number; icon?: ReactNode }) {
  return (
    <div className="stat-card">
      <div>
        <p className="stat-label">{label}</p>
        <h3 className="stat-value">{value}</h3>
      </div>
      {icon ? <div className="stat-icon">{icon}</div> : null}
    </div>
  );
}
