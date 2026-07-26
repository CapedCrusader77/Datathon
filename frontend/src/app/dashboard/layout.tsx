"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    id: "nav-dashboard",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>
      </svg>
    )
  },
  {
    href: "/dashboard/chat",
    label: "POLICEGPT Chat",
    id: "nav-chat",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8"/><path d="M8 13h6"/>
      </svg>
    )
  },
  {
    href: "/dashboard/cases",
    label: "FIR & Cases",
    id: "nav-cases",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    )
  },
  {
    href: "/dashboard/suspects",
    label: "Suspect Profiles",
    id: "nav-suspects",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    )
  },
  {
    href: "/dashboard/analytics",
    label: "Crime Analytics",
    id: "nav-analytics",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    )
  },
  {
    href: "/dashboard/graph",
    label: "Knowledge Graph",
    id: "nav-graph",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><line x1="8.5" y1="7.5" x2="15.5" y2="7.5"/><line x1="7.5" y1="8.5" x2="10.5" y2="15.5"/><line x1="16.5" y1="8.5" x2="13.5" y2="15.5"/>
      </svg>
    )
  },
  {
    href: "/dashboard/reports",
    label: "Reports",
    id: "nav-reports",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/>
      </svg>
    )
  },
  {
    href: "/dashboard/search",
    label: "Smart Search",
    id: "nav-search",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    )
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [officer, setOfficer] = useState<{ name: string; role: string; badge: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications] = useState(3);

  useEffect(() => {
    const token = localStorage.getItem("pgpt_token");
    if (!token) { router.push("/"); return; }
    const officerData = localStorage.getItem("pgpt_officer");
    if (officerData) setOfficer(JSON.parse(officerData));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("pgpt_token");
    localStorage.removeItem("pgpt_officer");
    router.push("/");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#040812] selection:bg-blue-500 selection:text-white">
      {/* ── Sidebar ── */}
      <aside className={`sidebar flex flex-col transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"} flex-shrink-0 z-30`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-blue-500/15">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #1e40af 0%, #0f2342 100%)",
              border: "1px solid rgba(59, 130, 246, 0.4)",
              boxShadow: "0 0 20px rgba(59, 130, 246, 0.25)"
            }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          {sidebarOpen && (
            <div>
              <p className="font-extrabold text-base tracking-wider gradient-text-blue" style={{ fontFamily: "'Outfit', sans-serif" }}>
                POLICE<span className="text-amber-400">GPT</span>
              </p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Karnataka State Police</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} id={item.id}
                title={!sidebarOpen ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  active
                    ? "bg-blue-600/20 border border-blue-500/40 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                    : "text-slate-400 hover:bg-blue-600/10 hover:text-slate-200 border border-transparent"
                } ${!sidebarOpen ? "justify-center" : ""}`}>
                <span className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${active ? "text-blue-400" : "text-slate-400"}`}>
                  {item.svg}
                </span>
                {sidebarOpen && (
                  <span className="text-xs font-semibold tracking-wide">{item.label}</span>
                )}
                {active && sidebarOpen && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Officer Profile in Sidebar */}
        {officer && (
          <div className="p-3.5 border-t border-blue-500/15 bg-slate-950/40">
            <div className={`flex items-center gap-3 ${!sidebarOpen ? "justify-center" : ""}`}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs shadow-md"
                style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)", border: "1px solid rgba(255,255,255,0.2)" }}>
                {officer.name?.charAt(0) || "O"}
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-200 truncate">{officer.name}</p>
                  <p className="text-[10px] text-slate-500 capitalize truncate font-mono">{officer.role} • {officer.badge}</p>
                </div>
              )}
            </div>
            {sidebarOpen && (
              <button onClick={handleLogout} id="logout-btn"
                className="btn-ghost mt-3 w-full text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-2 hover:border-red-500/40 hover:text-red-400 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign Out
              </button>
            )}
          </div>
        )}
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="navbar flex items-center justify-between px-6 py-3 flex-shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-blue-500/40 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="live-dot" />
              <span className="text-[11px] font-semibold text-emerald-400 tracking-widest uppercase">KSP INTELLIGENCE NET</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick search input */}
            <div className="relative hidden md:block">
              <input id="quick-search" type="text" placeholder="Search FIRs, Suspects, Vehicles... (Ctrl+K)"
                className="pg-input py-1.5 text-xs rounded-xl"
                style={{ width: "280px", paddingLeft: "2.5rem" }} />
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>

            {/* Notification trigger */}
            <button id="alerts-btn" className="relative p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-blue-500/40 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center bg-red-500 text-white animate-pulse">
                  {notifications}
                </span>
              )}
            </button>

            {/* Officer Chip */}
            {officer && (
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-blue-500/20 shadow-sm">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow"
                  style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)" }}>
                  {officer.name?.charAt(0)}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold text-slate-200 leading-tight">{officer.name}</p>
                  <p className="text-[9px] text-slate-400 capitalize font-mono leading-tight">{officer.badge}</p>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-transparent to-slate-950/40">
          {children}
        </main>
      </div>
    </div>
  );
}
