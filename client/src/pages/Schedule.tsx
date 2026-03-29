import { ScheduleView } from "@/components/events/ScheduleView";

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">
          Master <span className="text-primary">Schedule</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Chronological timeline of all upcoming outreach presentations.
        </p>
      </div>
      
      <div className="bg-white/40 rounded-3xl p-6 md:p-8 border border-white/40 shadow-sm backdrop-blur-sm">
        <ScheduleView />
      </div>
    </div>
  );
}
