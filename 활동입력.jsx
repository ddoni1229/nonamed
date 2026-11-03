/* 활동 등록/상세 — 매입 입력화면 패턴: 전체 화면 전환 + 화면설정(항목 이름·표시·순서) + 저장된 양식 + 우측 정보 패널.
   활동관리.jsx 보다 먼저 로드됨. 공통 모듈(colconfig.jsx)의 ViewPresetMenu/SaveViewModal/ConfirmModal/showToast/nextViewCode 사용. */
const AE_TYPES = ["통화", "방문", "미팅", "메모", "이메일"];
const AE_RESULTS = ["진행중", "완료", "재연락", "보류"];
const AE_MGRS = ["박지영", "최영민", "이수진", "강마포", "문호철"];
const AE_TODAY = new Date().toISOString().slice(0, 10);
const AE_I = {
  close: <svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  back: <svg viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  search: <svg viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.6"/><path d="M16 16l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  cog: <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  trash: <svg viewBox="0 0 24 24" fill="none"><path d="M5 7h14M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M6 7l1 12a1 1 0 001 1h8a1 1 0 001-1l1-12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};
const ACT_FIELD_DEFS = [
  { key: "date",    label: "일자",         locked: true },
  { key: "time",    label: "시간" },
  { key: "type",    label: "유형",         locked: true },
  { key: "partner", label: "거래처",       locked: true, wide: true },
  { key: "contact", label: "담당자(상대)" },
  { key: "mgr",     label: "담당" },
  { key: "title",   label: "제목",         locked: true, wide: true },
  { key: "result",  label: "결과" },
  { key: "nextDate",label: "다음 일자" },
  { key: "next",    label: "다음 액션",    wide: true },
  { key: "memo",    label: "메모",         wide: true },
];
const ACT_PANEL_DEFS = [
  { key: "p_contact", label: "담당자(상대)" },
  { key: "p_mgr",     label: "우리 담당" },
  { key: "p_last",    label: "최근 활동" },
  { key: "p_count",   label: "활동 횟수(3개월)" },
  { key: "p_open",    label: "미완료 액션" },
  { key: "p_types",   label: "유형 분포" },
];
const ACT_PANEL_DEFAULT = ["p_contact", "p_mgr", "p_last", "p_count", "p_open"];
/* 입력 추가키 — 매입/거래처 입력화면과 동일 슬롯 */
const ACT_EXTRA_SLOTS = [
  ...Array.from({ length: 10 }, (_, i) => i + 1).map(n => ({ key: "xt" + n, label: "문자형" + n, type: "text" })),
  ...[1, 2, 3, 4, 5].map(n => ({ key: "xn" + n, label: "숫자형" + n, type: "num" })),
  ...[1, 2, 3, 4, 5].map(n => ({ key: "xs" + n, label: "검색형" + n, type: "lookup" })),
];

function useActEntryCfg() {
  const K = "nonamed.activity.entry.v1.";
  const ls = (k, d) => { try { const v = JSON.parse(localStorage.getItem(K + k)); return v == null ? d : v; } catch (e) { return d; } };
  const [order, setOrder] = React.useState(() => ls("order", ACT_FIELD_DEFS.map(f => f.key)));
  const [hidden, setHidden] = React.useState(() => ls("hidden", []));
  const [labels, setLabels] = React.useState(() => ls("labels", {}));
  const [meta, setMeta] = React.useState(() => ls("meta", {}));
  const [panelKeys, setPanelKeys] = React.useState(() => ls("panel", ACT_PANEL_DEFAULT));
  const [views, setViews] = React.useState(() => ls("views", []));
  const [activeView, setActiveView] = React.useState(() => ls("activeView", null));
  const [cfg, setCfg] = React.useState(false);
  React.useEffect(() => { try { ["order", "hidden", "labels", "meta", "panel", "views", "activeView"].forEach((k, i) => localStorage.setItem(K + k, JSON.stringify([order, hidden, labels, meta, panelKeys, views, activeView][i]))); } catch (e) {} }, [order, hidden, labels, meta, panelKeys, views, activeView]);
  const slotDefs = ACT_EXTRA_SLOTS.filter(s => meta[s.key] && meta[s.key].on).map(s => ({ ...s, wide: false }));
  const allDefs = [...ACT_FIELD_DEFS, ...slotDefs];
  const fields = order.map(k => allDefs.find(f => f.key === k)).filter(Boolean).concat(allDefs.filter(f => !order.includes(f.key))).map(f => ({ ...f, label: labels[f.key] || f.label, hidden: hidden.includes(f.key), meta: meta[f.key] || {} }));
  const toggle = (k) => { const f = ACT_FIELD_DEFS.find(x => x.key === k); if (f && f.locked) return; setHidden(h => h.includes(k) ? h.filter(x => x !== k) : [...h, k]); };
  const move = (from, to) => { if (!from || !to || from === to) return; setOrder(o => { const a = fields.map(f => f.key); const i = a.indexOf(from), j = a.indexOf(to); a.splice(i, 1); a.splice(j, 0, from); return a; }); };
  const rename = (k, v) => setLabels(l => ({ ...l, [k]: v }));
  const setFieldMeta = (k, m) => setMeta(p => ({ ...p, [k]: { ...(p[k] || {}), ...m } }));
  const addSlots = (labelsArr) => setMeta(p => { const n = { ...p }; labelsArr.forEach(lb => { const s = ACT_EXTRA_SLOTS.find(x => x.label === lb); if (s) n[s.key] = { ...(n[s.key] || {}), on: true }; }); return n; });
  const removeSlot = (k) => { setMeta(p => ({ ...p, [k]: { ...(p[k] || {}), on: false } })); setHidden(h => h.filter(x => x !== k)); };
  const snapshot = () => ({ order: [...order], hidden: [...hidden], labels: { ...labels }, meta: JSON.parse(JSON.stringify(meta)), panelKeys: [...panelKeys] });
  const restore = (s) => { if (!s) return; setOrder(s.order); setHidden(s.hidden); setLabels(s.labels || {}); setMeta(s.meta || {}); setPanelKeys(s.panelKeys || ACT_PANEL_DEFAULT); };
  const reset = () => { setOrder(ACT_FIELD_DEFS.map(f => f.key)); setHidden([]); setLabels({}); setMeta({}); setPanelKeys(ACT_PANEL_DEFAULT); setActiveView(null); };
  const applyView = (code) => { const v = views.find(x => x.code === code); if (!v) return; restore(v.config); setActiveView(code); showToast(code + " \"" + v.name + "\" 양식을 적용했어요", "info"); };
  const saveView = (name) => { const code = nextViewCode(views); setViews(vs => [...vs, { code, name, config: snapshot() }]); setActiveView(code); showToast(code + " \"" + name + "\" 양식을 저장했어요"); };
  const overwriteView = (code) => { setViews(vs => vs.map(v => v.code === code ? { ...v, config: snapshot() } : v)); setActiveView(code); showToast("현재 양식에 적용했어요"); };
  const renameView = (code, name) => setViews(vs => vs.map(v => v.code === code ? { ...v, name } : v));
  const deleteView = (code) => { setViews(vs => vs.filter(v => v.code !== code)); setActiveView(a => a === code ? null : a); };
  return { fields, meta, setFieldMeta, addSlots, removeSlot, cfg, setCfg, toggle, move, rename, reset, snapshot, restore, panelKeys, setPanelKeys, views, activeView, applyView, saveView, overwriteView, renameView, deleteView };
}

function ActEntryScreen({ initial, partners, contacts, activities, onSave, onDelete, onClose }) {
  const isEdit = !!(initial && initial.id);
  const wf = useWinFrame("nonamed.activity.entry", 1100, true);
  const ec = useActEntryCfg();
  const blank = { date: AE_TODAY, time: "10:00", type: "통화", partner: "", contact: "", title: "", result: "진행중", next: "", nextDate: "", mgr: AE_MGRS[0], memo: "" };
  const [f, setF] = React.useState(() => { const d = {}; Object.keys(ec.meta || {}).forEach(k => { if (ec.meta[k].dflt) d[k] = ec.meta[k].dflt; }); return { ...blank, ...(initial ? {} : d), ...(initial || {}) }; });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const [fldCfgFor, setFldCfgFor] = React.useState(null);
  const [addSlotOpen, setAddSlotOpen] = React.useState(false);
  const [fldMenu, setFldMenu] = React.useState(null);
  React.useEffect(() => { if (!fldMenu) return; const fn = () => setFldMenu(null); window.addEventListener("mousedown", fn); return () => window.removeEventListener("mousedown", fn); }, [fldMenu]);
  const lk = useCcLookup({ fldMeta: ec.meta, setValue: (k, v) => set(k, v), setToast: (m) => showToast(m), builtin: { "거래처": partners.map(p => p), "활동유형": AE_TYPES, "담당자": AE_MGRS } });
  const applyRule = (k, xtype, v) => { const m = ec.meta[k] || {}; const fmt = m.fmt || (xtype === "num" ? "num" : "free"); let out = v; if (fmt === "num") out = out.replace(/[^\d.-]/g, ""); else if (fmt === "alnum") out = out.replace(/[^A-Za-z0-9\-]/g, ""); else if (fmt === "ko") out = out.replace(/[^\u3131-\u318E\uAC00-\uD7A3\s]/g, ""); if (m.maxLen) out = out.slice(0, m.maxLen); return out; };
  const [panelCfg, setPanelCfg] = React.useState(false);
  const [saveOpen, setSaveOpen] = React.useState(false);
  const [renameCode, setRenameCode] = React.useState(null);
  const [owCode, setOwCode] = React.useState(null);
  const [delCode, setDelCode] = React.useState(null);
  const [donePrompt, setDonePrompt] = React.useState(false);
  const [lookupOpen, setLookupOpen] = React.useState(false);
  const [newPartner, setNewPartner] = React.useState(null);
  const [confirm, setConfirm] = React.useState(null);
  const [err, setErr] = React.useState("");
  const dragKey = React.useRef(null);
  const cfgSnap = React.useRef(null);
  const dirty = React.useRef(false);
  const mark = (k, v) => { dirty.current = true; set(k, v); };
  const firstRef = React.useRef(null);
  React.useEffect(() => { setTimeout(() => firstRef.current && firstRef.current.focus(), 40); }, []);

  const pActs = (activities || []).filter(a => a.partner === f.partner);
  const since = new Date(AE_TODAY); since.setMonth(since.getMonth() - 3);
  const panelValue = (k) => {
    switch (k) {
      case "p_contact": return (contacts || {})[f.partner] || f.contact || "—";
      case "p_mgr": { const m = {}; pActs.forEach(a => { m[a.mgr] = (m[a.mgr] || 0) + 1; }); const top = Object.entries(m).sort((a, b) => b[1] - a[1])[0]; return top ? top[0] : f.mgr || "—"; }
      case "p_last": { const l = pActs.slice().sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))[0]; return l ? `${l.date} · ${l.type} · ${l.title}` : "—"; }
      case "p_count": return pActs.filter(a => new Date(a.date) >= since).length + "건";
      case "p_open": { const n = pActs.filter(a => a.next && a.result !== "완료").length; return n ? n + "건" : "없음"; }
      case "p_types": { const m = {}; pActs.forEach(a => { m[a.type] = (m[a.type] || 0) + 1; }); return Object.entries(m).map(([k2, v]) => k2 + " " + v).join(" · ") || "—"; }
      default: return "—";
    }
  };

  const submit = () => {
    if (!f.partner.trim()) { setErr("거래처를 입력해 주세요."); return; }
    if (!f.title.trim()) { setErr("제목을 입력해 주세요."); return; }
    const miss = ec.fields.find(fd => !fd.hidden && fd.meta.required && !String(f[fd.key] || "").trim());
    if (miss) { setErr(`${miss.label}은(는) 필수 항목입니다.`); return; }
    setErr("");
    onSave({ ...f, partner: f.partner.trim(), title: f.title.trim() }, isEdit);
  };
  const tryClose = () => { if (ec.cfg) { finishCfg(); return; } if (dirty.current) setConfirm({ title: "입력 취소", message: "입력 중인 내용이 있습니다. 저장하지 않고 닫을까요?", confirmLabel: "닫기", danger: true, onConfirm: onClose }); else onClose(); };
  const enterCfg = () => { cfgSnap.current = ec.snapshot(); ec.setCfg(true); };
  const finishCfg = () => { if (cfgSnap.current && JSON.stringify(ec.snapshot()) === JSON.stringify(cfgSnap.current)) { ec.setCfg(false); showToast("변경사항이 없어 설정을 종료했어요", "info"); } else setDonePrompt(true); };
  const cancelCfg = () => { setDonePrompt(false); ec.restore(cfgSnap.current); ec.setCfg(false); };

  React.useEffect(() => {
    const fn = (e) => {
      if (saveOpen || renameCode || owCode || delCode || confirm || lookupOpen || donePrompt) return;
      if (e.key === "F8") { e.preventDefault(); if (!ec.cfg) submit(); }
      else if (e.key === "F10") { e.preventDefault(); if (ec.cfg) finishCfg(); else enterCfg(); }
      else if (e.key === "F4") { e.preventDefault(); setLookupOpen(true); }
      else if (e.key === "Escape") { e.preventDefault(); tryClose(); }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  });

  const visible = ec.fields.filter(x => ec.cfg || !x.hidden);
  const openFldCfg = (fd) => { const sl = ACT_EXTRA_SLOTS.find(s => s.key === fd.key); const m = fd.meta; setFldCfgFor({ key: fd.key, label: fd.label, dflt: m.dflt || "", type: sl ? (sl.type === "num" ? "money" : sl.type === "lookup" ? "lookup" : "text") : "dflt", slot: sl ? sl.label : null, srcCat: m.srcCat, source: m.source, fmt: m.fmt, maxLen: m.maxLen, autoPat: m.autoPat, required: !!m.required || !!fd.locked }); };
  const fieldHead = (fd) => ec.cfg ? (
    <div className={`aef-head ${fd.hidden ? "is-off" : ""}`}>
      <span className="aef-grip" title="드래그하여 순서 변경">⣿</span>
      <input className="aef-rename" value={fd.label} onChange={(e) => ec.rename(fd.key, e.target.value)} onMouseDown={(e) => e.stopPropagation()} />
      <span className="fld-menu-wrap" onMouseDown={(e) => e.stopPropagation()}>
        <button type="button" className="aef-eye" title="항목 설정" onClick={() => setFldMenu(m => m && m.key === fd.key ? null : { key: fd.key })}>⋯</button>
        {fldMenu && fldMenu.key === fd.key ? (
          <div className="fld-menu" onClick={(e) => e.stopPropagation()}>
            <div className="fld-menu-h"><span className="fld-menu-dot" />{fd.label}</div>
            <button type="button" onClick={() => { setFldMenu(null); openFldCfg(fd); }}>설정 (기본값·필수·자유/자동부여)</button>
            <button type="button" onClick={() => { setFldMenu(null); setAddSlotOpen(true); }}>항목 추가</button>
            {fd.locked ? null : <button type="button" onClick={() => { setFldMenu(null); ec.toggle(fd.key); }}>{fd.hidden ? "표시" : "숨김"}</button>}
            {ACT_EXTRA_SLOTS.some(s => s.key === fd.key) ? <button type="button" className="is-danger" onClick={() => { setFldMenu(null); ec.removeSlot(fd.key); }}>삭제</button> : null}
          </div>
        ) : null}
      </span>
      {fd.locked ? <span className="aef-lock">필수</span> : <button type="button" className={`aef-eye ${fd.hidden ? "" : "is-on"}`} onMouseDown={(e) => e.stopPropagation()} onClick={() => ec.toggle(fd.key)}>{fd.hidden ? "숨김" : "표시"}</button>}
    </div>
  ) : <span className="fld-label">{fd.label}{fd.locked || fd.meta.required ? <span className="req"> *</span> : null}</span>;

  const control = (fd) => {
    const sl = ACT_EXTRA_SLOTS.find(s => s.key === fd.key);
    if (sl) {
      const k = fd.key;
      if (sl.type === "lookup") return <lk.LookupField k={k} label={fd.label} value={f[k] || ""} onChange={(v) => mark(k, v)} />;
      return <input className={`fld-input ${sl.type === "num" || fd.meta.fmt === "num" ? "is-mono" : ""}`} inputMode={sl.type === "num" ? "numeric" : undefined} maxLength={fd.meta.maxLen || undefined} value={f[k] || ""} onChange={(e) => mark(k, applyRule(k, sl.type, e.target.value))} />;
    }
    switch (fd.key) {
      case "date": return <input ref={firstRef} type="date" className="fld-input is-mono" value={f.date} max="9999-12-31" onChange={(e) => mark("date", e.target.value)} />;
      case "time": return <input type="time" className="fld-input is-mono" value={f.time} onChange={(e) => mark("time", e.target.value)} />;
      case "type": return <div className="seg aef-seg">{AE_TYPES.map(t => <button key={t} type="button" className={`seg-item ${f.type === t ? "is-on" : ""}`} onClick={() => mark("type", t)}>{t}</button>)}</div>;
      case "partner": return (
        <div className="srch-input aef-srch">
          <input type="text" className="fld-input" value={f.partner} placeholder="거래처명 · Enter 또는 F4 검색" onChange={(e) => mark("partner", e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (!partners.includes(f.partner.trim())) setLookupOpen(true); } }} onDoubleClick={() => setLookupOpen(true)} />
          <button type="button" className="srch-btn" tabIndex={-1} title="거래처 검색 (F4)" onClick={() => setLookupOpen(true)}>{AE_I.search}</button>
        </div>
      );
      case "contact": return <input className="fld-input" value={f.contact} placeholder="예: 김송파 구매팀장" onChange={(e) => mark("contact", e.target.value)} />;
      case "mgr": return <select className="fld-input" value={f.mgr} onChange={(e) => mark("mgr", e.target.value)}>{AE_MGRS.map(m => <option key={m}>{m}</option>)}</select>;
      case "title": return <input className="fld-input" value={f.title} placeholder="예: 5월 납품 단가 협의" onChange={(e) => mark("title", e.target.value)} />;
      case "result": return <div className="seg aef-seg">{AE_RESULTS.map(t => <button key={t} type="button" className={`seg-item ${f.result === t ? "is-on" : ""}`} onClick={() => mark("result", t)}>{t}</button>)}</div>;
      case "nextDate": return <input type="date" className="fld-input is-mono" value={f.nextDate} max="9999-12-31" onChange={(e) => mark("nextDate", e.target.value)} />;
      case "next": return <input className="fld-input" value={f.next} placeholder="예: 견적서 발송" onChange={(e) => mark("next", e.target.value)} />;
      case "memo": return <textarea className="fld-input aef-memo" rows={5} value={f.memo} placeholder="통화·미팅 내용, 요청 사항, 합의 내용" onChange={(e) => mark("memo", e.target.value)} />;
      default: return null;
    }
  };
  const av = ec.views.find(v => v.code === ec.activeView);

  return (
    <div className="modal-root aef-root" role="dialog" aria-modal="true">
      <div className="modal-scrim" onClick={tryClose} />
      <div className={`modal aef-modal content aef ${ec.cfg ? "is-cfg-mode" : ""}`} style={wf.winStyle}>
      <wf.WinResize />
      <header className="modal-head modal-head-drag" onMouseDown={wf.onWinDragDown}>
        <div>
          <h2 className="modal-title">{isEdit ? "활동 수정" : "활동 입력"}</h2>
          {isEdit ? <div className="modal-sub keep"><b>{initial.id}</b> · {initial.date} {initial.time}</div> : null}
        </div>
        <div className="modal-head-actions">
          <wf.WinTools />
          <ViewPresetMenu views={ec.views} activeCode={ec.activeView} enabled={ec.cfg} onApply={ec.applyView} onSaveNew={() => setSaveOpen(true)} onOverwrite={(c) => setOwCode(c)} onRename={(c) => setRenameCode(c)} onDelete={(c) => setDelCode(c)} />
          <button type="button" className={`btn-ghost ${ec.cfg ? "is-on-cfg" : ""}`} onClick={() => { if (ec.cfg) finishCfg(); else enterCfg(); }}>{AE_I.cog} {ec.cfg ? "설정 완료" : "화면 설정"}</button>
          <button type="button" className="modal-close" onClick={tryClose}>{AE_I.close}</button>
        </div>
      </header>

      <div className="aef-grid">
        <main className="aef-main">
          {ec.cfg ? <div className="cfg-hint">⚙ 설정 모드 — 항목 이름을 고치거나 표시/숨김을 바꾸고, 드래그해서 순서를 조정하세요. ⋯ 에서 기본값·자유/자동부여 설정. <button type="button" className="btn-ghost btn-sm" onClick={() => setAddSlotOpen(true)}>+ 항목 추가</button> <button type="button" className="cfg-reset" onClick={ec.reset}>↺ 기본값</button></div> : null}
          <section className="table-card aef-card">
            <div className={`aef-fields ${ec.cfg ? "is-cfg" : ""}`}>
              {visible.map(fd => (
                <div key={fd.key} className={`fld ${fd.wide ? "aef-wide" : ""} ${fd.hidden ? "is-off" : ""}`} draggable={ec.cfg}
                  onDragStart={() => { dragKey.current = fd.key; }} onDragOver={(e) => { if (ec.cfg) e.preventDefault(); }}
                  onDrop={(e) => { if (!ec.cfg) return; e.preventDefault(); ec.move(dragKey.current, fd.key); dragKey.current = null; }}>
                  {fieldHead(fd)}
                  {control(fd)}
                </div>
              ))}
            </div>
            {err ? <div className="fset-err" style={{ margin: "0 18px 16px" }}>{err}</div> : null}
          </section>
          {isEdit && pActs.length > 1 ? (
            <section className="table-card aef-card aef-hist">
              <div className="aef-card-h"><b>이 거래처의 다른 활동</b><span>{pActs.length - 1}건</span></div>
              {pActs.filter(a => a.id !== initial.id).slice().sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time)).slice(0, 6).map(a => (
                <div key={a.id} className="aef-hist-row"><span className="is-mono">{a.date} {a.time}</span><span className={"act-chip t-" + a.type}>{a.type}</span><span className="aef-hist-t">{a.title}</span><span className={"act-chip r-" + a.result}>{a.result}</span></div>
              ))}
            </section>
          ) : null}
        </main>
      </div>
      <footer className="modal-foot">
        <div className="ff-left" />
        <div className="ff-right">
          <button type="button" className="btn-ghost" onClick={tryClose}>취소</button>
          <button type="button" className="btn-primary" disabled={ec.cfg} onClick={submit}>{isEdit ? "수정저장" : "저장"} <kbd className="btn-kbd">F8</kbd></button>
          {isEdit ? <button type="button" className="btn-ghost btn-danger" disabled={ec.cfg} onClick={() => setConfirm({ title: "활동 삭제", message: `${initial.id} 「${initial.title}」 활동을 삭제할까요?`, confirmLabel: "삭제", danger: true, onConfirm: () => onDelete(initial) })}>삭제</button> : null}
        </div>
      </footer>
      </div>

      <lk.UI />
      {fldCfgFor ? <AddColModal onManageList={(cat) => lk.setLookupFor({ key: null, label: cat, cat, q: "" })} onPickValue={(cat, cb) => lk.setLookupFor({ key: null, label: cat, cat, q: "", onPick: cb })} initial={fldCfgFor} types={["dflt"]} noFmt={false} onAdd={(c) => { ec.setFieldMeta(fldCfgFor.key, { dflt: c.dflt || "", srcCat: c.srcCat, source: c.source, fmt: c.fmt, maxLen: c.maxLen, autoPat: c.autoPat, required: c.required }); if (c.label) ec.rename(fldCfgFor.key, c.label); setFldCfgFor(null); }} onClose={() => setFldCfgFor(null)} /> : null}
      <ColPickModal open={addSlotOpen} scope="활동" baseKeys={ACT_FIELD_DEFS.map(d => d.label)}
        activeSlots={ACT_EXTRA_SLOTS.map(s => ({ key: s.label, label: s.label, type: s.type === "num" ? "money" : s.type === "lookup" ? "lookup" : "text" }))}
        existing={ec.fields.filter(fd => !fd.hidden).map(fd => ({ label: (ACT_FIELD_DEFS.concat(ACT_EXTRA_SLOTS).find(d => d.key === fd.key) || fd).label }))}
        onApply={(cols) => { const lbs = cols.map(c => c.label); ec.addSlots(lbs); lbs.forEach(lb => { const b = ACT_FIELD_DEFS.find(d => d.label === lb); if (b && ec.fields.find(x => x.key === b.key && x.hidden)) ec.toggle(b.key); }); }} onClose={() => setAddSlotOpen(false)} />
      {lookupOpen ? <ActPartnerLookup partners={partners} contacts={contacts} q={f.partner} onPick={(p) => { mark("partner", p); if (!f.contact && contacts && contacts[p]) set("contact", contacts[p]); setLookupOpen(false); }} onNew={window.PartnerEntryModal ? (q) => { setLookupOpen(false); setNewPartner({ name: q || "" }); } : null} onClose={() => setLookupOpen(false)} /> : null}
      {newPartner ? <window.PartnerEntryModal initialName={newPartner.name} onSaved={(p) => { mark("partner", p.name); setNewPartner(null); }} onClose={() => setNewPartner(null)} /> : null}
      <SaveViewModal open={saveOpen} code={nextViewCode(ec.views)} title="양식 저장" fieldLabel="양식 이름" onSave={(n) => { ec.saveView(n); setSaveOpen(false); ec.setCfg(false); }} onClose={() => setSaveOpen(false)} />
      <SaveViewModal open={!!renameCode} title="양식 이름 변경" saveLabel="변경" initialName={(ec.views.find(v => v.code === renameCode) || {}).name || ""} onSave={(n) => { ec.renameView(renameCode, n); setRenameCode(null); }} onClose={() => setRenameCode(null)} />
      <ConfirmModal open={!!owCode} title="양식 덮어쓰기" message={(() => { const v = ec.views.find(x => x.code === owCode); return v ? `${v.code} "${v.name}" 양식을 지금 구성으로 덮어쓸까요?` : ""; })()} confirmLabel="덮어쓰기" onConfirm={() => { ec.overwriteView(owCode); setOwCode(null); }} onClose={() => setOwCode(null)} />
      <ConfirmModal open={!!delCode} title="양식 삭제" danger confirmLabel="삭제" message={(() => { const v = ec.views.find(x => x.code === delCode); return v ? `${v.code} "${v.name}" 양식을 삭제할까요?` : ""; })()} onConfirm={() => { ec.deleteView(delCode); setDelCode(null); }} onClose={() => setDelCode(null)} />
      <ConfirmModal open={donePrompt} title="화면 설정 저장" message={av ? `현재 적용된 양식: ${av.code} "${av.name}". 변경한 화면 설정을 어떻게 저장할까요?` : "현재 적용된 저장 양식이 없습니다. 변경한 화면 설정을 새 양식으로 저장할까요?"} extraLabel={av ? "현재 양식에 적용" : undefined} onExtra={() => { setDonePrompt(false); ec.setCfg(false); ec.overwriteView(av.code); }} confirmLabel="신규 저장" onConfirm={() => { setDonePrompt(false); setSaveOpen(true); }} onClose={cancelCfg} />
      {confirm ? <ConfirmModal open title={confirm.title} message={confirm.message} confirmLabel={confirm.confirmLabel} danger={confirm.danger} onConfirm={() => { const fn = confirm.onConfirm; setConfirm(null); fn(); }} onClose={() => setConfirm(null)} /> : null}
    </div>
  );
}

function ActPartnerLookup({ partners, contacts, q: q0, onPick, onNew, onClose }) {
  const [q, setQ] = React.useState(q0 || "");
  const [hi, setHi] = React.useState(0);
  const ref = React.useRef(null);
  const list = partners.filter(p => !q.trim() || p.includes(q.trim()) || ((contacts || {})[p] || "").includes(q.trim()));
  React.useEffect(() => { setTimeout(() => ref.current && ref.current.focus(), 30); }, []);
  React.useEffect(() => { setHi(0); }, [q]);
  React.useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") { e.stopImmediatePropagation(); e.preventDefault(); onClose(); } };
    window.addEventListener("keydown", fn, true);
    return () => window.removeEventListener("keydown", fn, true);
  }, [onClose]);
  return (
    <div className="pick-root" role="dialog" aria-modal="true">
      <div className="pick-scrim" onClick={onClose} />
      <div className="pick-box">
        <header className="pick-head"><h3>거래처 검색</h3><button type="button" className="modal-close" onClick={onClose}>✕</button></header>
        <div className="pick-search"><span className="pick-ico">{AE_I.search}</span>
          <input ref={ref} value={q} placeholder="거래처명 · 담당자 검색" onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); setHi(h => Math.min(h + 1, list.length - 1)); } else if (e.key === "ArrowUp") { e.preventDefault(); setHi(h => Math.max(h - 1, 0)); } else if (e.key === "Enter") { e.preventDefault(); if (list[hi]) onPick(list[hi]); else if (q.trim()) onPick(q.trim()); } }} />
        </div>
        <div className="pick-table">
          <div className="pick-trow pick-thead" style={{ gridTemplateColumns: "minmax(140px,1fr) 160px" }}><div className="pk-cell">거래처명</div><div className="pk-cell">담당자</div></div>
          <div className="pick-tbody">
            {list.length === 0 ? <div className="pick-empty">「{q}」와 일치하는 거래처가 없습니다. Enter 를 누르면 입력한 이름으로 등록합니다.</div> : null}
            {list.map((p, i) => <button key={p} type="button" className={`pick-trow pick-opt ${i === hi ? "is-hi" : ""}`} style={{ gridTemplateColumns: "minmax(140px,1fr) 160px" }} onMouseEnter={() => setHi(i)} onClick={() => onPick(p)}><div className="pk-cell is-strong">{p}</div><div className="pk-cell">{(contacts || {})[p] || "—"}</div></button>)}
          </div>
        </div>
        <footer className="pick-foot"><span className="pick-foot-cnt">{list.length}건 · ↑↓ 이동 · Enter 선택</span>{onNew ? <button type="button" className="pick-new" onClick={() => onNew(q)}>+ 신규 <kbd className="btn-kbd">F2</kbd></button> : null}</footer>
      </div>
    </div>
  );
}

const AE_CSS = `
.aef-root{ z-index:60; }
.modal-root .modal.aef-modal{ width:min(960px,100%); max-height:calc(100vh - 48px); overflow-x:hidden; overflow-y:auto; padding:0; display:flex; flex-direction:column; gap:0; position:relative; }
.aef-modal .aef-grid{ padding:18px 26px 22px; }
.aef-modal .modal-head-actions{ display:flex; align-items:center; gap:8px; flex:none; }
.aef-modal .modal-foot{ margin-top:auto; }
.aef-modal .entry-resize{ right:0; }
.aef-modal .modal-head-drag{ cursor:move; }
.aef-modal .page-head{ align-items:center; }
.aef-modal .page-sub{ white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:520px; }
.aef .page-head-l{ align-items:center; }
.aef .page-head-l .iconbtn{ width:38px; height:38px; }
.aef-grid{ display:grid; grid-template-columns:minmax(0,1fr); gap:16px; align-items:start; }
.aef-main{ display:flex; flex-direction:column; gap:14px; min-width:0; }
.aef-card{ padding:0; overflow:visible; }
.aef-fields{ display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:14px 18px; padding:18px; }
.aef-wide{ grid-column:1 / -1; }
.aef-fields .fld{ position:relative; min-width:0; }
.aef-fields.is-cfg .fld{ cursor:grab; border:1px dashed color-mix(in oklab, var(--accent) 35%, var(--line)); border-radius:10px; padding:8px 10px; }
.aef-fields.is-cfg .fld.is-off{ opacity:.45; }
.aef-fields.is-cfg .fld:active{ cursor:grabbing; }
.aef-seg{ display:flex; }
.aef-seg .seg-item{ flex:1; padding:6px 6px; white-space:nowrap; }
.aef-memo{ resize:vertical; min-height:110px; font-family:inherit; line-height:1.5; }
.aef-srch{ display:flex; align-items:center; gap:6px; }
.aef-srch .fld-input{ flex:1; }
.aef-srch .srch-btn{ appearance:none; cursor:pointer; border:1px solid var(--line); background:var(--card); color:var(--ink-2); width:38px; height:38px; border-radius:10px; display:grid; place-items:center; flex:none; }
.aef-srch .srch-btn svg{ width:16px; height:16px; }
.aef-srch .srch-btn:hover{ background:var(--card-2); color:var(--ink); }
.aef-head{ display:flex; align-items:center; gap:6px; margin-bottom:6px; }
.aef-grip{ color:var(--ink-3); font-size:13px; }
.aef-rename{ flex:1; min-width:0; appearance:none; border:1px solid var(--line); background:#fff; border-radius:7px; padding:3px 8px; font:600 12.5px "IBM Plex Sans KR",sans-serif; color:var(--ink); }
.aef-rename:focus{ outline:none; border-color:var(--accent); }
.aef-lock{ font:600 10.5px "IBM Plex Sans KR",sans-serif; color:var(--accent-ink); background:var(--accent-soft); border-radius:999px; padding:2px 7px; }
.aef-eye{ appearance:none; cursor:pointer; border:1px solid var(--line); background:var(--card); color:var(--ink-3); font:600 11px "IBM Plex Sans KR",sans-serif; border-radius:999px; padding:2px 8px; }
.aef-eye.is-on{ background:var(--ink); color:var(--card); border-color:transparent; }
.aef-side{ width:auto; position:sticky; top:0; }
.aef-side .rs-col-body{ display:flex; flex-direction:column; padding:6px 0 10px; }
.aef-side .rs-info-row{ display:flex; justify-content:space-between; gap:10px; padding:8px 16px; border-bottom:1px solid var(--line-soft); font-size:13px; }
.aef-side .rs-info-k{ color:var(--ink-3); flex:none; }
.aef-side .rs-info-v{ color:var(--ink); text-align:right; min-width:0; overflow:hidden; text-overflow:ellipsis; }
.aef-open .rs-info-v{ text-align:left; flex:1; }
.aef-side .rs-sec-h{ font:600 10.5px "JetBrains Mono",monospace; letter-spacing:.08em; text-transform:uppercase; color:var(--ink-3); padding:12px 16px 4px; }
.aef-pcfg{ display:flex; flex-direction:column; gap:6px; padding:12px 14px; }
.aef-pchk{ appearance:none; cursor:pointer; display:flex; align-items:center; gap:10px; border:1px solid var(--line); background:var(--card); border-radius:9px; padding:8px 10px; font:500 13px "IBM Plex Sans KR",sans-serif; color:var(--ink-2); text-align:left; }
.aef-pchk .sc-chk{ width:18px; height:18px; border:1.5px solid var(--line); border-radius:5px; display:grid; place-items:center; font-size:11px; color:#fff; flex:none; }
.aef-pchk.is-on{ color:var(--ink); border-color:color-mix(in oklab, var(--accent) 40%, var(--line)); }
.aef-pchk.is-on .sc-chk{ background:var(--accent); border-color:var(--accent); }
.aef-card-h{ display:flex; justify-content:space-between; align-items:baseline; padding:14px 18px 8px; font-size:14px; }
.aef-card-h span{ font-size:12px; color:var(--ink-3); }
.aef-hist-row{ display:grid; grid-template-columns:150px auto minmax(0,1fr) auto; gap:10px; align-items:center; padding:8px 18px; border-top:1px solid var(--line-soft); font-size:13px; }
.aef-hist-row .is-mono{ font-family:"JetBrains Mono",monospace; font-size:12px; color:var(--ink-3); }
.aef-hist-t{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
@media (max-width: 1000px){ .aef-grid{ grid-template-columns:minmax(0,1fr); } .aef-side{ position:static; } .aef-fields{ grid-template-columns:repeat(2, minmax(0,1fr)); } }
`;
(function(){ const st = document.createElement("style"); st.id = "act-entry-css"; st.textContent = AE_CSS; document.head.appendChild(st); })();

Object.assign(window, { ActEntryScreen, ActPartnerLookup, ACT_FIELD_DEFS, ACT_PANEL_DEFS, AE_TYPES, AE_RESULTS, AE_MGRS });
