"use client";

import Link from "next/link";
import { SectionNav, Footer } from "../../components/SectionNav";

export default function LearnPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-8 sm:pt-10">
        <header className="mb-6">
          <SectionNav />

          <h1 className="mt-2 text-[24px] sm:text-[28px] md:text-[32px] font-semibold leading-tight text-slate-50">
            From{" "}
            <span className="bg-gradient-to-r from-violet-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
              Fresco&apos;s vision
            </span>{" "}
            to interactive experiments.
          </h1>
          <p className="mt-3 max-w-2xl text-[13px] sm:text-sm text-slate-400">
            This lab argues that AI + automation + planetary limits make a resource-based
            approach not just idealistic, but practical. Explore the tools below.
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid gap-5 lg:grid-cols-3">

          {/* Card 1: What is RBE */}
          <div className="rounded-2xl border border-slate-700/70 bg-slate-900/90 p-5 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30">
                <span className="text-xl">💡</span>
              </div>
              <h2 className="font-semibold text-slate-100">What is RBE?</h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              A <span className="font-semibold text-violet-300">Resource-Based Economy</span> starts
              from physical reality—resources, energy, skills, tech—then designs access around that,
              instead of around money.
            </p>
            <div className="space-y-2">
              {[
                "Money is a control layer, not physics",
                "AI can allocate resources directly",
                "The bottleneck is rules, not tech",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-emerald-400">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Simulator */}
          <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-slate-900/90 p-5 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                <span className="text-xl">📊</span>
              </div>
              <h2 className="font-semibold text-slate-100">AI Simulator</h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Adjust <span className="font-semibold">profit priority</span>,
              <span className="font-semibold"> commons</span>,
              <span className="font-semibold"> automation</span>, and
              <span className="font-semibold"> ecological limits</span>.
              Watch 30 years unfold.
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
              <div className="rounded-lg bg-slate-950/80 p-2 text-center">
                <p className="text-emerald-300 font-semibold">Inequality</p>
              </div>
              <div className="rounded-lg bg-slate-950/80 p-2 text-center">
                <p className="text-sky-300 font-semibold">Work Hours</p>
              </div>
              <div className="rounded-lg bg-slate-950/80 p-2 text-center">
                <p className="text-amber-300 font-semibold">Emissions</p>
              </div>
              <div className="rounded-lg bg-slate-950/80 p-2 text-center">
                <p className="text-violet-300 font-semibold">Security</p>
              </div>
            </div>
            <Link
              href="/"
              className="block w-full text-center rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
            >
              Open Simulator →
            </Link>
          </div>

          {/* Card 3: City Builder */}
          <div className="rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-slate-900/90 p-5 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30">
                <span className="text-xl">🏙️</span>
              </div>
              <h2 className="font-semibold text-slate-100">City Builder</h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Design a circular city in Fresco&apos;s style. Place
              <span className="font-semibold"> housing</span>,
              <span className="font-semibold"> food</span>,
              <span className="font-semibold"> energy</span>, and
              <span className="font-semibold"> transit</span> in concentric rings.
            </p>
            <div className="flex justify-center gap-3 mb-4">
              {["🏠", "🌱", "⚡", "🚄", "🏥"].map((icon, i) => (
                <div key={i} className="w-8 h-8 rounded-lg bg-slate-950/80 flex items-center justify-center text-lg">
                  {icon}
                </div>
              ))}
            </div>
            <Link
              href="/city"
              className="block w-full text-center rounded-full bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-sky-400 transition-colors"
            >
              Open City Builder →
            </Link>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid gap-5 lg:grid-cols-2 mt-5">

          {/* How to use */}
          <div className="rounded-2xl border border-slate-700/70 bg-slate-900/90 p-5 shadow-xl">
            <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <span>🎯</span> How to Use This Lab
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { step: "1", title: "Read the Thesis", desc: "Understand why RBE matters now", link: "/thesis" },
                { step: "2", title: "Try the Simulator", desc: "See how rules shape outcomes", link: "/" },
                { step: "3", title: "Build a City", desc: "Design systems, not buildings", link: "/city" },
              ].map((item) => (
                <Link
                  key={item.step}
                  href={item.link}
                  className="rounded-xl border border-slate-700/60 bg-slate-950/60 p-4 hover:border-violet-500/50 transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-300">
                      {item.step}
                    </span>
                    <span className="text-sm font-semibold text-slate-200 group-hover:text-violet-300 transition-colors">{item.title}</span>
                  </div>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Why this matters */}
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-slate-900/90 p-5 shadow-xl">
            <h3 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
              <span>⚡</span> Why This Matters Now
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-3">
              AI is already managing supply chains, energy grids, and recommendations.
              The question isn&apos;t <span className="italic">whether</span> we&apos;ll have automated coordination—it&apos;s
              <span className="font-semibold text-amber-300"> what we point it at</span>.
            </p>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex-1 rounded-lg bg-slate-950/80 p-3 text-center">
                <p className="text-rose-400 font-semibold">Profit & Control</p>
                <p className="text-slate-500 mt-1">Current default</p>
              </div>
              <span className="text-slate-500">vs</span>
              <div className="flex-1 rounded-lg bg-slate-950/80 p-3 text-center">
                <p className="text-emerald-400 font-semibold">Abundance & Stability</p>
                <p className="text-slate-500 mt-1">RBE approach</p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
