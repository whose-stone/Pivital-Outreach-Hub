import { useState, useMemo, useEffect, useRef } from "react";
import { useEvents } from "@/context/EventContext";
import type { OutreachEvent } from "@/context/EventContext";
import { EventDetailDialog } from "./EventDetailDialog";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const CATEGORY_COLORS: string[] = [
  "#6366f1",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#f97316",
  "#8b5cf6",
  "#14b8a6",
  "#ef4444",
  "#2563eb",
  "#06b6d4",
  "#a855f7",
];

function getCategoryColor(category: string, allCategories: string[]): string {
  const idx = allCategories.indexOf(category);
  if (idx === -1) return "#6366f1";
  return CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
}

function getPillTextColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#111111" : "#ffffff";
}

function formatTime24(timeStr: string): string {
  if (!timeStr) return "";
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return timeStr;
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${minutes}`;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function buildCalendarGrid(year: number, month: number): (Date | null)[][] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  const rows: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

function toDateKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function CalendarView() {
  const { events } = useEvents();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedEvent, setSelectedEvent] = useState<OutreachEvent | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    events.forEach((e) => { cats.add(e.category || "Uncategorized"); });
    return Array.from(cats).sort();
  }, [events]);

  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());
  const initializedRef = useRef(false);

  useEffect(() => {
    if (allCategories.length === 0) return;
    if (!initializedRef.current) {
      initializedRef.current = true;
      setActiveCategories(new Set(allCategories));
    } else {
      setActiveCategories((prev) => {
        const next = new Set(prev);
        allCategories.forEach((c) => {
          if (!next.has(c)) next.add(c);
        });
        return next;
      });
    }
  }, [allCategories]);

  const eventsByDate = useMemo(() => {
    return events.reduce((acc, event) => {
      if (!acc[event.date]) acc[event.date] = [];
      acc[event.date].push(event);
      return acc;
    }, {} as Record<string, OutreachEvent[]>);
  }, [events]);

  const grid = useMemo(() => buildCalendarGrid(viewYear, viewMonth), [viewYear, viewMonth]);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  }

  function toggleCategory(cat: string) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function toggleAll(on: boolean) {
    if (on) setActiveCategories(new Set(allCategories));
    else setActiveCategories(new Set());
  }

  const todayKey = toDateKey(today);
  const allSelected = allCategories.length > 0 && allCategories.every((c) => activeCategories.has(c));

  function FilterPanel() {
    return (
      <div
        className="flex flex-col gap-3 min-w-[180px]"
        data-testid="filter-panel"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground tracking-wide uppercase">
            Event Type
          </span>
          <button
            className="text-xs text-primary hover:underline"
            onClick={() => toggleAll(!allSelected)}
            data-testid="button-toggle-all-categories"
          >
            {allSelected ? "None" : "All"}
          </button>
        </div>
        {allCategories.length === 0 && (
          <p className="text-xs text-muted-foreground">No categories found.</p>
        )}
        {allCategories.map((cat) => {
          const color = getCategoryColor(cat, allCategories);
          const checked = activeCategories.has(cat);
          return (
            <div key={cat} className="flex items-center gap-2" data-testid={`filter-category-${cat}`}>
              <Checkbox
                id={`cat-${cat}`}
                checked={checked}
                onCheckedChange={() => toggleCategory(cat)}
                data-testid={`checkbox-category-${cat}`}
                className="border-white/30"
              />
              <Label
                htmlFor={`cat-${cat}`}
                className="flex items-center gap-1.5 cursor-pointer text-sm font-medium select-none"
              >
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-foreground/80 leading-tight">{cat}</span>
              </Label>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both">
      {/* Mobile filter collapsible */}
      <div className="lg:hidden">
        <Collapsible open={filterOpen} onOpenChange={setFilterOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 glass-card border-white/10 text-sm"
              data-testid="button-toggle-filter-mobile"
            >
              <Filter className="w-4 h-4" />
              Filter by Type
              <span className="text-xs text-muted-foreground">
                ({activeCategories.size}/{allCategories.length})
              </span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-3 p-4 glass-card rounded-xl border border-white/10 bg-white/5">
              <FilterPanel />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Main layout: sidebar + calendar */}
      <div className="flex gap-6">
        {/* Desktop filter sidebar */}
        <aside
          className="hidden lg:flex flex-col gap-2 w-52 flex-shrink-0 p-4 glass-card rounded-xl border border-white/10 bg-white/5 h-fit"
          data-testid="filter-sidebar-desktop"
        >
          <FilterPanel />
        </aside>

        {/* Calendar */}
        <div className="flex-1 min-w-0 glass-card rounded-xl border border-white/10 bg-white/5 p-3 sm:p-5">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-5">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevMonth}
              className="hover:bg-white/10 rounded-lg"
              data-testid="button-prev-month"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2
              className="text-lg sm:text-xl font-serif font-semibold text-foreground"
              data-testid="text-calendar-month"
            >
              {MONTH_NAMES[viewMonth]} {viewYear}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextMonth}
              className="hover:bg-white/10 rounded-lg"
              data-testid="button-next-month"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAY_LABELS.map((d) => (
              <div
                key={d}
                className="text-center text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar rows */}
          <div className="flex flex-col gap-1">
            {grid.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-1">
                {week.map((day, di) => {
                  if (!day) {
                    return (
                      <div
                        key={di}
                        className="rounded-lg min-h-[60px] sm:min-h-[80px] bg-white/[0.02] opacity-40"
                      />
                    );
                  }
                  const dateKey = toDateKey(day);
                  const isToday = dateKey === todayKey;
                  const dayEvents = (eventsByDate[dateKey] || [])
                    .filter((e) => activeCategories.has(e.category || "Uncategorized"))
                    .sort((a, b) => formatTime24(a.time).localeCompare(formatTime24(b.time)));

                  return (
                    <div
                      key={di}
                      className={`rounded-lg min-h-[60px] sm:min-h-[80px] p-1 sm:p-1.5 flex flex-col gap-0.5 border transition-colors ${
                        isToday
                          ? "border-primary/50 bg-primary/10"
                          : "border-white/5 bg-white/[0.03] hover:bg-white/[0.06]"
                      }`}
                      data-testid={`cell-day-${dateKey}`}
                    >
                      <span
                        className={`text-[10px] sm:text-xs font-semibold leading-none mb-0.5 self-start px-0.5 ${
                          isToday
                            ? "text-primary font-bold"
                            : "text-muted-foreground"
                        }`}
                      >
                        {day.getDate()}
                      </span>
                      {dayEvents.map((event) => {
                        const bgColor = getCategoryColor(event.category || "Uncategorized", allCategories);
                        const textColor = getPillTextColor(bgColor);
                        const time24 = formatTime24(event.time);
                        return (
                          <button
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className="w-full text-left rounded px-1 py-0.5 leading-tight cursor-pointer hover:brightness-110 transition-all truncate focus:outline-none focus:ring-1 focus:ring-white/50"
                            style={{ backgroundColor: bgColor, color: textColor }}
                            title={`${time24} ${event.topic}`}
                            data-testid={`pill-event-${event.id}`}
                          >
                            <span className="text-[9px] sm:text-[10px] font-medium block truncate">
                              {time24 && (
                                <span className="font-bold mr-0.5 opacity-90">{time24}</span>
                              )}
                              <span className="opacity-95">{event.topic}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedEvent && (
        <EventDetailDialog
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
