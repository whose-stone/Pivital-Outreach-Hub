import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Calendar, LayoutGrid, List } from "lucide-react";

export function TopNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Calendar", icon: Calendar },
    { href: "/events", label: "Events", icon: LayoutGrid },
    { href: "/schedule", label: "Schedule", icon: List },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/20 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-serif font-bold text-xl">P</span>
          </div>
          <span className="font-serif font-semibold text-xl tracking-tight hidden sm:inline-block">
            Pivital Systems
          </span>
        </div>

        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-white text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                  )}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline-block">{item.label}</span>
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
