import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Calendar, LayoutGrid, List, Users, Video, MapPin, BookOpen } from "lucide-react";

export function TopNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Calendar", icon: Calendar },
    { href: "/events", label: "Events", icon: LayoutGrid },
    { href: "/schedule", label: "Schedule", icon: List },
    { href: "/in-person", label: "In-Person", icon: MapPin },
    { href: "/webinars", label: "Webinars", icon: Video },
    { href: "/topics", label: "Topics", icon: BookOpen },
    { href: "/audiences", label: "Audiences", icon: Users },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/8 bg-[#001F17]/95 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="h-9 w-9 rounded-lg overflow-hidden shrink-0 bg-[#004435]">
            <img src="/pivital-logo.png" alt="Pivital.ai" className="w-full h-full object-contain p-0.5" />
          </div>
          <span className="font-serif font-bold text-xl tracking-tight hidden sm:inline-block text-white">
            Pivital<span className="text-[#00E6BA]">.ai</span>
          </span>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl overflow-x-auto max-w-[60vw] sm:max-w-none scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
                    isActive
                      ? "bg-[#00E6BA] text-[#001F17] shadow-sm font-semibold"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  )}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="hidden lg:inline-block">{item.label}</span>
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
