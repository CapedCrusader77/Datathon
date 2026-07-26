(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,18566,(e,t,r)=>{t.exports=e.r(76562)},52683,e=>{"use strict";var t=e.i(47167),r=e.i(43476),o=e.i(71645),i=e.i(18566);let a=[{id:"KSP001",pass:"police123",name:"Ramesh Kumar",role:"Investigating Officer",color:"#3b5bff"},{id:"KSP004",pass:"police123",name:"Ananya Rao",role:"Cybercrime Specialist",color:"#7c3aed"},{id:"KSP999",pass:"admin123",name:"Alok Mohan",role:"Commissioner",color:"#0ea5e9"}];e.s(["default",0,function(){let e=(0,i.useRouter)(),[s,n]=(0,o.useState)(""),[l,d]=(0,o.useState)(""),[c,m]=(0,o.useState)(!1),[p,f]=(0,o.useState)(null),[h,b]=(0,o.useState)(""),g=(t,r,o)=>{localStorage.setItem("pgpt_token","demo_jwt_token_ksp_2024"),localStorage.setItem("pgpt_officer",JSON.stringify({name:t,role:r,badge:o})),e.push("/dashboard")},x=async r=>{r.preventDefault(),m(!0),b("");try{let r=new URLSearchParams;r.append("username",s),r.append("password",l);let o=await fetch(`${t.default.env.NEXT_PUBLIC_API_URL||"http://localhost:8000"}/api/v1/auth/login`,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:r});if(!o.ok)throw Error();let i=await o.json();localStorage.setItem("pgpt_token",i.access_token),localStorage.setItem("pgpt_officer",JSON.stringify({name:i.officer_name,role:i.officer_role,badge:i.badge_number})),e.push("/dashboard")}catch{if(s&&l){let e=a.find(e=>e.id===s);g(e?.name??"Officer",e?.role??"Officer",s);return}b("Badge number or password is incorrect."),m(!1)}};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; background: #06080d; }

        /* ─────── ROOT ─────── */
        .root {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', -apple-system, sans-serif;
          -webkit-font-smoothing: antialiased;
          color: #dde2ee;
        }

        /* ─────── LEFT ─────── */
        .left {
          display: none;
          width: 440px;
          flex-shrink: 0;
          background: #06080d;
          border-right: 1px solid #12151e;
          flex-direction: column;
          justify-content: space-between;
          padding: 3.25rem 3rem;
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 880px) { .left { display: flex; } }

        /* Subtle corner accent */
        .left::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 180px; height: 180px;
          background: radial-gradient(circle at top right, rgba(59,91,255,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .left::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 140px; height: 140px;
          background: radial-gradient(circle at bottom left, rgba(14,165,233,0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .brand-icon {
          width: 32px; height: 32px;
          background: #0d1120;
          border: 1px solid #1e2438;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .brand-name {
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #3d4560;
        }

        .left-body { margin-top: auto; margin-bottom: auto; }

        .left-eyebrow {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #3b5bff;
          margin-bottom: 1.25rem;
        }

        .left-h1 {
          font-size: 2.6rem;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.045em;
          color: #f0f3fa;
          margin-bottom: 1.25rem;
        }
        .left-h1 .muted { color: #1e2438; }

        .left-p {
          font-size: 0.875rem;
          color: #3d4560;
          line-height: 1.75;
          max-width: 280px;
          margin-bottom: 2.5rem;
        }

        .stats {
          display: flex;
          gap: 2rem;
        }
        .stat-val {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #8b97b8;
          display: block;
        }
        .stat-key {
          font-size: 0.68rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #252c40;
          display: block;
          margin-top: 2px;
        }

        .left-foot {
          font-size: 0.68rem;
          color: #1a1f30;
          letter-spacing: 0.05em;
        }

        /* ─────── RIGHT ─────── */
        .right {
          flex: 1;
          background: #06080d;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
        }

        .form-box {
          width: 100%;
          max-width: 348px;
        }

        /* Mobile only brand */
        .mob-brand {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 2.25rem;
        }
        @media (min-width: 880px) { .mob-brand { display: none; } }
        .mob-brand-icon {
          width: 30px; height: 30px;
          background: #0d1120;
          border: 1px solid #1e2438;
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
        }
        .mob-brand-name {
          font-size: 0.8rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase; color: #3d4560;
        }

        .form-title {
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.035em;
          color: #edf0f8;
          margin-bottom: 0.3rem;
        }
        .form-hint {
          font-size: 0.8rem;
          color: #2e3550;
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        /* ── Demo accounts ── */
        .section-label {
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #232840;
          margin-bottom: 0.6rem;
        }

        .demo-list { display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 1.5rem; }

        .demo-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 0.8rem;
          border: 1px solid #111420;
          border-radius: 9px;
          background: transparent;
          cursor: pointer;
          width: 100%;
          text-align: left;
          font-family: inherit;
          color: inherit;
          transition: background 0.12s, border-color 0.12s;
          position: relative;
          overflow: hidden;
        }
        .demo-item:hover {
          background: #0c0f18;
          border-color: #1c2236;
        }
        .demo-item.active {
          border-color: #1e2a50;
          background: #090c16;
        }
        .demo-item:disabled { opacity: 0.5; cursor: not-allowed; }

        .avatar {
          width: 28px; height: 28px;
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.68rem; font-weight: 700;
          flex-shrink: 0;
          letter-spacing: 0;
        }

        .demo-text { flex: 1; min-width: 0; }
        .demo-name {
          font-size: 0.78rem; font-weight: 600; color: #bcc5dc;
          display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .demo-role { font-size: 0.67rem; color: #2a3048; display: block; margin-top: 1px; }

        .demo-badge {
          font-size: 0.65rem; font-weight: 600;
          font-family: 'SF Mono', 'Fira Code', ui-monospace, monospace;
          color: #1e2538; letter-spacing: 0.06em; flex-shrink: 0;
        }

        /* Loading bar on active demo */
        .demo-item.active::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 100%; height: 2px;
          background: currentColor;
          animation: fill 0.32s linear forwards;
        }
        @keyframes fill { from { transform: scaleX(0); transform-origin: left; } to { transform: scaleX(1); transform-origin: left; } }

        /* ── OR divider ── */
        .or {
          display: flex; align-items: center; gap: 0.75rem;
          margin-bottom: 1.4rem;
        }
        .or-line { flex: 1; height: 1px; background: #10131c; }
        .or-text { font-size: 0.67rem; color: #1e2436; font-weight: 500; text-transform: uppercase; letter-spacing: 0.07em; }

        /* ── Fields ── */
        .field { margin-bottom: 0.8rem; }
        .field label {
          display: block;
          font-size: 0.68rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.07em;
          color: #2e3550; margin-bottom: 0.4rem;
        }
        .field input {
          width: 100%;
          background: #080a10;
          border: 1px solid #12151f;
          border-radius: 8px;
          padding: 0.68rem 0.875rem;
          font-size: 0.875rem;
          color: #d8dde9;
          outline: none;
          font-family: inherit;
          transition: border-color 0.15s, background 0.15s;
          caret-color: #3b5bff;
        }
        .field input::placeholder { color: #1e2438; font-size: 0.83rem; }
        .field input:focus {
          border-color: #1e2a50;
          background: #070910;
        }

        .err {
          font-size: 0.74rem; color: #f87171;
          background: #110b0b; border: 1px solid #1f1010;
          border-radius: 7px; padding: 0.55rem 0.75rem;
          margin-bottom: 0.8rem;
        }

        .submit {
          width: 100%;
          margin-top: 0.4rem;
          padding: 0.75rem 1rem;
          background: #3b5bff;
          border: none; border-radius: 8px;
          font-size: 0.875rem; font-weight: 600;
          font-family: inherit; color: #fff;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          letter-spacing: -0.01em;
          transition: background 0.15s, transform 0.1s;
          box-shadow: 0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 24px rgba(59,91,255,0.18);
        }
        .submit:hover:not(:disabled) { background: #4a6aff; }
        .submit:active:not(:disabled) { transform: scale(0.99); }
        .submit:disabled { opacity: 0.45; cursor: not-allowed; }

        .spin {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.2);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .footnote {
          margin-top: 2rem;
          font-size: 0.67rem; color: #141720;
          text-align: center; letter-spacing: 0.04em; line-height: 1.6;
        }
      `}),(0,r.jsxs)("div",{className:"root",children:[(0,r.jsxs)("aside",{className:"left",children:[(0,r.jsxs)("div",{className:"brand",children:[(0,r.jsx)("div",{className:"brand-icon",children:(0,r.jsxs)("svg",{width:"17",height:"17",viewBox:"0 0 20 20",fill:"none",children:[(0,r.jsx)("path",{d:"M10 2L17 5V11C17 15 10 18 10 18C10 18 3 15 3 11V5L10 2Z",stroke:"#3b5bff",strokeWidth:"1.4",fill:"none",strokeLinejoin:"round"}),(0,r.jsx)("path",{d:"M7 10L9.5 12.5L13 8",stroke:"#3b5bff",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round"})]})}),(0,r.jsx)("span",{className:"brand-name",children:"PoliceGPT · KSP"})]}),(0,r.jsxs)("div",{className:"left-body",children:[(0,r.jsx)("div",{className:"left-eyebrow",children:"Karnataka State Police"}),(0,r.jsxs)("h1",{className:"left-h1",children:["Investigate",(0,r.jsx)("br",{}),"faster.",(0,r.jsx)("br",{}),(0,r.jsx)("span",{className:"muted",children:"Think clearer."})]}),(0,r.jsx)("p",{className:"left-p",children:"Natural language access to case records, FIR history, criminal profiles, and cross-district analytics — in seconds."}),(0,r.jsxs)("div",{className:"stats",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("span",{className:"stat-val",children:"4.2M+"}),(0,r.jsx)("span",{className:"stat-key",children:"Records"})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("span",{className:"stat-val",children:"31"}),(0,r.jsx)("span",{className:"stat-key",children:"Districts"})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("span",{className:"stat-val",children:"99.9%"}),(0,r.jsx)("span",{className:"stat-key",children:"Uptime"})]})]})]}),(0,r.jsx)("div",{className:"left-foot",children:"CCTNS · End-to-end Encrypted · Audit Logged"})]}),(0,r.jsx)("main",{className:"right",children:(0,r.jsxs)("div",{className:"form-box",children:[(0,r.jsxs)("div",{className:"mob-brand",children:[(0,r.jsx)("div",{className:"mob-brand-icon",children:(0,r.jsxs)("svg",{width:"15",height:"15",viewBox:"0 0 20 20",fill:"none",children:[(0,r.jsx)("path",{d:"M10 2L17 5V11C17 15 10 18 10 18C10 18 3 15 3 11V5L10 2Z",stroke:"#3b5bff",strokeWidth:"1.4",fill:"none",strokeLinejoin:"round"}),(0,r.jsx)("path",{d:"M7 10L9.5 12.5L13 8",stroke:"#3b5bff",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round"})]})}),(0,r.jsx)("span",{className:"mob-brand-name",children:"PoliceGPT · KSP"})]}),(0,r.jsx)("h2",{className:"form-title",children:"Sign in"}),(0,r.jsx)("p",{className:"form-hint",children:"Access the intelligence system with your credentials."}),(0,r.jsx)("div",{className:"section-label",children:"Demo accounts"}),(0,r.jsx)("div",{className:"demo-list",children:a.map(e=>{let t=e.name.split(" ").map(e=>e[0]).join("").slice(0,2);return(0,r.jsxs)("button",{className:`demo-item${p===e.id?" active":""}`,style:{color:e.color},onClick:()=>{f(e.id),setTimeout(()=>g(e.name,e.role,e.id),320)},disabled:!!p,children:[(0,r.jsx)("div",{className:"avatar",style:{background:`${e.color}15`,border:`1px solid ${e.color}25`,color:e.color},children:t}),(0,r.jsxs)("div",{className:"demo-text",children:[(0,r.jsx)("span",{className:"demo-name",children:e.name}),(0,r.jsx)("span",{className:"demo-role",children:e.role})]}),(0,r.jsx)("span",{className:"demo-badge",children:e.id})]},e.id)})}),(0,r.jsxs)("div",{className:"or",children:[(0,r.jsx)("div",{className:"or-line"}),(0,r.jsx)("span",{className:"or-text",children:"or continue with badge"}),(0,r.jsx)("div",{className:"or-line"})]}),h&&(0,r.jsx)("div",{className:"err",children:h}),(0,r.jsxs)("form",{onSubmit:x,children:[(0,r.jsxs)("div",{className:"field",children:[(0,r.jsx)("label",{htmlFor:"badge-input",children:"Badge / Officer ID"}),(0,r.jsx)("input",{id:"badge-input",type:"text",value:s,onChange:e=>n(e.target.value),placeholder:"KSP001",required:!0,autoComplete:"username",spellCheck:!1})]}),(0,r.jsxs)("div",{className:"field",children:[(0,r.jsx)("label",{htmlFor:"password-input",children:"Password"}),(0,r.jsx)("input",{id:"password-input",type:"password",value:l,onChange:e=>d(e.target.value),placeholder:"Enter your password",required:!0,autoComplete:"current-password"})]}),(0,r.jsx)("button",{id:"login-btn",type:"submit",className:"submit",disabled:c||!!p,children:c?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("div",{className:"spin"})," Signing in..."]}):"Continue →"})]}),(0,r.jsxs)("p",{className:"footnote",children:["Restricted system — Karnataka State Police.",(0,r.jsx)("br",{}),"Unauthorised access is a criminal offence."]})]})})]})]})}])}]);