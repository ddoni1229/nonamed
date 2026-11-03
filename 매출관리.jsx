function clampDateStr(v){ if(!v) return v; const p = v.split("-"); if(p[0] && p[0].length > 4) p[0] = p[0].slice(0, 4); return p.join("-"); }
// 매출관리.jsx — maeip.jsx(매입관리) 기준 자동 생성. 구조 동일, 용어만 매출용으로 치환.
// 매출관리.jsx — nonamed ERP 매출 관리 (KPI + 기간필터 + 테이블 + 전표 상세 모달 + 화면설정)

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
  sales: <svg viewBox="0 0 24 24" fill="none"><path d="M5 8l5 5 3-3 6 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="19" cy="17" r="1.7" fill="currentColor"/></svg>,
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

/* ─────────────────────────────────────────────
   Data
   ───────────────────────────────────────────── */

// 매출 전표. supply = 공급가액, items = 라인아이템
function mk(id, date, partner, mgr, status, lines) {
  const supply = lines.reduce((s, l) => s + l.qty * l.price, 0);
  const vat = lines.reduce((s, l) => s + (l.tax === "과세" ? Math.round(l.qty * l.price * 0.1) : 0), 0);
  return { id, date, partner, mgr, status, lines, supply, vat, total: supply + vat };
}

// ── 잔액 계산 단일 소스 ───────────────────────────────
// 전기이월/수금이 화면마다 따로 놀지 않도록, 미수금·원장이 모두 아래 헬퍼를 사용한다.
function seedStr(str) { let h = 0; for (const ch of String(str)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; }
function openingFor(partner) { return 0; } // 전기이월 (저장소 연동 전까지 0)
// 수금 레코드는 입출금관리 전표(외상매출금 계정)에서 온다 — cashPaymentsFor("매출")
function buildPayments(list) { return []; }
// 거래처 원장/잔액: 전기이월 + Σ매출 − Σ수금, 시간순 entries 포함
function partnerLedger(partner, list, payments) {
  const sales = list.filter(s => !s.deleted && s.partner === partner);
  const pays = (payments || []).filter(p => p.partner === partner);
  const prev = openingFor(partner);
  const sale = sales.reduce((a, s) => a + s.total, 0);
  const paid = pays.reduce((a, p) => a + p.amount, 0);
  const rawEntries = [
    ...sales.map(s => ({ date: s.date, kind: "매출", ref: s.id, summary: s.lines && s.lines.length ? (s.lines[0].name + (s.lines[0].spec ? " " + s.lines[0].spec : "") + (s.lines.length > 1 ? " 외 " + (s.lines.length - 1) + "건" : "")) : "-", amount: s.total, memo: "" })),
    ...pays.map(p => ({ date: p.date, kind: "수금", ref: "", summary: "수금 (입금)", amount: p.amount, memo: p.memo || "" })),
  ].sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : (a.kind === "매출" ? -1 : 1));
  let run = prev;
  rawEntries.forEach(e => { run += e.kind === "수금" ? -e.amount : e.amount; e.bal = run; });
  return { partner, prev, sale, paid, bal: prev + sale - paid, sales: sales.length, entries: rawEntries };
}

const SALES = [
  mk("S-26-0142", "2026-05-31", "한양식자재",     "박지영", "완료",   [
    { name:"양배추", spec:"1kg",  qty:20, price:1800, tax:"면세" },
    { name:"백김치", spec:"500g", qty:10, price:5200, tax:"면세" },
    { name:"대파",   spec:"500g", qty:15, price:3000, tax:"면세" },
  ]),
  mk("S-26-0141", "2026-05-31", "송파유통",       "최영민", "주문", [
    { name:"신라면", spec:"5입",   qty:8,  price:4500, tax:"과세" },
    { name:"콜라",   spec:"500ml", qty:24, price:1200, tax:"과세" },
  ]),
  mk("S-26-0140", "2026-05-30", "동대문푸드",     "이수진", "완료",   [
    { name:"식용유", spec:"1.8L", qty:12, price:6900, tax:"과세" },
    { name:"고추장", spec:"3kg",  qty:6,  price:14500, tax:"과세" },
    { name:"참기름", spec:"320ml",qty:5,  price:9200,  tax:"과세" },
  ]),
  mk("S-26-0139", "2026-05-30", "마포정육점",     "강마포", "완료",   [
    { name:"한우 등심", spec:"500g", qty:4, price:62000, tax:"면세" },
    { name:"삼겹살",    spec:"1kg",  qty:8, price:18900, tax:"면세" },
  ]),
  mk("S-26-0138", "2026-05-29", "성수냉동",       "문호철", "완료",   [
    { name:"닭가슴살", spec:"1kg", qty:10, price:10500, tax:"면세" },
    { name:"새우",     spec:"500g",qty:6,  price:24000, tax:"면세" },
  ]),
  mk("S-26-0137", "2026-05-29", "종로식자재마트", "한종로", "주문", [
    { name:"백미", spec:"20kg", qty:12, price:62000, tax:"면세" },
  ]),
  mk("S-26-0136", "2026-05-28", "광진수산",       "권광진", "완료",   [
    { name:"고등어", spec:"마리", qty:20, price:5500, tax:"면세" },
    { name:"새우",   spec:"500g", qty:8,  price:24000, tax:"면세" },
  ]),
  mk("S-26-0135", "2026-05-28", "강서물산",       "문강서", "완료",   [
    { name:"양배추", spec:"1kg",  qty:30, price:1800, tax:"면세" },
    { name:"대파",   spec:"500g", qty:20, price:3000, tax:"면세" },
  ]),
  mk("S-26-0134", "2026-05-27", "한양식자재",     "박지영", "완료",   [
    { name:"백김치", spec:"500g", qty:18, price:5200, tax:"면세" },
  ]),
  mk("S-26-0133", "2026-05-26", "송파유통",       "최영민", "완료",   [
    { name:"신라면", spec:"5입",   qty:14, price:4500, tax:"과세" },
    { name:"콜라",   spec:"500ml", qty:48, price:1200, tax:"과세" },
    { name:"보리음료",spec:"500ml", qty:24, price:1400, tax:"과세" },
  ]),
  mk("S-26-0132", "2026-05-25", "마포정육점",     "강마포", "주문", [
    { name:"삼겹살", spec:"1kg", qty:12, price:18900, tax:"면세" },
  ]),
  mk("S-26-0131", "2026-05-24", "동대문푸드",     "이수진", "완료",   [
    { name:"고추장", spec:"3kg",  qty:10, price:14500, tax:"과세" },
    { name:"식용유", spec:"1.8L", qty:8,  price:6900,  tax:"과세" },
  ]),
];

/* 샘플 데이터 제거(배포용) — 실제 데이터는 저장소 연동 후 매입 */
SALES.length = 0;

const STATUS_OPTIONS = ["주문", "완료"];

/* 거래처 / 담당자 / 품목 마스터 (검색용) */
const PARTNER_MASTER = [
  { name: "한양식자재", code: "C-001", ceo: "이한양", phone: "02-555-1241", region: "강남구" },
  { name: "송파유통",   code: "C-002", ceo: "김송파", phone: "02-411-3320", region: "송파구" },
  { name: "동대문푸드", code: "C-003", ceo: "정대문", phone: "02-967-2002", region: "동대문구" },
  { name: "마포정육점", code: "C-004", ceo: "강마포", phone: "02-322-7700", region: "마포구" },
  { name: "성수냉동",   code: "C-005", ceo: "오성수", phone: "02-488-1820", region: "성동구" },
  { name: "종로식자재마트", code: "C-006", ceo: "한종로", phone: "02-733-5050", region: "종로구" },
  { name: "강서물산",   code: "C-007", ceo: "문강서", phone: "02-655-4100", region: "강서구" },
  { name: "광진수산",   code: "C-008", ceo: "권광진", phone: "02-454-9912", region: "광진구" },
  { name: "노원청과",   code: "C-009", ceo: "신노원", phone: "02-933-1100", region: "노원구" },
  { name: "강북상회",   code: "C-010", ceo: "배강북", phone: "02-987-2200", region: "강북구" },
];
const MGR_MASTER = [
  { name: "박지영", code: "E-01", dept: "영업1팀", phone: "010-2241-1001" },
  { name: "최영민", code: "E-02", dept: "영업1팀", phone: "010-2241-1002" },
  { name: "이수진", code: "E-03", dept: "영업2팀", phone: "010-2241-1003" },
  { name: "강마포", code: "E-04", dept: "영업2팀", phone: "010-2241-1004" },
  { name: "문호철", code: "E-05", dept: "물류팀",  phone: "010-2241-1005" },
  { name: "한종로", code: "E-06", dept: "영업3팀", phone: "010-2241-1006" },
  { name: "권광진", code: "E-07", dept: "영업3팀", phone: "010-2241-1007" },
  { name: "정다은", code: "E-08", dept: "관리팀",  phone: "010-2241-1008" },
];
const ITEM_MASTER = [
  { code: "VG-001", name: "양배추",    spec: "1kg",   unit: "개",  price: 1800,  tax: "면세", stock: 48, safety: 20 },
  { code: "VG-002", name: "백김치",    spec: "500g",  unit: "개",  price: 5200,  tax: "면세", stock: 32, safety: 15 },
  { code: "VG-003", name: "대파",      spec: "500g",  unit: "단",  price: 3000,  tax: "면세", stock: 60, safety: 20 },
  { code: "NL-001", name: "신라면",    spec: "5입",   unit: "박스", price: 4500,  tax: "과세", stock: 120, safety: 40 },
  { code: "MT-001", name: "한우 등심", spec: "500g",  unit: "kg",  price: 62000, tax: "면세", stock: 18, safety: 10 },
  { code: "MT-002", name: "삼겹살",    spec: "1kg",   unit: "kg",  price: 18900, tax: "면세", stock: 26, safety: 12 },
  { code: "SF-001", name: "새우 (대)", spec: "500g",  unit: "kg",  price: 24000, tax: "면세", stock: 22, safety: 10 },
  { code: "SF-002", name: "고등어",    spec: "마리",  unit: "마리", price: 5500,  tax: "면세", stock: 40, safety: 15 },
  { code: "OI-001", name: "식용유",    spec: "1.8L",  unit: "병",  price: 6900,  tax: "과세", stock: 75, safety: 30 },
  { code: "RC-001", name: "백미",      spec: "20kg",  unit: "포",  price: 62000, tax: "면세", stock: 35, safety: 12 },
  { code: "SP-001", name: "고추장",    spec: "3kg",   unit: "통",  price: 14500, tax: "과세", stock: 28, safety: 10 },
  { code: "SP-002", name: "참기름",    spec: "320ml", unit: "병",  price: 9200,  tax: "과세", stock: 54, safety: 20 },
  { code: "DR-001", name: "콜라",      spec: "500ml", unit: "캔",  price: 1200,  tax: "과세", stock: 200, safety: 60 },
  { code: "FR-001", name: "닭가슴살",  spec: "1kg",   unit: "kg",  price: 10500, tax: "면세", stock: 44, safety: 20 },
];
/* 마스터를 거래처·품목 화면의 공유 저장소와 동기화 — 샘플 마스터는 저장소가 비어 있을 때만 유지 */
(function syncMasters() {
  const read = (k) => { try { const v = JSON.parse(localStorage.getItem(k)); return Array.isArray(v) ? v : null; } catch (e) { return null; } };
  const apply = () => {
    const ps = read(NM_LIST_KEY.거래처);
    if (ps) PARTNER_MASTER.splice(0, PARTNER_MASTER.length, ...ps.map(p => ({ name: p.name, code: p.code || p.id, ceo: p.ceo || "", phone: p.phone || p.mobile || "", region: p.addr || "", biz: p.biz || "" })));
    const its = read(NM_LIST_KEY.품목);
    if (its) ITEM_MASTER.splice(0, ITEM_MASTER.length, ...its.map(x => ({ code: x.code || x.id, name: x.name, spec: x.spec || "", unit: x.unit || "", price: Number(x.price) || 0, cost: Number(x.cost) || 0, tax: x.tax || "과세", stock: Number(x.stock) || 0, safety: Number(x.safety) || 0 })));
  };
  apply();
  window.addEventListener("nonamed:list", apply); window.addEventListener("storage", apply); window.addEventListener("focus", apply);
})();

/* 카톡/문자 붙여넣기 → 전표 라인 파싱
   지원 형식: "양배추 1", "양배추 1박스", "양배추 x2", "양배추 2개", "양배추\t3" 등
   품목명만 있는 줄은 수량 1로 처리. 첫 줄이 거래처명과 일치하면 거래처로 인식. */
function parsePastedOrder(text) {
  const rawLines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  if (rawLines.length === 0) return null;

  let partner = "";
  const lines = [];

  rawLines.forEach((raw, idx) => {
    // 거래처: 첫 줄이 거래처 마스터와 매칭되면 거래처로
    if (idx === 0) {
      const hit = PARTNER_MASTER.find(p => raw.replace(/\s/g, "").includes(p.name.replace(/\s/g, "")) || p.name.replace(/\s/g, "").includes(raw.replace(/\s/g, "")));
      if (hit && !/\d/.test(raw)) { partner = hit.name; return; }
    }
    // "거래처:" "주문:" 같은 라벨 줄 스킵
    if (/^(거래처|주문|매장|업체|상호)\s*[:：]/.test(raw)) {
      const v = raw.split(/[:：]/)[1]?.trim();
      if (v) partner = v;
      return;
    }

    // 수량 추출: 끝쪽 숫자 (단위/x 포함)
    let name = raw, qty = 1;
    const m = raw.match(/^(.*?)[\s\t]*(?:x|×|\*)?\s*(\d+)\s*(개|박스|봉|팩|kg|g|병|캔|포|단|마리|입|ea)?\.?$/i);
    if (m && m[1].trim()) {
      name = m[1].trim();
      qty = parseInt(m[2], 10) || 1;
    }
    name = name.replace(/[-·•:：]\s*$/, "").trim();
    if (!name) return;

    // 규격 추출: 품목명에 "1kg, 500g, 1.8L, 5입" 같은 토큰이 붙어있으면 분리
    let spec = "";
    const sm = name.match(/\s*(\d+(?:\.\d+)?\s?(?:kg|g|l|ml|입|개|box|박스|병|캔|포))\s*$/i);
    if (sm) { spec = sm[1].replace(/\s/g, ""); name = name.slice(0, sm.index).trim(); }

    // 품목 마스터 매칭: 명칭+규격 동일, 또는 명칭 완전 일치만 자동 매핑.
    // (부분 일치는 자동 매핑하지 않고 행의 '추천'으로 넘김)
    const key = name.replace(/\s/g, "");
    const specKey = spec.replace(/\s/g, "").toLowerCase();
    let it = null;
    if (specKey) {
      it = ITEM_MASTER.find(x => x.name.replace(/\s/g, "") === key && (x.spec || "").replace(/\s/g, "").toLowerCase() === specKey);
    }
    if (!it) it = ITEM_MASTER.find(x => x.name.replace(/\s/g, "") === key);
    lines.push(it
      ? { code: it.code, name: it.name, spec: it.spec, qty: String(qty), price: it.price, tax: it.tax, memo: "", raw: name }
      : { code: "", name, spec, qty: String(qty), price: "", tax: "과세", memo: "", raw: name });
  });

  if (lines.length === 0 && !partner) return null;
  return { partner, lines };
}

/* ─────────────────────────────────────────────
   Column definitions
   ───────────────────────────────────────────── */
const ALL_COLUMNS = [
  { key:"status",  label:"상태",      width:"90px",                 kind:"chip" },
  { key:"date",    label:"일자",      width:"110px",                kind:"mono" },
  { key:"id",      label:"전표번호",  width:"130px",                kind:"mono" },
  { key:"partner", label:"거래처",    width:"minmax(140px, 1.4fr)", kind:"name", locked:true },
  { key:"summary", label:"품목 요약", width:"minmax(160px, 1.6fr)", kind:"summary" },
  { key:"supply",  label:"공급가액",  width:"120px",                kind:"price" },
  { key:"vat",     label:"부가세",    width:"100px",                kind:"price" },
  { key:"total",   label:"합계 금액", width:"130px",                kind:"total" },
  { key:"mgr",     label:"담당자",    width:"90px",                 kind:"text" },
  { key:"print",   label:"인쇄",      width:"72px",                 kind:"print" },
];
const DEFAULT_VISIBLE_COLS = ["status","date","partner","summary","total","mgr","print"];
const COL_STORAGE_KEY = "nonamed.sales.columns.v5";

/* ─────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────── */
const fmt = (n) => Number(n || 0).toLocaleString("ko-KR");
const nameSpec = (l) => [l.name, l.spec].filter(Boolean).join(" ");
const summaryText = (lines) => lines.length === 1 ? nameSpec(lines[0]) : `${nameSpec(lines[0])} 외 ${lines.length - 1}건`;

// 거래명세서 한 장의 본문 마크업 (모던 스타일)
function statementBody(sale, copyLabel) {
  const rows = sale.lines.map((l, i) => `
    <tr>
      <td class="c">${i + 1}</td>
      <td class="nm">${l.name}</td>
      <td class="c sub">${l.spec || ""}</td>
      <td class="r">${fmt(l.qty)}</td>
      <td class="r">${fmt(l.price)}</td>
      <td class="r strong">${fmt(l.qty * l.price)}</td>
      <td class="r">${fmt(l.tax === "과세" ? Math.round(l.qty * l.price * 0.1) : 0)}</td>
    </tr>`).join("");
  const minRows = 8;
  const blanks = Array.from({ length: Math.max(0, minRows - sale.lines.length) }, () =>
    `<tr class="empty"><td class="c">&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`).join("");
  const koWon = (n) => "金 " + fmt(n) + " 원정 (₩" + fmt(n) + ")";
  const label = copyLabel || "공급받는자 보관용";
  const theme = label.includes("공급자") ? "red" : "blue";
  return `
    <section class="stmt th-${theme}">
      <div class="sh">
        <div class="sh-date">거래일자<br/><b>${sale.date}</b></div>
        <div class="sh-title">거 래 명 세 서</div>
        <div class="sh-sub">(${label})</div>
      </div>

      <table class="party">
        <tr>
          <td class="pl" rowspan="3">공<br/>급<br/>받<br/>는<br/>자</td>
          <td class="k">상호</td><td class="v strong">${sale.partner}</td>
          <td class="k">성명</td><td class="v">${sale.mgr} <span class="seal">(인)</span></td>
          <td class="pl pl-accent" rowspan="3">공<br/>급<br/>자</td>
          <td class="k">등록번호</td><td class="v mono" colspan="3">000-00-00000</td>
        </tr>
        <tr>
          <td class="k">사업자<br/>등록번호</td><td class="v mono">___-__-_____</td>
          <td class="k">담당</td><td class="v">${sale.mgr}</td>
          <td class="k">상호</td><td class="v strong">nonamed</td>
          <td class="k">성명</td><td class="v">대표 <span class="seal">(인)</span></td>
        </tr>
        <tr>
          <td class="k">주소</td><td class="v" colspan="3"></td>
          <td class="k">주소</td><td class="v" colspan="3">서울특별시 중구 · 전화 1588-0000</td>
        </tr>
      </table>

      <div class="amt-line">합계금액 <b>${koWon(sale.total)}</b></div>

      <table class="items">
        <thead><tr>
          <th style="width:30px">No</th><th>품 목</th><th style="width:70px">규격</th>
          <th style="width:58px" class="r">수량</th><th style="width:80px" class="r">단가</th>
          <th style="width:96px" class="r">공급가액</th><th style="width:80px" class="r">세액</th>
        </tr></thead>
        <tbody>${rows}${blanks}</tbody>
        <tfoot>
          <tr>
            <td colspan="5" class="r ftl">합 계</td>
            <td class="r strong">${fmt(sale.supply)}</td>
            <td class="r strong">${fmt(sale.vat)}</td>
          </tr>
        </tfoot>
      </table>

      <div class="foot">
        <div class="foot-total">
          <span>공급가액 ${fmt(sale.supply)}</span>
          <span>세액 ${fmt(sale.vat)}</span>
          <b>합계 ${fmt(sale.total)}원</b>
        </div>
        <div class="foot-note">위 금액을 정히 영수(청구)함.</div>
      </div>
    </section>`;
}

const STMT_CSS = `
  *{ box-sizing:border-box; }
  body{ font-family:"Batang","바탕","Malgun Gothic","맑은 고딕",serif; color:#16130F; margin:0; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  .page{ display:flex; flex-direction:column; }
  .pb{ page-break-after:always; }
  .stmt{ --c:#1B2A4A; --cl:#EDF1F7; --cb:#9AA7BC; --cm:#5A6B86; border:2px solid var(--c); padding:16px 18px 14px; background:#fff; margin-bottom:10px; }
  .stmt.th-red{ --c:#B42318; --cl:#FBEEEC; --cb:#D9A29C; --cm:#9A5750; }
  .stmt.th-blue{ --c:#1B4A8A; --cl:#EAF1FA; --cb:#9DB6D6; --cm:#5A739A; }
  .sh{ display:flex; align-items:center; justify-content:space-between; border-bottom:2px solid var(--c); padding-bottom:7px; margin-bottom:9px; }
  .sh-date{ font-size:10.5px; color:var(--cm); text-align:left; line-height:1.4; }
  .sh-date b{ font-family:"JetBrains Mono",monospace; color:#16130F; font-size:12px; }
  .sh-title{ font-size:25px; font-weight:800; letter-spacing:8px; color:var(--c); }
  .sh-sub{ font-size:11px; color:var(--c); font-weight:700; min-width:96px; text-align:right; }
  table.party{ width:100%; border-collapse:collapse; font-size:11px; margin-bottom:9px; table-layout:fixed; }
  table.party td{ border:1px solid var(--cb); padding:4px 7px; }
  table.party .pl{ width:22px; text-align:center; font-weight:700; color:var(--c); background:var(--cl); line-height:1.2; letter-spacing:1px; }
  table.party .pl-accent{ background:var(--c); color:#fff; }
  table.party .k{ width:56px; background:var(--cl); color:var(--cm); font-size:10px; text-align:center; }
  table.party .v.strong{ font-weight:800; font-size:12.5px; }
  table.party .mono{ font-family:"JetBrains Mono",monospace; }
  .seal{ color:var(--cb); font-size:10px; }
  .amt-line{ border:1.5px solid var(--c); background:var(--cl); text-align:center; padding:6px; font-size:13px; margin-bottom:9px; }
  .amt-line b{ font-weight:800; color:var(--c); letter-spacing:1px; margin-left:6px; }
  table.items{ width:100%; border-collapse:collapse; font-size:11px; }
  table.items th{ border:1px solid var(--cb); background:var(--c); color:#fff; padding:5px 6px; font-weight:600; text-align:left; }
  table.items td{ border:1px solid var(--cb); padding:4px 6px; }
  table.items td.c{ text-align:center; } table.items td.r,table.items th.r{ text-align:right; font-variant-numeric:tabular-nums; }
  table.items td.nm{ font-weight:700; } table.items td.sub{ color:var(--cm); font-size:10px; }
  table.items td.strong{ font-weight:700; }
  table.items tr.empty td{ height:22px; }
  table.items tfoot td{ background:var(--cl); font-weight:700; }
  table.items .ftl{ letter-spacing:4px; color:var(--c); }
  .foot{ display:flex; justify-content:space-between; align-items:center; margin-top:10px; border-top:1px solid var(--cb); padding-top:9px; }
  .foot-total{ display:flex; align-items:baseline; gap:14px; font-size:11.5px; color:var(--cm); }
  .foot-total b{ font-size:16px; color:var(--c); font-weight:800; }
  .foot-note{ font-size:11px; color:var(--cm); }
`;

// 거래명세서 HTML 빌더
function buildStatementHTML(sales, format = "single") {
  let pages;
  if (format === "duplex") {
    pages = sales.map((s, i) => `
      <div class="page${i < sales.length - 1 ? " pb" : ""}">
        ${statementBody(s, "공급받는자 보관용")}
        <div style="height:14px"></div>
        ${statementBody(s, "공급자 보관용")}
      </div>`).join("");
  } else {
    pages = sales.map((s, i) => `<div class="page${i < sales.length - 1 ? " pb" : ""}">${statementBody(s)}</div>`).join("");
  }
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"/>
  <title>거래명세서</title>
  <style>@page{ size:A4; margin:14mm; } body{ padding:14px; } ${STMT_CSS} ${format === "duplex" ? ".stmt{ padding:16px 18px; } .title{ font-size:20px; } .bn{ font-size:15px; }" : ""}</style>
  </head><body>${pages}</body></html>`;
}

// 거래명세서 인쇄
// format: "single"(1장) | "duplex"(2장 — 공급받는자용/공급자용 한 페이지에 2부)
function printDoc(sales, format = "single") {
  if (!sales || sales.length === 0) return;
  const w = window.open("", "_blank", "width=860,height=1000");
  if (!w) { alert("팝업이 차단되었습니다. 팝업 허용 후 다시 시도해 주세요."); return; }
  w.document.write(buildStatementHTML(sales, format));
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); }, 350);
}
function printStatement(sale, format) { printDoc([sale], format); }

// 거래명세서 인쇄 — 양식 선택 + 미리보기 팝업
function DefaultRangeModal({ open, onSave, onClose }) {
  const [back, setBack] = useState(3);
  const [fwd, setFwd] = useState(0);
  useEffect(() => {
    if (!open) return;
    try { const v = JSON.parse(localStorage.getItem("nonamed.sales.defaultRange.v1")); if (v) { setBack(v.back ?? 3); setFwd(v.fwd ?? 0); } } catch (e) {}
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!open) return null;
  const num = (v) => Math.max(0, parseInt(v, 10) || 0);
  return (
    <div className="modal-root">
      <div className="modal-scrim" onClick={onClose} />
      <div className="modal modal-newitem" style={{ maxWidth: 440 }}>
        <div className="modal-head">
          <div>
            <h2 className="modal-title">기본 검색 기간 설정</h2>
            <div className="modal-sub">오늘 기준 앞·뒤 개월 수로 기본 조회 기간을 정합니다.</div>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>{I.close}</button>
        </div>
        <div className="ni-body">
          <div className="defrange-row">
            <span>최근 앞</span>
            <input type="number" min="0" className="dr-num" value={back} onChange={(e) => setBack(num(e.target.value))} />
            <span>개월</span>
            <span className="defrange-sep">~ 뒤</span>
            <input type="number" min="0" className="dr-num" value={fwd} onChange={(e) => setFwd(num(e.target.value))} />
            <span>개월</span>
          </div>
          <div className="defrange-preview">{monthsAgo(TODAY, back)} ~ {monthsAfter(TODAY, fwd)}</div>
        </div>
        <footer className="modal-foot">
          <div className="ff-left" />
          <div className="ff-right">
            <button type="button" className="btn-ghost" onClick={onClose}>취소</button>
            <button type="button" className="btn-primary" onClick={() => onSave({ back, fwd })}>저장 <kbd className="btn-kbd">F8</kbd></button>
          </div>
        </footer>
      </div>
    </div>
  );
}

// 거래명세서 인쇄 — 양식 선택 + 미리보기 팝업
function SendModal({ open, count, partners, onRun, onClose }) {
  const [mode, setMode] = useState("each");
  const [partner, setPartner] = useState("");
  useEffect(() => {
    if (!open) return;
    setMode("each"); setPartner(partners[0] || "");
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-root">
      <div className="modal-scrim" onClick={onClose} />
      <div className="modal modal-newitem" style={{ maxWidth: 460 }}>
        <div className="modal-head">
          <div>
            <h2 className="modal-title">매출 전표로 보내기</h2>
            <div className="modal-sub">선택한 {count}건을 매출 전표로 전송합니다.</div>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>{I.close}</button>
        </div>
        <div className="ni-body">
          <div className="fld">
            <span className="fld-label">보내기 방식</span>
            <div className="field-chips">
              <button type="button" className={`field-chip ${mode === "each" ? "is-on" : ""}`} onClick={() => setMode("each")}>건별로 보내기</button>
              <button type="button" className={`field-chip ${mode === "merge" ? "is-on" : ""}`} onClick={() => setMode("merge")}>1개 전표로 합치기</button>
            </div>
          </div>
          {mode === "merge" ? (
            <div className="fld" style={{ marginTop: 14 }}>
              <span className="fld-label">거래처 선택</span>
              <select className="dr-input" value={partner} onChange={(e) => setPartner(e.target.value)} style={{ width: "100%" }}>
                {partners.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          ) : null}
        </div>
        <footer className="modal-foot">
          <div className="ff-left" />
          <div className="ff-right">
            <button type="button" className="btn-ghost" onClick={onClose}>취소</button>
            <button type="button" className="btn-primary" onClick={() => onRun({ mode, partner })}>{I.send} 보내기 저장</button>
          </div>
        </footer>
      </div>
    </div>
  );
}

// 거래명세서 인쇄 — 양식 선택 + 미리보기 팝업
function CopyModal({ open, count, onRun, onClose }) {
  const [mode, setMode] = useState("each");
  const [date, setDate] = useState(TODAY);
  useEffect(() => {
    if (!open) return;
    setMode("each"); setDate(TODAY);
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-root">
      <div className="modal-scrim" onClick={onClose} />
      <div className="modal modal-newitem" style={{ maxWidth: 460 }}>
        <div className="modal-head">
          <div>
            <h2 className="modal-title">전표 복사</h2>
            <div className="modal-sub">선택한 {count}건을 복사합니다.</div>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>{I.close}</button>
        </div>
        <div className="ni-body">
          <div className="fld">
            <span className="fld-label">복사 방식</span>
            <div className="field-chips">
              <button type="button" className={`field-chip ${mode === "each" ? "is-on" : ""}`} onClick={() => setMode("each")}>건별로 복사</button>
              <button type="button" className={`field-chip ${mode === "merge" ? "is-on" : ""}`} onClick={() => setMode("merge")}>거래처별 1건으로 합치기</button>
            </div>
          </div>
          <div className="fld" style={{ marginTop: 14 }}>
            <span className="fld-label">복사 전표 일자</span>
            <input type="date" className="dr-input" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: "100%" }} />
          </div>
        </div>
        <footer className="modal-foot">
          <div className="ff-left" />
          <div className="ff-right">
            <button type="button" className="btn-ghost" onClick={onClose}>취소</button>
            <button type="button" className="btn-primary" onClick={() => onRun({ mode, date })}>{I.copy} 복사 저장</button>
          </div>
        </footer>
      </div>
    </div>
  );
}

// 거래명세서 인쇄 — 양식 선택 + 미리보기 팝업
function PrintPreviewModal({ open, sales, onClose }) {
  const [format, setFormat] = useState("single");
  useEffect(() => {
    if (!open) return;
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!open || !sales || sales.length === 0) return null;

  return (
    <div className="modal-root" role="dialog" aria-modal="true" style={{ zIndex: 70 }}>
      <div className="modal-scrim" onClick={onClose} />
      <div className="modal print-modal">
        <header className="modal-head">
          <div>
            <h2 className="modal-title">거래명세서 인쇄</h2>
            <div className="modal-sub">{sales.length}건 · 양식을 선택하고 미리보기 후 인쇄하세요</div>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>{I.close}</button>
        </header>

        <div className="print-bar">
          <div className="seg">
            <button type="button" className={`seg-item ${format === "single" ? "is-on" : ""}`} onClick={() => setFormat("single")}>1장 양식</button>
            <button type="button" className={`seg-item ${format === "duplex" ? "is-on" : ""}`} onClick={() => setFormat("duplex")}>2장 (보관용)</button>
          </div>
          <span className="print-hint">{format === "single" ? "A4 한 장에 명세서 1부" : "한 장에 공급받는자·공급자 보관용 2부"}</span>
        </div>

        <div className="print-preview">
          <iframe title="미리보기" className="print-frame" srcDoc={buildStatementHTML(sales.slice(0, 1), format)} />
          {sales.length > 1 ? <div className="print-more">외 {sales.length - 1}건 더 — 인쇄 시 모두 포함됩니다</div> : null}
        </div>

        <footer className="modal-foot">
          <div className="ff-left" />
          <div className="ff-right">
            <button type="button" className="btn-ghost" onClick={onClose}>닫기</button>
            <button type="button" className="btn-primary" onClick={() => { printDoc(sales, format); onClose(); }}>{I.print} 인쇄</button>
          </div>
        </footer>
      </div>
    </div>
  );
}

// 매출 목록 인쇄
function printList(rows, total) {
  if (!rows || rows.length === 0) { alert("인쇄할 내역이 없습니다."); return; }
  const tr = rows.map((s, i) => `<tr><td class="c">${i+1}</td><td>${s.date}</td><td>${s.partner}</td><td>${s.lines[0].name}${s.lines.length>1?` 외 ${s.lines.length-1}건`:""}</td><td>${s.status}</td><td class="r">${fmt(s.total)}</td></tr>`).join("");
  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"/><title>매출 목록</title>
  <style>@page{size:A4;margin:14mm;}body{font-family:"Malgun Gothic","맑은 고딕",sans-serif;color:#1F1A14;margin:0;}
  h1{font-size:18px;margin:0 0 4px;}.meta{font-size:12px;color:#666;margin-bottom:10px;}
  table{width:100%;border-collapse:collapse;font-size:12px;}th,td{border:1px solid #999;padding:6px 8px;}
  th{background:#F1ECE3;}td.c{text-align:center;}td.r{text-align:right;font-variant-numeric:tabular-nums;}
  tfoot td{font-weight:700;background:#FAF7F0;}</style></head><body>
  <h1>매출 목록</h1><div class="meta">총 ${rows.length}건</div>
  <table><thead><tr><th style="width:36px">No</th><th style="width:90px">일자</th><th>거래처</th><th>품목</th><th style="width:60px">상태</th><th style="width:110px">합계금액</th></tr></thead>
  <tbody>${tr}</tbody>
  <tfoot><tr><td colspan="5" class="r">합계</td><td class="r">${fmt(total)}원</td></tr></tfoot></table>
  </body></html>`;
  const w = window.open("", "_blank", "width=900,height=800");
  if (!w) { alert("팝업이 차단되었습니다. 팝업 허용 후 다시 시도해 주세요."); return; }
  w.document.write(html); w.document.close(); w.focus();
  setTimeout(() => w.print(), 300);
}

// 오늘 (실제 날짜)
const TODAY = new Date().toISOString().slice(0, 10);
const PERIOD_OPTIONS = ["기본", "금일", "전일", "다음일", "이번주", "다음주"];
function monthsAgo(base, m) { const d = new Date(base); d.setMonth(d.getMonth() - m); return d.toISOString().slice(0, 10); }
function monthsAfter(base, m) { const d = new Date(base); d.setMonth(d.getMonth() + m); return d.toISOString().slice(0, 10); }
function shiftDate(base, days) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
// 월~일 주 범위 (offsetWeeks: 0=이번주, 1=다음주)
function weekRange(base, offsetWeeks) {
  const d = new Date(base);
  const dow = (d.getDay() + 6) % 7; // 월=0
  const mon = new Date(d);
  mon.setDate(d.getDate() - dow + offsetWeeks * 7);
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  return [mon.toISOString().slice(0, 10), sun.toISOString().slice(0, 10)];
}
function inPeriod(dateStr, period, range) {
  if (period === "기본") {
    if (range && range.from && dateStr < range.from) return false;
    if (range && range.to && dateStr > range.to) return false;
    return true;
  }
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
  const replace = (arr) => { if (Array.isArray(arr)) setSettings(arr.map(s => ({ ...s }))); };
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

  const moveTo = (key, targetKey) => setSettings(prev => {
    const from = prev.findIndex(s => s.key === key);
    const to = prev.findIndex(s => s.key === targetKey);
    if (from < 0 || to < 0 || from === to) return prev;
    const next = [...prev];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    return next;
  });

  const visibleColumns = useMemo(() => {
    const defMap = new Map(ALL_COLUMNS.map(c => [c.key, c]));
    return settings.filter(s => s.visible || defMap.get(s.key)?.locked).map(s => defMap.get(s.key)).filter(Boolean);
  }, [settings]);

  return { settings, visibleColumns, toggle, move, moveTo, reset, replace };
}

function ColumnSettingsModal({ open, settings, toggle, move, reset, onClose }) {
  useEffect(() => {
    if (!open) return;
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, onClose]);
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
            <div className="modal-sub">표시할 컬럼과 순서를 조정하세요. 전표번호는 항상 표시됩니다.</div>
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
              <div key={s.key} className={`col-row ${isOn ? "is-on" : ""}`}>
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
          <div className="ff-left">
            <span className="ff-k">표시 중</span>
            <span className="ff-v">{visibleCount}개 컬럼</span>
          </div>
          <div className="ff-right">
            <button type="button" className="btn-ghost" onClick={reset}>{I.reset} 기본값으로</button>
            <button type="button" className="btn-primary" onClick={onClose}>닫기</button>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   새 품목 등록 (팝업)
   ───────────────────────────────────────────── */
function NewItemModal({ initialName, onSave, onClose }) {
  // 품목 화면의 신규 팝업(ItemEntryModal)이 로드되어 있으면 그대로 사용 — 전 화면 공통
  if (window.ItemEntryModal) return <window.ItemEntryModal initialName={initialName} onSaved={(it) => { if (!ITEM_MASTER.some(x => x.code === it.code)) ITEM_MASTER.push(it); onSave(it); }} onClose={onClose} />;
  return <NewItemModalLegacy initialName={initialName} onSave={onSave} onClose={onClose} />;
}
function NewItemModalLegacy({ initialName, onSave, onClose }) {
  const NI_UNITS = ["개", "박스", "kg", "g", "L", "병", "캔", "포"];
  const NI_STATUS = ["판매중", "단종", "품절"];
  const NI_PARTNERS = ["한양식자재", "송파유통", "동대문푸드", "마포정육점", "성수냉동", "종로식자재마트", "강서물산", "광진수산"];
  const autoCode = (() => {
    const last = ITEM_MASTER[ITEM_MASTER.length - 1];
    const m = (last && last.code ? last.code : "S-000").match(/^(.*?)(\d+)$/);
    if (!m) return "S-001";
    return m[1] + String(Number(m[2]) + 1).padStart(m[2].length, "0");
  })();
  const [f, setFd] = useState({ code: autoCode, name: initialName || "", spec: "", unit: "개", category: "", status: "판매중", cost: "", price: "", tax: "과세", stock: "", safety: "", partner: "", barcode: "", expiry: "", storage: "", note: "" });
  const [err, setErr] = useState("");
  const nameRef = useRef(null);

  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } };
    window.addEventListener("keydown", fn, true);
    setTimeout(() => nameRef.current?.focus(), 40);
    return () => window.removeEventListener("keydown", fn, true);
  }, [onClose]);

  const set = (k, v) => setFd(p => ({ ...p, [k]: v }));
  const margin = (() => {
    if (f.cost === "" || f.price === "") return { text: "매입·판매단가 입력 시 자동 계산", warn: false };
    const c = Number(f.cost), p = Number(f.price), m = p - c;
    const r = p ? Math.round((m / p) * 1000) / 10 : 0;
    return { text: fmt(m) + "원 (" + r + "%)", warn: m < 0 };
  })();
  const moneyFld = (k) => (
    <div className="fld-wrap has-suffix">
      <input className="fld-input is-mono is-right" value={f[k] === "" ? "" : fmt(f[k])} onChange={(e) => set(k, e.target.value.replace(/[^\d]/g, ""))} inputMode="numeric" placeholder="0" />
      <span className="fld-suffix">원</span>
    </div>
  );
  const numFld = (k) => (
    <div className="fld-wrap has-suffix">
      <input className="fld-input is-mono is-right" value={f[k]} onChange={(e) => set(k, e.target.value.replace(/[^\d]/g, ""))} inputMode="numeric" placeholder="0" />
      <span className="fld-suffix">{f.unit}</span>
    </div>
  );

  const submit = (e) => {
    e.preventDefault();
    if (!f.name.trim()) { setErr("품목명을 입력해 주세요."); return; }
    if (f.price === "") { setErr("판매단가를 입력해 주세요."); return; }
    const code = f.code.trim() || autoCode;
    const item = { code, name: f.name.trim(), spec: f.spec.trim(), unit: f.unit, price: Number(f.price), tax: f.tax };
    if (!ITEM_MASTER.some(x => x.code === code)) ITEM_MASTER.push(item);
    // 품목 저장소에도 등록 → 품목 화면·재고에 반영, syncMasters 재동기화 시에도 유지
    try {
      const k = NM_LIST_KEY.품목; const list = JSON.parse(localStorage.getItem(k)) || [];
      if (!list.some(x => (x.code || x.id) === code)) { list.push({ id: code, code, name: item.name, spec: item.spec, unit: item.unit, cost: 0, price: item.price, tax: item.tax, stock: 0, safety: 0, status: "판매중", updated: new Date().toISOString().slice(0, 10) }); localStorage.setItem(k, JSON.stringify(list)); window.dispatchEvent(new CustomEvent("nonamed:list", { detail: { key: k } })); }
    } catch (e) {}
    onSave(item);
  };

  return (
    <div className="modal-root" role="dialog" aria-modal="true" style={{ zIndex: 60 }}>
      <div className="modal-scrim" onClick={onClose} />
      <form className="modal modal-newitem ni-wide" onSubmit={submit}>
        <header className="modal-head">
          <div>
            <h2 className="modal-title">새 품목 등록</h2>
            <div className="modal-sub"><span className="req">*</span> 표시는 필수 항목입니다. 등록 후 현재 전표에 바로 입력됩니다.</div>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>{I.close}</button>
        </header>

        <div className="ni-full">
          <section className="fset">
            <h3 className="fset-h">기본 정보</h3>
            <div className="fset-grid">
              <label className="fld"><span className="fld-label">품목코드</span>
                <input className="fld-input is-mono" value={f.code} onChange={(e) => set("code", e.target.value)} placeholder="자동 생성됨" /></label>
              <label className="fld"><span className="fld-label">품목명 <span className="req">*</span></span>
                <input ref={nameRef} className="fld-input" value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="예: 양배추" /></label>
              <label className="fld"><span className="fld-label">규격 / 사이즈</span>
                <input className="fld-input" value={f.spec} onChange={(e) => set("spec", e.target.value)} placeholder="예: 1kg, 500g, 5입" /></label>
              <label className="fld"><span className="fld-label">단위</span>
                <select className="fld-input" value={f.unit} onChange={(e) => set("unit", e.target.value)}>
                  {NI_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select></label>
              <label className="fld"><span className="fld-label">대분류 · 소분류</span>
                <input className="fld-input" value={f.category} onChange={(e) => set("category", e.target.value)} placeholder="예: 채소 > 엽채류" /></label>
              <div className="fld"><span className="fld-label">판매상태</span>
                <div className="seg seg-sm">
                  {NI_STATUS.map(o => <button key={o} type="button" className={`seg-item ${f.status === o ? "is-on" : ""}`} onClick={() => set("status", o)}>{o}</button>)}
                </div>
              </div>
            </div>
          </section>

          <section className="fset">
            <h3 className="fset-h">가격 / 세금</h3>
            <div className="fset-grid">
              <div className="fld"><span className="fld-label">매입단가</span>{moneyFld("cost")}</div>
              <div className="fld"><span className="fld-label">판매단가 <span className="req">*</span></span>{moneyFld("price")}</div>
              <div className="fld"><span className="fld-label">세 구분</span>
                <div className="seg seg-sm">
                  {["과세", "면세"].map(o => <button key={o} type="button" className={`seg-item ${f.tax === o ? "is-on" : ""}`} onClick={() => set("tax", o)}>{o}</button>)}
                </div>
              </div>
              <div className="fld"><span className="fld-label">마진</span>
                <div className={`margin-display ${margin.warn ? "is-warn" : ""}`}>{margin.text}</div>
              </div>
            </div>
          </section>

          <section className="fset">
            <h3 className="fset-h">재고</h3>
            <div className="fset-grid">
              <div className="fld"><span className="fld-label">재고 수량</span>{numFld("stock")}</div>
              <div className="fld"><span className="fld-label">안전 재고</span>{numFld("safety")}</div>
            </div>
          </section>

          <section className="fset">
            <h3 className="fset-h">거래처 / 식별</h3>
            <div className="fset-grid">
              <label className="fld"><span className="fld-label">주거래처</span>
                <select className="fld-input" value={f.partner} onChange={(e) => set("partner", e.target.value)}>
                  <option value="">거래처 선택</option>
                  {NI_PARTNERS.map(p => <option key={p} value={p}>{p}</option>)}
                </select></label>
              <label className="fld"><span className="fld-label">바코드</span>
                <input className="fld-input is-mono" value={f.barcode} onChange={(e) => set("barcode", e.target.value.replace(/[^\d]/g, ""))} placeholder="13자리" inputMode="numeric" /></label>
            </div>
          </section>

          <section className="fset fset-wide">
            <h3 className="fset-h">유통기한 / 보관</h3>
            <div className="fset-grid">
              <label className="fld"><span className="fld-label">유통기한</span>
                <input className="fld-input" value={f.expiry} onChange={(e) => set("expiry", e.target.value)} placeholder="예: 30일, 6개월" /></label>
              <label className="fld"><span className="fld-label">보관 방법</span>
                <input className="fld-input" value={f.storage} onChange={(e) => set("storage", e.target.value)} placeholder="예: 냉장 0~4℃, 실온" /></label>
            </div>
          </section>

          <section className="fset fset-wide">
            <h3 className="fset-h">비고 / 메모</h3>
            <textarea className="fld-area" value={f.note} onChange={(e) => set("note", e.target.value)} placeholder="원산지, 거래 메모, 주의사항 등을 적어 주세요." rows={3}></textarea>
          </section>

          {err ? <div className="fset-err fset-wide">{err}</div> : null}
        </div>

        <footer className="modal-foot">
          <div className="ff-left" />
          <div className="ff-right">
            <button type="button" className="btn-ghost" onClick={onClose}>취소</button>
            <button type="submit" className="btn-primary">저장 <kbd className="btn-kbd">F8</kbd></button>
          </div>
        </footer>
      </form>
    </div>
  );
}

/* ─────────────────────────────────────────────
   거래처별 자주 쓰는 품목 (매핑 장부)
   ───────────────────────────────────────────── */
function MappingModal({ open, mappings, onRemove, onClose }) {
  useEffect(() => {
    if (!open) return;
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = prev; };
  }, [open, onClose]);

  const [q, setQ] = useState("");
  useEffect(() => { if (open) setQ(""); }, [open]);

  if (!open) return null;

  const filtered = mappings.filter(m =>
    !q.trim() || [m.partner, m.rawName, m.itemName, m.code].some(s => (s || "").toLowerCase().includes(q.trim().toLowerCase()))
  );
  // 거래처별 그룹
  const groups = {};
  filtered.forEach(m => {
    const g = m.partner || "공통 (전체 거래처)";
    (groups[g] = groups[g] || []).push(m);
  });
  const groupNames = Object.keys(groups);

  return (
    <div className="modal-root" role="dialog" aria-modal="true">
      <div className="modal-scrim" onClick={onClose} />
      <div className="modal modal-map">
        <header className="modal-head">
          <div>
            <h2 className="modal-title">거래처별 자주 쓰는 품목</h2>
            <div className="modal-sub">카톡·문자 붙여넣기 시 이 매핑으로 품목이 자동 인식됩니다 · 총 {mappings.length}건</div>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>{I.close}</button>
        </header>

        <div className="map-search">
          <span className="ls-icon">{I.search}</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="거래처, 입력어, 품목 검색" />
        </div>

        <div className="map-body">
          {mappings.length === 0 ? (
            <div className="map-empty">
              아직 매핑된 품목이 없습니다.<br />
              <span className="map-empty-sub">매출 입력 중 품목명 아래 <b>직접매핑</b>으로 품목을 연결하면 여기에 거래처별로 쌓입니다.</span>
            </div>
          ) : groupNames.length === 0 ? (
            <div className="map-empty">검색 결과가 없습니다.</div>
          ) : (
            <div className="map-table">
              <div className="map-trow map-thead">
                <div>거래처명</div>
                <div>거래처가 부르는 이름</div>
                <div>품목명</div>
                <div>규격</div>
                <div>단위</div>
                <div></div>
              </div>
              {groupNames.map(g => (
                <React.Fragment key={g}>
                  <div className="map-group-row"><span className="mg-partner">{g}</span><span className="mg-cnt">{groups[g].length}개</span></div>
                  {groups[g].map(m => (
                    <div key={m.key} className="map-trow">
                      <div className="mt-partner">{m.partner || "공통"}</div>
                      <div className="mt-raw">"{m.rawName}"</div>
                      <div className="mt-name">{m.itemName}</div>
                      <div className="mt-spec">{m.spec || "—"}</div>
                      <div className="mt-unit">{m.unit || "—"}</div>
                      <button type="button" className="map-del" title="매핑 삭제" onClick={() => onRemove(m.key)}>{I.close}</button>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        <footer className="modal-foot">
          <div className="ff-left"><span className="entry-sub">붙여넣기 → 직접매핑으로 품목을 연결해 두면 다음부터 자동 입력됩니다.</span></div>
          <div className="ff-right"><button type="button" className="btn-primary" onClick={onClose}>닫기</button></div>
        </footer>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Detail modal (전표 상세)
   ───────────────────────────────────────────── */
function SaleDetailModal({ open, sale, onClose, onChangeStatus, onPrint }) {
  useEffect(() => {
    if (!open) return;
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, onClose]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open || !sale) return null;

  return (
    <div className="modal-root" role="dialog" aria-modal="true">
      <div className="modal-scrim" onClick={onClose} />
      <div className="modal modal-detail">
        <header className="modal-head">
          <div>
            <h2 className="modal-title">매출 전표 상세</h2>
            <div className="modal-sub keep">{sale.id} · {sale.date}</div>
          </div>
          <div className="modal-head-actions">
            <button type="button" className="btn-ghost btn-sm" onClick={() => printStatement(sale)}>{I.print} 거래명세서 인쇄</button>
            <button type="button" className="modal-close" onClick={onClose}>{I.close}</button>
          </div>
        </header>

        <div className="detail-body">
          {/* 전표 메타 */}
          <div className="detail-meta">
            <div className="dm-item">
              <span className="dm-k">거래처</span>
              <span className="dm-v dm-strong">{sale.partner}</span>
            </div>
            <div className="dm-item">
              <span className="dm-k">담당자</span>
              <span className="dm-v">{sale.mgr}</span>
            </div>
            <div className="dm-item">
              <span className="dm-k">상태</span>
              <div className="dm-status">
                {STATUS_OPTIONS.map(o => (
                  <button key={o} type="button"
                    className={`status-pick s-${o} ${sale.status === o ? "is-on" : ""}`}
                    onClick={() => onChangeStatus && onChangeStatus(sale.id, o)}>{o}</button>
                ))}
                <button type="button" className="status-pick status-custom"
                  onClick={() => {
                    const v = prompt("상태를 직접 입력하세요", sale.status || "");
                    if (v && v.trim()) onChangeStatus && onChangeStatus(sale.id, v.trim());
                  }}>+ 직접입력</button>
              </div>
            </div>
          </div>

          {/* 라인아이템 */}
          <div className="detail-lines">
            <div className="dl-row dl-head">
              <div className="dl-name">품목</div>
              <div className="dl-spec">규격</div>
              <div className="dl-qty">수량</div>
              <div className="dl-price">단가</div>
              <div className="dl-tax">부가세</div>
              <div className="dl-amt">금액</div>
            </div>
            {sale.lines.map((l, i) => (
              <div key={i} className="dl-row">
                <div className="dl-name">{l.name}</div>
                <div className="dl-spec">{l.spec}</div>
                <div className="dl-qty">{fmt(l.qty)}</div>
                <div className="dl-price">{fmt(l.price)}</div>
                <div className="dl-tax">{fmt(l.tax === "과세" ? Math.round((l.qty || 0) * (l.price || 0) * 0.1) : 0)}</div>
                <div className="dl-amt">{fmt(l.qty * l.price)}</div>
              </div>
            ))}
          </div>

          {/* 합계 */}
          <div className="detail-total">
            <div className="dt-row">
              <span className="dt-k">공급가액</span>
              <span className="dt-v">{fmt(sale.supply)}원</span>
            </div>
            <div className="dt-row">
              <span className="dt-k">부가세</span>
              <span className="dt-v">{fmt(sale.vat)}원</span>
            </div>
            <div className="dt-row dt-grand">
              <span className="dt-k">합계 금액</span>
              <span className="dt-v">{fmt(sale.total)}원</span>
            </div>
          </div>
        </div>

        <footer className="modal-foot">
          <div className="ff-left">
            <span className="ff-k">명세서 양식</span>
          </div>
          <div className="ff-right">
            <button type="button" className="btn-ghost" onClick={() => onPrint && onPrint(sale)}>{I.print} 거래명세서 인쇄</button>
            <button type="button" className="btn-primary">세금계산서 발행</button>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Sidebar / TopBar
   ───────────────────────────────────────────── */

function TopBar() { return <CommonTopBar crumb="매출" />; }

/* ─────────────────────────────────────────────
   KPI cards
   ───────────────────────────────────────────── */
function KpiCards({ rows, allSales }) {
  const todayRows = allSales.filter(s => s.date === TODAY && s.status === "완료");
  const todayTotal = todayRows.reduce((s, r) => s + r.total, 0);
  const doneRows = rows.filter(r => r.status === "완료");
  const doneTotal = doneRows.reduce((s, r) => s + r.total, 0);
  const orderRows = rows.filter(r => r.status === "주문");
  const orderTotal = orderRows.reduce((s, r) => s + r.total, 0);

  const kpis = [
    { k:"오늘 확정 매출", v: fmt(todayTotal),   unit:"원", sub:`완료 ${todayRows.length}건`,      trend:"up" },
    { k:"거래 건수",      v: fmt(rows.length),  unit:"건", sub:"선택 기간 전체",                 trend:"flat" },
    { k:"확정 매출(완료)", v: fmt(doneTotal),    unit:"원", sub:`완료 ${doneRows.length}건`,       trend:"up" },
    { k:"주문 대기",      v: fmt(orderTotal),   unit:"원", sub:`주문 ${orderRows.length}건 · 미확정`, trend:"warn" },
  ];

  return (
    <div className="kpis">
      {kpis.map(k => (
        <div key={k.k} className={`kpi t-${k.trend}`}>
          <div className="kpi-k">{k.k}</div>
          <div className="kpi-v">
            <span className="kpi-n">{k.v}</span>
            <span className="kpi-u">{k.unit}</span>
          </div>
          <div className="kpi-d"><span className="kpi-dot" />{k.sub}</div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   기간별 — 전표 단위 테이블
   ───────────────────────────────────────────── */
// 목록(전표 단위)에서 커스텀 열 값 계산 — 입력화면 AddColModal과 동일 정의를 전표 단위로 해석
function evalListFormula(expr, s) {
  try {
    const qty = (s.lines || []).reduce((a, l) => a + (Number(l.qty) || 0), 0);
    let str = String(expr || "")
      .replace(/공급가액/g, "(" + (s.supply || 0) + ")")
      .replace(/부가세/g, "(" + (s.vat || 0) + ")")
      .replace(/합계/g, "(" + (s.total || 0) + ")")
      .replace(/금액/g, "(" + (s.total || 0) + ")")
      .replace(/수량/g, "(" + qty + ")")
      .replace(/건수/g, "(" + (s.lines ? s.lines.length : 0) + ")");
    if (!/^[0-9+\-*/().\s]+$/.test(str)) return null;
    const out = Function('"use strict";return (' + str + ')')();
    return (typeof out === "number" && isFinite(out)) ? Math.round(out) : null;
  } catch (e) { return null; }
}
function calcListCustom(col, s) {
  if (!col) return "";
  if (col.type === "formula") {
    const v = evalListFormula(col.formula, s);
    return v == null ? "" : fmt(v);
  }
  if (col.type === "source") {
    if (col.srcCat === "거래처") {
      const p = PARTNER_MASTER.find(x => x.name === s.partner);
      if (!p) return "";
      const map = { "거래처명": p.name, "대표자": p.ceo, "사업자번호": p.code, "전화번호": p.phone, "주소": p.region };
      return map[col.source] || "";
    }
    if (col.srcCat === "품목") {
      const l = (s.lines && s.lines[0]) || {};
      const map = { "품목명": l.name || "", "규격": l.spec || "", "매입가": l.price != null ? fmt(l.price) : "", "품목코드": "", "단위": "", "판매가": "", "재고": "" };
      return map[col.source] || "";
    }
    return "";
  }
  return ""; // date/text/money — 전표 단위에서는 값 없음
}
// 공통 열추가(AddColModal) 정의를 임의 행에서 해석 — 조회/상세/패널/미수금 공용
function calcUnifiedCustom(col, vars, ctx) {
  if (!col) return "";
  if (col.type === "text") return col.text || "";
  if (col.type === "formula") {
    try {
      let str = String(col.formula || "");
      Object.keys(vars || {}).sort((a, b) => b.length - a.length).forEach(k => { str = str.split(k).join("(" + (Number(vars[k]) || 0) + ")"); });
      if (!/^[0-9+\-*/().\s]+$/.test(str)) return "";
      const out = Function('"use strict";return (' + str + ')')();
      return (typeof out === "number" && isFinite(out)) ? fmt(Math.round(out)) : "";
    } catch (e) { return ""; }
  }
  if (col.type === "source") {
    const c2 = ctx || {};
    if (col.srcCat === "거래처") {
      const p = PARTNER_MASTER.find(x => x.name === (c2.partner || ""));
      if (!p) return "";
      const map = { "거래처명": p.name, "대표자": p.ceo, "사업자번호": p.code, "전화번호": p.phone, "주소": p.region };
      return map[col.source] || "";
    }
    if (col.srcCat === "품목" || col.srcCat === "재고") {
      const it = ITEM_MASTER.find(x => (c2.itemCode && x.code === c2.itemCode) || (c2.itemName && x.name === c2.itemName)) || {};
      const map = { "품목명": c2.itemName || it.name || "", "규격": c2.itemSpec || it.spec || "", "품목코드": it.code || "", "단위": it.unit || "", "매입가": it.price != null ? fmt(it.price) : "", "판매가": it.sell != null ? fmt(it.sell) : (it.price != null ? fmt(it.price) : ""), "재고": it.stock != null ? fmt(it.stock) : "", "현재고": it.stock != null ? fmt(it.stock) : "" };
      return map[col.source] || "";
    }
    return "";
  }
  return "";
}

function PeriodView({ rows, allColumns = [], visibleColumns, onOpen, onChangeStatus, checked, toggle, toggleAll, allChecked, onMoveColumn, onPrint, cfg, onHideCol, onShowCol, onRename, onRemoveCol, onOpenAddCol, onOpenEditCol, onResetCols, calcCustom, widths = {}, setWidths }) {
  const grandTotal = rows.reduce((s, r) => s + r.total, 0);
  const dragSel = useRef(null);
  const [colPop, setColPop] = useState(null);
  const [colPopX, setColPopX] = useState(null);
  const [colPopY, setColPopY] = useState(null);
  useEffect(() => { if (!cfg) setColPop(null); }, [cfg]);
  useEffect(() => {
    const up = () => { dragSel.current = null; };
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, []);
  const colW = (c) => widths[c.key] ? widths[c.key] + "px" : (c.width || "110px");
  const parseMinPx = (c) => {
    if (widths[c.key]) return widths[c.key];
    const w = c.width || "110px";
    const m = /(\d+(?:\.\d+)?)px/.exec(w);
    return m ? parseFloat(m[1]) : 110;
  };
  const displayCols = visibleColumns;
  const hiddenList = allColumns.filter(c => c.hidden && !c.locked);
  const openColPop = (e, key) => {
    if (colPop === key) { setColPop(null); return; }
    const cell = e.currentTarget;
    const card = cell.closest(".table-card");
    const cr = card ? card.getBoundingClientRect() : { left: 0, top: 0 };
    const b = cell.getBoundingClientRect();
    setColPopX(b.left - cr.left + b.width / 2);
    setColPopY(b.bottom - cr.top + 4);
    setColPop(key);
  };
  const tmpl = "44px 48px " + displayCols.map(colW).join(" ") + " 28px";
  const rowMinPx = (() => {
    const tracks = displayCols.length + 3; // check + no + cols + go
    const gaps = Math.max(0, tracks - 1) * 12;
    const sum = displayCols.reduce((a, c) => a + parseMinPx(c), 0);
    return 44 + 48 + 28 + sum + gaps;
  })();
  const dragKey = useRef(null);
  const resz = useRef(null);

  useEffect(() => {
    const move = (e) => {
      if (!resz.current) return;
      const { key, startX, startW } = resz.current;
      const w = Math.max(48, startW + (e.clientX - startX));
      setWidths(prev => ({ ...prev, [key]: w }));
    };
    const up = () => { resz.current = null; document.body.style.cursor = ""; };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, []);

  const startResize = (e, c) => {
    e.preventDefault(); e.stopPropagation();
    const cell = e.currentTarget.parentElement;
    resz.current = { key: c.key, startX: e.clientX, startW: cell.getBoundingClientRect().width };
    document.body.style.cursor = "col-resize";
  };

  return (
    <div className="table-card" style={{ "--cols-template": tmpl, "--row-min": rowMinPx + "px", position: "relative" }}>
      {cfg ? (
        <div className="cfg-hint">
          <span className="cfg-hint-txt">⚙ 설정 모드 — 열 제목을 누르면 추가·이름수정·숨김·삭제할 수 있어요. 드래그로 순서 변경, 오른쪽 경계 드래그로 너비 조절.</span>

          <button type="button" className="cfg-reset" onClick={onResetCols}>{I.reset} 기본값</button>
        </div>
      ) : null}
      {cfg && colPop ? (() => {
        const popCol = allColumns.find(c => c.key === colPop) || {};
        return (
        <>
          <div className="colpop-scrim" onClick={() => setColPop(null)} />
          <div className="colpop" style={{ left: colPopX, top: colPopY, transform: "translateX(-50%)" }}>
            <div className="colpop-head"><span className="colpop-sw" />{popCol.label}{popCol.isCustom ? <button type="button" className="colpop-set" onClick={() => { onOpenEditCol && onOpenEditCol(popCol.def); setColPop(null); }}>설정 변경</button> : null}</div>
            <button type="button" className="colpop-item" onClick={() => { onOpenAddCol && onOpenAddCol(); setColPop(null); }}>새 열 추가</button>
            <button type="button" className="colpop-item" onClick={() => { if (onOpenEditCol) onOpenEditCol(popCol.isCustom ? (popCol.def || popCol) : { key: colPop, label: popCol.label, _base: true }); setColPop(null); }}>설정</button>
            {!popCol.locked ? (
              <button type="button" className="colpop-item" onClick={() => { if (popCol.hidden) { onShowCol && onShowCol(colPop); } else { onHideCol && onHideCol(colPop); } setColPop(null); }}>{popCol.hidden ? "표시하기" : "숨기기"}</button>
            ) : null}
            {popCol.isCustom ? (
              <button type="button" className="colpop-item colpop-danger" onClick={() => { onRemoveCol && onRemoveCol(colPop); setColPop(null); }}>열 삭제</button>
            ) : null}
          </div>
        </>
        );
      })() : null}
      <div className="t-scroll">
      <div className="t-row t-head">
        <div className="tc-check">
          <button type="button" className={`cbx ${allChecked ? "is-on" : ""}`} aria-label="전체 선택" onClick={toggleAll}>
            {allChecked ? I.check : null}
          </button>
        </div>
        <div className="tc ck-mono" style={{ textAlign: "center" }}>No</div>
        {displayCols.map(c => (
          <div
            key={c.key}
            className={`tc tc-${c.key} ck-${c.kind} th-drag ${cfg ? "is-cfg" : ""} ${cfg && c.hidden ? "is-colhidden" : ""}`}
            draggable={cfg && !!onMoveColumn}
            onClick={cfg ? (e) => openColPop(e, c.key) : undefined}
            onDragStart={() => { dragKey.current = c.key; }}
            onDragOver={(e) => { if (cfg) e.preventDefault(); }}
            onDrop={(e) => { if (!cfg) return; e.preventDefault(); if (dragKey.current && onMoveColumn) onMoveColumn(dragKey.current, c.key); dragKey.current = null; }}
            title={cfg ? "눌러서 추가·이름수정·숨김 · 드래그로 위치 변경 · 우측 경계 드래그로 너비 조절" : ""}
          >
            {c.label}
            {cfg ? <span className="th-resize" onMouseDown={(e) => startResize(e, c)} onClick={(e) => e.stopPropagation()} draggable={false} /> : null}
          </div>
        ))}
        <div className="tc tc-go"></div>
      </div>

      {rows.length === 0 ? (
        <div className="t-empty">해당 조건에 매출 내역이 없습니다.</div>
      ) : null}

      {rows.map((s, ri) => {
        const on = checked.has(s.id);
        return (
        <div
          key={s.id}
          role="button"
          tabIndex={0}
          className={`t-row ${on ? "is-checked" : ""} ${isRecent(s) ? "row-new" : ""}`}
          onClick={() => onOpen(s)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onOpen(s); } }}
        >
          <div className="tc-check" onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => { e.preventDefault(); dragSel.current = { val: !on }; if (checked.has(s.id) !== !on) toggle(s.id); }}
            onMouseEnter={() => { if (dragSel.current && checked.has(s.id) !== dragSel.current.val) toggle(s.id); }}>
            <button type="button" className={`cbx ${on ? "is-on" : ""} ${isRecent(s) ? "cbx-new" : ""}`} aria-label="선택" onClick={() => toggle(s.id)}>
              {on ? I.check : null}
            </button>
          </div>
          <div className="tc ck-mono" style={{ textAlign: "center", color: "var(--ink-3)" }}>{isRecent(s) ? <span className="new-flag" title="오늘 작성·수정한 전표">최근작성</span> : (ri + 1)}</div>
          {displayCols.map(c => (
            <div key={c.key} className={`tc tc-${c.key} ck-${c.kind} ${cfg && c.hidden ? "is-colhidden" : ""}`}>
              {c.isCustom ? (
                <span className="tc-val">{calcCustom ? calcCustom(c.def, s) : ""}</span>
              ) : c.key === "summary" ? (
                <span className="summary-cell">
                  <span className="sc-lead">{s.lines[0].name}</span>
                  {s.lines.length > 1 ? <span className="sc-more">외 {s.lines.length - 1}건</span> : null}
                </span>
              ) : c.key === "partner" ? (
                <span className="ln-text">{s.partner}</span>
              ) : c.key === "status" ? (
                <select className={`status-sel s-${s.status}`}
                  value={s.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => { e.stopPropagation(); onChangeStatus && onChangeStatus(s.id, e.target.value); }}
                  title="상태 변경">
                  {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : c.kind === "price" ? (
                <span className="tc-val">{fmt(s[c.key])}</span>
              ) : c.kind === "total" ? (
                <span className="tc-val total-val">{fmt(s.total)}</span>
              ) : c.kind === "print" ? (
                <button type="button" className="row-print" onClick={(e) => { e.stopPropagation(); onPrint && onPrint(s); }} title="거래명세서 인쇄">{I.print}</button>
              ) : (
                <span className="tc-val">{s[c.key]}</span>
              )}
            </div>
          ))}
          <div className="tc tc-go"><span className="go-chev">{I.chevron}</span></div>
        </div>
        );
      })}

      {rows.length > 0 ? (
        <div className="t-row t-foot" style={{ gridTemplateColumns: tmpl }}>
          <div className="tc"></div>
          <div className="tc"></div>
          {displayCols.map((c, i) => (
            <div key={c.key} className={`tc ck-${c.kind} ${cfg && c.hidden ? "is-colhidden" : ""}`}>
              {i === 0 ? <span className="foot-label">합계 ({rows.length}건)</span> :
               c.key === "supply" ? <span className="tc-val">{fmt(rows.reduce((a,r)=>a+r.supply,0))}</span> :
               c.key === "vat" ? <span className="tc-val">{fmt(rows.reduce((a,r)=>a+r.vat,0))}</span> :
               c.key === "total" ? <span className="tc-val total-val">{fmt(grandTotal)}</span> :
               null}
            </div>
          ))}
          <div className="tc"></div>
        </div>
      ) : null}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   기간요약 — 거래처별 칸반 + 품목 집계 + 1페이지 인쇄
   ───────────────────────────────────────────── */
function periodLabel(period, range) {
  if (period === "기본") {
    if (range && (range.from || range.to)) return `${range.from || "처음"} ~ ${range.to || "끝"}`;
    return "기본 기간";
  }
  return period;
}

function buildSummary(rows) {
  // 거래처별 그룹 + 품목 집계
  const byPartner = {};
  rows.forEach(s => {
    const g = byPartner[s.partner] || (byPartner[s.partner] = { partner: s.partner, count: 0, supply: 0, vat: 0, total: 0, items: {} });
    g.count += 1; g.supply += s.supply; g.vat += s.vat; g.total += s.total;
    s.lines.forEach(l => {
      const it = g.items[l.name] || (g.items[l.name] = { name: l.name, spec: l.spec, qty: 0, amount: 0 });
      it.qty += l.qty; it.amount += l.qty * l.price;
    });
  });
  return Object.values(byPartner)
    .map(g => ({ ...g, items: Object.values(g.items).sort((a, b) => b.amount - a.amount) }))
    .sort((a, b) => b.total - a.total);
}

function printSummary(groups, label, grand, items) {
  const cards = groups.map(g => `
    <div class="card">
      <div class="card-h"><span class="cp">${g.partner}</span><span class="ct">${g.count}건</span></div>
      <table>
        <thead><tr><th>품목</th><th class="r">수량</th></tr></thead>
        <tbody>
          ${g.items.map(it => `<tr><td>${it.name}${it.spec ? ` <span class="sp">${it.spec}</span>` : ""}</td><td class="r">${fmt(it.qty)}</td></tr>`).join("")}
        </tbody>
      </table>
    </div>`).join("");
  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"/>
  <title>기간 매출 요약</title>
  <style>
    @page { size: A4 landscape; margin: 10mm; }
    *{ box-sizing:border-box; }
    html,body{ margin:0; }
    body{ font-family:"Malgun Gothic","맑은 고딕",sans-serif; color:#1F1A14; }
    .sheet{ transform-origin: top left; }
    h1{ font-size:18px; margin:0; }
    .meta{ font-size:11px; color:#666; margin-bottom:8px; display:flex; justify-content:space-between; align-items:baseline; }
    .grid{ display:grid; grid-template-columns: repeat(4, 1fr); gap:7px; align-items:start; }
    .card{ border:1px solid #999; border-radius:5px; padding:7px 8px; break-inside:avoid; }
    .card-h{ display:flex; justify-content:space-between; align-items:baseline; border-bottom:1.2px solid #1F1A14; padding-bottom:3px; margin-bottom:4px; }
    .cp{ font-weight:700; font-size:12px; }
    .ct{ font-weight:600; font-size:10px; color:#666; }
    table{ width:100%; border-collapse:collapse; font-size:10px; }
    td{ padding:1.5px 3px; border-bottom:1px solid #eee; text-align:left; }
    th{ padding:1.5px 3px; color:#888; font-weight:600; font-size:9px; text-align:left; border-bottom:1px solid #ccc; }
    td.r,th.r{ text-align:right; font-variant-numeric:tabular-nums; }
    .sp{ color:#999; font-size:9px; }
    .sec{ font-weight:700; font-size:13px; margin:12px 0 5px; }
    .secm{ font-weight:400; font-size:10px; color:#888; margin-left:6px; }
    .itab{ width:100%; border-collapse:collapse; font-size:10px; }
    .itab th{ background:#F1ECE3; border:1px solid #bbb; padding:3px 5px; font-size:9px; }
    .itab td{ border:1px solid #ccc; padding:2.5px 5px; }
    .itab td.r,.itab th.r{ text-align:right; font-variant-numeric:tabular-nums; }
  </style></head><body>
    <div class="sheet" id="sheet">
      <div class="meta"><h1>기간 매출 요약</h1><span>기간: ${label} · 거래처 ${groups.length}곳</span></div>
      <div class="grid">${cards}</div>
      ${items && items.length ? `
      <div class="sec">품목별 집계 <span class="secm">품목 ${items.length}종</span></div>
      <table class="itab">
        <thead><tr><th style="width:32px">No</th><th>품목</th><th style="width:70px">규격</th><th class="r" style="width:60px">수량</th><th class="r" style="width:70px">거래처수</th></tr></thead>
        <tbody>
          ${items.map((it, i) => `<tr><td class="r">${i + 1}</td><td>${it.name}</td><td>${it.spec || "-"}</td><td class="r">${fmt(it.qty)}</td><td class="r">${fmt(it.partners)}</td></tr>`).join("")}
        </tbody>
      </table>` : ""}
    </div>
    <script>
      // 자동 맞춤: A4 가로 1페이지(약 277×190mm)에 들어가도록 축소
      (function(){
        var sheet = document.getElementById('sheet');
        var pageW = 277 * 3.78, pageH = 190 * 3.78; // mm→px(96dpi)
        function fit(){
          sheet.style.transform = 'scale(1)';
          var w = sheet.scrollWidth, h = sheet.scrollHeight;
          var s = Math.min(1, pageW / w, pageH / h);
          sheet.style.transform = 'scale(' + s + ')';
        }
        fit();
        setTimeout(function(){ fit(); window.print(); }, 250);
      })();
    </script>
  </body></html>`;
  const w = window.open("", "_blank", "width=1100,height=800");
  if (!w) { alert("팝업이 차단되었습니다. 팝업 허용 후 다시 시도해 주세요."); return; }
  w.document.write(html); w.document.close(); w.focus();
}

/* ─────────────────────────────────────────────
   품목집계 — 품목별 수량 집계 (금액 제외)
   ───────────────────────────────────────────── */
function buildItemSummary(rows) {
  const map = {};
  rows.forEach(s => {
    s.lines.forEach(l => {
      const key = l.name + "|" + (l.spec || "");
      const it = map[key] || (map[key] = { name: l.name, spec: l.spec || "", qty: 0, partners: new Set(), count: 0 });
      it.qty += l.qty;
      it.count += 1;
      it.partners.add(s.partner);
    });
  });
  return Object.values(map)
    .map(it => ({ name: it.name, spec: it.spec, qty: it.qty, partners: it.partners.size, count: it.count }))
    .sort((a, b) => b.qty - a.qty);
}

function printItemSummary(items, label) {
  const totalQty = items.reduce((s, it) => s + it.qty, 0);
  const rowsHtml = items.map((it, i) => `
    <tr>
      <td class="c">${i + 1}</td>
      <td>${it.name}</td>
      <td class="c">${it.spec || "-"}</td>
      <td class="r">${fmt(it.qty)}</td>
      <td class="r">${fmt(it.count)}</td>
      <td class="r">${fmt(it.partners)}</td>
    </tr>`).join("");
  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"/>
  <title>품목별 집계</title>
  <style>
    @page { size: A4; margin: 14mm; }
    *{ box-sizing:border-box; }
    body{ font-family:"Malgun Gothic","맑은 고딕",sans-serif; color:#1F1A14; margin:0; }
    .meta{ display:flex; justify-content:space-between; align-items:baseline; margin-bottom:12px; }
    h1{ font-size:20px; margin:0; }
    table{ width:100%; border-collapse:collapse; font-size:12px; }
    th,td{ padding:7px 8px; border:1px solid #999; }
    th{ background:#F1ECE3; }
    td.c{ text-align:center; } td.r{ text-align:right; font-variant-numeric:tabular-nums; }
    tfoot td{ font-weight:700; background:#FAF7F0; }
  </style></head><body>
    <div class="meta"><h1>품목별 집계</h1><span>기간: ${label} · 품목 ${items.length}종 · 총 수량 ${fmt(totalQty)}</span></div>
    <table>
      <thead><tr><th style="width:36px">No</th><th>품목</th><th style="width:90px">규격</th><th style="width:90px">수량</th><th style="width:80px">건수</th><th style="width:90px">거래처수</th></tr></thead>
      <tbody>${rowsHtml}</tbody>
      <tfoot><tr><td colspan="3" class="r">합계</td><td class="r">${fmt(totalQty)}</td><td class="r">${fmt(items.reduce((s,it)=>s+it.count,0))}</td><td></td></tr></tfoot>
    </table>
  </body></html>`;
  const w = window.open("", "_blank", "width=820,height=1000");
  if (!w) { alert("팝업이 차단되었습니다. 팝업 허용 후 다시 시도해 주세요."); return; }
  w.document.write(html); w.document.close(); w.focus();
  setTimeout(() => w.print(), 300);
}

function A4Layout({ groups, items }) {
  // A4 캔버스. 가로/세로 선택. (세로 794×1123, 가로 1123×794 @96dpi)
  const [orient, setOrient] = useState("portrait");
  const W = orient === "portrait" ? 794 : 1123;
  const H = orient === "portrait" ? 1123 : 794;
  const COLW = 250, GAP = 12, PAD = 16;
  const initial = () => {
    const perRow = Math.max(1, Math.floor((W - PAD * 2 + GAP) / (COLW + GAP)));
    const pos = {};
    groups.forEach((g, i) => {
      pos[g.partner] = { x: PAD + (i % perRow) * (COLW + GAP), y: PAD + Math.floor(i / perRow) * 200 };
    });
    // 품목별 집계 카드는 맨 마지막 행 아래에
    const rows = Math.ceil(groups.length / perRow);
    pos["__items__"] = { x: PAD, y: PAD + rows * 200 };
    return pos;
  };
  const [pos, setPos] = useState(initial);
  const drag = useRef(null);
  const frameRef = useRef(null);

  const onDown = (e, key) => {
    const p = pos[key] || { x: 0, y: 0 };
    drag.current = { key, sx: e.clientX, sy: e.clientY, ox: p.x, oy: p.y };
    e.preventDefault();
  };
  useEffect(() => {
    const move = (e) => {
      if (!drag.current) return;
      const sc = frameRef.current ? frameRef.current._scale || 1 : 1;
      const { key, sx, sy, ox, oy } = drag.current;
      setPos(p => ({ ...p, [key]: { x: Math.max(0, ox + (e.clientX - sx) / sc), y: Math.max(0, oy + (e.clientY - sy) / sc) } }));
    };
    const up = () => { drag.current = null; };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, []);

  // 화면 폭에 맞춰 A4 스케일
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => {
      const avail = (frameRef.current?.parentElement?.clientWidth || W) - 4;
      const s = Math.min(1, avail / W);
      setScale(s);
      if (frameRef.current) frameRef.current._scale = s;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [W]);

  const printLayout = () => {
    const cards = groups.map(g => {
      const p = pos[g.partner] || { x: 0, y: 0 };
      const rows = g.items.map(it => `<tr><td>${it.name}${it.spec ? ` <span class="sp">${it.spec}</span>` : ""}</td><td class="r">${fmt(it.qty)}</td></tr>`).join("");
      return `<div class="card" style="left:${p.x}px;top:${p.y}px;width:${COLW}px">
        <div class="ch"><b>${g.partner}</b><span>${g.count}건</span></div>
        <table>${rows}</table></div>`;
    }).join("");
    const ip = pos["__items__"] || { x: PAD, y: 0 };
    const itemsCard = items && items.length ? `<div class="card icard" style="left:${ip.x}px;top:${ip.y}px;width:${COLW}px">
        <div class="ch"><b>품목별 집계</b><span>${items.length}종</span></div>
        <table>${items.map(it => `<tr><td>${it.name}${it.spec ? ` <span class="sp">${it.spec}</span>` : ""}</td><td class="r">${fmt(it.qty)}</td></tr>`).join("")}</table></div>` : "";
    const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"/><title>배치 인쇄</title>
    <style>
      @page{ size:A4 ${orient === "landscape" ? "landscape" : "portrait"}; margin:0; }
      *{ box-sizing:border-box; }
      body{ margin:0; font-family:"Malgun Gothic","맑은 고딕",sans-serif; color:#1F1A14; }
      .page{ position:relative; width:${W}px; height:${H}px; }
      .card{ position:absolute; border:1px solid #999; border-radius:5px; padding:6px 8px; }
      .icard{ border-color:#1F1A14; }
      .ch{ display:flex; justify-content:space-between; border-bottom:1.2px solid #1F1A14; padding-bottom:3px; margin-bottom:3px; font-size:12px; }
      .ch span{ color:#777; font-size:10px; }
      table{ width:100%; border-collapse:collapse; font-size:10px; }
      td{ padding:1.5px 3px; border-bottom:1px solid #eee; }
      td.r{ text-align:right; width:40px; }
      .sp{ color:#999; font-size:9px; }
    </style></head><body><div class="page">${cards}${itemsCard}</div>
    <script>setTimeout(function(){window.print();},250);</script></body></html>`;
    const w = window.open("", "_blank", "width=900,height=1100");
    if (!w) { alert("팝업이 차단되었습니다."); return; }
    w.document.write(html); w.document.close(); w.focus();
  };

  return (
    <div className="a4wrap">
      <div className="a4bar">
        <div className="a4orient">
          <button type="button" className={`a4o-btn ${orient === "portrait" ? "is-on" : ""}`} onClick={() => setOrient("portrait")}>세로</button>
          <button type="button" className={`a4o-btn ${orient === "landscape" ? "is-on" : ""}`} onClick={() => setOrient("landscape")}>가로</button>
        </div>
        <span className="a4hint">카드를 끌어 A4 위에 자유롭게 배치하세요</span>
        <button type="button" className="btn-primary" onClick={printLayout}>{I.print} 이 배치로 인쇄</button>
      </div>
      <div className="a4scroll">
        <div className="a4frame" ref={frameRef} style={{ width: W * scale, height: H * scale }}>
          <div className="a4page" style={{ width: W, height: H, transform: `scale(${scale})` }}>
            {groups.map(g => {
              const p = pos[g.partner] || { x: 0, y: 0 };
              return (
                <div key={g.partner} className="a4card" style={{ left: p.x, top: p.y, width: COLW }} onMouseDown={(e) => onDown(e, g.partner)}>
                  <div className="a4card-h"><span className="a4card-p">{g.partner}</span><span className="a4card-c">{g.count}건</span></div>
                  <div className="a4card-items">
                    {g.items.map(it => (
                      <div key={it.name} className="a4card-item"><span>{it.name}{it.spec ? <span className="ki-spec">{it.spec}</span> : null}</span><span>{fmt(it.qty)}</span></div>
                    ))}
                  </div>
                </div>
              );
            })}
            {items && items.length ? (() => {
              const ip = pos["__items__"] || { x: 16, y: 0 };
              return (
                <div className="a4card a4card-items-sum" style={{ left: ip.x, top: ip.y, width: COLW }} onMouseDown={(e) => onDown(e, "__items__")}>
                  <div className="a4card-h"><span className="a4card-p">품목별 집계</span><span className="a4card-c">{items.length}종</span></div>
                  <div className="a4card-items">
                    {items.map(it => (
                      <div key={it.name + it.spec} className="a4card-item"><span>{it.name}{it.spec ? <span className="ki-spec">{it.spec}</span> : null}</span><span>{fmt(it.qty)}</span></div>
                    ))}
                  </div>
                </div>
              );
            })() : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryView({ rows, period, range, cfg }) {
  const [layout, setLayout] = useState(false);
  const groups = useMemo(() => buildSummary(rows), [rows]);
  const items = useMemo(() => buildItemSummary(rows), [rows]);
  const grand = groups.reduce((s, g) => s + g.total, 0);
  const totalQty = items.reduce((s, it) => s + it.qty, 0);
  const label = periodLabel(period, range);
  const [checked, setChecked] = useState(() => new Set());
  const toggle = (p) => setChecked(prev => { const n = new Set(prev); n.has(p) ? n.delete(p) : n.add(p); return n; });
  const [ichecked, setIchecked] = useState(() => new Set());
  const itoggle = (k) => setIchecked(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n; });
  const IBASE = [
    { key: "name", label: "품목명", width: "minmax(120px,1fr)", locked: true },
    { key: "spec", label: "규격", width: "90px" },
    { key: "qty", label: "수량", width: "60px" },
    { key: "partners", label: "거래처수", width: "70px" },
  ];
  const icc = useColConfig({ allColumns: IBASE, defaultVisible: IBASE.map(c => c.key), prefix: "nonamed.sales.sumitems" });
  useEffect(() => { icc.setCfg(!!cfg); }, [cfg]);
  const [icolPop, setIcolPop] = useState(null);
  const [iaddOpen, setIaddOpen] = useState(false);
  const [ieditCol, setIeditCol] = useState(null);
  const idrag = useRef(null);
  const irz = useRef(null);
  useEffect(() => {
    const move = (e) => { if (!irz.current) return; const { key, x, w } = irz.current; icc.setWidth(key, Math.max(50, w + (e.clientX - x))); };
    const up = () => { irz.current = null; document.body.style.cursor = ""; };
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, []);
  useEffect(() => { if (!cfg) { setIcolPop(null); setIaddOpen(false); setIeditCol(null); } }, [cfg]);
  const iCols = cfg ? icc.allCols : icc.visibleCols;

  return (
    <div className="summary">
      <div className="summary-bar">
        <div className="sm-info">
          <span className="sm-period">{label}</span>
          <span className="sm-meta">거래처 <b>{groups.length}</b>곳 · 총 합계 <b className="tb-total">{fmt(grand)}원</b></span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className={`btn-ghost ${layout ? "is-on-tab" : ""}`} onClick={() => setLayout(v => !v)}>{layout ? "목록 보기" : "A4 배치"}</button>
          {!layout ? <button type="button" className="btn-primary" onClick={() => printSummary(groups, label, grand, items)}>{I.print} 1페이지로 인쇄</button> : null}
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="t-empty" style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14 }}>해당 기간에 매출 내역이 없습니다.</div>
      ) : layout ? (
        <A4Layout groups={groups} items={items} />
      ) : (
        <>
          {/* 거래처별 카드 */}
          <div className="kanban">
            {groups.map(g => (
              <div key={g.partner} className={`kan-card ${checked.has(g.partner) ? "is-checked" : ""}`}>
                <div className="kan-h">
                  <button type="button" className={`cbx ${checked.has(g.partner) ? "is-on" : ""}`} aria-label="선택" onClick={() => toggle(g.partner)}>{checked.has(g.partner) ? I.check : null}</button>
                  <span className="kan-partner">{g.partner}</span>
                  <span className="kan-cnt">{g.count}건</span>
                </div>
                <div className="kan-items">
                  {g.items.map(it => (
                    <div key={it.name} className="kan-item">
                      <span className="ki-name">{it.name}{it.spec ? <span className="ki-spec">{it.spec}</span> : null}</span>
                      <span className="ki-qty">{fmt(it.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 품목별 집계 (카드 아래) */}
          <div className="sm-sec-h">품목별 집계 <span className="sm-sec-meta">품목 {items.length}종 · 총 수량 {fmt(totalQty)}</span></div>
          {(() => {
            const allItemsOn = items.length > 0 && items.every(it => ichecked.has(it.name + it.spec));
            const toggleAllItems = () => setIchecked(allItemsOn ? new Set() : new Set(items.map(it => it.name + it.spec)));
            const itmpl = "36px 40px " + iCols.map(c => c.width).join(" ");
            return (
          <div className="table-card sm-itab" style={{ "--cols-template": itmpl, position: "relative", maxWidth: icc.custom.length ? "none" : undefined }}>
            <div className="t-row t-head">
              <div className="tc-check"><button type="button" className={`cbx ${allItemsOn ? "is-on" : ""}`} aria-label="전체 선택" onClick={toggleAllItems}>{allItemsOn ? I.check : null}</button></div>
              <div className="tc ck-mono">No</div>
              {iCols.map(c => (
                <div key={c.key} className={`tc th-drag ${cfg && c.hidden ? "is-colhidden" : ""}`} style={c.key === "qty" || c.key === "partners" ? { justifyContent: "flex-end", display: "flex" } : undefined}
                  draggable={!!cfg}
                  onClick={cfg ? (e) => { const b = e.currentTarget.getBoundingClientRect(); const card = e.currentTarget.closest(".table-card").getBoundingClientRect(); setIcolPop({ key: c.key, x: b.left - card.left + b.width / 2, y: b.bottom - card.top + 4 }); } : undefined}
                  onDragStart={() => { idrag.current = c.key; }}
                  onDragOver={(e) => { if (cfg) e.preventDefault(); }}
                  onDrop={(e) => { if (!cfg) return; e.preventDefault(); if (idrag.current) icc.moveCol(idrag.current, c.key); idrag.current = null; }}
                  title={cfg ? "눌러서 추가·이름수정·숨김 · 드래그로 위치 변경 · 우측 경계 드래그로 너비 조절" : ""}>
                  {c.label}
                  {cfg ? <span className="th-resize" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); const cell = e.currentTarget.parentElement; irz.current = { key: c.key, x: e.clientX, w: cell.getBoundingClientRect().width }; document.body.style.cursor = "col-resize"; }} onClick={(e) => e.stopPropagation()} draggable={false} /> : null}
                </div>
              ))}
            </div>
            {items.map((it, i) => { const ion = ichecked.has(it.name + it.spec); return (
              <div key={it.name + it.spec} className={`t-row ${ion ? "is-checked" : ""}`} style={{ cursor: "default" }}>
                <div className="tc-check" onClick={(e) => e.stopPropagation()}><button type="button" className={`cbx ${ion ? "is-on" : ""}`} aria-label="선택" onClick={() => itoggle(it.name + it.spec)}>{ion ? I.check : null}</button></div>
                <div className="tc ck-mono">{i + 1}</div>
                {iCols.map(c => (
                  <div key={c.key} className={`tc ${cfg && c.hidden ? "is-colhidden" : ""} ${c.key === "spec" ? "ck-muted" : c.key === "qty" || c.key === "partners" ? "ck-mono" : ""}`} style={c.key === "qty" ? { textAlign: "right", fontWeight: 600, color: "var(--ink)" } : c.key === "partners" ? { textAlign: "right" } : undefined}>
                    {c.isCustom ? <span className="tc-val">{calcUnifiedCustom(c.def, { 수량: it.qty }, { itemName: it.name, itemSpec: it.spec }) || calcFlatCol(c.def, it, IBASE) || "—"}</span>
                    : c.key === "name" ? <span className="ln-text">{it.name}</span>
                    : c.key === "spec" ? (it.spec || "—")
                    : c.key === "qty" ? fmt(it.qty)
                    : fmt(it.partners)}
                  </div>
                ))}
              </div>
            ); })}
            <div className="t-row t-foot" style={{ gridTemplateColumns: itmpl }}>
              <div className="tc"></div>
              <div className="tc"></div>
              {iCols.map(c => (
                <div key={c.key} className={`tc ${cfg && c.hidden ? "is-colhidden" : ""}`} style={c.key === "qty" ? { textAlign: "right" } : undefined}>
                  {c.key === "name" ? <span className="foot-label">합계 ({items.length}종)</span> : c.key === "qty" ? fmt(totalQty) : null}
                </div>
              ))}
            </div>
            {cfg && icolPop ? (() => { const pc = icc.allCols.find(c => c.key === icolPop.key); return <ColCfgPopover col={pc} x={icolPop.x} y={icolPop.y} onAddNew={() => setIaddOpen(true)} onRename={icc.renameCol} onToggle={icc.toggleCol} onRemove={icc.removeCol} onEdit={(d) => setIeditCol(d)} onClose={() => setIcolPop(null)} />; })() : null}
          </div>
          ); })()}
          {iaddOpen ? <AddColModal nextCode={"열추가 " + String.fromCharCode(65 + icc.custom.length)} existing={icc.custom} onAdd={(c) => { icc.addCustom(c); setIaddOpen(false); }} onClose={() => setIaddOpen(false)} /> : null}
          {ieditCol ? <AddColModal initial={ieditCol} existing={icc.custom} onAdd={(c) => { if (ieditCol._base) icc.renameCol(ieditCol.key, c.label); else icc.updateCustom(ieditCol.key, c); setIeditCol(null); }} onClose={() => setIeditCol(null)} /> : null}
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   월별 — 12개월 집계
   ───────────────────────────────────────────── */
function MonthlyView({ rows }) {
  const months = useMemo(() => {
    const map = {};
    for (let m = 1; m <= 12; m++) map[m] = { month: m, count: 0, supply: 0, vat: 0, total: 0, overdue: 0 };
    rows.forEach(s => {
      const m = Number(s.date.slice(5, 7));
      map[m].count += 1;
      map[m].supply += s.supply;
      map[m].vat += s.vat;
      map[m].total += s.total;
      if (s.status === "미수금") map[m].overdue += s.total;
    });
    return Object.values(map);
  }, [rows]);

  const maxTotal = Math.max(...months.map(m => m.total), 1);
  const yearTotal = months.reduce((a, m) => a + m.total, 0);
  const tmpl = "70px minmax(160px, 1fr) 80px 130px 110px 140px 120px";

  return (
    <div className="table-card" style={{ "--cols-template": tmpl }}>
      <div className="t-row t-head">
        <div className="tc ck-mono">월</div>
        <div className="tc">매출 추이</div>
        <div className="tc ck-mono" style={{ textAlign: "right" }}>건수</div>
        <div className="tc ck-price">공급가액</div>
        <div className="tc ck-price">부가세</div>
        <div className="tc ck-total">합계 금액</div>
        <div className="tc ck-price">미수금</div>
      </div>

      {months.map(m => (
        <div key={m.month} className={`t-row ${m.count === 0 ? "is-muted" : ""}`} style={{ cursor: "default" }}>
          <div className="tc ck-mono"><b>{m.month}월</b></div>
          <div className="tc">
            <span className="m-bar-wrap">
              <span className="m-bar" style={{ width: (m.total / maxTotal * 100).toFixed(1) + "%" }} />
            </span>
          </div>
          <div className="tc ck-mono" style={{ textAlign: "right" }}>{m.count ? fmt(m.count) : "—"}</div>
          <div className="tc ck-price"><span className="tc-val">{m.count ? fmt(m.supply) : "—"}</span></div>
          <div className="tc ck-price"><span className="tc-val">{m.count ? fmt(m.vat) : "—"}</span></div>
          <div className="tc ck-total"><span className="tc-val total-val">{m.count ? fmt(m.total) : "—"}</span></div>
          <div className="tc ck-price"><span className="tc-val" style={{ color: m.overdue ? "var(--warn)" : "var(--ink-3)" }}>{m.overdue ? fmt(m.overdue) : "—"}</span></div>
        </div>
      ))}

      <div className="t-row t-foot" style={{ gridTemplateColumns: tmpl }}>
        <div className="tc"><span className="foot-label">연 합계</span></div>
        <div className="tc"></div>
        <div className="tc ck-mono" style={{ textAlign: "right" }}>{fmt(rows.length)}</div>
        <div className="tc ck-price"><span className="tc-val">{fmt(months.reduce((a,m)=>a+m.supply,0))}</span></div>
        <div className="tc ck-price"><span className="tc-val">{fmt(months.reduce((a,m)=>a+m.vat,0))}</span></div>
        <div className="tc ck-total"><span className="tc-val total-val">{fmt(yearTotal)}</span></div>
        <div className="tc ck-price"><span className="tc-val">{fmt(months.reduce((a,m)=>a+m.overdue,0))}</span></div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   상세 — 품목 라인 단위
   ───────────────────────────────────────────── */
function DetailView({ rows, onOpen, kw, onEditPrice, onSelCount, cfg }) {
  const lineRows = useMemo(() => {
    const out = [];
    const key = (kw || "").trim().toLowerCase();
    rows.forEach(s => s.lines.forEach((l, i) => {
      if (key && !((l.name || "").toLowerCase().includes(key) || (l.code || "").toLowerCase().includes(key))) return;
      out.push({
        key: s.id + "-" + i, sale: s, li: i,
        date: s.date, id: s.id, partner: s.partner,
        name: l.name, spec: l.spec, qty: l.qty, price: l.price, tax: l.tax, amount: l.qty * l.price,
      });
    }));
    return out;
  }, [rows, kw]);

  const RCOLS = [
    { key: "date", label: "일자", w: "100px", cls: "ck-mono" },
    { key: "id", label: "전표번호", w: "130px", cls: "ck-mono" },
    { key: "partner", label: "거래처", w: "minmax(110px,1.2fr)", cls: "" },
    { key: "name", label: "품목", w: "minmax(120px,1.4fr)", cls: "" },
    { key: "spec", label: "규격", w: "80px", cls: "ck-muted" },
    { key: "qty", label: "수량", w: "64px", cls: "ck-mono r" },
    { key: "price", label: "단가", w: "100px", cls: "ck-price" },
    { key: "tax", label: "부가세", w: "90px", cls: "ck-price" },
    { key: "amount", label: "금액", w: "110px", cls: "ck-price" },
  ];
  const [widths, setWidths] = useState(() => {
    try { return JSON.parse(localStorage.getItem("nonamed.sales.detailWidths.v1")) || {}; } catch (e) { return {}; }
  });
  useEffect(() => { try { localStorage.setItem("nonamed.sales.detailWidths.v1", JSON.stringify(widths)); } catch (e) {} }, [widths]);
  const rz = useRef(null);
  useEffect(() => {
    const move = (e) => { if (!rz.current) return; const { key, x, w } = rz.current; setWidths(p => ({ ...p, [key]: Math.max(48, w + (e.clientX - x)) })); };
    const up = () => { rz.current = null; document.body.style.cursor = ""; };
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, []);
  const cw = (c) => widths[c.key] ? widths[c.key] + "px" : c.w;
  const totalAmt = lineRows.reduce((a, r) => a + r.amount, 0);
  const [checked, setChecked] = useState(() => new Set());
  const toggle = (k) => setChecked(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n; });
  const allChecked = lineRows.length > 0 && checked.size === lineRows.length;
  const toggleAll = () => setChecked(allChecked ? new Set() : new Set(lineRows.map(r => r.key)));
  useEffect(() => { if (onSelCount) onSelCount(checked.size); }, [checked, onSelCount]);
  const [editMode, setEditMode] = useState(false);
  const [editDonePrompt, setEditDonePrompt] = useState(false);
  const [batchVal, setBatchVal] = useState("");
  useEffect(() => { if (checked.size === 0) setEditMode(false); }, [checked]);
  // 상세 커스텀 열 (계산식/고정문구)
  const [customCols, setCustomCols] = useState(() => { try { return JSON.parse(localStorage.getItem("nonamed.sales.detailCustom.v1")) || []; } catch (e) { return []; } });
  useEffect(() => { try { localStorage.setItem("nonamed.sales.detailCustom.v1", JSON.stringify(customCols)); } catch (e) {} }, [customCols]);
  const [colPop, setColPop] = useState(null);
  const [addColOpen, setAddColOpen] = useState(false);
  const [editCol, setEditCol] = useState(null);
  const DETAIL_BASE_FIELDS = [
    { key: "qty", label: "수량", kind: "num" },
    { key: "price", label: "단가", kind: "money" },
    { key: "supply", label: "공급가액", kind: "money" },
    { key: "vat", label: "부가세", kind: "money" },
    { key: "amount", label: "금액", kind: "money" },
    { key: "buyPrice", label: "품목매입가", kind: "money" },
    { key: "sellPrice", label: "품목판매가", kind: "money" },
    { key: "stock", label: "재고", kind: "num" },
  ];
  const enrichRow = (r) => {
    const it = ITEM_MASTER.find(x => (r.sale.lines[r.li] && r.sale.lines[r.li].code && x.code === r.sale.lines[r.li].code) || x.name === r.name) || {};
    const supply = (r.qty || 0) * (r.price || 0);
    const vat = r.tax === "과세" ? Math.round(supply * 0.1) : 0;
    return { ...r, supply, vat, buyPrice: it.price || 0, sellPrice: it.sell != null ? it.sell : (it.price || 0), stock: it.stock || 0 };
  };
  const addCustom = (col) => setCustomCols(prev => [...prev, { ...col, code: "열추가 " + String.fromCharCode(65 + prev.length), key: "dx" + Date.now().toString(36) }]);
  const updateCustom = (key, patch) => setCustomCols(prev => prev.map(c => c.key === key ? { ...c, ...patch } : c));
  const removeCustom = (key) => setCustomCols(prev => prev.filter(c => c.key !== key));
  const openColPop = (e, key) => { const cell = e.currentTarget; const card = cell.closest(".table-card"); const cr = card ? card.getBoundingClientRect() : { left: 0, top: 0 }; const b = cell.getBoundingClientRect(); setColPop({ key, x: b.left - cr.left + b.width / 2, y: b.bottom - cr.top + 4 }); };
  const custColDefs = customCols.map(c => ({ key: c.key, label: c.label, w: "110px", cls: "ck-mono", isCustom: true, def: c }));
  const baseAll = [...RCOLS, ...custColDefs];
  const baseKeys = baseAll.map(c => c.key);
  const [colOrder, setColOrder] = useState(() => { try { return JSON.parse(localStorage.getItem("nonamed.sales.detailOrder.v1")) || null; } catch (e) { return null; } });
  useEffect(() => { try { localStorage.setItem("nonamed.sales.detailOrder.v1", JSON.stringify(colOrder)); } catch (e) {} }, [colOrder]);
  const [hiddenCols, setHiddenCols] = useState(() => { try { return JSON.parse(localStorage.getItem("nonamed.sales.detailHidden.v1")) || []; } catch (e) { return []; } });
  useEffect(() => { try { localStorage.setItem("nonamed.sales.detailHidden.v1", JSON.stringify(hiddenCols)); } catch (e) {} }, [hiddenCols]);
  const metaByKey = useMemo(() => { const m = {}; baseAll.forEach(c => m[c.key] = c); return m; }, [customCols]);
  const orderedKeys = useMemo(() => { const ks = (colOrder || []).filter(k => baseKeys.includes(k)); baseKeys.forEach(k => { if (!ks.includes(k)) ks.push(k); }); return ks; }, [colOrder, customCols]);
  const hiddenSet = useMemo(() => new Set(hiddenCols), [hiddenCols]);
  const orderedCols = orderedKeys.map(k => metaByKey[k]).filter(Boolean);
  const displayCols = cfg ? orderedCols : orderedCols.filter(c => !hiddenSet.has(c.key));
  const dragKey = useRef(null);
  const moveCol = (from, to) => { if (from === to) return; const ks = orderedKeys.slice(); const fi = ks.indexOf(from), ti = ks.indexOf(to); if (fi < 0 || ti < 0) return; ks.splice(ti, 0, ks.splice(fi, 1)[0]); setColOrder(ks); };
  const toggleHide = (k) => setHiddenCols(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);
  const tmpl = "44px " + displayCols.map(cw).join(" ") + " 28px";
  const cellFor = (c, r, on) => {
    if (c.isCustom) { const er = enrichRow(r); const v = calcUnifiedCustom(c.def, { 수량: er.qty, 단가: er.price, 금액: er.amount, 공급가액: er.supply, 부가세: er.vat }, { partner: r.partner, itemName: r.name, itemCode: r.code, itemSpec: r.spec }) || calcFlatCol(c.def, er, DETAIL_BASE_FIELDS); return <span className="tc-val">{v || "—"}</span>; }
    switch (c.key) {
      case "date": return r.date;
      case "id": return r.id;
      case "partner": return <><span className="tc-val">{r.partner}</span>{on && editMode ? <span className="edit-badge">변경</span> : null}</>;
      case "name": return <span className="ln-text">{r.name}</span>;
      case "spec": return <span className="tc-val">{r.spec}</span>;
      case "qty": return fmt(r.qty);
      case "price": return (on && editMode) ? (
        <input key={r.price} className="detail-price-inp" type="text" inputMode="numeric" defaultValue={r.price}
          onClick={(e) => e.stopPropagation()} onKeyDown={(e) => { e.stopPropagation(); if (e.key === "Enter") e.currentTarget.blur(); }}
          onBlur={(e) => { const v = parseInt(String(e.target.value).replace(/[^\d]/g, ""), 10); if (onEditPrice && isFinite(v)) onEditPrice(r.sale.id, r.li, v); }} />
      ) : <span className="tc-val">{fmt(r.price)}</span>;
      case "tax": return <span className="tc-val">{fmt(r.tax === "과세" ? Math.round((r.qty || 0) * (r.price || 0) * 0.1) : 0)}</span>;
      case "amount": return <span className="tc-val total-val">{fmt(r.amount)}</span>;
      default: return "";
    }
  };
  const footFor = (c) => {
    if (c.key === "qty") return <span className="tc-val">{fmt(lineRows.reduce((a, r) => a + (Number(r.qty) || 0), 0))}</span>;
    if (c.key === "vat") return <span className="tc-val">{fmt(lineRows.reduce((a, r) => a + (r.tax === "과세" ? Math.round((r.qty || 0) * (r.price || 0) * 0.1) : 0), 0))}</span>;
    if (c.key === "supply") return <span className="tc-val">{fmt(lineRows.reduce((a, r) => a + (r.qty || 0) * (r.price || 0), 0))}</span>;
    if (c.key === "amount") return <span className="tc-val total-val">{fmt(totalAmt)}</span>;
    return null;
  };

  return (
    <div className="table-card" style={{ "--cols-template": tmpl }}>
      {checked.size > 0 ? (
        <div className="detail-actionbar">
          <span className="detail-selcnt">{checked.size}건 선택</span>
          <button type="button" className={`btn-sm ${editMode ? "btn-primary" : "btn-ghost"}`} onClick={() => { if (editMode) setEditDonePrompt(true); else setEditMode(true); }}>{editMode ? "단가 변경 완료" : "단가 변경"}</button>
          {editMode ? (
            <>
              <span className="dab-div" />
              <select className="dab-src" value="" onChange={(e) => { const src = e.target.value; if (!src) return; lineRows.forEach(r => { if (!checked.has(r.key)) return; const it = ITEM_MASTER.find(x => (r.sale.lines[r.li] && r.sale.lines[r.li].code && x.code === r.sale.lines[r.li].code) || x.name === r.name); if (!it) return; const v = src === "buy" ? it.price : src === "sell" ? (it.sell != null ? it.sell : it.price) : null; if (v != null && onEditPrice) onEditPrice(r.sale.id, r.li, v); }); e.target.value = ""; }}>
                <option value="">단가 불러오기</option>
                <option value="buy">품목 매입단가</option>
                <option value="sell">품목 판매단가</option>
              </select>
              <span className="dab-div" />
              <input className="dab-batch" type="text" inputMode="numeric" placeholder="일괄 금액" value={batchVal} onChange={(e) => setBatchVal(e.target.value.replace(/[^\d]/g, ""))} />
              <button type="button" className="btn-sm btn-primary" onClick={() => { const v = parseInt(batchVal, 10); if (!isFinite(v)) return; lineRows.forEach(r => { if (checked.has(r.key) && onEditPrice) onEditPrice(r.sale.id, r.li, v); }); }}>적용</button>
              <button type="button" className="btn-sm btn-primary" onClick={() => setEditDonePrompt(true)}>저장 <kbd className="btn-kbd">F8</kbd></button>
            </>
          ) : null}
        </div>
      ) : null}
      <ConfirmModal open={editDonePrompt} title="단가 변경 저장"
        message="변경한 단가를 저장할까요? 저장하면 이전 단가로 되돌릴 수 없습니다."
        confirmLabel="저장" onConfirm={() => { setEditDonePrompt(false); setEditMode(false); showToast("단가 변경을 저장했어요"); }} onClose={() => setEditDonePrompt(false)} />
      <div className="t-row t-head">
        <div className="tc-check"><button type="button" className={`cbx ${allChecked ? "is-on" : ""}`} aria-label="전체 선택" onClick={toggleAll}>{allChecked ? I.check : null}</button></div>
        {displayCols.map(c => (
          <div key={c.key}
            className={`tc th-drag ${c.cls && c.cls.includes("r") ? "" : (c.cls || "")} ${cfg ? "is-cfg" : ""} ${cfg && hiddenSet.has(c.key) ? "is-colhidden" : ""}`}
            draggable={cfg}
            onClick={cfg ? (e) => openColPop(e, c.key) : undefined}
            onDragStart={() => { dragKey.current = c.key; }}
            onDragOver={(e) => { if (cfg) e.preventDefault(); }}
            onDrop={(e) => { if (!cfg) return; e.preventDefault(); moveCol(dragKey.current, c.key); dragKey.current = null; }}
            style={c.cls && c.cls.includes("r") ? { justifyContent: "flex-end", display: "flex" } : c.cls && c.cls.includes("c") ? { textAlign: "center" } : null}>
            {c.label}
            <span className="th-resize" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); const cell = e.currentTarget.parentElement; rz.current = { key: c.key, x: e.clientX, w: cell.getBoundingClientRect().width }; document.body.style.cursor = "col-resize"; }} draggable={false} />
          </div>
        ))}
        <div className="tc tc-go"></div>
      </div>
      {cfg && colPop ? (() => { const cc = customCols.find(c => c.key === colPop.key); return (
        <>
          <div className="colpop-scrim" onClick={() => setColPop(null)} />
          <div className="colpop" style={{ left: colPop.x, top: colPop.y, transform: "translateX(-50%)" }}>
            <button type="button" className="colpop-item" onClick={() => { window.__ccAnchorKey = colPop.key; setAddColOpen(true); setColPop(null); }}>새 열 추가</button>
            {cc ? <button type="button" className="colpop-item" onClick={() => { setEditCol(cc); setColPop(null); }}>설정</button> : null}
            <button type="button" className="colpop-item" onClick={() => { toggleHide(colPop.key); setColPop(null); }}>{hiddenSet.has(colPop.key) ? "표시하기" : "숨기기"}</button>
            {cc ? <button type="button" className="colpop-item colpop-danger" onClick={() => { removeCustom(cc.key); setColPop(null); }}>열 삭제</button> : null}
          </div>
        </>
      ); })() : null}

      {lineRows.length === 0 ? (
        <div className="t-empty">해당 조건에 상세 내역이 없습니다.</div>
      ) : null}

      {lineRows.map(r => {
        const on = checked.has(r.key);
        return (
        <div
          key={r.key}
          role="button"
          tabIndex={0}
          className={`t-row ${on && editMode ? "is-editing" : ""}`}
          onClick={() => { if (!(on && editMode)) onOpen(r.sale); }}
          onKeyDown={(e) => { if (e.key === "Enter" && !(on && editMode)) { e.preventDefault(); onOpen(r.sale); } }}
        >
          <div className="tc-check"><button type="button" className={`cbx ${on ? "is-on" : ""}`} aria-label="선택" onClick={(e) => { e.stopPropagation(); toggle(r.key); }}>{on ? I.check : null}</button></div>
          {displayCols.map(c => (
            <div key={c.key} className={`tc ${c.cls || ""}`} style={c.cls && c.cls.includes("r") ? { textAlign: "right" } : c.cls && c.cls.includes("c") ? { textAlign: "center" } : null}>{cellFor(c, r, on)}</div>
          ))}
          <div className="tc tc-go"><span className="go-chev">{I.chevron}</span></div>
        </div>
        );
      })}

      {lineRows.length > 0 ? (
        <div className="t-row t-foot" style={{ gridTemplateColumns: tmpl }}>
          <div className="tc-check"></div>
          {displayCols.map((c, i) => (
            <div key={c.key} className={`tc ${c.cls || ""}`} style={c.cls && c.cls.includes("r") ? { textAlign: "right" } : null}>{i === 0 ? <span className="foot-label">합계 ({lineRows.length}품목)</span> : footFor(c)}</div>
          ))}
          <div className="tc"></div>
        </div>
      ) : null}
      {addColOpen ? <AddColModal nextCode={"열추가 " + String.fromCharCode(65 + customCols.length)} existing={customCols} onAdd={(c) => { addCustom(c); setAddColOpen(false); }} onClose={() => setAddColOpen(false)} /> : null}
      {editCol ? <AddColModal initial={editCol} existing={customCols} onAdd={(c) => { updateCustom(editCol.key, c); setEditCol(null); }} onClose={() => setEditCol(null)} /> : null}
    </div>
  );
}

/* ─────────────────────────────────────────────
   새 매출 입력 모달
   ───────────────────────────────────────────── */
function blankLine() { return { code: "", name: "", spec: "", unit: "", qty: "", price: "", priceF: "", tax: "과세", memo: "", raw: "" }; }
const ENTRY_ROWS = 7;
function makeRows(n) { return Array.from({ length: n }, blankLine); }

// 간단 수식 평가: =수량*단가*0.9 등. 변수: 수량 단가 매입가 금액
function evalFormula(expr, vars) {
  try {
    let s = String(expr).slice(1); // remove '='
    s = s.replace(/수량/g, "(" + (Number(vars.qty) || 0) + ")")
         .replace(/단가/g, "(" + (Number(vars.price) || 0) + ")")
         .replace(/매입가/g, "(" + (Number(vars.cost) || 0) + ")")
         .replace(/금액/g, "(" + ((Number(vars.qty) || 0) * (Number(vars.price) || 0)) + ")");
    if (!/^[0-9+\-*/().\s]+$/.test(s)) return null;
    const out = Function('"use strict";return (' + s + ')')();
    return (typeof out === "number" && isFinite(out)) ? Math.round(out) : null;
  } catch (e) { return null; }
}

/* 검색 팝업 — 키워드 포함 리스트에서 선택 */
function PickerOverlay({ title, items, fields, columns, initialQuery, onPick, onNew, onClose }) {
  const [q, setQ] = useState(initialQuery || "");
  const [hi, setHi] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 30); }, []);
  // ESC는 품목/거래처 검색창만 닫고, 뒤의 입력창은 닫지 않도록 캡처 단계에서 처리
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

  const pick = (it) => { if (it) onPick(it); };
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
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setHi(h => Math.min(h + 1, list.length - 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setHi(h => Math.max(h - 1, 0)); }
              else if (e.key === "Enter") { e.preventDefault(); pick(list[hi]); }
              else if (e.key === "F2") { e.preventDefault(); onNew && onNew(); }
              else if (e.key === "Escape") { e.preventDefault(); onClose(); }
            }}
            placeholder="검색어를 입력하세요"
          />
        </div>
        <div className="pick-table">
          <div className="pick-trow pick-thead" style={{ gridTemplateColumns: tmpl }}>
            {columns.map(c => <div key={c.key} className={`pk-cell ${c.align === "right" ? "is-right" : ""}`}>{c.label}</div>)}
          </div>
          <div className="pick-tbody">
            {list.length === 0 ? <div className="pick-empty">검색 결과가 없습니다.</div> : null}
            {list.map((it, i) => (
              <button
                key={it._key || it.code || it.name}
                type="button"
                className={`pick-trow pick-opt ${i === hi ? "is-hi" : ""}`}
                style={{ gridTemplateColumns: tmpl }}
                onMouseEnter={() => setHi(i)}
                onClick={() => pick(it)}
              >
                {columns.map(c => (
                  <div key={c.key} className={`pk-cell ${c.align === "right" ? "is-right" : ""} ${c.strong ? "is-strong" : ""} ${c.mono ? "is-mono" : ""}`}>
                    {c.fmt ? c.fmt(it[c.key]) : (it[c.key] ?? "—")}
                  </div>
                ))}
              </button>
            ))}
          </div>
        </div>
        <footer className="pick-foot">
          <span className="pick-foot-cnt">{list.length}건 · ↑↓ 이동 · Enter 선택 · F2 신규</span>
          {onNew ? <button type="button" className="pick-new" onClick={onNew}>+ 신규 <kbd className="btn-kbd">F2</kbd></button> : null}
        </footer>
      </div>
    </div>
  );
}

function AddColModal({ nextCode, initial, existing = [], onAdd, onClose }) {
  const [label, setLabel] = useState(initial ? (initial.label || "") : "");
  const [type, setType] = useState(initial ? (initial.type || "source") : "source");
  const [formula, setFormula] = useState(initial ? (initial.formula || "") : "");
  const [source, setSource] = useState(initial ? (initial.source || "품목코드") : "품목코드");
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);
  const submit = (e) => {
    e.preventDefault();
    if (!label.trim()) return;
    onAdd({ label: label.trim(), type, formula: formula.trim(), source, srcCat });
  };
  const TYPES = [["source","정보불러오기"],["formula","계산식"],["date","일자"],["text","문자"],["money","금액"]];
  // 기존 테이블 값에서 끌어올 수 있는 소스 — 품목 / 거래처
  const SOURCE_FIELDS = {
    "품목": ["품목코드", "품목명", "규격", "단위", "매입가", "판매가", "재고"],
    "거래처": ["거래처명", "대표자", "사업자번호", "전화번호", "주소"],
    "재고": ["현재고", "안전재고", "입고예정", "창고위치", "최근입고일"],
  };
  const FIELDS = ["품목", "거래처", "재고"];
  const [srcCat, setSrcCat] = useState(initial && initial.srcCat ? initial.srcCat : "품목");
  const pickField = (f) => {
    setType("source");
    setSrcCat(f);
    const first = SOURCE_FIELDS[f][0];
    setSource(first);
    if (!label.trim()) setLabel(first);
  };
  return (
    <div className="modal-root" role="dialog" aria-modal="true" style={{ zIndex: 80 }}>
      <div className="modal-scrim" onClick={onClose} />
      <form className="modal modal-newitem modal-addcol" onSubmit={submit}>
        <header className="modal-head">
          <div>
            <div className="addcol-code-badge">{initial ? (initial.code || "열 설정") : (nextCode || "열 추가")}</div>
            <input className="modal-title-input" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="열 명칭을 입력하세요" />
          </div>
          <button type="button" className="modal-close" onClick={onClose}>{I.close}</button>
        </header>
        <div className="addcol-cols">
        <div className="ni-body">
          <div className="fld">
            <span className="fld-label">유형</span>
            <div className="seg seg-sm" style={{ alignSelf: "flex-start", flexWrap: "wrap" }}>
              {TYPES.map(([v, ko]) => (
                <button key={v} type="button" className={`seg-item ${type === v ? "is-on" : ""}`} onClick={() => setType(v)}>{ko}</button>
              ))}
            </div>
          </div>

          <div className="addcol-divider"><span>또는 기존 정보에서 가져오기</span></div>

          <div className="fld" style={{ marginTop: 4 }}>
            <div className="field-chips">
              {FIELDS.map(f => (
                <button
                  key={f}
                  type="button"
                  className={`field-chip ${type === "source" && srcCat === f ? "is-on" : ""}`}
                  onClick={() => pickField(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          {type === "formula" ? (
            <label className="fld" style={{ marginTop: 12 }}><span className="fld-label">계산식</span>
              <input className="fld-input is-mono" value={formula} onChange={(e) => setFormula(e.target.value)} placeholder="예: 수량*단가*0.9" />
              <span className="fld-hint" style={{ marginTop: 4 }}>변수: 수량 · 단가 · 금액</span>
            </label>
          ) : type === "source" ? (
            <label className="fld" style={{ marginTop: 12 }}><span className="fld-label">{srcCat} 항목 선택</span>
              <div className="fld-wrap fld-select">
                <select className="fld-input" value={source} onChange={(e) => { setSource(e.target.value); if (!label.trim()) setLabel(e.target.value); }}>
                  {(SOURCE_FIELDS[srcCat] || []).map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <span className="fld-hint" style={{ marginTop: 4 }}>{srcCat} 테이블의 값을 자동으로 불러옵니다.</span>
            </label>
          ) : null}
        </div>
        <aside className="addcol-existing">
          <div className="ae-h">추가된 열{existing.length ? " · " + existing.length + "개" : ""}</div>
          {existing.length === 0 ? (
            <div className="ae-empty">아직 추가한 열이 없어요.</div>
          ) : (
            <div className="ae-list">
              {existing.map(c => (
                <div key={c.key || c.code} className={`ae-item ${initial && c.key === initial.key ? "is-cur" : ""}`}>
                  <span className="ae-code">{c.code || "열"}</span>
                  <span className="ae-name">{c.label}</span>
                  <span className="ae-type">{({ source: "정보", formula: "계산식", date: "일자", text: "문자", money: "금액" })[c.type] || c.type}</span>
                </div>
              ))}
            </div>
          )}
        </aside>
        </div>
        <footer className="modal-foot">
          <div className="ff-left" />
          <div className="ff-right">
            <button type="button" className="btn-ghost" onClick={onClose}>취소</button>
            <button type="submit" className="btn-primary">저장 <kbd className="btn-kbd">F8</kbd></button>
          </div>
        </footer>
      </form>
    </div>
  );
}

function SalesEntryModal({ open, initial, onSave, onDelete, onMap, resolvePartnerItems, records, customCols = [], onAddCol, onRemoveCol, onReorderCol, onRenameCol, onUpdateCol, onRevertEntryCols, onClose }) {
  const [delPrompt, setDelPrompt] = useState(false);
  const [colModal, setColModal] = useState(false);
  const [editCol, setEditCol] = useState(null); // 재설정 중인 열
  const [cfgOpen, setCfgOpen] = useState(false);
  const [colPop, setColPop] = useState(null); // 편집 모드에서 클릭된 열 key
  const [colPopX, setColPopX] = useState(null); // colpop 가로 위치(px)
  const dragCol = useRef(null);
  const draftSnap = useRef(null); // 화면설정 진입 시점 스냅샷 (저장 없이 닫으면 되돌림)
  const BASE_COLS = [
    { key: "name", w: "220px" },
    { key: "spec", w: "80px" }, { key: "unit", w: "56px" }, { key: "qty", w: "64px" },
    { key: "price", w: "100px" }, { key: "supply", w: "110px" }, { key: "vat", w: "100px" },
    { key: "memo", w: "180px" },
  ];
  const allCols = [...BASE_COLS, ...customCols.map(c => ({ key: c.key, w: "96px" }))];
  const widthOf = (k) => colWidths[k] ? (colWidths[k] + "px") : ((allCols.find(c => c.key === k) || {}).w || "100px");
  const [colWidths, setColWidths] = useState(() => {
    try { return JSON.parse(localStorage.getItem("nonamed.sales.entryColWidths.v1")) || {}; } catch (e) { return {}; }
  });
  useEffect(() => { try { localStorage.setItem("nonamed.sales.entryColWidths.v1", JSON.stringify(colWidths)); } catch (e) {} }, [colWidths]);
  const wz = useRef(null);
  useEffect(() => {
    const move = (e) => { if (!wz.current) return; const { key, x, w } = wz.current; setColWidths(p => ({ ...p, [key]: Math.max(48, w + (e.clientX - x)) })); };
    const up = () => { wz.current = null; document.body.style.cursor = ""; };
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, []);
  const startColResize = (e, key) => {
    e.preventDefault(); e.stopPropagation();
    const cell = e.currentTarget.parentElement;
    wz.current = { key, x: e.clientX, w: cell.getBoundingClientRect().width };
    document.body.style.cursor = "col-resize";
  };
  const [colOrder, setColOrder] = useState(() => {
    try { const v = JSON.parse(localStorage.getItem("nonamed.sales.entryColOrder.v1")); return Array.isArray(v) ? v : null; } catch (e) { return null; }
  });
  // 실제 적용 순서: 저장된 순서 + 누락/신규 키 보정
  const orderedKeys = (() => {
    const valid = allCols.map(c => c.key);
    const base = (colOrder || []).filter(k => valid.includes(k));
    for (const k of valid) if (!base.includes(k)) base.push(k);
    return base;
  })();
  useEffect(() => {
    try { localStorage.setItem("nonamed.sales.entryColOrder.v1", JSON.stringify(orderedKeys)); } catch (e) {}
  }, [colOrder, customCols.length]);
  const [hdrFields, setHdrFields] = useState(() => {
    try { const v = JSON.parse(localStorage.getItem("nonamed.sales.hdrFields.v1")); return Array.isArray(v) ? v : []; } catch (e) { return []; }
  });
  useEffect(() => { try { localStorage.setItem("nonamed.sales.hdrFields.v1", JSON.stringify(hdrFields)); } catch (e) {} }, [hdrFields]);
  const [hdrAddOpen, setHdrAddOpen] = useState(false);
  const addHdrField = () => setHdrAddOpen(true);
  const removeHdrField = (key) => setHdrFields(prev => prev.filter(f => f.key !== key));
  // 상단 입력항목 공통 메뉴(설정 / 항목 추가 / 삭제)
  const [gridMeta, setGridMeta] = useState(() => { try { const v = JSON.parse(localStorage.getItem("nonamed.sales.gridMeta.v1")); return v && typeof v === "object" ? v : {}; } catch (e) { return {}; } });
  useEffect(() => { try { localStorage.setItem("nonamed.sales.gridMeta.v1", JSON.stringify(gridMeta)); } catch (e) {} }, [gridMeta]);
  const [gridMenu, setGridMenu] = useState(null);
  const [gridCfgFor, setGridCfgFor] = useState(null);
  const gLabel = (k, d) => (gridMeta[k] && gridMeta[k].label) || d;
  const gHid = (k) => !!(gridMeta[k] && gridMeta[k].hide);
  useEffect(() => { if (!gridMenu) return; const fn = () => setGridMenu(null); window.addEventListener("mousedown", fn); return () => window.removeEventListener("mousedown", fn); }, [gridMenu]);
  // 상단 입력항목(거래일자·거래처·담당자·추가항목) 위치 드래그 재배열
  const [gridOrder, setGridOrder] = useState(() => { try { const v = JSON.parse(localStorage.getItem("nonamed.sales.gridOrder.v1")); return Array.isArray(v) ? v : null; } catch (e) { return null; } });
  useEffect(() => { try { localStorage.setItem("nonamed.sales.gridOrder.v1", JSON.stringify(gridOrder)); } catch (e) {} }, [gridOrder]);
  const gridDrag = useRef(null);
  const gridKeys = (() => { const base = ["date", "partner", "mgr", ...hdrFields.map(f => f.key)]; if (!gridOrder) return base; const kept = gridOrder.filter(k => base.includes(k)); base.forEach(k => { if (!kept.includes(k)) kept.push(k); }); return kept; })();
  const orderOf = (key) => { const i = gridKeys.indexOf(key); return i < 0 ? 50 : i; };
  const moveGrid = (from, to) => { if (from === to) return; const a = gridKeys.slice(); const fi = a.indexOf(from), ti = a.indexOf(to); if (fi < 0 || ti < 0) return; a.splice(ti, 0, a.splice(fi, 1)[0]); setGridOrder(a); };
  const fldDrag = (key) => cfgOpen ? { draggable: true, onDragStart: () => { gridDrag.current = key; }, onDragOver: (e) => e.preventDefault(), onDrop: (e) => { e.preventDefault(); moveGrid(gridDrag.current, key); gridDrag.current = null; } } : {};
  const gridCell = (k, label) => cfgOpen ? { onMouseDown: (e) => { e.stopPropagation(); setGridMenu(m => (m && m.key === k ? null : { key: k, label })); } } : {};
  const GridMenu = ({ k, label }) => (cfgOpen && gridMenu && gridMenu.key === k) ? (
    <div className="fld-menu" onMouseDown={(e) => e.stopPropagation()}>
      <button type="button" onClick={() => { const hf = hdrFields.find(f => f.key === k); setGridMenu(null); setGridCfgFor({ key: k, initial: hf ? { ...hf } : { label: gLabel(k, label), dflt: (gridMeta[k] || {}).dflt || "" } }); }}>설정</button>
      <button type="button" onClick={() => { setGridMenu(null); addHdrField(); }}>항목 추가</button>
      <button type="button" className="is-danger" onClick={() => { setGridMenu(null); if (hdrFields.find(f => f.key === k)) removeHdrField(k); else setGridMeta(p => ({ ...p, [k]: { ...(p[k] || {}), hide: true } })); }}>삭제</button>
    </div>
  ) : null;
  const [hiddenCols, setHiddenCols] = useState(() => {
    try { const v = JSON.parse(localStorage.getItem("nonamed.sales.entryHidden.v1")); return Array.isArray(v) ? v : []; } catch (e) { return []; }
  });
  useEffect(() => { try { localStorage.setItem("nonamed.sales.entryHidden.v1", JSON.stringify(hiddenCols)); } catch (e) {} }, [hiddenCols]);
  const isHid = (k) => hiddenCols.includes(k);
  const toggleHide = (k) => setHiddenCols(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);
  const visibleKeys = orderedKeys.filter(k => !isHid(k));
  const effKeys = cfgOpen ? orderedKeys : visibleKeys;
  const ord = (k) => effKeys.indexOf(k) + 1; // el-no = 0
  const cs = (k) => ({ order: ord(k), display: (!cfgOpen && isHid(k)) ? "none" : undefined, opacity: (cfgOpen && isHid(k)) ? 0.4 : undefined });
  const [baseLabels, setBaseLabels] = useState(() => {
    try { return JSON.parse(localStorage.getItem("nonamed.sales.baseLabels.v1")) || {}; } catch (e) { return {}; }
  });
  useEffect(() => { try { localStorage.setItem("nonamed.sales.baseLabels.v1", JSON.stringify(baseLabels)); } catch (e) {} }, [baseLabels]);
  const COL_LABELS = { code:"품목코드", name:"품목명", spec:"규격", unit:"단위", qty:"수량", price:"단가", supply:"공급가액", vat:"부가세", memo:"메모" };
  const labelOf = (k) => baseLabels[k] || COL_LABELS[k] || (customCols.find(c => c.key === k) || {}).label || k;
  const renameAny = (k) => {
    const nv = prompt("열 이름 수정", labelOf(k));
    if (!nv || !nv.trim()) return;
    if (customCols.find(c => c.key === k)) { if (onRenameCol) onRenameCol(k, nv.trim()); }
    else setBaseLabels(p => ({ ...p, [k]: nv.trim() }));
  };
  // 저장된 화면(뷰) 프리셋 — 매출 입력
  const [entryViews, setEntryViews] = useState(() => { try { return JSON.parse(localStorage.getItem("nonamed.sales.entryViews.v1")) || []; } catch (e) { return []; } });
  useEffect(() => { try { localStorage.setItem("nonamed.sales.entryViews.v1", JSON.stringify(entryViews)); } catch (e) {} }, [entryViews]);
  const [activeEntryView, setActiveEntryView] = useState(null);
  const [entrySaveOpen, setEntrySaveOpen] = useState(false);
  const [entryDonePrompt, setEntryDonePrompt] = useState(false);
  const [entryRenameCode, setEntryRenameCode] = useState(null);
  const [entryOverwriteCode, setEntryOverwriteCode] = useState(null);
  const [entryDeleteCode, setEntryDeleteCode] = useState(null);
  const captureEntryConfig = () => ({ colOrder: colOrder ? [...colOrder] : null, hiddenCols: [...hiddenCols], baseLabels: { ...baseLabels }, colWidths: { ...colWidths }, hdrFields: hdrFields.map(f => ({ ...f })), gridOrder: gridOrder ? [...gridOrder] : null, enterSeq: [...enterSeq], customCols: customCols.map(c => ({ ...c })) });
  const saveNewEntryView = () => setEntrySaveOpen(true);
  const confirmSaveNewEntry = (name) => { const code = nextViewCode(entryViews); setEntryViews(prev => [...prev, { code, name, config: captureEntryConfig() }]); setActiveEntryView(code); setEntrySaveOpen(false); showToast(code + " \"" + name + "\" \ud654\uba74\uc744 \uc800\uc7a5\ud588\uc5b4\uc694"); };
  const applyEntryView = (code) => { const v = entryViews.find(x => x.code === code); if (!v) return; const c = v.config || {}; setColOrder(c.colOrder || null); setHiddenCols(c.hiddenCols || []); setBaseLabels(c.baseLabels || {}); setColWidths(c.colWidths || {}); setHdrFields(c.hdrFields || []); if (c.gridOrder !== undefined) setGridOrder(c.gridOrder); if (c.enterSeq) setEnterSeq(c.enterSeq); if (onRevertEntryCols) onRevertEntryCols(c.customCols || []); setActiveEntryView(code); showToast(code + " \"" + v.name + "\" \ud654\uba74\uc744 \uc801\uc6a9\ud588\uc5b4\uc694", "info"); };
  const overwriteEntryView = (code) => setEntryOverwriteCode(code);
  const confirmOverwriteEntry = () => { const code = entryOverwriteCode; const v = entryViews.find(x => x.code === code); setEntryViews(prev => prev.map(x => x.code === code ? { ...x, config: captureEntryConfig() } : x)); setActiveEntryView(code); setEntryOverwriteCode(null); showToast(code + (v ? " \"" + v.name + "\"" : "") + " \ud654\uba74\uc744 \ud604\uc7ac \uc0c1\ud0dc\ub85c \uac31\uc2e0\ud588\uc5b4\uc694"); };
  const renameEntryView = (code) => setEntryRenameCode(code);
  const confirmRenameEntry = (name) => { setEntryViews(prev => prev.map(v => v.code === entryRenameCode ? { ...v, name } : v)); setEntryRenameCode(null); showToast("\ud654\uba74 \uc774\ub984\uc744 \ubcc0\uacbd\ud588\uc5b4\uc694", "info"); };
  const deleteEntryView = (code) => setEntryDeleteCode(code);
  const confirmDeleteEntry = () => { const code = entryDeleteCode; const v = entryViews.find(x => x.code === code); setEntryViews(prev => prev.filter(x => x.code !== code)); setActiveEntryView(a => a === code ? null : a); setEntryDeleteCode(null); showToast(code + (v ? " \"" + v.name + "\"" : "") + " \ud654\uba74\uc744 \uc0ad\uc81c\ud588\uc5b4\uc694", "info"); };
  const reorderCol = (fromK, toK) => {
    if (fromK === toK) return;
    const next = orderedKeys.slice();
    const fi = next.indexOf(fromK), ti = next.indexOf(toK);
    if (fi < 0 || ti < 0) return;
    next.splice(ti, 0, next.splice(fi, 1)[0]);
    setColOrder(next);
  };
  const colDrag = (key) => ({
    draggable: cfgOpen,
    onClick: cfgOpen ? (e) => {
      e.stopPropagation();
      if (colPop === key) { setColPop(null); return; }
      const cell = e.currentTarget;
      const wrap = cell.closest(".eltab");
      const left = cell.getBoundingClientRect().left - (wrap ? wrap.getBoundingClientRect().left : 0);
      setColPopX(left + cell.getBoundingClientRect().width / 2);
      setColPop(key);
    } : undefined,
    onDragStart: () => { dragCol.current = key; },
    onDragOver: (e) => { e.preventDefault(); },
    onDrop: (e) => { e.preventDefault(); if (dragCol.current) reorderCol(dragCol.current, key); dragCol.current = null; },
    onDragEnd: () => { dragCol.current = null; },
  });
  const widthFr = (k) => { const w = widthOf(k); const m = String(w).match(/(\d+(?:\.\d+)?)/); const n = m ? parseFloat(m[1]) : 100; return "minmax(0, " + (n / 10) + "fr)"; };
  const gridTmpl = "36px " + effKeys.map(widthFr).join(" ");
  const calcCustom = (col, l) => {
    if (col.type === "formula") {
      const v = evalFormula("=" + (col.formula || ""), { qty: l.qty, price: l.price, cost: 0 });
      return v == null ? "" : fmt(v);
    }
    if (col.type === "source") {
      const it = ITEM_MASTER.find(x => (l.code && x.code === l.code) || (l.name && x.name === l.name));
      if (!it) return "";
      if (col.source === "매입가") { const r = recentOf(l); return r.length ? fmt(r[0].price) : ""; }
      if (col.source === "판매가") return fmt(it.price);
      if (col.source === "규격") return it.spec || "";
      if (col.source === "단위") return l.unit || "";
      if (col.source === "품목코드") return l.code || it.code || "";
      if (col.source === "품목명") return l.name || it.name || "";
      if (col.source === "최근 거래처") { const r = recentOf(l); return r.length ? r[0].partner : ""; }
      return "";
    }
    return (l.custom && l.custom[col.key]) || col.dflt || "";
  };
  const [form, setForm] = useState({ date: TODAY, partner: "", mgr: "", status: "완료", lines: makeRows(ENTRY_ROWS) });
  const [err, setErr] = useState("");
  const [savePrompt, setSavePrompt] = useState(false);
  const [picker, setPicker] = useState(null); // { kind:'partner'|'mgr'|'item', row? }
  const [activeRow, setActiveRow] = useState(null);
  const [nameFocusRow, setNameFocusRow] = useState(null);
  const [priceMode, setPriceMode] = useState("buy"); // buy | sell
  const [recHidden, setRecHidden] = useState(false);
  const [closeAsk, setCloseAsk] = useState(false);
  const PANEL_BASE = COL_STORAGE_KEY.replace(".columns.v5", "");
  const panelApi = usePanels(PANEL_BASE + ".panels.v2", PANEL_BASE + ".panelFields.v1");
  const [panelPickFor, setPanelPickFor] = useState(null); // 항목 추가 대상 패널 id
  const [panelNameFor, setPanelNameFor] = useState(null); // { mode:'add'|'rename', id?, name? }
  const renamePanelPrompt = (id, cur) => setPanelNameFor({ mode: "rename", id, name: cur || "" });
  const [newItem, setNewItem] = useState(null); // { row, name }
  const [newPartner, setNewPartner] = useState(null); // { name } — 거래처 검색 › 신규
  const WIN_BASE = COL_STORAGE_KEY.replace(".columns.v5", "");
  const WIDTH_KEY = WIN_BASE + ".entryW";
  const POS_KEY = WIN_BASE + ".entryPos";
  const LOCK_KEY = WIN_BASE + ".winLock";
  const readNum = (k) => { try { const v = localStorage.getItem(k); return v == null ? null : Number(v); } catch (e) { return null; } };
  const readPos = () => { try { return JSON.parse(localStorage.getItem(POS_KEY)); } catch (e) { return null; } };
  const readLock = () => { try { return localStorage.getItem(LOCK_KEY) === "1"; } catch (e) { return false; } };
  const [winLocked, setWinLocked] = useState(false);
  const [width, setWidth] = useState(() => { const v = readNum(WIDTH_KEY); return v == null ? 860 : v; });
  const [winPos, setWinPos] = useState(() => readPos() || { x: 0, y: 0 });
  const resizing = useRef(null);
  const saveWin = (w, p) => { try { localStorage.setItem(WIDTH_KEY, String(w)); localStorage.setItem(POS_KEY, JSON.stringify(p)); localStorage.setItem(LOCK_KEY, "1"); } catch (e) {} };
  const clearWin = () => { try { localStorage.removeItem(WIDTH_KEY); localStorage.removeItem(POS_KEY); localStorage.removeItem(LOCK_KEY); } catch (e) {} };
  const ENTER_KEY = WIN_BASE + ".enterSeq";
  const readEnter = () => { try { const v = JSON.parse(localStorage.getItem(ENTER_KEY)); if (Array.isArray(v) && v.length) return v; } catch (e) {} return ["name", "spec", "qty", "price", "memo"]; };
  const [enterSeq, setEnterSeq] = useState(readEnter);
  const enterDrag = useRef(null);
  useEffect(() => { try { localStorage.setItem(ENTER_KEY, JSON.stringify(enterSeq)); } catch (e) {} }, [enterSeq]);
  // 헤더 드래그 = 이동 (고정 상태면 저장)
  const onWinDragDown = (e) => {
    if (e.target.closest("button, input, select, textarea, .th-resize, .entry-resize, kbd, .vpm, .cfg-wrap, .win-tools")) return;
    const st = { sx: e.clientX, sy: e.clientY, ox: winPos.x, oy: winPos.y }; let last = { x: st.ox, y: st.oy };
    const move = (ev) => { last = { x: st.ox + ev.clientX - st.sx, y: st.oy + ev.clientY - st.sy }; setWinPos(last); };
    const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); if (winLocked) saveWin(width, last); };
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
  };
  // ⛶ 버튼(통합): 드래그=창 이동(임시), 클릭=현재 위치·크기 고정(저장) 토글
  const onWinBtnDown = (e) => {
    e.preventDefault(); e.stopPropagation();
    const st = { sx: e.clientX, sy: e.clientY, ox: winPos.x, oy: winPos.y }; let moved = false; let last = { x: st.ox, y: st.oy };
    const move = (ev) => { if (Math.abs(ev.clientX - st.sx) + Math.abs(ev.clientY - st.sy) > 4) moved = true; last = { x: st.ox + ev.clientX - st.sx, y: st.oy + ev.clientY - st.sy }; setWinPos(last); };
    const up = () => {
      window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up);
      if (!moved) { setWinLocked(p => { const n = !p; if (n) saveWin(width, last); return n; }); }
      else if (winLocked) saveWin(width, last);
    };
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
  };
  // 좌측 모서리 핸들 = 크기 조절 (고정 상태면 저장)
  const onResizeDown = (e) => { resizing.current = { sx: e.clientX, sw: width }; e.preventDefault(); };
  useEffect(() => {
    const mv = (e) => { if (!resizing.current) return; setWidth(Math.max(560, resizing.current.sw + (e.clientX - resizing.current.sx) * 2)); };
    const up = () => { if (resizing.current && winLocked) saveWin(width, winPos); resizing.current = null; };
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
  }, [winLocked, width, winPos]);
  const gridRef = useRef(null);
  const formRef = useRef(null);
  const partnerRef = useRef(null);
  const mgrRef = useRef(null);
  const dateRef = useRef(null);
  const yRef = useRef(null);
  const mRef = useRef(null);
  const hdrRefs = useRef({});
  const dragLine = useRef(null);
  const focusSel = (ref) => ref.current?.querySelector("input")?.focus();
  // 상단 항목 엔터 체인: gridKeys 순서로 다음 항목 포커스, 끝나면 첫 품목 셀로
  const focusField = (key) => {
    const ks = gridKeys;
    const idx = ks.indexOf(key);
    const next = idx >= 0 && idx + 1 < ks.length ? ks[idx + 1] : null;
    if (!next) { setTimeout(() => focusCell(0, firstCol), 0); return; }
    if (next === "date") yRef.current?.focus();
    else if (next === "partner") focusSel(partnerRef);
    else if (next === "mgr") focusSel(mgrRef);
    else hdrRefs.current[next]?.focus();
  };

  const isDirty = () => {
    if (form.editId) return false;
    if ((form.partner || "").trim() || (form.mgr || "").trim()) return true;
    if (form.hdr && Object.values(form.hdr).some(v => (v || "").toString().trim())) return true;
    return (form.lines || []).some(l => (l.name || "").trim() || (l.code || "").trim() || (l.qty || "").toString().trim() || (l.price || "").toString().trim() || (l.memo || "").trim());
  };
  const requestClose = () => { if (cfgOpen) { setEntryDonePrompt(true); return; } if (isDirty()) setCloseAsk(true); else handleCancel(); };
  // 저장 없이 닫기 — 화면설정 변경(열 너비/순서/숨김/이름/커스텀열)을 진입 시점으로 되돌림
  const handleCancel = () => {
    const s = draftSnap.current;
    if (s) {
      setColWidths(s.colWidths);
      setColOrder(s.colOrder);
      setHiddenCols(s.hiddenCols);
      setBaseLabels(s.baseLabels);
      setHdrFields(s.hdrFields);
      if (s.gridOrder !== undefined) setGridOrder(s.gridOrder);
      if (s.enterSeq) setEnterSeq(s.enterSeq);
      if (onRevertEntryCols) onRevertEntryCols(s.customCols);
    }
    setCfgOpen(false);
    onClose();
  };

  useEffect(() => {
    if (open) {
      const base = { date: TODAY, partner: "", mgr: "", status: "완료", lines: makeRows(ENTRY_ROWS) };
      if (initial) {
        const lines = (initial.lines && initial.lines.length ? initial.lines : []).map(l => ({ ...blankLine(), ...l }));
        while (lines.length < ENTRY_ROWS) lines.push(blankLine());
        Object.assign(base, initial, { lines });
      }
      setForm(base);
      setErr(""); setPicker(null);
      // 창 크기/위치: 저장(고정)된 값이 있으면 적용, 없으면 기본값 (저장 안 한 변경은 유지 안 함)
      setWinLocked(false);
      const sw = readNum(WIDTH_KEY); setWidth(sw == null ? 860 : sw);
      setWinPos(readPos() || { x: 0, y: 0 });
      draftSnap.current = {
        colWidths: { ...colWidths },
        colOrder: colOrder ? [...colOrder] : null,
        hiddenCols: [...hiddenCols],
        baseLabels: { ...baseLabels },
        hdrFields: hdrFields.map(f => ({ ...f })),
        gridOrder: gridOrder ? [...gridOrder] : null,
        enterSeq: [...enterSeq],
        customCols: customCols.map(c => ({ ...c })),
      };
      // 품목만 붙여넣고 거래처가 비어있으면 거래처 칸으로 먼저 포커스
      if (initial && initial.focusPartner) {
        setTimeout(() => partnerRef.current?.querySelector("input")?.focus(), 60);
      } else {
        setTimeout(() => dateRef.current?.focus(), 40);
      }
    }
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const fn = (e) => {
      if (colModal || editCol || hdrAddOpen || panelPickFor || panelNameFor || picker) return; // 상위 팝업이 열려있으면 입력창은 반응하지 않음
      if (e.key === "Escape") { requestClose(); return; }
      if (e.key === "F8") { e.preventDefault(); formRef.current?.requestSubmit(); return; }
      if (e.key === "F4") { e.preventDefault(); setPicker({ kind: "partner" }); return; }
      if (e.key === "F3") {
        e.preventDefault();
        const active = document.activeElement;
        const r = active?.getAttribute?.("data-r");
        const ri = r != null ? Number(r) : 0;
        setPicker({ kind: "item", row: ri, mapName: form.lines[ri]?.name || form.lines[ri]?.code });
        return;
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "Delete" || e.key === "Backspace")) {
        const r = document.activeElement?.getAttribute?.("data-r");
        if (r != null) { e.preventDefault(); rmLine(Number(r)); }
      }
    };
    window.addEventListener("keydown", fn);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = prev; };
  }, [open, onClose]);

  const [rowSel, setRowSel] = useState(() => new Set());
  const rowDragPaint = useRef(null);
  useEffect(() => {
    const up = () => { rowDragPaint.current = null; };
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, []);

  if (!open) return null;

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const renderZone = (zone) => {
    const activeLine = activeRow != null ? form.lines[activeRow] : null;
    const curItem = activeLine ? ITEM_MASTER.find(x => (activeLine.code && x.code === activeLine.code) || (activeLine.name && x.name === activeLine.name)) : null;
    const curPartner = PARTNER_MASTER.find(p => p.name === (form.partner || "").trim()) || null;
    const panelCtx = { item: curItem, partner: curPartner, line: activeLine };
    const baseId = (panelApi.panels[0] || {}).id;
    return (
      <InfoPanelBody api={panelApi} ctx={panelCtx} cfg={cfgOpen} zone={zone} panels={panelApi.panels} baseId={baseId}
        subFor={(pn) => (pn.id === baseId) ? (activeLine && (activeLine.name || activeLine.code) ? ([activeLine.name || activeLine.code, activeLine.spec, activeLine.unit].filter(Boolean).join(" · ")) : "입력한 거래처·품목 정보") : null}
        renderBaseExtra={() => (activeLine && (activeLine.code || activeLine.name)) ? (() => {
          const r = recentOf(activeLine, priceMode);
          return (
            <>
              <div className="rs-sec-h">단가 정보</div>
              <div className="rs-toggle" style={{ margin: "0 14px 8px" }}>
                <button type="button" className={priceMode === "buy" ? "is-on" : ""} onClick={() => setPriceMode("buy")}>최근 매입단가</button>
                <button type="button" className={priceMode === "sell" ? "is-on" : ""} onClick={() => setPriceMode("sell")}>판매단가</button>
              </div>
              {r.length === 0 ? (
                <div className="recside-empty"><div className="rs-emoji">📋</div><div>{priceMode === "buy" ? "최근 매입 내역이" : "등록된 판매단가가"} 없습니다.</div></div>
              ) : (
                <div className="rs-list">
                  {r.map((rr, k) => (
                    <button key={k} type="button" className="rs-row" onMouseDown={(ev) => { ev.preventDefault(); setLine(activeRow, { price: rr.price }); }} title="이 단가로 적용">
                      <span className="rs-date">{rr.date}</span>
                      <span className="rs-partner">{rr.partner}</span>
                      <span className="rs-price">{fmt(rr.price)}<span className="rs-won">원</span></span>
                    </button>
                  ))}
                </div>
              )}
            </>
          );
        })() : (
          <div className="recside-empty">
            <div className="rs-emoji">🔎</div>
            <div>품목을 입력하거나<br/>행을 선택하면<br/>정보가 표시됩니다.</div>
          </div>
        )}
        onAddField={(pid) => setPanelPickFor(pid)} onRenamePanel={renamePanelPrompt} onAddPanel={() => panelApi.addPanel()} />
    );
  };
  const normalizeDate = () => setForm(p => {
    const parts = (p.date || "").split("-");
    const y = (parts[0] || ""), m = (parts[1] || ""), d = (parts[2] || "");
    const ny = (y ? y.padStart(4, "0").slice(-4) : "2026");
    const nm = String(Math.min(12, Math.max(1, parseInt(m, 10) || 1))).padStart(2, "0");
    const nd = String(Math.min(31, Math.max(1, parseInt(d, 10) || 1))).padStart(2, "0");
    return { ...p, date: [ny, nm, nd].join("-") };
  });
  const setLine = (i, patch) => setForm(p => {
    const lines = p.lines.map((l, j) => j === i ? { ...l, ...patch } : l);
    // 마지막 줄에 입력이 시작되면 자동으로 빈 줄 추가
    const last = lines[lines.length - 1];
    if (last && (last.code || last.name || last.qty || last.price)) lines.push(blankLine());
    return { ...p, lines };
  });
  const rmLine = (i) => setForm(p => {
    const lines = p.lines.filter((_, j) => j !== i);
    while (lines.length < ENTRY_ROWS) lines.push(blankLine());
    return { ...p, lines };
  });
  const addBlankAtEnd = () => setForm(p => ({ ...p, lines: [...p.lines, blankLine()] }));
  const moveLine = (from, to) => {
    if (from == null || to == null || from === to) return;
    setForm(p => {
      const lines = [...p.lines];
      const [m] = lines.splice(from, 1);
      lines.splice(to, 0, m);
      return { ...p, lines };
    });
  };
  const removeSelected = () => {
    setForm(p => {
      const lines = p.lines.filter((_, j) => !rowSel.has(j));
      while (lines.length < ENTRY_ROWS) lines.push(blankLine());
      return { ...p, lines };
    });
    setRowSel(new Set());
  };
  const copySelected = () => {
    setForm(p => {
      const idx = [...rowSel].sort((a, b) => a - b);
      if (idx.length === 0) return p;
      const dups = idx.map(j => ({ ...p.lines[j] }));
      const maxI = idx[idx.length - 1];
      const lines = [...p.lines.slice(0, maxI + 1), ...dups, ...p.lines.slice(maxI + 1)];
      return { ...p, lines };
    });
    setRowSel(new Set());
  };

  // 최근 거래 단가 조회: (현재 거래처 우선 → 전체) 같은 품목의 최근 단가 목록
  const recentOf = (line, mode = "buy") => {
    const keys = new Set();
    if (line.code) keys.add((line.code + "").replace(/\s/g, "").toLowerCase());
    if (line.name) keys.add((line.name + "").replace(/\s/g, "").toLowerCase());
    if (keys.size === 0) return [];
    // 판매단가: 최근 거래(일자·거래처)에 품목 마스터 판매가를 적용해 목록으로
    if (mode === "sell") {
      const it = ITEM_MASTER.find(x => keys.has((x.code+"").replace(/\s/g,"").toLowerCase()) || keys.has((x.name+"").replace(/\s/g,"").toLowerCase()));
      const sell = it ? it.price : null;
      if (sell == null) return [];
      if (!records) return [{ price: sell, partner: "기준 판매가", date: "마스터" }];
      const rows = [];
      records.forEach(s => (s.lines || []).forEach(l => {
        const nk = (l.name||"").replace(/\s/g,"").toLowerCase();
        const ck = (l.code||"").replace(/\s/g,"").toLowerCase();
        if ((nk && keys.has(nk)) || (ck && keys.has(ck))) rows.push({ price: sell, partner: s.partner, date: s.date });
      }));
      rows.sort((a,b)=>(b.date>a.date?1:-1));
      const seenP = new Set(); const uq = [];
      for (const r of rows) { const id=r.partner+r.date; if(!seenP.has(id)){seenP.add(id);uq.push(r);} if(uq.length>=6)break; }
      return uq.length ? uq : [{ price: sell, partner: "기준 판매가", date: "마스터" }];
    }
    if (!records) return [];
    const out = [];
    records.forEach(s => (s.lines || []).forEach(l => {
      const nk = (l.name || "").replace(/\s/g, "").toLowerCase();
      const ck = (l.code || "").replace(/\s/g, "").toLowerCase();
      if ((nk && keys.has(nk)) || (ck && keys.has(ck))) out.push({ price: l.price, partner: s.partner, date: s.date });
    }));
    out.sort((a, b) => (b.date > a.date ? 1 : -1));
    const p = form.partner.trim();
    out.sort((a, b) => (a.partner === p ? -1 : 0) - (b.partner === p ? -1 : 0));
    const seen = new Set(); const uniq = [];
    for (const r of out) { if (!seen.has(r.price)) { seen.add(r.price); uniq.push(r); } if (uniq.length >= 6) break; }
    return uniq;
  };

  // 품목코드/품목명 키워드로 마스터 검색
  const itemMatches = (q) => {
    const s = (q || "").trim().toLowerCase();
    if (!s) return [];
    return ITEM_MASTER.filter(it => it.code.toLowerCase().includes(s) || it.name.toLowerCase().includes(s)).slice(0, 6);
  };
  const applyItem = (i, it) => {
    setLine(i, { code: it.code, name: it.name, spec: it.spec, price: it.price, tax: it.tax, qty: "1" });
  };

  // 코드 없는 품목 → 이름 유사도로 추천
  const recommendFor = (name) => {
    const key = (name || "").replace(/\s/g, "").toLowerCase();
    if (!key) return [];
    const score = (x) => {
      const xn = x.name.replace(/\s/g, "").toLowerCase();
      if (xn === key) return 100;
      if (xn.includes(key) || key.includes(xn)) return 80;
      // 공통 문자 수
      let c = 0;
      for (const ch of new Set(key)) if (xn.includes(ch)) c++;
      return c / Math.max(key.length, 1) * 50;
    };
    return ITEM_MASTER.map(x => ({ it: x, s: score(x) }))
      .filter(r => r.s >= 25)
      .sort((a, b) => b.s - a.s)
      .slice(0, 3)
      .map(r => r.it);
  };

  const valid = form.lines.filter(l => l.code.trim() && l.name.trim() && l.qty);
  const hasUnmapped = form.lines.some(l => (l.name || "").trim() && l.qty && !(l.code || "").trim());
  const effStatus = hasUnmapped ? "주문" : form.status;
  const effVat = (l) => { const sup = Number(l.qty) * Number(l.price) || 0; return (l.vat != null && l.vat !== "") ? (Number(l.vat) || 0) : Math.round(sup * 0.1); };
  const supply = valid.reduce((s, l) => s + Number(l.qty) * Number(l.price), 0);
  const vat = valid.reduce((s, l) => s + effVat(l), 0);

  // 셀 키보드 이동: 방향키 / 엔터(다음 행 같은 칸) / 탭(브라우저 기본)
  const navCustom = customCols.filter(c => c.type === "text" || c.type === "date" || c.type === "money");
  const NAV_FIELDS = ["name", "spec", "unit", "qty", "price", "supply", "vat", "memo", ...navCustom.map(c => c.key)]
    .map((key, i) => { const editC = { name: 0, spec: 1, qty: 2, price: 3, memo: 4 }; navCustom.forEach((col, k) => { editC[col.key] = 5 + k; }); return { key, c: editC[key] != null ? editC[key] : null, label: labelOf(key), editable: editC[key] != null }; });
  const custDataC = Object.fromEntries(navCustom.map((col, k) => [col.key, 5 + k]));
  const navByKey = Object.fromEntries(NAV_FIELDS.map(f => [f.key, f]));
  // enterSeq에 없는(새로 추가된) 항목은 뒤에 자동 편입
  const fullSeq = [...enterSeq.filter(k => navByKey[k]), ...NAV_FIELDS.map(f => f.key).filter(k => !enterSeq.includes(k))];
  const seqCols = fullSeq.map(k => (navByKey[k] && navByKey[k].editable) ? navByKey[k].c : null).filter(c => c != null);
  const nextCol = (c) => { const i = seqCols.indexOf(c); return i >= 0 && i + 1 < seqCols.length ? seqCols[i + 1] : null; };
  const prevCol = (c) => { const i = seqCols.indexOf(c); return i > 0 ? seqCols[i - 1] : null; };
  const lastCol = seqCols.length ? seqCols[seqCols.length - 1] : 0;
  const firstCol = seqCols.length ? seqCols[0] : 0;
  const focusCell = (r, c) => {
    const el = gridRef.current?.querySelector(`[data-r="${r}"][data-c="${c}"]`);
    if (el) { el.focus(); el.select?.(); }
  };
  const onCellKey = (e, r, c) => {
    const rows = form.lines.length;
    if (e.key === "ArrowDown") { e.preventDefault(); focusCell(Math.min(r + 1, rows - 1), c); }
    else if (e.key === "ArrowUp") { e.preventDefault(); focusCell(Math.max(r - 1, 0), c); }
    else if (e.key === "Enter") {
      e.preventDefault();
      const nx = nextCol(c);
      if (nx != null) { focusCell(r, nx); }
      else { if (r + 1 >= rows) addBlankAtEnd(); setTimeout(() => focusCell(r + 1, firstCol), 0); }
    }
    else if (e.key === "ArrowRight" && e.target.selectionStart === e.target.value.length) {
      e.preventDefault();
      const nx = nextCol(c);
      if (nx != null) focusCell(r, nx); else focusCell(Math.min(r + 1, rows - 1), firstCol);
    }
    else if (e.key === "ArrowLeft" && e.target.selectionStart === 0) {
      e.preventDefault();
      const pv = prevCol(c);
      if (pv != null) focusCell(r, pv); else if (r > 0) focusCell(r - 1, lastCol);
    }
  };
  // 엔터 이동순서 재배열 (드래그)
  const moveEnter = (fromK, toK) => setEnterSeq(() => { const a = fullSeq.slice(); const fi = a.indexOf(fromK), ti = a.indexOf(toK); if (fi < 0 || ti < 0) return fullSeq; a.splice(ti, 0, a.splice(fi, 1)[0]); return a; });

  const submit = (e) => {
    e.preventDefault();
    if (!form.partner.trim()) { setErr("거래처를 입력해 주세요."); return; }
    // 품목명은 있으나 코드가 없는 줄 → 코드 필수
    const missingCode = form.lines.some(l => l.name.trim() && (!l.code || !l.code.trim()));
    if (missingCode) { setErr("품목코드는 필수입니다. 추천 또는 직접매핑으로 품목을 연결해 주세요."); return; }
    if (valid.length === 0) { setErr("품목을 1개 이상 입력해 주세요."); return; }
    if (form.editId) { setSavePrompt(true); return; }
    doSave();
  };
  const doSave = () => {
    // 매핑 안된 품목(코드 없음)이 있으면 상태를 '주문' 단계로
    const hasUnmapped = valid.some(l => !l.code || !l.code.trim());
    // 저장 시: 붙여넣은 원문(raw)과 코드가 모두 있으면 거래처별 매핑으로 자동 등록
    const partnerName = form.partner.trim();
    if (onMap && partnerName) {
      valid.forEach(l => {
        const raw = (l.raw || "").trim();
        if (raw && l.code && l.code.trim() && raw.replace(/\s/g,"") !== l.name.replace(/\s/g,"")) {
          onMap(partnerName, raw, { code: l.code, name: l.name, spec: l.spec, unit: l.unit, price: Number(l.price) || 0, tax: l.tax });
        }
      });
    }
    onSave({
      editId: form.editId,
      date: form.date, partner: form.partner.trim(), mgr: form.mgr.trim() || "—",
      status: hasUnmapped ? "주문" : form.status,
      lines: valid.map(l => ({ code: l.code, name: l.name.trim(), spec: l.spec.trim(), qty: Number(l.qty), price: Number(l.price), tax: l.tax })),
    });
  };

  return (
    <div className="modal-root" role="dialog" aria-modal="true">
      <div className="modal-scrim" />
      <ConfirmModal open={savePrompt} title="수정사항 저장"
        message="수정한 내용을 저장할까요? 저장하면 이전 내용으로 되돌릴 수 없습니다."
        confirmLabel="저장" onConfirm={() => { setSavePrompt(false); doSave(); }} onClose={() => setSavePrompt(false)} />
      <form className="modal modal-entry" onSubmit={submit} ref={formRef} style={{ width: width, transform: (winPos.x || winPos.y) ? `translate(${winPos.x}px, ${winPos.y}px)` : undefined }}>
        <span className="entry-resize" onMouseDown={onResizeDown} title="너비 조절" />
        <header className="modal-head modal-head-drag" onMouseDown={onWinDragDown}>
          <div>
            <h2 className="modal-title">{form.editId ? "매출 수정" : "매출 입력"}</h2>
            <div className="modal-sub">Enter·Tab·방향키 이동 · <b>F8</b> 저장 · <b>F4</b> 거래처 · <b>F3</b> 품목검색 · <b>Ctrl+Del</b> 행삭제</div>
          </div>
          <div className="modal-head-actions">
            <div className="win-tools">
              <button type="button" className={`win-tool ${winLocked ? "is-on" : ""}`} title="드래그로 창 이동 / 모서리로 크기 조절 · 클릭하면 현재 위치·크기 고정(저장)" onMouseDown={onWinBtnDown}>⛶</button>
            </div>
            <ViewPresetMenu views={entryViews} activeCode={activeEntryView} enabled={cfgOpen}
              onApply={applyEntryView} onSaveNew={saveNewEntryView} onOverwrite={overwriteEntryView} onRename={renameEntryView} onDelete={deleteEntryView} />
            <div className="cfg-wrap">
              <button type="button" className={`pin-btn ${cfgOpen ? "is-on" : ""}`} onClick={() => { if (cfgOpen) setEntryDonePrompt(true); else { setCfgOpen(true); setColPop(null); } }} title="화면 설정">
                <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/><path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-2.9 1.2V21a2 2 0 11-4 0v-.1A1.7 1.7 0 004.6 19l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00-1.2-2.9H.5a2 2 0 110-4h.1A1.7 1.7 0 002 4.6l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 002.9-1.2V.5a2 2 0 114 0v.1A1.7 1.7 0 0019 2l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 001.2 2.9h.1a2 2 0 110 4h-.1a1.7 1.7 0 00-1.6 1.3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" transform="translate(0.5 0.5) scale(0.96)"/></svg>
              {cfgOpen ? "설정 완료" : "화면 설정"}
            </button>
            </div>
            <button type="button" className="modal-close" onClick={requestClose}>{I.close}</button>
          </div>
        </header>

        <div className="entry-body">
          <div className={`entry-grid ${cfgOpen ? "is-cfg" : ""}`}>
            <div className="fld" style={{ order: orderOf("date"), display: gHid("date") ? "none" : undefined }} {...fldDrag("date")} {...gridCell("date", gLabel("date", "거래일자"))}><span className="fld-label">{gLabel("date", "거래일자")}</span><GridMenu k="date" label="거래일자" />
              {(() => {
                const dp = form.date.split("-");
                const dy = dp[0] || "", dm = dp[1] || "", dd = dp[2] || "";
                return (
              <div className="date3">
                <input ref={yRef} className="date-txt date-txt-y is-mono" value={dy} inputMode="numeric" maxLength={4} placeholder="YYYY"
                  onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 4); setF("date", [v, dm, dd].join("-")); if (v.length === 4) mRef.current?.focus(); }}
                  onBlur={normalizeDate}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); mRef.current?.focus(); } }} />
                <span className="date-slash">/</span>
                <input ref={mRef} className="date-txt is-mono" value={dm} inputMode="numeric" maxLength={2} placeholder="MM"
                  onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 2); setF("date", [dy, v, dd].join("-")); if (v.length === 2) dateRef.current?.focus(); }}
                  onBlur={normalizeDate}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); dateRef.current?.focus(); } }} />
                <span className="date-slash">/</span>
                <input ref={dateRef} className="date-txt date-day is-mono" value={dd} inputMode="numeric" maxLength={2} placeholder="DD"
                  onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 2); setF("date", [dy, dm, v].join("-")); }}
                  onBlur={normalizeDate}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); normalizeDate(); focusField("date"); } }} />
                <button type="button" className="date-cal" title="달력" tabIndex={-1}
                  onClick={(e) => { const inp = e.currentTarget.nextSibling; inp.showPicker ? inp.showPicker() : inp.focus(); }}>
                  <svg viewBox="0 0 24 24" fill="none"><rect x="3.5" y="5" width="17" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                </button>
                <input type="date" className="date-native" value={/^\d{4}-\d{2}-\d{2}$/.test(form.date) ? form.date : ""} onChange={(e) => e.target.value && setF("date", e.target.value)} tabIndex={-1} aria-hidden="true" />
              </div>
                );
              })()}
            </div>
            <div className="fld" ref={partnerRef} style={{ order: orderOf("partner"), display: gHid("partner") ? "none" : undefined }} {...fldDrag("partner")} {...gridCell("partner", gLabel("partner", "거래처"))}><span className="fld-label">{gLabel("partner", "거래처")} <span className="req">*</span></span><GridMenu k="partner" label="거래처" />
              <div className="srch-input">
                {(() => { const pc = PARTNER_MASTER.find(p => p.name === form.partner.trim()); return pc ? <span className="srch-code" title="거래처 코드">{pc.code}</span> : null; })()}
                <input type="text" value={form.partner}
                  onDoubleClick={() => setPicker({ kind: "partner", q: form.partner })}
                  onChange={(e) => setF("partner", e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    e.preventDefault();
                    const name = form.partner.trim();
                    if (!name) { focusField("partner"); return; }
                    if (PARTNER_MASTER.some(p => p.name === name)) {
                      if (resolvePartnerItems) setForm(p => ({ ...p, lines: resolvePartnerItems(name, p.lines) }));
                      focusField("partner");
                    } else setPicker({ kind: "partner", q: form.partner });
                  }}
                  placeholder="거래처" />
                <button type="button" className="srch-btn" tabIndex={-1} onClick={() => setPicker({ kind: "partner", q: form.partner })}>{I.search}</button>
              </div>
            </div>
            <div className="fld" ref={mgrRef} style={{ order: orderOf("mgr"), display: gHid("mgr") ? "none" : undefined }} {...fldDrag("mgr")} {...gridCell("mgr", gLabel("mgr", "담당자"))}><span className="fld-label">{gLabel("mgr", "담당자")}</span><GridMenu k="mgr" label="담당자" />
              <div className="srch-input">
                <input type="text" value={form.mgr}
                  onDoubleClick={() => setPicker({ kind: "mgr", q: form.mgr })}
                  onChange={(e) => setF("mgr", e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    e.preventDefault();
                    if (!form.mgr.trim() || MGR_MASTER.some(m => m.name === form.mgr.trim())) focusField("mgr");
                    else setPicker({ kind: "mgr", q: form.mgr });
                  }}
                  placeholder="담당자" />
                <button type="button" className="srch-btn" tabIndex={-1} onClick={() => setPicker({ kind: "mgr", q: form.mgr })}>{I.search}</button>
              </div>
            </div>
            {hdrFields.map(f => (
              <div className="fld" key={f.key} style={{ order: orderOf(f.key) }} {...fldDrag(f.key)} {...gridCell(f.key, f.label)}>
                <span className="fld-label">{f.label}</span><GridMenu k={f.key} label={f.label} />
                <input type="text" className="fld-input"
                  ref={(el) => { hdrRefs.current[f.key] = el; }}
                  value={(form.hdr && form.hdr[f.key]) || ""}
                  onChange={(e) => setForm(p => ({ ...p, hdr: { ...(p.hdr || {}), [f.key]: e.target.value } }))}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); focusField(f.key); } }}
                  placeholder={f.label} />
              </div>
            ))}
            {cfgOpen && ["date", "partner", "mgr"].some(gHid) ? (
              <div className="gm-hid" style={{ order: 1000 }}>
                <span className="gm-hid-lbl">삭제됨</span>
                {["date", "partner", "mgr"].filter(gHid).map(k => (
                  <button key={k} type="button" className="gm-chip" onClick={() => setGridMeta(p => ({ ...p, [k]: { ...(p[k] || {}), hide: false } }))}>+ {gLabel(k, k === "date" ? "거래일자" : k === "partner" ? "거래처" : "담당자")}</button>
                ))}
              </div>
            ) : null}
          </div>

          {!recHidden ? <div className="entry-zones-top">{renderZone("top")}</div> : null}
          <div className="entry-main">
          <div className="eltab" ref={gridRef} onFocusCapture={(e) => { if (e.target.tagName === "INPUT") e.target.select(); }}>
            {rowSel.size > 0 ? (
              <div className="rowsel-bar">
                <span className="rowsel-cnt">{rowSel.size}행 선택</span>
                <button type="button" className="btn-ghost btn-sm" onClick={copySelected}>{I.copy} 복사</button>
                <button type="button" className="btn-ghost btn-sm btn-danger" onClick={removeSelected}>{I.trash} 삭제</button>
                <button type="button" className="btn-ghost btn-sm" onClick={() => setRowSel(new Set())}>선택 해제</button>
              </div>
            ) : null}
            {cfgOpen ? (
              <div className="cfg-hint">⚙ 설정 모드 — 열 제목을 누르면 추가·이름수정·숨김·삭제할 수 있어요. 드래그로 순서 변경, 오른쪽 경계 드래그로 너비 조절.
                <button type="button" className="cfg-reset" onClick={() => setColWidths({})}>너비 초기화</button>
              </div>
            ) : null}
            {cfgOpen ? (
              <div className="enter-cfg">
                <span className="enter-cfg-lbl">⏎ 상단 항목 순서</span>
                <div className="enter-chips">
                  {gridKeys.map((k, idx) => {
                    const label = k === "date" ? "거래일자" : k === "partner" ? "거래처" : k === "mgr" ? "담당자" : ((hdrFields.find(f => f.key === k) || {}).label || k);
                    return (
                    <span key={k} className="enter-chip" draggable
                      onDragStart={() => { gridDrag.current = k; }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => { e.preventDefault(); moveGrid(gridDrag.current, k); gridDrag.current = null; }}
                      title="드래그하여 순서 변경">
                      <span className="enter-num">{idx + 1}</span>{label}
                    </span>
                    );
                  })}
                </div>
                <span className="enter-cfg-hint">상단 입력칸을 엔터로 넘어가는 순서입니다.</span>
              </div>
            ) : null}
            {cfgOpen ? (
              <div className="enter-cfg">
                <span className="enter-cfg-lbl">⏎ 품목 열 엔터 순서</span>
                <div className="enter-chips">
                  {fullSeq.map((k, idx) => (
                    <span key={k} className="enter-chip" draggable
                      onDragStart={() => { enterDrag.current = k; }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => { e.preventDefault(); moveEnter(enterDrag.current, k); enterDrag.current = null; }}
                      title="드래그하여 순서 변경">
                      <span className="enter-num">{idx + 1}</span>{(navByKey[k] || {}).label || k}
                    </span>
                  ))}
                </div>
                <span className="enter-cfg-hint">드래그로 순서를 바꾸면 입력 중 엔터가 이 순서로 이동합니다.</span>
              </div>
            ) : null}
            {cfgOpen && colPop ? (
              <>
                <div className="colpop-scrim" onClick={() => setColPop(null)} />
                <div className="colpop" style={colPopX != null ? { left: colPopX, transform: "translateX(-50%)" } : undefined}>
                  <div className="colpop-head"><span className="colpop-sw" />{labelOf(colPop)}</div>
                  <button type="button" className="colpop-item" onClick={() => { setColModal(true); setColPop(null); }}>새 열 추가</button>
                  <button type="button" className="colpop-item" onClick={() => { const cc = customCols.find(c => c.key === colPop); setEditCol(cc || { key: colPop, label: labelOf(colPop), _base: true }); setColPop(null); }}>설정</button>
                  <button type="button" className="colpop-item" onClick={() => { toggleHide(colPop); setColPop(null); }}>
                    {isHid(colPop) ? "표시하기" : "숨기기"}
                  </button>
                  {customCols.find(c => c.key === colPop) ? (
                    <button type="button" className="colpop-item colpop-danger" onClick={() => { onRemoveCol(colPop); setColPop(null); }}>열 삭제</button>
                  ) : null}
                </div>
              </>
            ) : null}

            <div className={`eltab-row eltab-head ${cfgOpen ? "is-cfg" : ""}`} style={{ gridTemplateColumns: gridTmpl }}>
              <div className="el-no" style={{ cursor: "pointer" }} title="전체 선택/해제" onClick={() => setRowSel(prev => prev.size === form.lines.length ? new Set() : new Set(form.lines.map((_, i) => i)))}></div>
              <div className="el-name th-col" style={cs("name")} {...colDrag("name")}>{labelOf("name")}{cfgOpen ? <span className="th-resize" onMouseDown={(e) => startColResize(e, "name")} draggable={false} /> : null}</div>
              <div className="el-spec th-col" style={cs("spec")} {...colDrag("spec")}>{labelOf("spec")}{cfgOpen ? <span className="th-resize" onMouseDown={(e) => startColResize(e, "spec")} draggable={false} /> : null}</div>
              <div className="el-unit th-col" style={cs("unit")} {...colDrag("unit")}>{labelOf("unit")}{cfgOpen ? <span className="th-resize" onMouseDown={(e) => startColResize(e, "unit")} draggable={false} /> : null}</div>
              <div className="el-qty th-col" style={cs("qty")} {...colDrag("qty")}>{labelOf("qty")}{cfgOpen ? <span className="th-resize" onMouseDown={(e) => startColResize(e, "qty")} draggable={false} /> : null}</div>
              <div className="el-price th-col" style={cs("price")} {...colDrag("price")}>{labelOf("price")}{cfgOpen ? <span className="th-resize" onMouseDown={(e) => startColResize(e, "price")} draggable={false} /> : null}</div>
              <div className="el-supply th-col" style={cs("supply")} {...colDrag("supply")}>{labelOf("supply")}{cfgOpen ? <span className="th-resize" onMouseDown={(e) => startColResize(e, "supply")} draggable={false} /> : null}</div>
              <div className="el-vat th-col" style={cs("vat")} {...colDrag("vat")}>{labelOf("vat")}{cfgOpen ? <span className="th-resize" onMouseDown={(e) => startColResize(e, "vat")} draggable={false} /> : null}</div>
              <div className="el-memo th-col" style={cs("memo")} {...colDrag("memo")}>{labelOf("memo")}{cfgOpen ? <span className="th-resize" onMouseDown={(e) => startColResize(e, "memo")} draggable={false} /> : null}</div>
              {customCols.map(col => (
                <div key={col.key} className="el-cust-h th-col" title="드래그하여 열 이동"
                  style={cs(col.key)} {...colDrag(col.key)}
                >
                  {labelOf(col.key)}
                  {cfgOpen ? <span className="th-resize" onMouseDown={(e) => startColResize(e, col.key)} draggable={false} /> : null}
                </div>
              ))}
            </div>

            {form.lines.map((l, i) => {
              const sup = (Number(l.qty) || 0) * (Number(l.price) || 0);
              const v = (l.vat != null && l.vat !== "") ? (Number(l.vat) || 0) : Math.round(sup * 0.1);
              const filled = l.code || l.name || l.qty || l.price;
              return (
                <div key={i} className={`eltab-row ${rowSel.has(i) ? "row-sel" : ""} ${(!l.code && l.name && nameFocusRow !== i) ? "row-reco" : ""}`} onFocusCapture={() => setActiveRow(i)} style={{ gridTemplateColumns: gridTmpl }}
                  onDragOver={(e) => { if (dragLine.current != null) e.preventDefault(); }}
                  onDrop={(e) => { e.preventDefault(); moveLine(dragLine.current, i); dragLine.current = null; }}>
                  <div className="el-no" draggable onDragStart={() => { dragLine.current = i; }} onDragEnd={() => { dragLine.current = null; }}
                    onMouseDown={(e) => { if (e.target.closest(".el-rm")) return; const val = !rowSel.has(i); rowDragPaint.current = { val }; setRowSel(prev => { const n = new Set(prev); if (val) n.add(i); else n.delete(i); return n; }); }}
                    onMouseEnter={() => { if (rowDragPaint.current) setRowSel(prev => { const n = new Set(prev); if (rowDragPaint.current.val) n.add(i); else n.delete(i); return n; }); }}
                    title="드래그하여 행 이동 · 번호를 훑으면 여러 행 선택">
                    <span className="el-numbox">{i + 1}</span>
                  </div>
                  <div className={`el-name el-namewrap ${l.name && l.name.trim() && !l.code ? "is-nocode" : ""}`} style={cs("name")}>
                    {l.code ? <span className="el-codechip" title="품목코드">{l.code}</span> : (l.name && l.name.trim() ? <span className="el-codechip el-codechip-miss" title="품목코드 필요">코드없음</span> : null)}
                    <input className="el-inp" data-r={i} data-c={0} value={l.name}
                      onDoubleClick={() => setPicker({ kind: "item", row: i, q: l.name || l.code, mapName: l.name || l.code })}
                      onFocus={() => { setActiveRow(i); setNameFocusRow(i); }}
                      onBlur={() => setNameFocusRow(r => r === i ? null : r)}
                      onChange={(e) => setLine(i, { name: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const nm = (l.name || "").trim();
                          const exact = nm ? ITEM_MASTER.find(x => x.name === nm) : null;
                          if (exact) { e.preventDefault(); applyItem(i, exact); setTimeout(() => focusCell(i, nextCol(0) != null ? nextCol(0) : 2), 0); return; }
                          if (nm && !l.code) { e.preventDefault(); setPicker({ kind: "item", row: i, q: nm, mapName: nm }); return; }
                        }
                        onCellKey(e, i, 0);
                      }}
                      placeholder="품목명" />
                    <button type="button" className="el-codesearch" tabIndex={-1} title="품목 검색 (F3)" onClick={() => setPicker({ kind: "item", row: i, q: l.name || l.code, mapName: l.name || l.code })}>{I.search}</button>
                  </div>
                  <input className="el-spec el-inp" style={cs("spec")} data-r={i} data-c={1} value={l.spec} onChange={(e) => setLine(i, { spec: e.target.value })} onKeyDown={(e) => onCellKey(e, i, 1)} />
                  <input className="el-unit el-inp" style={cs("unit")} value={l.unit} onChange={(e) => setLine(i, { unit: e.target.value })} placeholder="" />
                  <div className="el-qty-wrap" style={cs("qty")}>
                    <input className="el-qty el-inp is-mono is-right" data-r={i} data-c={2} value={l.qty} onChange={(e) => setLine(i, { qty: e.target.value.replace(/[^\d]/g, "") })} onKeyDown={(e) => onCellKey(e, i, 2)} inputMode="numeric" />
                    {!l.code && l.name && nameFocusRow !== i ? (
                      <div className="el-recos el-recos-qty">
                        <span className="el-reco-lbl">추천</span>
                        {recommendFor(l.name).map(rec => (
                          <button key={rec.code} type="button" className="el-reco" title={`${rec.code} · ${fmt(rec.price)}원`} onMouseDown={(ev) => { ev.preventDefault(); applyItem(i, rec); }}>
                            {rec.name}{rec.spec ? <span className="el-reco-spec">{rec.spec}</span> : null}{rec.unit ? <span className="el-reco-spec">{rec.unit}</span> : null}
                          </button>
                        ))}
                        <button type="button" className="el-reco el-reco-map" onMouseDown={(ev) => { ev.preventDefault(); setPicker({ kind: "item", row: i, q: l.name, mapName: l.name }); }}>
                          신규
                        </button>
                      </div>
                    ) : null}
                  </div>
                  <div className="el-price-wrap" style={cs("price")}>
                    <input className={`el-price el-inp is-mono is-right ${l.priceF ? "is-formula" : ""}`} data-r={i} data-c={3}
                      value={l.priceF !== "" && l.priceF != null && l.priceF !== undefined ? l.priceF : (l.price === "" ? "" : fmt(l.price))}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v.trim().startsWith("=")) {
                          const computed = evalFormula(v, { qty: l.qty, price: l.price, cost: (recentOf(l)[0] || {}).price });
                          setLine(i, { priceF: v, price: computed == null ? l.price : computed });
                        } else {
                          setLine(i, { priceF: "", price: v.replace(/[^\d]/g, "") });
                        }
                      }}
                      onKeyDown={(e) => { if (e.key === "Enter" && l.priceF) { setLine(i, { priceF: "" }); } onCellKey(e, i, 3); }}
                      onFocus={() => setActiveRow(i)}
                      title={l.priceF ? l.priceF + " = " + fmt(l.price) + "원" : "= 로 시작하면 수식 (예: =수량*단가)"}
                      placeholder={(() => { const r = recentOf(l); return r.length ? fmt(r[0].price) : ""; })()} />
                  </div>
                  <div className="el-supply el-cell" style={cs("supply")}>{sup ? fmt(sup) : ""}</div>
                  <div className="el-vat-wrap" style={cs("vat")}>
                    <input className="el-vat-inp el-inp is-mono is-right" data-r={i} data-c={90} value={l.vat != null && l.vat !== "" ? l.vat : "0"} inputMode="numeric"
                      onFocus={(e) => { if (!l.vat) e.target.select(); }}
                      onChange={(e) => setLine(i, { vat: e.target.value.replace(/[^\d]/g, "") })}
                      onKeyDown={(e) => onCellKey(e, i, 90)} />
                  </div>
                  <div className="el-memo-wrap" style={cs("memo")}>
                    <input className="el-memo el-inp" data-r={i} data-c={4} value={l.memo} onChange={(e) => setLine(i, { memo: e.target.value })} onKeyDown={(e) => onCellKey(e, i, 4)} placeholder="" />
                  </div>
                  {customCols.map(col => (
                    (col.type === "formula" || col.type === "source") ? (
                      <div key={col.key} className="el-cell el-cust" style={cs(col.key)}>{calcCustom(col, l)}</div>
                    ) : (
                      <input key={col.key} className={`el-inp el-cust-inp ${col.type === "money" ? "is-mono is-right" : ""}`}
                        style={cs(col.key)}
                        data-r={i} data-c={custDataC[col.key]}
                        onKeyDown={(e) => onCellKey(e, i, custDataC[col.key])}
                        type={col.type === "date" ? "date" : "text"}
                        value={col.type === "money"
                          ? ((l.custom && l.custom[col.key] != null && l.custom[col.key] !== "") ? fmt(l.custom[col.key]) : (col.dflt ? fmt(col.dflt) : ""))
                          : ((l.custom && l.custom[col.key]) || col.dflt || "")}
                        onChange={(e) => {
                          const raw = col.type === "money" ? e.target.value.replace(/[^\d]/g, "") : e.target.value;
                          setLine(i, { custom: { ...(l.custom || {}), [col.key]: raw } });
                        }}
                        placeholder={col.type === "money" ? "0" : col.label} />
                    )
                  ))}
                </div>
              );
            })}

            {/* 최하단 빈칸 — 누르면 빈 행 추가 */}
            <button type="button" className="eltab-addzone" onClick={addBlankAtEnd} tabIndex={-1} aria-label="빈 줄 추가"></button>

            <div className="eltab-row eltab-foot" style={{ gridTemplateColumns: gridTmpl }}>
              <div className="el-no"></div>
              <div className="el-name" style={cs("name")}></div>
              <div className="el-spec" style={cs("spec")}></div>
              <div className="el-unit" style={cs("unit")}></div>
              <div className="el-qty is-right" style={cs("qty")}>{valid.reduce((s, l) => s + (Number(l.qty) || 0), 0) || 0}</div>
              <div className="el-price" style={cs("price")}></div>
              <div className="el-supply is-right" style={cs("supply")}>{fmt(supply)}</div>
              <div className="el-vat is-right" style={cs("vat")}>{fmt(vat)}</div>
              <div className="el-memo is-right" style={cs("memo")}>{fmt(supply + vat)}</div>
              {customCols.map(col => <div key={col.key} style={cs(col.key)}></div>)}
            </div>
          </div>
          <div className="eltab-addcol" style={{ display: "none" }}>
            <button type="button" className="addcol-main" onClick={() => setColModal(true)}>{I.plus} 열 추가</button>
            {customCols.length > 0 ? (
              <div className="addcol-tools">
                <button type="button" className="addcol-link" onClick={() => { try { localStorage.setItem("nonamed.sales.entryCols.v1", JSON.stringify(customCols)); } catch(e){} alert("현재 열 구성이 저장되었습니다. 다음에도 그대로 유지됩니다."); }}>설정 저장</button>
                <span className="addcol-sep" />
                <button type="button" className="addcol-link addcol-link-muted" onClick={() => { if(confirm("추가한 열을 모두 초기화할까요?")) customCols.slice().forEach(c => onRemoveCol(c.key)); }}>초기화</button>
              </div>
            ) : null}
          </div>

          {/* 패널 존: 우측 (엔트리 메인 안) */}
          {!recHidden ? renderZone("right") : (
            <button type="button" className="recside-show" title="품목 정보 패널 보기" onClick={() => setRecHidden(false)}>‹ 패널</button>
          )}
          {panelPickFor ? <PanelFieldPicker open={!!panelPickFor} selected={(panelApi.panels.find(p => p.id === panelPickFor) || {}).fields || []} onToggle={(k) => panelApi.toggleField(panelPickFor, k)} onClose={() => setPanelPickFor(null)} /> : null}
          <PanelSettingsModal open={!!panelNameFor} initialName={(panelNameFor && panelNameFor.name) || ""} initialFields={(panelNameFor && (panelApi.panels.find(p => p.id === panelNameFor.id) || {}).fields) || []} onSave={(n, fields) => { panelApi.renamePanel(panelNameFor.id, n); panelApi.setPanelFields(panelNameFor.id, fields); setPanelNameFor(null); }} onClose={() => setPanelNameFor(null)} />
          </div>
          {!recHidden ? <div className="entry-zones-bottom">{renderZone("bottom")}</div> : null}

          {err ? <div className="fset-err">{err}</div> : null}
        </div>

        <footer className="modal-foot">
          <div className="ff-left">
            <span className="ff-k">합계</span>
            <span className="ff-v entry-total">{fmt(supply + vat)}원</span>
            <span className="entry-sub">(공급 {fmt(supply)} + 부가세 {fmt(vat)})</span>
          </div>
          <div className="ff-right">
            <div className="seg seg-sm entry-status-seg" title={hasUnmapped ? "미등록(코드 없는) 품목이 있어 주문으로 저장됩니다" : "저장 상태"}>
              {["완료", "주문"].map(k => <button key={k} type="button" disabled={hasUnmapped && k === "완료"} className={`seg-item ${effStatus === k ? "is-on" : ""}`} onClick={() => setForm(f => ({ ...f, status: k }))}>{k}</button>)}
            </div>
            {hasUnmapped ? <span className="entry-status-note">미등록 품목 있음 → 주문</span> : null}
            <button type="button" className="btn-ghost" onClick={requestClose}>취소</button>
            <button type="submit" className="btn-primary">{form.editId ? "수정저장" : "저장"} <kbd className="btn-kbd">F8</kbd></button>
            {form.editId ? <button type="button" className="btn-ghost btn-danger" onClick={() => setDelPrompt(true)}>삭제</button> : null}
          </div>
        </footer>
      </form>

      {delPrompt ? (
        <ConfirmModal
          open={true} title="전표 삭제" tone="danger"
          message={`${form.editId} 전표를 삭제할까요? 삭제된 전표는 최근 전표에서 삭제 취소할 수 있습니다.`}
          confirmLabel="삭제" onConfirm={() => { setDelPrompt(false); onDelete && onDelete(form.editId); }} onClose={() => setDelPrompt(false)} />
      ) : null}

      {picker?.kind === "partner" ? (
        <PickerOverlay
          title="거래처 검색"
          items={PARTNER_MASTER.map(p => ({ ...p, _key: p.code }))}
          fields={["name", "code", "ceo", "region"]}
          columns={[
            { key: "code", label: "코드", width: "90px", mono: true },
            { key: "name", label: "거래처명", width: "minmax(120px,1.4fr)", strong: true },
            { key: "ceo", label: "대표자", width: "90px" },
            { key: "phone", label: "전화번호", width: "130px", mono: true },
            { key: "region", label: "지역", width: "90px" },
          ]}
          initialQuery={picker.q}
          onPick={(it) => {
            setF("partner", it.name);
            // 거래처 선택 시: 비어있는 품목 단가를 거래처 매핑에서 불러와 채움
            if (resolvePartnerItems) {
              setForm(p => ({ ...p, partner: it.name, lines: resolvePartnerItems(it.name, p.lines) }));
            }
            setPicker(null);
            setTimeout(() => focusSel(mgrRef), 20);
          }}
          onNew={() => { if (window.PartnerEntryModal) { setNewPartner({ name: picker.q || "" }); setPicker(null); } else window.location.href = "거래처등록.html"; }}
          onClose={() => setPicker(null)}
        />
      ) : null}
      {newPartner ? (
        <window.PartnerEntryModal initialName={newPartner.name}
          onSaved={(p) => { if (!PARTNER_MASTER.some(x => x.name === p.name)) PARTNER_MASTER.push(p); setF("partner", p.name); setNewPartner(null); setTimeout(() => focusSel(mgrRef), 20); }}
          onClose={() => setNewPartner(null)} />
      ) : null}
      {picker?.kind === "mgr" ? (
        <PickerOverlay
          title="담당자 검색"
          items={MGR_MASTER.map(m => ({ ...m, _key: m.code }))}
          fields={["name", "code", "dept"]}
          columns={[
            { key: "code", label: "사번", width: "80px", mono: true },
            { key: "name", label: "담당자", width: "minmax(100px,1fr)", strong: true },
            { key: "dept", label: "부서", width: "100px" },
            { key: "phone", label: "연락처", width: "140px", mono: true },
          ]}
          initialQuery={picker.q}
          onPick={(it) => { setF("mgr", it.name); setPicker(null); setTimeout(() => focusCell(0, 0), 20); }}
          onNew={() => { alert("담당자 신규 화면으로 이동합니다."); }}
          onClose={() => setPicker(null)}
        />
      ) : null}
      {picker?.kind === "item" ? (
        <PickerOverlay
          title="품목 검색"
          items={ITEM_MASTER.map(it => ({ ...it, _key: it.code }))}
          fields={["code", "name", "spec"]}
          columns={[
            { key: "code", label: "품목코드", width: "100px", mono: true },
            { key: "name", label: "품목명", width: "minmax(120px,1.4fr)", strong: true },
            { key: "spec", label: "규격", width: "80px" },
            { key: "unit", label: "단위", width: "60px" },
            { key: "price", label: "단가", width: "100px", align: "right", mono: true, fmt: (v) => fmt(v) + "원" },
          ]}
          initialQuery={picker.q}
          onPick={(it) => { applyItem(picker.row, it); if (picker.mapName && onMap) onMap(form.partner, picker.mapName, it); setPicker(null); setTimeout(() => focusCell(picker.row, 2), 0); }}
          onNew={() => { setNewItem({ row: picker.row, name: picker.q || "" }); setPicker(null); }}
          onClose={() => setPicker(null)}
        />
      ) : null}

      {newItem ? (
        <NewItemModal
          initialName={newItem.name}
          onSave={(it) => {
            applyItem(newItem.row, it);
            if (onMap) onMap(form.partner, it.name, it);
            const row = newItem.row;
            setNewItem(null);
            setTimeout(() => focusCell(row, 2), 0);
          }}
          onClose={() => setNewItem(null)}
        />
      ) : null}

      {colModal ? (
        <AddColModal nextCode={"하단 " + String.fromCharCode(65 + customCols.length)} existing={customCols} onAdd={(c) => { onAddCol(c); setColModal(false); }} onClose={() => setColModal(false)} />
      ) : null}
      {editCol ? (
        <AddColModal initial={editCol} existing={customCols} onAdd={(c) => { if (editCol._base) { setBaseLabels(p => ({ ...p, [editCol.key]: c.label })); } else if (onUpdateCol) onUpdateCol(editCol.key, c); setEditCol(null); }} onClose={() => setEditCol(null)} />
      ) : null}
      {gridCfgFor ? (
        <AddColModal nextCode="상단 항목 설정" initial={gridCfgFor.initial} onAdd={(c) => { const k = gridCfgFor.key; if (hdrFields.find(f => f.key === k)) setHdrFields(prev => prev.map(f => f.key === k ? { ...f, ...c } : f)); else setGridMeta(p => ({ ...p, [k]: { ...(p[k] || {}), label: c.label, dflt: c.dflt } })); setGridCfgFor(null); }} onClose={() => setGridCfgFor(null)} />
      ) : null}
      {hdrAddOpen ? (
        <AddColModal nextCode={"상단 " + String.fromCharCode(65 + hdrFields.length)} onAdd={(c) => { setHdrFields(prev => [...prev, { key: "h" + Date.now().toString(36), label: c.label }]); setHdrAddOpen(false); }} onClose={() => setHdrAddOpen(false)} />
      ) : null}
      {entryDonePrompt ? (() => { const av = entryViews.find(v => v.code === activeEntryView); return (
        <div className="modal-root" role="dialog" aria-modal="true" style={{ zIndex: 96 }}>
          <div className="modal-scrim" onClick={() => setEntryDonePrompt(false)} />
          <div className="modal modal-confirm">
            <div className="confirm-body">
              <h2 className="confirm-title">화면 설정 저장</h2>
              <p className="confirm-msg">{av ? `변경한 화면 구성을 ${av.code} "${av.name}"에 적용할까요? 새 화면으로 저장할 수도 있어요.` : "변경한 화면 구성을 저장된 화면으로 등록할까요?"}</p>
            </div>
            <footer className="modal-foot">
              <div className="ff-left" />
              <div className="ff-right">
                <button type="button" className="btn-ghost" onClick={() => { setEntryDonePrompt(false); setColPop(null); const s = draftSnap.current; if (s) { setColWidths(s.colWidths); setColOrder(s.colOrder); setHiddenCols(s.hiddenCols); setBaseLabels(s.baseLabels); setHdrFields(s.hdrFields); if (s.gridOrder !== undefined) setGridOrder(s.gridOrder); if (s.enterSeq) setEnterSeq(s.enterSeq); if (onRevertEntryCols) onRevertEntryCols(s.customCols); } setCfgOpen(false); }}>취소</button>
                <button type="button" className="btn-ghost" onClick={() => { setEntryDonePrompt(false); setCfgOpen(false); setColPop(null); if (av) { setEntryViews(prev => prev.map(x => x.code === av.code ? { ...x, config: captureEntryConfig() } : x)); showToast("현재 양식에 적용했어요"); } }}>현재 양식에 적용</button>
                <button type="button" className="btn-primary" onClick={() => { setEntryDonePrompt(false); setEntrySaveOpen(true); }}>신규 저장</button>
              </div>
            </footer>
          </div>
        </div>
      ); })() : null}
      <SaveViewModal open={entrySaveOpen} code={nextViewCode(entryViews)} onSave={(n) => { confirmSaveNewEntry(n); setCfgOpen(false); setColPop(null); }} onClose={() => setEntrySaveOpen(false)} />
      <SaveViewModal open={!!entryRenameCode} title="화면 이름 변경" saveLabel="변경" initialName={(entryViews.find(v => v.code === entryRenameCode) || {}).name || ""} onSave={confirmRenameEntry} onClose={() => setEntryRenameCode(null)} />
      <ConfirmModal open={!!entryOverwriteCode} title="화면 덮어쓰기"
        message={(() => { const v = entryViews.find(x => x.code === entryOverwriteCode); return v ? `${v.code} "${v.name}" 화면을 지금 화면 구성으로 덮어쓸까요?` : ""; })()}
        confirmLabel="덮어쓰기" onConfirm={confirmOverwriteEntry} onClose={() => setEntryOverwriteCode(null)} />
      <ConfirmModal open={!!entryDeleteCode} title="화면 삭제" danger confirmLabel="삭제"
        message={(() => { const v = entryViews.find(x => x.code === entryDeleteCode); return v ? `${v.code} "${v.name}" 화면을 삭제할까요? 이 작업은 되돌릴 수 없습니다.` : ""; })()}
        onConfirm={confirmDeleteEntry} onClose={() => setEntryDeleteCode(null)} />
      <ConfirmModal open={closeAsk} title="입력 취소" danger confirmLabel="닫기"
        message="입력 중인 내용이 있습니다. 저장하지 않고 닫을까요? 입력한 내용은 사라집니다."
        onConfirm={() => { setCloseAsk(false); handleCancel(); }} onClose={() => setCloseAsk(false)} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   미수금 — 거래처별 미완료(주문) 합계
   ───────────────────────────────────────────── */
/* 거래처 원장 — 업체 전달용 정식 문서 양식 + 화면설정 */
const LEDGER_COLS = [
  { key: "date",    label: "일자",   width: "92px",  kind: "date" },
  { key: "summary", label: "적요",   width: "minmax(150px,1fr)", kind: "name" },
  { key: "inAmt",   label: "매출액", width: "100px", kind: "money" },
  { key: "outAmt",  label: "수금액", width: "100px", kind: "money" },
  { key: "bal",     label: "잔액",   width: "110px", kind: "money" },
  { key: "memo",    label: "비고",   width: "72px",  kind: "text" },
];
function LedgerModal({ info, rows, payments, onClose, onOpen }) {
  const cc = useColConfig({ allColumns: LEDGER_COLS, defaultVisible: LEDGER_COLS.map(c => c.key), prefix: "nonamed.sales.ledger" });
  const displayCols = cc.cfg ? cc.allCols : cc.visibleCols;
  const dragKey = useRef(null);
  const [colPop, setColPop] = useState(null);
  const [addColOpen, setAddColOpen] = useState(false);
  const [editCol, setEditCol] = useState(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [renameCode, setRenameCode] = useState(null);
  const [owCode, setOwCode] = useState(null);
  const [delCode, setDelCode] = useState(null);
  const [extraFields, setExtraFields] = useState(() => { try { return JSON.parse(localStorage.getItem("nonamed.sales.ledger.fields.v1")) || []; } catch (e) { return []; } });
  useEffect(() => { try { localStorage.setItem("nonamed.sales.ledger.fields.v1", JSON.stringify(extraFields)); } catch (e) {} }, [extraFields]);
  const [fieldPickOpen, setFieldPickOpen] = useState(false);
  // 자유 배치(PPT식) 레이아웃
  const LAYOUT_KEY = "nonamed.sales.ledger.layout.v1";
  const [layoutMode, setLayoutMode] = useState(false);
  const [ldDonePrompt, setLdDonePrompt] = useState(false);
  const [blocks, setBlocks] = useState(() => { try { let b = JSON.parse(localStorage.getItem(LAYOUT_KEY)) || null; if (b && b.seeded && (b.tables || []).some(t => t.id === "stx") && !(b.txtables || []).length) { b = { ...b, tables: b.tables.filter(t => t.id !== "stx"), txtables: [{ id: "stx" }] }; } return b; } catch (e) { return null; } });
  useEffect(() => { try { if (blocks) localStorage.setItem(LAYOUT_KEY, JSON.stringify(blocks)); else localStorage.removeItem(LAYOUT_KEY); } catch (e) {} }, [blocks]);
  const DEF_POS = { title: { x: 0, y: 16, w: 728 }, meta: { x: 0, y: 80, w: 728 }, party: { x: 0, y: 108, w: 728 }, items: { x: 0, y: 244, w: 728 }, note: { x: 0, y: 704, w: 728 }, issuer: { x: 0, y: 740, w: 728 } };
  const layPos = (id, dp) => (blocks && blocks.pos && blocks.pos[id]) || dp || { x: 0, y: 0, w: 300 };
  const ensureBlocks = (prev) => prev && prev.pos ? prev : { pos: { ...DEF_POS }, texts: (prev && prev.texts) || [] };
  const layDrag = useRef(null);
  const startBlockDrag = (e, id, dp) => { if (e.target.closest(".lb-resize") || e.target.closest("textarea") || e.target.closest(".lb-hide")) return; e.preventDefault(); const p = layPos(id, dp); layDrag.current = { id, sx: e.clientX, sy: e.clientY, ox: p.x, oy: p.y, ow: p.w, mode: "move", dp }; };
  const startBlockResize = (e, id, dp) => { e.preventDefault(); e.stopPropagation(); const p = layPos(id, dp); layDrag.current = { id, sx: e.clientX, ox: p.x, oy: p.y, ow: p.w, mode: "resize", dp }; };
  useEffect(() => {
    const mv = (e) => { const d = layDrag.current; if (!d) return; setBlocks(prev => { const base = ensureBlocks(prev); const p = (base.pos && base.pos[d.id]) || d.dp || { x: 0, y: 0, w: 300 }; const np = d.mode === "move" ? { ...p, x: Math.max(0, d.ox + e.clientX - d.sx), y: Math.max(0, d.oy + e.clientY - d.sy) } : { ...p, w: Math.max(120, d.ow + e.clientX - d.sx) }; return { ...base, pos: { ...base.pos, [d.id]: np } }; }); };
    const up = () => { layDrag.current = null; };
    window.addEventListener("mousemove", mv); window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
  }, []);
  const addTextBox = () => setBlocks(prev => { const base = ensureBlocks(prev); const id = "tx" + Date.now().toString(36); return { ...base, pos: { ...base.pos, [id]: { x: 40, y: 320, w: 240 } }, texts: [...base.texts, { id, text: "텍스트를 입력하세요" }] }; });
  const updateText = (id, v) => setBlocks(prev => { const base = ensureBlocks(prev); return { ...base, texts: base.texts.map(t => t.id === id ? { ...t, text: v } : t) }; });
  const removeText = (id) => setBlocks(prev => { const base = ensureBlocks(prev); const pos = { ...base.pos }; delete pos[id]; return { ...base, pos, texts: base.texts.filter(t => t.id !== id) }; });
  const hideBlock = (id) => setBlocks(prev => { const base = ensureBlocks(prev); const p = (base.pos && base.pos[id]) || DEF_POS[id]; return { ...base, pos: { ...base.pos, [id]: { ...p, hidden: !p.hidden } } }; });
  // 서식 리본 (글꼴·맞춤)
  const [selId, setSelId] = useState(null);
  const [cellMenu, setCellMenu] = useState(null);
  const [cellSel, setCellSel] = useState(null);
  const cellSelecting = useRef(false);
  useEffect(() => { const up = () => { cellSelecting.current = false; }; window.addEventListener("mouseup", up); return () => window.removeEventListener("mouseup", up); }, []);
  const inCellSel = (id, r, c) => { if (!cellSel || cellSel.id !== id) return false; const r1 = Math.min(cellSel.r1, cellSel.r2), r2 = Math.max(cellSel.r1, cellSel.r2), c1 = Math.min(cellSel.c1, cellSel.c2), c2 = Math.max(cellSel.c1, cellSel.c2); return r >= r1 && r <= r2 && c >= c1 && c <= c2; };
  const [thMenu, setThMenu] = useState(null);
  const [thLink, setThLink] = useState(false);
  const fmtOf = (id) => (blocks && blocks.fmt && blocks.fmt[id]) || {};
  const setFmt = (id, patch) => { if (!id) return; setBlocks(prev => { const base = ensureBlocks(prev); const fmt = { ...(base.fmt || {}) }; fmt[id] = { ...(fmt[id] || {}), ...patch }; return { ...base, fmt }; }); };
  const blockStyle = (id) => { const f = fmtOf(id); const deco = [f.underline ? "underline" : null, f.strike ? "line-through" : null].filter(Boolean).join(" "); return { fontFamily: f.font || undefined, fontSize: f.size ? f.size + "px" : undefined, fontWeight: f.bold ? 700 : undefined, fontStyle: f.italic ? "italic" : undefined, textDecoration: deco || undefined, color: f.color || undefined, textAlign: f.align || undefined, lineHeight: f.lh || undefined, background: f.hl || undefined, paddingLeft: f.indent ? f.indent * 16 : undefined }; };
  // 저장된 화면(뷰) — 자유배치 전체 포함
  const LAYS_KEY = LAYOUT_KEY.replace(".layout.v1", ".layouts.v1");
  const readLays = () => { try { return JSON.parse(localStorage.getItem(LAYS_KEY)) || {}; } catch (e) { return {}; } };
  const saveViewFull = (n) => { const code = nextViewCode(cc.views); cc.saveView(n); try { const m = readLays(); m[code] = blocks; localStorage.setItem(LAYS_KEY, JSON.stringify(m)); } catch (e) {} };
  const applyViewFull = (code) => { cc.applyView(code); const m = readLays(); if (Object.prototype.hasOwnProperty.call(m, code)) setBlocks(m[code]); };
  const overwriteViewFull = (code) => { cc.overwriteView(code); try { const m = readLays(); m[code] = blocks; localStorage.setItem(LAYS_KEY, JSON.stringify(m)); } catch (e) {} };
  // 표·그림 삽입
  const addTable = () => setBlocks(prev => { const base = ensureBlocks(prev); const id = "tb" + Date.now().toString(36); return { ...base, pos: { ...base.pos, [id]: { x: 60, y: 380, w: 340 } }, tables: [...(base.tables || []), { id, cells: [["", "", ""], ["", "", ""]] }] }; });
  const updateCell = (id, r, c, v) => setBlocks(prev => { const base = ensureBlocks(prev); return { ...base, tables: (base.tables || []).map(t => t.id === id ? { ...t, cells: t.cells.map((row, ri) => ri === r ? row.map((cv, ci) => ci === c ? v : cv) : row) } : t) }; });
  const tableAddRow = (id) => setBlocks(prev => { const base = ensureBlocks(prev); return { ...base, tables: (base.tables || []).map(t => t.id === id ? { ...t, cells: [...t.cells, t.cells[0].map(() => "")] } : t) }; });
  const tableAddCol = (id) => setBlocks(prev => { const base = ensureBlocks(prev); return { ...base, tables: (base.tables || []).map(t => t.id === id ? { ...t, cells: t.cells.map(row => [...row, ""]) } : t) }; });
  const removeTable = (id) => setBlocks(prev => { const base = ensureBlocks(prev); const pos = { ...base.pos }; delete pos[id]; return { ...base, pos, tables: (base.tables || []).filter(t => t.id !== id) }; });
  const tbColResize = (e, id, ci, curW) => { e.preventDefault(); e.stopPropagation(); const sx = e.clientX; const sw = curW; const move = (ev) => setBlocks(prev => { const base = ensureBlocks(prev); return { ...base, tables: (base.tables || []).map(t => { if (t.id !== id) return t; const colW = (t.colW || t.cells[0].map(() => 0)).slice(); while (colW.length < t.cells[0].length) colW.push(0); colW[ci] = Math.max(30, sw + ev.clientX - sx); return { ...t, colW }; }) }; }); const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); }; window.addEventListener("mousemove", move); window.addEventListener("mouseup", up); };
  const imgInputRef = useRef(null);
  const addImage = (file) => { const rd = new FileReader(); rd.onload = () => setBlocks(prev => { const base = ensureBlocks(prev); const id = "im" + Date.now().toString(36); return { ...base, pos: { ...base.pos, [id]: { x: 80, y: 420, w: 200 } }, images: [...(base.images || []), { id, src: rd.result }] }; }); rd.readAsDataURL(file); };
  const removeImage = (id) => setBlocks(prev => { const base = ensureBlocks(prev); const pos = { ...base.pos }; delete pos[id]; return { ...base, pos, images: (base.images || []).filter(t => t.id !== id) }; });
  const addDataField = (key) => setBlocks(prev => { const base = ensureBlocks(prev); const id = "df" + Date.now().toString(36); return { ...base, pos: { ...base.pos, [id]: { x: 60, y: 340, w: 220 } }, datas: [...(base.datas || []), { id, key }] }; });
  const removeData = (id) => setBlocks(prev => { const base = ensureBlocks(prev); const pos = { ...base.pos }; delete pos[id]; return { ...base, pos, datas: (base.datas || []).filter(t => t.id !== id) }; });
  const addDataTable = () => setBlocks(prev => { const base = ensureBlocks(prev); const id = "dt" + Date.now().toString(36); return { ...base, pos: { ...base.pos, [id]: { x: 60, y: 340, w: 280 } }, dtables: [...(base.dtables || []), { id, keys: ["partner", "bal"] }] }; });
  const dtAddKey = (id, k) => setBlocks(prev => { const base = ensureBlocks(prev); return { ...base, dtables: (base.dtables || []).map(t => t.id === id && !t.keys.includes(k) ? { ...t, keys: [...t.keys, k] } : t) }; });
  const dtRemoveKey = (id, k) => setBlocks(prev => { const base = ensureBlocks(prev); return { ...base, dtables: (base.dtables || []).map(t => t.id === id ? { ...t, keys: t.keys.filter(x => x !== k) } : t) }; });
  const removeDataTable = (id) => setBlocks(prev => { const base = ensureBlocks(prev); const pos = { ...base.pos }; delete pos[id]; return { ...base, pos, dtables: (base.dtables || []).filter(t => t.id !== id) }; });
  const addCheck = () => setBlocks(prev => { const base = ensureBlocks(prev); const id = "ck" + Date.now().toString(36); return { ...base, pos: { ...base.pos, [id]: { x: 60, y: 420, w: 180 } }, checks: [...(base.checks || []), { id, label: "확인함", on: false }] }; });
  const updateCheck = (id, patch) => setBlocks(prev => { const base = ensureBlocks(prev); return { ...base, checks: (base.checks || []).map(t => t.id === id ? { ...t, ...patch } : t) }; });
  const removeCheck = (id) => setBlocks(prev => { const base = ensureBlocks(prev); const pos = { ...base.pos }; delete pos[id]; return { ...base, pos, checks: (base.checks || []).filter(t => t.id !== id) }; });
  useEffect(() => {
    if (!info) return;
    const fn = (e) => { if (e.key === "Escape") { e.stopImmediatePropagation(); e.preventDefault(); onClose(); } };
    window.addEventListener("keydown", fn, true);
    return () => window.removeEventListener("keydown", fn, true);
  }, [info, onClose]);
  if (!info) return null;
  const partner = info.partner;
  const mp = PARTNER_MASTER.find(p => p.name === partner);
  const list = rows.filter(s => !s.deleted && s.partner === partner).slice().sort((a, b) => a.date < b.date ? -1 : 1);
  const led = partnerLedger(partner, rows, payments);
  const entries = led.entries;
  const run = led.bal;
  const buyTotal = led.sale;
  const period = list.length ? list[0].date + " ~ " + list[list.length - 1].date : TODAY;
  const LD_FIELDS = { partner: "거래처명", code: "거래처코드", ceo: "대표자", phone: "전화번호", region: "주소", period: "거래기간", today: "발행일", buyTotal: "매출 합계", paid: "수금액", prev: "전일잔액", bal: "잔액", count: "거래 건수", item1: "첫 품목", items: "품목 요약" };
  const dataFieldVal = (k) => k === "partner" ? partner : k === "code" ? (mp ? mp.code : "") : k === "ceo" ? (mp ? mp.ceo : "") : k === "phone" ? (mp ? mp.phone : "") : k === "region" ? (mp ? mp.region : "") : k === "period" ? period : k === "today" ? TODAY : k === "buyTotal" ? fmt(buyTotal) : k === "paid" ? fmt(info.paid || 0) : k === "prev" ? fmt(info.prev || 0) : k === "bal" ? fmt(run) : k === "count" ? String(list.length) + "건" : k === "item1" ? ((list[0] && list[0].lines && list[0].lines[0]) ? list[0].lines[0].name : "") : k === "items" ? entries.filter(e2 => e2.kind !== "수금").map(e2 => e2.summary).join(", ") : "";
  const cellVal = (c, e2) => {
    if (c.isCustom) { if (c.def && c.def.type === "text" && c.def.text && c.def.text[0] === "@") return dataFieldVal(c.def.text.slice(1)); return calcFlatCol(c.def, e2, LEDGER_COLS) || ""; }
    switch (c.key) {
      case "date": return e2.date;
      case "summary": return e2.summary;
      case "inAmt": return e2.kind !== "수금" ? fmt(e2.amount) : "";
      case "outAmt": return e2.kind === "수금" ? fmt(e2.amount) : "";
      case "bal": return fmt(e2.bal);
      case "memo": return e2.memo || "";
      default: return e2[c.key] != null ? String(e2[c.key]) : "";
    }
  };
  const carryVal = (c, i) => c.key === "date" ? "이월" : c.key === "summary" ? "전기이월" : c.key === "bal" ? fmt(info.prev || 0) : "";
  const footVal = (c, i) => i === 0 ? "합  계" : c.key === "inAmt" ? fmt(buyTotal) : c.key === "outAmt" ? fmt(info.paid || 0) : c.key === "bal" ? fmt(run) : "";
  const alignCls = (c) => c.kind === "money" ? "r" : c.kind === "date" ? "c" : c.key === "memo" ? "c sub" : "";
  const seedBlocks = () => {
    const partyRows = [["상호", "@partner", "거래처코드", "@code"], ["대표자", "@ceo", "전화번호", "@phone"], ["주소", "@region", "거래기간", "@period"]];
    const ex = extraFields.map(k => panelFieldValue(k, { partner: mp }));
    for (let i = 0; i < ex.length; i += 2) partyRows.push([ex[i].label, ex[i].value || "", ex[i + 1] ? ex[i + 1].label : "", ex[i + 1] ? (ex[i + 1].value || "") : ""]);
    const txBottom = 224 + (entries.length + 5) * 28;
    return {
      pos: { stitle: { x: 0, y: 16, w: 728 }, smeta: { x: 0, y: 62, w: 728 }, sparty: { x: 0, y: 96, w: 728 }, stx: { x: 0, y: 224, w: 728 }, snote: { x: 0, y: txBottom + 24, w: 728 }, sissuer: { x: 0, y: txBottom + 60, w: 728 } },
      texts: [{ id: "stitle", text: "거 래 처 원 장" }, { id: "smeta", text: "거래기간 : " + period + "    발행일 : " + TODAY }, { id: "snote", text: "위와 같이 거래 내역을 알려드립니다." }, { id: "sissuer", text: "nonamed · 서울특별시 중구 · 전화 1588-0000   (인)" }],
      tables: [{ id: "sparty", cells: partyRows, colW: [90, 250, 90, 250] }],
      txtables: [{ id: "stx" }],
      fmt: { stitle: { align: "center", bold: true, size: 24 }, smeta: { align: "center", size: 12, color: "#68738a" }, snote: { size: 12 }, sissuer: { align: "center", size: 11, color: "#68738a" } },
      seeded: true
    };
  };
  const renderLdBlock = (id) => {
    switch (id) {
      case "title": return <div><div className="ld-title">거 래 처 원 장</div></div>;
      case "meta": return <div className="ld-meta"><span>거래기간 : {period}</span><span>발행일 : {TODAY}</span></div>;
      case "party": return (
        <table className="ld-party"><tbody>
          <tr><td className="k">상호</td><td><b>{partner}</b></td><td className="k">거래처코드</td><td>{mp ? mp.code : ""}</td></tr>
          <tr><td className="k">대표자</td><td>{mp ? mp.ceo : ""}</td><td className="k">전화번호</td><td>{mp ? mp.phone : ""}</td></tr>
          <tr><td className="k">주소</td><td colSpan={3}>{mp ? mp.region : ""}</td></tr>
          {(() => { const ex = extraFields.map(k => ({ key: k, ...panelFieldValue(k, { partner: mp }) })); const prs = []; for (let i = 0; i < ex.length; i += 2) prs.push(ex.slice(i, i + 2)); return prs.map((pr, ri) => (
            <tr key={"x" + ri}>{pr.map(f => (<React.Fragment key={f.key}><td className="k">{f.label}</td><td>{f.value || "—"}</td></React.Fragment>))}{pr.length === 1 ? <React.Fragment><td className="k"></td><td></td></React.Fragment> : null}</tr>
          )); })()}
        </tbody></table>
      );
      case "items": return (
        <table className="ld-items">
          <thead><tr>{cc.visibleCols.map(c => <th key={c.key} draggable={layoutMode} style={{ width: parseInt(c.width) || undefined, cursor: layoutMode ? "grab" : undefined }} onMouseDown={layoutMode ? (e) => e.stopPropagation() : undefined} onDragStart={layoutMode ? (e) => { e.stopPropagation(); dragKey.current = c.key; } : undefined} onDragOver={layoutMode ? (e) => e.preventDefault() : undefined} onDrop={layoutMode ? (e) => { e.preventDefault(); e.stopPropagation(); if (dragKey.current && dragKey.current !== c.key) cc.moveCol(dragKey.current, c.key); dragKey.current = null; } : undefined} onContextMenu={layoutMode ? (e) => { e.preventDefault(); e.stopPropagation(); const card = e.currentTarget.closest(".ledgdoc"); const cr = card.getBoundingClientRect(); const b = e.currentTarget.getBoundingClientRect(); setThLink(false); setThMenu({ key: c.key, x: b.left - cr.left + b.width / 2, y: b.bottom - cr.top + 4 }); } : undefined}>{c.label}</th>)}</tr></thead>
          <tbody>
            <tr className="ld-carry">{cc.visibleCols.map(c => <td key={c.key} className={alignCls(c)}>{carryVal(c)}</td>)}</tr>
            {entries.map((e2, ri) => <tr key={ri}>{cc.visibleCols.map(c => <td key={c.key} className={alignCls(c)}>{cellVal(c, e2)}</td>)}</tr>)}
          </tbody>
          <tfoot><tr>{cc.visibleCols.map((c, i) => <td key={c.key} className={i === 0 ? "c" : alignCls(c)}>{footVal(c, i)}</td>)}</tr></tfoot>
        </table>
      );
      case "note": return <div className="ld-note">위와 같이 거래 내역을 알려드립니다.</div>;
      case "issuer": return <div className="ld-issuer">nonamed &nbsp;·&nbsp; 서울특별시 중구 &nbsp;·&nbsp; 전화 1588-0000 &nbsp;&nbsp;(인)</div>;
      default: return null;
    }
  };
  const openColPop = (e, col) => { const cell = e.currentTarget; const card = cell.closest(".ledgdoc"); const cr = card ? card.getBoundingClientRect() : { left: 0, top: 0 }; const b = cell.getBoundingClientRect(); setColPop({ key: col.key, x: b.left - cr.left + b.width / 2, y: b.bottom - cr.top + 4 }); };
  const startResize = (e, col) => { e.preventDefault(); e.stopPropagation(); const sx = e.clientX; const sw = parseInt(col.width) || 100; const move = (ev) => cc.setWidth(col.key, Math.max(56, sw + ev.clientX - sx)); const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); }; window.addEventListener("mousemove", move); window.addEventListener("mouseup", up); };
  const printDoc = () => {
    const cols = cc.visibleCols;
    const thead = cols.map(c => `<th${parseInt(c.width) ? ` style="width:${parseInt(c.width)}px"` : ""}>${c.label}</th>`).join("");
    const carry = cols.map((c) => `<td class="${alignCls(c)}">${carryVal(c)}</td>`).join("");
    const body = entries.map(e2 => `<tr>${cols.map(c => `<td class="${alignCls(c)}">${cellVal(c, e2)}</td>`).join("")}</tr>`).join("");
    const foot = cols.map((c, i) => `<td class="${i === 0 ? "c" : alignCls(c)}">${footVal(c, i)}</td>`).join("");
    let exRowsHtml = "";
    { const exArr = extraFields.map(k => panelFieldValue(k, { partner: mp })); for (let i = 0; i < exArr.length; i += 2) { const a2 = exArr[i], b2 = exArr[i + 1]; exRowsHtml += '<tr><td class="k">' + a2.label + '</td><td>' + (a2.value || "") + '</td>' + (b2 ? '<td class="k">' + b2.label + '</td><td>' + (b2.value || "") + '</td>' : '<td class="k"></td><td></td>') + '</tr>'; } }
    const html = `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><title>${partner} 거래처원장</title>
<style>
body{ font-family:"IBM Plex Sans KR","Malgun Gothic",sans-serif; color:#1b2437; margin:32px; }
.doc{ max-width:760px; margin:0 auto; }
.tt{ text-align:center; font-size:26px; font-weight:800; letter-spacing:14px; padding:6px 0 2px; }
.tt-u{ border-bottom:3px double #2c4a7c; margin-bottom:14px; }
.meta{ display:flex; justify-content:space-between; font-size:12px; margin:8px 0; }
table{ width:100%; border-collapse:collapse; font-size:12.5px; }
.party td{ border:1px solid #2c4a7c; padding:5px 8px; }
.party .k{ background:#eef2f9; text-align:center; width:84px; font-weight:600; }
.items{ margin-top:12px; }
.items th{ border:1px solid #2c4a7c; background:#eef2f9; padding:6px 8px; font-weight:700; }
.items td{ border:1px solid #2c4a7c; padding:6px 8px; }
.c{ text-align:center; } .r{ text-align:right; font-variant-numeric:tabular-nums; } .sub{ color:#68738a; }
.carry td{ background:#f7f9fc; font-weight:600; }
tfoot td{ background:#eef2f9; font-weight:700; }
.foot-note{ margin-top:18px; text-align:center; font-size:13px; }
.issuer{ margin-top:14px; text-align:right; font-size:13px; }
@media print{ body{ margin:12mm; } }
</style></head><body><div class="doc">
<div class="tt">거 래 처 원 장</div><div class="tt-u"></div>
<div class="meta"><span>거래기간 : ${period}</span><span>발행일 : ${TODAY}</span></div>
<table class="party">
<tr><td class="k">상호</td><td><b>${partner}</b></td><td class="k">거래처코드</td><td>${mp ? mp.code : ""}</td></tr>
<tr><td class="k">대표자</td><td>${mp ? mp.ceo : ""}</td><td class="k">전화번호</td><td>${mp ? mp.phone : ""}</td></tr>
<tr><td class="k">주소</td><td colspan="3">${mp ? mp.region : ""}</td></tr>${exRowsHtml}
</table>
<table class="items">
<thead><tr>${thead}</tr></thead>
<tbody><tr class="carry">${carry}</tr>${body}</tbody>
<tfoot><tr>${foot}</tr></tfoot>
</table>
<div class="foot-note">위와 같이 거래 내역을 알려드립니다.</div>
<div class="issuer">nonamed &nbsp;·&nbsp; 서울특별시 중구 &nbsp;·&nbsp; 전화 1588-0000 &nbsp;&nbsp;(인)</div>
</div><script>window.onload = function(){ window.print(); };</script></body></html>`;
    let outHtml = html;
    if (blocks) {
      const partyHtml = '<table class="party"><tr><td class="k">상호</td><td><b>' + partner + '</b></td><td class="k">거래처코드</td><td>' + (mp ? mp.code : "") + '</td></tr><tr><td class="k">대표자</td><td>' + (mp ? mp.ceo : "") + '</td><td class="k">전화번호</td><td>' + (mp ? mp.phone : "") + '</td></tr><tr><td class="k">주소</td><td colspan="3">' + (mp ? mp.region : "") + '</td></tr>' + exRowsHtml + '</table>';
      const itemsHtml = '<table class="items"><thead><tr>' + thead + '</tr></thead><tbody><tr class="carry">' + carry + '</tr>' + body + '</tbody><tfoot><tr>' + foot + '</tr></tfoot></table>';
      const inner = {
        title: '<div class="tt">거 래 처 원 장</div><div class="tt-u"></div>',
        meta: '<div class="meta"><span>거래기간 : ' + period + '</span><span>발행일 : ' + TODAY + '</span></div>',
        party: partyHtml, items: itemsHtml,
        note: '<div class="foot-note">위와 같이 거래 내역을 알려드립니다.</div>',
        issuer: '<div class="issuer">nonamed &nbsp;·&nbsp; 서울특별시 중구 &nbsp;·&nbsp; 전화 1588-0000 &nbsp;&nbsp;(인)</div>',
      };
      const wrapB = (id, innerHtml, dp) => { const p = layPos(id, dp); if (p.hidden || !innerHtml) return ""; const f = (blocks.fmt && blocks.fmt[id]) || {}; let st = ""; if (f.font) st += "font-family:" + f.font + ";"; if (f.size) st += "font-size:" + f.size + "px;"; if (f.bold) st += "font-weight:700;"; if (f.italic) st += "font-style:italic;"; const deco = (f.underline ? "underline " : "") + (f.strike ? "line-through" : ""); if (deco.trim()) st += "text-decoration:" + deco.trim() + ";"; if (f.color) st += "color:" + f.color + ";"; if (f.align) st += "text-align:" + f.align + ";"; if (f.lh) st += "line-height:" + f.lh + ";"; if (f.hl) st += "background:" + f.hl + ";"; if (f.indent) st += "padding-left:" + (f.indent * 16) + "px;"; return '<div class="blk' + (f.size ? " has-size" : "") + '" style="position:absolute; left:' + p.x + 'px; top:' + p.y + 'px; width:' + p.w + 'px;' + st + '">' + innerHtml + '</div>'; };
      let blocksHtml = ["title", "meta", "party", "items", "note", "issuer"].map(id => wrapB(id, inner[id], DEF_POS[id])).join("");
      blocksHtml += ((blocks.texts) || []).map(t => wrapB(t.id, '<div style="font-size:13px; white-space:pre-wrap;">' + (t.text || "") + '</div>')).join("");
      blocksHtml += ((blocks.tables) || []).map(t => wrapB(t.id, '<table style="width:100%; border-collapse:collapse; table-layout:fixed;">' + (t.colW ? '<colgroup>' + t.cells[0].map((_, ci) => '<col' + (t.colW[ci] ? ' style="width:' + t.colW[ci] + 'px"' : '') + '>').join("") + '</colgroup>' : '') + t.cells.map(row => '<tr>' + row.map(cv => '<td style="border:1px solid #2c4a7c; padding:4px 6px; font-size:12px;">' + ((cv && cv[0] === "@" ? dataFieldVal(cv.slice(1)) : cv) || "&nbsp;") + '</td>').join("") + '</tr>').join("") + '</table>')).join("");
      blocksHtml += ((blocks.images) || []).map(im => wrapB(im.id, '<img src="' + im.src + '" style="width:100%; display:block;" />')).join("");
      blocksHtml += ((blocks.datas) || []).map(d => wrapB(d.id, '<span style="color:#68738a; font-size:11px;">' + (LD_FIELDS[d.key] || d.key) + '</span> <b>' + dataFieldVal(d.key) + '</b>')).join("");
      blocksHtml += ((blocks.dtables) || []).map(dt => wrapB(dt.id, '<table style="width:100%; border-collapse:collapse;">' + dt.keys.map(k => '<tr><td style="border:1px solid #2c4a7c; padding:4px 6px; font-size:11.5px; background:#eef2f9; width:40%;">' + (LD_FIELDS[k] || k) + '</td><td style="border:1px solid #2c4a7c; padding:4px 6px; font-size:12px;">' + dataFieldVal(k) + '</td></tr>').join("") + '</table>')).join("");
      blocksHtml += ((blocks.txtables) || []).map(tt => { const buyLbl = ((LEDGER_COLS.find(c => c.key === "inAmt") || {}).label || "매출액").replace(/액$/, ""); const td = (v, st) => '<td style="border:1px solid #2c4a7c; padding:4px 6px; font-size:11.5px;' + (st || '') + '">' + (v || '') + '</td>'; const hd = ["일자", "품목명 (요약)", "수량", "단가", buyLbl, "수금액"].map(h => '<td style="border:1px solid #2c4a7c; padding:4px 6px; font-size:11px; background:#eef2f9; text-align:center; font-weight:600;">' + h + '</td>').join(""); const rws = entries.map(e2 => { const qty = e2.sale && e2.sale.lines ? fmt(e2.sale.lines.reduce((a, l) => a + (Number(l.qty) || 0), 0)) : ""; const pr = e2.sale && e2.sale.lines && e2.sale.lines[0] ? fmt(e2.sale.lines[0].price) : ""; return '<tr>' + td(e2.date, 'text-align:center;') + td(e2.summary) + td(qty, 'text-align:right;') + td(pr, 'text-align:right;') + td(e2.kind !== "수금" ? fmt(e2.amount) : "", 'text-align:right;') + td(e2.kind === "수금" ? fmt(e2.amount) : "", 'text-align:right;') + '</tr>'; }).join(""); const carry = '<tr>' + td("", 'text-align:center;') + td("전기이월") + td("") + td("") + td("") + td(fmt(info.prev || 0), 'text-align:right;') + '</tr>'; const foot = '<tr>' + td("") + td('<b>합  계</b>') + td("") + td("") + td('<b>' + fmt(buyTotal) + '</b>', 'text-align:right;') + td('<b>' + fmt(info.paid || 0) + '</b>', 'text-align:right;') + '</tr>'; return wrapB(tt.id, '<table style="width:100%; border-collapse:collapse;"><tr>' + hd + '</tr>' + carry + rws + foot + '</table>'); }).join("");
      blocksHtml += ((blocks.checks) || []).map(ck => wrapB(ck.id, '<span style="font-size:13px;">' + (ck.on ? "☑" : "☐") + " " + (ck.label || "") + '</span>')).join("");
      const hi = html.indexOf('<div class="doc">');
      if (hi >= 0) outHtml = html.slice(0, hi) + '<style>.blk.has-size table{font-size:inherit}.blk.has-size .tt{font-size:inherit;letter-spacing:8px}</style>' + '<div class="doc" style="position:relative; min-height:1080px;">' + blocksHtml + '</div>' + '<' + 'script>window.onload = function(){ window.print(); };<' + '/script></body></html>';
    }
    const w = window.open("", "_blank");
    if (w) { w.document.write(outHtml); w.document.close(); }
  };
  return (
    <div className="modal-root" role="dialog" aria-modal="true" style={{ zIndex: 90 }}>
      <div className="modal-scrim" onClick={onClose} />
      <div className="modal modal-newitem" style={{ width: "min(840px, 96vw)", maxWidth: "none" }}>
        <header className="modal-head" style={{ paddingBottom: 8 }}>
          <div>
            <h2 className="modal-title">거래처 원장</h2>
            <div className="modal-sub">업체 전달용 문서 · 인쇄하거나 PDF로 저장할 수 있어요</div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {layoutMode ? <ViewPresetMenu views={cc.views} activeCode={cc.activeView} enabled={layoutMode} onApply={applyViewFull} onSaveNew={() => setSaveOpen(true)} onOverwrite={(c) => setOwCode(c)} onRename={(c) => setRenameCode(c)} onDelete={(c) => setDelCode(c)} /> : null}
            <button type="button" className={`btn-ghost btn-sm ${layoutMode ? "is-on-cfg" : ""}`} onClick={() => { if (layoutMode) setLdDonePrompt(true); else { setLayoutMode(true); setBlocks(prev => (prev && prev.pos) ? prev : seedBlocks()); setSelId(null); } }}>{I.cog} {layoutMode ? "설정 완료" : "화면 설정"}</button>
            <button type="button" className="btn-ghost btn-sm" onClick={printDoc}>{I.print} 인쇄</button>
            <button type="button" className="modal-close" onClick={onClose}>{I.close}</button>
          </div>
        </header>
        <div className="ledger-body">
          {(layoutMode || blocks) ? (
            <div className="ld-a4wrap">
              {layoutMode ? (
                <div className="ld-a4bar">
                  <button type="button" className="btn-ghost btn-sm" onClick={addTextBox}>＋ 텍스트 상자</button>
                  <button type="button" className="btn-ghost btn-sm" onClick={() => setBlocks(seedBlocks())}>기본 양식으로</button>
                  <span className="ld-a4hint">블록을 드래그해 자유롭게 배치 · 오른쪽 가장자리로 너비 조절 · 인쇄에 그대로 반영</span>
                </div>
              ) : null}
              {layoutMode ? (
                <div className="ld-ribbon">
                  <div className="ld-rb-group">
                    <div className="ld-rb-row">
                      <select className="ld-rb-size" disabled={!selId} value={fmtOf(selId).font || ""} onChange={(e) => setFmt(selId, { font: e.target.value || undefined })}>
                        <option value="">글꼴</option>
                        <option value='"IBM Plex Sans KR", sans-serif'>기본 고딕</option>
                        <option value='"Malgun Gothic", sans-serif'>맑은 고딕</option>
                        <option value='Batang, "Noto Serif KR", serif'>바탕 (명조)</option>
                        <option value='Gulim, sans-serif'>굴림</option>
                        <option value='"JetBrains Mono", monospace'>모노 (숫자)</option>
                      </select>
                      <select className="ld-rb-size" disabled={!selId} value={fmtOf(selId).size || ""} onChange={(e) => setFmt(selId, { size: e.target.value ? parseInt(e.target.value, 10) : undefined })}>
                        <option value="">크기</option>
                        {[10, 11, 12, 13, 14, 16, 18, 20, 24, 28, 32].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                      <button type="button" className="ld-rb-btn" disabled={!selId} title="글자 크게" onClick={() => setFmt(selId, { size: Math.min(48, (fmtOf(selId).size || 13) + 1) })}>가⁺</button>
                      <button type="button" className="ld-rb-btn" disabled={!selId} title="글자 작게" onClick={() => setFmt(selId, { size: Math.max(8, (fmtOf(selId).size || 13) - 1) })}>가⁻</button>
                    </div>
                    <div className="ld-rb-row">
                      <button type="button" className={`ld-rb-btn ${fmtOf(selId).bold ? "is-on" : ""}`} disabled={!selId} style={{ fontWeight: 800 }} title="굵게" onClick={() => setFmt(selId, { bold: !fmtOf(selId).bold })}>가</button>
                      <button type="button" className={`ld-rb-btn ${fmtOf(selId).italic ? "is-on" : ""}`} disabled={!selId} style={{ fontStyle: "italic" }} title="기울임" onClick={() => setFmt(selId, { italic: !fmtOf(selId).italic })}>가</button>
                      <button type="button" className={`ld-rb-btn ${fmtOf(selId).underline ? "is-on" : ""}`} disabled={!selId} style={{ textDecoration: "underline" }} title="밑줄" onClick={() => setFmt(selId, { underline: !fmtOf(selId).underline })}>가</button>
                      <button type="button" className={`ld-rb-btn ${fmtOf(selId).strike ? "is-on" : ""}`} disabled={!selId} style={{ textDecoration: "line-through" }} title="취소선" onClick={() => setFmt(selId, { strike: !fmtOf(selId).strike })}>가</button>
                      <span className="ld-rb-div" />
                      {["#1b2437", "#B03030", "#1F6E43", "#2C4A7C", "#B77300"].map(cl => (
                        <button key={cl} type="button" className={`ld-rb-sw ${fmtOf(selId).color === cl ? "is-on" : ""}`} disabled={!selId} style={{ background: cl }} onClick={() => setFmt(selId, { color: fmtOf(selId).color === cl ? undefined : cl })} title="글자색" />
                      ))}
                      <span className="ld-rb-div" />
                      {["#FFF3A6", "#D7F2D9", "#E3EBFA"].map(cl => (
                        <button key={cl} type="button" className={`ld-rb-sw ld-rb-hl ${fmtOf(selId).hl === cl ? "is-on" : ""}`} disabled={!selId} style={{ background: cl }} onClick={() => setFmt(selId, { hl: fmtOf(selId).hl === cl ? undefined : cl })} title="형광펜(배경)">가</button>
                      ))}
                    </div>
                    <div className="ld-rb-lbl">글꼴</div>
                  </div>
                  <div className="ld-rb-group">
                    <div className="ld-rb-row">
                      {[["left", "왼쪽"], ["center", "가운데"], ["right", "오른쪽"], ["justify", "양쪽"]].map(([al, lb]) => (
                        <button key={al} type="button" className={`ld-rb-btn ${fmtOf(selId).align === al ? "is-on" : ""}`} disabled={!selId} onClick={() => setFmt(selId, { align: fmtOf(selId).align === al ? undefined : al })}>{lb}</button>
                      ))}
                    </div>
                    <div className="ld-rb-row">
                      <button type="button" className="ld-rb-btn" disabled={!selId} title="내어쓰기" onClick={() => setFmt(selId, { indent: Math.max(0, (fmtOf(selId).indent || 0) - 1) || undefined })}>⇤</button>
                      <button type="button" className="ld-rb-btn" disabled={!selId} title="들여쓰기" onClick={() => setFmt(selId, { indent: Math.min(8, (fmtOf(selId).indent || 0) + 1) })}>⇥</button>
                      <select className="ld-rb-size" disabled={!selId} value={fmtOf(selId).lh || ""} onChange={(e) => setFmt(selId, { lh: e.target.value || undefined })} title="줄 간격">
                        <option value="">줄간격</option>
                        {["1", "1.25", "1.5", "1.75", "2"].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div className="ld-rb-lbl">단락</div>
                  </div>
                  <div className="ld-rb-group">
                    <div className="ld-rb-row">
                      <button type="button" className="ld-rb-btn" onClick={addTable}>▦ 표</button>
                      <button type="button" className="ld-rb-btn" onClick={() => imgInputRef.current && imgInputRef.current.click()}>🖼 그림</button>
                      <input ref={imgInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) addImage(f); e.target.value = ""; }} />
                      <select className="ld-rb-size" title="본문에 데이터 항목 추가" value="" onChange={(e) => { if (e.target.value) addDataField(e.target.value); e.target.value = ""; }}>
                        <option value="">＋ 데이터</option>
                        {Object.keys(LD_FIELDS).map(k => <option key={k} value={k}>{LD_FIELDS[k]}</option>)}
                      </select>
                      <button type="button" className="ld-rb-btn" title="선택한 데이터 항목들을 독립된 표로 추가" onClick={addDataTable}>▦ 데이터 표</button>
                      <button type="button" className="ld-rb-btn" title="체크박스 추가" onClick={addCheck}>☑ 체크박스</button>
                    </div>
                    <div className="ld-rb-row">
                      <button type="button" className="ld-rb-btn" disabled={!selId} title="서식 지우기" onClick={() => setBlocks(prev => { const base = ensureBlocks(prev); const fmt = { ...(base.fmt || {}) }; delete fmt[selId]; return { ...base, fmt }; })}>서식 지우기</button>
                    </div>
                    <div className="ld-rb-lbl">삽입 · 지우기</div>
                  </div>
                  <span className="ld-a4hint">{selId ? "선택된 블록에 서식이 적용됩니다" : "블록을 클릭해 선택하세요"}</span>
                </div>
              ) : null}
              <div className={`ledgdoc ld-a4 ${layoutMode ? "is-edit" : ""}`} onMouseDown={(e) => { if (e.target === e.currentTarget) { setSelId(null); setCellSel(null); } }}>
                {!(blocks && blocks.seeded) && ["title", "meta", "party", "items", "note", "issuer"].map(id => { const p = layPos(id, DEF_POS[id]); if (p.hidden) return null; return (
                  <div key={id} className={`ld-block ${layoutMode && selId === id ? "is-sel" : ""} ${fmtOf(id).size ? "has-size" : ""}`} style={{ left: p.x, top: p.y, width: p.w, ...blockStyle(id) }} onMouseDown={layoutMode ? (e) => { setSelId(id); startBlockDrag(e, id, DEF_POS[id]); } : undefined}>
                    {renderLdBlock(id)}
                    {layoutMode ? <React.Fragment><span className="lb-resize" onMouseDown={(e) => startBlockResize(e, id, DEF_POS[id])} /><button type="button" className="lb-hide" onClick={(e) => { e.stopPropagation(); hideBlock(id); }}>숨김</button></React.Fragment> : null}
                  </div>
                ); })}
                {((blocks && blocks.texts) || []).map(t => { const p = layPos(t.id); if (p.hidden) return null; return (
                  <div key={t.id} className={`ld-block ld-textbox ${layoutMode && selId === t.id ? "is-sel" : ""} ${fmtOf(t.id).size ? "has-size" : ""}`} style={{ left: p.x, top: p.y, width: p.w, ...blockStyle(t.id) }} onMouseDown={layoutMode ? (e) => { setSelId(t.id); startBlockDrag(e, t.id); } : undefined}>
                    {layoutMode ? <textarea value={t.text} onChange={(e) => updateText(t.id, e.target.value)} onMouseDown={(e) => e.stopPropagation()} /> : <div className="ld-textview">{t.text}</div>}
                    {layoutMode ? <React.Fragment><span className="lb-resize" onMouseDown={(e) => startBlockResize(e, t.id)} /><button type="button" className="lb-hide" onClick={(e) => { e.stopPropagation(); removeText(t.id); }}>삭제</button></React.Fragment> : null}
                  </div>
                ); })}
                {((blocks && blocks.tables) || []).map(t => { const p = layPos(t.id); if (p.hidden) return null; return (
                  <div key={t.id} className={`ld-block ld-tbblock ${layoutMode && selId === t.id ? "is-sel" : ""} ${fmtOf(t.id).size ? "has-size" : ""}`} style={{ left: p.x, top: p.y, width: p.w, ...blockStyle(t.id) }} onMouseDown={layoutMode ? (e) => { setSelId(t.id); startBlockDrag(e, t.id); } : undefined}>
                    <table className="ld-instb">{t.colW ? <colgroup>{t.cells[0].map((_, ci) => <col key={ci} style={t.colW[ci] ? { width: t.colW[ci] } : null} />)}</colgroup> : null}<tbody>
                      {t.cells.map((row, ri) => <tr key={ri}>{row.map((cv, ci) => <td key={ci} className={inCellSel(t.id, ri, ci) ? "is-cellsel" : undefined} style={{ position: "relative" }} onMouseEnter={layoutMode ? () => { if (cellSelecting.current && cellSel && cellSel.id === t.id) setCellSel(p => p ? { ...p, r2: ri, c2: ci } : p); } : undefined} onContextMenu={layoutMode ? (e) => { e.preventDefault(); e.stopPropagation(); const card = e.currentTarget.closest(".ledgdoc"); const cr = card.getBoundingClientRect(); setCellMenu({ id: t.id, r: ri, c: ci, x: e.clientX - cr.left, y: e.clientY - cr.top }); } : undefined}>{layoutMode ? (cv && cv[0] === "@" ? <span className="ld-cellbind" title="더블클릭하면 직접 입력으로 전환" onDoubleClick={(e) => { e.stopPropagation(); updateCell(t.id, ri, ci, String(dataFieldVal(cv.slice(1)) || "")); }} onMouseDown={(e) => { e.stopPropagation(); cellSelecting.current = true; setCellSel({ id: t.id, r1: ri, c1: ci, r2: ri, c2: ci }); }}>{dataFieldVal(cv.slice(1))}</span> : <input value={cv} onChange={(e) => updateCell(t.id, ri, ci, e.target.value)} onMouseDown={(e) => { e.stopPropagation(); cellSelecting.current = true; setCellSel({ id: t.id, r1: ri, c1: ci, r2: ri, c2: ci }); }} />) : ((cv && cv[0] === "@" ? dataFieldVal(cv.slice(1)) : cv) || "\u00A0")}{layoutMode && ri === 0 ? <span className="ld-tbrz" onMouseDown={(e) => tbColResize(e, t.id, ci, (t.colW && t.colW[ci]) || e.currentTarget.parentElement.getBoundingClientRect().width)} /> : null}</td>)}</tr>)}
                    </tbody></table>
                    {layoutMode ? <React.Fragment><span className="lb-resize" onMouseDown={(e) => startBlockResize(e, t.id)} /><button type="button" className="lb-hide" onClick={(e) => { e.stopPropagation(); removeTable(t.id); }}>삭제</button><div className="ld-tbtools"><button type="button" onMouseDown={(e) => e.stopPropagation()} onClick={() => tableAddRow(t.id)}>＋행</button><button type="button" onMouseDown={(e) => e.stopPropagation()} onClick={() => tableAddCol(t.id)}>＋열</button></div></React.Fragment> : null}
                  </div>
                ); })}
                {((blocks && blocks.images) || []).map(im => { const p = layPos(im.id); if (p.hidden) return null; return (
                  <div key={im.id} className={`ld-block ${layoutMode && selId === im.id ? "is-sel" : ""}`} style={{ left: p.x, top: p.y, width: p.w }} onMouseDown={layoutMode ? (e) => { setSelId(im.id); startBlockDrag(e, im.id); } : undefined}>
                    <img src={im.src} alt="" style={{ width: "100%", display: "block" }} draggable={false} />
                    {layoutMode ? <React.Fragment><span className="lb-resize" onMouseDown={(e) => startBlockResize(e, im.id)} /><button type="button" className="lb-hide" onClick={(e) => { e.stopPropagation(); removeImage(im.id); }}>삭제</button></React.Fragment> : null}
                  </div>
                ); })}
                {((blocks && blocks.datas) || []).map(d => { const p = layPos(d.id); if (p.hidden) return null; return (
                  <div key={d.id} className={`ld-block ld-datafld ${layoutMode && selId === d.id ? "is-sel" : ""} ${fmtOf(d.id).size ? "has-size" : ""}`} style={{ left: p.x, top: p.y, width: p.w, ...blockStyle(d.id) }} onMouseDown={layoutMode ? (e) => { setSelId(d.id); startBlockDrag(e, d.id); } : undefined}>
                    <span className="ld-df-k">{LD_FIELDS[d.key] || d.key}</span> <b className="ld-df-v">{dataFieldVal(d.key)}</b>
                    {layoutMode ? <React.Fragment><span className="lb-resize" onMouseDown={(e) => startBlockResize(e, d.id)} /><button type="button" className="lb-hide" onClick={(e) => { e.stopPropagation(); removeData(d.id); }}>삭제</button></React.Fragment> : null}
                  </div>
                ); })}
                {((blocks && blocks.txtables) || []).map(tt => { const p = layPos(tt.id); if (p.hidden) return null; const buyLbl = ((LEDGER_COLS.find(c => c.key === "inAmt") || {}).label || "매출액").replace(/액$/, ""); const cols = [{ k: "date", l: "일자", w: 80, c: "c" }, { k: "summary", l: "품목명 (요약)", w: 240 }, { k: "qty", l: "수량", w: 60, c: "r" }, { k: "price", l: "단가", w: 90, c: "r" }, { k: "buy", l: buyLbl, w: 110, c: "r" }, { k: "pay", l: "수금액", w: 110, c: "r" }]; const val = (k, e2) => k === "date" ? e2.date : k === "summary" ? e2.summary : k === "qty" ? (e2.sale && e2.sale.lines ? fmt(e2.sale.lines.reduce((a, l) => a + (Number(l.qty) || 0), 0)) : "") : k === "price" ? (e2.sale && e2.sale.lines && e2.sale.lines[0] ? fmt(e2.sale.lines[0].price) : "") : k === "buy" ? (e2.kind !== "수금" ? fmt(e2.amount) : "") : (e2.kind === "수금" ? fmt(e2.amount) : ""); return (
                  <div key={tt.id} className={`ld-block ld-txtable ${layoutMode && selId === tt.id ? "is-sel" : ""} ${fmtOf(tt.id).size ? "has-size" : ""}`} style={{ left: p.x, top: p.y, width: p.w, ...blockStyle(tt.id) }} onMouseDown={layoutMode ? (e) => { setSelId(tt.id); startBlockDrag(e, tt.id); } : undefined}>
                    <table className="ld-instb"><colgroup>{cols.map(c => <col key={c.k} style={{ width: c.w }} />)}</colgroup><tbody>
                      <tr>{cols.map(c => <td key={c.k} className="ld-txh">{c.l}</td>)}</tr>
                      <tr><td></td><td>전기이월</td><td></td><td></td><td></td><td className="ld-tx-r">{fmt(info.prev || 0)}</td></tr>
                      {entries.map((e2, i) => <tr key={i}>{cols.map(c => <td key={c.k} className={c.c === "r" ? "ld-tx-r" : c.c === "c" ? "ld-tx-c" : undefined}>{val(c.k, e2)}</td>)}</tr>)}
                      <tr><td></td><td><b>합  계</b></td><td></td><td></td><td className="ld-tx-r"><b>{fmt(buyTotal)}</b></td><td className="ld-tx-r"><b>{fmt(info.paid || 0)}</b></td></tr>
                    </tbody></table>
                    {layoutMode ? <React.Fragment><span className="lb-resize" onMouseDown={(e) => startBlockResize(e, tt.id)} /><button type="button" className="lb-hide" onClick={(e) => { e.stopPropagation(); setBlocks(prev => { const base = ensureBlocks(prev); const pos2 = { ...base.pos }; delete pos2[tt.id]; return { ...base, pos: pos2, txtables: (base.txtables || []).filter(x => x.id !== tt.id) }; }); }}>삭제</button></React.Fragment> : null}
                  </div>
                ); })}
                {((blocks && blocks.dtables) || []).map(dt => { const p = layPos(dt.id); if (p.hidden) return null; return (
                  <div key={dt.id} className={`ld-block ld-dtable ${layoutMode && selId === dt.id ? "is-sel" : ""} ${fmtOf(dt.id).size ? "has-size" : ""}`} style={{ left: p.x, top: p.y, width: p.w, ...blockStyle(dt.id) }} onMouseDown={layoutMode ? (e) => { setSelId(dt.id); startBlockDrag(e, dt.id); } : undefined}>
                    <table className="ld-instb"><tbody>
                      {dt.keys.map(k => <tr key={k}><td className="ld-dt-k">{LD_FIELDS[k] || k}{layoutMode ? <button type="button" className="ld-frm" onMouseDown={(e) => e.stopPropagation()} onClick={() => dtRemoveKey(dt.id, k)}>×</button> : null}</td><td className="ld-dt-v">{dataFieldVal(k)}</td></tr>)}
                    </tbody></table>
                    {layoutMode ? <React.Fragment>
                      <select className="ld-rb-size ld-dt-add" value="" onMouseDown={(e) => e.stopPropagation()} onChange={(e) => { if (e.target.value) dtAddKey(dt.id, e.target.value); e.target.value = ""; }}>
                        <option value="">＋ 항목 추가</option>
                        {Object.keys(LD_FIELDS).filter(k => !dt.keys.includes(k)).map(k => <option key={k} value={k}>{LD_FIELDS[k]}</option>)}
                      </select>
                      <span className="lb-resize" onMouseDown={(e) => startBlockResize(e, dt.id)} /><button type="button" className="lb-hide" onClick={(e) => { e.stopPropagation(); removeDataTable(dt.id); }}>삭제</button>
                    </React.Fragment> : null}
                  </div>
                ); })}
                {((blocks && blocks.checks) || []).map(ck => { const p = layPos(ck.id); if (p.hidden) return null; return (
                  <div key={ck.id} className={`ld-block ld-checkbl ${layoutMode && selId === ck.id ? "is-sel" : ""} ${fmtOf(ck.id).size ? "has-size" : ""}`} style={{ left: p.x, top: p.y, width: p.w, ...blockStyle(ck.id) }} onMouseDown={layoutMode ? (e) => { setSelId(ck.id); startBlockDrag(e, ck.id); } : undefined}>
                    <label className="ld-ck-row" onMouseDown={(e) => e.stopPropagation()}>
                      <input type="checkbox" checked={!!ck.on} onChange={(e) => updateCheck(ck.id, { on: e.target.checked })} />
                      {layoutMode ? <input className="ld-ck-lbl" value={ck.label} onChange={(e) => updateCheck(ck.id, { label: e.target.value })} /> : <span>{ck.label}</span>}
                    </label>
                    {layoutMode ? <React.Fragment><span className="lb-resize" onMouseDown={(e) => startBlockResize(e, ck.id)} /><button type="button" className="lb-hide" onClick={(e) => { e.stopPropagation(); removeCheck(ck.id); }}>삭제</button></React.Fragment> : null}
                  </div>
                ); })}
                {layoutMode && thMenu ? (() => { const col = cc.allCols.find(c => c.key === thMenu.key) || {}; return (
                  <React.Fragment>
                    <div className="colpop-scrim" onClick={() => setThMenu(null)} />
                    <div className="colpop ld-cellmenu" style={{ left: thMenu.x, top: thMenu.y, transform: "translateX(-50%)" }}>
                      <div className="colpop-head"><span className="colpop-sw" />{col.label}</div>
                      <button type="button" className="colpop-item" onClick={() => { window.__ccAnchorKey = thMenu.key; setAddColOpen(true); setThMenu(null); }}>＋ 항목 삽입</button>
                      <button type="button" className="colpop-item" onClick={() => setThLink(v => !v)}>🔗 항목 연결 {thLink ? "▾" : "▸"}</button>
                      {thLink ? Object.keys(LD_FIELDS).map(k => <button key={k} type="button" className="colpop-item ld-cm-sub" onClick={() => { cc.addCustom({ label: LD_FIELDS[k], type: "text", text: "@" + k }); setThMenu(null); }}>{LD_FIELDS[k]}</button>) : null}
                      <button type="button" className="colpop-item" onClick={() => { setEditCol(col.isCustom ? col.def : { key: thMenu.key, label: col.label, _base: true }); setThMenu(null); }}>설정</button>
                      {!col.locked ? <button type="button" className="colpop-item" onClick={() => { cc.toggleCol(thMenu.key); setThMenu(null); }}>{col.hidden ? "표시하기" : "숨기기"}</button> : null}
                      {col.isCustom ? <button type="button" className="colpop-item colpop-danger" onClick={() => { cc.removeCol(thMenu.key); setThMenu(null); }}>항목 삭제</button> : null}
                    </div>
                  </React.Fragment>
                ); })() : null}
                {layoutMode && cellMenu ? (
                  <React.Fragment>
                    <div className="colpop-scrim" onClick={() => setCellMenu(null)} onContextMenu={(e) => { e.preventDefault(); setCellMenu(null); }} />
                    <div className="colpop ld-cellmenu" style={{ left: cellMenu.x, top: cellMenu.y }}>
                      <div className="colpop-head"><span className="colpop-sw" />데이터 연결</div>
                      {[["거래처", ["partner", "code", "ceo", "phone", "region"]], ["품목", ["item1", "items"]], ["매출", ["buyTotal", "count", "period"]], ["수금", ["paid", "prev", "bal"]]].map(([g, keys]) => (
                        <React.Fragment key={g}>
                          <div className="ld-cm-g">{g}</div>
                          {keys.map(k => <button key={k} type="button" className="colpop-item" onClick={() => { updateCell(cellMenu.id, cellMenu.r, cellMenu.c, "@" + k); setCellMenu(null); }}>{LD_FIELDS[k] || k} <span className="ld-cm-v">{String(dataFieldVal(k)).slice(0, 14)}</span></button>)}
                        </React.Fragment>
                      ))}
                      <button type="button" className="colpop-item" onClick={() => { const cur = ((blocks.tables.find(x => x.id === cellMenu.id) || {}).cells || [[]])[cellMenu.r] && blocks.tables.find(x => x.id === cellMenu.id).cells[cellMenu.r][cellMenu.c]; updateCell(cellMenu.id, cellMenu.r, cellMenu.c, cur && cur[0] === "@" ? String(dataFieldVal(cur.slice(1)) || "") : (cur || "")); setCellMenu(null); }}>직접 입력 (텍스트·숫자)</button>
                      <button type="button" className="colpop-item colpop-danger" onClick={() => { updateCell(cellMenu.id, cellMenu.r, cellMenu.c, ""); setCellMenu(null); }}>연결 해제 / 비우기</button>
                    </div>
                  </React.Fragment>
                ) : null}
              </div>
            </div>
          ) : (
          <div className={`ledgdoc ${cc.cfg ? "is-cfg-mode" : ""}`} style={{ position: "relative" }}>
            {cc.cfg ? (
              <div className="cfg-hint" style={{ marginBottom: 10 }}>⚙ 설정 모드 — 열 제목을 누르면 추가·이름수정·숨김·삭제할 수 있어요. 드래그로 순서 변경, 오른쪽 경계 드래그로 너비 조절.
                <button type="button" className="cfg-reset" onClick={cc.resetCols}>↺ 기본값</button>
              </div>
            ) : null}
            {cc.cfg && colPop ? (() => { const pc = cc.allCols.find(c => c.key === colPop.key); return <ColCfgPopover col={pc} x={colPop.x} y={colPop.y} onAddNew={() => setAddColOpen(true)} onRename={cc.renameCol} onToggle={cc.toggleCol} onRemove={cc.removeCol} onEdit={(def) => setEditCol(def)} onClose={() => setColPop(null)} />; })() : null}
            <div className="ld-title">거 래 처 원 장</div>
            <div className="ld-meta"><span>거래기간 : {period}</span><span>발행일 : {TODAY}</span></div>
            <table className="ld-party">
              <tbody>
                <tr><td className="k">상호</td><td><b>{partner}</b></td><td className="k">거래처코드</td><td>{mp ? mp.code : ""}</td></tr>
                <tr><td className="k">대표자</td><td>{mp ? mp.ceo : ""}</td><td className="k">전화번호</td><td>{mp ? mp.phone : ""}</td></tr>
                <tr><td className="k">주소</td><td colSpan={3}>{mp ? mp.region : ""}</td></tr>
                {(() => { const ex = extraFields.map(k => ({ key: k, ...panelFieldValue(k, { partner: mp }) })); const prs = []; for (let i = 0; i < ex.length; i += 2) prs.push(ex.slice(i, i + 2)); return prs.map((pr, ri) => (
                  <tr key={"x" + ri}>{pr.map(f => (<React.Fragment key={f.key}><td className="k">{f.label}{cc.cfg ? <button type="button" className="ld-frm" title="제거" onClick={() => setExtraFields(p => p.filter(x => x !== f.key))}>×</button> : null}</td><td>{f.value || "—"}</td></React.Fragment>))}{pr.length === 1 ? <React.Fragment><td className="k"></td><td></td></React.Fragment> : null}</tr>
                )); })()}
              </tbody>
            </table>
            {cc.cfg ? <button type="button" className="rs-cfg-add" style={{ margin: "8px 0 0", width: "100%" }} onClick={() => setFieldPickOpen(true)}>＋ 항목 추가</button> : null}
            <table className="ld-items">
              <thead><tr>
                {displayCols.map(c => (
                  <th key={c.key}
                    style={parseInt(c.width) ? { width: parseInt(c.width), position: "relative" } : { position: "relative" }}
                    className={`${cc.cfg ? "th-drag is-cfg" : ""} ${cc.cfg && c.hidden ? "is-colhidden" : ""}`}
                    draggable={cc.cfg}
                    onClick={cc.cfg ? (e) => openColPop(e, c) : undefined}
                    onDragStart={() => { dragKey.current = c.key; }}
                    onDragOver={(e) => { if (cc.cfg) e.preventDefault(); }}
                    onDrop={(e) => { if (!cc.cfg) return; e.preventDefault(); cc.moveCol(dragKey.current, c.key); dragKey.current = null; }}
                  >{c.label}{cc.cfg ? <span className="th-resize" onMouseDown={(e) => startResize(e, c)} onClick={(e) => e.stopPropagation()} draggable={false} /> : null}</th>
                ))}
              </tr></thead>
              <tbody>
                <tr className="ld-carry">{displayCols.map(c => <td key={c.key} className={`${alignCls(c)} ${cc.cfg && c.hidden ? "is-colhidden" : ""}`}>{carryVal(c)}</td>)}</tr>
                {entries.map((e2, ri) => (
                  <tr key={ri} className={e2.sale && !cc.cfg ? "ld-click" : ""} onClick={() => { if (e2.sale && !cc.cfg) { onClose(); onOpen && onOpen(e2.sale); } }} title={e2.sale && !cc.cfg ? "전표 열기" : undefined}>
                    {displayCols.map(c => <td key={c.key} className={`${alignCls(c)} ${cc.cfg && c.hidden ? "is-colhidden" : ""}`}>{cellVal(c, e2)}</td>)}
                  </tr>
                ))}
              </tbody>
              <tfoot><tr>{displayCols.map((c, i) => <td key={c.key} className={`${i === 0 ? "c" : alignCls(c)} ${cc.cfg && c.hidden ? "is-colhidden" : ""}`}>{footVal(c, i)}</td>)}</tr></tfoot>
            </table>
            <div className="ld-note">위와 같이 거래 내역을 알려드립니다.</div>
            <div className="ld-issuer">nonamed &nbsp;·&nbsp; 서울특별시 중구 &nbsp;·&nbsp; 전화 1588-0000 &nbsp;&nbsp;(인)</div>
          </div>
          )}
        </div>
        <PanelFieldPicker open={fieldPickOpen} selected={extraFields} onToggle={(k) => setExtraFields(p => p.includes(k) ? p.filter(x => x !== k) : [...p, k])} onClose={() => setFieldPickOpen(false)} />
        <FlatAddColModal open={addColOpen} baseColumns={LEDGER_COLS} onAdd={(c) => { cc.addCustom(c); setAddColOpen(false); }} onClose={() => setAddColOpen(false)} />
        <FlatAddColModal open={!!editCol} initial={editCol} baseColumns={LEDGER_COLS} onAdd={(c) => { if (editCol._base) cc.renameCol(editCol.key, c.label); else cc.updateCustom(editCol.key, c); setEditCol(null); }} onClose={() => setEditCol(null)} />
        <SaveViewModal open={saveOpen} code={nextViewCode(cc.views)} onSave={(n) => { saveViewFull(n); setSaveOpen(false); }} onClose={() => setSaveOpen(false)} />
        <SaveViewModal open={!!renameCode} title="화면 이름 변경" saveLabel="변경" initialName={(cc.views.find(v => v.code === renameCode) || {}).name || ""} onSave={(n) => { cc.renameView(renameCode, n); setRenameCode(null); }} onClose={() => setRenameCode(null)} />
        <ConfirmModal open={!!owCode} title="화면 덮어쓰기"
          message={(() => { const v = cc.views.find(x => x.code === owCode); return v ? `${v.code} "${v.name}" 화면을 지금 화면 구성으로 덮어쓸까요?` : ""; })()}
          confirmLabel="덮어쓰기" onConfirm={() => { overwriteViewFull(owCode); setOwCode(null); }} onClose={() => setOwCode(null)} />
        <ConfirmModal open={!!delCode} title="화면 삭제" danger confirmLabel="삭제"
          message={(() => { const v = cc.views.find(x => x.code === delCode); return v ? `${v.code} "${v.name}" 화면을 삭제할까요? 이 작업은 되돌릴 수 없습니다.` : ""; })()}
          onConfirm={() => { cc.deleteView(delCode); setDelCode(null); }} onClose={() => setDelCode(null)} />
        <ConfirmModal open={ldDonePrompt} title="화면 설정 저장" extraLabel="현재 양식에 적용" onExtra={() => { setLdDonePrompt(false); setLayoutMode(false); const av = cc.views.find(v => v.code === cc.activeView); if (av) cc.overwriteView(av.code); }}
          message="변경한 화면 구성을 저장된 화면으로 등록할까요? 코드가 자동 부여되고 이름을 지정할 수 있어요. (등록하지 않아도 변경 내용은 유지됩니다)"
          confirmLabel="저장하고 적용" onConfirm={() => { setLdDonePrompt(false); setLayoutMode(false); setSaveOpen(true); }} onClose={() => { setLdDonePrompt(false); setLayoutMode(false); }} />
      </div>
    </div>
  );
}

function PaymentModal({ open, partners, initialPartner, onSave, onClose }) {
  const [f, setF] = useState({ partner: "", date: TODAY, amount: "", memo: "" });
  const [err, setErr] = useState("");
  useEffect(() => { if (open) { setF({ partner: initialPartner || (partners[0] || ""), date: TODAY, amount: "", memo: "" }); setErr(""); } }, [open, initialPartner]);
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } };
    window.addEventListener("keydown", h, true);
    return () => window.removeEventListener("keydown", h, true);
  }, [open, onClose]);
  if (!open) return null;
  const submit = (e) => {
    e.preventDefault();
    if (!f.partner) { setErr("거래처를 선택해 주세요."); return; }
    const amt = Number(String(f.amount).replace(/[^\d]/g, ""));
    if (!amt) { setErr("금액을 입력해 주세요."); return; }
    onSave({ date: f.date, partner: f.partner, amount: amt, memo: f.memo.trim() || "입금" });
  };
  return (
    <div className="modal-root">
      <div className="modal-scrim" onClick={onClose} />
      <form className="modal" style={{ width: "min(420px, 94vw)" }} onSubmit={submit}>
        <header className="modal-head">
          <div><h2 className="modal-title">수금 입력</h2><div className="modal-sub">수금(입금)을 등록하면 미수금 잔액·원장에 바로 반영됩니다</div></div>
          <button type="button" className="modal-close" onClick={onClose}>{I.close}</button>
        </header>
        <div style={{ padding: "18px 26px", display: "grid", gap: 12 }}>
          <label className="fld"><span className="fld-label">거래처</span>
            <select className="fld-input" value={f.partner} onChange={(e) => setF(p => ({ ...p, partner: e.target.value }))}>
              {partners.map(p => <option key={p} value={p}>{p}</option>)}
            </select></label>
          <label className="fld"><span className="fld-label">입금일자</span>
            <input type="date" className="fld-input" value={f.date} max="9999-12-31" onChange={(e) => setF(p => ({ ...p, date: e.target.value }))} /></label>
          <label className="fld"><span className="fld-label">금액</span>
            <input className="fld-input" inputMode="numeric" placeholder="0" value={f.amount ? fmt(Number(String(f.amount).replace(/[^\d]/g, "")) || 0) : ""} onChange={(e) => setF(p => ({ ...p, amount: e.target.value.replace(/[^\d]/g, "") }))} autoFocus /></label>
          <label className="fld"><span className="fld-label">메모</span>
            <input className="fld-input" value={f.memo} placeholder="입금" onChange={(e) => setF(p => ({ ...p, memo: e.target.value }))} /></label>
          {err ? <div className="entry-err">{err}</div> : null}
        </div>
        <footer className="modal-foot">
          <div className="ff-left" />
          <div className="ff-right">
            <button type="button" className="btn-ghost" onClick={onClose}>취소</button>
            <button type="submit" className="btn-primary">저장 <kbd className="btn-kbd">F8</kbd></button>
          </div>
        </footer>
      </form>
    </div>
  );
}

function PaymentListModal({ open, payments, kindLabel, onRemove, onClose }) {
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } };
    window.addEventListener("keydown", h, true);
    return () => window.removeEventListener("keydown", h, true);
  }, [open, onClose]);
  if (!open) return null;
  const list = payments.slice().sort((a, b) => a.date < b.date ? 1 : -1);
  const total = list.reduce((a, p) => a + p.amount, 0);
  return (
    <div className="modal-root">
      <div className="modal-scrim" onClick={onClose} />
      <div className="modal" style={{ width: "min(560px, 94vw)" }}>
        <header className="modal-head">
          <div><h2 className="modal-title">{kindLabel} 내역</h2><div className="modal-sub">총 {list.length}건 · {fmt(total)}원 · 직접 입력한 건만 삭제할 수 있습니다</div></div>
          <button type="button" className="modal-close" onClick={onClose}>{I.close}</button>
        </header>
        <div style={{ padding: "14px 26px 6px", maxHeight: "52vh", overflowY: "auto" }}>
          {list.length === 0 ? <div className="t-empty" style={{ padding: 20 }}>{kindLabel} 내역이 없습니다.</div> : (
            <table className="paylist-tb">
              <thead><tr><th>일자</th><th>거래처</th><th style={{ textAlign: "right" }}>금액</th><th>메모</th><th>구분</th><th></th></tr></thead>
              <tbody>
                {list.map((p, i) => (
                  <tr key={i}>
                    <td className="is-mono">{p.date}</td><td>{p.partner}</td><td className="is-mono" style={{ textAlign: "right" }}>{fmt(p.amount)}</td><td>{p.memo || ""}</td>
                    <td><span className={"paylist-src " + (p.manual ? "is-manual" : "")}>{p.manual ? "직접 입력" : "자동"}</span></td>
                    <td>{p.manual ? <button type="button" className="btn-ghost btn-sm btn-danger" onClick={() => onRemove(p)}>삭제</button> : null}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <footer className="modal-foot">
          <div className="ff-left" />
          <div className="ff-right"><button type="button" className="btn-primary" onClick={onClose}>닫기</button></div>
        </footer>
      </div>
    </div>
  );
}

function ReceivableView({ rows, onOpen, cfg, payments, onAddPayment, onRemovePayment }) {
  const [payOpen, setPayOpen] = useState(false);
  const [payListOpen, setPayListOpen] = useState(false);
  const [ledgerPartner, setLedgerPartner] = useState(null);
  const [rsel, setRsel] = useState({});
  const RCOLS = [
    { key: "partner", label: "거래처명", w: "minmax(140px,1.6fr)" },
    { key: "prev",    label: "전일잔액", w: "120px" },
    { key: "sale",    label: "매출액",   w: "120px" },
    { key: "paid",    label: "수금액",   w: "120px" },
    { key: "bal",     label: "잔액",     w: "130px" },
  ];
  const RBASE = RCOLS.map(c => ({ key: c.key, label: c.label, width: c.w, locked: c.key === "partner" }));
  const cc = useColConfig({ allColumns: RBASE, defaultVisible: RBASE.map(c => c.key), prefix: "nonamed.sales.recv" });
  useEffect(() => { cc.setCfg(!!cfg); }, [cfg]);
  const [colPop, setColPop] = useState(null);
  const [addColOpen, setAddColOpen] = useState(false);
  const [editCol, setEditCol] = useState(null);
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
  const byPartner = useMemo(() => {
    const names = [...new Set(rows.filter(s => !s.deleted).map(s => s.partner))];
    return names.map(p => partnerLedger(p, rows, payments)).sort((a, b) => b.bal - a.bal);
  }, [rows, payments]);
  const sum = byPartner.reduce((a, g) => ({
    prev: a.prev + g.prev, sale: a.sale + g.sale, paid: a.paid + g.paid, bal: a.bal + g.bal,
  }), { prev: 0, sale: 0, paid: 0, bal: 0 });
  const tmpl = "40px " + displayCols.map(c => c.width).join(" ");
  const allOn = byPartner.length > 0 && byPartner.every(g => rsel[g.partner]);

  return (
    <div className="recv">
      <div className="summary-bar">
        <div className="sm-info">
          <span className="sm-period">미수금 현황</span>
          <span className="sm-meta">거래처 <b>{byPartner.length}</b>곳 · 잔액 합계 <b className="tb-total">{fmt(sum.bal)}원</b></span>
        </div>
        <button type="button" className="btn-primary btn-sm" onClick={() => setPayOpen(true)}>{I.plus} 수금 입력</button>
        <button type="button" className="btn-ghost btn-sm" onClick={() => setPayListOpen(true)}>수금 내역</button>
      </div>
      {byPartner.length === 0 ? (
        <div className="t-empty" style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14 }}>미수금(주문 대기) 전표가 없습니다.</div>
      ) : (
        <div className="table-card" style={{ "--cols-template": tmpl, position: "relative" }}>
          <div className="t-row t-head">
            <div className="tc-check"><button type="button" className={`cbx ${allOn ? "is-on" : ""}`} aria-label="전체 선택" onClick={() => { const m = {}; if (!allOn) byPartner.forEach(g => m[g.partner] = true); setRsel(m); }}>{allOn ? I.check : null}</button></div>
            {displayCols.map((c, i) => (
              <div key={c.key} className={`tc th-drag ${c.key === "bal" ? "ck-total" : i > 0 ? "ck-price" : ""} ${cfg && c.hidden ? "is-colhidden" : ""}`}
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
          </div>
          {byPartner.map(g => (
            <div key={g.partner} className={`t-row recv-row ${rsel[g.partner] ? "is-checked" : ""}`} style={{ cursor: "pointer" }} onClick={() => setLedgerPartner(g)} title="원장 보기">
              <div className="tc-check" onClick={(e) => e.stopPropagation()}><button type="button" className={`cbx ${rsel[g.partner] ? "is-on" : ""}`} aria-label="선택" onClick={() => setRsel(p => ({ ...p, [g.partner]: !p[g.partner] }))}>{rsel[g.partner] ? I.check : null}</button></div>
              {displayCols.map((c, i) => (
                <div key={c.key} className={`tc ${c.key === "bal" ? "ck-total" : i > 0 ? "ck-price" : ""} ${cfg && c.hidden ? "is-colhidden" : ""}`}>
                  {c.key === "partner" ? <span className="ln-text ln-link">{g.partner}</span>
                  : c.isCustom ? <span className="tc-val">{calcUnifiedCustom(c.def, { 전일잔액: g.prev, 매출액: g.sale, 매출액: g.sale, 수금액: g.paid, 잔액: g.bal, 금액: g.bal }, { partner: g.partner }) || calcFlatCol(c.def, g, RBASE) || "—"}</span>
                  : c.key === "paid" ? <span className="tc-val" style={{ color: "oklch(0.42 0.12 150)" }}>{fmt(g.paid)}</span>
                  : c.key === "bal" ? <span className="tc-val total-val">{fmt(g.bal)}</span>
                  : <span className="tc-val">{fmt(g[c.key])}</span>}
                </div>
              ))}
            </div>
          ))}
          <div className="t-row t-foot" style={{ gridTemplateColumns: tmpl }}>
            <div className="tc-check"></div>
            {displayCols.map((c, i) => (
              <div key={c.key} className={`tc ${c.key === "bal" ? "ck-total" : i > 0 ? "ck-price" : ""} ${cfg && c.hidden ? "is-colhidden" : ""}`}>
                {c.key === "partner" ? <span className="foot-label">합계 ({byPartner.length}곳)</span>
                : c.isCustom ? null
                : <span className={`tc-val ${c.key === "bal" ? "total-val" : ""}`}>{fmt(sum[c.key] != null ? sum[c.key] : 0)}</span>}
              </div>
            ))}
          </div>
          {cfg && colPop ? (() => { const pc = cc.allCols.find(c => c.key === colPop.key); return <ColCfgPopover col={pc} x={colPop.x} y={colPop.y} onAddNew={() => setAddColOpen(true)} onRename={cc.renameCol} onToggle={cc.toggleCol} onRemove={cc.removeCol} onEdit={(d) => setEditCol(d)} onClose={() => setColPop(null)} />; })() : null}
        </div>
      )}
      {addColOpen ? <AddColModal nextCode={"열추가 " + String.fromCharCode(65 + cc.custom.length)} existing={cc.custom} onAdd={(c) => { cc.addCustom(c); setAddColOpen(false); }} onClose={() => setAddColOpen(false)} /> : null}
      {editCol ? <AddColModal initial={editCol} existing={cc.custom} onAdd={(c) => { if (editCol._base) cc.renameCol(editCol.key, c.label); else cc.updateCustom(editCol.key, c); setEditCol(null); }} onClose={() => setEditCol(null)} /> : null}
      <LedgerModal info={ledgerPartner} rows={rows} payments={payments} onClose={() => setLedgerPartner(null)} onOpen={onOpen} />
      <PaymentModal open={payOpen} partners={byPartner.map(g => g.partner)} initialPartner={Object.keys(rsel).find(k => rsel[k]) || ""} onSave={(p) => { onAddPayment(p); setPayOpen(false); showToast(`${p.partner} 지급 ${fmt(p.amount)}원이 반영되었습니다.`); }} onClose={() => setPayOpen(false)} />
      <PaymentListModal open={payListOpen} payments={payments} kindLabel="수금" onRemove={(p) => onRemovePayment && onRemovePayment(p)} onClose={() => setPayListOpen(false)} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   App
   ───────────────────────────────────────────── */
const VIEW_TABS = ["조회", "상세", "기간요약", "미수금"];

/* ─────────────────────────────────────────────
   저장된 화면(뷰) 프리셋 드롭다운 — 목록/입력 공용
   ───────────────────────────────────────────── */
// 전역 토스트 — React 밖에서도 호출 가능
function showToast(msg, kind) {
  let host = document.getElementById("nm-toast-host");
  if (!host) { host = document.createElement("div"); host.id = "nm-toast-host"; host.className = "toast-host"; document.body.appendChild(host); }
  const el = document.createElement("div");
  el.className = "toast " + (kind === "info" ? "toast-info" : "toast-ok");
  el.innerHTML = '<span class="toast-ic">' + (kind === "info" ? "ℹ" : "✓") + '</span><span>' + msg + '</span>';
  host.appendChild(el);
  requestAnimationFrame(() => el.classList.add("is-in"));
  setTimeout(() => { el.classList.remove("is-in"); setTimeout(() => el.remove(), 260); }, 2200);
}

// 확인 팝업 — 예/아니오
function ConfirmModal({ open, title = "확인", message, confirmLabel = "확인", danger, onConfirm, onClose }) {
  const isSave = /^저장/.test(String(confirmLabel || ""));
  useEffect(() => {
    if (!open) return;
    const fn = (e) => {
      if (e.key === "Escape") { e.stopImmediatePropagation(); e.preventDefault(); onClose(); }
      else if (e.key === "F8" && isSave) { e.stopImmediatePropagation(); e.preventDefault(); onConfirm && onConfirm(); }
    };
    window.addEventListener("keydown", fn, true);
    return () => window.removeEventListener("keydown", fn, true);
  }, [open, onClose, onConfirm, isSave]);
  if (!open) return null;
  return (
    <div className="modal-root" role="dialog" aria-modal="true" style={{ zIndex: 95 }}>
      <div className="modal-scrim" onClick={onClose} />
      <div className="modal modal-confirm">
        <div className="confirm-body">
          <h2 className="confirm-title">{title}</h2>
          <p className="confirm-msg">{message}</p>
        </div>
        <footer className="modal-foot">
          <div className="ff-left" />
          <div className="ff-right">
            <button type="button" className="btn-ghost" onClick={onClose}>취소</button>
            <button type="button" className={`btn-primary ${danger ? "btn-danger" : ""}`} onClick={onConfirm}>{confirmLabel}{isSave ? <kbd className="btn-kbd">F8</kbd> : null}</button>
          </div>
        </footer>
      </div>
    </div>
  );
}

function nextViewCode(views) {
  let n = 0;
  (views || []).forEach(v => { const m = /^V-(\d+)$/.exec(v.code || ""); if (m) n = Math.max(n, parseInt(m[1], 10)); });
  return "V-" + String(n + 1).padStart(2, "0");
}
function ViewPresetMenu({ views = [], activeCode, enabled = true, onApply, onSaveNew, onOverwrite, onRename, onDelete }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { if (!enabled) setOpen(false); }, [enabled]);
  const active = views.find(v => v.code === activeCode);
  if (!enabled) return null;
  return (
    <div className="vpm">
      <button type="button" className={`btn-ghost vpm-btn ${active ? "is-on" : ""} ${!enabled ? "is-disabled" : ""}`} disabled={!enabled} onClick={() => { if (enabled) setOpen(o => !o); }} title={enabled ? "저장된 화면" : "화면 설정을 켜면 사용할 수 있어요"}>
        <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M4 7l8-3 8 3-8 3-8-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M4 12l8 3 8-3M4 17l8 3 8-3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
        {active ? <><span className="vpm-code">{active.code}</span><span className="vpm-name">{active.name}</span></> : "저장된 화면"}
        <span className="vpm-caret">{I.chevron}</span>
      </button>
      {open ? (
        <>
          <div className="vpm-scrim" onClick={() => setOpen(false)} />
          <div className="vpm-menu">
            <div className="vpm-menu-h">저장된 화면</div>
            <div className="vpm-list">
              {views.length === 0 ? (
                <div className="vpm-empty">아직 저장된 화면이 없어요.<br/>현재 열 구성을 저장해 보세요.</div>
              ) : views.map(v => (
                <div key={v.code} className={`vpm-item ${v.code === activeCode ? "is-on" : ""}`}>
                  <button type="button" className="vpm-pick" onClick={() => { onApply(v.code); setOpen(false); }}>
                    <span className="vpm-code">{v.code}</span>
                    <span className="vpm-name">{v.name}</span>
                    {v.code === activeCode ? <span className="vpm-dot" /> : null}
                  </button>
                  <button type="button" className="vpm-mini" title="현재 화면으로 덮어쓰기" onClick={() => onOverwrite(v.code)}>덮어쓰기</button>
                  <button type="button" className="vpm-mini" title="이름 변경" onClick={() => onRename(v.code)}>이름</button>
                  <button type="button" className="vpm-mini vpm-del" title="삭제" onClick={() => onDelete(v.code)}>삭제</button>
                </div>
              ))}
            </div>
            <button type="button" className="vpm-new" onClick={() => { onSaveNew(); setOpen(false); }}>＋ 현재 화면 저장</button>
          </div>
        </>
      ) : null}
    </div>
  );
}

/* 화면(뷰) 저장·이름변경 팝업 */
function SaveViewModal({ open, title = "화면 저장", code, initialName = "", saveLabel = "저장", onSave, onClose }) {
  const [name, setName] = useState(initialName);
  const inputRef = useRef(null);
  useEffect(() => { if (open) { setName(initialName); setTimeout(() => inputRef.current?.focus(), 40); } }, [open]);
  useEffect(() => {
    if (!open) return;
    const fn = (e) => { if (e.key === "Escape") { e.stopImmediatePropagation(); e.preventDefault(); onClose(); } };
    window.addEventListener("keydown", fn, true);
    return () => window.removeEventListener("keydown", fn, true);
  }, [open, onClose]);
  if (!open) return null;
  const submit = (e) => { e.preventDefault(); if (!name.trim()) return; onSave(name.trim()); };
  return (
    <div className="modal-root" role="dialog" aria-modal="true" style={{ zIndex: 90 }}>
      <div className="modal-scrim" onClick={onClose} />
      <form className="modal modal-newitem" style={{ maxWidth: 420 }} onSubmit={submit}>
        <header className="modal-head">
          <div>
            <h2 className="modal-title">{title}</h2>
            {code ? <div className="modal-sub keep">코드 <b>{code}</b> 로 저장됩니다</div> : null}
          </div>
          <button type="button" className="modal-close" onClick={onClose}>{I.close}</button>
        </header>
        <div className="ni-body">
          <label className="fld"><span className="fld-label">화면 이름 <span className="req">*</span></span>
            <input ref={inputRef} className="fld-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 월말 정산용" /></label>
        </div>
        <footer className="modal-foot">
          <div className="ff-left" />
          <div className="ff-right">
            <button type="button" className="btn-ghost" onClick={onClose}>취소</button>
            <button type="submit" className="btn-primary">{saveLabel}</button>
          </div>
        </footer>
      </form>
    </div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const colSettings = useColumnSettings();

  // 목록(전표) 커스텀 열 + 이름 오버라이드 — 입력화면과 동일한 AddColModal 사용
  const [listCols, setListCols] = useState(() => { try { return JSON.parse(localStorage.getItem("nonamed.sales.listCols.v1")) || []; } catch (e) { return []; } });
  useEffect(() => { try { localStorage.setItem("nonamed.sales.listCols.v1", JSON.stringify(listCols)); } catch (e) {} }, [listCols]);
  const [listLabels, setListLabels] = useState(() => { try { return JSON.parse(localStorage.getItem("nonamed.sales.listLabels.v1")) || {}; } catch (e) { return {}; } });
  useEffect(() => { try { localStorage.setItem("nonamed.sales.listLabels.v1", JSON.stringify(listLabels)); } catch (e) {} }, [listLabels]);
  const [listAddColOpen, setListAddColOpen] = useState(false);
  const [listEditCol, setListEditCol] = useState(null);
  const addListCol = (col) => setListCols(prev => { const code = "열추가 " + String.fromCharCode(65 + prev.length); return [...prev, { ...col, code, key: "lx" + Date.now().toString(36), hidden: false, width: "110px" }]; });
  const removeListCol = (key) => setListCols(prev => prev.filter(c => c.key !== key));
  const updateListCol = (key, patch) => setListCols(prev => prev.map(c => c.key === key ? { ...c, ...patch } : c));
  const toggleColAny = (key) => { if (listCols.find(c => c.key === key)) setListCols(prev => prev.map(c => c.key === key ? { ...c, hidden: !c.hidden } : c)); else colSettings.toggle(key); };
  const renameColAny = (key, label) => setListLabels(prev => ({ ...prev, [key]: label }));
  const resetListCols = () => { colSettings.reset(); setListCols([]); setListLabels({}); };
  const [listWidths, setListWidths] = useState(() => { try { return JSON.parse(localStorage.getItem("nonamed.sales.colWidths.v1")) || {}; } catch (e) { return {}; } });
  useEffect(() => { try { localStorage.setItem("nonamed.sales.colWidths.v1", JSON.stringify(listWidths)); } catch (e) {} }, [listWidths]);
  // 저장된 화면(뷰) 프리셋 — 목록 (조회/상세/패널/미수금 각각 독립)
  const [view, setView] = useState(() => { const v = new URLSearchParams(window.location.search).get("tab"); return VIEW_TABS.includes(v) ? v : "조회"; });
  useNavTab("sales", view, setView);
  const VIEW_PRESET_KEYS = { "조회": "list", "상세": "detail", "기간요약": "summary", "미수금": "recv" };
  const vkey = VIEW_PRESET_KEYS[view] || "list";
  const [listViewsMap, setListViewsMap] = useState(() => { try { return JSON.parse(localStorage.getItem("nonamed.sales.listViewsByView.v1")) || {}; } catch (e) { return {}; } });
  useEffect(() => { try { localStorage.setItem("nonamed.sales.listViewsByView.v1", JSON.stringify(listViewsMap)); } catch (e) {} }, [listViewsMap]);
  const listViews = listViewsMap[vkey] || [];
  const setListViews = (updater) => setListViewsMap(m => ({ ...m, [vkey]: typeof updater === "function" ? updater(m[vkey] || []) : updater }));
  const [activeMap, setActiveMap] = useState(() => { try { return JSON.parse(localStorage.getItem("nonamed.sales.activeViewByView.v1")) || {}; } catch (e) { return {}; } });
  useEffect(() => { try { localStorage.setItem("nonamed.sales.activeViewByView.v1", JSON.stringify(activeMap)); } catch (e) {} }, [activeMap]);
  const activeListView = activeMap[vkey] || null;
  const setActiveListView = (updater) => setActiveMap(m => ({ ...m, [vkey]: typeof updater === "function" ? updater(m[vkey] || null) : updater }));
  const [listSaveOpen, setListSaveOpen] = useState(false);
  const [viewPickOpen, setViewPickOpen] = useState(false);
  const [listRenameCode, setListRenameCode] = useState(null);
  const [listOverwriteCode, setListOverwriteCode] = useState(null);
  const [listDeleteCode, setListDeleteCode] = useState(null);
  const captureListConfig = () => ({ settings: colSettings.settings.map(s => ({ ...s })), listCols: listCols.map(c => ({ ...c })), listLabels: { ...listLabels }, widths: { ...listWidths } });
  const saveNewListView = () => setListSaveOpen(true);
  const confirmSaveNewList = (name) => { const code = nextViewCode(listViews); setListViews(prev => [...prev, { code, name, config: captureListConfig() }]); setActiveListView(code); setListSaveOpen(false); showToast(code + " \"" + name + "\" \ud654\uba74\uc744 \uc800\uc7a5\ud588\uc5b4\uc694"); };
  const applyListView = (code) => { const v = listViews.find(x => x.code === code); if (!v) return; const c = v.config || {}; colSettings.replace(c.settings || []); setListCols(c.listCols || []); setListLabels(c.listLabels || {}); setListWidths(c.widths || {}); setActiveListView(code); showToast(code + " \"" + v.name + "\" 화면을 적용했어요", "info"); };
  const overwriteListView = (code) => setListOverwriteCode(code);
  const confirmOverwriteList = () => { const code = listOverwriteCode; const v = listViews.find(x => x.code === code); setListViews(prev => prev.map(x => x.code === code ? { ...x, config: captureListConfig() } : x)); setActiveListView(code); setListOverwriteCode(null); showToast(code + (v ? " \"" + v.name + "\"" : "") + " \ud654\uba74\uc744 \ud604\uc7ac \uc0c1\ud0dc\ub85c \uac31\uc2e0\ud588\uc5b4\uc694"); };
  const renameListView = (code) => setListRenameCode(code);
  const confirmRenameList = (name) => { setListViews(prev => prev.map(v => v.code === listRenameCode ? { ...v, name } : v)); setListRenameCode(null); showToast("\ud654\uba74 \uc774\ub984\uc744 \ubcc0\uacbd\ud588\uc5b4\uc694", "info"); };
  const deleteListView = (code) => setListDeleteCode(code);
  const confirmDeleteList = () => { const code = listDeleteCode; const v = listViews.find(x => x.code === code); setListViews(prev => prev.filter(x => x.code !== code)); setActiveListView(a => a === code ? null : a); setListDeleteCode(null); showToast(code + (v ? " \"" + v.name + "\"" : "") + " \ud654\uba74\uc744 \uc0ad\uc81c\ud588\uc5b4\uc694", "info"); };
  const defColMap = useMemo(() => new Map(ALL_COLUMNS.map(c => [c.key, c])), []);
  const allListCols = useMemo(() => {
    const base = colSettings.settings.map(s => {
      const d = defColMap.get(s.key); if (!d) return null;
      return { ...d, hidden: !s.visible && !d.locked, label: listLabels[s.key] || d.label, isCustom: false };
    }).filter(Boolean);
    const custom = listCols.map(c => ({ key: c.key, kind: "custom", label: listLabels[c.key] || c.label, width: c.width || "110px", hidden: !!c.hidden, isCustom: true, def: c }));
    return [...base, ...custom];
  }, [colSettings.settings, listCols, listLabels, defColMap]);
  const visibleColumns = useMemo(() => allListCols.filter(c => !c.hidden), [allListCols]);

  const [salesList, setSalesList] = usePersistedList(NM_LIST_KEY.매출, SALES);
  useDocPublish("매출", salesList);
  const [manualPays, setManualPays] = useState([]);
  const cashPays = useCashPayments("매출");
  const payments = useMemo(() => [...cashPays, ...manualPays], [cashPays, manualPays]);
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get("q") || "");
  const [period, setPeriod] = useState("기본");
  const [range, setRange] = useState(() => {
    try { const v = JSON.parse(localStorage.getItem("nonamed.sales.defaultRange.v1")); if (v && (v.from || v.to)) return v; } catch (e) {}
    return { from: monthsAgo(TODAY, 3), to: TODAY };
  });
  const [appliedRange, setAppliedRange] = useState(() => {
    if (new URLSearchParams(window.location.search).get("q")) return { from: "", to: "" }; // 전표 열기 링크 → 기간 제한 없이
    try { const v = JSON.parse(localStorage.getItem("nonamed.sales.defaultRange.v1")); if (v && (v.from || v.to)) return v; } catch (e) {}
    return { from: monthsAgo(TODAY, 3), to: TODAY };
  });
  const [statusFilter, setStatusFilter] = useState("전체");
  const [statusLabels, setStatusLabels] = useState(() => { try { return JSON.parse(localStorage.getItem("sales.statusLabels") || "{}"); } catch { return {}; } });
  const [segEdit, setSegEdit] = useState(null);
  const stLabel = (k) => statusLabels[k] || k;
  const saveStLabel = (k, v) => { setStatusLabels(prev => { const next = { ...prev }; const t = (v || "").trim(); if (t && t !== k) next[k] = t; else delete next[k]; localStorage.setItem("sales.statusLabels", JSON.stringify(next)); return next; }); setSegEdit(null); };
  const [listCfg, setListCfg] = useState(false);
  const [listDonePrompt, setListDonePrompt] = useState(false);
  const listCfgSnap = useRef(null);
  const captureListCfgSnap = () => ({ settings: colSettings.settings.map(s => ({ ...s })), listCols: listCols.map(c => ({ ...c })), listLabels: { ...listLabels }, widths: { ...listWidths } });
  const enterListCfg = () => { listCfgSnap.current = captureListCfgSnap(); setListCfg(true); };
  const applyListCfg = () => { setListDonePrompt(false); setListCfg(false); setListSaveOpen(true); };
  const finishListCfg = () => { if (listCfgSnap.current && JSON.stringify(captureListCfgSnap()) === JSON.stringify(listCfgSnap.current)) { setListCfg(false); showToast("변경사항이 없어 설정을 종료했어요", "info"); } else setListDonePrompt(true); };
  const cancelListCfg = () => { setListDonePrompt(false); const s = listCfgSnap.current; if (s) { colSettings.replace(s.settings); setListCols(s.listCols.map(c => ({ ...c }))); setListLabels({ ...s.listLabels }); setListWidths({ ...s.widths }); } setListCfg(false); };
  const [searchOpen, setSearchOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [checked, setChecked] = useState(() => new Set());
  const [detailSel, setDetailSel] = useState(0);
  useEffect(() => { setChecked(new Set()); setDetailSel(0); }, [view]);
  const [entryOpen, setEntryOpen] = useState(false);
  const [printSales, setPrintSales] = useState(null);
  const [copyOpen, setCopyOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [defCfgOpen, setDefCfgOpen] = useState(false);
  const [entryInitial, setEntryInitial] = useState(null);
  const [entryCols, setEntryCols] = useState(() => {
    try { return JSON.parse(localStorage.getItem("nonamed.sales.entryCols.v1")) || []; } catch (e) { return []; }
  });
  useEffect(() => { try { localStorage.setItem("nonamed.sales.entryCols.v1", JSON.stringify(entryCols)); } catch (e) {} }, [entryCols]);
  const addEntryCol = (col) => setEntryCols(prev => {
    const code = "하단 " + String.fromCharCode(65 + prev.length); // A, B, C...
    return [...prev, { ...col, code, key: "x" + Date.now().toString(36) }];
  });
  const removeEntryCol = (key) => setEntryCols(prev => prev.filter(c => c.key !== key));
  const reorderEntryCol = (fromKey, toKey) => setEntryCols(prev => {
    const from = prev.findIndex(c => c.key === fromKey);
    const to = prev.findIndex(c => c.key === toKey);
    if (from < 0 || to < 0 || from === to) return prev;
    const next = [...prev];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    return next;
  });
  const renameEntryCol = (key, label) => setEntryCols(prev => prev.map(c => c.key === key ? { ...c, label } : c));
  const updateEntryCol = (key, patch) => setEntryCols(prev => prev.map(c => c.key === key ? { ...c, ...patch } : c));
  useEffect(() => { const fix = () => document.querySelectorAll("input:not([autocomplete])").forEach(el => el.setAttribute("autocomplete", "off")); fix(); const mo = new MutationObserver(fix); mo.observe(document.body, { childList: true, subtree: true }); return () => mo.disconnect(); }, []);
  const [kpiOpen, setKpiOpen] = useState(() => { try { return localStorage.getItem("nonamed.sales.kpiOpen.v1") !== "0"; } catch (e) { return true; } });
  useEffect(() => { try { localStorage.setItem("nonamed.sales.kpiOpen.v1", kpiOpen ? "1" : "0"); } catch (e) {} }, [kpiOpen]);
  const [mapOpen, setMapOpen] = useState(false);
  const [mappings, setMappings] = useState(() => {
    try { return JSON.parse(localStorage.getItem("nonamed.sales.itemMap.v1")) || []; } catch (e) { return []; }
  });
  useEffect(() => {
    try { localStorage.setItem("nonamed.sales.itemMap.v1", JSON.stringify(mappings)); } catch (e) {}
  }, [mappings]);

  // 거래처+품목명 → 품목코드 매핑 등록
  const addMapping = (partner, name, it) => {
    const key = (partner || "*") + "|" + name.replace(/\s/g, "");
    setMappings(prev => {
      const rest = prev.filter(m => m.key !== key);
      return [{ key, partner: partner || "", rawName: name, code: it.code, itemName: it.name, spec: it.spec, unit: it.unit || "", price: it.price, tax: it.tax }, ...rest];
    });
  };
  // 저장된 매핑 적용 (붙여넣기 파싱 결과에)
  const applyMappings = (partner, lines) => lines.map(l => {
    if (l.code) return l;
    const k1 = (partner || "*") + "|" + l.name.replace(/\s/g, "");
    const k2 = "*|" + l.name.replace(/\s/g, "");
    const hit = mappings.find(m => m.key === k1) || mappings.find(m => m.key === k2);
    return hit ? { ...l, code: hit.code, name: hit.itemName, spec: hit.spec, price: hit.price, tax: hit.tax } : l;
  });

  const onSearchPaste = (e) => {
    const items = (e.clipboardData || window.clipboardData)?.items;
    if (items) { for (const it of items) { if (it.type && it.type.startsWith("image/")) { e.preventDefault(); ocrImage(it.getAsFile()); return; } } }
    const text = (e.clipboardData || window.clipboardData)?.getData("text") || "";
    const parsed = parsePastedOrder(text);
    if (parsed && parsed.lines.length > 0) {
      e.preventDefault();
      const lines = applyMappings(parsed.partner, parsed.lines);
      setEntryInitial({ partner: parsed.partner || "", lines, focusPartner: !parsed.partner });
      setEntryOpen(true);
      setQuery("");
    }
  };

  // 사진(주문 문자 캐처·수기 전표 등) → AI 인식 → 전표 입력창
  const [ocrBusy, setOcrBusy] = useState(false);
  const ocrImage = async (file) => {
    if (!file || ocrBusy) return;
    if (!window.claude?.complete) { showToast("이미지 인식을 사용할 수 없는 환경입니다."); return; }
    setOcrBusy(true);
    showToast("이미지에서 주문 내용을 읽는 중…");
    try {
      const dataUrl = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); });
      const [meta, b64] = String(dataUrl).split(",");
      const media = (meta.match(/data:(.*?);/) || [])[1] || "image/png";
      const out = await window.claude.complete({
        max_tokens: 1000,
        messages: [{ role: "user", content: [
          { type: "image", source: { type: "base64", media_type: media, data: b64 } },
          { type: "text", text: "이 이미지는 식자재 주문 내용(문자 캐처, 수기 메모, 전표 등)입니다. 내용을 그대로 읽어서 다음 형식의 텍스트만 출력하세요(설명 금지): 첫 줄에 거래처명(있으면), 이후 한 줄에 하나씩 '품목명 수량'. 수량이 없으면 품목명만. 읽을 수 없으면 NONE만 출력." },
        ] }],
      });
      const text = (out || "").trim();
      const parsed = text && text !== "NONE" ? parsePastedOrder(text) : null;
      if (parsed && parsed.lines.length > 0) {
        const lines = applyMappings(parsed.partner, parsed.lines);
        setEntryInitial({ partner: parsed.partner || "", lines, focusPartner: !parsed.partner });
        setEntryOpen(true);
        setQuery("");
        showToast(parsed.lines.length + "개 라인을 이미지에서 불러왔습니다. 내용을 확인해 주세요.");
      } else showToast("이미지에서 주문 내용을 찾지 못했습니다.");
    } catch (err) { showToast("이미지 인식에 실패했습니다."); }
    setOcrBusy(false);
  };

  // 거래처별 단가 불러와 비어있는 품목 라인에 채움
  const resolvePartnerItems = (partner, lines) => applyMappings(partner, lines);

  // F2 → 새 매출 입력 열기 (입력칸/모달 열림 상태가 아닐 때만)
  useEffect(() => {
    const fn = (e) => {
      if (e.key === "F2" && !entryOpen) {
        e.preventDefault();
        setEntryInitial(null);
        setEntryOpen(true);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [entryOpen]);
  useEffect(() => {
    if (!searchOpen) return;
    const fn = (e) => { if (e.key === "F8") { e.preventDefault(); setAppliedRange(range); setSearchOpen(false); } };
    window.addEventListener("keydown", fn, true);
    return () => window.removeEventListener("keydown", fn, true);
  }, [searchOpen, range]);
  useHotkeys({
    F9: () => setSearchOpen(true),
    F10: () => { if (listCfg) finishListCfg(); else enterListCfg(); },
  });

  // 월별 탭은 기간 필터를 무시하고 전체 연간 집계
  const [cond, setCond] = useState({ partner: "", item: "", mgr: "" });
  const [dcond, setDcond] = useState({ partner: "", item: "", mgr: "" });
  const [dstatus, setDstatus] = useState("전체");
  const [drange, setDrange] = useState({ from: "", to: "" });
  useEffect(() => { if (searchOpen) { setDcond(cond); setDstatus(statusFilter); setDrange(range); } }, [searchOpen]);
  const filtered = useMemo(() => {
    return salesList.filter(s => {
      if (s.deleted) return false;
      if (!inPeriod(s.date, period, appliedRange)) return false;
      if (statusFilter !== "전체" && s.status !== statusFilter) return false;
      if (cond.partner && !(s.partner || "").toLowerCase().includes(cond.partner.toLowerCase())) return false;
      if (cond.mgr && !(s.mgr || "").toLowerCase().includes(cond.mgr.toLowerCase())) return false;
      if (cond.item && !s.lines.some(l => (l.name || "").toLowerCase().includes(cond.item.toLowerCase()))) return false;
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return [s.id, s.partner, s.mgr, summaryText(s.lines)].some(x => (x || "").toLowerCase().includes(q));
    });
  }, [salesList, view, period, appliedRange, statusFilter, query, cond]);

  const grandTotal = filtered.reduce((s, r) => s + r.total, 0);
  const showFilters = true;

  const downloadCSV = (name, headers, matrix) => {
    const esc = (v) => { const s = v == null ? "" : String(v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    const lines = [headers.map(esc).join(","), ...matrix.map(r => r.map(esc).join(","))];
    const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const exportExcel = () => {
    const stamp = TODAY.replace(/-/g, "");
    if (view === "상세") {
      const key = (cond.item || query).trim().toLowerCase();
      const m = [];
      filtered.forEach(s => s.lines.forEach(l => {
        if (key && !((l.name || "").toLowerCase().includes(key) || (l.code || "").toLowerCase().includes(key))) return;
        m.push([s.date, s.id, s.partner, l.name, l.spec, l.qty, l.price, l.tax, (l.qty || 0) * (l.price || 0)]);
      }));
      downloadCSV(`매출_상세_${stamp}.csv`, ["일자", "전표번호", "거래처", "품목", "규격", "수량", "단가", "세", "금액"], m);
    } else if (view === "미수금") {
      const src = salesList.filter(s => inPeriod(s.date, period, appliedRange));
      const names = [...new Set(src.filter(s => !s.deleted).map(s => s.partner))];
      const m = names.map(p => partnerLedger(p, src, payments)).sort((a, b) => b.bal - a.bal).map(g => [g.partner, g.prev, g.sale, g.paid, g.bal]);
      downloadCSV(`매출_미수금_${stamp}.csv`, ["거래처명", "전일잔액", "매출액", "수금액", "잔액"], m);
    } else {
      const m = filtered.map(s => [s.date, s.id, s.partner, summaryText(s.lines), s.supply, s.vat, s.total, s.mgr, s.status]);
      downloadCSV(`매출_조회_${stamp}.csv`, ["일자", "전표번호", "거래처", "요약", "공급가액", "부가세", "합계", "담당자", "상태"], m);
    }
  };

  const toggle = (id) => setChecked(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const toggleAll = () => {
    if (checked.size === filtered.length) setChecked(new Set());
    else setChecked(new Set(filtered.map(s => s.id)));
  };
  const allChecked = filtered.length > 0 && checked.size === filtered.length;

  const printChecked = () => {
    const sel = salesList.filter(s => checked.has(s.id));
    if (sel.length === 0) return;
    setPrintSales(sel);
  };

  const deleteChecked = async () => {
    if (checked.size === 0) return;
    if (!(await nmConfirm({ title: "선택 삭제", message: `선택한 ${checked.size}건을 삭제할까요? 삭제 후 잠시 되돌릴 수 있습니다.`, confirmLabel: "삭제", danger: true }))) return;
    setSalesList(prev => prev.map(s => checked.has(s.id) ? { ...s, deleted: true } : s));
    setChecked(new Set());
  };

  const [restoreSale, setRestoreSale] = useState(null);
  const undoDelete = () => { if (!restoreSale) return; setSalesList(prev => prev.map(s => s.id === restoreSale.id ? { ...s, deleted: false } : s)); showToast(`${restoreSale.id} 삭제를 취소했습니다.`); setRestoreSale(null); };

  const copyChecked = () => {
    if (checked.size === 0) return;
    setCopyOpen(true);
  };

  const runCopy = ({ mode, date }) => {
    const sel = salesList.filter(s => checked.has(s.id));
    if (sel.length === 0) { setCopyOpen(false); return; }
    let n = salesList.length;
    const nextId = () => { n += 1; return "S-26-" + String(1000 + n).slice(1); };
    let copies = [];
    if (mode === "merge") {
      const byP = {};
      sel.forEach(s => { (byP[s.partner] = byP[s.partner] || { partner: s.partner, mgr: s.mgr, lines: [] }).lines.push(...s.lines.map(l => ({ ...l }))); });
      copies = Object.values(byP).map(g => mk(nextId(), date, g.partner, g.mgr, "주문", g.lines));
    } else {
      copies = sel.map(s => mk(nextId(), date, s.partner, s.mgr, s.status, s.lines.map(l => ({ ...l }))));
    }
    setSalesList(prev => [...copies, ...prev]);
    setChecked(new Set());
    setCopyOpen(false);
  };

  const runSend = ({ mode, partner }) => {
    const sel = salesList.filter(s => checked.has(s.id));
    if (sel.length === 0) { setSendOpen(false); return; }
    let payload;
    if (mode === "merge") {
      const lines = [];
      sel.forEach(s => lines.push(...s.lines.map(l => ({ ...l }))));
      payload = [{ date: sel[0].date, partner: partner || sel[0].partner, mgr: sel[0].mgr, lines }];
    } else {
      payload = sel.map(s => ({ date: s.date, partner: s.partner, mgr: s.mgr, lines: s.lines.map(l => ({ ...l })) }));
    }
    try {
      const prev = JSON.parse(localStorage.getItem("nonamed.sales.inbox.v1")) || [];
      localStorage.setItem("nonamed.sales.inbox.v1", JSON.stringify([...payload, ...prev]));
    } catch (e) {}
    setChecked(new Set());
    setSendOpen(false);
    alert(`${payload.length}건을 매출 전표로 보냈습니다. 매출 화면에서 확인하세요.`);
  };

  const handleEntrySave = (data) => {
    if (data.editId) {
      setSalesList(prev => prev.map(s => s.id === data.editId
        ? stampSaved(mk(data.editId, data.date, data.partner, data.mgr, data.status, data.lines))
        : s));
      setEntryOpen(false);
      return;
    }
    const n = salesList.length + 1;
    const id = "S-26-" + String(1000 + n).slice(1);
    setSalesList(prev => [stampSaved(mk(id, data.date, data.partner, data.mgr, data.status, data.lines)), ...prev]);
    setEntryOpen(false);
  };

  // 작성된 전표 클릭 → 입력 화면(수정 모드)으로
  const openSaleEdit = (sale) => {
    setEntryInitial({
      editId: sale.id,
      date: sale.date, partner: sale.partner, mgr: sale.mgr, status: sale.status,
      lines: sale.lines.map(l => ({ code: l.code || "", name: l.name, spec: l.spec, qty: String(l.qty), price: l.price, tax: l.tax, memo: "" })),
    });
    setEntryOpen(true);
  };

  return (
    <div className="layout" data-density={t.density}>
      <Sidebar active="sales" />

      <div className="main">
        <TopBar />

        <div className={`content ${listCfg ? "is-cfg-mode" : ""}`}>
          <header className="page-head">
            <div className="page-head-l">
              <h1 className="page-title">매출</h1>
              <button type="button" className="btn-primary title-add" onClick={() => { setEntryInitial(null); setEntryOpen(true); }}>{I.plus} 새 매출 입력 <kbd className="btn-kbd">F2</kbd></button>
              {listViews.length > 0 ? (() => { const av = listViews.find(v => v.code === activeListView); return (
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
                          {listViews.map(v => (
                            <button key={v.code} type="button" className={`vpm-item vpm-pick ${v.code === activeListView ? "is-on" : ""}`} onClick={() => { applyListView(v.code); setViewPickOpen(false); }}>
                              <span className="vpm-code">{v.code}</span>
                              <span className="vpm-name">{v.name}</span>
                              {v.code === activeListView ? <span className="vpm-dot" /> : null}
                            </button>
                          ))}
                        </div>
                        {activeListView ? <button type="button" className="active-view-clear" onClick={() => { setActiveListView(null); setViewPickOpen(false); }}>선택 해제</button> : null}
                      </div>
                    </>
                  ) : null}
                </div>
              ); })() : null}
            </div>
            <div className="page-actions">
              <ViewPresetMenu views={listViews} activeCode={activeListView} enabled={listCfg}
                onApply={applyListView} onSaveNew={saveNewListView} onOverwrite={overwriteListView} onRename={renameListView} onDelete={deleteListView} />
              {true ? (
                <button type="button" className={`btn-ghost ${listCfg ? "is-on-cfg" : ""}`} onClick={() => { if (listCfg) finishListCfg(); else enterListCfg(); }}>{I.cog} {listCfg ? "설정 완료" : "화면 설정"}</button>
              ) : null}
              <button type="button" className="btn-ghost" onClick={() => setMapOpen(true)}>{I.items} 품목 매핑</button>
              <button type="button" className="btn-ghost" onClick={exportExcel}>{I.download} excel</button>
              <button type="button" className="btn-ghost" onClick={() => setKpiOpen(o => !o)}>
                {kpiOpen ? "패널 접기" : "패널 펼치기"}
              </button>
            </div>
          </header>

          {/* KPI */}
          {kpiOpen ? <KpiCards rows={filtered} allSales={salesList} /> : null}

          {/* primary view tabs */}
          <div className="view-row">
            <div className="view-tabs">
              {VIEW_TABS.map(v => (
                <button
                  key={v}
                  type="button"
                  className={`view-tab ${view === v ? "is-on" : ""} ${listCfg ? "is-disabled" : ""}`}
                  disabled={listCfg}
                  onClick={() => { if (!listCfg) setView(v); }}
                >
                  {v === "기간요약" ? "패널" : v}
                </button>
              ))}
            </div>
            <div className="hist-strip">
              <span className="hist-label">최근 전표</span>
              <div className="hist-items">
                {salesList.slice(0, 6).map(s => (
                  <button key={s.id} type="button" className={`hist-chip ${s.deleted ? "is-del" : ""}`} onClick={() => s.deleted ? setRestoreSale(s) : openSaleEdit(s)} title={s.deleted ? "삭제된 전표 — 클릭하면 삭제 취소 버튼이 뜨앑니다" : `${s.partner} · ${fmt(s.total)}원`}>
                    <span className="hc-date">{s.date.slice(5)}</span>
                    <span className="hc-partner">{s.partner}</span>
                    <span className="hc-amt">{fmt(s.total)}</span>
                    {s.deleted ? <span className="hc-del">삭제됨</span> : null}
                  </button>
                ))}
              </div>
            </div>
            {restoreSale ? (
              <div className="undo-bar">
                <span className="undo-txt">삭제된 전표 <b>{restoreSale.id}</b> · {restoreSale.partner} · {fmt(restoreSale.total)}원</span>
                <button type="button" className="btn-sm btn-primary" onClick={undoDelete}>삭제 취소</button>
                <button type="button" className="btn-sm btn-ghost" onClick={() => setRestoreSale(null)}>닫기</button>
              </div>
            ) : null}
          </div>

          {/* period filter (기간별/상세) */}
          {showFilters ? (
            <div className="period-bar">
              <div className="seg seg-sm period-seg">
                {PERIOD_OPTIONS.map(p => (
                  <button key={p} type="button" className={`seg-item ${period === p ? "is-on" : ""}`} onClick={() => setPeriod(p)}>{p}</button>
                ))}
              </div>

              {period === "기본" ? (() => { const drDirty = (range.from !== appliedRange.from || range.to !== appliedRange.to); const drOk = (v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v); const drBad = !drOk(range.from) || !drOk(range.to) || (range.from && range.to && range.to < range.from); const drFix = (v) => { const m = /^(\d{5,})(-\d{2}-\d{2})$/.exec(v); return m ? m[1].slice(0, 4) + m[2] : v; }; return (
                <div className="daterange">
                  <input type="date" className={"dr-input" + (drDirty ? " is-dirty" : "") + (drBad ? " is-bad" : "")} value={range.from} max={range.to || "9999-12-31"} onChange={(e) => setRange(r => ({ ...r, from: drFix(e.target.value) }))} />
                  <span className="dr-sep">~</span>
                  <input type="date" className={"dr-input" + (drDirty ? " is-dirty" : "") + (drBad ? " is-bad" : "")} value={range.to} min={range.from || undefined} max="9999-12-31" onChange={(e) => setRange(r => ({ ...r, to: drFix(e.target.value) }))} />
                  {(range.from || range.to) ? (
                    <button type="button" className="dr-clear" onClick={() => setRange({ from: "", to: "" })} title="기간 지정 해제">{I.close}</button>
                  ) : null}
                  <button type="button" className={"dr-apply" + (drDirty ? " is-dirty" : "") + (drBad ? " is-disabled" : "")} onClick={() => { if (drBad) { showToast("일자를 확인해 주세요 — 끝 일자가 시작 일자보다 빠르거나 형식(YYYY-MM-DD)이 맞지 않습니다.", "info"); return; } setAppliedRange(range); }}>{I.search} 검색</button>
                  <button type="button" className="dr-savedef" title="기본 검색 기간 설정" onClick={() => setDefCfgOpen(true)}>기본값 설정</button>
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
              <button type="button" className="period-search" onClick={() => setSearchOpen(true)}>{I.search} 조건 검색</button>
              <SearchCondChips items={[{ key: "from", label: "시작일", value: appliedRange.from }, { key: "to", label: "종료일", value: appliedRange.to }, { key: "partner", label: "거래처", value: cond.partner }, { key: "mgr", label: "담당자", value: cond.mgr }, { key: "item", label: "품목", value: cond.item }, { key: "status", label: "상태", value: statusFilter }]}
                onClear={() => { const z = { partner: "", item: "", mgr: "" }; setCond(z); setDcond(z); setRange({ from: "", to: "" }); setDrange({ from: "", to: "" }); setAppliedRange({ from: "", to: "" }); setStatusFilter("전체"); setDstatus("전체"); }} />
            </div>
          ) : null}

          {/* toolbar */}
          {showFilters ? (
            <div className="toolbar">
              <div className="list-search">
                <span className="ls-icon">{I.search}</span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onPaste={onSearchPaste}
                  onDragOver={(e) => { if (e.dataTransfer?.types?.includes("Files")) e.preventDefault(); }}
                  onDrop={(e) => { const f = e.dataTransfer?.files?.[0]; if (f && f.type.startsWith("image/")) { e.preventDefault(); ocrImage(f); } }}
                  placeholder={ocrBusy ? "이미지 인식 중…" : "전표번호, 거래처, 품목, 담당자 검색 · 카톡·문자·사진 붙여넣기로 전표 입력"}
                />
              </div>
              <div className="seg seg-sm">
                {["전체", ...STATUS_OPTIONS].map(k => (
                  segEdit === k && listCfg ? (
                    <input key={k} className="seg-item seg-edit" autoFocus defaultValue={stLabel(k)} size={6}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); saveStLabel(k, e.target.value); } else if (e.key === "Escape") { e.stopPropagation(); setSegEdit(null); } }}
                      onBlur={(e) => saveStLabel(k, e.target.value)} />
                  ) : (
                  <button key={k} type="button" className={`seg-item ${statusFilter === k ? "is-on" : ""} ${listCfg ? "seg-renamable" : ""}`} title={listCfg ? "클릭하여 이름 변경" : undefined}
                    onClick={() => { if (listCfg) setSegEdit(k); else setStatusFilter(k); }}>{stLabel(k)}</button>
                  )
                ))}
              </div>
              <div className="tb-meta">
                {view === "상세" && detailSel > 0 ? (
                  <span className="tb-selcnt">단가 변경 중 · {detailSel}건</span>
                ) : checked.size > 0 ? (
                  <>
                    <span className="tb-selcnt">{checked.size}건 선택</span>
                    <button type="button" className="btn-ghost btn-sm" onClick={copyChecked}>{I.copy} 복사</button>
                    <button type="button" className="btn-ghost btn-sm" onClick={() => setSendOpen(true)}>{I.send} 보내기</button>
                    <button type="button" className="btn-ghost btn-sm btn-danger" onClick={deleteChecked}>{I.trash} 선택 삭제</button>
                    <button type="button" className="btn-ghost btn-sm" onClick={printChecked}>{I.print} 거래명세서 인쇄 ({checked.size})</button>
                  </>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* view body */}
          {view === "조회" ? (
            <PeriodView rows={filtered} allColumns={allListCols} visibleColumns={visibleColumns} onOpen={openSaleEdit}
              onMoveColumn={colSettings.moveTo} cfg={listCfg} onHideCol={toggleColAny}
              onShowCol={toggleColAny} onResetCols={resetListCols}
              onRename={renameColAny} onRemoveCol={removeListCol}
              onOpenAddCol={() => setListAddColOpen(true)} onOpenEditCol={(col) => setListEditCol(col)}
              calcCustom={calcListCustom}
              widths={listWidths} setWidths={setListWidths}
              onPrint={(s) => setPrintSales([s])}
              onChangeStatus={(id, status) => {
                const sale = salesList.find(s => s.id === id);
                if (status === "완료" && sale && sale.lines.some(l => !l.code || !String(l.code).trim())) {
                  alert("품목코드가 매핑되지 않은 항목이 있어 '완료'로 변경할 수 없습니다.\n모든 품목을 매핑한 뒤 다시 시도해 주세요.");
                  return;
                }
                setSalesList(prev => prev.map(s => s.id === id ? { ...s, status } : s));
              }}
              checked={checked} toggle={toggle} toggleAll={toggleAll} allChecked={allChecked} />
          ) : view === "상세" ? (
            <DetailView rows={filtered} onOpen={openSaleEdit} cfg={listCfg} kw={cond.item || query} onSelCount={setDetailSel} onEditPrice={(sid, li, price) => setSalesList(prev => prev.map(s => { if (s.id !== sid) return s; const lines = s.lines.map((l, i) => i === li ? { ...l, price } : l); const supply = lines.reduce((a, l) => a + (l.qty || 0) * (l.price || 0), 0); const vat = lines.reduce((a, l) => a + (l.tax === "과세" ? Math.round((l.qty || 0) * (l.price || 0) * 0.1) : 0), 0); return { ...s, lines, supply, vat, total: supply + vat }; }))} />
          ) : view === "기간요약" ? (
            <SummaryView rows={filtered} period={period} range={range} cfg={listCfg} />
          ) : view === "미수금" ? (
            <ReceivableView rows={salesList.filter(s => inPeriod(s.date, period, appliedRange))} payments={payments} onAddPayment={(p) => setManualPays(prev => [...prev, { ...p, manual: true }])} onRemovePayment={(p) => setManualPays(prev => prev.filter(x => x !== p))} onOpen={openSaleEdit} cfg={listCfg} />
          ) : null}
        </div>
      </div>

      <SaleDetailModal open={!!detail} sale={detail ? (salesList.find(s => s.id === detail.id) || detail) : null} onClose={() => setDetail(null)}
        onPrint={(s) => setPrintSales([s])}
        onChangeStatus={(id, status) => setSalesList(prev => prev.map(s => s.id === id ? { ...s, status } : s))} />

      <PrintPreviewModal open={!!printSales} sales={printSales} onClose={() => setPrintSales(null)} />

      <CopyModal open={copyOpen} count={checked.size} onRun={runCopy} onClose={() => setCopyOpen(false)} />

      <SendModal open={sendOpen} count={checked.size}
        partners={[...new Set(salesList.filter(s => checked.has(s.id)).map(s => s.partner))]}
        onRun={runSend} onClose={() => setSendOpen(false)} />

      <DefaultRangeModal open={defCfgOpen} onSave={({ back, fwd }) => {
        const r = { from: monthsAgo(TODAY, back), to: monthsAfter(TODAY, fwd), back, fwd };
        try { localStorage.setItem("nonamed.sales.defaultRange.v1", JSON.stringify(r)); } catch(e){}
        setRange(r); setAppliedRange(r); setPeriod("기본"); setDefCfgOpen(false);
      }} onClose={() => setDefCfgOpen(false)} />

      <SalesEntryModal open={entryOpen} initial={entryInitial} onSave={handleEntrySave} onDelete={(id) => { setSalesList(prev => prev.map(s => s.id === id ? { ...s, deleted: true } : s)); setEntryOpen(false); showToast(`${id} 전표를 삭제했습니다. 최근 전표에서 취소할 수 있습니다.`); }} onMap={addMapping} resolvePartnerItems={resolvePartnerItems} records={salesList} customCols={entryCols} onAddCol={addEntryCol} onRemoveCol={removeEntryCol} onReorderCol={reorderEntryCol} onRenameCol={renameEntryCol} onUpdateCol={updateEntryCol} onRevertEntryCols={(cols) => setEntryCols(cols)} onClose={() => { setEntryOpen(false); setEntryInitial(null); }} />

      <MappingModal open={mapOpen} mappings={mappings} onRemove={(key) => setMappings(prev => prev.filter(m => m.key !== key))} onClose={() => setMapOpen(false)} />

      {listAddColOpen ? (
        <AddColModal nextCode={"열추가 " + String.fromCharCode(65 + listCols.length)} existing={listCols} onAdd={(c) => { addListCol(c); setListAddColOpen(false); }} onClose={() => setListAddColOpen(false)} />
      ) : null}
      {listEditCol ? (
        <AddColModal initial={listEditCol} existing={listCols} onAdd={(c) => { if (listEditCol._base) renameColAny(listEditCol.key, c.label); else updateListCol(listEditCol.key, c); setListEditCol(null); }} onClose={() => setListEditCol(null)} />
      ) : null}
      <SaveViewModal open={listSaveOpen} code={nextViewCode(listViews)} onSave={confirmSaveNewList} onClose={() => setListSaveOpen(false)} />
      <SaveViewModal open={!!listRenameCode} title="화면 이름 변경" saveLabel="변경" initialName={(listViews.find(v => v.code === listRenameCode) || {}).name || ""} onSave={confirmRenameList} onClose={() => setListRenameCode(null)} />
      <ConfirmModal open={!!listOverwriteCode} title="화면 덮어쓰기"
        message={(() => { const v = listViews.find(x => x.code === listOverwriteCode); return v ? `${v.code} "${v.name}" 화면을 지금 화면 구성으로 덮어쓸까요?` : ""; })()}
        confirmLabel="덮어쓰기" onConfirm={confirmOverwriteList} onClose={() => setListOverwriteCode(null)} />
      <ConfirmModal open={!!listDeleteCode} title="화면 삭제" danger confirmLabel="삭제"
        message={(() => { const v = listViews.find(x => x.code === listDeleteCode); return v ? `${v.code} "${v.name}" 화면을 삭제할까요? 이 작업은 되돌릴 수 없습니다.` : ""; })()}
        onConfirm={confirmDeleteList} onClose={() => setListDeleteCode(null)} />
      {listDonePrompt ? (() => { const av = listViews.find(v => v.code === activeListView); return (
        <div className="modal-root" role="dialog" aria-modal="true" style={{ zIndex: 95 }}>
          <div className="modal-scrim" onClick={cancelListCfg} />
          <div className="modal modal-confirm">
            <div className="confirm-body">
              <h2 className="confirm-title">화면 설정 저장</h2>
              <p className="confirm-msg">{av ? <React.Fragment>현재 적용된 양식: <b>{av.code} "{av.name}"</b><br/></React.Fragment> : <React.Fragment>현재 적용된 저장 양식이 없습니다.<br/></React.Fragment>}변경한 화면 설정을 어떻게 저장할까요?</p>
            </div>
            <footer className="modal-foot">
              <div className="ff-left" />
              <div className="ff-right">
                <button type="button" className="btn-ghost" onClick={cancelListCfg}>취소</button>
                <button type="button" className="btn-ghost" onClick={() => { setListDonePrompt(false); setListCfg(false); if (av) overwriteListView(av.code); }}>현재 양식에 적용</button>
                <button type="button" className="btn-primary" onClick={applyListCfg}>신규 저장</button>
              </div>
            </footer>
          </div>
        </div>
      ); })() : null}


      <SearchCondModal open={searchOpen} prefix="maeip" sub="일자·거래처·품목·담당자로 검색합니다."
        fields={[
          { key: "from", label: "시작일", node: (
            <label className="fld"><span className="fld-label">시작일</span>
              <input type="date" className="fld-input is-mono" value={drange.from} onChange={(e) => setDrange(r => ({ ...r, from: e.target.value }))} /></label>) },
          { key: "to", label: "종료일", node: (
            <label className="fld"><span className="fld-label">종료일</span>
              <input type="date" className="fld-input is-mono" value={drange.to} onChange={(e) => setDrange(r => ({ ...r, to: e.target.value }))} /></label>) },
          { key: "partner", label: "거래처", node: (
            <label className="fld"><span className="fld-label">거래처</span>
              <input type="text" className="fld-input" value={dcond.partner} onChange={(e) => setDcond(c => ({ ...c, partner: e.target.value }))} placeholder="거래처명" /></label>) },
          { key: "mgr", label: "담당자", node: (
            <label className="fld"><span className="fld-label">담당자</span>
              <input type="text" className="fld-input" value={dcond.mgr} onChange={(e) => setDcond(c => ({ ...c, mgr: e.target.value }))} placeholder="담당자명" /></label>) },
          { key: "item", label: "품목", node: (
            <label className="fld"><span className="fld-label">품목</span>
              <input type="text" className="fld-input" value={dcond.item} onChange={(e) => setDcond(c => ({ ...c, item: e.target.value }))} placeholder="품목명" /></label>) },
          { key: "status", label: "상태", node: (
            <div className="fld"><span className="fld-label">상태</span>
              <div className="seg seg-sm">
                {["전체", "주문", "완료"].map(k => (
                  <button key={k} type="button" className={`seg-item ${dstatus === k ? "is-on" : ""}`} onClick={() => setDstatus(k)}>{stLabel(k)}</button>
                ))}
              </div>
            </div>) },
        ]}
        onReset={() => { const z = { partner: "", item: "", mgr: "" }; setDcond(z); setCond(z); setDrange({ from: "", to: "" }); setRange({ from: "", to: "" }); setAppliedRange({ from: "", to: "" }); setDstatus("전체"); setStatusFilter("전체"); setQuery(""); }}
        onSearch={() => { setCond(dcond); setStatusFilter(dstatus); setRange(drange); setAppliedRange(drange); if (drange.from || drange.to) setPeriod("기본"); setSearchOpen(false); }} onClose={() => setSearchOpen(false)} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="테이블" />
        <TweakRadio label="행 간격" value={t.density}
          options={["촘촘", "여유"]}
          onChange={(v) => setTweak("density", v)} />
      </TweaksPanel>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Styles
   ───────────────────────────────────────────── */
const css = `
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
.kan-cnt{ font-family:"JetBrains Mono", monospace; font-size: 11.5px; color: var(--ink-3); }
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
.dr-apply{ appearance:none; cursor:pointer; border:0; background:var(--accent); color:#fff; font:600 12.5px "IBM Plex Sans KR",sans-serif; padding:7px 14px; border-radius:9px; display:inline-flex; align-items:center; gap:5px; }
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
.entry-grid.is-cfg .fld{ cursor:grab; border:1px dashed color-mix(in oklab, var(--accent) 30%, var(--line)); border-radius:10px; padding:6px 8px; margin:-6px -8px; }
.entry-grid.is-cfg .fld:active{ cursor:grabbing; }
.entry-grid .fld{ position:relative; }
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

/* search field (거래처/담당자) */
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

/* picker overlay (거래처/품목 검색 팝업) */
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
.pick-foot-cnt{ font-size: 11.5px; color: var(--ink-3); font-family:"JetBrains Mono", monospace; }
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

/* 거래처별 자주 쓰는 품목 매핑 모달 */
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
