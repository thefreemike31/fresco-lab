"use client";

import { useState } from "react";

type SimInputs = {
  profitPriority: number;   // 0-100
  commonsLevel: number;     // 0-100
  automationLevel: number;  // 0-100
  ecoConstraint: number;    // 0-100
};

type SimOutputs = {
  inequality: number;    // 0-1
  avgWorkHours: number;  // hours/week
  emissionsIndex: number;// 0-1
  securityIndex: number; // 0-1
};

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

// Extremely simple toy model – the point is intuitive behavior, not realism.
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
  const profitPenalty = 8 * p * (1 - c);              // more profit, less commons = overtime
  const rawHours = 40 + automationEffect + profitPenalty;

  const avgWorkHours = Math.round(clamp01(rawHours / 60) * 40 + 10); // clips between 10 and 50h approx

  // Emissions: higher economic throughput + low eco constraints = trouble.
  const throughput = 0.5 + 0.4 * a + 0.3 * p;        // “how hard the system is pushing”
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

function SliderRow({
  label,
  value,
  onChange,
  description,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
  description: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs font-medium text-slate-200 uppercase tracking-wide">
          {label}
        </div>
        <div className="text-xs text-slate-400">{value}</div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-violet-500"
      />
      <p className="text-[11px] text-slate-400">{description}</p>
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
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-slate-200">
        <span>{label}</span>
        <span className="font-mono text-[11px] text-slate-300">
          {format ? format(value) : `${Math.round(pct)}%`}
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-800/80 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-200 ${
            bad ? "bg-rose-500" : "bg-emerald-400"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function Page() {
  const [inputs, setInputs] = useState<SimInputs>({
    profitPriority: 70,
    commonsLevel: 20,
    automationLevel: 60,
    ecoConstraint: 25,
  });

  const outputs = runSimulation(inputs);

  const scenarioIsNice =
    outputs.securityIndex > 0.6 &&
    outputs.inequality < 0.4 &&
    outputs.emissionsIndex < 0.5 &&
    inputs.commonsLevel > 50;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black text-slate-50">
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-10">
        {/* Hero */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-600/60 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
            <span className="uppercase tracking-[0.2em]">
              Fresco / AI / Abundance
            </span>
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold leading-tight">
            We already built what{" "}
            <span className="bg-gradient-to-r from-violet-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
              Jacque&nbsp;Fresco
            </span>{" "}
            needed. We&apos;re just using it for the wrong game.
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            This lab is a small, opinionated sandbox. It lets you poke at one
            simple idea: <span className="font-semibold">AI is an amplifier</span>.
            Under profit rules, it amplifies inequality and ecological overshoot.
            Under a resource-based logic, it amplifies abundance and stability.
          </p>
        </header>

        {/* Simulator + explanation */}
        <section className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start">
          <div className="rounded-2xl border border-slate-700/70 bg-slate-900/90 p-4 shadow-xl shadow-slate-950/80">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold">
                  AI Objective Simulator
                </h2>
                <p className="text-[11px] text-slate-400">
                  Move the sliders. Watch what happens to inequality, work,
                  emissions and security.
                </p>
              </div>
              <div className="rounded-full border border-slate-600/60 bg-slate-950/80 px-3 py-1 text-[11px] text-slate-300">
                {scenarioIsNice ? "RBE-ish" : "Profit-max"}
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <SliderRow
                  label="Profit priority"
                  value={inputs.profitPriority}
                  description="How much does the system optimize for returns to owners above all else?"
                  onChange={(v) => setInputs((i) => ({ ...i, profitPriority: v }))}
                />
                <SliderRow
                  label="Commons / public ownership"
                  value={inputs.commonsLevel}
                  description="How much of core infrastructure & AI is owned in common rather than privately?"
                  onChange={(v) => setInputs((i) => ({ ...i, commonsLevel: v }))}
                />
              </div>
              <div className="space-y-3">
                <SliderRow
                  label="Automation level"
                  value={inputs.automationLevel}
                  description="How far automation and AI are pushed into the production stack."
                  onChange={(v) => setInputs((i) => ({ ...i, automationLevel: v }))}
                />
                <SliderRow
                  label="Ecological constraints"
                  value={inputs.ecoConstraint}
                  description="How strictly the system refuses to overshoot planetary boundaries."
                  onChange={(v) => setInputs((i) => ({ ...i, ecoConstraint: v }))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-700/70 bg-slate-900/90 p-4 shadow-xl shadow-slate-950/80">
            <h3 className="text-sm font-semibold">System outcomes</h3>
            <p className="text-[11px] text-slate-400">
              This is a <span className="italic">toy model</span>, not a forecast.
              The point is to make one thing intuitive: changing the{" "}
              <span className="font-semibold">rules</span> of the game matters
              more than changing the{" "}
              <span className="font-semibold">tools</span>.
            </p>

            <div className="space-y-2">
              <MetricBar
                label="Inequality"
                value={outputs.inequality}
                bad
                format={(v) => `${Math.round(v * 100)} / 100`}
              />
              <MetricBar
                label="Average work week"
                value={(outputs.avgWorkHours - 10) / 40}
                format={() => `${outputs.avgWorkHours} h/week`}
              />
              <MetricBar
                label="Emissions pressure"
                value={outputs.emissionsIndex}
                bad
                format={(v) => `${Math.round(v * 100)} / 100`}
              />
              <MetricBar
                label="Material & social security"
                value={outputs.securityIndex}
                format={(v) => `${Math.round(v * 100)} / 100`}
              />
            </div>

            <div className="mt-2 rounded-xl border border-slate-700/70 bg-slate-950/80 p-3 text-[11px] text-slate-300">
              {scenarioIsNice ? (
                <>
                  <p className="font-semibold mb-1">
                    You&apos;re in Fresco territory.
                  </p>
                  <p>
                    High commons and ecological constraints mean automation mostly
                    shows up as <span className="font-semibold">time freedom</span>
                    and stability, not widespread precarity. Inequality is harder
                    to entrench when people don&apos;t need wages to survive.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold mb-1">
                    This is the &quot;default&quot; AI future.
                  </p>
                  <p>
                    Automation raises throughput, but with low commons and weak
                    ecological constraints, the gains pool at the top. Most people
                    still work long hours to access basics while emissions keep
                    pushing past safe limits. Same tools. Different rules.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Placeholder for later: we can inject the full thesis sections here */}
        <section className="mt-10 border-t border-slate-800 pt-6 text-xs text-slate-400">
          <p className="mb-1 font-semibold text-slate-200">
            What comes next
          </p>
          <p>
            This is just the core mechanic. Around it, we can layer the full
            Fresco thesis, a city builder, and scenario stories that let people
            explore how a Resource-Based Economy could actually look and feel.
          </p>
        </section>
      </div>
    </main>
  );
}
