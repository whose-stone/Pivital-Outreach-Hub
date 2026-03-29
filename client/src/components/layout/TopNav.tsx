import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Calendar, LayoutGrid, List, Users, Video, MapPin, BookOpen, Upload, Bell, ShieldCheck, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Notice {
  id: string;
  resolved: boolean;
}

async function fetchNotices(): Promise<Notice[]> {
  const res = await fetch("/api/notices");
  if (!res.ok) return [];
  return res.json();
}

export function TopNav() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const { data: notices = [] } = useQuery<Notice[]>({
    queryKey: ["/api/notices"],
    queryFn: fetchNotices,
    refetchInterval: 30000,
  });

  const unresolvedCount = notices.filter((n) => !n.resolved).length;

  const navItems = [
    { href: "/", label: "Calendar", icon: Calendar },
    { href: "/events", label: "Events", icon: LayoutGrid },
    { href: "/schedule", label: "Schedule", icon: List },
    { href: "/in-person", label: "In-Person", icon: MapPin },
    { href: "/webinars", label: "Webinars", icon: Video },
    { href: "/topics", label: "Topics", icon: BookOpen },
    { href: "/audiences", label: "Audiences", icon: Users },
    { href: "/campaigns", label: "Campaigns", icon: Upload },
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
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl overflow-x-auto max-w-[45vw] sm:max-w-none scrollbar-hide">
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

        {/* Right side: bell + user menu */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Bell */}
          <Link href="/notices">
            <span
              className={cn(
                "relative flex items-center justify-center h-9 w-9 rounded-lg transition-all duration-200 cursor-pointer",
                location === "/notices"
                  ? "bg-yellow-400 text-[#001F17]"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
              data-testid="nav-notices"
            >
              <Bell className="h-5 w-5" />
              {unresolvedCount > 0 && (
                <span
                  data-testid="badge-notice-count"
                  className="absolute -top-1 -right-1 flex items-center justify-center h-4 min-w-4 px-1 text-[10px] font-bold rounded-full bg-yellow-400 text-[#001F17]"
                >
                  {unresolvedCount}
                </span>
              )}
            </span>
          </Link>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                data-testid="button-user-menu"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold uppercase">
                  {user?.username?.[0]}
                </div>
                <span className="hidden sm:inline-block">{user?.username}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {user?.isAdmin && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <a className="flex items-center gap-2 w-full cursor-pointer" data-testid="nav-admin">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        Admin Panel
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem
                data-testid="button-logout"
                className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer gap-2"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
