import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEvents } from "@/context/EventContext";
import type { OutreachEvent } from "@/context/EventContext";
import { Plus, PlusCircle, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const eventSchema = z.object({
  organization: z.string().min(2, "Organization name is required"),
  topic: z.string().min(1, "Topic is required"),
  newTopic: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  format: z.enum(["in-person", "webinar"]),
  venue: z.string().min(1, "Venue is required"),
  category: z.string().min(1, "Category is required"),
  newCategory: z.string().optional(),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  callToAction: z.string().min(2, "Call to action is required"),
  executionNotes: z.string().optional().default(""),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormDialogProps {
  children?: React.ReactNode;
  eventToEdit?: OutreachEvent | null;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerAsChild?: boolean;
}

export function EventFormDialog({ children, eventToEdit, isOpen: controlledOpen, onOpenChange: controlledOnOpenChange, triggerAsChild = true }: EventFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);
  const { categories, topics, addEvent, updateEvent, addCategory, addTopic } = useEvents();
  const { toast } = useToast();
  const [location] = useLocation();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  
  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    if (controlledOnOpenChange) {
      controlledOnOpenChange(newOpen);
    }
    if (!newOpen) {
      setTimeout(() => form.reset(), 200);
      setIsCreatingCategory(false);
      setIsCreatingTopic(false);
    }
  };

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      organization: "",
      topic: "",
      newTopic: "",
      date: new Date().toISOString().split('T')[0],
      time: "10:00 AM - 11:00 AM",
      format: "in-person",
      venue: "",
      category: "",
      newCategory: "",
      summary: "",
      callToAction: "",
      executionNotes: "",
    },
  });

  // Update form when eventToEdit changes
  useEffect(() => {
    if (eventToEdit && open) {
      form.reset({
        organization: eventToEdit.organization,
        topic: eventToEdit.topic,
        newTopic: "",
        date: eventToEdit.date,
        time: eventToEdit.time,
        format: eventToEdit.format,
        venue: eventToEdit.venue,
        category: eventToEdit.category,
        newCategory: "",
        summary: eventToEdit.summary,
        callToAction: eventToEdit.callToAction,
        executionNotes: eventToEdit.executionNotes || "",
      });
      setIsCreatingCategory(false);
      setIsCreatingTopic(false);
    } else if (!eventToEdit && open) {
      const defaultFormat = location === '/webinars' ? 'webinar' : 'in-person';
      form.reset({
        organization: "",
        topic: "",
        newTopic: "",
        date: new Date().toISOString().split('T')[0],
        time: "10:00 AM - 11:00 AM",
        format: defaultFormat,
        venue: "",
        category: "",
        newCategory: "",
        summary: "",
        callToAction: "",
        executionNotes: "",
      });
    }
  }, [eventToEdit, open, form, location]);

  const onSubmit = async (data: EventFormValues) => {
    let finalCategory = data.category;
    let finalTopic = data.topic;

    if (isCreatingCategory && data.newCategory) {
      finalCategory = data.newCategory;
      await addCategory(data.newCategory);
    }
    
    if (isCreatingTopic && data.newTopic) {
      finalTopic = data.newTopic;
      await addTopic(data.newTopic);
    }

    const eventData = {
      organization: data.organization,
      topic: finalTopic,
      date: data.date,
      time: data.time,
      format: data.format,
      venue: data.venue,
      category: finalCategory,
      summary: data.summary,
      callToAction: data.callToAction,
      executionNotes: data.executionNotes || "",
    };

    try {
      if (eventToEdit) {
        await updateEvent(eventToEdit.id, eventData);
        toast({ title: "Event Updated", description: "The outreach event has been successfully updated." });
      } else {
        await addEvent(eventData);
        toast({ title: "Event Created", description: "The new outreach event has been successfully scheduled." });
      }
      handleOpenChange(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  // Only show the Create New Event button on the calendar, events, schedule, in-person, and webinars pages
  // Note: the button inside topics/audiences will be their own custom buttons, so we hide this default one there
  if (!isControlled && !children && (location === '/topics' || location === '/audiences')) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isControlled && (
        <DialogTrigger asChild={triggerAsChild}>
          {children || (
            <Button className="gap-2">
              {eventToEdit ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />} 
              {eventToEdit ? "Edit Event" : "New Event"}
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto z-[100]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">
            {eventToEdit ? "Edit Outreach Event" : "Create Outreach Event"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Organization</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Phoenix Chamber of Commerce" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Training Topic</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-xs text-primary"
                    onClick={() => setIsCreatingTopic(!isCreatingTopic)}
                  >
                    {isCreatingTopic ? "Select Existing" : <><PlusCircle className="w-3 h-3 mr-1" /> New Topic</>}
                  </Button>
                </div>
                {isCreatingTopic ? (
                  <FormField
                    control={form.control}
                    name="newTopic"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Enter new training topic..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select topic..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="z-[110]">
                            {topics.map((t) => (
                              <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Window</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2:00 PM - 3:00 PM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Format</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="z-[110]">
                        <SelectItem value="in-person">In-Person</SelectItem>
                        <SelectItem value="webinar">Webinar</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="venue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue / Link</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Zoom or 123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Target Audience / Category</Label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary h-8 px-2"
                  onClick={() => setIsCreatingCategory(!isCreatingCategory)}
                >
                  {isCreatingCategory ? "Select Existing" : <><PlusCircle className="w-4 h-4 mr-1" /> New Audience</>}
                </Button>
              </div>
              
              {isCreatingCategory ? (
                <FormField
                  control={form.control}
                  name="newCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter new target audience segment..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select target audience..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="z-[110]">
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Summary</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief overview of the presentation and its goals..." 
                      className="resize-none h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="callToAction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Call to Action</FormLabel>
                  <FormControl>
                    <Input placeholder="What do we want the audience to do next?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="executionNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Execution Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any specific logistics, setup requirements, or talking points..." 
                      className="resize-none h-20"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{eventToEdit ? "Save Changes" : "Schedule Event"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
