import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import { EventProvider } from "@/context/EventContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import CalendarPage from "@/pages/Calendar";
import EventsPage from "@/pages/Events";
import SchedulePage from "@/pages/Schedule";
import TargetAudiencesPage from "@/pages/audience/TargetAudiences";
import InPersonPage from "@/pages/in-person/InPersonEvents";
import WebinarsPage from "@/pages/webinars/WebinarsEvents";
import TopicsPage from "@/pages/topics/TopicsPage";
import CampaignManagementPage from "@/pages/campaigns/CampaignManagement";
import NoticesPage from "@/pages/notices/NoticesPage";
import AdminPage from "@/pages/admin/AdminPage";
import LoginPage from "@/pages/Login";
import NotFound from "@/pages/not-found";

function ProtectedRouter() {
  const { user, loading } = useAuth();
  const [location] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#001F17] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00E6BA] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={CalendarPage} />
        <Route path="/events" component={EventsPage} />
        <Route path="/schedule" component={SchedulePage} />
        <Route path="/audiences" component={TargetAudiencesPage} />
        <Route path="/in-person" component={InPersonPage} />
        <Route path="/webinars" component={WebinarsPage} />
        <Route path="/topics" component={TopicsPage} />
        <Route path="/campaigns" component={CampaignManagementPage} />
        <Route path="/notices" component={NoticesPage} />
        <Route path="/admin" component={AdminPage} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function Router() {
  const { user, loading } = useAuth();
  const [location] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#001F17] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00E6BA] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/login">
        {user ? <Redirect to="/" /> : <LoginPage />}
      </Route>
      <Route>
        <ProtectedRouter />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <EventProvider>
            <Toaster />
            <Router />
          </EventProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
