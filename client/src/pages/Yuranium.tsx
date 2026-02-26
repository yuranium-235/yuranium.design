import { useEffect } from "react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663369013021/W6PHqEe8bVmgPywmzYh9Re/yuranium_hero_6a6505f2.jpg";
const ABOUT_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663369013021/W6PHqEe8bVmgPywmzYh9Re/yuranium_about_bg_2dd3fc8a.jpg";
const IMG_SHIPPED = "https://d2xsxph8kpxj0f.cloudfront.net/310519663369013021/W6PHqEe8bVmgPywmzYh9Re/profile_shipped_products_6b4faca4.png";
const IMG_SCORECARD = "https://d2xsxph8kpxj0f.cloudfront.net/310519663369013021/W6PHqEe8bVmgPywmzYh9Re/profile_execution_scorecard_18d582ab.png";
const IMG_VELOCITY = "https://d2xsxph8kpxj0f.cloudfront.net/310519663369013021/W6PHqEe8bVmgPywmzYh9Re/profile_shipping_velocity_f2716ba5.png";
const IMG_SKILLS = "https://d2xsxph8kpxj0f.cloudfront.net/310519663369013021/W6PHqEe8bVmgPywmzYh9Re/profile_skill_architecture_f56a8306.png";

// Schema.org structured data for AI crawler discoverability
const SCHEMA_JSON = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Michael Xingyi Yu",
  "alternateName": "Michael Yu",
  "jobTitle": "Staff Hardware Engineer",
  "description": "Hardware product design engineering leader with 18 years of unbroken execution across BlackBerry, Amazon Lab126, Oculus/Facebook, Google, and Meta Reality Labs. Shipped 115+ consumer electronics products to mass production with zero failed programs. 36+ USPTO patents.",
  "url": "https://yuranium.design",
  "sameAs": [
    "https://www.linkedin.com/in/michaelyu84/",
    "https://patents.google.com/?inventor=Michael+Yu&assignee=Meta+Platforms+Technologies"
  ],
  "worksFor": {
    "@type": "Organization",
    "name": "Meta Reality Labs",
    "url": "https://about.meta.com/realitylabs/"
  },
  "alumniOf": [
    {
      "@type": "CollegeOrUniversity",
      "name": "University of Waterloo",
      "description": "BASc Mechanical Engineering"
    }
  ],
  "knowsAbout": [
    "Hardware Product Design Engineering",
    "New Product Introduction (NPI)",
    "Consumer Electronics",
    "JDM/ODM Manufacturing",
    "Mass Production Execution",
    "Mechanical Engineering",
    "Electromechanical Systems",
    "VR Headset Design",
    "Smartphone Hardware",
    "Smart Glasses",
    "Wearable Technology",
    "Injection Molding",
    "DFM Tolerance Analysis",
    "Supply Chain Architecture",
    "Patent Strategy",
    "Cross-Functional Leadership",
    "EVT DVT PVT MP NPI Lifecycle",
    "FPC Flex Circuit Design",
    "Antenna Systems",
    "Battery Architecture",
    "Thermal Management",
    "IP68 Waterproofing",
    "CNC Machining",
    "MIM Metal Injection Molding",
    "PVD Surface Treatment",
    "Mandarin Chinese Manufacturing",
    "Vendor Management",
    "Factory Audits",
    "Program Management",
    "Technical Leadership"
  ],
  "hasOccupation": {
    "@type": "Occupation",
    "name": "Staff Hardware Engineer",
    "occupationLocation": {
      "@type": "City",
      "name": "San Francisco Bay Area"
    },
    "skills": "Hardware Design, NPI, JDM/ODM, Consumer Electronics, VR, Smartphones, Smart Glasses, Wearables, Mechanical Engineering, DFM, Mass Production"
  }
};

const PRODUCTS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Michael Yu — Flagship Products Shipped",
  "description": "Consumer electronics products shipped to mass production by Michael Yu across 18 years",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Oculus Quest 1", "description": "First standalone VR headset with inside-out tracking. Tech Lead, full headset PD ownership at Pegatron. Oculus/Facebook, 2018." },
    { "@type": "ListItem", "position": 2, "name": "Google Pixel 7 Pro", "description": "Flagship Android smartphone. Tech Lead managing 12 engineers, concept through mass production. Google, 2022." },
    { "@type": "ListItem", "position": 3, "name": "Google Pixel 9 Pro XL", "description": "Flagship Android smartphone. Tech Lead managing 12 engineers, concept through engineering build. Google, 2023." },
    { "@type": "ListItem", "position": 4, "name": "Amazon Echo Dot (1st Gen)", "description": "One of the best-selling consumer electronics products in history. Program Lead. Amazon Lab126, 2015." },
    { "@type": "ListItem", "position": 5, "name": "Amazon Echo (2nd Gen)", "description": "Mass-market smart speaker with light ring system. Program Lead. Amazon Lab126, 2015." },
    { "@type": "ListItem", "position": 6, "name": "Fire TV Cube (1st Gen)", "description": "Smart home convergence device. Program Lead. Amazon Lab126, 2016." },
    { "@type": "ListItem", "position": 7, "name": "Kindle Fire HD10 (1st Gen)", "description": "Full program leadership, 6 product designers, concept through mass production. Amazon Lab126, 2014." },
    { "@type": "ListItem", "position": 8, "name": "Ray-Ban Meta Smart Glasses (Gen 1 Fix)", "description": "Post-launch critical nose microphone occlusion issue resolution. Staff Engineer. Meta Reality Labs, 2024." },
    { "@type": "ListItem", "position": 9, "name": "Oakley Vanguard Charging Case", "description": "Rescued program 3 months behind schedule, delivered on time via JDM model. Program Lead. Meta Reality Labs, 2024." }
  ]
};

const experiences = [
  {
    company: "Meta Reality Labs",
    role: "Staff Hardware Engineer",
    period: "2023 — Present",
    color: "#1877F2",
    products: ["Ray-Ban Meta Smart Glasses", "Oakley Vanguard", "Smart Glasses Systems"],
    bullets: [
      "Resolved high-visibility post-launch nose microphone occlusion issue on Ray-Ban Meta Gen 1 under time pressure",
      "Conducted system-level architectural investigations into brand proliferation and replaceable battery strategies for smart glasses portfolio",
      "Rescued Oakley Vanguard charging case program from 3-month delay — delivered on time via JDM model",
      "Co-built dedicated charging case organization from scratch, establishing lean JDM operating model for full smart glasses product line",
      "Filed patent for smart glasses battery replacement system with reusable gasket seal (US 20260079358, 2026)"
    ]
  },
  {
    company: "Google",
    role: "Tech Lead, Hardware Product Design",
    period: "2020 — 2023",
    color: "#4285F4",
    products: ["Pixel 7 Pro", "Pixel 9 Pro XL", "Pixel Fold"],
    bullets: [
      "Led 12-engineer team delivering Pixel 7 Pro from concept through mass production — full program ownership",
      "Led Pixel 9 Pro XL from concept through first engineering build (~90% design complete)",
      "Owned full system-level design understanding across hundreds of mechanical and electronic components",
      "Drove IP68 waterproof system design, mm-level tolerance analysis, and critical design decisions across both programs"
    ]
  },
  {
    company: "Oculus / Facebook",
    role: "Tech Lead, Hardware Product Design",
    period: "2016 — 2020",
    color: "#0668E1",
    products: ["Oculus Quest 1", "Portal TV", "Portal Accessories"],
    bullets: [
      "Became singular tech lead for Oculus Quest 1 — owned all PD design, architecture, and ID items for the full headset",
      "Led daily build operations on-site at Pegatron factory during production ramp",
      "Built Oculus-Pegatron JDM operating model from the ground up — first time at this scale",
      "Named inventor on utility patents for IPD adjustment, speaker beam-steering, multi-layer housings, and HMD optics",
      "Served as PD tech lead on Portal TV architecture and concept phase"
    ]
  },
  {
    company: "Amazon Lab126",
    role: "Technical Lead Manager, Hardware Product Design",
    period: "2011 — 2016",
    color: "#FF9900",
    products: ["Echo Dot (1st Gen)", "Amazon Echo (2nd Gen)", "Fire TV Cube", "Kindle Fire HD10", "Kindle HDX 8.9\""],
    bullets: [
      "Led Kindle Fire HD10 (1st Gen) from concept to MP with 6-person PD team — first full program leadership role",
      "Delivered Amazon Echo Dot (1st Gen), Echo (2nd Gen), and Fire TV Cube (1st Gen) as program lead",
      "Owned detailed design of cameras, FPCs, PCBs, and plastic enclosures on Kindle HDX 8.9\" (in-house design)",
      "Promoted to Technical Lead Manager, managing 4 engineers directly by end of tenure"
    ]
  },
  {
    company: "BlackBerry (Research In Motion)",
    role: "Mechanical Design Engineer",
    period: "2008 — 2011",
    color: "#000000",
    products: ["100+ Accessories", "Charging Docks", "Phone Cases", "USB Cables", "Retail Demo Units"],
    bullets: [
      "Designed and shipped 100+ accessories (charging docks, cases, cables, retail demo units) through JDM/ODM model",
      "Conducted vendor audits and partner selection — built supply chain judgment that carried through entire career",
      "Named inventor on 20+ design patents covering phone skins, shells, and accessories (D606528–D653250)",
      "Filed charger device patent application (US 20120098491) — earliest IP generation, Year 1 of career"
    ]
  }
];

const patents = [
  { number: "US 20260079358", title: "Systems, Methods, and Devices for Servicing and/or Maintaining Wearable Devices", date: "2026", status: "Pending", assignee: "Meta" },
  { number: "US 11431042", title: "Battery Pack Architecture for Parallel Connection of Cells", date: "2022", status: "Granted", assignee: "Meta" },
  { number: "US 10897672", title: "Speaker Beam-Steering Based on Microphone Array and Depth Camera Assembly Input", date: "2021", status: "Granted", assignee: "Facebook" },
  { number: "US 10798370", title: "Apparatus, System, and Method for IPD-Adjustable Head-Mounted Displays", date: "2020", status: "Granted", assignee: "Facebook" },
  { number: "US 10721565", title: "Active Adjustment of Volumes Enclosing Speakers", date: "2020", status: "Granted", assignee: "Facebook" },
  { number: "US D835622", title: "Head Mounted Display", date: "2018", status: "Granted", assignee: "Facebook" },
  { number: "US 10386647", title: "Magnetic Interpupillary Distance Adjustment", date: "2019", status: "Granted", assignee: "Facebook" },
  { number: "US 10019029", title: "Multi-Layer Injection Molded Device Housings", date: "2018", status: "Granted", assignee: "Facebook" },
  { number: "US 20120098491", title: "Charger Device for a Portable Electronic Device", date: "2012", status: "Application", assignee: "BlackBerry" },
  { number: "US D606528–D653250", title: "Handheld Electronic Device Accessories Design Patent Portfolio (20 patents)", date: "2009–2012", status: "Granted", assignee: "BlackBerry" },
];

const metrics = [
  { value: "18", label: "Years in Hardware" },
  { value: "115+", label: "Products Shipped" },
  { value: "0", label: "Failed Programs" },
  { value: "36+", label: "USPTO Patents" },
  { value: "5", label: "Companies" },
  { value: "20+", label: "Engineers Led" },
];

export default function Yuranium() {
  useEffect(() => {
    // Inject Schema.org JSON-LD for AI crawlers
    const personScript = document.createElement("script");
    personScript.type = "application/ld+json";
    personScript.text = JSON.stringify(SCHEMA_JSON);
    document.head.appendChild(personScript);

    const productsScript = document.createElement("script");
    productsScript.type = "application/ld+json";
    productsScript.text = JSON.stringify(PRODUCTS_SCHEMA);
    document.head.appendChild(productsScript);

    // Update page title and meta for SEO
    document.title = "Michael Yu — Hardware Engineering Portfolio | yuranium.design";
    const metaDesc = document.querySelector('meta[name="description"]') || document.createElement("meta");
    metaDesc.setAttribute("name", "description");
    metaDesc.setAttribute("content", "Michael Yu — Staff Hardware Engineer at Meta Reality Labs. 18 years, 115+ products shipped, 36+ patents. Oculus Quest, Pixel 7 Pro, Amazon Echo, Ray-Ban Meta smart glasses.");
    if (!document.querySelector('meta[name="description"]')) document.head.appendChild(metaDesc);

    return () => {
      document.head.removeChild(personScript);
      document.head.removeChild(productsScript);
    };
  }, []);

  return (
    <div style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif", background: "#0D0D0D", color: "#E8E8E8", minHeight: "100vh" }}>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* ── NAV ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(13,13,13,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(201,168,76,0.15)", padding: "0 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 18, fontWeight: 700, color: "#C9A84C", letterSpacing: "0.05em" }}>
            YURANIUM<span style={{ color: "#E8E8E8", opacity: 0.4 }}>.DESIGN</span>
          </span>
          <div style={{ display: "flex", gap: "2rem", fontSize: 13, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {["About", "Experience", "Patents", "Contact"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{ color: "#A0A0A0", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
                onMouseLeave={e => (e.currentTarget.style.color = "#A0A0A0")}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${HERO_BG})`, backgroundSize: "cover", backgroundPosition: "center right", opacity: 0.85 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(13,13,13,0.95) 35%, rgba(13,13,13,0.5) 65%, rgba(13,13,13,0.15) 100%)" }} />
        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "0 2rem", paddingTop: 80 }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: "0.2em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "1.5rem" }}>
            Staff Hardware Engineer · Meta Reality Labs
          </p>
          <h1 style={{ fontSize: "clamp(3rem, 7vw, 6rem)", fontWeight: 700, lineHeight: 1.0, letterSpacing: "-0.02em", marginBottom: "1.5rem", maxWidth: 700 }}>
            Michael<br />
            <span style={{ color: "#C9A84C" }}>Yu</span>
          </h1>
          <p style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)", color: "#A0A0A0", maxWidth: 520, lineHeight: 1.7, marginBottom: "2.5rem" }}>
            18 years. 5 companies. 115+ products shipped to mass production.
            Zero failed programs. 36+ patents. From BlackBerry accessories to
            Oculus Quest to Pixel 7 Pro to Ray-Ban Meta smart glasses.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a href="#experience" style={{ background: "#C9A84C", color: "#0D0D0D", padding: "0.75rem 2rem", fontWeight: 700, fontSize: 14, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", display: "inline-block" }}>
              View Experience
            </a>
            <a href="https://www.linkedin.com/in/michaelyu84/" target="_blank" rel="noopener noreferrer"
              style={{ border: "1px solid rgba(201,168,76,0.4)", color: "#C9A84C", padding: "0.75rem 2rem", fontWeight: 600, fontSize: 14, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", display: "inline-block" }}>
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* ── METRICS BAR ── */}
      <section style={{ background: "#111111", borderTop: "1px solid rgba(201,168,76,0.2)", borderBottom: "1px solid rgba(201,168,76,0.2)", padding: "2.5rem 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "2rem", textAlign: "center" }}>
          {metrics.map(m => (
            <div key={m.label}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 700, color: "#C9A84C", lineHeight: 1 }}>{m.value}</div>
              <div style={{ fontSize: 12, color: "#666", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "0.5rem" }}>{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ position: "relative", padding: "6rem 2rem", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${ABOUT_BG})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.15 }} />
        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: "0.2em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "1rem" }}>01 / About</p>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "3rem", maxWidth: 700 }}>
            Hardware engineer defined by one thing: <span style={{ color: "#C9A84C" }}>shipping</span>.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", maxWidth: 1000 }}>
            <div>
              <p style={{ color: "#A0A0A0", lineHeight: 1.8, fontSize: 16, marginBottom: "1.5rem" }}>
                For 18 consecutive years across five companies — BlackBerry, Amazon Lab126, Oculus/Facebook, Google, and Meta Reality Labs — I have shipped consumer electronics into the hands of millions of customers. Every program I have owned has reached production, on schedule, at quality.
              </p>
              <p style={{ color: "#A0A0A0", lineHeight: 1.8, fontSize: 16 }}>
                My career spans the full spectrum of consumer hardware complexity — from phone accessories at BlackBerry, through tablets and smart speakers at Amazon, VR headsets at Oculus, flagship smartphones at Google, to smart glasses systems at Meta. At each step, the system complexity increased, the integration challenges deepened, and the stakes grew higher.
              </p>
            </div>
            <div>
              <p style={{ color: "#A0A0A0", lineHeight: 1.8, fontSize: 16, marginBottom: "1.5rem" }}>
                I have mastered both JDM/ODM and in-house detailed design execution models — rare in the industry. Native Mandarin fluency provides a structural advantage in China-based manufacturing partnerships, enabling unfiltered communication at the factory floor level that Western engineers operating through interpreters cannot access.
              </p>
              <div style={{ borderLeft: "2px solid #C9A84C", paddingLeft: "1.5rem", marginTop: "2rem" }}>
                <p style={{ color: "#E8E8E8", fontSize: 15, fontStyle: "italic", lineHeight: 1.7 }}>
                  "The return to JDM at Meta was not a step down — it was a strategic application of senior-level judgment to a different execution model, combined with system-level architecture work that draws on the full breadth of 18 years."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SHIPPED PRODUCTS CHART ── */}
      <section style={{ padding: "4rem 2rem", background: "#0A0A0A" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: "0.2em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "1rem" }}>Product Portfolio</p>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "2rem" }}>18 Years of Shipped Products</h2>
          <img src={IMG_SHIPPED} alt="Shipped Product Timeline — 18 years of consumer electronics shipped to mass production" style={{ width: "100%", maxWidth: 1000, display: "block", borderRadius: 4 }} />
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" style={{ padding: "6rem 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: "0.2em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "1rem" }}>02 / Experience</p>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "3rem" }}>Career History</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {experiences.map((exp, i) => (
              <ExperienceCard key={i} exp={exp} />
            ))}
          </div>
        </div>
      </section>

      {/* ── EXECUTION SCORECARD ── */}
      <section style={{ padding: "4rem 2rem", background: "#0A0A0A" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: "0.2em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "1rem" }}>Execution Record</p>
            <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "1.5rem" }}>Zero Failed Programs</h2>
            <p style={{ color: "#A0A0A0", lineHeight: 1.8, fontSize: 16, marginBottom: "1.5rem" }}>
              In 18 years, not a single program cancelled, descoped to non-shipment, or failed in production. This is not luck — it reflects a consistent approach to risk management, vendor selection, and schedule discipline applied across every NPI phase.
            </p>
            <p style={{ color: "#A0A0A0", lineHeight: 1.8, fontSize: 16 }}>
              The scorecard captures the quantitative dimensions: 115+ products shipped, zero failures, 36+ patents, and a complexity escalation arc from phone accessories to VR headsets to flagship smartphones to smart glasses systems.
            </p>
          </div>
          <img src={IMG_SCORECARD} alt="Execution Scorecard — quantitative track record across 18 years" style={{ width: "100%", borderRadius: 4 }} />
        </div>
      </section>

      {/* ── VELOCITY + SKILLS ── */}
      <section style={{ padding: "4rem 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
            <div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: "0.2em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "1rem" }}>Shipping Velocity</p>
              <img src={IMG_VELOCITY} alt="Shipping velocity comparison — cumulative products shipped over 18 years" style={{ width: "100%", borderRadius: 4 }} />
            </div>
            <div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: "0.2em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "1rem" }}>Skill Architecture</p>
              <img src={IMG_SKILLS} alt="Skill architecture — technical, leadership, and strategic competencies" style={{ width: "100%", borderRadius: 4 }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── PATENTS ── */}
      <section id="patents" style={{ padding: "6rem 2rem", background: "#0A0A0A" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: "0.2em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "1rem" }}>03 / Intellectual Property</p>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>36+ USPTO Patents</h2>
          <p style={{ color: "#666", fontSize: 15, marginBottom: "3rem", maxWidth: 600 }}>
            Continuous IP generation from Year 1 (2009) through 2026. Spanning phone accessories, VR mechanics, speaker systems, battery architecture, and smart glasses servicing.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {patents.map((p, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "180px 1fr 80px 100px", gap: "1.5rem", alignItems: "center", padding: "1.25rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#C9A84C", fontWeight: 700 }}>{p.number}</span>
                <span style={{ fontSize: 14, color: "#E8E8E8", lineHeight: 1.4 }}>{p.title}</span>
                <span style={{ fontSize: 12, color: "#666" }}>{p.date}</span>
                <span style={{ fontSize: 11, padding: "0.25rem 0.75rem", background: p.status === "Granted" ? "rgba(34,197,94,0.15)" : p.status === "Pending" ? "rgba(201,168,76,0.15)" : "rgba(100,100,100,0.15)", color: p.status === "Granted" ? "#4ade80" : p.status === "Pending" ? "#C9A84C" : "#888", borderRadius: 2, textAlign: "center", fontWeight: 600, letterSpacing: "0.05em" }}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: "6rem 2rem", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: "0.2em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "1rem" }}>04 / Contact</p>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "1.5rem" }}>Let's Connect</h2>
            <p style={{ color: "#A0A0A0", lineHeight: 1.8, fontSize: 16, marginBottom: "2rem" }}>
              Staff Hardware Engineer at Meta Reality Labs. Open to conversations about senior hardware engineering leadership roles, advisory engagements, and IP collaboration.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <a href="https://www.linkedin.com/in/michaelyu84/" target="_blank" rel="noopener noreferrer"
                style={{ background: "#C9A84C", color: "#0D0D0D", padding: "0.875rem 2.5rem", fontWeight: 700, fontSize: 14, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", display: "inline-block" }}>
                Connect on LinkedIn
              </a>
              <a href="mailto:dj.mikey.yu@gmail.com"
                style={{ border: "1px solid rgba(201,168,76,0.4)", color: "#C9A84C", padding: "0.875rem 2.5rem", fontWeight: 600, fontSize: 14, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", display: "inline-block" }}>
                Send Email
              </a>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {[
              { label: "Current Role", value: "Staff HW Engineer, Meta Reality Labs" },
              { label: "Location", value: "San Francisco Bay Area" },
              { label: "Experience", value: "18 Years, 5 Companies" },
              { label: "Email", value: "dj.mikey.yu@gmail.com" },
              { label: "Languages", value: "English, Mandarin Chinese (Native)" },
              { label: "Education", value: "BASc Mechanical Engineering, University of Waterloo" },
              { label: "Patents", value: "36+ USPTO (BlackBerry, Amazon, Meta)" },
            ].map(item => (
              <div key={item.label} style={{ padding: "1.25rem", background: "#111", borderLeft: "2px solid rgba(201,168,76,0.3)" }}>
                <div style={{ fontSize: 11, color: "#666", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{item.label}</div>
                <div style={{ fontSize: 14, color: "#E8E8E8", lineHeight: 1.4 }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#080808", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "2rem", textAlign: "center" }}>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#444", letterSpacing: "0.1em" }}>
          © 2026 MICHAEL XINGYI YU · YURANIUM.DESIGN · SAN FRANCISCO BAY AREA
        </p>
      </footer>
    </div>
  );
}

function ExperienceCard({ exp }: { exp: typeof experiences[0] }) {
  return (
    <details style={{ background: "#111", borderLeft: `3px solid ${exp.color}`, padding: "1.5rem 2rem", cursor: "pointer" }}
      onToggle={(e) => {
        const el = e.currentTarget;
        el.style.background = el.open ? "#161616" : "#111";
      }}>
      <summary style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", listStyle: "none", userSelect: "none" }}>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#E8E8E8" }}>{exp.company}</span>
            <span style={{ fontSize: 14, color: "#A0A0A0" }}>{exp.role}</span>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#666" }}>{exp.period}</span>
            <span style={{ color: "#333" }}>·</span>
            {exp.products.slice(0, 3).map(p => (
              <span key={p} style={{ fontSize: 11, color: "#888", background: "rgba(255,255,255,0.05)", padding: "0.15rem 0.5rem", borderRadius: 2 }}>{p}</span>
            ))}
          </div>
        </div>
        <span style={{ color: "#C9A84C", fontSize: 20, marginLeft: "1rem" }}>+</span>
      </summary>
      <ul style={{ marginTop: "1.5rem", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {exp.bullets.map((b, i) => (
          <li key={i} style={{ color: "#A0A0A0", fontSize: 14, lineHeight: 1.7 }}>{b}</li>
        ))}
      </ul>
    </details>
  );
}
