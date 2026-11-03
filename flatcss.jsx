/* 평면 테이블 화면 공통 스타일 — 거래처등록.jsx 의 스타일 블록을 그대로 추출. 활동관리 등 신규 평면 화면이 로드. */
const FLAT_CSS = `
.layout{
  display: grid;
  grid-template-columns: 88px 1fr;
  min-height: 100vh;
  background: var(--bg);
}

/* ── Sidebar ── */
.sidebar{
  position: sticky; top: 0; align-self: start;
  height: 100vh;
  background: var(--card);
  border-right: 1px solid var(--line);
  display: flex; flex-direction: column; align-items: center;
  padding: 22px 0 24px; gap: 14px;
}
.sb-logo{ width:44px; height:44px; display:grid; place-items:center; text-decoration:none; }
.sb-nav{ flex:1; margin-top:22px; display:flex; flex-direction:column; gap:6px; width:100%; padding:0 14px; }
.sb-item{
  appearance:none; cursor:pointer; background:transparent; border:0;
  display:flex; flex-direction:column; align-items:center; gap:4px;
  width:100%; padding:11px 6px; border-radius:14px;
  color: var(--ink-3);
  transition: background .15s, color .15s;
  position:relative;
}
.sb-item:hover{ background: var(--card-2); color: var(--ink); }
.sb-item.is-active{ background: var(--ink); color: var(--card); }
.sb-item.is-active::before{
  content:""; position:absolute; left:-14px; top:50%; transform:translateY(-50%);
  width:4px; height:22px; border-radius:0 4px 4px 0; background: var(--accent);
}
.sb-icon{ width:24px; height:24px; display:grid; place-items:center; }
.sb-icon svg{ width:22px; height:22px; }
.sb-label{ font-size:11px; font-weight:500; white-space:nowrap; }
.sb-plus{
  appearance:none; cursor:pointer; border:0;
  width:48px; height:48px; border-radius:50%;
  background: var(--accent); color:#fff;
  display:grid; place-items:center;
  box-shadow:
    0 0 0 6px color-mix(in oklab, var(--accent) 14%, transparent),
    0 12px 26px -10px color-mix(in oklab, var(--accent) 50%, transparent);
}
.sb-plus svg{ width:22px; height:22px; }

/* ── Top bar ── */
.main{ display:flex; flex-direction:column; min-width:0; }
.content{ overflow: visible; }
.topbar{
  position:sticky; top:0; z-index:5;
  background: rgba(244,239,229,.85);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line-soft);
  padding: 18px clamp(20px, 3vw, 40px);
  display:flex; align-items:center; gap:18px;
}
.bread{ display:flex; align-items:center; gap:8px; font-size:13.5px; color: var(--ink-3); }
.bd-item{ text-decoration:none; color: var(--ink-2); }
.bd-item:hover{ color: var(--ink); }
.bd-item.is-current{ color: var(--ink); font-weight:600; }
.bd-sep{ color: var(--ink-3); }
.topbar-right{ margin-left:auto; }
.user-pill{
  appearance:none; cursor:pointer; border:0;
  display:inline-flex; align-items:center; gap:10px;
  background: var(--card); border:1px solid var(--line);
  border-radius:999px; padding: 5px 14px 5px 5px; height:44px;
}
.user-av{ width:34px; height:34px; border-radius:50%; background: var(--ink); color:#fff;
         display:grid; place-items:center; font-weight:700; font-size:13px; }
.user-name{ font-size:14px; font-weight:500; }
.user-chev{ width:18px; height:18px; color: var(--ink-3); display:grid; place-items:center; }
.user-chev svg{ width:16px; height:16px; }

/* ── Content ── */
.content{
  padding: 24px clamp(20px, 3vw, 40px) 60px;
  width:100%; max-width: 1640px;
  display:flex; flex-direction:column; gap:16px;
}
.page-head{
  display:flex; align-items:flex-end; justify-content:space-between; gap:18px; flex-wrap:wrap;
}
.page-head-l{ display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
.title-add{ height:38px; }
.btn-ghost:disabled, .btn-primary:disabled, .period-search:disabled{ opacity:.45; cursor:not-allowed; }
.active-view{ display:inline-flex; align-items:center; gap:6px; height:30px; padding:0 10px 0 12px; border-radius:999px; background:var(--accent-soft); color:var(--accent-ink); border:1px solid color-mix(in oklab, var(--accent) 30%, transparent); cursor:pointer; }
.active-view:hover{ background:color-mix(in oklab, var(--accent) 18%, var(--accent-soft)); }
.active-view.is-none{ background:var(--card); color:var(--ink-3); border-style:dashed; }
.active-view-code{ font:600 11px "JetBrains Mono",monospace; }
.active-view-name{ font:600 13px "IBM Plex Sans KR",sans-serif; max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.active-view-caret{ display:grid; place-items:center; color:currentColor; opacity:.7; }
.active-view-caret svg{ width:14px; height:14px; }
.active-view-wrap{ position:relative; display:inline-block; }
.active-view-menu{ left:0; right:auto; }
.active-view-menu .vpm-pick{ width:100%; }
.page-title{
  font-family:"Gowun Batang","IBM Plex Sans KR",serif;
  font-weight:700; font-size:30px; letter-spacing:-.02em; margin:0;
}
.page-sub{ font-size:13.5px; color: var(--ink-3); margin-top:4px; }
.page-sub b{ color: var(--ink); font-weight:600; }
.page-actions{ display:flex; gap:8px; align-items:center; flex-wrap:wrap; }

/* ── Buttons ── */
.btn-primary, .btn-ghost{ white-space:nowrap; flex:none; }
.btn-primary{
  appearance:none; cursor:pointer; border:0;
  display:inline-flex; align-items:center; gap:8px;
  background: var(--ink); color: var(--card);
  font: 500 14px "IBM Plex Sans KR", sans-serif;
  padding: 0 16px; height: 40px;
  border-radius: 10px;
  transition: background .15s, transform .12s;
}
.btn-primary:hover{ background: #2a241c; transform: translateY(-1px); }
.btn-primary svg{ width:16px; height:16px; }

.btn-ghost{
  appearance:none; cursor:pointer;
  background: var(--card); color: var(--ink-2);
  border: 1px solid var(--line);
  font: 500 13.5px "IBM Plex Sans KR", sans-serif;
  padding: 0 14px; height: 40px;
  border-radius: 10px;
  display:inline-flex; align-items:center; gap:7px;
  transition: background .15s, color .15s, border-color .15s;
}
.btn-ghost:hover{ background: var(--card-2); color: var(--ink); border-color: rgba(31,26,20,.22); }
.btn-ghost svg{ width:16px; height:16px; }
.btn-sm{ height: 32px; padding: 0 10px; font-size: 12.5px; }
.btn-danger{ color: var(--bad); }
.btn-danger:hover{
  background: color-mix(in oklab, var(--bad) 10%, var(--card));
  color: var(--bad);
  border-color: color-mix(in oklab, var(--bad) 30%, var(--line));
}
.btn-find{ height: 42px; }
.btn-link{
  appearance:none; cursor:pointer; border:0; background:transparent;
  color: var(--ink); text-decoration: underline; text-underline-offset: 3px;
  font: 500 13px "IBM Plex Sans KR", sans-serif;
  margin-left: 8px;
}

/* ── Period bar ── */
.modal-newitem{ width: min(560px, 100%); }
.ni-body{ padding: 20px 26px 8px; }
.ni-grid{ display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px 16px; }
.period-bar{ display:flex; align-items:center; gap:14px; flex-wrap:wrap; background:var(--card); border:1px solid var(--line); border-radius:14px; padding:10px 14px; }
.period-search{ margin-left:auto; display:inline-flex; align-items:center; gap:6px; height:32px; padding:0 14px; border-radius:9px; border:0; background:var(--accent); color:#fff; font:600 13px "IBM Plex Sans KR",sans-serif; cursor:pointer; }
.period-search:hover{ background:var(--accent-ink); }
.period-search svg{ width:15px; height:15px; }

/* ── Toolbar ── */
.toolbar{
  display:flex; align-items:center; gap:12px; flex-wrap: wrap;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 10px 14px;
}
.list-search{
  flex: 1; min-width: 260px;
  display:flex; align-items:center; gap:10px;
  background: var(--bg-2);
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 0 14px; height: 42px;
}
.list-search:focus-within{ background: #fff; border-color: var(--ink); }
.ls-icon{ width:18px; height:18px; color: var(--ink-3); display:grid; place-items:center; }
.ls-icon svg{ width:18px; height:18px; }
.list-search input{
  flex:1; appearance:none; border:0; outline:0; background:transparent;
  height:100%; font: 500 14px "IBM Plex Sans KR", sans-serif; color: var(--ink);
}
.list-search input::placeholder{ color: rgba(31,26,20,.32); font-weight:400; }

.tb-meta{
  margin-left: auto;
  display:flex; align-items:center; gap:12px;
  font-size: 12.5px; color: var(--ink-3);
}
.tb-meta b{ color: var(--ink); font-weight: 600; }
.tb-sel{ color: var(--ink); font-weight: 500; padding-left: 10px; border-left: 1px solid var(--line); }

/* ── Table ── */
.table-card{
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 14px;
  overflow: visible;
  margin-right: calc(-1 * clamp(20px, 3vw, 40px));
  border-top-right-radius: 0; border-bottom-right-radius: 0; border-right: 0;
}
.t-scroll{ overflow: visible; padding-right: 1px; }
.table-card{ width: max-content; min-width: 100%; flex: none; max-width: none; }
.pager{ display:flex; align-items:center; justify-content:center; gap:12px; padding:12px 0 4px; }
.pager-info{ font:500 12.5px "IBM Plex Sans KR",sans-serif; color:var(--ink-3); }
.t-scroll .t-row{ min-width: 100%; width: var(--row-min, auto); }
.t-scroll::-webkit-scrollbar{ height: 10px; }
.t-scroll::-webkit-scrollbar-thumb{ background: rgba(0,0,0,.22); border-radius: 6px; }
.t-scroll::-webkit-scrollbar-track{ background: rgba(0,0,0,.05); }
.t-row{
  cursor:pointer; text-align:left;
  display: grid;
  grid-template-columns: var(--cols-template, 84px minmax(180px, 1.6fr) 90px 130px minmax(220px, 2fr) 100px 56px);
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--line-soft);
  font: 500 14px "IBM Plex Sans KR", sans-serif;
  transition: background .12s;
  outline: 0;
}
.t-row:last-child{ border-bottom: 0; }
.t-row:hover{ background: var(--card-2); }
.t-row:focus-visible{ background: var(--card-2); box-shadow: inset 3px 0 0 var(--accent); }
.t-row.is-checked{ background: color-mix(in oklab, var(--accent-soft) 28%, var(--card)); }

.t-row.t-head{
  background: var(--card-2);
  font-family:"IBM Plex Sans KR", sans-serif;
  font-size:12px; font-weight:600; letter-spacing:0; text-transform:none;
  color: var(--ink-3); cursor: default;
  padding: 11px 18px;
}
.t-row.t-head:hover{ background: var(--card-2); }
.t-row.t-head .tc, .t-row.t-head .tc-val{ font-family:"IBM Plex Sans KR", sans-serif !important; font-size:12px !important; font-weight:600; letter-spacing:0; color:var(--ink-3); }

.tc-check{ display:flex; align-items:center; justify-content:center; gap:5px; overflow:hidden; }
.tc-check .cbx{ flex:none; }
.new-flag{ flex:none; }
.table-card .t-row > *{ align-self: stretch; display: flex; align-items: center; }
.table-card .t-row > *:not(:last-child){ border-right: 1px solid var(--line-soft); }
.table-card .t-row .tc > *{ min-width: 0; }
.table-card .t-row .tc[style*="text-align: right"]{ justify-content: flex-end; }
.t-row.row-new{ box-shadow: inset 3px 0 0 var(--accent); background: color-mix(in oklab, var(--accent-soft) 38%, var(--card)); }
.new-flag{ display:inline-block; white-space: nowrap; font: 700 9.5px "IBM Plex Sans KR", sans-serif; letter-spacing: .2px; color: var(--accent-ink); background: var(--accent-soft); border: 1px solid color-mix(in oklab, var(--accent) 30%, var(--line)); border-radius: 5px; padding: 1px 4px; }
.cbx.cbx-new{ border-color: var(--accent); box-shadow: 0 0 0 2px color-mix(in oklab, var(--accent-soft) 60%, transparent); }
.tc{ min-width: 0; overflow: hidden; white-space: normal; overflow-wrap: anywhere; word-break: break-word; }
.tc-val{ overflow:hidden; white-space:normal; overflow-wrap:anywhere; display:inline-block; max-width:100%; }
.table-card .t-row{ align-items: stretch; }
.table-card .t-row > *{ padding-top: 6px; padding-bottom: 6px; }
.t-row.t-head .tc{ white-space: nowrap; position: relative; }

.ck-name .ln-text{ font-weight: 600; color: var(--ink); }
.ck-text{ color: var(--ink-2); }
.ck-mono{ font-family:"JetBrains Mono", monospace; font-size: 13.5px; color: var(--ink-2); font-variant-numeric: tabular-nums; }
.ck-muted{ color: var(--ink-3); font-size: 13px; }
.ck-chip .kind-chip{ display: inline-grid; }
.cbx{
  appearance:none; cursor:pointer;
  width: 20px; height: 20px; border-radius: 6px;
  border: 1.5px solid rgba(31,26,20,.28);
  background: var(--card);
  display:grid; place-items:center;
  color: var(--card);
  transition: background .15s, border-color .15s;
}
.cbx.is-on{ background: var(--ink); border-color: var(--ink); }
.cbx svg{ width:12px; height:12px; }

.tc-name{ display:flex; align-items:center; gap:10px; min-width:0; }
.ln-text{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight: 600; color: var(--ink); }
.kind-chip{
  display: inline-grid; place-items:center;
  padding: 3px 9px; border-radius: 999px;
  font-size: 10.5px; letter-spacing: .04em; font-weight: 600;
  flex: none;
}
.kind-chip.k-납품처{ background: color-mix(in oklab, var(--accent) 18%, transparent); color: var(--accent-ink); }
.kind-chip.k-매입처{ background: #E5DDEF; color: #5A4E68; }
.kind-chip.k-둘다  { background: rgba(31,26,20,.08); color: var(--ink); }

.tc-act{ display:flex; align-items:center; justify-content:flex-end; }

.iconbtn{
  appearance:none; cursor:pointer; border:0;
  width: 32px; height: 32px; border-radius: 8px;
  background: transparent; color: var(--ink-3);
  display:grid; place-items:center;
  transition: background .15s, color .15s;
}
.iconbtn:hover{ background: var(--bg-2); color: var(--ink); }
.iconbtn:disabled{ opacity: .35; cursor: default; }
.iconbtn:disabled:hover{ background: transparent; color: var(--ink-3); }
.iconbtn svg{ width: 18px; height: 18px; }
.iconbtn-sm{ width: 26px; height: 26px; border-radius: 6px; }
.iconbtn-sm svg{ width: 16px; height: 16px; }

/* ── Column settings modal ── */
.modal-sm{ width: min(520px, 100%); }
.col-list{
  padding: 8px 26px 8px;
  overflow-y: auto;
  flex: 1;
  display: flex; flex-direction: column;
}
.col-row{
  display: grid;
  grid-template-columns: 22px 1fr auto auto;
  align-items: center;
  gap: 12px;
  padding: 12px 4px;
  border-bottom: 1px dashed var(--line-soft);
  color: var(--ink-2);
}
.col-row:last-child{ border-bottom: 0; }
.col-handle{
  width: 22px; height: 22px; color: var(--ink-3);
  display: grid; place-items: center;
  opacity: .6;
}
.col-handle svg{ width: 18px; height: 18px; }
.col-name{
  font-size: 14.5px; color: var(--ink);
  display: inline-flex; align-items: center; gap: 8px;
}
.col-row:not(.is-on) .col-name{ color: var(--ink-3); }
.col-lock{
  font-family:"JetBrains Mono", monospace;
  font-size: 10px; letter-spacing: .08em;
  background: rgba(31,26,20,.06); color: var(--ink-3);
  padding: 2px 7px; border-radius: 999px; text-transform: uppercase;
}
.col-order{ display:flex; gap: 2px; }

.switch{
  appearance:none; cursor:pointer; border:0;
  width: 38px; height: 22px; border-radius: 999px;
  background: rgba(31,26,20,.18);
  position: relative;
  transition: background .15s;
  padding: 0;
}
.switch:hover{ background: rgba(31,26,20,.28); }
.switch.is-on{ background: var(--ink); }
.switch:disabled{ opacity: .4; cursor: default; }
.switch-knob{
  position: absolute;
  top: 2px; left: 2px;
  width: 18px; height: 18px; border-radius: 50%;
  background: var(--card);
  box-shadow: 0 1px 2px rgba(31,26,20,.18);
  transition: transform .18s cubic-bezier(.2,.7,.3,1);
}
.switch.is-on .switch-knob{ transform: translateX(16px); }

.ff-v{ color: var(--ink); font-weight: 500; font-size: 13px; }

.t-empty{
  padding: 60px 24px;
  text-align: center;
  color: var(--ink-3);
  font-size: 14px;
}

/* ── Modal ── */
.modal-root{
  position: fixed; inset: 0; z-index: 50;
  display: grid; place-items: center;
  padding: clamp(16px, 4vw, 40px);
}
.modal-scrim{
  position: absolute; inset: 0;
  background: rgba(31,26,20,.42);
  backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
  animation: scrimIn .18s ease-out;
}
@keyframes scrimIn{ from { opacity: 0; } }

.modal{
  position: relative;
  width: min(960px, 100%);
  max-height: calc(100vh - 80px);
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: 0 40px 80px -20px rgba(31,26,20,.28);
  display: flex; flex-direction: column;
  overflow: hidden;
  animation: modalIn .22s cubic-bezier(.2,.7,.3,1);
}
@keyframes modalIn{ from { opacity: 0; transform: translateY(10px) scale(.985); } }

.modal-head{
  display:flex; align-items:flex-start; justify-content:space-between; gap:12px;
  padding: 22px 26px 18px;
  border-bottom: 1px solid var(--line-soft);
}
.modal-title{
  font-family:"Gowun Batang", serif; font-weight:700;
  font-size: 22px; letter-spacing:-.015em; margin: 0;
}
.modal-sub{ font-size: 12.5px; color: var(--ink-3); margin-top: 4px; }
.req{ color: var(--accent); font-weight: 700; margin-left: 2px; }
.modal-head-actions{ display:flex; align-items:center; gap: 8px; }
.modal-close{
  appearance:none; cursor:pointer; border:0;
  width: 36px; height: 36px; border-radius: 10px;
  background: transparent; color: var(--ink-2);
  display: grid; place-items: center;
  transition: background .15s, color .15s;
}
.modal-close:hover{ background: var(--bg-2); color: var(--ink); }
.modal-close svg{ width: 20px; height: 20px; }

.modal-body{
  padding: 20px 26px 8px;
  display: grid;
  gap: 22px;
  overflow-y: auto;
  flex: 1;
}
.modal-body.cols-2{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
.modal-body.cols-1{ grid-template-columns: 1fr; }
.fset-wide{ grid-column: 1 / -1; }

.fset{ display:flex; flex-direction:column; gap:10px; }
.fset-count{ font:400 10.5px "IBM Plex Sans KR",sans-serif; letter-spacing:0; text-transform:none; color:var(--ink-3); margin-left:10px; }
.xf-tag{ display:inline-block; margin-left:6px; padding:1px 6px; border-radius:4px; font:600 10px "IBM Plex Sans KR",sans-serif; background:var(--card-2); color:var(--ink-3); border:1px solid var(--line); }
.xf-tag.xf-num{ background:oklch(0.95 0.03 240); color:oklch(0.45 0.1 240); }
.xf-tag.xf-lookup{ background:var(--accent-soft); color:var(--accent-ink); }
.xf-add{ display:flex; gap:8px; flex-wrap:wrap; margin-top:4px; }
.xf-slots{ margin-top:10px; padding-top:10px; border-top:1px dashed var(--line); display:flex; flex-direction:column; gap:6px; }
.xf-row{ display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
.xf-row-h{ font:600 11px "IBM Plex Sans KR",sans-serif; color:var(--ink-3); width:48px; flex:none; }
.xf-slot{ appearance:none; border:1px dashed var(--line); background:var(--card-2); color:var(--ink-3); border-radius:7px; padding:4px 10px; font:500 12px "IBM Plex Sans KR",sans-serif; cursor:pointer; }
.xf-slot:hover{ border-color:var(--accent); color:var(--accent-ink); }
.xf-slot.is-on{ border-style:solid; background:var(--accent-soft); color:var(--accent-ink); border-color:color-mix(in oklab, var(--accent) 40%, transparent); }
.xf-add .btn-sm:disabled{ opacity:.45; cursor:not-allowed; }
.xf-n{ font:600 10.5px "JetBrains Mono",monospace; color:var(--ink-3); margin-left:4px; }
.fld-menu-wrap{ position:static; }
.fset-grid .fld-label:has(.fld-menu-wrap){ position:relative; }
.fset-grid .fld.is-drag{ cursor:pointer; }
.fset-grid .fld.is-drag:hover > .fld-label{ color:var(--accent-ink); }
.fld-label-hit{ position:absolute !important; inset:0; width:100%; height:100%; display:flex; align-items:center; justify-content:flex-end; background:transparent; border:0; padding:0; color:var(--ink-3); cursor:pointer; }
.fset-grid .fld-label:has(.fld-menu-wrap):hover{ color:var(--accent-ink); }
.fld-menu{ position:absolute; top:100%; left:0; margin-top:4px; z-index:70; min-width:132px; background:var(--card); border:1px solid var(--line); border-radius:10px; box-shadow:0 12px 28px rgba(0,0,0,.14); padding:5px; display:flex; flex-direction:column; }
.fld-menu-h{ display:flex; align-items:center; gap:6px; font:600 11px "IBM Plex Sans KR",sans-serif; color:var(--ink-2); padding:5px 8px 6px; border-bottom:1px solid var(--line); margin-bottom:4px; }
.fld-menu-dot{ width:9px; height:9px; border-radius:3px; background:var(--accent); flex:none; }
.fld-menu button{ appearance:none; border:0; background:transparent; text-align:left; padding:7px 9px; border-radius:7px; font:500 12.5px "IBM Plex Sans KR",sans-serif; color:var(--ink); cursor:pointer; }
.fld-menu button:hover{ background:var(--card-2); }
.fld-menu button.is-danger:hover{ background:color-mix(in oklab, var(--bad) 12%, transparent); color:var(--bad); }
.hdr-rm{ appearance:none; border:0; background:transparent; color:var(--ink-3); cursor:pointer; width:16px; height:16px; display:inline-grid; place-items:center; border-radius:4px; margin-left:4px; vertical-align:middle; }
.hdr-rm svg{ width:11px; height:11px; }
.hdr-rm:hover{ background:var(--bad); color:#fff; }
.cc-lookup{ position:relative; display:flex; align-items:center; }
.cc-lookup .fld-input{ padding-right:38px; }
.cc-lookup-btn{ position:absolute; right:6px; width:26px; height:26px; display:flex; align-items:center; justify-content:center; border:1px solid var(--line); background:#fff; border-radius:6px; color:var(--ink-3); cursor:pointer; }
.cc-lookup-btn:hover{ border-color:var(--accent); color:var(--accent); }
.cc-lookup-btn svg{ width:14px; height:14px; }
.cc-codechip{ flex:none; margin-left:6px; margin-right:34px; padding:1px 6px; border-radius:6px; background:var(--accent-soft); color:var(--accent-ink); font-family:"JetBrains Mono", monospace; font-size:10.5px; font-weight:600; white-space:nowrap; }
.cc-sug{ position:fixed; z-index:120; background:#fff; border:1px solid var(--line); border-radius:8px; box-shadow:0 8px 24px rgba(0,0,0,.12); max-height:220px; overflow-y:auto; display:flex; flex-direction:column; padding:4px; }
.cc-sug-item{ text-align:left; padding:7px 10px; border:0; background:none; border-radius:6px; font-size:13px; color:var(--ink); cursor:pointer; }
.cc-sug-item:hover{ background:var(--card-2); }
.pick-root{ position:fixed; inset:0; z-index:130; display:grid; place-items:center; padding:24px; }
.pick-scrim{ position:absolute; inset:0; background:rgba(20,22,26,.5); backdrop-filter:blur(3px); }
.pick-box{ position:relative; width:min(560px,100%); max-height:70vh; background:#fff; border:1px solid var(--line); border-radius:16px; box-shadow:0 40px 80px -20px rgba(20,22,26,.4); display:flex; flex-direction:column; overflow:hidden; }
.pick-head{ display:flex; align-items:center; justify-content:space-between; padding:16px 20px 12px; border-bottom:1px solid var(--line); }
.pick-head h3{ font-size:17px; font-weight:700; margin:0; color:var(--ink); }
.pick-search{ display:flex; align-items:center; gap:10px; padding:12px 20px; border-bottom:1px solid var(--line); }
.pick-ico{ width:18px; height:18px; color:var(--ink-3); display:grid; place-items:center; }
.pick-ico svg{ width:18px; height:18px; }
.pick-search input{ flex:1; border:0; outline:0; background:transparent; font-size:15px; color:var(--ink); }
.pick-table{ display:flex; flex-direction:column; overflow:hidden; flex:1; min-height:0; }
.pick-trow{ display:grid; align-items:center; gap:10px; padding:10px 18px; }
.pick-thead{ background:var(--card-2); border-bottom:1px solid var(--line); font-size:11px; letter-spacing:.04em; color:var(--ink-3); }
.pick-tbody{ overflow-y:auto; flex:1; }
.pick-opt{ appearance:none; cursor:pointer; border:0; background:transparent; width:100%; text-align:left; border-bottom:1px solid var(--line); font-size:13.5px; color:var(--ink-2); }
.pick-opt:hover{ background:var(--card-2); }
.pick-empty{ padding:30px; text-align:center; color:var(--ink-3); font-size:13.5px; }
.pk-cell{ min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.pk-cell.is-strong{ font-weight:600; color:var(--ink); }
.pick-foot{ display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 20px; border-top:1px solid var(--line); background:var(--card-2); }
.pick-foot-cnt{ font-size:11.5px; color:var(--ink-3); }
.pick-new{ appearance:none; cursor:pointer; border:0; background:var(--accent); color:#fff; font-size:13px; font-weight:600; padding:8px 16px; border-radius:9px; }
.fset-h{
  font-family:"JetBrains Mono", monospace;
  font-size: 11px; letter-spacing: .14em; text-transform: uppercase;
  color: var(--ink-3);
  margin: 0 0 2px;
}
.fset-grid{
  display:grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 12px 16px;
}
.fld-rz{ position:absolute; top:0; right:-9px; width:12px; height:100%; cursor:col-resize; z-index:5; }
.fld-rz::after{ content:""; position:absolute; top:4px; bottom:4px; left:5px; width:2px; border-radius:2px; background:color-mix(in oklab, var(--accent) 55%, transparent); opacity:.55; }
.fld-rz:hover::after{ opacity:1; }
.fset-grid .fld{ position:relative; }
.modal-body.cols-1 .fset-grid .fld{ grid-column: span 12 !important; }
.fld-wide{ grid-column:1 / -1; }
.fld-span{ appearance:none; border:1px solid var(--line); background:var(--card-2); color:var(--ink-3); cursor:pointer; width:18px; height:16px; display:inline-grid; place-items:center; border-radius:4px; margin-left:4px; vertical-align:middle; font-size:10px; line-height:1; }
.fld-span:hover{ border-color:var(--accent); color:var(--accent); }
.fld.is-drag{ cursor:grab; outline:1px dashed color-mix(in oklab, var(--accent) 45%, transparent); outline-offset:4px; border-radius:8px; }
.fld.is-drag:active{ cursor:grabbing; }
.modal-body.cols-1 .fset-grid{ }
.fset-err{ font-size: 12px; color: var(--bad); }
.fld-input.is-invalid{ border-color: var(--bad) !important; box-shadow: 0 0 0 1px var(--bad) inset; }

.fld{ display:flex; flex-direction:column; gap:6px; min-width:0; }
.fld-label{
  font-size: 12.5px; color: var(--ink-2); font-weight: 500;
  display: inline-flex; align-items: baseline; gap: 6px;
}
.fld-hint{ color: var(--ink-3); font-weight: 400; font-size: 11.5px; }

.fld-input, .fld-area{
  appearance:none; outline:0;
  width:100%;
  background: var(--bg-2);
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 0 14px;
  height: 42px;
  font: 500 14px "IBM Plex Sans KR", sans-serif;
  color: var(--ink);
  transition: border-color .15s, background .15s, box-shadow .15s;
}
.fld-area{ padding: 12px 14px; height: auto; resize: vertical; line-height:1.5; }
.fld-input::placeholder, .fld-area::placeholder{ color: rgba(31,26,20,.3); font-weight: 400; }
.fld-input:focus, .fld-area:focus{
  background:#fff;
  border-color: var(--ink);
  box-shadow: 0 0 0 3px rgba(31,26,20,.06);
}
.fld-input.is-mono{ font-family:"JetBrains Mono", monospace; font-variant-numeric: tabular-nums; letter-spacing: .01em; }

.seg{
  display:inline-flex; gap: 2px;
  background: var(--bg-2);
  border-radius: 10px;
  padding: 3px;
}
.seg-sm{ padding: 2px; }
.seg-item{
  appearance:none; cursor:pointer; border:0;
  background: transparent; color: var(--ink-2);
  font: 500 13px "IBM Plex Sans KR", sans-serif;
  padding: 7px 14px; border-radius: 7px;
  transition: background .12s, color .12s;
}
.seg-sm .seg-item{ font-size: 12px; padding: 5px 10px; }
.seg-item:hover{ color: var(--ink); }
.seg-item.is-on{ background: var(--card); color: var(--ink); box-shadow: 0 1px 0 rgba(31,26,20,.04); }

.addr-row{ display:flex; gap: 8px; }
.fld-input.zip{ width: 140px; flex:none; }

.modal-foot{
  padding: 16px 26px;
  border-top: 1px solid var(--line-soft);
  background: var(--card-2);
  display:flex; align-items:center; gap:16px; flex-wrap: wrap;
}
.ff-left{ display:flex; align-items:center; gap:10px; }
.ff-k{ font-size: 12px; color: var(--ink-3); font-family:"JetBrains Mono", monospace; letter-spacing: .1em; text-transform: uppercase; }
.ff-right{ margin-left:auto; display:flex; align-items:center; gap:8px; }

/* ── Toast ── */
.page-toast{
  position:fixed; left:50%; bottom: 36px; transform: translateX(-50%);
  z-index: 60;
  background: var(--ink); color: var(--card);
  padding: 12px 22px; border-radius: 999px;
  font-size: 14px;
  box-shadow: 0 24px 60px -20px rgba(31,26,20,.4);
  animation: toastIn .2s ease-out;
}
@keyframes toastIn{ from { opacity:0; transform: translate(-50%, 8px); } }

/* responsive */
@media (max-width: 1280px){
  /* hide addr column on medium; users can re-add via column settings if needed */
}
@media (max-width: 880px){
  .modal-body.cols-2{ grid-template-columns: 1fr; }
  .fset-grid .fld{ grid-column: span 12 !important; }
  .layout{ grid-template-columns: 72px 1fr; }
}
`;
(function(){ if (document.getElementById("flat-css")) return; const st = document.createElement("style"); st.id = "flat-css"; st.textContent = FLAT_CSS; document.head.appendChild(st); })();
window.FLAT_CSS = FLAT_CSS;
