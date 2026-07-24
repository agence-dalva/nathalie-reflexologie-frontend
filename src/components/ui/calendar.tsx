"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type DateRange, type Matcher } from "react-day-picker";
import "react-day-picker/style.css";

const calendarFormatters = {
  formatWeekdayName: (date: Date) =>
    date.toLocaleDateString("fr-FR", { weekday: "short" }).replace(".", ""),
  formatCaption: (date: Date) =>
    date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
};

const calendarComponents = {
  Chevron: ({ orientation }: { orientation?: string }) =>
    orientation === "left" ? (
      <ChevronLeft className="h-5 w-5" strokeWidth={2} />
    ) : (
      <ChevronRight className="h-5 w-5" strokeWidth={2} />
    ),
};

const calendarClassNames = {
  root: "rdp-root w-full",
  month_caption:
    "relative flex items-center justify-center pt-1 pb-5 text-base font-semibold capitalize text-sage-800",
  nav: "absolute inset-x-0 top-0 z-10 flex items-center justify-between",
  button_previous:
    "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-sage-600 transition-colors hover:bg-sage-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent",
  button_next:
    "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-sage-600 transition-colors hover:bg-sage-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent",
  month_grid: "mt-2 w-full table-fixed border-collapse",
  weekday:
    "pb-3 text-center text-xs font-medium tracking-wide text-stone-400 uppercase",
  day: "p-1.5 text-center",
  day_button:
    "mx-auto flex aspect-square w-full max-w-12 cursor-pointer items-center justify-center rounded-full text-base font-medium text-sage-700 transition-colors hover:bg-sage-100",
  selected:
    "[&>button]:bg-sage-600 [&>button]:text-white [&>button]:font-semibold [&>button]:hover:bg-sage-600",
  today:
    "[&>button]:relative [&>button]:after:absolute [&>button]:after:bottom-1.5 [&>button]:after:h-1 [&>button]:after:w-1 [&>button]:after:rounded-full [&>button]:after:bg-terracotta-500",
  outside: "[&>button]:text-transparent [&>button]:pointer-events-none",
  disabled:
    "[&>button]:cursor-not-allowed [&>button]:text-stone-300 [&>button]:hover:bg-transparent",
  // Mode range : les jours intermédiaires gardent un fond sage clair pour visualiser la période.
  range_start:
    "[&>button]:bg-sage-600 [&>button]:text-white [&>button]:font-semibold",
  range_end:
    "[&>button]:bg-sage-600 [&>button]:text-white [&>button]:font-semibold",
  range_middle:
    "bg-sage-100 [&>button]:text-sage-800 [&>button]:hover:bg-sage-200",
};

type CalendarProps = {
  month: Date;
  onMonthChange: (date: Date) => void;
  selected?: Date;
  onSelect: (date: Date) => void;
  disabled?: Matcher | Matcher[];
  startMonth?: Date;
  endMonth?: Date;
  loading?: boolean;
};

export function Calendar({
  month,
  onMonthChange,
  selected,
  onSelect,
  disabled,
  startMonth,
  endMonth,
  loading,
}: CalendarProps) {
  return (
    <DayPicker
      mode="single"
      month={month}
      onMonthChange={onMonthChange}
      startMonth={startMonth}
      endMonth={endMonth}
      selected={selected}
      onSelect={(date) => date && onSelect(date)}
      disabled={disabled}
      showOutsideDays
      weekStartsOn={1}
      formatters={calendarFormatters}
      components={calendarComponents}
      className={loading ? "animate-pulse" : undefined}
      classNames={calendarClassNames}
    />
  );
}

type RangeCalendarProps = {
  month: Date;
  onMonthChange: (date: Date) => void;
  selected?: DateRange;
  onSelect: (range: DateRange | undefined) => void;
  disabled?: Matcher | Matcher[];
  startMonth?: Date;
  endMonth?: Date;
  loading?: boolean;
};

export function RangeCalendar({
  month,
  onMonthChange,
  selected,
  onSelect,
  disabled,
  startMonth,
  endMonth,
  loading,
}: RangeCalendarProps) {
  return (
    <DayPicker
      mode="range"
      month={month}
      onMonthChange={onMonthChange}
      startMonth={startMonth}
      endMonth={endMonth}
      selected={selected}
      onSelect={onSelect}
      disabled={disabled}
      showOutsideDays
      weekStartsOn={1}
      formatters={calendarFormatters}
      components={calendarComponents}
      className={loading ? "animate-pulse" : undefined}
      classNames={calendarClassNames}
    />
  );
}
