import { useLanguage } from "@/contexts/LanguageContext";
import { costEstimates } from "@/data/remodel-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Bath } from "lucide-react";

function fmt(n: number) {
  if (n === 0) return "—";
  return "$" + n.toLocaleString();
}

function range(low: number, high: number) {
  if (low === 0 && high === 0) return "—";
  if (low === high) return fmt(low);
  return `${fmt(low)} – ${fmt(high)}`;
}

const roomColors = {
  kitchen: "bg-amber-50 text-amber-700 border-amber-200",
  bathroom: "bg-blue-50 text-blue-700 border-blue-200",
  shared: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const roomLabels = {
  kitchen: { en: "Kitchen", zh: "厨房", vi: "Bếp", es: "Cocina" },
  bathroom: { en: "Bathroom", zh: "卫生间", vi: "P.tắm", es: "Baño" },
  shared: { en: "Shared", zh: "共用", vi: "Chung", es: "Compartido" },
};

export default function CostSection() {
  const { language, t } = useLanguage();

  const kitchenItems = costEstimates.filter((c) => c.room === "kitchen");
  const bathroomItems = costEstimates.filter((c) => c.room === "bathroom");

  const kitchenMaterialLow = kitchenItems.reduce((a, i) => a + i.materialLow, 0);
  const kitchenMaterialHigh = kitchenItems.reduce((a, i) => a + i.materialHigh, 0);
  const kitchenLaborLow = kitchenItems.reduce((a, i) => a + i.laborLow, 0);
  const kitchenLaborHigh = kitchenItems.reduce((a, i) => a + i.laborHigh, 0);

  const bathroomMaterialLow = bathroomItems.reduce((a, i) => a + i.materialLow, 0);
  const bathroomMaterialHigh = bathroomItems.reduce((a, i) => a + i.materialHigh, 0);
  const bathroomLaborLow = bathroomItems.reduce((a, i) => a + i.laborLow, 0);
  const bathroomLaborHigh = bathroomItems.reduce((a, i) => a + i.laborHigh, 0);

  const grandTotalLow = costEstimates.reduce((a, i) => a + i.materialLow + i.laborLow, 0);
  const grandTotalHigh = costEstimates.reduce((a, i) => a + i.materialHigh + i.laborHigh, 0);

  const totalMaterialLow = costEstimates.reduce((a, i) => a + i.materialLow, 0);
  const totalMaterialHigh = costEstimates.reduce((a, i) => a + i.materialHigh, 0);
  const totalLaborLow = costEstimates.reduce((a, i) => a + i.laborLow, 0);
  const totalLaborHigh = costEstimates.reduce((a, i) => a + i.laborHigh, 0);

  const summaryItems = [
    {
      label: t("costs.kitchenMaterial"),
      low: kitchenMaterialLow,
      high: kitchenMaterialHigh,
      icon: ChefHat,
      color: "border-l-amber-500",
    },
    {
      label: t("costs.kitchenLabor"),
      low: kitchenLaborLow,
      high: kitchenLaborHigh,
      icon: ChefHat,
      color: "border-l-amber-400",
    },
    {
      label: t("costs.bathroomMaterial"),
      low: bathroomMaterialLow,
      high: bathroomMaterialHigh,
      icon: Bath,
      color: "border-l-blue-500",
    },
    {
      label: t("costs.bathroomLabor"),
      low: bathroomLaborLow,
      high: bathroomLaborHigh,
      icon: Bath,
      color: "border-l-blue-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Budget Summary */}
      <div className="bg-card border border-border rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">{t("overview.totalBudget")}</h3>
          <span className="text-lg font-bold font-mono text-primary">
            {range(grandTotalLow, grandTotalHigh)}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {summaryItems.map((item) => (
            <div
              key={item.label}
              className={`bg-muted/30 border border-border rounded-md p-3 border-l-4 ${item.color}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
              </div>
              <p className="text-sm font-semibold font-mono">{range(item.low, item.high)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[140px] text-xs font-semibold">{t("costs.category")}</TableHead>
                <TableHead className="text-xs font-semibold">{t("costs.item")}</TableHead>
                <TableHead className="text-xs font-semibold text-right w-[130px]">{t("costs.materialCost")}</TableHead>
                <TableHead className="text-xs font-semibold text-right w-[130px]">{t("costs.laborCost")}</TableHead>
                <TableHead className="text-xs font-semibold text-right w-[140px]">{t("costs.total")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costEstimates.map((item) => {
                const totalLow = item.materialLow + item.laborLow;
                const totalHigh = item.materialHigh + item.laborHigh;
                return (
                  <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="py-2.5">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-medium ${roomColors[item.room]}`}
                      >
                        {roomLabels[item.room][language]}
                      </Badge>
                      <span className="block text-xs font-medium mt-1">
                        {item.category[language]}
                      </span>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <span className="text-sm">{item.item[language]}</span>
                      {item.notes && (
                        <span className="block text-[11px] text-muted-foreground mt-0.5">
                          {item.notes[language]}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm py-2.5">
                      {range(item.materialLow, item.materialHigh)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm py-2.5">
                      {range(item.laborLow, item.laborHigh)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-medium py-2.5">
                      {range(totalLow, totalHigh)}
                    </TableCell>
                  </TableRow>
                );
              })}
              {/* Grand Total Row */}
              <TableRow className="bg-primary/5 border-t-2 border-primary/20">
                <TableCell colSpan={2} className="py-3">
                  <span className="text-sm font-bold">{t("costs.grandTotal")}</span>
                </TableCell>
                <TableCell className="text-right font-mono text-sm font-bold py-3">
                  {range(totalMaterialLow, totalMaterialHigh)}
                </TableCell>
                <TableCell className="text-right font-mono text-sm font-bold py-3">
                  {range(totalLaborLow, totalLaborHigh)}
                </TableCell>
                <TableCell className="text-right font-mono text-sm font-bold text-primary py-3">
                  {range(grandTotalLow, grandTotalHigh)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
