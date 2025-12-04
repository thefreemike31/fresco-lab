"use client";

import { useState } from "react";
import { SectionNav, Footer } from "../../components/SectionNav";

type TabId = "fresco101" | "world2025" | "feasible" | "transition";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "fresco101", label: "Fresco 101", icon: "🎯" },
  { id: "world2025", label: "The 2025 World", icon: "🌍" },
  { id: "feasible", label: "Is RBE Feasible?", icon: "⚙️" },
  { id: "transition", label: "Transition Paths", icon: "🚀" },
];

function Fresco101Tab() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-700/70 bg-slate-950/80 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30">
            <span className="text-lg">👤</span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-100">Jacque Fresco</h3>
            <p className="text-xs text-slate-400">1916–2017</p>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          Industrial designer, futurist, and self-taught social engineer who spent 75+ years
          developing the <span className="font-semibold text-violet-300">Resource-Based Economy (RBE)</span>—a
          system where resources, not money, form the basis of decision-making.
        </p>
      </div>

      <div className="space-y-3">
        {[
          { color: "emerald", title: "Money ≠ Physics", desc: "It's a social technology we invented—and can redesign." },
          { color: "sky", title: "Tech Manages Complexity", desc: "AI already runs supply chains, grids, and logistics." },
          { color: "amber", title: "Cities as Systems", desc: "Integrated rings, not random sprawl." },
          { color: "rose", title: "Environment Shapes Behavior", desc: "Greed is a response to scarcity, not human nature." },
        ].map((item, i) => (
          <div key={i} className={`flex items-start gap-3 rounded-xl border border-${item.color}-500/30 bg-${item.color}-500/5 p-3`}
            style={{ borderColor: `var(--color-${item.color}-500, rgba(100,100,100,0.3))` }}>
            <span className={`text-${item.color}-400 font-bold text-sm mt-0.5`}>#{i + 1}</span>
            <div>
              <p className="text-sm font-semibold text-slate-200">{item.title}</p>
              <p className="text-xs text-slate-400">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function World2025Tab() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { value: "62%", label: "of global wealth held by top 1%", color: "rose" },
          { value: "1.5°C", label: "warming threshold we're breaching", color: "amber" },
          { value: "40%", label: "of jobs at high automation risk", color: "sky" },
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl border border-slate-700/70 bg-slate-950/80 p-5 text-center">
            <p className={`text-3xl font-bold text-${stat.color}-400`}
              style={{ color: stat.color === "rose" ? "#fb7185" : stat.color === "amber" ? "#fbbf24" : "#38bdf8" }}>
              {stat.value}
            </p>
            <p className="text-xs text-slate-400 mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
          <h3 className="font-semibold text-amber-300 mb-2">⚡ The Automation Paradox</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            AI can handle logistics, manufacturing, customer service, and creative work.
            Yet instead of liberating time, automation under profit rules creates
            <span className="font-semibold"> job anxiety</span>,
            <span className="font-semibold"> wage pressure</span>, and
            <span className="font-semibold"> wealth concentration</span>.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
          <h3 className="font-semibold text-emerald-300 mb-2">🌱 Meanwhile, We Have...</h3>
          <ul className="text-sm text-slate-300 space-y-1">
            <li>• <span className="font-semibold">Food</span> to feed 10 billion people</li>
            <li>• <span className="font-semibold">Renewable energy</span> to power civilization many times over</li>
            <li>• <span className="font-semibold">Compute power</span> to coordinate global logistics in real-time</li>
          </ul>
          <p className="text-xs text-slate-400 mt-3 italic">The constraint isn&apos;t physics—it&apos;s the rules.</p>
        </div>
      </div>
    </div>
  );
}

function FeasibleTab() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-emerald-300 mb-3">✓ Already Solved</h3>
        {[
          { title: "Real-Time Resource Tracking", desc: "IoT, satellites, and AI track inventory, energy, and supply chains globally." },
          { title: "Complex Allocation", desc: "AI optimizes across millions of variables—energy grids, airlines, logistics." },
          { title: "Renewable Energy", desc: "Solar, wind, and storage costs have plummeted. Scale is proven." },
        ].map((item, i) => (
          <div key={i} className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="text-sm font-semibold text-slate-200">{item.title}</p>
            <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-amber-300 mb-3">⚡ Open Challenges</h3>
        {[
          { title: "Coordination & Governance", desc: "How do communities decide priorities? How do we prevent new elite capture?" },
          { title: "Transition Path", desc: "You can't flip a switch. What are the stepping stones from here to there?" },
        ].map((item, i) => (
          <div key={i} className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
            <p className="text-sm font-semibold text-slate-200">{item.title}</p>
            <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
          </div>
        ))}
        <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-4">
          <p className="text-sm text-slate-300">
            <span className="font-semibold text-violet-300">Key insight:</span> These are
            <span className="font-semibold"> design problems</span>, not impossibilities.
            Democracy, open-source governance, and participatory planning offer starting points.
          </p>
        </div>
      </div>
    </div>
  );
}

function TransitionTab() {
  const strategies = [
    { icon: "🏥", title: "Universal Basic Services", desc: "Direct access to housing, healthcare, transit—decommodify needs.", color: "violet" },
    { icon: "🤝", title: "Platform Cooperatives", desc: "Worker/user-owned alternatives to extractive platforms.", color: "sky" },
    { icon: "🔓", title: "Open-Source AI", desc: "Keep AI public and transparent. Community-owned data trusts.", color: "emerald" },
    { icon: "🌍", title: "Ecological Hard Limits", desc: "Encode planetary boundaries into law and code.", color: "amber" },
    { icon: "⏰", title: "Reduced Work Week", desc: "Share automation gains through shorter work weeks.", color: "rose" },
    { icon: "🏙️", title: "Pilot Cities", desc: "Test RBE principles at municipal scale first.", color: "fuchsia" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        {strategies.map((s, i) => (
          <div key={i} className="rounded-xl border border-slate-700/70 bg-slate-950/80 p-4 hover:border-slate-500/70 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{s.icon}</span>
              <h4 className="text-sm font-semibold text-slate-200">{s.title}</h4>
            </div>
            <p className="text-xs text-slate-400">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 p-5">
        <p className="text-sm text-slate-200 text-center">
          <span className="font-semibold text-violet-300">The key insight:</span> You don&apos;t need to abolish money overnight.
          <span className="font-semibold"> Expand the commons</span>—the sphere of life governed by access rather than purchase—until
          the market becomes a smaller slice of how we meet needs.
        </p>
      </div>
    </div>
  );
}

export default function ThesisPage() {
  const [activeTab, setActiveTab] = useState<TabId>("fresco101");

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-8 sm:pt-10">
        <header className="mb-6">
          <SectionNav />

          <h1 className="mt-2 text-[24px] sm:text-[28px] md:text-[32px] font-semibold leading-tight text-slate-50">
            Why Jacque Fresco&apos;s work is{" "}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
              more relevant now than ever
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-[13px] sm:text-sm text-slate-400">
            The narrative behind the simulator: Fresco&apos;s ideas, the 2025 world, and why AI makes
            a Resource-Based Economy both technically feasible and strategically necessary.
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all ${isActive
                  ? "border-white/30 bg-white/10 text-white shadow-lg shadow-white/5"
                  : "border-slate-600/60 bg-slate-950/60 text-slate-400 hover:border-slate-400 hover:text-slate-200"
                  }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="rounded-2xl border border-slate-700/70 bg-slate-900/90 p-5 sm:p-6 shadow-xl min-h-[400px]">
          {activeTab === "fresco101" && <Fresco101Tab />}
          {activeTab === "world2025" && <World2025Tab />}
          {activeTab === "feasible" && <FeasibleTab />}
          {activeTab === "transition" && <TransitionTab />}
        </div>

        {/* Footer CTA */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-700/60 bg-slate-950/60 p-4">
          <p className="text-sm text-slate-400">
            See these ideas in action—adjust the rules and watch the outcomes change.
          </p>
          <a
            href="/"
            className="rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white hover:from-violet-500 hover:to-violet-400 transition-all shadow-lg shadow-violet-500/25"
          >
            Open Simulator →
          </a>
        </div>

        <Footer />
      </div>
    </main>
  );
}
