import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Link, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AISignal from "./pages/AISignal";
import SpringCalculator from "./pages/SpringCalculator";
import EngineeringAnalysis from "./pages/EngineeringAnalysis";
import ScratchAssessment from "./pages/ScratchAssessment";


/** Nav bar shown only inside the spring tool sub-routes */
function SpringToolNav() {
  const [loc] = useLocation();
  const links = [
    { href: "/spring-tool",          label: "Spring Calculator" },
    { href: "/spring-tool/analysis", label: "Engineering Analysis" },
  ];
  return (
    <div
      className="shrink-0 bg-[#070910] border-b border-slate-800/60 flex items-center gap-0 px-3"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Link
        href="/"
        className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em] mr-4 hidden sm:flex items-center gap-1 hover:text-slate-300 transition-colors"
      >
        ← Program Site
      </Link>
      {links.map(l => (
        <Link
          key={l.href}
          href={l.href}
          className={`px-4 py-2 text-[11px] font-mono transition-colors border-b-2 ${
            loc === l.href
              ? "text-blue-400 border-blue-500"
              : "text-slate-600 border-transparent hover:text-slate-300 hover:border-slate-700"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}

function SpringToolLayout() {
  return (
    <div className="spring-tool-layout flex flex-col h-screen">
      <SpringToolNav />
      <div className="flex-1 overflow-hidden">
        <Switch>
          <Route path="/spring-tool"          component={SpringCalculator} />
          <Route path="/spring-tool/analysis" component={EngineeringAnalysis} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Original program risk assessment site */}
      <Route path="/"    component={Home} />
      <Route path="/404" component={NotFound} />

      {/* Spring analysis tool — separate sub-site */}
      <Route path="/spring-tool"          component={SpringToolLayout} />
      <Route path="/spring-tool/analysis" component={SpringToolLayout} />

      {/* AI Signal tracker */}
      <Route path="/ai-tracker" component={AISignal} />

      {/* Scratch & Case Protection Assessment */}
      <Route path="/scratch-assessment" component={ScratchAssessment} />

      {/* Final fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
