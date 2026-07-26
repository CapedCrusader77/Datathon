"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  {
    href: "/dashboard",
    label: "Overview",
    id: "nav-dashboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/>
        <rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/chat",
    label: "PoliceGPT Chat",
    id: "nav-chat",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/cases",
    label: "FIR & Cases",
    id: "nav-cases",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/suspects",
    label: "Suspects",
    id: "nav-suspects",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/analytics",
    label: "Analytics",
    id: "nav-analytics",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/graph",
    label: "Knowledge Graph",
    id: "nav-graph",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="12" cy="18" r="3"/>
        <line x1="8.5" y1="7.5" x2="15.5" y2="7.5"/><line x1="7.5" y1="8.5" x2="10.5" y2="15.5"/>
        <line x1="16.5" y1="8.5" x2="13.5" y2="15.5"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/reports",
    label: "Reports",
    id: "nav-reports",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/search",
    label: "Search",
    id: "nav-search",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [officer, setOfficer] = useState<{ name: string; role: string; badge: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("pgpt_token");
    if (!token) { router.push("/"); return; }
    const data = localStorage.getItem("pgpt_officer");
    if (data) setOfficer(JSON.parse(data));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("pgpt_token");
    localStorage.removeItem("pgpt_officer");
    router.push("/");
  };

  const initials = officer?.name?.split(" ").map((w) => w[0]).join("").slice(0, 2) ?? "O";

  return (
    <>
      <style>{`
        :root {
          --bg-primary: #0d0f14;
          --bg-panel: #141720;
          --bg-elevated: #1c2030;
          --border: #2a2f3e;
          --text-primary: #f1f5f9;
          --text-muted: #94a3b8;
          --accent: #2563eb;
          --accent-alert: #dc2626;
          --font-sans: 'Inter', -apple-system, sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; background: var(--bg-primary); }

        .shell {
          display: flex;
          height: 100vh;
          font-family: var(--font-sans);
          -webkit-font-smoothing: antialiased;
          background: var(--bg-primary);
          color: var(--text-primary);
          overflow: hidden;
        }

        /* ── SIDEBAR ── */
        .sidebar {
          width: 230px;
          flex-shrink: 0;
          background: var(--bg-panel);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 1.25rem 1rem;
          border-bottom: 1px solid var(--border);
        }
        .sidebar-brand-icon {
          width: 28px; height: 28px;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .sidebar-brand-name {
          font-size: 0.825rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-primary);
        }

        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 0.75rem 0.625rem;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .sidebar-nav::-webkit-scrollbar { width: 0; }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.55rem 0.75rem;
          border-radius: 6px;
          font-size: 0.825rem;
          font-weight: 500;
          color: var(--text-muted);
          text-decoration: none;
          transition: background 0.15s ease, color 0.15s ease;
          border: 1px solid transparent;
        }
        .nav-link:hover {
          background: var(--bg-elevated);
          color: var(--text-primary);
        }
        .nav-link.active {
          background: var(--accent);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.15);
          font-weight: 600;
        }
        .nav-link.active svg { color: #ffffff; }

        .sidebar-footer {
          border-top: 1px solid var(--border);
          padding: 0.875rem 0.75rem;
          background: var(--bg-panel);
        }
        .officer-row {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          margin-bottom: 0.625rem;
        }
        .officer-avatar {
          width: 28px; height: 28px;
          border-radius: 6px;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem; font-weight: 700; color: var(--text-primary);
          font-family: var(--font-mono);
          flex-shrink: 0;
        }
        .officer-info { flex: 1; min-width: 0; }
        .officer-name {
          font-size: 0.75rem; font-weight: 600; color: var(--text-primary);
          display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .officer-meta {
          font-size: 0.65rem; color: var(--text-muted);
          display: block; margin-top: 1px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          font-family: var(--font-mono);
        }
        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.5rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--bg-primary);
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-muted);
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s ease;
        }
        .logout-btn:hover { color: var(--accent-alert); border-color: rgba(220, 38, 38, 0.4); }

        /* ── MAIN ── */
        .main-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: var(--bg-primary);
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          height: 52px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
          background: var(--bg-panel);
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }
        .topbar-dot {
          width: 6px; height: 6px;
          border-radius: 2px;
          background: var(--accent);
        }
        .topbar-status {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-family: var(--font-mono);
        }

        .topbar-right { display: flex; align-items: center; gap: 0.75rem; }

        .topbar-search {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 0.4rem 0.75rem;
        }
        .topbar-search input {
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.78rem;
          color: var(--text-primary);
          font-family: var(--font-sans);
          width: 200px;
        }
        .topbar-search input::placeholder { color: var(--text-muted); }

        .topbar-officer {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.75rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--bg-elevated);
        }
        .topbar-officer-name { font-size: 0.75rem; font-weight: 600; color: var(--text-primary); }

        /* ── PAGE CONTENT ── */
        .page-content {
          flex: 1;
          overflow-y: auto;
          padding: 1.75rem;
        }
      `}</style>

      <div className="shell">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L17 5V11C17 15 10 18 10 18C10 18 3 15 3 11V5L10 2Z" stroke="#3b5bff" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
                <path d="M7 10L9.5 12.5L13 8" stroke="#3b5bff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="sidebar-brand-name">PoliceGPT</span>
          </div>

          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href} id={item.id} className={`nav-link${active ? " active" : ""}`}>
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            {officer && (
              <div className="officer-row">
                <div className="officer-avatar">{initials}</div>
                <div className="officer-info">
                  <span className="officer-name">{officer.name}</span>
                  <span className="officer-meta">{officer.badge} · {officer.role}</span>
                </div>
              </div>
            )}
            <button id="logout-btn" className="logout-btn" onClick={handleLogout}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign out
            </button>
          </div>
        </aside>

        {/* MAIN AREA */}
        <div className="main-wrap">
          {/* Topbar */}
          <header className="topbar">
            <div className="topbar-left">
              <div className="topbar-dot" />
              <span className="topbar-status">KSP INTELLIGENCE NET · DEMO DATA</span>
            </div>
            <div className="topbar-right">
              <div className="topbar-search">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2a3048" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input id="quick-search" type="text" placeholder="Search FIRs, suspects… (⌘K)" />
              </div>
              {officer && (
                <div className="topbar-officer">
                  <div className="officer-avatar" style={{ width: 22, height: 22, borderRadius: 5, fontSize: "0.6rem" }}>{initials}</div>
                  <span className="topbar-officer-name">{officer.name}</span>
                </div>
              )}
            </div>
          </header>

          {/* Page */}
          <main className="page-content">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
