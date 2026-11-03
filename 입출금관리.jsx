// 매입관리.jsx — nonamed ERP 매입 관리 (KPI + 기간필터 + 테이블 + 전표 상세 모달 + 화면설정)

const { useState, useEffect, useMemo, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "여유"
}/*EDITMODE-END*/;


/* ─────────────────────────────────────────────
   Sketch logo
   ───────────────────────────────────────────── */

/* ─────────────────────────────────────────────
   Icons
   ───────────────────────────────────────────── */
const I = {
  copy:     <svg viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M5 15V5a1 1 0 011-1h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  trash:    <svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M6 7l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  home:     <svg viewBox="0 0 24 24" fill="none"><circle cx="8.5" cy="8.5" r="1.7" fill="currentColor"/><circle cx="15.5" cy="8.5" r="1.7" fill="currentColor"/><circle cx="8.5" cy="15.5" r="1.7" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.7" fill="currentColor"/></svg>,
  partners: <svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="9" r="2" fill="currentColor"/><circle cx="15.5" cy="9" r="2" fill="currentColor"/><path d="M5 16.5h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  items:    <svg viewBox="0 0 24 24" fill="none"><circle cx="6.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="6.5" cy="12" r="1.5" fill="currentColor"/><circle cx="6.5" cy="16.5" r="1.5" fill="currentColor"/><path d="M11 7.5h8M11 12h8M11 16.5h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  orders:   <svg viewBox="0 0 24 24" fill="none"><circle cx="6.5" cy="8" r="1.5" fill="currentColor"/><circle cx="6.5" cy="15" r="1.5" fill="currentColor"/><path d="M11 8h8M11 15h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  sales:    <svg viewBox="0 0 24 24" fill="none"><path d="M5 16l5-5 3 3 6-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="19" cy="7" r="1.7" fill="currentColor"/></svg>,
  purchase: <svg viewBox="0 0 24 24" fill="none"><path d="M5 8l5 5 3-3 6 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="19" cy="17" r="1.7" fill="currentColor"/></svg>,
  collect:  <svg viewBox="0 0 24 24" fill="none"><path d="M6 9h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="17.5" cy="9" r="1.6" fill="currentColor"/><path d="M6 15h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="6.5" cy="15" r="1.6" fill="currentColor"/></svg>,
  tax:      <svg viewBox="0 0 24 24" fill="none"><circle cx="8.5" cy="8.5" r="1.7" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.7" fill="currentColor"/><path d="M17 7L7 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,

  stock:    <svg viewBox="0 0 24 24" fill="none"><path d="M4 9l8-4 8 4v8l-8 4-8-4V9z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M4 9l8 4 8-4M12 13v8" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>,

  search:   <svg viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.6"/><path d="M16 16l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  chevron:  <svg viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  download: <svg viewBox="0 0 24 24" fill="none"><path d="M12 4v12M7 11l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  check:    <svg viewBox="0 0 24 24" fill="none"><path d="M5 12l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  close:    <svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  cog:      <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/><path d="M19.4 15a1.7 1.7 0 00.34 1.87l.06.06a2 2 0 11-2.83 2.83l-.06-.06A1.7 1.7 0 0015 19.4a1.7 1.7 0 00-1 1.55V21a2 2 0 11-4 0v-.09A1.7 1.7 0 009 19.4a1.7 1.7 0 00-1.87.34l-.06.06A2 2 0 114.24 16.97l.06-.06A1.7 1.7 0 004.6 15a1.7 1.7 0 00-1.55-1H3a2 2 0 110-4h.09A1.7 1.7 0 004.6 9a1.7 1.7 0 00-.34-1.87l-.06-.06A2 2 0 117.03 4.24l.06.06A1.7 1.7 0 009 4.6a1.7 1.7 0 001-1.55V3a2 2 0 114 0v.09A1.7 1.7 0 0015 4.6a1.7 1.7 0 001.87-.34l.06-.06a2 2 0 112.83 2.83l-.06.06A1.7 1.7 0 0019.4 9a1.7 1.7 0 001.55 1H21a2 2 0 110 4h-.09a1.7 1.7 0 00-1.51 1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  up:       <svg viewBox="0 0 24 24" fill="none"><path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  down:     <svg viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  drag:     <svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="6" r="1.4" fill="currentColor"/><circle cx="15" cy="6" r="1.4" fill="currentColor"/><circle cx="9" cy="12" r="1.4" fill="currentColor"/><circle cx="15" cy="12" r="1.4" fill="currentColor"/><circle cx="9" cy="18" r="1.4" fill="currentColor"/><circle cx="15" cy="18" r="1.4" fill="currentColor"/></svg>,
  reset:    <svg viewBox="0 0 24 24" fill="none"><path d="M3 12a9 9 0 1015 4M3 4v6h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  trend:    <svg viewBox="0 0 24 24" fill="none"><path d="M3 17l5-5 4 3 6-7M14 8h6v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  receipt:  <svg viewBox="0 0 24 24" fill="none"><path d="M6 3h12v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5L6 21V3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  print:    <svg viewBox="0 0 24 24" fill="none"><path d="M7 8V3h10v5M7 18H5a1 1 0 01-1-1v-6a1 1 0 011-1h14a1 1 0 011 1v6a1 1 0 01-1 1h-2M7 14h10v7H7v-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  send:     <svg viewBox="0 0 24 24" fill="none"><path d="M4 11l16-7-7 16-2-7-7-2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>,
};



const TODAY = new Date().toISOString().slice(0, 10);
const PERIOD_OPTIONS = ["기본", "금일", "전일", "다음일", "이번주", "다음주"];
function shiftDate(base, days) { const d = new Date(base); d.setDate(d.getDate() + days); return d.toISOString().slice(0, 10); }
function weekRange(base, offsetWeeks) { const d = new Date(base); const dow = (d.getDay() + 6) % 7; const mon = new Date(d); mon.setDate(d.getDate() - dow + offsetWeeks * 7); const sun = new Date(mon); sun.setDate(mon.getDate() + 6); return [mon.toISOString().slice(0, 10), sun.toISOString().slice(0, 10)]; }
function inPeriod(dateStr, period, range) {
  if (period === "기본") { if (range && range.from && dateStr < range.from) return false; if (range && range.to && dateStr > range.to) return false; return true; }
  if (period === "금일") return dateStr === TODAY;
  if (period === "전일") return dateStr === shiftDate(TODAY, -1);
  if (period === "다음일") return dateStr === shiftDate(TODAY, 1);
  if (period === "이번주") { const [a, b] = weekRange(TODAY, 0); return dateStr >= a && dateStr <= b; }
  if (period === "다음주") { const [a, b] = weekRange(TODAY, 1); return dateStr >= a && dateStr <= b; }
  return true;
}
function periodRange(period) {
  if (period === "금일") return [TODAY, TODAY];
  if (period === "전일") return [shiftDate(TODAY, -1), shiftDate(TODAY, -1)];
  if (period === "다음일") return [shiftDate(TODAY, 1), shiftDate(TODAY, 1)];
  if (period === "이번주") return weekRange(TODAY, 0);
  if (period === "다음주") return weekRange(TODAY, 1);
  return null;
}
const fmt = (n) => Number(n || 0).toLocaleString("ko-KR");

/* ─────────────────────────────────────────────
   입출금 데이터
   ───────────────────────────────────────────── */
const FILTER_TABS = ["전체", "입금", "출금"];
const pcolor = (n) => ["#C9A678","#A88471","#7B6D85","#3D4A66","#5B7C5A","#B58860"][(n || " ").charCodeAt(0) % 6];
const CASH_SEED = [
  { id:"C-26-0011", date:"2026-06-04", kind:"입금", partner:"한양식자재",     amount:1200000, memo:"5월분 수금",    source:"문자" },
  { id:"C-26-0010", date:"2026-06-03", kind:"출금", partner:"송파유통",       amount:640000,  memo:"매입대금 지급",  source:"직접" },
  { id:"C-26-0009", date:"2026-06-02", kind:"입금", partner:"동대문푸드",     amount:355000,  memo:"입금",          source:"문자" },
  { id:"C-26-0008", date:"2026-06-01", kind:"출금", partner:"마포정육점",     amount:980000,  memo:"정산 지급",      source:"직접" },
  { id:"C-26-0007", date:"2026-05-31", kind:"입금", partner:"종로식자재마트", amount:1284000, memo:"주문 결제",      source:"문자" },
  { id:"C-26-0006", date:"2026-05-30", kind:"출금", partner:"성수냉동",       amount:96000,   memo:"운송비 포함",    source:"직접" },
];
CASH_SEED.length = 0; // 샘플 데이터 제거(배포용)
const CASH_LS = "hana.cash.records.v1";
const ACCOUNT_MASTER = [
  { code: "101", name: "현금" },
  { code: "103", name: "보통예금" },
  { code: "108", name: "외상매출금" },
  { code: "110", name: "받을어음" },
  { code: "146", name: "상품" },
  { code: "251", name: "외상매입금" },
  { code: "253", name: "미지급금" },
  { code: "401", name: "상품매출" },
  { code: "811", name: "복리후생비" },
  { code: "812", name: "여비교통비" },
  { code: "813", name: "접대비" },
  { code: "821", name: "보험료" },
  { code: "831", name: "수수료비용" },
  { code: "901", name: "이자수익" },
];
const CASH_ENTRY_COLS = [
  { key: "gubun", label: "구분", width: "50px" },
  { key: "acct", label: "계좌", width: "minmax(64px,0.8fr)" },
  { key: "account", label: "계정과목", width: "minmax(64px,0.8fr)" },
  { key: "partner", label: "거래처", width: "minmax(80px,1fr)" },
  { key: "jrpartner", label: "차대변 거래처", width: "minmax(80px,1fr)" },
  { key: "memo", label: "적요", width: "minmax(70px,1fr)" },
  { key: "debit", label: "차변", width: "minmax(64px,0.7fr)" },
  { key: "credit", label: "대변", width: "minmax(64px,0.7fr)" },
];
const PARTNER_MASTER = [
  { code: "P-001", name: "한양식자재", ceo: "이한양", phone: "02-555-1241", region: "강남구", bank: "국민은행 445601-01-2234" },
  { code: "P-002", name: "송파유통", ceo: "김송파", phone: "02-411-3320", region: "송파구", bank: "농협 301-0221-8845-11" },
  { code: "P-003", name: "동대문푸드", ceo: "정대문", phone: "02-967-2002", region: "동대문구", bank: "신한은행 110-442-556677" },
  { code: "P-004", name: "마포정육점", ceo: "강마포", phone: "02-322-7700", region: "마포구", bank: "기업은행 034-556677-01-019" },
  { code: "P-005", name: "성수냉동", ceo: "오성수", phone: "02-488-1820", region: "성동구", bank: "국민은행 812101-04-1123" },
  { code: "P-006", name: "종로식자재마트", ceo: "한종로", phone: "02-733-5050", region: "종로구", bank: "우리은행 1002-334-556677" },
  { code: "P-007", name: "강서물산", ceo: "문강서", phone: "02-655-4100", region: "강서구", bank: "하나은행 278-910042-33307" },
  { code: "P-008", name: "광진수산", ceo: "권광진", phone: "02-454-9912", region: "광진구", bank: "농협 351-1102-4456-83" },
];
/* 거래처 테이블(거래처등록 화면)과 동기화 — 저장소가 있으면 샘플 마스터를 대체 */
(function syncCashPartners() {
  const apply = () => { if (localStorage.getItem(NM_LIST_KEY.거래처) == null) return; PARTNER_MASTER.splice(0, PARTNER_MASTER.length, ...partnerPickerItems()); };
  apply(); window.addEventListener("nonamed:list", apply); window.addEventListener("storage", apply); window.addEventListener("focus", apply);
})();
/* 검색 팝업 — 매입입력과 동일 패턴 */
function PickerOverlay({ title, items, fields, columns, initialQuery, onPick, onNew, onClose }) {
  const [q, setQ] = useState(initialQuery || "");
  const [hi, setHi] = useState(0);
  const inputRef = useRef(null);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 30); }, []);
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") { e.stopImmediatePropagation(); e.preventDefault(); onClose(); } };
    window.addEventListener("keydown", fn, true);
    return () => window.removeEventListener("keydown", fn, true);
  }, [onClose]);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(it => fields.some(f => String(it[f] || "").toLowerCase().includes(s)));
  }, [q, items, fields]);
  useEffect(() => { setHi(0); }, [q]);
  const tmpl = columns.map(c => c.width || "1fr").join(" ");
  return (
    <div className="pick-root" role="dialog" aria-modal="true">
      <div className="pick-scrim" onClick={onClose} />
      <div className="pick-box pick-box-lg">
        <header className="pick-head">
          <h3>{title}</h3>
          <button type="button" className="modal-close" onClick={onClose}>{I.close}</button>
        </header>
        <div className="pick-search">
          <span className="pick-ico">{I.search}</span>
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setHi(h => Math.min(h + 1, list.length - 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setHi(h => Math.max(h - 1, 0)); }
              else if (e.key === "Enter") { e.preventDefault(); if (list[hi]) onPick(list[hi]); }
              else if (e.key === "F2") { e.preventDefault(); onNew && onNew(); }
            }}
            placeholder="검색어를 입력하세요" />
        </div>
        <div className="pick-table">
          <div className="pick-trow pick-thead" style={{ gridTemplateColumns: tmpl }}>
            {columns.map(c => <div key={c.key} className={`pk-cell ${c.align === "right" ? "is-right" : ""}`}>{c.label}</div>)}
          </div>
          <div className="pick-tbody">
            {list.length === 0 ? <div className="pick-empty">검색 결과가 없습니다.</div> : null}
            {list.map((it, i) => (
              <button key={it.code || it.name} type="button" className={`pick-trow pick-opt ${i === hi ? "is-hi" : ""}`} style={{ gridTemplateColumns: tmpl }}
                onMouseEnter={() => setHi(i)} onClick={() => onPick(it)}>
                {columns.map(c => <div key={c.key} className={`pk-cell ${c.align === "right" ? "is-right" : ""} ${c.strong ? "is-strong" : ""} ${c.mono ? "is-mono" : ""}`}>{it[c.key] ?? "—"}</div>)}
              </button>
            ))}
          </div>
        </div>
        <footer className="pick-foot">
          <span className="pick-foot-cnt">{list.length}건 · ↑↓ 이동 · Enter 선택{onNew ? " · F2 신규" : ""}</span>
          {onNew ? <button type="button" className="pick-new" onClick={onNew}>+ 신규 <kbd className="btn-kbd">F2</kbd></button> : null}
        </footer>
      </div>
    </div>
  );
}
function loadCash() {
  try { const saved = JSON.parse(localStorage.getItem(CASH_LS)) || []; const seen = new Set(); return [...saved, ...CASH_SEED].filter(r => { if (!r.id || seen.has(r.id)) return false; seen.add(r.id); return true; }); } catch (e) { return CASH_SEED; }
}
function persistCash(records) {
  try { localStorage.setItem(CASH_LS, JSON.stringify(records.filter(r => r.manual).map(({ isNew, ...r }) => r))); window.dispatchEvent(new CustomEvent("nonamed:cash")); } catch (e) {}
}
function cashJournal(r) {
  const ls = r.lines && r.lines.length ? r.lines : [r];
  const out = [];
  ls.forEach(l => {
    const bank = l.acct || r.acct || "보통예금";
    const acc = l.account || (l.kind === "입금" ? "외상매출금" : "외상매입금");
    const nm = acc + (l.partner ? ` (${l.partner})` : "");
    const g = l.gubun || (l.kind === "입금" ? "입금" : "지급");
    if (g === "입금") out.push({ side: "차변", name: bank, amt: l.amount }, { side: "대변", name: nm, amt: l.amount });
    else if (g === "지급") out.push({ side: "차변", name: nm, amt: l.amount }, { side: "대변", name: bank, amt: l.amount });
    else if (g === "차변") out.push({ side: "차변", name: nm, amt: l.amount });
    else out.push({ side: "대변", name: nm, amt: l.amount });
  });
  return out;
}
function nextCashId(records) {
  const n = records.reduce((m, r) => { const x = Number((r.id || "").split("-")[2]); return x > m ? x : m; }, 0);
  return "C-26-" + String(n + 1).padStart(4, "0");
}
// 은행 입출금 문자 간이 파서 — 한 줄당 한 건
function parseSms(text) {
  const out = [];
  text.split(/\n+/).forEach(line => {
    const t = line.trim(); if (!t) return;
    const kind = /입금/.test(t) ? "입금" : /출금|이체/.test(t) ? "출금" : null;
    const am = t.match(/([\d,]{3,})원?/);
    if (!kind || !am) return;
    const amount = Number(am[1].replace(/,/g, "")); if (!amount) return;
    const dm = t.match(/(\d{2})[./-](\d{2})/);
    const date = dm ? ("2026-" + dm[1] + "-" + dm[2]) : TODAY;
    const words = t.replace(/[\d,./:원*\[\]()-]/g, " ").split(/\s+/).filter(w => w.length >= 2 && !/입금|출금|이체|잔액|은행|체크|국민|신한|우리|하나|농협|카카오|토스|님/.test(w));
    out.push({ date, kind, partner: words[words.length - 1] || "미확인", amount, memo: "문자 자동등록", source: "문자" });
  });
  return out;
}

/* ─────────────────────────────────────────────
   Sidebar / TopBar
   ───────────────────────────────────────────── */

function TopBar() { return <CommonTopBar crumb="입출금" />; }

/* ─────────────────────────────────────────────
   입·출금 입력 / 문자 붙여넣기 모달
   ───────────────────────────────────────────── */
function CashModal({ open, onSave, onClose, initial }) {
  const ACCTS = ["국민 1234", "농협 5678", "기업 9012", "현금"];
  const ACCT_MASTER = [
    { code: "A01", name: "국민 1234", bank: "국민은행" },
    { code: "A02", name: "농협 5678", bank: "농협" },
    { code: "A03", name: "기업 9012", bank: "기업은행" },
    { code: "A04", name: "현금", bank: "-" },
  ];
  const emptyLine = () => ({ kind: "입금", gubun: "", acct: "", account: "", partner: "", amount: "", memo: "" });
  const ecRef = useRef([]);
  const lineActive = (l) => !!(String(l.gubun || "").trim() || String(l.partner || "").trim() || String(l.amount || "").trim());
  const dv = (c, l, k) => { const v = l[k]; if (v != null && v !== "") return v; const d = c && c.def && (c.def.dflt || c.def.text); return (d && lineActive(l)) ? d : ""; };
  const esnap = useRef(null);
  const requestClose = () => { if (ecfg) { if (esnap.current) ec.restore(esnap.current); setEcfg(false); } onClose(); };
  const [date, setDate] = useState(TODAY);
  const [lines, setLines] = useState([emptyLine()]);
  const [err, setErr] = useState("");
  const [acctPop, setAcctPop] = useState(null); // {row, hi}
  const [gbPop, setGbPop] = useState(null); // {row, hi}
  const GUBUNS = ["입금", "지급", "차변", "대변"];
  // 구분 목록: 값이 이미 선택된 상태(정확히 일치)에서도 4개 전부 보이고, 태이핑 중에만 압축
  const gbList = (v) => (!v || GUBUNS.includes(v)) ? GUBUNS : GUBUNS.filter(g => g.includes(v));
  const setGubun = (i, g) => setLines(ls => ls.map((x, j) => j === i ? { ...x, gubun: g, kind: (g === "입금" || g === "차변") ? "입금" : (g === "지급" || g === "대변") ? "출금" : x.kind } : x));
  const [picker, setPicker] = useState(null); // {row, q}
  const gridRef = useRef(null);
  // 화면설정 (매입입력 공통화)
  const ec = useColConfig({ allColumns: CASH_ENTRY_COLS, defaultVisible: CASH_ENTRY_COLS.map(c => c.key), prefix: "nonamed.cash.entry" });
  const [ecfg, setEcfg] = useState(false);
  useEffect(() => { ec.setCfg(!!ecfg); }, [ecfg]);
  const [ecolPop, setEcolPop] = useState(null);
  const [eAddColOpen, setEAddColOpen] = useState(false);
  const [eEditCol, setEEditCol] = useState(null);
  const [eSaveOpen, setESaveOpen] = useState(false);
  const [eOwCode, setEOwCode] = useState(null);
  const [eDonePrompt, setEDonePrompt] = useState(false);
  const wf = useWinFrame("nonamed.cash.entry", 1280, open);
  const edrag = useRef(null);
  const erz = useRef(null);
  // 상단 입력항목 (매입입력 공통화)
  const topRef = useRef(null);
  const gridDrag = useRef(null);
  const [hdrFields, setHdrFields] = useState(() => { try { const v = JSON.parse(localStorage.getItem("nonamed.cash.entryHdr.v1")); return Array.isArray(v) ? v : []; } catch (e) { return []; } });
  useEffect(() => { try { localStorage.setItem("nonamed.cash.entryHdr.v1", JSON.stringify(hdrFields)); } catch (e) {} }, [hdrFields]);
  const [hdrAddOpen, setHdrAddOpen] = useState(false);
  const [hdrEdit, setHdrEdit] = useState(null);
  const [hdrPop, setHdrPop] = useState(null);
  const [invalid, setInvalid] = useState(() => new Set());
  const [dateLabel, setDateLabel] = useState(() => { try { return localStorage.getItem("nonamed.cash.dateLabel") || "거래일자"; } catch (e) { return "거래일자"; } });
  const [dateDflt, setDateDflt] = useState(() => { try { return localStorage.getItem("nonamed.cash.dateDflt") || ""; } catch (e) { return ""; } });
  useEffect(() => { try { localStorage.setItem("nonamed.cash.dateLabel", dateLabel); localStorage.setItem("nonamed.cash.dateDflt", dateDflt); } catch (e) {} }, [dateLabel, dateDflt]);
  const [hdrVals, setHdrVals] = useState({});
  const [gridOrder, setGridOrder] = useState(() => { try { const v = JSON.parse(localStorage.getItem("nonamed.cash.gridOrder.v1")); return Array.isArray(v) ? v : null; } catch (e) { return null; } });
  useEffect(() => { try { localStorage.setItem("nonamed.cash.gridOrder.v1", JSON.stringify(gridOrder)); } catch (e) {} }, [gridOrder]);
  // 우측 정보 패널 (매입입력 공통화)
  const panelApi = usePanels("nonamed.cash.entry.panels.v2", null);
  useEffect(() => { if (panelApi.panels[0] && panelApi.panels[0].title === "품목 정보") panelApi.renamePanel(panelApi.panels[0].id, "거래처 정보"); }, []);
  const [panelPickFor, setPanelPickFor] = useState(null);
  const [panelNameFor, setPanelNameFor] = useState(null);
  const [activeRow, setActiveRow] = useState(null);
  useEffect(() => { if (!ecfg) { setEcolPop(null); setEAddColOpen(false); setEEditCol(null); } }, [ecfg]);
  useEffect(() => {
    const move = (e) => { if (!erz.current) return; const { key, x, w } = erz.current; ec.setWidth(key, Math.max(60, w + (e.clientX - x))); };
    const up = () => { erz.current = null; document.body.style.cursor = ""; };
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, []);
  useEffect(() => { if (open) { setDate(initial ? initial.date : (/^\d{4}-\d{2}-\d{2}$/.test(dateDflt) ? dateDflt : TODAY)); const initLines = initial ? (initial.lines && initial.lines.length ? initial.lines.map(l => ({ kind: l.kind || "입금", gubun: l.gubun || "", acct: l.acct || "", account: l.account || "", partner: l.partner || "", amount: String(l.amount || ""), memo: l.memo || "" })) : [{ kind: initial.kind, gubun: initial.gubun || (initial.kind === "입금" ? "입금" : "지급"), acct: initial.acct || "", account: initial.account || "", partner: initial.partner || "", amount: String(initial.amount || ""), memo: initial.memo || "" }]) : null; setLines(initLines ? [...initLines, ...Array.from({ length: Math.max(5 - initLines.length, 1) }, emptyLine)] : Array.from({ length: 5 }, emptyLine)); setErr(""); setInvalid(new Set()); setAcctPop(null); setPicker(null); setHdrVals({}); setTimeout(() => { const base = ["date", ...hdrFields.map(f => f.key)]; const ks = gridOrder ? [...gridOrder.filter(k => base.includes(k)), ...base.filter(k => !gridOrder.includes(k))] : base; const first = topRef.current?.querySelector(`[data-hdr="${ks[0]}"]`) || topRef.current?.querySelector("[data-hdr]"); if (first) { first.focus(); if (first.select) first.select(); } }, 60); } }, [open]);
  useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (e.key === "Escape") { e.stopPropagation(); if (acctPop || gbPop) { setAcctPop(null); setGbPop(null); } else if (eAddColOpen || eEditCol || eSaveOpen || eOwCode || eDonePrompt || hdrAddOpen) { setEAddColOpen(false); setEEditCol(null); setESaveOpen(false); setEOwCode(null); setEDonePrompt(false); setHdrAddOpen(false); } else if (ecolPop) { setEcolPop(null); } else if (ecfg) { if (esnap.current) ec.restore(esnap.current); setEcfg(false); } else if (!picker) requestClose(); }
      else if (e.key === "F8") { e.preventDefault(); submit(); }
    };
    window.addEventListener("keydown", h, true);
    return () => window.removeEventListener("keydown", h, true);
  }, [open, onClose, lines, date, acctPop, picker, ecfg, ecolPop, eAddColOpen, eEditCol, eSaveOpen, eOwCode, eDonePrompt, hdrAddOpen]);
  // 마지막 라인에 입력이 생기면 자동으로 빈 라인 추가 (매입입력 방식)
  useEffect(() => {
    if (!open || !lines.length) return;
    const last = lines[lines.length - 1];
    if (last.partner.trim() || last.memo.trim() || Number(String(last.amount).replace(/[^\d]/g, "")) || last.acct || last.account || last.gubun) setLines(ls => [...ls, emptyLine()]);
  }, [open, lines]);
  if (!open) return null;
  const upd = (i, k, v) => { setInvalid(s => { if (!s.has(`${i}-${k}`)) return s; const n = new Set(s); n.delete(`${i}-${k}`); return n; }); setLines(ls => ls.map((l, j) => j === i ? { ...l, [k]: v } : l)); };
  const addLine = () => setLines(ls => [...ls, emptyLine()]);
  const delLine = (i) => setLines(ls => ls.length > 1 ? ls.filter((_, j) => j !== i) : ls);
  const displayCols = ecfg ? ec.allCols : ec.visibleCols;
  ecRef.current = ec.allCols;
  const tmpl = "34px " + displayCols.map(c => (typeof c.width === "number" ? c.width + "px" : (c.isCustom ? "minmax(40px,0.8fr)" : c.width))).join(" ");
  const editKeys = displayCols.map(c => c.key);
  const focusCell = (row, col) => {
    const el = gridRef.current?.querySelector(`[data-cell="${row}-${col}"]`);
    if (el) { el.focus(); if (el.select) el.select(); }
  };
  const focusNext = (row, key) => {
    let idx = editKeys.indexOf(key);
    while (idx > -1 && idx < editKeys.length - 1) {
      idx += 1;
      const el = gridRef.current?.querySelector(`[data-cell="${row}-${editKeys[idx]}"]`);
      if (el && !el.disabled) { el.focus(); if (el.select) el.select(); return; }
    }
    if (row === lines.length - 1) { setLines(ls => [...ls, emptyLine()]); setTimeout(() => focusCell(row + 1, editKeys[0]), 30); }
    else focusCell(row + 1, editKeys[0]);
  };
  const focusPrev = (row, key) => {
    let idx = editKeys.indexOf(key);
    while (idx > 0) {
      idx--;
      const k = editKeys[idx];
      if (k === "acct" && (lines[row] || {}).gubun && ["차변", "대변"].includes(lines[row].gubun)) continue;
      focusCell(row, k); return;
    }
    if (row > 0) focusCell(row - 1, editKeys[editKeys.length - 1]);
  };
  const onCellKey = (e, row, key) => {
    if (e.key === "ArrowDown") { e.preventDefault(); focusCell(Math.min(row + 1, lines.length - 1), key); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); focusCell(Math.max(row - 1, 0), key); return; }
    if (e.key === "ArrowRight" && e.target.selectionStart === e.target.value.length) { e.preventDefault(); focusNext(row, key); return; }
    if (e.key === "ArrowLeft" && e.target.selectionStart === 0) { e.preventDefault(); focusPrev(row, key); return; }
    if (e.key !== "Enter") return;
    e.preventDefault();
    focusNext(row, key);
  };
  // 상단 항목 순서/드래그/엔터 체인
  const baseGridKeys = ["date", ...hdrFields.map(f => f.key)];
  const gridKeys = gridOrder ? [...gridOrder.filter(k => baseGridKeys.includes(k)), ...baseGridKeys.filter(k => !gridOrder.includes(k))] : baseGridKeys;
  const orderOf = (k) => { const i = gridKeys.indexOf(k); return i < 0 ? 50 : i; };
  const moveGrid = (from, to) => { if (!from || from === to) return; const a = gridKeys.slice(); const fi = a.indexOf(from), ti = a.indexOf(to); if (fi < 0 || ti < 0) return; a.splice(ti, 0, a.splice(fi, 1)[0]); setGridOrder(a); };
  const fldDrag = (key) => ecfg ? { draggable: true, onDragStart: () => { gridDrag.current = key; }, onDragOver: (e) => e.preventDefault(), onDrop: (e) => { e.preventDefault(); moveGrid(gridDrag.current, key); gridDrag.current = null; } } : {};
  const focusField = (key) => {
    const i = gridKeys.indexOf(key);
    const next = gridKeys[i + 1];
    if (next) { const el = topRef.current?.querySelector(`[data-hdr="${next}"]`); if (el) { el.focus(); if (el.select) el.select(); return; } }
    focusCell(0, editKeys[0]);
  };
  const numOf = (v) => Number(String(v).replace(/[^\d]/g, "")) || 0;
  const activeLine = activeRow != null ? lines[activeRow] : null;
  const panelCtx = { item: null, partner: activeLine ? (PARTNER_MASTER.find(p => p.name === (activeLine.partner || "").trim()) || null) : null, line: activeLine };
  const sumIn = lines.filter(l => l.kind === "입금").reduce((s, l) => s + numOf(l.amount), 0);
  const sumOut = lines.filter(l => l.kind === "출금").reduce((s, l) => s + numOf(l.amount), 0);
  const submit = () => {
    const valid = lines.filter(l => l.partner.trim() && numOf(l.amount) > 0);
    const bad = lines.reduce((acc, l, i) => { if (!lineActive(l)) return acc; if (!l.partner.trim()) acc.push(`${i}-partner`); if (!(numOf(l.amount) > 0)) acc.push(`${i}-amt`); return acc; }, []);
    if (bad.length) { setInvalid(new Set(bad)); setErr("필수 항목(거래처·금액)을 입력해 주세요."); return; }
    setInvalid(new Set());
    if (!valid.length) { setErr("거래처와 금액을 입력해 주세요."); return; }
    const vl = valid.map(l => { const o = { ...l, kind: l.kind, gubun: l.gubun || (l.kind === "입금" ? "입금" : "지급"), partner: l.partner.trim(), amount: numOf(l.amount), memo: l.memo.trim(), acct: l.acct, account: l.account };
      (ecRef.current || []).forEach(c => { const d = (c.def && (c.def.dflt || c.def.text)) || c.dflt; if (d && (o[c.key] == null || o[c.key] === "")) o[c.key] = d; });
      return o; });
    const gset = new Set(vl.map(l => (l.gubun === "차변" || l.gubun === "대변") ? "대체" : (l.gubun === "입금" ? "입금" : "출금")));
    const kind = gset.size === 1 ? [...gset][0] : "대체";
    const inAmt = vl.filter(l => l.gubun === "입금").reduce((s, l) => s + l.amount, 0);
    const outAmt = vl.filter(l => l.gubun === "지급").reduce((s, l) => s + l.amount, 0);
    const drAmt = vl.filter(l => l.gubun !== "대변").reduce((s, l) => s + l.amount, 0);
    const amount = kind === "입금" ? inAmt : kind === "출금" ? outAmt : drAmt;
    onSave([{ ...vl[0], date, kind, amount, inAmt, outAmt, partner: vl[0].partner + (vl.length > 1 ? ` 외 ${vl.length - 1}` : ""), memo: vl[0].memo, acct: vl[0].acct, account: vl[0].account, source: "직접", lines: vl }]);
  };
  return (
    <div className="modal-root">
      <div className="modal-scrim" />
      <div className="modal" style={wf.winStyle}>
        <wf.WinResize />
        <header className="modal-head modal-head-drag" onMouseDown={wf.onWinDragDown}>
          <div><h2 className="modal-title">입·출금 입력</h2></div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <wf.WinTools />
            <ViewPresetMenu views={ec.views} activeCode={ec.activeView} enabled={true} onApply={ec.applyView} onSaveNew={() => setESaveOpen(true)} onOverwrite={(c) => setEOwCode(c)} onRename={ec.renameView} onDelete={ec.deleteView} />
            <button type="button" className={`btn-ghost btn-sm ${ecfg ? "is-on-cfg" : ""}`} onClick={() => { if (ecfg) setEDonePrompt(true); else if (lines.some(lineActive)) setErr("전표에 입력된 값이 있어 화면 설정을 열 수 없습니다. 저장 후 신규 입력화면에서 가능합니다."); else { esnap.current = ec.snapshot(); setEcfg(true); } }}>{ecfg ? "설정 완료" : "화면 설정"}</button>
            <button type="button" className="modal-close" onClick={requestClose}>{I.close}</button>
          </div>
        </header>
        <div ref={topRef} style={{ padding: "16px 26px 0", display: "flex", flexDirection: "column", gap: 12 }}>
          <div className={`entry-grid ${ecfg ? "is-cfg" : ""}`}>
            <div className="fld" style={{ order: orderOf("date") }} {...fldDrag("date")}><span className={`fld-label ${ecfg ? "is-cfg-click" : ""}`} onClick={(e) => { if (!ecfg) return; const r = e.currentTarget.getBoundingClientRect(); setHdrPop({ field: { key: "__date", label: dateLabel, dflt: dateDflt, locked: true }, x: r.right + 8, y: r.top }); }}>{dateLabel}</span>
              <input type="date" data-hdr="date" className="fld-input" style={{ width: 180 }} value={date} max="9999-12-31" onChange={(e) => setDate(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); focusField("date"); } }} /></div>
            {hdrFields.map(f => (
              <div className="fld" key={f.key} style={{ order: orderOf(f.key) }} {...fldDrag(f.key)}>
                <span className={`fld-label ${ecfg ? "is-cfg-click" : ""}`} onClick={(e) => { if (!ecfg) return; const r = e.currentTarget.getBoundingClientRect(); setHdrPop({ field: f, x: r.right + 8, y: r.top }); }}>{f.label}</span>
                <input type="text" data-hdr={f.key} className="fld-input" value={hdrVals[f.key] != null && hdrVals[f.key] !== "" ? hdrVals[f.key] : (f.dflt || "")} onChange={(e) => setHdrVals(v => ({ ...v, [f.key]: e.target.value }))} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); focusField(f.key); } }} />
              </div>
            ))}
            {ecfg ? <button type="button" className="hdr-add" style={{ order: 99, alignSelf: "end", height: 40 }} onClick={() => setHdrAddOpen(true)}>{I.plus} 상단 항목 추가</button> : null}
          </div>
          {ecfg ? (
            <div className="enter-cfg">
              <span className="enter-cfg-lbl">⏎ 상단 항목 순서</span>
              <div className="enter-chips">
                {gridKeys.map((k, idx) => {
                  const label = k === "date" ? dateLabel : ((hdrFields.find(f => f.key === k) || {}).label || k);
                  return (
                  <span key={k} className="enter-chip" draggable
                    onDragStart={() => { gridDrag.current = k; }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); moveGrid(gridDrag.current, k); gridDrag.current = null; }}
                    title="드래그하여 순서 변경"><span className="enter-num">{idx + 1}</span>{label}</span>
                  );
                })}
              </div>
              <span className="enter-cfg-hint">상단 입력칸을 엔터로 넘어가는 순서입니다.</span>
            </div>
          ) : null}
          {ecfg ? (
            <div className="enter-cfg">
              <span className="enter-cfg-lbl">⏎ 열 엔터 순서</span>
              <div className="enter-chips">
                {displayCols.map((c, idx) => (
                  <span key={c.key} className="enter-chip" draggable
                    onDragStart={() => { edrag.current = c.key; }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); if (edrag.current) ec.moveCol(edrag.current, c.key); edrag.current = null; }}
                    title="드래그하여 순서 변경"><span className="enter-num">{idx + 1}</span>{c.label}</span>
                ))}
              </div>
              <span className="enter-cfg-hint">열 순서와 엔터 이동 순서가 함께 변경됩니다.</span>
            </div>
          ) : null}
        </div>
        <div style={{ padding: "14px 26px 4px" }}>
          <div className="entry-main">
          <div ref={gridRef} style={{ flex: 1, minWidth: 0 }}>
          <div className="vch-wrap" style={{ position: "relative" }}>
          <div className="vch">
            <div className="vch-grid vch-head" style={{ gridTemplateColumns: tmpl }}>
              <div className="vc c">No</div>
              {displayCols.map(c => (
                <div key={c.key} className={`vc th-drag ${(c.key === "debit" || c.key === "credit") ? "r" : ""} ${ecfg && c.hidden ? "is-colhidden" : ""}`}
                  draggable={!!ecfg}
                  onClick={ecfg ? (e) => { const b = e.currentTarget.getBoundingClientRect(); const wrap = e.currentTarget.closest(".vch-wrap").getBoundingClientRect(); setEcolPop({ key: c.key, x: b.left - wrap.left + b.width / 2, y: b.bottom - wrap.top + 4 }); } : undefined}
                  onDragStart={() => { edrag.current = c.key; }}
                  onDragOver={(e) => { if (ecfg) e.preventDefault(); }}
                  onDrop={(e) => { if (!ecfg) return; e.preventDefault(); if (edrag.current) ec.moveCol(edrag.current, c.key); edrag.current = null; }}
                  title={ecfg ? "눌러서 추가·이름수정·숨김 · 드래그로 위치 변경 · 우측 경계 드래그로 너비 조절" : undefined}>
                  {c.label}
                  {ecfg ? <span className="th-resize" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); const cell = e.currentTarget.parentElement; erz.current = { key: c.key, x: e.clientX, w: cell.getBoundingClientRect().width }; document.body.style.cursor = "col-resize"; }} onClick={(e) => e.stopPropagation()} draggable={false} /> : null}
                </div>
              ))}
            </div>
            {lines.map((l, i) => (
              <div key={i} className="vch-grid vch-row" style={{ gridTemplateColumns: tmpl }} onFocusCapture={() => setActiveRow(i)}>
                <div className="vc c vc-no">{i + 1}</div>
                {displayCols.map(c => {
                  const hidCls = ecfg && c.hidden ? " is-colhidden" : "";
                  if (c.key === "gubun") return (
                <div key="gubun" className={"vc vc-in" + hidCls} style={{ position: "relative" }}>
                  <input data-cell={`${i}-gubun`} value={l.gubun} placeholder=""
                    onFocus={() => setGbPop({ row: i, hi: Math.max(0, GUBUNS.indexOf(l.gubun)) })}
                    onBlur={() => setTimeout(() => setGbPop(p => p && p.row === i ? null : p), 120)}
                    onChange={(e) => { upd(i, "gubun", e.target.value); setGbPop({ row: i, hi: 0 }); }}
                    onKeyDown={(e) => {
                      const list = gbList(l.gubun);
                      if (gbPop && gbPop.row === i && list.length) {
                        if (e.key === "ArrowDown") { e.preventDefault(); setGbPop(p => ({ ...p, hi: Math.min(p.hi + 1, list.length - 1) })); return; }
                        if (e.key === "ArrowUp") { e.preventDefault(); setGbPop(p => ({ ...p, hi: Math.max(p.hi - 1, 0) })); return; }
                        if (e.key === "Enter") { e.preventDefault(); setGubun(i, list[gbPop.hi] || list[0]); setGbPop(null); setTimeout(() => focusNext(i, "gubun"), 30); return; }
                      }
                      if (e.key === "Enter") { e.preventDefault(); focusNext(i, "gubun"); }
                    }} />
                  {gbPop && gbPop.row === i ? (() => { const list = gbList(l.gubun); return list.length ? (
                    <div className="vc-pop">{list.map((g, k) => (
                      <button key={g} type="button" className={`vc-pop-item ${k === gbPop.hi ? "is-hi" : ""} ${g === l.gubun ? "is-cur" : ""}`} onMouseDown={(e) => { e.preventDefault(); setGubun(i, g); setGbPop(null); setTimeout(() => focusNext(i, "gubun"), 30); }}>{g}</button>
                    ))}</div>
                  ) : null; })() : null}
                </div>);
                  if (c.key === "acct") { const isJournal = l.gubun === "차변" || l.gubun === "대변"; return (
                <div key="acct" className={"vc vc-in" + hidCls} style={{ position: "relative" }}>
                  <input data-cell={`${i}-acct`} value={dv(c, l, "acct")} placeholder={isJournal ? (l.gubun + "계정") : ""}
                    onChange={(e) => upd(i, "acct", e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const t = l.acct.trim();
                        const src = isJournal ? ACCOUNT_MASTER : ACCT_MASTER;
                        const exact = src.find(a => a.name === t);
                        if (!exact && t) { e.preventDefault(); setPicker({ row: i, q: t, kind: isJournal ? "jracct" : "acct" }); return; }
                      }
                      onCellKey(e, i, "acct");
                    }} />
                  <button type="button" className="srch-btn" tabIndex={-1} onClick={() => setPicker({ row: i, q: l.acct, kind: isJournal ? "jracct" : "acct" })}>{I.search}</button>
                </div>); }
                  if (c.key === "account") return (
                <div key="account" className={"vc vc-in" + hidCls}>
                  <input data-cell={`${i}-account`} value={dv(c, l, "account")}
                    onChange={(e) => upd(i, "account", e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const t = l.account.trim();
                        const exact = ACCOUNT_MASTER.find(a => a.name === t);
                        if (!exact && t) { e.preventDefault(); setPicker({ row: i, q: t, kind: "account" }); return; }
                      }
                      onCellKey(e, i, "account");
                    }} />
                  <button type="button" className="srch-btn" tabIndex={-1} onClick={() => setPicker({ row: i, q: l.account, kind: "account" })}>{I.search}</button>
                </div>);
                  if (c.key === "partner") return (
                <div key="partner" className={"vc vc-in" + hidCls + (invalid.has(`${i}-partner`) ? " vc-bad" : "")} style={{ display: "flex", alignItems: "center" }}>
                  {(() => { const pc = PARTNER_MASTER.find(p => p.name === l.partner.trim()); return pc ? <span className="srch-code" title="거래처 코드">{pc.code}</span> : null; })()}
                  <input data-cell={`${i}-partner`} value={dv(c, l, "partner")}
                    onChange={(e) => upd(i, "partner", e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const t = l.partner.trim();
                        const exact = PARTNER_MASTER.find(p => p.name === t);
                        if (!exact && t) { e.preventDefault(); setPicker({ row: i, q: t, kind: "partner" }); return; }
                      }
                      onCellKey(e, i, "partner");
                    }} />
                  <button type="button" className="srch-btn" tabIndex={-1} onClick={() => setPicker({ row: i, q: l.partner, kind: "partner" })}>{I.search}</button>
                </div>);
                  if (c.key === "jrpartner") { const isJournal = l.gubun === "차변" || l.gubun === "대변"; return (
                <div key="jrpartner" className={"vc vc-in" + hidCls + (isJournal ? "" : " vc-blocked")} style={{ display: "flex", alignItems: "center" }}>
                  {(() => { const pc = PARTNER_MASTER.find(p => p.name === (l.jrpartner || "").trim()); return pc ? <span className="srch-code" title="거래처 코드">{pc.code}</span> : null; })()}
                  <input data-cell={`${i}-jrpartner`} value={isJournal ? dv(c, l, "jrpartner") : ""} disabled={!isJournal} placeholder={isJournal ? (l.gubun + " 거래처") : ""}
                    onChange={(e) => upd(i, "jrpartner", e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const t = (l.jrpartner || "").trim();
                        const exact = PARTNER_MASTER.find(p => p.name === t);
                        if (!exact && t) { e.preventDefault(); setPicker({ row: i, q: t, kind: "jrpartner" }); return; }
                      }
                      onCellKey(e, i, "jrpartner");
                    }} />
                  <button type="button" className="srch-btn" tabIndex={-1} disabled={!isJournal} onClick={() => setPicker({ row: i, q: l.jrpartner || "", kind: "jrpartner" })}>{I.search}</button>
                </div>); }
                  if (c.key === "memo") return (
                <div key="memo" className={"vc vc-in" + hidCls}><input data-cell={`${i}-memo`} value={dv(c, l, "memo")} onChange={(e) => upd(i, "memo", e.target.value)} onKeyDown={(e) => onCellKey(e, i, "memo")} /></div>);
                  if (c.key === "debit") return (
                <div key="debit" className={"vc vc-in" + hidCls + ((invalid.has(`${i}-amt`) && !(l.gubun === "지급" || l.gubun === "대변")) ? " vc-bad" : "") + ((l.gubun === "지급" || l.gubun === "대변") ? " vc-blocked" : "")}><input data-cell={`${i}-debit`} disabled={l.gubun === "지급" || l.gubun === "대변"} inputMode="numeric" className="r" placeholder="" value={l.kind === "입금" && numOf(l.amount) ? numOf(l.amount).toLocaleString("ko-KR") : ""} onChange={(e) => { const v = e.target.value.replace(/[^\d]/g, ""); setInvalid(s => { if (!s.has(`${i}-amt`)) return s; const n = new Set(s); n.delete(`${i}-amt`); return n; }); setLines(ls => ls.map((x, j) => j === i ? { ...x, kind: "입금", gubun: (x.gubun === "입금" || x.gubun === "차변") ? x.gubun : "입금", amount: v } : x)); }} onKeyDown={(e) => onCellKey(e, i, "debit")} /></div>);
                  if (c.key === "credit") return (
                <div key="credit" className={"vc vc-in" + hidCls + ((invalid.has(`${i}-amt`) && !(l.gubun === "입금" || l.gubun === "차변")) ? " vc-bad" : "") + ((l.gubun === "입금" || l.gubun === "차변") ? " vc-blocked" : "")}><input data-cell={`${i}-credit`} disabled={l.gubun === "입금" || l.gubun === "차변"} inputMode="numeric" className="r" placeholder="" value={l.kind === "출금" && numOf(l.amount) ? numOf(l.amount).toLocaleString("ko-KR") : ""} onChange={(e) => { const v = e.target.value.replace(/[^\d]/g, ""); setInvalid(s => { if (!s.has(`${i}-amt`)) return s; const n = new Set(s); n.delete(`${i}-amt`); return n; }); setLines(ls => ls.map((x, j) => j === i ? { ...x, kind: "출금", gubun: (x.gubun === "지급" || x.gubun === "대변") ? x.gubun : "지급", amount: v } : x)); }} onKeyDown={(e) => onCellKey(e, i, "credit")} /></div>);
                  return (
                <div key={c.key} className={"vc vc-in" + hidCls}><input data-cell={`${i}-${c.key}`} value={l[c.key] != null && l[c.key] !== "" ? l[c.key] : (lineActive(l) ? ((c.def && (c.def.dflt || c.def.text)) || "") : "")} onChange={(e) => upd(i, c.key, e.target.value)} onKeyDown={(e) => onCellKey(e, i, c.key)} /></div>);
                })}
              </div>
            ))}
            <div className="vch-grid vch-foot" style={{ gridTemplateColumns: tmpl }}>
              <div className="vc c" style={{ whiteSpace: "nowrap" }}>합계</div>
              {displayCols.map(c => (
                <div key={c.key} className={`vc ${(c.key === "debit" || c.key === "credit") ? "r" : ""} ${ecfg && c.hidden ? "is-colhidden" : ""}`}>
                  {c.key === "debit" && sumIn ? <b>{fmt(sumIn)}</b> : c.key === "credit" && sumOut ? <b>{fmt(sumOut)}</b> : null}
                </div>
              ))}
            </div>
          </div>
          {ecfg && ecolPop ? (() => { const pc = ec.allCols.find(c => c.key === ecolPop.key); return <ColCfgPopover col={pc} x={ecolPop.x} y={ecolPop.y} onAddNew={() => setEAddColOpen(true)} onRename={ec.renameCol} onToggle={ec.toggleCol} onRemove={ec.removeCol} onEdit={(d) => setEEditCol(d)} onClose={() => setEcolPop(null)} />; })() : null}
          </div>
          </div>
          <InfoPanelBody api={panelApi} ctx={panelCtx} cfg={ecfg} panels={panelApi.panels} baseId={(panelApi.panels[0] || {}).id}
            subFor={(pn) => (activeLine && activeLine.partner ? activeLine.partner : null)}
            onAddField={(pid) => setPanelPickFor(pid)}
            onRenamePanel={(id, name) => setPanelNameFor({ id, name })}
            onAddPanel={() => panelApi.addPanel()} />
          </div>
          {err ? <ConfirmModal open={true} title="입력 확인" message={err} confirmLabel="확인" onConfirm={() => setErr("")} onClose={() => setErr("")} /> : null}
        </div>
        <footer className="modal-foot">
          <div className="ff-left"><span className="entry-sub">거래처·금액이 입력된 라인만 저장됩니다</span></div>
          <div className="ff-right">
            <button type="button" className="btn-ghost" onClick={requestClose}>취소</button>
            <button type="button" className="btn-primary" onClick={submit}>{initial ? "수정저장" : "저장"} <kbd className="btn-kbd">F8</kbd></button>
          </div>
        </footer>
        {picker ? (picker.kind === "acct" ? (
          <PickerOverlay
            title="계좌 검색"
            items={ACCT_MASTER}
            fields={["name", "code", "bank"]}
            columns={[
              { key: "code", label: "코드", width: "90px", mono: true },
              { key: "name", label: "계좌명", strong: true },
              { key: "bank", label: "은행", width: "110px" },
            ]}
            initialQuery={picker.q}
            onPick={(it) => { upd(picker.row, "acct", it.name); const r = picker.row; setPicker(null); setTimeout(() => focusNext(r, "acct"), 30); }}
            onClose={() => { const r = picker.row; setPicker(null); setTimeout(() => focusCell(r, "acct"), 30); }} />
        ) : picker.kind === "jracct" ? (
          <PickerOverlay
            title="계정과목 코드도움"
            items={ACCOUNT_MASTER}
            fields={["name", "code"]}
            columns={[{ key: "code", label: "코드", width: "90px", mono: true }, { key: "name", label: "계정과목명", strong: true }]}
            initialQuery={picker.q}
            onPick={(it) => { upd(picker.row, "acct", it.name); const r = picker.row; setPicker(null); setTimeout(() => focusNext(r, "acct"), 30); }}
            onClose={() => { const r = picker.row; setPicker(null); setTimeout(() => focusCell(r, "acct"), 30); }} />
        ) : picker.kind === "jrpartner" ? (
          <PickerOverlay
            title="거래처 검색"
            items={PARTNER_MASTER}
            fields={["name", "code", "ceo", "region", "bank"]}
            columns={[
              { key: "code", label: "코드", width: "80px", mono: true },
              { key: "name", label: "거래처명", strong: true },
              { key: "ceo", label: "대표", width: "80px" },
              { key: "region", label: "지역", width: "90px" },
              { key: "bank", label: "은행계좌", width: "minmax(150px,1.2fr)", mono: true },
            ]}
            initialQuery={picker.q}
            onPick={(it) => { upd(picker.row, "jrpartner", it.name); const r = picker.row; setPicker(null); setTimeout(() => focusNext(r, "jrpartner"), 30); }}
            onClose={() => { const r = picker.row; setPicker(null); setTimeout(() => focusCell(r, "jrpartner"), 30); }} />
        ) : picker.kind === "account" ? (
          <PickerOverlay
            title="계정과목 검색"
            items={ACCOUNT_MASTER}
            fields={["name", "code"]}
            columns={[
              { key: "code", label: "코드", width: "90px", mono: true },
              { key: "name", label: "계정과목명", strong: true },
            ]}
            initialQuery={picker.q}
            onPick={(it) => { upd(picker.row, "account", it.name); const r = picker.row; setPicker(null); setTimeout(() => focusNext(r, "account"), 30); }}
            onClose={() => { const r = picker.row; setPicker(null); setTimeout(() => focusCell(r, "account"), 30); }} />
        ) : (
          <PickerOverlay
            title="거래처 검색"
            items={PARTNER_MASTER}
            fields={["name", "code", "ceo", "region", "bank"]}
            columns={[
              { key: "code", label: "코드", width: "90px", mono: true },
              { key: "name", label: "거래처명", width: "minmax(120px,1.4fr)", strong: true },
              { key: "ceo", label: "대표자", width: "90px" },
              { key: "phone", label: "전화번호", width: "130px", mono: true },
              { key: "region", label: "지역", width: "90px" },
              { key: "bank", label: "은행계좌", width: "minmax(150px,1.2fr)", mono: true },
            ]}
            initialQuery={picker.q}
            onPick={(it) => { upd(picker.row, "partner", it.name); const r = picker.row; setPicker(null); setTimeout(() => focusNext(r, "partner"), 30); }}
            onNew={() => { window.location.href = "거래처등록.html"; }}
            onClose={() => { const r = picker.row; setPicker(null); setTimeout(() => focusCell(r, "partner"), 30); }} />
        )) : null}
        <FlatAddColModal open={eAddColOpen} baseColumns={CASH_ENTRY_COLS} onAdd={(c) => { ec.addCustom(c); setEAddColOpen(false); }} onClose={() => setEAddColOpen(false)} />
        {hdrAddOpen ? (
          <AddColModal nextCode={"상단 " + String.fromCharCode(65 + hdrFields.length)} onAdd={(c) => { setHdrFields(prev => [...prev, { key: "h" + Date.now().toString(36), label: c.label }]); setHdrAddOpen(false); }} onClose={() => setHdrAddOpen(false)} />
        ) : null}
        {hdrPop ? (
          <>
            <div className="colpop-scrim" onClick={() => setHdrPop(null)} />
            <div className="colpop" style={{ left: hdrPop.x, top: hdrPop.y }}>
              <div className="colpop-head"><span className="colpop-sw" />{hdrPop.field.label}</div>
              <button type="button" className="colpop-item" onClick={() => { setHdrPop(null); setHdrAddOpen(true); }}>새 항목 추가</button>
              <button type="button" className="colpop-item" onClick={() => { setHdrEdit({ ...hdrPop.field, type: "dflt" }); setHdrPop(null); }}>설정</button>
              {!hdrPop.field.locked ? <button type="button" className="colpop-item colpop-danger" onClick={() => { setHdrFields(prev => prev.filter(x => x.key !== hdrPop.field.key)); setHdrPop(null); }}>항목 삭제</button> : null}
            </div>
          </>
        ) : null}
        <FlatAddColModal open={!!hdrEdit} initial={hdrEdit} baseColumns={[]} onAdd={(c) => { if (hdrEdit.key === "__date") { setDateLabel(c.label || "거래일자"); setDateDflt(c.dflt || ""); } else setHdrFields(prev => prev.map(x => x.key === hdrEdit.key ? { ...x, label: c.label, dflt: c.dflt || "" } : x)); setHdrEdit(null); }} onClose={() => setHdrEdit(null)} />
        {panelPickFor ? <PanelFieldPicker open={!!panelPickFor} selected={(panelApi.panels.find(p => p.id === panelPickFor) || {}).fields || []} onToggle={(k) => panelApi.toggleField(panelPickFor, k)} onClose={() => setPanelPickFor(null)} /> : null}
        <PanelSettingsModal open={!!panelNameFor} initialName={(panelNameFor && panelNameFor.name) || ""} initialFields={(panelNameFor && (panelApi.panels.find(p => p.id === panelNameFor.id) || {}).fields) || []} onSave={(n, fields) => { panelApi.renamePanel(panelNameFor.id, n); panelApi.setPanelFields(panelNameFor.id, fields); setPanelNameFor(null); }} onClose={() => setPanelNameFor(null)} />
        <FlatAddColModal open={!!eEditCol} initial={eEditCol} baseColumns={CASH_ENTRY_COLS} onAdd={(c) => { if (eEditCol._base) { ec.renameCol(eEditCol.key, c.label); ec.setColDefault(eEditCol.key, c.dflt); } else ec.updateCustom(eEditCol.key, c); setEEditCol(null); }} onClose={() => setEEditCol(null)} />
        <SaveViewModal open={eSaveOpen} code={nextViewCode(ec.views)} onSave={(name) => { ec.saveView(name); setESaveOpen(false); setEDonePrompt(false); setEcfg(false); }} onClose={() => setESaveOpen(false)} />
        <ConfirmModal open={!!eOwCode} title="화면 덮어쓰기"
          message={(() => { const v = ec.views.find(x => x.code === eOwCode); return v ? `${v.code} "${v.name}" 화면을 지금 화면 구성으로 덮어쓸까요?` : ""; })()}
          confirmLabel="덮어쓰기" onConfirm={() => { ec.overwriteView(eOwCode); setEOwCode(null); }} onClose={() => setEOwCode(null)} />
        {eDonePrompt ? (() => { const av = ec.views.find(v => v.code === ec.activeView); return (
          <div className="modal-root" role="dialog" aria-modal="true" style={{ zIndex: 96 }}>
            <div className="modal-scrim" onClick={() => setEDonePrompt(false)} />
            <div className="modal modal-confirm">
              <div className="confirm-body">
                <h2 className="confirm-title">화면 설정 저장</h2>
                <p className="confirm-msg">{av ? <React.Fragment>현재 적용된 양식: <b>{av.code} "{av.name}"</b><br/></React.Fragment> : <React.Fragment>현재 적용된 저장 양식이 없습니다.<br/></React.Fragment>}변경한 화면 설정을 어떻게 저장할까요?</p>
              </div>
              <footer className="modal-foot">
                <div className="ff-left" />
                <div className="ff-right">
                  <button type="button" className="btn-ghost" onClick={() => { setEDonePrompt(false); ec.cancelCfg(); setEcfg(false); }}>취소</button>
                  <button type="button" className="btn-ghost" onClick={() => { setEDonePrompt(false); setEcfg(false); if (av) ec.overwriteView(av.code); }}>현재 양식에 적용</button>
                  <button type="button" className="btn-primary" onClick={() => { setEDonePrompt(false); setESaveOpen(true); }}>신규 저장</button>
                </div>
              </footer>
            </div>
          </div>
        ); })() : null}
      </div>
    </div>
  );
}

function SmsModal({ open, initial, onSave, onClose }) {
  const [text, setText] = useState("");
  const [preview, setPreview] = useState(null);
  useEffect(() => { if (open) { const t = initial || ""; setText(t); setPreview(t ? parseSms(t) : null); } }, [open]);
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } };
    window.addEventListener("keydown", h, true);
    return () => window.removeEventListener("keydown", h, true);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-root">
      <div className="modal-scrim" onClick={onClose} />
      <div className="modal" style={{ width: "min(560px, 94vw)" }}>
        <header className="modal-head">
          <div><h2 className="modal-title">입출금 문자 붙여넣기</h2><div className="modal-sub">은행 입출금 문자를 붙여넣으면 자동으로 내역을 만듭니다 (한 줄당 한 건)</div></div>
          <button type="button" className="modal-close" onClick={onClose}>{I.close}</button>
        </header>
        <div style={{ padding: "16px 26px", display: "grid", gap: 12 }}>
          <textarea className="fld-input" style={{ minHeight: 120, resize: "vertical", font: "inherit" }} placeholder={"예)\n국민 06/04 14:22 입금 1,200,000원 한양식자재 잔액 3,400,000원"} value={text} onChange={(e) => { setText(e.target.value); setPreview(null); }} />
          {preview ? (
            preview.length === 0 ? <div style={{ color: "var(--bad)", fontSize: 12.5 }}>인식된 내역이 없습니다. 입금/출금 문구와 금액이 포함돼 있는지 확인해 주세요.</div> : (
              <table className="paylist-tb">
                <thead><tr><th>일자</th><th>구분</th><th>거래처</th><th style={{ textAlign: "right" }}>금액</th></tr></thead>
                <tbody>{preview.map((p, i) => <tr key={i}><td>{p.date}</td><td>{p.kind}</td><td>{p.partner}</td><td style={{ textAlign: "right" }}>{fmt(p.amount)}원</td></tr>)}</tbody>
              </table>
            )
          ) : null}
        </div>
        <footer className="modal-foot">
          <div className="ff-left" />
          <div className="ff-right">
            <button type="button" className="btn-ghost" onClick={onClose}>취소</button>
            {preview && preview.length ? <button type="button" className="btn-primary" onClick={() => onSave(preview)}>{preview.length}건 등록</button>
              : <button type="button" className="btn-primary" onClick={() => setPreview(parseSms(text))}>미리보기</button>}
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   입출금 테이블 — 매입 조회 화면 스타일
   ───────────────────────────────────────────── */
const CASH_COLUMNS = [
  { key: "id",      label: "전표번호", width: "120px" },
  { key: "date",    label: "일자",    width: "104px" },
  { key: "kind",    label: "구분",    width: "76px" },
  { key: "partner", label: "거래처",   width: "minmax(120px,1.3fr)" },
  { key: "amount",  label: "금액",    width: "120px" },
  { key: "memo",    label: "메모",    width: "minmax(110px,1fr)" },
  { key: "journal", label: "분개",    width: "72px" },
  { key: "source",  label: "출처",    width: "92px" },
];
const cashMinPx = (w) => { const m = /minmax\((\d+)px/.exec(String(w)); if (m) return Number(m[1]); const p = /^(\d+(?:\.\d+)?)px$/.exec(String(w).trim()); return p ? Number(p[1]) : 110; };

function CashTable({ rows, cfg, onDelete, onOpen, cc, checked, setChecked }) {
  const RBASE = CASH_COLUMNS.map(c => ({ key: c.key, label: c.label, width: c.width, locked: c.key === "id" }));
  const [colPop, setColPop] = useState(null);
  const [addColOpen, setAddColOpen] = useState(false);
  const [editCol, setEditCol] = useState(null);
  const [expanded, setExpanded] = useState(() => new Set());
  const toggleJournal = (id) => setExpanded(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const journalOf = cashJournal;
  const rdrag = useRef(null);
  useEffect(() => { if (!cfg) { setColPop(null); setAddColOpen(false); setEditCol(null); } }, [cfg]);
  const rz = useRef(null);
  useEffect(() => {
    const move = (e) => { if (!rz.current) return; const { key, x, w } = rz.current; cc.setWidth(key, Math.max(70, w + (e.clientX - x))); };
    const up = () => { rz.current = null; document.body.style.cursor = ""; };
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, []);
  const displayCols = cfg ? cc.allCols : cc.visibleCols;
  const tmpl = "40px " + displayCols.map(c => c.width).join(" ") + " 46px";
  const rowMinPx = 40 + 46 + displayCols.reduce((a, c) => a + cashMinPx(c.width), 0) + (displayCols.length + 1) * 12;
  const allOn = rows.length > 0 && checked.size === rows.length;
  const inSum = rows.filter(r => r.kind === "입금").reduce((s, r) => s + r.amount, 0);
  const outSum = rows.filter(r => r.kind === "출금").reduce((s, r) => s + r.amount, 0);

  const cellVal = (c, r) => {
    if (c.isCustom) return <span className="tc-val">{(r[c.key] != null && r[c.key] !== "" ? r[c.key] : calcFlatCol(c.def, r, RBASE)) || "—"}</span>;
    switch (c.key) {
      case "id": return <span className="ln-text is-mono">{r.id}{isRecent(r) ? <span className="new-flag" style={{ marginLeft: 6 }} title="오늘 작성·수정한 전표">최근작성</span> : null}</span>;
      case "date": return <span className="tc-val is-mono">{r.date}</span>;
      case "kind": return <span className={`status-chip ${r.kind === "입금" ? "s-완료" : r.kind === "출금" ? "s-미수금" : "s-대체"}`}>{r.kind}</span>;
      case "partner": return <span className="ln-text">{r.partner}</span>;
      case "amount": return <span className="tc-val is-mono" style={{ color: r.kind === "출금" ? "var(--bad)" : r.kind === "대체" ? "var(--ink)" : "oklch(0.42 0.12 150)", fontWeight: 600 }}>{r.kind === "출금" ? "−" : r.kind === "대체" ? "" : "+"}{fmt(r.amount)}</span>;
      case "memo": return <span className="tc-val">{r.memo || "—"}</span>;
      case "journal": return <button type="button" className={`jr-btn ${expanded.has(r.id) ? "is-open" : ""}`} title={expanded.has(r.id) ? "분개 닫기" : "분개 보기"} onClick={() => toggleJournal(r.id)}>{expanded.has(r.id) ? "▴" : "▾"}</button>;
      case "source": return <span className={`status-chip ${r.source === "문자" ? "s-주문" : ""}`} style={r.source === "문자" ? undefined : { background: "var(--bg-2)", color: "var(--ink-3)" }}>{r.source === "문자" ? "문자" : "직접 입력"}</span>;
      default: return <span className="tc-val">{r[c.key] || "—"}</span>;
    }
  };

  return (
    <div className="table-card" style={{ "--cols-template": tmpl, "--row-min": rowMinPx + "px", position: "relative" }}>
      <div className="t-scroll">
      <div className="t-row t-head">
        <div className="tc-check"><button type="button" className={`cbx ${allOn ? "is-on" : ""}`} aria-label="전체 선택" onClick={() => { if (allOn) setChecked(new Set()); else setChecked(new Set(rows.map(r => r.id))); }}>{allOn ? I.check : null}</button></div>
        {displayCols.map((c, i) => (
          <div key={c.key} className={`tc th-drag ${c.key === "amount" ? "ck-price" : ""} ${cfg && c.hidden ? "is-colhidden" : ""}`}
            draggable={!!cfg}
            onClick={cfg ? (e) => { const b = e.currentTarget.getBoundingClientRect(); const card = e.currentTarget.closest(".table-card").getBoundingClientRect(); setColPop({ key: c.key, x: b.left - card.left + b.width / 2, y: b.bottom - card.top + 4 }); } : undefined}
            onDragStart={() => { rdrag.current = c.key; }}
            onDragOver={(e) => { if (cfg) e.preventDefault(); }}
            onDrop={(e) => { if (!cfg) return; e.preventDefault(); if (rdrag.current) cc.moveCol(rdrag.current, c.key); rdrag.current = null; }}
            title={cfg ? "눌러서 추가·이름수정·숨김 · 드래그로 위치 변경 · 우측 경계 드래그로 너비 조절" : ""}>
            {c.label}
            <span className="th-resize" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); const cell = e.currentTarget.parentElement; rz.current = { key: c.key, x: e.clientX, w: cell.getBoundingClientRect().width }; document.body.style.cursor = "col-resize"; }} onClick={(e) => e.stopPropagation()} draggable={false} />
          </div>
        ))}
        <div className="tc"></div>
      </div>
      {rows.length === 0 ? (
        <div className="t-empty">표시할 입출금 내역이 없습니다.</div>
      ) : rows.map((r, ri) => (
        <React.Fragment key={r.id + "-" + ri}>
        <div className={`t-row t-click ${checked.has(r.id) ? "is-checked" : ""} ${isRecent(r) ? "row-new" : ""}`} onClick={(e) => { if (e.target.closest("button")) return; if (onOpen) onOpen(r); }} title="누르면 입력화면에서 수정">
          <div className="tc-check"><button type="button" className={`cbx ${checked.has(r.id) ? "is-on" : ""} ${isRecent(r) ? "cbx-new" : ""}`} aria-label="선택" onClick={() => setChecked(prev => { const n = new Set(prev); if (n.has(r.id)) n.delete(r.id); else n.add(r.id); return n; })}>{checked.has(r.id) ? I.check : null}</button></div>
          {displayCols.map(c => (
            <div key={c.key} className={`tc ${c.key === "amount" ? "ck-price" : ""} ${cfg && c.hidden ? "is-colhidden" : ""}`}>{cellVal(c, r)}</div>
          ))}
          <div className="tc">{r.manual ? <button type="button" className="row-print" title="삭제" onClick={() => onDelete(r)}>{I.trash}</button> : null}</div>
        </div>
        {expanded.has(r.id) ? (
          <div className="jr-panel">
            <div className="jr-title">분개내역 · {r.id}</div>
            <div className="jr-grid jr-head"><div>구분</div><div>계정과목 / 계좌</div><div className="r">차변</div><div className="r">대변</div></div>
            {journalOf(r).map((j, k) => (
              <div key={k} className="jr-grid"><div><span className={`jr-side ${j.side === "차변" ? "is-dr" : "is-cr"}`}>{j.side}</span></div><div>{j.name}</div><div className="r is-mono">{j.side === "차변" ? fmt(j.amt) : ""}</div><div className="r is-mono">{j.side === "대변" ? fmt(j.amt) : ""}</div></div>
            ))}
          </div>
        ) : null}
        </React.Fragment>
      ))}
      <div className="t-row t-foot">
        <div className="tc-check"></div>
        {displayCols.map((c, i) => (
          <div key={c.key} className={`tc ${c.key === "amount" ? "ck-price" : ""} ${cfg && c.hidden ? "is-colhidden" : ""}`}>
            {i === 0 ? <span className="foot-label">합계 ({rows.length}건)</span>
            : c.key === "amount" ? <span className="tc-val is-mono total-val">＋{fmt(inSum)} / −{fmt(outSum)}</span>
            : null}
          </div>
        ))}
        <div className="tc"></div>
      </div>
      </div>
      {cfg && colPop ? (() => { const pc = cc.allCols.find(c => c.key === colPop.key); return <ColCfgPopover col={pc} x={colPop.x} y={colPop.y} onAddNew={() => setAddColOpen(true)} onRename={cc.renameCol} onToggle={cc.toggleCol} onRemove={cc.removeCol} onEdit={(d) => setEditCol(d)} onClose={() => setColPop(null)} />; })() : null}
      <FlatAddColModal open={addColOpen} baseColumns={RBASE} onAdd={(c) => { cc.addCustom(c); setAddColOpen(false); }} onClose={() => setAddColOpen(false)} />
      <FlatAddColModal open={!!editCol} initial={editCol} baseColumns={RBASE} onAdd={(c) => { if (editCol._base) { cc.renameCol(editCol.key, c.label); cc.setColDefault(editCol.key, c.dflt); } else cc.updateCustom(editCol.key, c); setEditCol(null); }} onClose={() => setEditCol(null)} />
    </div>
  );
}

/* 상세 — 장부형(잔액 누적) */
function CashDetail({ rows, onOpen }) {
  const asc = rows.slice().sort((a, b) => a.date > b.date ? 1 : a.date < b.date ? -1 : 0);
  let bal = 0;
  const [collapsed, setCollapsed] = useState(() => new Set());
  const toggle = (id) => setCollapsed(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const journalOf = cashJournal;
  const tmpl = "110px 110px 64px minmax(140px,1fr) minmax(120px,0.9fr) minmax(120px,1fr) 120px 120px 130px";
  const rowMin = 110 + 110 + 64 + 140 + 120 + 120 + 120 + 120 + 130 + 9 * 12;
  return (
    <div className="table-card" style={{ "--cols-template": tmpl, "--row-min": rowMin + "px" }}>
      <div className="t-scroll">
      <div className="t-row t-head">
        <div className="tc">일자</div><div className="tc">전표번호</div><div className="tc">구분</div><div className="tc">계정과목 / 계좌</div><div className="tc">거래처</div><div className="tc">적요</div><div className="tc ck-price">차변</div><div className="tc ck-price">대변</div><div className="tc ck-price">잔액</div>
      </div>
      {asc.length === 0 ? <div className="t-empty">표시할 내역이 없습니다.</div> : asc.map(r => {
        const inA = r.inAmt != null ? r.inAmt : (r.kind === "입금" ? r.amount : 0);
        const outA = r.outAmt != null ? r.outAmt : (r.kind === "출금" ? r.amount : 0);
        bal += inA - outA;
        const js = journalOf(r);
        return (
          <React.Fragment key={r.id}>
          {js.map((j, k) => (
            <div key={k} className="t-row t-click" onClick={() => onOpen && onOpen(r)} title="누르면 입력화면에서 수정">
              <div className="tc">{k === 0 ? <span className="tc-val is-mono">{r.date}</span> : null}</div>
              <div className="tc">{k === 0 ? <span className="tc-val is-mono">{r.id}</span> : null}</div>
              <div className="tc"><span className={`jr-side ${j.side === "차변" ? "is-dr" : "is-cr"}`}>{j.side}</span></div>
              <div className="tc"><span className="ln-text">{j.name}</span></div>
              <div className="tc">{k === 0 ? <span className="tc-val">{r.partner}</span> : null}</div>
              <div className="tc">{k === 0 ? <span className="tc-val">{r.memo || "—"}</span> : null}</div>
              <div className="tc ck-price"><span className="tc-val is-mono" style={{ color: "oklch(0.42 0.12 150)" }}>{j.side === "차변" ? fmt(j.amt) : ""}</span></div>
              <div className="tc ck-price"><span className="tc-val is-mono" style={{ color: "var(--bad)" }}>{j.side === "대변" ? fmt(j.amt) : ""}</span></div>
              <div className="tc ck-price">{k === js.length - 1 ? <span className="tc-val is-mono" style={{ fontWeight: 600, color: bal < 0 ? "var(--bad)" : "var(--ink)" }}>{fmt(bal)}</span> : null}</div>
            </div>
          ))}
          </React.Fragment>
        );
      })}
      <div className="t-row t-foot">
        <div className="tc"><span className="foot-label">합계 ({asc.length}건)</span></div><div className="tc"></div><div className="tc"></div><div className="tc"></div><div className="tc"></div><div className="tc"></div>
        <div className="tc ck-price"><span className="tc-val is-mono total-val">{fmt(asc.reduce((s, r) => s + journalOf(r).filter(j => j.side === "차변").reduce((a, j) => a + j.amt, 0), 0))}</span></div>
        <div className="tc ck-price"><span className="tc-val is-mono total-val">{fmt(asc.reduce((s, r) => s + journalOf(r).filter(j => j.side === "대변").reduce((a, j) => a + j.amt, 0), 0))}</span></div>
        <div className="tc ck-price"><span className="tc-val is-mono total-val">{fmt(bal)}</span></div>
      </div>
      </div>
    </div>
  );
}

/* 패널 — 일자별 카드 */
function CashPanel({ rows }) {
  const byDate = {};
  rows.forEach(r => { (byDate[r.date] = byDate[r.date] || []).push(r); });
  const dates = Object.keys(byDate).sort((a, b) => a < b ? 1 : -1);
  return (
    <div className="kanban">
      {dates.length === 0 ? <div className="t-empty" style={{ gridColumn: "1/-1" }}>표시할 내역이 없습니다.</div> : dates.map(d => {
        const list = byDate[d];
        const inS = list.filter(r => r.kind === "입금").reduce((s, r) => s + r.amount, 0);
        const outS = list.filter(r => r.kind === "출금").reduce((s, r) => s + r.amount, 0);
        return (
          <div key={d} className="kan-card">
            <div className="kan-h"><span className="kan-partner" style={{ fontSize: 15 }}>{d}</span><span className="kan-cnt">{list.length}건</span></div>
            {list.map(r => (
              <div key={r.id} className="kan-item" style={{ gridTemplateColumns: "1fr auto" }}>
                <span className="ln-text" style={{ fontSize: 12 }}>{r.partner}</span>
                <span className="tc-val is-mono" style={{ fontSize: 12, color: r.kind === "출금" ? "var(--bad)" : "oklch(0.42 0.12 150)" }}>{r.kind === "출금" ? "−" : "+"}{fmt(r.amount)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, fontSize: 12 }}>
              <span style={{ color: "var(--ink-3)" }}>입금 <b style={{ color: "oklch(0.42 0.12 150)" }}>{fmt(inS)}</b></span>
              <span style={{ color: "var(--ink-3)" }}>출금 <b style={{ color: "var(--bad)" }}>{fmt(outS)}</b></span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   App
   ───────────────────────────────────────────── */
function App() {
  const [records, setRecords] = useState(loadCash);
  const [filter, setFilter] = useState("전체");
  const [q, setQ] = useState("");
  const [range, setRange] = useState({ from: "", to: "" });
  const [addOpen, setAddOpen] = useState(false);
  const [editRec, setEditRec] = useState(null);
  const [smsOpen, setSmsOpen] = useState(false);
  const [smsInitial, setSmsInitial] = useState("");
  useEffect(() => { const fn = (e) => { if (e.key === "F2" && !addOpen && !smsOpen) { e.preventDefault(); setAddOpen(true); } }; window.addEventListener("keydown", fn); return () => window.removeEventListener("keydown", fn); }, [addOpen, smsOpen]);
  const [cfg, setCfg] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [donePrompt, setDonePrompt] = useState(false);
  const [owCode, setOwCode] = useState(null);
  const [viewPickOpen, setViewPickOpen] = useState(false);
  const [view, setView] = useState("조회");
  const [period, setPeriod] = useState("기본");
  const [appliedRange, setAppliedRange] = useState({ from: "", to: "" });
  const [checked, setChecked] = useState(() => new Set());
  const CASH_RBASE = CASH_COLUMNS.map(c => ({ key: c.key, label: c.label, width: c.width, locked: c.key === "id" }));
  const cc = useColConfig({ allColumns: CASH_RBASE, defaultVisible: CASH_RBASE.map(c => c.key), prefix: "nonamed.cash" });
  useEffect(() => { cc.setCfg(!!cfg); }, [cfg]);
  useHotkeys({
    F10: () => { if (cfg) setDonePrompt(true); else setCfg(true); },
  });
  const copyChecked = () => {
    const rows = records.filter(r => checked.has(r.id));
    const txt = rows.map(r => [r.id, r.date, r.kind, r.partner, r.amount, r.memo || ""].join("\t")).join("\n");
    try { navigator.clipboard.writeText(txt); } catch (e) {}
    showToast(rows.length + "건을 복사했습니다.");
  };
  const deleteChecked = () => {
    setRecords(prev => { const next = prev.filter(r => !checked.has(r.id)); persistCash(next); return next; });
    showToast(checked.size + "건을 삭제했습니다.");
    setChecked(new Set());
  };
  const addRecords = (items) => {
    setRecords(prev => {
      let cur = prev;
      items.forEach(it => { const rec = stampSaved({ ...it, id: nextCashId(cur), manual: true }); cur = [rec, ...cur]; });
      persistCash(cur);
      return cur;
    });
  };
  const updateRecord = (orig, items) => {
    setRecords(prev => {
      const first = stampSaved({ ...orig, ...items[0], id: orig.id, manual: true });
      let cur = prev.map(r => r.id === orig.id ? first : r);
      items.slice(1).forEach(it => { const rec = { ...it, id: nextCashId(cur), manual: true }; cur = [rec, ...cur]; });
      persistCash(cur);
      return cur;
    });
  };
  const removeRecord = (r) => {
    setRecords(prev => { const next = prev.filter(x => x !== r); persistCash(next); return next; });
    showToast(r.id + " 내역을 삭제했습니다.");
  };
  const drFix = (v) => { const m = /^(\d{5,})(-\d{2}-\d{2})$/.exec(v); return m ? m[1].slice(0, 4) + m[2] : v; };
  const filtered = records.filter(r => {
    if (filter !== "전체" && r.kind !== filter) return false;
    if (!inPeriod(r.date, period, appliedRange)) return false;
    if (!q.trim()) return true;
    const s = q.trim().toLowerCase();
    return [r.partner, r.memo, r.id].some(v => (v || "").toLowerCase().includes(s));
  }).slice().sort((a, b) => a.date < b.date ? 1 : -1);
  const counts = { 전체: records.length, 입금: records.filter(r => r.kind === "입금").length, 출금: records.filter(r => r.kind === "출금").length };

  return (
    <div className="layout" data-density="여유">
      <Sidebar active="collect" />
      <div className="main">
        <TopBar />
        <div className={`content ${cfg ? "is-cfg-mode" : ""}`}>
          <header className="page-head">
            <div className="page-head-l">
              <h1 className="page-title">입출금</h1>
              <button type="button" className="btn-primary title-add" onClick={() => setAddOpen(true)}>{I.plus} 입·출금 입력 <kbd className="btn-kbd">F2</kbd></button>
              {cc.views.length > 0 ? (() => { const av = cc.views.find(v => v.code === cc.activeView); return (
                <div className="active-view-wrap">
                  <button type="button" className={`active-view ${av ? "" : "is-none"}`} title="화면 선택" onClick={() => setViewPickOpen(o => !o)}>
                    <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M4 7l8-3 8 3-8 3-8-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"></path><path d="M4 12l8 3 8-3M4 17l8 3 8-3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"></path></svg>
                    {av ? <React.Fragment><span className="active-view-code">{av.code}</span><span className="active-view-name">{av.name}</span></React.Fragment> : <span className="active-view-name">화면 선택</span>}
                    <span className="active-view-caret">{I.chevron || "▾"}</span>
                  </button>
                  {viewPickOpen ? (
                    <React.Fragment>
                      <div className="cfg-scrim" onClick={() => setViewPickOpen(false)} />
                      <div className="cfg-menu active-view-menu">
                        <div className="vpm-menu-h">저장된 화면</div>
                        <div className="vpm-list">
                          {cc.views.map(v => (
                            <div key={v.code} className={`vpm-item ${v.code === cc.activeView ? "is-on" : ""}`}>
                              <button type="button" className="vpm-pick" onClick={() => { cc.applyView(v.code); setViewPickOpen(false); }}>
                                <span className="vpm-code">{v.code}</span><span className="vpm-name">{v.name}</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </React.Fragment>
                  ) : null}
                </div>
              ); })() : null}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {view === "조회" ? <React.Fragment>
              {cfg ? <ViewPresetMenu views={cc.views} activeCode={cc.activeView} enabled={cfg} onApply={cc.applyView} onSaveNew={() => setSaveOpen(true)} onOverwrite={(c) => setOwCode(c)} onRename={cc.renameView} onDelete={cc.deleteView} /> : null}
              <button type="button" className={`btn-ghost btn-sm ${cfg ? "is-on-cfg" : ""}`} onClick={() => { if (cfg) setDonePrompt(true); else setCfg(true); }}>{cfg ? "설정 완료" : "화면 설정"}</button>
              </React.Fragment> : null}
            </div>
          </header>

          <div className="view-row">
            <div className="view-tabs">
              {["조회", "상세", "패널"].map(v => (
                <button key={v} type="button" className={`view-tab ${view === v ? "is-on" : ""} ${cfg ? "is-disabled" : ""}`} disabled={cfg} onClick={() => { if (!cfg) setView(v); }}>{v}</button>
              ))}
            </div>
            <div className="hist-strip">
              <span className="hist-label">최근 전표</span>
              <div className="hist-items">
                {records.slice(0, 6).map(r => (
                  <button key={r.id} type="button" className="hist-chip" onClick={() => setEditRec(r)} title={`${r.partner || r.account} · ${fmt(r.amount)}원`}>
                    <span className="hc-date">{r.date.slice(5)}</span>
                    <span className="hc-partner">{r.partner || r.account || r.kind}</span>
                    <span className="hc-amt">{fmt(r.amount)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="period-bar">
            <div className="seg seg-sm period-seg">
              {PERIOD_OPTIONS.map(p => (
                <button key={p} type="button" className={`seg-item ${period === p ? "is-on" : ""}`} onClick={() => setPeriod(p)}>{p}</button>
              ))}
            </div>
            {period === "기본" ? (() => { const drDirty = (range.from !== appliedRange.from || range.to !== appliedRange.to); const drOk = (v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v); const drBad = !drOk(range.from) || !drOk(range.to) || (range.from && range.to && range.to < range.from); return (
              <div className="daterange">
                <input type="date" className={"dr-input" + (drDirty ? " is-dirty" : "") + (drBad ? " is-bad" : "")} value={range.from} max={range.to || "9999-12-31"} onChange={(e) => setRange(r => ({ ...r, from: drFix(e.target.value) }))} />
                <span className="dr-sep">~</span>
                <input type="date" className={"dr-input" + (drDirty ? " is-dirty" : "") + (drBad ? " is-bad" : "")} value={range.to} min={range.from || undefined} max="9999-12-31" onChange={(e) => setRange(r => ({ ...r, to: drFix(e.target.value) }))} />
                {(range.from || range.to) ? (
                  <button type="button" className="dr-clear" onClick={() => { setRange({ from: "", to: "" }); setAppliedRange({ from: "", to: "" }); }} title="기간 지정 해제">{I.close}</button>
                ) : null}
                <button type="button" className={"dr-apply" + (drDirty ? " is-dirty" : "") + (drBad ? " is-disabled" : "")} onClick={() => { if (drBad) { showToast("일자를 확인해 주세요 — 끝 일자가 시작 일자보다 빠르거나 형식이 맞지 않습니다.", "info"); return; } setAppliedRange(range); }}>{I.search} 검색</button>
              </div>
            ); })() : (
              (() => { const pr = periodRange(period); return pr ? (
                <div className="daterange dr-readonly">
                  <span className="dr-val">{pr[0]}</span>
                  <span className="dr-sep">~</span>
                  <span className="dr-val">{pr[1]}</span>
                </div>
              ) : null; })()
            )}
          </div>

          <div className="toolbar">
            <div className="list-search">
              <span className="ls-icon">{I.search}</span>
              <input type="text" placeholder="거래처·메모·전표번호 검색 · 은행 문자 붙여넣기로 내역 입력" value={q} onChange={(e) => setQ(e.target.value)} onPaste={(e) => { const text = (e.clipboardData || window.clipboardData)?.getData("text") || ""; const parsed = parseSms(text); if (parsed.length > 0) { e.preventDefault(); setSmsInitial(text); setSmsOpen(true); setQ(""); } }} />
            </div>
            <div className="seg seg-sm">
              {FILTER_TABS.map(k => (
                <button key={k} type="button" className={`seg-item ${filter === k ? "is-on" : ""}`} onClick={() => setFilter(k)}>{k} <span style={{ opacity: .55, fontSize: 11 }}>{counts[k] || 0}</span></button>
              ))}
            </div>
            <div className="tb-meta">
              {checked.size > 0 ? (
                <React.Fragment>
                  <span className="tb-selcnt">{checked.size}건 선택</span>
                  <button type="button" className="btn-ghost btn-sm" onClick={copyChecked}>복사</button>
                  <button type="button" className="btn-ghost btn-sm btn-danger" onClick={deleteChecked}>선택 삭제</button>
                </React.Fragment>
              ) : null}
            </div>
          </div>

          <div className="summary-bar">
            <div className="sm-info">
              <span className="sm-period">입출금 내역</span>
            </div>
          </div>

          {view === "조회" ? (
            <CashTable rows={filtered} cfg={cfg} onDelete={removeRecord} onOpen={(r) => setEditRec(r)} cc={cc} checked={checked} setChecked={setChecked} />
          ) : view === "상세" ? (
            <CashDetail rows={filtered} onOpen={(r) => setEditRec(r)} />
          ) : (
            <CashPanel rows={filtered} />
          )}
        </div>
      </div>

      <SaveViewModal open={saveOpen} code={nextViewCode(cc.views)} onSave={(name) => { cc.saveView(name); setSaveOpen(false); setDonePrompt(false); setCfg(false); }} onClose={() => setSaveOpen(false)} />
      <ConfirmModal open={!!owCode} title="화면 덮어쓰기"
        message={(() => { const v = cc.views.find(x => x.code === owCode); return v ? `${v.code} "${v.name}" 화면을 지금 화면 구성으로 덮어쓸까요?` : ""; })()}
        confirmLabel="덮어쓰기" onConfirm={() => { cc.overwriteView(owCode); setOwCode(null); }} onClose={() => setOwCode(null)} />
      {donePrompt ? (() => { const av = cc.views.find(v => v.code === cc.activeView); return (
        <div className="modal-root" role="dialog" aria-modal="true" style={{ zIndex: 95 }}>
          <div className="modal-scrim" onClick={() => setDonePrompt(false)} />
          <div className="modal modal-confirm">
            <div className="confirm-body">
              <h2 className="confirm-title">화면 설정 저장</h2>
              <p className="confirm-msg">{av ? <React.Fragment>현재 적용된 양식: <b>{av.code} "{av.name}"</b><br/></React.Fragment> : <React.Fragment>현재 적용된 저장 양식이 없습니다.<br/></React.Fragment>}변경한 화면 설정을 어떻게 저장할까요?</p>
            </div>
            <footer className="modal-foot">
              <div className="ff-left" />
              <div className="ff-right">
                <button type="button" className="btn-ghost" onClick={() => { setDonePrompt(false); cc.cancelCfg(); setCfg(false); }}>취소</button>
                <button type="button" className="btn-ghost" onClick={() => { setDonePrompt(false); setCfg(false); if (av) cc.overwriteView(av.code); }}>현재 양식에 적용</button>
                <button type="button" className="btn-primary" onClick={() => { setDonePrompt(false); setSaveOpen(true); }}>신규 저장</button>
              </div>
            </footer>
          </div>
        </div>
      ); })() : null}

      <CashModal open={addOpen || !!editRec} initial={editRec} onSave={(items) => { if (editRec) { updateRecord(editRec, items); setEditRec(null); showToast(editRec.id + " 전표를 수정했습니다."); } else { addRecords(items); setAddOpen(false); showToast(items.length + "건이 등록되었습니다."); } }} onClose={() => { setAddOpen(false); setEditRec(null); }} />
      <SmsModal open={smsOpen} initial={smsInitial} onSave={(items) => { addRecords(items); setSmsOpen(false); setSmsInitial(""); showToast(items.length + "건이 문자에서 등록되었습니다."); }} onClose={() => { setSmsOpen(false); setSmsInitial(""); }} />
    </div>
  );
}

const css = `
.paylist-tb{ width:100%; border-collapse:collapse; font-size:12.5px; }
.paylist-tb th{ text-align:left; font-size:11px; color:var(--ink-3); font-weight:600; padding:6px 8px; border-bottom:1px solid var(--line); }
.paylist-tb td{ padding:7px 8px; border-bottom:1px solid var(--line-soft); }
.status-chip.s-입금{ background: color-mix(in oklab, var(--good) 18%, transparent); color: oklch(0.42 0.12 150); }
.status-chip.s-출금{ background: color-mix(in oklab, var(--bad) 14%, transparent); color: var(--bad); }

.layout{ display: grid; grid-template-columns: 88px 1fr; min-height: 100vh; background: var(--bg); }
.layout[data-density="촘촘"]{ --row-pad: 11px 16px; }
.layout[data-density="여유"]{ --row-pad: 15px 18px; }

/* Sidebar */
.sidebar{
  position: sticky; top: 0; align-self: start; height: 100vh;
  background: var(--card); border-right: 1px solid var(--line);
  display: flex; flex-direction: column; align-items: center;
  padding: 22px 0 24px; gap: 14px;
}
.sb-logo{ width:44px; height:44px; display:grid; place-items:center; text-decoration:none; }
.sb-nav{ flex:1; margin-top:22px; display:flex; flex-direction:column; gap:6px; width:100%; padding:0 14px; }
.sb-item{
  appearance:none; cursor:pointer; background:transparent; border:0;
  display:flex; flex-direction:column; align-items:center; gap:4px;
  width:100%; padding:11px 6px; border-radius:14px;
  color: var(--ink-3); transition: background .15s, color .15s; position:relative;
}
.sb-item:hover{ background: var(--card-2); color: var(--ink); }
.sb-item.is-active{ background: var(--ink); color: var(--card); }
.sb-item.is-active::before{
  content:""; position:absolute; left:-14px; top:50%; transform:translateY(-50%);
  width:4px; height:22px; border-radius:0 4px 4px 0; background: var(--accent);
}
.sb-icon{ width:24px; height:24px; display:grid; place-items:center; }
.sb-icon svg{ width:22px; height:22px; }
.sb-label{ font-size:11px; font-weight:500; }

/* Top bar */
.main{ display:flex; flex-direction:column; min-width:0; }
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

/* Content */
.content{
  padding: 24px clamp(20px, 3vw, 40px) 60px;
  max-width: 1640px; width:100%;
  display:flex; flex-direction:column; gap:16px;
}
.main{ transition: background .25s; }
.is-cfg-mode .seg-item.seg-renamable{ outline: 1.5px dashed color-mix(in oklab, var(--accent) 55%, transparent); outline-offset: -2px; cursor: text; }
input.seg-item.seg-edit{ border: 1.5px solid var(--accent); background: var(--card); font: inherit; width: 72px; }
.main:has(> .content.is-cfg-mode){  background: color-mix(in oklab, var(--accent) 9%, var(--bg));
  box-shadow: inset 0 0 0 3px color-mix(in oklab, var(--accent) 32%, transparent);
}
.page-head{ display:flex; align-items:flex-end; justify-content:space-between; gap:18px; flex-wrap:wrap; }
.page-head-l{ display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
.title-add{ height: 38px; }
.page-sub-full{ flex-basis: 100%; }
.active-view{ display:inline-flex; align-items:center; gap:6px; height:30px; padding:0 10px 0 12px; border-radius:999px; background:var(--accent-soft); color:var(--accent-ink); border:1px solid color-mix(in oklab, var(--accent) 30%, transparent); cursor:pointer; appearance:none; }
.active-view:hover{ background:color-mix(in oklab, var(--accent) 18%, var(--accent-soft)); }
.active-view.is-none{ background:var(--card); color:var(--ink-3); border-style:dashed; }
.active-view-code{ font:600 11px "JetBrains Mono",monospace; }
.active-view-name{ font:600 13px "IBM Plex Sans KR",sans-serif; max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.active-view-caret{ display:grid; place-items:center; color:currentColor; opacity:.7; }
.active-view-caret svg{ width:14px; height:14px; }
.active-view-wrap{ position:relative; display:inline-block; }
.active-view-menu{ left:0; right:auto; }
.active-view-menu .vpm-pick{ width:100%; }
.active-view-clear{ width:100%; margin-top:4px; appearance:none; cursor:pointer; border:0; background:transparent; color:var(--ink-3); font:500 12px "IBM Plex Sans KR",sans-serif; padding:7px; border-radius:8px; }
.active-view-clear:hover{ background:var(--card-2); color:var(--ink); }
.page-title{ font-family:"Gowun Batang","IBM Plex Sans KR",serif; font-weight:700; font-size:30px; letter-spacing:-.02em; margin:0; }
.page-sub{ font-size:13.5px; color: var(--ink-3); margin-top:4px; }
.page-sub b{ color: var(--ink); font-weight:600; }
.page-actions{ display:flex; gap:8px; align-items:center; flex-wrap:wrap; }

/* Buttons */
.btn-primary{
  appearance:none; cursor:pointer; border:0;
  display:inline-flex; align-items:center; gap:8px;
  background: var(--ink); color: var(--card);
  font: 500 14px "IBM Plex Sans KR", sans-serif;
  padding: 0 16px; height: 40px; border-radius: 10px;
  transition: background .15s, transform .12s;
}
.btn-primary:hover{ background: #2a241c; transform: translateY(-1px); }
.btn-primary svg{ width:16px; height:16px; }
.btn-ghost{
  appearance:none; cursor:pointer;
  background: var(--card); color: var(--ink-2);
  border: 1px solid var(--line);
  font: 500 13.5px "IBM Plex Sans KR", sans-serif;
  padding: 0 14px; height: 40px; border-radius: 10px;
  display:inline-flex; align-items:center; gap:7px;
  transition: background .15s, color .15s, border-color .15s;
}
.btn-ghost:hover{ background: var(--card-2); color: var(--ink); border-color: rgba(31,26,20,.22); }
.btn-ghost svg{ width:16px; height:16px; }
.btn-sm{ height: 32px; padding: 0 10px; font-size: 12.5px; }
.detail-actionbar{ display:flex; align-items:center; gap:10px; padding:9px 12px; margin-bottom:8px; background:color-mix(in oklab, var(--accent-soft) 40%, var(--card-2)); border:1px solid color-mix(in oklab, var(--accent) 25%, transparent); border-radius:10px; }
.detail-selcnt{ font:600 12.5px "IBM Plex Sans KR",sans-serif; color:var(--accent-ink); }
.dab-div{ width:1px; height:20px; background:var(--line); }
.dab-src{ appearance:none; cursor:pointer; height:32px; padding:0 26px 0 10px; border:1px solid var(--line); border-radius:8px; background:var(--card); font:500 12.5px "IBM Plex Sans KR",sans-serif; color:var(--ink); }
.dab-batch{ width:110px; height:32px; box-sizing:border-box; text-align:right; font:600 13px "JetBrains Mono",monospace; border:1px solid var(--line); border-radius:8px; padding:0 8px; outline:none; }
.dab-batch:focus{ border-color:var(--accent); }
.btn-link{
  appearance:none; cursor:pointer; border:0; background:transparent;
  color: var(--ink); text-decoration: underline; text-underline-offset: 3px;
  font: 500 13px "IBM Plex Sans KR", sans-serif; margin-left: 8px;
}

/* KPI */
.kpis{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.kpi{
  background: var(--card); border: 1px solid var(--line);
  border-radius: 16px; padding: 18px 20px;
  display: flex; flex-direction: column; gap: 6px;
  position: relative; overflow: hidden;
}
.kpi::before{ content:""; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--ink-3); opacity: .4; }
.kpi.t-up::before{ background: var(--good); opacity: .8; }
.kpi.t-warn::before{ background: var(--warn); opacity: .8; }
.kpi.t-flat::before{ background: var(--ink-3); opacity: .5; }
.kpi-k{ font-family:"JetBrains Mono", monospace; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); }
.kpi-v{ display: flex; align-items: baseline; gap: 5px; }
.kpi-n{ font-family:"Gowun Batang", serif; font-weight: 700; font-size: 27px; letter-spacing: -.015em; color: var(--ink); font-variant-numeric: tabular-nums; }
.kpi-u{ font-size: 13px; color: var(--ink-2); font-weight: 500; }
.kpi-d{ font-size: 12.5px; color: var(--ink-2); display: inline-flex; align-items: center; gap: 6px; }
.kpi-dot{ width: 6px; height: 6px; border-radius: 50%; background: var(--ink-3); }
.kpi.t-up .kpi-dot{ background: var(--good); }
.kpi.t-warn .kpi-dot{ background: var(--warn); }

/* Primary view tabs */
.view-row{ display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
.hist-strip{ display:flex; align-items:center; gap:10px; min-width:0; flex:1; }
.hist-label{ font-size:11px; color:var(--ink-3); font-family:"JetBrains Mono",monospace; letter-spacing:.1em; text-transform:uppercase; flex:none; }
.hist-items{ display:flex; gap:6px; overflow-x:auto; padding-bottom:2px; }
.hist-chip{ appearance:none; cursor:pointer; border:1px solid var(--line); background:var(--card); border-radius:10px; padding:5px 11px; display:flex; align-items:center; gap:8px; white-space:nowrap; flex:none; transition:border-color .12s, background .12s; }
.hist-chip:hover{ border-color:rgba(31,26,20,.3); background:var(--card-2); }
.hist-chip.is-del{ opacity:.55; border-style:dashed; }
.hist-chip.is-del .hc-partner{ text-decoration:line-through; }
.hc-del{ font-size:10px; font-weight:700; color:#B4232A; background:#FBEAEA; border-radius:5px; padding:1px 5px; }
.undo-bar{ position:fixed; left:50%; bottom:18px; transform:translateX(-50%); z-index:60; display:flex; align-items:center; gap:10px; background:var(--card); border:1px solid var(--line); border-radius:12px; padding:9px 14px; box-shadow:0 8px 28px rgba(20,16,10,.18); }
.undo-txt{ font-size:12.5px; color:var(--ink); }
.paylist-tb{ width:100%; border-collapse:collapse; font-size:12.5px; }
.paylist-tb th{ text-align:left; font-size:11px; color:var(--ink-3); font-weight:600; padding:6px 8px; border-bottom:1px solid var(--line); }
.paylist-tb td{ padding:7px 8px; border-bottom:1px solid var(--line-soft); color:var(--ink); }
.paylist-src{ font-size:10.5px; color:var(--ink-3); background:var(--bg-2); border-radius:5px; padding:2px 6px; }
.paylist-src.is-manual{ color:var(--accent-ink); background:color-mix(in oklab, var(--accent) 14%, transparent); }
.hc-date{ font-family:"JetBrains Mono",monospace; font-size:11px; color:var(--ink-3); }
.hc-partner{ font-size:12.5px; font-weight:600; color:var(--ink); }
.hc-amt{ font-family:"JetBrains Mono",monospace; font-size:11.5px; color:var(--accent-ink); }
.view-tabs{
  display:inline-flex; gap: 4px;
  background: var(--card); border: 1px solid var(--line);
  border-radius: 12px; padding: 4px;
  align-self: flex-start;
}
.view-tab{
  appearance:none; cursor:pointer; border:0; background: transparent;
  font: 600 14px "IBM Plex Sans KR", sans-serif; color: var(--ink-2);
  padding: 9px 22px; border-radius: 9px; transition: background .12s, color .12s;
}
.view-tab:hover{ color: var(--ink); }
.view-tab.is-on{ background: var(--ink); color: var(--card); }
.view-tab.is-disabled{ opacity:.4; cursor:not-allowed; }

/* Period bar */
.period-search{ margin-left:auto; appearance:none; cursor:pointer; border:0; background:var(--accent); color:#fff; font:600 13px "IBM Plex Sans KR",sans-serif; padding:8px 16px; border-radius:10px; display:inline-flex; align-items:center; gap:6px; }
.period-search:hover{ background:var(--accent-ink); }
.period-search svg{ width:15px; height:15px; }
.period-bar{
  display:flex; align-items:center; gap:14px; flex-wrap: wrap;
  background: var(--card); border: 1px solid var(--line);  border-radius: 14px; padding: 10px 14px;
}
.period-seg{ flex-wrap: wrap; }

/* 기간요약 — 칸반 */
.summary{ display:flex; flex-direction:column; gap: 10px; }
.summary .t-row{ padding: 3.5px 11px; gap: 8px; font-size: 12px; min-height: 0; }
.summary .table-card{ border-radius: 10px; }
.summary .t-head{ padding: 4px 11px; }
.summary .t-row .tc{ line-height: 1.25; }
.sm-itab{ max-width: 520px; }
.summary-bar{
  display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap: wrap;
  background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 9px 14px;
  min-height: 56px; box-sizing: border-box;
}
.sm-info{ display:flex; align-items:baseline; gap: 14px; flex-wrap: wrap; }
.sm-period{ font-family:"Gowun Batang", serif; font-weight:700; font-size: 18px; color: var(--ink); }
.recv{ display:flex; flex-direction:column; gap: 14px; }
.recv-sales{ display:flex; flex-wrap:wrap; gap:4px; }
.recv-chip{ appearance:none; cursor:pointer; border:1px solid var(--line); background: var(--bg-2); color: var(--ink-2); font: 500 11px "JetBrains Mono", monospace; padding: 2px 8px; border-radius: 999px; }
.recv-chip:hover{ background: var(--accent); color:#fff; border-color: transparent; }
.sm-meta{ font-size: 13.5px; color: var(--ink-2); }
.sm-meta b{ color: var(--ink); }
.sm-sec-h{ font-family:"Gowun Batang", serif; font-weight:700; font-size: 17px; color: var(--ink); margin-top: 8px; display:flex; align-items:baseline; gap: 10px; }
.sm-sec-meta{ font-family:"IBM Plex Sans KR", sans-serif; font-weight: 400; font-size: 12.5px; color: var(--ink-3); }
.sm-line{ font-size: 13.5px; color: var(--ink-2); padding: 0 2px; }
.sm-line b{ color: var(--ink); }
.sum-subtab{ margin-left: 4px; }
.kanban{
  display:grid; grid-template-columns: repeat(auto-fill, minmax(205px, 1fr)); gap: 8px;
}
.kan-card{
  background: var(--card); border: 1px solid var(--line); border-radius: 10px;
  padding: 9px 11px 7px; display:flex; flex-direction:column; gap: 2px;
}
.kan-item{ display:grid; grid-template-columns: 1fr 40px; align-items:center; gap: 6px; padding: 3.5px 0; border-bottom: 1px solid var(--line-soft); font-size: 12px; }
.sm-sec-h{ margin-top: 4px; }

/* A4 배치 (드래그) */
.a4wrap{ display:flex; flex-direction:column; gap: 10px; }
.a4bar{ display:flex; align-items:center; justify-content:space-between; gap:12px; }
.a4orient{ display:inline-flex; gap:2px; background: var(--bg-2); border-radius: 9px; padding: 3px; }
.a4o-btn{ appearance:none; cursor:pointer; border:0; background:transparent; color: var(--ink-2); font: 500 13px "IBM Plex Sans KR", sans-serif; padding: 6px 14px; border-radius: 7px; }
.a4o-btn.is-on{ background: var(--ink); color: var(--card); }
.a4hint{ font-size: 13px; color: var(--ink-3); }
.a4scroll{ overflow:auto; }
.a4frame{ position: relative; margin: 0 auto; }
.a4page{ position: absolute; top:0; left:0; transform-origin: top left; background:#fff; box-shadow: 0 10px 30px -12px rgba(31,26,20,.25); border: 1px solid var(--line); }
.a4card{ position:absolute; background: var(--card); border:1px solid rgba(31,26,20,.35); border-radius:6px; padding: 8px 10px; cursor: grab; user-select: none; box-shadow: 0 2px 6px -2px rgba(31,26,20,.18); }
.a4card:active{ cursor: grabbing; box-shadow: 0 12px 24px -8px rgba(31,26,20,.3); }
.a4card-h{ display:flex; justify-content:space-between; align-items:baseline; border-bottom:1.2px solid var(--ink); padding-bottom:4px; margin-bottom:4px; }
.a4card-p{ font-weight:700; font-size: 13px; color: var(--ink); }
.a4card-c{ font-size: 11px; color: var(--ink-3); }
.a4card-item{ display:flex; justify-content:space-between; gap: 8px; font-size: 11.5px; padding: 2px 0; border-bottom: 1px solid var(--line-soft); }
.a4card-items-sum{ border-color: rgba(31,26,20,.45); }
.is-on-tab{ background: var(--ink); color: var(--card); border-color: var(--ink); }
.kan-h{ display:flex; align-items:center; justify-content:flex-start; gap: 8px; }
.kan-h .kan-cnt{ margin-left:auto; }
.kan-partner{ font-family:"Gowun Batang", serif; font-weight:700; font-size: 17px; color: var(--ink); }
.kan-cnt{ font-family:"JetBrains Mono", monospace; font-size: 11.5px; color: var(--ink-3); white-space:nowrap; }
.kan-total{ font-family:"JetBrains Mono", monospace; font-weight: 600; color: var(--accent-ink); font-size: 14px; }
.kan-sub{ font-size: 11.5px; color: var(--ink-3); font-family:"JetBrains Mono", monospace; padding-bottom: 8px; border-bottom: 1px dashed var(--line); margin-bottom: 4px; }
.kan-items{ display:flex; flex-direction:column; }
.kan-item{ display:grid; grid-template-columns: 1fr 44px; align-items:center; gap: 8px; padding: 5px 0; border-bottom: 1px solid var(--line-soft); font-size: 12.5px; }
.kan-item:last-child{ border-bottom: 0; }
.ki-name{ color: var(--ink); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.ki-spec{ color: var(--ink-3); font-size: 11.5px; margin-left: 6px; }
.ki-qty{ text-align: right; font-family:"JetBrains Mono", monospace; color: var(--ink-2); }
.ki-amt{ text-align: right; font-family:"JetBrains Mono", monospace; color: var(--ink); font-variant-numeric: tabular-nums; }
.daterange{ display:flex; align-items:center; gap:8px; }
.dr-input{
  appearance:none; outline:0;
  background: var(--bg-2); border: 1px solid transparent;
  border-radius: 9px; padding: 0 12px; height: 38px;
  font: 500 13px "JetBrains Mono", monospace; color: var(--ink);
  transition: border-color .15s, background .15s;
  min-width: 148px; width: 148px; flex: none;
}
.dr-input:focus{ background:#fff; border-color: var(--ink); }
.dr-sep{ color: var(--ink-3); }
.dr-readonly{ background:var(--bg-2); border:1px solid var(--line); border-radius:9px; padding:6px 12px; }
.dr-input.is-bad{ border-color: #C4442A !important; background: #FBEAE5 !important; }
.dr-apply.is-disabled{ opacity: .45; cursor: not-allowed; }
.dr-input.is-dirty{ border-color: var(--accent); background: var(--accent-soft); }
.dr-apply.is-dirty{ background: var(--accent); color: #fff; border-color: transparent; }
.dr-apply{ appearance:none; cursor:pointer; border:0; background:var(--accent); color:#fff; font:600 12.5px "IBM Plex Sans KR",sans-serif; padding:7px 14px; border-radius:9px; display:inline-flex; align-items:center; gap:5px; white-space:nowrap; flex:none; }
.dr-apply:hover{ background:var(--accent-ink); }
.dr-savedef{ appearance:none; cursor:pointer; border:1px solid var(--line); background:var(--card); color:var(--ink-2); font:500 12px "IBM Plex Sans KR",sans-serif; padding:7px 12px; border-radius:9px; }
.dr-savedef:hover{ background:var(--card-2); color:var(--ink); }
.defrange-row{ display:flex; align-items:center; gap:8px; font-size:14px; color:var(--ink); }
.dr-num{ width:56px; text-align:center; appearance:none; outline:0; background:var(--bg-2); border:1px solid transparent; border-radius:9px; height:38px; font:600 14px "JetBrains Mono",monospace; color:var(--ink); }
.dr-num:focus{ background:#fff; border-color:var(--ink); }
.defrange-sep{ color:var(--ink-3); margin:0 4px; }
.defrange-preview{ margin-top:14px; font-family:"JetBrains Mono",monospace; font-size:13px; color:var(--accent-ink); background:var(--accent-soft); border-radius:9px; padding:9px 12px; text-align:center; }
.dr-apply svg{ width:14px; height:14px; }
.dr-val{ font-family:"JetBrains Mono",monospace; font-size:13px; color:var(--ink); }
.detail-price-inp{ width:100%; box-sizing:border-box; text-align:right; font:600 13px "JetBrains Mono",monospace; color:var(--accent-ink); background:#fff; border:1px solid var(--accent); border-radius:7px; padding:5px 8px; outline:none; }
.t-row.is-editing{ background:color-mix(in oklab, var(--accent-soft) 45%, var(--card)); }
.edit-badge{ margin-left:7px; font:700 10.5px "IBM Plex Sans KR",sans-serif; color:#fff; background:var(--accent); border-radius:999px; padding:2px 8px; }
.dr-clear{
  appearance:none; cursor:pointer; border:0;
  width: 32px; height: 32px; border-radius: 8px;
  background: transparent; color: var(--ink-3);
  display:grid; place-items:center; transition: background .15s, color .15s;
}
.dr-clear:hover{ background: var(--bg-2); color: var(--ink); }
.dr-clear svg{ width: 16px; height: 16px; }

/* Monthly bar */
.t-row.is-muted{ opacity: .5; }
.m-bar-wrap{ display:block; width: 100%; height: 10px; background: var(--bg-2); border-radius: 999px; overflow: hidden; }
.m-bar{ display:block; height: 100%; background: var(--accent); border-radius: 999px; transition: width .3s; }

/* Toolbar */
.toolbar{
  display:flex; align-items:center; gap:12px; flex-wrap: wrap;
  background: var(--card); border: 1px solid var(--line);
  border-radius: 14px; padding: 10px 14px;
}
.list-search{
  flex: 1; min-width: 240px;
  display:flex; align-items:center; gap:10px;
  background: var(--bg-2); border: 1px solid transparent;
  border-radius: 10px; padding: 0 14px; height: 42px;
}
.list-search:focus-within{ background: #fff; border-color: var(--ink); }
.ls-icon{ width:18px; height:18px; color: var(--ink-3); display:grid; place-items:center; }
.ls-icon svg{ width:18px; height:18px; }
.list-search input{
  flex:1; appearance:none; border:0; outline:0; background:transparent;
  height:100%; font: 500 14px "IBM Plex Sans KR", sans-serif; color: var(--ink);
}
.list-search input::placeholder{ color: rgba(31,26,20,.32); font-weight:400; }
.tb-meta{ margin-left: auto; display:flex; align-items:center; gap:8px; font-size: 13px; color: var(--ink-2); }
.tb-meta b{ color: var(--ink); font-weight: 600; }
.tb-total{ font-family:"JetBrains Mono", monospace; color: var(--accent-ink); }
.tb-order{ color: var(--ink-3); }
.tb-selcnt{ font-size: 12.5px; color: var(--ink-2); font-weight: 600; }
.btn-ghost.btn-danger{ color: var(--bad); }
.btn-ghost.btn-danger:hover{ background: color-mix(in oklab, var(--bad) 12%, var(--card)); border-color: var(--bad); }
.row-print{ appearance:none; cursor:pointer; border:1px solid var(--line); background: var(--card); color: var(--ink-2); width: 30px; height: 28px; border-radius: 8px; display:grid; place-items:center; }
.row-print:hover{ background: var(--accent); color:#fff; border-color: transparent; }
.row-print svg{ width: 16px; height: 16px; }
.print-modal{ width: min(680px, 100%); max-height: calc(100vh - 80px); }
.print-bar{ display:flex; align-items:center; gap:14px; padding: 14px 26px 0; flex-wrap:wrap; }
.print-hint{ font-size: 12.5px; color: var(--ink-3); }
.print-preview{ padding: 16px 26px; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:8px; }
.print-frame{ width: 100%; height: 460px; border: 1px solid var(--line); border-radius: 12px; background: #fff; }
.print-more{ font-size: 12px; color: var(--ink-3); text-align:center; }

/* segmented */
.seg{ display:inline-flex; gap: 2px; background: var(--bg-2); border-radius: 10px; padding: 3px; }
.seg-sm{ padding: 2px; }
.seg-item{
  appearance:none; cursor:pointer; border:0;
  background: transparent; color: var(--ink-2);
  font: 500 13px "IBM Plex Sans KR", sans-serif;
  padding: 7px 14px; border-radius: 7px;
  transition: background .12s, color .12s;
}
.seg-sm .seg-item{ font-size: 12px; padding: 6px 12px; }
.cm-grid{ display:grid; grid-template-columns: 110px 1.3fr 130px 1fr 30px; gap: 8px; align-items:center; margin-bottom: 6px; }
.vch{ border: 1px solid var(--line); border-radius: 10px; }
.vch-grid:first-child .vc:first-child{ border-top-left-radius: 10px; }
.vch-grid:first-child .vc:last-child{ border-top-right-radius: 10px; }
.vch-grid:last-child .vc:first-child{ border-bottom-left-radius: 10px; }
.vch-grid:last-child .vc:last-child{ border-bottom-right-radius: 10px; }
.vch-head .vc, .vch-foot .vc{ overflow: hidden; }
.vch-grid{ display:grid; grid-template-columns: 34px 52px 106px 106px minmax(110px,1fr) minmax(110px,1.2fr) 100px 100px 30px; align-items: stretch; }
.vch-grid + .vch-grid{ border-top: 1px solid var(--line-soft); }
.vc{ padding: 0 8px; display:flex; align-items:center; min-height: 36px; border-right: 1px solid var(--line-soft); font-size: 13px; }
.vc:last-child{ border-right: 0; }
.vc.c{ justify-content:center; text-align:center; }
.vc.r{ justify-content:flex-end; text-align:right; font-variant-numeric: tabular-nums; }
.vch-head .vc{ background: var(--card-2); font: 600 11.5px "JetBrains Mono",monospace; letter-spacing:.05em; color: var(--ink-2); min-height: 32px; white-space:nowrap; }
.vch-foot .vc{ background: var(--card-2); font-weight: 600; border-top: 1.5px solid var(--line); min-height: 34px; white-space:nowrap; }
.vc-no{ color: var(--ink-3); font-family:"JetBrains Mono",monospace; font-size: 12px; }
.vc-kind{ font-weight: 600; font-size: 12.5px; color: var(--ink-3); white-space:nowrap; }
.vc-kind.is-in{ color: var(--good); }
.vc-kind.is-out{ color: var(--bad); }
.vc-in{ padding: 0; }
.vc-in input{ appearance:none; border:0; outline:0; background:transparent; width:100%; height:100%; min-height:36px; padding: 0 8px; font: 500 13.5px "IBM Plex Sans KR",sans-serif; color: var(--ink); }
.vc-in input.r{ text-align:right; font-variant-numeric: tabular-nums; }
.vc-in input:focus{ background: #fff; box-shadow: inset 0 0 0 1.5px var(--accent); }
.vc-in input::placeholder{ color: rgba(31,26,20,.28); font-weight: 400; }
.vc-in.vc-blocked{ background: repeating-linear-gradient(45deg, var(--bg-2), var(--bg-2) 4px, transparent 4px, transparent 9px); }
.vc-in.vc-bad{ box-shadow: inset 0 0 0 2px var(--bad); background: color-mix(in oklab, var(--bad) 8%, #fff); }
.vc-in input:disabled{ cursor: not-allowed; background: transparent; }
.vc-sel{ appearance:none; border:0; outline:0; background:transparent; width:100%; height:100%; min-height:36px; padding: 0 8px; font: 500 12.5px "IBM Plex Sans KR",sans-serif; color: var(--ink); cursor:pointer; }
.vc-sel:focus{ background:#fff; box-shadow: inset 0 0 0 1.5px var(--accent); }
.jr-btn{ appearance:none; border:1px solid var(--line); background:#fff; border-radius:6px; width:100%; height:28px; display:flex; align-items:center; justify-content:center; font:500 13px "IBM Plex Sans KR",sans-serif; color:var(--ink-2); cursor:pointer; }
.jr-btn:hover{ border-color:var(--accent); color:var(--accent); }
.jr-btn.is-open{ border-color:var(--accent); color:var(--accent); background:var(--card-2); }
.jr-panel{ background:#fff; border-top:1px solid var(--line-soft); border-bottom:1px solid var(--line-soft); padding:12px 16px 14px; min-width:var(--row-min); box-sizing:border-box; }
.jr-title{ font:600 12.5px "IBM Plex Sans KR",sans-serif; color:var(--ink-2); margin-bottom:8px; display:flex; align-items:center; gap:8px; }
.jr-title::after{ content:""; flex:1; height:1px; background:var(--line-soft); }
.jr-grid{ display:grid; grid-template-columns:80px minmax(200px,1fr) minmax(120px,18%) minmax(120px,18%); gap:0; align-items:stretch; font-size:13.5px; color:var(--ink); background:#fff; border:1px solid var(--line); border-top:0; }
.jr-grid > div{ padding:8px 14px; border-right:1px solid var(--line-soft); display:flex; align-items:center; }
.jr-grid > div:last-child{ border-right:0; }
.jr-grid .r{ justify-content:flex-end; }
.jr-grid:first-of-type{ border-top:1px solid var(--line-soft); border-top-left-radius:8px; border-top-right-radius:8px; }
.jr-grid:last-of-type{ border-bottom-left-radius:8px; border-bottom-right-radius:8px; }
.jr-grid.jr-head{ background:var(--bg-2); font-weight:700; color:var(--ink-2); font-size:12px; border-top:1px solid var(--line); }
.jr-grid .r{ text-align:right; font-variant-numeric:tabular-nums; font-weight:600; }
.jr-side{ display:inline-block; padding:2px 9px; border-radius:5px; font:700 11.5px "IBM Plex Sans KR",sans-serif; }
.jr-side.is-dr{ background:oklch(0.55 0.13 150); color:#fff; }
.jr-side.is-cr{ background:oklch(0.55 0.16 25); color:#fff; }
.status-chip.s-대체{ background:oklch(0.93 0.03 250); color:oklch(0.42 0.1 250); }
.srch-code{ flex:none; margin: 0 0 0 8px; padding:2px 8px; border-radius:999px; background: var(--accent-soft); color: var(--accent-ink); font:600 11.5px "JetBrains Mono", monospace; white-space:nowrap; }
.vc-pop{ position:absolute; top:calc(100% + 2px); left:0; min-width: 200px; z-index: 5; background: var(--card); border: 1px solid var(--line); border-radius: 10px; box-shadow: 0 14px 34px -10px rgba(31,26,20,.28); padding: 4px; display:flex; flex-direction:column; }
.vc-pop-item{ appearance:none; cursor:pointer; border:0; background:transparent; text-align:left; font: 500 12.5px "IBM Plex Sans KR",sans-serif; color: var(--ink); padding: 7px 10px; border-radius: 7px; white-space:nowrap; }
.vc-pop-item:hover, .vc-pop-item.is-hi{ background: var(--accent-soft); color: var(--accent-ink); }
.vc-pop-item.is-cur{ font-weight: 700; } .vc-pop-item.is-cur::after{ content:" ✓"; color: var(--accent); }
/* picker overlay (거래처 검색 팝업) */
.pick-root{ position: fixed; inset: 0; z-index: 90; display: grid; place-items: center; padding: 24px; }
.pick-scrim{ position: absolute; inset: 0; background: rgba(31,26,20,.5); backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px); }
.pick-box{ position: relative; width: min(540px, 100%); max-height: 70vh; background: var(--card); border: 1px solid var(--line); border-radius: 16px; box-shadow: 0 40px 80px -20px rgba(31,26,20,.4); display: flex; flex-direction: column; overflow: hidden; }
.pick-box-lg{ width: min(680px, 100%); }
.pick-head{ display:flex; align-items:center; justify-content:space-between; padding: 16px 20px 12px; border-bottom: 1px solid var(--line-soft); }
.pick-head h3{ font-family:"Gowun Batang", serif; font-weight:700; font-size: 18px; margin: 0; }
.pick-search{ display:flex; align-items:center; gap: 10px; padding: 12px 20px; border-bottom: 1px solid var(--line-soft); }
.pick-ico{ width: 20px; height: 20px; color: var(--ink-3); display:grid; place-items:center; }
.pick-ico svg{ width: 20px; height: 20px; }
.pick-search input{ flex:1; appearance:none; border:0; outline:0; background:transparent; font: 500 15px "IBM Plex Sans KR", sans-serif; color: var(--ink); }
.pick-table{ display:flex; flex-direction:column; overflow:hidden; flex:1; min-height: 0; }
.pick-trow{ display:grid; align-items:center; gap: 10px; padding: 9px 16px; }
.pick-thead{ background: var(--card-2); border-bottom: 1px solid var(--line); font-family:"JetBrains Mono", monospace; font-size: 10.5px; letter-spacing: .04em; color: var(--ink-3); }
.pick-tbody{ overflow-y: auto; flex:1; }
.pick-empty{ padding: 30px; text-align: center; color: var(--ink-3); font-size: 13.5px; }
.pick-opt{ appearance:none; cursor:pointer; border:0; background:transparent; width:100%; text-align:left; border-bottom: 1px solid var(--line-soft); font-size: 13.5px; color: var(--ink-2); }
.pick-opt:hover, .pick-opt.is-hi{ background: var(--card-2); }
.pk-cell{ min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pk-cell.is-right{ text-align: right; justify-self: end; }
.pk-cell.is-strong{ font-weight: 600; color: var(--ink); }
.pk-cell.is-mono{ font-family:"JetBrains Mono", monospace; font-size: 12.5px; }
.pick-foot{ padding: 10px 20px; border-top: 1px solid var(--line-soft); background: var(--card-2); display:flex; align-items:center; justify-content:space-between; gap: 12px; }
.pick-foot-cnt{ font-size: 11.5px; color: var(--ink-3); font-family:"JetBrains Mono", monospace; white-space:nowrap; }
.pick-new{ appearance:none; cursor:pointer; border:0; background: var(--accent); color:#fff; font: 600 13px "IBM Plex Sans KR", sans-serif; padding: 8px 16px; border-radius: 9px; white-space:nowrap; }
.pick-new:hover{ background: color-mix(in oklab, var(--accent) 88%, black); }
.cm-head{ font-size: 11.5px; letter-spacing:.05em; color: var(--ink-3); font-family:"JetBrains Mono",monospace; padding: 0 2px 2px; margin-bottom: 4px; border-bottom: 1px solid var(--line-soft); }
.cm-row .fld-input{ height: 36px; font-size: 13.5px; }
.cm-del{ appearance:none; cursor:pointer; border:0; background:transparent; color: var(--ink-3); width: 28px; height: 28px; border-radius: 8px; display:grid; place-items:center; }
.cm-del svg{ width: 14px; height: 14px; }
.cm-del:hover{ background: color-mix(in oklab, var(--bad) 10%, var(--card)); color: var(--bad); }
.cm-add{ appearance:none; cursor:pointer; border:1px dashed var(--line); background:transparent; color: var(--ink-2); font: 600 12.5px "IBM Plex Sans KR",sans-serif; border-radius: 10px; padding: 8px 14px; display:inline-flex; align-items:center; gap:6px; margin-top: 4px; white-space:nowrap; }
.cm-add svg{ width: 14px; height: 14px; }
.cm-add:hover{ border-color: var(--accent); color: var(--accent-ink); background: var(--accent-soft); }
.seg-item:hover{ color: var(--ink); }
.seg-item.is-on{ background: var(--card); color: var(--ink); box-shadow: 0 1px 0 rgba(31,26,20,.04); }

/* Table */
.table-card{
  background: var(--card); border: 1px solid var(--line);
  border-radius: 14px; overflow: hidden;
}
.t-scroll{ overflow-x: auto; overflow-y: visible; }
.t-scroll .t-row{ min-width: var(--row-min, 0); }
.t-row{
  cursor:pointer; text-align:left;
  display: grid; grid-template-columns: var(--cols-template);
  align-items: center; gap: 12px;
  padding: var(--row-pad);
  border-bottom: 1px solid var(--line-soft);
  font: 500 14px "IBM Plex Sans KR", sans-serif;
  transition: background .12s; outline: 0;
}
.t-row:hover{ background: var(--card-2); }
.t-row.t-click{ cursor: pointer; }
.t-row:focus-visible{ background: var(--card-2); box-shadow: inset 3px 0 0 var(--accent); }
.t-row.t-head{
  background: var(--card-2);
  font-family:"JetBrains Mono", monospace;
  font-size:10.5px; letter-spacing:.1em; text-transform:uppercase;
  color: var(--ink-3); cursor: default; padding: 11px 18px;
}
.t-row.t-head:hover{ background: var(--card-2); }
.th-drag{ cursor: grab; user-select: none; position: relative; }
.th-drag:active{ cursor: grabbing; }
.th-drag:hover{ background: color-mix(in oklab, var(--accent-soft) 40%, var(--card-2)); border-radius: 6px; }
.th-resize{
  position: absolute; right: -6px; top: 0; bottom: 0; width: 12px;
  cursor: col-resize; z-index: 3;
}
.th-resize::after{
  content: ""; position: absolute; right: 5px; top: 4px; bottom: 4px; width: 2px;
  background: transparent; border-radius: 2px;
}
.th-resize:hover::after{ background: var(--accent); }
.t-row.t-foot{
  cursor: default; background: var(--card-2);
  border-top: 1.5px solid var(--line); border-bottom: 0;
  font-weight: 600;
}
.t-row.t-foot:hover{ background: var(--card-2); }
.foot-label{ font-family:"JetBrains Mono", monospace; font-size: 11px; letter-spacing: .08em; color: var(--ink-2); text-transform: uppercase; }

.tc{ min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.table-card .t-row > *{ align-self: stretch; display: flex; align-items: center; }
.table-card .t-row > *:not(:last-child){ border-right: 1px solid var(--line-soft); }
.table-card .t-row .tc > *{ min-width: 0; }
.table-card .t-row .tc[style*="text-align: right"]{ justify-content: flex-end; }
.table-card .t-row .tc[style*="text-align: center"]{ justify-content: center; }
.tc-val{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.ck-mono{ font-family:"JetBrains Mono", monospace; font-size: 13px; color: var(--ink-2); font-variant-numeric: tabular-nums; }
.ck-name .ln-text{ font-weight: 600; color: var(--ink); }
.recv-row:hover{ background: var(--card-2); }
.ck-check{ display:flex; align-items:center; justify-content:center; }
.recv-ck{ width:15px; height:15px; accent-color: var(--accent); cursor:pointer; }
.ln-link{ color: var(--accent-ink); text-decoration: underline; text-underline-offset: 2px; text-decoration-thickness: 1px; }
.recv-row:hover .ln-link{ text-decoration-thickness: 2px; }
.ledger-body{ padding: 0 20px 20px; max-height: 70vh; overflow-y: auto; }
.ledgdoc{ background:#fff; border:1px solid var(--line); border-radius:10px; padding:26px 28px; color:#1b2437; }
.ledgdoc .ld-title{ text-align:center; font-size:24px; font-weight:800; letter-spacing:13px; padding:4px 0 8px; border-bottom:3px double #2c4a7c; margin-bottom:12px; }
.ledgdoc .ld-meta{ display:flex; justify-content:space-between; font-size:12px; color:#3a4560; margin:8px 0; }
.ledgdoc table{ width:100%; border-collapse:collapse; font-size:12.5px; }
.ledgdoc .ld-party td{ border:1px solid #2c4a7c; padding:5px 8px; }
.ledgdoc .ld-party .k{ background:#eef2f9; text-align:center; width:84px; font-weight:600; }
.ledgdoc .ld-items{ margin-top:12px; }
.ledgdoc .ld-items th{ border:1px solid #2c4a7c; background:#eef2f9; padding:6px 8px; font-weight:700; }
.ledgdoc .ld-items td{ border:1px solid #2c4a7c; padding:6px 8px; }
.ledgdoc .c{ text-align:center; } .ledgdoc .r{ text-align:right; font-variant-numeric:tabular-nums; } .ledgdoc .sub{ color:#68738a; font-size:11.5px; }
.ledgdoc .ld-carry td{ background:#f7f9fc; font-weight:600; }
.ledgdoc tfoot td{ background:#eef2f9; font-weight:700; }
.ledgdoc .ld-click{ cursor:pointer; } .ledgdoc .ld-click:hover td{ background:#f4f7fc; }
.ledgdoc .ld-note{ margin-top:16px; text-align:center; font-size:13px; }
.ledgdoc .ld-issuer{ margin-top:12px; text-align:right; font-size:12.5px; }
.ledgdoc .ld-frm{ appearance:none; cursor:pointer; border:0; background:transparent; color:#b03030; font-weight:700; margin-left:5px; padding:0 2px; }
.ledgdoc .ld-frm:hover{ color:#fff; background:#b03030; border-radius:4px; }
.ld-a4wrap{ display:flex; flex-direction:column; }
.ld-a4bar{ display:flex; align-items:center; gap:8px; margin-bottom:10px; flex-wrap:wrap; }
.ld-a4hint{ font-size:11.5px; color:var(--ink-3); }
.ledgdoc.ld-a4{ position:relative; width:760px; min-height:1075px; margin:0 auto; padding:0; overflow:hidden; }
.ld-a4 .ld-block{ position:absolute; background:#fff; }
.ld-a4.is-edit .ld-block{ cursor:grab; outline:1.5px dashed color-mix(in oklab, var(--accent) 55%, transparent); outline-offset:4px; }
.ld-a4.is-edit .ld-block:active{ cursor:grabbing; }
.lb-resize{ position:absolute; right:-8px; top:0; bottom:0; width:14px; cursor:col-resize; }
.lb-hide{ position:absolute; top:-24px; right:0; appearance:none; border:1px solid var(--line); background:var(--card); color:var(--ink-2); font:600 10.5px "IBM Plex Sans KR",sans-serif; border-radius:6px; padding:2px 8px; cursor:pointer; z-index:2; }
.lb-hide:hover{ background:var(--bad); color:#fff; border-color:var(--bad); }
.ld-textbox textarea{ width:100%; min-height:60px; border:1px dashed var(--line); border-radius:6px; font:400 13px "IBM Plex Sans KR",sans-serif; padding:6px 8px; background:#fff; color:#1b2437; resize:vertical; }
.ld-textview{ font-size:13px; white-space:pre-wrap; color:#1b2437; }
.ld-ribbon{ display:flex; align-items:stretch; gap:0; margin-bottom:10px; background:var(--card); border:1px solid var(--line); border-radius:10px; padding:4px 6px; flex-wrap:wrap; }
.ld-rb-group{ display:flex; flex-direction:column; align-items:center; gap:2px; padding:4px 12px; border-right:1px solid var(--line-soft); }
.ld-rb-group:last-of-type{ border-right:0; }
.ld-rb-row{ display:flex; align-items:center; gap:4px; }
.ld-rb-lbl{ font-size:10px; color:var(--ink-3); }
.ld-rb-btn{ appearance:none; cursor:pointer; border:1px solid transparent; background:transparent; color:var(--ink); font:600 12.5px "IBM Plex Sans KR",sans-serif; padding:4px 8px; border-radius:6px; }
.ld-rb-btn:hover{ background:var(--card-2); }
.ld-rb-btn.is-on{ background:var(--accent-soft); border-color:color-mix(in oklab, var(--accent) 45%, var(--line)); color:var(--accent-ink); }
.ld-rb-btn:disabled{ opacity:.4; cursor:not-allowed; }
.ld-rb-size{ appearance:auto; border:1px solid var(--line); border-radius:6px; background:var(--card); font:500 12px "IBM Plex Sans KR",sans-serif; padding:3px 6px; }
.ld-rb-sw{ appearance:none; cursor:pointer; width:18px; height:18px; border-radius:5px; border:2px solid transparent; }
.ld-rb-sw.is-on{ border-color:var(--ink); }
.ld-rb-sw:disabled{ opacity:.4; cursor:not-allowed; }
.ld-rb-div{ width:1px; align-self:stretch; background:var(--line-soft); margin:0 4px; }
.ld-rb-hl{ width:auto; padding:0 5px; font:700 11px "IBM Plex Sans KR",sans-serif; color:#1b2437; border:1px solid var(--line); display:grid; place-items:center; height:18px; border-radius:5px; }
.ld-datafld{ font-size:13px; background:#fff; }
.ld-df-k{ color:#68738a; font-size:11px; margin-right:4px; }
.ld-df-v{ color:#1b2437; }
.ld-dtable .ld-instb td{ padding:4px 6px; }
.ld-dt-k{ background:#eef2f9; font-size:11.5px; width:40%; }
.ld-dt-v{ font-size:12px; }
.ld-txh{ background:#eef2f9; font-weight:600; text-align:center; font-size:11.5px; }
.ld-tx-r{ text-align:right; }
.ld-tx-c{ text-align:center; }
.ld-dt-add{ margin-top:4px; }
.ld-cellmenu{ position:absolute; z-index:30; max-height:320px; overflow-y:auto; }
.ld-cm-g{ padding:6px 10px 2px; font:600 10px "JetBrains Mono",monospace; letter-spacing:.08em; color:var(--ink-3); text-transform:uppercase; }
.ld-cm-v{ float:right; color:var(--ink-3); font-size:10.5px; margin-left:8px; }
.ld-cellbind{ display:inline-block; background:#E3EBFA; border:1px dashed #2c4a7c; border-radius:5px; padding:2px 6px; font-size:12px; color:#1b2437; }
.ld-instb td.is-cellsel{ background:#DCE8FB; }
.ld-instb td.is-cellsel input{ background:transparent; }
.ld-cm-sub{ padding-left:26px; font-size:12px; }
.ld-ck-row{ display:flex; align-items:center; gap:7px; font-size:13px; color:#1b2437; cursor:pointer; }
.ld-ck-row input[type="checkbox"]{ width:15px; height:15px; accent-color:#2C4A7C; }
.ld-ck-lbl{ border:1px dashed var(--line); border-radius:5px; font:400 12.5px "IBM Plex Sans KR",sans-serif; padding:2px 6px; background:#fff; color:#1b2437; min-width:60px; }
.ld-a4 .ld-block.is-sel{ outline:2px solid var(--accent); outline-offset:4px; }
.ld-a4 .ld-block.has-size .ld-title{ font-size:inherit; letter-spacing:8px; }
.ld-a4 .ld-block.has-size table{ font-size:inherit; }
.ld-instb{ width:100%; border-collapse:collapse; }
.ld-instb td{ border:1px solid #2c4a7c; padding:2px; }
.ld-instb td input{ width:100%; border:0; outline:0; background:transparent; font:400 12px "IBM Plex Sans KR",sans-serif; padding:3px 5px; color:#1b2437; }
.ld-a4:not(.is-edit) .ld-instb td{ padding:4px 6px; font-size:12px; }
.ld-tbtools{ position:absolute; top:-24px; left:0; display:flex; gap:4px; }
.ld-tbtools button{ appearance:none; border:1px solid var(--line); background:var(--card); font:600 10.5px "IBM Plex Sans KR",sans-serif; border-radius:6px; padding:2px 7px; cursor:pointer; }
.ld-tbtools button:hover{ background:var(--accent-soft); }
.ld-instb{ table-layout:fixed; }
.ld-tbrz{ position:absolute; right:-4px; top:0; bottom:0; width:8px; cursor:col-resize; z-index:2; }
.ld-tbrz:hover{ background:color-mix(in oklab, var(--accent) 35%, transparent); }
.ck-text{ color: var(--ink-2); }
.ck-price, .ck-total{
  font-family:"JetBrains Mono", monospace;
  text-align: right; font-variant-numeric: tabular-nums;
  color: var(--ink); font-weight: 500;
}
.ck-total .total-val, .total-val{ color: var(--accent-ink); font-weight: 600; }
.won{ color: var(--ink-3); font-size: 11px; margin-left: 2px; font-weight: 400; }

.summary-cell{ display:flex; align-items:center; gap:8px; min-width:0; }
.sc-lead{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color: var(--ink); }
.sc-more{
  flex:none; font-size: 11px; color: var(--ink-3);
  background: var(--bg-2); padding: 2px 8px; border-radius: 999px;
}

.status-chip{
  display: inline-grid; place-items:center;
  padding: 3px 10px; border-radius: 999px;
  font-size: 10.5px; letter-spacing: .04em; font-weight: 600;
}
.status-chip-btn{ appearance:none; cursor:pointer; border:0; font: inherit; font-weight: 600; }
.status-chip-btn:hover{ filter: brightness(.94); }
.status-sel{
  appearance:none; cursor:pointer; border:0;
  padding: 3px 22px 3px 10px; border-radius: 999px;
  font-size: 11px; font-weight: 600; letter-spacing: .02em;
  background-repeat: no-repeat; background-position: right 7px center;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%238B8273' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
}
.status-sel.s-주문  { background-color: color-mix(in oklab, var(--accent) 16%, transparent); color: var(--accent-ink); }
.status-sel.s-완료  { background-color: color-mix(in oklab, var(--good) 18%, transparent); color: oklch(0.42 0.12 150); }
.status-chip.s-주문  { background: color-mix(in oklab, var(--accent) 16%, transparent); color: var(--accent-ink); }
.status-chip.s-완료  { background: color-mix(in oklab, var(--good) 18%, transparent); color: oklch(0.42 0.12 150); }
.status-chip.s-미수금{ background: color-mix(in oklab, var(--warn) 22%, transparent); color: oklch(0.45 0.13 70); }

.dm-status{ display:flex; flex-wrap:wrap; gap:6px; }
.status-pick{
  appearance:none; cursor:pointer; border:1px solid var(--line);
  background: var(--card); color: var(--ink-2);
  font: 500 12px "IBM Plex Sans KR", sans-serif;
  padding: 5px 11px; border-radius: 999px;
  transition: background .12s, color .12s, border-color .12s;
}
.status-pick:hover{ background: var(--card-2); color: var(--ink); }
.status-pick.is-on{ background: var(--ink); color: var(--card); border-color: var(--ink); }
.status-custom{ color: var(--accent-ink); border-style: dashed; }

.th-drag.is-cfg{ background: color-mix(in oklab, var(--accent-soft) 45%, var(--card-2)); position: relative; }
.th-hide{ appearance:none; cursor:pointer; border:0; background:transparent; color:var(--ink-3); width:16px; height:16px; margin-left:4px; display:inline-grid; place-items:center; vertical-align:middle; }
.th-hide:hover{ color:var(--bad); }
.is-colhidden{ opacity:.4; }
.vpm{ position:relative; display:inline-block; }
.vpm-btn{ max-width:260px; }
.vpm-btn .vpm-code{ font:600 11px "JetBrains Mono",monospace; color:var(--accent-ink); background:var(--accent-soft); border-radius:999px; padding:1px 7px; }
.vpm-btn .vpm-name{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:120px; }
.vpm-btn.is-disabled{ opacity:.45; cursor:not-allowed; }
.vpm-btn.is-on{ border-color: color-mix(in oklab, var(--accent) 40%, var(--line)); }
.vpm-caret{ display:grid; place-items:center; margin-left:2px; color:var(--ink-3); }
.vpm-caret svg{ width:15px; height:15px; }
.vpm-scrim{ position:fixed; inset:0; z-index:59; }
.vpm-menu{ position:absolute; top:calc(100% + 6px); right:0; z-index:60; width:300px; background:var(--card); border:1px solid var(--line); border-radius:12px; box-shadow:0 16px 40px -12px rgba(31,26,20,.3); padding:6px; }
.vpm-menu-h{ font:600 10.5px "JetBrains Mono",monospace; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-3); padding:6px 8px 4px; }
.vpm-list{ display:flex; flex-direction:column; gap:1px; max-height:280px; overflow-y:auto; }
.vpm-empty{ font-size:12.5px; color:var(--ink-3); text-align:center; padding:16px 8px; line-height:1.6; }
.vpm-item{ display:flex; align-items:center; gap:2px; border-radius:8px; padding:2px; }
.vpm-item.is-on{ background:var(--accent-soft); }
.vpm-item:hover{ background:var(--card-2); }
.vpm-pick{ flex:1; min-width:0; appearance:none; cursor:pointer; border:0; background:transparent; display:flex; align-items:center; gap:8px; padding:6px 6px; text-align:left; }
.vpm-pick .vpm-code{ flex:none; font:600 11px "JetBrains Mono",monospace; color:var(--accent-ink); background:var(--accent-soft); border-radius:999px; padding:1px 7px; }
.vpm-item.is-on .vpm-pick .vpm-code{ background:var(--card); }
.vpm-pick .vpm-name{ flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:13px; color:var(--ink); }
.vpm-dot{ width:6px; height:6px; border-radius:50%; background:var(--accent); flex:none; }
.vpm-mini{ appearance:none; cursor:pointer; border:0; background:transparent; color:var(--ink-3); font:500 11px "IBM Plex Sans KR",sans-serif; padding:4px 6px; border-radius:6px; flex:none; }
.vpm-mini:hover{ background:var(--bg-2); color:var(--ink); }
.vpm-mini.vpm-del{ width:24px; display:grid; place-items:center; }
.vpm-mini.vpm-del:hover{ background:var(--bad); color:#fff; }
.vpm-mini.vpm-del svg{ width:12px; height:12px; }
.vpm-new{ width:100%; margin-top:4px; appearance:none; cursor:pointer; border:1px dashed color-mix(in oklab, var(--accent) 45%, var(--line)); background:transparent; color:var(--accent-ink); font:600 12.5px "IBM Plex Sans KR",sans-serif; padding:8px; border-radius:9px; }
.vpm-new:hover{ background:var(--accent-soft); }
.toast-host{ position:fixed; left:50%; bottom:32px; transform:translateX(-50%); z-index:200; display:flex; flex-direction:column; gap:8px; align-items:center; pointer-events:none; }
.toast{ display:flex; align-items:center; gap:9px; background:var(--ink); color:#fff; font:500 13.5px "IBM Plex Sans KR",sans-serif; padding:11px 18px; border-radius:999px; box-shadow:0 12px 32px -8px rgba(31,26,20,.45); opacity:0; transform:translateY(12px); transition:opacity .24s, transform .24s; max-width:80vw; }
.toast.is-in{ opacity:1; transform:translateY(0); }
.toast-ic{ display:grid; place-items:center; width:19px; height:19px; border-radius:50%; font-size:12px; flex:none; }
.toast-ok .toast-ic{ background:var(--ok, #1F8A5B); color:#fff; }
.toast-info .toast-ic{ background:var(--accent); color:#fff; }
.modal-confirm{ width:min(440px,94vw); max-width:none; }
.confirm-body{ padding:26px 26px 8px; }
.confirm-title{ margin:0 0 8px; font:700 17px "IBM Plex Sans KR",sans-serif; color:var(--ink); }
.confirm-msg{ margin:0; font-size:13.5px; line-height:1.65; color:var(--ink-2); word-break:keep-all; }
.btn-primary.btn-danger{ background:var(--bad); border-color:var(--bad); }
.btn-primary.btn-danger:hover{ filter:brightness(.94); }
.modal-addcol{ width: min(680px, 96vw); max-width:none; }
.addcol-cols{ display:flex; align-items:stretch; }
.addcol-cols .ni-body{ flex:1; min-width:0; }
.addcol-existing{ width:220px; flex:none; border-left:1px solid var(--line-soft); background:var(--card-2); padding:16px 14px; display:flex; flex-direction:column; gap:8px; overflow-y:auto; }
.ae-h{ font:600 10.5px "JetBrains Mono",monospace; letter-spacing:.08em; text-transform:uppercase; color:var(--ink-3); }
.ae-empty{ font-size:12.5px; color:var(--ink-3); padding:8px 0; }
.ae-list{ display:flex; flex-direction:column; gap:6px; }
.ae-item{ display:grid; grid-template-columns:auto 1fr auto; align-items:center; gap:7px; padding:7px 9px; background:var(--card); border:1px solid var(--line); border-radius:9px; }
.ae-item.is-cur{ border-color:var(--accent); background:var(--accent-soft); }
.ae-code{ font:600 10px "JetBrains Mono",monospace; color:var(--accent-ink); background:var(--accent-soft); border-radius:999px; padding:1px 6px; white-space:nowrap; }
.ae-item.is-cur .ae-code{ background:var(--card); }
.ae-name{ font-size:12.5px; color:var(--ink); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.ae-type{ font-size:10.5px; color:var(--ink-3); white-space:nowrap; }
@media (max-width: 600px){ .addcol-cols{ flex-direction:column; } .addcol-existing{ width:auto; border-left:0; border-top:1px solid var(--line-soft); max-height:160px; } }
.th-hide svg{ width:12px; height:12px; }
.btn-ghost.is-on-cfg{ background: var(--ink); color: var(--card); border-color: transparent; }
.tc-check{ display:flex; align-items:center; justify-content:center; user-select:none; }
.cbx{
  appearance:none; cursor:pointer;
  width: 20px; height: 20px; border-radius: 6px;
  border: 1.5px solid rgba(31,26,20,.28); background: var(--card);
  display:grid; place-items:center; color: var(--card);
  transition: background .15s, border-color .15s;
}
.cbx.is-on{ background: var(--ink); border-color: var(--ink); }
.cbx.cbx-new{ border-color: var(--accent); background: var(--accent-soft); box-shadow: 0 0 0 2px color-mix(in oklab, var(--accent) 30%, transparent); }
.cbx.cbx-new.is-on{ background: var(--accent); border-color: var(--accent); }
.t-row.row-new{ box-shadow: inset 3px 0 0 var(--accent); background: color-mix(in oklab, var(--accent-soft) 14%, var(--card)); }
.tc-check{ position: relative; }
.new-flag{ display:inline-block; white-space: nowrap; font: 700 9.5px "IBM Plex Sans KR", sans-serif; letter-spacing: .2px; color: var(--accent-ink); background: var(--accent-soft); border: 1px solid color-mix(in oklab, var(--accent) 35%, transparent); padding: 1.5px 5px; border-radius: 999px; }
.cbx svg{ width:12px; height:12px; }
.t-row.is-checked{ background: color-mix(in oklab, var(--accent-soft) 28%, var(--card)); }

.tc-go{ display:flex; align-items:center; justify-content:center; color: var(--ink-3); }
.go-chev{ display:grid; place-items:center; transform: rotate(-90deg); opacity: 0; transition: opacity .15s; }
.go-chev svg{ width:16px; height:16px; }
.t-row:hover .go-chev{ opacity: 1; }

.t-empty{ padding: 50px 24px; text-align: center; color: var(--ink-3); font-size: 14px; }

/* Modal base */
.modal-root{ position: fixed; inset: 0; z-index: 50; display: grid; place-items: center; padding: clamp(16px, 4vw, 40px); }
.modal-scrim{
  position: absolute; inset: 0;
  background: rgba(31,26,20,.42);
  backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
  animation: scrimIn .18s ease-out;
}
@keyframes scrimIn{ from { opacity: 0; } }
.modal{
  position: relative; width: min(960px, 100%);
  max-height: calc(100vh - 80px);
  background: var(--card); border: 1px solid var(--line);
  border-radius: 18px; box-shadow: 0 40px 80px -20px rgba(31,26,20,.28);
  display: flex; flex-direction: column; overflow: hidden;
  animation: modalIn .22s cubic-bezier(.2,.7,.3,1);
}
.modal-sm{ width: min(520px, 100%); }
.modal-detail{ width: min(680px, 100%); }
@keyframes modalIn{ from { opacity: 0; transform: translateY(10px) scale(.985); } }
.modal-head{
  display:flex; align-items:flex-start; justify-content:space-between; gap:12px;
  padding: 22px 26px 18px; border-bottom: 1px solid var(--line-soft);
}
.modal-title{ font-family:"Gowun Batang", serif; font-weight:700; font-size: 22px; letter-spacing:-.015em; margin: 0; }
.addcol-code-badge{ display:inline-block; font-family:"JetBrains Mono", monospace; font-size:11px; font-weight:600; color:var(--accent-ink); background:var(--accent-soft); padding:3px 10px; border-radius:999px; margin-bottom:8px; }
.modal-title-input{ display:block; width:100%; appearance:none; border:0; border-bottom:1.5px solid var(--line); background:transparent; outline:none; font-family:"Gowun Batang", serif; font-weight:700; font-size:20px; letter-spacing:-.015em; color:var(--ink); padding:2px 0 5px; }
.modal-title-input:focus{ border-bottom-color:var(--accent); }
.modal-title-input::placeholder{ color:var(--ink-3); font-weight:400; }
.modal-sub{ font-size: 12.5px; color: var(--ink-3); margin-top: 4px; font-family:"JetBrains Mono", monospace; }
.modal-head-actions{ display:flex; align-items:center; gap: 6px; }
.cfg-wrap{ position:relative; }
.cfg-hint{ padding:8px 12px; margin-bottom:6px; background:color-mix(in oklab, var(--accent-soft) 40%, var(--card-2)); border:1px solid color-mix(in oklab, var(--accent) 25%, transparent); border-radius:9px; font-size:12px; color:var(--accent-ink); display:flex; align-items:center; flex-wrap:wrap; gap:6px; }
.cfg-hint-txt{ flex:1; min-width:200px; }
.cfg-hidden{ display:inline-flex; align-items:center; flex-wrap:wrap; gap:5px; }
.cfg-hidden-lb{ font:600 10.5px "JetBrains Mono",monospace; letter-spacing:.06em; text-transform:uppercase; color:var(--ink-3); }
.cfg-hidden-chip{ appearance:none; cursor:pointer; border:1px dashed color-mix(in oklab, var(--accent) 45%, var(--line)); background:var(--card); color:var(--accent-ink); font:600 11.5px "IBM Plex Sans KR",sans-serif; padding:3px 9px; border-radius:999px; }
.cfg-hidden-chip:hover{ background:var(--accent-soft); }
.cfg-reset{ appearance:none; cursor:pointer; margin-left:auto; border:1px solid var(--accent); background:var(--card); color:var(--accent-ink); font:600 11px "IBM Plex Sans KR",sans-serif; padding:3px 10px; border-radius:999px; }
.cfg-reset:hover{ background:var(--accent); color:#fff; }
.enter-cfg{ display:flex; align-items:center; flex-wrap:wrap; gap:8px; padding:8px 12px; margin-bottom:8px; background:var(--card-2); border:1px solid var(--line-soft); border-radius:10px; }
.enter-cfg-lbl{ font:600 12px "IBM Plex Sans KR",sans-serif; color:var(--ink-2); }
.enter-chips{ display:flex; flex-wrap:wrap; gap:6px; }
.enter-chip{ display:inline-flex; align-items:center; gap:6px; cursor:grab; user-select:none; background:var(--card); border:1px solid color-mix(in oklab, var(--accent) 30%, var(--line)); border-radius:999px; padding:4px 11px 4px 5px; font:600 12px "IBM Plex Sans KR",sans-serif; color:var(--ink); }
.enter-chip:active{ cursor:grabbing; }
.enter-chip .enter-num{ display:grid; place-items:center; width:17px; height:17px; border-radius:50%; background:var(--accent); color:#fff; font:700 10.5px "JetBrains Mono",monospace; }
.enter-cfg-hint{ font-size:11px; color:var(--ink-3); }
.cfg-reset svg{ width:12px; height:12px; vertical-align:-1px; }
.cfg-addchips{ display:inline-flex; align-items:center; gap:6px; flex-wrap:wrap; margin-left:10px; }
.cfg-addchips-lbl{ font:600 10.5px "JetBrains Mono",monospace; letter-spacing:.08em; text-transform:uppercase; color:var(--ink-3); }
.cfg-addchip{ appearance:none; cursor:pointer; border:1px solid var(--accent); background:var(--card); color:var(--accent-ink); font:600 11.5px "IBM Plex Sans KR",sans-serif; padding:3px 10px; border-radius:999px; display:inline-flex; align-items:center; gap:4px; transition:background .12s, color .12s; }
.cfg-addchip:hover{ background:var(--accent); color:#fff; }
.cfg-addchip-plus{ font-weight:700; }
.eltab-head.is-cfg .th-col{ cursor:pointer; position:relative; }
.eltab-head.is-cfg .th-col:hover{ background:color-mix(in oklab, var(--accent) 18%, var(--card-2)); outline:1px dashed var(--accent); }
.colpop-scrim{ position:fixed; inset:0; z-index:45; }
.colpop{ position:absolute; top:42px; left:50%; transform:translateX(-50%); z-index:46; max-width:calc(100% - 12px); background:var(--card); border:1px solid var(--line); border-radius:12px; box-shadow:0 16px 40px -12px rgba(31,26,20,.28); padding:6px; min-width:180px; display:flex; flex-direction:column; gap:2px; }
.colpop-head{ font-size:11px; letter-spacing:.06em; color:var(--ink-3); font-family:"JetBrains Mono",monospace; padding:6px 10px 4px; display:flex; align-items:center; gap:6px; }
.colpop-sw{ width:12px; height:12px; border-radius:3px; background:var(--accent); border:1px solid var(--accent-ink); flex:none; }
.colpop-set{ margin-left:auto; appearance:none; cursor:pointer; border:0; background:var(--accent-soft); color:var(--accent-ink); font-weight:600; font-size:11px; padding:3px 10px; border-radius:999px; }
.colpop-set:hover{ background:var(--accent); color:#fff; }
.colpop-item{ appearance:none; cursor:pointer; border:0; background:transparent; text-align:left; color:var(--ink); font:500 13px "IBM Plex Sans KR",sans-serif; padding:9px 12px; border-radius:8px; display:flex; align-items:center; gap:8px; }
.colpop-item svg{ width:15px; height:15px; }
.colpop-item:hover{ background:var(--card-2); }
.colpop-danger{ color:var(--bad); }
.colpop-sub{ font-size:10.5px; letter-spacing:.06em; color:var(--ink-3); font-family:"JetBrains Mono",monospace; padding:7px 12px 2px; }
.colpop-plus{ color:var(--accent); font-weight:700; margin-right:7px; }
.colpop-reset-item{ color:var(--ink-2); border-top:1px solid var(--line-soft); margin-top:2px; }
.colpop-reset-item svg{ width:13px; height:13px; margin-right:2px; }
.colpop-danger:hover{ background:color-mix(in oklab, var(--bad) 10%, var(--card)); }
.cfg-scrim{ position:fixed; inset:0; z-index:40; }
.cfg-menu{ position:absolute; top:calc(100% + 6px); right:0; z-index:41; background:var(--card); border:1px solid var(--line); border-radius:12px; box-shadow:0 16px 40px -12px rgba(31,26,20,.28); padding:6px; min-width:200px; display:flex; flex-direction:column; gap:2px; }
.cfg-item{ appearance:none; cursor:pointer; border:0; background:transparent; text-align:left; color:var(--ink); font:500 13px "IBM Plex Sans KR",sans-serif; padding:9px 12px; border-radius:8px; display:flex; align-items:center; gap:8px; }
.cfg-item svg{ width:15px; height:15px; }
.cfg-item:hover{ background:var(--card-2); }
.cfg-item:disabled{ opacity:.4; cursor:default; }
.cfg-item:disabled:hover{ background:transparent; }
.cfg-danger{ color:var(--bad); }
.cfg-danger:hover{ background:color-mix(in oklab, var(--bad) 10%, var(--card)); }
.cfg-divider{ height:1px; background:var(--line); margin:4px 2px; }
.cfg-title{ font-size:10.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-3); font-family:"JetBrains Mono",monospace; padding:6px 10px 4px; }
.cfg-collist{ display:flex; flex-direction:column; gap:1px; max-height:260px; overflow-y:auto; }
.cfg-col{ appearance:none; cursor:pointer; border:0; background:transparent; text-align:left; color:var(--ink); font:500 13px "IBM Plex Sans KR",sans-serif; padding:7px 10px; border-radius:8px; display:flex; align-items:center; gap:9px; }
.cfg-col:hover{ background:var(--card-2); }
.cfg-check{ width:18px; height:18px; border-radius:5px; border:1.5px solid var(--line); display:grid; place-items:center; color:#fff; flex:none; }
.cfg-check.is-on{ background:var(--accent); border-color:transparent; }
.cfg-check svg{ width:12px; height:12px; }
.cfg-col:not(.is-on) .cfg-col-label{ color:var(--ink-3); }
.cfg-col-label{ flex:1; }
.cfg-col-del{ width:18px; height:18px; border-radius:4px; display:grid; place-items:center; color:var(--ink-3); }
.cfg-col-del:hover{ background:var(--bad); color:#fff; }
.cfg-col-del svg{ width:12px; height:12px; }
.pin-btn-inline{ appearance:none; cursor:pointer; border:0; background:transparent; text-align:left; color:var(--ink-2); font:500 13px "IBM Plex Sans KR",sans-serif; padding:9px 12px; border-radius:8px; }
.pin-btn-inline:hover{ background:var(--card-2); color:var(--ink); }
.pin-btn-inline.is-on{ color:var(--accent-ink); font-weight:600; }
.modal-close{
  appearance:none; cursor:pointer; border:0;
  width: 36px; height: 36px; border-radius: 10px;
  background: transparent; color: var(--ink-2);
  display: grid; place-items: center; transition: background .15s, color .15s;
}
.modal-close:hover{ background: var(--bg-2); color: var(--ink); }
.modal-close svg{ width: 20px; height: 20px; }
.modal-foot{
  padding: 16px 26px; border-top: 1px solid var(--line-soft);
  background: var(--card-2);
  display:flex; align-items:center; gap:16px; flex-wrap: wrap;
}
.ff-left{ display:flex; align-items:center; gap:10px; }
.ff-k{ font-size: 12px; color: var(--ink-3); font-family:"JetBrains Mono", monospace; letter-spacing: .1em; text-transform: uppercase; }
.ff-v{ color: var(--ink); font-weight: 500; font-size: 13px; }
.ff-right{ margin-left:auto; display:flex; align-items:center; gap:8px; }

/* Detail modal */
.detail-body{ padding: 20px 26px 8px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 18px; }
.detail-meta{
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
  background: var(--bg-2); border-radius: 12px; padding: 16px 18px;
}
.dm-item{ display:flex; flex-direction:column; gap: 4px; }
.dm-k{ font-family:"JetBrains Mono", monospace; font-size: 10.5px; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3); }
.dm-v{ font-size: 14px; color: var(--ink-2); }
.dm-strong{ font-family:"Gowun Batang", serif; font-weight: 700; font-size: 17px; color: var(--ink); }

.detail-lines{ display:flex; flex-direction:column; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
.dl-row{
  display: grid;
  grid-template-columns: minmax(100px,1.4fr) 80px 64px 100px 40px 110px;
  align-items: center; gap: 10px;
  padding: 11px 16px;
  border-bottom: 1px solid var(--line-soft);
  font-size: 13.5px;
}
.dl-row:last-child{ border-bottom: 0; }
.dl-head{
  background: var(--card-2);
  font-family:"JetBrains Mono", monospace; font-size: 10px;
  letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3);
}
.dl-name{ font-weight: 600; color: var(--ink); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.dl-spec{ color: var(--ink-3); font-size: 12.5px; }
.dl-qty, .dl-price, .dl-amt{ text-align: right; font-family:"JetBrains Mono", monospace; font-variant-numeric: tabular-nums; color: var(--ink-2); }
.dl-amt{ color: var(--ink); font-weight: 500; }
.dl-tax{ text-align:center; }
.tax-mini{
  display:inline-grid; place-items:center; width: 20px; height: 20px;
  border-radius: 6px; font-size: 11px; font-weight: 600;
}
.tax-mini.t-tax{ background: color-mix(in oklab, var(--accent) 16%, transparent); color: var(--accent-ink); }
.tax-mini.t-free{ background: rgba(31,26,20,.08); color: var(--ink-2); }

.detail-total{
  display:flex; flex-direction:column; gap: 8px;
  padding: 16px 18px; background: var(--bg-2); border-radius: 12px;
  align-self: flex-end; width: min(320px, 100%);
}
.dt-row{ display:flex; align-items:center; justify-content:space-between; font-size: 13.5px; color: var(--ink-2); }
.dt-v{ font-family:"JetBrains Mono", monospace; font-variant-numeric: tabular-nums; color: var(--ink); }
.dt-grand{ border-top: 1px dashed var(--line); padding-top: 10px; margin-top: 2px; }
.dt-grand .dt-k{ font-weight: 700; color: var(--ink); font-size: 15px; }
.dt-grand .dt-v{ font-family:"Gowun Batang", serif; font-weight: 700; font-size: 19px; color: var(--accent-ink); }

/* Column settings */
.col-list{ padding: 8px 26px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; }
.col-row{
  display: grid; grid-template-columns: 22px 1fr auto auto;
  align-items: center; gap: 12px; padding: 12px 4px;
  border-bottom: 1px dashed var(--line-soft); color: var(--ink-2);
}
.col-row:last-child{ border-bottom: 0; }
.col-handle{ width: 22px; height: 22px; color: var(--ink-3); display: grid; place-items: center; opacity: .6; }
.col-handle svg{ width: 18px; height: 18px; }
.col-name{ font-size: 14.5px; color: var(--ink); display: inline-flex; align-items: center; gap: 8px; }
.col-row:not(.is-on) .col-name{ color: var(--ink-3); }
.col-lock{ font-family:"JetBrains Mono", monospace; font-size: 10px; letter-spacing: .08em; background: rgba(31,26,20,.06); color: var(--ink-3); padding: 2px 7px; border-radius: 999px; text-transform: uppercase; }
.col-order{ display:flex; gap: 2px; }
.iconbtn{
  appearance:none; cursor:pointer; border:0;
  width: 32px; height: 32px; border-radius: 8px;
  background: transparent; color: var(--ink-3);
  display:grid; place-items:center; transition: background .15s, color .15s;
}
.iconbtn:hover{ background: var(--bg-2); color: var(--ink); }
.iconbtn:disabled{ opacity: .35; cursor: default; }
.iconbtn:disabled:hover{ background: transparent; color: var(--ink-3); }
.iconbtn-sm{ width: 26px; height: 26px; border-radius: 6px; }
.iconbtn-sm svg{ width: 16px; height: 16px; }
.switch{
  appearance:none; cursor:pointer; border:0;
  width: 38px; height: 22px; border-radius: 999px;
  background: rgba(31,26,20,.18); position: relative; transition: background .15s; padding: 0;
}
.switch:hover{ background: rgba(31,26,20,.28); }
.switch.is-on{ background: var(--ink); }
.switch:disabled{ opacity: .4; cursor: default; }
.switch-knob{
  position: absolute; top: 2px; left: 2px;
  width: 18px; height: 18px; border-radius: 50%;
  background: var(--card); box-shadow: 0 1px 2px rgba(31,26,20,.18);
  transition: transform .18s cubic-bezier(.2,.7,.3,1);
}
.switch.is-on .switch-knob{ transform: translateX(16px); }

/* Entry modal (simple) */
.modal-entry{ width: min(860px, 100%); position: relative; }
.entry-resize{
  position: absolute; top: 0; right: -7px; width: 16px; height: 100%;
  cursor: ew-resize; z-index: 30; display:flex; align-items:center; justify-content:center;
}
.entry-resize::after{
  content:""; width:4px; height:54px; border-radius:999px;
  background: var(--line); transition: background .15s;
}
.entry-resize:hover::after{ background: var(--accent); }
.pin-btn{
  appearance:none; cursor:pointer; border:1px solid var(--line);
  background: var(--card); color: var(--ink-2);
  font: 500 12.5px "IBM Plex Sans KR", sans-serif;
  padding: 6px 11px; border-radius: 8px;
  display:inline-flex; align-items:center; gap:6px;
}
.pin-btn:hover{ background: var(--card-2); color: var(--ink); }
.pin-btn.is-on{ background: var(--accent); color: #fff; border-color: transparent; }
.pin-btn svg{ width:16px; height:16px; }
.entry-body{ padding: 20px 26px 8px; overflow-y: auto; flex: 1; display:flex; flex-direction:column; gap: 18px; }
.entry-grid{ display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px 16px; }
.hdr-rm{ appearance:none; cursor:pointer; border:0; background:transparent; color:var(--ink-3); width:16px; height:16px; border-radius:4px; display:inline-grid; place-items:center; margin-left:6px; vertical-align:middle; }
.hdr-rm:hover{ background:var(--bad); color:#fff; }
.hdr-rm.hdr-cfg{ font-size:11px; }
.hdr-rm.hdr-cfg:hover{ background:var(--accent); }
.fld-label.is-cfg-click{ cursor:pointer; }
.fld-label.is-cfg-click:hover{ color:var(--accent-ink); text-decoration:underline; }
.entry-grid.is-cfg .fld{ cursor:grab; border:1px dashed color-mix(in oklab, var(--accent) 30%, var(--line)); border-radius:10px; padding:6px 8px; margin:-6px -8px; }
.entry-grid.is-cfg .fld:active{ cursor:grabbing; }
.entry-grid.is-cfg .fld .fld-label::before{ content:"↕ "; color:var(--ink-3); }
.hdr-rm svg{ width:11px; height:11px; }
.hdr-add{ appearance:none; cursor:pointer; border:1px dashed var(--line); background:transparent; color:var(--ink-2); font:500 12.5px "IBM Plex Sans KR",sans-serif; border-radius:9px; display:inline-flex; align-items:center; gap:5px; align-self:end; height:40px; padding:0 14px; }
.hdr-add svg{ width:14px; height:14px; }
.hdr-add:hover{ border-color:var(--accent); color:var(--accent-ink); background:color-mix(in oklab, var(--accent-soft) 30%, transparent); }
.fld{ display:flex; flex-direction:column; gap:6px; min-width:0; }
.fld-label{ font-size: 12.5px; color: var(--ink-2); font-weight: 500; }
.req{ color: var(--accent); font-weight: 700; }
.fld-input{
  appearance:none; outline:0; width:100%;
  background: var(--bg-2); border: 1px solid transparent; border-radius: 10px;
  padding: 0 12px; height: 40px;
  font: 500 14px "IBM Plex Sans KR", sans-serif; color: var(--ink);
  transition: border-color .15s, background .15s;
}
.fld-input:focus{ background:#fff; border-color: var(--ink); }
.fld-input::placeholder{ color: rgba(31,26,20,.3); font-weight: 400; }
.fld-input.is-mono{ font-family:"JetBrains Mono", monospace; }
.fld-input.is-right{ text-align: right; }

/* line item grid table */
.eltab{
  border: 1px solid var(--line); border-radius: 12px; overflow: visible; position: relative;
}
.eltab-row{
  display:grid;
  grid-template-columns: 44px 130px minmax(120px,1.4fr) 80px 56px 64px 100px 110px 100px minmax(150px,1.2fr);
  align-items: stretch;
  min-width: 0;
  border-bottom: 1px solid var(--line-soft);
  position: relative;
}
.eltab-row:last-child{ border-bottom: 0; }
.eltab-head{
  background: var(--card-2);
  font-family:"JetBrains Mono", monospace; font-size: 11px;
  letter-spacing: .03em; color: var(--ink-3);
}
.eltab-head > div:not(.el-cust-h){ padding: 9px 10px; display:flex; align-items:center; border-right: 1px solid var(--line-soft); }
.eltab-head > div:last-child{ border-right: 0; }
.eltab-head .el-no{ justify-content: center; }
.eltab-head .el-qty, .eltab-head .el-price, .eltab-head .el-supply, .eltab-head .el-vat{ justify-content: flex-end; }
.el-no{
  display:flex; align-items:center; justify-content:center; gap: 2px;
  background: var(--card-2); color: var(--ink-3);
  position: relative; border-right: 1px solid var(--line-soft);
}
.el-numbox{
  display:grid; place-items:center;
  min-width: 22px; height: 22px; padding: 0 5px;
  background: var(--card); border: 1px solid var(--line);
  border-radius: 6px;
  font-family:"JetBrains Mono", monospace; font-size: 11.5px; color: var(--ink-2);
}
.el-rm{
  appearance:none; cursor:pointer; border:0; background:transparent;
  position:absolute; right: 1px; top: 50%; transform: translateY(-50%);
  width: 16px; height: 16px; border-radius: 5px;
  display:none; place-items:center; color: var(--ink-3);
}
.eltab-row:hover .el-rm{ display:grid; }
.el-rm:hover{ background: var(--bg-2); color: var(--bad); }
.el-rm svg{ width: 12px; height: 12px; }
.el-inp{
  appearance:none; outline:0; border:0; background: transparent;
  padding: 0 10px; height: 42px; width: 100%;
  font: 500 13.5px "IBM Plex Sans KR", sans-serif; color: var(--ink);
  border-right: 1px solid var(--line-soft);
}
.el-inp:focus{ background: color-mix(in oklab, var(--accent-soft) 30%, #fff); box-shadow: inset 0 0 0 1.5px var(--accent); }
.el-inp.is-mono{ font-family:"JetBrains Mono", monospace; font-variant-numeric: tabular-nums; }
.el-inp.is-right{ text-align: right; }
.el-inp::placeholder{ color: rgba(31,26,20,.26); font-weight: 400; }
.el-memo.el-inp{ border-right: 0; }
.el-memo-wrap{ position: relative; display:flex; align-items:center; }
.el-memo-wrap .el-memo{ border-right: 0; }
.el-memo-wrap .el-recos{ left: auto; right: 4px; }
.el-codewrap{ position: relative; }
.el-codewrap .el-inp{ width: 100%; padding-right: 30px; }
.el-codewrap .el-recos{ left: 4px; right: auto; top: auto; bottom: -2px; transform: translateY(100%); }
.el-qty-wrap{ position: relative; display:flex; align-items:center; border-right: 1px solid var(--line-soft); }
.el-qty-wrap .el-inp{ border-right: 0; }
.el-recos-qty{ left: 4px; right: auto; top: auto; bottom: -2px; transform: translateY(100%); }
.el-price-wrap{ position: relative; display:flex; align-items:center; border-right: 1px solid var(--line-soft); }
.el-price-wrap .el-inp{ border-right: 0; }
.el-cust-h{ position:relative; display:flex; align-items:center; justify-content:space-between; gap:4px; padding:0 8px 0 10px; border-left:1px solid var(--line-soft); cursor:grab; }
.th-col{ cursor:grab; }
.th-col:active{ cursor:grabbing; }
.th-col:hover{ background:color-mix(in oklab, var(--accent-soft) 40%, var(--card-2)); }
.el-cust-h:active{ cursor:grabbing; }
.el-cust-h:hover{ background:color-mix(in oklab, var(--accent-soft) 40%, var(--card-2)); }
.el-cust-rm{ appearance:none; cursor:pointer; border:0; background:transparent; color:var(--ink-3); width:16px; height:16px; border-radius:4px; display:grid; place-items:center; flex:none; }
.el-cust-rm:hover{ background:var(--bad); color:#fff; }
.el-cust-rm svg{ width:11px; height:11px; }
.el-cust-inp{ border-left:1px solid var(--line-soft); border-right:0; }
.el-cell.el-cust{ color:var(--accent-ink); font-family:"JetBrains Mono",monospace; justify-content:flex-end; border-left:1px solid var(--line-soft); border-right:0; background:color-mix(in oklab, var(--accent-soft) 18%, transparent); }
.eltab-foot .el-cust, .eltab-foot > div:nth-child(n+11){ border-left:1px solid var(--line-soft); }
.eltab-addcol{ margin-top:10px; display:flex; gap:12px; align-items:center; }
.addcol-main{ appearance:none; cursor:pointer; border:1px dashed var(--line); background:transparent; color:var(--ink-2); font:500 12.5px "IBM Plex Sans KR",sans-serif; padding:7px 14px; border-radius:9px; display:inline-flex; align-items:center; gap:5px; transition:all .12s; }
.addcol-main svg{ width:14px; height:14px; }
.addcol-main:hover{ border-color:var(--accent); color:var(--accent-ink); background:color-mix(in oklab, var(--accent-soft) 30%, transparent); }
.addcol-tools{ display:flex; align-items:center; gap:10px; }
.addcol-link{ appearance:none; cursor:pointer; border:0; background:transparent; color:var(--ink-3); font:500 12px "IBM Plex Sans KR",sans-serif; padding:0; transition:color .12s; }
.addcol-link:hover{ color:var(--accent-ink); }
.addcol-link-muted:hover{ color:var(--bad); }
.addcol-sep{ width:1px; height:11px; background:var(--line); }
.field-chips{ display:flex; flex-wrap:wrap; gap:8px; }
.field-chip{ appearance:none; cursor:pointer; border:1px solid var(--line); background:var(--card); color:var(--ink); font:500 13px "IBM Plex Sans KR",sans-serif; padding:8px 14px; border-radius:999px; transition:all .12s; }
.field-chip:hover{ border-color:var(--accent); background:var(--accent-soft); }
.field-chip.is-on{ background:var(--accent); color:#fff; border-color:transparent; }
.addcol-divider{ display:flex; align-items:center; gap:12px; margin:18px 0 6px; color:var(--ink-3); font-size:12px; }
.addcol-divider::before, .addcol-divider::after{ content:""; flex:1; height:1px; background:var(--line); }
.el-no[draggable]{ cursor:grab; }
.el-no[draggable]:active{ cursor:grabbing; }
.el-no[draggable]:hover .el-numbox{ background:var(--accent); color:#fff; border-color:transparent; }
.el-inp.is-formula{ color: var(--accent-ink); font-style: italic; }
.el-recent{ position:absolute; left:4px; bottom:-2px; transform:translateY(100%); z-index:16; display:flex; align-items:center; gap:3px; background:var(--card); border:1px solid var(--line); border-radius:8px; padding:3px 5px; box-shadow:0 8px 20px -10px rgba(31,26,20,.25); }
.er-lbl{ font-size:9.5px; color:var(--accent-ink); font-weight:700; font-family:"JetBrains Mono",monospace; padding:0 2px; }
.er-chip{ appearance:none; cursor:pointer; border:1px solid var(--line); background:var(--bg-2); color:var(--ink); font:500 11px "JetBrains Mono",monospace; padding:2px 7px; border-radius:999px; white-space:nowrap; }
.er-chip:hover{ background:var(--accent); color:#fff; border-color:transparent; }
.entry-main{ display:flex; gap:14px; align-items:stretch; }
.entry-main .eltab{ flex:1; min-width:0; }
.recside{ flex:none; width:286px; border:1px solid var(--line); border-radius:12px; background:var(--card); display:flex; flex-direction:column; overflow:hidden; align-self:stretch; }
.recside-empty{ flex:1; position:relative; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; padding:24px 18px; text-align:center; color:var(--ink-3); font-size:13px; line-height:1.6; }
.rs-emoji{ font-size:28px; opacity:.7; }
.rs-head{ padding:13px 16px 10px; border-bottom:1px solid var(--line-soft); background:var(--card-2); }
.rs-head-top{ display:flex; align-items:flex-start; justify-content:space-between; gap:8px; }
.rs-hide{ appearance:none; cursor:pointer; border:0; background:transparent; color:var(--ink-3); width:24px; height:24px; border-radius:6px; display:grid; place-items:center; flex:none; }
.rs-hide:hover{ background:var(--bg-2); color:var(--ink); }
.rs-hide svg{ width:15px; height:15px; }
.rs-hide-abs{ position:absolute; top:10px; right:10px; }
.rs-toggle{ display:flex; gap:3px; margin-top:9px; background:var(--bg-2); border-radius:8px; padding:3px; }
.rs-toggle button{ flex:1; appearance:none; cursor:pointer; border:0; background:transparent; color:var(--ink-2); font:500 11.5px "IBM Plex Sans KR",sans-serif; padding:5px 4px; border-radius:6px; }
.rs-toggle button.is-on{ background:var(--card); color:var(--ink); box-shadow:0 1px 0 rgba(31,26,20,.04); font-weight:600; }
.recside-show{ flex:none; align-self:stretch; appearance:none; cursor:pointer; border:1px solid var(--line); background:var(--card); color:var(--ink-2); writing-mode:vertical-rl; padding:10px 6px; border-radius:10px; font:500 12px "IBM Plex Sans KR",sans-serif; letter-spacing:.1em; }
.recside-show:hover{ background:var(--card-2); color:var(--ink); }
.rs-title{ font-family:"Gowun Batang",serif; font-weight:700; font-size:16px; color:var(--ink); }
.rs-sub{ font-size:11px; color:var(--ink-3); font-family:"JetBrains Mono",monospace; letter-spacing:.08em; text-transform:uppercase; margin-top:2px; }
.rs-stats{ display:grid; grid-template-columns:repeat(3,1fr); border-bottom:1px solid var(--line-soft); }
.rs-stat{ display:flex; flex-direction:column; align-items:center; gap:3px; padding:11px 6px; border-right:1px solid var(--line-soft); }
.rs-stat:last-child{ border-right:0; }
.rs-stat span{ font-size:10.5px; color:var(--ink-3); }
.rs-stat b{ font-family:"JetBrains Mono",monospace; font-size:14px; color:var(--ink); font-variant-numeric:tabular-nums; }
.rs-stat:first-child b{ color:var(--accent-ink); }
.rs-list{ flex:1; display:flex; flex-direction:column; overflow-y:auto; padding:6px; gap:4px; }
.rs-row{ appearance:none; cursor:pointer; border:1px solid transparent; background:var(--card-2); border-radius:9px; padding:9px 11px; display:grid; grid-template-columns:1fr auto; grid-template-rows:auto auto; gap:2px 8px; text-align:left; transition:border-color .12s, background .12s; }
.rs-row:hover{ border-color:var(--accent); background:color-mix(in oklab,var(--accent-soft) 40%,var(--card)); }
.rs-date{ grid-row:1; font-family:"JetBrains Mono",monospace; font-size:11px; color:var(--ink-3); }
.rs-partner{ grid-row:2; font-size:13px; font-weight:600; color:var(--ink); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.rs-price{ grid-column:2; grid-row:1 / 3; align-self:center; font-family:"JetBrains Mono",monospace; font-weight:700; font-size:15px; color:var(--accent-ink); font-variant-numeric:tabular-nums; }
.rs-won{ font-size:10px; color:var(--ink-3); font-weight:400; margin-left:2px; }
.rs-foot{ padding:8px 14px; border-top:1px solid var(--line-soft); font-size:11px; color:var(--ink-3); text-align:center; background:var(--card-2); }
@media (max-width: 860px){ .entry-main{ flex-direction:column; } .recside{ width:auto; } }
.el-namewrap{ position: relative; display:flex; align-items:center; border-right: 1px solid var(--line-soft); }
.el-codechip{ flex:none; margin-left:6px; padding:1px 6px; border-radius:6px; background: var(--accent-soft); color: var(--accent-ink); font:600 10.5px "JetBrains Mono", monospace; white-space:nowrap; }
.el-namewrap .el-inp{ border-right: 0; padding-right: 26px; }
.el-namewrap.is-nocode{ background: color-mix(in oklab, var(--bad, #d64545) 12%, transparent); box-shadow: inset 0 0 0 1.5px color-mix(in oklab, var(--bad, #d64545) 55%, transparent); border-radius: 6px; }
.el-codechip-miss{ background: color-mix(in oklab, var(--bad, #d64545) 16%, transparent) !important; color: var(--bad, #d64545) !important; }
.el-recos{
  position: absolute; right: 4px; top: 50%; transform: translateY(-50%);
  z-index: 15; display:flex; align-items:center; gap: 4px;
  background: var(--card); border: 1px solid var(--line); border-radius: 8px;
  padding: 4px 6px; box-shadow: 0 10px 24px -12px rgba(31,26,20,.25);
}
.entry-status-seg{ margin-right: 4px; }
.entry-status-seg .seg-item:disabled{ opacity:.4; cursor:not-allowed; }
.entry-status-note{ font-size:11px; color:#B4232A; font-weight:600; align-self:center; }
.el-reco-lbl{ font-size: 10px; color: var(--accent-ink); font-weight: 700; font-family:"JetBrains Mono", monospace; padding: 0 2px; }
.el-reco{
  appearance:none; cursor:pointer; border:1px solid var(--line);
  background: var(--bg-2); color: var(--ink);
  font: 500 12px "IBM Plex Sans KR", sans-serif;
  padding: 4px 9px; border-radius: 999px; white-space: nowrap;
}
.el-reco:hover{ background: var(--accent); color:#fff; border-color: transparent; }
.el-codesearch{
  appearance:none; cursor:pointer; border:0; background:transparent;
  position:absolute; right: 4px; top: 50%; transform: translateY(-50%);
  width: 24px; height: 24px; border-radius: 6px;
  display:grid; place-items:center; color: var(--ink-3);
}
.el-codesearch:hover{ background: var(--bg-2); color: var(--ink); }
.el-codesearch svg{ width: 15px; height: 15px; }
.el-pop{
  position: absolute; top: 100%; left: 0; z-index: 20;
  min-width: 360px;
  background: var(--card); border: 1px solid var(--line); border-radius: 10px;
  box-shadow: 0 20px 40px -16px rgba(31,26,20,.25);
  padding: 4px; margin-top: 2px;
  max-height: 240px; overflow-y: auto;
}
.el-pop-opt{
  appearance:none; cursor:pointer; border:0; background:transparent;
  width: 100%; display:grid; grid-template-columns: 80px 1fr 60px 80px;
  gap: 8px; align-items: center; text-align: left;
  padding: 8px 10px; border-radius: 7px;
  font-size: 13px; color: var(--ink-2);
}
.el-pop-opt:hover{ background: var(--card-2); }
.ep-code{ font-family:"JetBrains Mono", monospace; font-size: 12px; color: var(--ink-3); }
.ep-name{ font-weight: 600; color: var(--ink); }
.ep-spec{ font-size: 12px; color: var(--ink-3); }
.ep-price{ font-family:"JetBrains Mono", monospace; font-size: 12px; text-align: right; color: var(--accent-ink); }
.el-cell{
  display:flex; align-items:center; justify-content: flex-end; padding: 0 10px;
  font: 500 13.5px "JetBrains Mono", monospace; color: var(--accent-ink);
  font-variant-numeric: tabular-nums; border-right: 1px solid var(--line-soft);
}
.el-vat{ cursor: pointer; color: var(--ink-2); }
.el-vat-wrap{ display:flex; align-items:center; border-right: 1px solid var(--line-soft); }
.el-vat-inp{ width:100%; text-align:right; }
.el-vat:hover{ background: var(--bg-2); }
.vat-free{ font-size: 11px; color: var(--ink-3); background: rgba(31,26,20,.06); padding: 2px 7px; border-radius: 999px; }
.eltab-addzone{
  appearance:none; cursor:pointer; border:0;
  width: 100%; padding: 11px 10px; text-align: center;
  background: var(--bg-2); color: var(--ink-3);
  font: 500 12.5px "IBM Plex Sans KR", sans-serif;
  border-bottom: 1px solid var(--line-soft);
  border-top: 1px dashed var(--line);
}
.eltab-addzone:hover{ background: color-mix(in oklab, var(--accent-soft) 40%, var(--bg-2)); color: var(--accent-ink); }
.rowsel-bar{ display:flex; align-items:center; gap:8px; padding:8px 12px; background:var(--accent-soft); border-bottom:1px solid var(--line); }
.rowsel-cnt{ font-size:12.5px; font-weight:600; color:var(--accent-ink); margin-right:4px; }
.eltab-row.row-sel{ background: color-mix(in oklab, var(--accent-soft) 55%, transparent); }
.eltab-row.row-reco{ background: rgba(31,26,20,.05); }
.eltab-row.row-reco .el-unit,
.eltab-row.row-reco .el-price-wrap,
.eltab-row.row-reco .el-supply,
.eltab-row.row-reco .el-vat-wrap,
.eltab-row.row-reco .el-memo-wrap,
.eltab-row.row-reco .el-cell.el-cust,
.eltab-row.row-reco .el-cust-inp{ filter: blur(2.5px); opacity:.5; pointer-events:none; user-select:none; }
.eltab-foot{ background: var(--card-2); }
.eltab-foot > div{ display:flex; align-items:center; padding: 11px 10px; font: 700 13.5px "JetBrains Mono", monospace; color: var(--ink); border-right: 1px solid var(--line-soft); }
.eltab-foot > div:last-child{ border-right: 0; }
.eltab-foot .is-right{ justify-content: flex-end; }
.eltab-foot .el-memo{ color: var(--accent-ink); }
/* 열 세로 구분선 통일 — 헤더·본문·합계 동일 정렬 */
.eltab-row > *{ border-left: 0 !important; border-right: 1px solid var(--line-soft) !important; }
.eltab-row > *:last-child{ border-right: 0 !important; }
.eltab-row > * .el-inp, .eltab-row > * .el-recos{ border-right: 0 !important; }

/* search field (매입처/담당자) */
.srch{ position: relative; }
.srch-input{
  display:flex; align-items:center;
  background: var(--bg-2); border: 1px solid transparent; border-radius: 10px;
  height: 40px; overflow: hidden;
}
.srch-input:focus-within{ background:#fff; border-color: var(--ink); }
.srch-input input{
  flex:1; appearance:none; border:0; outline:0; background:transparent;
  height:100%; padding: 0 12px; font: 500 14px "IBM Plex Sans KR", sans-serif; color: var(--ink);
}
.srch-input input::placeholder{ color: rgba(31,26,20,.3); font-weight: 400; }
.srch-code{ flex:none; margin: 0 4px 0 10px; padding:2px 8px; border-radius:999px; background: var(--accent-soft); color: var(--accent-ink); font:600 11.5px "JetBrains Mono", monospace; white-space:nowrap; }
.srch-btn{
  appearance:none; cursor:pointer; border:0; background:transparent;
  width: 38px; height: 100%; display:grid; place-items:center; color: var(--ink-3); flex:none;
}
.srch-btn:hover{ color: var(--ink); }
.srch-btn svg{ width: 18px; height: 18px; }
.srch-pop{
  position: absolute; top: 100%; left: 0; right: 0; z-index: 20;
  background: var(--card); border: 1px solid var(--line); border-radius: 10px;
  box-shadow: 0 20px 40px -16px rgba(31,26,20,.25);
  padding: 4px; margin-top: 4px; max-height: 220px; overflow-y: auto;
}
.srch-opt{
  appearance:none; cursor:pointer; border:0; background:transparent;
  width: 100%; text-align: left; padding: 9px 12px; border-radius: 7px;
  font: 500 13.5px "IBM Plex Sans KR", sans-serif; color: var(--ink-2);
}
.srch-opt:hover, .srch-opt.is-hi{ background: var(--card-2); color: var(--ink); }

/* picker overlay (매입처/품목 검색 팝업) */
.pick-root{ position: fixed; inset: 0; z-index: 70; display: grid; place-items: center; padding: 24px; }
.pick-scrim{ position: absolute; inset: 0; background: rgba(31,26,20,.5); backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px); }
.pick-box{
  position: relative; width: min(540px, 100%); max-height: 70vh;
  background: var(--card); border: 1px solid var(--line); border-radius: 16px;
  box-shadow: 0 40px 80px -20px rgba(31,26,20,.4);
  display: flex; flex-direction: column; overflow: hidden;
  animation: modalIn .2s cubic-bezier(.2,.7,.3,1);
}
.pick-head{ display:flex; align-items:center; justify-content:space-between; padding: 16px 20px 12px; border-bottom: 1px solid var(--line-soft); }
.pick-head h3{ font-family:"Gowun Batang", serif; font-weight:700; font-size: 18px; margin: 0; }
.pick-search{ display:flex; align-items:center; gap: 10px; padding: 12px 20px; border-bottom: 1px solid var(--line-soft); }
.pick-ico{ width: 20px; height: 20px; color: var(--ink-3); display:grid; place-items:center; }
.pick-ico svg{ width: 20px; height: 20px; }
.pick-search input{
  flex:1; appearance:none; border:0; outline:0; background:transparent;
  font: 500 15px "IBM Plex Sans KR", sans-serif; color: var(--ink);
}
.pick-list{ overflow-y: auto; flex:1; padding: 6px; }
.pick-empty{ padding: 30px; text-align: center; color: var(--ink-3); font-size: 13.5px; }
.pick-opt{
  appearance:none; cursor:pointer; border:0; background:transparent;
  width: 100%; display:grid; grid-template-columns: 90px 1fr auto auto; gap: 10px;
  align-items: center; text-align: left; padding: 11px 12px; border-radius: 9px;
  font-size: 14px; color: var(--ink-2);
}
.pick-opt:hover, .pick-opt.is-hi{ background: var(--card-2); }
.pick-opt .po-code{ font-family:"JetBrains Mono", monospace; font-size: 12px; color: var(--ink-3); }
.pick-opt .po-name{ font-weight: 600; color: var(--ink); }
.pick-opt .po-spec{ font-size: 12.5px; color: var(--ink-3); }
.pick-opt .po-price{ font-family:"JetBrains Mono", monospace; font-size: 12.5px; color: var(--accent-ink); }
.pick-foot{ padding: 10px 20px; border-top: 1px solid var(--line-soft); background: var(--card-2); font-size: 11.5px; color: var(--ink-3); font-family:"JetBrains Mono", monospace; }
.entry-total{ font-family:"Gowun Batang", serif; font-weight: 700; font-size: 17px; color: var(--accent-ink); }
.date3{ display:flex; align-items:center; gap: 6px; }
.date-slash{ color: var(--ink-3); }
.date-sel{
  appearance:none; outline:0; cursor:pointer;
  background: var(--bg-2); border: 1px solid transparent; border-radius: 9px;
  height: 40px; padding: 0 24px 0 12px;
  font: 500 14px "JetBrains Mono", monospace; color: var(--ink);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%238B8273' stroke-width='1.8' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 7px center;
}
.date-sel:focus{ background-color:#fff; border-color: var(--ink); }
.date-day{ background-color:#FBEFE6; border-color: color-mix(in oklab, var(--accent) 40%, transparent); }
.date-txt{
  appearance:none; outline:0;
  background: var(--bg-2); border: 1px solid transparent; border-radius: 9px;
  height: 40px; width: 52px; padding: 0 8px; text-align:center;
  font: 500 14px "JetBrains Mono", monospace; color: var(--ink);
  transition: border-color .15s, background .15s;
}
.date-txt-y{ width: 68px; }
.date-txt::placeholder{ color: rgba(31,26,20,.3); }
.date-txt:focus{ background-color:#fff; border-color: var(--ink); }
input.date-day{ background-color:#FBEFE6; border-color: color-mix(in oklab, var(--accent) 40%, transparent); }
.date-cal{
  appearance:none; cursor:pointer; border: 1px solid var(--line); background: var(--card);
  width: 40px; height: 40px; border-radius: 9px; display:grid; place-items:center; color: var(--ink-2); flex:none;
}
.date-cal:hover{ background: var(--card-2); color: var(--ink); }
.date-cal svg{ width: 18px; height: 18px; }
.date-native{ width: 0; height: 0; padding: 0; border: 0; opacity: 0; position: absolute; pointer-events: none; }

/* picker table */
.pick-box-lg{ width: min(680px, 100%); }
.pick-table{ display:flex; flex-direction:column; overflow:hidden; flex:1; min-height: 0; }
.pick-trow{ display:grid; align-items:center; gap: 10px; padding: 9px 16px; }
.pick-thead{ background: var(--card-2); border-bottom: 1px solid var(--line); font-family:"JetBrains Mono", monospace; font-size: 10.5px; letter-spacing: .04em; color: var(--ink-3); }
.pick-tbody{ overflow-y: auto; flex:1; }
.pick-opt{ appearance:none; cursor:pointer; border:0; background:transparent; width:100%; text-align:left; border-bottom: 1px solid var(--line-soft); font-size: 13.5px; color: var(--ink-2); }
.pick-opt:hover, .pick-opt.is-hi{ background: var(--card-2); }
.pk-cell{ min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pk-cell.is-right{ text-align: right; justify-self: end; }
.pk-cell.is-strong{ font-weight: 600; color: var(--ink); }
.pk-cell.is-mono{ font-family:"JetBrains Mono", monospace; font-size: 12.5px; }
.pick-foot{ display:flex; align-items:center; justify-content:space-between; gap: 12px; }
.pick-foot-cnt{ font-size: 11.5px; color: var(--ink-3); font-family:"JetBrains Mono", monospace; white-space:nowrap; }
.pick-new{
  appearance:none; cursor:pointer; border:0;
  background: var(--accent); color:#fff; font: 600 13px "IBM Plex Sans KR", sans-serif;
  padding: 8px 16px; border-radius: 9px;
}
.pick-new:hover{ background: color-mix(in oklab, var(--accent) 88%, black); }
.modal-newitem{ width: min(560px, 100%); }
.ni-body{ padding: 20px 26px 8px; }
.ni-wide{ width: min(780px, 96vw); max-width: none; }
.ni-full{ padding: 18px 26px 6px; max-height: 62vh; overflow-y: auto; display: grid; grid-template-columns: 1fr 1fr; gap: 14px 16px; }
.ni-full .fset{ border: 1px solid var(--line-soft); border-radius: 12px; padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.ni-full .fset-wide{ grid-column: 1 / -1; }
.fset-h{ font: 600 11px "JetBrains Mono", monospace; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-3); margin: 0; }
.fset-grid{ display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 14px; }
.fld-area{ appearance: none; outline: 0; width: 100%; background: var(--bg-2); border: 1px solid transparent; border-radius: 10px; padding: 10px 12px; font: 500 13.5px "IBM Plex Sans KR", sans-serif; color: var(--ink); resize: vertical; }
.fld-area:focus{ background: #fff; border-color: var(--ink); }
.margin-display{ display: flex; align-items: center; min-height: 38px; padding: 0 12px; border-radius: 10px; background: var(--bg-2); font: 500 13px "JetBrains Mono", monospace; color: var(--ink-2); }
.margin-display.is-warn{ color: var(--bad); background: #FBEAE5; }

.ni-grid{ display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px 16px; }
.entry-sub{ font-size: 12px; color: var(--ink-3); font-family:"JetBrains Mono", monospace; }
.el-reco-map{ background: color-mix(in oklab, var(--accent) 14%, var(--card)); border-color: color-mix(in oklab, var(--accent) 40%, transparent); color: var(--accent-ink); font-weight: 600; }
.el-reco-spec{ margin-left:5px; font-size:10.5px; color:var(--ink-3); font-family:"JetBrains Mono",monospace; }
.el-reco-map:hover{ background: var(--accent); color: #fff; border-color: transparent; }

/* 매입처별 자주 쓰는 품목 매핑 모달 */
.modal-map{ width: min(720px, 100%); }
.map-search{
  margin: 0 26px; display:flex; align-items:center; gap:10px;
  background: var(--bg-2); border: 1px solid transparent; border-radius: 10px;
  padding: 0 14px; height: 42px; flex: none;
}
.map-search:focus-within{ background:#fff; border-color: var(--ink); }
.map-search input{ flex:1; appearance:none; border:0; outline:0; background:transparent; height:100%; font: 500 14px "IBM Plex Sans KR", sans-serif; color: var(--ink); }
.map-search .ls-icon{ width:18px; height:18px; color: var(--ink-3); }
.map-body{ padding: 16px 26px 8px; overflow-y: auto; flex: 1; display:flex; flex-direction:column; gap: 18px; }
.map-empty{ padding: 50px 20px; text-align:center; color: var(--ink-2); font-size: 14px; line-height: 1.7; }
.map-empty-sub{ font-size: 12.5px; color: var(--ink-3); }
.map-empty b{ color: var(--accent-ink); }
.map-group-h{ display:flex; align-items:center; gap: 8px; margin-bottom: 8px; }
.mg-partner{ font-family:"Gowun Batang", serif; font-weight:700; font-size: 15px; color: var(--ink); }
.mg-cnt{ font-size: 11px; color: var(--ink-3); background: var(--bg-2); padding: 2px 8px; border-radius: 999px; }
.map-list{ display:flex; flex-direction:column; gap: 4px; }
.map-table{ display:flex; flex-direction:column; }
.map-trow{ display:grid; grid-template-columns: minmax(90px,1fr) minmax(110px,1.2fr) minmax(110px,1.2fr) 80px 60px 30px; align-items:center; gap:10px; padding: 8px 10px; border-bottom: 1px solid var(--line-soft); font-size: 13px; }
.map-thead{ font-family:"JetBrains Mono", monospace; font-size: 10.5px; letter-spacing:.04em; color: var(--ink-3); background: var(--card-2); border-radius: 8px; position: sticky; top: 0; }
.map-group-row{ display:flex; align-items:center; gap: 8px; padding: 12px 10px 4px; }
.mt-partner{ color: var(--ink-2); }
.mt-raw{ font-weight: 600; color: var(--ink); }
.mt-name{ color: var(--ink); }
.mt-spec, .mt-unit{ color: var(--ink-3); font-size: 12.5px; }
.map-del{ appearance:none; cursor:pointer; border:0; background:transparent; color: var(--ink-3); width: 26px; height: 26px; border-radius: 6px; display:grid; place-items:center; flex:none; }
.map-del:hover{ background: var(--bg-2); color: var(--bad); }
.map-del svg{ width: 15px; height: 15px; }
.fset-err{ font-size: 12.5px; color: var(--bad); }
.btn-kbd{
  display:inline-grid; place-items:center; min-width: 22px; height: 18px; padding: 0 5px;
  margin-left: 7px; border-radius: 5px;
  background: rgba(255,255,255,.22); border: 1px solid rgba(255,255,255,.28);
  font-family:"JetBrains Mono", monospace; font-size: 10.5px; letter-spacing: .02em;
}
.modal-sub b{ color: var(--ink); font-weight: 600; }

/* responsive */
@media (max-width: 1200px){ .kpis{ grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 880px){
  .layout{ grid-template-columns: 72px 1fr; }
  .kpis{ grid-template-columns: 1fr; }
  .detail-meta{ grid-template-columns: 1fr; }
  .entry-grid{ grid-template-columns: 1fr; }
}
`;

(function injectCss(){
  if (document.getElementById('sales-css')) return;
  const s = document.createElement('style');
  s.id = 'sales-css';
  s.textContent = css;
  document.head.appendChild(s);
})();

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
