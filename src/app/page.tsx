"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { useSearchParams } from "next/navigation";
import { SectionNav, Footer } from "../components/SectionNav";

type SimInputs = {
  profitPriority: number; // 0-100
  commonsLevel: number; // 0-100
  automationLevel: number; // 0-100
  ecoConstraint: number; // 0-100
};

type SimOutputs = {
  inequality: number; // 0-1
  avgWorkHours: number; // hours/week
  emissionsIndex: number; // 0-1
  securityIndex: number; // 0-1
};

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

// Single-year "state" model
function runSimulation(inputs: SimInputs): SimOutputs {
  const p = inputs.profitPriority / 100;
  const c = inputs.commonsLevel / 100;
  const a = inputs.automationLevel / 100;
  const e = inputs.ecoConstraint / 100;

  // Inequality rises with profit priority, falls with commons.
  const inequality = clamp01(0.3 + 0.9 * p - 0.7 * c);

  // Base work week: 40h
  // Automation can lower it, but only if commons are high enough to share gains.
  const automationEffect = -15 * a * (0.3 + 0.7 * c); // up to -15h if high automation + high commons
  const profitPenalty = 8 * p * (1 - c); // more profit, less commons = overtime
  const rawHours = 40 + automationEffect + profitPenalty;

  const avgWorkHours = Math.round(clamp01(rawHours / 60) * 40 + 10); // clips between ~10 and 50h

  // Emissions: higher economic throughput + low eco constraints = trouble.
  const throughput = 0.5 + 0.4 * a + 0.3 * p; // “how hard the system is pushing”
  const emissionsIndex = clamp01(throughput * (1 - 0.8 * e));

  // Security: high commons + strong eco constraints + reasonable inequality.
  const securityBase = 0.2 + 0.6 * c + 0.4 * e - 0.4 * inequality;
  const securityIndex = clamp01(securityBase);

  return {
    inequality,
    avgWorkHours,
    emissionsIndex,
    securityIndex,
  };
}

// Tiny dynamic: how things drift year over year under the chosen rules.
function simulateOverYears(inputs: SimInputs, years: number) {
  const base = runSimulation(inputs);

  const p = inputs.profitPriority / 100;
  const c = inputs.commonsLevel / 100;
  const e = inputs.ecoConstraint / 100;

  const data: Array<{
    year: number;
    inequality: number;
    emissions: number;
    security: number;
  }> = [];

  for (let t = 0; t <= years; t++) {
    const tNorm = t / years;

    // Inequality drifts upward if profit is high and commons low, downward otherwise.
    const inequalityDrift = (0.4 * p * (1 - c) - 0.25 * c) * tNorm;
    const inequality = clamp01(base.inequality + inequalityDrift);

    // Emissions drift: high profit & low eco constraints push them up; strong eco constraints bend down.
    const emissionsBase = base.emissionsIndex;
    const emissionsDrift =
      (0.6 * (p + 0.3) * (1 - e) - 0.5 * e) * (tNorm * 0.8);
    const emissions = clamp01(emissionsBase + emissionsDrift);

    // Security: improves in commons-heavy, eco-strict scenarios; erodes in profit-heavy ones.
    const securityBase = base.securityIndex;
    const securityDrift =
      (0.5 * c + 0.5 * e - 0.5 * p * (1 - c)) * tNorm;
    const security = clamp01(securityBase + securityDrift);

    data.push({
      year: t,
      inequality,
      emissions,
      security,
    });
  }

  return data;
}

function SliderRow({
  label,
  value,
  onChange,
  description,
  tooltip,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
  description: string;
  tooltip?: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <div className="text-[13px] font-medium text-slate-100 uppercase tracking-wide">
            {label}
          </div>
          {tooltip && (
            <div className="relative">
              <button
                type="button"
                className="flex items-center justify-center w-4 h-4 rounded-full bg-slate-700/80 text-slate-400 text-[10px] font-bold hover:bg-violet-500/30 hover:text-violet-300 transition-colors"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
                aria-label={`Info about ${label}`}
              >
                ?
              </button>
              {showTooltip && (
                <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 rounded-xl border border-slate-600/80 bg-slate-900/95 shadow-xl shadow-black/40 text-xs text-slate-200 leading-relaxed backdrop-blur-sm">
                  <div className="font-semibold text-violet-300 mb-1">{label}</div>
                  {tooltip}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-600/80" />
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500">
            {value === 0 ? "Low" : value === 100 ? "High" : ""}
          </span>
          <div className="w-8 text-right text-sm font-mono text-slate-200 font-semibold">{value}</div>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider-enhanced w-full"
      />
      <p className="text-[11px] text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

function MetricBar({
  label,
  value,
  format,
  bad = false,
}: {
  label: string;
  value: number;
  format?: (v: number) => string;
  bad?: boolean;
}) {
  const pct = clamp01(value) * 100;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs text-slate-100">
        <span>{label}</span>
        <span className="font-mono text-[11px] text-slate-300">
          {format ? format(value) : `${Math.round(pct)}%`}
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-800/80 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-200 ${bad ? "bg-rose-500" : "bg-emerald-400"
            }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

const presets: { name: string; description: string; inputs: SimInputs }[] = [
  {
    name: "Default late-capitalism",
    description: "High profit, low commons, weak eco limits.",
    inputs: {
      profitPriority: 80,
      commonsLevel: 20,
      automationLevel: 70,
      ecoConstraint: 25,
    },
  },
  {
    name: "Fresco-leaning RBE",
    description: "High commons, strong eco limits, automation for liberation.",
    inputs: {
      profitPriority: 20,
      commonsLevel: 80,
      automationLevel: 70,
      ecoConstraint: 80,
    },
  },
  {
    name: "Greenwashed status quo",
    description: "High profit, medium eco rhetoric, weak commons.",
    inputs: {
      profitPriority: 75,
      commonsLevel: 35,
      automationLevel: 60,
      ecoConstraint: 55,
    },
  },
];

function PageContent() {
  const searchParams = useSearchParams();

  const [inputs, setInputs] = useState<SimInputs>({
    profitPriority: 70,
    commonsLevel: 20,
    automationLevel: 60,
    ecoConstraint: 25,
  });

  // Seed sliders from /?fromCity=1&profitPriority=... etc.
  useEffect(() => {
    if (!searchParams) return;
    if (searchParams.get("fromCity") !== "1") return;

    const num = (key: string, fallback: number) => {
      const v = searchParams.get(key);
      const n = v !== null ? Number(v) : NaN;
      if (!Number.isFinite(n)) return fallback;
      return Math.max(0, Math.min(100, n));
    };

    setInputs((prev) => ({
      profitPriority: num("profitPriority", prev.profitPriority),
      commonsLevel: num("commonsLevel", prev.commonsLevel),
      automationLevel: num("automationLevel", prev.automationLevel),
      ecoConstraint: num("ecoConstraint", prev.ecoConstraint),
    }));
  }, [searchParams]);

  const outputs = runSimulation(inputs);
  const chartData = useMemo(() => simulateOverYears(inputs, 30), [inputs]);

  const scenarioIsNice =
    outputs.securityIndex > 0.6 &&
    outputs.inequality < 0.4 &&
    outputs.emissionsIndex < 0.5 &&
    inputs.commonsLevel > 50;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-8 sm:pt-10">
        {/* Header */}
        <header className="mb-6">
          <SectionNav />

          <h1 className="mt-2 text-[24px] sm:text-[28px] md:text-[32px] font-semibold leading-tight text-slate-50">
            What happens when we change{" "}
            <span className="bg-gradient-to-r from-violet-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
              the rules
            </span>
            ?
          </h1>
          <p className="mt-3 max-w-2xl text-[13px] sm:text-sm text-slate-400">
            AI is an amplifier. Under profit rules, it amplifies inequality. Under resource-based logic,
            it amplifies abundance. Adjust the sliders and watch 30 years unfold.
          </p>
        </header>

        {/* Preset Buttons */}
        <div className="flex flex-wrap gap-2 mb-5">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setInputs(preset.inputs)}
              className="flex items-center gap-2 rounded-full border border-slate-600/60 bg-slate-950/60 px-4 py-2 text-sm hover:border-violet-400 hover:text-white transition-colors"
            >
              <span>{preset.name === "Late-stage Capitalism" ? "📉" : preset.name === "Techno-Optimist RBE" ? "🌿" : preset.name === "Eco-Austerity" ? "🌍" : "⚖️"}</span>
              <span className="text-slate-300">{preset.name}</span>
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">

          {/* Left: Simulator Controls + Chart */}
          <div className="space-y-4">
            {/* Sliders Panel */}
            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/90 p-5 shadow-xl">
              <div className="flex items-center justify-between gap-4 mb-5">
                <h2 className="text-base font-semibold text-slate-100">System Rules</h2>
                <div
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${scenarioIsNice
                    ? "border-emerald-400/70 bg-emerald-500/10 text-emerald-300"
                    : "border-rose-400/70 bg-rose-500/10 text-rose-300"
                    }`}
                >
                  <span className={`h-2 w-2 rounded-full ${scenarioIsNice ? "bg-emerald-400" : "bg-rose-400"}`} />
                  <span>{scenarioIsNice ? "RBE-leaning" : "Profit-max"}</span>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <SliderRow
                  label="Profit priority"
                  value={inputs.profitPriority}
                  description="How much does the system optimize for owner returns?"
                  tooltip="High values mean shareholder returns trump worker welfare, environmental costs, and long-term stability."
                  onChange={(v) => setInputs((i) => ({ ...i, profitPriority: v }))}
                />
                <SliderRow
                  label="Commons ownership"
                  value={inputs.commonsLevel}
                  description="How much infrastructure & AI is publicly owned?"
                  tooltip="Think public utilities, open-source AI, community land trusts. High commons means automation gains are shared."
                  onChange={(v) => setInputs((i) => ({ ...i, commonsLevel: v }))}
                />
                <SliderRow
                  label="Automation level"
                  value={inputs.automationLevel}
                  description="How far is AI pushed into production?"
                  tooltip="This isn't good or bad—it's an amplifier. High automation + high commons = liberation. High automation + profit priority = precarity."
                  onChange={(v) => setInputs((i) => ({ ...i, automationLevel: v }))}
                />
                <SliderRow
                  label="Ecological limits"
                  value={inputs.ecoConstraint}
                  description="How strictly are planetary boundaries enforced?"
                  tooltip="High values mean hard limits on carbon, extraction, and waste. Low values treat the planet as an externality."
                  onChange={(v) => setInputs((i) => ({ ...i, ecoConstraint: v }))}
                />
              </div>
            </div>

            {/* Chart */}
            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/90 p-5 shadow-xl">
              <h3 className="text-sm font-semibold text-slate-100 mb-1">30-Year Trajectory</h3>
              <p className="text-xs text-slate-400 mb-3">How these rules play out over three decades</p>
              <div className="h-52 rounded-xl border border-slate-700/60 bg-slate-950/80 p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 4, right: 12, left: -18, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} />
                    <YAxis domain={[0, 1]} tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#020617",
                        border: "1px solid #4b5563",
                        borderRadius: 8,
                        fontSize: 10,
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Line type="monotone" dataKey="inequality" stroke="#fb7185" strokeWidth={2} dot={false} name="Inequality" />
                    <Line type="monotone" dataKey="emissions" stroke="#f97316" strokeWidth={2} dot={false} name="Emissions" />
                    <Line type="monotone" dataKey="security" stroke="#22c55e" strokeWidth={2} dot={false} name="Security" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right: Outcomes Panel */}
          <div className="space-y-4">
            {/* Current Outcomes */}
            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/90 p-5 shadow-xl">
              <h3 className="text-base font-semibold text-slate-100 mb-4">Current Outcomes</h3>

              <div className="space-y-3">
                <MetricBar
                  label="Inequality"
                  value={outputs.inequality}
                  bad
                  format={(v) => `${Math.round(v * 100)}%`}
                />
                <MetricBar
                  label="Work week"
                  value={(outputs.avgWorkHours - 10) / 40}
                  format={() => `${outputs.avgWorkHours}h`}
                />
                <MetricBar
                  label="Emissions"
                  value={outputs.emissionsIndex}
                  bad
                  format={(v) => `${Math.round(v * 100)}%`}
                />
                <MetricBar
                  label="Security"
                  value={outputs.securityIndex}
                  format={(v) => `${Math.round(v * 100)}%`}
                />
              </div>
            </div>

            {/* Interpretation */}
            <div className={`rounded-2xl border p-5 shadow-xl ${scenarioIsNice
              ? "border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-slate-900/90"
              : "border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-slate-900/90"
              }`}>
              <h3 className={`text-sm font-semibold mb-2 ${scenarioIsNice ? "text-emerald-300" : "text-rose-300"}`}>
                {scenarioIsNice ? "🌿 Long game: Stability" : "📉 Long game: Familiar cliff"}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {scenarioIsNice
                  ? "High commons and ecological constraints keep inequality and emissions from spiraling. Automation shows up as time freedom, not precarity."
                  : "Profit-heavy rules with weak commons gradually push inequality and emissions up. Even with automation, most stay locked in long work weeks."}
              </p>
            </div>

            {/* Quick Links */}
            <div className="rounded-xl border border-slate-700/60 bg-slate-950/60 p-4">
              <p className="text-xs text-slate-400 mb-3">Explore more:</p>
              <div className="flex gap-2">
                <a
                  href="/city"
                  className="flex-1 text-center rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-2 text-xs font-semibold text-sky-300 hover:bg-sky-500/20 transition-colors"
                >
                  🏙️ City Builder
                </a>
                <a
                  href="/thesis"
                  className="flex-1 text-center rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
                >
                  📜 Read Thesis
                </a>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black text-slate-50 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </main>
    }>
      <PageContent />
    </Suspense>
  );
}
