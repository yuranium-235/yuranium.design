import { useLanguage } from "@/contexts/LanguageContext";
import { billOfMaterials } from "@/data/remodel-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, CircleDot, ExternalLink } from "lucide-react";

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

const statusConfig = {
  purchased: {
    icon: CheckCircle2,
    className: "text-green-600 bg-green-50 border-green-200",
  },
  decided: {
    icon: CircleDot,
    className: "text-blue-600 bg-blue-50 border-blue-200",
  },
  pending: {
    icon: Clock,
    className: "text-orange-600 bg-orange-50 border-orange-200",
  },
};

function costRange(low: number, high: number) {
  if (low === high) return `$${low.toLocaleString()}`;
  return `$${low.toLocaleString()} – $${high.toLocaleString()}`;
}

export default function BOMSection() {
  const { language, t } = useLanguage();

  const purchasedCount = billOfMaterials.filter((i) => i.status === "purchased").length;
  const decidedCount = billOfMaterials.filter((i) => i.status === "decided").length;
  const pendingCount = billOfMaterials.filter((i) => i.status === "pending").length;

  return (
    <div className="space-y-4">
      {/* Status Summary */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
          <span className="text-muted-foreground">{t("bom.purchased")}:</span>
          <span className="font-semibold">{purchasedCount}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <CircleDot className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-muted-foreground">{t("bom.decided")}:</span>
          <span className="font-semibold">{decidedCount}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <Clock className="w-3.5 h-3.5 text-orange-600" />
          <span className="text-muted-foreground">{t("bom.pending")}:</span>
          <span className="font-semibold">{pendingCount}</span>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-3">
        {billOfMaterials.map((item) => {
          const StatusIcon = statusConfig[item.status].icon;
          const statusLabel = t(`bom.${item.status}`);
          const statusColor = item.status === "purchased" ? "text-green-600" : item.status === "decided" ? "text-blue-600" : "text-orange-500";
          return (
            <div
              key={item.id}
              className="bg-card border border-border rounded-lg p-4 space-y-2"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <StatusIcon className={`w-3.5 h-3.5 ${statusColor}`} />
                  <span className="text-[11px] text-muted-foreground">{statusLabel}</span>
                </div>
                <Badge variant="outline" className={`text-[10px] ${roomColors[item.room]}`}>
                  {roomLabels[item.room][language]}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium">{item.item[language]}</p>
                {item.notes && (
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {item.notes[language]}
                  </p>
                )}
              </div>
              {item.product && (
                <p className="text-xs text-muted-foreground">
                  {item.productUrl ? (
                    <a href={item.productUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                      {item.product}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : item.product}
                </p>
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 border-t border-border/50">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[11px] text-muted-foreground">{t("bom.quantity")}:</span>
                  <span className="text-sm font-medium">{item.quantity}</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[11px] text-muted-foreground font-semibold">{t("bom.totalCost")}:</span>
                  <span className="text-sm font-mono font-bold text-primary">
                    {costRange(item.unitCostLow, item.unitCostHigh)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table (hidden on mobile) */}
      <div className="hidden md:block bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs font-semibold w-[80px]">{t("bom.status")}</TableHead>
                <TableHead className="text-xs font-semibold w-[80px]">{t("bom.room")}</TableHead>
                <TableHead className="text-xs font-semibold">{t("bom.item")}</TableHead>
                <TableHead className="text-xs font-semibold">{t("bom.product")}</TableHead>
                <TableHead className="text-xs font-semibold text-center w-[80px]">{t("bom.quantity")}</TableHead>
                <TableHead className="text-xs font-semibold text-right w-[120px]">{t("bom.totalCost")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billOfMaterials.map((item) => {
                const StatusIcon = statusConfig[item.status].icon;
                const statusLabel = t(`bom.${item.status}`);
                return (
                  <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="py-2.5">
                      <div className="flex items-center gap-1">
                        <StatusIcon className={`w-3.5 h-3.5 ${item.status === "purchased" ? "text-green-600" : item.status === "decided" ? "text-blue-600" : "text-orange-500"}`} />
                        <span className="text-[10px] text-muted-foreground">{statusLabel}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <Badge variant="outline" className={`text-[10px] ${roomColors[item.room]}`}>
                        {roomLabels[item.room][language]}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <span className="text-sm font-medium">{item.item[language]}</span>
                      {item.notes && (
                        <span className="block text-[11px] text-muted-foreground mt-0.5">
                          {item.notes[language]}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-2.5">
                      {item.productUrl ? (
                        <a href={item.productUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                          {item.product}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">{item.product}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-xs py-2.5">{item.quantity}</TableCell>
                    <TableCell className="text-right font-mono text-sm py-2.5">
                      {costRange(item.unitCostLow, item.unitCostHigh)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
