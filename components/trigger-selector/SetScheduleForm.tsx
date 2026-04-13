"use client";

import { useEffect, useMemo } from "react";
import { ChevronDown, Clock } from "lucide-react";

import {
  type CustomCadence,
  type ScheduleRepeatKind,
  computeNextTriggerDate,
  formatNextLinePacific,
  getRepeatKindsForTriggerCalendarDate,
  parseLocalDateTime,
  repeatOptionLabel,
} from "@/lib/set-schedule";

export interface SetScheduleFormProps {
  triggerDate: string;
  onTriggerDateChange: (v: string) => void;
  timeValue: string;
  onTimeValueChange: (v: string) => void;
  repeatKind: ScheduleRepeatKind;
  onRepeatKindChange: (v: ScheduleRepeatKind) => void;
  customInterval: string;
  onCustomIntervalChange: (v: string) => void;
  customCadence: CustomCadence;
  onCustomCadenceChange: (v: CustomCadence) => void;
}

export function SetScheduleForm({
  triggerDate,
  onTriggerDateChange,
  timeValue,
  onTimeValueChange,
  repeatKind,
  onRepeatKindChange,
  customInterval,
  onCustomIntervalChange,
  customCadence,
  onCustomCadenceChange,
}: SetScheduleFormProps) {
  const anchor = useMemo(
    () => parseLocalDateTime(triggerDate, timeValue),
    [triggerDate, timeValue]
  );

  const anchorForLabels = useMemo(() => {
    if (!triggerDate) return new Date();
    const [y, m, d] = triggerDate.split("-").map(Number);
    if ([y, m, d].some((n) => Number.isNaN(n))) return new Date();
    return new Date(y, m - 1, d, 12, 0, 0, 0);
  }, [triggerDate]);

  const repeatKinds = useMemo(
    () => getRepeatKindsForTriggerCalendarDate(anchorForLabels),
    [anchorForLabels]
  );

  useEffect(() => {
    if (!repeatKinds.includes(repeatKind)) {
      onRepeatKindChange("dont-repeat");
    }
  }, [repeatKinds, repeatKind, onRepeatKindChange]);

  const effectiveRepeatKind = repeatKinds.includes(repeatKind) ? repeatKind : "dont-repeat";

  const nextHelp = useMemo(() => {
    if (!anchor) return null;
    if (effectiveRepeatKind === "dont-repeat" || effectiveRepeatKind === "custom") return null;
    const next = computeNextTriggerDate({
      anchor,
      kind: effectiveRepeatKind,
      customInterval: parseInt(customInterval, 10) || 0,
      customCadence,
    });
    if (!next) return null;
    return formatNextLinePacific(next);
  }, [anchor, effectiveRepeatKind, customInterval, customCadence]);

  const customHelp = useMemo(() => {
    if (effectiveRepeatKind !== "custom" || !anchor) return null;
    const n = parseInt(customInterval, 10);
    if (!Number.isFinite(n) || n <= 0) return null;
    const next = computeNextTriggerDate({
      anchor,
      kind: "custom",
      customInterval: n,
      customCadence,
    });
    if (!next) return null;
    return formatNextLinePacific(next);
  }, [anchor, effectiveRepeatKind, customInterval, customCadence]);

  return (
    <>
      <div className="w-full">
        <h2 className="font-sans font-medium text-[22px] leading-[26px] text-black">
          On a set schedule
        </h2>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="w-full">
          <label className="block font-sans font-medium text-[16px] leading-[24px] text-black mb-2">
            Trigger on<span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={triggerDate}
            onChange={(e) => onTriggerDateChange(e.target.value)}
            className="w-full h-10 pl-4 pr-4 border border-[#e0dede] rounded-lg bg-white text-[15px] text-black focus:outline-none focus:ring-2 focus:ring-[#5AA5E7] focus:border-transparent"
          />
        </div>

        <div className="w-full">
          <label className="block font-sans font-medium text-[16px] leading-[24px] text-black mb-2">
            Time<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 pointer-events-none" />
            <input
              type="time"
              value={timeValue}
              onChange={(e) => onTimeValueChange(e.target.value)}
              className="w-full h-10 pl-10 pr-4 border border-[#e0dede] rounded-lg bg-white text-[15px] text-black focus:outline-none focus:ring-2 focus:ring-[#5AA5E7] focus:border-transparent"
            />
          </div>
        </div>

        <div className="w-full">
          <label className="block font-sans font-medium text-[16px] leading-[24px] text-black mb-2">
            Repeat<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={effectiveRepeatKind}
              onChange={(e) => onRepeatKindChange(e.target.value as ScheduleRepeatKind)}
              className="w-full h-10 pl-4 pr-10 border border-[#e0dede] rounded-lg bg-white text-[15px] text-black focus:outline-none focus:ring-2 focus:ring-[#5AA5E7] focus:border-transparent appearance-none"
            >
              {repeatKinds.map((kind) => (
                <option key={kind} value={kind}>
                  {repeatOptionLabel(kind, anchorForLabels)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-[#6f6f72] pointer-events-none" />
          </div>
          {nextHelp && (
            <p className="mt-2 text-sm text-gray-600 font-sans">{nextHelp}</p>
          )}
        </div>

        {effectiveRepeatKind === "custom" && (
          <div className="w-full flex flex-col gap-2">
            <span className="font-sans font-medium text-[16px] leading-[24px] text-black">
              Repeats every
            </span>
            <div className="flex gap-2 items-center w-full">
              <input
                type="number"
                min={1}
                step={1}
                value={customInterval}
                onChange={(e) => onCustomIntervalChange(e.target.value)}
                className="w-24 h-10 pl-3 pr-3 border border-[#e0dede] rounded-lg bg-white text-[15px] text-black focus:outline-none focus:ring-2 focus:ring-[#5AA5E7] focus:border-transparent shrink-0"
              />
              <div className="relative flex-1 min-w-0">
                <select
                  value={customCadence}
                  onChange={(e) => onCustomCadenceChange(e.target.value as CustomCadence)}
                  className="w-full h-10 pl-4 pr-10 border border-[#e0dede] rounded-lg bg-white text-[15px] text-black focus:outline-none focus:ring-2 focus:ring-[#5AA5E7] focus:border-transparent appearance-none"
                >
                  <option value="days">days</option>
                  <option value="weeks">weeks</option>
                  <option value="months">months</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-[#6f6f72] pointer-events-none" />
              </div>
            </div>
            {customHelp && (
              <p className="text-sm text-gray-600 font-sans">{customHelp}</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
