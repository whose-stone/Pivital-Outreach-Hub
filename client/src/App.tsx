import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import { EventProvider } from "@/context/EventContext";
import CalendarPage from "@/pages/Calendar";
import EventsPage from "@/pages/Events";
import SchedulePage from "@/pages/Schedule";
import TargetAudiencesPage from "@/pages/audience/TargetAudiences";
import InPersonPage from "@/pages/in-person/InPersonEvents";
import WebinarsPage from "@/pages/webinars/WebinarsEvents";
import TopicsPage from "@/pages/topics/TopicsPage";
import CampaignManagementPage from "@/pages/campaigns/CampaignManagement";
import NoticesPage from "@/pages/notices/NoticesPage";
import NotFound from "@/pages/not-found";

function Router() {
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
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <EventProvider>
          <Toaster />
          <Router />
        </EventProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
