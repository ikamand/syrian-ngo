import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import CreateNgo from "@/pages/CreateNgo";
import NgoRegistrationInfo from "@/pages/NgoRegistrationInfo";
import NgoList from "@/pages/NgoList";
import NgoProfile from "@/pages/NgoProfile";
import AdminDashboard from "@/pages/AdminDashboard";
import AssociationLaw from "@/pages/AssociationLaw";
import OtherLaws from "@/pages/OtherLaws";
import Announcements from "@/pages/Announcements";
import AnnouncementDetail from "@/pages/AnnouncementDetail";
import Opportunities from "@/pages/Opportunities";
import OpportunityDetail from "@/pages/OpportunityDetail";
import Notices from "@/pages/Notices";
import Events from "@/pages/Events";
import DonationCampaigns from "@/pages/DonationCampaigns";
import UsePolicy from "@/pages/UsePolicy";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Auth} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/create-ngo" component={NgoRegistrationInfo} />
      <Route path="/ngos/new" component={CreateNgo} />
      <Route path="/ngos/:id" component={NgoProfile} />
      <Route path="/ngos" component={NgoList} />
      <Route path="/legal/association-law" component={AssociationLaw} />
      <Route path="/legal/other-laws" component={OtherLaws} />
      <Route path="/legal/notices" component={Notices} />
      <Route path="/news/:id" component={AnnouncementDetail} />
      <Route path="/announcements" component={Announcements} />
      <Route path="/opportunities/:id" component={OpportunityDetail} />
      <Route path="/opportunities" component={Opportunities} />
      <Route path="/events" component={Events} />
      <Route path="/donation-campaigns" component={DonationCampaigns} />
      <Route path="/use-policy" component={UsePolicy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div dir="rtl" className="min-h-screen font-sans flex flex-col">
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
