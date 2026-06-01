import { useLanguage } from "@/contexts/LanguageContext";
import { AlertTriangle } from "lucide-react";
import { useState, useRef, useCallback } from "react";

const KITCHEN_FLOORPLAN = "./images/kitchen_floorplan.png";
const BATHROOM_FLOORPLAN = "./images/bathroom_floorplan.png";
const KITCHEN_RENDERING_1 = "./images/kitchen_rendering_lcounter.png";
const KITCHEN_RENDERING_2 = "./images/kitchen_rendering_sink.png";
const KITCHEN_RENDERING_3 = "./images/kitchen_rendering_entryway.png";
const BATHROOM_RENDERING = "./images/bathroom_rendering.png";

const KITCHEN_BEFORE = [
  { src: "./images/kitchen_before_1.jpg", alt: "Kitchen before - galley view" },
  { src: "./images/kitchen_before_2.jpg", alt: "Kitchen before - oven and dining" },
  { src: "./images/kitchen_before_3.jpg", alt: "Kitchen before - stove area" },
  { src: "./images/kitchen_before_4.jpg", alt: "Kitchen before - full view" },
  { src: "./images/kitchen_before_5.jpg", alt: "Kitchen before - sink and fridge" },
];

const BATHROOM_BEFORE = [
  { src: "./images/bathroom_before_1.jpg", alt: "Bathroom before - entry view" },
  { src: "./images/bathroom_before_2.jpg", alt: "Bathroom before - vanity and toilet" },
  { src: "./images/bathroom_before_3.jpg", alt: "Bathroom before - shower" },
];

function ImageModal({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const lastDistance = useRef<number | null>(null);
  const lastCenter = useRef<{ x: number; y: number } | null>(null);
  const lastSingleTouch = useRef<{ x: number; y: number } | null>(null);
  const isPanning = useRef(false);
  const imgRef = useRef<HTMLDivElement>(null);

  const getDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getCenter = (touches: React.TouchList) => ({
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
  });

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      isPanning.current = false;
      lastSingleTouch.current = null;
      lastDistance.current = getDistance(e.touches);
      lastCenter.current = getCenter(e.touches);
    } else if (e.touches.length === 1 && scale > 1) {
      e.preventDefault();
      isPanning.current = true;
      lastSingleTouch.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  }, [scale]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      isPanning.current = false;
      lastSingleTouch.current = null;
      const newDistance = getDistance(e.touches);
      const newCenter = getCenter(e.touches);

      if (lastDistance.current !== null) {
        const zoomFactor = newDistance / lastDistance.current;
        setScale((prev) => Math.min(Math.max(prev * zoomFactor, 1), 5));
      }

      if (lastCenter.current !== null && scale > 1) {
        const dx = newCenter.x - lastCenter.current.x;
        const dy = newCenter.y - lastCenter.current.y;
        setTranslate((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      }

      lastDistance.current = newDistance;
      lastCenter.current = newCenter;
    } else if (e.touches.length === 1 && isPanning.current && lastSingleTouch.current && scale > 1) {
      e.preventDefault();
      const dx = e.touches[0].clientX - lastSingleTouch.current.x;
      const dy = e.touches[0].clientY - lastSingleTouch.current.y;
      setTranslate((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      lastSingleTouch.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  }, [scale]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      lastDistance.current = null;
      lastCenter.current = null;
    }
    if (e.touches.length === 0) {
      isPanning.current = false;
      lastSingleTouch.current = null;
    }
    // Reset if zoomed out
    if (scale <= 1) {
      setTranslate({ x: 0, y: 0 });
    }
  }, [scale]);

  const handleDoubleClick = () => {
    if (scale > 1) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    } else {
      setScale(2.5);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={() => { if (scale <= 1) onClose(); }}
    >
      <div
        ref={imgRef}
        className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleClick}
      >
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl select-none"
          style={{
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            transition: scale === 1 ? "transform 0.2s ease-out" : "none",
          }}
          onClick={(e) => e.stopPropagation()}
          draggable={false}
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors text-base font-bold"
        >
          ✕
        </button>
        {scale > 1 && (
          <button
            onClick={() => { setScale(1); setTranslate({ x: 0, y: 0 }); }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 text-white text-xs font-medium hover:bg-black/80 transition-colors"
          >
            Reset Zoom
          </button>
        )}
      </div>
    </div>
  );
}

function ClickableImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      {showModal && <ImageModal src={src} alt={alt} onClose={() => setShowModal(false)} />}
      <div
        className={`rounded-md border border-border overflow-hidden cursor-pointer hover:border-primary/50 transition-colors ${className || ""}`}
        onClick={() => setShowModal(true)}
      >
        <img src={src} alt={alt} className="w-full h-auto object-cover" />
      </div>
    </>
  );
}

export default function OverviewSection() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
          {t("dim.disclaimer")}
        </p>
      </div>

      {/* Kitchen Section */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">{t("dim.kitchenDims")}</h3>
        </div>
        <div className="p-5 space-y-4">
          {/* Floor Plan */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">{t("dim.floorPlan")}</p>
            <ClickableImage src={KITCHEN_FLOORPLAN} alt="Kitchen floor plan" className="bg-white" />
          </div>
          {/* Renderings */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">{t("dim.rendering")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ClickableImage src={KITCHEN_RENDERING_1} alt="Kitchen rendering - L-counter view" />
              <ClickableImage src={KITCHEN_RENDERING_2} alt="Kitchen rendering - sink and stove view" />
              <ClickableImage src={KITCHEN_RENDERING_3} alt="Kitchen rendering - toward entryway" />
            </div>
          </div>
        </div>
      </div>

      {/* Bathroom Section */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">{t("dim.bathroomDims")}</h3>
        </div>
        <div className="p-5 space-y-4">
          {/* Floor Plan */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">{t("dim.floorPlan")}</p>
            <ClickableImage src={BATHROOM_FLOORPLAN} alt="Bathroom floor plan" className="bg-white" />
          </div>
          {/* Rendering */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">{t("dim.rendering")}</p>
            <ClickableImage src={BATHROOM_RENDERING} alt="Bathroom rendering" />
          </div>
        </div>
      </div>

      {/* Before Photos */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">{t("dim.beforePhotos")}</h3>
        </div>
        <div className="p-5 space-y-4">
          {/* Kitchen Before */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">{t("dim.kitchenBefore")}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {KITCHEN_BEFORE.map((img, i) => (
                <ClickableImage key={i} src={img.src} alt={img.alt} />
              ))}
            </div>
          </div>
          {/* Bathroom Before */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">{t("dim.bathroomBefore")}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {BATHROOM_BEFORE.map((img, i) => (
                <ClickableImage key={i} src={img.src} alt={img.alt} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
