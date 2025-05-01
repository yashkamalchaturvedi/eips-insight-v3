import { Route, Switch } from "wouter";
import { MainLayout } from "@/layouts/main-layout";
import Dashboard from "@/pages/dashboard";
import Explorer, { ProposalDetail } from "@/pages/explorer";
import Builder from "@/pages/builder";
import Analytics from "@/pages/analytics";
import Leaderboard, { ContributorDetail } from "@/pages/leaderboard";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/explorer" component={Explorer} />
        <Route path="/explorer/:id" component={ProposalDetail} />
        <Route path="/builder" component={Builder} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route path="/leaderboard/:username" component={ContributorDetail} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

export default App;
