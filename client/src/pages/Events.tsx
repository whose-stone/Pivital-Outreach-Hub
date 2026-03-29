import { EventsView } from "@/components/events/EventsView";
import { OverviewStats } from "@/components/layout/OverviewStats";
import { EventFormDialog } from "@/components/forms/EventFormDialog";

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">
            Event <span className="text-primary">Directory</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Browse and filter all planned community outreach presentations.
          </p>
        </div>
        <EventFormDialog />
      </div>
      
      <OverviewStats />
      
      <EventsView />
    </div>
  );
}
