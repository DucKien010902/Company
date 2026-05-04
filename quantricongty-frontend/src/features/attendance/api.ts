import {
  AttendanceDailyResponse,
  AttendanceMonthlySummary,
  AttendanceUser,
  PaginatedResponse,
} from '@/types';
import { requestJson } from '@/lib/api-client';

export interface AttendanceQuery {
  month?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  search?: string;
  userId?: number;
}

function buildAttendancePath(path: string, query: AttendanceQuery) {
  const url = new URL(path, 'http://local.internal');
  if (query.month) url.searchParams.set('month', query.month);
  if (query.startDate) url.searchParams.set('startDate', query.startDate);
  if (query.endDate) url.searchParams.set('endDate', query.endDate);
  if (query.page) url.searchParams.set('page', String(query.page));
  if (query.limit) url.searchParams.set('limit', String(query.limit));
  if (query.search) url.searchParams.set('search', query.search);
  if (query.userId) url.searchParams.set('userId', String(query.userId));
  return `${url.pathname}${url.search}`;
}

export const attendanceApi = {
  monthly(query: AttendanceQuery) {
    return requestJson<PaginatedResponse<AttendanceMonthlySummary>>(
      buildAttendancePath('/api/proxy/attendance/monthly', query),
    );
  },
  daily(query: AttendanceQuery) {
    return requestJson<AttendanceDailyResponse>(
      buildAttendancePath('/api/proxy/attendance/daily', query),
    );
  },
  users(query: Omit<AttendanceQuery, 'month' | 'startDate' | 'endDate'>) {
    const url = new URL('/api/proxy/attendance/users', 'http://local.internal');
    if (query.page) url.searchParams.set('page', String(query.page));
    if (query.limit) url.searchParams.set('limit', String(query.limit));
    if (query.search) url.searchParams.set('search', query.search);
    return requestJson<PaginatedResponse<AttendanceUser>>(`${url.pathname}${url.search}`);
  },
};
