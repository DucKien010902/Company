'use client';

import { useQuery } from '@tanstack/react-query';
import { Activity, Building2, ContactRound, Shield, Sparkles, UserCircle2, Users, Waypoints } from 'lucide-react';
import { rolesApi } from '@/features/roles/api';
import { branchesApi, orgUnitsApi, positionsApi } from '@/features/org/api';
import { employeesApi } from '@/features/employees/api';
import { partiesApi, contactsApi } from '@/features/crm/api';
import { auditApi } from '@/features/audit/api';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader } from '@/components/ui/card';
import { formatDateTime } from '@/lib/utils';

function compactNumber(value: number) {
  // Chuyển sang định dạng tiếng Việt (vi-VN) để hiển thị số chuẩn
  return new Intl.NumberFormat('vi-VN', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

export function DashboardOverview() {
  const roles = useQuery({ queryKey: ['overview-roles'], queryFn: () => rolesApi.list({ page: 1, limit: 1 }) });
  const branches = useQuery({ queryKey: ['overview-branches'], queryFn: () => branchesApi.list({ page: 1, limit: 1 }) });
  const orgUnits = useQuery({ queryKey: ['overview-org-units'], queryFn: () => orgUnitsApi.list({ page: 1, limit: 1 }) });
  const positions = useQuery({ queryKey: ['overview-positions'], queryFn: () => positionsApi.list({ page: 1, limit: 1 }) });
  const employees = useQuery({ queryKey: ['overview-employees'], queryFn: () => employeesApi.list({ page: 1, limit: 1 }) });
  const parties = useQuery({ queryKey: ['overview-parties'], queryFn: () => partiesApi.list({ page: 1, limit: 1 }) });
  const contacts = useQuery({ queryKey: ['overview-contacts'], queryFn: () => contactsApi.list({ page: 1, limit: 1 }) });
  const audit = useQuery({ queryKey: ['overview-audit'], queryFn: () => auditApi.list(8) });

  const roleCount = roles.data?.meta.total ?? 0;
  const branchCount = branches.data?.meta.total ?? 0;
  const orgUnitCount = orgUnits.data?.meta.total ?? 0;
  const positionCount = positions.data?.meta.total ?? 0;
  const employeeCount = employees.data?.meta.total ?? 0;
  const partyCount = parties.data?.meta.total ?? 0;
  const contactCount = contacts.data?.meta.total ?? 0;

  const coreTotal = roleCount + branchCount + orgUnitCount + positionCount + employeeCount + partyCount + contactCount;
  const operationsMix = [
    { label: 'Nhân sự', value: employeeCount, tone: 'var(--primary)' },
    { label: 'Đối tác', value: partyCount, tone: '#f97316' },
    { label: 'Liên hệ', value: contactCount, tone: '#14b8a6' },
    { label: 'Chi nhánh', value: branchCount, tone: '#8b5cf6' },
  ];

  const totalMix = operationsMix.reduce((sum, item) => sum + item.value, 0) || 1;
  const activityCount = audit.data?.length ?? 0;
  const activityRatio = Math.min(360, Math.max(24, activityCount * 32));

  const insightCards = [
    {
      label: 'Phân quyền',
      value: compactNumber(roleCount),
      note: 'Vai trò sẵn sàng cho IAM',
      icon: <Shield className="icon" />,
      tone: 'blue',
    },
    {
      label: 'Cấu trúc tổ chức',
      value: compactNumber(branchCount + orgUnitCount + positionCount),
      note: 'Chi nhánh, đơn vị & chức danh',
      icon: <Waypoints className="icon" />,
      tone: 'amber',
    },
    {
      label: 'Nhân lực',
      value: compactNumber(employeeCount),
      note: 'Hồ sơ nhân viên đang quản lý',
      icon: <UserCircle2 className="icon" />,
      tone: 'teal',
    },
    {
      label: 'Dữ liệu CRM',
      value: compactNumber(partyCount + contactCount),
      note: 'Đối tác & đầu mối liên hệ',
      icon: <Users className="icon" />,
      tone: 'violet',
    },
  ];

  return (
    <div className="dashboard-overview">
      <PageHeader
        title="Bảng điều khiển"
        description="Toàn cảnh trực quan về cơ cấu vận hành, nhân sự, CRM và dòng chảy hoạt động mới nhất."
      />

      <section className="overview-hero">
        <div className="overview-hero-copy">
          <span className="overview-kicker">
            <Sparkles className="icon" />
            Tổng quan
          </span>
          <h5 className="overview-hero-title text-sm">Trung tâm điều hành tổ chức, quyền truy cập và tăng trưởng nghiệp vụ</h5>
          <p className="overview-hero-text">
            Màn hình này bao gồm các chỉ số cốt lõi, điểm nóng vận hành và biểu đồ phân bổ giúp bạn nắm bắt nhanh tình hình hệ thống mà không cần đi sâu vào từng mô-đun.
          </p>

          <div className="overview-highlight-row">
            <div className="overview-highlight-card">
              <span className="overview-highlight-label">Tổng thực thể quản lý</span>
              <strong className="overview-highlight-value">{compactNumber(coreTotal)}</strong>
            </div>
            <div className="overview-highlight-card">
              <span className="overview-highlight-label">Nhịp hoạt động gần đây</span>
              <strong className="overview-highlight-value">{compactNumber(activityCount)}</strong>
            </div>
          </div>
        </div>

        <div className="overview-hero-visual">
          <div className="overview-orbit-card">
            <div
              className="overview-ring"
              style={{
                background: `conic-gradient(var(--primary) 0deg ${activityRatio}deg, rgba(255,255,255,0.16) ${activityRatio}deg 360deg)`,
              }}
            >
              <div className="overview-ring-center">
                <span>Hoạt động</span>
                <strong>{activityCount}</strong>
              </div>
            </div>

            <div className="overview-mini-stack">
              <div className="overview-mini-card">
                <Building2 className="icon" />
                <div>
                  <span>Chi nhánh</span>
                  <strong>{branchCount}</strong>
                </div>
              </div>
              <div className="overview-mini-card">
                <ContactRound className="icon" />
                <div>
                  <span>Liên hệ</span>
                  <strong>{contactCount}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overview-kpi-grid">
        {insightCards.map((card) => (
          <article key={card.label} className={`overview-kpi-card overview-kpi-${card.tone}`}>
            <div className="overview-kpi-head">
              <span>{card.label}</span>
              <span className="overview-kpi-icon">{card.icon}</span>
            </div>
            <strong className="overview-kpi-value">{card.value}</strong>
            <p className="overview-kpi-note">{card.note}</p>
          </article>
        ))}
      </section>

      <section className="overview-main-grid">
        <Card className="overview-panel overview-chart-panel">
          <CardHeader title="Phân bổ vận hành" description="Tỷ trọng các nhóm dữ liệu chính hiện có trên hệ thống." />
          <div className="overview-bars">
            {operationsMix.map((item) => {
              const width = `${Math.max(8, (item.value / totalMix) * 100)}%`;
              return (
                <div key={item.label} className="overview-bar-row">
                  <div className="overview-bar-meta">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                  <div className="overview-bar-track">
                    <div className="overview-bar-fill" style={{ width, background: item.tone }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="overview-metric-strip">
            <div>
              <span>Đơn vị</span>
              <strong>{orgUnitCount}</strong>
            </div>
            <div>
              <span>Chức danh</span>
              <strong>{positionCount}</strong>
            </div>
            <div>
              <span>Vai trò</span>
              <strong>{roleCount}</strong>
            </div>
          </div>
        </Card>

        <Card className="overview-panel overview-signal-panel">
          <CardHeader title="Tín hiệu nhanh" description="Các điểm nhấn để đánh giá nhanh sức khỏe của hệ thống." />
          <div className="overview-signal-list">
            <div className="overview-signal-item">
              <span className="overview-signal-dot signal-blue" />
              <div>
                <strong>{employeeCount || 0} nhân viên</strong>
                <p>Dữ liệu nhân sự hiện là lớp vận hành lớn nhất.</p>
              </div>
            </div>
            <div className="overview-signal-item">
              <span className="overview-signal-dot signal-amber" />
              <div>
                <strong>{partyCount || 0} đối tác, {contactCount || 0} đầu mối</strong>
                <p>CRM đã sẵn sàng cho việc mở rộng quan hệ khách hàng và nhà cung cấp.</p>
              </div>
            </div>
            <div className="overview-signal-item">
              <span className="overview-signal-dot signal-teal" />
              <div>
                <strong>{roleCount || 0} vai trò mặc định</strong>
                <p>Các quyền này có thể tiếp tục gán vào chức danh và tài khoản người dùng.</p>
              </div>
            </div>
          </div>

          <div className="overview-spark-card">
            <Activity className="icon" />
            <div>
              <span>Dòng kiểm soát</span>
              <strong>{activityCount} sự kiện mới nhất</strong>
            </div>
          </div>
        </Card>
      </section>

      <section className="overview-bottom-grid">
        <Card className="overview-panel">
          <CardHeader title="Phạm vi nền tảng" description="Các miền dữ liệu đã kết nối và sẵn sàng hoạt động." />
          <div className="overview-scope-grid">
            <div className="overview-scope-chip">Công ty & Cấu hình</div>
            <div className="overview-scope-chip">IAM & Vai trò</div>
            <div className="overview-scope-chip">Chi nhánh & Đơn vị</div>
            <div className="overview-scope-chip">Chức danh & Nhân sự</div>
            <div className="overview-scope-chip">CRM Đối tác & Liên hệ</div>
            <div className="overview-scope-chip">Nhật ký hệ thống</div>
          </div>
        </Card>

        <Card className="overview-panel">
          <CardHeader title="Hoạt động gần đây" description="Dòng thời gian từ dữ liệu kiểm soát, ưu tiên thay đổi mới nhất." />
          <div className="overview-timeline">
            {(audit.data ?? []).map((item) => (
              <div key={item._id} className="overview-timeline-item">
                <span className="overview-timeline-dot" />
                <div className="overview-timeline-content">
                  <div className="overview-timeline-top">
                    <strong>{item.action}</strong>
                    <span>{formatDateTime(item.createdAt)}</span>
                  </div>
                  <p>
                    {item.module} / {item.entityName ?? 'Không xác định'}
                  </p>
                </div>
              </div>
            ))}
            {!audit.data?.length ? <div className="muted">Chưa có dữ liệu kiểm soát.</div> : null}
          </div>
        </Card>
      </section>
    </div>
  );
}