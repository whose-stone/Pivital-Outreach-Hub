import { useState, useMemo } from "react";
import { useEvents } from "@/context/EventContext";
import { OutreachEvent } from "@/data/events";
import { EventDetailDialog } from "./EventDetailDialog";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function CalendarView() {
  const { events } = useEvents();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<OutreachEvent | null>(null);

  // Group events by date string (YYYY-MM-DD)
  const eventsByDate = useMemo(() => {
    return events.reduce((acc, event) => {
      if (!acc[event.date]) {
        acc[event.date] = [];
      }
      acc[event.date].push(event);
      return acc;
    }, {} as Record<string, OutreachEvent[]>);
  }, [events]);

  // Function to check if a date has events
  const getEventsForDate = (date: Date) => {
    // Format local date to match our ISO format string YYYY-MM-DD
    const dateStr = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-');
    return eventsByDate[dateStr] || [];
  };

  const selectedDateEvents = date ? getEventsForDate(date) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both">
      <Card className="lg:col-span-8 xl:col-span-8 glass-card border-none shadow-sm h-fit">
        <CardContent className="p-4 sm:p-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="w-full h-full max-w-full rounded-xl border border-white/40 bg-white/50 p-4"
            classNames={{
              months: "w-full",
              month: "w-full space-y-4",
              caption: "flex justify-center pt-1 relative items-center mb-6",
              caption_label: "text-xl font-serif font-semibold text-primary",
              nav: "space-x-1 flex items-center",
              table: "w-full border-collapse space-y-1",
              head_row: "flex w-full",
              head_cell: "text-muted-foreground w-full rounded-md font-medium text-[0.85rem] pb-4 uppercase tracking-wider",
              row: "flex w-full mt-2 gap-1 sm:gap-2",
              cell: "h-12 w-full text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
              day: "h-12 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-primary/10 rounded-lg transition-colors cursor-pointer relative",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground font-semibold shadow-md",
              day_today: "bg-accent text-accent-foreground font-semibold ring-2 ring-primary/20",
              day_outside: "text-muted-foreground opacity-50",
            }}
            modifiers={{
              hasEvent: (date) => getEventsForDate(date).length > 0,
            }}
            modifiersStyles={{
              hasEvent: { fontWeight: 'bold' }
            }}
            components={{
              DayContent: (props) => {
                const dayEvents = getEventsForDate(props.date);
                return (
                  <div className="w-full h-full flex flex-col items-center justify-center relative">
                    <span>{props.date.getDate()}</span>
                    {dayEvents.length > 0 && (
                      <div className="absolute bottom-1 sm:bottom-2 flex gap-1">
                        {dayEvents.map((e, i) => (
                          <div 
                            key={i} 
                            className={`w-1.5 h-1.5 rounded-full ${
                              props.activeModifiers.selected ? 'bg-white' : 'bg-primary'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              },
            }}
          />
        </CardContent>
      </Card>

      <div className="lg:col-span-4 xl:col-span-4 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-serif font-semibold text-foreground">
            {date ? date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a date'}
          </h3>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {selectedDateEvents.length} Event{selectedDateEvents.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        {selectedDateEvents.length > 0 ? (
          <div className="space-y-4">
            {selectedDateEvents.map((event) => (
              <Card 
                key={event.id} 
                className="glass-card cursor-pointer hover:-translate-y-1 transition-transform duration-200 border-l-4 group"
                style={{ borderLeftColor: 'hsl(var(--primary))' }}
                onClick={() => setSelectedEvent(event)}
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold tracking-wider uppercase text-primary bg-primary/10 px-2 py-1 rounded-md">
                      {event.time}
                    </span>
                    <Badge variant="outline" className="text-[10px] uppercase border-primary/20 text-primary/70">
                      {event.format}
                    </Badge>
                  </div>
                  <h4 className="font-serif text-lg font-semibold leading-tight mb-1 group-hover:text-primary transition-colors">
                    {event.topic}
                  </h4>
                  <p className="text-sm text-muted-foreground font-medium mb-3">
                    {event.organization}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {event.summary}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-white/40 rounded-xl border border-dashed border-white/60 h-48">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">No events scheduled</p>
            <p className="text-sm text-slate-400 mt-1">Select another date to view events.</p>
          </div>
        )}
      </div>

      <EventDetailDialog 
        event={selectedEvent} 
        isOpen={!!selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
      />
    </div>
  );
}
