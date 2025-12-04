"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SectionNav() {
    const pathname = usePathname();

    const current =
        pathname === "/"
            ? "simulator"
            : pathname.startsWith("/city")
                ? "city"
                : pathname.startsWith("/learn")
                    ? "learn"
                    : pathname.startsWith("/thesis")
                        ? "thesis"
                        : null;

    const baseClasses =
        "rounded-full border px-3 py-1.5 text-[11px] sm:text-xs font-medium transition-all";
    const inactive =
        "border-slate-700/70 bg-slate-950/80 text-slate-300 hover:border-violet-400 hover:text-violet-200";

    const activeSimulator =
        "border-emerald-500/70 bg-emerald-500/10 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.2)]";
    const activeCity =
        "border-sky-500/70 bg-sky-500/10 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]";
    const activeLearn =
        "border-violet-500/70 bg-violet-500/10 text-violet-200 shadow-[0_0_12px_rgba(139,92,246,0.2)]";
    const activeThesis =
        "border-amber-500/70 bg-amber-500/10 text-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.2)]";

    return (
        <nav className="mb-5 flex flex-wrap items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/learn" className="group flex items-center gap-3">
                {/* Fresco-inspired circular logo */}
                <div className="relative">
                    {/* Outer ring with gradient */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 via-sky-500 to-emerald-500 p-[2px] shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
                        {/* Inner dark circle */}
                        <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                            {/* Concentric rings - Fresco city motif */}
                            <svg viewBox="0 0 24 24" className="w-5 h-5">
                                <circle cx="12" cy="12" r="10" fill="none" stroke="url(#logoGrad)" strokeWidth="1" opacity="0.6" />
                                <circle cx="12" cy="12" r="6" fill="none" stroke="url(#logoGrad)" strokeWidth="1" opacity="0.8" />
                                <circle cx="12" cy="12" r="2.5" fill="url(#logoGrad)" />
                                <defs>
                                    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#a78bfa" />
                                        <stop offset="50%" stopColor="#38bdf8" />
                                        <stop offset="100%" stopColor="#34d399" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>
                    {/* Pulse effect on hover */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 via-sky-500 to-emerald-500 opacity-0 group-hover:opacity-30 blur-md transition-opacity" />
                </div>

                {/* Text */}
                <div className="flex flex-col">
                    <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-violet-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent leading-tight">
                        Fresco Lab
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-slate-500 tracking-wide">
                        Resource-Based Thinking
                    </span>
                </div>
            </Link>

            {/* Navigation Links */}
            <div className="flex flex-wrap items-center gap-2">
                <Link
                    href="/learn"
                    className={`${baseClasses} ${current === "learn" ? activeLearn : inactive}`}
                >
                    Learn
                </Link>

                <Link
                    href="/thesis"
                    className={`${baseClasses} ${current === "thesis" ? activeThesis : inactive}`}
                >
                    Thesis
                </Link>

                <Link
                    href="/"
                    className={`${baseClasses} ${current === "simulator" ? activeSimulator : inactive}`}
                >
                    Simulator
                </Link>

                <Link
                    href="/city"
                    className={`${baseClasses} ${current === "city" ? activeCity : inactive}`}
                >
                    City Builder
                </Link>
            </div>
        </nav>
    );
}

export function Footer() {
    return (
        <footer className="mt-12 pt-6 border-t border-slate-800/60">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs text-slate-500">
                <p className="text-center sm:text-left leading-relaxed max-w-xl">
                    <span className="text-slate-400">❤️ Made with love.</span>{" "}
                    This project is <span className="text-slate-400">not affiliated</span> with
                    The Venus Project or the Fresco estate. It&apos;s an independent tribute
                    to Jacque Fresco&apos;s ideas, built to bring his legacy to a new generation.
                </p>
                <div className="flex items-center gap-1 text-slate-600">
                    <span>Inspired by</span>
                    <span className="text-violet-400">Jacque Fresco</span>
                    <span>(1916–2017)</span>
                </div>
            </div>
        </footer>
    );
}
