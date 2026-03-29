import { CalendarView } from "@/components/events/CalendarView";
import { OverviewStats } from "@/components/layout/OverviewStats";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">
          Outreach <span className="text-primary">Calendar</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Schedule and manage community outreach events across the Phoenix area.
        </p>
      </div>
      
      <OverviewStats />
      
      <div className="bg-white/40 rounded-2xl p-1 md:p-4 border border-white/40 shadow-sm backdrop-blur-sm">
        <CalendarView />
      </div>
    </div>
  );
}
