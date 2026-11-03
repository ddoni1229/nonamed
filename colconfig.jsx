/* 자동부여 코드 생성 — 패턴(예: ABC-00000)의 숫자 블록을 1씩 증가 */
function nextAutoCode(pattern, used, len) {
  const pat = String(pattern || "").trim();
  if (!pat) {
    const L = len || 5;
    const nums = (used || []).map(v => String(v)).filter(v => /^\d+$/.test(v)).map(Number);
    const n = nums.length ? Math.max(...nums) + 1 : 1;
    return String(Math.min(n, Math.pow(10, L) - 1)).padStart(L, "0");
  }
  const m = pat.match(/^(.*?)(\d+)([^\d]*)$/);
  if (!m) return pat;
  const head = m[1], digits = m[2], tail = m[3], L = digits.length;
  const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp("^" + esc(head) + "(\\d{" + L + "})" + esc(tail) + "$");
  let maxN = null;
  (used || []).forEach(v => { const mm = re.exec(String(v || "")); if (mm) { const n = Number(mm[1]); if (maxN == null || n > maxN) maxN = n; } });
  const next = maxN == null ? Math.max(1, Number(digits)) : maxN + 1;
  return head + String(Math.min(next, Math.pow(10, L) - 1)).padStart(L, "0") + tail;
}
window.nextAutoCode = nextAutoCode;

/* ─────────────────────────────────────────────
   colconfig.jsx — 공통 화면설정/저장된 화면(뷰) 모듈
   여러 화면에서 공용. window 로 export.
   ───────────────────────────────────────────── */
const { useState, useEffect, useRef, useMemo } = React;

const CC_I = {
  close:   <svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  chevron: <svg viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  check:   <svg viewBox="0 0 24 24" fill="none"><path d="M5 12l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  reset:   <svg viewBox="0 0 24 24" fill="none"><path d="M3 12a9 9 0 1015 4M3 4v6h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  search:  <svg viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.6"/><path d="M16 16l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
};

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
function ColFieldSettingsModal({ open, initial, onSave, onClose }) {
  const [label, setLabel] = useState("");
  const [inputable, setInputable] = useState(true);
  const [editable, setEditable] = useState(true);
  const [required, setRequired] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => {
    if (open && initial) {
      setLabel(initial.label || "");
      setInputable(initial.inputable !== false);
      setEditable(initial.editable !== false);
      setRequired(!!initial.required);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 40);
    }
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const fn = (e) => { if (e.key === "Escape") { e.stopImmediatePropagation(); e.preventDefault(); onClose(); } };
    window.addEventListener("keydown", fn, true);
    return () => window.removeEventListener("keydown", fn, true);
  }, [open, onClose]);
  if (!open) return null;
  const submit = (e) => { e.preventDefault(); if (!label.trim()) return; onSave({ label: label.trim(), inputable, editable, required }); };
  const cfsRow = (on, set, t, d) => (
    <button type="button" className={`cfs-row ${on ? "is-on" : ""}`} onClick={() => set(!on)}>
      <span className="cfs-check">{on ? CC_I.check : null}</span>
      <span className="cfs-txt"><b>{t}</b><span>{d}</span></span>
    </button>
  );
  return (
    <div className="modal-root" role="dialog" aria-modal="true" style={{ zIndex: 93 }}>
      <div className="modal-scrim" onClick={onClose} />
      <form className="modal modal-newitem" style={{ maxWidth: 420 }} onSubmit={submit}>
        <header className="modal-head">
          <div>
            <h2 className="modal-title">열 설정</h2>
            <div className="modal-sub">이 열의 이름과 입력 규칙을 정합니다.</div>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>{CC_I.close}</button>
        </header>
        <div className="ni-body">
          <label className="fld"><span className="fld-label">열 이름 <span className="req">*</span></span>
            <input ref={inputRef} className="fld-input" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="열 이름" /></label>
          <div className="cfs-rows">
            {cfsRow(inputable, setInputable, "입력 가능", "이 열에 값을 입력할 수 있어요")}
            {cfsRow(editable, setEditable, "수정 가능", "채워진 값을 바꿀 수 있어요")}
            {cfsRow(required, setRequired, "필수", "비어 있으면 붉게 표시돼요")}
          </div>
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

// 입력창 공통: 창 이동 / 너비 조절 / 위치·크기 고정(⛶)
function useWinFrame(baseKey, defaultWidth = 860, open = true) {
  const WK = baseKey + ".winW", PK = baseKey + ".winPos", LK = baseKey + ".winLock";
  const readNum = (k) => { try { const v = localStorage.getItem(k); return v == null ? null : Number(v); } catch (e) { return null; } };
  const readPos = () => { try { return JSON.parse(localStorage.getItem(PK)); } catch (e) { return null; } };
  const [winLocked, setWinLocked] = useState(false);
  const [width, setWidth] = useState(() => { const v = readNum(WK); return v == null ? defaultWidth : v; });
  const [winPos, setWinPos] = useState(() => readPos() || { x: 0, y: 0 });
  const resizing = useRef(null);
  const saveWin = (w, p) => { try { localStorage.setItem(WK, String(w)); localStorage.setItem(PK, JSON.stringify(p)); localStorage.setItem(LK, "1"); } catch (e) {} };
  useEffect(() => { if (!open) return; setWinLocked(false); const sw = readNum(WK); setWidth(sw == null ? defaultWidth : sw); setWinPos(readPos() || { x: 0, y: 0 }); }, [open]);
  const onWinDragDown = (e) => {
    if (e.target.closest("button, input, select, textarea, .th-resize, .entry-resize, kbd, .vpm, .cfg-wrap, .win-tools")) return;
    const st = { sx: e.clientX, sy: e.clientY, ox: winPos.x, oy: winPos.y }; let last = { x: st.ox, y: st.oy };
    const move = (ev) => { last = { x: st.ox + ev.clientX - st.sx, y: st.oy + ev.clientY - st.sy }; setWinPos(last); };
    const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); if (winLocked) saveWin(width, last); };
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
  };
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
  const onResizeDown = (e) => { resizing.current = { sx: e.clientX, sw: width }; e.preventDefault(); };
  useEffect(() => {
    const mv = (e) => { if (!resizing.current) return; setWidth(Math.max(480, resizing.current.sw + (e.clientX - resizing.current.sx) * 2)); };
    const up = () => { if (resizing.current && winLocked) saveWin(width, winPos); resizing.current = null; };
    window.addEventListener("mousemove", mv); window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
  }, [winLocked, width, winPos]);
  const winStyle = { width: `min(${width}px, 100%)`, maxWidth: "100%", transform: (winPos.x || winPos.y) ? `translate(${winPos.x}px, ${winPos.y}px)` : undefined };
  const resetWin = () => { try { localStorage.removeItem(WK); localStorage.removeItem(PK); localStorage.removeItem(LK); } catch (e) {} setWidth(defaultWidth); setWinPos({ x: 0, y: 0 }); setWinLocked(false); };
  const WinResize = () => <span className="entry-resize" onMouseDown={onResizeDown} title="너비 조절" />;
  const WinTools = () => (
    <div className="win-tools">
      <button type="button" className={`win-tool ${winLocked ? "is-on" : ""}`} title="드래그로 창 이동 / 모서리로 크기 조절 · 클릭하면 현재 위치·크기 고정(저장)" onMouseDown={onWinBtnDown}>⛶</button>
    </div>
  );
  return { width, winPos, winLocked, winStyle, resetWin, onWinDragDown, onWinBtnDown, onResizeDown, WinTools, WinResize };
}

function ConfirmModal({ open, title = "확인", message, confirmLabel = "확인", extraLabel, onExtra, danger, onConfirm, onClose }) {
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
            {extraLabel ? <button type="button" className="btn-ghost" onClick={onExtra}>{extraLabel}</button> : null}
            <button type="button" className={`btn-primary ${danger ? "btn-danger" : ""}`} onClick={onConfirm}>{confirmLabel}{/^저장/.test(String(confirmLabel || "")) ? <kbd className="btn-kbd">F8</kbd> : null}</button>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* 전 화면 공통 확인 팝업 — window.confirm 대체. await nmConfirm({ title, message, confirmLabel, danger, extraLabel }) → true/false/"extra" */
let __nmConfirmRoot = null;
function nmConfirm({ title = "확인", message, confirmLabel = "확인", danger = false, extraLabel } = {}) {
  return new Promise((resolve) => {
    let host = document.getElementById("nm-confirm-host");
    if (!host) { host = document.createElement("div"); host.id = "nm-confirm-host"; document.body.appendChild(host); }
    if (!__nmConfirmRoot) __nmConfirmRoot = ReactDOM.createRoot(host);
    const done = (v) => { __nmConfirmRoot.render(null); resolve(v); };
    __nmConfirmRoot.render(<ConfirmModal open title={title} message={message} confirmLabel={confirmLabel} danger={danger} extraLabel={extraLabel} onExtra={() => done("extra")} onConfirm={() => done(true)} onClose={() => done(false)} />);
  });
}

/* 전표 내역 팝업 — 거래처·품목이 어느 전표에 쓰이고 있는지 보여주고, 해당 화면으로 열기 */
function nmUsedDocs({ partner, item } = {}) {
  const out = [];
  ["매입", "매출"].forEach(kind => (readDocs(kind) || []).forEach(d => {
    if (d.deleted) return;
    if (partner && d.partner !== partner) return;
    if (item && !(d.lines || []).some(l => l.item === item || l.name === item)) return;
    out.push({ kind, id: d.id, date: d.date, partner: d.partner, status: d.status, summary: (d.lines || []).map(l => l.item || l.name).filter(Boolean).slice(0, 3).join(", ") + ((d.lines || []).length > 3 ? ` 외 ${(d.lines || []).length - 3}건` : "") });
  }));
  if (item) { try { (JSON.parse(localStorage.getItem("nonamed.docs.adjust.v1")) || []).forEach(d => { if (d.item === item) out.push({ kind: "조정", id: d.id, date: d.date, partner: "", status: d.reason || "", summary: `${d.item} ${d.qty > 0 ? "+" : ""}${d.qty}` }); }); } catch (e) {} }
  return out.sort((a, b) => String(b.date).localeCompare(String(a.date)));
}
function DocListModal({ title, docs, onClose }) {
  useEffect(() => { const fn = (e) => { if (e.key === "Escape") { e.stopImmediatePropagation(); onClose(); } }; window.addEventListener("keydown", fn, true); return () => window.removeEventListener("keydown", fn, true); }, [onClose]);
  const openDoc = (d) => { const url = d.kind === "매입" ? "매입관리.html" : d.kind === "매출" ? "매출관리.html" : "품목리스트.html?tab=조정"; window.open(url + (url.includes("?") ? "&" : "?") + "q=" + encodeURIComponent(d.id), "_blank"); };
  return (
    <div className="modal-root" role="dialog" aria-modal="true" style={{ zIndex: 96 }}>
      <div className="modal-scrim" onClick={onClose} />
      <div className="modal" style={{ width: "min(720px, 94vw)", maxWidth: "none" }}>
        <header className="modal-head"><div><h2 className="modal-title">{title}</h2><div className="modal-sub keep">총 {docs.length}건 · 항목을 누르면 해당 화면이 새 창으로 열립니다</div></div><button type="button" className="modal-close" onClick={onClose}>{CC_I.close}</button></header>
        <div className="nm-doclist">
          <div className="nm-doclist-h"><span>구분</span><span>전표번호</span><span>일자</span><span>거래처</span><span>품목</span><span>상태</span></div>
          {docs.map(d => (
            <button key={d.kind + d.id} type="button" className="nm-doclist-row" onClick={() => openDoc(d)} title="해당 화면에서 열기">
              <span className={`nm-doc-kind k-${d.kind}`}>{d.kind}</span><span className="is-mono">{d.id}</span><span className="is-mono">{d.date}</span><span>{d.partner}</span><span className="nm-doc-sum">{d.summary}</span><span>{d.status}</span>
            </button>
          ))}
        </div>
        <footer className="modal-foot"><div className="ff-left" /><div className="ff-right"><button type="button" className="btn-primary" onClick={onClose}>닫기</button></div></footer>
      </div>
    </div>
  );
}
function nmDocList({ title, docs }) {
  return new Promise((resolve) => {
    let host = document.getElementById("nm-confirm-host");
    if (!host) { host = document.createElement("div"); host.id = "nm-confirm-host"; document.body.appendChild(host); }
    if (!__nmConfirmRoot) __nmConfirmRoot = ReactDOM.createRoot(host);
    const done = () => { __nmConfirmRoot.render(null); resolve(); };
    __nmConfirmRoot.render(<DocListModal title={title} docs={docs} onClose={done} />);
  });
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
        <span className="vpm-caret">{CC_I.chevron}</span>
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
                  <button type="button" className="vpm-mini" title="이름 변경" onClick={() => onRename(v.code)}>이름</button>
                  <button type="button" className="vpm-mini vpm-del" title="삭제" onClick={() => onDelete(v.code)}>삭제</button>
                </div>
              ))}
            </div>
            <button type="button" className="vpm-new" onClick={() => { onSaveNew(); setOpen(false); }}>＋ 신규</button>
          </div>
        </>
      ) : null}
    </div>
  );
}

/* 화면(뷰) 저장·이름변경 팝업 */
function SaveViewModal({ open, title = "화면 저장", code, initialName = "", saveLabel = "저장", fieldLabel = "화면 이름", placeholder = "예: 월말 정산용", onSave, onClose }) {
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
  const submit = (e) => { if (e) e.preventDefault(); if (!name.trim()) return; onSave(name.trim()); };
  return (
    <div className="modal-root" role="dialog" aria-modal="true" style={{ zIndex: 90 }}>
      <div className="modal-scrim" onClick={onClose} />
      <div className="modal modal-newitem" style={{ maxWidth: 420 }}>
        <header className="modal-head">
          <div>
            <h2 className="modal-title">{title}</h2>
            {code ? <div className="modal-sub keep">코드 <b>{code}</b> 로 저장됩니다</div> : null}
          </div>
          <button type="button" className="modal-close" onClick={onClose}>{CC_I.close}</button>
        </header>
        <div className="ni-body">
          <label className="fld"><span className="fld-label">{fieldLabel} <span className="req">*</span></span>
            <input ref={inputRef} className="fld-input" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submit(e); }} placeholder={placeholder} /></label>
        </div>
        <footer className="modal-foot">
          <div className="ff-left" />
          <div className="ff-right">
            <button type="button" className="btn-ghost" onClick={onClose}>취소</button>
            <button type="button" className="btn-primary" onClick={submit}>{saveLabel}</button>
          </div>
        </footer>
      </div>
    </div>
  );
}

function ColPickModal({ open, scope, baseKeys, srcGroups, activeSlots, existing, onApply, onClose }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState([]);
  useEffect(() => { if (open) { setQ(""); setSel([]); } }, [open]);
  useEffect(() => {
    if (!open) return;
    const fn = (e) => { if (e.key === "Escape") { e.stopImmediatePropagation(); e.preventDefault(); onClose(); } };
    window.addEventListener("keydown", fn, true);
    return () => window.removeEventListener("keydown", fn, true);
  }, [open, onClose]);
  const dragRef = useRef(null);
  useEffect(() => {
    const up = () => { dragRef.current = null; };
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, []);
  if (!open) return null;
  const BASE_KEYS = baseKeys || [];
  const SLOT_ROWS = [
    ...Array.from({ length: 10 }, (_, i) => ({ key: "문자형" + (i + 1), type: "text" })),
    ...Array.from({ length: 5 }, (_, i) => ({ key: "숫자형" + (i + 1), type: "money" })),
    ...Array.from({ length: 5 }, (_, i) => ({ key: "검색형" + (i + 1), type: "lookup" })),
  ];
  const applied = new Set((existing || []).map(x => x && x.label).filter(Boolean));
  const groups = [
    ...(srcGroups && srcGroups["조회 기술키"] ? [{ name: "조회 기술키", items: ccExpandLookup(srcGroups["조회 기술키"].map(n => ({ key: n, plain: true }))) }] : []),
    { name: "입력 기술키" + (scope ? "(" + scope + ")" : ""), items: ccExpandLookup(BASE_KEYS.map(n => ({ key: n, plain: true }))) },
    { name: "입력 추가키" + (scope ? "(" + scope + ")" : ""), items: ccExpandLookup(activeSlots && activeSlots.length ? activeSlots.map(s => ({ key: s.key, type: s.type, label2: s.label })) : SLOT_ROWS) },
  ];
  const qq = q.trim();
  const toggle = (it) => setSel(prev => prev.some(x => x.key === it.key) ? prev.filter(x => x.key !== it.key) : [...prev, it]);
  let any = false;
  const body = groups.map((g, gi) => {
    const items = g.items.filter(it => (!qq || it.key.includes(qq)) && !applied.has(it.key) && !applied.has(it.label2));
    if (!items.length) return null;
    any = true;
    const allOn = items.every(it => sel.some(x => x.key === it.key));
    return (
      <React.Fragment key={g.name + gi}>
        <div className="slotpick-grp" style={{ padding: "8px 12px" }}>{g.name}</div>
        <button type="button" className={`pickrow pickrow-all ${allOn ? "is-on" : ""}`} onClick={() => setSel(prev => allOn ? prev.filter(x => !items.some(it => it.key === x.key)) : [...prev, ...items.filter(it => !prev.some(x => x.key === it.key))])}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" tabIndex={-1} readOnly checked={allOn} style={{ width: 15, height: 15, pointerEvents: "none" }} />
          </span>
        </button>
        {items.map(it => {
          const on = sel.some(x => x.key === it.key);
          return (
            <button key={g.name + it.key} type="button" className={`pickrow ${on ? "is-on" : ""}`}
              onMouseDown={() => { dragRef.current = { val: !on }; setSel(prev => on ? prev.filter(x => x.key !== it.key) : [...prev, it]); }}
              onMouseEnter={() => { const d = dragRef.current; if (!d) return; setSel(prev => { const has = prev.some(x => x.key === it.key); if (d.val && !has) return [...prev, it]; if (!d.val && has) return prev.filter(x => x.key !== it.key); return prev; }); }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" tabIndex={-1} readOnly checked={on} style={{ width: 15, height: 15, pointerEvents: "none" }} />
                {it.label2 && it.label2 !== it.key ? it.label2 + " · " + it.key : it.key}
              </span>
              {it.plain || it.asSource ? null : <span className="ae-type">{it.type === "text" ? "문자" : it.type === "money" ? "숫자" : "검색"}</span>}
            </button>
          );
        })}
      </React.Fragment>
    );
  });
  return (
    <div className="modal-root" style={{ zIndex: 95 }} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ width: 520, maxWidth: "94vw" }}>
        <header className="modal-head">
          <div><h2 className="modal-title">항목 검색</h2><div className="modal-sub">추가할 항목을 체크하고 적용을 누르세요.</div></div>
          <button type="button" className="modal-close" onClick={onClose}>{CC_I.close}</button>
        </header>
        <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input className="fld-input" autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="검색 (예: 전화, 문자형3)" />
          <div style={{ maxHeight: 320, overflowY: "auto", border: "1px solid var(--line-soft)", borderRadius: 10 }} onMouseDown={(e) => e.preventDefault()}>
            {body}{!any ? <div className="fld-hint" style={{ padding: 14 }}>검색 결과가 없습니다.</div> : null}
          </div>
        </div>
        <footer className="modal-foot">
          <div className="ff-left"><span className="fld-hint">{sel.length}개 선택</span></div>
          <div className="ff-right">
            <button type="button" className="btn-ghost" onClick={onClose}>취소</button>
            <button type="button" className="btn-primary" disabled={!sel.length} onClick={() => { onApply(sel.map(it => (it.plain || it.asSource) ? { label: it.key, type: "source", source: it.key } : { label: it.key, type: it.type, slot: it.key })); onClose(); }}>적용</button>
          </div>
        </footer>
      </div>
    </div>
  );
}

function AddColModal({ nextCode, initial, existing = [], used, types, noFmt, srcGroups, scope, baseKeys, activeSlots, onManageList, onPickValue, onAdd, onClose }) {
  const [label, setLabel] = useState(initial ? (initial.label || "") : "");
  const [type, setType] = useState(initial ? (initial.type || (types && types[0]) || "source") : ((types && types[0]) || "source"));
  const [formula, setFormula] = useState(initial ? (initial.formula || "") : "");
  const [source, setSource] = useState(initial ? (initial.source || "품목코드") : "품목코드");
  const [dflt, setDflt] = useState(initial ? (initial.dflt || "") : "");
  const [required, setRequired] = useState(initial ? !!initial.required : false);
  useEffect(() => {
    return undefined;
  }, []);
  const submit = (e) => {
    e.preventDefault();
    if (!label.trim()) return;
    const pick = slot || label.trim();
    const listMode = !!srcGroups;
    const eff = listMode ? (formula.trim() ? "formula" : (type === "source" ? "source" : "dflt")) : type;
    onAdd({ label: label.trim(), type: eff, formula: formula.trim(), source: listMode ? pick : source, srcCat, dflt: dflt.trim(), fmt, maxLen: maxLen ? Number(maxLen) : null, autoPat: autoPat.trim(), slot: slot || null, required });
  };
  const [fmt, setFmt] = useState(initial && initial.fmt ? initial.fmt : "free");
  const [maxLen, setMaxLen] = useState(initial && initial.maxLen ? String(initial.maxLen) : "");
  const [autoPat, setAutoPat] = useState(initial && initial.autoPat ? initial.autoPat : "00001");
  const FMTS = [["free", "자유"], ["auto", "자동부여"]];
  const TYPES = [["source","정보불러오기"],["formula","계산식"],["date","일자"],["text","문자"],["money","금액"],["lookup","검색형"],["dflt","고정값"]].filter(t => !types || types.includes(t[0]));
  const onlyDflt = !!(types && types.length === 1 && types[0] === "dflt");
  // 기존 테이블 값에서 끌어올 수 있는 소스 — 품목 / 거래처
  const SOURCE_FIELDS = srcGroups || {
    "품목": ["품목코드", "품목명", "규격", "단위", "매입가", "판매가", "재고"],
    "거래처": ["거래처명", "대표자", "사업자번호", "전화번호", "주소"],
    "재고": ["현재고", "안전재고", "입고예정", "창고위치", "최근입고일"],
  };
  const FIELDS = Object.keys(SOURCE_FIELDS);
  const LK_DEFAULTS = { "거래처": [], "품목": [], "재고": ["창고A", "창고B", "냉장1", "냉동1"] };
  const [srcCat, setSrcCat] = useState(initial && initial.srcCat ? initial.srcCat : (srcGroups ? Object.keys(srcGroups)[0] : "품목"));
  const [customLists, setCustomLists] = useState(() => { try { return JSON.parse(localStorage.getItem("cc.customLists.v1") || "{}"); } catch { return {}; } });
  const [newListOpen, setNewListOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListVals, setNewListVals] = useState("");
  const [rowsOpen, setRowsOpen] = useState(false);
  const [rowsDraft, setRowsDraft] = useState([]);
  const saveCustomList = () => {
    const nm = newListName.trim(); const vals = newListVals.split(/[\n,\/]/).map(v => v.trim()).filter(Boolean);
    if (!nm || !vals.length) return;
    const next = { ...customLists, [nm]: vals };
    setCustomLists(next);
    try { localStorage.setItem("cc.customLists.v1", JSON.stringify(next)); } catch {}
    setSrcCat(nm); setType("lookup");
    if (!label.trim() || EXTRA_SLOTS.some(x => x.key === label.trim()) || label.trim() === srcCat) setLabel(nm);
    setNewListOpen(false);
  };
  const [slot, setSlot] = useState(initial && initial.slot ? initial.slot : "");
  const [slotQ, setSlotQ] = useState("");
  const [slotPick, setSlotPick] = useState(false);
  const [pickQ, setPickQ] = useState("");
  const [catPick, setCatPick] = useState(false);
  const [catQ, setCatQ] = useState("");
  const [catSel, setCatSel] = useState("");
  const [editListName, setEditListName] = useState("");
  const [editRows, setEditRows] = useState([]);
  const [editChk, setEditChk] = useState([]);
  const openCat = () => { setCatQ(""); setCatSel(srcCat); setCatPick(true); };
  const [npOpen, setNpOpen] = useState(false);
  const [npName, setNpName] = useState("");
  const [npRows, setNpRows] = useState([""]);
  const [npChk, setNpChk] = useState([]);
  const [npCode, setNpCode] = useState("");
  const [itemQ, setItemQ] = useState("");
  const nextListCode = () => String(Object.keys(customLists).length + 1).padStart(5, "0");
  const [raOpen, setRaOpen] = useState(false);
  const [raCode, setRaCode] = useState("");
  const [raName, setRaName] = useState("");
  const [raIdx, setRaIdx] = useState(-1);
  const nextItemCode = () => {
    const used = npRows.map(v => parseInt(String(v).trim().split(/\s+/)[0], 10)).filter(n => !isNaN(n));
    const n = used.length ? Math.max(...used) + 1 : 1;
    return String(n).padStart(5, "0");
  };
  const [forceOpen, setForceOpen] = useState(false);
  const BASE_KEYS = baseKeys || ["거래처코드","거래처명","휴대전화","전화","팩스","이메일","대표","사업자","주소","업태","종목","메모","그룹1","그룹2"];
  const slideOpen = true;
  useEffect(() => {
    const fn = (e) => { if (e.key === "F2") { if (raOpen) return; e.stopImmediatePropagation(); e.preventDefault();         if (npOpen) { setRaIdx(-1); setRaCode(nextItemCode()); setRaName(""); setRaOpen(true); return; } if (catPick) { if (editListName) { const used = editRows.map(v => parseInt(String(v).trim().split(/\s+/)[0], 10)).filter(n => !isNaN(n)); setRaIdx(-1); setRaCode(String((used.length ? Math.max(...used) : 0) + 1).padStart(5, "0")); setRaName(""); setRaOpen(true); return; } setNpName(""); setNpCode(nextListCode()); setNpRows([""]); setNpOpen(true); return; } return; } if (e.key === "Escape") { if (window.__ccExtLookup) return; e.stopImmediatePropagation(); e.preventDefault(); if (raOpen) { setRaOpen(false); return; } if (npOpen) { setNpOpen(false); return; } if (editListName) { setEditListName(""); return; } if (catPick) { setCatPick(false); return; } if (slotPick) { setSlotPick(false); return; } if (rowsOpen) { setRowsOpen(false); return; } onClose(); } };
    window.addEventListener("keydown", fn, true);
    return () => window.removeEventListener("keydown", fn, true);
  }, [onClose, slotPick, rowsOpen, catPick, editListName, npOpen, raOpen, editRows]);
  const EXTRA_SLOTS = React.useMemo(() => {
    const mk = (pre, n, ty) => Array.from({ length: n }, (_, i) => ({ key: `${pre}${i + 1}`, type: ty }));
    return [...mk("문자형", 10, "text"), ...mk("숫자형", 5, "money"), ...mk("검색형", 5, "lookup")];
  }, []);
  const usedSlots = React.useMemo(() => new Set([...(used || []), ...(existing || []).map(c => (c && (c.slot || c.label)) || null)].filter(Boolean)), [used, existing]);
  const pickSlot = (s) => {
    if (usedSlots.has(s.key) && (!initial || initial.slot !== s.key)) return;
    if (slot === s.key) { setSlot(""); return; }
    setSlot(s.key);
    if (onlyDflt || !TYPES.some(t => t[0] === type)) setType(s.type);
    if (!label.trim() || EXTRA_SLOTS.some(x => x.key === label.trim())) setLabel(s.key);
  };
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
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="addcol-code-badge">{initial ? (initial.code || "열 설정") : (nextCode || "열 추가")}{(slot || (initial && initial.slot)) ? <span className="addcol-slot-tag">{slot || initial.slot}</span> : null}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <input className="modal-title-input" style={{ flex: "1 1 200px", minWidth: 160 }} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="열 명칭을 입력하세요" />
              <div className="fld" style={{ flex: "0 0 220px", display: (initial && !initial.slot) ? "none" : undefined }}>
                <div className="cc-lookup">
                  <input className="fld-input" readOnly disabled={!!initial} value={slot || (initial && initial.slot) || ""} placeholder="추가키 슬롯 선택" onClick={() => { if (initial) return; setPickQ(""); setSlotPick(true); }} style={{ cursor: initial ? "not-allowed" : "pointer", opacity: initial ? .55 : 1 }} />
                  {initial ? null : <button type="button" className="cc-lookup-btn" tabIndex={-1} onClick={() => { setPickQ(""); setSlotPick(true); }}>{CC_I.search}</button>}
                </div>
              </div>
            </div>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>{CC_I.close}</button>
        </header>
        <div className="addcol-cols">
        <div className="ni-body">
          <label className="fld fld-row" style={{ display: srcGroups ? "none" : "flex", flexDirection: "row", alignItems: "center", gap: 8, opacity: initial && (initial.key === "code" || initial.key === "name") ? .55 : 1 }}>
            <input type="checkbox" checked={initial && (initial.key === "code" || initial.key === "name") ? true : required} disabled={initial && (initial.key === "code" || initial.key === "name")} onChange={(e) => setRequired(e.target.checked)} style={{ width: 16, height: 16 }} />
            <span className="fld-label">필수입력</span>
            <span className="fld-hint">{initial && initial.key === "code" ? "거래처코드는 항상 필수입니다." : initial && initial.key === "name" ? "거래처명은 항상 필수입니다." : "비어 있으면 붉은 테두리로 표시됩니다."}</span>
          </label>

          <div className="fld" style={{ display: "none" }}>
          </div>

          {srcGroups && (slot || label) ? (() => {
            const isNum = /^숫자형/.test(slot || label || "");
            const isLk = /^검색형/.test(slot || label || "");
            const kind = isNum ? "숫자" : isLk ? "검색" : "문자";
            return (
              <React.Fragment>
                <div className="addcol-divider"><span>{(slot || label)} 설정</span></div>
                <label className="fld" style={{ marginTop: 12, display: type === "source" ? "none" : undefined }}><span className="fld-label">기본값</span>
                  <input className={`fld-input ${isNum ? "is-mono" : ""}`} value={dflt} inputMode={isNum ? "numeric" : undefined}
                    onChange={(e) => setDflt(isNum ? e.target.value.replace(/[^\d.]/g, "") : e.target.value)} placeholder={isNum ? "0" : "비워두면 빈 칸"} />
                </label>
                {type === "source" ? <span className="fld-hint" style={{ marginTop: 8 }}>{(slot || label)} 값을 그대로 불러옵니다.</span> : null}
                {isNum ? (
                  <label className="fld" style={{ marginTop: 12 }}><span className="fld-label">계산식</span>
                    <input className="fld-input is-mono" value={formula} onChange={(e) => setFormula(e.target.value)} placeholder="예: 수량*단가*0.9" />
                    <span className="fld-hint" style={{ marginTop: 4 }}>비워두면 직접 입력 값을 사용합니다.</span>
                  </label>
                ) : null}
              </React.Fragment>
            );
          })() : null}

          <div className="addcol-divider" style={{ display: (onlyDflt || srcGroups) ? "none" : undefined }}><span>유형 선택</span></div>

          <div className="addcol-slide" style={{ display: srcGroups ? "none" : undefined, maxHeight: slideOpen ? 1600 : 0, opacity: slideOpen ? 1 : 0, overflow: "hidden", transition: "max-height .3s ease, opacity .22s ease" }}>

          <div className="fld" style={{ marginTop: 4, display: onlyDflt ? "none" : undefined }}>
            <span className="fld-label">유형</span>
            <div className="seg seg-sm" style={{ alignSelf: "flex-start", flexWrap: "wrap" }}>
              {TYPES.map(([v, ko]) => (
                <button key={v} type="button" className={`seg-item ${type === v ? "is-on" : ""}`} onClick={() => setType(v)}>{ko}</button>
              ))}
            </div>
          </div>

          <div className="addcol-divider" style={{ display: (onlyDflt || type !== "source") ? "none" : undefined }}><span>또는 기존 정보에서 가져오기</span></div>

          <div className="fld" style={{ marginTop: 4, display: (onlyDflt || type !== "source") ? "none" : undefined }}>
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
          ) : type === "lookup" ? (
            <div className="fld" style={{ marginTop: 12 }}><span className="fld-label">검색 대상</span>
              <div className="cc-lookup">
                <input className="fld-input" readOnly value={newListOpen ? "새 항목리스트" : srcCat} onClick={openCat} style={{ cursor: "pointer" }} />
                <button type="button" className="cc-lookup-btn" tabIndex={-1} onClick={openCat}>{CC_I.search}</button>
              </div>
              {newListOpen ? (
                <div className="cc-newlist">
                  <label className="fld" style={{ marginTop: 10 }}><span className="fld-label">항목명</span>
                    <input className="fld-input" value={newListName} onChange={(e) => setNewListName(e.target.value)} placeholder="예: 지역" />
                  </label>
                  <div className="fld" style={{ marginTop: 10 }}><span className="fld-label">항목 리스트</span>
                    <button type="button" className="fld-input cc-listbtn" onClick={() => { setRowsDraft(newListVals.split(/[\n,\/]/).map(v => v.trim()).filter(Boolean)); setRowsOpen(true); }} style={{ textAlign: "left", cursor: "pointer" }}>
                      {newListVals.split(/[\n,\/]/).map(v => v.trim()).filter(Boolean).join(" · ") || "리스트 항목 등록…"}
                    </button>
                    <span className="fld-hint" style={{ marginTop: 4 }}>누르면 등록 창이 열립니다.</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <button type="button" className="btn-ghost" onClick={() => setNewListOpen(false)}>취소</button>
                    <button type="button" className="btn-primary" onClick={saveCustomList}>리스트 저장</button>
                  </div>
                </div>
              ) : (
                <span className="fld-hint" style={{ marginTop: 4 }}>{customLists[srcCat] ? `선택 목록: ${customLists[srcCat].join(" · ")}` : `입력 시 ${srcCat} 코드도움 창이 뜹니다.`}</span>
              )}
            </div>
          ) : null}
          {type !== "formula" && !noFmt ? (
            <div className="fld" style={{ marginTop: 12 }}><span className="fld-label">입력 규칙</span>
              <div className="seg seg-sm" style={{ alignSelf: "flex-start", flexWrap: "wrap" }}>
                {FMTS.map(([v, ko]) => (
                  <button key={v} type="button" className={`seg-item ${fmt === v ? "is-on" : ""}`} onClick={() => setFmt(v)}>{ko}</button>
                ))}
              </div>
              {fmt === "auto" ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                  <input className="fld-input is-mono" style={{ width: 160 }} value={autoPat} onChange={(e) => setAutoPat(e.target.value.toUpperCase())} placeholder="예: ABC-00000" />
                  <span className="fld-hint">문자+숫자 형식 · 숫자 자리만 증가</span>
                </div>
              ) : null}
              <div style={{ alignItems: "center", gap: 8, marginTop: 8, display: fmt === "auto" && autoPat ? "none" : "flex" }}>
                <input className="fld-input is-mono" style={{ width: 90 }} inputMode="numeric" value={maxLen} onChange={(e) => setMaxLen(e.target.value.replace(/[^\d]/g, "").slice(0, 3))} placeholder="자릿수" />
                <span className="fld-hint">자리까지 입력 · 버려두면 제한 없음</span>
              </div>
              <span className="fld-hint" style={{ marginTop: 6 }}>{fmt === "auto" && autoPat ? `${autoPat} → ${nextAutoCode(autoPat, [autoPat])} → ${nextAutoCode(autoPat, [nextAutoCode(autoPat, [autoPat])])} 순으로 자동 부여됩니다.` : fmt === "auto" ? `새 입력 시 ${"0".repeat(Number(maxLen) || 5)} 부터 ${"9".repeat(Number(maxLen) || 5)} 까지 다음 번호가 자동 부여됩니다.` : fmt === "num" && maxLen ? `${maxLen}자리 숫자형으로 제한됩니다.` : "예: 숫자만 + 5 → 5자리 숫자형"}</span>
            </div>
          ) : null}
          {type === "lookup" ? null : type !== "formula" ? (
            <label className="fld" style={{ marginTop: 12 }}><span className="fld-label">유형 / 기본값</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span className="ae-type" style={{ minWidth: 54 }}>{type === "money" ? "숫자" : type === "date" ? "일자" : type === "lookup" ? "검색" : "문자"}</span>
                <input className={`fld-input ${type === "money" ? "is-mono" : ""}`} type={type === "date" ? "date" : "text"} value={dflt} onChange={(e) => setDflt(type === "money" ? e.target.value.replace(/[^\d]/g, "") : e.target.value)} placeholder={type === "money" ? "0" : type === "date" ? "" : "비워두면 빈 칸"} />
              </div>
              <span className="fld-hint" style={{ marginTop: 4 }}>새 줄을 입력할 때 이 값이 미리 채워집니다.</span>
            </label>
          ) : null}
          </div>
        </div>
        <aside className="addcol-existing" style={{ display: "none" }}>
          <div className="ae-h">추가된 열{existing.length ? " · " + existing.length + "개" : ""}</div>
          {existing.length === 0 ? (
            <div className="ae-empty">아직 추가한 열이 없어요.</div>
          ) : (
            <div className="ae-list">
              {(() => {
                const grpOf = (x) => {
                  const nm = String((x.slot || x.source || x.label) || "");
                  if (/^(문자형|숫자형|검색형)\d+$/.test(nm)) return "입력 추가키";
                  if (srcGroups && (srcGroups["조회 기술키"] || []).includes(nm)) return "조회 기술키";
                  if (BASE_KEYS.includes(nm)) return "입력 기술키";
                  return "기타";
                };
                const order = ["조회 기술키", "입력 기술키", "입력 추가키", "기타"];
                const buckets = {};
                existing.forEach(x => { const g = grpOf(x); (buckets[g] = buckets[g] || []).push(x); });
                return order.filter(g => buckets[g] && buckets[g].length).map(g => (
                  <React.Fragment key={g}>
                    <div className="slotpick-grp" style={{ marginTop: 4 }}>{g} · {buckets[g].length}</div>
                    {buckets[g].map(c => (
                      <div key={(c.key || c.code) + c.label} className={`ae-item ${initial && c.key === initial.key ? "is-cur" : ""}`}>
                        <span className="ae-code">{c.code || "열"}</span>
                        <span className="ae-name">{c.label}</span>
                        <span className="ae-type">{({ source: "정보", formula: "계산식", date: "일자", text: "문자", money: "금액", 기술: "기술" })[c.type] || c.type}{c.dflt ? " · 기본" : ""}</span>
                      </div>
                    ))}
                  </React.Fragment>
                ));
              })()}
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
      {raOpen ? (
        <div className="modal-root" style={{ zIndex: 99 }} onMouseDown={(e) => { if (e.target === e.currentTarget) setRaOpen(false); }}>
          <div className="modal" style={{ width: 380, maxWidth: "92vw" }}>
            <header className="modal-head">
              <div><h2 className="modal-title">{raIdx >= 0 ? "항목 수정" : "항목 추가"}</h2><div className="modal-sub">항목코드와 명칭을 입력하세요.</div></div>
              <button type="button" className="modal-close" onClick={() => setRaOpen(false)}>{CC_I.close}</button>
            </header>
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label className="fld"><span className="fld-label">항목코드</span>
                <input className="fld-input is-mono" autoFocus value={raCode} onChange={(e) => setRaCode(e.target.value)} placeholder="예: 01" />
              </label>
              <label className="fld"><span className="fld-label">명칭</span>
                <input className="fld-input" value={raName} onChange={(e) => setRaName(e.target.value)} placeholder="예: 서울" />
              </label>
            </div>
            <footer className="modal-foot">
              <div className="ff-left" />
              <div className="ff-right">
                <button type="button" className="btn-ghost" onClick={() => setRaOpen(false)}>취소</button>
                <button type="button" className="btn-primary" disabled={!raName.trim() && !raCode.trim()} onClick={() => {
                  const v = [raCode.trim(), raName.trim()].filter(Boolean).join(" ");
                  if (editListName) {
                    if (raIdx >= 0) { setEditRows(p => p.map((x, i) => i === raIdx ? v : x)); setEditChk([]); }
                    else setEditRows(p => [...p.filter(x => String(x).trim()), v]);
                  } else if (raIdx >= 0) { setNpRows(p => p.map((x, i) => i === raIdx ? v : x)); setNpChk([]); }
                  else setNpRows(p => { const base = p.filter(x => x.trim()); return [...base, v]; });
                  setRaOpen(false);
                }}>{raIdx >= 0 ? "수정" : "추가"}</button>
              </div>
            </footer>
          </div>
        </div>
      ) : null}
      {npOpen ? (
        <div className="modal-root" style={{ zIndex: 98 }} onMouseDown={(e) => { if (e.target === e.currentTarget) setNpOpen(false); }}>
          <div className="modal" style={{ width: 440, maxWidth: "94vw" }}>
            <header className="modal-head">
              <div><h2 className="modal-title">검색 대상 신규</h2><div className="modal-sub">리스트명과 항목 코드·명칭을 설정합니다.</div></div>
              <button type="button" className="modal-close" onClick={() => setNpOpen(false)}>{CC_I.close}</button>
            </header>
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label className="fld"><span className="fld-label">검색대상코드</span>
                <input className="fld-input is-mono" autoFocus value={npCode} onChange={(e) => setNpCode(e.target.value)} placeholder="00001" />
              </label>
              <label className="fld"><span className="fld-label">검색대상명</span>
                <input className="fld-input" value={npName} onChange={(e) => setNpName(e.target.value)} placeholder="예: 지역" />
              </label>
            </div>
            <footer className="modal-foot">
              <div className="ff-left" />
              <div className="ff-right">
                <button type="button" className="btn-ghost" onClick={() => setNpOpen(false)}>취소</button>
                <button type="button" className="btn-primary" disabled={!npName.trim()} onClick={() => {
                  const nm = npName.trim();
                  const next = { ...customLists, [nm]: [] };
                  setCustomLists(next);
                  try { localStorage.setItem("cc.customLists.v1", JSON.stringify(next)); } catch {}
                  setSrcCat(nm); setCatSel(nm); setType("lookup"); setNpOpen(false);
                }}>저장 <kbd className="btn-kbd">F8</kbd></button>
              </div>
            </footer>
          </div>
        </div>
      ) : null}
      {catPick ? (
        <div className="modal-root" style={{ zIndex: 96 }} onMouseDown={(e) => { if (e.target === e.currentTarget) setCatPick(false); }}>
          <div className="modal" style={{ width: 460, maxWidth: "94vw" }}>
            <header className="modal-head">
              <div><h2 className="modal-title">{editListName ? editListName + " 검색" : "검색 대상 리스트"}</h2><div className="modal-sub">{editListName ? "항목을 선택하거나 신규 등록하세요." : "입력 시 띄울 코드도움 대상입니다."}</div></div>
              <button type="button" className="modal-close" onClick={() => setCatPick(false)}>{CC_I.close}</button>
            </header>
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {editListName ? (
                <React.Fragment>
                  <div className="cc-lookup">
                    <input className="fld-input" autoFocus value={itemQ} onChange={(e) => setItemQ(e.target.value)} placeholder="검색어를 입력하세요" />
                    <button type="button" className="cc-lookup-btn" tabIndex={-1}>{CC_I.search}</button>
                  </div>
                  <div style={{ maxHeight: 300, overflowY: "auto", border: "1px solid var(--line-soft)", borderRadius: 10 }}>
                    <div className="slotpick-grp" style={{ padding: "8px 12px" }}>{editListName}</div>
                    {editRows.filter(v => !itemQ.trim() || String(v).includes(itemQ.trim())).length === 0 ? <div className="fld-hint" style={{ padding: 14 }}>항목이 없습니다.</div> : null}
                    {editRows.map((v, i) => ({ v, i })).filter(({ v }) => !itemQ.trim() || String(v).includes(itemQ.trim())).map(({ v, i }) => (
                      <button key={i} type="button" className={`pickrow ${editChk[0] === i ? "is-on" : ""}`} onClick={() => setEditChk([i])}>
                        <span>{String(v).trim().split(/\s+/).length > 1 ? String(v).trim().replace(/\s+/, " · ") : v}</span>
                      </button>
                    ))}
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="cc-lookup">
                    <input className="fld-input" autoFocus value={catQ} onChange={(e) => setCatQ(e.target.value)} placeholder="검색어를 입력하세요"
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); const rows = [...FIELDS, ...Object.keys(customLists)].filter(f => !catQ.trim() || f.includes(catQ.trim())); const pickd = rows.includes(catSel) ? catSel : rows[0]; if (pickd) { setNewListOpen(false); setSrcCat(pickd); setCatPick(false); } } }} />
                    <button type="button" className="cc-lookup-btn" tabIndex={-1}>{CC_I.search}</button>
                  </div>
                  <div style={{ maxHeight: 300, overflowY: "auto", border: "1px solid var(--line-soft)", borderRadius: 10 }}>
                    {[...FIELDS, ...Object.keys(customLists)].filter(f => !catQ.trim() || f.includes(catQ.trim())).map(f => (
                      <button key={f} type="button" className={`pickrow ${(catSel || srcCat) === f ? "is-on" : ""}`} onClick={() => setCatSel(f)} onDoubleClick={() => { setNewListOpen(false); setSrcCat(f); setCatPick(false); }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <input type="checkbox" tabIndex={-1} readOnly checked={(catSel || srcCat) === f} style={{ width: 15, height: 15, pointerEvents: "none" }} />
                          {f}
                        </span>
                        {customLists[f] ? <span className="ae-type">{customLists[f].length}개</span> : <span className="ae-type">기술key</span>}
                      </button>
                    ))}
                  </div>
                </React.Fragment>
              )}
            </div>
            <footer className="modal-foot">
              <div className="ff-left">{editListName ? `${editRows.length}건 · F2 신규` : `${[...FIELDS, ...Object.keys(customLists)].filter(f => !catQ.trim() || f.includes(catQ.trim())).length}건 · Enter 선택 · F2 신규`}</div>
              <div className="ff-right">
                {editListName ? (
                  <React.Fragment>
                    {editChk.length ? <button type="button" className="btn-ghost" onClick={() => { setEditRows(p => p.filter((_, i) => !editChk.includes(i))); setEditChk([]); }}>삭제</button> : null}
                    <button type="button" className="btn-ghost" disabled={editChk.length !== 1} onClick={() => { const i = editChk[0]; const parts = String(editRows[i] || "").trim().split(/\s+/); setRaIdx(i); setRaCode(parts.length > 1 ? parts[0] : ""); setRaName(parts.length > 1 ? parts.slice(1).join(" ") : (parts[0] || "")); setRaOpen(true); }}>수정</button>
                    <button type="button" className="btn-primary" onClick={() => { const used = editRows.map(v => parseInt(String(v).trim().split(/\s+/)[0], 10)).filter(n => !isNaN(n)); setRaIdx(-1); setRaCode(String((used.length ? Math.max(...used) : 0) + 1).padStart(5, "0")); setRaName(""); setRaOpen(true); }}>+ 신규 등록 <kbd className="btn-kbd">F2</kbd></button>
                    <button type="button" className="btn-ghost" onClick={() => {
                      const vals = editRows.map(v => v.trim()).filter(Boolean);
                      const next = { ...customLists, [editListName]: vals };
                      setCustomLists(next);
                      try { localStorage.setItem("cc.customLists.v1", JSON.stringify(next)); } catch {}
                      setEditListName("");
                    }}>저장 <kbd className="btn-kbd">F8</kbd></button>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <button type="button" className="btn-ghost" disabled={!customLists[catSel || srcCat]} onClick={() => { const nm = catSel || srcCat; if (onManageList) { onManageList(nm); return; } setEditListName(nm); setEditRows([...(customLists[nm] || [])]); setEditChk([]); setItemQ(""); }}>수정</button>
                    <button type="button" className="btn-ghost" onClick={() => { setNewListOpen(false); setSrcCat(catSel || srcCat); setCatPick(false); }}>적용</button>
                    <button type="button" className="btn-primary" onClick={() => { setNpName(""); setNpCode(nextListCode()); setNpRows([""]); setNpOpen(true); }}>+ 신규 <kbd className="btn-kbd">F2</kbd></button>
                  </React.Fragment>
                )}
              </div>
            </footer>
          </div>
        </div>
      ) : null}
      {slotPick ? (
        <div className="modal-root" style={{ zIndex: 95 }} onMouseDown={(e) => { if (e.target === e.currentTarget) setSlotPick(false); }}>
          <div className="modal" style={{ width: 520, maxWidth: "94vw" }}>
            <header className="modal-head">
              <div><h2 className="modal-title">항목 검색</h2><div className="modal-sub">기술키 또는 추가키 슬롯을 선택하세요.</div></div>
              <button type="button" className="modal-close" onClick={() => setSlotPick(false)}>{CC_I.close}</button>
            </header>
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input className="fld-input" autoFocus value={pickQ} onChange={(e) => setPickQ(e.target.value)} placeholder="검색 (예: 전화, 문자형3)" />
              <div style={{ maxHeight: 320, overflowY: "auto", border: "1px solid var(--line-soft)", borderRadius: 10 }}>
                {(() => {
                  const q = pickQ.trim();
                  const SLOT_ROWS = [
                    Array.from({ length: 10 }, (_, i) => ({ key: "문자형" + (i + 1), type: "text" })),
                    Array.from({ length: 5 }, (_, i) => ({ key: "숫자형" + (i + 1), type: "money" })),
                    Array.from({ length: 5 }, (_, i) => ({ key: "검색형" + (i + 1), type: "lookup" })),
                  ];
                  const groups = [
                    ...(srcGroups ? [{ name: "조회 기술키", items: ccExpandLookup((srcGroups["조회 기술키"] || []).map(n => ({ key: n, plain: true }))) }] : []),
                    { name: "입력 기술키" + (scope ? "(" + scope + ")" : ""), items: ccExpandLookup(BASE_KEYS.map(n => ({ key: n, plain: true }))) },
                    { name: "입력 추가키" + (scope ? "(" + scope + ")" : ""), items: ccExpandLookup(activeSlots ? activeSlots.map(s => ({ key: s.key, type: s.type, label2: s.label })) : SLOT_ROWS.flat()) },

                  ];
                  let any = false;
                  const out = groups.map((g, gi) => {
                    const applied = new Set((existing || []).map(x => x && x.label).filter(Boolean));
                    const items = g.items.filter(it => (!q || it.key.includes(q)) && !(it.plain && applied.has(it.key)));
                    if (!items.length) return null;
                    any = true;
                    return (
                      <React.Fragment key={g.name + gi}>
                        <div className="slotpick-grp" style={{ padding: "8px 12px" }}>{g.name}</div>
                        {items.map(it => {
                          if (it.plain) return <button key={g.name + it.key} type="button" className="pickrow" onClick={() => { setLabel(it.key); setSlotPick(false); setForceOpen(true); }}>{it.key}</button>;
                          const taken = !it.view && usedSlots.has(it.key) && (!initial || initial.slot !== it.key);
                          return (
                            <button key={g.name + it.key} type="button" className="pickrow" disabled={taken} style={taken ? { opacity: .4, cursor: "not-allowed" } : undefined}
                              onClick={() => { if (it.view) { setLabel(it.key); setSlotPick(false); setForceOpen(true); return; } pickSlot(it); setSlotPick(false); }}>
                              <span>{it.label2 && it.label2 !== it.key ? it.label2 + " · " + it.key : it.key}</span>
                              <span className="ae-type">{it.type === "text" ? "문자" : it.type === "money" ? "숫자" : "검색"}{taken ? " · 사용중" : ""}</span>
                            </button>
                          );
                        })}
                      </React.Fragment>
                    );
                  });
                  return <React.Fragment>{out}{!any ? <div className="fld-hint" style={{ padding: 14 }}>검색 결과가 없습니다.</div> : null}</React.Fragment>;
                })()}
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {rowsOpen ? (
        <div className="modal-root" style={{ zIndex: 90 }} onMouseDown={(e) => { if (e.target === e.currentTarget) setRowsOpen(false); }}>
          <div className="modal" style={{ width: 420, maxWidth: "92vw" }}>
            <header className="modal-head"><div><h2 className="modal-title">항목 리스트 등록</h2><div className="modal-sub">{newListName.trim() || "새 리스트"}에 들어갈 값을 추가하세요.</div></div></header>
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 360, overflowY: "auto" }}>
              {rowsDraft.length === 0 ? <div className="fld-hint">등록된 항목이 없습니다.</div> : null}
              {rowsDraft.map((v, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="fld-hint is-mono" style={{ width: 22, textAlign: "right" }}>{i + 1}</span>
                  <input className="fld-input" value={v} autoFocus={i === rowsDraft.length - 1}
                    onChange={(e) => setRowsDraft(p => p.map((x, j) => j === i ? e.target.value : x))}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); setRowsDraft(p => [...p, ""]); } }} />
                  <button type="button" className="btn-ghost" onClick={() => setRowsDraft(p => p.filter((_, j) => j !== i))}>삭제</button>
                </div>
              ))}
              <button type="button" className="btn-ghost" style={{ alignSelf: "flex-start", marginTop: 4 }} onClick={() => setRowsDraft(p => [...p, ""])}>+ 신규</button>
            </div>
            <footer className="modal-foot"><div className="ff-left" /><div className="ff-right">
              <button type="button" className="btn-ghost" onClick={() => setRowsOpen(false)}>취소</button>
              <button type="button" className="btn-primary" onClick={() => { setNewListVals(rowsDraft.map(v => v.trim()).filter(Boolean).join("\n")); setRowsOpen(false); }}>확인</button>
            </div></footer>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ─────────────────────────────────────────────
   평면 테이블용 범용 화면설정 시스템
   (품목·거래처·주문 등 전표가 아닌 목록에서 사용)
   ───────────────────────────────────────────── */
// 커스텀 열 값 계산 — formula(수식) / text(고정문구)
/* 소스 문자열 → 값 해생. "·" 로 연결된 코드·값 중 한쪽만 뽑는 "(코드)"/"(값)" 지원 */
function ccResolveSrc(src, row, baseColumns) {
  let s = String(src || "").trim(); let part = null;
  const pm = /^(.*)\((코드|값)\)$/.exec(s);
  if (pm) { s = pm[1].trim(); part = pm[2]; }
  let v;
  const b = (baseColumns || []).find(c => c.label === s);
  if (b) v = row[b.key];
  else {
    const m = /^(문자형|숫자형|검색형)(\d+)$/.exec(s);
    const g = /^그룹(\d+)$/.exec(s);
    if (m) v = row[(m[1] === "문자형" ? "xt" : m[1] === "숫자형" ? "xn" : "xs") + m[2]];
    else if (g && Number(g[1]) >= 3) v = row["xs" + (Number(g[1]) - 2)];
    else v = row[s];
  }
  if (v === undefined || v === null) v = "";
  if (part) {
    const sp = String(v).split(/\s*·\s*/);
    // "코드 · 값" 형태가 아니면(구분자 없음) 전체를 값으로, 코드는 미등록 처리
    if (sp.length < 2) v = part === "값" ? String(v) : "";
    else v = part === "코드" ? (sp[0] || "") : sp.slice(1).join(" · ");
  }
  return v;
}

/* 검색형·그룹 슬롯은 항목 선택 시 (코드)/(값) 로 분리해 골를 수 있다 */
function ccExpandLookup(items) {
  const out = [];
  (items || []).forEach(it => {
    out.push(it);
    const isLk = it.type === "lookup" || /^(그룹\d+|검색형\d+)$/.test(String(it.key || ""));
    if (!isLk) return;
    ["코드", "값"].forEach(p => out.push({ ...it, key: it.key + "(" + p + ")", label2: it.label2 ? it.label2 + "(" + p + ")" : undefined, asSource: true }));
  });
  return out;
}

function calcFlatCol(col, row, baseColumns) {
  if (!col) return "";
  if (col.type === "dflt") return col.dflt || "";
  if (col.slot && col.type !== "source" && col.type !== "formula" && col.type !== "text") return ccResolveSrc(col.slot, row, baseColumns);
  if (col.type === "source") return ccResolveSrc(col.source, row, baseColumns);
  if (col.type === "text") return col.text || col.dflt || "";
  if (col.type === "formula") {
    let expr = String(col.formula || "");
    (baseColumns || []).forEach(c => {
      const v = Number(row[c.key]);
      const num = isFinite(v) ? v : 0;
      if (c.label) expr = expr.split(c.label).join("(" + num + ")");
    });
    if (!/^[0-9+\-*/().\s]+$/.test(expr) || !expr.trim()) return col.dflt || "";
    try { const out = Function('"use strict";return (' + expr + ')')(); return (typeof out === "number" && isFinite(out)) ? out.toLocaleString("ko-KR") : (col.dflt || ""); }
    catch (e) { return ""; }
  }
  return "";
}

// 범용 화면설정 훅
function useColConfig({ allColumns, defaultVisible, prefix }) {
  const K = prefix + ".colcfg.";
  const ls = (k, d) => { try { const v = JSON.parse(localStorage.getItem(K + k)); return v == null ? d : v; } catch (e) { return d; } };
  const save = (k, v) => { try { localStorage.setItem(K + k, JSON.stringify(v)); } catch (e) {} };

  const [hidden, setHidden] = useState(() => ls("hidden", allColumns.filter(c => !defaultVisible.includes(c.key) && !c.locked).map(c => c.key)));
  const [order, setOrder] = useState(() => ls("order", null));
  const [widths, setWidths] = useState(() => ls("widths", {}));
  const [labels, setLabels] = useState(() => ls("labels", {}));
  const [custom, setCustom] = useState(() => ls("custom", []));
  const [views, setViews] = useState(() => ls("views", []));
  const [dflts, setDflts] = useState(() => ls("dflts", {}));
  const [activeView, setActiveView] = useState(() => ls("activeView", null));
  useEffect(() => { save("activeView", activeView); }, [activeView]);
  const bootedRef = useRef(false);
  useEffect(() => {
    if (bootedRef.current) return;
    if (!views.length) return;
    bootedRef.current = true;
    const code = ls("activeView", null);
    if (code && views.some(v => v.code === code)) applyView(code, true);
  }, [views]);
  const [cfg, setCfg] = useState(false);

  useEffect(() => save("hidden", hidden), [hidden]);
  useEffect(() => save("order", order), [order]);
  useEffect(() => save("widths", widths), [widths]);
  useEffect(() => save("labels", labels), [labels]);
  useEffect(() => save("custom", custom), [custom]);
  useEffect(() => save("views", views), [views]);
  useEffect(() => save("dflts", dflts), [dflts]);

  const baseMap = useMemo(() => new Map(allColumns.map(c => [c.key, c])), [allColumns]);
  const hiddenSet = useMemo(() => new Set(hidden), [hidden]);

  const allCols = useMemo(() => {
    const customMap = new Map(custom.map(c => [c.key, c]));
    let keys = order && order.length ? order.slice() : [...allColumns.map(c => c.key), ...custom.map(c => c.key)];
    // 누락된 키 보정
    [...allColumns.map(c => c.key), ...custom.map(c => c.key)].forEach(k => { if (!keys.includes(k)) keys.push(k); });
    keys = keys.filter(k => baseMap.has(k) || customMap.has(k));
    return keys.map(k => {
      const cust = customMap.get(k);
      if (cust) return { key: k, label: labels[k] || cust.label, width: widths[k] ? widths[k] + "px" : (cust.width || "120px"), kind: cust.kind || "custom", isCustom: true, def: cust, hidden: hiddenSet.has(k) };
      const b = baseMap.get(k);
      return { ...b, label: labels[k] || b.label, width: widths[k] ? widths[k] + "px" : b.width, hidden: hiddenSet.has(k) && !b.locked, isCustom: false, dflt: dflts[k] || "", def: { key: k, label: labels[k] || b.label, dflt: dflts[k] || "", _base: true } };
    });
  }, [order, custom, labels, widths, hiddenSet, allColumns, baseMap, dflts]);

  const visibleCols = useMemo(() => allCols.filter(c => !c.hidden), [allCols]);

  const ensureOrder = () => (order && order.length ? order.slice() : allCols.map(c => c.key));
  const toggleCol = (key) => { const b = baseMap.get(key); if (b && b.locked) return; setHidden(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]); };
  const renameCol = (key, label) => setLabels(prev => ({ ...prev, [key]: label }));
  const setColDefault = (key, v) => setDflts(prev => ({ ...prev, [key]: v || "" }));
  const removeCol = (key) => { setCustom(prev => prev.filter(c => c.key !== key)); setHidden(prev => prev.filter(k => k !== key)); setOrder(prev => prev ? prev.filter(k => k !== key) : prev); };
  const addCustom = (col, afterKey) => {
    const code = "열추가 " + String.fromCharCode(65 + custom.length);
    const key = "cx" + Date.now().toString(36);
    setCustom(prev => [...prev, { ...col, code, key }]);
    const ks = ensureOrder();
    const anchor = afterKey || window.__ccAnchorKey;
    const at = anchor ? ks.indexOf(anchor) : -1;
    if (at >= 0) { ks.splice(at + 1, 0, key); setOrder(ks); }
    window.__ccAnchorKey = null;
  };
  const addCustomMany = (cols, afterKey) => {
    const anchor = afterKey || window.__ccAnchorKey;
    const made = cols.map((c, i) => ({ ...c, code: "열추가 " + String.fromCharCode(65 + custom.length + i), key: "cx" + Date.now().toString(36) + i }));
    setCustom(prev => [...prev, ...made]);
    const ks = ensureOrder();
    const at = anchor ? ks.indexOf(anchor) : -1;
    if (at >= 0) { ks.splice(at + 1, 0, ...made.map(m => m.key)); setOrder(ks); }
    window.__ccAnchorKey = null;
  };
  const updateCustom = (key, patch) => setCustom(prev => prev.map(c => c.key === key ? { ...c, ...patch } : c));
  const setWidth = (key, w) => setWidths(prev => ({ ...prev, [key]: w }));
  const moveCol = (fromK, toK) => { if (fromK === toK) return; const ks = ensureOrder(); const fi = ks.indexOf(fromK), ti = ks.indexOf(toK); if (fi < 0 || ti < 0) return; ks.splice(ti, 0, ks.splice(fi, 1)[0]); setOrder(ks); };
  const resetCols = () => { setHidden(allColumns.filter(c => !defaultVisible.includes(c.key) && !c.locked).map(c => c.key)); setOrder(null); setWidths({}); setLabels({}); setCustom([]); setActiveView(null); };

  // 저장된 화면(뷰)
  const snapshot = () => ({ hidden: [...hidden], order: order ? [...order] : null, widths: { ...widths }, labels: { ...labels }, custom: custom.map(c => ({ ...c })), dflts: { ...dflts } });
  const restore = (s) => { if (!s) return; setHidden(s.hidden || []); setOrder(s.order || null); setWidths(s.widths || {}); setLabels(s.labels || {}); setCustom(s.custom || []); setDflts(s.dflts || {}); };
  const applyView = (code, silent) => { const v = views.find(x => x.code === code); if (!v) return; const c = v.config || {}; setHidden(c.hidden || []); setOrder(c.order || null); setWidths(c.widths || {}); setLabels(c.labels || {}); setCustom(c.custom || []); setDflts(c.dflts || {}); setActiveView(code); if (!silent) showToast(code + ' "' + v.name + '" 화면을 적용했어요', "info"); };
  const saveView = (name) => { const code = nextViewCode(views); setViews(prev => [...prev, { code, name, config: snapshot() }]); setActiveView(code); showToast(code + ' "' + name + '" 화면을 저장했어요'); };
  const overwriteView = (code) => { const v = views.find(x => x.code === code); setViews(prev => prev.map(x => x.code === code ? { ...x, config: snapshot() } : x)); setActiveView(code); showToast(code + (v ? ' "' + v.name + '"' : "") + " 화면을 현재 상태로 갱신했어요"); };
  const renameView = (code, name) => { setViews(prev => prev.map(v => v.code === code ? { ...v, name } : v)); showToast("화면 이름을 변경했어요", "info"); };
  const deleteView = (code) => { const v = views.find(x => x.code === code); setViews(prev => prev.filter(x => x.code !== code)); setActiveView(a => a === code ? null : a); showToast(code + (v ? ' "' + v.name + '"' : "") + " 화면을 삭제했어요", "info"); };

  // 설정 진입 시 스냅샷 → 취소 시 진입 전 구성으로 복원 (전 화면 공통)
  const cfgSnap = useRef(null);
  useEffect(() => { if (cfg) cfgSnap.current = snapshot(); }, [cfg]);
  const cancelCfg = () => { if (cfgSnap.current) restore(cfgSnap.current); setCfg(false); };

  return {
    cfg, setCfg, cancelCfg, allCols, visibleCols, custom, views, activeView,
    toggleCol, renameCol, removeCol, addCustom, addCustomMany, updateCustom, setWidth, moveCol, resetCols, setColDefault,
    applyView, saveView, overwriteView, renameView, deleteView, snapshot, restore,
  };
}

// 헤더 셀 팝오버 (평면 테이블용)
function ColCfgPopover({ col, x, y, onAddNew, onRename, onToggle, onRemove, onEdit, onClose }) {
  if (!col) return null;
  return (
    <>
      <div className="colpop-scrim" onClick={onClose} />
      <div className="colpop" style={{ left: x, top: y, transform: "translateX(-50%)" }}>
        <div className="colpop-head"><span className="colpop-sw" />{col.label}</div>
        <button type="button" className="colpop-item" onClick={() => { window.__ccAnchorKey = col.key; onAddNew(); onClose(); }}>새 열 추가</button>
        <button type="button" className="colpop-item" onClick={() => { onEdit(col.isCustom ? col.def : { key: col.key, label: col.label, _base: true }); onClose(); }}>설정</button>
        {!col.locked ? <button type="button" className="colpop-item" onClick={() => { onToggle(col.key); onClose(); }}>{col.hidden ? "표시하기" : "숨기기"}</button> : null}
        {col.isCustom ? <button type="button" className="colpop-item colpop-danger" onClick={() => { onRemove(col.key); onClose(); }}>열 삭제</button> : null}
      </div>
    </>
  );
}

// 커스텀 열 추가/수정 모달 (평면 테이블용 — 수식/고정문구)
function FlatAddColModal({ open, initial, baseColumns = [], srcGroups = [], onAdd, onClose }) {
  const [source, setSource] = useState(initial ? (initial.source || "") : "");
  const [label, setLabel] = useState(initial ? initial.label : "");
  const [type, setType] = useState(initial ? initial.type : "formula");
  const [formula, setFormula] = useState(initial ? (initial.formula || "") : "");
  const [text, setText] = useState(initial ? (initial.text || "") : "");
  const [dflt, setDflt] = useState(initial ? (initial.dflt || "") : "");
  const [dfltOpen, setDfltOpen] = useState(false);
  const [dfltPick, setDfltPick] = useState(false);
  const [dfltQ, setDfltQ] = useState("");
  const CC_ACCOUNTS = [
    { code: "101", name: "현금" }, { code: "103", name: "보통예금" }, { code: "108", name: "외상매출금" },
    { code: "110", name: "받을어음" }, { code: "120", name: "미수금" }, { code: "146", name: "상품" },
    { code: "251", name: "외상매입금" }, { code: "252", name: "지급어음" }, { code: "253", name: "미지급금" },
    { code: "255", name: "부가세예수금" }, { code: "135", name: "부가세대급금" },
    { code: "401", name: "상품매출" }, { code: "451", name: "상품매입" },
    { code: "801", name: "직원급여" }, { code: "831", name: "지급수수료" }, { code: "824", name: "운반보관료" },
    { code: "930", name: "잡이익" }, { code: "980", name: "잡손실" },
  ];
  const inputRef = useRef(null);
  const isDateField = !!(initial && (initial.key === "__date" || initial.key === "date" || initial.kind === "date"));
  const fRef = useRef(null);
  const insertToken = (tok) => {
    const el = fRef.current;
    if (!el) { setFormula(f => f + tok); return; }
    const s = el.selectionStart ?? formula.length, e = el.selectionEnd ?? formula.length;
    const next = formula.slice(0, s) + tok + formula.slice(e);
    setFormula(next);
    setTimeout(() => { el.focus(); const p = s + tok.length; el.setSelectionRange(p, p); }, 0);
  };
  useEffect(() => { if (open) { setLabel(initial ? (initial.label || "") : ""); setType(initial ? (initial.type || "formula") : "formula"); setFormula(initial ? (initial.formula || "") : ""); setText(initial ? (initial.text || "") : ""); setDflt(initial ? (initial.dflt || "") : ""); } }, [open, initial]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 40); }, [open]);
  useEffect(() => {
    if (!open) return;
    const fn = (e) => { if (e.key === "Escape") { e.stopImmediatePropagation(); e.preventDefault(); onClose(); } };
    window.addEventListener("keydown", fn, true);
    return () => window.removeEventListener("keydown", fn, true);
  }, [open, onClose]);
  if (!open) return null;
  const submit = (e) => { e.preventDefault(); if (!label.trim()) return; onAdd({ label: label.trim(), type, formula, text, dflt: (dflt || "").trim(), source }); };
  const numCols = baseColumns.filter(c => ["num", "money", "price", "stock"].includes(c.kind));
  return (
    <div className="modal-root" role="dialog" aria-modal="true" style={{ zIndex: 92 }}>
      <div className="modal-scrim" onClick={onClose} />
      <form className="modal modal-newitem" style={{ maxWidth: 480 }} onSubmit={submit}>
        <header className="modal-head">
          <div>
            <div className="addcol-code-badge">{initial ? (initial.code || "열 설정") : "새 열"}</div>
            <input ref={inputRef} className="modal-title-input" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="열 명칭을 입력하세요" />
          </div>
          <button type="button" className="modal-close" onClick={onClose}>{CC_I.close}</button>
        </header>
        <div className="ni-body">
          <div className="fld"><span className="fld-label">열 유형</span>
            <div className="field-chips">
              <button type="button" className={`field-chip ${type === "formula" ? "is-on" : ""}`} onClick={() => setType("formula")}>계산식</button>
              {srcGroups.length ? <button type="button" className={`field-chip ${type === "source" ? "is-on" : ""}`} onClick={() => setType("source")}>항목 불러오기</button> : null}
              <button type="button" className={`field-chip ${type === "text" ? "is-on" : ""}`} onClick={() => setType("text")}>고정 문구</button>
              <button type="button" className={`field-chip ${type === "dflt" ? "is-on" : ""}`} onClick={() => setType("dflt")}>기본값</button>
            </div>
          </div>
          {type === "source" ? (
            <div className="fld"><span className="fld-label">항목 선택</span>
              {srcGroups.map(g => (
                <div key={g.title} style={{ marginTop: 8 }}>
                  <span className="fld-hint" style={{ display: "block", marginBottom: 4 }}>{g.title}</span>
                  <div className="field-chips">
                    {ccExpandLookup(g.items.map(it => (typeof it === "string" ? { key: it } : { key: it.value, label2: it.alias }))).map(it => { const v = it.key; const al = it.label2; return (
                      <button key={v} type="button" className={`field-chip ${source === v ? "is-on" : ""}`} onClick={() => { setSource(v); if (!label.trim()) setLabel(al || v); }}>{v}{al && al !== v ? <span className="addcol-slot-tag">{al}</span> : null}</button>
                    ); })}
                  </div>
                </div>
              ))}
              <span className="fld-hint" style={{ marginTop: 8 }}>입력화면에 적용된 해당 항목 값을 그대로 가지옵니다.</span>
            </div>
          ) : type === "formula" ? (
            <label className="fld"><span className="fld-label">계산식</span>
              <input ref={fRef} className="fld-input is-mono" value={formula} onChange={(e) => setFormula(e.target.value)} placeholder="예: 판매단가 - 매입단가" />
              <div className="fx-tool">
                <div className="fx-row">
                  {numCols.map(c => (
                    <button type="button" key={c.key} className="fx-chip" onClick={() => insertToken(c.label)}>{c.label}</button>
                  ))}
                </div>
                <div className="fx-row">
                  {["+", "-", "×", "÷", "(", ")"].map(op => (
                    <button type="button" key={op} className="fx-op" onClick={() => insertToken(op === "×" ? "*" : op === "÷" ? "/" : op)}>{op}</button>
                  ))}
                  <button type="button" className="fx-op fx-clear" onClick={() => setFormula("")}>지우기</button>
                </div>
                <div className="fx-hint">숫자 항목·연산자를 눌러 식을 만들거나 직접 입력하세요.</div>
              </div>
            </label>
          ) : type === "dflt" ? (isDateField ? (
            <div className="fld"><span className="fld-label">기본값 · 일자</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button type="button" className={`field-chip ${!dflt ? "is-on" : ""}`} onClick={() => setDflt("")}>오늘</button>
                <input className="fld-input" type="date" value={/^\d{4}-\d{2}-\d{2}$/.test(dflt) ? dflt : ""} max="9999-12-31" onChange={(e) => setDflt(e.target.value)} style={{ width: 190 }} />
              </div>
              <span className="fld-hint" style={{ marginTop: 4 }}>지정일을 바꾸지 않으면 진입 시 오늘 날짜가 들어갑니다.</span>
            </div>
          ) : (
            <div className="fld"><span className="fld-label">기본값 · 계정과목</span>
              <div className="cc-lookup">
                <input className="fld-input" value={dflt} onChange={(e) => setDflt(e.target.value)} onKeyDown={(e) => { if (e.key === "F2") { e.preventDefault(); setDfltQ(dflt); setDfltPick(true); } if (e.key === "Enter") { e.preventDefault(); const q = dflt.trim(); const hit = CC_ACCOUNTS.find(a => a.name === q); if (!hit && q) { setDfltQ(q); setDfltPick(true); } } }} placeholder="계정과목 검색 (F2)" />
                <button type="button" className="cc-lookup-btn" title="계정과목 코드도움 (F2)" onMouseDown={(e) => { e.preventDefault(); setDfltQ(dflt); setDfltPick(true); }}>{CC_I.search}</button>
                {dflt ? <button type="button" className="cc-lookup-clear" title="지우기" onClick={() => setDflt("")}>×</button> : null}
              </div>
              <span className="fld-hint" style={{ marginTop: 4 }}>선택한 계정과목이 모든 칸에 기본값으로 표시됩니다. 돋보기 또는 F2로 코드도움.</span>
            </div>
          )) : (
            <label className="fld"><span className="fld-label">표시할 문구</span>
              <input className="fld-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="모든 행에 동일하게 표시됩니다" /></label>
          )}
        </div>
        {dfltPick ? (() => {
          const q = (dfltQ || "").trim();
          const list = CC_ACCOUNTS.filter(a => !q || a.name.includes(q) || a.code.includes(q));
          return (
            <div className="cc-pick-root" onMouseDown={(e) => { if (e.target.classList.contains("cc-pick-root")) setDfltPick(false); }}>
              <div className="cc-pick">
                <div className="cc-pick-head">
                  <span className="cc-pick-title">계정과목 코드도움</span>
                  <button type="button" className="modal-close" onClick={() => setDfltPick(false)}>{CC_I.close}</button>
                </div>
                <input className="cc-acc-q" autoFocus value={dfltQ} onChange={(e) => setDfltQ(e.target.value)} placeholder="코드 또는 계정과목명" onKeyDown={(e) => { if (e.key === "Escape") { e.stopPropagation(); setDfltPick(false); } if (e.key === "Enter" && list[0]) { e.preventDefault(); setDflt(list[0].name); if (!label.trim()) setLabel(list[0].name); setDfltPick(false); } }} />
                <div className="cc-pick-grid cc-pick-h"><div>코드</div><div>계정과목명</div></div>
                <div className="cc-pick-list">
                  {list.length ? list.map(a => (
                    <button key={a.code} type="button" className="cc-pick-grid cc-pick-row" onClick={() => { setDflt(a.name); if (!label.trim()) setLabel(a.name); setDfltPick(false); }}>
                      <div className="cc-acc-code">{a.code}</div><div>{a.name}</div>
                    </button>
                  )) : <div className="fx-hint" style={{ padding: "14px" }}>일치하는 계정과목이 없습니다.</div>}
                </div>
              </div>
            </div>
          );
        })() : null}
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
   입력화면 우측 "품목 정보 패널" — 표시 항목 설정
   ctx = { item, partner, line } (마스터에서 조회된 객체)
   ───────────────────────────────────────────── */
const PANEL_FIELD_DEFS = [
  { key: "i_code",   cat: "품목",   label: "품목코드",   get: (c) => c.item && c.item.code },
  { key: "i_name",   cat: "품목",   label: "품목명",     get: (c) => c.item && c.item.name },
  { key: "i_spec",   cat: "품목",   label: "규격",      get: (c) => c.item && c.item.spec },
  { key: "i_unit",   cat: "품목",   label: "단위",      get: (c) => c.item && c.item.unit },
  { key: "i_price",  cat: "품목",   label: "매입가",     get: (c) => c.item && c.item.price != null ? c.item.price.toLocaleString("ko-KR") + "원" : "" },
  { key: "i_sell",   cat: "품목",   label: "판매가",     get: (c) => c.item && c.item.sell != null ? c.item.sell.toLocaleString("ko-KR") + "원" : "" },
  { key: "i_stockq", cat: "품목",   label: "재고",      get: (c) => c.item && c.item.stock != null ? c.item.stock.toLocaleString("ko-KR") : "" },
  { key: "p_name",   cat: "거래처", label: "거래처명",   get: (c) => c.partner && c.partner.name },
  { key: "p_ceo",    cat: "거래처", label: "대표자",    get: (c) => c.partner && c.partner.ceo },
  { key: "p_biz",    cat: "거래처", label: "사업자번호", get: (c) => c.partner && c.partner.code },
  { key: "p_phone",  cat: "거래처", label: "전화번호",   get: (c) => c.partner && c.partner.phone },
  { key: "p_addr",   cat: "거래처", label: "주소",      get: (c) => c.partner && c.partner.region },
  { key: "s_stock",  cat: "재고",   label: "현재고",     get: (c) => c.item && c.item.stock != null ? c.item.stock.toLocaleString("ko-KR") : "" },
  { key: "s_safety", cat: "재고",   label: "안전재고",   get: (c) => c.item && c.item.safety != null ? c.item.safety.toLocaleString("ko-KR") : "" },
  { key: "s_eta",    cat: "재고",   label: "입고예정",   get: (c) => c.item && c.item.eta },
  { key: "s_loc",    cat: "재고",   label: "창고위치",   get: (c) => c.item && c.item.loc },
  { key: "s_last",   cat: "재고",   label: "최근입고일", get: (c) => c.item && c.item.lastIn },
];
function panelFieldValue(key, ctx) {
  const def = PANEL_FIELD_DEFS.find(d => d.key === key);
  if (!def) return { label: key, value: "" };
  let v = def.get(ctx || {});
  return { label: def.label, value: (v == null || v === "") ? "" : v };
}
// 패널 표시 항목 선택 모달 (체크박스, 카테고리별)
function PanelFieldPicker({ open, selected = [], onToggle, onClose }) {
  useEffect(() => {
    if (!open) return;
    const fn = (e) => { if (e.key === "Escape") { e.stopImmediatePropagation(); e.preventDefault(); onClose(); } };
    window.addEventListener("keydown", fn, true);
    return () => window.removeEventListener("keydown", fn, true);
  }, [open, onClose]);
  if (!open) return null;
  const cats = ["거래처", "품목", "재고"];
  const sel = new Set(selected);
  return (
    <div className="modal-root" role="dialog" aria-modal="true" style={{ zIndex: 93 }}>
      <div className="modal-scrim" onClick={onClose} />
      <div className="modal modal-newitem" style={{ maxWidth: 440 }}>
        <header className="modal-head">
          <div>
            <h2 className="modal-title">패널 항목 추가</h2>
            <div className="modal-sub">입력된 거래처·품목 정보를 패널에 표시합니다.</div>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>{CC_I.close}</button>
        </header>
        <div className="ni-body">
          {cats.map(cat => (
            <div className="pfp-group" key={cat}>
              <div className="pfp-cat">{cat}</div>
              <div className="pfp-chips">
                {PANEL_FIELD_DEFS.filter(d => d.cat === cat).map(d => (
                  <button type="button" key={d.key} className={`field-chip ${sel.has(d.key) ? "is-on" : ""}`} onClick={() => onToggle(d.key)}>{d.label}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <footer className="modal-foot">
          <div className="ff-left" />
          <div className="ff-right"><button type="button" className="btn-primary" onClick={onClose}>완료</button></div>
        </footer>
      </div>
    </div>
  );
}

// 패널 설정 모달 — 이름 + 표시 항목 선택 통합 (입력항목 설정과 동일한 형태)
function PanelSettingsModal({ open, initialName = "", initialFields = [], onSave, onClose }) {
  const [name, setName] = useState(initialName);
  const [fields, setFields] = useState(initialFields);
  const [srcCat, setSrcCat] = useState("품목");
  const inputRef = useRef(null);
  useEffect(() => { if (open) { setName(initialName); setFields(initialFields); setTimeout(() => inputRef.current && inputRef.current.focus(), 40); } }, [open]);
  useEffect(() => {
    if (!open) return;
    const fn = (e) => { if (e.key === "Escape") { e.stopImmediatePropagation(); e.preventDefault(); onClose(); } };
    window.addEventListener("keydown", fn, true);
    return () => window.removeEventListener("keydown", fn, true);
  }, [open, onClose]);
  if (!open) return null;
  const cats = ["품목", "거래처", "재고"];
  const sel = new Set(fields);
  const toggle = (k) => setFields(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);
  const save = () => { if (!name.trim()) return; onSave(name.trim(), fields); };
  return (
    <div className="modal-root" role="dialog" aria-modal="true" style={{ zIndex: 93 }}>
      <div className="modal-scrim" onClick={onClose} />
      <div className="modal modal-newitem modal-addcol">
        <header className="modal-head">
          <div>
            <div className="addcol-code-badge">패널 설정</div>
            <input ref={inputRef} className="modal-title-input" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") save(); }} placeholder="패널 이름을 입력하세요" />
          </div>
          <button type="button" className="modal-close" onClick={onClose}>{CC_I.close}</button>
        </header>
        <div className="addcol-cols">
          <div className="ni-body">
            <div className="fld">
              <span className="fld-label">기존 정보에서 가져오기</span>
              <div className="field-chips">
                {cats.map(c => (
                  <button key={c} type="button" className={`field-chip ${srcCat === c ? "is-on" : ""}`} onClick={() => setSrcCat(c)}>{c}</button>
                ))}
              </div>
            </div>
            <div className="addcol-divider"><span>{srcCat} 항목 선택</span></div>
            <div className="pfp-chips" style={{ marginTop: 4 }}>
              {PANEL_FIELD_DEFS.filter(d => d.cat === srcCat).map(d => (
                <button type="button" key={d.key} className={`field-chip ${sel.has(d.key) ? "is-on" : ""}`} onClick={() => toggle(d.key)}>{sel.has(d.key) ? "✓ " : ""}{d.label}</button>
              ))}
            </div>
          </div>
          <aside className="addcol-existing">
            <div className="ae-h">추가된 항목{fields.length ? " · " + fields.length + "개" : ""}</div>
            {fields.length === 0 ? (
              <div className="ae-empty">왼쪽에서 표시할 항목을 선택하세요.</div>
            ) : (
              <div className="ae-list">
                {fields.map(k => { const d = PANEL_FIELD_DEFS.find(x => x.key === k); if (!d) return null; return (
                  <div key={k} className="ae-item">
                    <span className="ae-code">{d.cat}</span>
                    <span className="ae-name">{d.label}</span>
                    <button type="button" className="rs-info-rm" title="제거" onClick={() => toggle(k)}>{CC_I.close}</button>
                  </div>
                ); })}
              </div>
            )}
          </aside>
        </div>
        <footer className="modal-foot">
          <div className="ff-left" />
          <div className="ff-right">
            <button type="button" className="btn-ghost" onClick={onClose}>취소</button>
            <button type="button" className="btn-primary" onClick={save}>저장 <kbd className="btn-kbd">F8</kbd></button>
          </div>
        </footer>
      </div>
    </div>
  );
}

// 다중 패널 상태 훅 (패널 A/B… 추가·삭제·순서변경, 각 패널이 필드 목록 보유)
function usePanels(newKey, legacyKey) {
  const [panels, setPanels] = useState(() => {
    let init = null;
    try { const v = JSON.parse(localStorage.getItem(newKey)); if (Array.isArray(v)) init = v; } catch (e) {}
    if (!init) { try { const old = JSON.parse(localStorage.getItem(legacyKey)); if (Array.isArray(old) && old.length) init = [{ id: "base", title: "품목 정보", fields: old }]; } catch (e) {} }
    if (!init || !init.length) init = [{ id: "base", title: "품목 정보", fields: [] }];
    return init;
  });
  useEffect(() => { try { localStorage.setItem(newKey, JSON.stringify(panels)); } catch (e) {} }, [panels]);
  const nextTitle = () => "패널 " + String.fromCharCode(65 + Math.max(0, panels.length - 1));
  const addPanel = (title) => setPanels(p => [...p, { id: "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), title: title || ("패널 " + String.fromCharCode(65 + p.length)), fields: [], zone: "right" }]);
  const removePanel = (id) => setPanels(p => p.filter(x => x.id !== id));
  const renamePanel = (id, title) => setPanels(p => p.map(x => x.id === id ? { ...x, title } : x));
  const toggleField = (id, key) => setPanels(p => p.map(x => x.id === id ? { ...x, fields: x.fields.includes(key) ? x.fields.filter(k => k !== key) : [...x.fields, key] } : x));
  const movePanel = (fromId, toId) => setPanels(p => { if (fromId === toId) return p; const arr = p.slice(); const fi = arr.findIndex(x => x.id === fromId), ti = arr.findIndex(x => x.id === toId); if (fi < 0 || ti < 0) return p; const tz = arr[ti].zone || "right"; const moved = { ...arr[fi], zone: tz }; arr.splice(fi, 1); const ni = arr.findIndex(x => x.id === toId); arr.splice(ni, 0, moved); return arr; });
  const moveToZone = (id, zone) => setPanels(p => { const fi = p.findIndex(x => x.id === id); if (fi < 0) return p; const arr = p.slice(); const moved = { ...arr[fi], zone }; arr.splice(fi, 1); arr.push(moved); return arr; });
  const setPanelWidth = (id, w) => setPanels(p => p.map(x => x.id === id ? { ...x, width: w } : x));
  const setPanelFields = (id, fields) => setPanels(p => p.map(x => x.id === id ? { ...x, fields: [...fields] } : x));
  const toggleHidden = (id) => setPanels(p => p.map(x => x.id === id ? { ...x, hidden: !x.hidden } : x));
  const dragRef = useRef(null);
  return { panels, addPanel, removePanel, renamePanel, toggleField, setPanelFields, toggleHidden, movePanel, moveToZone, setPanelWidth, dragRef, nextTitle };
}

// 패널 우측 너비 조절 핸들
function usePanelResize(onSet) {
  const st = useRef(null);
  useEffect(() => {
    const move = (e) => { if (!st.current) return; onSet(st.current.id, Math.max(150, Math.min(520, st.current.w + (e.clientX - st.current.x)))); };
    const up = () => { st.current = null; document.body.style.cursor = ""; };
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, [onSet]);
  return (id, el) => (e) => { e.preventDefault(); e.stopPropagation(); const aside = el.closest(".recside"); st.current = { id, x: e.clientX, w: aside.getBoundingClientRect().width }; document.body.style.cursor = "col-resize"; };
}

// 패널 본문 렌더 — 각 패널을 품목 정보 패널 우측의 별도 컬럼(aside)으로 렌더
function InfoPanelBody({ api, ctx, cfg, onAddField, onRenamePanel, onAddPanel, panels, baseId, renderBaseExtra, subFor, zone }) {
  const startRz = usePanelResize(api.setPanelWidth);
  const drag = api.dragRef;
  const [menuFor, setMenuFor] = useState(null); // { id, x, y }
  const openMenu = (e, id) => { const b = e.currentTarget.getBoundingClientRect(); setMenuFor({ id, x: b.left, y: b.bottom + 4 }); };
  const all = panels || api.panels;
  const list = zone ? all.filter(pn => (pn.zone || "right") === zone) : all;
  const zoneDrop = (e) => { e.preventDefault(); if (drag.current && zone) api.moveToZone(drag.current, zone); drag.current = null; };
  const dragProps = (id) => ({
    draggable: true,
    onDragStart: () => { drag.current = id; },
    onDragOver: (e) => e.preventDefault(),
    onDrop: (e) => { e.preventDefault(); e.stopPropagation(); if (drag.current) api.movePanel(drag.current, id); drag.current = null; },
  });
  if (cfg) {
    return (
      <div className={`pz pz-${zone || "right"}`} onDragOver={(e) => e.preventDefault()} onDrop={zoneDrop}>
        {list.map(pn => (
          <aside className="recside rs-col" key={pn.id} style={pn.width ? { width: pn.width + "px" } : undefined} {...dragProps(pn.id)}>
            <span className="rs-col-rz" onMouseDown={(e) => startRz(pn.id, e.currentTarget)(e)} title="너비 조절" />
            <div className="rs-col-h" title="드래그로 위치 변경">
              <span className="rs-panel-grip">⠿</span>
              <button type="button" className="rs-panel-t rs-panel-name" onClick={(e) => openMenu(e, pn.id)} title="패널 메뉴">{pn.title}<span className="rs-panel-caret">{CC_I.chevron}</span></button>
            </div>
            {menuFor && menuFor.id === pn.id ? (
              <>
                <div className="colpop-scrim" onClick={() => setMenuFor(null)} />
                <div className="colpop" style={{ position: "fixed", left: menuFor.x, top: menuFor.y }}>
                  <button type="button" className="colpop-item" onClick={() => { onAddField(pn.id); setMenuFor(null); }}>항목 추가</button>
                  <button type="button" className="colpop-item" onClick={() => { onRenamePanel(pn.id, pn.title); setMenuFor(null); }}>설정</button>
                  <button type="button" className="colpop-item colpop-danger" onClick={() => { api.removePanel(pn.id); setMenuFor(null); }}>패널 삭제</button>
                </div>
              </>
            ) : null}
            <div className={`rs-col-body ${pn.hidden ? "is-colhidden" : ""}`}>
              {pn.fields.length === 0 ? <div className="rs-panel-empty">항목을 추가하세요</div> : pn.fields.map(k => { const f = panelFieldValue(k, ctx); return (
                <div className="rs-info-row" key={k}><span className="rs-info-k">{f.label}</span><span className="rs-info-v">{f.value || "—"}</span><button type="button" className="rs-info-rm" title="제거" onClick={() => api.toggleField(pn.id, k)}>{CC_I.close}</button></div>
              ); })}
              <div style={{ padding: "6px 10px 10px" }}><button type="button" className="rs-cfg-add" onClick={() => onAddField(pn.id)}>＋ 항목 추가</button></div>
            </div>
          </aside>
        ))}
        {(!zone || zone === "right") ? (
          <aside className="recside rs-col rs-col-add">
            <button type="button" className="rs-cfg-add rs-add-panel" onClick={() => api.addPanel()}>＋ 패널 추가</button>
          </aside>
        ) : <div className="pz-hint">여기로 패널을 끌어다 놓으세요</div>}
      </div>
    );
  }
  const isVisible = (pn) => pn.id === baseId || pn.fields.length > 0;
  const visible = list.filter(isVisible);
  if (!visible.length) return null;
  return (
    <div className={`pz pz-${zone || "right"}`}>
      {visible.map(pn => (
        <aside className="recside rs-col" key={pn.id} style={pn.width ? { width: pn.width + "px" } : undefined}>
          <div className="rs-head"><div className="rs-head-top"><div className="rs-title rs-col-title">{pn.title}</div></div>{subFor ? <div className="rs-sub">{subFor(pn)}</div> : null}</div>
          <div className="rs-col-body">
            {pn.fields.map(k => { const f = panelFieldValue(k, ctx); return (
              <div className="rs-info-row" key={k}><span className="rs-info-k">{f.label}</span><span className="rs-info-v">{f.value || "—"}</span></div>
            ); })}
            {pn.id === baseId && renderBaseExtra ? renderBaseExtra() : null}
          </div>
        </aside>
      ))}
    </div>
  );
}

/* ── 공통 CSS 주입 (신규 클래스만) ── */
/* 공통 조건검색창 — 전 화면 공용
   fields: [{ key, label, node }] / node 는 .fld 엘리먼트
   화면설정(F10) → 항목 숨기기/표시, 화면별로 유지 */
function SearchCondModal({ open, prefix = "common", title = "조건 검색", sub, fields = [], zIndex = 70, onReset, onSearch, onClose }) {
  const K = "nm.searchcfg." + prefix;
  const [hidden, setHidden] = useState([]);
  const [cfg, setCfg] = useState(false);
  useEffect(() => { try { const v = JSON.parse(localStorage.getItem(K)); setHidden(Array.isArray(v) ? v : []); } catch (e) { setHidden([]); } }, [K]);
  useEffect(() => { if (!open) setCfg(false); }, [open]);
  const save = (next) => { setHidden(next); try { localStorage.setItem(K, JSON.stringify(next)); } catch (e) {} };
  const toggle = (k) => save(hidden.indexOf(k) >= 0 ? hidden.filter(x => x !== k) : hidden.concat([k]));
  useEffect(() => {
    if (!open) return;
    const fn = (e) => {
      if (e.key === "Escape") { e.stopImmediatePropagation(); e.preventDefault(); if (cfg) setCfg(false); else onClose && onClose(); }
      else if (e.key === "F10") { e.stopImmediatePropagation(); e.preventDefault(); setCfg(v => !v); }
      else if (e.key === "F8" && !cfg) { e.stopImmediatePropagation(); e.preventDefault(); onSearch && onSearch(); }
    };
    window.addEventListener("keydown", fn, true);
    return () => window.removeEventListener("keydown", fn, true);
  }, [open, cfg, onClose, onSearch]);
  if (!open) return null;
  const all = fields.filter(Boolean);
  const shown = cfg ? all : all.filter(f => hidden.indexOf(f.key) < 0);
  return (
    <div className="modal-root" role="dialog" aria-modal="true" data-search-modal="" style={{ zIndex }}>
      <div className="modal-scrim" onClick={() => { if (cfg) setCfg(false); else onClose && onClose(); }} />
      <div className="modal modal-newitem">
        <header className="modal-head">
          <div>
            <h2 className="modal-title">{title}{cfg ? " · 화면설정" : ""}</h2>
            <div className="modal-sub">{cfg ? "항목을 눌러 숨기기/표시를 바꿔주세요. 설정은 다시 여달 때도 유지됩니다." : sub}</div>
          </div>
          <div className="sc-head-act">
            <button type="button" className={"sc-cfg-btn" + (cfg ? " is-on" : "")} onClick={() => setCfg(v => !v)}>화면설정 <kbd className="btn-kbd">F10</kbd></button>
            <button type="button" className="modal-close" onClick={onClose}>{CC_I.close}</button>
          </div>
        </header>
        <div className={"ni-body sc-body" + (cfg ? " is-cfg" : "")}>
          <div className="ni-grid">
            {shown.map(f => {
              if (!cfg) return <React.Fragment key={f.key}>{f.node}</React.Fragment>;
              const off = hidden.indexOf(f.key) >= 0;
              return (
                <div className={"sc-cfg-item" + (off ? " is-off" : "")} key={f.key} onClick={() => toggle(f.key)} title={off ? "클릭하여 표시" : "클릭하여 숨김"}>
                  <span className="sc-chk">{off ? null : CC_I.check}</span>
                  <div className="sc-cfg-inner">{f.node}</div>
                </div>
              );
            })}
          </div>
          {!shown.length ? <div className="sc-empty">표시할 검색 항목이 없어요. 화면설정에서 항목을 다시 표시해 주세요.</div> : null}
        </div>
        <footer className="modal-foot">
          <div className="ff-left">
            {cfg
              ? <button type="button" className="btn-ghost" onClick={() => save([])}>모든 항목 표시</button>
              : <button type="button" className="btn-ghost" onClick={onReset}>초기화</button>}
          </div>
          <div className="ff-right">
            {cfg
              ? <button type="button" className="btn-primary" onClick={() => { setCfg(false); showToast("검색 항목 설정을 적용했어요"); }}>설정 완료</button>
              : <React.Fragment>
                  <button type="button" className="btn-ghost" onClick={onClose}>닫기</button>
                  <button type="button" className="btn-primary" onClick={onSearch}>검색 <kbd className="btn-kbd">F8</kbd></button>
                </React.Fragment>}
          </div>
        </footer>
      </div>
    </div>
  );
}

/* 적용된 검색조건 표시 칩 */
function SearchCondChips({ items = [], onClear }) {
  const list = items.filter(f => f && String(f.value == null ? "" : f.value).trim() !== "" && f.value !== "전체");
  if (!list.length) return null;
  return (
    <div className="sc-chips">
      <span className="sc-chips-k">검색조건</span>
      {list.map(f => <span className="sc-chip" key={f.key}><b>{f.label}</b>{String(f.value)}</span>)}
      {onClear ? <button type="button" className="sc-chip-clear" onClick={onClear}>조건 해제</button> : null}
    </div>
  );
}

/* ── 화면 간 전표 공유 (매입·매출 → 재고) ──
   각 화면이 자기 전표 배열을 localStorage 에 기록하고, 재고관리가 읽어 품목별 입·출고를 집계한다.
   docs: [{ id, date, partner, lines:[{ item, qty }] }] */
const CC_DOC_KEY = { 매입: "nonamed.docs.purchase.v1", 매출: "nonamed.docs.sales.v1" };
function publishDocs(kind, docs) {
  try {
    const slim = (docs || []).filter(d => d && !d.deleted).map(d => ({ id: d.id, date: d.date, partner: d.partner, status: d.status, lines: (d.lines || []).map(l => ({ item: l.item || l.name, spec: l.spec || "", qty: Number(l.qty) || 0 })) }));
    localStorage.setItem(CC_DOC_KEY[kind], JSON.stringify(slim));
    window.dispatchEvent(new CustomEvent("nonamed:docs", { detail: { kind } }));
  } catch (e) {}
}
function readDocs(kind) {
  try { const v = JSON.parse(localStorage.getItem(CC_DOC_KEY[kind])); return Array.isArray(v) ? v : null; } catch (e) { return null; }
}
/* 매입·매출 화면에서: orders 가 바뀜 때마다 공유 */
function useDocPublish(kind, docs) {
  useEffect(() => { publishDocs(kind, docs); }, [kind, docs]);
}
/* 목록 상태를 localStorage 에 저장·복원 (전표·거래처·품목 등 화면 데이터). 같은 key 를 쓰는 화면끼리 공유되며 다른 탭 변경도 반영 */
function usePersistedList(key, initial) {
  const read = () => { try { const v = JSON.parse(localStorage.getItem(key)); return Array.isArray(v) ? v : null; } catch (e) { return null; } };
  const [list, setList] = useState(() => read() || (typeof initial === "function" ? initial() : initial) || []);
  const skip = useRef(false);
  useEffect(() => { if (skip.current) { skip.current = false; return; } try { localStorage.setItem(key, JSON.stringify(list)); window.dispatchEvent(new CustomEvent("nonamed:list", { detail: { key } })); } catch (e) {} }, [key, list]);
  useEffect(() => {
    const fn = (e) => { if (e && e.detail && e.detail.key && e.detail.key !== key) return; if (e && e.key && e.key !== key) return; const v = read(); if (v && JSON.stringify(v) !== JSON.stringify(list)) { skip.current = true; setList(v); } };
    window.addEventListener("nonamed:list", fn); window.addEventListener("storage", fn);
    return () => { window.removeEventListener("nonamed:list", fn); window.removeEventListener("storage", fn); };
  }, [key, list]);
  return [list, setList];
}
/* "최근작성" 표시 기준(전 화면 공통): 이 화면 세션에서 **마지막으로 저장한 1건**만.
   메모리에만 기록되므로 새로고침·메뉴 재진입 시 사라진다. 저장 시 stampSaved(row) → 목록에서 isRecent(row) */
window.__nmLastSaved = window.__nmLastSaved || {};
function stampSaved(row) { if (row && row.id != null) window.__nmLastSaved[String(row.id)] = Date.now(); window.__nmLastSavedId = row && row.id != null ? String(row.id) : null; return row; }
function isRecent(row) { return !!row && row.id != null && window.__nmLastSavedId === String(row.id); }

const NM_LIST_KEY = { 매입: "nonamed.list.purchase.v1", 매출: "nonamed.list.sales.v1", 거래처: "nonamed.list.partners.v1", 품목: "nonamed.list.items.v1", 세금: "nonamed.list.tax.v1" };
/* 거래처·품목 테이블(거래처등록·품목리스트 화면이 저장)에서 검색용 목록을 읽는 공통 함수 — 전 화면 거래처/품목 검색은 이것을 쓴다 */
function readPartnerList() { try { const v = JSON.parse(localStorage.getItem(NM_LIST_KEY.거래처)); return Array.isArray(v) ? v : []; } catch (e) { return []; } }
function readItemList() { try { const v = JSON.parse(localStorage.getItem(NM_LIST_KEY.품목)); return Array.isArray(v) ? v : []; } catch (e) { return []; } }
/* 코드도움 옵션("코드 · 이름") */
function partnerLookupOptions() { return readPartnerList().map(p => (p.code || p.id) + " · " + p.name); }
function itemLookupOptions() { return readItemList().map(x => (x.code || x.id) + " · " + x.name); }
/* PickerOverlay 용 거래처 항목 */
function partnerPickerItems() { return readPartnerList().map(p => ({ name: p.name, code: p.code || p.id, ceo: p.ceo || "", phone: p.phone || p.mobile || "", region: p.addr || "", biz: p.biz || "", bank: p.bank || "", _key: p.code || p.id })); }

/* 입출금 전표 → 매입(지급)/매출(수금) 연동. 입출금관리가 hana.cash.records.v1 에 저장한 전표의 라인 중
   외상매출금 계정(입금/차변) → 매출 수금, 외상매입금 계정(지급/대변) → 매입 지급 으로 집계한다 */
const CASH_RECORDS_KEY = "hana.cash.records.v1";
function cashPaymentsFor(kind /* "매입" | "매출" */) {
  let recs = []; try { recs = JSON.parse(localStorage.getItem(CASH_RECORDS_KEY)) || []; } catch (e) {}
  const out = [];
  recs.forEach(r => {
    const lines = (r.lines && r.lines.length) ? r.lines : [r];
    lines.forEach(l => {
      const g = l.gubun || (l.kind === "입금" ? "입금" : "지급");
      const acc = l.account || (l.kind === "입금" ? "외상매출금" : "외상매입금");
      const partner = String(l.partner || "").trim(); const amount = Number(String(l.amount).replace(/[^\d.-]/g, "")) || 0;
      if (!partner || !amount) return;
      const isRecv = (g === "입금" || g === "차변") && acc === "외상매출금";
      const isPay = (g === "지급" || g === "대변") && acc === "외상매입금";
      if ((kind === "매출" && isRecv) || (kind === "매입" && isPay)) out.push({ id: r.id, date: r.date, partner, amount, memo: l.memo || r.memo || (kind === "매출" ? "수금" : "지급"), source: "입출금", acct: l.acct || r.acct || "" });
    });
  });
  return out.sort((a, b) => String(a.date).localeCompare(String(b.date)));
}
function useCashPayments(kind) {
  const [v, setV] = useState(() => cashPaymentsFor(kind));
  useEffect(() => { const fn = () => setV(cashPaymentsFor(kind)); window.addEventListener("storage", fn); window.addEventListener("focus", fn); window.addEventListener("nonamed:cash", fn); return () => { window.removeEventListener("storage", fn); window.removeEventListener("focus", fn); window.removeEventListener("nonamed:cash", fn); }; }, [kind]);
  return v;
}

/* 재고 화면에서: 매입·매출 전표를 구독 (다른 탭에서 입력되도 갱신) */
function useSharedDocs() {
  const load = () => ({ 매입: readDocs("매입"), 매출: readDocs("매출") });
  const [docs, setDocs] = useState(load);
  useEffect(() => {
    const fn = () => setDocs(load());
    window.addEventListener("nonamed:docs", fn);
    window.addEventListener("storage", fn);
    window.addEventListener("focus", fn);
    return () => { window.removeEventListener("nonamed:docs", fn); window.removeEventListener("storage", fn); window.removeEventListener("focus", fn); };
  }, []);
  return docs;
}

function CommonTopBar({ crumb }) {
  const ic = (d) => <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d={d} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  return (
    <header className="topbar ctb">
      <form className="ctb-search" onSubmit={(e) => e.preventDefault()}>
        <svg viewBox="0 0 24 24" fill="none" width="15" height="15"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6"/><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
        <input placeholder={crumb ? crumb + " 검색" : "검색"} />
      </form>
      <div className="ctb-right">
        {window.AccountMenu ? <window.AccountMenu /> : null}
        <span className="ctb-sep"></span>
        <button className="ctb-ic" type="button" title="전체화면">{ic("M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5")}</button>
        <button className="ctb-ic has-dot" type="button" title="메시지">{ic("M4 6h16v12H4zM4 7l8 6 8-6")}</button>
        <button className="ctb-ic has-dot" type="button" title="알림">{ic("M18 16H6c1.2-1.2 1.8-2 1.8-6a4.2 4.2 0 018.4 0c0 4 .6 4.8 1.8 6zM10.5 19a1.8 1.8 0 003 0")}</button>
        <button className="ctb-ic" type="button" title="로그아웃" onClick={() => { try { localStorage.removeItem("nonamed.session.v1"); } catch (e) {} window.location.href = "login.html"; }}>{ic("M12 3v8M6.3 6.3a8 8 0 1011.4 0")}</button>
        <button className="ctb-ic" type="button" title="메뉴">{ic("M4 6h16M4 12h16M4 18h10")}</button>
      </div>
    </header>
  );
}

(function injectColcfgCss(){
  if (document.getElementById("colconfig-css")) return;
  const s = document.createElement("style");
  s.id = "colconfig-css";
  s.textContent = `
/* 최근작성(마지막 저장 1건) 행 음영 — 전 화면 공통. 각 화면 CSS 보다 뒤에 적용되도록 !important */
.t-row.row-new{ box-shadow: inset 3px 0 0 var(--accent) !important; background: color-mix(in oklab, var(--accent-soft) 38%, var(--card)) !important; }
.t-row.row-new:hover{ background: color-mix(in oklab, var(--accent-soft) 48%, var(--card)) !important; }
/* ── 공통 모달 기본 스타일 (화면별 css가 없을 때의 기본값) ── */
.pick-ico{ display:inline-flex; align-items:center; justify-content:center; width:18px; height:18px; flex:0 0 auto; color:var(--ink-3,#8B8273); }
.pick-ico svg{ width:18px; height:18px; }
.cc-lookup-btn svg{ width:16px; height:16px; }
.sc-chips{ display:flex; align-items:center; flex-wrap:wrap; gap:6px; }
.sc-chips-k{ font:500 11.5px "IBM Plex Sans KR",sans-serif; color:var(--ink-3,#8B8273); }
.sc-chip{ display:inline-flex; align-items:center; gap:6px; padding:4px 9px; border-radius:999px; background:var(--accent-soft,#F1DBCC); color:var(--accent-ink,#8C3F22); font:400 11.5px "IBM Plex Sans KR",sans-serif; }
.sc-chip b{ font-weight:600; opacity:.7; }
.sc-chip-clear{ padding:4px 9px; border-radius:999px; border:1px solid var(--line,rgba(31,26,20,.14)); background:transparent; color:var(--ink-2,#5A5247); font:400 11.5px "IBM Plex Sans KR",sans-serif; cursor:pointer; }
.sc-chip-clear:hover{ background:var(--card-2,#F8F4EB); }
.sc-head-act{ display:flex; align-items:center; gap:8px; }
.sc-cfg-btn{ display:inline-flex; align-items:center; gap:6px; padding:7px 11px; border-radius:10px; border:1px solid var(--line,rgba(31,26,20,.12)); background:var(--card-2,#F8F4EB); color:var(--ink-2,#5A5247); font:500 12px "IBM Plex Sans KR",sans-serif; cursor:pointer; white-space:nowrap; }
.sc-cfg-btn:hover{ background:#fff; }
.sc-cfg-btn.is-on{ background:var(--accent,#D97757); border-color:transparent; color:#fff; }
.sc-cfg-btn.is-on .btn-kbd{ background:rgba(255,255,255,.22); color:#fff; border-color:transparent; }
.sc-body{ max-height:min(56vh,520px); overflow:auto; overscroll-behavior:contain; }
.sc-body.is-cfg .ni-grid{ gap:10px; }
.sc-cfg-item{ position:relative; padding:8px 10px 8px 34px; border:1px dashed var(--line,rgba(31,26,20,.16)); border-radius:12px; background:var(--card-2,#F8F4EB); cursor:pointer; }
.sc-cfg-item:hover{ border-color:var(--accent,#D97757); }
.sc-cfg-item.is-off{ opacity:.45; }
.sc-cfg-inner{ pointer-events:none; }
.sc-chk{ position:absolute; left:10px; top:13px; width:16px; height:16px; border-radius:5px; border:1.5px solid var(--line,rgba(31,26,20,.2)); background:#fff; display:grid; place-items:center; color:#fff; }
.sc-cfg-item:not(.is-off) .sc-chk{ background:var(--accent,#D97757); border-color:var(--accent,#D97757); }
.sc-chk svg{ width:11px; height:11px; }
.sc-empty{ padding:22px 4px 8px; text-align:center; font:400 12.5px "IBM Plex Sans KR",sans-serif; color:var(--ink-3,#8B8273); }
.modal-root{ position:fixed; inset:0; z-index:80; display:grid; place-items:center; }
.modal-scrim{ position:absolute; inset:0; background:rgba(31,26,20,.35); backdrop-filter:blur(2px); }
.modal{ position:relative; z-index:1; background:var(--card,#FBF8F2); border:1px solid var(--line,rgba(31,26,20,.12)); border-radius:18px; box-shadow:0 30px 80px -20px rgba(31,26,20,.25); max-height:90vh; display:flex; flex-direction:column; overflow:hidden; }
.modal-head{ display:flex; align-items:flex-start; justify-content:space-between; gap:14px; padding:20px 26px 14px; border-bottom:1px solid var(--line-soft,rgba(31,26,20,.06)); }
.modal-title{ margin:0; font:700 18px "IBM Plex Sans KR",sans-serif; color:var(--ink,#1F1A14); }
.modal-sub{ margin-top:4px; font-size:12px; color:var(--ink-3,#8B8273); }
.modal-close{ appearance:none; border:0; background:transparent; width:32px; height:32px; border-radius:8px; display:grid; place-items:center; color:var(--ink-3,#8B8273); cursor:pointer; font-size:16px; }
.modal-close:hover{ background:var(--bg-2,#EAE3D2); color:var(--ink,#1F1A14); }
.modal-close svg{ width:20px; height:20px; }
.modal-foot{ padding:14px 26px 18px; border-top:1px solid var(--line-soft,rgba(31,26,20,.06)); background:var(--card-2,#F8F4EB); display:flex; align-items:center; justify-content:space-between; gap:14px; }
.ff-left{ display:flex; align-items:center; gap:8px; font:500 12.5px "IBM Plex Sans KR",sans-serif; color:var(--ink-3); }
.modal .btn-ghost, .modal .btn-primary{ white-space:nowrap; }
.ff-right{ display:flex; align-items:center; gap:8px; }
.modal .btn-ghost{ appearance:none; cursor:pointer; border:1px solid var(--line,rgba(31,26,20,.12)); background:var(--card,#FBF8F2); color:var(--ink-2,#5A5247); font:600 13px "IBM Plex Sans KR",sans-serif; border-radius:10px; padding:9px 16px; }
.modal .btn-ghost:hover{ background:var(--bg-2,#EAE3D2); }
.btn-kbd{ font:500 10px "JetBrains Mono",monospace; background:rgba(255,255,255,.22); border:1px solid rgba(255,255,255,.35); border-radius:5px; padding:1px 5px; margin-left:6px; }

.ctb{ display:flex; align-items:center; justify-content:space-between; gap:16px; }
.ctb-search{ display:flex; align-items:center; gap:8px; flex:1; max-width:340px; color:var(--ink-3,#8a8177); }
.ctb-search input{ border:0; outline:0; background:transparent; font:400 13.5px "IBM Plex Sans KR",sans-serif; color:var(--ink,#33291f); width:100%; }
.ctb-right{ display:flex; align-items:center; gap:4px; }
.ctb-sep{ width:1px; height:20px; background:var(--line,#e5ddd2); margin:0 8px; }
.ctb-ic{ position:relative; appearance:none; border:0; background:transparent; width:32px; height:32px; border-radius:8px; display:grid; place-items:center; color:var(--ink-2,#5c5245); cursor:pointer; }
.ctb-ic:hover{ background:var(--card-2,#f4efe8); }
.ctb-ic.has-dot::after{ content:""; position:absolute; top:5px; right:6px; width:6px; height:6px; border-radius:50%; background:#E0A100; }
.ctb .user-pill{ display:flex; align-items:center; gap:8px; }

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

.t-scroll{ overflow-x: auto; overflow-y: visible; }

.t-scroll .t-row{ min-width: var(--row-min, 0); }

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

.btn-primary.btn-danger{ background:var(--bad); border-color:var(--bad); color:#fff !important; }
.user-co{ display:inline-block; margin-right:6px; padding:1px 7px; border-radius:6px; background:var(--card-2,#F3EEE3); color:var(--ink-2); font-size:11px; font-weight:600; max-width:140px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; vertical-align:middle; }
.nm-doclist{ padding:6px 22px 10px; max-height:56vh; overflow:auto; display:flex; flex-direction:column; gap:4px; }
.nm-doclist-h,.nm-doclist-row{ display:grid; grid-template-columns:52px 110px 96px minmax(0,1fr) minmax(0,1.4fr) 64px; gap:10px; align-items:center; padding:8px 10px; font-size:12.5px; }
.nm-doclist-h{ color:var(--ink-3); font-size:11px; letter-spacing:.04em; border-bottom:1px solid var(--line-soft,rgba(31,26,20,.08)); }
.nm-doclist-row{ appearance:none; border:1px solid transparent; background:var(--card-2,#F8F4EB); border-radius:10px; cursor:pointer; text-align:left; color:var(--ink); font:inherit; }
.nm-doclist-row:hover{ border-color:var(--accent); background:#fff; }
.nm-doclist-row > span{ min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.nm-doc-kind{ font:700 11px "IBM Plex Sans KR",sans-serif; padding:2px 8px; border-radius:999px; text-align:center; background:var(--ink); color:#fff; }
.nm-doc-kind.k-매출{ background:var(--accent); } .nm-doc-kind.k-조정{ background:var(--ink-3); }
.btn-primary.btn-danger *{ color:#fff; }

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

.addcol-code-badge{ display:inline-flex; align-items:center; flex-wrap:wrap; white-space:nowrap; font-family:"JetBrains Mono", monospace; font-size:11px; font-weight:600; color:var(--accent-ink); background:var(--accent-soft); padding:3px 10px; border-radius:999px; margin-bottom:8px; }

.addcol-slot-tag{ display:inline-block; white-space:nowrap; margin-left:8px; padding:2px 7px; border-radius:5px; background:rgba(0,0,0,.06); color:var(--ink-3); font-size:10.5px; }
.modal-title-input{ display:block; width:100%; appearance:none; border:0; border-bottom:1.5px solid var(--line); background:transparent; outline:none; font-family:"Gowun Batang", serif; font-weight:700; font-size:20px; letter-spacing:-.015em; color:var(--ink); padding:2px 0 5px; }

.modal-title-input:focus{ border-bottom-color:var(--accent); }

.modal-title-input::placeholder{ color:var(--ink-3); font-weight:400; }

.modal-sub{ font-size: 12.5px; color: var(--ink-3); margin-top: 4px; font-family:"JetBrains Mono", monospace; }

.cfg-hint{ padding:8px 12px; margin-bottom:6px; background:color-mix(in oklab, var(--accent-soft) 40%, var(--card-2)); border:1px solid color-mix(in oklab, var(--accent) 25%, transparent); border-radius:9px; font-size:12px; color:var(--accent-ink); display:flex; align-items:center; flex-wrap:wrap; gap:6px; }

.cfg-hint-txt{ flex:1; min-width:200px; }

.cfg-hidden{ display:inline-flex; align-items:center; flex-wrap:wrap; gap:5px; }

.cfg-hidden-lb{ font:600 10.5px "JetBrains Mono",monospace; letter-spacing:.06em; text-transform:uppercase; color:var(--ink-3); }

.cfg-hidden-chip{ appearance:none; cursor:pointer; border:1px dashed color-mix(in oklab, var(--accent) 45%, var(--line)); background:var(--card); color:var(--accent-ink); font:600 11.5px "IBM Plex Sans KR",sans-serif; padding:3px 9px; border-radius:999px; }

.cfg-hidden-chip:hover{ background:var(--accent-soft); }

.cfg-reset{ appearance:none; cursor:pointer; margin-left:auto; border:1px solid var(--accent); background:var(--card); color:var(--accent-ink); font:600 11px "IBM Plex Sans KR",sans-serif; padding:3px 10px; border-radius:999px; }

.cfg-reset:hover{ background:var(--accent); color:#fff; }

.cfg-reset svg{ width:12px; height:12px; vertical-align:-1px; }

.cfg-addchips{ display:inline-flex; align-items:center; gap:6px; flex-wrap:wrap; margin-left:10px; }

.cfg-addchips-lbl{ font:600 10.5px "JetBrains Mono",monospace; letter-spacing:.08em; text-transform:uppercase; color:var(--ink-3); }

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

.addcol-main{ appearance:none; cursor:pointer; border:1px dashed var(--line); background:transparent; color:var(--ink-2); font:500 12.5px "IBM Plex Sans KR",sans-serif; padding:7px 14px; border-radius:9px; display:inline-flex; align-items:center; gap:5px; transition:all .12s; }

.addcol-main svg{ width:14px; height:14px; }

.addcol-main:hover{ border-color:var(--accent); color:var(--accent-ink); background:color-mix(in oklab, var(--accent-soft) 30%, transparent); }

.addcol-tools{ display:flex; align-items:center; gap:10px; }

.addcol-link{ appearance:none; cursor:pointer; border:0; background:transparent; color:var(--ink-3); font:500 12px "IBM Plex Sans KR",sans-serif; padding:0; transition:color .12s; }

.addcol-link:hover{ color:var(--accent-ink); }

.addcol-link-muted:hover{ color:var(--bad); }

.addcol-sep{ width:1px; height:11px; background:var(--line); }

.field-chips{ display:flex; flex-wrap:wrap; gap:8px; }
.slotpick{ position:absolute; top:calc(100% + 6px); left:0; right:0; z-index:60; background:var(--card); border:1px solid var(--line); border-radius:12px; box-shadow:0 18px 44px rgba(0,0,0,.16); padding:12px; max-height:300px; overflow-y:auto; display:flex; flex-direction:column; gap:8px; }
.slotpick-grp{ font:600 11.5px "IBM Plex Sans KR",sans-serif; letter-spacing:.04em; color:var(--ink-3); text-transform:uppercase; margin-top:2px; }
.pickrow{ appearance:none; width:100%; display:flex; align-items:center; justify-content:space-between; gap:10px; background:transparent; border:0; border-top:1px solid var(--line-soft); padding:10px 12px; font:500 13.5px "IBM Plex Sans KR",sans-serif; color:var(--ink); cursor:pointer; text-align:left; }
.pickrow.is-on{ background:var(--accent-soft); font-weight:600; }
.pk-allchk{ appearance:none; cursor:pointer; display:inline-flex; align-items:center; gap:5px; border:1px solid var(--line); background:var(--card); color:var(--ink-2); font:600 10.5px "IBM Plex Sans KR",sans-serif; padding:3px 7px; border-radius:999px; text-transform:none; letter-spacing:0; }
.pk-allchk:hover{ border-color:var(--accent); color:var(--accent-ink); }
.pickrow:hover:not(:disabled){ background:var(--accent-soft); }

.field-chip{ appearance:none; cursor:pointer; border:1px solid var(--line); background:var(--card); color:var(--ink); font:500 13px "IBM Plex Sans KR",sans-serif; padding:8px 14px; border-radius:999px; transition:all .12s; }

.field-chip:hover{ border-color:var(--accent); background:var(--accent-soft); }
.fx-tool{ margin-top:8px; display:flex; flex-direction:column; gap:6px; padding:8px; background:var(--card-2); border:1px solid var(--line-soft); border-radius:9px; }
.fx-row{ display:flex; flex-wrap:wrap; gap:5px; }
.fx-chip{ appearance:none; cursor:pointer; border:1px solid color-mix(in oklab, var(--accent) 35%, var(--line)); background:var(--card); color:var(--accent-ink); font:600 12px "IBM Plex Sans KR",sans-serif; padding:5px 10px; border-radius:7px; }
.fx-chip:hover{ background:var(--accent-soft); }
.fx-op{ appearance:none; cursor:pointer; width:32px; height:30px; display:grid; place-items:center; border:1px solid var(--line); background:var(--card); color:var(--ink); font:700 14px "JetBrains Mono",monospace; border-radius:7px; }
.fx-op:hover{ border-color:var(--accent); color:var(--accent-ink); }
.fx-op.fx-clear{ width:auto; padding:0 10px; font:500 12px "IBM Plex Sans KR",sans-serif; color:var(--ink-3); }
.fx-hint{ font-size:11px; color:var(--ink-3); }
.cc-lookup{ position:relative; display:flex; align-items:center; }
.cc-lookup .fld-input{ padding-right:64px; }
.cc-lookup-btn svg{ width:16px; height:16px; }
.cc-lookup-btn{ position:absolute; right:6px; width:26px; height:26px; display:flex; align-items:center; justify-content:center; border:1px solid var(--line); background:#fff; border-radius:6px; color:var(--ink-3); cursor:pointer; }
.cc-lookup-btn:hover{ border-color:var(--accent); color:var(--accent); }
.cc-lookup-clear{ position:absolute; right:38px; width:20px; height:20px; display:flex; align-items:center; justify-content:center; border:0; background:transparent; color:var(--ink-3); font-size:15px; cursor:pointer; }
.cc-lookup-clear:hover{ color:var(--bad); }
.cc-lookup-scrim{ position:fixed; inset:0; z-index:110; }
.cc-acc-pop{ position:absolute; top:100%; left:0; right:0; z-index:120; margin-top:4px; background:#fff; border:1px solid var(--line); border-radius:8px; box-shadow:0 8px 24px rgba(0,0,0,.14); padding:6px; display:flex; flex-direction:column; gap:4px; }
.cc-acc-q{ border:1px solid var(--line); border-radius:6px; padding:6px 9px; font:400 13px "IBM Plex Sans KR",sans-serif; outline:0; }
.cc-acc-q:focus{ border-color:var(--accent); }
.cc-acc-list{ max-height:190px; overflow-y:auto; display:flex; flex-direction:column; gap:1px; }
.cc-acc-item{ appearance:none; border:0; background:transparent; text-align:left; padding:6px 9px; border-radius:6px; font:400 13px "IBM Plex Sans KR",sans-serif; color:var(--ink); cursor:pointer; display:flex; align-items:center; gap:10px; }
.cc-acc-item:hover{ background:var(--card-2); color:var(--accent-ink); }
.cc-acc-code{ font:500 11.5px "JetBrains Mono",monospace; color:var(--ink-3); flex:none; width:34px; }
.cc-pick-root{ position:fixed; inset:0; z-index:140; display:grid; place-items:center; background:rgba(31,26,20,.32); padding:24px; }
/* ── 공통 코드도움 팝업 (useCcLookup UI) — 화면별 .pick-* 정의가 없을 때의 기본값 ── */
.cc-codechip{ flex:none; margin-left:6px; margin-right:34px; padding:1px 6px; border-radius:6px; background:var(--accent-soft,#F1DBCC); color:var(--accent-ink,#8C3F22); font-family:"JetBrains Mono",monospace; font-size:10.5px; font-weight:600; white-space:nowrap; }
.cc-sug{ position:fixed; z-index:120; background:#fff; border:1px solid var(--line); border-radius:8px; box-shadow:0 8px 24px rgba(0,0,0,.12); max-height:220px; overflow-y:auto; display:flex; flex-direction:column; padding:4px; }
.cc-sug-item{ text-align:left; padding:7px 10px; border:0; background:none; border-radius:6px; font-size:13px; color:var(--ink); cursor:pointer; }
.cc-sug-item:hover{ background:var(--card-2); }
.pick-root{ position:fixed; inset:0; z-index:130; display:grid; place-items:center; padding:24px; }
.pick-scrim{ position:absolute; inset:0; background:rgba(20,22,26,.5); backdrop-filter:blur(3px); }
.pick-box{ position:relative; width:min(560px,100%); max-height:70vh; background:#fff; border:1px solid var(--line); border-radius:16px; box-shadow:0 40px 80px -20px rgba(20,22,26,.4); display:flex; flex-direction:column; overflow:hidden; }
.pick-head{ display:flex; align-items:center; justify-content:space-between; padding:16px 20px 12px; border-bottom:1px solid var(--line); }
.pick-head h3{ font-size:17px; font-weight:700; margin:0; color:var(--ink); }
.pick-search{ display:flex; align-items:center; gap:10px; padding:12px 20px; border-bottom:1px solid var(--line); }
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
.cc-pick{ width:min(460px,100%); max-height:70vh; background:var(--card); border:1px solid var(--line); border-radius:14px; box-shadow:0 30px 80px -20px rgba(31,26,20,.35); display:flex; flex-direction:column; gap:8px; padding:14px; }
.cc-pick-head{ display:flex; align-items:center; justify-content:space-between; }
.cc-pick-title{ font:700 15px "Gowun Batang",serif; color:var(--ink); }
.cc-pick-grid{ display:grid; grid-template-columns:70px 1fr; gap:10px; align-items:center; }
.cc-pick-h{ font:600 11px "JetBrains Mono",monospace; letter-spacing:.06em; text-transform:uppercase; color:var(--ink-3); padding:4px 10px; border-bottom:1px solid var(--line-soft); }
.cc-pick-list{ overflow-y:auto; display:flex; flex-direction:column; gap:1px; }
.cc-pick-row{ appearance:none; border:0; background:transparent; text-align:left; padding:8px 10px; border-radius:7px; font:400 13.5px "IBM Plex Sans KR",sans-serif; color:var(--ink); cursor:pointer; }
.cc-pick-row:hover{ background:var(--accent-soft); color:var(--accent-ink); }

.field-chip.is-on{ background:var(--accent); color:#fff; border-color:transparent; }

.addcol-divider{ display:flex; align-items:center; gap:12px; margin:18px 0 6px; color:var(--ink-3); font-size:12px; }

.addcol-divider::before, .addcol-divider::after{ content:""; flex:1; height:1px; background:var(--line); }

.modal-sub b{ color: var(--ink); font-weight: 600; }
.table-card{ position: relative; }
.content.is-cfg-mode{ background: color-mix(in oklab, var(--accent-soft) 22%, var(--bg, #F7F4EF)); transition: background .2s; }
.main{ transition: background .25s; }
.main:has(> .content.is-cfg-mode){ background: color-mix(in oklab, var(--accent) 9%, var(--bg)); box-shadow: inset 0 0 0 3px color-mix(in oklab, var(--accent) 32%, transparent); }
.modal-entry:has(.entry-grid.is-cfg){ background: color-mix(in oklab, var(--accent) 7%, var(--card)); box-shadow: 0 0 0 3px color-mix(in oklab, var(--accent) 30%, transparent), 0 24px 60px rgba(15,23,42,.22); }
.entry-grid .fld{ position:relative; }
.fld-menu{ position:absolute; top:100%; left:0; z-index:60; background:var(--card); border:1px solid var(--line); border-radius:10px; box-shadow:0 12px 26px rgba(15,23,42,.14); padding:4px; display:flex; flex-direction:column; min-width:124px; }
.fld-menu button{ appearance:none; background:transparent; border:0; text-align:left; padding:7px 10px; border-radius:7px; font:500 12.5px "IBM Plex Sans KR",sans-serif; color:var(--ink); cursor:pointer; white-space:nowrap; }
.fld-menu button:hover{ background:color-mix(in oklab, var(--accent) 12%, transparent); }
.fld-menu button.is-danger{ color:var(--bad); }
.gm-hid{ grid-column:1 / -1; display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
.gm-hid-lbl{ font:600 11.5px "IBM Plex Sans KR",sans-serif; color:var(--ink-3); }
.gm-chip{ appearance:none; cursor:pointer; border:1px dashed var(--line); background:transparent; color:var(--ink-2); font:500 12px "IBM Plex Sans KR",sans-serif; border-radius:999px; padding:3px 10px; }
.gm-chip:hover{ border-color:var(--accent); color:var(--accent-ink); }
.is-on-cfg{ border-color: color-mix(in oklab, var(--accent) 55%, var(--line)) !important; color: var(--accent-ink) !important; background: var(--accent-soft) !important; }
.th-drag{ cursor: grab; user-select: none; position: relative; }
.th-drag:active{ cursor: grabbing; }
.th-drag:hover{ background: color-mix(in oklab, var(--accent-soft) 40%, var(--card-2)); border-radius: 6px; }
.th-drag.is-cfg{ background: color-mix(in oklab, var(--accent-soft) 45%, var(--card-2)); position: relative; }
.th-resize{ position: absolute; right: -6px; top: 0; bottom: 0; width: 12px; cursor: col-resize; z-index: 3; }
.th-resize::after{ content: ""; position: absolute; right: 5px; top: 4px; bottom: 4px; width: 2px; background: transparent; border-radius: 2px; }
.th-resize:hover::after{ background: var(--accent); }
.cfg-hint{ position: relative; z-index: 4; padding: 9px 13px; margin-bottom: 10px; display:flex; align-items:center; gap:10px; background: color-mix(in oklab, var(--accent-soft) 40%, var(--card-2)); border: 1px solid color-mix(in oklab, var(--accent) 25%, transparent); border-radius: 10px; font-size: 12.5px; color: var(--ink-2); line-height: 1.5; }
.cfg-reset{ appearance:none; cursor:pointer; margin-left:auto; white-space:nowrap; border:1px solid var(--accent); background:var(--card); color:var(--accent-ink); font:600 11px "IBM Plex Sans KR",sans-serif; padding:4px 10px; border-radius:999px; }
.cfg-reset:hover{ background:var(--accent); color:#fff; }
.table-card.is-cfg-mode{ background: color-mix(in oklab, var(--accent-soft) 20%, var(--card)); transition: background .2s; }
.pfp-group{ margin-bottom:14px; }
.pfp-cat{ font:600 10.5px "JetBrains Mono",monospace; letter-spacing:.08em; text-transform:uppercase; color:var(--ink-3); margin-bottom:7px; }
.pfp-chips{ display:flex; flex-wrap:wrap; gap:8px; }
.rs-cfg-add{ appearance:none; cursor:pointer; width:100%; border:1px dashed color-mix(in oklab, var(--accent) 45%, var(--line)); background:transparent; color:var(--accent-ink); font:600 12px "IBM Plex Sans KR",sans-serif; padding:8px; border-radius:9px; }
.rs-cfg-add:hover{ background:var(--accent-soft); }
.rs-info{ display:flex; flex-direction:column; gap:1px; padding:8px 6px; }
.rs-info-row{ display:flex; align-items:center; gap:8px; padding:7px 10px; border-radius:8px; }
.rs-info-row:hover{ background:var(--card-2); }
.rs-info-k{ flex:none; width:74px; font-size:11.5px; color:var(--ink-3); }
.rs-info-v{ flex:1; min-width:0; font-size:13px; color:var(--ink); font-weight:500; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.rs-info-rm{ flex:none; appearance:none; cursor:pointer; border:0; background:transparent; color:var(--ink-3); width:20px; height:20px; display:grid; place-items:center; border-radius:5px; }
.rs-info-rm:hover{ background:var(--bad); color:#fff; }
.rs-info-rm svg{ width:11px; height:11px; }
.rs-sec-h{ padding:9px 14px 4px; font:600 10.5px "JetBrains Mono",monospace; letter-spacing:.06em; text-transform:uppercase; color:var(--ink-3); }
.rs-panels{ display:flex; flex-direction:row; flex-wrap:nowrap; align-items:flex-start; gap:8px; padding:8px; overflow-x:auto; }
.rs-col{ width:210px; flex:none; position:relative; }
.rs-col-rz{ position:absolute; top:0; right:-3px; bottom:0; width:8px; cursor:col-resize; z-index:5; }
.rs-col-rz:hover{ background:color-mix(in oklab, var(--accent) 40%, transparent); }
.rs-col-h{ display:flex; align-items:center; gap:6px; padding:9px 11px; background:var(--card-2); border-bottom:1px solid var(--line-soft); cursor:grab; }
.rs-col-h:active{ cursor:grabbing; }
.rs-col-body{ flex:1; overflow-y:auto; padding:4px 2px; }
.rs-col-title{ font-size:14px !important; }
.rs-col-add{ width:150px !important; border-style:dashed !important; border-color:color-mix(in oklab, var(--accent) 35%, var(--line)) !important; display:grid !important; place-items:center; background:transparent !important; }
.rs-col-add .rs-add-panel{ width:auto; min-height:0; border:0 !important; background:transparent; color:var(--accent-ink); }
.rs-stack{ display:flex; flex-direction:row; align-items:stretch; gap:12px; flex:none; overflow-x:auto; max-width:560px; }
.pz{ display:flex; flex-direction:row; align-items:stretch; gap:12px; }
.pz-right{ flex:none; }
.pz-top, .pz-bottom{ flex-wrap:wrap; }
.pz-top:empty, .pz-bottom:empty{ display:none; }
.pz-hint{ min-width:150px; border:1px dashed color-mix(in oklab, var(--accent) 35%, var(--line)); border-radius:12px; display:grid; place-items:center; padding:14px; font-size:11.5px; color:var(--ink-3); text-align:center; }
.entry-zones-top{ margin-bottom:12px; }
.entry-zones-bottom{ margin-top:12px; }
.rs-panel-grip{ color:var(--ink-3); font-size:13px; letter-spacing:-1px; }
.rs-panel-t{ flex:1; min-width:0; font:600 12.5px "IBM Plex Sans KR",sans-serif; color:var(--ink); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.rs-panel-name{ appearance:none; border:0; background:transparent; cursor:pointer; display:flex; align-items:center; gap:4px; text-align:left; }
.rs-panel-name:hover{ color:var(--accent-ink); }
.rs-panel-caret{ display:grid; place-items:center; color:var(--ink-3); flex:none; }
.rs-panel-caret svg{ width:13px; height:13px; }
.rs-panel-mini{ flex:none; appearance:none; cursor:pointer; border:0; background:transparent; color:var(--ink-3); font:500 11px "IBM Plex Sans KR",sans-serif; padding:3px 6px; border-radius:6px; }
.rs-panel-mini:hover{ background:var(--bg-2); color:var(--ink); }
.rs-panel-mini.rs-panel-del{ width:22px; display:grid; place-items:center; }
.rs-panel-mini.rs-panel-del:hover{ background:var(--bad); color:#fff; }
.rs-panel-mini.rs-panel-del svg{ width:11px; height:11px; }
.rs-panel-empty{ padding:12px; font-size:12px; color:var(--ink-3); text-align:center; }
.rs-add-panel{ flex:0 0 auto; border-style:dashed !important; border-color: color-mix(in oklab, var(--accent) 35%, var(--line)) !important; }
.modal-head-drag{ cursor: move; user-select: none; }
.modal{ position: relative; }
.entry-resize{ position:absolute; top:0; right:-7px; width:16px; height:100%; cursor:ew-resize; z-index:30; display:flex; align-items:center; justify-content:center; }
.entry-resize::after{ content:""; width:4px; height:54px; border-radius:999px; background:var(--line); transition:background .15s; }
.entry-resize:hover::after{ background:var(--accent); }
.modal-head-drag button, .modal-head-drag input, .modal-head-drag kbd{ cursor: auto; }
.win-tools{ display:flex; align-items:center; gap:4px; }
.win-tool{ appearance:none; cursor:pointer; border:1px solid var(--line); background:var(--card); color:var(--ink-2); width:30px; height:30px; border-radius:8px; display:grid; place-items:center; font-size:14px; line-height:1; }
.win-tool:hover{ background:var(--card-2); color:var(--ink); border-color:color-mix(in oklab, var(--accent) 40%, var(--line)); }
.win-tool:active{ background:var(--accent-soft); }
.win-tool.is-on{ background:var(--accent); color:#fff; border-color:transparent; }
.win-tool.is-on:hover{ background:var(--accent); color:#fff; }
.enter-cfg{ display:flex; align-items:center; flex-wrap:wrap; gap:8px; padding:8px 12px; margin-bottom:8px; background:var(--card-2); border:1px solid var(--line-soft); border-radius:10px; }
.enter-cfg-lbl{ font:600 12px "IBM Plex Sans KR",sans-serif; color:var(--ink-2); }
.enter-chips{ display:flex; flex-wrap:wrap; gap:6px; }
.enter-chip{ display:inline-flex; align-items:center; gap:6px; cursor:grab; user-select:none; background:var(--card); border:1px solid color-mix(in oklab, var(--accent) 30%, var(--line)); border-radius:999px; padding:4px 11px 4px 5px; font:600 12px "IBM Plex Sans KR",sans-serif; color:var(--ink); }
.enter-chip:active{ cursor:grabbing; }
.enter-chip .enter-num{ display:grid; place-items:center; width:17px; height:17px; border-radius:50%; background:var(--accent); color:#fff; font:700 10.5px "JetBrains Mono",monospace; }
.enter-cfg-hint{ font-size:11px; color:var(--ink-3); }
.cfs-rows{ display:flex; flex-direction:column; gap:8px; margin-top:6px; }
.cfs-row{ appearance:none; cursor:pointer; text-align:left; display:flex; align-items:center; gap:11px; padding:11px 13px; border:1px solid var(--line); border-radius:11px; background:var(--card); }
.cfs-row:hover{ background:var(--card-2); }
.cfs-row.is-on{ border-color:var(--accent); background:var(--accent-soft); }
.cfs-check{ flex:none; width:20px; height:20px; border-radius:6px; border:1.5px solid var(--line); display:grid; place-items:center; color:#fff; background:var(--card); }
.cfs-row.is-on .cfs-check{ background:var(--accent); border-color:var(--accent); }
.cfs-check svg{ width:13px; height:13px; }
.cfs-txt{ display:flex; flex-direction:column; gap:1px; }
.cfs-txt b{ font-size:13.5px; font-weight:600; color:var(--ink); }
.cfs-txt span{ font-size:11.5px; color:var(--ink-3); }
.el-req-empty{ background: color-mix(in oklab, var(--bad, #d64545) 10%, transparent) !important; box-shadow: inset 0 0 0 1.5px color-mix(in oklab, var(--bad, #d64545) 50%, transparent) !important; }
.el-locked{ background: color-mix(in oklab, var(--ink, #1f1a14) 5%, transparent) !important; color: var(--ink-3) !important; cursor: not-allowed; }`;
  document.head.appendChild(s);
})();

/* ─────────────────────────────────────────────
   공통 핫키 체계
   F2  신규
   F3  품목·항목 코드도움
   F4  거래처 코드도움
   F8  저장
   F9  조건 검색
   F10 화면 설정
   ESC 닫기 (설정 중이면 설정만 닫힘)
   ※ F6·F7 은 화면별 특수 기능에 배정
   ───────────────────────────────────────────── */
const HOTKEYS = [
  { k: "F2",  label: "신규" },
  { k: "F3",  label: "품목 코드도움" },
  { k: "F4",  label: "거래처 코드도움" },
  { k: "F8",  label: "저장" },
  { k: "F9",  label: "조건 검색" },
  { k: "F10", label: "화면 설정" },
  { k: "ESC", label: "닫기" },
];
function useHotkeys(map) {
  useEffect(() => {
    const fn = (e) => {
      const h = map[e.key];
      if (!h) return;
      if (document.querySelector(".modal-root")) return;
      e.preventDefault();
      h();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  });
}
function HotkeyBar({ extra = [] }) {
  return (
    <div className="hk-bar">
      {[...HOTKEYS, ...extra].map(h => (
        <span key={h.k} className="hk-item"><kbd className="hk-key">{h.k}</kbd>{h.label}</span>
      ))}
    </div>
  );
}
const CC_HOTKEY_CSS = `
.hk-bar{ display:flex; align-items:center; gap:14px; flex-wrap:wrap; padding:8px 2px 0; }
.hk-item{ display:inline-flex; align-items:center; gap:5px; font:400 11.5px "IBM Plex Sans KR",sans-serif; color:var(--ink-3); }
.hk-key{ font:600 10.5px "JetBrains Mono",monospace; background:var(--card-2); border:1px solid var(--line); border-bottom-width:2px; border-radius:4px; padding:1px 5px; color:var(--ink-2); }
`;


/* ─────────────────────────────────────────────
   공통 코드도움(검색형) — 거래처/품목 입력화면 공용
   ───────────────────────────────────────────── */
const CODE_FLD_DEFAULT = { code: { fmt: "auto", autoPat: "00001", maxLen: 5 } };
function CcLookupFieldBase({ k, label, value, onChange, invalid, ctx }) {  const { catOf, optionsFor, lkAll, sugPos, lkSug, setLkSug, setLookupFor } = ctx.current;
  const m = String(value || "").match(/^(\S+)\s*·\s*(.+)$/);
  const cat = catOf(k, label);
  const opts = optionsFor(k, value, label);
  return (
    <div className="cc-lookup">
      <input className={`fld-input ${invalid ? "is-invalid" : ""}`} value={m ? m[2] : (value || "")} autoComplete="off"
        onDoubleClick={() => setLookupFor({ key: k, label, cat, q: String(value || "").trim() })}
        onChange={(e) => { onChange(e.target.value); setLkSug({ key: k, q: e.target.value, rect: e.target.getBoundingClientRect() }); }}
        onBlur={(e) => {
          const v = e.target.value.trim();
          setTimeout(() => {
            setLkSug(s => (s && s.key === k ? null : s));
            if (v && !lkAll(k, label).some(o => o.toLowerCase() === v.toLowerCase())) setLookupFor(f => f || { key: k, label, cat, q: v });
          }, 140);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const first = opts[0];
            if (first) { e.preventDefault(); onChange(first); setLkSug(null); }
            else { const v = String(value || "").trim(); if (v && !lkAll(k, label).some(o => o.toLowerCase() === v.toLowerCase())) { e.preventDefault(); setLkSug(null); setLookupFor({ key: k, label, cat, q: v }); } }
          }
          if (e.key === "Escape") setLkSug(null);
        }} />
      {m ? <span className="cc-codechip">{m[1]}</span> : null}
      <button type="button" className="cc-lookup-btn" title="코드도움" onClick={() => setLookupFor({ key: k, label, cat })}>{CC_I.search}</button>
      {lkSug && lkSug.key === k && String(value || "").trim() && opts.length ? (
        <div className="cc-sug" style={sugPos(lkSug.rect, Math.min(opts.length, 8))}>
          {opts.slice(0, 8).map((o, i) => (
            <button key={o + i} type="button" className="cc-sug-item" onMouseDown={(e) => { e.preventDefault(); onChange(o); setLkSug(null); }}>{o}</button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function useCcLookup({ fldMeta, setValue, setToast, builtin }) {
  const { useState, useEffect, useRef } = React;
  const [lookupFor, setLookupFor] = useState(null);
  const [lkSug, setLkSug] = useState(null);
  const [newEntry, setNewEntry] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const LK_BUILTIN = builtin || {};
  const readLists = () => { try { const j = JSON.parse(localStorage.getItem("cc.customLists.v1") || "{}"); const p = partnerLookupOptions(); const it = itemLookupOptions(); if (p.length) j["거래처"] = p; if (it.length) { j["품목"] = it; j["재고"] = it; } return j; } catch (e) { return {}; } };
  const catOf = (k, label) => ((fldMeta || {})[k] || {}).srcCat || label || "";
  const lkAll = (k, label) => {
    const cat = catOf(k, label);
    const lists = readLists();
    return lists[cat] || LK_BUILTIN[cat] || [];
  };
  const optionsFor = (k, val, label) => {
    const q = String(val || "").trim().toLowerCase();
    if (!q) return [];
    return lkAll(k, label).filter(o => o.toLowerCase().includes(q) && o.toLowerCase() !== q);
  };
  const sugPos = (r, n) => {
    if (!r) return {};
    const h = Math.min(n * 34 + 8, 220);
    const below = window.innerHeight - r.bottom;
    const top = below > h + 8 ? r.bottom + 4 : Math.max(8, r.top - h - 4);
    return { position: "fixed", left: r.left, top, width: Math.max(r.width, 220), zIndex: 200 };
  };
  useEffect(() => {
    window.__ccExtLookup = !!lookupFor;
    if (!lookupFor) return;
    const h = (e) => { if (e.key === "Escape") { e.stopImmediatePropagation(); e.preventDefault(); if (newEntry) { setNewEntry(null); return; } setLookupFor(null); } };
    window.addEventListener("keydown", h, true);
    return () => { window.removeEventListener("keydown", h, true); window.__ccExtLookup = false; };
  }, [lookupFor, newEntry]);

  const lkCtx = useRef({});
  lkCtx.current = { catOf, optionsFor, lkAll, sugPos, lkSug, setLkSug, setLookupFor };
  const LookupField = React.useMemo(() => (props) => <CcLookupFieldBase {...props} ctx={lkCtx} />, []);

  const UI = () => {
    if (!lookupFor) return null;
    const lists = readLists();
    const all = lists[lookupFor.cat] || LK_BUILTIN[lookupFor.cat] || [];
    const q = (lookupFor.q || "").trim();
    const opts = q ? all.filter(o => o.toLowerCase().includes(q.toLowerCase())) : all;
    const isCustom = !!(lookupFor.cat && !LK_BUILTIN[lookupFor.cat]);
    const nextCode = () => {
      const nums = all.map(o => { const mm = String(o).match(/(\d{3,})/); return mm ? parseInt(mm[1], 10) : 0; });
      return String((nums.length ? Math.max(...nums) : 0) + 1).padStart(5, "0");
    };
    const addNew = () => setNewEntry({ code: nextCode(), name: q, orig: null });
    const writeList = (arr) => { try { localStorage.setItem("cc.customLists.v1", JSON.stringify({ ...lists, [lookupFor.cat]: arr })); } catch (e) {} };
    const saveNewEntry = () => {
      const code = (newEntry.code || "").trim(), nm = (newEntry.name || "").trim();
      if (!code || !nm) return;
      const val = code + " · " + nm;
      if (isCustom) { const cur = lists[lookupFor.cat] || []; writeList(newEntry.orig ? cur.map(o => o === newEntry.orig ? val : o) : [...cur, val]); }
      if (lookupFor.key) { setValue(lookupFor.key, val); setLookupFor(null); }
      setNewEntry(null);
      setToast && setToast(newEntry.orig ? "「" + nm + "」로 수정했습니다." : "「" + nm + "」를 등록했습니다.");
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
            <button type="button" className="modal-close" onClick={() => setLookupFor(null)}>{CC_I.close}</button>
          </header>
          <div className="pick-search">
            <span className="pick-ico">{CC_I.search}</span>
            <input autoFocus value={lookupFor.q || ""} placeholder="검색어를 입력하세요"
              onChange={(e) => setLookupFor(f => ({ ...f, q: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); if (opts[0]) { setValue(lookupFor.key, opts[0]); setLookupFor(null); } else addNew(); }
                else if (e.key === "F2") { e.preventDefault(); addNew(); }
                else if (e.key === "Escape") { e.preventDefault(); setLookupFor(null); }
              }} />
          </div>
          <div className="pick-table">
            <div className="pick-trow pick-thead" style={{ gridTemplateColumns: "110px 1fr auto" }}><div className="pk-cell">코드</div><div className="pk-cell">{lookupFor.cat || lookupFor.label}</div><div className="pk-cell">{editMode && isCustom ? "클릭하여 수정" : ""}</div></div>
            <div className="pick-tbody">
              {opts.length === 0 ? <div className="pick-empty">{q ? "「" + q + "」와 일치하는 항목이 없습니다." : "등록된 항목이 없습니다."}</div> : null}
              {opts.map((o, i) => { const mm = String(o).match(/^(\S+)\s*·\s*(.+)$/); return (
                <div key={o + i} className="pick-trow pick-opt" style={{ gridTemplateColumns: "110px 1fr auto", cursor: "pointer" }}
                  onClick={() => {
                    if ((editMode || !lookupFor.key) && isCustom) { setNewEntry({ code: mm ? mm[1] : "", name: mm ? mm[2] : o, orig: o }); }
                    else if (lookupFor.key) { setValue(lookupFor.key, o); setLookupFor(null); }
                  }}>
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
              <header className="modal-head"><div><h2 className="modal-title">{newEntry.orig ? "항목 수정" : "신규"}</h2><div className="modal-sub">{lookupFor.cat || lookupFor.label} 리스트{newEntry.orig ? " 항목을 수정합니다." : "에 추가합니다."}</div></div><button type="button" className="modal-close" onClick={() => setNewEntry(null)}>{CC_I.close}</button></header>
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
  };

  return { lookupFor, setLookupFor, lkSug, setLkSug, newEntry, setNewEntry, lkAll, optionsFor, sugPos, LookupField, UI };
}

Object.assign(window, { cashPaymentsFor, useCashPayments, CASH_RECORDS_KEY, nmConfirm, nmUsedDocs, nmDocList, stampSaved, isRecent, usePersistedList, NM_LIST_KEY, readPartnerList, readItemList, partnerLookupOptions, itemLookupOptions, partnerPickerItems, CC_DOC_KEY, publishDocs, readDocs, useDocPublish, useSharedDocs, ccResolveSrc, ccExpandLookup, SearchCondModal, SearchCondChips, CODE_FLD_DEFAULT, useCcLookup, useWinFrame, CommonTopBar, showToast, ConfirmModal, SaveViewModal, ColFieldSettingsModal, ViewPresetMenu, nextViewCode, AddColModal, ColPickModal, CC_I, useColConfig, ColCfgPopover, FlatAddColModal, calcFlatCol, PANEL_FIELD_DEFS, panelFieldValue, PanelFieldPicker, PanelSettingsModal, usePanels, InfoPanelBody, HOTKEYS, useHotkeys, HotkeyBar, CC_HOTKEY_CSS });

/* F2 → 신규 (전 화면 공통)
   팝업이 열려 있으면 가장 위 팝업의 "+ 신규"(.pick-new) 버튼을, 아니면 페이지의 "신규" 기본 버튼(.page-actions/.page-head .btn-primary)을 누른다.
   각 화면 개별 F2 핸들러보다 먼저 실행되어 중복 실행을 막는다. 입력 필드(코드도움 input 등)에 자체 F2 처리가 있으면 그것을 우선한다. */
if (!window.__f2GlobalNew) {
  window.__f2GlobalNew = true;
  window.addEventListener("keydown", (e) => {
    if (e.key !== "F2" || e.defaultPrevented) return;
    const roots = Array.from(document.querySelectorAll(".modal-root, .pick-root"));
    const top = roots[roots.length - 1];
    if (top) {
      const btns = Array.from(top.querySelectorAll(".pick-new")).filter(b => !b.disabled && (!b.closest(".modal-root, .pick-root") || b.closest(".modal-root, .pick-root") === top));
      const b = btns[btns.length - 1];
      if (b) { e.preventDefault(); e.stopImmediatePropagation(); b.click(); }
      return; // 팝업 안에서는 페이지 신규 버튼으로 새지 않음
    }
    if (document.querySelector(".is-cfg-mode")) return;
    const pb = Array.from(document.querySelectorAll(".page-head .btn-primary, .page-actions .btn-primary, .title-add")).find(b => /신규/.test(b.textContent || "") && !b.disabled && b.offsetParent !== null);
    if (pb) { e.preventDefault(); e.stopImmediatePropagation(); pb.click(); }
  }, true);
}

/* ESC → 가장 위에 열린 팝업의 취소/닫기 (전 화면 공통)
   개별 팝업이 ESC 를 직접 처리(stopImmediatePropagation)하면 그것이 우선. 처리되지 않은 경우에만
   푸터의 "취소"/"닫기" 버튼 또는 헤더 X 를 눌러 준다. */
if (!window.__escModalClose) {
  window.__escModalClose = true;
  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || e.defaultPrevented) return;
    const roots = Array.from(document.querySelectorAll(".modal-root, .pick-root"));
    const top = roots[roots.length - 1];
    if (!top) return;
    const own = (el) => el.closest(".modal-root, .pick-root") === top;
    const btns = Array.from(top.querySelectorAll(".modal-foot button, .nav-edit-foot button, .confirm-modal button")).filter(b => own(b) && !b.disabled && /^(취소|닫기)/.test((b.textContent || "").trim()));
    const b = btns[0] || Array.from(top.querySelectorAll(".modal-close")).find(own);
    if (b) { e.preventDefault(); b.click(); }
  });
}

/* F8 → 열린 모달 폼 저장 (전 화면 공통)
   가장 나중에 열린(=DOM 상 마지막) .modal-root/.pick-root 컨테이너를 찾아 그 안의 form 을 제출하고,
   form 이 없으면 푸터의 "저장" 기본 버튼을 클릭한다. 각 화면의 개별 F8 핸들러보다 먼저 실행되어 중복 저장을 막는다. */
if (!window.__f8ModalSubmit) {
  window.__f8ModalSubmit = true;
  window.addEventListener("keydown", (e) => {
    if (e.key !== "F8" || e.defaultPrevented) return;
    const roots = Array.from(document.querySelectorAll(".modal-root, .pick-root")).filter(r => r.offsetParent !== null || getComputedStyle(r).position === "fixed");
    const top = roots[roots.length - 1];
    if (!top) return;
    const forms = Array.from(top.querySelectorAll("form")).filter(f => !f.closest(".modal-root, .pick-root") || f.closest(".modal-root, .pick-root") === top);
    const f = forms[forms.length - 1];
    if (f) { e.preventDefault(); e.stopImmediatePropagation(); f.requestSubmit(); return; }
    const btns = Array.from(top.querySelectorAll(".modal-foot .btn-primary, .aef-foot .btn-primary, .nav-edit-foot .btn-primary")).filter(b => /저장|검색|확인|완료/.test(b.textContent || "") && !b.disabled && b.closest(".modal-root, .pick-root") === top);
    const b = btns[btns.length - 1];
    if (b) { e.preventDefault(); e.stopImmediatePropagation(); b.click(); }
  }, true);
}
