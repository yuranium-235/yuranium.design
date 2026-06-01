import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Language = "en" | "zh" | "vi" | "es";

type Translations = Record<string, Record<Language, string>>;

const translations: Translations = {
  // Navigation
  "nav.overview": { en: "Plans & Renderings", zh: "平面图 & 效果图", vi: "Bản vẽ & Phối cảnh", es: "Planos y Renders" },
  "nav.costs": { en: "Cost Estimates", zh: "费用估算", vi: "Ước tính chi phí", es: "Estimación de costos" },
  "nav.bom": { en: "Bill of Materials", zh: "材料清单", vi: "Danh sách vật liệu", es: "Lista de materiales" },
  "nav.instructions": { en: "Contractor Instructions", zh: "施工要求", vi: "Hướng dẫn nhà thầu", es: "Instrucciones para contratistas" },

  // Overview
  "overview.title": { en: "Kitchen & Bathroom Remodel", zh: "厨房 & 卫生间装修", vi: "Cải tạo Bếp & Phòng tắm", es: "Remodelación de cocina y baño" },
  "overview.subtitle": { en: "Project Tracker", zh: "项目跟踪", vi: "Theo dõi dự án", es: "Seguimiento del proyecto" },
  "overview.totalBudget": { en: "Total Budget", zh: "总预算", vi: "Tổng ngân sách", es: "Presupuesto total" },
  "overview.materials": { en: "Materials", zh: "材料费", vi: "Vật liệu", es: "Materiales" },
  "overview.labor": { en: "Labor", zh: "人工费", vi: "Nhân công", es: "Mano de obra" },
  "overview.kitchen": { en: "Kitchen", zh: "厨房", vi: "Nhà bếp", es: "Cocina" },
  "overview.bathroom": { en: "Bathroom", zh: "卫生间", vi: "Phòng tắm", es: "Baño" },
  "overview.shared": { en: "Shared/Consumables", zh: "共用/耗材", vi: "Chung/Vật tư tiêu hao", es: "Compartidos/Consumibles" },

  // Cost Estimates
  "costs.title": { en: "Cost Estimates", zh: "费用估算", vi: "Ước tính chi phí", es: "Estimación de costos" },
  "costs.kitchenMaterial": { en: "Kitchen Materials", zh: "厨房材料", vi: "Vật liệu bếp", es: "Materiales de cocina" },
  "costs.kitchenLabor": { en: "Kitchen Labor", zh: "厨房人工", vi: "Nhân công bếp", es: "Mano de obra cocina" },
  "costs.bathroomMaterial": { en: "Bathroom Materials", zh: "卫生间材料", vi: "Vật liệu phòng tắm", es: "Materiales de baño" },
  "costs.bathroomLabor": { en: "Bathroom Labor", zh: "卫生间人工", vi: "Nhân công phòng tắm", es: "Mano de obra baño" },
  "costs.category": { en: "Category", zh: "类别", vi: "Hạng mục", es: "Categoría" },
  "costs.item": { en: "Item", zh: "项目", vi: "Mục", es: "Artículo" },
  "costs.materialCost": { en: "Material Cost", zh: "材料费", vi: "Chi phí vật liệu", es: "Costo de materiales" },
  "costs.laborCost": { en: "Labor Cost", zh: "人工费", vi: "Chi phí nhân công", es: "Costo de mano de obra" },
  "costs.total": { en: "Total", zh: "合计", vi: "Tổng cộng", es: "Total" },
  "costs.subtotal": { en: "Subtotal", zh: "小计", vi: "Tổng phụ", es: "Subtotal" },
  "costs.grandTotal": { en: "Grand Total", zh: "总计", vi: "Tổng cộng", es: "Total general" },
  "costs.lowEst": { en: "Low Estimate", zh: "低估价", vi: "Ước tính thấp", es: "Estimación baja" },
  "costs.highEst": { en: "High Estimate", zh: "高估价", vi: "Ước tính cao", es: "Estimación alta" },
  "costs.notes": { en: "Notes", zh: "备注", vi: "Ghi chú", es: "Notas" },

  // BOM
  "bom.title": { en: "Bill of Materials", zh: "材料清单", vi: "Danh sách vật liệu", es: "Lista de materiales" },
  "bom.item": { en: "Item", zh: "项目", vi: "Mục", es: "Artículo" },
  "bom.product": { en: "Product / Spec", zh: "产品/规格", vi: "Sản phẩm/Thông số", es: "Producto / Especificación" },
  "bom.quantity": { en: "Qty", zh: "数量", vi: "SL", es: "Cant." },
  "bom.unitCost": { en: "Unit Cost", zh: "单价", vi: "Đơn giá", es: "Costo unitario" },
  "bom.totalCost": { en: "Total Cost", zh: "总价", vi: "Tổng giá", es: "Costo total" },
  "bom.status": { en: "Status", zh: "状态", vi: "Trạng thái", es: "Estado" },
  "bom.purchased": { en: "Purchased", zh: "已购买", vi: "Đã mua", es: "Comprado" },
  "bom.pending": { en: "Pending", zh: "待购买", vi: "Chờ mua", es: "Pendiente" },
  "bom.decided": { en: "Decided", zh: "已确定", vi: "Đã quyết định", es: "Decidido" },
  "bom.room": { en: "Room", zh: "房间", vi: "Phòng", es: "Habitación" },

  // Instructions
  "instr.title": { en: "Contractor Instructions", zh: "施工要求", vi: "Hướng dẫn nhà thầu", es: "Instrucciones para contratistas" },
  "instr.section": { en: "Section", zh: "章节", vi: "Phần", es: "Sección" },
  "instr.requirement": { en: "Requirement", zh: "要求", vi: "Yêu cầu", es: "Requisito" },
  "instr.prohibited": { en: "Not Acceptable", zh: "不接受", vi: "Không chấp nhận", es: "No aceptable" },
  "instr.grout": { en: "Grout", zh: "填缝剂", vi: "Keo chít mạch", es: "Lechada" },
  "instr.mortar": { en: "Thin-set Mortar", zh: "薄贴砂浆", vi: "Vữa dán gạch", es: "Mortero de capa fina" },
  "instr.waterproofing": { en: "Waterproofing", zh: "防水处理", vi: "Chống thấm", es: "Impermeabilización" },
  "instr.caulk": { en: "Caulk", zh: "密封胶", vi: "Keo trám", es: "Sellador" },
  "instr.countertop": { en: "Countertop", zh: "台面", vi: "Mặt bàn", es: "Encimera" },
  "instr.cabinets": { en: "Cabinets", zh: "橱柜", vi: "Tủ bếp", es: "Gabinetes" },
  "instr.quality": { en: "Quality Standards", zh: "施工质量标准", vi: "Tiêu chuẩn chất lượng", es: "Estándares de calidad" },

  // Dimensions
  "dim.title": { en: "Room Dimensions", zh: "房间尺寸", vi: "Kích thước phòng", es: "Dimensiones del espacio" },
  "dim.comingSoon": { en: "Dimensions will be added once measurements are taken.", zh: "测量完成后将添加尺寸信息。", vi: "Kích thước sẽ được thêm sau khi đo đạc.", es: "Las dimensiones se agregarán una vez que se tomen las medidas." },
  "dim.length": { en: "Length", zh: "长", vi: "Dài", es: "Largo" },
  "dim.width": { en: "Width", zh: "宽", vi: "Rộng", es: "Ancho" },
  "dim.height": { en: "Height", zh: "高", vi: "Cao", es: "Alto" },
  "dim.disclaimer": { en: "Note: These are rough measurements only. Exact dimensions must be collected by contractors before work begins.", zh: "注意：这些仅为粗略测量。施工前承包商必须收集精确尺寸。", vi: "Lưu ý: Đây chỉ là số đo sơ bộ. Nhà thầu phải đo chính xác trước khi bắt đầu thi công.", es: "Nota: Estas son medidas aproximadas. Los contratistas deben tomar medidas exactas antes de comenzar el trabajo." },
  "dim.floorPlan": { en: "Floor Plan", zh: "平面图", vi: "Sơ đồ mặt bằng", es: "Plano de planta" },
  "dim.rendering": { en: "Design Rendering", zh: "设计效果图", vi: "Bản vẽ thiết kế", es: "Render de diseño" },
  "dim.kitchenDims": { en: "Kitchen Dimensions", zh: "厨房尺寸", vi: "Kích thước bếp", es: "Dimensiones de cocina" },
  "dim.bathroomDims": { en: "Bathroom Dimensions", zh: "浴室尺寸", vi: "Kích thước phòng tắm", es: "Dimensiones del baño" },
  "dim.beforePhotos": { en: "Current State (Before)", zh: "现状（改造前）", vi: "Hiện trạng (Trước)", es: "Estado actual (Antes)" },
  "dim.kitchenBefore": { en: "Kitchen — Before", zh: "厨房 — 改造前", vi: "Bếp — Trước cải tạo", es: "Cocina — Antes" },
  "dim.bathroomBefore": { en: "Bathroom — Before", zh: "卫生间 — 改造前", vi: "Phòng tắm — Trước cải tạo", es: "Baño — Antes" },

  // General
  "general.language": { en: "Language", zh: "语言", vi: "Ngôn ngữ", es: "Idioma" },
  "general.english": { en: "English", zh: "English", vi: "English", es: "English" },
  "general.chinese": { en: "中文", zh: "中文", vi: "中文", es: "中文" },
  "general.vietnamese": { en: "Tiếng Việt", zh: "Tiếng Việt", vi: "Tiếng Việt", es: "Tiếng Việt" },
  "general.spanish": { en: "Español", zh: "Español", vi: "Español", es: "Español" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const validLanguages: Language[] = ["en", "zh", "vi", "es"];

function getInitialLanguage(): Language {
  // URL param takes priority
  const params = new URLSearchParams(window.location.search);
  const langParam = params.get("lang");
  if (langParam && validLanguages.includes(langParam as Language)) {
    return langParam as Language;
  }
  // Then localStorage
  const saved = localStorage.getItem("remodel-lang");
  if (saved && validLanguages.includes(saved as Language)) {
    return saved as Language;
  }
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("remodel-lang", lang);
    // Update URL to reflect current language
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState({}, "", url.toString());
  }, []);

  const t = useCallback(
    (key: string): string => {
      const entry = translations[key];
      if (!entry) return key;
      return entry[language] || entry.en || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
