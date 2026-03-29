import { useState } from "react";
import { useEvents } from "@/context/EventContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, Calendar as CalendarIcon, Clock, Presentation, Edit, Trash2, Plus } from "lucide-react";
import { EventFormDialog } from "@/components/forms/EventFormDialog";
import { EventDetailDialog } from "@/components/events/EventDetailDialog";
import type { OutreachEvent } from "@/context/EventContext";

export default function WebinarsPage() {
  const { events } = useEvents();
  
  const [selectedEvent, setSelectedEvent] = useState<OutreachEvent | null>(null);
  
  const webinarEvents = events.filter((e) => e.format === "webinar").sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">
            Virtual <span className="text-blue-600">Webinars</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Manage your online and virtual community outreach presentations.
          </p>
        </div>
        <EventFormDialog triggerAsChild>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4" /> New Webinar
          </Button>
        </EventFormDialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {webinarEvents.map((event) => (
          <Card 
            key={event.id} 
            className="glass-card flex flex-col h-full border-t-4 hover:shadow-md transition-all cursor-pointer group" 
            style={{ borderTopColor: 'hsl(221.2 83.2% 53.3%)' }} /* Blue to match stat block */
            onClick={() => setSelectedEvent(event)}
          >
            <CardHeader className="pb-3 bg-gradient-to-b from-blue-50/50 to-transparent">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {event.category}
                </Badge>
                <Badge variant="outline" className="bg-blue-50/50 text-blue-600 border-blue-200">
                  <Video className="w-3 h-3 mr-1" /> Webinar
                </Badge>
              </div>
              <CardTitle className="text-xl font-serif leading-tight group-hover:text-blue-700 transition-colors">
                {event.topic}
              </CardTitle>
              <div className="text-sm text-muted-foreground font-medium mt-1 flex items-center gap-1.5">
                <Presentation className="w-3.5 h-3.5" />
                {event.organization}
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col pt-2">
              <div className="flex flex-col gap-2 text-sm text-muted-foreground bg-white/5 p-3 rounded-lg border border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-blue-600/70" />
                  {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'UTC' })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600/70" />
                  {event.time}
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-blue-600/70" />
                  {event.venue}
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-auto pt-4">
                <Button variant="ghost" size="sm" className="text-blue-700 hover:bg-blue-50 hover:text-blue-800">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {webinarEvents.length === 0 && (
          <div className="col-span-full py-16 text-center text-muted-foreground bg-white/5 rounded-xl border border-dashed border-white/15">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-lg font-medium">No webinars scheduled</p>
            <p className="text-sm">Click 'New Event' to schedule a virtual presentation.</p>
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