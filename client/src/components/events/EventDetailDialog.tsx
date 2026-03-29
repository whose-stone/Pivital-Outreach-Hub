import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { OutreachEvent } from "@/data/events";
import { MapPin, Calendar, Clock, Video, Presentation, Info, CheckCircle, Lightbulb } from "lucide-react";

interface EventDetailDialogProps {
  event: OutreachEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetailDialog({ event, isOpen, onClose }: EventDetailDialogProps) {
  if (!event) return null;

  const isWebinar = event.format === "webinar";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl p-0 overflow-hidden sm:rounded-2xl">
        <div className="bg-gradient-to-r from-primary/10 to-blue-400/10 p-6 md:p-8 border-b border-white/20">
          <div className="flex items-start justify-between gap-4 mb-4">
            <Badge 
              variant="secondary" 
              className="bg-white/60 hover:bg-white/80 text-primary border-none shadow-sm backdrop-blur-sm"
            >
              {event.category}
            </Badge>
            <Badge 
              variant="outline" 
              className={`border-none shadow-sm backdrop-blur-sm ${
                isWebinar ? "bg-blue-100/80 text-blue-700" : "bg-green-100/80 text-green-700"
              }`}
            >
              {isWebinar ? <Video className="w-3 h-3 mr-1" /> : <MapPin className="w-3 h-3 mr-1" />}
              {isWebinar ? "Webinar" : "In-Person"}
            </Badge>
          </div>
          <DialogTitle className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
            {event.topic}
          </DialogTitle>
          <DialogDescription className="text-base text-foreground/80 flex items-center gap-2">
            <Presentation className="w-4 h-4 text-primary" />
            {event.organization}
          </DialogDescription>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {/* Quick Details */}
          <div className="flex flex-wrap gap-6 p-4 rounded-xl bg-slate-50/50 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Date</p>
                <p className="font-medium text-foreground">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Time</p>
                <p className="font-medium text-foreground">{event.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {isWebinar ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Venue</p>
                <p className="font-medium text-foreground">{event.venue}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-serif font-semibold text-foreground border-b pb-2">
                <Info className="w-5 h-5 text-primary" />
                Event Summary
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {event.summary}
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-serif font-semibold text-foreground border-b pb-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Call to Action
                </div>
                <div className="p-4 rounded-xl bg-green-50/50 border border-green-100 text-green-800 font-medium">
                  {event.callToAction}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-serif font-semibold text-foreground border-b pb-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  Execution Notes
                </div>
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 text-amber-800 text-sm leading-relaxed">
                  {event.executionNotes}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
