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
          --bg-primary: #05070a;
          --bg-panel: rgba(11, 15, 26, 0.85);
          --bg-elevated: rgba(22, 29, 49, 0.6);
          --border: rgba(59, 91, 255, 0.12);
          --border-hover: rgba(59, 91, 255, 0.3);
          --text-primary: #f8fafc;
          --text-muted: #64748b;
          --accent: #3b5bff;
          --accent-alert: #ef4444;
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
          width: 250px;
          flex-shrink: 0;
          background: rgba(11, 15, 26, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 10px 0 30px rgba(0, 0, 0, 0.3);
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 1.75rem 1.25rem;
          border-bottom: 1px solid var(--border);
        }
        .sidebar-brand-icon {
          width: 32px; height: 32px;
          background: var(--bg-elevated);
          border: 1px solid rgba(59, 91, 255, 0.25);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 15px rgba(59, 91, 255, 0.15);
        }
        .sidebar-brand-name {
          font-size: 0.9rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #ffffff 30%, #a5b4fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .sidebar-nav::-webkit-scrollbar { width: 0; }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.7rem 0.95rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid transparent;
          position: relative;
        }
        .nav-link svg {
          color: #64748b;
          transition: color 0.2s ease;
        }
        .nav-link:hover {
          background: rgba(59, 91, 255, 0.05);
          color: var(--text-primary);
          border-color: rgba(59, 91, 255, 0.08);
        }
        .nav-link:hover svg {
          color: #93c5fd;
        }
        .nav-link.active {
          background: linear-gradient(135deg, rgba(59, 91, 255, 0.15) 0%, rgba(59, 91, 255, 0.05) 100%);
          color: #ffffff;
          border-color: rgba(59, 91, 255, 0.25);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .nav-link.active svg {
          color: #818cf8;
        }
        .nav-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 20%;
          height: 60%;
          width: 3px;
          background: var(--accent);
          border-radius: 0 4px 4px 0;
          box-shadow: 0 0 10px var(--accent);
        }

        .sidebar-footer {
          border-top: 1px solid var(--border);
          padding: 1.25rem 1rem;
          background: rgba(11, 15, 26, 0.98);
        }
        .officer-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.85rem;
        }
        .officer-avatar {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: rgba(59, 91, 255, 0.1);
          border: 1px solid rgba(59, 91, 255, 0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; font-weight: 700; color: #a5b4fc;
          font-family: var(--font-mono);
          flex-shrink: 0;
        }
        .officer-info { flex: 1; min-width: 0; }
        .officer-name {
          font-size: 0.78rem; font-weight: 700; color: var(--text-primary);
          display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .officer-meta {
          font-size: 0.65rem; color: #64748b;
          display: block; margin-top: 2px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          font-family: var(--font-mono);
          font-weight: 500;
        }
        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.6rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.01);
          font-size: 0.75rem;
          font-weight: 600;
          color: #94a3b8;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
        }
        .logout-btn:hover {
          color: var(--accent-alert);
          border-color: rgba(239, 68, 68, 0.35);
          background: rgba(239, 68, 68, 0.05);
        }

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
          padding: 0 2rem;
          height: 64px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
          background: rgba(11, 15, 26, 0.8);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .topbar-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 10px #22c55e;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        .topbar-status {
          font-size: 0.72rem;
          font-weight: 700;
          color: #22c55e;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-family: var(--font-mono);
        }

        .topbar-right { display: flex; align-items: center; gap: 1rem; }

        .topbar-search {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(13, 17, 28, 0.5);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0.5rem 0.85rem;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease;
        }
        .topbar-search:focus-within {
          border-color: rgba(59, 91, 255, 0.4);
          background: rgba(13, 17, 28, 0.85);
          box-shadow: 0 0 10px rgba(59, 91, 255, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .topbar-search input {
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.78rem;
          color: var(--text-primary);
          font-family: var(--font-sans);
          width: 220px;
        }
        .topbar-search input::placeholder { color: #475569; }

        .topbar-officer {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.4rem 0.85rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--bg-elevated);
        }
        .topbar-officer-name { font-size: 0.75rem; font-weight: 700; color: var(--text-primary); }

        /* ── PAGE CONTENT ── */
        .page-content {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
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
