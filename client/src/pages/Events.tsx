import { EventsView } from "@/components/events/EventsView";
import { OverviewStats } from "@/components/layout/OverviewStats";

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">
          Event <span className="text-primary">Directory</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Browse and filter all planned community outreach presentations.
        </p>
      </div>
      
      <OverviewStats />
      
      <EventsView />
    </div>
  );
}
