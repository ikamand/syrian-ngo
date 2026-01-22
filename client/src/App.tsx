import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import CreateNgo from "@/pages/CreateNgo";
import NgoList from "@/pages/NgoList";
import AdminDashboard from "@/pages/AdminDashboard";
import AssociationLaw from "@/pages/AssociationLaw";
import OtherLaws from "@/pages/OtherLaws";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Auth} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/ngos/new" component={CreateNgo} />
      <Route path="/ngos" component={NgoList} />
      <Route path="/legal/association-law" component={AssociationLaw} />
      <Route path="/legal/other-laws" component={OtherLaws} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div dir="rtl" className="min-h-screen font-sans">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
