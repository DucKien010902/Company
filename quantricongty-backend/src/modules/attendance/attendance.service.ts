import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AttendanceData,
  AttendanceDataDocument,
} from './schemas/attendance-data.schema';
import {
  UserAttendance,
  UserAttendanceDocument,
} from './schemas/user-attendance.schema';
import {
  AttendanceDailyQueryDto,
  AttendanceMonthlyQueryDto,
  AttendanceUsersQueryDto,
} from './dto/attendance-query.dto';

type AttendanceUserLean = UserAttendance & { _id?: unknown };
type AttendanceLogLean = AttendanceData & { _id?: unknown };
type SlotKey = 'morningIn' | 'lunchOut' | 'lunchIn' | 'eveningOut';
type SessionKey = 'morning' | 'afternoon';

export interface SlotResult {
  key: SlotKey;
  label: string;
  valid: boolean;
  time?: string;
  checkTime?: Date;
  reason?: string;
}

export interface DayResult {
  date: string;
  userId: number;
  user?: AttendanceUserLean;
  slots: Record<SlotKey, SlotResult>;
  extraLogs: AttendanceLogLean[];
  missSessions: SessionKey[];
  missCount: number;
  workday: number;
  status: 'complete' | 'partial' | 'missing' | 'noData';
  rawLogs: AttendanceLogLean[];
}

const SLOT_LABELS: Record<SlotKey, string> = {
  morningIn: 'Vào sáng',
  lunchOut: 'Ra trưa',
  lunchIn: 'Vào chiều',
  eveningOut: 'Về chiều',
};

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(UserAttendance.name)
    private readonly userModel: Model<UserAttendanceDocument>,
    @InjectModel(AttendanceData.name)
    private readonly logModel: Model<AttendanceDataDocument>,
  ) {}

  async findUsers(query: AttendanceUsersQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const filter = this.buildUserFilter(query.search);

    const [items, total] = await Promise.all([
      this.userModel
        .find(filter)
        .sort({ USERID: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.userModel.countDocuments(filter),
    ]);

    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getMonthly(query: AttendanceMonthlyQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    this.getMonthRange(query.month);
    const userFilter = this.buildUserFilter(query.search);

    const [users, total] = await Promise.all([
      this.userModel
        .find(userFilter)
        .sort({ USERID: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.userModel.countDocuments(userFilter),
    ]);

    const userIds = users.map((user) => user.USERID);
    const logs = userIds.length
      ? await this.logModel
          .find({
            USERID: { $in: userIds },
            CHECK_DATE: { $regex: `^${query.month}` },
          })
          .sort({ USERID: 1, CHECKTIME: 1 })
          .lean()
      : [];

    const logsByUser = this.groupLogsByUser(logs);

    const items = users.map((user) => {
      const days = this.buildUserMonthDays(user, logsByUser.get(user.USERID) ?? [], query.month);
      const daysWithLogs = days.filter((day) => day.rawLogs.length > 0);
      const missCount = days.reduce((totalMiss, day) => totalMiss + day.missCount, 0);
      const workdays = days.reduce((totalWork, day) => totalWork + day.workday, 0);

      return {
        user,
        month: query.month,
        totalDays: days.length,
        daysWithLogs: daysWithLogs.length,
        workdays,
        missCount,
        exceededMonthlyMissLimit: missCount > 3,
        completeDays: days.filter((day) => day.status === 'complete').length,
        partialDays: days.filter((day) => day.status === 'partial').length,
        missingDays: days.filter((day) => day.status === 'missing' && day.rawLogs.length > 0).length,
      };
    });

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getDaily(query: AttendanceDailyQueryDto) {
    if (!query.userId) {
      throw new BadRequestException('userId is required');
    }

    const range = this.getDateRange(query);
    const [user, logs] = await Promise.all([
      this.userModel.findOne({ USERID: query.userId }).lean(),
      this.logModel
        .find({
          USERID: query.userId,
          CHECK_DATE: { $gte: range.startDate, $lte: range.endDate },
        })
        .sort({ CHECKTIME: 1 })
        .lean(),
    ]);

    return {
      user,
      month: range.month,
      startDate: range.startDate,
      endDate: range.endDate,
      days: this.buildUserRangeDays(user ?? undefined, logs, range.startDate, range.endDate),
    };
  }

  private buildUserFilter(search?: string): Record<string, unknown> {
    const keyword = search?.trim();
    if (!keyword) return {};

    const conditions: Record<string, unknown>[] = [
      { Badgenumber: { $regex: keyword, $options: 'i' } },
      { Name: { $regex: keyword, $options: 'i' } },
    ];

    const numericKeyword = Number(keyword);
    if (Number.isFinite(numericKeyword)) {
      conditions.push({ USERID: numericKeyword });
    }

    return { $or: conditions };
  }

  private getMonthRange(month: string) {
    const [year, monthNumber] = month.split('-').map(Number);
    if (!year || !monthNumber || monthNumber < 1 || monthNumber > 12) {
      throw new BadRequestException('month must use YYYY-MM format');
    }

    return {
      startDate: new Date(year, monthNumber - 1, 1, 0, 0, 0, 0),
      endDate: new Date(year, monthNumber, 1, 0, 0, 0, 0),
      year,
      monthNumber,
    };
  }

  private buildUserMonthDays(
    user: AttendanceUserLean | undefined,
    logs: AttendanceLogLean[],
    month: string,
  ): DayResult[] {
    const { year, monthNumber } = this.getMonthRange(month);
    const daysInMonth = new Date(year, monthNumber, 0).getDate();
    const logsByDate = this.groupLogsByDate(logs);

    return Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const date = `${month}-${String(day).padStart(2, '0')}`;
      return this.evaluateDay(user, logsByDate.get(date) ?? [], date);
    });
  }

  private buildUserRangeDays(
    user: AttendanceUserLean | undefined,
    logs: AttendanceLogLean[],
    startDate: string,
    endDate: string,
  ): DayResult[] {
    const logsByDate = this.groupLogsByDate(logs);
    const days: DayResult[] = [];
    const cursor = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);

    while (cursor <= end) {
      const date = this.formatDate(cursor);
      days.push(this.evaluateDay(user, logsByDate.get(date) ?? [], date));
      cursor.setDate(cursor.getDate() + 1);
    }

    return days;
  }

  private evaluateDay(
    user: AttendanceUserLean | undefined,
    logs: AttendanceLogLean[],
    date: string,
  ): DayResult {
    const sortedLogs = [...logs].sort(
      (a, b) => new Date(a.CHECKTIME).getTime() - new Date(b.CHECKTIME).getTime(),
    );
    const used = new Set<AttendanceLogLean>();

    if (!sortedLogs.length) {
      const emptySlots = {
        morningIn: this.emptySlot('morningIn'),
        lunchOut: this.emptySlot('lunchOut'),
        lunchIn: this.emptySlot('lunchIn'),
        eveningOut: this.emptySlot('eveningOut'),
      };

      return {
        date,
        userId: user?.USERID ?? 0,
        user,
        slots: emptySlots,
        extraLogs: [],
        missSessions: [],
        missCount: 0,
        workday: 0,
        status: 'noData',
        rawLogs: [],
      };
    }

    const morningIn = this.pickSlot(
      sortedLogs,
      used,
      'morningIn',
      (minutes) => minutes <= 8 * 60,
      (minutes) => minutes < 12 * 60,
      'Sai khung trước 08:00',
      'latest',
    );
    const lunchOut = this.pickSlot(
      sortedLogs,
      used,
      'lunchOut',
      (minutes) => minutes >= 12 * 60 && minutes <= 13 * 60,
      (minutes) => minutes > 8 * 60 && minutes <= 13 * 60,
      'Sai khung 12:00-13:00',
      'earliest',
    );
    const lunchIn = this.pickSlot(
      sortedLogs,
      used,
      'lunchIn',
      (minutes) => minutes >= 12 * 60 && minutes <= 13 * 60,
      (minutes) => minutes >= 12 * 60 && minutes < 17 * 60,
      'Sai khung 12:00-13:00',
      'latest',
    );
    const eveningOut = this.pickSlot(
      sortedLogs,
      used,
      'eveningOut',
      (minutes) => minutes >= 17 * 60,
      (minutes) => minutes >= 13 * 60,
      'Sai khung sau 17:00',
      'latest',
    );

    const slots = { morningIn, lunchOut, lunchIn, eveningOut };
    const missSessions: SessionKey[] = [];
    if (!morningIn.valid || !lunchOut.valid) missSessions.push('morning');
    if (!lunchIn.valid || !eveningOut.valid) missSessions.push('afternoon');

    const missCount = missSessions.length;
    const workday = 1 - missCount * 0.5;
    const extraLogs = sortedLogs.filter((log) => !used.has(log));

    return {
      date,
      userId: user?.USERID ?? sortedLogs[0]?.USERID ?? 0,
      user,
      slots,
      extraLogs,
      missSessions,
      missCount,
      workday,
      status: missCount === 0 ? 'complete' : missCount === 1 ? 'partial' : 'missing',
      rawLogs: sortedLogs,
    };
  }

  private pickSlot(
    logs: AttendanceLogLean[],
    used: Set<AttendanceLogLean>,
    key: SlotKey,
    validPredicate: (minutes: number) => boolean,
    fallbackPredicate: (minutes: number) => boolean,
    invalidReason: string,
    strategy: 'earliest' | 'latest',
  ): SlotResult {
    const validCandidates = logs.filter((log) => !used.has(log) && validPredicate(this.getMinutes(log)));
    const fallbackCandidates = logs.filter((log) => !used.has(log) && fallbackPredicate(this.getMinutes(log)));
    const selected = this.selectByStrategy(validCandidates.length ? validCandidates : fallbackCandidates, strategy);
    if (selected) used.add(selected);
    return this.toSlot(key, selected, (log) => validPredicate(this.getMinutes(log)), invalidReason);
  }

  private selectByStrategy(logs: AttendanceLogLean[], strategy: 'earliest' | 'latest') {
    return strategy === 'latest' ? logs.at(-1) : logs[0];
  }

  private toSlot(
    key: SlotKey,
    log: AttendanceLogLean | undefined,
    validPredicate: (log: AttendanceLogLean) => boolean,
    invalidReason: string,
  ): SlotResult {
    if (!log) return this.emptySlot(key);
    const valid = validPredicate(log);

    return {
      key,
      label: SLOT_LABELS[key],
      valid,
      time: this.formatTime(log),
      checkTime: log.CHECKTIME ? new Date(log.CHECKTIME) : undefined,
      reason: valid ? undefined : invalidReason,
    };
  }

  private emptySlot(key: SlotKey): SlotResult {
    return {
      key,
      label: SLOT_LABELS[key],
      valid: false,
      reason: 'Không có dữ liệu',
    };
  }

  private getMinutes(log: AttendanceLogLean) {
    if (log.CHECK_TIME) {
      const [hour, minute] = log.CHECK_TIME.split(':').map(Number);
      return hour * 60 + minute;
    }

    const date = new Date(log.CHECKTIME);
    return date.getHours() * 60 + date.getMinutes();
  }

  private formatTime(log: AttendanceLogLean) {
    if (log.CHECK_TIME) return log.CHECK_TIME;
    return new Date(log.CHECKTIME).toTimeString().slice(0, 8);
  }

  private groupLogsByUser(logs: AttendanceLogLean[]) {
    const map = new Map<number, AttendanceLogLean[]>();
    logs.forEach((log) => {
      const items = map.get(log.USERID) ?? [];
      items.push(log);
      map.set(log.USERID, items);
    });
    return map;
  }

  private groupLogsByDate(logs: AttendanceLogLean[]) {
    const map = new Map<string, AttendanceLogLean[]>();
    logs.forEach((log) => {
      const date = log.CHECK_DATE ?? new Date(log.CHECKTIME).toISOString().slice(0, 10);
      const items = map.get(date) ?? [];
      items.push(log);
      map.set(date, items);
    });
    return map;
  }

  private getDateRange(query: AttendanceDailyQueryDto) {
    if (query.startDate && query.endDate) {
      if (query.startDate > query.endDate) {
        throw new BadRequestException('startDate must be before or equal to endDate');
      }

      return {
        startDate: query.startDate,
        endDate: query.endDate,
        month: query.startDate.slice(0, 7),
      };
    }

    if (!query.month) {
      throw new BadRequestException('month or startDate/endDate is required');
    }

    const { year, monthNumber } = this.getMonthRange(query.month);
    return {
      startDate: `${query.month}-01`,
      endDate: `${query.month}-${String(new Date(year, monthNumber, 0).getDate()).padStart(2, '0')}`,
      month: query.month,
    };
  }

  private formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
