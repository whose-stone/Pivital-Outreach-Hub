import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OutreachEvent } from "@/context/EventContext";
import { MapPin, Calendar, Clock, Video, Presentation, Info, CheckCircle, Lightbulb, Edit, Trash2 } from "lucide-react";
import { useEvents } from "@/context/EventContext";
import { EventFormDialog } from "../forms/EventFormDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface EventDetailDialogProps {
  event: OutreachEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetailDialog({ event, isOpen, onClose }: EventDetailDialogProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const { deleteEvent } = useEvents();
  const { toast } = useToast();

  if (!event) return null;

  const isWebinar = event.format === "webinar";

  const handleDelete = () => {
    deleteEvent(event.id);
    setIsDeleteAlertOpen(false);
    onClose();
    toast({
      title: "Event Deleted",
      description: "The event has been successfully removed.",
      variant: "destructive",
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-xl border-white/10 shadow-2xl p-0 sm:rounded-2xl max-h-[90vh] flex flex-col z-50">
          <div className="bg-gradient-to-r from-primary/15 to-[#004435]/60 p-6 md:p-8 border-b border-white/20 shrink-0 relative">
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 bg-white/10 hover:bg-white/20 border-white/10 shadow-sm"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  setTimeout(() => setIsEditOpen(true), 150);
                }}
              >
                <Edit className="h-4 w-4 text-primary" />
              </Button>
            </div>

            <div className="flex items-start justify-between gap-4 mb-4 pr-16">
              <Badge 
                variant="secondary" 
                className="bg-primary/20 hover:bg-primary/30 text-primary border-none shadow-sm backdrop-blur-sm"
              >
                {event.category}
              </Badge>
              <Badge 
                variant="outline" 
                className={`border-none shadow-sm backdrop-blur-sm ${
                  isWebinar ? "bg-blue-500/20 text-blue-300" : "bg-[#00BA97]/20 text-[#00E6BA]"
                }`}
              >
                {isWebinar ? <Video className="w-3 h-3 mr-1" /> : <MapPin className="w-3 h-3 mr-1" />}
                {isWebinar ? "Webinar" : "In-Person"}
              </Badge>
            </div>
            <DialogTitle className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2 pr-16">
              {event.topic}
            </DialogTitle>
            <DialogDescription className="text-base text-foreground/80 flex items-center gap-2">
              <Presentation className="w-4 h-4 text-primary" />
              {event.organization}
            </DialogDescription>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 pb-0">
            {/* Quick Details */}
            <div className="flex flex-wrap gap-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Date</p>
                  <p className="font-medium text-foreground">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' })}</p>
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
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
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
                  <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 text-amber-800 text-sm leading-relaxed whitespace-pre-wrap">
                    {event.executionNotes}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 px-6 md:px-8 py-4 border-t border-white/10 flex items-center">
            <Button
              variant="ghost"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-2"
              onClick={(e) => {
                e.preventDefault();
                setIsDeleteAlertOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <EventFormDialog 
        eventToEdit={event} 
        isOpen={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        triggerAsChild={false}
      />

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent className="z-[110]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Outreach Event?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the event "{event.topic}" for {event.organization}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
