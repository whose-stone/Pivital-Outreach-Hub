import { useState } from "react";
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
import { Plus, PlusCircle } from "lucide-react";
import { EventFormat } from "@/data/events";
import { useToast } from "@/hooks/use-toast";

const eventSchema = z.object({
  organization: z.string().min(2, "Organization name is required"),
  topic: z.string().min(2, "Topic is required"),
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

export function EventFormDialog({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const { categories, addEvent, addCategory } = useEvents();
  const { toast } = useToast();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      organization: "",
      topic: "",
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

  const onSubmit = (data: EventFormValues) => {
    let finalCategory = data.category;

    if (isCreatingCategory && data.newCategory) {
      finalCategory = data.newCategory;
      addCategory(data.newCategory);
    }

    const newEvent = {
      organization: data.organization,
      topic: data.topic,
      date: data.date,
      time: data.time,
      format: data.format as EventFormat,
      venue: data.venue,
      category: finalCategory as any,
      summary: data.summary,
      callToAction: data.callToAction,
      executionNotes: data.executionNotes || "",
    };

    addEvent(newEvent);
    toast({
      title: "Event Created",
      description: "The new outreach event has been successfully scheduled.",
    });
    setOpen(false);
    form.reset();
    setIsCreatingCategory(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Event
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Create Outreach Event</DialogTitle>
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
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Presentation Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., AI Fundamentals" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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

            <div className="space-y-4 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base font-semibold">Target Audience / Category</FormLabel>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select target audience..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Schedule Event</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
