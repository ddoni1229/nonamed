/* 활동관리 — 거래처 통화·방문·미팅·메모 타임라인.
   조회(평면 테이블 + 화면설정 + 저장양식 + 조건검색)는 거래처등록과 동일한 공통 모듈(colconfig.jsx) 사용.
   입력창은 매입 입력창처럼 이동·너비조절·고정(⛶) 가능한 창(useWinFrame). */
const { useState, useEffect, useMemo, useRef } = React;

const ACT_TODAY = new Date().toISOString().slice(0, 10);
const ACT_TYPES = ["통화", "방문", "미팅", "메모", "이메일"];
const ACT_RESULTS = ["진행중", "완료", "재연락", "보류"];
const ACT_MGRS = ["박지영", "최영민", "이수진", "강마포", "문호철"];
const ACT_PARTNERS = ["한양식자재", "송파유통", "동대문푸드", "마포정육점", "성수냉동", "종로식자재마트", "강서물산", "광진수산"];
const ACT_CONTACTS = { "한양식자재": "이한양 대표", "송파유통": "김송파 구매팀장", "동대문푸드": "정대문 대표", "마포정육점": "강마포 대표", "성수냉동": "오성수 영업팀장", "종로식자재마트": "한종로 경리팀장", "강서물산": "문강서 대표", "광진수산": "권광진 대표" };

const ACT_COLUMNS = [
  { key: "id",      label: "활동번호", width: "104px", kind: "mono" },
  { key: "date",    label: "일자",     width: "104px", kind: "mono" },
  { key: "time",    label: "시간",     width: "72px",  kind: "mono" },
  { key: "type",    label: "유형",     width: "84px",  kind: "chip" },
  { key: "partner", label: "거래처",   width: "minmax(140px,1.3fr)", kind: "name", locked: true },
  { key: "contact", label: "담당자(상대)", width: "130px", kind: "text" },
  { key: "title",   label: "제목",     width: "minmax(180px,2fr)", kind: "text" },
  { key: "result",  label: "결과",     width: "84px",  kind: "chip" },
  { key: "next",    label: "다음 액션", width: "minmax(140px,1.4fr)", kind: "muted" },
  { key: "nextDate",label: "다음 일자", width: "104px", kind: "mono" },
  { key: "mgr",     label: "담당",     width: "80px",  kind: "text" },
  { key: "memo",    label: "메모",     width: "minmax(160px,1.5fr)", kind: "muted" },
];
const ACT_DEFAULT_COLS = ["date", "time", "type", "partner", "contact", "title", "result", "nextDate", "mgr"];
const ACT_BASE_KEYS = ACT_COLUMNS.map(c => c.label);
const ACT_SRC_GROUPS = { "조회 기술키": ["순번", "인쇄"], "입력 기술키": ACT_BASE_KEYS };

const ACT_SEED = (() => {
  const titles = ["5월 납품 단가 협의", "신규 품목 소개 (냉동 닭가슴살)", "미수금 정리 요청", "월말 정산 일정 확인", "배송 지연 클레임 대응", "6월 프로모션 제안", "거래명세서 재발행 요청", "정기 방문 인사"];
  const nexts = ["견적서 발송", "샘플 전달", "입금 확인 후 연락", "재방문", "계약서 초안 공유", "", "담당자 회신 대기", ""];
  const out = [];
  for (let i = 0; i < 26; i++) {
    const d = new Date(ACT_TODAY); d.setDate(d.getDate() - (i * 2) % 40);
    const partner = ACT_PARTNERS[i % ACT_PARTNERS.length];
    const type = ACT_TYPES[(i * 3) % ACT_TYPES.length];
    const result = ACT_RESULTS[(i * 5) % ACT_RESULTS.length];
    const nd = new Date(d); nd.setDate(nd.getDate() + 3 + (i % 5));
    out.push({ id: "AC-" + String(1001 + i).slice(1), date: d.toISOString().slice(0, 10), time: String(9 + (i % 8)).padStart(2, "0") + ":" + (i % 2 ? "30" : "00"), type, partner, contact: ACT_CONTACTS[partner], title: titles[i % titles.length], result, next: nexts[i % nexts.length], nextDate: nexts[i % nexts.length] ? nd.toISOString().slice(0, 10) : "", mgr: ACT_MGRS[i % ACT_MGRS.length], memo: i % 3 === 0 ? "다음 주 재확인 필요" : "" });
  }
  return out.sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
})();
ACT_SEED.length = 0; // 샘플 데이터 제거(배포용)

const AI = {
  plus: <svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  search: <svg viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.6"/><path d="M16 16l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  chevron: <svg viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none"><path d="M5 12l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  cog: <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  download: <svg viewBox="0 0 24 24" fill="none"><path d="M12 4v12M7 11l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  close: <svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  trash: <svg viewBox="0 0 24 24" fill="none"><path d="M5 7h14M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M6 7l1 12a1 1 0 001 1h8a1 1 0 001-1l1-12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

function TopBar() { return <CommonTopBar crumb="활동" />; }

/* ── 입력창 (매입 입력창 스타일: 이동/너비/고정) ── */
function ActivityModal({ open, initial, onSave, onDelete, onClose }) {
  const blank = { date: ACT_TODAY, time: "10:00", type: "통화", partner: "", contact: "", title: "", result: "진행중", next: "", nextDate: "", mgr: ACT_MGRS[0], memo: "" };
  const [f, setF] = useState(blank);
  const [err, setErr] = useState("");
  const [delAsk, setDelAsk] = useState(false);
  const wf = useWinFrame("nonamed.activity.entry", 760, open);
  const firstRef = useRef(null);
  useEffect(() => { if (open) { setF(initial ? { ...blank, ...initial } : blank); setErr(""); setDelAsk(false); setTimeout(() => firstRef.current && firstRef.current.focus(), 30); } }, [open, initial]);
  useEffect(() => {
    if (!open) return;
    const fn = (e) => { if (e.key === "Escape") { if (delAsk) { setDelAsk(false); return; } e.stopImmediatePropagation(); onClose(); } else if (e.key === "F8") { e.stopImmediatePropagation(); e.preventDefault(); submit(); } };
    window.addEventListener("keydown", fn, true);
    return () => window.removeEventListener("keydown", fn, true);
  });
  if (!open) return null;
  const set = (k) => (e) => setF(p => ({ ...p, [k]: e && e.target ? e.target.value : e }));
  const submit = () => {
    if (!f.partner.trim()) { setErr("거래처를 입력해 주세요."); return; }
    if (!f.title.trim()) { setErr("제목을 입력해 주세요."); return; }
    onSave({ ...f, partner: f.partner.trim(), title: f.title.trim() }, !!initial);
  };
  const isEdit = !!initial;
  const partnerList = ACT_PARTNERS.filter(p => !f.partner || p.includes(f.partner));
  return (
    <div className="modal-root" role="dialog" aria-modal="true">
      <div className="modal-scrim" onClick={onClose} />
      <form className="modal act-modal" style={wf.winStyle} onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <wf.WinResize />
        <header className="modal-head modal-head-drag" onMouseDown={wf.onWinDragDown}>
          <div>
            <h2 className="modal-title">{isEdit ? "활동 수정" : "활동 등록"}{isEdit ? <span className="modal-code">{initial.id}</span> : null}</h2>
            <div className="modal-sub">통화·방문·미팅 내용을 기록하고 다음 액션을 예약합니다.</div>
          </div>
          <div className="modal-head-actions">
            <wf.WinTools />
            <button type="button" className="modal-close" onClick={onClose} aria-label="닫기">{AI.close}</button>
          </div>
        </header>
        <div className="modal-body act-body">
          <div className="act-grid">
            <label className="fld"><span className="fld-label">일자 <span className="req">*</span></span><input ref={firstRef} type="date" className="fld-input is-mono" value={f.date} onChange={set("date")} /></label>
            <label className="fld"><span className="fld-label">시간</span><input type="time" className="fld-input is-mono" value={f.time} onChange={set("time")} /></label>
            <div className="fld"><span className="fld-label">유형</span>
              <div className="seg act-seg">{ACT_TYPES.map(t => <button key={t} type="button" className={`seg-item ${f.type === t ? "is-on" : ""}`} onClick={() => setF(p => ({ ...p, type: t }))}>{t}</button>)}</div>
            </div>
            <label className="fld act-span2"><span className="fld-label">거래처 <span className="req">*</span></span>
              <input className="fld-input" list="act-partners" value={f.partner} onChange={(e) => { const v = e.target.value; setF(p => ({ ...p, partner: v, contact: p.contact || ACT_CONTACTS[v] || "" })); }} placeholder="거래처명 입력 또는 선택" />
              <datalist id="act-partners">{partnerList.map(p => <option key={p} value={p} />)}</datalist>
            </label>
            <label className="fld"><span className="fld-label">담당자(상대)</span><input className="fld-input" value={f.contact} onChange={set("contact")} placeholder="예: 김송파 구매팀장" /></label>
            <label className="fld act-span3"><span className="fld-label">제목 <span className="req">*</span></span><input className="fld-input" value={f.title} onChange={set("title")} placeholder="예: 5월 납품 단가 협의" /></label>
            <div className="fld"><span className="fld-label">결과</span>
              <div className="seg act-seg">{ACT_RESULTS.map(t => <button key={t} type="button" className={`seg-item ${f.result === t ? "is-on" : ""}`} onClick={() => setF(p => ({ ...p, result: t }))}>{t}</button>)}</div>
            </div>
            <label className="fld"><span className="fld-label">담당</span>
              <select className="fld-input" value={f.mgr} onChange={set("mgr")}>{ACT_MGRS.map(m => <option key={m}>{m}</option>)}</select>
            </label>
            <label className="fld"><span className="fld-label">다음 일자</span><input type="date" className="fld-input is-mono" value={f.nextDate} onChange={set("nextDate")} /></label>
            <label className="fld act-span3"><span className="fld-label">다음 액션</span><input className="fld-input" value={f.next} onChange={set("next")} placeholder="예: 견적서 발송" /></label>
            <label className="fld act-span3"><span className="fld-label">메모</span><textarea className="fld-input act-memo" rows={4} value={f.memo} onChange={set("memo")} placeholder="통화·미팅 내용, 특이사항" /></label>
          </div>
          {err ? <div className="fset-err">{err}</div> : null}
        </div>
        <footer className="modal-foot">
          <div className="ff-left">{isEdit ? <button type="button" className="btn-ghost btn-danger" onClick={() => setDelAsk(true)}>{AI.trash} 삭제</button> : null}</div>
          <div className="ff-right">
            <button type="button" className="btn-ghost" onClick={onClose}>닫기 <kbd className="btn-kbd">ESC</kbd></button>
            <button type="submit" className="btn-primary">저장 <kbd className="btn-kbd">F8</kbd></button>
          </div>
        </footer>
      </form>
      <ConfirmModal open={delAsk} title="활동 삭제" danger confirmLabel="삭제" message={initial ? `${initial.id} 「${initial.title}」 활동을 삭제할까요?` : ""} onConfirm={() => { setDelAsk(false); onDelete(initial); }} onClose={() => setDelAsk(false)} />
    </div>
  );
}

/* ── 우측 타임라인 (선택 거래처 이력) ── */
function ActivityTimeline({ partner, acts, onOpen, onClose }) {
  const list = acts.filter(a => a.partner === partner);
  return (
    <aside className="act-side">
      <div className="act-side-h"><div><b>{partner}</b><span className="act-side-sub">{ACT_CONTACTS[partner] || ""} · {list.length}건</span></div><button type="button" className="modal-close" onClick={onClose} aria-label="닫기">{AI.close}</button></div>
      <div className="act-tl">
        {list.map(a => (
          <button key={a.id} type="button" className="act-tl-item" onClick={() => onOpen(a)}>
            <span className={"act-dot t-" + a.type} />
            <span className="act-tl-date">{a.date} {a.time}</span>
            <span className="act-tl-title"><span className={"act-chip t-" + a.type}>{a.type}</span>{a.title}</span>
            {a.next ? <span className="act-tl-next">→ {a.next}{a.nextDate ? ` (${a.nextDate})` : ""}</span> : null}
          </button>
        ))}
        {!list.length ? <div className="t-empty">기록된 활동이 없습니다.</div> : null}
      </div>
    </aside>
  );
}

function App({ embedded = false, onView } = {}) {
  const cc = useColConfig({ allColumns: ACT_COLUMNS, defaultVisible: ACT_DEFAULT_COLS, prefix: "nonamed.activity.v1" });
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
  const [tmpW, setTmpW] = useState({});
  const [listResetAsk, setListResetAsk] = useState(false);
  const [listDonePrompt, setListDonePrompt] = useState(false);
  const listCfgSnap = useRef(null);
  const enterListCfg = () => { listCfgSnap.current = cc.snapshot(); cc.setCfg(true); };
  const finishListCfg = () => { if (listCfgSnap.current && JSON.stringify(cc.snapshot()) === JSON.stringify(listCfgSnap.current)) { cc.setCfg(false); showToast("변경사항이 없어 설정을 종료했어요", "info"); } else setListDonePrompt(true); };
  const cancelListCfg = () => { setListDonePrompt(false); if (listCfgSnap.current) cc.restore(listCfgSnap.current); cc.setCfg(false); };
  const openColPop = (e, col) => { const cell = e.currentTarget; const card = cell.closest(".table-card"); const cr = card ? card.getBoundingClientRect() : { left: 0, top: 0 }; const b = cell.getBoundingClientRect(); setColPop({ key: col.key, x: b.left - cr.left + b.width / 2, y: b.bottom - cr.top + 4 }); };
  const startResize = (e, col) => { e.preventDefault(); e.stopPropagation(); const sx = e.clientX; const sw = parseInt(tmpW[col.key] || col.width) || 120; const move = (ev) => { const w = Math.max(60, sw + ev.clientX - sx); if (cc.cfg) cc.setWidth(col.key, w); else setTmpW(p => ({ ...p, [col.key]: w })); }; const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); }; window.addEventListener("mousemove", move); window.addEventListener("mouseup", up); };

  const [acts, setActs] = useState(() => { try { let v = JSON.parse(localStorage.getItem("nonamed.activity.docs.v1")); if (!Array.isArray(v)) return []; if (!localStorage.getItem("nonamed.activity.seedPurged.v1")) { v = v.filter(a => !(ACT_PARTNERS.includes(a.partner) && /^AC-0\d\d$/.test(a.id) && !a.userMade)); localStorage.setItem("nonamed.activity.seedPurged.v1", "1"); } return v; } catch (e) { return []; } });
  useEffect(() => { try { localStorage.setItem("nonamed.activity.docs.v1", JSON.stringify(acts)); } catch (e) {} }, [acts]);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [cond, setCond] = useState({});
  const [dcond, setDcond] = useState({});
  useEffect(() => { if (searchOpen) setDcond(cond); }, [searchOpen]);
  const [checked, setChecked] = useState(() => new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [sidePartner, setSidePartner] = useState(null);

  const [period, setPeriod] = useState("이번 달");
  const PERIODS = ["기본", "금일", "이번주", "이번 달", "최근 3개월"];
  const [range, setRange] = useState(() => ({ from: ACT_TODAY.slice(0, 8) + "01", to: ACT_TODAY }));
  const [draft, setDraft] = useState(() => ({ from: ACT_TODAY.slice(0, 8) + "01", to: ACT_TODAY }));
  const pickPeriod = (p) => {
    setPeriod(p); if (p === "기본") return;
    const t = new Date(ACT_TODAY); let from = ACT_TODAY, to = ACT_TODAY;
    if (p === "이번주") { const d = new Date(t); const dow = (d.getDay() + 6) % 7; d.setDate(d.getDate() - dow); from = d.toISOString().slice(0, 10); const e = new Date(d); e.setDate(e.getDate() + 6); to = e.toISOString().slice(0, 10); }
    else if (p === "이번 달") { from = ACT_TODAY.slice(0, 8) + "01"; to = ACT_TODAY; }
    else if (p === "최근 3개월") { const d = new Date(t); d.setMonth(d.getMonth() - 3); from = d.toISOString().slice(0, 10); }
    setRange({ from, to }); setDraft({ from, to });
  };

  const searchFields = [{ key: "partner", label: "거래처" }, { key: "type", label: "유형" }, { key: "result", label: "결과" }, { key: "mgr", label: "담당" }, { key: "title", label: "제목" }, { key: "contact", label: "담당자(상대)" }];
  const filtered = useMemo(() => {
    const has = (v, s) => !String(v || "").trim() || (s || "").toLowerCase().includes(String(v).trim().toLowerCase());
    return acts.filter(a => {
      if (range.from && a.date < range.from) return false;
      if (range.to && a.date > range.to) return false;
      for (const f of searchFields) { if (cond[f.key] && !has(cond[f.key], a[f.key])) return false; }
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return [a.id, a.partner, a.contact, a.title, a.next, a.memo, a.mgr].some(s => (s || "").toLowerCase().includes(q));
    });
  }, [acts, query, cond, range]);
  const dueSoon = useMemo(() => acts.filter(a => a.nextDate && a.result !== "완료" && a.nextDate >= ACT_TODAY).sort((a, b) => a.nextDate.localeCompare(b.nextDate)).slice(0, 5), [acts]);

  const toggle = (id) => setChecked(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const allChecked = filtered.length > 0 && checked.size === filtered.length;
  const toggleAll = () => setChecked(allChecked ? new Set() : new Set(filtered.map(a => a.id)));
  const openNew = () => { if (cc.cfg) return; setEditing(null); setModalOpen(true); };
  const openEdit = (a) => { if (cc.cfg) return; setEditing(a); setModalOpen(true); };
  const cfgRef = useRef(false); cfgRef.current = cc.cfg;
  useEffect(() => { const fn = (e) => { if (e.key === "F2" && !modalOpen && !cfgRef.current && !document.querySelector(".modal-root")) { e.preventDefault(); openNew(); } }; window.addEventListener("keydown", fn); return () => window.removeEventListener("keydown", fn); }, [modalOpen]);
  useHotkeys({ F9: () => { if (!cc.cfg) setSearchOpen(true); }, F10: () => { if (cc.cfg) finishListCfg(); else enterListCfg(); }, F8: () => { setPeriod("기본"); setRange(draft); } });

  const handleSave = (form, isEdit) => {
    if (isEdit) { setActs(prev => prev.map(a => a.id === editing.id ? stampSaved({ ...a, ...form }) : a)); showToast(`${editing.id} 활동을 수정했어요`); }
    else { const n = acts.reduce((m, a) => { const k = parseInt(String(a.id).replace(/\D/g, ""), 10); return isNaN(k) ? m : Math.max(m, k); }, 0) + 1; const id = "AC-" + String(n).padStart(3, "0"); setActs(prev => [stampSaved({ id, ...form, userMade: true }), ...prev]); showToast(`활동 ${id} 를 등록했어요`); }
    setModalOpen(false);
  };
  const handleDelete = (a) => { setActs(prev => prev.filter(x => x.id !== a.id)); setModalOpen(false); showToast(`${a.id} 활동을 삭제했어요`); };
  const allPartners = useMemo(() => { const tbl = readPartnerList().map(p => p.name); return [...new Set(localStorage.getItem(NM_LIST_KEY.거래처) != null ? tbl : ACT_PARTNERS)].filter(Boolean); }, [acts]);
  const handleBulkDelete = async () => { if (!checked.size || !(await nmConfirm({ title: "선택 삭제", message: `선택한 ${checked.size}건을 삭제할까요? 삭제 후에는 되돌릴 수 없습니다.`, confirmLabel: "삭제", danger: true }))) return; setActs(prev => prev.filter(a => !checked.has(a.id))); setChecked(new Set()); showToast("선택한 활동을 삭제했어요"); };
  const exportExcel = () => {
    const cols = cc.visibleCols; const esc = (v) => { const s = v == null ? "" : String(v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    const lines = [cols.map(c => esc(c.label)).join(","), ...filtered.map(a => cols.map(c => esc(c.isCustom ? calcFlatCol(c.def, a, ACT_COLUMNS) : a[c.key])).join(","))];
    const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" }); const url = URL.createObjectURL(blob);
    const el = document.createElement("a"); el.href = url; el.download = `활동목록_${ACT_TODAY}.csv`; el.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(`활동 ${filtered.length}건을 내려받았습니다.`);
  };

  const cell = (c, a, idx) => {
    if (c.isCustom && (c.def.source === "순번" || c.def.slot === "순번")) return <span className="tc-val is-mono">{idx + 1}</span>;
    if (c.isCustom) return <span className="tc-val">{calcFlatCol(c.def, a, ACT_COLUMNS) || "—"}</span>;
    const v = a[c.key];
    if (c.key === "type") return <span className={"act-chip t-" + v}>{v}</span>;
    if (c.key === "result") return <span className={"act-chip r-" + v}>{v}</span>;
    if (c.key === "partner") return <button type="button" className="act-partner-link" onClick={(e) => { e.stopPropagation(); setSidePartner(v); }}>{v}</button>;
    if (c.kind === "mono") return <span className="tc-val is-mono">{v || "—"}</span>;
    return <span className={"tc-val " + (c.kind === "muted" ? "is-muted" : "")}>{v || "—"}</span>;
  };

  return (
    <div className={"layout" + (embedded ? " is-embedded" : "")}>
      {embedded ? null : <Sidebar active="activity" />}
      <div className="main">
        {embedded ? null : <TopBar />}
        {modalOpen ? <ActEntryScreen key={editing ? editing.id : "new"} initial={editing} partners={allPartners} contacts={ACT_CONTACTS} activities={acts} onSave={handleSave} onDelete={handleDelete} onClose={() => setModalOpen(false)} /> : null}
        <div className={`content ${cc.cfg ? "is-cfg-mode" : ""}`}>
          <header className="page-head">
            <div className="page-head-l">
              <h1 className="page-title">{embedded ? "거래처" : "활동"}</h1>
              <button type="button" className="btn-primary title-add" disabled={cc.cfg} onClick={openNew}>{AI.plus} 활동 등록 <kbd className="btn-kbd">F2</kbd></button>
              {cc.views.length > 0 ? (() => { const av = cc.views.find(v => v.code === cc.activeView); return (
                <div className="active-view-wrap">
                  <button type="button" className={`active-view ${av ? "" : "is-none"}`} title="화면 선택" onClick={() => setViewPickOpen(o => !o)}>
                    {av ? <><span className="active-view-code">{av.code}</span><span className="active-view-name">{av.name}</span></> : <span className="active-view-name">화면 선택</span>}
                    <span className="active-view-caret">{AI.chevron}</span>
                  </button>
                  {viewPickOpen ? (<><div className="vpm-scrim" onClick={() => setViewPickOpen(false)} /><div className="vpm-menu active-view-menu"><div className="vpm-menu-h">화면 선택</div><div className="vpm-list">
                    {cc.views.map(v => <button key={v.code} type="button" className={`vpm-item vpm-pick ${v.code === cc.activeView ? "is-on" : ""}`} onClick={() => { cc.applyView(v.code); setViewPickOpen(false); }}><span className="vpm-code">{v.code}</span><span className="vpm-name">{v.name}</span>{v.code === cc.activeView ? <span className="vpm-dot" /> : null}</button>)}
                  </div></div></>) : null}
                </div>
              ); })() : null}
            </div>
            <div className="page-actions">
              <ViewPresetMenu views={cc.views} activeCode={cc.activeView} enabled={cc.cfg} onApply={cc.applyView} onSaveNew={() => setSaveOpen(true)} onOverwrite={(c) => setOwCode(c)} onRename={(c) => setRenameCode(c)} onDelete={(c) => setDelCode(c)} />
              {cc.cfg ? <button type="button" className="btn-ghost" onClick={() => setListResetAsk(true)}>초기화</button> : null}
              <button type="button" className={`btn-ghost ${cc.cfg ? "is-on-cfg" : ""}`} onClick={() => { if (cc.cfg) finishListCfg(); else enterListCfg(); }}>{AI.cog} {cc.cfg ? "설정 완료" : "화면 설정"}</button>
              <button type="button" className="btn-ghost" disabled={cc.cfg} onClick={exportExcel}>{AI.download} excel</button>
            </div>
          </header>

          {embedded ? (
            <div className="view-row"><div className="view-tabs">
              {["거래처", "활동"].map(v => <button key={v} type="button" className={`view-tab ${v === "활동" ? "is-on" : ""} ${cc.cfg ? "is-disabled" : ""}`} disabled={cc.cfg} onClick={() => { if (!cc.cfg && onView) onView(v); }}>{v}</button>)}
            </div></div>
          ) : null}

          {dueSoon.length ? (
            <div className="act-due">
              <span className="act-due-h">다음 액션</span>
              {dueSoon.map(a => <button key={a.id} type="button" className={"act-due-item " + (a.nextDate === ACT_TODAY ? "is-today" : "")} onClick={() => openEdit(a)}><span className="is-mono">{a.nextDate.slice(5)}</span><b>{a.partner}</b>{a.next}</button>)}
            </div>
          ) : null}

          <div className="sp-bar act-sp">
            <div className="seg">{PERIODS.map(p => <button key={p} type="button" className={`seg-item ${period === p ? "is-on" : ""}`} onClick={() => pickPeriod(p)}>{p}</button>)}</div>
            <div className="sp-range">
              <input type="date" className="fld-input is-mono sp-date" value={draft.from} onChange={(e) => setDraft(r => ({ ...r, from: e.target.value }))} />
              <span className="sp-tilde">~</span>
              <input type="date" className="fld-input is-mono sp-date" value={draft.to} onChange={(e) => setDraft(r => ({ ...r, to: e.target.value }))} />
              <button type="button" className="btn-primary sp-apply" onClick={() => { setPeriod("기본"); setRange(draft); }}>조회 <kbd className="btn-kbd">F8</kbd></button>
            </div>
            <div className="sp-meta">{range.from || "—"} ~ {range.to || "—"} · <b>{filtered.length}</b>건</div>
          </div>

          <div className="period-bar">
            <button type="button" className="period-search" disabled={cc.cfg} onClick={() => { if (!cc.cfg) setSearchOpen(true); }}>{AI.search} 조건 검색</button>
            <SearchCondChips items={searchFields.map(f => ({ key: f.key, label: f.label, value: cond[f.key] }))} onClear={() => { setCond({}); setDcond({}); }} />
          </div>

          <div className="toolbar">
            <div className="list-search"><span className="ls-icon">{AI.search}</span><input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="거래처, 담당자, 제목, 다음 액션, 메모 검색" /></div>
            <div className="tb-meta">
              <span><b>{filtered.length}</b>개 표시</span>
              {checked.size > 0 ? <><span className="tb-sel">{checked.size}개 선택됨</span><button type="button" className="btn-ghost btn-danger btn-sm" onClick={handleBulkDelete}>{AI.trash} 선택 삭제</button></> : null}
            </div>
          </div>

          <div className={"act-split " + (sidePartner ? "has-side" : "")}>
          <div className="table-card" style={{ "--cols-template": "84px " + displayCols.map(c => (cc.cfg && c.hidden) ? "110px" : (tmpW[c.key] ? tmpW[c.key] + "px" : String(c.width).replace(/minmax\(\s*([\d.]+px)\s*,[^)]*\)/, "$1"))).join(" "), "--row-min": "max-content" }}>
            {cc.cfg ? <div className="cfg-hint">⚙ 설정 모드 — 열 제목을 누르면 추가·이름수정·숨김·삭제할 수 있어요. 드래그로 순서 변경, 오른쪽 경계 드래그로 너비 조절.<button type="button" className="cfg-reset" onClick={cc.resetCols}>↺ 기본값</button></div> : null}
            {cc.cfg && colPop ? (() => { const pc = cc.allCols.find(c => c.key === colPop.key); return <ColCfgPopover col={pc} x={colPop.x} y={colPop.y} onAddNew={() => setAddColOpen(true)} onRename={cc.renameCol} onToggle={cc.toggleCol} onRemove={cc.removeCol} onEdit={(def) => setEditCol(def)} onClose={() => setColPop(null)} />; })() : null}
            <div className="t-scroll">
              <div className="t-row t-head">
                <div className="tc-check"><button type="button" className={`cbx ${allChecked ? "is-on" : ""}`} aria-label="전체 선택" onClick={toggleAll}>{allChecked ? AI.check : null}</button></div>
                {displayCols.map(c => (
                  <div key={c.key} className={`tc tc-${c.key} ck-${c.kind} ${cc.cfg ? "th-drag is-cfg" : ""} ${cc.cfg && c.hidden ? "is-colhidden" : ""}`} draggable={cc.cfg}
                    onClick={cc.cfg ? (e) => openColPop(e, c) : undefined} onDragStart={() => { dragKey.current = c.key; }} onDragOver={(e) => { if (cc.cfg) e.preventDefault(); }}
                    onDrop={(e) => { if (!cc.cfg) return; e.preventDefault(); cc.moveCol(dragKey.current, c.key); dragKey.current = null; }}>{c.label}<span className="th-resize" onMouseDown={(e) => startResize(e, c)} onClick={(e) => e.stopPropagation()} draggable={false} /></div>
                ))}
              </div>
              {filtered.length === 0 ? <div className="t-empty">조건에 맞는 활동이 없습니다. <button type="button" className="btn-link" onClick={() => { setQuery(""); setCond({}); pickPeriod("최근 3개월"); }}>필터 초기화</button></div> : null}
              {filtered.map((a, idx) => {
                const on = checked.has(a.id);
                return (
                  <div key={a.id} role="button" tabIndex={0} className={`t-row ${on ? "is-checked" : ""} ${isRecent(a) ? "row-new" : ""}`} onClick={() => openEdit(a)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); openEdit(a); } }}>
                    <div className="tc-check" onClick={(e) => { e.stopPropagation(); toggle(a.id); }}><button type="button" className={`cbx ${on ? "is-on" : ""} ${isRecent(a) ? "cbx-new" : ""}`} aria-label="선택">{on ? AI.check : null}</button>{isRecent(a) ? <span className="new-flag" title="오늘 입력·수정한 건">최근작성</span> : null}</div>
                    {displayCols.map(c => <div key={c.key} className={`tc tc-${c.key} ck-${c.kind} ${cc.cfg && c.hidden ? "is-colhidden" : ""}`}>{cell(c, a, idx)}</div>)}
                  </div>
                );
              })}
            </div>
          </div>
          {sidePartner ? <ActivityTimeline partner={sidePartner} acts={acts} onOpen={openEdit} onClose={() => setSidePartner(null)} /> : null}
          </div>
        </div>
      </div>

      {listDonePrompt ? (() => { const av = cc.views.find(v => v.code === cc.activeView); return (
        <div className="modal-root" role="dialog" aria-modal="true" style={{ zIndex: 95 }}>
          <div className="modal-scrim" onClick={cancelListCfg} />
          <div className="modal modal-confirm confirm-modal">
            <div className="confirm-body"><h2 className="confirm-title">화면 설정 저장</h2><p className="confirm-msg">{av ? <>현재 적용된 양식: <b>{av.code} "{av.name}"</b><br/></> : <>현재 적용된 저장 양식이 없습니다.<br/></>}변경한 화면 설정을 어떻게 저장할까요?</p></div>
            <footer className="modal-foot"><div className="ff-left" /><div className="ff-right">
              <button type="button" className="btn-ghost" onClick={cancelListCfg}>취소</button>
              <button type="button" className="btn-ghost" onClick={() => { setListDonePrompt(false); cc.setCfg(false); if (av) cc.overwriteView(av.code); }}>현재 양식에 적용</button>
              <button type="button" className="btn-primary" onClick={() => { setListDonePrompt(false); cc.setCfg(false); setSaveOpen(true); }}>신규 저장</button>
            </div></footer>
          </div>
        </div>
      ); })() : null}
      <ConfirmModal open={listResetAsk} title="화면 초기화" message="목록 화면을 기본 구성으로 되돌릴까요? 추가한 열·순서·너비·이름 설정이 사라집니다." confirmLabel="초기화" danger onConfirm={() => { cc.resetCols(); setTmpW({}); setListResetAsk(false); showToast("기본 구성으로 되돌렸습니다."); }} onClose={() => setListResetAsk(false)} />
      <ColPickModal open={addColOpen} scope="활동" baseKeys={ACT_BASE_KEYS} srcGroups={ACT_SRC_GROUPS} activeSlots={[]} existing={(cc.allCols || []).map(c => ({ label: c.label }))} onApply={(cols) => cc.addCustomMany(cols)} onClose={() => setAddColOpen(false)} />
      <FlatAddColModal open={!!editCol} initial={editCol} baseColumns={ACT_COLUMNS} onAdd={(c) => { if (editCol._base) cc.renameCol(editCol.key, c.label); else cc.updateCustom(editCol.key, c); setEditCol(null); }} onClose={() => setEditCol(null)} />
      <SearchCondModal open={searchOpen} prefix="activity" sub="거래처·유형·결과·담당·제목으로 검색합니다."
        fields={searchFields.map(f => ({ key: f.key, label: f.label, node: (
          <label className="fld" key={f.key}><span className="fld-label">{f.label}</span>
            {f.key === "type" || f.key === "result" ? (
              <select className="fld-input" value={dcond[f.key] || ""} onChange={(e) => setDcond(c => ({ ...c, [f.key]: e.target.value }))}><option value="">전체</option>{(f.key === "type" ? ACT_TYPES : ACT_RESULTS).map(o => <option key={o}>{o}</option>)}</select>
            ) : <input type="text" className="fld-input" value={dcond[f.key] || ""} onChange={(e) => setDcond(c => ({ ...c, [f.key]: e.target.value }))} placeholder={f.label} />}
          </label>
        ) }))}
        onReset={() => { setDcond({}); setCond({}); setQuery(""); }} onSearch={() => { setCond(dcond); setSearchOpen(false); }} onClose={() => setSearchOpen(false)} />
      <SaveViewModal open={saveOpen} code={nextViewCode(cc.views)} onSave={(n) => { cc.saveView(n); setSaveOpen(false); }} onClose={() => setSaveOpen(false)} />
      <SaveViewModal open={!!renameCode} title="화면 이름 변경" saveLabel="변경" initialName={(cc.views.find(v => v.code === renameCode) || {}).name || ""} onSave={(n) => { cc.renameView(renameCode, n); setRenameCode(null); }} onClose={() => setRenameCode(null)} />
      <ConfirmModal open={!!owCode} title="화면 덮어쓰기" message={(() => { const v = cc.views.find(x => x.code === owCode); return v ? `${v.code} "${v.name}" 화면을 지금 화면 구성으로 덮어쓸까요?` : ""; })()} confirmLabel="덮어쓰기" onConfirm={() => { cc.overwriteView(owCode); setOwCode(null); }} onClose={() => setOwCode(null)} />
      <ConfirmModal open={!!delCode} title="화면 삭제" danger confirmLabel="삭제" message={(() => { const v = cc.views.find(x => x.code === delCode); return v ? `${v.code} "${v.name}" 화면을 삭제할까요?` : ""; })()} onConfirm={() => { cc.deleteView(delCode); setDelCode(null); }} onClose={() => setDelCode(null)} />
    </div>
  );
}

const ACT_CSS = `
.act-sp{ display:flex; align-items:center; gap:14px; flex-wrap:wrap; background:var(--card); border:1px solid var(--line); border-radius:14px; padding:10px 14px; }
.sp-range{ display:flex; align-items:center; gap:8px; } .sp-date{ width:150px; padding:7px 10px; } .sp-tilde{ color:var(--ink-3); } .sp-apply{ height:34px; padding:0 14px; }
.sp-meta{ margin-left:auto; font:500 12.5px "IBM Plex Sans KR",sans-serif; color:var(--ink-3); } .sp-meta b{ color:var(--ink); }
.seg{ display:inline-flex; gap:2px; background:var(--bg-2); border-radius:10px; padding:3px; }
.seg-item{ appearance:none; cursor:pointer; border:0; background:transparent; color:var(--ink-2); font:600 12.5px "IBM Plex Sans KR",sans-serif; padding:6px 12px; border-radius:8px; }
.seg-item.is-on{ background:var(--card); color:var(--ink); box-shadow:0 1px 2px rgba(31,26,20,.08); }
.act-due{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; padding:8px 12px; border:1px dashed var(--line); border-radius:12px; background:color-mix(in oklab, var(--accent-soft) 45%, transparent); }
.act-due-h{ font:700 12px "IBM Plex Sans KR",sans-serif; color:var(--accent-ink); margin-right:4px; }
.act-due-item{ display:inline-flex; align-items:center; gap:6px; border:1px solid var(--line); background:var(--card); border-radius:999px; padding:4px 10px 4px 8px; font:500 12px "IBM Plex Sans KR",sans-serif; color:var(--ink-2); cursor:pointer; white-space:nowrap; }
.act-due-item > *{ white-space:nowrap; }
.act-sp .seg-item{ white-space:nowrap; }
.act-due-item b{ color:var(--ink); font-weight:600; } .act-due-item .is-mono{ font-family:"JetBrains Mono",monospace; font-size:11px; color:var(--ink-3); }
.act-due-item.is-today{ border-color:var(--accent); } .act-due-item:hover{ background:var(--card-2); }
.act-chip{ display:inline-flex; align-items:center; padding:2px 8px; border-radius:999px; font:600 11.5px "IBM Plex Sans KR",sans-serif; background:var(--bg-2); color:var(--ink-2); white-space:nowrap; }
.act-chip.t-통화{ background:color-mix(in oklab, oklch(0.7 0.12 230) 20%, transparent); color:oklch(0.42 0.12 230); }
.act-chip.t-방문{ background:color-mix(in oklab, var(--good) 20%, transparent); color:oklch(0.4 0.12 150); }
.act-chip.t-미팅{ background:color-mix(in oklab, oklch(0.7 0.14 300) 20%, transparent); color:oklch(0.42 0.14 300); }
.act-chip.t-메모{ background:var(--bg-2); color:var(--ink-2); }
.act-chip.t-이메일{ background:color-mix(in oklab, var(--warn) 24%, transparent); color:oklch(0.45 0.12 75); }
.act-chip.r-완료{ background:color-mix(in oklab, var(--good) 18%, transparent); color:oklch(0.4 0.12 150); }
.act-chip.r-진행중{ background:color-mix(in oklab, var(--accent) 18%, transparent); color:var(--accent-ink); }
.act-chip.r-재연락{ background:color-mix(in oklab, var(--warn) 24%, transparent); color:oklch(0.45 0.12 75); }
.act-chip.r-보류{ background:var(--bg-2); color:var(--ink-3); }
.act-partner-link{ appearance:none; border:0; background:transparent; padding:0; font:600 13.5px "IBM Plex Sans KR",sans-serif; color:var(--ink); cursor:pointer; text-decoration:underline dotted transparent; text-underline-offset:3px; }
.act-partner-link:hover{ text-decoration-color:var(--accent); color:var(--accent-ink); }
.act-split{ display:grid; grid-template-columns:minmax(0,1fr); gap:14px; align-items:start; }
.act-split.has-side{ grid-template-columns:minmax(0,1fr) 340px; }
.act-split .table-card{ min-width:0; width:auto; max-width:100%; overflow:auto; }
.act-side{ position:sticky; top:84px; background:var(--card); border:1px solid var(--line); border-radius:14px; display:flex; flex-direction:column; max-height:calc(100vh - 120px); }
.act-side-h{ display:flex; align-items:flex-start; justify-content:space-between; gap:10px; padding:14px 14px 10px; border-bottom:1px solid var(--line-soft); }
.act-side-h b{ font:700 15px "IBM Plex Sans KR",sans-serif; color:var(--ink); display:block; } .act-side-sub{ font:400 12px "IBM Plex Sans KR",sans-serif; color:var(--ink-3); }
.act-tl{ overflow:auto; padding:10px 14px 14px; display:flex; flex-direction:column; gap:2px; }
.act-tl-item{ position:relative; display:flex; flex-direction:column; align-items:flex-start; gap:4px; text-align:left; padding:10px 10px 10px 26px; border:0; background:transparent; border-radius:10px; cursor:pointer; }
.act-tl-item:hover{ background:var(--card-2); }
.act-tl-item::before{ content:""; position:absolute; left:11px; top:0; bottom:0; width:2px; background:var(--line-soft); }
.act-dot{ position:absolute; left:7px; top:14px; width:10px; height:10px; border-radius:50%; background:var(--ink-3); border:2px solid var(--card); box-shadow:0 0 0 1px var(--line); }
.act-dot.t-통화{ background:oklch(0.6 0.12 230); } .act-dot.t-방문{ background:var(--good); } .act-dot.t-미팅{ background:oklch(0.6 0.14 300); } .act-dot.t-이메일{ background:var(--warn); }
.act-tl-date{ font:500 11px "JetBrains Mono",monospace; color:var(--ink-3); }
.act-tl-title{ display:flex; align-items:center; gap:6px; font:600 13px "IBM Plex Sans KR",sans-serif; color:var(--ink); }
.act-tl-next{ font:400 12px "IBM Plex Sans KR",sans-serif; color:var(--accent-ink); }
.act-modal{ display:flex; flex-direction:column; max-height:calc(100vh - 60px); }
.act-body{ overflow:auto; flex:1 1 auto; min-height:0; }
.act-grid{ display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:14px 16px; }
.act-span2{ grid-column:span 2; } .act-span3{ grid-column:1 / -1; }
.act-seg .seg-item{ flex:1; padding:6px 8px; }
.act-memo{ resize:vertical; min-height:88px; font-family:inherit; line-height:1.5; }
.modal-code{ margin-left:10px; font:500 12px "JetBrains Mono",monospace; color:var(--ink-3); }
.modal-head-drag{ cursor:move; user-select:none; }
.tc-val.is-muted{ color:var(--ink-3); }
@media (max-width: 900px){ .act-split.has-side{ grid-template-columns:minmax(0,1fr); } .act-side{ position:static; max-height:none; } .act-grid{ grid-template-columns:repeat(2,minmax(0,1fr)); } .act-span2{ grid-column:1 / -1; } }
`;
(function(){ const st = document.createElement("style"); st.id = "activity-css"; st.textContent = ACT_CSS + '.layout.is-embedded{display:block;min-height:0}.layout.is-embedded .main{margin:0;min-height:0}.view-row{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.view-tabs{display:inline-flex;gap:4px;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:4px;align-self:flex-start}.view-tab{appearance:none;cursor:pointer;border:0;background:transparent;font:600 14px "IBM Plex Sans KR",sans-serif;color:var(--ink-2);padding:9px 22px;border-radius:9px}.view-tab:hover{color:var(--ink)}.view-tab.is-on{background:var(--ink);color:var(--card)}.view-tab.is-disabled{opacity:.4;cursor:not-allowed}'; document.head.appendChild(st); })();

window.ActivityApp = App;
if (!window.__ACT_NO_MOUNT) ReactDOM.createRoot(document.getElementById("app")).render(<App />);
