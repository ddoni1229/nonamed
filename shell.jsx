/* 공통 셸 — 사이드바 / 로고 / 네비게이션 / 포맷 헬퍼 (모든 화면 공용) */
const NAV = {
  home:     "dashboard.html",
  partners: "거래처등록.html",
  items:    "품목리스트.html",
  sales:    "매출관리.html",
  purchase: "매입관리.html",
  collect:  "입출금관리.html",
  tax:      "세금관리.html",
};

function SketchLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <g fill="none" stroke="var(--ink)" strokeLinecap="round">
        <path d="M5.3 19.4Q5.5 12.4 10.6 8.5T22.3 4.9Q29.4 5.9 33.1 11T35.6 23Q34.1 30 28.6 33.3T16.6 33.7Q9.7 31.1 7 25.4T5.3 19.4" strokeWidth="1" opacity=".95" vectorEffect="non-scaling-stroke" />
        <path d="M4.7 19.7Q5.2 12 10.9 8T22.7 4.7Q29.6 5.9 33.4 11.1T35.5 23.2Q33.7 29.9 28.3 33.5T16.4 33.4Q9.5 30.6 7 24.9T4.7 19.7" strokeWidth=".7" opacity=".82" vectorEffect="non-scaling-stroke" />
        <path d="M5.9 20.2Q5.7 13.1 10.4 9T22 5.4Q29.2 6.4 33 11.7T35.4 23.6Q34.3 30 28.9 33.1T16.9 33.7Q10.1 31.4 7.4 25.7T5.9 20.2" strokeWidth=".85" opacity=".88" vectorEffect="non-scaling-stroke" />
        <path d="M4.5 19.1Q5.6 12.8 10.8 8.6T22.5 4.6Q29.7 5.6 33.4 10.8T35.7 22.9Q34.4 30 28.5 33.7T16.2 33.9Q9.2 31.2 6.6 25.3T4.5 19.1" strokeWidth=".55" opacity=".7" vectorEffect="non-scaling-stroke" />
        <path d="M6.1 19.5Q5.4 12.4 10.6 8.3T22.4 4.7Q29.4 5.6 33.3 11T35.7 23.4Q34.5 30.2 29 33.6T17.1 33.5Q10 30.9 7.2 25.3T6.1 19.5" strokeWidth="1.05" opacity=".93" vectorEffect="non-scaling-stroke" />
        <path d="M5.6 19.6Q5.3 12.7 10.5 8.6T22.4 5Q29.5 6.1 33.2 11.4T35.5 23.5Q34.1 30.1 28.5 33.5T16.5 33.7Q9.6 31 7 25.4T5.6 19.6" strokeWidth=".5" opacity=".68" vectorEffect="non-scaling-stroke" />
        <path d="M5.1 19.7Q5.6 12.6 10.7 8.5T22.4 4.8Q29.4 5.8 33.2 11T35.6 23.3Q34.4 30 28.7 33.4T16.6 33.5Q9.7 31 7 25.5T5.1 19.7" strokeWidth=".75" opacity=".85" vectorEffect="non-scaling-stroke" />
        <path d="M5.8 20Q5.6 13.1 10.8 9T22.6 5.2Q29.5 6.3 33.3 11.5T35.5 23.4Q34 30 28.7 33.4T16.7 33.6Q9.8 31 7.1 25.5T5.8 20" strokeWidth=".4" opacity=".55" vectorEffect="non-scaling-stroke" />
        <path d="M4.9 19.3Q5.5 12.5 10.6 8.4T22.3 4.7Q29.5 5.7 33.4 11T35.7 23.2Q34.4 30 28.7 33.4T16.5 33.6Q9.5 31 6.8 25.5T4.9 19.3" strokeWidth=".95" opacity=".9" vectorEffect="non-scaling-stroke" />
        <path d="M5.5 19.8Q5.4 12.8 10.7 8.7T22.5 5Q29.5 5.9 33.3 11.2T35.6 23.4Q34.3 30 28.7 33.4T16.5 33.6Q9.6 31 7 25.5T5.5 19.8" strokeWidth=".65" opacity=".78" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}

const SHELL_I = {
  home:     <svg viewBox="0 0 24 24" fill="none"><circle cx="8.5" cy="8.5" r="1.7" fill="currentColor"/><circle cx="15.5" cy="8.5" r="1.7" fill="currentColor"/><circle cx="8.5" cy="15.5" r="1.7" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.7" fill="currentColor"/></svg>,
  partners: <svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="9" r="2" fill="currentColor"/><circle cx="15.5" cy="9" r="2" fill="currentColor"/><path d="M5 16.5h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  items:    <svg viewBox="0 0 24 24" fill="none"><circle cx="6.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="6.5" cy="12" r="1.5" fill="currentColor"/><circle cx="6.5" cy="16.5" r="1.5" fill="currentColor"/><path d="M11 7.5h8M11 12h8M11 16.5h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  sales:    <svg viewBox="0 0 24 24" fill="none"><path d="M5 16l5-5 3 3 6-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="19" cy="7" r="1.7" fill="currentColor"/></svg>,
  purchase: <svg viewBox="0 0 24 24" fill="none"><path d="M5 8l5 5 3-3 6 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="19" cy="17" r="1.7" fill="currentColor"/></svg>,
  collect:  <svg viewBox="0 0 24 24" fill="none"><path d="M6 9h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="17.5" cy="9" r="1.6" fill="currentColor"/><path d="M6 15h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="6.5" cy="15" r="1.6" fill="currentColor"/></svg>,
  tax:      <svg viewBox="0 0 24 24" fill="none"><circle cx="8.5" cy="8.5" r="1.7" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.7" fill="currentColor"/><path d="M17 7L7 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  stock:    <svg viewBox="0 0 24 24" fill="none"><path d="M4 9l8-4 8 4v8l-8 4-8-4V9z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M4 9l8 4 8-4M12 13v8" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>,
  activity: <svg viewBox="0 0 24 24" fill="none"><path d="M4 12h3l2.5-6 4 12 2.5-6h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  plus:     <svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  cog:      <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
};

const SIDE_MENUS = [
  { key:"home",     label:"대시보드" },
  { key:"partners", label:"거래처" },
  { key:"items",    label:"품목"   },
  { key:"sales",    label:"매출"   },
  { key:"purchase", label:"매입"   },
  { key:"collect",  label:"입출금" },
  { key:"tax",      label:"세금"   },
];
/* 하위 탭(화면 안 view-tabs) — 사용자가 메뉴 설정에서 "하위"를 켜면 사이드바에 나열된다 */
const SUB_MENUS = {
  partners: ["거래처", "활동"],
  items:    ["품목", "현황", "변동표", "수불부", "조정"],
  purchase: ["조회", "상세", "기간요약", "미수금"],
  sales:    ["조회", "상세", "기간요약", "미수금"],
};
function navTab(key, tab) { window.__nmActiveTab = { key, tab }; window.dispatchEvent(new CustomEvent("nonamed:tab:state", { detail: { key, tab } })); }
function useNavTab(key, tab, setTab) {
  React.useEffect(() => { navTab(key, tab); }, [key, tab]);
  React.useEffect(() => { const fn = (e) => { if (e.detail && e.detail.key === key && e.detail.tab && e.detail.tab !== tab) setTab(e.detail.tab); }; window.addEventListener("nonamed:tab", fn); return () => window.removeEventListener("nonamed:tab", fn); }, [key, tab, setTab]);
}

/* 메뉴 사용자 설정 (순서·이름·숨김) — localStorage 공유, 전 화면 반영 */
const NAV_CFG_KEY = "nonamed.nav.cfg.v1";
function readNavCfg() { try { const v = JSON.parse(localStorage.getItem(NAV_CFG_KEY)); return v && typeof v === "object" ? { order: v.order || null, labels: v.labels || {}, hidden: v.hidden || [], expand: v.expand || [] } : { order: null, labels: {}, hidden: [], expand: [] }; } catch (e) { return { order: null, labels: {}, hidden: [], expand: [] }; } }
function writeNavCfg(cfg) { try { localStorage.setItem(NAV_CFG_KEY, JSON.stringify(cfg)); } catch (e) {} window.dispatchEvent(new CustomEvent("nonamed:nav")); }
function applyNavCfg(cfg) {
  const by = new Map(SIDE_MENUS.map(m => [m.key, m]));
  const ordered = (cfg.order || []).filter(k => by.has(k)).map(k => by.get(k)).concat(SIDE_MENUS.filter(m => !(cfg.order || []).includes(m.key)));
  return ordered.map(m => ({ ...m, label: cfg.labels[m.key] || m.label, hidden: cfg.hidden.includes(m.key), expand: (cfg.expand || []).includes(m.key) && !!SUB_MENUS[m.key] }));
}

function NavEditModal({ onClose }) {
  const [cfg, setCfg] = React.useState(readNavCfg);
  const [drag, setDrag] = React.useState(null);
  const [over, setOver] = React.useState(null);
  const list = applyNavCfg(cfg);
  React.useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") { e.stopImmediatePropagation(); onClose(); } else if (e.key === "F8") { e.stopImmediatePropagation(); e.preventDefault(); save(); } };
    window.addEventListener("keydown", fn, true);
    return () => window.removeEventListener("keydown", fn, true);
  });
  const move = (from, to) => { if (from === to || from == null) return; const ids = list.map(x => x.key); const [m] = ids.splice(from, 1); ids.splice(to, 0, m); setCfg(c => ({ ...c, order: ids })); };
  const toggle = (k) => setCfg(c => ({ ...c, hidden: c.hidden.includes(k) ? c.hidden.filter(x => x !== k) : [...c.hidden, k] }));
  const toggleExpand = (k) => setCfg(c => { const ex = c.expand || []; return { ...c, expand: ex.includes(k) ? ex.filter(x => x !== k) : [...ex, k] }; });
  const rename = (k, v) => setCfg(c => ({ ...c, labels: { ...c.labels, [k]: v } }));
  const save = () => {
    const labels = {};
    Object.entries(cfg.labels).forEach(([k, v]) => { const t = String(v || "").trim(); const base = SIDE_MENUS.find(m => m.key === k); if (t && base && t !== base.label) labels[k] = t; });
    writeNavCfg({ ...cfg, labels });
    onClose();
    if (window.showToast) showToast("메뉴 설정을 저장했어요");
  };
  return (
    <div className="modal-root" role="dialog" aria-modal="true" style={{ zIndex: 150 }}>
      <div className="modal-scrim" onClick={onClose}></div>
      <div className="modal nav-edit">
        <header className="modal-head">
          <div><h2 className="modal-title">메뉴 설정</h2><div className="modal-sub">드래그 또는 화살표로 순서를 바꾸고, 이름을 직접 고칠 수 있어요. 체크를 끄면 메뉴에서 숨겨집니다. 「하위」를 켜면 그 메뉴의 탭이 사이드바에 펼쳐집니다.</div></div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="닫기">✕</button>
        </header>
        <div className="nav-edit-body">
          {list.map((m, i) => (
            <div key={m.key} className={"nav-edit-row" + (m.hidden ? " is-off" : "") + (over === i ? " is-over" : "")} draggable
              onDragStart={() => setDrag(i)} onDragOver={(e) => { e.preventDefault(); setOver(i); }} onDragLeave={() => setOver(null)}
              onDrop={(e) => { e.preventDefault(); move(drag, i); setDrag(null); setOver(null); }} onDragEnd={() => { setDrag(null); setOver(null); }}>
              <span className="nav-edit-grip" title="드래그해서 순서 변경">⠿</span>
              <button type="button" className={"nav-edit-chk" + (m.hidden ? "" : " is-on")} onClick={() => toggle(m.key)} title={m.hidden ? "메뉴에 표시" : "메뉴에서 숨김"}>{m.hidden ? "" : "✓"}</button>
              <span className="nav-edit-ico">{SHELL_I[m.key]}</span>
              <input className="nav-edit-name" value={cfg.labels[m.key] != null ? cfg.labels[m.key] : m.label} placeholder={SIDE_MENUS.find(x => x.key === m.key).label} onChange={(e) => rename(m.key, e.target.value)} />
              <span className="nav-edit-orig">{SIDE_MENUS.find(x => x.key === m.key).label}</span>
              {SUB_MENUS[m.key] ? <button type="button" className={"nav-edit-sub" + (m.expand ? " is-on" : "")} title={m.expand ? "하위 메뉴 접기" : "하위 메뉴 펼침 (" + SUB_MENUS[m.key].join("·") + ")"} onClick={() => toggleExpand(m.key)}>하위 {m.expand ? "▾" : "▸"}</button> : <span />}
              <div className="nav-edit-arrows">
                <button type="button" disabled={i === 0} onClick={() => move(i, i - 1)} title="위로">↑</button>
                <button type="button" disabled={i === list.length - 1} onClick={() => move(i, i + 1)} title="아래로">↓</button>
              </div>
            </div>
          ))}
        </div>
        <footer className="modal-foot nav-edit-foot">
          <button type="button" className="btn-ghost" onClick={() => setCfg({ order: null, labels: {}, hidden: [], expand: [] })}>기본값으로</button>
          <div className="nav-edit-foot-r">
            <button type="button" className="btn-ghost" onClick={onClose}>닫기</button>
            <button type="button" className="btn-primary" onClick={save}>저장 <kbd className="btn-kbd">F8</kbd></button>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Sidebar({ active }) {
  const [cfg, setCfg] = React.useState(readNavCfg);
  const [editOpen, setEditOpen] = React.useState(false);
  const [curTab, setCurTab] = React.useState(() => (window.__nmActiveTab && window.__nmActiveTab.key === active) ? window.__nmActiveTab.tab : null);
  React.useEffect(() => { const fn = () => setCfg(readNavCfg()); window.addEventListener("nonamed:nav", fn); window.addEventListener("storage", fn); return () => { window.removeEventListener("nonamed:nav", fn); window.removeEventListener("storage", fn); }; }, []);
  React.useEffect(() => { const fn = (e) => { if (e.detail && e.detail.key === active) setCurTab(e.detail.tab); }; window.addEventListener("nonamed:tab:state", fn); return () => window.removeEventListener("nonamed:tab:state", fn); }, [active]);
  const [, permTick] = React.useState(0);
  React.useEffect(() => { const fn = () => permTick(n => n + 1); window.addEventListener("nonamed:account", fn); return () => window.removeEventListener("nonamed:account", fn); }, []);
  const menus = applyNavCfg(cfg).filter(m => (!m.hidden || m.key === active) && !(window.acLevel && m.key !== "home" && window.acLevel(m.key) === "숨김"));
  const go = (key, tab) => {
    if (key === active && tab) { window.dispatchEvent(new CustomEvent("nonamed:tab", { detail: { key, tab } })); return; }
    const url = NAV[key];
    if (url && !url.startsWith("#")) window.location.href = tab ? url + "?tab=" + encodeURIComponent(tab) : url;
  };
  return (
    <aside className="sidebar">
      <a className="sb-logo" href="dashboard.html" title="nonamed"><SketchLogo size={32} /></a>
      <nav className="sb-nav">
        {menus.map(m => (
          <React.Fragment key={m.key}>
          <button
            className={`sb-item ${active === m.key ? "is-active" : ""} ${m.expand ? "has-sub" : ""}`}
            type="button"
            onClick={() => go(m.key)}
            title={m.label}
          >
            <span className="sb-icon">{SHELL_I[m.key]}</span>
            <span className="sb-label">{m.label}</span>
          </button>
          {m.expand ? (
            <div className="sb-sub">
              {SUB_MENUS[m.key].map((t, i) => <button key={t} type="button" className={`sb-sub-item ${active === m.key && (curTab ? curTab === t : i === 0) ? "is-active" : ""}`} onClick={() => go(m.key, t)} title={t}>{t}</button>)}
            </div>
          ) : null}
          </React.Fragment>
        ))}
      </nav>
      <button className="sb-cfg" type="button" title="메뉴 위치·이름 설정" onClick={() => setEditOpen(true)}>{SHELL_I.cog}<span className="sb-cfg-label">메뉴 설정</span></button>
      <button className="sb-plus" type="button" title="새로 만들기">{SHELL_I.plus}</button>
      {editOpen ? ReactDOM.createPortal(<NavEditModal onClose={() => setEditOpen(false)} />, document.body) : null}
    </aside>
  );
}

function formatBiz(v) {
  const d = (v || "").replace(/\D/g, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 6) return d.slice(0, 3) + "-" + d.slice(3);
  return d.slice(0, 3) + "-" + d.slice(3, 5) + "-" + d.slice(5);
}
function formatPhone(v) {
  const d = (v || "").replace(/\D/g, "").slice(0, 11);
  if (d.startsWith("02")) {
    if (d.length < 3) return d;
    if (d.length < 6) return d.slice(0, 2) + "-" + d.slice(2);
    if (d.length < 10) return d.slice(0, 2) + "-" + d.slice(2, 5) + "-" + d.slice(5);
    return d.slice(0, 2) + "-" + d.slice(2, 6) + "-" + d.slice(6);
  }
  if (d.length < 4) return d;
  if (d.length < 8) return d.slice(0, 3) + "-" + d.slice(3);
  if (d.length < 11) return d.slice(0, 3) + "-" + d.slice(3, 6) + "-" + d.slice(6);
  return d.slice(0, 3) + "-" + d.slice(3, 7) + "-" + d.slice(7);
}

Object.assign(window, { NAV, SketchLogo, SHELL_I, SIDE_MENUS, SUB_MENUS, navTab, useNavTab, Sidebar, NavEditModal, readNavCfg, writeNavCfg, applyNavCfg, formatBiz, formatPhone });

/* 공통 셸 스타일 — 버튼/사이드바 라벨 줄바꿈 방지 */
(() => {
  const css = '.btn-primary,.btn-ghost,.sb-label,.title-add,.period-search{white-space:nowrap;}' +
    '.btn-primary,.btn-ghost{flex:none;}' +
    '.sb-cfg{appearance:none;border:0;background:transparent;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 6px;margin:0 14px 8px;border-radius:12px;color:var(--ink-3,#8B8273);font:500 10.5px "IBM Plex Sans KR",sans-serif;}' +
    '.sb-cfg:hover{background:var(--card-2,#F8F4EB);color:var(--ink,#1F1A14);}.sb-cfg svg{width:18px;height:18px;}' +
    '.modal.nav-edit{width:min(560px,94vw);max-width:560px;}' +
    '.nav-edit-body{padding:12px 20px;display:flex;flex-direction:column;gap:6px;max-height:60vh;overflow:auto;}' +
    '.nav-edit-row{display:grid;grid-template-columns:18px 22px 22px minmax(0,1fr) auto auto auto;align-items:center;gap:10px;padding:8px 10px;border:1px solid var(--line,rgba(31,26,20,.12));border-radius:12px;background:var(--card,#FBF8F2);cursor:grab;}' +
    '.nav-edit-sub{appearance:none;border:1px solid var(--line,rgba(31,26,20,.14));background:#fff;border-radius:7px;padding:4px 8px;font:600 11px "IBM Plex Sans KR",sans-serif;color:var(--ink-2,#5A5247);cursor:pointer;white-space:nowrap;}' +
    '.nav-edit-sub.is-on{background:var(--accent,#D97757);border-color:var(--accent,#D97757);color:#fff;}' +
    '.sb-sub{display:flex;flex-direction:column;gap:2px;margin:-2px 10px 6px;padding:4px 0 4px 8px;border-left:1.5px solid var(--line,rgba(31,26,20,.12));}' +
    '.sb-sub-item{appearance:none;border:0;background:transparent;text-align:left;cursor:pointer;padding:6px 10px;border-radius:8px;font:500 12px "IBM Plex Sans KR",sans-serif;color:var(--ink-3,#8B8273);white-space:nowrap;}' +
    '.sb-sub-item:hover{background:var(--card-2,#F8F4EB);color:var(--ink,#1F1A14);}.sb-sub-item.is-active{background:var(--ink,#1F1A14);color:var(--card,#FBF8F2);}' +
    '.nav-edit-row.is-over{border-color:var(--accent,#D97757);box-shadow:0 0 0 2px color-mix(in oklab,var(--accent,#D97757) 25%,transparent);}' +
    '.nav-edit-row.is-off{opacity:.5;}.nav-edit-row.is-off .nav-edit-name{text-decoration:line-through;}' +
    '.nav-edit-grip{color:var(--ink-3,#8B8273);font-size:14px;line-height:1;}' +
    '.nav-edit-chk{width:20px;height:20px;border-radius:6px;border:1.5px solid var(--line,rgba(31,26,20,.25));background:#fff;color:#fff;font-size:12px;line-height:1;cursor:pointer;padding:0;}' +
    '.nav-edit-chk.is-on{background:var(--accent,#D97757);border-color:var(--accent,#D97757);}' +
    '.nav-edit-ico{display:grid;place-items:center;color:var(--ink-2,#5A5247);}.nav-edit-ico svg{width:20px;height:20px;}' +
    '.nav-edit-name{min-width:0;padding:6px 10px;border:1px solid var(--line,rgba(31,26,20,.14));border-radius:8px;background:#fff;font:500 13.5px "IBM Plex Sans KR",sans-serif;color:var(--ink,#1F1A14);}' +
    '.nav-edit-name:focus{outline:none;border-color:var(--accent,#D97757);}' +
    '.nav-edit-orig{font:400 11.5px "IBM Plex Sans KR",sans-serif;color:var(--ink-3,#8B8273);white-space:nowrap;}' +
    '.nav-edit-arrows{display:flex;gap:4px;}.nav-edit-arrows button{width:26px;height:26px;border-radius:7px;border:1px solid var(--line,rgba(31,26,20,.14));background:#fff;cursor:pointer;color:var(--ink-2,#5A5247);}' +
    '.nav-edit-arrows button:disabled{opacity:.35;cursor:default;}' +
    '.nav-edit-foot{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:14px 20px 18px;border-top:1px solid var(--line-soft,rgba(31,26,20,.06));}.nav-edit-foot-r{display:flex;gap:8px;}' +
    '.modal-sub{margin-top:4px;font:400 12.5px "IBM Plex Sans KR",sans-serif;color:var(--ink-3,#8B8273);}' +
    /* 팝업 상단 부가설명 문구 전 화면 비표시 — 데이터 표시용(.keep)만 유지 */
    '.modal-head .modal-sub:not(.keep),.modal-head .page-sub:not(.keep),.modal-foot .entry-sub:not(.keep){display:none!important;}' +
    /* 입력 항목 바탕글(placeholder) 예시 전 화면 비표시 — 검색창(list-search·조건검색·코드도움)은 유지 */
    '.modal input::placeholder,.modal textarea::placeholder,.aef input::placeholder,.aef textarea::placeholder,.entry-body input::placeholder,.entry-body textarea::placeholder{color:transparent!important;}' +
    '.modal .list-search input::placeholder,.modal .pick-search input::placeholder,.modal .cc-lookup input::placeholder,.modal .srch-q input::placeholder,.modal .adj-pick input::placeholder,.pick-head input::placeholder,.pick-q input::placeholder,.searchcond input::placeholder,.sc-body input::placeholder{color:var(--ink-3,#8B8273)!important;}';
  const el = document.createElement("style");
  el.id = "shell-common-style";
  el.textContent = css;
  if (!document.getElementById("shell-common-style")) document.head.appendChild(el);
})();
