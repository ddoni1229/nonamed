/* 계정·회사(사업장) 공통 모듈 — 가입은 개인, 데이터는 회사 단위.
   companies: [{ id, name, ceo, biz, phone, owner, invite, members:[{ userId, name, role, joined }] }]
   session(nonamed.session.v1) 에 companyId·company·role 기록. 실제 서버 연동은 배포 단계(BaaS). */
const AC_COMP = "nonamed.companies.v1", AC_SESSION = "nonamed.session.v1", AC_USERS = "nonamed.users.v1";
const AC_ROLES = ["관리자", "일반", "조회전용"];
const AC_ROLE_DESC = { "관리자": "모든 메뉴·설정·구성원 관리", "일반": "입력·조회 (구성원 관리 제외)", "조회전용": "조회만 가능" };
const acRead = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
const acWrite = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
const acCompanies = () => acRead(AC_COMP, []);
const acSession = () => acRead(AC_SESSION, null);
const acDigits = (v) => String(v || "").replace(/\D/g, "");
function acCode() { const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let s = ""; for (let i = 0; i < 8; i++) s += A[Math.floor(Math.random() * A.length)]; return s.slice(0, 4) + "-" + s.slice(4); }
function acSetSession(patch) { const s = { ...(acSession() || {}), ...patch }; acWrite(AC_SESSION, s); window.dispatchEvent(new CustomEvent("nonamed:account")); return s; }
function acMyCompany() { const s = acSession(); return s && s.companyId ? acCompanies().find(c => c.id === s.companyId) || null : null; }
/* 요금·트라이얼 — 회사 생성 시 7일 무료, 만료 후 결제수단 등록 전까지 전체 잠금. 회사당 월 정액(구성원 무제한).
   실제 결제(PG 빌링키·정기결제)는 배포 단계에서 서버가 처리. 테스트: URL 에 ?expire=1 */
const AC_TRIAL_DAYS = 7;
const AC_PRICE = 29000; // 월 정액(VAT 별도) — 임시값
function acBilling(c) {
  if (!c) return { status: "none" };
  const created = new Date(c.created || Date.now()).getTime();
  const trialEnd = c.trialEnd ? new Date(c.trialEnd).getTime() : created + AC_TRIAL_DAYS * 864e5;
  if (c.billing && c.billing.status === "active") return { status: "active", trialEnd, ...c.billing };
  const force = /[?&]expire=1/.test(location.search);
  const left = Math.ceil((trialEnd - Date.now()) / 864e5);
  return (force || left <= 0) ? { status: "expired", trialEnd, left: 0 } : { status: "trial", trialEnd, left };
}
/* 메뉴별 권한 — 회사마다 역할(일반/조회전용)×메뉴 수준을 저장. 관리자는 항상 "입력" */
const AC_MENUS = [["home", "대시보드"], ["partners", "거래처"], ["items", "품목·재고"], ["purchase", "매입"], ["sales", "매출"], ["collect", "입출금"], ["tax", "세금"]];
const AC_LEVELS = ["입력", "조회", "숨김"];
const AC_LEVEL_DESC = { "입력": "신규·수정·삭제 가능", "조회": "보기만 가능 (신규·저장·삭제 버튼 숨김)", "숨김": "메뉴가 보이지 않고 접근 불가" };
const AC_DEFAULT_PERMS = {
  "일반":   { home: "조회", partners: "입력", items: "입력", purchase: "입력", sales: "입력", collect: "조회", tax: "조회" },
  "조회전용": { home: "조회", partners: "조회", items: "조회", purchase: "조회", sales: "조회", collect: "숨김", tax: "숨김" },
};
function acPermsOf(c) { const p = (c && c.perms) || {}; return { "일반": { ...AC_DEFAULT_PERMS["일반"], ...(p["일반"] || {}) }, "조회전용": { ...AC_DEFAULT_PERMS["조회전용"], ...(p["조회전용"] || {}) } }; }
function acLevel(menu) { const s = acSession(); if (!s || !s.role || s.role === "관리자") return "입력"; const c = acMyCompany(); if (!c) return "입력"; return (acPermsOf(c)[s.role] || {})[menu] || "입력"; }
function acSaveCompany(c) { const list = acCompanies(); acWrite(AC_COMP, list.some(x => x.id === c.id) ? list.map(x => x.id === c.id ? c : x) : [...list, c]); window.dispatchEvent(new CustomEvent("nonamed:account")); }
function acCreateCompany({ name, ceo, biz, phone }) {
  const s = acSession() || {};
  const c = { id: "C-" + Date.now().toString(36).toUpperCase(), name: name.trim(), ceo: (ceo || "").trim(), biz: biz || "", phone: phone || "", owner: s.id, invite: acCode(), created: new Date().toISOString(), trialEnd: new Date(Date.now() + AC_TRIAL_DAYS * 864e5).toISOString(),
    members: [{ userId: s.id, name: s.ceo || s.id, role: "관리자", joined: new Date().toISOString() }] };
  acSaveCompany(c);
  acSetSession({ companyId: c.id, company: c.name, role: "관리자", needsProfile: false });
  return c;
}
function acJoinCompany(code) {
  const s = acSession() || {};
  const norm = String(code || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const c = acCompanies().find(x => x.invite.replace("-", "") === norm);
  if (!c) return null;
  if (!c.members.some(m => m.userId === s.id)) c.members.push({ userId: s.id, name: s.ceo || s.id, role: "일반", joined: new Date().toISOString() });
  acSaveCompany(c);
  const role = c.members.find(m => m.userId === s.id).role;
  acSetSession({ companyId: c.id, company: c.name, role, needsProfile: false });
  return c;
}
/* 회사 미지정 세션 정리 — 상세 가입(회사정보 보유)·데모 계정은 자동으로 회사 생성, 그 외(소셜 등)는 선택 팝업 */
function acNeedsOnboard() {
  const s = acSession(); if (!s || !s.id) return false;
  if (s.companyId && acMyCompany()) {
    const c = acMyCompany(); const m = c.members.find(x => x.userId === s.id);
    if (!m) { acSetSession({ companyId: null, company: "", role: null }); return true; }
    if (m.role !== s.role || c.name !== s.company) acSetSession({ role: m.role, company: c.name });
    return false;
  }
  const u = acRead(AC_USERS, []).find(x => x.id === s.id);
  const mine = acCompanies().find(c => c.members.some(m => m.userId === s.id));
  if (mine) { acSetSession({ companyId: mine.id, company: mine.name, role: mine.members.find(m => m.userId === s.id).role }); return false; }
  if (s.id === "admin" || (u && u.company)) { acCreateCompany({ name: (u && u.company) || "nonamed", ceo: (u && u.ceo) || s.ceo || "관리자", biz: u && u.biz, phone: u && u.phone }); return false; }
  return true;
}

function AcModal({ title, sub, onClose, children, foot, width = 520, closable = true }) {
  React.useEffect(() => { if (!closable) return; const fn = (e) => { if (e.key === "Escape") { e.stopImmediatePropagation(); onClose(); } }; window.addEventListener("keydown", fn, true); return () => window.removeEventListener("keydown", fn, true); }, [onClose, closable]);
  return (
    <div className="ac-root" role="dialog" aria-modal="true">
      <div className="ac-scrim" onClick={closable ? onClose : undefined} />
      <div className="ac-modal" style={{ width: `min(${width}px, 100%)` }}>
        <header className="ac-head"><div><h2 className="ac-title">{title}</h2>{sub ? <div className="ac-sub">{sub}</div> : null}</div>
          {closable ? <button type="button" className="ac-x" onClick={onClose} aria-label="닫기"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg></button> : null}</header>
        <div className="ac-body">{children}</div>
        {foot ? <footer className="ac-foot">{foot}</footer> : null}
      </div>
    </div>
  );
}
const AcFld = ({ label, children, full }) => <label className={"ac-fld" + (full ? " is-full" : "")}><span>{label}</span>{children}</label>;
const acFmtBiz = (v) => { const d = acDigits(v).slice(0, 10); return d.length > 5 ? d.slice(0, 3) + "-" + d.slice(3, 5) + "-" + d.slice(5) : d.length > 3 ? d.slice(0, 3) + "-" + d.slice(3) : d; };
const acFmtPh = (v) => { const d = acDigits(v).slice(0, 11); return d.length > 7 ? d.slice(0, 3) + "-" + d.slice(3, 7) + "-" + d.slice(7) : d.length > 3 ? d.slice(0, 3) + "-" + d.slice(3) : d; };

/* 첫 로그인 — 새 회사 만들기 / 초대코드로 합류 */
function OnboardModal({ onDone }) {
  const s = acSession() || {};
  const [mode, setMode] = React.useState("new");
  const [f, setF] = React.useState({ name: "", ceo: s.ceo || "", biz: "", phone: "" });
  const [code, setCode] = React.useState("");
  const [err, setErr] = React.useState("");
  const set = (k, fmt) => (e) => setF(p => ({ ...p, [k]: fmt ? fmt(e.target.value) : e.target.value }));
  const submit = (e) => {
    e && e.preventDefault(); setErr("");
    if (mode === "new") {
      if (!f.name.trim()) return setErr("회사명(상호)을 입력해 주세요.");
      if (f.biz && acDigits(f.biz).length !== 10) return setErr("사업자등록번호 10자리를 확인해 주세요.");
      acCreateCompany(f); onDone();
    } else {
      if (acDigits(code.replace(/[A-Za-z]/g, "0")).length < 8) return setErr("초대코드 8자리를 입력해 주세요.");
      if (!acJoinCompany(code)) return setErr("일치하는 회사가 없습니다. 초대코드를 다시 확인해 주세요.");
      onDone();
    }
  };
  React.useEffect(() => { const fn = (e) => { if (e.key === "F8") { e.preventDefault(); submit(); } }; window.addEventListener("keydown", fn); return () => window.removeEventListener("keydown", fn); });
  return (
    <AcModal closable={false} title={`환영합니다${s.ceo ? ", " + s.ceo + "님" : ""}`} sub="장부는 회사(사업장) 단위로 관리됩니다. 시작 방법을 선택하세요."
      foot={<button type="button" className="ac-btn is-pri" onClick={submit}>{mode === "new" ? "회사 만들고 시작" : "합류하기"} <kbd>F8</kbd></button>}>
      <div className="ac-choice">
        <button type="button" className={"ac-opt" + (mode === "new" ? " is-on" : "")} onClick={() => { setMode("new"); setErr(""); }}>
          <b>새 회사 만들기</b><span>사장님·1인 사업자. 만든 사람이 관리자가 됩니다.</span>
        </button>
        <button type="button" className={"ac-opt" + (mode === "join" ? " is-on" : "")} onClick={() => { setMode("join"); setErr(""); }}>
          <b>초대코드로 합류</b><span>직원. 관리자에게 받은 코드로 같은 장부를 씁니다.</span>
        </button>
      </div>
      <form onSubmit={submit}>
        {mode === "new" ? (
          <div className="ac-grid">
            <AcFld label="회사명(상호) *" full><input className="ac-inp" autoFocus value={f.name} onChange={set("name")} /></AcFld>
            <AcFld label="대표자"><input className="ac-inp" value={f.ceo} onChange={set("ceo")} /></AcFld>
            <AcFld label="사업자등록번호"><input className="ac-inp is-mono" inputMode="numeric" value={f.biz} onChange={set("biz", acFmtBiz)} /></AcFld>
            <AcFld label="대표 전화" full><input className="ac-inp is-mono" inputMode="numeric" value={f.phone} onChange={set("phone", acFmtPh)} /></AcFld>
          </div>
        ) : (
          <div className="ac-grid">
            <AcFld label="초대코드" full><input className="ac-inp is-mono ac-code-inp" autoFocus value={code} onChange={(e) => { const r = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8); setCode(r.length > 4 ? r.slice(0, 4) + "-" + r.slice(4) : r); }} /></AcFld>
            <div className="ac-note is-full">합류하면 「일반」 권한으로 시작합니다. 권한은 관리자가 바꿀 수 있습니다.</div>
          </div>
        )}
        <button type="submit" hidden />
      </form>
      {err ? <div className="ac-err">{err}</div> : null}
    </AcModal>
  );
}

/* 회사 정보 · 구성원 관리 */
function CompanyModal({ initialTab = "members", onClose }) {
  const s = acSession() || {};
  const [c, setC] = React.useState(() => acMyCompany());
  const [tab, setTab] = React.useState(initialTab);
  const [f, setF] = React.useState(() => ({ name: c ? c.name : "", ceo: c ? c.ceo : "", biz: c ? c.biz : "", phone: c ? c.phone : "" }));
  const [msg, setMsg] = React.useState("");
  const isAdmin = s.role === "관리자";
  if (!c) return null;
  const save = (next) => { acSaveCompany(next); setC(next); if (next.name !== s.company) acSetSession({ company: next.name }); };
  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 2200); };
  const copy = () => { const t = `[nonamed] ${c.name} 장부 초대\n초대코드: ${c.invite}\n가입 후 첫 화면에서 「초대코드로 합류」를 선택하세요.`; try { navigator.clipboard.writeText(t); flash("초대 안내가 복사되었습니다."); } catch (e) { flash(c.invite); } };
  const reissue = async () => { if (window.nmConfirm && !(await window.nmConfirm({ title: "초대코드 재발급", message: "기존 초대코드는 더 이상 사용할 수 없습니다. 재발급할까요?", confirmLabel: "재발급" }))) return; save({ ...c, invite: acCode() }); flash("새 초대코드가 발급되었습니다."); };
  const setRole = (uid, role) => {
    if (c.members.filter(m => m.role === "관리자" && m.userId !== uid).length === 0 && role !== "관리자") return flash("관리자는 최소 1명 있어야 합니다.");
    save({ ...c, members: c.members.map(m => m.userId === uid ? { ...m, role } : m) });
    if (uid === s.id) acSetSession({ role });
  };
  const remove = async (m) => {
    if (window.nmConfirm && !(await window.nmConfirm({ title: "구성원 내보내기", message: `「${m.name}」님을 회사에서 내보낼까요? 더 이상 이 장부에 접근할 수 없습니다.`, confirmLabel: "내보내기", danger: true }))) return;
    save({ ...c, members: c.members.filter(x => x.userId !== m.userId) });
  };
  const saveInfo = (e) => { e && e.preventDefault(); if (!f.name.trim()) return flash("회사명을 입력해 주세요."); save({ ...c, ...f, name: f.name.trim() }); flash("회사 정보가 저장되었습니다."); };
  return (
    <AcModal width={640} title={c.name} sub={`${c.members.length}명 · 내 권한: ${s.role || "-"}`} onClose={onClose}
      foot={tab === "info" && isAdmin ? <><button type="button" className="ac-btn" onClick={onClose}>닫기</button><button type="button" className="ac-btn is-pri" onClick={saveInfo}>저장 <kbd>F8</kbd></button></> : <button type="button" className="ac-btn" onClick={onClose}>닫기</button>}>
      <div className="ac-tabs">{[["members", "구성원"], ["perms", "권한 설정"], ["info", "회사 정보"]].map(([k, l]) => <button key={k} type="button" className={"ac-tab" + (tab === k ? " is-on" : "")} onClick={() => setTab(k)}>{l}</button>)}</div>
      {tab === "perms" ? (() => { const P = acPermsOf(c); const setLv = (role, menu, lv) => { if (!isAdmin) return; save({ ...c, perms: { ...P, [role]: { ...P[role], [menu]: lv } } }); }; return (
        <>
          <div className="ac-perm">
            <div className="ac-perm-h"><span>메뉴</span><span>관리자</span><span>일반</span><span>조회전용</span></div>
            {AC_MENUS.map(([k, l]) => (
              <div key={k} className="ac-perm-r">
                <b>{l}</b>
                <span className="ac-lv is-fixed">입력</span>
                {["일반", "조회전용"].map(role => (
                  <div key={role} className="ac-seg">{AC_LEVELS.map(lv => <button key={lv} type="button" disabled={!isAdmin} className={"ac-seg-b lv-" + lv + (P[role][k] === lv ? " is-on" : "")} onClick={() => setLv(role, k, lv)} title={AC_LEVEL_DESC[lv]}>{lv}</button>)}</div>
                ))}
              </div>
            ))}
          </div>
          <div className="ac-roles">{AC_LEVELS.map(lv => <div key={lv}><span className={"ac-lv lv-" + lv}>{lv}</span>{AC_LEVEL_DESC[lv]}</div>)}</div>
          {isAdmin ? <div className="ac-row-r"><button type="button" className="ac-btn is-sm is-ghost" onClick={() => { save({ ...c, perms: null }); flash("기본 권한으로 되돌렸습니다."); }}>기본값으로</button></div> : <div className="ac-note">권한은 관리자만 바꿀 수 있습니다.</div>}
        </>
      ); })() : tab === "members" ? (
        <>
          {isAdmin ? (
            <div className="ac-invite">
              <div><div className="ac-invite-k">초대코드</div><div className="ac-invite-v is-mono">{c.invite}</div></div>
              <div className="ac-invite-a"><button type="button" className="ac-btn is-sm" onClick={copy}>안내문 복사</button><button type="button" className="ac-btn is-sm is-ghost" onClick={reissue}>재발급</button></div>
            </div>
          ) : null}
          <div className="ac-mem-list">
            {c.members.map(m => (
              <div key={m.userId} className="ac-mem">
                <span className="ac-av">{String(m.name).slice(0, 1)}</span>
                <div className="ac-mem-n"><b>{m.name}{m.userId === s.id ? <em> (나)</em> : null}{m.userId === c.owner ? <i>소유자</i> : null}</b><span className="is-mono">{m.userId} · {String(m.joined).slice(0, 10)} 합류</span></div>
                {isAdmin ? (
                  <select className="ac-sel" value={m.role} onChange={(e) => setRole(m.userId, e.target.value)} title={AC_ROLE_DESC[m.role]}>{AC_ROLES.map(r => <option key={r} value={r}>{r}</option>)}</select>
                ) : <span className={"ac-role r-" + m.role}>{m.role}</span>}
                {isAdmin && m.userId !== s.id && m.userId !== c.owner ? <button type="button" className="ac-btn is-sm is-ghost is-danger" onClick={() => remove(m)}>내보내기</button> : <span className="ac-mem-sp" />}
              </div>
            ))}
          </div>
          <div className="ac-roles">{AC_ROLES.map(r => <div key={r}><span className={"ac-role r-" + r}>{r}</span>{AC_ROLE_DESC[r]}</div>)}</div>
        </>
      ) : (
        <form className="ac-grid" onSubmit={saveInfo}>
          <AcFld label="회사명(상호) *" full><input className="ac-inp" disabled={!isAdmin} value={f.name} onChange={(e) => setF(p => ({ ...p, name: e.target.value }))} /></AcFld>
          <AcFld label="대표자"><input className="ac-inp" disabled={!isAdmin} value={f.ceo} onChange={(e) => setF(p => ({ ...p, ceo: e.target.value }))} /></AcFld>
          <AcFld label="사업자등록번호"><input className="ac-inp is-mono" disabled={!isAdmin} value={f.biz} onChange={(e) => setF(p => ({ ...p, biz: acFmtBiz(e.target.value) }))} /></AcFld>
          <AcFld label="대표 전화" full><input className="ac-inp is-mono" disabled={!isAdmin} value={f.phone} onChange={(e) => setF(p => ({ ...p, phone: acFmtPh(e.target.value) }))} /></AcFld>
          {!isAdmin ? <div className="ac-note is-full">회사 정보는 관리자만 수정할 수 있습니다.</div> : null}
          <button type="submit" hidden />
        </form>
      )}
      {msg ? <div className="ac-flash">{msg}</div> : null}
    </AcModal>
  );
}

/* 결제수단 등록 팝업 — locked=true 면 닫기 불가(트라이얼 만료) */
function PaymentModal({ locked, onClose, onDone }) {
  const s = acSession() || {}; const c = acMyCompany(); const b = acBilling(c);
  const isAdmin = s.role === "관리자";
  const [f, setF] = React.useState({ num: "", exp: "", owner: "", pw: "", type: "개인" });
  const [agree, setAgree] = React.useState(false);
  const [err, setErr] = React.useState(""); const [busy, setBusy] = React.useState(false);
  const fmtNum = (v) => acDigits(v).slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1-");
  const fmtExp = (v) => { const d = acDigits(v).slice(0, 4); return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d; };
  const logout = () => { try { localStorage.removeItem(AC_SESSION); sessionStorage.removeItem("nonamed.sessionAlive.v1"); } catch (e) {} location.href = "login.html"; };
  const submit = (e) => {
    e && e.preventDefault(); setErr("");
    const n = acDigits(f.num), x = acDigits(f.exp), o = acDigits(f.owner);
    if (n.length < 15) return setErr("카드번호를 확인해 주세요.");
    const mm = +x.slice(0, 2), yy = +x.slice(2);
    if (x.length !== 4 || mm < 1 || mm > 12) return setErr("유효기간(MM/YY)을 확인해 주세요.");
    const nowY = new Date().getFullYear() % 100, nowM = new Date().getMonth() + 1;
    if (yy < nowY || (yy === nowY && mm < nowM)) return setErr("유효기간이 지난 카드입니다.");
    if (f.type === "개인" ? o.length !== 6 : o.length !== 10) return setErr(f.type === "개인" ? "생년월일 6자리를 입력해 주세요." : "사업자등록번호 10자리를 입력해 주세요.");
    if (acDigits(f.pw).length !== 2) return setErr("카드 비밀번호 앞 2자리를 입력해 주세요.");
    if (!agree) return setErr("정기결제 이용에 동의해 주세요.");
    setBusy(true);
    setTimeout(() => {
      const next = new Date(Math.max(Date.now(), b.trialEnd || 0)); next.setMonth(next.getMonth() + 1);
      acSaveCompany({ ...c, billing: { status: "active", card: { last4: n.slice(-4), brand: n[0] === "4" ? "VISA" : n[0] === "5" ? "Master" : "국내카드", type: f.type }, registered: new Date().toISOString(), nextBill: next.toISOString(), price: AC_PRICE } });
      if (window.showToast) window.showToast("결제수단이 등록되었습니다.");
      onDone && onDone();
    }, 600);
  };
  React.useEffect(() => { const fn = (e) => { if (e.key === "F8" && isAdmin) { e.preventDefault(); e.stopImmediatePropagation(); submit(); } }; window.addEventListener("keydown", fn, true); return () => window.removeEventListener("keydown", fn, true); });
  const trialEndStr = b.trialEnd ? new Date(b.trialEnd).toISOString().slice(0, 10) : "";
  if (!isAdmin) return (
    <AcModal closable={!locked} onClose={onClose} title="무료 체험이 끝났습니다" sub={`${c ? c.name : ""} · ${trialEndStr} 만료`}
      foot={<button type="button" className="ac-btn" onClick={logout}>로그아웃</button>}>
      <div style={{ fontSize: 13.5, color: "var(--ink-2,#5A5247)", lineHeight: 1.6 }}>계속 사용하려면 회사 관리자가 결제수단을 등록해야 합니다. 관리자에게 요청해 주세요. 입력한 데이터는 그대로 보관됩니다.</div>
    </AcModal>
  );
  return (
    <AcModal width={500} closable={!locked} onClose={onClose}
      title={locked ? "무료 체험이 끝났습니다" : "결제수단 등록"}
      sub={locked ? "결제수단을 등록하면 바로 이어서 쓸 수 있습니다. 입력한 데이터는 그대로 보관됩니다." : (b.status === "trial" ? `무료 체험 ${b.left}일 남음 · 지금 등록해도 체험이 끝난 뒤(${trialEndStr})부터 결제됩니다.` : "결제할 카드를 변경합니다.")}
      foot={<>{locked ? <button type="button" className="ac-btn is-ghost" onClick={logout}>로그아웃</button> : <button type="button" className="ac-btn" onClick={onClose}>취소</button>}<button type="button" className="ac-btn is-pri" onClick={submit} disabled={busy}>{busy ? "확인 중…" : "등록하고 계속"} <kbd>F8</kbd></button></>}>
      <div className="ac-plan"><div><b>nonamed 월 정액</b><span>구성원 무제한 · 전 메뉴</span></div><div className="ac-plan-p"><b className="is-mono">{AC_PRICE.toLocaleString("ko-KR")}원</b><span>/월 · VAT 별도</span></div></div>
      <form className="ac-grid" onSubmit={submit}>
        <AcFld label="카드번호" full><input className="ac-inp is-mono" inputMode="numeric" autoFocus autoComplete="cc-number" value={f.num} onChange={(e) => setF(p => ({ ...p, num: fmtNum(e.target.value) }))} /></AcFld>
        <AcFld label="유효기간 (MM/YY)"><input className="ac-inp is-mono" inputMode="numeric" autoComplete="cc-exp" value={f.exp} onChange={(e) => setF(p => ({ ...p, exp: fmtExp(e.target.value) }))} /></AcFld>
        <AcFld label="비밀번호 앞 2자리"><input className="ac-inp is-mono" type="password" inputMode="numeric" maxLength={2} value={f.pw} onChange={(e) => setF(p => ({ ...p, pw: acDigits(e.target.value).slice(0, 2) }))} /></AcFld>
        <div className="ac-fld is-full"><span>카드 구분</span><div className="ac-seg" style={{ alignSelf: "flex-start" }}>{["개인", "법인"].map(t => <button key={t} type="button" className={"ac-seg-b lv-입력" + (f.type === t ? " is-on" : "")} style={{ padding: "6px 18px" }} onClick={() => setF(p => ({ ...p, type: t, owner: "" }))}>{t}</button>)}</div></div>
        <AcFld label={f.type === "개인" ? "생년월일 6자리 (YYMMDD)" : "사업자등록번호"} full><input className="ac-inp is-mono" inputMode="numeric" value={f.owner} onChange={(e) => setF(p => ({ ...p, owner: p.type === "개인" ? acDigits(e.target.value).slice(0, 6) : acFmtBiz(e.target.value) }))} /></AcFld>
        <button type="button" className={"ac-agree is-full" + (agree ? " is-on" : "")} onClick={() => setAgree(a => !a)} aria-pressed={agree}><span className="ac-agree-box">{agree ? "✓" : ""}</span>매월 자동결제(정기결제)에 동의합니다. 언제든 해지할 수 있습니다.</button>
        <button type="submit" hidden />
      </form>
      {err ? <div className="ac-err">{err}</div> : null}
    </AcModal>
  );
}

/* 상단 사용자 버튼 + 메뉴 (전 화면 공통). 회사 미지정이면 OnboardModal 을 띄운다 */
function AccountMenu({ className = "user-pill", chevron }) {
  const [, bump] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [modal, setModal] = React.useState(null);
  const [onboard, setOnboard] = React.useState(() => acNeedsOnboard());
  React.useEffect(() => { const fn = () => bump(n => n + 1); window.addEventListener("nonamed:account", fn); window.addEventListener("storage", fn); return () => { window.removeEventListener("nonamed:account", fn); window.removeEventListener("storage", fn); }; }, []);
  React.useEffect(() => { if (!open) return; const fn = (e) => { if (!e.target.closest(".ac-menu-wrap")) setOpen(false); }; document.addEventListener("mousedown", fn); return () => document.removeEventListener("mousedown", fn); }, [open]);
  const s = acSession();
  const bill = acBilling(acMyCompany());
  const [payOpen, setPayOpen] = React.useState(false);
  const locked = !onboard && bill.status === "expired";
  const co = (s && s.company) || "회사 미지정"; const nm = (s && (s.ceo || s.id)) || "사용자";
  const logout = () => { try { localStorage.removeItem(AC_SESSION); sessionStorage.removeItem("nonamed.sessionAlive.v1"); } catch (e) {} window.location.href = "login.html"; };
  return (
    <span className="ac-menu-wrap">
      <button className={className} type="button" onClick={() => setOpen(o => !o)} title={s ? `${co} · ${s.id}` : "로그인 정보 없음"}>
        <span className="user-av">{String(nm).slice(0, 1)}</span>
        <span className="user-name"><span className="ac-co">{co}</span>{nm}{s && s.role && s.role !== "관리자" ? <span className="ac-co is-role">{s.role}</span> : null}</span>
        {chevron || <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </button>
      {open ? (
        <div className="ac-menu">
          <div className="ac-menu-h"><b>{nm}</b><span className="is-mono">{s ? s.id : ""}</span><span>{co} · {(s && s.role) || "-"}</span>{bill.status === "trial" ? <span className="ac-trial">무료 체험 {bill.left}일 남음</span> : bill.status === "active" && bill.card ? <span className="ac-trial is-ok">{bill.card.brand} •••• {bill.card.last4} · 다음 결제 {String(bill.nextBill).slice(0, 10)}</span> : null}</div>
          {s && s.role === "관리자" ? <button type="button" onClick={() => { setOpen(false); setPayOpen(true); }}>{bill.status === "active" ? "결제수단 변경" : "결제수단 등록"}</button> : null}
          <button type="button" onClick={() => { setOpen(false); setModal("members"); }}>구성원 관리</button>
          <button type="button" onClick={() => { setOpen(false); setModal("perms"); }}>권한 설정</button>
          <button type="button" onClick={() => { setOpen(false); setModal("info"); }}>회사 정보</button>
          <div className="ac-menu-sep" />
          <button type="button" className="is-danger" onClick={logout}>로그아웃</button>
        </div>
      ) : null}
      {modal ? <CompanyModal initialTab={modal} onClose={() => setModal(null)} /> : null}
      {onboard ? <OnboardModal onDone={() => { setOnboard(false); bump(n => n + 1); }} /> : null}
      {locked || payOpen ? <PaymentModal locked={locked} onClose={() => setPayOpen(false)} onDone={() => { setPayOpen(false); if (/[?&]expire=1/.test(location.search)) history.replaceState(null, "", location.pathname); bump(n => n + 1); }} /> : null}
    </span>
  );
}

/* 현재 화면에 권한 적용 — 숨김: 대시보드로, 조회: body[data-perm=view] (입력 버튼 숨김 + F2/F8/Delete 차단) */
const AC_PAGE_MENU = { "dashboard.html": "home", "거래처등록.html": "partners", "활동관리.html": "partners", "품목리스트.html": "items", "매입관리.html": "purchase", "매출관리.html": "sales", "입출금관리.html": "collect", "세금관리.html": "tax" };
function acPageMenu() { const f = decodeURIComponent((location.pathname.split("/").pop() || "")); return AC_PAGE_MENU[f] || null; }
/* 조회 모드: 저장·신규·삭제 버튼만 표식(data-perm-edit) — 검색·설정 완료·확인 등은 그대로 */
const AC_EDIT_RE = /^\s*(\+\s*)?(신규|저장|수정저장|수정 저장|삭제|선택 삭제|일괄 삭제|가격 일괄수정|복사)(\s|$|F\d)/;
function acMarkEdit(root) { (root || document).querySelectorAll("button:not([data-perm-edit])").forEach(b => { if (b.closest(".ac-root, .ac-menu")) return; if (AC_EDIT_RE.test(b.textContent || "")) b.setAttribute("data-perm-edit", ""); }); }
let acObs = null;
function acApplyPerm() {
  const m = acPageMenu(); if (!m) return;
  const lv = acLevel(m);
  if (lv === "숨김" && m !== "home") { location.replace("dashboard.html"); return; }
  document.body.dataset.perm = lv === "조회" ? "view" : "edit";
  if (lv === "조회") { acMarkEdit(); if (!acObs) { acObs = new MutationObserver(() => acMarkEdit()); acObs.observe(document.body, { childList: true, subtree: true }); } }
  else if (acObs) { acObs.disconnect(); acObs = null; document.querySelectorAll("[data-perm-edit]").forEach(b => b.removeAttribute("data-perm-edit")); }
}
window.addEventListener("keydown", (e) => {
  if (document.body.dataset.perm !== "view") return;
  const inField = /INPUT|TEXTAREA|SELECT/.test(document.activeElement && document.activeElement.tagName);
  // F8 은 저장 버튼이 떠 있을 때만 차단 (조건검색 F8 은 허용)
  const saveOpen = e.key === "F8" && [...document.querySelectorAll("[data-perm-edit]")].some(b => /저장/.test(b.textContent)) && !document.querySelector(".scm, .search-cond-modal, [data-search-modal]");
  if (e.key === "F2" || e.key === "F9" || saveOpen || (e.key === "Delete" && !inField)) { e.preventDefault(); e.stopImmediatePropagation(); if (window.showToast) window.showToast("조회 권한입니다. 입력·수정은 관리자에게 요청하세요."); }
}, true);
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", acApplyPerm); else acApplyPerm();
window.addEventListener("nonamed:account", acApplyPerm);

Object.assign(window, { AccountMenu, OnboardModal, CompanyModal, PaymentModal, acBilling, acSession, acMyCompany, acCompanies, acLevel, AC_ROLES, AC_MENUS });

(function () {
  if (document.getElementById("account-css")) return;
  const s = document.createElement("style"); s.id = "account-css";
  s.textContent = `
.ac-trial{ margin-top:6px; align-self:flex-start; padding:2px 8px; border-radius:999px; background:color-mix(in oklab, var(--accent,#D97757) 16%, #fff); color:var(--ink,#1F1A14); font-weight:600; font-size:11px; }
.ac-trial.is-ok{ background:var(--card-2,#F3EEE3); color:var(--ink-2,#5A5247); font-family:"JetBrains Mono",monospace; font-weight:500; }
.ac-plan{ display:flex; align-items:center; justify-content:space-between; gap:14px; padding:14px 16px; border-radius:14px; background:var(--ink,#1F1A14); color:var(--card,#FBF8F2); }
.ac-plan > div{ display:flex; flex-direction:column; gap:2px; }
.ac-plan b{ font-size:14px; } .ac-plan span{ font-size:11.5px; opacity:.7; }
.ac-plan-p{ align-items:flex-end; } .ac-plan-p b{ font-size:22px; letter-spacing:-.01em; }
.ac-agree{ appearance:none; border:0; background:transparent; padding:2px 0; display:flex; align-items:center; gap:9px; text-align:left; cursor:pointer; font:500 12.5px "IBM Plex Sans KR",sans-serif; color:var(--ink-2,#5A5247); }
.ac-agree-box{ width:18px; height:18px; flex:none; border-radius:5px; border:1.5px solid rgba(31,26,20,.3); display:grid; place-items:center; font-size:11px; color:#fff; }
.ac-agree.is-on .ac-agree-box{ background:var(--ink,#1F1A14); border-color:var(--ink,#1F1A14); }
.ac-menu-wrap{ position:relative; display:inline-flex; }
.ac-co{ display:inline-block; margin-right:6px; padding:1px 7px; border-radius:6px; background:var(--card-2,#F3EEE3); color:var(--ink-2,#5A5247); font-size:11px; font-weight:600; max-width:140px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; vertical-align:middle; }
.ac-co.is-role{ margin:0 0 0 6px; background:transparent; border:1px solid var(--line,rgba(31,26,20,.14)); }
.ac-menu{ position:absolute; right:0; top:calc(100% + 6px); z-index:80; min-width:230px; background:var(--card,#FBF8F2); border:1px solid var(--line,rgba(31,26,20,.12)); border-radius:14px; box-shadow:0 18px 40px -12px rgba(31,26,20,.3); padding:6px; display:flex; flex-direction:column; }
.ac-menu-h{ display:flex; flex-direction:column; gap:2px; padding:10px 12px 10px; border-bottom:1px solid var(--line,rgba(31,26,20,.1)); margin-bottom:4px; font-size:11.5px; color:var(--ink-3,#8B8273); }
.ac-menu-h b{ font-size:14px; color:var(--ink,#1F1A14); }
.ac-menu > button{ appearance:none; border:0; background:transparent; text-align:left; padding:9px 12px; border-radius:9px; font:500 13px "IBM Plex Sans KR",sans-serif; color:var(--ink,#1F1A14); cursor:pointer; }
.ac-menu > button:hover{ background:var(--card-2,#F3EEE3); }
.ac-menu > button.is-danger{ color:#B5462F; }
.ac-menu-sep{ height:1px; background:var(--line,rgba(31,26,20,.1)); margin:4px 6px; }
.ac-root{ position:fixed; inset:0; z-index:130; display:grid; place-items:center; padding:20px; font-family:"IBM Plex Sans KR",sans-serif; }
.ac-scrim{ position:absolute; inset:0; background:rgba(31,26,20,.4); backdrop-filter:blur(2px); }
.ac-modal{ position:relative; max-height:calc(100vh - 40px); overflow:auto; background:var(--card,#FBF8F2); color:var(--ink,#1F1A14); border-radius:20px; box-shadow:0 30px 80px -20px rgba(31,26,20,.45); display:flex; flex-direction:column; }
.ac-head{ display:flex; align-items:flex-start; justify-content:space-between; gap:12px; padding:24px 26px 4px; }
.ac-title{ margin:0; font-size:19px; font-weight:700; letter-spacing:-.01em; }
.ac-sub{ margin-top:4px; font-size:12.5px; color:var(--ink-2,#5A5247); text-wrap:pretty; }
.ac-x{ appearance:none; border:0; background:transparent; color:var(--ink-3,#8B8273); width:30px; height:30px; border-radius:8px; cursor:pointer; display:grid; place-items:center; flex:none; }
.ac-x:hover{ background:rgba(31,26,20,.06); color:var(--ink,#1F1A14); }
.ac-body{ padding:16px 26px 8px; display:flex; flex-direction:column; gap:14px; }
.ac-foot{ display:flex; justify-content:flex-end; gap:8px; padding:12px 26px 22px; }
.ac-choice{ display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; }
.ac-opt{ appearance:none; text-align:left; cursor:pointer; padding:14px 16px; border-radius:14px; border:1.5px solid var(--line,rgba(31,26,20,.14)); background:#fff; display:flex; flex-direction:column; gap:4px; font-family:inherit; color:var(--ink,#1F1A14); }
.ac-opt b{ font-size:14px; } .ac-opt span{ font-size:12px; color:var(--ink-2,#5A5247); line-height:1.45; }
.ac-opt:hover{ border-color:rgba(31,26,20,.3); }
.ac-opt.is-on{ border-color:var(--accent,#D97757); box-shadow:0 0 0 3px color-mix(in oklab, var(--accent,#D97757) 18%, transparent); }
.ac-grid{ display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
.ac-fld{ display:flex; flex-direction:column; gap:6px; font-size:12px; font-weight:600; color:var(--ink-2,#5A5247); }
.ac-fld.is-full, .is-full{ grid-column:1/-1; }
.ac-inp{ height:42px; padding:0 13px; border:1px solid var(--line,rgba(31,26,20,.16)); border-radius:11px; background:#fff; font:500 14px "IBM Plex Sans KR",sans-serif; color:var(--ink,#1F1A14); outline:none; }
.ac-inp:focus{ border-color:var(--accent,#D97757); box-shadow:0 0 0 3px color-mix(in oklab, var(--accent,#D97757) 22%, transparent); }
.ac-inp:disabled{ background:var(--card-2,#F3EEE3); color:var(--ink-2,#5A5247); }
.ac-code-inp{ font-size:20px; letter-spacing:.18em; text-align:center; height:52px; }
.is-mono{ font-family:"JetBrains Mono",monospace; }
.ac-note{ font-size:12px; color:var(--ink-3,#8B8273); }
.ac-err{ font-size:12.5px; color:#B5462F; }
.ac-flash{ font-size:12.5px; color:#2F7D4F; }
.ac-btn{ appearance:none; height:40px; padding:0 18px; border-radius:11px; border:1px solid var(--line,rgba(31,26,20,.16)); background:#fff; color:var(--ink,#1F1A14); font:600 13.5px "IBM Plex Sans KR",sans-serif; cursor:pointer; white-space:nowrap; display:inline-flex; align-items:center; gap:8px; }
.ac-btn:hover{ border-color:rgba(31,26,20,.32); }
.ac-btn.is-pri{ background:var(--ink,#1F1A14); border-color:var(--ink,#1F1A14); color:var(--card,#FBF8F2); }
.ac-btn.is-sm{ height:32px; padding:0 12px; font-size:12.5px; }
.ac-btn.is-ghost{ background:transparent; }
.ac-btn.is-danger{ color:#B5462F; }
.ac-btn kbd{ font:600 10px "JetBrains Mono",monospace; opacity:.7; }
.ac-tabs{ display:inline-flex; gap:4px; background:var(--card-2,#F3EEE3); border-radius:11px; padding:4px; align-self:flex-start; }
.ac-tab{ appearance:none; border:0; background:transparent; padding:7px 16px; border-radius:8px; font:600 13px "IBM Plex Sans KR",sans-serif; color:var(--ink-2,#5A5247); cursor:pointer; }
.ac-tab.is-on{ background:var(--ink,#1F1A14); color:var(--card,#FBF8F2); }
.ac-invite{ display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap; padding:14px 16px; border-radius:14px; background:color-mix(in oklab, var(--accent,#D97757) 10%, #fff); border:1px dashed color-mix(in oklab, var(--accent,#D97757) 45%, transparent); }
.ac-invite-k{ font-size:11px; font-weight:600; color:var(--ink-3,#8B8273); }
.ac-invite-v{ font-size:22px; font-weight:700; letter-spacing:.14em; }
.ac-invite-a{ display:flex; gap:6px; }
.ac-mem-list{ display:flex; flex-direction:column; gap:6px; }
.ac-mem{ display:grid; grid-template-columns:34px minmax(0,1fr) 110px 84px; align-items:center; gap:12px; padding:10px 12px; border-radius:12px; background:#fff; border:1px solid var(--line,rgba(31,26,20,.1)); }
.ac-av{ width:34px; height:34px; border-radius:50%; background:var(--ink,#1F1A14); color:var(--card,#FBF8F2); display:grid; place-items:center; font-weight:700; font-size:13px; }
.ac-mem-n{ display:flex; flex-direction:column; gap:2px; min-width:0; }
.ac-mem-n b{ font-size:13.5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ac-mem-n em{ font-style:normal; color:var(--ink-3,#8B8273); font-weight:500; }
.ac-mem-n i{ font-style:normal; margin-left:6px; font-size:10.5px; padding:1px 6px; border-radius:5px; background:var(--card-2,#F3EEE3); color:var(--ink-2,#5A5247); }
.ac-mem-n span{ font-size:11px; color:var(--ink-3,#8B8273); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ac-sel{ height:32px; border:1px solid var(--line,rgba(31,26,20,.16)); border-radius:9px; padding:0 8px; font:500 12.5px "IBM Plex Sans KR",sans-serif; background:#fff; color:var(--ink,#1F1A14); }
.ac-role{ display:inline-block; font-size:11px; font-weight:700; padding:2px 8px; border-radius:999px; background:var(--card-2,#F3EEE3); color:var(--ink-2,#5A5247); white-space:nowrap; }
.ac-role.r-관리자{ background:var(--ink,#1F1A14); color:var(--card,#FBF8F2); }
.ac-role.r-일반{ background:color-mix(in oklab, var(--accent,#D97757) 18%, #fff); color:var(--ink,#1F1A14); }
.ac-roles{ display:flex; flex-direction:column; gap:6px; font-size:12px; color:var(--ink-2,#5A5247); padding:4px 2px; }
.ac-roles > div{ display:flex; align-items:center; gap:10px; }
.ac-roles .ac-role{ min-width:58px; text-align:center; }
.ac-perm{ display:flex; flex-direction:column; gap:4px; }
.ac-perm-h, .ac-perm-r{ display:grid; grid-template-columns:minmax(0,1fr) 62px 168px 168px; gap:10px; align-items:center; }
.ac-perm-h{ font-size:11px; font-weight:600; color:var(--ink-3,#8B8273); padding:0 12px 4px; }
.ac-perm-r{ padding:8px 12px; background:#fff; border:1px solid var(--line,rgba(31,26,20,.1)); border-radius:12px; }
.ac-perm-r b{ font-size:13px; }
.ac-seg{ display:inline-flex; background:var(--card-2,#F3EEE3); border-radius:9px; padding:3px; gap:2px; }
.ac-seg-b{ appearance:none; border:0; background:transparent; flex:1; padding:5px 0; border-radius:7px; font:600 12px "IBM Plex Sans KR",sans-serif; color:var(--ink-3,#8B8273); cursor:pointer; }
.ac-seg-b:disabled{ cursor:default; }
.ac-seg-b.is-on.lv-입력{ background:var(--ink,#1F1A14); color:var(--card,#FBF8F2); }
.ac-seg-b.is-on.lv-조회{ background:#fff; color:var(--ink,#1F1A14); box-shadow:0 1px 3px rgba(31,26,20,.15); }
.ac-seg-b.is-on.lv-숨김{ background:#F4DDD5; color:#9A3B26; }
.ac-lv{ display:inline-block; font-size:11px; font-weight:700; padding:2px 8px; border-radius:999px; min-width:44px; text-align:center; background:var(--card-2,#F3EEE3); color:var(--ink-2,#5A5247); }
.ac-lv.lv-입력, .ac-lv.is-fixed{ background:var(--ink,#1F1A14); color:var(--card,#FBF8F2); }
.ac-lv.lv-숨김{ background:#F4DDD5; color:#9A3B26; }
.ac-row-r{ display:flex; justify-content:flex-end; }
body[data-perm="view"] .title-add, body[data-perm="view"] .btn-danger, body[data-perm="view"] .bulk-del, body[data-perm="view"] [data-perm-edit], body[data-perm="view"] .pick-new{ display:none !important; }
body[data-perm="view"] .main::before{ content:"조회 권한 — 보기만 가능합니다"; position:fixed; bottom:16px; left:50%; transform:translateX(-50%); z-index:70; padding:7px 14px; border-radius:999px; background:var(--ink,#1F1A14); color:var(--card,#FBF8F2); font:600 12px "IBM Plex Sans KR",sans-serif; box-shadow:0 8px 20px -8px rgba(31,26,20,.4); pointer-events:none; }
@media (max-width:560px){ .ac-choice, .ac-grid{ grid-template-columns:1fr; } .ac-mem{ grid-template-columns:34px minmax(0,1fr); } .ac-perm-h, .ac-perm-r{ grid-template-columns:1fr; } }
`;
  document.head.appendChild(s);
})();
