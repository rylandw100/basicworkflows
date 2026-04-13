/** Synthetic option id for "On a set schedule" trigger configuration */
export const SET_SCHEDULE_OPTION_ID = "set-schedule-config";
export const SET_SCHEDULE_ITEM_ID = "set-schedule-root";

export type ScheduleRepeatKind =
  | "dont-repeat"
  | "daily"
  | "every-weekday"
  | "weekly"
  | "biweekly"
  | "monthly-day"
  | "monthly-occurrence"
  | "monthly-last-day"
  | "monthly-second-to-last-day"
  | "quarterly-day"
  | "quarterly-occurrence"
  | "quarterly-last-day"
  | "quarterly-second-to-last-day"
  | "annually"
  | "custom";

export type CustomCadence = "days" | "weeks" | "months";

const WEEKDAYS_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const ORDINAL_WORDS = ["first", "second", "third", "fourth", "fifth"] as const;

export function formatDateYYYYMMDD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Next clock hour in local time, as HH:mm for <input type="time" /> */
export function formatNextHourRoundedLocal(now: Date = new Date()): string {
  const next = new Date(now);
  next.setMinutes(0, 0, 0);
  if (next <= now) {
    next.setHours(next.getHours() + 1);
  }
  const h = String(next.getHours()).padStart(2, "0");
  const m = String(next.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export function parseLocalDateTime(dateStr: string, timeStr: string): Date | null {
  if (!dateStr || !timeStr) return null;
  const [y, mo, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  if ([y, mo, d, hh, mm].some((n) => Number.isNaN(n))) return null;
  return new Date(y, mo - 1, d, hh, mm, 0, 0);
}

/** True if the calendar day is the last day of its month (local date parts). */
export function isLastDayOfMonthDate(d: Date): boolean {
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  return d.getDate() === last;
}

/** True if the calendar day is the second-to-last day of its month (local date parts). */
export function isSecondToLastDayOfMonthDate(d: Date): boolean {
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  return last >= 2 && d.getDate() === last - 1;
}

function weekdayLong(d: Date): string {
  return WEEKDAYS_LONG[d.getDay()];
}

/** 1-based: which occurrence of this weekday in the month (e.g. 3rd Monday → 3) */
export function weekdayOccurrenceInMonth(d: Date): number {
  const wd = d.getDay();
  let count = 0;
  for (let day = 1; day <= d.getDate(); day++) {
    const t = new Date(d.getFullYear(), d.getMonth(), day);
    if (t.getDay() === wd) count++;
  }
  return count;
}

/** Nth weekday in month, or last such weekday if fewer than n exist */
function nthWeekdayInMonth(year: number, month: number, weekday: number, n: number): Date | null {
  let count = 0;
  let lastMatch: Date | null = null;
  const last = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= last; day++) {
    const dt = new Date(year, month, day);
    if (dt.getDay() === weekday) {
      count++;
      lastMatch = dt;
      if (count === n) return dt;
    }
  }
  return lastMatch;
}

function ordinalDayOfMonth(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  let suf = "th";
  if (mod10 === 1 && mod100 !== 11) suf = "st";
  else if (mod10 === 2 && mod100 !== 12) suf = "nd";
  else if (mod10 === 3 && mod100 !== 13) suf = "rd";
  return `${n}${suf}`;
}

export function repeatOptionLabel(kind: ScheduleRepeatKind, anchor: Date): string {
  const wd = weekdayLong(anchor);
  const dom = ordinalDayOfMonth(anchor.getDate());
  const occ = weekdayOccurrenceInMonth(anchor);
  const occWord = ORDINAL_WORDS[Math.min(occ, 5) - 1] ?? "fifth";

  switch (kind) {
    case "dont-repeat":
      return "Don't repeat";
    case "daily":
      return "Daily";
    case "every-weekday":
      return "Every weekday (Monday - Friday)";
    case "weekly":
      return `Weekly on ${wd}`;
    case "biweekly":
      return `Biweekly on ${wd}`;
    case "monthly-day":
      return `Monthly on the ${dom}`;
    case "monthly-occurrence":
      return `Monthly on the ${occWord} ${wd}`;
    case "monthly-last-day":
      return "Monthly on the last day of the month";
    case "monthly-second-to-last-day":
      return "Monthly on the second to last day of the month";
    case "quarterly-day":
      return `Quarterly on the ${dom}`;
    case "quarterly-occurrence":
      return `Quarterly on the ${occWord} ${wd}`;
    case "quarterly-last-day":
      return "Quarterly on the last day of the month";
    case "quarterly-second-to-last-day":
      return "Quarterly on the second to last day of the month";
    case "annually":
      return "Annually";
    case "custom":
      return "Custom schedule";
    default:
      return "";
  }
}

/**
 * Repeat dropdown order:
 * - After the non-monthly cadence options: all standard monthly rows, then month-relative rows.
 * - Then all standard quarterly rows, then quarter-relative rows.
 * Month-/quarter-relative options only appear when the trigger date matches that position in the month.
 */
export function getRepeatKindsForTriggerCalendarDate(anchorCalendar: Date): ScheduleRepeatKind[] {
  const last = isLastDayOfMonthDate(anchorCalendar);
  const penultimate = isSecondToLastDayOfMonthDate(anchorCalendar);

  const monthlyStandard: ScheduleRepeatKind[] = ["monthly-day", "monthly-occurrence"];
  const monthlyRelativeToMonthEnd: ScheduleRepeatKind[] = [];
  if (penultimate) monthlyRelativeToMonthEnd.push("monthly-second-to-last-day");
  if (last) monthlyRelativeToMonthEnd.push("monthly-last-day");

  const quarterlyStandard: ScheduleRepeatKind[] = ["quarterly-day", "quarterly-occurrence"];
  const quarterlyRelativeToMonthEnd: ScheduleRepeatKind[] = [];
  if (penultimate) quarterlyRelativeToMonthEnd.push("quarterly-second-to-last-day");
  if (last) quarterlyRelativeToMonthEnd.push("quarterly-last-day");

  return [
    "dont-repeat",
    "daily",
    "every-weekday",
    "weekly",
    "biweekly",
    ...monthlyStandard,
    ...monthlyRelativeToMonthEnd,
    ...quarterlyStandard,
    ...quarterlyRelativeToMonthEnd,
    "annually",
    "custom",
  ];
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function addWeeks(d: Date, n: number): Date {
  return addDays(d, n * 7);
}

function addMonthsKeepTime(d: Date, n: number): Date {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n);
  return x;
}

function addYearsKeepTime(d: Date, n: number): Date {
  const x = new Date(d);
  x.setFullYear(x.getFullYear() + n);
  return x;
}

/** Next Mon–Fri strictly after `anchor` calendar day (compare dates at noon to avoid DST edge). */
function nextWeekdayAfter(anchor: Date): Date {
  const base = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate(), 12, 0, 0, 0);
  let d = addDays(base, 1);
  while (d.getDay() === 0 || d.getDay() === 6) {
    d = addDays(d, 1);
  }
  const out = new Date(anchor);
  out.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
  return out;
}

function withSameTime(targetDay: Date, source: Date): Date {
  return new Date(
    targetDay.getFullYear(),
    targetDay.getMonth(),
    targetDay.getDate(),
    source.getHours(),
    source.getMinutes(),
    source.getSeconds(),
    source.getMilliseconds()
  );
}

function nextMonthlyOccurrence(anchor: Date): Date | null {
  const wd = anchor.getDay();
  const n = weekdayOccurrenceInMonth(anchor);
  let y = anchor.getFullYear();
  let m = anchor.getMonth() + 1;
  if (m > 11) {
    m = 0;
    y++;
  }
  const hit = nthWeekdayInMonth(y, m, wd, n);
  return hit ? withSameTime(hit, anchor) : null;
}

function nextQuarterlyOccurrence(anchor: Date): Date | null {
  const wd = anchor.getDay();
  const n = weekdayOccurrenceInMonth(anchor);
  let y = anchor.getFullYear();
  let m = anchor.getMonth() + 3;
  while (m > 11) {
    m -= 12;
    y++;
  }
  const hit = nthWeekdayInMonth(y, m, wd, n);
  return hit ? withSameTime(hit, anchor) : null;
}

/** Next occurrence: last calendar day of the following month, same local time. */
function nextMonthlyLastDay(anchor: Date): Date {
  let y = anchor.getFullYear();
  let m = anchor.getMonth() + 1;
  if (m > 11) {
    m = 0;
    y++;
  }
  const lastD = new Date(y, m + 1, 0).getDate();
  return new Date(y, m, lastD, anchor.getHours(), anchor.getMinutes(), 0, 0);
}

/** Next occurrence: last calendar day of the month three months ahead, same local time. */
function nextQuarterlyLastDay(anchor: Date): Date {
  let y = anchor.getFullYear();
  let m = anchor.getMonth() + 3;
  while (m > 11) {
    m -= 12;
    y++;
  }
  const lastD = new Date(y, m + 1, 0).getDate();
  return new Date(y, m, lastD, anchor.getHours(), anchor.getMinutes(), 0, 0);
}

/** Next occurrence: second-to-last calendar day of the following month, same local time. */
function nextMonthlySecondToLastDay(anchor: Date): Date {
  let y = anchor.getFullYear();
  let m = anchor.getMonth() + 1;
  if (m > 11) {
    m = 0;
    y++;
  }
  const lastD = new Date(y, m + 1, 0).getDate();
  const day = lastD - 1;
  return new Date(y, m, day, anchor.getHours(), anchor.getMinutes(), 0, 0);
}

/** Next occurrence: second-to-last calendar day of the month three months ahead, same local time. */
function nextQuarterlySecondToLastDay(anchor: Date): Date {
  let y = anchor.getFullYear();
  let m = anchor.getMonth() + 3;
  while (m > 11) {
    m -= 12;
    y++;
  }
  const lastD = new Date(y, m + 1, 0).getDate();
  const day = lastD - 1;
  return new Date(y, m, day, anchor.getHours(), anchor.getMinutes(), 0, 0);
}

export function computeNextTriggerDate(args: {
  anchor: Date;
  kind: ScheduleRepeatKind;
  customInterval: number;
  customCadence: CustomCadence;
}): Date | null {
  const { anchor, kind, customInterval, customCadence } = args;

  switch (kind) {
    case "dont-repeat":
      return null;
    case "daily":
      return addDays(anchor, 1);
    case "every-weekday": {
      const next = nextWeekdayAfter(anchor);
      return withSameTime(next, anchor);
    }
    case "weekly":
      return addWeeks(anchor, 1);
    case "biweekly":
      return addWeeks(anchor, 2);
    case "monthly-day":
      return addMonthsKeepTime(anchor, 1);
    case "monthly-occurrence":
      return nextMonthlyOccurrence(anchor);
    case "monthly-last-day":
      return nextMonthlyLastDay(anchor);
    case "monthly-second-to-last-day":
      return nextMonthlySecondToLastDay(anchor);
    case "quarterly-day":
      return addMonthsKeepTime(anchor, 3);
    case "quarterly-occurrence":
      return nextQuarterlyOccurrence(anchor);
    case "quarterly-last-day":
      return nextQuarterlyLastDay(anchor);
    case "quarterly-second-to-last-day":
      return nextQuarterlySecondToLastDay(anchor);
    case "annually":
      return addYearsKeepTime(anchor, 1);
    case "custom": {
      if (!Number.isFinite(customInterval) || customInterval <= 0) return null;
      if (customCadence === "days") return addDays(anchor, customInterval);
      if (customCadence === "weeks") return addWeeks(anchor, customInterval);
      return addMonthsKeepTime(anchor, customInterval);
    }
    default:
      return null;
  }
}

/** e.g. Next: 05/27/2025 at 12:30 AM PST */
export function formatNextLinePacific(next: Date): string {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });
  const parts = dtf.formatToParts(next);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  const month = get("month");
  const day = get("day");
  const year = get("year");
  const hour = get("hour");
  const minute = get("minute");
  const dayPeriod = get("dayPeriod");
  const tz = get("timeZoneName");
  const ampm = dayPeriod ? ` ${dayPeriod}` : "";
  return `Next: ${month}/${day}/${year} at ${hour}:${minute}${ampm} ${tz}`;
}

/** e.g. Next: 03/25/26 — local calendar date per trigger-on context */
export function formatNextLineShortLocal(next: Date): string {
  const s = next.toLocaleDateString("en-US", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
  return `Next: ${s}`;
}
