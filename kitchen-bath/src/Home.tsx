import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import OverviewSection from "@/components/OverviewSection";
import CostSection from "@/components/CostSection";
import BOMSection from "@/components/BOMSection";
import InstructionsSection from "@/components/InstructionsSection";
import { LayoutDashboard, DollarSign, ClipboardList, FileText } from "lucide-react";

type TabId = "overview" | "costs" | "bom" | "instructions";

export default function Home() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const tabs: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "overview", label: t("nav.overview"), icon: LayoutDashboard },
    { id: "costs", label: t("nav.costs"), icon: DollarSign },
    { id: "bom", label: t("nav.bom"), icon: ClipboardList },
    { id: "instructions", label: t("nav.instructions"), icon: FileText },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Tab Navigation - Large & Obvious */}
      <div className="border-b border-border bg-card/50">
        <div className="container">
          <nav className="grid grid-cols-4 gap-0 -mb-px" aria-label="Tabs">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex flex-col items-center gap-1.5 px-2 py-4 text-sm font-semibold border-b-3 transition-colors
                    ${isActive
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/30"
                    }
                  `}
                >
                  <tab.icon className="w-6 h-6" />
                  <span className="text-xs sm:text-sm">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 py-6">
        <div className="container">
          {/* Section Title */}
          <h2 className="text-xl font-bold mb-5">
            {tabs.find((tab) => tab.id === activeTab)?.label}
          </h2>

          {/* Tab Content */}
          {activeTab === "overview" && <OverviewSection />}
          {activeTab === "costs" && <CostSection />}
          {activeTab === "bom" && <BOMSection />}
          {activeTab === "instructions" && <InstructionsSection />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-3">
        <div className="container">
          <p className="text-[11px] text-muted-foreground text-center">
            Kitchen & Bathroom Remodel Tracker — Mountain View, CA 94043
          </p>
        </div>
      </footer>
    </div>
  );
}
