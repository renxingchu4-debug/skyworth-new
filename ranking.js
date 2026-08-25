/* =========================================================
 * ranking.js — Ranking Dashboard React app.
 * Loaded as <script type="text/babel" data-presets="react" src="./ranking.js?v=...">
 * Exposes window.rankingApp = { mount, unmount, isMounted } for the SPA shell.
 * ========================================================= */
      const { useEffect, useMemo, useRef, useState, useCallback } = React;
      const h = React.createElement;

      /* =====================================================================
       *  ICONS — inline SVG components (Lucide-style, unified stroke)
       * ===================================================================== */
      const ic = (children, props = {}) => h("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: 24, height: 24, viewBox: "0 0 24 24",
        fill: "none", stroke: "currentColor", strokeWidth: 1.8,
        strokeLinecap: "round", strokeLinejoin: "round",
        ...props,
      }, ...children);

      const Icon = {
        Calendar:     (p) => ic([h("rect", { x: 3, y: 4, width: 18, height: 18, rx: 2, ry: 2 }), h("line", { x1: 16, y1: 2, x2: 16, y2: 6 }), h("line", { x1: 8, y1: 2, x2: 8, y2: 6 }), h("line", { x1: 3, y1: 10, x2: 21, y2: 10 })], p),
        ChevronDown:  (p) => ic([h("polyline", { points: "6 9 12 15 18 9" })], p),
        Info:         (p) => ic([h("circle", { cx: 12, cy: 12, r: 10 }), h("line", { x1: 12, y1: 16, x2: 12, y2: 12 }), h("line", { x1: 12, y1: 8, x2: 12.01, y2: 8 })], p),
        GraduationCap:(p) => ic([h("path", { d: "M22 10L12 5 2 10l10 5 10-5z" }), h("path", { d: "M6 12v5c2 1.5 4 2 6 2s4-.5 6-2v-5" })], p),
        ShoppingCart: (p) => ic([h("circle", { cx: 9, cy: 21, r: 1 }), h("circle", { cx: 20, cy: 21, r: 1 }), h("path", { d: "M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" })], p),
        Store:        (p) => ic([h("path", { d: "M3 9l1.6-5A2 2 0 0 1 6.5 3h11a2 2 0 0 1 1.9 1L21 9" }), h("path", { d: "M4 9v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" }), h("path", { d: "M3 9h18" }), h("path", { d: "M9 21V13h6v8" })], p),
        Trophy:       (p) => ic([h("path", { d: "M8 21h8M12 17v4" }), h("path", { d: "M7 4h10v5a5 5 0 0 1-10 0V4z" }), h("path", { d: "M5 4H3v3a3 3 0 0 0 3 3" }), h("path", { d: "M19 4h2v3a3 3 0 0 1-3 3" })], p),
        ArrowRight:   (p) => ic([h("line", { x1: 5, y1: 12, x2: 19, y2: 12 }), h("polyline", { points: "12 5 19 12 12 19" })], p),
        ArrowUpRight: (p) => ic([h("line", { x1: 7, y1: 17, x2: 17, y2: 7 }), h("polyline", { points: "7 7 17 7 17 17" })], p),
        Target:       (p) => ic([h("circle", { cx: 12, cy: 12, r: 10 }), h("circle", { cx: 12, cy: 12, r: 6 }), h("circle", { cx: 12, cy: 12, r: 2 })], p),
        X:            (p) => ic([h("line", { x1: 18, y1: 6, x2: 6, y2: 18 }), h("line", { x1: 6, y1: 6, x2: 18, y2: 18 })], p),
        CheckCircle2: (p) => ic([h("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), h("polyline", { points: "22 4 12 14.01 9 11.01" })], p),
        Search:       (p) => ic([h("circle", { cx: 11, cy: 11, r: 8 }), h("line", { x1: 21, y1: 21, x2: 16.65, y2: 16.65 })], p),
        TrendingUp:   (p) => ic([h("polyline", { points: "23 6 13.5 15.5 8.5 10.5 1 18" }), h("polyline", { points: "17 6 23 6 23 12" })], p),
        TrendingDown: (p) => ic([h("polyline", { points: "23 18 13.5 8.5 8.5 13.5 1 6" }), h("polyline", { points: "17 18 23 18 23 12" })], p),
        Minus:        (p) => ic([h("line", { x1: 5, y1: 12, x2: 19, y2: 12 })], p),
        Crown:        (p) => ic([h("path", { d: "M3 6l4 4 5-7 5 7 4-4-1 13H4z" })], p),
        Sparkles:     (p) => ic([h("path", { d: "M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" })], p),
      };

      /* =====================================================================
       *  MOCK DATA LAYER
       *  Replace `api` with real fetches later; UI consumes same shape.
       * ===================================================================== */
      const AVATAR = (seed) => `https://i.pravatar.cc/160?img=${seed}`;

      const baseNamesLearning = [
        ["María González", 1], ["Carlos Méndez", 2], ["Juan Pérez", 3],
        ["Andrés Ramírez", 4], ["Laura Fernández", 5],
        ["Camila Torres", 6], ["Diego Salazar", 7], ["Valentina Cruz", 8],
        ["Sebastián Ortiz", 9], ["Daniela Vargas", 10],
        ["Mateo Ríos", 11], ["Sofía Mendoza", 12], ["Tomás Herrera", 13],
        ["Isabella Pérez", 14], ["Joaquín Castillo", 15],
        ["Lucía Romero", 16], ["Felipe Acosta", 17], ["Renata Silva", 18],
        ["Hernán Vega", 19], ["Paula Navarro", 20],
      ];

      const baseNamesSales = [
        ["Carlos Méndez", 2], ["María González", 1], ["Juan Pérez", 3],
        ["Andrés Ramírez", 4], ["Laura Fernández", 5],
        ["Camila Torres", 6], ["Diego Salazar", 7], ["Valentina Cruz", 8],
        ["Sebastián Ortiz", 9], ["Daniela Vargas", 10],
        ["Mateo Ríos", 11], ["Sofía Mendoza", 12], ["Tomás Herrera", 13],
        ["Isabella Pérez", 14], ["Joaquín Castillo", 15],
        ["Lucía Romero", 16], ["Felipe Acosta", 17], ["Renata Silva", 18],
        ["Hernán Vega", 19], ["Paula Navarro", 20],
      ];

      const baseStores = [
        ["Bogotá Store A", "Bogotá", 128],
        ["Medellín Store B", "Medellín", 116],
        ["Cali Store C", "Cali", 103],
        ["Barranquilla Store D", "Barranquilla", 97],
        ["Bucaramanga Store E", "Bucaramanga", 89],
        ["Cartagena Store F", "Cartagena", 81],
        ["Pereira Store G", "Pereira", 78],
        ["Manizales Store H", "Manizales", 73],
        ["Cúcuta Store I", "Cúcuta", 71],
        ["Santa Marta Store J", "Santa Marta", 68],
        ["Ibagué Store K", "Ibagué", 64],
        ["Neiva Store L", "Neiva", 60],
        ["Villavicencio Store M", "Villavicencio", 57],
        ["Pasto Store N", "Pasto", 53],
        ["Armenia Store O", "Armenia", 49],
        ["Tunja Store P", "Tunja", 45],
        ["Popayán Store Q", "Popayán", 42],
        ["Sincelejo Store R", "Sincelejo", 38],
        ["Valledupar Store S", "Valledupar", 35],
        ["Riohacha Store T", "Riohacha", 32],
      ];

      const trend = (i, salt) => {
        const t = (i * 7 + salt) % 7;
        if (t < 2) return "up";
        if (t < 4) return "down";
        return "flat";
      };

      function buildRanking(list, baseScore, unit, salt) {
        return list.map(([name, seed], i) => {
          const rank = i + 1;
          const score = Math.max(20, Math.round(baseScore * Math.pow(0.88, i) - i * 2));
          const change = ((i * 3 + salt) % 6) - 2;
          return {
            rank, name,
            avatar: unit === "STORE" ? null : AVATAR(((seed + salt) % 70) + 1),
            store:  unit === "STORE" ? name.split(" ").slice(0, -1).join(" ") : null,
            score, unit,
            trend: trend(i, salt),
            change,
          };
        });
      }

      const MOCK_DATA = {
        thisMonth: {
          learning: buildRanking(baseNamesLearning, 1320, "XP", 1),
          sales:    buildRanking(baseNamesSales,    44,   "TV", 2),
          stores:   buildRanking(baseStores,        132,  "%",  3),
        },
        lastMonth: {
          learning: buildRanking(baseNamesLearning, 1410, "XP", 4),
          sales:    buildRanking(baseNamesSales,    51,   "TV", 5),
          stores:   buildRanking(baseStores,        128,  "%",  6),
        },
        thisWeek: {
          learning: buildRanking(baseNamesLearning, 320, "XP", 7),
          sales:    buildRanking(baseNamesSales,    12,  "TV", 8),
          stores:   buildRanking(baseStores,        33,  "%",  9),
        },
        lastWeek: {
          learning: buildRanking(baseNamesLearning, 305, "XP", 10),
          sales:    buildRanking(baseNamesSales,    14,  "TV", 11),
          stores:   buildRanking(baseStores,        31,  "%",  12),
        },
        thisQuarter: {
          learning: buildRanking(baseNamesLearning, 3720,  "XP", 13),
          sales:    buildRanking(baseNamesSales,    128,   "TV", 14),
          stores:   buildRanking(baseStores,        340,   "%",  15),
        },
        thisYear: {
          learning: buildRanking(baseNamesLearning, 14200, "XP", 16),
          sales:    buildRanking(baseNamesSales,    510,   "TV", 17),
          stores:   buildRanking(baseStores,        1295,  "%",  18),
        },
      };

      const CURRENT_USER = {
        learning: { rank: 12, current: 640, gap: 80,  next: 11, max: 720 },
        sales:    { rank: 8,  current: 31,  gap: 4,   next: 7,  max: 35  },
        stores:   { rank: 3,  current: 97,  gap: 6,   next: 2,  max: 103 },
      };

      const PERIOD_OPTIONS = [
        { value: "thisMonth",   label: "Este mes" },
        { value: "lastMonth",   label: "Último mes" },
        { value: "thisWeek",    label: "Esta semana" },
        { value: "lastWeek",    label: "Última semana" },
        { value: "thisQuarter", label: "Este trimestre" },
        { value: "thisYear",    label: "Este año" },
      ];

      // Mock async loader, ready to swap for fetch()
      const api = {
        fetchRanking(period) {
          return new Promise((resolve) => {
            setTimeout(() => resolve(MOCK_DATA[period] || MOCK_DATA.thisMonth), 700);
          });
        },
        fetchCurrentUser() {
          return new Promise((resolve) => setTimeout(() => resolve(CURRENT_USER), 200));
        },
      };

      /* =====================================================================
       *  PRIMITIVES
       * ===================================================================== */
      function cn(...xs) { return xs.filter(Boolean).join(" "); }
      const numberFmt = (n) => new Intl.NumberFormat("es-MX").format(n);

      function useCountUp(target, duration = 900) {
        const [val, setVal] = useState(0);
        useEffect(() => {
          let raf, start;
          const tick = (ts) => {
            if (!start) start = ts;
            const t = Math.min(1, (ts - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setVal(Math.round((target) * eased));
            if (t < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
          return () => cancelAnimationFrame(raf);
        }, [target, duration]);
        return val;
      }

      function Avatar({ src, name, size = 56, ring = null, storeIcon = false }) {
        const initials = (name || "").split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();
        if (storeIcon || !src) {
          return h("div", {
            className: cn(
              "relative grid place-items-center rounded-full bg-primary-50 text-primary font-semibold border border-white shrink-0",
              ring
            ),
            style: { width: size, height: size },
            title: name,
          }, h(Icon.Store, { width: Math.round(size * 0.46), height: Math.round(size * 0.46) }));
        }
        return h("div", {
          className: cn(
            "relative rounded-full overflow-hidden bg-primary-50 border border-white shrink-0",
            ring
          ),
          style: { width: size, height: size },
          title: name,
        },
          h("img", {
            src, alt: name, width: size, height: size, loading: "lazy",
            className: "w-full h-full object-cover",
            onError: (e) => { e.currentTarget.style.display = "none"; },
          }),
          h("span", { className: "absolute inset-0 grid place-items-center text-primary font-semibold" }, initials)
        );
      }

      function Medal({ rank }) {
        const colors = {
          1: { bg: "#F4B942", glow: "rgba(244,185,66,.30)" },
          2: { bg: "#B8C0CC", glow: "rgba(184,192,204,.28)" },
          3: { bg: "#C77E4B", glow: "rgba(199,126,75,.28)" },
        }[rank] || { bg: "#E3EAF3", glow: "rgba(0,0,0,0)" };
        return h("div", {
          className: "w-7 h-7 rounded-full grid place-items-center font-bold text-white text-[13px] shadow-sm shrink-0",
          style: { background: colors.bg, boxShadow: `0 4px 10px ${colors.glow}` },
        }, rank);
      }

      function TrendPill({ trend, change }) {
        if (trend === "up") return h("span", { className: "inline-flex items-center gap-0.5 text-[11px] font-semibold text-green-600" },
          h(Icon.TrendingUp, { width: 12, height: 12 }), " ", Math.abs(change));
        if (trend === "down") return h("span", { className: "inline-flex items-center gap-0.5 text-[11px] font-semibold text-red-500" },
          h(Icon.TrendingDown, { width: 12, height: 12 }), " ", Math.abs(change));
        return h("span", { className: "inline-flex items-center gap-0.5 text-[11px] font-semibold text-sub" },
          h(Icon.Minus, { width: 12, height: 12 }), " —");
      }

      /* =====================================================================
       *  HEADER + DATE FILTER
       * ===================================================================== */
      function Header({ period, onPeriod, loading }) {
        const [open, setOpen] = useState(false);
        const ref = useRef(null);
        useEffect(() => {
          const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
          document.addEventListener("mousedown", onDoc);
          return () => document.removeEventListener("mousedown", onDoc);
        }, []);
        const current = PERIOD_OPTIONS.find(o => o.value === period);

        return h("header", { className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6" },
          h("div", null,
            h("div", { className: "flex items-center gap-3" },
              h("h1", { className: "display font-extrabold tracking-tight text-navy text-3xl sm:text-4xl" }, "RANKING"),
              h("span", { className: "hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-primary-50 text-primary border border-primary-100" },
                h(Icon.Sparkles, { width: 12, height: 12 }), " Beta"
              )
            ),
            h("p", { className: "mt-1 text-sub text-sm" }, "Compite · Aprende · Crece")
          ),

          h("div", { ref, className: "relative" },
            h("button", {
              onClick: () => setOpen(o => !o),
              className: cn(
                "inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-line shadow-card text-ink font-semibold text-sm",
                "hover:border-primary-200 transition min-w-[148px]"
              ),
              "aria-haspopup": "listbox",
              "aria-expanded": open,
            },
              h(Icon.Calendar, { width: 16, height: 16, className: "text-primary" }),
              h("span", { className: "text-left flex-1" }, current ? current.label : "Periodo"),
              h(Icon.ChevronDown, {
                width: 16, height: 16,
                className: cn("text-sub transition", open && "rotate-180"),
              })
            ),
            open && h("ul", {
              role: "listbox",
              className: "absolute right-0 mt-2 w-52 rounded-xl bg-white border border-line shadow-card-hover overflow-hidden z-30 fade",
            },
              PERIOD_OPTIONS.map(opt =>
                h("li", { key: opt.value },
                  h("button", {
                    role: "option",
                    "aria-selected": opt.value === period,
                    onClick: () => { onPeriod(opt.value); setOpen(false); },
                    className: cn(
                      "w-full text-left px-3.5 py-2.5 text-sm flex items-center justify-between hover:bg-bg",
                      opt.value === period && "text-primary font-semibold bg-primary-50/60"
                    ),
                  },
                    h("span", null, opt.label),
                    opt.value === period && h(Icon.CheckCircle2, { width: 16, height: 16 })
                  )
                )
              )
            ),
            loading && h("div", { className: "absolute -bottom-5 right-1 text-[11px] text-sub inline-flex items-center gap-1" },
              h("span", { className: "w-1.5 h-1.5 rounded-full bg-primary animate-pulse" }),
              " Actualizando…"
            )
          )
        );
      }

      /* =====================================================================
       *  RANKING LIST (Top 5)
       * ===================================================================== */
      function RankingList({ items, unit, storeIcon, onSeeMore }) {
        const top = items ? items.slice(0, 5) : [];
        if (top.length === 0) {
          return h("div", { className: "flex flex-col items-center justify-center py-10 text-center" },
            h("div", { className: "w-16 h-16 rounded-full bg-bg grid place-items-center mb-3" },
              h(Icon.Search, { width: 24, height: 24, className: "text-sub" })
            ),
            h("p", { className: "text-ink font-semibold" }, "No hay datos disponibles"),
            h("p", { className: "text-sub text-sm mt-1" }, "Pronto verás nuevos resultados aquí.")
          );
        }
        return h("div", null,
          h("ol", { className: "divide-y divide-line" },
            top.map((it) =>
              h("li", { key: it.rank, className: "flex items-center gap-3 py-2.5" },
                it.rank <= 3
                  ? h(Medal, { rank: it.rank })
                  : h("div", { className: "w-7 h-7 rounded-full bg-bg grid place-items-center text-ink font-semibold text-[13px] shrink-0" }, it.rank),
                h(Avatar, {
                  src: it.avatar,
                  name: it.name,
                  size: 40,
                  storeIcon: storeIcon || !it.avatar,
                }),
                h("div", { className: "flex-1 min-w-0" },
                  h("p", { className: "text-ink font-semibold text-[14px] leading-tight line-clamp-1" }, it.name),
                  it.store && h("p", { className: "text-sub text-[11px]" }, it.store)
                ),
                h("div", { className: "text-right shrink-0" },
                  h("div", { className: "text-primary font-extrabold text-[14px] tabular-nums" },
                    numberFmt(it.score),
                    h("span", { className: "text-ink-soft font-semibold" }, " ", unit)
                  )
                )
              )
            )
          ),
          h("button", {
            onClick: onSeeMore,
            className: "mt-3 inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:text-primary-600 transition group",
          },
            "Ver ranking completo ",
            h(Icon.ArrowRight, { width: 16, height: 16, className: "arrow-shift" })
          )
        );
      }

      /* =====================================================================
       *  PODIUM
       * ===================================================================== */
      function shade(hex, percent) {
        const f = parseInt(hex.replace("#",""), 16);
        const t = percent < 0 ? 0 : 255;
        const p = Math.abs(percent) / 100;
        const R = f >> 16, G = (f >> 8) & 0x00FF, B = f & 0x0000FF;
        const r = Math.round((t - R) * p) + R;
        const g = Math.round((t - G) * p) + G;
        const b = Math.round((t - B) * p) + B;
        return "#" + (0x1000000 + (r<<16) + (g<<8) + b).toString(16).slice(1);
      }

      function Podium({ items, unit, ctaText, palette }) {
        const p1 = items[0], p2 = items[1], p3 = items[2];
        return h("div", {
          className: "relative rounded-2xl p-5 overflow-hidden grain",
          style: { background: palette.bg, boxShadow: `0 20px 40px ${palette.glow}` },
        },
          h("div", { className: "confetti" },
            h("i", { style: { left: "8%",  animationDelay: "-1s" } }),
            h("i", { style: { left: "18%", animationDelay: "-3s" } }),
            h("i", { style: { left: "30%", animationDelay: "-5s" } }),
            h("i", { style: { left: "44%", animationDelay: "-2s" } }),
            h("i", { style: { left: "58%", animationDelay: "-6s" } }),
            h("i", { style: { left: "70%", animationDelay: "-1.4s" } }),
            h("i", { style: { left: "82%", animationDelay: "-3.5s" } }),
            h("i", { style: { left: "92%", animationDelay: "-4.5s" } })
          ),
          h("div", {
            className: "absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-60 blur-3xl pointer-events-none",
            style: { background: "radial-gradient(circle, rgba(244,185,66,.55), transparent 60%)" },
          }),
          h("div", { className: "relative grid grid-cols-3 gap-3 items-end pt-2" },
            h(PodiumSlot, { rank: 2, item: p2, unit, height: 92, avatarRing: palette.silverRing, podiumColor: "#C5CAD3", podiumNumber: "#475569" }),
            h(PodiumSlot, { rank: 1, item: p1, unit, height: 132, avatarRing: palette.goldRing, podiumColor: palette.barColor, podiumNumber: "#FFFFFF", crown: true }),
            h(PodiumSlot, { rank: 3, item: p3, unit, height: 68, avatarRing: palette.bronzeRing, podiumColor: "#C77E4B", podiumNumber: "#FFFFFF" })
          ),
          h("div", {
            className: cn(
              "relative mt-4 -mx-2 -mb-2 rounded-b-xl py-3 px-4 text-center text-white text-sm font-semibold",
              palette.ctaClass
            ),
          }, "↗ ", ctaText)
        );
      }

      function PodiumSlot({ rank, item, unit, height, avatarRing, podiumColor, podiumNumber, crown }) {
        if (!item) return h("div", { className: "opacity-0" });
        return h("div", { className: "flex flex-col items-center gap-2" },
          h("div", { className: "relative" },
            crown && h("div", { className: "absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-gold grid place-items-center shadow-md border-2 border-white" },
              h(Icon.Crown, { width: 14, height: 14, className: "text-white" })
            ),
            h(Avatar, {
              src: item.avatar,
              name: item.name,
              size: 72,
              ring: avatarRing,
              storeIcon: !item.avatar,
            })
          ),
          h("div", { className: "text-center min-w-0 px-1" },
            h("p", { className: "text-white font-semibold text-[13px] line-clamp-1" }, item.name),
            h("p", { className: "text-white/85 text-[12px] font-medium tabular-nums" },
              numberFmt(item.score), " ", h("span", { className: "text-white/70" }, unit)
            )
          ),
          h("div", {
            className: "w-full rounded-t-lg rounded-b-none grid place-items-center font-extrabold text-2xl text-white",
            style: {
              background: `linear-gradient(180deg, ${podiumColor} 0%, ${shade(podiumColor, -16)} 100%)`,
              height: height,
              boxShadow: "inset 0 -6px 0 rgba(0,0,0,.10), 0 6px 14px rgba(0,0,0,.12)",
            }
          }, rank)
        );
      }

      /* =====================================================================
       *  RANKING SECTION (left list + right podium)
       * ===================================================================== */
      function RankingSection({ idx, icon, accent, label, sublabel, items, unit, storeIcon, onSeeMore, theme, skeleton }) {
        const palette = theme === "green"
          ? {
              bg: "linear-gradient(160deg, #1F4D33 0%, #256F47 60%, #35A853 140%)",
              glow: "rgba(53,168,83,.30)",
              goldRing: "ring-green",
              silverRing: "ring-silver",
              bronzeRing: "ring-bronze",
              barColor: "#35A853",
              ctaClass: "green-cta",
            }
          : {
              bg: "linear-gradient(160deg, #142B55 0%, #1E3E78 60%, #1769E0 130%)",
              glow: "rgba(23,105,224,.28)",
              goldRing: "ring-gold",
              silverRing: "ring-silver",
              bronzeRing: "ring-bronze",
              barColor: "#1769E0",
              ctaClass: "cta-bar",
            };
        const ctaText =
          theme === "green"
            ? "¡Tu tienda puede lograr aún más!"
            : idx === 1
              ? "¡Cada venta te acerca al primer lugar!"
              : "¡Sigue aprendiendo para ser el número 1!";

        const IconComp = icon;

        return h("section", {
          className: cn(
            "grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6",
            "rounded-2xl bg-white border border-line shadow-card p-5 lg:p-7",
            "transition hover:shadow-card-hover hover:-translate-y-0.5 hover:border-primary-100",
            "rise"
          )
        },
          h("div", { className: "lg:col-span-5 flex flex-col" },
            h("div", { className: "flex items-start gap-3" },
              h("div", { className: cn("w-11 h-11 rounded-xl grid place-items-center text-white shrink-0", accent) },
                h(IconComp, { width: 20, height: 20 })
              ),
              h("div", { className: "min-w-0 flex-1" },
                h("div", { className: "flex items-center gap-2 flex-wrap" },
                  h("h2", { className: "display font-extrabold text-navy text-[15px] tracking-wider" }, label),
                  h("button", {
                    className: "text-sub hover:text-primary transition",
                    title: "Más información",
                    "aria-label": "Más información",
                  }, h(Icon.Info, { width: 16, height: 16 }))
                ),
                h("p", { className: "text-sub text-[13px] mt-0.5" }, sublabel)
              )
            ),
            h("div", { className: "mt-5" },
              skeleton
                ? h(PodiumListSkeleton, null)
                : h(RankingList, { items, unit, storeIcon, onSeeMore })
            )
          ),
          h("div", { className: "lg:col-span-7" },
            skeleton
              ? h(PodiumSkeleton, null)
              : h(Podium, { items: items ? items.slice(0, 3) : [], unit, ctaText, palette })
          )
        );
      }

      function PodiumListSkeleton() {
        return h("div", null,
          [1,2,3,4,5].map(i =>
            h("div", { key: i, className: "flex items-center gap-3 py-2.5" },
              h("div", { className: "skeleton w-7 h-7 rounded-full" }),
              h("div", { className: "skeleton w-10 h-10 rounded-full" }),
              h("div", { className: "skeleton h-3 flex-1" }),
              h("div", { className: "skeleton h-3 w-16" })
            )
          )
        );
      }

      function PodiumSkeleton() {
        return h("div", { className: "rounded-2xl border border-line p-6" },
          h("div", { className: "grid grid-cols-3 gap-3 items-end" },
            h("div", { className: "flex flex-col items-center gap-2" },
              h("div", { className: "skeleton w-[72px] h-[72px] rounded-full" }),
              h("div", { className: "skeleton h-3 w-24" }),
              h("div", { className: "skeleton h-10 w-full" })
            ),
            h("div", { className: "flex flex-col items-center gap-2" },
              h("div", { className: "skeleton w-[72px] h-[72px] rounded-full" }),
              h("div", { className: "skeleton h-3 w-24" }),
              h("div", { className: "skeleton h-16 w-full" })
            ),
            h("div", { className: "flex flex-col items-center gap-2" },
              h("div", { className: "skeleton w-[72px] h-[72px] rounded-full" }),
              h("div", { className: "skeleton h-3 w-24" }),
              h("div", { className: "skeleton h-7 w-full" })
            )
          )
        );
      }

      /* =====================================================================
       *  TU RANKING  (dark navy card with 3 personal sub-cards)
       * ===================================================================== */
      function PersonalCard({ title, icon: SmallIcon, accent, data, suffix, ctaLabel, target, onCTA }) {
        const score = useCountUp(data.current, 1100);
        const pct = Math.min(100, Math.round(((data.max - data.gap) / data.max) * 100));
        return h("div", {
          className: "rounded-2xl bg-white/[0.06] border border-white/10 p-5 backdrop-blur-[2px]"
        },
          h("div", { className: "flex items-center gap-2" },
            h("div", { className: cn("w-9 h-9 rounded-lg grid place-items-center text-white", accent) },
              h(SmallIcon, { width: 16, height: 16 })
            ),
            h("p", { className: "text-white/85 text-[12px] tracking-wider font-semibold uppercase" }, title)
          ),
          h("div", { className: "mt-3 flex items-end justify-between gap-3" },
            h("div", null,
              h("p", { className: "text-white/70 text-[11px]" }, "Rank"),
              h("p", { className: "display font-extrabold text-white text-3xl leading-none" }, "#", numberFmt(data.rank))
            ),
            h("div", { className: "text-right" },
              h("p", { className: "text-white/70 text-[11px]" }, "Actual"),
              h("p", { className: "display font-bold text-white text-lg tabular-nums" },
                numberFmt(score),
                h("span", { className: "text-white/60 text-sm" }, " ", suffix)
              )
            )
          ),
          h("div", { className: "mt-4" },
            h("p", { className: "text-white/70 text-[11px] mb-1.5" },
              h("span", { className: "text-white font-semibold" }, data.gap), " ", suffix,
              " para llegar al #", data.next
            ),
            h("div", { className: "ribbon-track" },
              h("div", { className: "ribbon-fill", style: { width: pct + "%" } })
            )
          ),
          h("button", {
            onClick: () => onCTA(target),
            className: "mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white text-navy font-bold text-[13px] hover:bg-primary-50 hover:text-primary-700 transition group",
          },
            ctaLabel,
            h(Icon.ArrowRight, { width: 14, height: 14, className: "arrow-shift" })
          )
        );
      }

      function MyRanking({ user, onCTA }) {
        return h("section", {
          className: "relative rounded-3xl overflow-hidden text-white p-6 lg:p-8 rise",
          style: {
            background: "linear-gradient(135deg, #0E2042 0%, #142B55 45%, #1E3E78 100%)",
            boxShadow: "0 30px 60px rgba(14,32,66,.30)",
          }
        },
          h("div", {
            className: "absolute -top-12 -right-12 w-72 h-72 rounded-full opacity-30 blur-3xl pointer-events-none",
            style: { background: "radial-gradient(circle, rgba(23,105,224,.6), transparent 60%)" },
          }),
          h("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative" },
            h("div", { className: "lg:col-span-3" },
              h("div", { className: "flex items-center gap-3" },
                h("div", { className: "w-11 h-11 rounded-xl bg-gold grid place-items-center text-navy shadow-md" },
                  h("span", { className: "text-xl" }, "⭐")
                ),
                h("div", null,
                  h("h2", { className: "display font-extrabold text-white text-2xl tracking-wider" }, "TU RANKING"),
                  h("p", { className: "text-white/70 text-sm" }, "Tu posición actual en cada categoría")
                )
              ),
              h("div", { className: "mt-6 relative grid place-items-center" },
                h("div", { className: "relative" },
                  h("div", {
                    className: "absolute inset-0 rounded-full blur-2xl opacity-50",
                    style: { background: "radial-gradient(circle, rgba(244,185,66,.6), transparent 65%)" },
                  }),
                  h("div", { className: "relative w-32 h-32 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 grid place-items-center shadow-2xl border-4 border-white/15" },
                    h(Icon.Trophy, { width: 56, height: 56, className: "text-white", strokeWidth: 1.4 })
                  ),
                  h(Icon.Sparkles, { width: 28, height: 28, className: "absolute -top-2 -right-1 text-gold" }),
                  h(Icon.Sparkles, { width: 20, height: 20, className: "absolute -bottom-1 -left-3 text-gold/80" })
                ),
                h("p", { className: "mt-4 text-center text-white/85 text-base" },
                  "¡Tú puedes estar en el ",
                  h("span", { className: "text-cyan-300 font-extrabold" }, "primer lugar"),
                  "!"
                )
              )
            ),
            h("div", { className: "lg:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-4" },
              h(PersonalCard, {
                title: "Puntos de aprendizaje", icon: Icon.GraduationCap, accent: "bg-primary",
                data: user.learning, suffix: "XP",
                ctaLabel: "Seguir aprendiendo →", target: "learning", onCTA,
              }),
              h(PersonalCard, {
                title: "Ventas personales", icon: Icon.ShoppingCart, accent: "bg-cyan-500",
                data: user.sales, suffix: "TVs",
                ctaLabel: "Seguir vendiendo →", target: "sales", onCTA,
              }),
              h(PersonalCard, {
                title: "Cumplimiento de tienda", icon: Icon.Store, accent: "bg-green-500",
                data: user.stores, suffix: "%",
                ctaLabel: "Ver plan de acción →", target: "stores", onCTA,
              }),
            )
          )
        );
      }

      /* =====================================================================
       *  MODAL shell
       * ===================================================================== */
      function Modal({ open, onClose, title, subtitle, children, footer, size = "md" }) {
        useEffect(() => {
          if (!open) return;
          const onKey = (e) => e.key === "Escape" && onClose();
          document.addEventListener("keydown", onKey);
          document.body.style.overflow = "hidden";
          return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
        }, [open, onClose]);
        if (!open) return null;
        return h("div", { className: "fixed inset-0 z-50 grid place-items-center p-3 fade" },
          h("div", { className: "absolute inset-0 bg-navy/45", onClick: onClose }),
          h("div", {
            role: "dialog", "aria-modal": "true",
            className: cn(
              "relative bg-white rounded-2xl shadow-2xl border border-line w-full pop overflow-hidden",
              size === "md" && "max-w-2xl",
              size === "lg" && "max-w-3xl",
              size === "xl" && "max-w-4xl"
            ),
          },
            h("div", { className: "flex items-start justify-between p-5 lg:p-6 border-b border-line" },
              h("div", { className: "min-w-0" },
                h("h3", { className: "display font-extrabold text-navy text-xl" }, title),
                subtitle && h("p", { className: "text-sub text-sm mt-0.5" }, subtitle)
              ),
              h("button", {
                onClick: onClose,
                className: "w-9 h-9 rounded-lg grid place-items-center text-sub hover:bg-bg hover:text-ink transition",
                "aria-label": "Cerrar",
              }, h(Icon.X, { width: 16, height: 16 }))
            ),
            h("div", { className: "max-h-[70vh] overflow-y-auto scroll-shadow p-5 lg:p-6" }, children),
            footer && h("div", { className: "border-t border-line p-5 lg:p-6 bg-bg flex items-center justify-end gap-2" }, footer)
          )
        );
      }

      function RankingDetailModal({ open, onClose, data }) {
        const tabs = [
          { id: "learning", label: "Puntos de aprendizaje", icon: Icon.GraduationCap, unit: "XP" },
          { id: "sales",    label: "Ventas personales",     icon: Icon.ShoppingCart,  unit: "TV" },
          { id: "stores",   label: "Cumplimiento de tienda", icon: Icon.Store,        unit: "%"  },
        ];
        const [tab, setTab] = useState(tabs[0].id);
        const current = tabs.find(t => t.id === tab);
        const rows = (data && data[tab]) || [];
        return h(Modal, {
          open, onClose,
          title: "Ranking completo",
          subtitle: "Top 20 actualizado del periodo seleccionado",
          size: "lg",
          footer: h("button", {
            onClick: onClose,
            className: "px-4 py-2 rounded-lg text-sm font-semibold border border-line bg-white hover:bg-bg transition",
          }, "Cerrar")
        },
          h("div", { className: "flex flex-wrap gap-2 mb-5" },
            tabs.map(t =>
              h("button", {
                key: t.id,
                onClick: () => setTab(t.id),
                className: cn(
                  "inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold border transition",
                  tab === t.id
                    ? "bg-navy text-white border-navy shadow-card"
                    : "bg-white text-ink border-line hover:border-primary-200"
                ),
              },
                h(t.icon, { width: 16, height: 16 }),
                t.label
              )
            )
          ),
          h("ol", { className: "divide-y divide-line" },
            rows.slice(0, 20).map((r) =>
              h("li", { key: r.rank, className: "flex items-center gap-3 py-3" },
                r.rank <= 3
                  ? h(Medal, { rank: r.rank })
                  : h("div", { className: "w-7 h-7 rounded-full bg-bg grid place-items-center text-ink font-semibold text-[13px] shrink-0" }, r.rank),
                h(Avatar, {
                  src: r.avatar,
                  name: r.name,
                  size: 40,
                  storeIcon: tab === "stores" || !r.avatar,
                }),
                h("div", { className: "flex-1 min-w-0" },
                  h("p", { className: "text-ink font-semibold text-sm line-clamp-1" }, r.name),
                  r.store && h("p", { className: "text-sub text-xs" }, r.store)
                ),
                h("div", { className: "text-right shrink-0 flex items-center gap-3" },
                  h("span", { className: "text-primary font-extrabold text-sm tabular-nums" },
                    numberFmt(r.score), " ", h("span", { className: "text-ink-soft font-semibold" }, current.unit)
                  ),
                  h("span", { className: "hidden sm:inline-flex" }, h(TrendPill, { trend: r.trend, change: r.change }))
                )
              )
            )
          )
        );
      }

      function LearningModal({ open, onClose, user }) {
        const courses = [
          { title: "Capacitación Televisor QLED 2026", xp: 220, progress: 60 },
          { title: "Línea de productos Google TV",      xp: 180, progress: 30 },
          { title: "Manejo de objeciones en showroom",  xp: 140, progress: 0  },
          { title: "Servicio técnico esencial",         xp: 160, progress: 90 },
        ];
        const xpAvail = (user && user.learning && user.learning.current) || 0;
        return h(Modal, {
          open, onClose,
          title: "Sigue aprendiendo",
          subtitle: "Cursos recomendados para subir tu posición",
          size: "md",
          footer: h(React.Fragment, null,
            h("button", {
              onClick: onClose,
              className: "px-4 py-2 rounded-lg text-sm font-semibold border border-line bg-white hover:bg-bg transition",
            }, "Más tarde"),
            h("button", {
              onClick: onClose,
              className: "px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary-600 transition",
            }, "Continuar aprendiendo")
          ),
        },
          h("div", { className: "rounded-xl bg-primary-50 border border-primary-100 px-4 py-3 mb-4 flex items-center justify-between" },
            h("div", null,
              h("p", { className: "text-primary-700 font-semibold text-sm" }, "XP disponibles"),
              h("p", { className: "display font-extrabold text-navy text-2xl" }, numberFmt(xpAvail), " XP")
            ),
            h("div", { className: "w-12 h-12 rounded-xl bg-white grid place-items-center text-primary shadow-card" },
              h(Icon.GraduationCap, { width: 20, height: 20 })
            )
          ),
          h("ul", { className: "space-y-3" },
            courses.map((c, i) =>
              h("li", { key: i, className: "flex items-center gap-3 p-3 rounded-xl border border-line hover:border-primary-200 hover:shadow-card transition" },
                h("div", { className: "w-10 h-10 rounded-lg bg-primary-50 text-primary grid place-items-center shrink-0" },
                  h(Icon.GraduationCap, { width: 16, height: 16 })
                ),
                h("div", { className: "flex-1 min-w-0" },
                  h("p", { className: "text-ink font-semibold text-sm line-clamp-1" }, c.title),
                  h("div", { className: "mt-1 flex items-center gap-2" },
                    h("div", { className: "flex-1 h-1.5 rounded-full bg-bg overflow-hidden" },
                      h("div", { className: "h-full bg-primary", style: { width: c.progress + "%" } })
                    ),
                    h("span", { className: "text-sub text-xs tabular-nums w-9 text-right" }, c.progress, "%")
                  )
                ),
                h("div", { className: "text-right shrink-0" },
                  h("p", { className: "text-primary font-extrabold text-sm tabular-nums" }, "+" + c.xp, " XP")
                )
              )
            )
          )
        );
      }

      function Stat({ label, value, suffix }) {
        const v = useCountUp(value, 900);
        return h("div", { className: "rounded-xl border border-line p-3 text-center" },
          h("p", { className: "display font-extrabold text-navy text-xl tabular-nums" },
            numberFmt(v),
            h("span", { className: "text-ink-soft text-sm font-semibold" }, suffix)
          ),
          h("p", { className: "text-sub text-xs mt-0.5" }, label)
        );
      }

      function SalesModal({ open, onClose, user }) {
        const goal = 38;
        const units = (user && user.sales && user.sales.current) || 0;
        const pct = Math.min(100, Math.round((units / goal) * 100));
        const products = [
          { name: "SKYWORTH 55\" QLED 4K",     units: 12 },
          { name: "SKYWORTH 65\" Google TV",   units: 8  },
          { name: "SKYWORTH 50\" UHD",         units: 6  },
          { name: "SKYWORTH 43\" Smart TV",    units: 5  },
        ];
        return h(Modal, {
          open, onClose,
          title: "Ventas personales",
          subtitle: "Tu progreso hacia la meta del mes",
          size: "md",
          footer: h("button", {
            onClick: onClose,
            className: "px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary-600 transition",
          }, "Registrar nueva venta")
        },
          h("div", { className: "grid grid-cols-3 gap-3 mb-5" },
            h(Stat, { label: "Ventas actuales", value: units,    suffix: " TVs" }),
            h(Stat, { label: "Meta mensual",    value: goal,     suffix: " TVs" }),
            h(Stat, { label: "Restantes",        value: Math.max(0, goal - units), suffix: " TVs" })
          ),
          h("div", { className: "rounded-xl border border-line p-4 mb-5" },
            h("div", { className: "flex items-center justify-between mb-1" },
              h("p", { className: "text-ink font-semibold text-sm" }, "Progreso de meta"),
              h("p", { className: "text-primary font-extrabold text-sm tabular-nums" }, pct, "%")
            ),
            h("div", { className: "h-2 rounded-full bg-bg overflow-hidden" },
              h("div", { className: "h-full bg-gradient-to-r from-primary-500 to-cyan-400", style: { width: pct + "%" } })
            )
          ),
          h("p", { className: "display font-bold text-navy text-sm mb-2" }, "Productos más vendidos"),
          h("ul", { className: "space-y-2" },
            products.map((p, i) =>
              h("li", { key: i, className: "flex items-center gap-3 px-3 py-2.5 rounded-xl bg-bg" },
                h("div", { className: "w-8 h-8 rounded-lg bg-white grid place-items-center text-primary shadow-card" },
                  h(Icon.ShoppingCart, { width: 16, height: 16 })
                ),
                h("span", { className: "flex-1 text-ink text-sm font-medium line-clamp-1" }, p.name),
                h("span", { className: "text-primary font-extrabold text-sm tabular-nums" }, p.units)
              )
            )
          )
        );
      }

      function ActionPlanModal({ open, onClose, user }) {
        const initial = [
          { title: "Completar capacitación pendiente", desc: "Termina los cursos de la línea QLED 2026.", done: false },
          { title: "Mejorar conversión de ventas",      desc: "Aplica la guía de objeciones en el showroom.", done: true  },
          { title: "Revisar productos prioritarios",    desc: "Enfócate en Google TV y QLED para subir margen.", done: false },
        ];
        const [items, setItems] = useState(initial);
        const toggle = (i) => setItems(xs => xs.map((it, k) => k === i ? { ...it, done: !it.done } : it));
        const cur = (user && user.stores && user.stores.current) || 0;
        const target = (user && user.stores && user.stores.max) || 100;
        const pct = Math.min(100, Math.round((cur / target) * 100));
        return h(Modal, {
          open, onClose,
          title: "Plan de acción",
          subtitle: "Sube tu cumplimiento con estos pasos",
          size: "md",
          footer: h("button", {
            onClick: onClose,
            className: "px-4 py-2 rounded-lg text-sm font-semibold bg-green-500 text-white hover:bg-green-600 transition",
          }, "Guardar plan")
        },
          h("div", { className: "rounded-xl bg-green-50 border border-green-100 p-4 mb-5" },
            h("div", { className: "flex items-center justify-between" },
              h("div", null,
                h("p", { className: "text-green-700 font-semibold text-sm" }, "Objetivo actual"),
                h("p", { className: "display font-extrabold text-navy text-2xl tabular-nums" }, cur, "%")
              ),
              h("div", { className: "text-center" },
                h("p", { className: "text-sub text-xs" }, "Objetivo"),
                h("p", { className: "display font-extrabold text-ink text-lg tabular-nums" }, target, "%")
              ),
              h("div", { className: "text-right" },
                h("p", { className: "text-sub text-xs" }, "Necesitas subir"),
                h("p", { className: "display font-extrabold text-green-500 text-lg tabular-nums" }, "+", (user && user.stores && user.stores.gap) || 0, "%")
              )
            ),
            h("div", { className: "mt-3 h-2 rounded-full bg-white overflow-hidden" },
              h("div", { className: "h-full bg-green-500", style: { width: pct + "%" } })
            )
          ),
          h("p", { className: "display font-bold text-navy text-sm mb-2" }, "Action items"),
          h("ul", { className: "space-y-2" },
            items.map((it, i) =>
              h("li", {
                key: i,
                className: cn(
                  "flex items-start gap-3 p-3 rounded-xl border transition",
                  it.done ? "bg-green-50 border-green-100" : "border-line hover:border-primary-200"
                ),
              },
                h("button", {
                  onClick: () => toggle(i),
                  className: cn(
                    "w-5 h-5 rounded grid place-items-center mt-0.5 shrink-0 border-2 transition",
                    it.done ? "bg-green-500 border-green-500 text-white" : "bg-white border-line text-transparent hover:border-primary"
                  ),
                  "aria-checked": it.done, role: "checkbox",
                }, h(Icon.CheckCircle2, { width: 12, height: 12 })),
                h("div", { className: "flex-1 min-w-0" },
                  h("p", { className: cn("text-ink font-semibold text-sm", it.done && "line-through text-sub") }, it.title),
                  h("p", { className: "text-sub text-xs mt-0.5" }, it.desc)
                ),
                h("span", {
                  className: cn(
                    "shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    it.done ? "bg-green-500 text-white" : "bg-bg text-sub"
                  ),
                }, it.done ? "Hecho" : "Pendiente")
              )
            )
          )
        );
      }

      /* =====================================================================
       *  RANKING PAGE (root)
       * ===================================================================== */
      function RankingPage() {
        const [period, setPeriod] = useState("thisMonth");
        const [data, setData] = useState(null);
        const [user, setUser] = useState(null);
        const [loading, setLoading] = useState(true);
        const [modal, setModal] = useState(null); // 'detail' | 'learning' | 'sales' | 'action'

        const load = useCallback(async (p) => {
          setLoading(true);
          const [ranking, me] = await Promise.all([api.fetchRanking(p), api.fetchCurrentUser()]);
          setData(ranking);
          setUser(me);
          setLoading(false);
        }, []);

        useEffect(() => { load(period); }, [period, load]);

        const sections = [
          {
            idx: 0,
            label: "PUNTOS DE APRENDIZAJE",
            sublabel: "Ranking de puntos obtenidos en la plataforma",
            icon: Icon.GraduationCap,
            accent: "bg-primary",
            theme: "blue",
            unit: "XP",
            storeIcon: false,
            items: data && data.learning,
            onSeeMore: () => setModal("detail"),
          },
          {
            idx: 1,
            label: "VENTAS PERSONALES",
            sublabel: "Ranking por unidades de TV vendidas",
            icon: Icon.ShoppingCart,
            accent: "bg-cyan-500",
            theme: "blue",
            unit: "TVs",
            storeIcon: false,
            items: data && data.sales,
            onSeeMore: () => setModal("detail"),
          },
          {
            idx: 2,
            label: "CUMPLIMIENTO DE TIENDA",
            sublabel: "Ranking por porcentaje de cumplimiento de meta",
            icon: Icon.Store,
            accent: "bg-green-500",
            theme: "green",
            unit: "%",
            storeIcon: true,
            items: data && data.stores,
            onSeeMore: () => setModal("detail"),
          },
        ];

        return h("div", { className: "min-h-screen bg-bg" },
          h("div", { className: "max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-10 pb-16" },
            h("div", { className: "flex items-center justify-between mb-6" },
              h("div", { className: "hidden sm:flex items-center gap-2 text-[11px] text-sub" },
                h("span", { className: "w-2 h-2 rounded-full bg-green-500 animate-pulse" }),
                " Datos en vivo"
              )
            ),
            h(Header, { period, onPeriod: (p) => { setPeriod(p); load(p); }, loading }),
            h("main", { className: "space-y-6 lg:space-y-7" },
              sections.map((s) =>
                h(RankingSection, {
                  key: s.label,
                  idx: s.idx,
                  icon: s.icon,
                  accent: s.accent,
                  label: s.label,
                  sublabel: s.sublabel,
                  items: s.items,
                  unit: s.unit,
                  storeIcon: s.storeIcon,
                  onSeeMore: s.onSeeMore,
                  theme: s.theme,
                  skeleton: loading,
                })
              ),
              user && h(MyRanking, { user, onCTA: (k) => {
                if (k === "learning") { try { window.skyworthShowView && window.skyworthShowView("learn"); } catch (e) {} }
                else if (k === "sales") { try { window.skyworthShowView && window.skyworthShowView("sales"); } catch (e) {} }
                else setModal("action");
              } })
            ),
            h("footer", { className: "mt-10 text-center text-[12px] text-sub" },
              "Los rankings se actualizan diariamente a las 00:00 (GMT-5)"
            )
          ),
          h(RankingDetailModal, { open: modal === "detail", onClose: () => setModal(null), data }),
          h(LearningModal,     { open: modal === "learning", onClose: () => setModal(null), user }),
          h(SalesModal,        { open: modal === "sales",    onClose: () => setModal(null), user }),
          h(ActionPlanModal,   { open: modal === "action",   onClose: () => setModal(null), user })
        );
      }


      /* =====================================================================
       *  MOUNT / UNMOUNT — integrate with the SPA shell.
       *  The host page must:
       *    1) include React + ReactDOM + Babel Standalone
       *    2) load this file as a text/babel script
       *    3) provide a <div id="rankingRoot"> inside <section id="ranking" class="view">
       *    4) call window.rankingApp.mount(document.getElementById("rankingRoot"))
       *       the first time the user switches to the ranking tab.
       * ===================================================================== */
      window.rankingApp = (function () {
        var root = null;
        return {
          mount: function (container) {
            if (root) return;
            if (!container) return;
            root = ReactDOM.createRoot(container);
            root.render(h(RankingPage));
          },
          unmount: function () {
            if (!root) return;
            root.unmount();
            root = null;
          },
          isMounted: function () { return !!root; }
        };
      })();

