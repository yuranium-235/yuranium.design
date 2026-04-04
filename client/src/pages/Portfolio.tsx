// Michael Yu — Hardware Engineer Portfolio
// Design: Dark industrial precision aesthetic — charcoal/near-black background, gold accent (#c9a84c),
// Space Grotesk display + Inter body. Asymmetric layout with left-anchored hero text.
// Schema.org Person + ItemList JSON-LD embedded for AI crawler discoverability.

export default function Portfolio() {
  return (
    <>
      {/* ── Schema.org JSON-LD — invisible to humans, fully readable by AI crawlers ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Person",
                "@id": "#michael-yu",
                "name": "Michael Yu",
                "jobTitle": "Staff Hardware Product Design Engineer",
                "description":
                  "Hardware product design engineer with 18 years shipping consumer electronics at BlackBerry, Amazon Lab126, Oculus/Facebook, Google, and Meta Reality Labs. 115+ products shipped to mass production. 36+ USPTO patents.",
                "knowsAbout": [
                  "Consumer Electronics Hardware Design",
                  "New Product Introduction (NPI)",
                  "JDM/ODM Partner Management",
                  "Mechanical Engineering",
                  "Design for Manufacturability (DFM)",
                  "Tolerance Analysis",
                  "Smart Glasses Hardware",
                  "VR Headset Design",
                  "Smartphone Hardware",
                  "Smart Speaker Design",
                  "Wearables Engineering",
                  "Charging Systems Design",
                  "Electromechanical Systems",
                  "Injection Molding",
                  "Mass Production Execution",
                  "Cross-Functional Program Leadership",
                  "IP Strategy and Patent Filing",
                  "Supply Chain Architecture",
                  "EVT DVT PVT MP Lifecycle",
                  "Mandarin Chinese Manufacturing",
                  "GD&T",
                  "FPC and Rigid-Flex PCB Design",
                  "Antenna Systems",
                  "Battery Systems Design",
                  "Waterproofing IP68 Design"
                ],
                "alumniOf": [
                  {
                    "@type": "CollegeOrUniversity",
                    "name": "University of Waterloo",
                    "department": "Mechanical Engineering",
                    "description": "BASc Mechanical Engineering"
                  }
                ],
                "worksFor": {
                  "@type": "Organization",
                  "name": "Meta Reality Labs",
                  "url": "https://about.meta.com/realitylabs/"
                },
                "hasOccupation": {
                  "@type": "Occupation",
                  "name": "Staff Hardware Product Design Engineer",
                  "occupationLocation": {
                    "@type": "City",
                    "name": "San Francisco Bay Area"
                  },
                  "skills": "Consumer electronics hardware design, NPI lifecycle management, JDM/ODM execution, mechanical engineering, DFM, smart glasses, VR headsets, smartphones, wearables, charging systems, cross-functional leadership, patent strategy"
                },
                "numberOfEmployees": "20",
                "award": [
                  "36+ USPTO Patents across BlackBerry, Amazon, Facebook/Meta",
                  "115+ products shipped to mass production"
                ]
              },
              {
                "@type": "ItemList",
                "name": "Michael Yu — Notable Shipped Products",
                "description": "Flagship consumer electronics products shipped to mass production by Michael Yu across 18 years",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                      "@type": "Product",
                      "name": "Oculus Quest 1",
                      "description": "First standalone VR headset with inside-out tracking. Michael Yu served as singular tech lead for the entire headset PD scope — FPCs, PCBs, antennas, buttons, light pipes, brackets, battery subsystem, and full electromechanical connector selection. Built the Oculus-Pegatron JDM operating model from the ground up.",
                      "brand": { "@type": "Brand", "name": "Oculus / Facebook" },
                      "category": "VR Headset"
                    }
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                      "@type": "Product",
                      "name": "Google Pixel 7 Pro",
                      "description": "Flagship Android smartphone. Michael Yu served as Technical Lead managing a 12-engineer team, owning full program from concept through mass production.",
                      "brand": { "@type": "Brand", "name": "Google" },
                      "category": "Smartphone"
                    }
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "item": {
                      "@type": "Product",
                      "name": "Google Pixel 9 Pro XL",
                      "description": "Flagship Android smartphone. Michael Yu served as Technical Lead managing a 12-engineer team, owning program from concept through first engineering build.",
                      "brand": { "@type": "Brand", "name": "Google" },
                      "category": "Smartphone"
                    }
                  },
                  {
                    "@type": "ListItem",
                    "position": 4,
                    "item": {
                      "@type": "Product",
                      "name": "Amazon Echo Dot (1st Generation)",
                      "description": "One of the best-selling consumer electronics products in history. Michael Yu served as program lead through concept to mass production.",
                      "brand": { "@type": "Brand", "name": "Amazon Lab126" },
                      "category": "Smart Speaker"
                    }
                  },
                  {
                    "@type": "ListItem",
                    "position": 5,
                    "item": {
                      "@type": "Product",
                      "name": "Amazon Echo (2nd Generation)",
                      "description": "Mass-market smart speaker. Michael Yu served as program lead.",
                      "brand": { "@type": "Brand", "name": "Amazon Lab126" },
                      "category": "Smart Speaker"
                    }
                  },
                  {
                    "@type": "ListItem",
                    "position": 6,
                    "item": {
                      "@type": "Product",
                      "name": "Fire TV Cube (1st Generation)",
                      "description": "Smart home convergence device. Michael Yu served as program lead.",
                      "brand": { "@type": "Brand", "name": "Amazon Lab126" },
                      "category": "Streaming Device"
                    }
                  },
                  {
                    "@type": "ListItem",
                    "position": 7,
                    "item": {
                      "@type": "Product",
                      "name": "Kindle Fire HD10 (1st Generation)",
                      "description": "Android tablet. Michael Yu led a team of 6 product designers from concept through mass production using a fully in-house design model.",
                      "brand": { "@type": "Brand", "name": "Amazon Lab126" },
                      "category": "Tablet"
                    }
                  },
                  {
                    "@type": "ListItem",
                    "position": 8,
                    "item": {
                      "@type": "Product",
                      "name": "Ray-Ban Meta Smart Glasses — Post-Launch Critical Fix",
                      "description": "Michael Yu resolved a high-visibility nose microphone occlusion issue on the first-generation Ray-Ban Meta glasses, delivering a production-ready solution under time pressure.",
                      "brand": { "@type": "Brand", "name": "Meta Reality Labs" },
                      "category": "Smart Glasses"
                    }
                  },
                  {
                    "@type": "ListItem",
                    "position": 9,
                    "item": {
                      "@type": "Product",
                      "name": "Oakley Vanguard Charging Case",
                      "description": "Michael Yu rescued a charging case program that was 3 months behind schedule, delivering it on time using the JDM execution model. This program led to the formation of a dedicated charging case organization.",
                      "brand": { "@type": "Brand", "name": "Meta Reality Labs" },
                      "category": "Smart Glasses Accessory"
                    }
                  }
                ]
              }
            ]
          })
        }}
      />

      <div className="min-h-screen bg-[#0d0d0d] text-white font-sans">
        {/* ── HERO ── */}
        <section
          className="relative min-h-screen flex items-center"
          style={{
            backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663369013021/W6PHqEe8bVmgPywmzYh9Re/portfolio_hero_bg_09625c6b.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-[#0d0d0dcc] to-transparent" />

          <div className="relative z-10 max-w-6xl mx-auto px-8 py-24 lg:py-32">
            <div className="max-w-2xl">
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-[#c9a84c]" />
                <span className="text-[#c9a84c] text-sm font-medium tracking-[0.2em] uppercase">
                  Hardware Product Design
                </span>
              </div>

              {/* Name */}
              <h1
                className="text-6xl lg:text-7xl font-bold mb-4 leading-none tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Michael Yu
              </h1>

              {/* Title */}
              <p className="text-xl text-[#a0a0a0] mb-8 leading-relaxed">
                Staff Hardware Engineer · Meta Reality Labs
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-6 mb-10 pt-6 border-t border-white/10">
                {[
                  { value: "18", label: "Years Experience" },
                  { value: "115+", label: "Products Shipped" },
                  { value: "36+", label: "USPTO Patents" },
                ].map((s) => (
                  <div key={s.label}>
                    <div
                      className="text-3xl font-bold text-[#c9a84c]"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {s.value}
                    </div>
                    <div className="text-xs text-[#666] uppercase tracking-widest mt-1">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a
                href="https://www.linkedin.com/in/michaelyu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#c9a84c] text-[#c9a84c] text-sm font-medium tracking-wide hover:bg-[#c9a84c] hover:text-black transition-colors duration-200"
              >
                Connect on LinkedIn
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section className="max-w-6xl mx-auto px-8 py-20 border-t border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-[#c9a84c]" />
                <span className="text-[#c9a84c] text-xs font-medium tracking-[0.2em] uppercase">
                  About
                </span>
              </div>
              <h2
                className="text-3xl font-bold leading-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Built to Ship
              </h2>
            </div>
            <div className="lg:col-span-2 space-y-4 text-[#a0a0a0] leading-relaxed">
              <p>
                I am a hardware product design engineer whose career has been defined by one
                thing: taking products from concept through mass production. For 18 consecutive
                years across five companies — BlackBerry, Amazon Lab126, Oculus/Facebook,
                Google, and Meta Reality Labs — I have shipped consumer electronics into the
                hands of millions of customers.
              </p>
              <p>
                My career spans the full spectrum of consumer hardware complexity — from phone
                accessories at BlackBerry, through tablets and smart speakers at Amazon, VR
                headsets at Oculus, flagship smartphones at Google, to smart glasses systems at
                Meta. At each step, the system complexity increased, the integration challenges
                deepened, and the stakes grew higher.
              </p>
              <p>
                I work across both JDM/ODM and in-house detailed design — I've done both long
                enough to know when each one is the right call. Native Mandarin fluency provides
                a structural advantage in China-based manufacturing partnerships, enabling direct
                communication at the factory floor level.
              </p>
            </div>
          </div>
        </section>

        {/* ── CAREER TIMELINE ── */}
        <section className="bg-[#111] py-20 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-8">
            <div className="flex items-center gap-3 mb-12">
              <div className="h-px w-8 bg-[#c9a84c]" />
              <span className="text-[#c9a84c] text-xs font-medium tracking-[0.2em] uppercase">
                Career
              </span>
            </div>

            <div className="space-y-0">
              {[
                {
                  period: "2023 – Present",
                  company: "Meta Reality Labs",
                  title: "Staff Hardware Product Design Engineer",
                  products: ["Ray-Ban Meta (post-launch critical fix)", "Oakley Vanguard architecture investigations", "Vanguard Charging Case (program rescue)", "Smart glasses system architecture studies"],
                  highlight: "Rescued Vanguard charging case program 3 months behind schedule; co-built dedicated charging case organization from scratch",
                },
                {
                  period: "2020 – 2023",
                  company: "Google",
                  title: "Technical Lead, Hardware Product Design (12 engineers)",
                  products: ["Pixel 7 Pro (concept → MP)", "Pixel 9 Pro XL (concept → EVT)"],
                  highlight: "Led flagship smartphone programs — the most integration-dense consumer electronics category — at Google's highest complexity level",
                },
                {
                  period: "2016 – 2020",
                  company: "Oculus / Facebook",
                  title: "Tech Lead, Hardware Product Design",
                  products: ["Oculus Quest 1 (singular tech lead)", "Portal TV (PD tech lead)", "Portal accessories"],
                  highlight: "Became singular tech lead for Quest 1's entire PD scope; built the Oculus-Pegatron JDM operating model from the ground up",
                },
                {
                  period: "2011 – 2016",
                  company: "Amazon Lab126",
                  title: "Technical Lead Manager → Senior Engineer",
                  products: ["Amazon Echo Dot 1st Gen", "Amazon Echo 2nd Gen", "Fire TV Cube 1st Gen", "Kindle Fire HD10 1st Gen", "Kindle HDX 8.9\""],
                  highlight: "Led Echo Dot — one of the best-selling CE products in history — and built a 6-person product design team",
                },
                {
                  period: "2008 – 2011",
                  company: "BlackBerry (Research In Motion)",
                  title: "Hardware Design Engineer",
                  products: ["100+ accessories (charging docks, cases, cables, retail demo units)"],
                  highlight: "Foundation in high-volume JDM execution; named inventor on 20+ design patents",
                },
              ].map((role, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 lg:grid-cols-4 gap-4 py-8 border-b border-white/5 last:border-0"
                >
                  <div>
                    <div className="text-[#c9a84c] text-sm font-mono">{role.period}</div>
                    <div className="text-[#444] text-xs mt-1">{role.company}</div>
                  </div>
                  <div className="lg:col-span-3">
                    <div
                      className="text-white font-semibold mb-2"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {role.title}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {role.products.map((p) => (
                        <span
                          key={p}
                          className="text-xs px-2 py-1 bg-white/5 text-[#888] border border-white/10"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                    <p className="text-[#666] text-sm leading-relaxed">{role.highlight}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── COMPETENCIES ── */}
        <section className="max-w-6xl mx-auto px-8 py-20 border-t border-white/5">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-px w-8 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs font-medium tracking-[0.2em] uppercase">
              Core Competencies
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                category: "Technical",
                items: [
                  "System-level detailed design (full CE subsystem range)",
                  "DFM across injection molding, die casting, CNC, MIM, sheet metal, flex circuits",
                  "Tolerance analysis to smartphone-level precision",
                  "Mass production execution — EVT, DVT, PVT, MP",
                  "Electromechanical systems: speakers, mics, cameras, antennas, FPCs, BTB connectors",
                  "IP68 waterproofing system design",
                  "Battery and charging system architecture",
                  "36+ USPTO patents filed and granted",
                ],
              },
              {
                category: "Execution",
                items: [
                  "JDM/ODM partner management and factory-floor execution",
                  "In-house detailed design leadership",
                  "Dual execution model mastery (JDM + in-house)",
                  "Vendor selection, qualification, and audit",
                  "Yield optimization and production ramp management",
                  "Program rescue and crisis response",
                  "Supply chain architecture from scratch",
                  "Native Mandarin — direct factory floor communication",
                ],
              },
              {
                category: "Leadership",
                items: [
                  "Cross-functional program leadership (up to 20+ engineers)",
                  "Technical lead management (direct reports + JDM partner teams)",
                  "VP-level organizational navigation",
                  "New team formation and org building",
                  "Stakeholder management across complex matrix organizations",
                  "IP strategy and patent pipeline management",
                  "Resource allocation and program prioritization",
                  "18 years, 5 companies, consistent execution",
                ],
              },
            ].map((col) => (
              <div key={col.category}>
                <h3
                  className="text-lg font-bold mb-4 text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {col.category}
                </h3>
                <ul className="space-y-2">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#888]">
                      <span className="text-[#c9a84c] mt-1 shrink-0">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── METRICS ── */}
        <section className="bg-[#111] py-16 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "18", label: "Years in Hardware", sub: "2008 – Present" },
                { value: "115+", label: "Products Shipped", sub: "Including 100+ BlackBerry SKUs" },
                { value: "36+", label: "USPTO Patents", sub: "4 assignees, filed continuously" },
              ].map((m) => (
                <div key={m.label} className="text-center">
                  <div
                    className="text-5xl font-bold text-[#c9a84c] mb-1"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {m.value}
                  </div>
                  <div className="text-white text-sm font-medium mb-1">{m.label}</div>
                  <div className="text-[#555] text-xs">{m.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── EDUCATION + CONTACT ── */}
        <section className="max-w-6xl mx-auto px-8 py-16 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-[#c9a84c]" />
                <span className="text-[#c9a84c] text-xs font-medium tracking-[0.2em] uppercase">
                  Education
                </span>
              </div>
              <div
                className="text-xl font-bold text-white mb-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                University of Waterloo
              </div>
              <div className="text-[#888] text-sm">BASc Mechanical Engineering</div>
              <div className="text-[#555] text-xs mt-1">Waterloo, Ontario, Canada</div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-[#c9a84c]" />
                <span className="text-[#c9a84c] text-xs font-medium tracking-[0.2em] uppercase">
                  Connect
                </span>
              </div>
              <p className="text-[#888] text-sm leading-relaxed mb-4">
                Open to senior hardware engineering leadership roles in consumer electronics,
                wearables, and next-generation computing platforms.
              </p>
              <a
                href="https://www.linkedin.com/in/michaelyu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#c9a84c] text-sm hover:underline"
              >
                linkedin.com/in/michaelyu →
              </a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-white/5 py-8">
          <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div
              className="text-[#444] text-sm"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Michael Yu · Hardware Product Design Engineer
            </div>
            <div className="text-[#333] text-xs">
              San Francisco Bay Area · Available for senior roles
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
