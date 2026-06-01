import type { Language } from "@/contexts/LanguageContext";

export interface CostItem {
  id: string;
  category: Record<Language, string>;
  item: Record<Language, string>;
  materialLow: number;
  materialHigh: number;
  laborLow: number;
  laborHigh: number;
  room: "kitchen" | "bathroom" | "shared";
  notes?: Record<Language, string>;
}

export interface BOMItem {
  id: string;
  item: Record<Language, string>;
  product: string;
  quantity: string;
  unitCostLow: number;
  unitCostHigh: number;
  room: "kitchen" | "bathroom" | "shared";
  status: "purchased" | "decided" | "pending";
  notes?: Record<Language, string>;
  productUrl?: string;
}

export interface InstructionSection {
  id: string;
  title: Record<Language, string>;
  items: InstructionItem[];
}

export interface InstructionItem {
  id: string;
  requirement: Record<Language, string>;
  details: Record<Language, string>;
  prohibited?: Record<Language, string>;
}

// ============ COST ESTIMATES ============
// Recalculated based on confirmed dimensions:
// Kitchen: 139" back wall + 48" extension, ~167 sq ft floor, ~47 sq ft countertop, ~30 sq ft backsplash
// Bathroom: 71" x 94" (minus ~22"x35" cutout), ~41 sq ft floor, shower 36"x36"

export const costEstimates: CostItem[] = [
  // Kitchen
  {
    id: "k1",
    category: { en: "Cabinets", zh: "橱柜", vi: "Tủ bếp", es: "Gabinetes" },
    item: { en: "Kitchen cabinets — upper (9 lin ft) + lower (18 lin ft)", zh: "厨房橱柜 — 上柜(9英尺) + 下柜(18英尺)", vi: "Tủ bếp — trên (9 ft) + dưới (18 ft)", es: "Gabinetes de cocina — superiores (9 pies) + inferiores (18 pies)" },
    materialLow: 7000,
    materialHigh: 12000,
    laborLow: 2950,
    laborHigh: 5500,
    room: "kitchen",
    notes: { en: "Upper-mid tier (KZ Kitchen / Pacific Home Decor). Plywood box, Blum hardware, soft-close. ~27 linear ft.", zh: "中高档（KZ Kitchen / Pacific Home Decor）。胶合板柜体，Blum五金，缓冲。约27英尺。", vi: "Trung-cao cấp (KZ Kitchen / Pacific Home Decor). Gỗ dán, phụ kiện Blum, đóng êm. ~27 ft.", es: "Nivel medio-alto (KZ Kitchen / Pacific Home Decor). Caja de madera contrachapada, herrajes Blum, cierre suave. ~27 pies lineales." },
  },
  {
    id: "k2",
    category: { en: "Countertops", zh: "台面", vi: "Mặt bàn", es: "Encimeras" },
    item: { en: "Quartz countertops (~47 sq ft)", zh: "石英石台面（约47平方英尺）", vi: "Mặt bàn thạch anh (~47 sq ft)", es: "Encimeras de cuarzo (~47 pies²)" },
    materialLow: 2350,
    materialHigh: 3500,
    laborLow: 1850,
    laborHigh: 3000,
    room: "kitchen",
    notes: { en: "Mid-range quartz (Caesarstone, MSI, or similar). Best price-to-quality ratio. L-shaped upper (21.6 sq ft) + lower (20.2 sq ft) + corner (5.4 sq ft). Includes fab & install.", zh: "中档石英石（Caesarstone、MSI或类似）。性价比最优。L形上台面(21.6) + 下台面(20.2) + 角柜(5.4)。含加工安装。", vi: "Thạch anh trung cấp (Caesarstone, MSI, hoặc tương tự). Tỷ lệ giá/chất lượng tốt nhất. L-hình trên (21.6) + dưới (20.2) + góc (5.4). Bao gồm gia công & lắp đặt.", es: "Cuarzo de gama media (Caesarstone, MSI o similar). Mejor relación calidad-precio. En L superior (21.6 pies²) + inferior (20.2 pies²) + esquina (5.4 pies²). Incluye fabricación e instalación." },
  },
  {
    id: "k3",
    category: { en: "Flooring", zh: "地板", vi: "Sàn nhà", es: "Pisos" },
    item: { en: "Porcelain tile flooring (~167 sq ft)", zh: "瓷砖地板（约167平方英尺）", vi: "Sàn gạch sứ (~167 sq ft)", es: "Piso de porcelanato (~167 pies²)" },
    materialLow: 840,
    materialHigh: 1670,
    laborLow: 2650,
    laborHigh: 3650,
    room: "kitchen",
    notes: { en: "Main area (137 sq ft) + right extension (30 sq ft). Large format 12x24 or 24x24.", zh: "主区域(137 sq ft) + 右侧延伸(30 sq ft)。大砖 12x24 或 24x24。", vi: "Khu chính (137 sq ft) + phần mở rộng phải (30 sq ft). Gạch lớn 12x24 hoặc 24x24.", es: "Área principal (137 pies²) + extensión derecha (30 pies²). Formato grande 12x24 o 24x24." },
  },
  {
    id: "k4",
    category: { en: "Backsplash", zh: "后挡板", vi: "Tường chắn", es: "Salpicadero" },
    item: { en: "Kitchen backsplash tile (~30 sq ft)", zh: "厨房后挡板瓷砖（约30平方英尺）", vi: "Gạch tường chắn bếp (~30 sq ft)", es: "Azulejo salpicadero de cocina (~30 pies²)" },
    materialLow: 300,
    materialHigh: 600,
    laborLow: 900,
    laborHigh: 1350,
    room: "kitchen",
    notes: { en: "Upper counter wall (minus 46\" window) + L-leg + lower counter wall + stove area.", zh: "上台面墙(减46\"窗) + L形短边 + 下台面墙 + 灶台区。", vi: "Tường trên (trừ cửa sổ 46\") + chân L + tường dưới + khu bếp.", es: "Pared del mostrador superior (menos ventana de 46\") + pata L + pared del mostrador inferior + área de estufa." },
  },
  {
    id: "k5",
    category: { en: "Sink & Faucet", zh: "水槽和水龙头", vi: "Bồn rửa & Vòi", es: "Fregadero y grifo" },
    item: { en: "Kohler undermount sink + Kohler/Moen faucet", zh: "Kohler台下盆 + Kohler/Moen水龙头", vi: "Bồn rửa âm Kohler + vòi Kohler/Moen", es: "Fregadero bajo encimera Kohler + grifo Kohler/Moen" },
    materialLow: 500,
    materialHigh: 900,
    laborLow: 400,
    laborHigh: 750,
    room: "kitchen",
    notes: { en: "Premium brands: Kohler Deerfield/Riverby sink + Kohler Sensate or Moen Align pull-down faucet.", zh: "高端品牌：Kohler Deerfield/Riverby水槽 + Kohler Sensate或Moen Align抽拉龙头。", vi: "Thương hiệu cao cấp: Bồn Kohler Deerfield/Riverby + vòi Kohler Sensate hoặc Moen Align.", es: "Marcas premium: fregadero Kohler Deerfield/Riverby + grifo Kohler Sensate o Moen Align extraíble." },
  },
  {
    id: "k6",
    category: { en: "Lighting", zh: "灯具", vi: "Đèn", es: "Iluminación" },
    item: { en: "Under-cabinet LED + recessed lights", zh: "柜下LED灯 + 嵌入式灯", vi: "Đèn LED dưới tủ + đèn âm trần", es: "LED bajo gabinete + luces empotradas" },
    materialLow: 200,
    materialHigh: 500,
    laborLow: 600,
    laborHigh: 900,
    room: "kitchen",
  },
  // Bathroom
  {
    id: "b1",
    category: { en: "Shower", zh: "淋浴", vi: "Vòi sen", es: "Ducha" },
    item: { en: "Frameless glass panel (36\" × 84\") + Kohler fixtures", zh: "无框玻璃隔断(36\" × 84\") + Kohler花洒", vi: "Kính không khung (36\" × 84\") + thiết bị Kohler", es: "Panel de vidrio sin marco (36\" × 84\") + accesorios Kohler" },
    materialLow: 1100,
    materialHigh: 2600,
    laborLow: 800,
    laborHigh: 1450,
    room: "bathroom",
    notes: { en: "36\" wide shower. Glass panel + Kohler Hydrorail rain system or equivalent.", zh: "36\"宽淋浴间。玻璃隔断 + Kohler Hydrorail花洒系统或同等。", vi: "Vòi sen rộng 36\". Kính + hệ thống Kohler Hydrorail hoặc tương đương.", es: "Ducha de 36\" de ancho. Panel de vidrio + sistema de lluvia Kohler Hydrorail o equivalente." },
  },
  {
    id: "b2",
    category: { en: "Tile", zh: "瓷砖", vi: "Gạch", es: "Azulejo" },
    item: { en: "Bathroom tile — floor (32 sq ft) + shower walls (42 sq ft) + shower floor (9 sq ft)", zh: "卫生间瓷砖 — 地面(32 sq ft) + 淋浴墙(42 sq ft) + 淋浴地面(9 sq ft)", vi: "Gạch phòng tắm — sàn (32 sq ft) + tường sen (42 sq ft) + sàn sen (9 sq ft)", es: "Azulejo de baño — piso (32 pies²) + paredes de ducha (42 pies²) + piso de ducha (9 pies²)" },
    materialLow: 610,
    materialHigh: 1170,
    laborLow: 1900,
    laborHigh: 2650,
    room: "bathroom",
    notes: { en: "~83 sq ft total. Dark marble-look porcelain walls, hex mosaic shower floor, porcelain main floor.", zh: "共约83 sq ft。深色仿大理石瓷砖墙，六角马赛克淋浴地面，瓷砖主地面。", vi: "~83 sq ft tổng. Gạch sứ giả đá cẩm thạch tối, sàn sen mosaic lục giác, sàn chính gạch sứ.", es: "~83 pies² total. Paredes de porcelanato tipo mármol oscuro, piso de ducha mosaico hexagonal, piso principal de porcelanato." },
  },
  {
    id: "b3",
    category: { en: "Vanity", zh: "浴室柜", vi: "Tủ lavabo", es: "Tocador" },
    item: { en: "Vanity cabinet (~36\" wide) + quartz top + LED mirror", zh: "浴室柜(约36\"宽) + 石英石台面 + LED镜", vi: "Tủ lavabo (~36\" rộng) + mặt thạch anh + gương LED", es: "Mueble de baño (~36\" ancho) + tapa de cuarzo + espejo LED" },
    materialLow: 650,
    materialHigh: 1600,
    laborLow: 400,
    laborHigh: 750,
    room: "bathroom",
  },
  {
    id: "b4",
    category: { en: "Toilet", zh: "马桶", vi: "Bồn cầu", es: "Inodoro" },
    item: { en: "Toto toilet (Drake or Ultramax II)", zh: "Toto马桶（Drake或Ultramax II）", vi: "Bồn cầu Toto (Drake hoặc Ultramax II)", es: "Inodoro Toto (Drake o Ultramax II)" },
    materialLow: 400,
    materialHigh: 900,
    laborLow: 300,
    laborHigh: 550,
    room: "bathroom",
    notes: { en: "Toto Drake II or Ultramax II. Elongated, comfort height, WaterSense certified.", zh: "Toto Drake II或Ultramax II。加长型，舒适高度，WaterSense认证。", vi: "Toto Drake II hoặc Ultramax II. Dài, chiều cao thoải mái, chứng nhận WaterSense.", es: "Toto Drake II o Ultramax II. Alargado, altura confortable, certificado WaterSense." },
  },
  {
    id: "b5",
    category: { en: "Waterproofing", zh: "防水", vi: "Chống thấm", es: "Impermeabilización" },
    item: { en: "RedGard waterproofing (~51 sq ft shower area)", zh: "RedGard防水涂料（约51 sq ft淋浴区）", vi: "Chống thấm RedGard (~51 sq ft khu vòi sen)", es: "Impermeabilización RedGard (~51 pies² área de ducha)" },
    materialLow: 50,
    materialHigh: 100,
    laborLow: 400,
    laborHigh: 750,
    room: "bathroom",
    notes: { en: "Shower walls (42 sq ft) + shower floor (9 sq ft).", zh: "淋浴墙(42 sq ft) + 淋浴地面(9 sq ft)。", vi: "Tường sen (42 sq ft) + sàn sen (9 sq ft).", es: "Paredes de ducha (42 pies²) + piso de ducha (9 pies²)." },
  },
  // Shared / Consumables
  {
    id: "s1",
    category: { en: "Grout", zh: "填缝剂", vi: "Keo chít mạch", es: "Lechada" },
    item: { en: "Mapei Ultracolor Plus FA (4-5 bags)", zh: "Mapei Ultracolor Plus FA（4-5袋）", vi: "Mapei Ultracolor Plus FA (4-5 bao)", es: "Mapei Ultracolor Plus FA (4-5 bolsas)" },
    materialLow: 100,
    materialHigh: 150,
    laborLow: 0,
    laborHigh: 0,
    room: "shared",
    notes: { en: "~250 sq ft total tile coverage (167 kitchen + 83 bathroom).", zh: "共约250 sq ft瓷砖覆盖（厨房167 + 卫生间83）。", vi: "~250 sq ft tổng gạch (bếp 167 + phòng tắm 83).", es: "~250 pies² de cobertura total (167 cocina + 83 baño)." },
  },
  {
    id: "s2",
    category: { en: "Thin-set Mortar", zh: "薄贴砂浆", vi: "Vữa dán gạch", es: "Mortero de capa fina" },
    item: { en: "Mapei Ultraflex LHT (8-10 bags)", zh: "Mapei Ultraflex LHT（8-10袋）", vi: "Mapei Ultraflex LHT (8-10 bao)", es: "Mapei Ultraflex LHT (8-10 bolsas)" },
    materialLow: 320,
    materialHigh: 420,
    laborLow: 0,
    laborHigh: 0,
    room: "shared",
    notes: { en: "~250 sq ft total tile. ~25 sq ft per bag.", zh: "共约250 sq ft瓷砖。每袋约25 sq ft。", vi: "~250 sq ft tổng gạch. ~25 sq ft/bao.", es: "~250 pies² total. ~25 pies² por bolsa." },
  },
  {
    id: "s3",
    category: { en: "Caulk", zh: "密封胶", vi: "Keo trám", es: "Sellador" },
    item: { en: "Mapei Keracaulk S (4-5 tubes)", zh: "Mapei Keracaulk S（4-5管）", vi: "Mapei Keracaulk S (4-5 ống)", es: "Mapei Keracaulk S (4-5 tubos)" },
    materialLow: 40,
    materialHigh: 50,
    laborLow: 0,
    laborHigh: 0,
    room: "shared",
  },
  {
    id: "s4",
    category: { en: "Cement Board", zh: "水泥板", vi: "Tấm xi măng", es: "Tablero de cemento" },
    item: { en: "Hardiebacker 1/4\" (if needed)", zh: "Hardiebacker 1/4\"（如需要）", vi: "Hardiebacker 1/4\" (nếu cần)", es: "Hardiebacker 1/4\" (si es necesario)" },
    materialLow: 80,
    materialHigh: 100,
    laborLow: 0,
    laborHigh: 0,
    room: "shared",
  },
  {
    id: "s5",
    category: { en: "Demolition", zh: "拆除", vi: "Phá dỡ", es: "Demolición" },
    item: { en: "Demo old cabinets, tile, fixtures (both rooms)", zh: "拆除旧橱柜、瓷砖、设备（两个房间）", vi: "Phá dỡ tủ cũ, gạch, thiết bị (cả hai phòng)", es: "Demoler gabinetes, azulejos y accesorios viejos (ambas habitaciones)" },
    materialLow: 0,
    materialHigh: 0,
    laborLow: 1950,
    laborHigh: 3650,
    room: "shared",
    notes: { en: "Kitchen ~167 sq ft + bathroom ~41 sq ft of existing tile/cabinets.", zh: "厨房约167 sq ft + 卫生间约41 sq ft现有瓷砖/橱柜。", vi: "Bếp ~167 sq ft + phòng tắm ~41 sq ft gạch/tủ hiện tại.", es: "Cocina ~167 pies² + baño ~41 pies² de azulejos/gabinetes existentes." },
  },
  {
    id: "s6",
    category: { en: "Disposal", zh: "垃圾清运", vi: "Xử lý rác", es: "Eliminación" },
    item: { en: "Dumpster rental & hauling", zh: "垃圾箱租赁和清运", vi: "Thuê thùng rác & vận chuyển", es: "Alquiler de contenedor y transporte" },
    materialLow: 300,
    materialHigh: 600,
    laborLow: 0,
    laborHigh: 0,
    room: "shared",
  },
];

// ============ BILL OF MATERIALS ============
// Updated quantities based on confirmed dimensions

export const billOfMaterials: BOMItem[] = [
  // Consumables (homeowner-supplied)
  {
    id: "bom1",
    item: { en: "Grout", zh: "填缝剂", vi: "Keo chít mạch", es: "Lechada" },
    product: "Mapei Ultracolor Plus FA",
    productUrl: "https://www.homedepot.com/p/Mapei-Ultracolor-Plus-FA-10-lb-5038-Avalanche-Grout-6BU503805/306139726",
    quantity: "4-5 bags (10 lb)",
    unitCostLow: 25,
    unitCostHigh: 30,
    room: "shared",
    status: "decided",
    notes: { en: "~250 sq ft total tile. Color TBD after tile selection.", zh: "共约250 sq ft瓷砖。颜色待选砖后确定。", vi: "~250 sq ft tổng gạch. Màu sắc xác định sau khi chọn gạch.", es: "~250 pies² total. Color por definir después de seleccionar azulejo." },
  },
  {
    id: "bom2",
    item: { en: "Thin-set Mortar", zh: "薄贴砂浆", vi: "Vữa dán gạch", es: "Mortero de capa fina" },
    product: "Mapei Ultraflex LHT (50 lb bags)",
    productUrl: "https://www.homedepot.com/s/mapei%20ultraflex%20lht",
    quantity: "8-10 bags",
    unitCostLow: 35,
    unitCostHigh: 42,
    room: "shared",
    status: "decided",
    notes: { en: "Coverage ~25 sq ft/bag for large format tile.", zh: "大砖覆盖率约25 sq ft/袋。", vi: "Phủ ~25 sq ft/bao cho gạch lớn.", es: "Cobertura ~25 pies²/bolsa para azulejo de formato grande." },
  },
  {
    id: "bom3",
    item: { en: "Waterproofing", zh: "防水涂料", vi: "Chống thấm", es: "Impermeabilizante" },
    product: "Custom RedGard (1 gallon)",
    productUrl: "https://www.homedepot.com/p/Custom-Building-Products-RedGard-1-Gal-Waterproofing-and-Crack-Prevention-Membrane-LQWAF1/100169081",
    quantity: "1 bucket",
    unitCostLow: 50,
    unitCostHigh: 50,
    room: "bathroom",
    status: "decided",
    notes: { en: "Covers ~51 sq ft shower area (walls + floor).", zh: "覆盖约51 sq ft淋浴区（墙+地）。", vi: "Phủ ~51 sq ft khu vòi sen (tường + sàn).", es: "Cubre ~51 pies² del área de ducha (paredes + piso)." },
  },
  {
    id: "bom4",
    item: { en: "Caulk", zh: "密封胶", vi: "Keo trám", es: "Sellador" },
    product: "Mapei Keracaulk S",
    productUrl: "https://www.homedepot.com/s/mapei%20keracaulk%20s",
    quantity: "4-5 tubes",
    unitCostLow: 8,
    unitCostHigh: 10,
    room: "shared",
    status: "decided",
  },
  {
    id: "bom5",
    item: { en: "Cement Board", zh: "水泥板", vi: "Tấm xi măng", es: "Tablero de cemento" },
    product: "Hardiebacker 1/4\"",
    productUrl: "https://www.homedepot.com/p/James-Hardie-HardieBacker-1-4-in-x-3-ft-x-5-ft-Cement-Backerboard-220022/100183556",
    quantity: "As needed",
    unitCostLow: 15,
    unitCostHigh: 20,
    room: "shared",
    status: "decided",
  },
  // Kitchen items
  {
    id: "bom6",
    item: { en: "Kitchen Cabinets", zh: "厨房橱柜", vi: "Tủ bếp", es: "Gabinetes de cocina" },
    product: "Upper-mid tier: KZ Kitchen or Pacific Home Decor (plywood, Blum, soft-close)",
    quantity: "~27 linear ft (9 upper + 18 lower)",
    unitCostLow: 7000,
    unitCostHigh: 12000,
    room: "kitchen",
    status: "pending",
    notes: { en: "Upper: 106\" run. Lower: 106\" (back wall) + 110\" (front wall).", zh: "上柜：106\"。下柜：106\"(后墙) + 110\"(前墙)。", vi: "Trên: 106\". Dưới: 106\" (tường sau) + 110\" (tường trước).", es: "Superiores: 106\". Inferiores: 106\" (pared trasera) + 110\" (pared frontal)." },
  },
  {
    id: "bom7",
    item: { en: "Kitchen Countertop", zh: "厨房台面", vi: "Mặt bàn bếp", es: "Encimera de cocina" },
    product: "Mid-range quartz (Caesarstone, MSI Calacatta, or similar)",
    quantity: "~47 sq ft",
    unitCostLow: 2350,
    unitCostHigh: 3500,
    room: "kitchen",
    status: "pending",
    notes: { en: "L-shaped upper (21.6 sq ft) + lower (20.2 sq ft) + corner (5.4 sq ft).", zh: "L形上台面(21.6) + 下台面(20.2) + 角柜(5.4)。", vi: "L-hình trên (21.6) + dưới (20.2) + góc (5.4).", es: "En L superior (21.6 pies²) + inferior (20.2 pies²) + esquina (5.4 pies²)." },
  },
  {
    id: "bom8",
    item: { en: "Kitchen Floor Tile", zh: "厨房地砖", vi: "Gạch sàn bếp", es: "Azulejo de piso de cocina" },
    product: "Large format porcelain (12x24 or 24x24)",
    quantity: "~167 sq ft + 10% waste = ~184 sq ft",
    unitCostLow: 840,
    unitCostHigh: 1670,
    room: "kitchen",
    status: "pending",
    notes: { en: "Main area 137 sq ft + extension 30 sq ft. Order 10% extra for cuts.", zh: "主区域137 sq ft + 延伸30 sq ft。多订10%用于切割。", vi: "Khu chính 137 sq ft + mở rộng 30 sq ft. Đặt thêm 10% cho cắt.", es: "Área principal 137 pies² + extensión 30 pies². Pedir 10% extra para cortes." },
  },
  {
    id: "bom9",
    item: { en: "Kitchen Backsplash", zh: "厨房后挡板", vi: "Tường chắn bếp", es: "Salpicadero de cocina" },
    product: "White subway tile or similar",
    quantity: "~30 sq ft + 10% waste = ~33 sq ft",
    unitCostLow: 300,
    unitCostHigh: 600,
    room: "kitchen",
    status: "pending",
    notes: { en: "Back wall (minus 46\" window) + L-leg + lower counter wall + stove area.", zh: "后墙(减46\"窗) + L短边 + 下台面墙 + 灶台区。", vi: "Tường sau (trừ cửa sổ 46\") + chân L + tường dưới + khu bếp.", es: "Pared trasera (menos ventana de 46\") + pata L + pared del mostrador inferior + área de estufa." },
  },
  {
    id: "bom10",
    item: { en: "Kitchen Sink", zh: "厨房水槽", vi: "Bồn rửa bếp", es: "Fregadero de cocina" },
    product: "Kohler Deerfield or Riverby (single-bowl undermount stainless)",
    quantity: "1",
    unitCostLow: 250,
    unitCostHigh: 500,
    room: "kitchen",
    status: "pending",
    notes: { en: "Premium brand. Stainless steel, sound-dampening.", zh: "高端品牌。不锈钢，隔音。", vi: "Thương hiệu cao cấp. Inox, cách âm.", es: "Marca premium. Acero inoxidable, aislamiento acústico." },
  },
  {
    id: "bom11",
    item: { en: "Kitchen Faucet", zh: "厨房水龙头", vi: "Vòi bếp", es: "Grifo de cocina" },
    product: "Kohler Sensate or Moen Align (matte black pull-down)",
    quantity: "1",
    unitCostLow: 250,
    unitCostHigh: 450,
    room: "kitchen",
    status: "pending",
    notes: { en: "Touchless or pull-down. Matte black finish.", zh: "感应式或抽拉式。哑光黑。", vi: "Cảm ứng hoặc kéo xuống. Màu đen mờ.", es: "Sin contacto o extraíble. Acabado negro mate." },
  },
  // Bathroom items
  {
    id: "bom12",
    item: { en: "Frameless Glass Panel", zh: "无框玻璃隔断", vi: "Kính không khung", es: "Panel de vidrio sin marco" },
    product: "Clear tempered glass, matte black hardware",
    quantity: "1 panel (36\" × 84\")",
    unitCostLow: 800,
    unitCostHigh: 1800,
    room: "bathroom",
    status: "pending",
    notes: { en: "36\" wide to match shower width.", zh: "36\"宽，匹配淋浴间宽度。", vi: "Rộng 36\" phù hợp vòi sen.", es: "36\" de ancho para coincidir con el ancho de la ducha." },
  },
  {
    id: "bom13",
    item: { en: "Shower Wall Tile", zh: "淋浴墙砖", vi: "Gạch tường vòi sen", es: "Azulejo de pared de ducha" },
    product: "Dark charcoal marble-look porcelain",
    quantity: "~42 sq ft + 10% waste = ~46 sq ft",
    unitCostLow: 340,
    unitCostHigh: 630,
    room: "bathroom",
    status: "pending",
    notes: { en: "2 walls × 36\" × 84\" high. Floor-to-ceiling tile.", zh: "2面墙 × 36\" × 84\"高。地砖到顶。", vi: "2 tường × 36\" × 84\" cao. Gạch từ sàn đến trần.", es: "2 paredes × 36\" × 84\" de alto. Azulejo de piso a techo." },
  },
  {
    id: "bom14",
    item: { en: "Shower Floor Tile", zh: "淋浴地砖", vi: "Gạch sàn vòi sen", es: "Azulejo de piso de ducha" },
    product: "Hexagonal mosaic",
    quantity: "~9 sq ft + 10% waste = ~10 sq ft",
    unitCostLow: 110,
    unitCostHigh: 230,
    room: "bathroom",
    status: "pending",
    notes: { en: "36\" × 36\" shower base.", zh: "36\" × 36\"淋浴底座。", vi: "Đáy vòi sen 36\" × 36\".", es: "Base de ducha de 36\" × 36\"." },
  },
  {
    id: "bom15",
    item: { en: "Bathroom Floor Tile", zh: "卫生间地砖", vi: "Gạch sàn phòng tắm", es: "Azulejo de piso de baño" },
    product: "Porcelain tile (matching kitchen style)",
    quantity: "~32 sq ft + 10% waste = ~35 sq ft",
    unitCostLow: 160,
    unitCostHigh: 320,
    room: "bathroom",
    status: "pending",
    notes: { en: "Room floor minus shower area (41 - 9 = 32 sq ft).", zh: "房间地面减淋浴区(41 - 9 = 32 sq ft)。", vi: "Sàn phòng trừ khu sen (41 - 9 = 32 sq ft).", es: "Piso del baño menos área de ducha (41 - 9 = 32 pies²)." },
  },
  {
    id: "bom16",
    item: { en: "Toilet", zh: "马桶", vi: "Bồn cầu", es: "Inodoro" },
    product: "Toto Drake II or Ultramax II (elongated, comfort height)",
    quantity: "1",
    unitCostLow: 400,
    unitCostHigh: 900,
    room: "bathroom",
    status: "pending",
    notes: { en: "Toto premium. Backed against right wall, facing left. WaterSense certified.", zh: "Toto高端。靠右墙，面向左。WaterSense认证。", vi: "Toto cao cấp. Dựa tường phải, quay trái. Chứng nhận WaterSense.", es: "Toto premium. Contra la pared derecha, mirando a la izquierda. Certificado WaterSense." },
  },
  {
    id: "bom17",
    item: { en: "Vanity Cabinet", zh: "浴室柜", vi: "Tủ lavabo", es: "Mueble de baño" },
    product: "Modern floating vanity with quartz top",
    quantity: "1 (~36\" wide)",
    unitCostLow: 500,
    unitCostHigh: 1200,
    room: "bathroom",
    status: "pending",
    notes: { en: "~36\" wide to fit vanity area. Under window.", zh: "约36\"宽，适合洗手台区域。窗户下方。", vi: "~36\" rộng phù hợp khu lavabo. Dưới cửa sổ.", es: "~36\" de ancho para el área del tocador. Debajo de la ventana." },
  },
  {
    id: "bom18",
    item: { en: "LED Mirror", zh: "LED镜子", vi: "Gương LED", es: "Espejo LED" },
    product: "Backlit LED mirror with anti-fog",
    quantity: "1",
    unitCostLow: 150,
    unitCostHigh: 400,
    room: "bathroom",
    status: "pending",
  },
  {
    id: "bom19",
    item: { en: "Rain Showerhead", zh: "花洒", vi: "Vòi sen mưa", es: "Regadera de lluvia" },
    product: "Kohler Hydrorail rain system (matte black) or equivalent",
    quantity: "1 set",
    unitCostLow: 300,
    unitCostHigh: 600,
    room: "bathroom",
    status: "pending",
    notes: { en: "Kohler Hydrorail or Moen Nebia. Rain head + handheld combo.", zh: "Kohler Hydrorail或Moen Nebia。花洒 + 手持组合。", vi: "Kohler Hydrorail hoặc Moen Nebia. Vòi mưa + tay cầm.", es: "Kohler Hydrorail o Moen Nebia. Cabezal de lluvia + combo de mano." },
  },
];

// ============ CONTRACTOR INSTRUCTIONS ============

export const contractorInstructions: InstructionSection[] = [
  {
    id: "sec1",
    title: { en: "Grout", zh: "填缝剂", vi: "Keo chít mạch", es: "Lechada" },
    items: [
      {
        id: "i1",
        requirement: { en: "Product: Mapei Ultracolor Plus FA", zh: "产品：Mapei Ultracolor Plus FA", vi: "Sản phẩm: Mapei Ultracolor Plus FA", es: "Producto: Mapei Ultracolor Plus FA" },
        details: { en: "Use for ALL tile joints — kitchen floor, bathroom floor, shower walls, backsplash. No sealing required.", zh: "所有瓷砖缝隙统一使用 — 厨房地砖、卫生间地砖、淋浴墙砖、后挡板。免密封。", vi: "Dùng cho TẤT CẢ mạch gạch — sàn bếp, sàn phòng tắm, tường vòi sen, tường chắn. Không cần trám kín.", es: "Usar para TODAS las juntas — piso de cocina, piso de baño, paredes de ducha, salpicadero. No requiere sellado." },
        prohibited: { en: "Do NOT use regular sanded grout. Do NOT use epoxy grout (too difficult to work with for large areas).", zh: "不要使用普通砂浆填缝剂。不要使用环氧填缝剂（大面积施工太难操作）。", vi: "KHÔNG dùng keo chít mạch thường. KHÔNG dùng keo epoxy (quá khó cho diện tích lớn).", es: "NO usar lechada con arena regular. NO usar lechada epoxi (demasiado difícil para áreas grandes)." },
      },
      {
        id: "i2",
        requirement: { en: "Joint width: 1/16\" for rectified tile, 1/8\" for non-rectified", zh: "缝宽：精修砖1/16\"，非精修砖1/8\"", vi: "Độ rộng mạch: 1/16\" cho gạch chỉnh, 1/8\" cho gạch không chỉnh", es: "Ancho de junta: 1/16\" para azulejo rectificado, 1/8\" para no rectificado" },
        details: { en: "Use matching color spacers. Remove spacers before grouting. Clean grout haze within 15 minutes.", zh: "使用配色十字卡。填缝前取出十字卡。15分钟内清除灰雾。", vi: "Dùng miếng đệm cùng màu. Lấy miếng đệm trước khi chít. Lau bụi trong 15 phút.", es: "Usar separadores del color correspondiente. Retirar separadores antes de aplicar lechada. Limpiar residuos en 15 minutos." },
      },
    ],
  },
  {
    id: "sec2",
    title: { en: "Thin-set Mortar", zh: "薄贴砂浆", vi: "Vữa dán gạch", es: "Mortero de capa fina" },
    items: [
      {
        id: "i3",
        requirement: { en: "Product: Mapei Ultraflex LHT", zh: "产品：Mapei Ultraflex LHT", vi: "Sản phẩm: Mapei Ultraflex LHT", es: "Producto: Mapei Ultraflex LHT" },
        details: { en: "Use 1/4\" × 3/8\" square-notch trowel for large format floor tile. Back-butter tiles larger than 12\". Mix to peanut-butter consistency.", zh: "大砖用1/4\" × 3/8\"方齿镘刀。大于12\"的砖背面涂浆。搅拌至花生酱稠度。", vi: "Dùng bay răng vuông 1/4\" × 3/8\" cho gạch lớn. Phết mặt sau gạch >12\". Trộn đặc như bơ đậu phộng.", es: "Usar llana de muesca cuadrada 1/4\" × 3/8\" para azulejo grande. Aplicar mortero en el reverso de azulejos mayores de 12\". Mezclar a consistencia de mantequilla de maní." },
        prohibited: { en: "Do NOT use mastic/premixed adhesive for floor tile or wet areas. Do NOT thin the mix with extra water.", zh: "地砖或潮湿区域不要使用预混胶。不要加水稀释。", vi: "KHÔNG dùng keo trộn sẵn cho sàn hoặc khu ẩm. KHÔNG pha loãng thêm nước.", es: "NO usar masilla/adhesivo premezclado para piso o áreas húmedas. NO diluir la mezcla con agua extra." },
      },
    ],
  },
  {
    id: "sec3",
    title: { en: "Waterproofing", zh: "防水", vi: "Chống thấm", es: "Impermeabilización" },
    items: [
      {
        id: "i4",
        requirement: { en: "Product: Custom Building Products RedGard", zh: "产品：Custom Building Products RedGard", vi: "Sản phẩm: Custom Building Products RedGard", es: "Producto: Custom Building Products RedGard" },
        details: { en: "Apply 2 coats to shower walls and floor (~51 sq ft). Each coat must dry to uniform dark red before next coat. Extend 3\" beyond shower curb.", zh: "淋浴墙和地面涂2层（约51 sq ft）。每层干透呈均匀深红色后再涂下一层。延伸至淋浴挡水条外3\"。", vi: "Phết 2 lớp lên tường và sàn sen (~51 sq ft). Mỗi lớp khô đỏ đậm đều trước khi phết lớp tiếp. Kéo dài 3\" ngoài bậc sen.", es: "Aplicar 2 capas en paredes y piso de ducha (~51 pies²). Cada capa debe secar a rojo oscuro uniforme antes de la siguiente. Extender 3\" más allá del borde de la ducha." },
        prohibited: { en: "Do NOT tile over RedGard before it is fully cured (dark red, no pink spots). Do NOT apply in one thick coat.", zh: "RedGard未完全固化（深红色，无粉色斑点）前不要贴砖。不要一次涂太厚。", vi: "KHÔNG ốp gạch khi RedGard chưa khô hoàn toàn (đỏ đậm, không có đốm hồng). KHÔNG phết một lớp dày.", es: "NO colocar azulejo sobre RedGard antes de que esté completamente curado (rojo oscuro, sin manchas rosadas). NO aplicar en una capa gruesa." },
      },
    ],
  },
  {
    id: "sec4",
    title: { en: "Countertop", zh: "台面", vi: "Mặt bàn", es: "Encimera" },
    items: [
      {
        id: "i5",
        requirement: { en: "Material: White quartz with subtle marble veining (~47 sq ft total)", zh: "材料：白色石英石带细微大理石纹（共约47 sq ft）", vi: "Vật liệu: Thạch anh trắng vân đá nhẹ (~47 sq ft tổng)", es: "Material: Cuarzo blanco con vetas sutiles de mármol (~47 pies² total)" },
        details: { en: "L-shaped upper counter (21.6 sq ft) + lower counter (20.2 sq ft) + corner cabinet (5.4 sq ft). Undermount sink cutout. Polished finish.", zh: "L形上台面(21.6 sq ft) + 下台面(20.2 sq ft) + 角柜(5.4 sq ft)。台下盆开孔。抛光面。", vi: "L-hình trên (21.6 sq ft) + dưới (20.2 sq ft) + góc (5.4 sq ft). Cắt lỗ bồn rửa âm. Mặt bóng.", es: "Mostrador superior en L (21.6 pies²) + mostrador inferior (20.2 pies²) + gabinete esquinero (5.4 pies²). Corte para fregadero bajo encimera. Acabado pulido." },
        prohibited: { en: "No visible seams in countertop runs under 10 ft. No rough edges on sink cutout.", zh: "10英尺以内的台面不允许可见接缝。水槽开孔边缘不允许粗糙。", vi: "Không có mối nối thấy được trên mặt bàn dưới 10 ft. Không có cạnh thô ở lỗ bồn rửa.", es: "Sin costuras visibles en tramos menores de 10 pies. Sin bordes ásperos en el corte del fregadero." },
      },
    ],
  },
  {
    id: "sec5",
    title: { en: "Cabinets", zh: "橱柜", vi: "Tủ bếp", es: "Gabinetes" },
    items: [
      {
        id: "i6",
        requirement: { en: "Box: 3/4\" plywood construction (no particle board, no MDF for box)", zh: "柜体：3/4\"胶合板（不接受刨花板、不接受MDF柜体）", vi: "Thân tủ: Gỗ dán 3/4\" (không dùng ván dăm, không MDF cho thân)", es: "Caja: Construcción de madera contrachapada de 3/4\" (sin aglomerado, sin MDF para la caja)" },
        details: { en: "Interior: Finished plywood or melamine-coated. Adjustable shelves with shelf pins. All exposed edges banded.", zh: "内部：成品胶合板或三聚氰胺贴面。可调节层板带层板钉。所有外露边缘封边。", vi: "Bên trong: Gỗ dán hoàn thiện hoặc phủ melamine. Kệ điều chỉnh được. Tất cả cạnh lộ phải dán viền.", es: "Interior: Madera contrachapada terminada o recubierta de melamina. Estantes ajustables con pines. Todos los bordes expuestos con canto." },
        prohibited: { en: "No particle board boxes. No exposed raw edges. No thermofoil doors.", zh: "不接受刨花板柜体。不接受裸露未封边。不接受热塑膜门板。", vi: "KHÔNG dùng ván dăm. KHÔNG để cạnh thô lộ. KHÔNG dùng cửa thermofoil.", es: "Sin cajas de aglomerado. Sin bordes crudos expuestos. Sin puertas de termofoil." },
      },
      {
        id: "i7",
        requirement: { en: "Color: Light gray (similar to rendering)", zh: "颜色：浅灰色（参照效果图）", vi: "Màu: Xám nhạt (tương tự bản vẽ)", es: "Color: Gris claro (similar al render)" },
        details: { en: "Shaker-style or flat-panel doors. Matte black handles/pulls (bar-style, 5-6\" for drawers, 3-4\" for doors).", zh: "摇门式或平板门。哑光黑把手（条形，抽屉5-6\"，门3-4\"）。", vi: "Cửa kiểu shaker hoặc phẳng. Tay nắm đen mờ (thanh, ngăn kéo 5-6\", cửa 3-4\").", es: "Puertas estilo shaker o panel plano. Tiradores/jaladores negro mate (estilo barra, 5-6\" para cajones, 3-4\" para puertas)." },
      },
      {
        id: "i8",
        requirement: { en: "Drawers: Dovetail joints, soft-close full-extension slides (Blum or equivalent)", zh: "抽屉：燕尾榫连接，全展开缓冲滑轨（Blum或同等）", vi: "Ngăn kéo: Mộng đuôi én, ray trượt mở hết êm (Blum hoặc tương đương)", es: "Cajones: Uniones de cola de milano, guías de extensión completa con cierre suave (Blum o equivalente)" },
        details: { en: "Doors: Soft-close concealed hinges (Blum Clip-Top or equivalent). Door thickness ≥ 3/4\". No thermofoil.", zh: "门板：隐藏式缓冲铰链（Blum Clip-Top或同等）。门板厚度 ≥ 3/4\"。不接受热塑膜。", vi: "Cửa: Bản lề ẩn đóng êm (Blum Clip-Top hoặc tương đương). Độ dày cửa ≥ 3/4\". Không dùng thermofoil.", es: "Puertas: Bisagras ocultas con cierre suave (Blum Clip-Top o equivalente). Grosor de puerta ≥ 3/4\". Sin termofoil." },
        prohibited: { en: "No roller-type side-mount slides. No staple-gun-only drawer boxes. No exposed hinges.", zh: "不接受滚轮式侧装滑轨。不接受钉枪直接钉合的抽屉。不接受外露式铰链。", vi: "KHÔNG dùng ray lăn gắn bên. KHÔNG dùng ngăn kéo chỉ ghim. KHÔNG dùng bản lề lộ.", es: "Sin guías laterales de rodillo. Sin cajones solo con grapas. Sin bisagras expuestas." },
      },
      {
        id: "i9",
        requirement: { en: "Installation: Mount to wall studs with 3\" screws (min 2 per cabinet)", zh: "安装：用3\"螺丝固定到墙内木龙骨（每柜至少2颗）", vi: "Lắp đặt: Bắt vít 3\" vào thanh gỗ tường (tối thiểu 2 vít/tủ)", es: "Instalación: Montar en montantes de pared con tornillos de 3\" (mín. 2 por gabinete)" },
        details: { en: "Level all cabinets with shims (tolerance ≤ 1/16\"). Install filler strips, toe kick, and crown molding. Adjust all doors for even gaps.", zh: "用垫片调平所有柜体（误差 ≤ 1/16\"）。安装收口条、踢脚板和顶线。调整所有门板缝隙均匀。", vi: "Cân bằng tất cả tủ bằng miếng chêm (dung sai ≤ 1/16\"). Lắp nẹp che, chân tủ, và đường viền trên. Điều chỉnh tất cả cửa cho khe đều.", es: "Nivelar todos los gabinetes con cuñas (tolerancia ≤ 1/16\"). Instalar tiras de relleno, zócalo y moldura. Ajustar todas las puertas para espacios uniformes." },
      },
    ],
  },
  {
    id: "sec6",
    title: { en: "Quality Standards", zh: "施工质量标准", vi: "Tiêu chuẩn chất lượng", es: "Estándares de calidad" },
    items: [
      {
        id: "i10",
        requirement: { en: "Tile flatness: Adjacent tile height difference ≤ 1/32\"", zh: "瓷砖平整度：相邻砖高差 ≤ 1/32\"", vi: "Độ phẳng gạch: Chênh lệch chiều cao gạch kề ≤ 1/32\"", es: "Planitud del azulejo: Diferencia de altura entre azulejos adyacentes ≤ 1/32\"" },
        details: { en: "0% hollow spots (tap test). Uniform joint width using spacers. Cut edges smooth, no chipping. Symmetrical layout — cut tiles in least visible locations.", zh: "空鼓率0%（敲击检测）。使用十字卡确保缝宽均匀。切割边光滑无崩角。对称排列，非整砖放在不显眼位置。", vi: "0% điểm rỗng (gõ kiểm tra). Mạch đều dùng miếng đệm. Cạnh cắt mịn, không sứt. Bố trí đối xứng — gạch cắt ở vị trí ít thấy.", es: "0% puntos huecos (prueba de golpe). Ancho de junta uniforme usando separadores. Bordes cortados lisos, sin astillas. Diseño simétrico — azulejos cortados en ubicaciones menos visibles." },
      },
      {
        id: "i11",
        requirement: { en: "Grouting: Joints completely filled, no haze on tile surface", zh: "填缝：缝隙填满，瓷砖表面无灰雾", vi: "Chít mạch: Mạch đầy hoàn toàn, không có bụi trên bề mặt gạch", es: "Lechada: Juntas completamente llenas, sin residuos en la superficie del azulejo" },
        details: { en: "Consistent color throughout. Waterproofing must be uniform dark red when dry with no thin spots.", zh: "全部区域颜色一致。防水干燥后应为均匀深红色，无薄点。", vi: "Màu sắc đồng nhất. Chống thấm phải đỏ đậm đều khi khô, không có điểm mỏng.", es: "Color consistente en todo. La impermeabilización debe ser rojo oscuro uniforme cuando esté seca, sin puntos delgados." },
      },
    ],
  },
];
