import { ReactNode } from "react";
import { TopNav } from "./TopNav";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground" style={{
      background: "radial-gradient(ellipse at top right, rgba(0,230,186,0.06) 0%, #001F17 50%)"
    }}>
      <TopNav />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>
    </div>
  );
}
