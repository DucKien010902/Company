'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, CalendarDays, CheckCircle2, Clock3, UserRoundCheck } from 'lucide-react';
import { attendanceApi } from '@/features/attendance/api';
import { AttendanceDay, AttendanceSlot, AttendanceUser } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader } from '@/components/ui/card';
import { DataTable, Column } from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Select } from '@/components/ui/select';
import { StatCard } from '@/components/ui/stat-card';

const SLOT_ORDER = ['morningIn', 'lunchOut', 'lunchIn', 'eveningOut'] as const;
const FREE_MISS_SESSIONS = 3;

function currentDateRange() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(new Date(year, month + 1, 0).getDate()).padStart(2, '0')}`;
  return { startDate, endDate };
}

function displayUser(user?: AttendanceUser) {
  if (!user) return 'Chưa chọn';
  return user.Name || user.Badgenumber || `USERID ${user.USERID}`;
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatDateLabel(date: string) {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

function SlotPill({ slot }: { slot: AttendanceSlot }) {
  const slotClass = slot.valid
    ? 'attendance-slot attendance-slot-ok'
    : slot.time
      ? 'attendance-slot attendance-slot-bad'
      : 'attendance-slot attendance-slot-empty';

  return (
    <span className={slotClass}>
      <strong>{slot.time || 'Không có'}</strong>
    </span>
  );
}

function DayStatus({ day }: { day: AttendanceDay }) {
  if (day.status === 'noData') return <Badge>Không có dữ liệu</Badge>;
  if (day.status === 'complete') return <Badge tone="success">Đủ ca</Badge>;
  if (day.status === 'partial') return <Badge tone="warning">Miss 1 buổi</Badge>;
  return <Badge tone="warning">Miss 2 buổi</Badge>;
}

export function AttendancePage() {
  const initialRange = currentDateRange();
  const [startDate, setStartDate] = useState(initialRange.startDate);
  const [endDate, setEndDate] = useState(initialRange.endDate);
  const [selectedUserId, setSelectedUserId] = useState('');

  const usersQuery = useQuery({
    queryKey: ['attendance-users-list'],
    queryFn: () => attendanceApi.users({ page: 1, limit: 500 }),
  });

  const selectedUser = usersQuery.data?.items.find((user) => String(user.USERID) === selectedUserId);

  const dailyQuery = useQuery({
    enabled: Boolean(selectedUserId && startDate && endDate),
    queryKey: ['attendance-daily-range', startDate, endDate, selectedUserId],
    queryFn: () => attendanceApi.daily({ startDate, endDate, userId: Number(selectedUserId) }),
  });

  const summary = useMemo(() => {
    const days = dailyQuery.data?.days ?? [];
    const daysWithLogs = days.filter((day) => day.rawLogs.length > 0);
    const missCount = days.reduce((total, day) => total + day.missCount, 0);
    const chargeableMiss = Math.max(0, missCount - FREE_MISS_SESSIONS);
    const workdays = Math.max(0, daysWithLogs.length - chargeableMiss * 0.5);

    return {
      totalDays: days.length,
      daysWithLogs: daysWithLogs.length,
      missCount,
      freeMiss: Math.min(missCount, FREE_MISS_SESSIONS),
      chargeableMiss,
      workdays,
      completeDays: days.filter((day) => day.status === 'complete').length,
      partialDays: days.filter((day) => day.status === 'partial').length,
      missingDays: days.filter((day) => day.status === 'missing').length,
    };
  }, [dailyQuery.data]);

  const dayColumns: Column<AttendanceDay>[] = [
    { key: 'date', header: 'Ngày', cell: (row) => <strong>{formatDateLabel(row.date)}</strong> },
    { key: 'morningIn', header: 'Vào sáng', cell: (row) => <SlotPill slot={row.slots.morningIn} /> },
    { key: 'lunchOut', header: 'Ra trưa', cell: (row) => <SlotPill slot={row.slots.lunchOut} /> },
    { key: 'lunchIn', header: 'Vào chiều', cell: (row) => <SlotPill slot={row.slots.lunchIn} /> },
    { key: 'eveningOut', header: 'Về chiều', cell: (row) => <SlotPill slot={row.slots.eveningOut} /> },
    { key: 'extra', header: 'Chấm thừa', cell: (row) => row.extraLogs.length || '-' },
    { key: 'status', header: 'Kết quả', cell: (row) => <DayStatus day={row} /> },
  ];

  return (
    <div className="stack attendance-page">
      <PageHeader
        title="Chấm công"
        description="Chọn nhân viên và khoảng ngày cần xem. Hệ thống chỉ tải dữ liệu sau khi đã chọn đủ bộ lọc."
      />

      <Card>
        <CardHeader
          title="Bộ lọc"
          description="Dữ liệu lấy trực tiếp từ collection user-attendance và attendance-data."
        />
        <div className="attendance-filter-panel">
          <div className="field">
            <label className="field-label">Nhân viên chấm công</label>
            <Select value={selectedUserId} onChange={(event) => setSelectedUserId(event.target.value)}>
              <option value="">Chọn nhân viên</option>
              {usersQuery.data?.items.map((user) => (
                <option key={user._id || user.USERID} value={user.USERID}>
                  {displayUser(user)} - Mã {user.Badgenumber || '-'}
                </option>
              ))}
            </Select>
            {usersQuery.isPending ? <span className="field-description">Đang tải danh sách nhân viên...</span> : null}
          </div>
          <div className="field">
            <label className="field-label">Từ ngày</label>
            <Input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
          </div>
          <div className="field">
            <label className="field-label">Đến ngày</label>
            <Input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
          </div>
        </div>
      </Card>

      {!selectedUserId ? (
        <EmptyState title="Chưa chọn nhân viên" description="Chọn một nhân viên trong danh sách để xem lịch sử từng ca, buổi miss và tổng công." />
      ) : null}

      {selectedUserId ? (
        <div className="stats-grid">
          <StatCard label="Nhân viên" value={displayUser(selectedUser)} icon={<UserRoundCheck className="icon" />} />
          <StatCard label="Tổng công" value={formatNumber(summary.workdays)} icon={<CalendarDays className="icon" />} />
          <StatCard label="Buổi miss" value={summary.missCount} icon={<Clock3 className="icon" />} />
          <StatCard label="Bị trừ công" value={`${summary.chargeableMiss} buổi`} icon={<AlertTriangle className="icon" />} />
        </div>
      ) : null}

      {selectedUserId ? (
        <Card>
          <CardHeader
            title={`Tổng hợp ${formatDateLabel(startDate)} - ${formatDateLabel(endDate)}`}
            description="3 buổi miss đầu tiên chỉ cảnh báo màu đỏ, chưa trừ công. Từ buổi miss thứ 4 mới trừ 0.5 công mỗi buổi."
          />
          <div className="attendance-summary-grid">
            <div><span>Ngày trong khoảng</span><strong>{summary.totalDays}</strong></div>
            <div><span>Ngày có dữ liệu</span><strong>{summary.daysWithLogs}</strong></div>
            <div><span>Ngày đủ ca</span><strong>{summary.completeDays}</strong></div>
            <div><span>Ngày miss 1 buổi</span><strong>{summary.partialDays}</strong></div>
            <div><span>Ngày miss 2 buổi</span><strong>{summary.missingDays}</strong></div>
            <div><span>Miss được miễn trừ</span><strong>{summary.freeMiss}</strong></div>
          </div>
        </Card>
      ) : null}

      {selectedUserId ? (
        <Card>
          <CardHeader
            title={`Lịch sử từng ca - ${displayUser(selectedUser)}`}
            description="Có chấm nhưng sai khung giờ vẫn hiện giờ chấm và tô đỏ. Chỉ khi không có log nào phù hợp mới hiển thị không có dữ liệu."
          />
          {dailyQuery.isPending ? <div>Đang tải chi tiết chấm công...</div> : null}
          {dailyQuery.data?.days.length ? (
            <>
              <div className="attendance-rule-strip">
                {SLOT_ORDER.map((key) => (
                  <span key={key}>
                    <CheckCircle2 className="icon" />
                    {dailyQuery.data?.days[0]?.slots[key].label}
                  </span>
                ))}
              </div>
              <DataTable columns={dayColumns} rows={dailyQuery.data.days} />
            </>
          ) : null}
        </Card>
      ) : null}
    </div>
  );
}
