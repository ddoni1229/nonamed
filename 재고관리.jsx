// 품목리스트.jsx — nonamed ERP 품목 관리 (테이블 + 등록/수정 모달 + 화면설정 + 가격일괄수정)

const { useState, useEffect, useMemo, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "formLayout": "2열",
  "afterSave": "목록으로",
  "showHelper": true
}/*EDITMODE-END*/;


/* ─────────────────────────────────────────────
   Sketch logo
   ───────────────────────────────────────────── */

/* ─────────────────────────────────────────────
   Icons
   ───────────────────────────────────────────── */
const I = {
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
  plus:     <svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  upload:   <svg viewBox="0 0 24 24" fill="none"><path d="M12 16V4M7 9l5-5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  download: <svg viewBox="0 0 24 24" fill="none"><path d="M12 4v12M7 11l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  check:    <svg viewBox="0 0 24 24" fill="none"><path d="M5 12l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  trash:    <svg viewBox="0 0 24 24" fill="none"><path d="M5 7h14M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M6 7l1 12a1 1 0 001 1h8a1 1 0 001-1l1-12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  edit:     <svg viewBox="0 0 24 24" fill="none"><path d="M4 20h4l10-10-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M13 6l4 4" stroke="currentColor" strokeWidth="1.6"/></svg>,
  copy:     <svg viewBox="0 0 24 24" fill="none"><rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" stroke="currentColor" strokeWidth="1.6"/></svg>,
  reset:    <svg viewBox="0 0 24 24" fill="none"><path d="M3 12a9 9 0 1015 4M3 4v6h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  close:    <svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  cog:      <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/><path d="M19.4 15a1.7 1.7 0 00.34 1.87l.06.06a2 2 0 11-2.83 2.83l-.06-.06A1.7 1.7 0 0015 19.4a1.7 1.7 0 00-1 1.55V21a2 2 0 11-4 0v-.09A1.7 1.7 0 009 19.4a1.7 1.7 0 00-1.87.34l-.06.06A2 2 0 114.24 16.97l.06-.06A1.7 1.7 0 004.6 15a1.7 1.7 0 00-1.55-1H3a2 2 0 110-4h.09A1.7 1.7 0 004.6 9a1.7 1.7 0 00-.34-1.87l-.06-.06A2 2 0 117.03 4.24l.06.06A1.7 1.7 0 009 4.6a1.7 1.7 0 001-1.55V3a2 2 0 114 0v.09A1.7 1.7 0 0015 4.6a1.7 1.7 0 001.87-.34l.06-.06a2 2 0 112.83 2.83l-.06.06A1.7 1.7 0 0019.4 9a1.7 1.7 0 001.55 1H21a2 2 0 110 4h-.09a1.7 1.7 0 00-1.51 1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  up:       <svg viewBox="0 0 24 24" fill="none"><path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  down:     <svg viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  drag:     <svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="6" r="1.4" fill="currentColor"/><circle cx="15" cy="6" r="1.4" fill="currentColor"/><circle cx="9" cy="12" r="1.4" fill="currentColor"/><circle cx="15" cy="12" r="1.4" fill="currentColor"/><circle cx="9" cy="18" r="1.4" fill="currentColor"/><circle cx="15" cy="18" r="1.4" fill="currentColor"/></svg>,
  price:    <svg viewBox="0 0 24 24" fill="none"><path d="M3 7l5-3 13 5-5 11-13-5V7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><circle cx="9" cy="9" r="1.4" fill="currentColor"/></svg>,
  history:  <svg viewBox="0 0 24 24" fill="none"><path d="M3 12a9 9 0 109-9 9 9 0 00-6.5 2.7M3 5v4h4M12 7v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

/* ─────────────────────────────────────────────
   Data
   ───────────────────────────────────────────── */

const UNIT_OPTIONS = ["개", "박스", "kg", "g", "L", "병", "캔", "포"];
const TAX_OPTIONS = ["과세", "면세"];
const STATUS_OPTIONS = ["판매중", "단종", "품절"];
const ITEM_FIELDS = [
  { key: "code",   label: "품목코드",  required: true, mono: true, placeholder: "자동 생성됨" },
  { key: "name",   label: "품목명",    required: true, placeholder: "예: 양배추" },
  { key: "spec",   label: "규격",      placeholder: "예: 1kg, 500g, 5입" },
  { key: "unit",   label: "단위" },
  { key: "stock",  label: "현재고",    required: true, mono: true },
  { key: "safety", label: "안전재고",  mono: true },
  { key: "cost",   label: "재고단가",  mono: true, money: true },
  { key: "storage",label: "보관방법" },
  { key: "status", label: "상태",      kind: "segment", options: STATUS_OPTIONS },
];
const ITEM_EXTRA_SLOTS = [
  ...[1,2,3,4,5].map(n => ({ key: "xt" + n, label: "문자형" + n, type: "text" })),
  ...[1,2,3,4,5].map(n => ({ key: "xn" + n, label: "숫자형" + n, type: "num" })),
  ...[1,2,3,4,5].map(n => ({ key: "xs" + n, label: "검색형" + n, type: "lookup" })),
];
const AFTER_SAVE_OPTIONS = ["목록으로", "계속 등록"];
const STOCK_VIEW_TABS = ["현황", "변동표", "수불부", "조정"];

/* 기간 프리셋 (매입관리 조회와 동일) */
const STOCK_PERIODS = ["오늘", "이번 주", "이번 달", "지난 달", "올해", "기본"];
const STOCK_TODAY = new Date().toISOString().slice(0, 10);
function clampDateStr(v){ if(!v) return v; const p = v.split("-"); if(p[0] && p[0].length > 4) p[0] = p[0].slice(0, 4); return p.join("-"); }
function stockPeriodRange(period, custom) {
  const d = new Date(STOCK_TODAY + "T00:00:00");
  const iso = (x) => x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
  const y = d.getFullYear(), m = d.getMonth();
  if (period === "오늘") return { from: STOCK_TODAY, to: STOCK_TODAY };
  if (period === "이번 주") { const s = new Date(d); s.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return { from: iso(s), to: STOCK_TODAY }; }
  if (period === "이번 달") return { from: iso(new Date(y, m, 1)), to: iso(new Date(y, m + 1, 0)) };
  if (period === "지난 달") return { from: iso(new Date(y, m - 1, 1)), to: iso(new Date(y, m, 0)) };
  if (period === "올해") return { from: y + "-01-01", to: y + "-12-31" };
  return custom || { from: "", to: "" };
}

/* 입·출고 변동 이력 — 매입·매출 전표(공유 저장소)에서 집계. 전표가 아직 없으면 목업 이력으로 대체 */
function docsToMoves(items, shared, range) {
  const P = shared && shared.매입, S = shared && shared.매출;
  if (!P && !S && !(shared && shared.조정 && shared.조정.length)) return null;
  const inRange = (dt) => (!range.from || dt >= range.from) && (!range.to || dt <= range.to);
  const norm = (s) => String(s || "").replace(/\s+/g, "").replace(/\(.*?\)/g, "").toLowerCase();
  const byName = new Map(items.map(it => [norm(it.name), it]));
  const byCode = new Map(items.map(it => [norm(it.code), it]));
  const find = (label) => { const n = norm(label); if (!n) return null; return byCode.get(n) || byName.get(n) || items.find(it => { const m = norm(it.name); return m && (m.indexOf(n) === 0 || n.indexOf(m) === 0); }) || null; };
  const out = [];
  const push = (docs, type, refPre) => (docs || []).forEach(d => {
    if (!d.date || !inRange(String(d.date).slice(0, 10))) return;
    (d.lines || []).forEach((l, i) => {
      const it = find(l.item); const q = Number(l.qty) || 0;
      if (!it || !q) return;
      out.push({ id: d.id + "-" + i, date: d.date, itemId: it.id, type, qty: Math.abs(q), ref: refPre + " " + d.id, partner: d.partner || "", by: "" });
    });
  });
  push(P, "입고", "매입"); push(S, "출고", "매출");
  (shared.조정 || []).forEach(d => {
    if (!d.date || !inRange(String(d.date).slice(0, 10))) return;
    const it = items.find(x => x.id === d.itemId) || find(d.item); const q = Number(d.qty) || 0;
    if (!it || !q) return;
    out.push({ id: d.id, date: d.date, itemId: it.id, type: "조정", qty: q, ref: "조정 " + d.id + (d.reason ? " · " + d.reason : ""), partner: "", by: d.by || "" });
  });
  return out.sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : a.id < b.id ? -1 : 1);
}

/* 재고 조정 전표 — localStorage 에 쌓이고 변동표·수불부에 "조정"으로 집계 */
const ADJ_DOC_KEY = "nonamed.docs.adjust.v1";
function readAdjDocs() { try { const v = JSON.parse(localStorage.getItem(ADJ_DOC_KEY)); return Array.isArray(v) ? v : []; } catch (e) { return []; } }
function writeAdjDocs(docs) { try { localStorage.setItem(ADJ_DOC_KEY, JSON.stringify(docs)); } catch (e) {} window.dispatchEvent(new CustomEvent("nonamed:docs", { detail: { kind: "조정" } })); }
const ADJ_REASONS = ["실사 차이", "파손·폐기", "분실", "샘플 사용", "기타"];

function AdjustModal({ open, items, onSave, onClose }) {
  const [itemId, setItemId] = useState("");
  const [date, setDate] = useState(STOCK_TODAY);
  const [dir, setDir] = useState("+");
  const [qty, setQty] = useState("");
  const [reason, setReason] = useState(ADJ_REASONS[0]);
  const [memo, setMemo] = useState("");
  const [q, setQ] = useState("");
  useEffect(() => { if (open) { setItemId(""); setDate(STOCK_TODAY); setDir("+"); setQty(""); setReason(ADJ_REASONS[0]); setMemo(""); setQ(""); } }, [open]);
  useEffect(() => {
    if (!open) return;
    const fn = (e) => { if (e.key === "Escape") { e.stopImmediatePropagation(); onClose(); } else if (e.key === "F8") { e.stopImmediatePropagation(); e.preventDefault(); submit(); } };
    window.addEventListener("keydown", fn, true);
    return () => window.removeEventListener("keydown", fn, true);
  });
  if (!open) return null;
  const it = items.find(x => x.id === itemId);
  const n = Math.abs(Number(qty) || 0);
  const signed = dir === "+" ? n : -n;
  const after = it ? Math.max(0, (Number(it.stock) || 0) + signed) : null;
  const list = items.filter(x => { const s = q.trim().toLowerCase(); return !s || [x.code, x.name, x.spec].some(v => (v || "").toLowerCase().includes(s)); }).slice(0, 8);
  const submit = () => { if (!it || !n) return; onSave({ itemId: it.id, item: it.name, date, qty: signed, reason, memo }); };
  return (
    <div className="modal-root" role="dialog" aria-modal="true">
      <div className="modal-scrim" onClick={onClose} />
      <div className="modal modal-sm adj-modal">
        <header className="modal-head">
          <div><h2 className="modal-title">재고 조정</h2><div className="modal-sub">조정 전표가 추가되고 변동표·수불부에 "조정"으로 쌓입니다.</div></div>
          <button type="button" className="modal-close" onClick={onClose}>{I.close}</button>
        </header>
        <div className="adj-body">
          <label className="fld"><span className="fld-label">품목</span>
            {it ? (
              <div className="adj-picked"><span className="adj-code">{it.code}</span><b>{it.name}</b><span className="adj-spec">{it.spec}</span><span className="adj-stock">현재 재고 {formatMoney(it.stock)} {it.unit}</span><button type="button" className="btn-ghost btn-sm" onClick={() => setItemId("")}>변경</button></div>
            ) : (
              <div className="adj-pick">
                <input className="fld-input" autoFocus placeholder="품목코드·품목명 검색" value={q} onChange={(e) => setQ(e.target.value)} />
                <div className="adj-list">{list.map(x => <button key={x.id} type="button" className="adj-opt" onClick={() => setItemId(x.id)}><span className="adj-code">{x.code}</span><span>{x.name}</span><span className="adj-spec">{x.spec}</span><span className="adj-stock">{formatMoney(x.stock)} {x.unit}</span></button>)}{list.length === 0 ? <div className="adj-empty">검색 결과가 없어요</div> : null}</div>
              </div>
            )}
          </label>
          <div className="adj-row">
            <label className="fld"><span className="fld-label">조정일</span><input type="date" className="fld-input is-mono" value={date} onChange={(e) => setDate(clampDateStr(e.target.value))} /></label>
            <label className="fld"><span className="fld-label">증감</span>
              <div className="seg adj-seg"><button type="button" className={`seg-item ${dir === "+" ? "is-on" : ""}`} onClick={() => setDir("+")}>+ 증가</button><button type="button" className={`seg-item ${dir === "-" ? "is-on" : ""}`} onClick={() => setDir("-")}>− 감소</button></div>
            </label>
            <label className="fld"><span className="fld-label">수량</span><input type="number" min="0" className="fld-input is-mono" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="0" /></label>
          </div>
          <div className="adj-row">
            <SelectField label="사유" value={reason} onChange={setReason} options={ADJ_REASONS} />
            <label className="fld"><span className="fld-label">비고</span><input className="fld-input" value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="선택" /></label>
          </div>
          {it && n ? <div className="adj-preview">{formatMoney(it.stock)} → <b>{formatMoney(after)}</b> {it.unit} <span className={signed > 0 ? "sv-in" : "sv-out"}>({signed > 0 ? "+" : "−"}{formatMoney(n)})</span></div> : null}
        </div>
        <footer className="modal-foot">
          <div className="ff-left"></div>
          <div className="ff-right">
            <button type="button" className="btn-ghost" onClick={onClose}>닫기</button>
            <button type="button" className="btn-primary" disabled={!it || !n} onClick={submit}>조정 저장 <kbd className="btn-kbd">F8</kbd></button>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* 입·출고 변동 이력 (결정적 목업) — 전표 연동 이전 대체값 */
function buildStockMoves(items, range) {
  const out = [];
  const ym = (range.from || range.to || STOCK_TODAY).slice(0, 7);
  const inRange = (dt) => (!range.from || dt >= range.from) && (!range.to || dt <= range.to);
  const REFS_IN = ["매입 PO-", "반품입고 RT-"], REFS_OUT = ["매출 SO-", "폐기 WS-"];
  items.forEach((it, i) => {
    const seed = (i * 7 + 3);
    const n = 3 + (seed % 4);
    for (let k = 0; k < n; k++) {
      const day = String(1 + ((seed * (k + 2) * 5) % 28)).padStart(2, "0");
      const t = (seed + k) % 5;
      const type = t === 4 ? "조정" : (t % 2 === 0 ? "입고" : "출고");
      const base = Math.max(1, Math.round((Number(it.stock) || 10) * (0.15 + ((seed + k) % 4) * 0.1)));
      const qty = type === "조정" ? ((seed + k) % 2 ? -1 : 1) * Math.max(1, Math.round(base / 3)) : base;
      const ref = type === "입고" ? REFS_IN[k % 2] + String(1000 + i * 7 + k) : type === "출고" ? REFS_OUT[k % 2] + String(2000 + i * 5 + k) : "실사 조정";
      out.push({ id: it.id + "-" + k, date: ym + "-" + day, itemId: it.id, type, qty, ref, partner: type === "입고" ? it.partner : type === "출고" ? PARTNERS[(i + k) % PARTNERS.length] : "", by: ["김예진", "박동훈", "이수민"][(i + k) % 3] });
    }
  });
  return out.filter(m => inRange(m.date)).sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : a.id < b.id ? -1 : 1);
}
/* 기말재고 = 현재 재고(it.stock) 로 보고, 기초 = 기말 − 입고 + 출고 − 조정 으로 역산.
   전표 연동 시 기초가 음수가 되면 0으로 보정하고 기말을 그에 맞게 올린다(재고가 바닥을 치지 않도록). */
function stockMoveSummary(it, moves) {
  let inQ = 0, outQ = 0, adj = 0;
  moves.filter(m => m.itemId === it.id).forEach(m => { if (m.type === "입고") inQ += m.qty; else if (m.type === "출고") outQ += m.qty; else adj += m.qty; });
  let end = Number(it.stock) || 0;
  let open = end - inQ + outQ - adj;
  if (open < 0) { end += -open; open = 0; }
  return { open, inQ, outQ, adj, end };
}

const PARTNERS = ["한양식자재", "송파유통", "동대문푸드", "마포정육점", "성수냉동", "종로식자재마트", "강서물산", "광진수산"];

const INITIAL_ITEMS = [
  { id:"I-0001", code:"VG-001",  name:"양배추",        spec:"1kg",     category:"채소 > 엽채류",   unit:"kg",  cost:1200,  price:1800,  stock:48,  safety:20, status:"판매중", tax:"면세", partner:"한양식자재",     barcode:"8801234500011", expiry:"7일",  storage:"냉장 0~4℃",  note:"국내산",       updated:"2026-05-25" },
  { id:"I-0002", code:"VG-002",  name:"백김치",        spec:"500g",    category:"가공식품 > 김치", unit:"개",  cost:4800,  price:5200,  stock:32,  safety:15, status:"판매중", tax:"면세", partner:"한양식자재",     barcode:"8801234500028", expiry:"30일", storage:"냉장 0~4℃",  note:"",            updated:"2026-05-26" },
  { id:"I-0003", code:"NL-001",  name:"신라면",        spec:"5입",     category:"가공식품 > 라면", unit:"박스", cost:3600,  price:4500,  stock:12,  safety:20, status:"판매중", tax:"과세", partner:"송파유통",       barcode:"8801043033006", expiry:"6개월",storage:"실온",       note:"품절 주의",    updated:"2026-05-24" },
  { id:"I-0004", code:"MT-001",  name:"한우 등심",      spec:"500g",    category:"육류 > 한우",     unit:"kg",  cost:48000, price:62000, stock:6,   safety:5,  status:"판매중", tax:"면세", partner:"마포정육점",     barcode:"",              expiry:"3일",  storage:"냉장 0~2℃",  note:"1++ 등급",     updated:"2026-05-27" },
  { id:"I-0005", code:"MT-002",  name:"삼겹살",        spec:"1kg",     category:"육류 > 돼지",     unit:"kg",  cost:14000, price:18900, stock:14,  safety:10, status:"판매중", tax:"면세", partner:"마포정육점",     barcode:"",              expiry:"3일",  storage:"냉장 0~2℃",  note:"",            updated:"2026-05-26" },
  { id:"I-0006", code:"SF-001",  name:"새우 (대)",      spec:"500g",    category:"수산물 > 갑각류", unit:"kg",  cost:18000, price:24000, stock:8,   safety:6,  status:"판매중", tax:"면세", partner:"광진수산",       barcode:"",              expiry:"30일", storage:"냉동 -18℃",  note:"베트남산",     updated:"2026-05-23" },
  { id:"I-0007", code:"OI-001",  name:"식용유 (콩)",    spec:"1.8L",    category:"가공식품 > 유지", unit:"병",  cost:5200,  price:6900,  stock:24,  safety:12, status:"판매중", tax:"과세", partner:"동대문푸드",     barcode:"8801007033219", expiry:"18개월",storage:"실온",      note:"",            updated:"2026-05-20" },
  { id:"I-0008", code:"RC-001",  name:"백미",          spec:"20kg",    category:"곡물",            unit:"포",  cost:48000, price:62000, stock:5,   safety:3,  status:"판매중", tax:"면세", partner:"종로식자재마트", barcode:"",              expiry:"12개월",storage:"실온 건조",  note:"국내산",       updated:"2026-05-18" },
  { id:"I-0009", code:"SP-001",  name:"고추장",        spec:"3kg",     category:"가공식품 > 장류", unit:"통",  cost:11000, price:14500, stock:18,  safety:8,  status:"판매중", tax:"과세", partner:"동대문푸드",     barcode:"8801043501293", expiry:"24개월",storage:"실온",      note:"",            updated:"2026-05-22" },
  { id:"I-0010", code:"DR-001",  name:"콜라",          spec:"500ml",   category:"음료",            unit:"캔",  cost:600,   price:1200,  stock:120, safety:48, status:"판매중", tax:"과세", partner:"송파유통",       barcode:"8801056100016", expiry:"9개월", storage:"실온",      note:"",            updated:"2026-05-19" },
  { id:"I-0011", code:"DR-002",  name:"보리음료",      spec:"500ml",   category:"음료",            unit:"병",  cost:800,   price:1400,  stock:0,   safety:24, status:"품절",   tax:"과세", partner:"송파유통",       barcode:"",              expiry:"6개월", storage:"실온",      note:"단가 재계약 예정", updated:"2026-05-15" },
  { id:"I-0012", code:"VG-003",  name:"대파",          spec:"500g",    category:"채소 > 양념채소", unit:"단",  cost:2200,  price:3000,  stock:30,  safety:15, status:"판매중", tax:"면세", partner:"한양식자재",     barcode:"",              expiry:"7일",  storage:"냉장 0~4℃",  note:"",            updated:"2026-05-26" },
  { id:"I-0013", code:"SF-002",  name:"고등어",        spec:"마리",     category:"수산물 > 어류",   unit:"마리",cost:3500,  price:5500,  stock:20,  safety:10, status:"판매중", tax:"면세", partner:"광진수산",       barcode:"",              expiry:"3일",  storage:"냉장 0~2℃",  note:"노르웨이산",   updated:"2026-05-25" },
  { id:"I-0014", code:"SP-002",  name:"참기름",        spec:"320ml",   category:"가공식품 > 유지", unit:"병",  cost:6800,  price:9200,  stock:14,  safety:8,  status:"판매중", tax:"과세", partner:"동대문푸드",     barcode:"8801007088201", expiry:"12개월",storage:"실온",      note:"",            updated:"2026-05-21" },
  { id:"I-0015", code:"FR-001",  name:"닭가슴살 (냉동)",spec:"1kg",     category:"육류 > 닭",       unit:"kg",  cost:7800,  price:10500, stock:22,  safety:12, status:"판매중", tax:"면세", partner:"성수냉동",       barcode:"",              expiry:"6개월", storage:"냉동 -18℃",  note:"",            updated:"2026-05-24" },
];
INITIAL_ITEMS.length = 0; // 샘플 데이터 제거(배포용)

/* ─────────────────────────────────────────────
   Column definitions
   ───────────────────────────────────────────── */
const ALL_COLUMNS = [
  { key:"code",    label:"품목코드", width:"110px",                kind:"mono" },
  { key:"name",    label:"품목명",   width:"minmax(180px, 1.6fr)", kind:"name", locked:true },
  { key:"spec",    label:"규격",     width:"110px",                kind:"text" },
  { key:"unit",    label:"단위",     width:"70px",                 kind:"text" },
  { key:"stock",   label:"현재고",   width:"100px",                kind:"stock" },
  { key:"safety",  label:"안전재고", width:"100px",                kind:"num" },
  { key:"cost",    label:"재고단가", width:"110px",                kind:"price" },
  { key:"storage", label:"보관",     width:"130px",                kind:"text" },
  { key:"updated", label:"최종반영", width:"110px",                kind:"text" },
  { key:"status",  label:"상태",     width:"90px",                 kind:"chip" },
];

const DEFAULT_VISIBLE_COLS = ["code","name","spec","unit","stock","safety","cost","status"];
/* 탭별 개별 양식(화면설정) 열 정의 */
const MOVE_COLS = [
  { key:"code", label:"품목코드", width:"110px", kind:"mono" }, { key:"name", label:"품목명", width:"minmax(180px,1.6fr)", kind:"name", locked:true },
  { key:"spec", label:"규격", width:"90px", kind:"text" }, { key:"unit", label:"단위", width:"64px", kind:"text" },
  { key:"open", label:"기초재고", width:"96px", kind:"num" }, { key:"inQ", label:"입고", width:"96px", kind:"num" }, { key:"outQ", label:"출고", width:"96px", kind:"num" },
  { key:"adj", label:"조정", width:"96px", kind:"num" }, { key:"end", label:"기말재고", width:"104px", kind:"num" },
];
const LEDGER_COLS = [
  { key:"date", label:"일자", width:"96px", kind:"mono", locked:true }, { key:"type", label:"구분", width:"80px", kind:"text" }, { key:"ref", label:"적요 (전표)", width:"minmax(160px,1.4fr)", kind:"text" },
  { key:"partner", label:"거래처", width:"minmax(110px,1fr)", kind:"text" }, { key:"inQ", label:"입고", width:"84px", kind:"num" }, { key:"outQ", label:"출고", width:"84px", kind:"num" },
  { key:"bal", label:"잔량", width:"90px", kind:"num" }, { key:"by", label:"담당", width:"72px", kind:"text" },
];
const ADJ_COLS = [
  { key:"id", label:"전표번호", width:"110px", kind:"mono", locked:true }, { key:"date", label:"조정일", width:"104px", kind:"mono" }, { key:"code", label:"품목코드", width:"100px", kind:"mono" },
  { key:"item", label:"품목명", width:"minmax(180px,1.6fr)", kind:"name" }, { key:"unit", label:"단위", width:"64px", kind:"text" }, { key:"qty", label:"증감", width:"96px", kind:"num" },
  { key:"after", label:"조정 후", width:"96px", kind:"num" }, { key:"reason", label:"사유", width:"120px", kind:"text" }, { key:"memo", label:"비고", width:"minmax(120px,1fr)", kind:"text" }, { key:"by", label:"작성자", width:"72px", kind:"text" },
];
const colW = (c, cfg) => (cfg && c.hidden) ? "110px" : (cfg ? String(c.width).replace(/minmax\(\s*([\d.]+px)\s*,[^)]*\)/, "$1") : String(c.width));
const COL_STORAGE_KEY = "nonamed.stock.columns.v1";

/* ─────────────────────────────────────────────
   Format helpers
   ───────────────────────────────────────────── */
function formatMoney(n) {
  if (n === null || n === undefined || n === "") return "";
  return Number(n).toLocaleString("ko-KR");
}
function nextCode(items) {
  const num = items.length + 1;
  return "I-" + String(num).padStart(4, "0");
}

/* ─────────────────────────────────────────────
   Column settings
   ───────────────────────────────────────────── */
function useColumnSettings() {
  const initial = useMemo(() => {
    try {
      const raw = localStorage.getItem(COL_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const validKeys = new Set(ALL_COLUMNS.map(c => c.key));
          const seen = new Set();
          const cleaned = parsed.filter(s => {
            if (!s || !validKeys.has(s.key) || seen.has(s.key)) return false;
            seen.add(s.key);
            return true;
          });
          for (const c of ALL_COLUMNS) if (!seen.has(c.key)) cleaned.push({ key: c.key, visible: false });
          return cleaned;
        }
      }
    } catch (err) {}
    return ALL_COLUMNS.map(c => ({ key: c.key, visible: DEFAULT_VISIBLE_COLS.includes(c.key) }));
  }, []);

  const [settings, setSettings] = useState(initial);

  useEffect(() => {
    try { localStorage.setItem(COL_STORAGE_KEY, JSON.stringify(settings)); } catch (err) {}
  }, [settings]);

  const reset = () => setSettings(ALL_COLUMNS.map(c => ({ key: c.key, visible: DEFAULT_VISIBLE_COLS.includes(c.key) })));
  const toggle = (key) => setSettings(prev => prev.map(s => s.key === key ? { ...s, visible: !s.visible } : s));
  const move = (key, dir) => setSettings(prev => {
    const idx = prev.findIndex(s => s.key === key);
    if (idx < 0) return prev;
    const next = [...prev];
    const to = idx + dir;
    if (to < 0 || to >= next.length) return prev;
    [next[idx], next[to]] = [next[to], next[idx]];
    return next;
  });

  const visibleColumns = useMemo(() => {
    const defMap = new Map(ALL_COLUMNS.map(c => [c.key, c]));
    return settings.filter(s => s.visible || defMap.get(s.key)?.locked).map(s => defMap.get(s.key)).filter(Boolean);
  }, [settings]);

  return { settings, visibleColumns, toggle, move, reset };
}

function ColumnSettingsModal({ open, settings, toggle, move, reset, onClose }) {
  useEffect(() => {
    if (!open) return;
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn, true);
    return () => window.removeEventListener("keydown", fn, true);
  });

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;
  const defMap = new Map(ALL_COLUMNS.map(c => [c.key, c]));
  const lockedCount = ALL_COLUMNS.filter(c => c.locked).length;
  const visibleCount = settings.filter(s => s.visible && !defMap.get(s.key)?.locked).length + lockedCount;

  return (
    <div className="modal-root" role="dialog" aria-modal="true">
      <div className="modal-scrim" onClick={onClose} />
      <div className="modal modal-sm">
        <header className="modal-head">
          <div>
            <h2 className="modal-title">화면 설정</h2>
            <div className="modal-sub">표시할 컬럼과 순서를 조정하세요. 품목명은 항상 표시됩니다.</div>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>{I.close}</button>
        </header>

        <div className="col-list">
          {settings.map((s, idx) => {
            const def = defMap.get(s.key);
            if (!def) return null;
            const isLocked = !!def.locked;
            const isOn = s.visible || isLocked;
            return (
              <div key={s.key} className={`col-row ${isOn ? "is-on" : ""} ${isLocked ? "is-locked" : ""}`}>
                <span className="col-handle">{I.drag}</span>
                <span className="col-name">
                  {def.label}
                  {isLocked ? <span className="col-lock">고정</span> : null}
                </span>
                <div className="col-order">
                  <button type="button" className="iconbtn iconbtn-sm" disabled={idx === 0} onClick={() => move(s.key, -1)}>{I.up}</button>
                  <button type="button" className="iconbtn iconbtn-sm" disabled={idx === settings.length - 1} onClick={() => move(s.key, 1)}>{I.down}</button>
                </div>
                <button type="button" className={`switch ${isOn ? "is-on" : ""}`} disabled={isLocked} onClick={() => toggle(s.key)}>
                  <span className="switch-knob" />
                </button>
              </div>
            );
          })}
        </div>

        <footer className="modal-foot">
          <div className="ff-left"><button type="button" className="btn-ghost" onClick={reset}>초기화</button></div>
          <div className="ff-right">
            <button type="button" className="btn-primary" onClick={onClose}>완료</button>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Sidebar / TopBar
   ───────────────────────────────────────────── */

function TopBar() { return <CommonTopBar crumb="재고" />; }

/* ─────────────────────────────────────────────
   Form fields
   ───────────────────────────────────────────── */
function Label({ required, children, hint }) {
  return (
    <span className="fld-label">
      {children}
      {required ? <span className="req">*</span> : null}
      {hint ? <span className="fld-hint">{hint}</span> : null}
    </span>
  );
}

function TextField({ label, value, onChange, placeholder, required, hint, monospace, suffix, ...rest }) {
  return (
    <label className="fld">
      <Label required={required} hint={hint}>{label}</Label>
      <div className={`fld-wrap ${suffix ? "has-suffix" : ""}`}>
        <input
          type="text"
          className={`fld-input ${monospace ? "is-mono" : ""}`}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          {...rest}
        />
        {suffix ? <span className="fld-suffix">{suffix}</span> : null}
      </div>
    </label>
  );
}

function MoneyField({ label, value, onChange, placeholder, required }) {
  return (
    <label className="fld">
      <Label required={required}>{label}</Label>
      <div className="fld-wrap has-suffix">
        <input
          type="text"
          className="fld-input is-mono is-right"
          value={value === "" || value === null || value === undefined ? "" : formatMoney(value)}
          onChange={(e) => {
            const digits = e.target.value.replace(/[^\d]/g, "");
            onChange(digits === "" ? "" : Number(digits));
          }}
          placeholder={placeholder || "0"}
          inputMode="numeric"
        />
        <span className="fld-suffix">원</span>
      </div>
    </label>
  );
}

function NumberField({ label, value, onChange, placeholder, suffix }) {
  return (
    <label className="fld">
      <Label>{label}</Label>
      <div className={`fld-wrap ${suffix ? "has-suffix" : ""}`}>
        <input
          type="text"
          className="fld-input is-mono is-right"
          value={value === "" || value === null || value === undefined ? "" : value}
          onChange={(e) => {
            const digits = e.target.value.replace(/[^\d]/g, "");
            onChange(digits === "" ? "" : Number(digits));
          }}
          placeholder={placeholder || "0"}
          inputMode="numeric"
        />
        {suffix ? <span className="fld-suffix">{suffix}</span> : null}
      </div>
    </label>
  );
}

function SegmentField({ label, value, onChange, options, required }) {
  return (
    <div className="fld">
      <Label required={required}>{label}</Label>
      <div className="seg">
        {options.map(o => (
          <button key={o} type="button" className={`seg-item ${value === o ? "is-on" : ""}`} onClick={() => onChange(o)}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options, placeholder }) {
  return (
    <label className="fld">
      <Label>{label}</Label>
      <div className="fld-wrap fld-select">
        <select
          className="fld-input"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{placeholder || "선택"}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <span className="fld-chev">{I.chevron}</span>
      </div>
    </label>
  );
}

/* ─────────────────────────────────────────────
   Item Modal
   ───────────────────────────────────────────── */
function ItemModal({ open, initial, items, formLayout, afterSave, setAfterSave, showHelper, onSave, onDelete, onClose, setToast, openHistory }) {
  const wf = useWinFrame("nonamed.item.entry", 860, open);
  const [pcfg, setPcfg] = useState(false);
  const psnap = useRef(null);
  useEffect(() => { if (pcfg) psnap.current = { fldOrder: fldOrder ? [...fldOrder] : null, fldSpan: { ...fldSpan }, fldMeta: { ...fldMeta } }; }, [pcfg]);
  const [pViews, setPViews] = useState(() => { try { const v = JSON.parse(localStorage.getItem("nonamed.item.entryViews.v1")); return Array.isArray(v) ? v : []; } catch (e) { return []; } });
  const [pActive, setPActive] = useState(() => { try { return localStorage.getItem("nonamed.item.entryView") || null; } catch (e) { return null; } });
  useEffect(() => { try { localStorage.setItem("nonamed.item.entryViews.v1", JSON.stringify(pViews)); if (pActive) localStorage.setItem("nonamed.item.entryView", pActive); } catch (e) {} }, [pViews, pActive]);
  const [pSaveOpen, setPSaveOpen] = useState(false);
  const [pOwCode, setPOwCode] = useState(null);
  const [pRenameCode, setPRenameCode] = useState(null);
  const [pDelCode, setPDelCode] = useState(null);
  const [pDonePrompt, setPDonePrompt] = useState(false);
  const applyPView = (code) => { const v = pViews.find(x => x.code === code); if (!v) return; const c = v.config || {}; setFldOrder(c.fldOrder || null); setFldSpan(c.fldSpan || {}); setFldMeta(c.fldMeta || {}); setPActive(code); };
  const [fldOrder, setFldOrder] = useState(() => { try { const v = JSON.parse(localStorage.getItem("nonamed.item.fldOrder.v1")); return Array.isArray(v) ? v : null; } catch (e) { return null; } });
  useEffect(() => { try { localStorage.setItem("nonamed.item.fldOrder.v1", JSON.stringify(fldOrder)); } catch (e) {} }, [fldOrder]);
  const [fldMeta, setFldMeta] = useState(() => { try { const v = JSON.parse(localStorage.getItem("nonamed.item.fldMeta.v1")); return v && typeof v === "object" ? { ...CODE_FLD_DEFAULT, ...v, code: { ...CODE_FLD_DEFAULT.code, ...(v.code || {}) } } : { ...CODE_FLD_DEFAULT }; } catch (e) { return { ...CODE_FLD_DEFAULT }; } });
  useEffect(() => { try { localStorage.setItem("nonamed.item.fldMeta.v1", JSON.stringify(fldMeta)); } catch (e) {} }, [fldMeta]);
  const lk = useCcLookup({
    fldMeta,
    setValue: (k, v) => setForm(prev => ({ ...prev, [k]: v })),
    setToast,
    builtin: { "거래처": ["P-001 · 한양식자재", "P-002 · 속파유통", "P-003 · 동대문푸드"], "품목": ["I-001 · 유기농 대파", "I-002 · 국내산 양파 15kg"], "재고": ["창고A", "창고B", "냉윅1", "냉동1"] },
  });
  const [fldSpan, setFldSpan] = useState(() => { try { const v = JSON.parse(localStorage.getItem("nonamed.item.fldSpan.v1")); return v && typeof v === "object" ? v : {}; } catch (e) { return {}; } });
  useEffect(() => { try { localStorage.setItem("nonamed.item.fldSpan.v1", JSON.stringify(fldSpan)); } catch (e) {} }, [fldSpan]);
  const [fldCfgFor, setFldCfgFor] = useState(null);
  const [fldMenu, setFldMenu] = useState(null);
  const [addSlotOpen, setAddSlotOpen] = useState(false);
  const labelOf = (k, fallback) => (fldMeta[k] && fldMeta[k].label) || fallback;
  const dfltOf = (k) => (fldMeta[k] && fldMeta[k].dflt) || "";
  const cellCfg = (k, label) => pcfg ? { onClick: (e) => { e.stopPropagation(); setFldMenu(m => (m && m.key === k ? null : { key: k, label })); } } : {};
  const spanOf = (k) => { const v = fldSpan[k]; if (v === 1) return 6; if (v === 2) return 12; return v || (k === "note" ? 12 : 6); };
  const cycleSpan = (k) => setFldSpan(p => ({ ...p, [k]: spanOf(k) >= 12 ? 6 : 12 }));
  const spanStyle = (k) => ({ gridColumn: `span ${spanOf(k)}` });
  const gridRef = useRef(null);
  useEffect(() => {
    if (!open || pcfg) return;
    const t = setTimeout(() => {
      const g = gridRef.current; if (!g) return;
      const el = g.querySelector('input:not([disabled])');
      if (el) { el.focus(); el.select && el.select(); }
    }, 60);
    return () => clearTimeout(t);
  }, [open, pcfg]);
  const startColResize = (e, k) => {
    e.preventDefault(); e.stopPropagation();
    const grid = gridRef.current; if (!grid) return;
    const colW = grid.clientWidth / 12, x0 = e.clientX, s0 = spanOf(k);
    const mv = (ev) => { const n = Math.max(2, Math.min(12, Math.round(s0 + (ev.clientX - x0) / colW))); setFldSpan(p => (p[k] === n ? p : { ...p, [k]: n })); };
    const up = () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
    window.addEventListener("mousemove", mv); window.addEventListener("mouseup", up);
  };
  const RzBtn = ({ k }) => pcfg ? <span className="fld-rz" title="드래그해서 너비 조절" onMouseDown={(e) => startColResize(e, k)} onClick={(e) => e.stopPropagation()} /> : null;
  const CfgBtn = ({ k, label }) => pcfg ? (
    <span className="fld-menu-wrap">
      {fldMenu && fldMenu.key === k ? (
        <div className="fld-menu" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
          <div className="fld-menu-h"><span className="fld-menu-dot" />{label}</div>
          <button type="button" onClick={() => { setFldMenu(null); setFldCfgFor({ key: k, label, dflt: dfltOf(k), type: "dflt", fmt: (fldMeta[k] || {}).fmt, maxLen: (fldMeta[k] || {}).maxLen, autoPat: (fldMeta[k] || {}).autoPat }); }}>설정</button>
          <button type="button" onClick={() => { setFldMenu(null); setAddSlotOpen(true); }}>항목 추가</button>
          <button type="button" onClick={() => { setFldMenu(null); cycleSpan(k); }}>너비 {spanOf(k) >= 12 ? "반칸으로" : "전체로"}</button>
          {k === "code" || k === "name" ? null : <button type="button" className="is-danger" onClick={() => { setFldMenu(null); setFldMeta(p => ({ ...p, [k]: { ...(p[k] || {}), hide: true, on: false } })); }}>삭제</button>}
        </div>
      ) : null}
    </span>
  ) : null;
  const applyRule = (k, xtype, v) => {
    const m = fldMeta[k] || {};
    const fmt = m.fmt || (xtype === "num" ? "num" : "free");
    let out = String(v);
    if (fmt === "num") out = out.replace(/[^\d.-]/g, "");
    else if (fmt === "alnum") out = out.replace(/[^A-Za-z0-9\-]/g, "");
    else if (fmt === "ko") out = out.replace(/[^\u3131-\u318E\uAC00-\uD7A3\s]/g, "");
    if (m.maxLen) out = out.slice(0, m.maxLen);
    return out;
  };
  const xf = ITEM_EXTRA_SLOTS.filter(s2 => fldMeta[s2.key] && fldMeta[s2.key].on && !fldMeta[s2.key].hide);
  const labelFor = (k) => { const b = ITEM_FIELDS.find(x => x.key === k); if (b) return b.label; const s2 = ITEM_EXTRA_SLOTS.find(x => x.key === k); return s2 ? s2.label : k; };
  const hiddenKeys = [...ITEM_FIELDS, ...ITEM_EXTRA_SLOTS].map(x => x.key).filter(k => fldMeta[k] && fldMeta[k].hide);
  useEffect(() => { if (!fldMenu) return; const fn = () => setFldMenu(null); window.addEventListener("mousedown", fn); return () => window.removeEventListener("mousedown", fn); }, [fldMenu]);
  const fldKeys = (() => {
    const base = [...ITEM_FIELDS.map(x => x.key), ...xf.map(x => x.key)].filter(k => !(fldMeta[k] && fldMeta[k].hide));
    if (!fldOrder) return base;
    const kept = fldOrder.filter(k => base.includes(k));
    base.forEach(k => { if (!kept.includes(k)) kept.push(k); });
    return kept;
  })();
  const orderOf = (key) => { const i = fldKeys.indexOf(key); return i < 0 ? 90 : i; };
  const fdrag = useRef(null);
  const moveFld = (from, to) => { if (from === to) return; const a = fldKeys.slice(); const fi = a.indexOf(from), ti = a.indexOf(to); if (fi < 0 || ti < 0) return; a.splice(ti, 0, a.splice(fi, 1)[0]); setFldOrder(a); };
  const fldDrag = (key) => ({
    draggable: true,
    onDragStart: (e) => { fdrag.current = key; e.dataTransfer.effectAllowed = "move"; },
    onDragOver: (e) => { e.preventDefault(); },
    onDrop: (e) => { e.preventDefault(); if (fdrag.current) moveFld(fdrag.current, key); fdrag.current = null; },
    onDragEnd: () => { fdrag.current = null; },
  });
  const blank = {
    code: "",
    name: "", spec: "", category: "", unit: "개",
    cost: "", price: "",
    tax: "과세", status: "판매중",
    barcode: "", partner: "",
    stock: 0, safety: 0,
    expiry: "", storage: "",
    note: "",
  };
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [autoCode, setAutoCode] = useState(true);

  const margin = useMemoMargin(form.cost, form.price);

  useEffect(() => { if (open) { setPcfg(false); setFldMenu(null); setPDonePrompt(false); } }, [open]);
  useEffect(() => {
    if (open) {
      if (initial) {
        setForm({ ...blank, ...initial });
        setAutoCode(false);
      } else {
        const defs = {};
        Object.keys(fldMeta || {}).forEach(k => { if (fldMeta[k] && fldMeta[k].dflt) defs[k] = fldMeta[k].dflt; });
        Object.keys(fldMeta || {}).forEach(k => {
          const m = fldMeta[k];
          if (!m || m.fmt !== "auto") return;
          const used = (items || []).map(r => String((r && (r[k] != null ? r[k] : r.code)) || ""));
          defs[k] = nextAutoCode(m.autoPat, used, m.maxLen || 5);
        });
        setForm({ ...blank, code: nextCode(items), ...defs });
        setAutoCode(true);
      }
      setErrors({});
    }
  }, [open, initial?.id]);

  useEffect(() => {
    if (!open) return;
    const fn = (e) => {
      if (e.key === "Escape") { if (pSaveOpen || pOwCode || pRenameCode || pDelCode || pDonePrompt || fldCfgFor || addSlotOpen) return; e.stopImmediatePropagation(); e.preventDefault(); if (pcfg) { setPDonePrompt(true); return; } onClose(); }
      if (e.key === "F8") { e.preventDefault(); const f = document.querySelector(".modal-root form.modal"); if (f) f.requestSubmit(); }
    };
    window.addEventListener("keydown", fn, true);
    return () => window.removeEventListener("keydown", fn, true);
  });

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  const set = (k) => (v) => setForm(prev => ({ ...prev, [k]: v }));
  const isEdit = !!initial?.id;

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim())  next.name  = "품목명을 입력해 주세요.";
    if (form.price === "" || form.price === null) next.price = "판매단가를 입력해 주세요.";
    setErrors(next);
    if (Object.keys(next).length) return;

    onSave?.(form, isEdit);
    setToast?.(`「${form.name}」 품목이 ${isEdit ? "수정" : "등록"}되었습니다.`);

    if (afterSave === "목록으로" || isEdit) {
      onClose();
    } else {
      setForm({ ...blank, code: nextCode([...items, form]) });
      setAutoCode(true);
      setErrors({});
    }
  };

  const reset = () => {
    setForm({ ...blank, code: nextCode(items) });
    setAutoCode(true);
    setErrors({});
  };

  return (
    <div className="modal-root" role="dialog" aria-modal="true">
      <div className="modal-scrim" onClick={() => { if (pcfg) setPDonePrompt(true); }} />
      <form className="modal" onSubmit={submit} style={wf.winStyle}>
        <wf.WinResize />
        <header className="modal-head modal-head-drag" onMouseDown={wf.onWinDragDown}>
          <div>
            <h2 className="modal-title">{isEdit ? "재고 정보 수정" : "재고 조정 등록"}</h2>
          </div>
          <div className="modal-head-actions">
            <wf.WinTools />
            <ViewPresetMenu views={pViews} activeCode={pActive} enabled={pcfg}
              onApply={applyPView} onSaveNew={() => setPSaveOpen(true)} onOverwrite={(c) => setPOwCode(c)}
              onRename={(c) => setPRenameCode(c)} onDelete={(c) => setPDelCode(c)} />
            {pcfg ? <button type="button" className="btn-ghost btn-sm" title="기본 항목·순서·너비로 되돌리기" onClick={() => { setFldMeta({}); setFldOrder(null); setFldSpan({}); setFldMenu(null); try { localStorage.removeItem("nonamed.item.fldMeta.v1"); localStorage.removeItem("nonamed.item.fldOrder.v1"); localStorage.removeItem("nonamed.item.fldSpan.v1"); } catch (e) {} wf.resetWin(); }}>초기화</button> : null}
            <button type="button" className={`btn-ghost btn-sm ${pcfg ? "is-on-cfg" : ""}`} onClick={() => { if (pcfg) setPDonePrompt(true); else setPcfg(true); }}>{I.cog} {pcfg ? "설정 완료" : "화면 설정"}</button>
            {isEdit ? (
              <>
                <button type="button" className="btn-ghost btn-sm" onClick={() => openHistory(initial)}>{I.history} 수정 이력</button>
                <button type="button" className="btn-ghost btn-danger" onClick={() => onDelete?.(initial)}>{I.trash} 삭제</button>
              </>
            ) : null}
            <button type="button" className="modal-close" onClick={() => { if (pcfg) setPDonePrompt(true); else onClose(); }}>{I.close}</button>
          </div>
        </header>

        <div className={`modal-body cols-${formLayout === "1열" ? "1" : "2"}`}>
          <section className="fset fset-wide">
            <h3 className="fset-h"></h3>
            <div className="fset-grid" ref={gridRef} onKeyDown={(e) => {
              if (e.key !== "Enter" || e.target.tagName !== "INPUT") return;
              e.preventDefault();
              const cells = [...e.currentTarget.querySelectorAll(".fld")].sort((a, b) => (+getComputedStyle(a).order || 0) - (+getComputedStyle(b).order || 0));
              const list = [];
              cells.forEach(c => list.push(...c.querySelectorAll("input:not([disabled])")));
              const i = list.indexOf(e.target);
              if (i >= 0 && i + 1 < list.length) { list[i + 1].focus(); list[i + 1].select && list[i + 1].select(); }
            }}>
              {fldKeys.map(k => {
                const x = xf.find(ff => ff.key === k);
                const style = { order: orderOf(k) };
                const drag = pcfg ? fldDrag(k) : {};
                if (x) return (
                  <div className={"fld" + (pcfg ? " is-drag" : "")} key={k} style={{ ...style, ...spanStyle(k) }} {...drag} {...cellCfg(k, labelOf(k, x.label))}>
                    <RzBtn k={k} />
                    <span className="fld-label">{labelOf(k, x.label)}
                      <span className={`xf-tag xf-${x.type}`}>{x.type === "text" ? "문자" : x.type === "num" ? "숫자" : "검색"}</span>
                      <CfgBtn k={k} label={labelOf(k, x.label)} />
                    </span>
                    {x.type === "lookup" ? (
                      <lk.LookupField k={k} label={labelOf(k, x.label)} value={form[k] || ""} onChange={(v) => set(k)(v)} />
                    ) : (
                      <input className={`fld-input ${x.type === "num" ? "is-mono" : ""}`} inputMode={x.type === "num" ? "numeric" : undefined}
                        maxLength={(fldMeta[k] || {}).maxLen || undefined}
                        value={form[k] || ""} onChange={(e) => set(k)(applyRule(k, x.type, e.target.value))} />
                    )}
                  </div>
                );
                const d = ITEM_FIELDS.find(b => b.key === k);
                if (!d) return null;
                const lbl = <>{labelOf(k, d.label)}{d.required ? <span className="req">*</span> : null}<CfgBtn k={k} label={labelOf(k, d.label)} /></>;
                return (
                  <div className={"fld" + (pcfg ? " is-drag" : "")} key={k} style={{ ...style, ...spanStyle(k) }} {...drag} {...cellCfg(k, labelOf(k, d.label))}>
                    <RzBtn k={k} />
                    {d.kind === "select" ? (
                      <SelectField label={lbl} value={form[k]} onChange={set(k)} options={d.options} />
                    ) : d.kind === "segment" ? (
                      <SegmentField label={lbl} value={form[k]} onChange={set(k)} options={d.options} />
                    ) : (
                      <>
                        <span className="fld-label">{lbl}</span>
                        <input className={`fld-input ${d.mono ? "is-mono" : ""}`} inputMode={d.money ? "numeric" : d.inputMode}
                          maxLength={(fldMeta[k] || {}).maxLen || undefined}
                          disabled={k === "code" && isEdit}
                          value={form[k] === 0 ? "0" : (form[k] || "")}
                          onChange={(e) => { let v = e.target.value; if (d.money) v = v.replace(/[^\d.-]/g, ""); else if ((fldMeta[k] || {}).fmt) v = applyRule(k, null, v); set(k)(v); }}
                          placeholder={d.placeholder || ""} />
                        {errors[k] ? <div className="fset-err">{errors[k]}</div> : null}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            {pcfg && hiddenKeys.length ? (
              <div className="xf-slots">
                <div className="xf-row">
                  <span className="xf-row-h">삭제됨</span>
                  {hiddenKeys.map(k => (
                    <button key={k} type="button" className="xf-slot" title="누르면 다시 표시"
                      onClick={() => setFldMeta(p => ({ ...p, [k]: { ...(p[k] || {}), hide: false, on: k.startsWith("x") ? true : undefined } }))}>{labelOf(k, labelFor(k))}</button>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        </div>

        <footer className="modal-foot">
          <div className="ff-left" />
          <div className="ff-right">
            {isEdit ? <button type="button" className="btn-ghost" onClick={onClose}>취소</button> : null}
            <button type="submit" className="btn-primary">{isEdit ? "수정저장" : "저장"} <kbd className="btn-kbd">F8</kbd></button>
          </div>
        </footer>
      </form>
      <lk.UI />
      {fldCfgFor ? <AddColModal initial={fldCfgFor} types={["dflt"]} onAdd={(c) => { setFldMeta(p => ({ ...p, [fldCfgFor.key]: { ...(p[fldCfgFor.key] || {}), label: c.label, dflt: c.dflt || "", fmt: c.fmt, maxLen: c.maxLen, autoPat: c.autoPat } })); setFldCfgFor(null); }} onClose={() => setFldCfgFor(null)} /> : null}
      {addSlotOpen ? (
        <AddColModal types={["source", "formula", "date", "text", "money"]}
          nextCode={"열추가 " + String.fromCharCode(65 + xf.length)}
          existing={xf.map((ff, i) => ({ key: ff.key, code: "열추가 " + String.fromCharCode(65 + i), label: labelOf(ff.key, ff.label), type: ff.type === "num" ? "금액" : ff.type === "lookup" ? "정보" : "문자" }))}
          onAdd={(c) => {
            const want = (c.type === "money" || c.type === "formula") ? "num" : (c.type === "source" ? "lookup" : "text");
            const slot = ITEM_EXTRA_SLOTS.filter(s2 => s2.type === want).find(s2 => !(fldMeta[s2.key] && fldMeta[s2.key].on));
            if (!slot) { setToast && setToast((want === "num" ? "숫자형" : want === "lookup" ? "검색형" : "문자형") + " 추가 항목은 최대 5개까지입니다."); setAddSlotOpen(false); return; }
            setFldMeta(p => ({ ...p, [slot.key]: { ...(p[slot.key] || {}), on: true, hide: false, label: c.label, dflt: c.dflt || "", source: c.source, srcCat: c.srcCat, fmt: c.fmt, maxLen: c.maxLen, autoPat: c.autoPat } }));
            setAddSlotOpen(false);
          }}
          onClose={() => setAddSlotOpen(false)} />
      ) : null}
      <SaveViewModal open={pSaveOpen} code={nextViewCode(pViews)} onSave={(n) => { const code = nextViewCode(pViews); setPViews(prev => [...prev, { code, name: n, config: { fldOrder: fldOrder ? [...fldOrder] : null, fldSpan: { ...fldSpan }, fldMeta: { ...fldMeta } } }]); setPActive(code); setPSaveOpen(false); setPDonePrompt(false); setPcfg(false); }} onClose={() => setPSaveOpen(false)} />
      <SaveViewModal open={!!pRenameCode} title="화면 이름 변경" saveLabel="변경" initialName={(pViews.find(v => v.code === pRenameCode) || {}).name || ""} onSave={(n) => { setPViews(prev => prev.map(v => v.code === pRenameCode ? { ...v, name: n } : v)); setPRenameCode(null); }} onClose={() => setPRenameCode(null)} />
      <ConfirmModal open={!!pOwCode} title="화면 덮어쓰기"
        message={(() => { const v = pViews.find(x => x.code === pOwCode); return v ? `${v.code} "${v.name}" 화면을 지금 화면 구성으로 덮어쓸까요?` : ""; })()}
        confirmLabel="덮어쓰기" onConfirm={() => { setPViews(prev => prev.map(v => v.code === pOwCode ? { ...v, config: { fldOrder: fldOrder ? [...fldOrder] : null, fldSpan: { ...fldSpan }, fldMeta: { ...fldMeta } } } : v)); setPActive(pOwCode); setPOwCode(null); }} onClose={() => setPOwCode(null)} />
      <ConfirmModal open={!!pDelCode} title="화면 삭제" danger
        message={(() => { const v = pViews.find(x => x.code === pDelCode); return v ? `${v.code} "${v.name}" 화면을 삭제할까요?` : ""; })()}
        confirmLabel="삭제" onConfirm={() => { setPViews(prev => prev.filter(v => v.code !== pDelCode)); if (pActive === pDelCode) setPActive(null); setPDelCode(null); }} onClose={() => setPDelCode(null)} />
      {pDonePrompt ? (() => { const av = pViews.find(v => v.code === pActive); return (
        <div className="modal-root" role="dialog" aria-modal="true" style={{ zIndex: 90 }}>
          <div className="modal-scrim" onClick={() => setPDonePrompt(false)} />
          <div className="modal confirm-modal">
            <div className="confirm-body"><h2 className="confirm-title">화면 설정 완료</h2>
              <p className="confirm-msg">변경한 입력항목 구성을 저장할까요?</p></div>
            <footer className="modal-foot">
              <div className="ff-left" />
              <div className="ff-right">
                <button type="button" className="btn-ghost" onClick={() => { setPDonePrompt(false); setPcfg(false); const sn = psnap.current; if (sn) { setFldOrder(sn.fldOrder ? [...sn.fldOrder] : null); setFldSpan({ ...sn.fldSpan }); setFldMeta({ ...sn.fldMeta }); } }}>취소</button>
                <button type="button" className="btn-ghost" onClick={() => { setPDonePrompt(false); setPcfg(false); if (av) { setPViews(prev => prev.map(v => v.code === av.code ? { ...v, config: { fldOrder: fldOrder ? [...fldOrder] : null, fldSpan: { ...fldSpan }, fldMeta: { ...fldMeta } } } : v)); } }}>현재 양식에 적용</button>
                <button type="button" className="btn-primary" onClick={() => { setPDonePrompt(false); setPSaveOpen(true); }}>신규 저장</button>
              </div>
            </footer>
          </div>
        </div>
      ); })() : null}
    </div>
  );
}

function useMemoMargin(cost, price) {
  return useMemo(() => {
    const c = Number(cost) || 0;
    const p = Number(price) || 0;
    if (!c || !p) return { text: "—", warn: false };
    const profit = p - c;
    const rate = (profit / p) * 100;
    return {
      text: `${formatMoney(profit)}원 (${rate.toFixed(1)}%)`,
      warn: rate < 10,
    };
  }, [cost, price]);
}

/* ─────────────────────────────────────────────
   Price Bulk Modal
   ───────────────────────────────────────────── */
function BulkPriceModal({ open, count, onApply, onClose }) {
  const [mode, setMode] = useState("percent");  // percent | fixed
  const [target, setTarget] = useState("price"); // price | cost
  const [value, setValue] = useState("");

  useEffect(() => {
    if (open) { setValue(""); setMode("percent"); setTarget("price"); }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn, true);
    return () => window.removeEventListener("keydown", fn, true);
  });

  if (!open) return null;

  const apply = (e) => {
    e.preventDefault();
    const v = Number(value);
    if (!v && v !== 0) return;
    onApply({ mode, target, value: v });
  };

  return (
    <div className="modal-root" role="dialog" aria-modal="true">
      <div className="modal-scrim" onClick={onClose} />
      <form className="modal modal-sm" onSubmit={apply}>
        <header className="modal-head">
          <div>
            <h2 className="modal-title">가격 일괄 수정</h2>
            <div className="modal-sub">선택한 <b>{count}개</b> 품목의 가격을 한번에 조정합니다.</div>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>{I.close}</button>
        </header>

        <div className="modal-body cols-1" style={{ padding: "20px 26px" }}>
          <div className="fset">
            <h3 className="fset-h">대상</h3>
            <div className="seg" style={{ alignSelf: "flex-start" }}>
              <button type="button" className={`seg-item ${target === "price" ? "is-on" : ""}`} onClick={() => setTarget("price")}>판매단가</button>
              <button type="button" className={`seg-item ${target === "cost" ? "is-on" : ""}`} onClick={() => setTarget("cost")}>매입단가</button>
            </div>
          </div>

          <div className="fset">
            <h3 className="fset-h">조정 방식</h3>
            <div className="seg" style={{ alignSelf: "flex-start" }}>
              <button type="button" className={`seg-item ${mode === "percent" ? "is-on" : ""}`} onClick={() => setMode("percent")}>%로 조정</button>
              <button type="button" className={`seg-item ${mode === "fixed" ? "is-on" : ""}`} onClick={() => setMode("fixed")}>고정 금액 더하기</button>
            </div>
          </div>

          <div className="fset">
            <label className="fld">
              <Label>{mode === "percent" ? "변동률 (% — 음수도 가능)" : "변동 금액 (원 — 음수도 가능)"}</Label>
              <div className="fld-wrap has-suffix">
                <input
                  type="text"
                  className="fld-input is-mono is-right"
                  value={value}
                  onChange={(e) => setValue(e.target.value.replace(/[^\d.\-]/g, ""))}
                  placeholder={mode === "percent" ? "예: 5  또는  -10" : "예: 500  또는  -1000"}
                  autoFocus
                />
                <span className="fld-suffix">{mode === "percent" ? "%" : "원"}</span>
              </div>
            </label>
            <div className="bulk-hint">
              {mode === "percent"
                ? "예) 5 입력 → 단가가 5% 인상 / -10 입력 → 10% 인하"
                : "예) 500 입력 → 단가에 500원 가산 / -1000 입력 → 1,000원 차감"}
            </div>
          </div>
        </div>

        <footer className="modal-foot">
          <div className="ff-left" />
          <div className="ff-right">
            <button type="button" className="btn-ghost" onClick={onClose}>취소</button>
            <button type="submit" className="btn-primary" disabled={value === ""}>적용하기</button>
          </div>
        </footer>
      </form>
    </div>
  );
}

/* ─────────────────────────────────────────────
   History Modal (dummy)
   ───────────────────────────────────────────── */
function HistoryModal({ open, item, onClose }) {
  useEffect(() => {
    if (!open) return;
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn, true);
    return () => window.removeEventListener("keydown", fn, true);
  });

  if (!open || !item) return null;

  // dummy timeline
  const entries = [
    { date: item.updated || "2026-05-25", who: "김영수", action: "판매단가 수정", detail: `${formatMoney(Math.round(item.price * 0.95))}원 → ${formatMoney(item.price)}원` },
    { date: "2026-05-12", who: "김영수", action: "재고 수정", detail: `${item.stock + 10}개 → ${item.stock}개` },
    { date: "2026-04-30", who: "박지영", action: "안전재고 설정", detail: `0 → ${item.safety}` },
    { date: "2026-04-12", who: "김영수", action: "최초 등록", detail: item.name },
  ];

  return (
    <div className="modal-root" role="dialog" aria-modal="true">
      <div className="modal-scrim" onClick={onClose} />
      <div className="modal modal-sm">
        <header className="modal-head">
          <div>
            <h2 className="modal-title">수정 이력</h2>
            <div className="modal-sub">{item.name} · {item.code}</div>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>{I.close}</button>
        </header>

        <div className="hist-list">
          {entries.map((e, i) => (
            <div key={i} className="hist-row">
              <div className="hist-date">{e.date}</div>
              <div className="hist-rail">
                <span className="hist-dot" />
                {i < entries.length - 1 ? <span className="hist-line" /> : null}
              </div>
              <div className="hist-body">
                <div className="hist-action">{e.action}</div>
                <div className="hist-detail">{e.detail}</div>
                <div className="hist-who">{e.who}</div>
              </div>
            </div>
          ))}
        </div>

        <footer className="modal-foot">
          <div className="ff-left">
            <span className="ff-k">총</span>
            <span className="ff-v">{entries.length}건</span>
          </div>
          <div className="ff-right">
            <button type="button" className="btn-primary" onClick={onClose}>닫기</button>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   App
   ───────────────────────────────────────────── */
/* 변동표 — 품목별 기초 / 입고 / 출고 / 조정 / 기말 */
function StockMoveView({ items, moves, onOpen, cols, cfg, head, extra }) {
  const rows = items.map(it => ({ it, s: stockMoveSummary(it, moves) }));
  const tot = rows.reduce((a, r) => ({ open: a.open + r.s.open, inQ: a.inQ + r.s.inQ, outQ: a.outQ + r.s.outQ, adj: a.adj + r.s.adj, end: a.end + r.s.end }), { open: 0, inQ: 0, outQ: 0, adj: 0, end: 0 });
  const sgn = (n) => n === 0 ? "—" : (n > 0 ? "+" : "−") + formatMoney(Math.abs(n));
  const cell = (c, it, s) => {
    const low = it.safety !== "" && s.end <= Number(it.safety);
    switch (c.key) {
      case "code": return <span className="tc-val">{it.code}</span>;
      case "name": return <span className="ln-text">{it.name}</span>;
      case "spec": return <span className="tc-val">{it.spec || "—"}</span>;
      case "unit": return <span className="tc-val">{it.unit || "—"}</span>;
      case "open": return <span className="tc-val">{formatMoney(s.open)}</span>;
      case "inQ": return <span className="tc-val sv-in">{s.inQ ? formatMoney(s.inQ) : "—"}</span>;
      case "outQ": return <span className="tc-val sv-out">{s.outQ ? formatMoney(s.outQ) : "—"}</span>;
      case "adj": return <span className={"tc-val " + (s.adj < 0 ? "sv-out" : s.adj > 0 ? "sv-in" : "")}>{sgn(s.adj)}</span>;
      case "end": return <span className={"tc-val stock-num " + (low ? "is-low" : "")}>{formatMoney(s.end)}</span>;
      default: return <span className="tc-val">{c.isCustom ? (calcFlatCol(c.def, { ...it, ...s }, MOVE_COLS) || "—") : "—"}</span>;
    }
  };
  const foot = (c) => ({ code: "합계", name: rows.length + "품목", open: formatMoney(tot.open), inQ: <span className="sv-in">{formatMoney(tot.inQ)}</span>, outQ: <span className="sv-out">{formatMoney(tot.outQ)}</span>, adj: sgn(tot.adj), end: formatMoney(tot.end) })[c.key] || "";
  const cls = (c) => `tc ck-${c.kind} ${cfg && c.hidden ? "is-colhidden" : ""}`;
  return (
    <div className="table-card sv-card" style={{ "--cols-template": cols.map(c => colW(c, cfg)).join(" ") }}>
      {extra}
      <div className="t-row t-head">{head}</div>
      {rows.length === 0 ? <div className="t-empty">조건에 맞는 품목이 없습니다.</div> : null}
      {rows.map(({ it, s }) => (
        <div key={it.id} role="button" tabIndex={0} className="t-row" onClick={() => onOpen(it)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onOpen(it); } }}>
          {cols.map(c => <div key={c.key} className={cls(c)}>{cell(c, it, s)}</div>)}
        </div>
      ))}
      {rows.length ? <div className="t-row sv-foot">{cols.map(c => <div key={c.key} className={cls(c)}><span className="tc-val">{foot(c)}</span></div>)}</div> : null}
    </div>
  );
}

/* 조정 전표 리스트 — 매입 조회 리스트와 같은 테이블 구조 */
function StockAdjustView({ docs, items, range, onDelete, onNew, cols, cfg, head, extra }) {
  const inRange = (dt) => (!range.from || dt >= range.from) && (!range.to || dt <= range.to);
  const rows = docs.filter(d => inRange(String(d.date).slice(0, 10))).slice().sort((a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : a.id < b.id ? 1 : -1);
  const tot = rows.reduce((a, d) => ({ plus: a.plus + (d.qty > 0 ? d.qty : 0), minus: a.minus + (d.qty < 0 ? -d.qty : 0) }), { plus: 0, minus: 0 });
  const cell = (c, d, it) => {
    switch (c.key) {
      case "id": return <span className="tc-val">{d.id}</span>;
      case "date": return <span className="tc-val is-mono">{d.date}</span>;
      case "code": return <span className="tc-val">{it ? it.code : "—"}</span>;
      case "item": return <span className="tc-val">{d.item}{it && it.spec ? <em className="adj-spec"> {it.spec}</em> : null}</span>;
      case "unit": return <span className="tc-val">{it ? it.unit : ""}</span>;
      case "qty": return <span className={"tc-val " + (d.qty > 0 ? "sv-in" : "sv-out")}>{d.qty > 0 ? "+" : "−"}{formatMoney(Math.abs(d.qty))}</span>;
      case "after": return <span className="tc-val">{d.after != null ? formatMoney(d.after) : "—"}</span>;
      case "reason": return <span className="tc-val">{d.reason}</span>;
      case "memo": return <span className="tc-val">{d.memo || "—"}</span>;
      case "by": return <span className="tc-val">{d.by || "—"}</span>;
      default: return <span className="tc-val">{c.isCustom ? (calcFlatCol(c.def, { ...d, code: it ? it.code : "", unit: it ? it.unit : "" }, ADJ_COLS) || "—") : "—"}</span>;
    }
  };
  const foot = (c) => ({ id: "합계", item: rows.length + "건", qty: <><span className="sv-in">+{formatMoney(tot.plus)}</span> / <span className="sv-out">−{formatMoney(tot.minus)}</span></> })[c.key] || "";
  const cls = (c) => `tc ck-${c.kind} ${cfg && c.hidden ? "is-colhidden" : ""}`;
  return (
    <div className="table-card sv-card" style={{ "--cols-template": cols.map(c => colW(c, cfg)).join(" ") + " 56px" }}>
      {extra}
      <div className="t-row t-head">{head}<div className="tc"></div></div>
      {rows.length === 0 ? <div className="t-empty">기간 내 조정 전표가 없습니다. <button type="button" className="btn-ghost btn-sm" onClick={onNew}>재고 조정</button></div> : null}
      {rows.map(d => {
        const it = items.find(x => x.id === d.itemId);
        return (
          <div key={d.id} className="t-row">
            {cols.map(c => <div key={c.key} className={cls(c)}>{cell(c, d, it)}</div>)}
            <div className="tc"><button type="button" className="iconbtn iconbtn-sm" title="전표 삭제 (재고 되돌림)" disabled={cfg} onClick={() => onDelete(d)}>{I.trash}</button></div>
          </div>
        );
      })}
      {rows.length ? <div className="t-row sv-foot">{cols.map(c => <div key={c.key} className={cls(c)}><span className="tc-val">{foot(c)}</span></div>)}<div className="tc"></div></div> : null}
    </div>
  );
}

/* 수불부 — 품목 선택 → 일자별 입·출고 원장 (잔량 누계) */
function StockLedgerView({ items, moves, selId, onSelect, range, cols, cfg, head, extra }) {
  const cls = (c) => `tc ck-${c.kind} ${cfg && c.hidden ? "is-colhidden" : ""}`;
  const cell = (c, m) => {
    switch (c.key) {
      case "date": return <span className="tc-val">{m.date}</span>;
      case "type": return <span className={"sv-type is-" + m.type}>{m.type}</span>;
      case "ref": return <span className="tc-val">{m.ref}</span>;
      case "partner": return <span className="tc-val">{m.partner || "—"}</span>;
      case "inQ": return <span className="tc-val sv-in">{m.type === "입고" || (m.type === "조정" && m.qty > 0) ? formatMoney(Math.abs(m.qty)) : ""}</span>;
      case "outQ": return <span className="tc-val sv-out">{m.type === "출고" || (m.type === "조정" && m.qty < 0) ? formatMoney(Math.abs(m.qty)) : ""}</span>;
      case "bal": return <span className="tc-val">{formatMoney(m.bal)}</span>;
      case "by": return <span className="tc-val">{m.by}</span>;
      default: return <span className="tc-val">{c.isCustom ? (calcFlatCol(c.def, m, LEDGER_COLS) || "—") : "—"}</span>;
    }
  };
  const it = items.find(x => x.id === selId) || items[0] || null;
  const list = it ? moves.filter(m => m.itemId === it.id) : [];
  const s = it ? stockMoveSummary(it, moves) : null;
  let bal = s ? s.open : 0;
  const rows = list.map(m => { bal += m.type === "입고" ? m.qty : m.type === "출고" ? -m.qty : m.qty; return { ...m, bal }; });
  return (
    <div className="sl-wrap">
      <aside className="sl-side">
        <div className="sl-side-h"><span>품목</span><span>{items.length}</span></div>
        <div className="sl-list">
          {items.map(x => {
            const sm = stockMoveSummary(x, moves);
            return (
              <button key={x.id} type="button" className={"sl-item " + (it && it.id === x.id ? "is-on" : "")} onClick={() => onSelect(x.id)}>
                <span className="sl-code">{x.code}</span>
                <span className="sl-name">{x.name}<em>{x.spec}</em></span>
                <span className="sl-bal">{formatMoney(sm.end)}<i>{x.unit}</i></span>
              </button>
            );
          })}
          {!items.length ? <div className="t-empty">조건에 맞는 품목이 없습니다.</div> : null}
        </div>
      </aside>
      <section className="sl-main">
        {it ? (
          <React.Fragment>
            <header className="sl-head">
              <div>
                <div className="sl-title">{it.name} <span className="sl-spec">{it.spec} · {it.unit}</span></div>
                <div className="sl-sub"><span className="is-mono">{it.code}</span> · {it.category} · {it.storage || "보관 미지정"}</div>
              </div>
              <div className="sl-kpis">
                <div className="sl-kpi"><span>기초</span><b>{formatMoney(s.open)}</b></div>
                <div className="sl-kpi"><span>입고</span><b className="sv-in">{formatMoney(s.inQ)}</b></div>
                <div className="sl-kpi"><span>출고</span><b className="sv-out">{formatMoney(s.outQ)}</b></div>
                <div className="sl-kpi"><span>기말</span><b>{formatMoney(s.end)}</b></div>
              </div>
            </header>
            <div className="table-card sv-card" style={{ "--cols-template": cols.map(c => colW(c, cfg)).join(" ") }}>
              {extra}
              <div className="t-row t-head">{head}</div>
              <div className="t-row sl-open">
                {cols.map(c => <div key={c.key} className={cls(c)}>{c.key === "date" ? <span className="tc-val">{range.from || "—"}</span> : c.key === "type" ? <span className="sv-type is-open">기초</span> : c.key === "ref" ? <span className="tc-val">전기 이월 재고</span> : c.key === "bal" ? <span className="tc-val">{formatMoney(s.open)}</span> : null}</div>)}
              </div>
              {rows.map(m => (
                <div key={m.id} className="t-row">{cols.map(c => <div key={c.key} className={cls(c)}>{cell(c, m)}</div>)}</div>
              ))}
              <div className="t-row sv-foot">
                {cols.map(c => <div key={c.key} className={cls(c)}><span className="tc-val">{c.key === "date" ? "합계" : c.key === "ref" ? rows.length + "건" : c.key === "inQ" ? <span className="sv-in">{formatMoney(s.inQ + Math.max(0, s.adj))}</span> : c.key === "outQ" ? <span className="sv-out">{formatMoney(s.outQ + Math.max(0, -s.adj))}</span> : c.key === "bal" ? formatMoney(s.end) : ""}</span></div>)}
              </div>
            </div>
          </React.Fragment>
        ) : <div className="t-empty">좌측에서 품목을 선택하세요.</div>}
      </section>
    </div>
  );
}

function App({ embedded = false, view: viewProp, onView } = {}) {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [viewLocal, setViewLocal] = useState("현황");
  const view = embedded ? viewProp : viewLocal;
  const setView = embedded ? onView : setViewLocal;
  const [period, setPeriod] = useState("이번 달");
  const [customRange, setCustomRange] = useState(() => stockPeriodRange("이번 달", {}));
  const [draftRange, setDraftRange] = useState(() => stockPeriodRange("이번 달", {}));
  const range = useMemo(() => stockPeriodRange(period, customRange), [period, customRange]);
  useEffect(() => {
    const fn = (e) => { if (e.key === "F8" && !document.querySelector(".modal-root, .pick-root")) { e.preventDefault(); if (view === "현황") setAsOf(draftAsOf); else { setPeriod("기본"); setCustomRange(draftRange); } } };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [view, draftRange, draftAsOf]);
  const [ledgerId, setLedgerId] = useState(null);
  const [asOf, setAsOf] = useState(STOCK_TODAY);
  const [draftAsOf, setDraftAsOf] = useState(STOCK_TODAY);

  /* 탭별 개별 양식 — 현황/변동표/수불부/조정 각각 화면설정·저장 양식이 따로 유지됨 */
  const ccStatus = useColConfig({ allColumns: ALL_COLUMNS, defaultVisible: DEFAULT_VISIBLE_COLS, prefix: "nonamed.stock.v1" });
  const ccMove = useColConfig({ allColumns: MOVE_COLS, defaultVisible: MOVE_COLS.map(c => c.key), prefix: "nonamed.stock.move.v1" });
  const ccLedger = useColConfig({ allColumns: LEDGER_COLS, defaultVisible: LEDGER_COLS.map(c => c.key), prefix: "nonamed.stock.ledger.v1" });
  const ccAdj = useColConfig({ allColumns: ADJ_COLS, defaultVisible: ADJ_COLS.map(c => c.key), prefix: "nonamed.stock.adj.v1" });
  const cc = ({ 현황: ccStatus, 변동표: ccMove, 수불부: ccLedger, 조정: ccAdj })[view] || ccStatus;
  const curBaseCols = ({ 현황: ALL_COLUMNS, 변동표: MOVE_COLS, 수불부: LEDGER_COLS, 조정: ADJ_COLS })[view] || ALL_COLUMNS;
  const visibleColumns = cc.visibleCols;
  const displayCols = cc.cfg ? cc.allCols : cc.visibleCols;
  const dragKey = useRef(null);
  const [colPop, setColPop] = useState(null);
  const [addColOpen, setAddColOpen] = useState(false);
  const [editCol, setEditCol] = useState(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [viewPickOpen, setViewPickOpen] = useState(false);
  const [renameCode, setRenameCode] = useState(null);
  const [owCode, setOwCode] = useState(null);
  const [delCode, setDelCode] = useState(null);
  const openColPop = (e, col) => { const cell = e.currentTarget; const card = cell.closest(".table-card"); const cr = card ? card.getBoundingClientRect() : { left: 0, top: 0 }; const b = cell.getBoundingClientRect(); setColPop({ key: col.key, x: b.left - cr.left + b.width / 2, y: b.bottom - cr.top + 4 }); };
  const startResize = (e, col) => { e.preventDefault(); e.stopPropagation(); const sx = e.clientX; const sw = parseInt(tmpW[col.key] || col.width) || 120; const move = (ev) => { const w = Math.max(60, sw + ev.clientX - sx); if (cc.cfg) cc.setWidth(col.key, w); else setTmpW(p => ({ ...p, [col.key]: w })); }; const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); }; window.addEventListener("mousemove", move); window.addEventListener("mouseup", up); };

  const renderHead = (cols) => cols.map(c => (
    <div key={c.key}
      className={`tc tc-${c.key} ck-${c.kind} ${cc.cfg ? "th-drag is-cfg" : ""} ${cc.cfg && c.hidden ? "is-colhidden" : ""}`}
      draggable={cc.cfg}
      onClick={cc.cfg ? (e) => openColPop(e, c) : undefined}
      onDragStart={() => { dragKey.current = c.key; }}
      onDragOver={(e) => { if (cc.cfg) e.preventDefault(); }}
      onDrop={(e) => { if (!cc.cfg) return; e.preventDefault(); cc.moveCol(dragKey.current, c.key); dragKey.current = null; }}
    >{c.label}<span className="th-resize" onMouseDown={(e) => startResize(e, c)} onClick={(e) => e.stopPropagation()} draggable={false} /></div>
  ));
  const renderExtra = () => (
    <>
      {cc.cfg ? (
        <div className="cfg-hint">⚙ 설정 모드 — 열 제목을 누르면 추가·이름수정·숨김·삭제할 수 있어요. 드래그로 순서 변경, 오른쪽 경계 드래그로 너뱄 조절.
          <button type="button" className="cfg-reset" onClick={cc.resetCols}>↺ 기본값</button>
        </div>
      ) : null}
      {cc.cfg && colPop ? (() => { const pc = cc.allCols.find(c => c.key === colPop.key); return <ColCfgPopover col={pc} x={colPop.x} y={colPop.y} onAddNew={() => setAddColOpen(true)} onRename={cc.renameCol} onToggle={cc.toggleCol} onRemove={cc.removeCol} onEdit={(def) => setEditCol(def)} onClose={() => setColPop(null)} />; })() : null}
    </>
  );

  const [items, setItems] = usePersistedList(NM_LIST_KEY.품목, INITIAL_ITEMS);
  const shared0 = useSharedDocs();
  const [adjDocs, setAdjDocs] = useState(readAdjDocs);
  useEffect(() => { const fn = () => setAdjDocs(readAdjDocs()); window.addEventListener("nonamed:docs", fn); window.addEventListener("storage", fn); return () => { window.removeEventListener("nonamed:docs", fn); window.removeEventListener("storage", fn); }; }, []);
  const shared = useMemo(() => ({ ...shared0, 조정: adjDocs }), [shared0, adjDocs]);
  const [adjOpen, setAdjOpen] = useState(false);
  const handleAdjust = (d) => {
    const id = "ADJ-" + String(adjDocs.length + 1).padStart(4, "0");
    const cur = items.find(it => it.id === d.itemId); const after = Math.max(0, (Number(cur && cur.stock) || 0) + d.qty);
    const doc = { id, ...d, after, by: "나", created: new Date().toISOString() };
    const next = [...adjDocs, doc]; setAdjDocs(next); writeAdjDocs(next);
    setItems(prev => prev.map(it => it.id === d.itemId ? { ...it, stock: after, updated: STOCK_TODAY } : it));
    setAdjOpen(false);
    showToast(`조정 전표 ${id} 저장 · ${d.item} ${d.qty > 0 ? "+" : "−"}${Math.abs(d.qty)}`);
  };
  const handleAdjustDelete = async (d) => {
    if (!(await nmConfirm({ title: "조정 전표 삭제", message: `조정 전표 ${d.id} 를 삭제할까요? ${d.item} 재고가 ${d.qty > 0 ? "−" : "+"}${Math.abs(d.qty)} 되돌려집니다.`, confirmLabel: "삭제", danger: true }))) return;
    const next = adjDocs.filter(x => x.id !== d.id); setAdjDocs(next); writeAdjDocs(next);
    setItems(prev => prev.map(it => it.id === d.itemId ? { ...it, stock: Math.max(0, (Number(it.stock) || 0) - d.qty), updated: STOCK_TODAY } : it));
    showToast(`조정 전표 ${d.id} 삭제`);
  };
  const linked = !!(shared.매입 || shared.매출);
  const moves = useMemo(() => docsToMoves(items, shared, range) || buildStockMoves(items, range), [items, range, shared]);
  // 기준일 이후 이력을 역산 → 기준일 시점 재고
  const afterMoves = useMemo(() => { const r = { from: asOf, to: "" }; return (docsToMoves(items, shared, r) || buildStockMoves(items, r)).filter(m => m.date > asOf); }, [items, shared, asOf]);
  const stockAsOf = (it) => { let s = Number(it.stock) || 0; afterMoves.forEach(m => { if (m.itemId !== it.id) return; if (m.type === "입고") s -= m.qty; else if (m.type === "출고") s += m.qty; else s -= m.qty; }); return Math.max(0, s); };
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [searchOpen, setSearchOpen] = useState(false);
  const [cond, setCond] = useState({ code: "", name: "", spec: "", unit: "", tax: "전체" });
  const [dcond, setDcond] = useState({ code: "", name: "", spec: "", unit: "", tax: "전체" });
  useEffect(() => { if (searchOpen) setDcond(cond); }, [searchOpen]);
  const [checked, setChecked] = useState(() => new Set());

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [histItem, setHistItem] = useState(null);

  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);
  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 2400);
  };

  const filtered = useMemo(() => {
    const has = (v, s) => !v.trim() || (s || "").toLowerCase().includes(v.trim().toLowerCase());
    // 기준일 시점 재고로 환산한 뒤 필터 → 검색·상태·건수가 날짜 기준으로 동작
    const base = asOf === STOCK_TODAY ? items : items.map(p => ({ ...p, stock: stockAsOf(p) }));
    return base.filter(p => {
      if (statusFilter !== "전체" && p.status !== statusFilter) return false;
      if (cond.tax !== "전체" && p.tax !== cond.tax) return false;
      if (!has(cond.code, p.code) || !has(cond.name, p.name) || !has(cond.spec, p.spec) || !has(cond.unit, p.unit)) return false;
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return [p.code, p.name, p.spec, p.unit, p.tax].some(s => (s || "").toLowerCase().includes(q));
    });
  }, [items, query, statusFilter, cond, asOf, afterMoves]);

  const toggle = (id) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const toggleAll = () => {
    if (checked.size === filtered.length) setChecked(new Set());
    else setChecked(new Set(filtered.map(p => p.id)));
  };
  const allChecked = filtered.length > 0 && checked.size === filtered.length;

  const openNew = () => { if (cc.cfg) return; setAdjOpen(true); };
  const cfgRef = useRef(false);
  cfgRef.current = cc.cfg;
  useEffect(() => { const fn = (e) => { if (e.key === "F2" && !modalOpen && !cfgRef.current) { e.preventDefault(); openNew(); } }; window.addEventListener("keydown", fn); return () => window.removeEventListener("keydown", fn); }, [modalOpen]);
  useEffect(() => {
    const nw = new URLSearchParams(window.location.search);
    if (nw.get("new") === "1") {
      const nm = nw.get("name") || "";
      setEditing(nm ? { name: nm } : null);
      setModalOpen(true);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);
  const openEdit = (p) => { if (cc.cfg) return; setEditing(p); setModalOpen(true); };
  const [listResetAsk, setListResetAsk] = useState(false);
  const [listDonePrompt, setListDonePrompt] = useState(false);
  const [tmpW, setTmpW] = useState({});
  const rowDrag = useRef(null);
  useEffect(() => { const up = () => { rowDrag.current = null; }; window.addEventListener("mouseup", up); return () => window.removeEventListener("mouseup", up); }, []);
  const listCfgSnap = useRef(null);
  const enterListCfg = () => { listCfgSnap.current = cc.snapshot(); cc.setCfg(true); };
  const finishListCfg = () => {
    if (listCfgSnap.current && JSON.stringify(cc.snapshot()) === JSON.stringify(listCfgSnap.current)) { cc.setCfg(false); showToast("변경사항이 없어 설정을 종료했어요", "info"); }
    else setListDonePrompt(true);
  };
  const cancelListCfg = () => { setListDonePrompt(false); if (listCfgSnap.current) cc.restore(listCfgSnap.current); cc.setCfg(false); };
  const exportExcel = () => {
    const cols = cc.visibleCols;
    const headers = cols.map(c => c.label);
    const matrix = filtered.map(p => cols.map(c => {
      if (c.isCustom) return calcFlatCol(c.def, p, ALL_COLUMNS) || "";
      const v = p[c.key] ?? (c.key === "code" ? p.id : "");
      return v == null ? "" : String(v);
    }));
    const esc = (v) => { const t2 = v == null ? "" : String(v); return /[",\n]/.test(t2) ? '"' + t2.replace(/"/g, '""') + '"' : t2; };
    const lines = [headers.map(esc).join(","), ...matrix.map(r => r.map(esc).join(","))];
    const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `재고목록_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(`${filtered.length}건을 내려받았습니다.`);
  };
  useHotkeys({ F9: () => { if (!cc.cfg) setSearchOpen(true); }, F10: () => { if (cc.cfg) finishListCfg(); else enterListCfg(); } });
  useEffect(() => {
    if (!searchOpen) return;
    const fn = (e) => { if (e.key === "F8") { e.preventDefault(); setSearchOpen(false); } };
    window.addEventListener("keydown", fn, true);
    return () => window.removeEventListener("keydown", fn, true);
  }, [searchOpen]);
  const openCopy = (p, e) => {
    e?.stopPropagation();
    const copy = { ...p, id: undefined, name: p.name + " (복사본)", code: "", stock: 0, updated: new Date().toISOString().slice(0, 10) };
    setEditing(null);
    // pre-fill via initial flow: temporarily set form initial then open
    setEditing(copy);
    setTimeout(() => setEditing({ ...copy, id: undefined }), 0);
    setModalOpen(true);
    showToast(`「${p.name}」을(를) 복사하여 새 품목으로 등록합니다.`);
  };

  const today = () => new Date().toISOString().slice(0, 10);

  const handleSave = (form, isEdit) => {
    if (isEdit) {
      setItems(prev => prev.map(it => it.id === editing.id ? { ...it, ...form, updated: today() } : it));
    } else {
      const nextId = "I-" + String(items.length + 1).padStart(4, "0");
      setItems(prev => [{ id: nextId, ...form, updated: today() }, ...prev]);
    }
  };

  const handleDelete = async (p) => {
    if (!(await nmConfirm({ title: "품목 삭제", message: `「${p.name}」 품목을 삭제할까요?`, confirmLabel: "삭제", danger: true }))) return;
    setItems(prev => prev.filter(x => x.id !== p.id));
    setModalOpen(false);
    showToast(`「${p.name}」 품목이 삭제되었습니다.`);
  };

  const handleBulkDelete = async () => {
    if (checked.size === 0) return;
    if (!(await nmConfirm({ title: "선택 삭제", message: `선택한 ${checked.size}개 품목을 삭제할까요? 삭제 후에는 되돌릴 수 없습니다.`, confirmLabel: "삭제", danger: true }))) return;
    setItems(prev => prev.filter(p => !checked.has(p.id)));
    showToast(`${checked.size}개 품목이 삭제되었습니다.`);
    setChecked(new Set());
  };

  const handleBulkPrice = ({ mode, target, value }) => {
    setItems(prev => prev.map(it => {
      if (!checked.has(it.id)) return it;
      const cur = Number(it[target]) || 0;
      let next;
      if (mode === "percent") next = Math.round(cur * (1 + value / 100));
      else next = cur + value;
      if (next < 0) next = 0;
      return { ...it, [target]: next, updated: today() };
    }));
    showToast(`${checked.size}개 품목의 ${target === "price" ? "판매단가" : "매입단가"}가 ${mode === "percent" ? value + "%" : (value > 0 ? "+" : "") + formatMoney(Math.abs(value)) + "원"} 조정되었습니다.`);
    setBulkOpen(false);
  };

  return (
    <div className={"layout" + (embedded ? " is-embedded" : "")}>
      {embedded ? null : <Sidebar active="stock" />}

      <div className="main">
        {embedded ? null : <TopBar />}

        <div className={`content ${cc.cfg ? "is-cfg-mode" : ""}`}>
          <header className="page-head">
            <div className="page-head-l">
              <h1 className="page-title">{embedded ? "품목" : "재고"}</h1>
              {cc.views.length > 0 ? (() => { const av = cc.views.find(v => v.code === cc.activeView); return (
                <div className="active-view-wrap">
                  <button type="button" className={`active-view ${av ? "" : "is-none"}`} title="화면 선택" onClick={() => setViewPickOpen(o => !o)}>
                    <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M4 7l8-3 8 3-8 3-8-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M4 12l8 3 8-3M4 17l8 3 8-3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
                    {av ? <><span className="active-view-code">{av.code}</span><span className="active-view-name">{av.name}</span></> : <span className="active-view-name">화면 선택</span>}
                    <span className="active-view-caret">{I.chevron}</span>
                  </button>
                  {viewPickOpen ? (
                    <>
                      <div className="vpm-scrim" onClick={() => setViewPickOpen(false)} />
                      <div className="vpm-menu active-view-menu">
                        <div className="vpm-menu-h">화면 선택</div>
                        <div className="vpm-list">
                          {cc.views.map(v => (
                            <button key={v.code} type="button" className={`vpm-item vpm-pick ${v.code === cc.activeView ? "is-on" : ""}`} onClick={() => { cc.applyView(v.code); setViewPickOpen(false); }}>
                              <span className="vpm-code">{v.code}</span>
                              <span className="vpm-name">{v.name}</span>
                              {v.code === cc.activeView ? <span className="vpm-dot" /> : null}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              ); })() : null}
            </div>

            <div className="page-actions">
              <ViewPresetMenu views={cc.views} activeCode={cc.activeView} enabled={cc.cfg} onApply={cc.applyView} onSaveNew={() => setSaveOpen(true)} onOverwrite={(c) => setOwCode(c)} onRename={(c) => setRenameCode(c)} onDelete={(c) => setDelCode(c)} />
              {cc.cfg ? <button type="button" className="btn-ghost" title="기본 열·순서·너비로 되돌리기" onClick={() => setListResetAsk(true)}>초기화</button> : null}
              <button type="button" className={`btn-ghost ${cc.cfg ? "is-on-cfg" : ""}`} onClick={() => { if (cc.cfg) finishListCfg(); else enterListCfg(); }}>{I.cog} {cc.cfg ? "설정 완료" : "화면 설정"}</button>
              <button type="button" className="btn-ghost" disabled={cc.cfg} onClick={() => { if (!cc.cfg) exportExcel(); }}>{I.download} excel</button>
              <button type="button" className="btn-ghost" disabled={cc.cfg}>{I.upload} 엑셀 일괄 등록</button>
            </div>
          </header>

          {/* view tabs */}
          <div className="view-row">
            <div className="view-tabs">
              {embedded ? <button type="button" className={`view-tab ${cc.cfg ? "is-disabled" : ""}`} disabled={cc.cfg} onClick={() => { if (!cc.cfg) setView("품목"); }}>품목</button> : null}
              {STOCK_VIEW_TABS.map(v => (
                <button key={v} type="button" className={`view-tab ${view === v ? "is-on" : ""} ${cc.cfg ? "is-disabled" : ""}`} disabled={cc.cfg} onClick={() => { if (!cc.cfg) setView(v); }}>{v}</button>
              ))}
            </div>
            {view === "조정" ? <button type="button" className="btn-primary title-add adj-btn" disabled={cc.cfg} onClick={openNew}>{I.plus} 재고 조정 <kbd className="btn-kbd">F2</kbd></button> : null}
            {view === "조정" && adjDocs.length ? <span className="sv-src is-on" title="저장된 조정 전표">조정 전표 {adjDocs.length}건</span> : null}
            {view !== "현황" && view !== "조정" ? (
              <span className={"sv-src " + (linked ? "is-on" : "")} title={linked ? "매입·매출 화면에서 입력한 전표를 집계합니다" : "매입·매출 화면을 한 번 열면 실제 전표로 연결됩니다"}>{linked ? "매입·매출 전표 연동" : "예시 이력"}</span>
            ) : null}
          </div>

          {/* period bar — 현황: 기준일(시점) / 변동표·수불부: 기간 */}
          {view === "현황" ? (
            <div className="sp-bar">
              <span className="sp-label">기준일</span>
              <div className="sp-range">
                <input type="date" className="fld-input is-mono sp-date" value={draftAsOf} onChange={(e) => setDraftAsOf(clampDateStr(e.target.value))} />
                <button type="button" className="btn-primary sp-apply" onClick={() => setAsOf(draftAsOf)}>조회 <kbd className="btn-kbd">F8</kbd></button>
              </div>
              <div className="sp-meta">{asOf} 기준 재고 · <b>{filtered.length}</b>품목</div>
            </div>
          ) : (
          <div className="sp-bar">
              <div className="seg">
                {STOCK_PERIODS.map(p => (
                  <button key={p} type="button" className={`seg-item ${period === p ? "is-on" : ""}`} onClick={() => { setPeriod(p); if (p !== "기본") { const r = stockPeriodRange(p); setDraftRange(r); setCustomRange(r); } }}>{p}</button>
                ))}
              </div>
              <div className="sp-range">
                <input type="date" className="fld-input is-mono sp-date" value={draftRange.from} onChange={(e) => setDraftRange(r => ({ ...r, from: clampDateStr(e.target.value) }))} />
                <span className="sp-tilde">~</span>
                <input type="date" className="fld-input is-mono sp-date" value={draftRange.to} onChange={(e) => setDraftRange(r => ({ ...r, to: clampDateStr(e.target.value) }))} />
                <button type="button" className="btn-primary sp-apply" onClick={() => { setPeriod("기본"); setCustomRange(draftRange); }}>조회 <kbd className="btn-kbd">F8</kbd></button>
              </div>
              <div className="sp-meta">
                {range.from || "—"} ~ {range.to || "—"} · <b>{view === "조정" ? adjDocs.filter(d => (!range.from || d.date >= range.from) && (!range.to || d.date <= range.to)).length : moves.length}</b>건
              </div>
            </div>
          )}

          {/* toolbar */}
          <div className="period-bar">
            <button type="button" className="period-search" disabled={cc.cfg} title={cc.cfg ? "화면 설정 중에는 사용할 수 없습니다" : undefined} onClick={() => { if (cc.cfg) return; setSearchOpen(true); }}>{I.search} 조건 검색</button>
            <SearchCondChips items={[{ key: "code", label: "품목코드", value: cond.code }, { key: "name", label: "품목명", value: cond.name }, { key: "spec", label: "규격", value: cond.spec }, { key: "unit", label: "단위", value: cond.unit }, { key: "tax", label: "면세여부", value: cond.tax }]}
              onClear={() => { const z = { code: "", name: "", spec: "", unit: "", tax: "전체" }; setCond(z); setDcond(z); }} />
          </div>

          <div className="toolbar">
            <div className="list-search">
              <span className="ls-icon">{I.search}</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="품목코드, 품목명, 규격, 보관 검색"
              />
            </div>

            <div className="tb-meta">
              <span><b>{filtered.length}</b>개 표시</span>
              {view === "현황" && checked.size > 0 ? (
                <span className="tb-sel">{checked.size}개 선택됨</span>
              ) : null}
            </div>
          </div>

          {/* table */}
          {view === "조정" ? <StockAdjustView docs={adjDocs.filter(d => filtered.some(p => p.id === d.itemId) || !items.some(p => p.id === d.itemId))} items={items} range={range} onDelete={handleAdjustDelete} onNew={openNew} cols={displayCols} cfg={cc.cfg} head={renderHead(displayCols)} extra={renderExtra()} /> : null}
          {view === "변동표" ? <StockMoveView items={filtered} moves={moves} onOpen={openEdit} cols={displayCols} cfg={cc.cfg} head={renderHead(displayCols)} extra={renderExtra()} /> : null}
          {view === "수불부" ? <StockLedgerView items={filtered} moves={moves} selId={ledgerId} onSelect={setLedgerId} range={range} cols={displayCols} cfg={cc.cfg} head={renderHead(displayCols)} extra={renderExtra()} /> : null}
          {view === "현황" ? <div
            className="table-card"
            style={{ "--cols-template": "84px " + displayCols.map(c => (cc.cfg && c.hidden) ? "110px" : (tmpW[c.key] ? tmpW[c.key] + "px" : String(c.width).replace(/minmax\(\s*([\d.]+px)\s*,[^)]*\)/, "$1"))).join(" ") + " 88px", "--row-min": "max-content" }}
          >
            {cc.cfg ? (
              <div className="cfg-hint">⚙ 설정 모드 — 열 제목을 누르면 추가·이름수정·숨김·삭제할 수 있어요. 드래그로 순서 변경, 오른쪽 경계 드래그로 너비 조절.
                <button type="button" className="cfg-reset" onClick={cc.resetCols}>↺ 기본값</button>
              </div>
            ) : null}
            {cc.cfg && colPop ? (() => { const pc = cc.allCols.find(c => c.key === colPop.key); return <ColCfgPopover col={pc} x={colPop.x} y={colPop.y} onAddNew={() => setAddColOpen(true)} onRename={cc.renameCol} onToggle={cc.toggleCol} onRemove={cc.removeCol} onEdit={(def) => setEditCol(def)} onClose={() => setColPop(null)} />; })() : null}
            <div className="t-row t-head">
              <div className="tc-check">
                <button type="button" className={`cbx ${allChecked ? "is-on" : ""}`} aria-label="전체 선택" onClick={toggleAll}>
                  {allChecked ? I.check : null}
                </button>
              </div>
              {displayCols.map(c => (
                <div key={c.key}
                  className={`tc tc-${c.key} ck-${c.kind} ${cc.cfg ? "th-drag is-cfg" : ""} ${cc.cfg && c.hidden ? "is-colhidden" : ""}`}
                  draggable={cc.cfg}
                  onClick={cc.cfg ? (e) => openColPop(e, c) : undefined}
                  onDragStart={() => { dragKey.current = c.key; }}
                  onDragOver={(e) => { if (cc.cfg) e.preventDefault(); }}
                  onDrop={(e) => { if (!cc.cfg) return; e.preventDefault(); cc.moveCol(dragKey.current, c.key); dragKey.current = null; }}
                >{c.label}<span className="th-resize" onMouseDown={(e) => startResize(e, c)} onClick={(e) => e.stopPropagation()} draggable={false} /></div>
              ))}
              <div className="tc tc-act"></div>
            </div>

            {filtered.length === 0 ? (
              <div className="t-empty">
                조건에 맞는 재고가 없습니다.
                <button type="button" className="btn-link" onClick={() => { setQuery(""); setStatusFilter("전체"); }}>
                  필터 초기화
                </button>
              </div>
            ) : null}

            {filtered.map(p => {
              const on = checked.has(p.id);
              const lowStock = p.stock !== "" && p.safety !== "" && Number(p.stock) <= Number(p.safety);
              return (
                <div
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  className={`t-row ${on ? "is-checked" : ""}`}
                  onClick={() => openEdit(p0)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); openEdit(p0); } }}
                >
                  <div className="tc-check" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className={`cbx ${on ? "is-on" : ""}`} aria-label="선택" onClick={() => toggle(p.id)}>
                      {on ? I.check : null}
                    </button>
                  </div>
                  {displayCols.map(c => (
                    <div key={c.key} className={`tc tc-${c.key} ck-${c.kind} ${cc.cfg && c.hidden ? "is-colhidden" : ""}`}>
                      {c.isCustom ? (
                        <span className="tc-val">{calcFlatCol(c.def, p, ALL_COLUMNS) || "—"}</span>
                      ) : c.kind === "name" ? (
                        <span className="ln-text">{p.name}</span>
                      ) : c.kind === "chip" && c.key === "status" ? (
                        <span className={`status-chip s-${p.status}`}>{p.status}</span>
                      ) : c.kind === "price" ? (
                        <span className="tc-val">{formatMoney(p[c.key])}<span className="price-won">원</span></span>
                      ) : c.kind === "stock" ? (
                        <span className={`tc-val stock-num ${lowStock && c.key === "stock" ? "is-low" : ""}`}>{formatMoney(p[c.key])}</span>
                      ) : c.kind === "num" ? (
                        <span className="tc-val">{formatMoney(p[c.key])}</span>
                      ) : (
                        <span className="tc-val">{p[c.key] || "—"}</span>
                      )}
                    </div>
                  ))}
                  <div className="tc tc-act" onClick={(e) => e.stopPropagation()}>
                  </div>
                </div>
              );
            })}
          </div> : null}
        </div>
      </div>

      <AdjustModal open={adjOpen} items={items} onSave={handleAdjust} onClose={() => setAdjOpen(false)} />

      <ItemModal
        open={modalOpen}
        initial={editing}
        items={items}
        formLayout={t.formLayout}
        afterSave={t.afterSave}
        setAfterSave={(v) => setTweak("afterSave", v)}
        showHelper={t.showHelper}
        onSave={handleSave}
        onDelete={handleDelete}
        onClose={() => setModalOpen(false)}
        setToast={showToast}
        openHistory={(it) => setHistItem(it)}
      />

      <ColPickModal open={addColOpen} scope={"재고 " + view} baseKeys={curBaseCols.map(c => c.label)} srcGroups={{ "조회 기술키": ["순번", "인쇄"], "입력 기술키": curBaseCols.map(c => c.label) }} activeSlots={ITEM_EXTRA_SLOTS.map(s2 => ({ key: s2.label, label: s2.label, type: s2.type === "num" ? "money" : s2.type === "lookup" ? "lookup" : "text" }))} existing={(cc.allCols || []).map(c => ({ label: c.label }))} onApply={(cols) => cc.addCustomMany(cols)} onClose={() => setAddColOpen(false)} />
      <ConfirmModal open={listResetAsk} title="화면 초기화" message="목록 화면을 기본 구성으로 되돌릴까요? 추가한 열·순서·너비·이름 설정이 사라집니다." confirmLabel="초기화" danger onConfirm={() => { cc.resetCols(); setTmpW({}); setListResetAsk(false); showToast("기본 구성으로 되돌렸습니다."); }} onClose={() => setListResetAsk(false)} />
      {listDonePrompt ? (() => { const av = cc.views.find(v => v.code === cc.activeView); return (
        <div className="modal-root" role="dialog" aria-modal="true" style={{ zIndex: 95 }}>
          <div className="modal-scrim" onClick={cancelListCfg} />
          <div className="modal modal-confirm confirm-modal">
            <div className="confirm-body">
              <h2 className="confirm-title">화면 설정 저장</h2>
              <p className="confirm-msg">{av ? <React.Fragment>현재 적용된 양식: <b>{av.code} "{av.name}"</b><br/></React.Fragment> : <React.Fragment>현재 적용된 저장 양식이 없습니다.<br/></React.Fragment>}변경한 화면 설정을 어떻게 저장할까요?</p>
            </div>
            <footer className="modal-foot">
              <div className="ff-left" />
              <div className="ff-right">
                <button type="button" className="btn-ghost" onClick={cancelListCfg}>취소</button>
                <button type="button" className="btn-ghost" onClick={() => { setListDonePrompt(false); cc.setCfg(false); if (av) cc.overwriteView(av.code); }}>현재 양식에 적용</button>
                <button type="button" className="btn-primary" onClick={() => { setListDonePrompt(false); cc.setCfg(false); setSaveOpen(true); }}>신규 저장</button>
              </div>
            </footer>
          </div>
        </div>
      ); })() : null}
      <FlatAddColModal open={!!editCol} initial={editCol} baseColumns={ALL_COLUMNS} onAdd={(c) => { if (editCol._base) cc.renameCol(editCol.key, c.label); else cc.updateCustom(editCol.key, c); setEditCol(null); }} onClose={() => setEditCol(null)} />
      <SearchCondModal open={searchOpen} prefix="stock" sub="품목코드·품목명·규격·단위·면세여부로 검색합니다."
        fields={[
          { key: "code", label: "품목코드", node: (
            <label className="fld"><span className="fld-label">품목코드</span>
              <input type="text" className="fld-input is-mono" value={dcond.code} onChange={(e) => setDcond(c => ({ ...c, code: e.target.value }))} placeholder="품목코드" /></label>) },
          { key: "name", label: "품목명", node: (
            <label className="fld"><span className="fld-label">품목명</span>
              <input type="text" className="fld-input" value={dcond.name} onChange={(e) => setDcond(c => ({ ...c, name: e.target.value }))} placeholder="품목명" /></label>) },
          { key: "spec", label: "규격", node: (
            <label className="fld"><span className="fld-label">규격</span>
              <input type="text" className="fld-input" value={dcond.spec} onChange={(e) => setDcond(c => ({ ...c, spec: e.target.value }))} placeholder="규격" /></label>) },
          { key: "unit", label: "단위", node: (
            <label className="fld"><span className="fld-label">단위</span>
              <input type="text" className="fld-input" value={dcond.unit || ""} onChange={(e) => setDcond(c => ({ ...c, unit: e.target.value }))} placeholder="단위" /></label>) },
          { key: "tax", label: "면세여부", node: (
            <div className="fld"><span className="fld-label">면세여부</span>
              <div className="seg seg-sm">
                {["전체", "과세", "면세"].map(k => (
                  <button key={k} type="button" className={`seg-item ${dcond.tax === k ? "is-on" : ""}`} onClick={() => setDcond(c => ({ ...c, tax: k }))}>{k}</button>
                ))}
              </div>
            </div>) },
        ]}
        onReset={() => { const z = { code: "", name: "", spec: "", unit: "", tax: "전체" }; setDcond(z); setCond(z); setStatusFilter("전체"); setQuery(""); }}
        onSearch={() => { setCond(dcond); setSearchOpen(false); }} onClose={() => setSearchOpen(false)} />
      <SaveViewModal open={saveOpen} code={nextViewCode(cc.views)} onSave={(n) => { cc.saveView(n); setSaveOpen(false); }} onClose={() => setSaveOpen(false)} />
      <SaveViewModal open={!!renameCode} title="화면 이름 변경" saveLabel="변경" initialName={(cc.views.find(v => v.code === renameCode) || {}).name || ""} onSave={(n) => { cc.renameView(renameCode, n); setRenameCode(null); }} onClose={() => setRenameCode(null)} />
      <ConfirmModal open={!!owCode} title="화면 덮어쓰기"
        message={(() => { const v = cc.views.find(x => x.code === owCode); return v ? `${v.code} "${v.name}" 화면을 지금 화면 구성으로 덮어쓸까요?` : ""; })()}
        confirmLabel="덮어쓰기" onConfirm={() => { cc.overwriteView(owCode); setOwCode(null); }} onClose={() => setOwCode(null)} />
      <ConfirmModal open={!!delCode} title="화면 삭제" danger confirmLabel="삭제"
        message={(() => { const v = cc.views.find(x => x.code === delCode); return v ? `${v.code} "${v.name}" 화면을 삭제할까요? 이 작업은 되돌릴 수 없습니다.` : ""; })()}
        onConfirm={() => { cc.deleteView(delCode); setDelCode(null); }} onClose={() => setDelCode(null)} />

      <BulkPriceModal
        open={bulkOpen}
        count={checked.size}
        onApply={handleBulkPrice}
        onClose={() => setBulkOpen(false)}
      />

      <HistoryModal
        open={!!histItem}
        item={histItem}
        onClose={() => setHistItem(null)}
      />

      {toast ? <div className="page-toast" role="status">{toast}</div> : null}

      {embedded ? null : <TweaksPanel title="Tweaks">
        <TweakSection label="모달 폼" />
        <TweakRadio label="폼 열 수" value={t.formLayout}
          options={["1열", "2열"]}
          onChange={(v) => setTweak("formLayout", v)} />

        <TweakSection label="저장 동작" />
        <TweakRadio label="저장 후" value={t.afterSave}
          options={AFTER_SAVE_OPTIONS}
          onChange={(v) => setTweak("afterSave", v)} />

        <TweakSection label="안내 문구" />
        <TweakToggle label="필드 도움말 표시" value={t.showHelper}
          onChange={(v) => setTweak("showHelper", v)} />
      </TweaksPanel>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Styles
   ───────────────────────────────────────────── */
const css = `
.layout{ display: grid; grid-template-columns: 88px 1fr; min-height: 100vh; background: var(--bg); }

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
.sb-label{ font-size:11px; font-weight:500; }
.sb-plus{
  appearance:none; cursor:pointer; border:0;
  width:48px; height:48px; border-radius:50%;
  background: var(--accent); color:#fff;
  display:grid; place-items:center;
  box-shadow: 0 0 0 6px color-mix(in oklab, var(--accent) 14%, transparent),
              0 12px 26px -10px color-mix(in oklab, var(--accent) 50%, transparent);
}
.sb-plus svg{ width:22px; height:22px; }

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
.page-head{ display:flex; align-items:flex-end; justify-content:space-between; gap:18px; flex-wrap:wrap; }
.page-head-l{ display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
.title-add{ height:38px; }
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

/* Buttons */
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
.btn-primary:disabled{ opacity:.5; cursor: default; transform: none; }
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
.btn-link{
  appearance:none; cursor:pointer; border:0; background:transparent;
  color: var(--ink); text-decoration: underline; text-underline-offset: 3px;
  font: 500 13px "IBM Plex Sans KR", sans-serif;
  margin-left: 8px;
}

/* Period bar */
.period-bar{ display:flex; align-items:center; gap:14px; flex-wrap:wrap; background:var(--card); border:1px solid var(--line); border-radius:14px; padding:10px 14px; }
.period-search{ margin-left:auto; display:inline-flex; align-items:center; gap:6px; height:32px; padding:0 14px; border-radius:9px; border:0; background:var(--accent); color:#fff; font:600 13px "IBM Plex Sans KR",sans-serif; cursor:pointer; }
.period-search:hover{ background:var(--accent-ink); }
.period-search svg{ width:15px; height:15px; }
.modal-newitem{ width:min(560px,100%); }
.ni-body{ padding:20px 26px 8px; }
.ni-grid{ display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px 16px; }

/* Toolbar */
.toolbar{
  display:flex; align-items:center; gap:12px; flex-wrap: wrap;
  background: var(--card); border: 1px solid var(--line);
  border-radius: 14px; padding: 10px 14px;
}
.list-search{
  flex: 1; min-width: 260px;
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
.tb-meta{
  margin-left: auto;
  display:flex; align-items:center; gap:8px;
  font-size: 12.5px; color: var(--ink-3); flex-wrap: wrap;
}
.tb-meta b{ color: var(--ink); font-weight: 600; }
.tb-sel{ color: var(--ink); font-weight: 500; padding-left: 10px; border-left: 1px solid var(--line); }

/* Table */
.view-row{ display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
.view-row .title-add{ margin-left:0; }
.view-row .sv-src{ margin-left:0; }
.adj-body{ padding:6px 24px 18px; display:flex; flex-direction:column; gap:14px; overflow-y:auto; flex:1 1 auto; min-height:0; }
.adj-row{ display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:12px; }
.adj-seg .seg-item{ flex:1; }
.adj-pick{ display:flex; flex-direction:column; gap:6px; }
.adj-list{ display:flex; flex-direction:column; border:1px solid var(--line); border-radius:10px; overflow:hidden; background:var(--card); }
.adj-opt{ display:grid; grid-template-columns:96px 1fr auto auto; gap:12px; align-items:center; text-align:left; padding:9px 12px; border:0; border-bottom:1px solid var(--line-soft); background:transparent; cursor:pointer; font:500 13.5px "IBM Plex Sans KR",sans-serif; color:var(--ink); }
.adj-opt:last-child{ border-bottom:0; } .adj-opt:hover{ background:var(--card-2); }
.adj-code{ font-family:"JetBrains Mono",monospace; font-size:12px; color:var(--ink-3); }
.adj-spec{ font-size:12px; color:var(--ink-3); } .adj-stock{ font-size:12px; color:var(--ink-2); font-variant-numeric:tabular-nums; white-space:nowrap; }
.adj-empty{ padding:14px; font-size:13px; color:var(--ink-3); text-align:center; }
.adj-picked{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; padding:10px 12px; border:1px solid var(--line); border-radius:10px; background:var(--card-2); font-size:14px; }
.adj-picked .btn-sm{ margin-left:auto; }
.adj-preview{ padding:10px 14px; border-radius:10px; background:var(--card-2); font-size:14px; color:var(--ink-2); font-variant-numeric:tabular-nums; }
.adj-preview b{ color:var(--ink); font-size:16px; }
.view-tabs{ display:inline-flex; gap:4px; background:var(--card); border:1px solid var(--line); border-radius:12px; padding:4px; align-self:flex-start; }
.view-tab{ appearance:none; cursor:pointer; border:0; background:transparent; font:600 14px "IBM Plex Sans KR",sans-serif; color:var(--ink-2); padding:9px 22px; border-radius:9px; transition:background .12s,color .12s; white-space:nowrap; }
.view-tab:hover{ color:var(--ink); }
.view-tab.is-on{ background:var(--ink); color:var(--card); }
.view-tab.is-disabled{ opacity:.4; cursor:not-allowed; }
.sp-bar{ display:flex; align-items:center; gap:14px; flex-wrap:wrap; background:var(--card); border:1px solid var(--line); border-radius:12px; padding:8px 10px; }
.sp-bar .seg{ flex:none; }
.sp-bar .seg-item{ white-space:nowrap; }
.sp-range{ display:flex; align-items:center; gap:6px; }
.sp-date{ width:140px; padding:7px 10px; }
.sp-tilde{ color:var(--ink-3); font-size:13px; }
.sp-apply{ padding:7px 12px; font-size:12.5px; display:inline-flex; align-items:center; gap:6px; }
.sp-meta{ margin-left:auto; display:flex; align-items:center; gap:12px; font-size:12px; color:var(--ink-3); font-variant-numeric:tabular-nums; }
.sp-label{ font-size:12.5px; font-weight:600; color:var(--ink-2); white-space:nowrap; }
.sp-only{ display:inline-flex; align-items:center; gap:6px; color:var(--ink-2); cursor:pointer; padding-right:12px; border-right:1px solid var(--line); }
.sp-only input{ accent-color:var(--accent); }
.sp-meta b{ color:var(--ink); }
.sv-ym-wrap{ display:flex; align-items:center; gap:12px; }
.sv-src{ padding:4px 10px; border-radius:999px; font-size:11.5px; font-weight:600; background:var(--bg-2); color:var(--ink-3); }
.sv-src.is-on{ background:color-mix(in oklab, var(--good) 16%, transparent); color:var(--good); }
.sv-ym{ display:inline-flex; align-items:center; gap:8px; font-size:12.5px; color:var(--ink-3); }
.sv-ym .fld-input{ width:150px; padding:7px 10px; }
.sv-in{ color:var(--good); font-weight:600; }
.sv-out{ color:var(--bad); font-weight:600; }
.sv-card .t-row:not(.t-head):not(.sv-foot){ cursor:default; }
.sv-card{ position:relative; }
.sv-card .tc.is-colhidden{ opacity:.45; }
.sv-card .t-row.sv-foot{ background:var(--card-2); font-weight:600; cursor:default; border-top:2px solid var(--line); }
.sv-card .t-row.sv-foot:hover{ background:var(--card-2); }
.sv-type{ display:inline-block; padding:2px 8px; border-radius:6px; font-size:11.5px; font-weight:600; background:var(--bg-2); color:var(--ink-2); white-space:nowrap; }
.sv-type.is-입고{ background:color-mix(in oklab, var(--good) 16%, transparent); color:var(--good); }
.sv-type.is-출고{ background:color-mix(in oklab, var(--bad) 14%, transparent); color:var(--bad); }
.sv-type.is-조정{ background:color-mix(in oklab, var(--warn) 22%, transparent); color:oklch(0.5 0.12 75); }
.sv-type.is-open{ background:var(--accent-soft); color:var(--accent-ink); }
.sl-open{ background:color-mix(in oklab, var(--card-2) 60%, var(--card)); }
.sl-wrap{ display:grid; grid-template-columns:260px minmax(0,1fr); gap:14px; align-items:start; }
@media (max-width:1100px){ .sl-wrap{ grid-template-columns:minmax(0,1fr); } .sl-side{ position:static; } .sl-list{ max-height:220px; } }
.sl-side{ background:var(--card); border:1px solid var(--line); border-radius:14px; overflow:hidden; position:sticky; top:12px; }
.sl-side-h{ display:flex; justify-content:space-between; align-items:center; padding:12px 14px; font:600 12px "JetBrains Mono",monospace; letter-spacing:.06em; text-transform:uppercase; color:var(--ink-3); background:var(--card-2); border-bottom:1px solid var(--line); white-space:nowrap; }
.sl-side-h span{ color:var(--ink-2); }
.sl-list{ max-height:calc(100vh - 300px); overflow-y:auto; display:flex; flex-direction:column; }
.sl-item{ appearance:none; border:0; background:transparent; cursor:pointer; text-align:left; display:grid; grid-template-columns:auto 1fr auto; gap:10px; align-items:center; padding:10px 14px; border-bottom:1px solid var(--line-soft); }
.sl-item:hover{ background:var(--card-2); }
.sl-item.is-on{ background:var(--accent-soft); box-shadow:inset 3px 0 0 var(--accent); }
.sl-code{ font:500 11px "JetBrains Mono",monospace; color:var(--ink-3); }
.sl-name{ font-size:13px; font-weight:600; color:var(--ink); min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sl-name em{ font-style:normal; font-weight:400; color:var(--ink-3); margin-left:6px; font-size:11.5px; }
.sl-bal{ font:500 12.5px "JetBrains Mono",monospace; color:var(--ink-2); }
.sl-bal i{ font-style:normal; font-size:10.5px; color:var(--ink-3); margin-left:3px; font-family:"IBM Plex Sans KR",sans-serif; }
.sl-main{ display:flex; flex-direction:column; gap:12px; min-width:0; }
.sl-main .table-card{ width:100%; overflow-x:auto; }
.sl-main .table-card .t-row{ min-width:max-content; }
.sv-foot .tc-val{ white-space:nowrap; }
.sl-head{ display:flex; justify-content:space-between; align-items:center; gap:16px; flex-wrap:wrap; background:var(--card); border:1px solid var(--line); border-radius:14px; padding:14px 18px; }
.sl-title{ font:700 18px "Gowun Batang",serif; color:var(--ink); }
.sl-spec{ font:400 12.5px "IBM Plex Sans KR",sans-serif; color:var(--ink-3); margin-left:6px; }
.sl-sub{ font-size:12px; color:var(--ink-3); margin-top:3px; }
.sl-kpis{ display:flex; gap:6px; }
.sl-kpi{ display:flex; flex-direction:column; gap:2px; min-width:82px; padding:8px 12px; border-radius:10px; background:var(--card-2); }
.sl-kpi span{ font-size:10.5px; color:var(--ink-3); letter-spacing:.04em; }
.sl-kpi b{ font:600 15px "JetBrains Mono",monospace; color:var(--ink); }
.table-card{
  background: var(--card); border: 1px solid var(--line);
  border-radius: 14px; overflow-x: auto; overflow-y: hidden;
}
.t-row{
  cursor:pointer; text-align:left;
  display: grid;
  grid-template-columns: var(--cols-template);
  align-items: center; gap: 12px;
  padding: 13px 18px;
  border-bottom: 1px solid var(--line-soft);
  font: 500 14px "IBM Plex Sans KR", sans-serif;
  transition: background .12s; outline: 0;
}
.t-row:last-child{ border-bottom: 0; }
.t-row:hover{ background: var(--card-2); }
.t-row:focus-visible{ background: var(--card-2); box-shadow: inset 3px 0 0 var(--accent); }
.t-row.is-checked{ background: color-mix(in oklab, var(--accent-soft) 28%, var(--card)); }
.t-row.t-head{
  background: var(--card-2);
  font-family:"JetBrains Mono", monospace;
  font-size:10.5px; letter-spacing:.12em; text-transform:uppercase;
  color: var(--ink-3); cursor: default;
  padding: 11px 18px;
}
.t-row.t-head:hover{ background: var(--card-2); }

.tc-check{ display:flex; align-items:center; justify-content:center; gap:5px; overflow:hidden; }
.tc-check .cbx{ flex:none; }
.tc{ min-width: 0; overflow: hidden; white-space: normal; overflow-wrap: anywhere; word-break: break-word; }
.t-row.t-head .tc{ white-space: nowrap; position: relative; }
.table-card{ width: max-content; min-width: 100%; flex: none; max-width: none; overflow: visible; }
.content{ overflow: visible; }
.table-card .t-row{ align-items: stretch; }
.table-card .t-row > *{ align-self: stretch; display: flex; align-items: center; padding-top: 6px; padding-bottom: 6px; }
.table-card .t-row > *:not(:last-child){ border-right: 1px solid var(--line-soft); }
.t-row.row-new{ box-shadow: inset 3px 0 0 var(--accent); background: color-mix(in oklab, var(--accent-soft) 14%, var(--card)); }
.new-flag{ display:inline-block; white-space: nowrap; font: 700 9.5px "IBM Plex Sans KR", sans-serif; letter-spacing: .2px; color: var(--accent-ink); background: var(--accent-soft); border: 1px solid color-mix(in oklab, var(--accent) 30%, var(--line)); border-radius: 5px; padding: 1px 4px; }
.cbx.cbx-new{ border-color: var(--accent); box-shadow: 0 0 0 2px color-mix(in oklab, var(--accent-soft) 60%, transparent); }
.btn-ghost:disabled, .btn-primary:disabled, .period-search:disabled{ opacity:.45; cursor:not-allowed; }
.tc-val{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; display:inline-block; max-width:100%; }

/* column kind styles */
.ck-name .ln-text{ font-weight: 600; color: var(--ink); }
.ck-text{ color: var(--ink-2); }
.ck-mono{ font-family:"JetBrains Mono", monospace; font-size: 13px; color: var(--ink-2); font-variant-numeric: tabular-nums; }
.ck-muted{ color: var(--ink-3); font-size: 13px; }
.ck-price{
  font-family:"JetBrains Mono", monospace;
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: var(--ink); font-weight: 500;
}
.ck-price.t-head{ font-weight: inherit; }
.t-head.ck-price, .t-row.t-head .ck-price{ text-align: right; }
.price-won{ color: var(--ink-3); font-size: 11px; margin-left: 3px; font-weight: 400; }
.ck-stock, .ck-num{
  font-family:"JetBrains Mono", monospace;
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: var(--ink-2);
}
.stock-num.is-low{ color: var(--bad); font-weight: 600; }
.ck-chip .status-chip{ display: inline-grid; }

.cbx{
  appearance:none; cursor:pointer;
  width: 20px; height: 20px; border-radius: 6px;
  border: 1.5px solid rgba(31,26,20,.28);
  background: var(--card);
  display:grid; place-items:center; color: var(--card);
  transition: background .15s, border-color .15s;
}
.cbx.is-on{ background: var(--ink); border-color: var(--ink); }
.cbx svg{ width:12px; height:12px; }

.status-chip{
  display: inline-grid; place-items:center;
  padding: 3px 9px; border-radius: 999px;
  font-size: 10.5px; letter-spacing: .04em; font-weight: 600;
}
.status-chip.s-판매중{ background: color-mix(in oklab, var(--good) 18%, transparent); color: oklch(0.42 0.12 150); }
.status-chip.s-단종  { background: rgba(31,26,20,.08); color: var(--ink-2); }
.status-chip.s-품절  { background: color-mix(in oklab, var(--bad) 15%, transparent); color: var(--bad); }

.tc-act{ display:flex; align-items:center; justify-content:flex-end; gap: 2px; }

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

.t-empty{
  padding: 60px 24px; text-align: center;
  color: var(--ink-3); font-size: 14px;
}

/* Modal */
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
  background: var(--card); border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: 0 40px 80px -20px rgba(31,26,20,.28);
  display: flex; flex-direction: column;
  overflow: hidden;
  animation: modalIn .22s cubic-bezier(.2,.7,.3,1);
}
.modal-sm{ width: min(540px, 100%); }
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
.modal-sub b{ color: var(--ink); font-weight: 600; }
.req{ color: var(--accent); font-weight: 700; margin-left: 2px; }
.modal-head-actions{ display:flex; align-items:center; gap: 6px; flex-shrink: 0; }
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
  display: grid; gap: 22px;
  overflow-y: auto; flex: 1;
}
.modal-body.cols-2{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
.modal-body.cols-1{ grid-template-columns: 1fr; }
.fset-wide{ grid-column: 1 / -1; }

.fset{ display:flex; flex-direction:column; gap:10px; }
.fset-h{
  font-family:"JetBrains Mono", monospace;
  font-size: 11px; letter-spacing: .14em; text-transform: uppercase;
  color: var(--ink-3); margin: 0 0 2px;
}
.fset-grid{
  display:grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 12px 16px;
}
.fset-grid .fld{ position:relative; }
.fset-grid .fld.is-drag{ cursor:pointer; }
.fset-grid .fld.is-drag:hover > .fld-label{ color:var(--accent-ink); }
.fld-rz{ position:absolute; top:0; right:-9px; width:12px; height:100%; cursor:col-resize; z-index:5; }
.fld-rz::after{ content:""; position:absolute; top:4px; bottom:4px; left:5px; width:2px; border-radius:2px; background:color-mix(in oklab, var(--accent) 55%, transparent); opacity:.55; }
.fld-rz:hover::after{ opacity:1; }
.fld-menu-wrap{ position:static; }
.fld-menu{ position:absolute; top:100%; left:0; z-index:60; background:var(--card); border:1px solid var(--line); border-radius:10px; box-shadow:0 12px 26px rgba(15,23,42,.14); padding:4px; display:flex; flex-direction:column; min-width:130px; }
.fld-menu-h{ display:flex; align-items:center; gap:6px; padding:6px 10px 4px; font:600 11.5px "IBM Plex Sans KR",sans-serif; color:var(--ink-3); }
.fld-menu-dot{ width:5px; height:5px; border-radius:50%; background:var(--accent); }
.fld-menu button{ appearance:none; background:transparent; border:0; text-align:left; padding:7px 10px; border-radius:7px; font:500 12.5px "IBM Plex Sans KR",sans-serif; color:var(--ink); cursor:pointer; white-space:nowrap; }
.fld-menu button:hover{ background:color-mix(in oklab, var(--accent) 12%, transparent); }
.fld-menu button.is-danger{ color:var(--bad); }
.xf-slots{ margin-top:12px; }
.xf-row{ display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
.xf-row-h{ font:600 11.5px "IBM Plex Sans KR",sans-serif; color:var(--ink-3); }
.xf-slot{ appearance:none; cursor:pointer; border:1px dashed var(--line); background:transparent; color:var(--ink-2); font:500 12px "IBM Plex Sans KR",sans-serif; border-radius:999px; padding:3px 10px; }
.xf-slot:hover{ border-color:var(--accent); color:var(--accent-ink); }
.xf-tag{ margin-left:6px; font:600 10.5px "IBM Plex Sans KR",sans-serif; color:var(--ink-3); border:1px solid var(--line); border-radius:999px; padding:1px 6px; }
.modal-body.cols-1 .fset-grid .fld{ grid-column: span 12 !important; }
.fset-err{ font-size: 12px; color: var(--bad); }

.fld{ display:flex; flex-direction:column; gap:6px; min-width:0; }
.fld-label{
  font-size: 12.5px; color: var(--ink-2); font-weight: 500;
  display: inline-flex; align-items: baseline; gap: 6px;
}
.fld-hint{ color: var(--ink-3); font-weight: 400; font-size: 11.5px; }

.fld-wrap{ position: relative; display: flex; align-items: stretch; }
.fld-wrap.has-suffix .fld-input{ padding-right: 36px; }
.fld-suffix{
  position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
  color: var(--ink-3); font-size: 12.5px; pointer-events: none;
  font-family:"JetBrains Mono", monospace;
}
.fld-select select{ appearance: none; padding-right: 36px; cursor: pointer; }
.fld-chev{
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  width: 18px; height: 18px; color: var(--ink-3); pointer-events: none;
  display: grid; place-items: center;
}
.fld-chev svg{ width: 16px; height: 16px; }

.fld-input, .fld-area{
  appearance:none; outline:0; width:100%;
  background: var(--bg-2); border: 1px solid transparent;
  border-radius: 10px; padding: 0 14px; height: 42px;
  font: 500 14px "IBM Plex Sans KR", sans-serif;
  color: var(--ink);
  transition: border-color .15s, background .15s, box-shadow .15s;
}
.fld-area{ padding: 12px 14px; height: auto; resize: vertical; line-height:1.5; }
.fld-input::placeholder, .fld-area::placeholder{ color: rgba(31,26,20,.3); font-weight: 400; }
.fld-input:focus, .fld-area:focus{
  background:#fff; border-color: var(--ink);
  box-shadow: 0 0 0 3px rgba(31,26,20,.06);
}
.fld-input:disabled{ background: rgba(31,26,20,.04); color: var(--ink-2); cursor: not-allowed; }
.fld-input.is-mono{ font-family:"JetBrains Mono", monospace; font-variant-numeric: tabular-nums; letter-spacing: .01em; }
.fld-input.is-right{ text-align: right; padding-right: 36px; }

.margin-display{
  height: 42px; padding: 0 14px;
  background: var(--bg-2); border-radius: 10px;
  display: flex; align-items: center;
  font-family:"JetBrains Mono", monospace;
  color: var(--ink); font-size: 13.5px; font-weight: 500;
}
.margin-display.is-warn{ color: var(--bad); }

.seg{
  display:inline-flex; gap: 2px;
  background: var(--bg-2); border-radius: 10px; padding: 3px;
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

.modal-foot{
  padding: 16px 26px;
  border-top: 1px solid var(--line-soft);
  background: var(--card-2);
  display:flex; align-items:center; gap:16px; flex-wrap: wrap;
}
.ff-left{ display:flex; align-items:center; gap:10px; }
.ff-k{ font-size: 12px; color: var(--ink-3); font-family:"JetBrains Mono", monospace; letter-spacing: .1em; text-transform: uppercase; }
.ff-v{ color: var(--ink); font-weight: 500; font-size: 13px; }
.ff-right{ margin-left:auto; display:flex; align-items:center; gap:8px; }

/* Column settings */
.col-list{
  padding: 8px 26px;
  overflow-y: auto; flex: 1;
  display: flex; flex-direction: column;
}
.col-row{
  display: grid;
  grid-template-columns: 22px 1fr auto auto;
  align-items: center; gap: 12px;
  padding: 12px 4px;
  border-bottom: 1px dashed var(--line-soft);
  color: var(--ink-2);
}
.col-row:last-child{ border-bottom: 0; }
.col-handle{
  width: 22px; height: 22px; color: var(--ink-3);
  display: grid; place-items: center; opacity: .6;
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
  position: relative; transition: background .15s; padding: 0;
}
.switch:hover{ background: rgba(31,26,20,.28); }
.switch.is-on{ background: var(--ink); }
.switch:disabled{ opacity: .4; cursor: default; }
.switch-knob{
  position: absolute; top: 2px; left: 2px;
  width: 18px; height: 18px; border-radius: 50%;
  background: var(--card);
  box-shadow: 0 1px 2px rgba(31,26,20,.18);
  transition: transform .18s cubic-bezier(.2,.7,.3,1);
}
.switch.is-on .switch-knob{ transform: translateX(16px); }

/* Bulk price */
.bulk-hint{
  font-size: 12.5px; color: var(--ink-3);
  padding: 8px 12px; background: var(--bg-2);
  border-radius: 8px; line-height: 1.4;
}

/* History */
.hist-list{
  padding: 14px 26px 16px;
  overflow-y: auto; flex: 1;
  display: flex; flex-direction: column;
}
.hist-row{
  display: grid;
  grid-template-columns: 80px 24px 1fr;
  gap: 12px; padding: 4px 0;
}
.hist-date{
  font-family:"JetBrains Mono", monospace;
  font-size: 11.5px; color: var(--ink-3);
  padding-top: 10px;
}
.hist-rail{ position: relative; align-self: stretch; display: flex; justify-content: center; }
.hist-dot{
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--accent); margin-top: 14px;
  box-shadow: 0 0 0 3px var(--card); z-index: 1;
}
.hist-line{
  position: absolute; left: 50%; top: 26px; bottom: -8px;
  transform: translateX(-50%);
  width: 1px; background: var(--line);
}
.hist-body{ padding: 8px 0 14px; }
.hist-action{ font-size: 14px; font-weight: 600; color: var(--ink); }
.hist-detail{ font-size: 13px; color: var(--ink-2); margin-top: 2px; font-family:"JetBrains Mono", monospace; }
.hist-who{ font-size: 11.5px; color: var(--ink-3); margin-top: 4px; }

/* Toast */
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
  .content{ max-width: none; }
}
@media (max-width: 880px){
  .modal-body.cols-2{ grid-template-columns: 1fr; }
  .fset-grid .fld{ grid-column: span 12 !important; }
  .layout{ grid-template-columns: 72px 1fr; }
}
`;

(function injectCss(){
  if (document.getElementById('stock-css')) return;
  const s = document.createElement('style');
  s.id = 'stock-css';
  s.textContent = css + '.layout.is-embedded{display:block;min-height:0}.layout.is-embedded .main{margin:0;min-height:0}';
  document.head.appendChild(s);
})();

window.StockApp = App;
if (!window.__STOCK_NO_MOUNT) ReactDOM.createRoot(document.getElementById('app')).render(<App />);
