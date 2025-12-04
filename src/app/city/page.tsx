"use client";

import { useMemo, useState } from "react";
import { SectionNav, Footer } from "../../components/SectionNav";

// Types
type TileType = "empty" | "housing" | "food" | "energy" | "transit" | "services";

type RingSegment = {
  ring: number;
  index: number;
  type: TileType;
};

// Configuration
const RING_CONFIG = [
  { ring: 1, segments: 6, innerRadius: 16, outerRadius: 26 },
  { ring: 2, segments: 12, innerRadius: 28, outerRadius: 38 },
  { ring: 3, segments: 18, innerRadius: 40, outerRadius: 48 },
];

const TILE_TYPES: TileType[] = ["empty", "housing", "food", "energy", "transit", "services"];

const TILE_CONFIG: Record<TileType, { label: string; icon: string; color: string; gradient: string; glow: string }> = {
  empty: {
    label: "Empty",
    icon: "○",
    color: "#334155",
    gradient: "from-slate-800 to-slate-900",
    glow: "rgba(100, 116, 139, 0.3)",
  },
  housing: {
    label: "Housing",
    icon: "🏠",
    color: "#0ea5e9",
    gradient: "from-sky-500 to-sky-700",
    glow: "rgba(14, 165, 233, 0.5)",
  },
  food: {
    label: "Food",
    icon: "🌱",
    color: "#22c55e",
    gradient: "from-emerald-500 to-emerald-700",
    glow: "rgba(34, 197, 94, 0.5)",
  },
  energy: {
    label: "Energy",
    icon: "⚡",
    color: "#f59e0b",
    gradient: "from-amber-500 to-amber-700",
    glow: "rgba(245, 158, 11, 0.5)",
  },
  transit: {
    label: "Transit",
    icon: "🚄",
    color: "#d946ef",
    gradient: "from-fuchsia-500 to-fuchsia-700",
    glow: "rgba(217, 70, 239, 0.5)",
  },
  services: {
    label: "Services",
    icon: "🏥",
    color: "#8b5cf6",
    gradient: "from-violet-500 to-violet-700",
    glow: "rgba(139, 92, 246, 0.5)",
  },
};

// Helper to create arc path for ring segment
function createArcPath(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
): string {
  const startInnerX = cx + innerRadius * Math.cos(startAngle);
  const startInnerY = cy + innerRadius * Math.sin(startAngle);
  const endInnerX = cx + innerRadius * Math.cos(endAngle);
  const endInnerY = cy + innerRadius * Math.sin(endAngle);
  const startOuterX = cx + outerRadius * Math.cos(startAngle);
  const startOuterY = cy + outerRadius * Math.sin(startAngle);
  const endOuterX = cx + outerRadius * Math.cos(endAngle);
  const endOuterY = cy + outerRadius * Math.sin(endAngle);

  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

  return `
    M ${startInnerX} ${startInnerY}
    A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${endInnerX} ${endInnerY}
    L ${endOuterX} ${endOuterY}
    A ${outerRadius} ${outerRadius} 0 ${largeArc} 0 ${startOuterX} ${startOuterY}
    Z
  `;
}

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

// Initialize segments
function createInitialSegments(): RingSegment[] {
  const segments: RingSegment[] = [];
  for (const ring of RING_CONFIG) {
    for (let i = 0; i < ring.segments; i++) {
      segments.push({
        ring: ring.ring,
        index: i,
        type: "empty",
      });
    }
  }
  return segments;
}

// Ring Segment Component
function RingSegmentPath({
  segment,
  config,
  isSelected,
  currentTool,
  onHover,
  onClick,
}: {
  segment: RingSegment;
  config: typeof RING_CONFIG[0];
  isSelected: boolean;
  currentTool: TileType;
  onHover: (seg: RingSegment | null) => void;
  onClick: () => void;
}) {
  const anglePerSegment = (2 * Math.PI) / config.segments;
  const gap = 0.02; // Small gap between segments
  const startAngle = segment.index * anglePerSegment - Math.PI / 2 + gap;
  const endAngle = (segment.index + 1) * anglePerSegment - Math.PI / 2 - gap;

  const path = createArcPath(50, 50, config.innerRadius, config.outerRadius, startAngle, endAngle);
  const tileConfig = TILE_CONFIG[segment.type];
  const previewConfig = TILE_CONFIG[currentTool];

  return (
    <g
      className="cursor-pointer transition-all duration-150"
      onMouseEnter={() => onHover(segment)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
    >
      <path
        d={path}
        fill={tileConfig.color}
        stroke={isSelected ? previewConfig.color : "rgba(100, 116, 139, 0.4)"}
        strokeWidth={isSelected ? 1.5 : 0.5}
        opacity={segment.type === "empty" ? 0.4 : 0.9}
        style={{
          filter: isSelected ? `drop-shadow(0 0 6px ${previewConfig.glow})` :
            segment.type !== "empty" ? `drop-shadow(0 0 4px ${tileConfig.glow})` : "none",
          transform: isSelected ? "scale(1.02)" : "scale(1)",
          transformOrigin: "50px 50px",
          transition: "all 0.15s ease-out",
        }}
      />
      {/* Icon for non-empty segments */}
      {segment.type !== "empty" && (
        <text
          x={50 + ((config.innerRadius + config.outerRadius) / 2) * Math.cos((startAngle + endAngle) / 2)}
          y={50 + ((config.innerRadius + config.outerRadius) / 2) * Math.sin((startAngle + endAngle) / 2)}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={config.ring === 1 ? 5 : config.ring === 2 ? 4 : 3}
          className="pointer-events-none select-none"
        >
          {tileConfig.icon}
        </text>
      )}
    </g>
  );
}

export default function CityPage() {
  const [segments, setSegments] = useState<RingSegment[]>(() => createInitialSegments());
  const [currentTool, setCurrentTool] = useState<TileType>("housing");
  const [hoveredSegment, setHoveredSegment] = useState<RingSegment | null>(null);

  function handleSegmentClick(ring: number, index: number) {
    setSegments((prev) =>
      prev.map((seg) =>
        seg.ring === ring && seg.index === index ? { ...seg, type: currentTool } : seg
      )
    );
  }

  function clearCity() {
    setSegments(createInitialSegments());
  }

  // Calculate stats
  const stats = useMemo(() => {
    const counts: Record<TileType, number> = {
      empty: 0,
      housing: 0,
      food: 0,
      energy: 0,
      transit: 0,
      services: 0,
    };

    segments.forEach((seg) => {
      counts[seg.type]++;
    });

    const totalSegments = segments.length;
    const filledSegments = totalSegments - counts.empty;

    const popCapacity = counts.housing * 300;
    const foodCapacity = counts.food * 500;
    const energyCapacity = counts.energy * 400;

    const foodCoverage = clamp01(foodCapacity / (popCapacity + 1));
    const energyCoverage = clamp01(energyCapacity / (popCapacity * 0.6 + 150));
    const servicesIndex = clamp01(0.2 + counts.services * 0.06);
    const transitIndex = clamp01(0.2 + counts.transit * 0.07);

    const qualityIndex = clamp01(
      0.25 +
      0.25 * foodCoverage +
      0.25 * energyCoverage +
      0.15 * servicesIndex +
      0.1 * transitIndex
    );

    let qualityLabel = "Developing";
    let qualityColor = "text-amber-300";
    if (qualityIndex > 0.8) {
      qualityLabel = "Thriving";
      qualityColor = "text-emerald-300";
    } else if (qualityIndex < 0.4) {
      qualityLabel = "Struggling";
      qualityColor = "text-rose-300";
    }

    return {
      counts,
      totalSegments,
      filledSegments,
      popCapacity,
      foodCapacity,
      energyCapacity,
      foodCoverage,
      energyCoverage,
      servicesIndex,
      transitIndex,
      qualityIndex,
      qualityLabel,
      qualityColor,
    };
  }, [segments]);

  // Derive sim params for link
  const simParams = useMemo(() => {
    const total = stats.filledSegments || 1;
    const commonsTiles = stats.counts.food + stats.counts.energy + stats.counts.transit + stats.counts.services;
    const commonsRaw = commonsTiles / total;

    return {
      profitPriority: Math.round(clamp01(0.2 + 0.8 * (1 - commonsRaw)) * 100),
      commonsLevel: Math.round(clamp01(commonsRaw) * 100),
      automationLevel: Math.round(clamp01(0.3 + 0.7 * ((stats.counts.energy + stats.counts.transit) / total)) * 100),
      ecoConstraint: Math.round(clamp01(0.3 + 0.35 * stats.foodCoverage + 0.35 * stats.energyCoverage) * 100),
    };
  }, [stats]);

  const simUrl = `/?fromCity=1&profitPriority=${simParams.profitPriority}&commonsLevel=${simParams.commonsLevel}&automationLevel=${simParams.automationLevel}&ecoConstraint=${simParams.ecoConstraint}`;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:pt-10">
        <header className="mb-8">
          <SectionNav />

          <h1 className="mt-2 text-[26px] sm:text-[30px] md:text-[32px] font-semibold leading-tight text-slate-50">
            Design a{" "}
            <span className="bg-gradient-to-r from-sky-400 via-emerald-400 to-violet-400 bg-clip-text text-transparent">
              resource-based city
            </span>{" "}
            from the center out.
          </h1>
          <p className="mt-4 max-w-2xl text-[13px] sm:text-sm text-slate-300">
            Click on ring segments to assign functions. Build housing near the center,
            food and energy in the middle rings, transit on the edges. Watch your city
            come alive as you design.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Left: Interactive Ring Builder */}
          <div className="rounded-2xl border border-slate-700/70 bg-slate-900/90 p-5 sm:p-6 shadow-xl">
            {/* Toolbar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-slate-100">City Rings</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Select a function below, then click segments to paint
                </p>
              </div>
              <button
                onClick={clearCity}
                className="rounded-full border border-slate-600/70 bg-slate-950/80 px-4 py-2 text-xs text-slate-300 hover:border-rose-400 hover:text-rose-300 transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Tool Palette */}
            <div className="mb-6 flex flex-wrap gap-2">
              {TILE_TYPES.filter(t => t !== "empty").map((type) => {
                const config = TILE_CONFIG[type];
                const isActive = currentTool === type;
                return (
                  <button
                    key={type}
                    onClick={() => setCurrentTool(type)}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${isActive
                      ? "border-white/40 bg-white/10 text-white shadow-lg"
                      : "border-slate-600/60 bg-slate-950/60 text-slate-300 hover:border-slate-400"
                      }`}
                    style={{
                      boxShadow: isActive ? `0 0 20px ${config.glow}` : "none",
                    }}
                  >
                    <span className="text-lg">{config.icon}</span>
                    <span>{config.label}</span>
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentTool("empty")}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${currentTool === "empty"
                  ? "border-slate-400 bg-slate-800 text-white"
                  : "border-slate-600/60 bg-slate-950/60 text-slate-400 hover:border-slate-400"
                  }`}
              >
                <span className="text-sm">✕</span>
                <span>Erase</span>
              </button>
            </div>

            {/* Interactive Ring */}
            <div className="relative mx-auto aspect-square w-full max-w-[500px]">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  {/* Background glow */}
                  <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.15" />
                    <stop offset="60%" stopColor="#0f172a" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#020617" stopOpacity="0" />
                  </radialGradient>
                  {/* Core glow */}
                  <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#c4b5fd" stopOpacity="1" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.6" />
                  </radialGradient>
                  <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Background */}
                <circle cx="50" cy="50" r="48" fill="url(#bgGlow)" />

                {/* Ring guide circles */}
                {RING_CONFIG.map((ring) => (
                  <circle
                    key={`guide-${ring.ring}`}
                    cx="50"
                    cy="50"
                    r={(ring.innerRadius + ring.outerRadius) / 2}
                    fill="none"
                    stroke="rgba(100, 116, 139, 0.15)"
                    strokeWidth="0.3"
                    strokeDasharray="1 2"
                  />
                ))}

                {/* Ring Segments */}
                {segments.map((segment) => {
                  const config = RING_CONFIG.find((r) => r.ring === segment.ring)!;
                  const isHovered = hoveredSegment?.ring === segment.ring && hoveredSegment?.index === segment.index;

                  return (
                    <RingSegmentPath
                      key={`${segment.ring}-${segment.index}`}
                      segment={segment}
                      config={config}
                      isSelected={isHovered}
                      currentTool={currentTool}
                      onHover={setHoveredSegment}
                      onClick={() => handleSegmentClick(segment.ring, segment.index)}
                    />
                  );
                })}

                {/* Central Hub */}
                <circle
                  cx="50"
                  cy="50"
                  r="14"
                  fill="url(#coreGradient)"
                  filter="url(#coreGlow)"
                />
                <circle cx="50" cy="50" r="10" fill="#a78bfa" opacity="0.8" />
                <circle cx="50" cy="50" r="5" fill="#e9d5ff" opacity="0.9" />

                {/* Hub label */}
                <text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#1e1b4b"
                  fontSize="3"
                  fontWeight="600"
                  className="pointer-events-none select-none"
                >
                  HUB
                </text>
              </svg>

              {/* Hover tooltip */}
              {hoveredSegment && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-slate-600/80 rounded-lg px-3 py-2 text-xs text-slate-200 shadow-xl backdrop-blur-sm pointer-events-none">
                  <span className="text-slate-400">Ring {hoveredSegment.ring}:</span>{" "}
                  <span className="font-semibold" style={{ color: TILE_CONFIG[hoveredSegment.type].color }}>
                    {TILE_CONFIG[hoveredSegment.type].label}
                  </span>
                  <span className="text-slate-500 ml-2">→ Click to set {TILE_CONFIG[currentTool].label}</span>
                </div>
              )}
            </div>

            {/* Ring Legend */}
            <div className="mt-6 flex justify-center gap-6 text-[11px] text-slate-400">
              <span>Ring 1: Inner (6 segments)</span>
              <span>Ring 2: Middle (12 segments)</span>
              <span>Ring 3: Outer (18 segments)</span>
            </div>
          </div>

          {/* Right: Stats Panel */}
          <div className="space-y-4">
            {/* City Status */}
            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/90 p-5 shadow-xl">
              <h3 className="text-base font-semibold text-slate-100 mb-4">City Status</h3>

              <div className="flex items-center gap-3 rounded-xl border border-slate-700/80 bg-slate-950/90 p-3 mb-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-violet-500/20 to-violet-600/10 border border-violet-500/30">
                  <span className="text-xl">
                    {stats.qualityIndex > 0.8 ? "🌿" : stats.qualityIndex > 0.4 ? "🏗️" : "⚠️"}
                  </span>
                </div>
                <div>
                  <p className={`text-sm font-semibold ${stats.qualityColor}`}>
                    {stats.qualityLabel}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Quality: {Math.round(stats.qualityIndex * 100)}%
                  </p>
                </div>
              </div>

              {/* Segment counts */}
              <div className="space-y-2">
                {(["housing", "food", "energy", "transit", "services"] as TileType[]).map((type) => {
                  const config = TILE_CONFIG[type];
                  const count = stats.counts[type];
                  const pct = (count / stats.totalSegments) * 100;
                  return (
                    <div key={type} className="flex items-center gap-2">
                      <span className="w-5 text-center">{config.icon}</span>
                      <span className="text-xs text-slate-300 w-16">{config.label}</span>
                      <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%`, backgroundColor: config.color }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-400 w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-700/60">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg bg-slate-950/80 p-3">
                    <p className="text-slate-400">Population</p>
                    <p className="text-lg font-semibold text-sky-300">{stats.popCapacity.toLocaleString()}</p>
                  </div>
                  <div className="rounded-lg bg-slate-950/80 p-3">
                    <p className="text-slate-400">Food Coverage</p>
                    <p className="text-lg font-semibold text-emerald-300">{Math.round(stats.foodCoverage * 100)}%</p>
                  </div>
                  <div className="rounded-lg bg-slate-950/80 p-3">
                    <p className="text-slate-400">Energy Coverage</p>
                    <p className="text-lg font-semibold text-amber-300">{Math.round(stats.energyCoverage * 100)}%</p>
                  </div>
                  <div className="rounded-lg bg-slate-950/80 p-3">
                    <p className="text-slate-400">Transit Index</p>
                    <p className="text-lg font-semibold text-fuchsia-300">{Math.round(stats.transitIndex * 100)}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sim Link */}
            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/90 p-5 shadow-xl">
              <h3 className="text-sm font-semibold text-slate-100 mb-2">Test in Simulator</h3>
              <p className="text-[11px] text-slate-400 mb-3">
                See how a world built like this city would evolve over 30 years.
              </p>
              <a
                href={simUrl}
                className="block w-full text-center rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white hover:from-violet-500 hover:to-violet-400 transition-all shadow-lg shadow-violet-500/25"
              >
                Open in Simulator →
              </a>
            </div>

            {/* Tips */}
            <div className="rounded-xl border border-slate-700/60 bg-slate-950/60 p-4 text-xs text-slate-400">
              <p className="font-semibold text-slate-300 mb-2">💡 Design Tips</p>
              <ul className="space-y-1.5">
                <li>• Balance housing with food & energy production</li>
                <li>• Transit connects rings and improves quality</li>
                <li>• Services in inner rings boost overall function</li>
                <li>• Empty space isn&apos;t bad—it&apos;s potential!</li>
              </ul>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
