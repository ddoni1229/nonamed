// 거래처등록.jsx — nonamed ERP 거래처 관리 (테이블 + 등록/수정 모달)

const { useState, useEffect, useMemo, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "formLayout": "2열",
  "afterSave": "목록으로",
  "showHelper": true
}/*EDITMODE-END*/;

/* ─────────────────────────────────────────────
   Column definitions — customizable
   ───────────────────────────────────────────── */
const ALL_COLUMNS = [
  { key: "code",     label: "거래처코드",   width: "110px",                kind: "mono" },
  { key: "name",     label: "거래처명",     width: "minmax(160px, 1.6fr)", kind: "name", locked: true },
  { key: "mobile",   label: "휴대전화",     width: "130px",                kind: "mono" },
  { key: "phone",    label: "전화",         width: "130px",                kind: "mono" },
  { key: "fax",      label: "팩스",         width: "130px",                kind: "mono" },
  { key: "email",    label: "이메일",       width: "minmax(160px, 1.2fr)", kind: "mono" },
  { key: "ceo",      label: "대표",         width: "90px",                 kind: "text" },
  { key: "biz",      label: "사업자",       width: "140px",                kind: "mono" },
  { key: "addr",     label: "주소",         width: "minmax(180px, 2fr)",   kind: "muted" },
  { key: "industry", label: "업태",         width: "100px",                kind: "text" },
  { key: "category", label: "종목",         width: "100px",                kind: "text" },
  { key: "note",     label: "메모",         width: "minmax(140px, 1.2fr)", kind: "muted" },
  { key: "grp1",     label: "그룹1",        width: "90px",                 kind: "text" },
  { key: "grp2",     label: "그룹2",        width: "90px",                 kind: "text" },
];

const DEFAULT_VISIBLE_COLS = ["code", "name", "mobile", "phone", "ceo", "biz", "addr"];
const COL_STORAGE_KEY = "nonamed.partners.columns.v1";


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
  reset:    <svg viewBox="0 0 24 24" fill="none"><path d="M3 12a9 9 0 1015 4M3 4v6h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  close:    <svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  cog:      <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/><path d="M19.4 15a1.7 1.7 0 00.34 1.87l.06.06a2 2 0 11-2.83 2.83l-.06-.06A1.7 1.7 0 0015 19.4a1.7 1.7 0 00-1 1.55V21a2 2 0 11-4 0v-.09A1.7 1.7 0 009 19.4a1.7 1.7 0 00-1.87.34l-.06.06A2 2 0 114.24 16.97l.06-.06A1.7 1.7 0 004.6 15a1.7 1.7 0 00-1.55-1H3a2 2 0 110-4h.09A1.7 1.7 0 004.6 9a1.7 1.7 0 00-.34-1.87l-.06-.06A2 2 0 117.03 4.24l.06.06A1.7 1.7 0 009 4.6a1.7 1.7 0 001-1.55V3a2 2 0 114 0v.09A1.7 1.7 0 0015 4.6a1.7 1.7 0 001.87-.34l.06-.06a2 2 0 112.83 2.83l-.06.06A1.7 1.7 0 0019.4 9a1.7 1.7 0 001.55 1H21a2 2 0 110 4h-.09a1.7 1.7 0 00-1.51 1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  up:       <svg viewBox="0 0 24 24" fill="none"><path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  down:     <svg viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  drag:     <svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="6" r="1.4" fill="currentColor"/><circle cx="15" cy="6" r="1.4" fill="currentColor"/><circle cx="9" cy="12" r="1.4" fill="currentColor"/><circle cx="15" cy="12" r="1.4" fill="currentColor"/><circle cx="9" cy="18" r="1.4" fill="currentColor"/><circle cx="15" cy="18" r="1.4" fill="currentColor"/></svg>,
};

/* ─────────────────────────────────────────────
   Data
   ───────────────────────────────────────────── */

const INITIAL_PARTNERS = [
  { id:"P-001", name:"한양식자재",     ceo:"이한양", phone:"02-555-1241", addr:"서울 강남구 역삼동 123",     mgr:"박지영", kind:"납품처", payment:"외상",     biz:"123-45-67890", mobile:"010-2211-5510", fax:"02-555-1249", email:"hanyang@ex.kr", industry:"도소매", category:"식자재", note:"정기 납품", grp1:"A그룹", grp2:"수도권" },
  { id:"P-002", name:"송파유통",       ceo:"김송파", phone:"02-411-3320", addr:"서울 송파구 잠실동 88-2",    mgr:"최영민", kind:"납품처", payment:"월말정산", biz:"214-81-12345", mobile:"010-3388-4120", fax:"02-411-3329", email:"songpa@ex.kr", industry:"도소매", category:"청과", note:"월말 마감", grp1:"A그룹", grp2:"수도권" },
  { id:"P-003", name:"동대문푸드",     ceo:"정대문", phone:"02-967-2002", addr:"서울 동대문구 답십리동 412", mgr:"이수진", kind:"납품처", payment:"외상",     biz:"305-22-54321", mobile:"010-5512-7788", fax:"02-967-2009", email:"ddmfood@ex.kr", industry:"유통", category:"수산·냉동", note:"", grp1:"B그룹", grp2:"수도권" },
  { id:"P-004", name:"마포정육점",     ceo:"강마포", phone:"02-322-7700", addr:"서울 마포구 합정동 14",      mgr:"강마포", kind:"매입처", payment:"현금",     biz:"118-09-77654", mobile:"010-4477-1220", fax:"02-322-7709", email:"mapo@ex.kr", industry:"소매", category:"정육", note:"현금 결제", grp1:"B그룹", grp2:"서울" },
  { id:"P-005", name:"성수냉동",       ceo:"오성수", phone:"02-488-1820", addr:"서울 성동구 성수동 200-1",   mgr:"문호철", kind:"매입처", payment:"현금",     biz:"206-12-88990", mobile:"010-9080-3311", fax:"02-488-1829", email:"sscold@ex.kr", industry:"제조", category:"냉동식품", note:"", grp1:"C그룹", grp2:"서울" },
  { id:"P-006", name:"종로식자재마트", ceo:"한종로", phone:"02-733-5050", addr:"서울 종로구 종로3가 64",     mgr:"한종로", kind:"둘다",   payment:"월말정산", biz:"101-08-11122", mobile:"010-2255-6070", fax:"02-733-5059", email:"jongro@ex.kr", industry:"도소매", category:"종합식자재", note:"대량 거래", grp1:"A그룹", grp2:"수도권" },
  { id:"P-007", name:"강서물산",       ceo:"문강서", phone:"02-655-4100", addr:"서울 강서구 화곡동 33",      mgr:"문강서", kind:"납품처", payment:"외상",     biz:"509-31-66700", mobile:"010-7788-2140", fax:"02-655-4109", email:"gangseo@ex.kr", industry:"유통", category:"곡물", note:"", grp1:"C그룹", grp2:"수도권" },
  { id:"P-008", name:"광진수산",       ceo:"권광진", phone:"02-454-9912", addr:"서울 광진구 자양동 78",      mgr:"권광진", kind:"매입처", payment:"현금",     biz:"217-19-44488", mobile:"010-6611-9930", fax:"02-454-9919", email:"gwangjin@ex.kr", industry:"도소매", category:"수산", note:"", grp1:"B그룹", grp2:"서울" },
];
/* 그룹1·2 샘플값을 "코드 · 값" 형태로 정리 — 그룹(코드)/그룹(값) 열 분리 검증용 */
(function seedPartnerGroups() {
  const G1 = { "A그룹": "A-001", "B그룹": "A-002", "C그룹": "A-003" };
  const G2 = { "수도권": "R-01", "지방": "R-02", "해외": "R-03", "온라인": "R-04", "직영마트": "R-05" };
  const norm = (v, map, pre, i) => { if (!v) return ""; if (/·/.test(v)) return v; const code = map[v] || (pre + String(i + 1).padStart(2, "0")); return code + " · " + v; };
  INITIAL_PARTNERS.forEach((p, i) => { p.grp1 = norm(p.grp1, G1, "A-0", i); p.grp2 = norm(p.grp2, G2, "R-", i); });
})();
INITIAL_PARTNERS.length = 0; // 샘플 데이터 제거(배포용)

const KIND_OPTIONS = ["납품처", "매입처", "둘다"];

const BASE_FIELDS = [
  { key: "code",     label: "거래처코드",   required: true, mono: true, placeholder: "예: P-009" },
  { key: "name",     label: "거래처명",     required: true, placeholder: "예: 한양식자재" },
  { key: "mobile",   label: "휴대전화",     mono: true, inputMode: "tel", placeholder: "010-1234-5678", format: formatPhone },
  { key: "phone",    label: "전화",         mono: true, inputMode: "tel", placeholder: "02-1234-5678", format: formatPhone },
  { key: "fax",      label: "팩스",         mono: true, placeholder: "02-1234-5679", format: formatPhone },
  { key: "email",    label: "이메일",       mono: true, type: "email", placeholder: "contact@example.com" },
  { key: "ceo",      label: "대표",         placeholder: "예: 이한양" },
  { key: "biz",      label: "사업자",       mono: true, inputMode: "numeric", placeholder: "123-45-67890", format: formatBiz },
  { key: "addr",     label: "주소" },
  { key: "industry", label: "업태",         placeholder: "예: 도소매" },
  { key: "category", label: "종목",         placeholder: "예: 식자재" },
  { key: "note",     label: "메모" },
  { key: "grp1",     label: "그룹1" },
  { key: "grp2",     label: "그룹2" },
];
function activeEntrySlots() {
  let m = {};
  try { m = JSON.parse(localStorage.getItem("nonamed.partner.fldMeta.v1")) || {}; } catch (e) {}
  return EXTRA_SLOTS.map(s => ({ key: s.label, label: (m[s.key] || {}).label || s.label, type: s.type === "num" ? "money" : s.type === "lookup" ? "lookup" : "text" }));
}
const SRC_COLUMNS = [...ALL_COLUMNS, { key: "zip", label: "우편번호" }, { key: "addrDetail", label: "상세주소" }];
const LIST_SRC_GROUPS = (() => {
  const slots = [
    ...Array.from({ length: 11 }, (_, i) => "문자형" + (i + 1)),
    ...Array.from({ length: 11 }, (_, i) => "숫자형" + (i + 1)),
    ...Array.from({ length: 5 }, (_, i) => "그룹" + (i + 3)),
  ];
  return {
    "조회 기술키": ["순번", "인쇄"],
    "입력 기술키": ["거래처코드", "거래처명", "휴대전화", "전화", "팩스", "이메일", "대표", "사업자", "우편번호", "주소", "상세주소", "업태", "종목", "메모", "그룹1", "그룹2"],
    "입력 추가키": slots,
    "조회 추가키": slots,
  };
})();
const EXTRA_SLOTS = [
  ...Array.from({length:11},(_,i)=>i+1).map(n => ({ key: "xt" + n, label: "문자형" + n, type: "text" })),
  ...Array.from({length:11},(_,i)=>i+1).map(n => ({ key: "xn" + n, label: "숫자형" + n, type: "num" })),
  ...[1,2,3,4,5].map(n => ({ key: "xs" + n, label: "그룹" + (n + 2), type: "lookup" })),
];
const PAYMENT_OPTIONS = ["현금", "외상", "월말정산", "선결제"];
const AFTER_SAVE_OPTIONS = ["목록으로", "계속 등록"];

/* ─────────────────────────────────────────────
   Column settings hook + modal
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

  const reset = () => {
    setSettings(ALL_COLUMNS.map(c => ({ key: c.key, visible: DEFAULT_VISIBLE_COLS.includes(c.key) })));
  };
  const toggle = (key) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, visible: !s.visible } : s));
  };
  const move = (key, dir) => {
    setSettings(prev => {
      const idx = prev.findIndex(s => s.key === key);
      if (idx < 0) return prev;
      const next = [...prev];
      const to = idx + dir;
      if (to < 0 || to >= next.length) return prev;
      [next[idx], next[to]] = [next[to], next[idx]];
      return next;
    });
  };

  const visibleColumns = useMemo(() => {
    const defMap = new Map(ALL_COLUMNS.map(c => [c.key, c]));
    return settings
      .filter(s => s.visible || defMap.get(s.key)?.locked)
      .map(s => defMap.get(s.key))
      .filter(Boolean);
  }, [settings]);

  return { settings, visibleColumns, toggle, move, reset };
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
    <div className="modal-root" role="dialog" aria-modal="true" aria-labelledby="col-modal-title">
      <div className="modal-scrim" onClick={onClose} />
      <div className="modal modal-sm">
        <header className="modal-head">
          <div>
            <h2 id="col-modal-title" className="modal-title">화면 설정</h2>
            <div className="modal-sub">표시할 컬럼과 순서를 조정하세요. 거래처명은 항상 표시됩니다.</div>
          </div>
          <div className="modal-head-actions">
            <button type="button" className="modal-close" aria-label="닫기" onClick={onClose}>{I.close}</button>
          </div>
        </header>

        <div className="col-list">
          {settings.map((s, idx) => {
            const def = defMap.get(s.key);
            if (!def) return null;
            const isLocked = !!def.locked;
            const isOn = s.visible || isLocked;
            return (
              <div key={s.key} className={`col-row ${isOn ? "is-on" : ""} ${isLocked ? "is-locked" : ""}`}>
                <span className="col-handle" aria-hidden="true">{I.drag}</span>
                <span className="col-name">
                  {def.label}
                  {isLocked ? <span className="col-lock">고정</span> : null}
                </span>
                <div className="col-order">
                  <button
                    type="button"
                    className="iconbtn iconbtn-sm"
                    aria-label="위로"
                    disabled={idx === 0}
                    onClick={() => move(s.key, -1)}
                  >{I.up}</button>
                  <button
                    type="button"
                    className="iconbtn iconbtn-sm"
                    aria-label="아래로"
                    disabled={idx === settings.length - 1}
                    onClick={() => move(s.key, 1)}
                  >{I.down}</button>
                </div>
                <button
                  type="button"
                  className={`switch ${isOn ? "is-on" : ""}`}
                  role="switch"
                  aria-checked={isOn}
                  disabled={isLocked}
                  onClick={() => toggle(s.key)}
                >
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
   Format helpers
   ───────────────────────────────────────────── */

/* ─────────────────────────────────────────────
   Sidebar
   ───────────────────────────────────────────── */

/* ─────────────────────────────────────────────
   Top bar
   ───────────────────────────────────────────── */
function TopBar() { return <CommonTopBar crumb="거래처" />; }

/* ─────────────────────────────────────────────
   Fields
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

function TextField({ label, value, onChange, placeholder, required, hint, monospace, ...rest }) {
  return (
    <label className="fld">
      <Label required={required} hint={hint}>{label}</Label>
      <input
        type="text"
        className={`fld-input ${monospace ? "is-mono" : ""}`}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        {...rest}
      />
    </label>
  );
}

function SegmentField({ label, value, onChange, options, required }) {
  return (
    <div className="fld">
      <Label required={required}>{label}</Label>
      <div className="seg">
        {options.map(o => (
          <button
            key={o}
            type="button"
            className={`seg-item ${value === o ? "is-on" : ""}`}
            onClick={() => onChange(o)}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function ZipFindModal({ onPick, onClose }) {
  const DATA = [
    ["06236", "서울특별시 강남구 테헤란로 152"],
    ["04524", "서울특별시 중구 세종대로 110"],
    ["07327", "서울특별시 영등포구 여의대로 108"],
    ["13529", "경기도 성남시 분당구 판교역로 235"],
    ["16489", "경기도 수원시 팔달구 인계로 178"],
    ["21554", "인천광역시 남동구 예술로 152"],
    ["61947", "광주광역시 서구 내방로 111"],
    ["54968", "전라북도 전주시 완산구 효자로 225"],
    ["48058", "부산광역시 해운대구 센텀중앙로 97"],
    ["41911", "대구광역시 중구 공평로 88"],
    ["35242", "대전광역시 서구 둔산로 100"],
    ["44706", "울산광역시 남구 중앙로 201"],
    ["63122", "제주특별자치도 제주시 문연로 6"],
    ["24328", "강원특별자치도 춘천시 중앙로 1"],
    ["28644", "충청북도 청주시 상당구 상당로 82"],
  ];
  const [q, setQ] = useState("");
  const list = q.trim() ? DATA.filter(([z, a]) => z.includes(q.trim()) || a.includes(q.trim())) : DATA;
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") { e.stopImmediatePropagation(); e.preventDefault(); onClose(); } };
    window.addEventListener("keydown", fn, true);
    return () => window.removeEventListener("keydown", fn, true);
  }, [onClose]);
  return (
    <div className="modal-root" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ width: 520, maxWidth: "94vw" }} onMouseDown={(e) => e.stopPropagation()}>
        <header className="modal-head">
          <div><h2 className="modal-title">우편번호 찾기</h2></div>
          <div className="modal-head-actions">
            <button type="button" className="iconbtn" title="닫기" onClick={onClose}>{I.x}</button>
          </div>
        </header>
        <div className="modal-body">
          <label className="fld">
            <span className="fld-label">검색</span>
            <input className="fld-input" autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="도로명·지역명·우편번호" />
          </label>
          <div className="lk-list" style={{ marginTop: 12, maxHeight: 320, overflow: "auto", border: "1px solid var(--line)", borderRadius: 10 }}>
            {list.length ? list.map(([z, a]) => (
              <button key={z} type="button" className="lk-row" style={{ display: "grid", gridTemplateColumns: "78px 1fr", gap: 10, width: "100%", textAlign: "left", padding: "10px 12px", border: 0, borderBottom: "1px solid var(--line)", background: "transparent", cursor: "pointer", font: "inherit" }} onClick={() => onPick(z, a)}>
                <span className="is-mono" style={{ color: "var(--accent)", fontWeight: 700 }}>{z}</span>
                <span>{a}</span>
              </button>
            )) : <div style={{ padding: "16px 12px", color: "var(--ink-3)", fontSize: 13 }}>검색 결과가 없습니다.</div>}
          </div>
        </div>
        <footer className="modal-foot">
          <div className="ff-left" />
          <div className="ff-right"><button type="button" className="btn-ghost" onClick={onClose}>닫기</button></div>
        </footer>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Partner Modal (등록/수정)
   ───────────────────────────────────────────── */
function PartnerModal({ open, initial, existingCodes, formLayout, afterSave, setAfterSave, showHelper, onSave, onDelete, onClose, setToast }) {
  const blank = {
    code: "", name: "", ceo: "", biz: "",
    industry: "", category: "",
    phone: "", mobile: "", fax: "", email: "",
    zip: "", addr: "", addrDetail: "",
    kind: "납품처", payment: "외상",
    mgrName: "", mgrRole: "",
    note: "", grp1: "", grp2: "",
  };

  const [form, setForm] = useState(blank);
  const [pcfg, setPcfg] = useState(false);
  const [pViews, setPViews] = useState(() => { try { const v = JSON.parse(localStorage.getItem("nonamed.partner.entryViews.v1")); return Array.isArray(v) ? v : []; } catch (e) { return []; } });
  const [pActive, setPActive] = useState(() => { try { return localStorage.getItem("nonamed.partner.entryView") || null; } catch (e) { return null; } });
  useEffect(() => { try { localStorage.setItem("nonamed.partner.entryViews.v1", JSON.stringify(pViews)); if (pActive) localStorage.setItem("nonamed.partner.entryView", pActive); } catch (e) {} }, [pViews, pActive]);
  const [pViewPick, setPViewPick] = useState(false);
  const [pSaveOpen, setPSaveOpen] = useState(false);
  const [pOwCode, setPOwCode] = useState(null);
  const [pRenameCode, setPRenameCode] = useState(null);
  const [pDelCode, setPDelCode] = useState(null);
  const [pDonePrompt, setPDonePrompt] = useState(false);
  const wf = useWinFrame("nonamed.partner.entry", 860, open);
  const psnap = useRef(null);
  const appliedOnce = useRef(false);
  const applyPView = (code) => { const v = pViews.find(x => x.code === code); if (!v) return; const c = v.config || {}; setFldOrder(c.fldOrder || null); setFldSpan(c.fldSpan || {}); setFldMeta(c.fldMeta || {}); setPActive(code); };
  useEffect(() => {
    if (!open) { appliedOnce.current = false; return; }
    if (appliedOnce.current) return;
    appliedOnce.current = true;
    if (pActive && pViews.some(v => v.code === pActive)) applyPView(pActive);
  }, [open, pActive, pViews]);
  const [fldOrder, setFldOrder] = useState(() => { try { const v = JSON.parse(localStorage.getItem("nonamed.partner.fldOrder.v1")); return Array.isArray(v) ? v : null; } catch (e) { return null; } });
  useEffect(() => { try { localStorage.setItem("nonamed.partner.fldOrder.v1", JSON.stringify(fldOrder)); } catch (e) {} }, [fldOrder]);
  const [fldMeta, setFldMeta] = useState(() => { try { const v = JSON.parse(localStorage.getItem("nonamed.partner.fldMeta.v1")); return v && typeof v === "object" ? { ...CODE_FLD_DEFAULT, ...v, code: { ...CODE_FLD_DEFAULT.code, ...(v.code || {}) } } : { ...CODE_FLD_DEFAULT }; } catch (e) { return { ...CODE_FLD_DEFAULT }; } });
  useEffect(() => { try { localStorage.setItem("nonamed.partner.fldMeta.v1", JSON.stringify(fldMeta)); } catch (e) {} }, [fldMeta]);
  const [fldCfgFor, setFldCfgFor] = useState(null);
  const [lookupFor, setLookupFor] = useState(null);
  const [lkSug, setLkSug] = useState(null);
  const [newEntry, setNewEntry] = useState(null);
  useEffect(() => {
    window.__ccExtLookup = !!lookupFor;
    if (!lookupFor) return;
    const h = (e) => { if (e.key === "Escape") { e.stopImmediatePropagation(); e.preventDefault(); if (newEntry) { setNewEntry(null); return; } setLookupFor(null); } };
    window.addEventListener("keydown", h, true);
    return () => { window.removeEventListener("keydown", h, true); window.__ccExtLookup = false; };
  }, [lookupFor, newEntry]);
  const [editMode, setEditMode] = useState(false);
  const LK_BUILTIN = {
    "거래처": INITIAL_PARTNERS.map(p => `${p.id} · ${p.name}`),
    "품목": ["I-001 · 유기농 대파", "I-002 · 국내산 양파 15kg", "I-003 · 감자 20kg", "I-004 · 당근 10kg", "I-005 · 애호박 박스"],
    "재고": ["창고A", "창고B", "냉장1", "냉동1"],
  };
  const lkAll = (k) => {
    const cat = (fldMeta[k] || {}).srcCat || "";
    let lists = {}; try { lists = JSON.parse(localStorage.getItem("cc.customLists.v1") || "{}"); } catch (e) {}
    return lists[cat] || LK_BUILTIN[cat] || [];
  };
  const sugPos = (r, n) => {
    if (!r) return {};
    const h = Math.min(n * 34 + 8, 220);
    const below = window.innerHeight - r.bottom;
    const up = below < h + 12;
    return { position: "fixed", left: r.left, width: r.width, top: up ? undefined : r.bottom + 4, bottom: up ? window.innerHeight - r.top + 4 : undefined, maxHeight: h };
  };
  const lkOptions = (k) => {
    const q = (form[k] || "").trim().toLowerCase();
    if (!q) return [];
    return lkAll(k).filter(o => o.toLowerCase().includes(q) && o.toLowerCase() !== q);
  };
  const labelOf = (k, fallback) => (fldMeta[k] && fldMeta[k].label) || fallback;
  const dfltOf = (k) => (fldMeta[k] && fldMeta[k].dflt) || "";
  const [fldMenu, setFldMenu] = useState(null);
  const [addSlotOpen, setAddSlotOpen] = useState(false);
  const cellCfg = (k, label) => pcfg ? { onClick: (e) => { e.stopPropagation(); setFldMenu(m => (m && m.key === k ? null : { key: k, label })); } } : {};
  const CfgBtn = ({ k, label }) => pcfg ? (
    <span className="fld-menu-wrap">
      {fldMenu && fldMenu.key === k ? (
        <div className="fld-menu" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
          <div className="fld-menu-h"><span className="fld-menu-dot" />{label}</div>
          <button type="button" onClick={() => { setFldMenu(null); setFldCfgFor((() => { const sl = EXTRA_SLOTS.find(s => s.key === k); const m = fldMeta[k] || {}; return { key: k, label, dflt: dfltOf(k), type: sl ? (sl.type === "num" ? "money" : sl.type === "lookup" ? "lookup" : "text") : (k === "grp1" || k === "grp2" ? "lookup" : "dflt"), slot: sl ? sl.label : null, srcCat: m.srcCat, source: m.source, fmt: m.fmt, maxLen: m.maxLen, autoPat: m.autoPat }; })()); }}>설정</button>
          <button type="button" onClick={() => { setFldMenu(null); setAddSlotOpen(true); }}>항목 추가</button>
          <button type="button" onClick={() => { setFldMenu(null); cycleSpan(k); }}>너비 {spanOf(k) >= 12 ? "반칸으로" : "전체로"}</button>
          {k === "code" || k === "name" ? null : <button type="button" className="is-danger" onClick={() => { setFldMenu(null); setFldMeta(p => ({ ...p, [k]: { ...(p[k] || {}), hide: true, on: false } })); }}>삭제</button>}
        </div>
      ) : null}
    </span>
  ) : null;
  const [fldSpan, setFldSpan] = useState(() => { try { const v = JSON.parse(localStorage.getItem("nonamed.partner.fldSpan.v1")); return v && typeof v === "object" ? v : {}; } catch (e) { return {}; } });
  useEffect(() => { try { localStorage.setItem("nonamed.partner.fldSpan.v1", JSON.stringify(fldSpan)); } catch (e) {} }, [fldSpan]);
  const spanOf = (k) => { const v = fldSpan[k]; if (v === 1) return 6; if (v === 2) return 12; return v || (k === "addr" ? 12 : 6); };
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
  const [zipOpen, setZipOpen] = useState(false);
  const [resetAsk, setResetAsk] = useState(false);
  const doResetForm = () => {
    const base = { code: { fmt: "auto", autoPat: "00001", maxLen: 5 } };
    setFldMeta(base); setFldOrder(null); setFldSpan({}); setFldMenu(null);
    try {
      localStorage.setItem("nonamed.partner.fldMeta.v1", JSON.stringify(base));
      localStorage.removeItem("nonamed.partner.fldOrder.v1");
      localStorage.removeItem("nonamed.partner.fldSpan.v1");
    } catch (e) {}
    wf.resetWin();
    setForm(p => ({ ...p, code: nextAutoCode("00001", (existingCodes || []).map(c => String(c)), 5) }));
    setResetAsk(false);
  };
  const startColResize = (e, k) => {
    e.preventDefault(); e.stopPropagation();
    const grid = gridRef.current; if (!grid) return;
    const gw = grid.clientWidth, colW = gw / 12;
    const x0 = e.clientX, s0 = spanOf(k);
    const mv = (ev) => { const n = Math.max(2, Math.min(12, Math.round(s0 + (ev.clientX - x0) / colW))); setFldSpan(p => (p[k] === n ? p : { ...p, [k]: n })); };
    const up = () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
    window.addEventListener("mousemove", mv); window.addEventListener("mouseup", up);
  };
  const RzBtn = ({ k }) => pcfg ? <span className="fld-rz" title="드래그해서 너비 조절" onMouseDown={(e) => startColResize(e, k)} onClick={(e) => e.stopPropagation()} /> : null;
  const SpanBtn = () => null;
  const applyRule = (k, xtype, v) => {
    const m = fldMeta[k] || {};
    const fmt = m.fmt || (xtype === "num" ? "num" : "free");
    let out = v;
    if (fmt === "num") out = out.replace(/[^\d.-]/g, "");
    else if (fmt === "alnum") out = out.replace(/[^A-Za-z0-9\-]/g, "");
    else if (fmt === "ko") out = out.replace(/[^\u3131-\u318E\uAC00-\uD7A3\s]/g, "");
    if (m.maxLen) out = out.slice(0, m.maxLen);
    return out;
  };
  const xf = EXTRA_SLOTS.filter(s => fldMeta[s.key] && fldMeta[s.key].on && !fldMeta[s.key].hide);
  const labelFor = (k) => { const b = BASE_FIELDS.find(f => f.key === k); if (b) return b.label; const s = EXTRA_SLOTS.find(f => f.key === k); return s ? s.label : k; };
  const hiddenKeys = [...BASE_FIELDS, ...EXTRA_SLOTS].map(f => f.key).filter(k => fldMeta[k] && fldMeta[k].hide);
  const setSlotOn = (k, on) => setFldMeta(p => ({ ...p, [k]: { ...(p[k] || {}), on } }));
  useEffect(() => {
    if (!fldMenu) return;
    const fn = () => setFldMenu(null);
    window.addEventListener("mousedown", fn);
    return () => window.removeEventListener("mousedown", fn);
  }, [fldMenu]);
  const fldKeys = (() => {
    const base = [...BASE_FIELDS.map(f => f.key), ...xf.map(f => f.key)].filter(k => !(fldMeta[k] && fldMeta[k].hide));
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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      const defs = {};
      Object.keys(fldMeta || {}).forEach(k => { if (fldMeta[k] && fldMeta[k].dflt) defs[k] = fldMeta[k].dflt; });
      (xf || []).forEach(f => { if (f.dflt) defs[f.key] = f.dflt; });
      if (!initial) {
        Object.keys(fldMeta || {}).forEach(k => {
          const m = fldMeta[k];
          if (!m || m.fmt !== "auto") return;
          defs[k] = nextAutoCode(m.autoPat, (existingCodes || []).map(c2 => String(c2)), m.maxLen || 5);
        });
      }
      const pre = initial && initial.__prefill; // 다른 화면에서 검색어를 가지고 신규 진입 — 신규 기본값 + 이름만 채움
      setForm({ ...blank, ...(initial && !pre ? {} : defs), ...(pre ? { name: initial.name || "" } : (initial || {})) });
      setErrors({});
    }
  }, [open, initial?.id, JSON.stringify(fldMeta), JSON.stringify((xf || []).map(f => [f.key, f.dflt])), (existingCodes || []).length]);
  useEffect(() => { if (open) { const t = setTimeout(() => { const el = gridRef.current && gridRef.current.querySelector('.fld-code input, .fld input:not([disabled])'); if (el) { el.focus(); el.select && el.select(); } }, 60); return () => clearTimeout(t); } }, [open]);
  useEffect(() => { if (open) { setPcfg(false); setFldMenu(null); setPDonePrompt(false); } }, [open]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const fn = (e) => {
      if (e.key === "Escape") {
        if (newEntry) { e.stopImmediatePropagation(); e.preventDefault(); setNewEntry(null); return; }
        if (lookupFor) { e.stopImmediatePropagation(); e.preventDefault(); setLookupFor(null); return; }
        if (lkSug) { e.stopImmediatePropagation(); e.preventDefault(); setLkSug(null); return; }
        if (pSaveOpen || pOwCode || pRenameCode || pDelCode || pDonePrompt || fldCfgFor || addSlotOpen) return;
        e.stopImmediatePropagation(); e.preventDefault(); if (pcfg) { setPDonePrompt(true); return; } onClose();
      }
      if (e.key === "F8") { e.preventDefault(); const f = document.querySelector(".modal-root form.modal"); if (f) f.requestSubmit(); }
    };
    window.addEventListener("keydown", fn, true);
    return () => window.removeEventListener("keydown", fn, true);
  });

  // lock body scroll
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
    if (!form.code.trim())  next.code  = "거래처코드를 입력해 주세요.";
    else if ((existingCodes || []).some(c => c.toLowerCase() === form.code.trim().toLowerCase() && c !== (initial && initial.id))) next.code = "이미 사용 중인 거래처코드입니다.";
    if (!form.name.trim())  next.name  = "거래처명을 입력해 주세요.";
    xf.forEach(f => { if ((fldMeta[f.key] || {}).required && !(form[f.key] || "").trim()) next[f.key] = "필수 값입니다."; });
    setErrors(next);
    if (Object.keys(next).length) return;

    onSave?.(form, isEdit);

    setToast?.(`「${form.name}」 거래처가 ${isEdit ? "수정" : "등록"}되었습니다.`);

    if (afterSave === "목록으로" || isEdit) {
      onClose();
    } else {
      setForm(blank);
      setErrors({});
    }
  };

  const reset = () => { setForm(blank); setErrors({}); };

  return (
    <div className="modal-root" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-scrim" onClick={() => { if (pcfg) setPDonePrompt(true); }} />

      <form className="modal" onSubmit={submit} style={wf.winStyle}>
        <wf.WinResize />
        <header className="modal-head modal-head-drag" onMouseDown={wf.onWinDragDown}>
          <div>
            <h2 id="modal-title" className="modal-title">
              {isEdit ? "거래처 정보 수정" : "새 거래처 등록"}
            </h2>
            {pViews.length > 0 ? (() => { const av = pViews.find(v => v.code === pActive); return (
              <div className="active-view-wrap" style={{ marginTop: 6 }} onMouseDown={(e) => e.stopPropagation()}>
                <button type="button" className={`active-view ${av ? "" : "is-none"}`} title="화면 선택" onClick={() => setPViewPick(o => !o)}>
                  <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M4 7l8-3 8 3-8 3-8-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M4 12l8 3 8-3M4 17l8 3 8-3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
                  {av ? <React.Fragment><span className="active-view-code">{av.code}</span><span className="active-view-name">{av.name}</span></React.Fragment> : <span className="active-view-name">화면 선택</span>}
                  <span className="active-view-caret">{I.chevron}</span>
                </button>
                {pViewPick ? (
                  <React.Fragment>
                    <div className="vpm-scrim" onClick={() => setPViewPick(false)} />
                    <div className="vpm-menu active-view-menu">
                      <div className="vpm-menu-h">화면 선택</div>
                      <div className="vpm-list">
                        {pViews.map(v => (
                          <button key={v.code} type="button" className={`vpm-item vpm-pick ${v.code === pActive ? "is-on" : ""}`} onClick={() => { applyPView(v.code); setPViewPick(false); }}>
                            <span className="vpm-code">{v.code}</span>
                            <span className="vpm-name">{v.name}</span>
                            {v.code === pActive ? <span className="vpm-dot" /> : null}
                          </button>
                        ))}
                      </div>
                    </div>
                  </React.Fragment>
                ) : null}
              </div>
            ); })() : null}
          </div>
          <div className="modal-head-actions">
            <wf.WinTools />
            <ViewPresetMenu views={pViews} activeCode={pActive} enabled={pcfg}
              onApply={applyPView}
              onSaveNew={() => setPSaveOpen(true)}
              onOverwrite={(c) => setPOwCode(c)}
              onRename={(c) => setPRenameCode(c)}
              onDelete={(c) => setPDelCode(c)} />
            {pcfg ? <button type="button" className="btn-ghost btn-sm" title="기본 항목·순서·너비로 되돌리기" onClick={() => setResetAsk(true)}>초기화</button> : null}
            <button type="button" className={`btn-ghost btn-sm ${pcfg ? "is-on-cfg" : ""}`}
              onClick={() => { if (pcfg) setPDonePrompt(true); else { psnap.current = { fldOrder: fldOrder ? [...fldOrder] : null, fldSpan: { ...fldSpan }, fldMeta: { ...fldMeta } }; setPcfg(true); } }}>
              {I.cog} {pcfg ? "설정 완료" : "화면 설정"}
            </button>
            {isEdit ? (
              <button type="button" className="btn-ghost btn-danger" onClick={() => onDelete?.(initial)}>
                <span className="bi">{I.trash}</span> 삭제
              </button>
            ) : null}
            <button type="button" className="modal-close" aria-label="닫기" onClick={() => { if (pcfg) setPDonePrompt(true); else onClose(); }}>
              {I.close}
            </button>
          </div>
        </header>

        <div className={`modal-body cols-${formLayout === "1열" ? "1" : "2"}`}>
          <section className="fset fset-wide">
            <h3 className="fset-h">{pcfg ? <span className="fset-count">드래그해서 순서를 바꿀 수 있습니다</span> : null}</h3>
            <div className="fset-grid" ref={gridRef} onKeyDown={(e) => {
              if (e.key !== "Enter" || e.target.tagName !== "INPUT") return;
              e.preventDefault();
              const grid = e.currentTarget;
              const cells = [...grid.querySelectorAll(".fld")].sort((a, b) => (+getComputedStyle(a).order || 0) - (+getComputedStyle(b).order || 0));
              const list = [];
              cells.forEach(c => list.push(...c.querySelectorAll("input:not([disabled])")));
              const i = list.indexOf(e.target);
              if (i >= 0 && i + 1 < list.length) { list[i + 1].focus(); list[i + 1].select && list[i + 1].select(); }
            }}>
              {fldKeys.map(k => {
                const x = xf.find(f => f.key === k) || (k === "grp1" || k === "grp2" ? { key: k, label: labelFor(k), type: "lookup" } : null);
                const style = { order: orderOf(k) };
                const drag = pcfg ? fldDrag(k) : {};
                if (x) return (
                  <div className={"fld" + (pcfg ? " is-drag" : "")} key={k} style={{ ...style, ...spanStyle(k) }} {...drag} {...cellCfg(k, labelOf(k, x.label))}>
                    <RzBtn k={k} />
                    <span className="fld-label">{labelOf(k, x.label)}
                      {pcfg ? <span className={`xf-tag xf-${x.type}`}>{(EXTRA_SLOTS.find(s => s.key === k) || {}).label || ""}</span> : null}
                      {(fldMeta[k] || {}).required ? <span className="req">*</span> : null}
                      <CfgBtn k={k} label={labelOf(k, x.label)} />
                      <SpanBtn k={k} />
                    </span>
                    {x.type === "lookup" ? (
                      <div className="cc-lookup">
                        {(() => { const m = String(form[k] || "").match(/^(\S+)\s*·\s*(.+)$/); return (<React.Fragment>
                          <input className={`fld-input ${errors[k] ? "is-invalid" : ""}`} value={m ? m[2] : (form[k] || "")} autoComplete="off"
                          onDoubleClick={() => setLookupFor({ key: k, label: labelOf(k, x.label), cat: (fldMeta[k] || {}).srcCat || labelOf(k, x.label), q: (form[k] || "").trim() })}
                          onChange={(e) => { set(k)(e.target.value); setLkSug({ key: k, q: e.target.value, rect: e.target.getBoundingClientRect() }); }}
                          onBlur={(e) => { const v = e.target.value.trim(); const rect = e.target.getBoundingClientRect(); setTimeout(() => { setLkSug(s => (s && s.key === k ? null : s)); if (v && !lkAll(k).some(o => o.toLowerCase() === v.toLowerCase())) setLookupFor(f => f || { key: k, label: labelOf(k, x.label), cat: (fldMeta[k] || {}).srcCat || "", q: v }); }, 140); }}
                          onKeyDown={(e) => { if (e.key === "Enter") { const mm = lkOptions(k)[0]; if (mm) { e.preventDefault(); set(k)(mm); setLkSug(null); } else { const v = (form[k] || "").trim(); if (v && !lkAll(k).some(o => o.toLowerCase() === v.toLowerCase())) { e.preventDefault(); setLkSug(null); setLookupFor({ key: k, label: labelOf(k, x.label), cat: (fldMeta[k] || {}).srcCat || "", q: v }); } } } if (e.key === "Escape") setLkSug(null); }} />
                          {m ? <span className="cc-codechip">{m[1]}</span> : null}
                        </React.Fragment>); })()}
                        <button type="button" className="cc-lookup-btn" title="코드도움" onClick={() => setLookupFor({ key: k, label: labelOf(k, x.label), cat: (fldMeta[k] || {}).srcCat || labelOf(k, x.label) })}>{I.search}</button>
                        {lkSug && lkSug.key === k && (form[k] || "").trim() && lkOptions(k).length ? (
                          <div className="cc-sug" style={sugPos(lkSug.rect, Math.min(lkOptions(k).length, 8))}>
                            {lkOptions(k).slice(0, 8).map((o, i) => (
                              <button key={o + i} type="button" className="cc-sug-item" onMouseDown={(e) => { e.preventDefault(); set(k)(o); setLkSug(null); }}>{o}</button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <input className={`fld-input ${x.type === "num" || (fldMeta[k] || {}).fmt === "num" ? "is-mono" : ""} ${errors[k] ? "is-invalid" : ""}`} inputMode={x.type === "num" || (fldMeta[k] || {}).fmt === "num" ? "numeric" : undefined}
                        maxLength={(fldMeta[k] || {}).maxLen || undefined}
                        value={form[k] || ""} onChange={(e) => set(k)(applyRule(k, x.type, e.target.value))} />
                    )}
                    {errors[k] ? <div className="fset-err">{errors[k]}</div> : null}
                  </div>
                );
                const d = BASE_FIELDS.find(b => b.key === k);
                if (!d) return null;
                if (k === "addr") return (
                  <div className={"fld" + (pcfg ? " is-drag" : "")} key={k} style={{ ...style, ...spanStyle(k) }} {...drag} {...cellCfg("addr", labelOf("addr", "주소"))}>
                    <RzBtn k={k} />
                    <span className="fld-label">{labelOf("addr", "주소")}<CfgBtn k="addr" label={labelOf("addr", "주소")} /><SpanBtn k={k} /></span>
                    <div className="addr-row">
                      <input type="text" className="fld-input is-mono zip" value={form.zip} onChange={(e) => set("zip")(e.target.value.replace(/\D/g, "").slice(0, 5))} placeholder="우편번호" inputMode="numeric" />
                      <button type="button" className="btn-ghost btn-find" onClick={() => setZipOpen(true)}>{I.search} 우편번호 찾기</button>
                    </div>
                    <input type="text" className="fld-input" value={form.addr} onChange={(e) => set("addr")(e.target.value)} placeholder="기본 주소" />
                    <input type="text" className="fld-input" value={form.addrDetail} onChange={(e) => set("addrDetail")(e.target.value)} placeholder="상세 주소 (동·호수 등)" />
                  </div>
                );
                if (k === "kind") return (
                  <div className={"fld" + (pcfg ? " is-drag" : "")} key={k} style={{ ...style, ...spanStyle(k) }} {...drag} {...cellCfg("kind", labelOf("kind", "거래처 구분"))}>
                    <RzBtn k={k} />
                    <SegmentField label={<>{labelOf("kind", "거래처 구분")}<CfgBtn k="kind" label={labelOf("kind", "거래처 구분")} /><SpanBtn k={k} /></>} required value={form.kind} onChange={set("kind")} options={KIND_OPTIONS} />
                  </div>
                );
                return (
                  <div className={"fld" + (pcfg ? " is-drag" : "")} key={k} style={{ ...style, ...spanStyle(k) }} {...drag} {...cellCfg(k, labelOf(k, d.label))}>
                    <RzBtn k={k} />
                    <span className="fld-label">{labelOf(k, d.label)}{d.required ? <span className="req">*</span> : null}<CfgBtn k={k} label={labelOf(k, d.label)} /><SpanBtn k={k} /></span>
                    <input type={d.type || "text"} className={`fld-input ${d.mono ? "is-mono" : ""} ${errors[k] ? "is-invalid" : ""}`} inputMode={d.inputMode}
                      maxLength={(fldMeta[k] || {}).maxLen || undefined}
                      value={form[k] || ""}
                      onChange={(e) => { const raw = (fldMeta[k] || {}).fmt ? applyRule(k, null, e.target.value) : e.target.value; set(k)(d.format ? d.format(raw) : raw); }}
                      placeholder={d.placeholder || ""} />
                    {errors[k] ? <div className="fset-err">{errors[k]}</div> : null}
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
            {pcfg ? (
              <button type="button" className="btn-primary" onClick={() => setPDonePrompt(true)}>설정 완료</button>
            ) : (
              <button type="submit" className="btn-primary">
                {isEdit ? "수정저장" : "저장"} <kbd className="btn-kbd">F8</kbd>
              </button>
            )}
            {isEdit ? null : null}
          </div>
        </footer>
      </form>
      {lookupFor ? (() => {
        let lists = {}; try { lists = JSON.parse(localStorage.getItem("cc.customLists.v1") || "{}"); } catch (e) {}
        const BUILTIN = {
          "거래처": INITIAL_PARTNERS.map(p => `${p.id} · ${p.name}`),
          "품목": ["I-001 · 유기농 대파", "I-002 · 국내산 양파 15kg", "I-003 · 감자 20kg", "I-004 · 당근 10kg", "I-005 · 애호박 박스"],
          "재고": ["창고A", "창고B", "냉장1", "냉동1"],
        };
        const all = lists[lookupFor.cat] || BUILTIN[lookupFor.cat] || [];
        const q = (lookupFor.q || "").trim();
        const opts = q ? all.filter(o => o.toLowerCase().includes(q.toLowerCase())) : all;
        const nextCode = () => {
          const nums = all.map(o => { const m = String(o).match(/(\d{3,})/); return m ? parseInt(m[1], 10) : 0; });
          const mx = nums.length ? Math.max(...nums) : 0;
          return String(mx + 1).padStart(5, "0");
        };
        const addNew = () => { setNewEntry({ code: nextCode(), name: q, orig: null }); };
        const isCustom = !!(lookupFor.cat && !BUILTIN[lookupFor.cat]);
        const writeList = (arr) => { const next = { ...lists, [lookupFor.cat]: arr }; try { localStorage.setItem("cc.customLists.v1", JSON.stringify(next)); } catch (e) {} };
        const saveNewEntry = () => {
          const code = (newEntry.code || "").trim(), nm = (newEntry.name || "").trim();
          if (!code || !nm) return;
          const val = `${code} · ${nm}`;
          if (isCustom) {
            const cur = lists[lookupFor.cat] || [];
            writeList(newEntry.orig ? cur.map(o => o === newEntry.orig ? val : o) : [...cur, val]);
          }
          if (lookupFor.key) { set(lookupFor.key)(val); setLookupFor(null); }
          setNewEntry(null);
          setToast && setToast(newEntry.orig ? `「${nm}」로 수정했습니다.` : `「${nm}」를 등록했습니다.`);
        };
        const deleteEntry = () => {
          if (!isCustom || !newEntry.orig) return;
          writeList((lists[lookupFor.cat] || []).filter(o => o !== newEntry.orig));
          setNewEntry(null); setLookupFor(f => ({ ...f }));
          setToast && setToast("항목을 삭제했습니다.");
        };
        return (
          <div className="pick-root" role="dialog" aria-modal="true">
            <div className="pick-scrim" onClick={() => setLookupFor(null)} />
            <div className="pick-box">
              <header className="pick-head">
                <h3>{lookupFor.label} 검색</h3>
                <button type="button" className="modal-close" onClick={() => setLookupFor(null)}>{I.close}</button>
              </header>
              <div className="pick-search">
                <span className="pick-ico">{I.search}</span>
                <input autoFocus value={lookupFor.q || ""} placeholder="검색어를 입력하세요"
                  onChange={(e) => setLookupFor(f => ({ ...f, q: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); if (opts[0]) { set(lookupFor.key)(opts[0]); setLookupFor(null); } else addNew(); }
                    else if (e.key === "F2") { e.preventDefault(); addNew(); }
                    else if (e.key === "Escape") { e.preventDefault(); setLookupFor(null); }
                  }} />
              </div>
              <div className="pick-table">
                <div className="pick-trow pick-thead" style={{ gridTemplateColumns: "110px 1fr auto" }}><div className="pk-cell">코드</div><div className="pk-cell">{lookupFor.cat || lookupFor.label}</div><div className="pk-cell">{editMode && isCustom ? "클릭하여 수정" : ""}</div></div>
                <div className="pick-tbody">
                  {opts.length === 0 ? <div className="pick-empty">{q ? `「${q}」와 일치하는 항목이 없습니다.` : "등록된 항목이 없습니다."}</div> : null}
                  {opts.map((o, i) => { const mm = String(o).match(/^(\S+)\s*·\s*(.+)$/); return (
                    <div key={o + i} className="pick-trow pick-opt" style={{ gridTemplateColumns: "110px 1fr auto", cursor: "pointer" }} onClick={() => { if (lookupFor.onPick) { lookupFor.onPick(o); setLookupFor(null); } else if ((editMode || !lookupFor.key) && isCustom) { const m = String(o).match(/^(\S+)\s*·\s*(.+)$/); setNewEntry({ code: m ? m[1] : "", name: m ? m[2] : o, orig: o }); } else if (lookupFor.key) { set(lookupFor.key)(o); setLookupFor(null); } }}>
                      <div className="pk-cell is-mono" style={{ color: "var(--accent-ink)" }}>{mm ? mm[1] : ""}</div>
                      <div className="pk-cell is-strong">{mm ? mm[2] : o}</div>
                      {editMode && isCustom ? <span className="pk-cell" style={{ color: "var(--accent-ink)", fontSize: 12 }}>수정</span> : <div />}
                    </div>
                  ); })}
                </div>
              </div>
              <footer className="pick-foot">
                <span className="pick-foot-cnt">{opts.length}건 · {editMode ? "항목 클릭 · 수정" : "Enter 선택 · F2 신규"}</span>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {isCustom ? <button type="button" className={`btn-ghost btn-sm ${editMode ? "is-on-cfg" : ""}`} onClick={() => setEditMode(v => !v)}>{editMode ? "수정 종료" : "수정"}</button> : null}
                  {isCustom || q ? <button type="button" className="pick-new" onClick={addNew}>+ 신규 <kbd className="btn-kbd">F2</kbd></button> : null}
                </div>
              </footer>
            </div>
            {newEntry ? (
              <div className="modal-root" style={{ zIndex: 140 }} onMouseDown={(e) => { if (e.target === e.currentTarget) setNewEntry(null); }}>
                <div className="modal" style={{ width: 380, maxWidth: "92vw" }}>
                  <header className="modal-head"><div><h2 className="modal-title">{newEntry.orig ? "항목 수정" : "신규"}</h2><div className="modal-sub">{lookupFor.cat || lookupFor.label} 리스트{newEntry.orig ? " 항목을 수정합니다." : "에 추가합니다."}</div></div><button type="button" className="modal-close" onClick={() => setNewEntry(null)}>{I.close}</button></header>
                  <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <label className="fld"><span className="fld-label">검색코드</span>
                      <input className="fld-input is-mono" value={newEntry.code} onChange={(e) => setNewEntry(p => ({ ...p, code: e.target.value.replace(/[^\d]/g, "") }))} placeholder="00001" />
                      <span className="fld-hint" style={{ marginTop: 4 }}>자동 부여된 번호입니다. 수정 가능합니다.</span>
                    </label>
                    <label className="fld"><span className="fld-label">검색명</span>
                      <input className="fld-input" autoFocus value={newEntry.name} onChange={(e) => setNewEntry(p => ({ ...p, name: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); saveNewEntry(); } }} placeholder="예: 광주" />
                    </label>
                  </div>
                  <footer className="modal-foot"><div className="ff-left">{newEntry.orig ? <button type="button" className="btn-ghost" style={{ color: "var(--bad)" }} onClick={deleteEntry}>삭제</button> : null}</div><div className="ff-right">
                    <button type="button" className="btn-ghost" onClick={() => setNewEntry(null)}>취소</button>
                    <button type="button" className="btn-primary" onClick={saveNewEntry}>저장 <kbd className="btn-kbd">F8</kbd></button>
                  </div></footer>
                </div>
              </div>
            ) : null}
          </div>
        );
      })() : null}
      <ConfirmModal open={resetAsk} title="양식 초기화" message="현재 입력 양식을 기본 상태로 되돌릴까요? 추가한 항목·순서·너비 설정은 사라지고, 거래처코드는 00001 자동부여로 재설정됩니다." confirmLabel="초기화" danger onConfirm={doResetForm} onClose={() => setResetAsk(false)} />
      {zipOpen ? <ZipFindModal onPick={(z, a) => { set("zip")(z); set("addr")(a); setZipOpen(false); }} onClose={() => setZipOpen(false)} /> : null}
      {fldCfgFor ? <AddColModal onManageList={(cat) => setLookupFor({ key: null, label: cat, cat, q: "" })} onPickValue={(cat, cb) => setLookupFor({ key: null, label: cat, cat, q: "", onPick: cb })} initial={{ ...fldCfgFor, required: !!(fldMeta[fldCfgFor.key] || {}).required }} types={["dflt"]} noFmt={fldCfgFor.key !== "code"} onAdd={(c) => { setFldMeta(p => ({ ...p, [fldCfgFor.key]: { ...(p[fldCfgFor.key] || {}), label: c.label, dflt: c.dflt || "", srcCat: c.srcCat, source: c.source, fmt: c.fmt, maxLen: c.maxLen, autoPat: c.autoPat, required: c.required } })); setFldCfgFor(null); }} onClose={() => setFldCfgFor(null)} /> : null}
      <ColPickModal open={addSlotOpen} scope="거래처"
        baseKeys={BASE_FIELDS.map(d => d.label)}
        activeSlots={EXTRA_SLOTS.map(s => ({ key: s.label, label: (fldMeta[s.key] || {}).label || s.label, type: s.type === "num" ? "money" : s.type === "lookup" ? "lookup" : "text" }))}
        existing={[
          ...BASE_FIELDS.filter(d => !(fldMeta[d.key] || {}).hide).map(d => ({ label: d.label })),
          ...EXTRA_SLOTS.filter(s => fldMeta[s.key] && fldMeta[s.key].on).map(s => ({ label: s.label })),
        ]}
        onApply={(cols) => {
          setFldMeta(p => {
            const next = { ...p };
            cols.forEach(c => {
              const base = BASE_FIELDS.find(d => d.label === c.label);
              if (base) { next[base.key] = { ...(next[base.key] || {}), hide: false }; return; }
              const slot = EXTRA_SLOTS.find(s => s.label === c.label);
              if (slot) next[slot.key] = { ...(next[slot.key] || {}), on: true, hide: false, label: (next[slot.key] || {}).label || slot.label };
            });
            return next;
          });
        }}
        onClose={() => setAddSlotOpen(false)} />
      {null}
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

/* ─────────────────────────────────────────────
   App
   ───────────────────────────────────────────── */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const cc = useColConfig({ allColumns: ALL_COLUMNS, defaultVisible: DEFAULT_VISIBLE_COLS, prefix: "nonamed.partners" });
  const visibleColumns = cc.visibleCols;
  const displayCols = cc.visibleCols;
  const dragKey = useRef(null);
  const [colPop, setColPop] = useState(null);
  const [addColOpen, setAddColOpen] = useState(false);
  const srcGroups = React.useMemo(() => {
    let fm = {}; try { fm = JSON.parse(localStorage.getItem("nonamed.partner.fldMeta.v1")) || {}; } catch (e) {}
    const mk = (arr) => arr.map(f => ({ value: f.label, alias: (fm[f.key] || {}).label || "" }));
    return [{ title: "기준키", items: mk(BASE_FIELDS) }, { title: "추가항목키", items: mk(EXTRA_SLOTS).filter((_, i) => (fm[EXTRA_SLOTS[i].key] || {}).on) }];
  }, [addColOpen, editCol]);
  const [editCol, setEditCol] = useState(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [viewPickOpen, setViewPickOpen] = useState(false);
  const [renameCode, setRenameCode] = useState(null);
  const [owCode, setOwCode] = useState(null);
  const [delCode, setDelCode] = useState(null);
  const openColPop = (e, col) => { const cell = e.currentTarget; const card = cell.closest(".table-card"); const cr = card ? card.getBoundingClientRect() : { left: 0, top: 0 }; const b = cell.getBoundingClientRect(); setColPop({ key: col.key, x: b.left - cr.left + b.width / 2, y: b.bottom - cr.top + 4 }); };
  const [tmpW, setTmpW] = useState({});
  const [listResetAsk, setListResetAsk] = useState(false);
  const [listDonePrompt, setListDonePrompt] = useState(false);
  const listCfgSnap = useRef(null);
  const enterListCfg = () => { listCfgSnap.current = cc.snapshot(); cc.setCfg(true); };
  const finishListCfg = () => {
    if (listCfgSnap.current && JSON.stringify(cc.snapshot()) === JSON.stringify(listCfgSnap.current)) { cc.setCfg(false); showToast("변경사항이 없어 설정을 종료했어요", "info"); }
    else setListDonePrompt(true);
  };
  const cancelListCfg = () => { setListDonePrompt(false); if (listCfgSnap.current) cc.restore(listCfgSnap.current); cc.setCfg(false); };
  const startResize = (e, col) => { e.preventDefault(); e.stopPropagation(); const sx = e.clientX; const sw = parseInt(tmpW[col.key] || col.width) || 120; const move = (ev) => { const w = Math.max(60, sw + ev.clientX - sx); if (cc.cfg) cc.setWidth(col.key, w); else setTmpW(p => ({ ...p, [col.key]: w })); }; const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); }; window.addEventListener("mousemove", move); window.addEventListener("mouseup", up); };

  const [partners, setPartners] = usePersistedList(NM_LIST_KEY.거래처, INITIAL_PARTNERS);
  const [query, setQuery] = useState("");
  const [kindFilter, setKindFilter] = useState("전체");
  const [searchOpen, setSearchOpen] = useState(false);
  const [cond, setCond] = useState({});
  const [dcond, setDcond] = useState({});
  useEffect(() => { if (searchOpen) setDcond(cond); }, [searchOpen]);
  const [checked, setChecked] = useState(() => new Set());

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);
  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 2400);
  };

  const exportExcel = () => {
    const cols = cc.visibleCols.filter(c => c.key !== "print");
    const headers = cols.map(c => c.label);
    const matrix = filtered.map(p => cols.map(c => {
      if (c.isCustom) return calcFlatCol(c.def, p, SRC_COLUMNS) || "";
      const v = p[c.key] ?? (c.key === "code" ? p.id : "");
      return v == null ? "" : String(v);
    }));
    const esc = (v) => { const s = v == null ? "" : String(v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    const lines = [headers.map(esc).join(","), ...matrix.map(r => r.map(esc).join(","))];
    const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `거래처목록_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(`거래처 ${filtered.length}건을 내려받았습니다.`);
  };

  const searchFields = useMemo(() => {
    let meta = {}; try { meta = JSON.parse(localStorage.getItem("nonamed.partner.fldMeta.v1")) || {}; } catch (e) {}
    const base = BASE_FIELDS.filter(f => !(meta[f.key] && meta[f.key].hide)).map(f => ({ key: f.key, label: (meta[f.key] && meta[f.key].label) || f.label }));
    const slots = EXTRA_SLOTS.filter(s => meta[s.key] && meta[s.key].on && !meta[s.key].hide).map(s => ({ key: s.key, label: (meta[s.key] || {}).label || s.label }));
    return [...base, ...slots];
  }, [searchOpen]);

  const filtered = useMemo(() => {
    const has = (v, s) => !String(v || "").trim() || (s || "").toLowerCase().includes(String(v).trim().toLowerCase());
    return partners.filter(p => {
      for (const f of searchFields) {
        const v = cond[f.key];
        if (!v) continue;
        const pv = f.key === "code" ? (p.code || p.id) : p[f.key];
        if (!has(v, pv)) return false;
      }
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return [p.code || p.id, p.name, p.ceo, p.phone, p.mobile, p.biz, p.addr].some(s => (s || "").toLowerCase().includes(q));
    });
  }, [partners, query, cond, searchFields]);

  const toggle = (id) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const printPartner = (p) => {
    const rows = ALL_COLUMNS.map(c => [c.label, (c.key === "code" ? (p.code || p.id) : p[c.key]) || "-"]);
    const w = window.open("", "_blank", "width=760,height=900");
    if (!w) return;
    w.document.write('<html><head><title>' + (p.name || "거래처") + ' 정보</title><style>body{font-family:"IBM Plex Sans KR",sans-serif;padding:36px;color:#1F1A14}h1{font-size:20px;margin:0 0 18px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px 10px;font-size:13px;text-align:left}th{background:#F6F1E8;width:140px}</style></head><body>');
    w.document.write('<h1>' + (p.name || "") + ' 거래처 정보</h1><table>' + rows.map(r => '<tr><th>' + r[0] + '</th><td>' + String(r[1]) + '</td></tr>').join("") + '</table>');
    w.document.write('</body></html>');
    w.document.close(); w.focus(); w.print();
  };
  const PAGE_SIZE = 100;
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((Math.min(page, pageCount) - 1) * PAGE_SIZE, Math.min(page, pageCount) * PAGE_SIZE);
  const toggleAll = () => {
    if (checked.size === filtered.length) setChecked(new Set());
    else setChecked(new Set(filtered.map(p => p.id)));
  };
  const allChecked = filtered.length > 0 && checked.size === filtered.length;

  const openNew = () => { if (cc.cfg) return; setEditing(null); setModalOpen(true); };
  const [tab, setTab] = useState(() => new URLSearchParams(window.location.search).get("tab") === "활동" ? "활동" : "거래처");
  useNavTab("partners", tab, setTab);
  const cfgRef = useRef(false);
  const rowDrag = useRef(null);
  useEffect(() => { const up = () => { rowDrag.current = null; }; window.addEventListener("mouseup", up); return () => window.removeEventListener("mouseup", up); }, []);
  cfgRef.current = cc.cfg;
  const tabRef = useRef(tab); tabRef.current = tab;
  useEffect(() => { const fn = (e) => { if (e.key === "F2" && tabRef.current === "거래처" && !modalOpen && !cfgRef.current) { e.preventDefault(); openNew(); } }; window.addEventListener("keydown", fn); return () => window.removeEventListener("keydown", fn); }, [modalOpen]);
  const openEdit = (p) => { if (cc.cfg) return; setEditing(p); setModalOpen(true); };
  useHotkeys({ F9: () => { if (tabRef.current === "거래처" && !cc.cfg) setSearchOpen(true); }, F10: () => { if (tabRef.current !== "거래처") return; if (cc.cfg) finishListCfg(); else enterListCfg(); } });
  useEffect(() => {
    if (!searchOpen) return;
    const fn = (e) => { if (e.key === "F8") { e.preventDefault(); setSearchOpen(false); } };
    window.addEventListener("keydown", fn, true);
    return () => window.removeEventListener("keydown", fn, true);
  }, [searchOpen]);

  const handleSave = (form, isEdit) => {
    if (isEdit) {
      setPartners(prev => prev.map(p => p.id === editing.id ? stampSaved({
        ...p,
        ...form,
        id: form.code || p.id,
        code: form.code || p.code || p.id,
        name: form.name, ceo: form.ceo, phone: form.phone,
        addr: [form.addr, form.addrDetail].filter(Boolean).join(" "),
        mgr: form.mgrName || p.mgr,
        kind: form.kind, payment: form.payment, biz: form.biz,
      }) : p));
    } else {
      const nextId = form.code || ("P-" + String(partners.length + 1).padStart(3, "0"));
      setPartners(prev => [stampSaved({
        ...form,
        id: nextId,
        name: form.name, ceo: form.ceo, phone: form.phone,
        addr: [form.addr, form.addrDetail].filter(Boolean).join(" "),
        mgr: form.mgrName || "—",
        kind: form.kind, payment: form.payment, biz: form.biz,
      }), ...prev]);
    }
  };

  // 매입·매출 전표에 쓰인 거래처는 삭제 불가
  const partnerDocCount = (name) => { let n = 0; ["매입", "매출"].forEach(k => { (readDocs(k) || []).forEach(d => { if (d.partner === name && !d.deleted) n++; }); }); return n; };
  const handleDelete = async (p) => {
    const used = partnerDocCount(p.name);
    if (used) { const r = await nmConfirm({ title: "삭제할 수 없음", message: `「${p.name}」 거래처는 매입·매출 전표 ${used}건에 사용 중입니다. 전표를 바꾼 뒤 삭제해 주세요.`, confirmLabel: "확인", extraLabel: "내역 보기" }); if (r === "extra") await nmDocList({ title: `「${p.name}」 사용 전표`, docs: nmUsedDocs({ partner: p.name }) }); return; }
    if (!(await nmConfirm({ title: "거래처 삭제", message: `「${p.name}」 거래처를 삭제할까요?`, confirmLabel: "삭제", danger: true }))) return;
    setPartners(prev => prev.filter(x => x.id !== p.id));
    setModalOpen(false);
    showToast(`「${p.name}」 거래처가 삭제되었습니다.`);
  };

  const handleBulkDelete = async () => {
    if (checked.size === 0) return;
    const blocked = partners.filter(p => checked.has(p.id) && partnerDocCount(p.name) > 0);
    if (blocked.length) { const r = await nmConfirm({ title: "삭제할 수 없음", message: `${blocked.map(p => "「" + p.name + "」").join(", ")} — 매입·매출 전표에 사용 중인 거래처가 포함되어 있습니다. 해당 거래처를 선택 해제한 뒤 다시 시도해 주세요.`, confirmLabel: "확인", extraLabel: "내역 보기" }); if (r === "extra") await nmDocList({ title: "사용 중인 전표", docs: blocked.flatMap(p => nmUsedDocs({ partner: p.name })) }); return; }
    if (!(await nmConfirm({ title: "선택 삭제", message: `선택한 ${checked.size}개 거래처를 삭제할까요? 삭제 후에는 되돌릴 수 없습니다.`, confirmLabel: "삭제", danger: true }))) return;
    setPartners(prev => prev.filter(p => !checked.has(p.id)));
    showToast(`${checked.size}개 거래처가 삭제되었습니다.`);
    setChecked(new Set());
  };

  return (
    <div className="layout">
      <Sidebar active="partners" />

      <div className="main">
        <TopBar />

        {tab === "활동" && window.ActivityApp ? <window.ActivityApp embedded onView={setTab} /> : (
        <div className={`content ${cc.cfg ? "is-cfg-mode" : ""}`}>
          <header className="page-head">
            <div className="page-head-l">
              <h1 className="page-title">거래처</h1>
              <button type="button" className="btn-primary title-add" disabled={cc.cfg} title={cc.cfg ? "화면 설정 중에는 사용할 수 없습니다" : undefined} onClick={() => { if (cc.cfg) return; openNew(); }}>{I.plus} 새 거래처 <kbd className="btn-kbd">F2</kbd></button>
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

          {window.ActivityApp ? (
            <div className="view-row"><div className="view-tabs">
              {["거래처", "활동"].map(v => <button key={v} type="button" className={`view-tab ${tab === v ? "is-on" : ""} ${cc.cfg ? "is-disabled" : ""}`} disabled={cc.cfg} onClick={() => { if (!cc.cfg) setTab(v); }}>{v}</button>)}
            </div></div>
          ) : null}

          {/* toolbar */}
          <div className="period-bar">
            <button type="button" className="period-search" disabled={cc.cfg} title={cc.cfg ? "화면 설정 중에는 사용할 수 없습니다" : undefined} onClick={() => { if (cc.cfg) return; setSearchOpen(true); }}>{I.search} 조건 검색</button>
            <SearchCondChips items={searchFields.map(f => ({ key: f.key, label: f.label, value: cond[f.key] }))} onClear={() => { setCond({}); setDcond({}); }} />
          </div>

          <div className="toolbar">
            <div className="list-search">
              <span className="ls-icon">{I.search}</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="거래처코드, 거래처명, 대표, 전화, 휴대전화, 사업자, 주소 검색"
              />
            </div>

            <div className="tb-meta">
              <span><b>{filtered.length}</b>곳 표시</span>
              {checked.size > 0 ? (
                <>
                  <span className="tb-sel">{checked.size}곳 선택됨</span>
                  <button type="button" className="btn-ghost btn-danger btn-sm" onClick={handleBulkDelete}>
                    {I.trash} 선택 삭제
                  </button>
                </>
              ) : null}
            </div>
          </div>

          {/* table */}
          <div
            className="table-card"
            style={{
              "--cols-template": "84px " + displayCols.map(c => (cc.cfg && c.hidden) ? "110px" : (tmpW[c.key] ? tmpW[c.key] + "px" : String(c.width).replace(/minmax\(\s*([\d.]+px)\s*,[^)]*\)/, "$1"))).join(" ") + " 56px",
              "--row-min": "max-content"            }}
          >
            {cc.cfg ? (
              <div className="cfg-hint">
                <button type="button" className="cfg-reset" onClick={cc.resetCols}>↺ 기본값</button>
              </div>
            ) : null}
            {cc.cfg && colPop ? (() => { const pc = cc.allCols.find(c => c.key === colPop.key); return <ColCfgPopover col={pc} x={colPop.x} y={colPop.y} onAddNew={() => setAddColOpen(true)} onRename={cc.renameCol} onToggle={cc.toggleCol} onRemove={cc.removeCol} onEdit={(def) => setEditCol(def)} onClose={() => setColPop(null)} />; })() : null}
            <div className="t-scroll">
            <div className="t-row t-head">
              <div className="tc-check">
                <button
                  type="button"
                  className={`cbx ${allChecked ? "is-on" : ""}`}
                  aria-label="전체 선택"
                  onClick={toggleAll}
                >{allChecked ? I.check : null}</button>
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
                조건에 맞는 거래처가 없습니다.
                <button type="button" className="btn-link" onClick={() => { setQuery(""); setCond({}); }}>
                  필터 초기화
                </button>
              </div>
            ) : null}

            {paged.map((p, rowIdx) => {
              const on = checked.has(p.id);
              return (
                <div
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  className={`t-row ${on ? "is-checked" : ""} ${isRecent(p) ? "row-new" : ""}`}
                  onClick={() => openEdit(p)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); openEdit(p); }
                  }}
                >
                  <div className="tc-check" onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => { e.preventDefault(); rowDrag.current = { val: !on }; toggle(p.id); }}
                    onMouseEnter={() => { const d = rowDrag.current; if (d && checked.has(p.id) !== d.val) toggle(p.id); }}>
                    <button
                      type="button"
                      className={`cbx ${on ? "is-on" : ""} ${isRecent(p) ? "cbx-new" : ""}`}
                      aria-label="선택"
                    >{on ? I.check : null}</button>
                    {isRecent(p) ? <span className="new-flag" title="오늘 입력·수정한 건">최근작성</span> : null}
                  </div>
                  {displayCols.map(c => (
                    <div key={c.key} className={`tc tc-${c.key} ck-${c.kind} ${cc.cfg && c.hidden ? "is-colhidden" : ""}`}>
                      {c.isCustom && (c.def.source === "순번" || c.def.slot === "순번") ? (
                        <span className="tc-val is-mono">{(Math.min(page, pageCount) - 1) * PAGE_SIZE + rowIdx + 1}</span>
                      ) : c.isCustom && (c.def.source === "인쇄" || c.def.slot === "인쇄") ? (
                        <button type="button" className="btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); printPartner(p); }}>인쇄</button>
                      ) : c.isCustom ? (
                        <span className="tc-val">{calcFlatCol(c.def, p, SRC_COLUMNS) || "—"}</span>
                      ) : c.kind === "chip" && c.key === "kind" ? (
                        <span className={`kind-chip k-${p.kind}`}>{p.kind}</span>
                      ) : c.kind === "name" ? (
                        <span className="ln-text">{p.name}</span>
                      ) : (
                        <span className="tc-val">{(c.key === "code" ? p.code || p.id : p[c.key]) || "—"}</span>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
            </div>
          </div>
          {pageCount > 1 ? (
            <div className="pager">
              <button type="button" className="btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>이전</button>
              <span className="pager-info">{Math.min(page, pageCount)} / {pageCount} · 총 {filtered.length}건</span>
              <button type="button" className="btn-ghost btn-sm" disabled={page >= pageCount} onClick={() => setPage(p => Math.min(pageCount, p + 1))}>다음</button>
            </div>
          ) : null}
        </div>
        )}
      </div>

      <PartnerModal
        open={modalOpen}
        existingCodes={partners.map(p => p.id)}
        initial={editing ? {
          ...editing,
          id: editing.id,
          code: editing.code || editing.id,
          mgrName: editing.mgrName || editing.mgr || "",
        } : null}
        formLayout={t.formLayout}
        afterSave={t.afterSave}
        setAfterSave={(v) => setTweak("afterSave", v)}
        showHelper={t.showHelper}
        onSave={handleSave}
        onDelete={handleDelete}
        onClose={() => setModalOpen(false)}
        setToast={showToast}
      />

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
      <ConfirmModal open={listResetAsk} title="화면 초기화" message="목록 화면을 기본 구성으로 되돌릴까요? 추가한 열·순서·너비·이름 설정이 사라집니다." confirmLabel="초기화" danger onConfirm={() => { cc.resetCols(); setTmpW({}); setListResetAsk(false); showToast("기본 구성으로 되돌렸습니다."); }} onClose={() => setListResetAsk(false)} />
      <ColPickModal open={addColOpen} scope="거래처" baseKeys={LIST_SRC_GROUPS["입력 기술키"]} srcGroups={LIST_SRC_GROUPS} activeSlots={activeEntrySlots()} existing={(cc.allCols || []).map(c => ({ label: c.label }))} onApply={(cols) => cc.addCustomMany(cols)} onClose={() => setAddColOpen(false)} />
      {editCol ? <AddColModal activeSlots={activeEntrySlots()} types={["source","formula","money","dflt"]} srcGroups={LIST_SRC_GROUPS} initial={editCol} existing={(cc.customCols || []).map(c => ({ code: c.code, label: c.label, type: c.type, slot: c.slot }))} onAdd={(c) => { if (editCol._base) cc.renameCol(editCol.key, c.label); else cc.updateCustom(editCol.key, c); setEditCol(null); }} onClose={() => setEditCol(null)} /> : null}
      <SearchCondModal open={searchOpen} prefix="partners" sub="거래처 입력화면에 적용된 항목으로 검색합니다."
        fields={searchFields.map(f => ({ key: f.key, label: f.label, node: (
          <label className="fld" key={f.key}><span className="fld-label">{f.label}</span>
            <input type="text" className="fld-input" value={dcond[f.key] || ""} onChange={(e) => setDcond(c => ({ ...c, [f.key]: e.target.value }))} placeholder={f.label} /></label>
        ) }))}
        onReset={() => { setDcond({}); setCond({}); setQuery(""); }}
        onSearch={() => { setCond(dcond); setSearchOpen(false); }} onClose={() => setSearchOpen(false)} />
      <SaveViewModal open={saveOpen} code={nextViewCode(cc.views)} onSave={(n) => { cc.saveView(n); setSaveOpen(false); }} onClose={() => setSaveOpen(false)} />
      <SaveViewModal open={!!renameCode} title="화면 이름 변경" saveLabel="변경" initialName={(cc.views.find(v => v.code === renameCode) || {}).name || ""} onSave={(n) => { cc.renameView(renameCode, n); setRenameCode(null); }} onClose={() => setRenameCode(null)} />
      <ConfirmModal open={!!owCode} title="화면 덮어쓰기"
        message={(() => { const v = cc.views.find(x => x.code === owCode); return v ? `${v.code} "${v.name}" 화면을 지금 화면 구성으로 덮어쓸까요?` : ""; })()}
        confirmLabel="덮어쓰기" onConfirm={() => { cc.overwriteView(owCode); setOwCode(null); }} onClose={() => setOwCode(null)} />
      <ConfirmModal open={!!delCode} title="화면 삭제" danger confirmLabel="삭제"
        message={(() => { const v = cc.views.find(x => x.code === delCode); return v ? `${v.code} "${v.name}" 화면을 삭제할까요? 이 작업은 되돌릴 수 없습니다.` : ""; })()}
        onConfirm={() => { cc.deleteView(delCode); setDelCode(null); }} onClose={() => setDelCode(null)} />

      {toast ? <div className="page-toast" role="status">{toast}</div> : null}

      <TweaksPanel title="Tweaks">
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
      </TweaksPanel>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Styles
   ───────────────────────────────────────────── */
const css = `
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
.t-row.row-new{ box-shadow: inset 3px 0 0 var(--accent); background: color-mix(in oklab, var(--accent-soft) 14%, var(--card)); }
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

(function injectCss(){
  if (document.getElementById('partners-css')) return;
  const s = document.createElement('style');
  s.id = 'partners-css';
  s.textContent = css;
  document.head.appendChild(s);
})();

/* 공통: 다른 화면(매입·매출·활동 등)의 "거래처 검색 › 신규"에서 쓰는 독립 거래처 신규 팝업.
   거래처 화면의 PartnerModal 그대로 렌더하며, 저장 시 공유 저장소(NM_LIST_KEY.거래처)에 즉시 기록하고 onSaved(partner) 로 돌려준다 */
function PartnerEntryModal({ initialName, onSaved, onClose }) {
  const [partners, setPartners] = usePersistedList(NM_LIST_KEY.거래처, INITIAL_PARTNERS);
  const initial = useMemo(() => initialName ? { name: initialName, __prefill: true } : null, [initialName]);
  const handleSave = (form) => {
    const nextId = form.code || ("P-" + String(partners.length + 1).padStart(3, "0"));
    const rec = stampSaved({ ...form, id: nextId, code: form.code || nextId, name: form.name, ceo: form.ceo, phone: form.phone, addr: [form.addr, form.addrDetail].filter(Boolean).join(" "), mgr: form.mgrName || "—", kind: form.kind, payment: form.payment, biz: form.biz });
    try { const k = NM_LIST_KEY.거래처; const cur = JSON.parse(localStorage.getItem(k)) || []; localStorage.setItem(k, JSON.stringify([rec, ...cur.filter(x => x.id !== rec.id)])); window.dispatchEvent(new CustomEvent("nonamed:list", { detail: { key: k } })); } catch (e) {}
    setPartners(prev => [rec, ...prev.filter(x => x.id !== rec.id)]);
    showToast(`「${rec.name}」 거래처가 등록되었습니다.`);
    if (onSaved) onSaved({ name: rec.name, code: rec.code, ceo: rec.ceo || "", phone: rec.phone || rec.mobile || "", region: rec.addr || "", biz: rec.biz || "" });
  };
  return (
    <PartnerModal open initial={initial} existingCodes={partners.map(p => p.id)} formLayout={TWEAK_DEFAULTS.formLayout} afterSave="목록으로" setAfterSave={() => {}} showHelper={false}
      onSave={handleSave} onDelete={() => {}} onClose={onClose} setToast={showToast} />
  );
}
window.PartnerEntryModal = PartnerEntryModal;

if (!window.__PARTNERS_NO_MOUNT) ReactDOM.createRoot(document.getElementById('app')).render(<App />);
