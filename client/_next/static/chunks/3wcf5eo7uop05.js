(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,95057,(e,r,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o={formatUrl:function(){return s},formatWithValidation:function(){return c},urlObjectKeys:function(){return l}};for(var a in o)Object.defineProperty(t,a,{enumerable:!0,get:o[a]});let n=e.r(90809)._(e.r(98183)),i=/https?|ftp|gopher|file/;function s(e){let{auth:r,hostname:t}=e,o=e.protocol||"",a=e.pathname||"",s=e.hash||"",l=e.query||"",c=!1;r=r?encodeURIComponent(r).replace(/%3A/i,":")+"@":"",e.host?c=r+e.host:t&&(c=r+(~t.indexOf(":")?`[${t}]`:t),e.port&&(c+=":"+e.port)),l&&"object"==typeof l&&(l=String(n.urlQueryToSearchParams(l)));let d=e.search||l&&`?${l}`||"";return o&&!o.endsWith(":")&&(o+=":"),e.slashes||(!o||i.test(o))&&!1!==c?(c="//"+(c||""),a&&"/"!==a[0]&&(a="/"+a)):c||(c=""),s&&"#"!==s[0]&&(s="#"+s),d&&"?"!==d[0]&&(d="?"+d),a=a.replace(/[?#]/g,encodeURIComponent),d=d.replace("#","%23"),`${o}${c}${a}${d}${s}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function c(e){return s(e)}},18581,(e,r,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"useMergedRef",{enumerable:!0,get:function(){return a}});let o=e.r(71645);function a(e,r){let t=(0,o.useRef)(null),a=(0,o.useRef)(null);return(0,o.useCallback)(o=>{if(null===o){let e=t.current;e&&(t.current=null,e());let r=a.current;r&&(a.current=null,r())}else e&&(t.current=n(e,o)),r&&(a.current=n(r,o))},[e,r])}function n(e,r){if("function"!=typeof e)return e.current=r,()=>{e.current=null};{let t=e(r);return"function"==typeof t?t:()=>e(null)}}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),r.exports=t.default)},73668,(e,r,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"isLocalURL",{enumerable:!0,get:function(){return n}});let o=e.r(18967),a=e.r(52817);function n(e){if(!(0,o.isAbsoluteUrl)(e))return!0;try{let r=(0,o.getLocationOrigin)(),t=new URL(e,r);return t.origin===r&&(0,a.hasBasePath)(t.pathname)}catch(e){return!1}}},84508,(e,r,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"errorOnce",{enumerable:!0,get:function(){return o}});let o=e=>{}},22016,(e,r,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o={default:function(){return g},useLinkStatus:function(){return v}};for(var a in o)Object.defineProperty(t,a,{enumerable:!0,get:o[a]});let n=e.r(90809),i=e.r(43476),s=n._(e.r(71645)),l=e.r(95057),c=e.r(8372),d=e.r(18581),f=e.r(18967),p=e.r(5550);e.r(33525);let h=e.r(88540),u=e.r(91949),b=e.r(73668),x=e.r(9396);function g(r){var t,o;let a,n,g,[v,y]=(0,s.useOptimistic)(u.IDLE_LINK_STATUS),j=(0,s.useRef)(null),{href:k,as:w,children:L,prefetch:N=null,passHref:C,replace:S,shallow:_,scroll:P,onClick:O,onMouseEnter:T,onTouchStart:M,legacyBehavior:R=!1,onNavigate:E,transitionTypes:B,ref:I,unstable_dynamicOnHover:z,...A}=r;a=L,R&&("string"==typeof a||"number"==typeof a)&&(a=(0,i.jsx)("a",{children:a}));let W=s.default.useContext(c.AppRouterContext),U=!1!==N,K=!1!==N?null===(o=N)||"auto"===o?x.FetchStrategy.PPR:x.FetchStrategy.Full:x.FetchStrategy.PPR,D="string"==typeof(t=w||k)?t:(0,l.formatUrl)(t);if(R){if(a?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});n=s.default.Children.only(a)}let $=R?n&&"object"==typeof n&&n.ref:I,F=s.default.useCallback(e=>(null!==W&&(j.current=(0,u.mountLinkInstance)(e,D,W,K,U,y)),()=>{j.current&&((0,u.unmountLinkForCurrentNavigation)(j.current),j.current=null),(0,u.unmountPrefetchableInstance)(e)}),[U,D,W,K,y]),V={ref:(0,d.useMergedRef)(F,$),onClick(r){R||"function"!=typeof O||O(r),R&&n.props&&"function"==typeof n.props.onClick&&n.props.onClick(r),!W||r.defaultPrevented||function(r,t,o,a,n,i,l){if("u">typeof window){let c,{nodeName:d}=r.currentTarget;if("A"===d.toUpperCase()&&((c=r.currentTarget.getAttribute("target"))&&"_self"!==c||r.metaKey||r.ctrlKey||r.shiftKey||r.altKey||r.nativeEvent&&2===r.nativeEvent.which)||r.currentTarget.hasAttribute("download"))return;if(!(0,b.isLocalURL)(t)){a&&(r.preventDefault(),location.replace(t));return}if(r.preventDefault(),i){let e=!1;if(i({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:f}=e.r(99781);s.default.startTransition(()=>{f(t,a?"replace":"push",!1===n?h.ScrollBehavior.NoScroll:h.ScrollBehavior.Default,o.current,l)})}}(r,D,j,S,P,E,B)},onMouseEnter(e){R||"function"!=typeof T||T(e),R&&n.props&&"function"==typeof n.props.onMouseEnter&&n.props.onMouseEnter(e),W&&U&&(0,u.onNavigationIntent)(e.currentTarget,!0===z)},onTouchStart:function(e){R||"function"!=typeof M||M(e),R&&n.props&&"function"==typeof n.props.onTouchStart&&n.props.onTouchStart(e),W&&U&&(0,u.onNavigationIntent)(e.currentTarget,!0===z)}};return(0,f.isAbsoluteUrl)(D)?V.href=D:R&&!C&&("a"!==n.type||"href"in n.props)||(V.href=(0,p.addBasePath)(D)),g=R?s.default.cloneElement(n,V):(0,i.jsx)("a",{...A,...V,children:a}),(0,i.jsx)(m.Provider,{value:v,children:g})}e.r(84508);let m=(0,s.createContext)(u.IDLE_LINK_STATUS),v=()=>(0,s.useContext)(m);("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),r.exports=t.default)},18566,(e,r,t)=>{r.exports=e.r(76562)},39126,e=>{"use strict";var r=e.i(43476),t=e.i(71645),o=e.i(18566),a=e.i(22016);let n=[{href:"/dashboard",label:"Overview",id:"nav-dashboard",icon:(0,r.jsxs)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,r.jsx)("rect",{x:"3",y:"3",width:"7",height:"9",rx:"1"}),(0,r.jsx)("rect",{x:"14",y:"3",width:"7",height:"5",rx:"1"}),(0,r.jsx)("rect",{x:"14",y:"12",width:"7",height:"9",rx:"1"}),(0,r.jsx)("rect",{x:"3",y:"16",width:"7",height:"5",rx:"1"})]})},{href:"/dashboard/chat",label:"PoliceGPT Chat",id:"nav-chat",icon:(0,r.jsx)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:(0,r.jsx)("path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"})})},{href:"/dashboard/cases",label:"FIR & Cases",id:"nav-cases",icon:(0,r.jsxs)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,r.jsx)("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),(0,r.jsx)("polyline",{points:"14 2 14 8 20 8"}),(0,r.jsx)("line",{x1:"16",y1:"13",x2:"8",y2:"13"}),(0,r.jsx)("line",{x1:"16",y1:"17",x2:"8",y2:"17"})]})},{href:"/dashboard/suspects",label:"Suspects",id:"nav-suspects",icon:(0,r.jsxs)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,r.jsx)("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),(0,r.jsx)("circle",{cx:"12",cy:"7",r:"4"})]})},{href:"/dashboard/analytics",label:"Analytics",id:"nav-analytics",icon:(0,r.jsxs)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,r.jsx)("line",{x1:"18",y1:"20",x2:"18",y2:"10"}),(0,r.jsx)("line",{x1:"12",y1:"20",x2:"12",y2:"4"}),(0,r.jsx)("line",{x1:"6",y1:"20",x2:"6",y2:"14"})]})},{href:"/dashboard/graph",label:"Knowledge Graph",id:"nav-graph",icon:(0,r.jsxs)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,r.jsx)("circle",{cx:"6",cy:"6",r:"3"}),(0,r.jsx)("circle",{cx:"18",cy:"6",r:"3"}),(0,r.jsx)("circle",{cx:"12",cy:"18",r:"3"}),(0,r.jsx)("line",{x1:"8.5",y1:"7.5",x2:"15.5",y2:"7.5"}),(0,r.jsx)("line",{x1:"7.5",y1:"8.5",x2:"10.5",y2:"15.5"}),(0,r.jsx)("line",{x1:"16.5",y1:"8.5",x2:"13.5",y2:"15.5"})]})},{href:"/dashboard/reports",label:"Reports",id:"nav-reports",icon:(0,r.jsxs)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,r.jsx)("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),(0,r.jsx)("polyline",{points:"14 2 14 8 20 8"}),(0,r.jsx)("path",{d:"M12 18v-6"}),(0,r.jsx)("path",{d:"m9 15 3 3 3-3"})]})},{href:"/dashboard/search",label:"Search",id:"nav-search",icon:(0,r.jsxs)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,r.jsx)("circle",{cx:"11",cy:"11",r:"8"}),(0,r.jsx)("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]})}];e.s(["default",0,function({children:e}){let i=(0,o.useRouter)(),s=(0,o.usePathname)(),[l,c]=(0,t.useState)(null);(0,t.useEffect)(()=>{if(!localStorage.getItem("pgpt_token"))return void i.push("/");let e=localStorage.getItem("pgpt_officer");e&&c(JSON.parse(e))},[i]);let d=l?.name?.split(" ").map(e=>e[0]).join("").slice(0,2)??"O";return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("style",{children:`
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
      `}),(0,r.jsxs)("div",{className:"shell",children:[(0,r.jsxs)("aside",{className:"sidebar",children:[(0,r.jsxs)("div",{className:"sidebar-brand",children:[(0,r.jsx)("div",{className:"sidebar-brand-icon",children:(0,r.jsxs)("svg",{width:"15",height:"15",viewBox:"0 0 20 20",fill:"none",children:[(0,r.jsx)("path",{d:"M10 2L17 5V11C17 15 10 18 10 18C10 18 3 15 3 11V5L10 2Z",stroke:"#3b5bff",strokeWidth:"1.4",fill:"none",strokeLinejoin:"round"}),(0,r.jsx)("path",{d:"M7 10L9.5 12.5L13 8",stroke:"#3b5bff",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round"})]})}),(0,r.jsx)("span",{className:"sidebar-brand-name",children:"PoliceGPT"})]}),(0,r.jsx)("nav",{className:"sidebar-nav",children:n.map(e=>{let t=s===e.href||"/dashboard"!==e.href&&s.startsWith(e.href);return(0,r.jsxs)(a.default,{href:e.href,id:e.id,className:`nav-link${t?" active":""}`,children:[e.icon,e.label]},e.href)})}),(0,r.jsxs)("div",{className:"sidebar-footer",children:[l&&(0,r.jsxs)("div",{className:"officer-row",children:[(0,r.jsx)("div",{className:"officer-avatar",children:d}),(0,r.jsxs)("div",{className:"officer-info",children:[(0,r.jsx)("span",{className:"officer-name",children:l.name}),(0,r.jsxs)("span",{className:"officer-meta",children:[l.badge," · ",l.role]})]})]}),(0,r.jsxs)("button",{id:"logout-btn",className:"logout-btn",onClick:()=>{localStorage.removeItem("pgpt_token"),localStorage.removeItem("pgpt_officer"),i.push("/")},children:[(0,r.jsxs)("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[(0,r.jsx)("path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"}),(0,r.jsx)("polyline",{points:"16 17 21 12 16 7"}),(0,r.jsx)("line",{x1:"21",y1:"12",x2:"9",y2:"12"})]}),"Sign out"]})]})]}),(0,r.jsxs)("div",{className:"main-wrap",children:[(0,r.jsxs)("header",{className:"topbar",children:[(0,r.jsxs)("div",{className:"topbar-left",children:[(0,r.jsx)("div",{className:"topbar-dot"}),(0,r.jsx)("span",{className:"topbar-status",children:"KSP INTELLIGENCE NET · DEMO DATA"})]}),(0,r.jsxs)("div",{className:"topbar-right",children:[(0,r.jsxs)("div",{className:"topbar-search",children:[(0,r.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"#2a3048",strokeWidth:"2",children:[(0,r.jsx)("circle",{cx:"11",cy:"11",r:"8"}),(0,r.jsx)("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]}),(0,r.jsx)("input",{id:"quick-search",type:"text",placeholder:"Search FIRs, suspects… (⌘K)"})]}),l&&(0,r.jsxs)("div",{className:"topbar-officer",children:[(0,r.jsx)("div",{className:"officer-avatar",style:{width:22,height:22,borderRadius:5,fontSize:"0.6rem"},children:d}),(0,r.jsx)("span",{className:"topbar-officer-name",children:l.name})]})]})]}),(0,r.jsx)("main",{className:"page-content",children:e})]})]})]})}])}]);