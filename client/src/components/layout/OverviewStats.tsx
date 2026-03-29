import { useMemo } from "react";
import { Link } from "wouter";
import { useEvents } from "@/context/EventContext";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, MapPin, Video, Users } from "lucide-react";

export function OverviewStats() {
  const { events, categories } = useEvents();
  
  const stats = useMemo(() => {
    const total = events.length;
    const inPerson = events.filter(e => e.format === "in-person").length;
    const webinar = events.filter(e => e.format === "webinar").length;
    const segments = categories.length;

    return [
      {
        label: "Planned Events",
        value: total,
        icon: CalendarDays,
        color: "text-[#00E6BA]",
        bg: "bg-[#00E6BA]/15",
        href: "/events"
      },
      {
        label: "In-Person Sessions",
        value: inPerson,
        icon: MapPin,
        color: "text-emerald-400",
        bg: "bg-emerald-400/15",
        href: "/in-person"
      },
      {
        label: "Webinars",
        value: webinar,
        icon: Video,
        color: "text-blue-400",
        bg: "bg-blue-400/15",
        href: "/webinars"
      },
      {
        label: "Audience Segments",
        value: segments,
        icon: Users,
        color: "text-purple-400",
        bg: "bg-purple-400/15",
        href: "/audiences"
      }
    ];
  }, [events, categories]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Link key={index} href={stat.href} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
            <Card className="glass-card overflow-hidden h-full hover:scale-[1.02] hover:neon-glow transition-all cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} shadow-sm`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground font-serif tracking-tight">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
