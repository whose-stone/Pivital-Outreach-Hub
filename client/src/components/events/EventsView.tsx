import { useState } from "react";
import { eventsData, OutreachEvent } from "@/data/events";
import { EventDetailDialog } from "./EventDetailDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, MapPin, Video, Search, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function EventsView() {
  const [selectedEvent, setSelectedEvent] = useState<OutreachEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredEvents = eventsData.filter((event) => {
    const matchesSearch = 
      event.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(eventsData.map(e => e.category)));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white/50 p-4 rounded-xl border border-white/20 shadow-sm backdrop-blur-md">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search events or organizations..." 
            className="pl-9 bg-white/80 border-white/40 focus-visible:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] bg-white/80 border-white/40">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card 
            key={event.id} 
            className="glass-card group cursor-pointer overflow-hidden border-t-4 hover:-translate-y-1 transition-all duration-300"
            style={{ borderTopColor: 'hsl(var(--primary))' }}
            onClick={() => setSelectedEvent(event)}
          >
            <CardHeader className="pb-3 bg-gradient-to-b from-slate-50/50 to-transparent">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  {event.category}
                </Badge>
                {event.format === "webinar" ? (
                  <Badge variant="outline" className="bg-blue-50/50 text-blue-600 border-blue-200">
                    <Video className="w-3 h-3 mr-1" /> Webinar
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-50/50 text-green-600 border-green-200">
                    <MapPin className="w-3 h-3 mr-1" /> In-Person
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl font-serif leading-tight group-hover:text-primary transition-colors">
                {event.topic}
              </CardTitle>
              <p className="text-sm text-muted-foreground font-medium mt-1">
                {event.organization}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-slate-600">
                  <CalendarIcon className="w-4 h-4 mr-2 text-primary/70" />
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {event.time}
                </div>
                <p className="text-sm text-slate-600 line-clamp-2">
                  {event.summary}
                </p>
                <div className="pt-4 flex justify-end">
                  <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 group-hover:bg-primary/10 w-full justify-between">
                    View Details
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">→</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredEvents.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-white/40 rounded-xl border border-dashed border-slate-300">
            <p className="text-lg font-medium">No events found</p>
            <p className="text-sm">Try adjusting your search or filters.</p>
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
