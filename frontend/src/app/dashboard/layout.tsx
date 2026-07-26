"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/dashboard",       icon: "⬡",  label: "Dashboard",      id: "nav-dashboard" },
  { href: "/dashboard/chat",  icon: "🤖", label: "POLICEGPT Chat", id: "nav-chat" },
  { href: "/dashboard/cases", icon: "📋", label: "FIR & Cases",    id: "nav-cases" },
  { href: "/dashboard/suspects", icon: "👤", label: "Suspects",    id: "nav-suspects" },
  { href: "/dashboard/analytics", icon: "📊", label: "Analytics", id: "nav-analytics" },
  { href: "/dashboard/graph", icon: "🕸️", label: "Knowledge Graph", id: "nav-graph" },
  { href: "/dashboard/reports", icon: "📄", label: "Reports",      id: "nav-reports" },
  { href: "/dashboard/search", icon: "🔍", label: "Search",        id: "nav-search" },
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
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      {/* ── Sidebar ── */}
      <aside className={`sidebar flex flex-col transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"} flex-shrink-0`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: "1px solid var(--border-primary)" }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#1e40af,#1e3a5f)", border: "1px solid rgba(59,130,246,0.4)" }}>
            <span className="text-lg">🛡️</span>
          </div>
          {sidebarOpen && (
            <div>
              <p className="font-bold text-sm gradient-text-blue" style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.1em" }}>
                POLICEGPT
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Karnataka Police</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} id={item.id}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all duration-200 group
                  ${active
                    ? "bg-blue-600/20 border border-blue-500/30 text-blue-400"
                    : "text-slate-400 hover:bg-blue-600/10 hover:text-slate-200"
                  }`}>
                <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
                {sidebarOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
                {active && sidebarOpen && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Officer profile */}
        {officer && (
          <div className="p-3" style={{ borderTop: "1px solid var(--border-primary)" }}>
            <div className={`flex items-center gap-3 ${!sidebarOpen && "justify-center"}`}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
                style={{ background: "linear-gradient(135deg,#1e40af,#7c3aed)" }}>
                {officer.name?.charAt(0) || "O"}
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>{officer.name}</p>
                  <p className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>{officer.role} • {officer.badge}</p>
                </div>
              )}
            </div>
            {sidebarOpen && (
              <button onClick={handleLogout} id="logout-btn"
                className="btn-ghost mt-3 w-full text-xs py-1.5 px-3 rounded-lg">
                ↪ Logout
              </button>
            )}
          </div>
        )}
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="navbar flex items-center justify-between px-6 py-3 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-blue-600/10 transition-colors"
              style={{ color: "var(--text-secondary)" }}>
              ☰
            </button>
            <div className="flex items-center gap-2">
              <div className="live-dot" />
              <span className="text-xs font-medium" style={{ color: "#10b981", letterSpacing: "0.1em" }}>LIVE</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Alert badge */}
            <button id="alerts-btn" className="relative p-2 rounded-lg hover:bg-blue-600/10 transition-colors"
              style={{ color: "var(--text-secondary)" }}>
              🔔
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center"
                  style={{ background: "#ef4444", color: "white", fontSize: "0.6rem" }}>
                  {notifications}
                </span>
              )}
            </button>

            {/* Quick search */}
            <div className="relative hidden md:block">
              <input id="quick-search" type="text" placeholder="Quick search..." className="pg-input py-1.5 text-sm"
                style={{ width: "240px", paddingLeft: "2.5rem" }} />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--text-muted)" }}>
                🔍
              </span>
            </div>

            {officer && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-primary)" }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  style={{ background: "linear-gradient(135deg,#1e40af,#7c3aed)" }}>
                  {officer.name?.charAt(0)}
                </div>
                <span className="text-xs hidden lg:block" style={{ color: "var(--text-secondary)" }}>
                  {officer.name}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
