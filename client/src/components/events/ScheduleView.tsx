import { useState } from "react";
import { eventsData, OutreachEvent } from "@/data/events";
import { EventDetailDialog } from "./EventDetailDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Video, Calendar, ArrowRight } from "lucide-react";

export function ScheduleView() {
  const [selectedEvent, setSelectedEvent] = useState<OutreachEvent | null>(null);

  // Sort events chronologically
  const sortedEvents = [...eventsData].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Group by month/year
  const groupedEvents = sortedEvents.reduce((acc, event) => {
    const date = new Date(event.date);
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(event);
    return acc;
  }, {} as Record<string, OutreachEvent[]>);

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
        <div key={monthYear} className="space-y-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-serif font-bold text-foreground">{monthYear}</h2>
            <div className="h-px bg-white/40 flex-1"></div>
          </div>
          
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/20 before:via-primary/20 before:to-transparent">
            {monthEvents.map((event, index) => {
              const date = new Date(event.date);
              return (
                <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  {/* Timeline dot */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-primary text-white shadow-sm absolute left-0 md:left-1/2 -translate-x-0 md:-translate-x-1/2 z-10 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-sm font-bold">{date.getDate()}</span>
                  </div>

                  {/* Content Card */}
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] ml-auto md:ml-0 p-4">
                    <Card 
                      className="glass-card cursor-pointer hover:-translate-y-1 transition-all duration-300 group-hover:border-primary/50 relative overflow-hidden"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className={`absolute top-0 left-0 w-1 h-full ${event.format === 'webinar' ? 'bg-blue-500' : 'bg-green-500'}`} />
                      <CardContent className="p-5">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                            {event.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs uppercase border-slate-200">
                            {event.format === "webinar" ? (
                              <span className="flex items-center text-blue-600"><Video className="w-3 h-3 mr-1" /> Webinar</span>
                            ) : (
                              <span className="flex items-center text-green-600"><MapPin className="w-3 h-3 mr-1" /> In-Person</span>
                            )}
                          </Badge>
                        </div>
                        
                        <h3 className="text-lg font-serif font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                          {event.topic}
                        </h3>
                        <p className="text-sm font-medium text-muted-foreground mb-4">
                          {event.organization}
                        </p>
                        
                        <div className="flex flex-col gap-2 text-sm text-slate-600 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary/60" />
                            {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary/60" />
                            {event.time}
                          </div>
                        </div>

                        <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
                          View details <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <EventDetailDialog 
        event={selectedEvent} 
        isOpen={!!selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
      />
    </div>
  );
}
