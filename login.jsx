// login.jsx — nonamed 메출관리 프로그램 로그인

const { useState, useEffect, useRef, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#D97757", "#1F1A14", "#FBF8F2"],
  "layout": "circle",
  "showOrbit": true,
  "size": 560,
  "tagline": "오늘의 매출을 가장 단순하게."
}/*EDITMODE-END*/;

/* ───── circular login card ───── */

function Orbit({ size, accent }) {
  // feathered halo of slightly-distorted, layered ellipses around the card
  const VB = size + 420;
  const c  = VB / 2;
  const r0 = size / 2;

  // each ring: offset from card edge, squash ratio (ry/rx), rotation, stroke
  // jittered angles + aspect ratios so layers overlap organically
  const layers = [
    { off:  6, sq:.965, rot:  -7, w:1.4, op:.55 },
    { off: 14, sq:.985, rot:  12, w:1.1, op:.42 },
    { off: 22, sq:.952, rot: -22, w:1.0, op:.34 },
    { off: 32, sq:.974, rot:  31, w:0.9, op:.27 },
    { off: 44, sq:.940, rot:  -5, w:0.9, op:.22 },
    { off: 58, sq:.962, rot:  44, w:0.9, op:.18 },
    { off: 72, sq:.928, rot: -38, w:0.8, op:.15 },
    { off: 88, sq:.956, rot:  18, w:0.8, op:.12 },
    { off:106, sq:.940, rot: -55, w:0.8, op:.10 },
    { off:126, sq:.918, rot:  62, w:0.7, op:.085 },
    { off:148, sq:.946, rot: -14, w:0.7, op:.07 },
    { off:172, sq:.910, rot:  35, w:0.7, op:.055 },
    { off:198, sq:.934, rot: -48, w:0.7, op:.04 },
  ];

  // dashed filament ellipses interleaved between solid layers
  const feathers = [
    { off: 26,  sq:.948, rot:  24, dash:"1 7",  w:.9, op:.34 },
    { off: 38,  sq:.972, rot: -16, dash:"1 11", w:.8, op:.28 },
    { off: 52,  sq:.930, rot:  41, dash:"1 14", w:.7, op:.22 },
    { off: 68,  sq:.958, rot: -29, dash:"1 18", w:.7, op:.18 },
    { off: 84,  sq:.922, rot:  53, dash:"1 22", w:.7, op:.14 },
    { off:100,  sq:.946, rot: -42, dash:"1 26", w:.6, op:.11 },
    { off:120,  sq:.910, rot:  19, dash:"1 30", w:.6, op:.085 },
    { off:142,  sq:.938, rot: -58, dash:"1 34", w:.6, op:.065 },
  ];

  const ellipse = (key, off, sq, rot, props) => {
    const rx = r0 + off;
    const ry = (r0 + off) * sq;
    return (
      <ellipse key={key} cx={c} cy={c} rx={rx} ry={ry}
               transform={`rotate(${rot} ${c} ${c})`}
               fill="none" stroke="var(--ink)" {...props} />
    );
  };

  return (
    <svg className="orbit" width={VB} height={VB}
         viewBox={`0 0 ${VB} ${VB}`} aria-hidden="true">
      <defs>
        <radialGradient id="og-core" cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor="rgba(31,26,20,0)" />
          <stop offset="100%" stopColor="rgba(31,26,20,.05)" />
        </radialGradient>
        <radialGradient id="og-warm" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor={accent} stopOpacity="0" />
          <stop offset="55%" stopColor={accent} stopOpacity=".03" />
          <stop offset="80%" stopColor={accent} stopOpacity=".08" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <filter id="og-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id="og-blur-strong" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>

      {/* outer warm wash */}
      <circle cx={c} cy={c} r={r0 + 200} fill="url(#og-warm)" />

      {/* diffuse halo just outside the card */}
      <ellipse cx={c} cy={c} rx={r0 + 18} ry={(r0 + 18) * .96}
               transform={`rotate(8 ${c} ${c})`}
               fill="none" stroke="rgba(31,26,20,.10)" strokeWidth="42"
               filter="url(#og-blur-strong)" opacity=".55" />

      {/* solid ellipse layers — each individually tilted & squashed */}
      <g className="orbit-solid">
        {layers.map((L,i) => ellipse("s"+i, L.off, L.sq, L.rot,
          { strokeWidth: L.w, opacity: L.op,
            filter: L.blur ? "url(#og-blur)" : undefined }))}
      </g>

      {/* dashed filament ellipses, split into counter-rotating groups */}
      <g className="orbit-feather-a">
        {feathers.filter((_,i)=>i%2===0).map((F,i) => ellipse("fa"+i, F.off, F.sq, F.rot,
          { strokeWidth: F.w, strokeDasharray: F.dash, strokeLinecap: "round", opacity: F.op }))}
      </g>
      <g className="orbit-feather-b">
        {feathers.filter((_,i)=>i%2===1).map((F,i) => ellipse("fb"+i, F.off, F.sq, F.rot,
          { strokeWidth: F.w, strokeDasharray: F.dash, strokeLinecap: "round", opacity: F.op }))}
      </g>

      {/* warm accent traces — tilted ellipses */}
      <g className="orbit-accent">
        <ellipse cx={c} cy={c} rx={r0 + 40} ry={(r0 + 40) * .94}
                 transform={`rotate(-12 ${c} ${c})`}
                 fill="none" stroke={accent} strokeWidth=".9"
                 strokeDasharray="2 22" opacity=".55" />
        <ellipse cx={c} cy={c} rx={r0 + 110} ry={(r0 + 110) * .92}
                 transform={`rotate(28 ${c} ${c})`}
                 fill="none" stroke={accent} strokeWidth=".8"
                 strokeDasharray="1 32" opacity=".42" />
        <ellipse cx={c} cy={c} rx={r0 + 170} ry={(r0 + 170) * .9}
                 transform={`rotate(-46 ${c} ${c})`}
                 fill="none" stroke={accent} strokeWidth=".7"
                 strokeDasharray="1 40" opacity=".3" />
      </g>

      {/* faint core wash overlapping card */}
      <circle cx={c} cy={c} r={r0 - 8} fill="url(#og-core)" />
    </svg>
  );
}

function Stat({ k, v, sub }) {
  return (
    <div className="stat">
      <div className="stat-k">{k}</div>
      <div className="stat-v">{v}</div>
      {sub ? <div className="stat-sub">{sub}</div> : null}
    </div>
  );
}

/* ─── 계정 헬퍼 (목업 — localStorage) ─── */
const LG_USERS = "nonamed.users.v1", LG_SESSION = "nonamed.session.v1", LG_FAIL = "nonamed.loginFail.v1", LG_SAVED_ID = "nonamed.savedId.v1";
const LG_MAX_FAIL = 5, LG_LOCK_MIN = 10;
const lgDigits = (v) => String(v || "").replace(/\D/g, "");
function lgUsers() { try { return JSON.parse(localStorage.getItem(LG_USERS)) || []; } catch (e) { return []; } }
function lgSaveUsers(list) { try { localStorage.setItem(LG_USERS, JSON.stringify(list)); } catch (e) {} }
function lgFails() { try { return JSON.parse(localStorage.getItem(LG_FAIL)) || {}; } catch (e) { return {}; } }
function lgSetFails(m) { try { localStorage.setItem(LG_FAIL, JSON.stringify(m)); } catch (e) {} }
function lgMask(id) { const s = String(id); if (s.length <= 2) return s[0] + "*"; if (s.length <= 4) return s.slice(0, 2) + "*".repeat(s.length - 2); return s.slice(0, 3) + "*".repeat(s.length - 5) + s.slice(-2); }

function LgModal({ title, sub, onClose, children, foot }) {
  useEffect(() => { const fn = (e) => { if (e.key === "Escape") { e.preventDefault(); onClose(); } }; window.addEventListener("keydown", fn); return () => window.removeEventListener("keydown", fn); }, [onClose]);
  return (
    <div className="lg-root" role="dialog" aria-modal="true">
      <div className="lg-scrim" onClick={onClose} />
      <div className="lg-modal">
        <header className="lg-head">
          <div><h2 className="lg-title">{title}</h2>{sub ? <div className="lg-sub">{sub}</div> : null}</div>
          <button type="button" className="lg-x" onClick={onClose} aria-label="닫기"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg></button>
        </header>
        <div className="lg-body">{children}</div>
        {foot ? <footer className="lg-foot">{foot}</footer> : null}
      </div>
    </div>
  );
}
function LgField({ label, children }) { return <label className="lg-fld"><span className="lg-fld-k">{label}</span>{children}</label>; }

/* 소셜 로그인 (목업) — 실제 OAuth 연동은 배포 단계(BaaS). 처음이면 자동 가입 후 로그인 */
const LG_SOCIAL = [
  { key: "kakao",  label: "카카오", mark: "K", bg: "#FEE500", fg: "#191600" },
  { key: "naver",  label: "네이버", mark: "N", bg: "#03C75A", fg: "#fff" },
  { key: "google", label: "구글",   mark: "G", bg: "#fff",    fg: "#1F1A14", line: true },
];
function SocialRow({ onPick, label = "간편 로그인" }) {
  return (
    <div className="lg-social">
      <div className="lg-social-k"><span />{label}<span /></div>
      <div className="lg-social-row">
        {LG_SOCIAL.map(s => <button key={s.key} type="button" className={`lg-soc ${s.line ? "is-line" : ""}`} style={{ background: s.bg, color: s.fg }} onClick={() => onPick(s)} title={`${s.label}로 계속하기`} aria-label={`${s.label}로 계속하기`}>{s.mark}</button>)}
      </div>
    </div>
  );
}
function SocialModal({ provider, keep, onClose }) {
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const go = (e) => {
    e && e.preventDefault(); setErr("");
    if (!name.trim()) return setErr("이름을 입력해 주세요.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setErr("이메일 형식을 확인해 주세요.");
    if (!agree) return setErr("서비스 이용약관에 동의해 주세요.");
    setBusy(true);
    const users = lgUsers(); const em = email.trim().toLowerCase();
    let u = users.find(x => x.provider === provider.key && String(x.email || "").toLowerCase() === em);
    if (!u) { u = { id: provider.key + "_" + em.split("@")[0], provider: provider.key, ceo: name.trim(), email: em, company: "", biz: "", phone: "", at: new Date().toISOString() }; lgSaveUsers([...users, u]); }
    try {
      localStorage.setItem(LG_SESSION, JSON.stringify({ id: u.id, provider: provider.key, company: u.company || "", ceo: u.ceo, at: Date.now(), keep, exp: keep ? Date.now() + 30 * 864e5 : null, needsProfile: !u.company }));
      if (!keep) sessionStorage.setItem("nonamed.sessionAlive.v1", "1");
    } catch (e) {}
    setTimeout(() => { window.location.href = "dashboard.html"; }, 500);
  };
  return (
    <LgModal title={`${provider.label}로 계속하기`} sub="처음이면 자동으로 가입됩니다. 회사 정보는 로그인 후 입력할 수 있어요." onClose={onClose}
      foot={<><button type="button" className="lg-btn" onClick={onClose}>취소</button><button type="button" className="lg-btn is-pri" onClick={go} disabled={busy}>{busy ? "연결 중…" : "동의하고 계속"}</button></>}>
      <div className="lg-soc-badge"><span className={`lg-soc is-sm ${provider.line ? "is-line" : ""}`} style={{ background: provider.bg, color: provider.fg }}>{provider.mark}</span><span>{provider.label} 계정 정보 <em>(목업 — 실제 연동 시 자동으로 채워집니다)</em></span></div>
      <form className="lg-form" onSubmit={go}>
        <LgField label="이름"><input className="lg-inp" autoFocus value={name} onChange={(e) => setName(e.target.value)} /></LgField>
        <LgField label="이메일"><input className="lg-inp" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></LgField>
        <button type="button" className={`check ${agree ? "on" : ""}`} onClick={() => setAgree(a => !a)} aria-pressed={agree} style={{ alignSelf: "flex-start" }}>
          <span className="check-box">{agree ? <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5.2l2 2L8 3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg> : null}</span>
          <span>서비스 이용약관·개인정보 처리방침 동의 (필수)</span>
        </button>
        <button type="submit" hidden />
      </form>
      {err ? <div className="lg-msg is-err">{err}</div> : null}
    </LgModal>
  );
}

/* 아이디 찾기 — 사업자번호 + 이메일 */
function FindIdModal({ onClose, onUseId }) {
  const [biz, setBiz] = useState(""); const [email, setEmail] = useState("");
  const [res, setRes] = useState(null); const [err, setErr] = useState("");
  const fmtBiz = (v) => { const d = lgDigits(v).slice(0, 10); return d.length > 5 ? d.slice(0, 3) + "-" + d.slice(3, 5) + "-" + d.slice(5) : d.length > 3 ? d.slice(0, 3) + "-" + d.slice(3) : d; };
  const find = (e) => {
    e && e.preventDefault(); setErr("");
    if (lgDigits(biz).length !== 10) return setErr("사업자등록번호 10자리를 입력해 주세요.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setErr("이메일 형식을 확인해 주세요.");
    const hit = lgUsers().filter(u => lgDigits(u.biz) === lgDigits(biz) && String(u.email || "").toLowerCase() === email.trim().toLowerCase());
    setRes(hit);
  };
  return (
    <LgModal title="아이디 찾기" sub="가입 시 등록한 사업자등록번호와 이메일을 입력하세요." onClose={onClose}
      foot={res && res.length ? <><button type="button" className="lg-btn" onClick={onClose}>닫기</button><button type="button" className="lg-btn is-pri" onClick={() => onUseId(res[0].id)}>이 아이디로 로그인</button></>
        : <><button type="button" className="lg-btn" onClick={onClose}>취소</button><button type="button" className="lg-btn is-pri" onClick={find}>찾기</button></>}>
      <form onSubmit={find} className="lg-form">
        <LgField label="사업자등록번호"><input className="lg-inp is-mono" autoFocus value={biz} onChange={(e) => { setBiz(fmtBiz(e.target.value)); setRes(null); }} inputMode="numeric" /></LgField>
        <LgField label="이메일"><input className="lg-inp" value={email} onChange={(e) => { setEmail(e.target.value); setRes(null); }} type="email" /></LgField>
        <button type="submit" hidden />
      </form>
      {err ? <div className="lg-msg is-err">{err}</div> : null}
      {res ? (res.length ? (
        <div className="lg-result">
          <div className="lg-result-k">가입된 아이디</div>
          {res.map(u => <div key={u.id} className="lg-result-row"><b className="is-mono">{lgMask(u.id)}</b><span>{u.company}{u.at ? " · " + String(u.at).slice(0, 10) + " 가입" : ""}</span></div>)}
        </div>
      ) : <div className="lg-msg is-err">일치하는 계정이 없습니다. 입력한 정보를 다시 확인해 주세요.</div>) : null}
    </LgModal>
  );
}

/* 비밀번호 재설정 — 아이디 + 휴대폰 인증번호 (목업: 발송 번호를 화면에 표시) */
function ResetPwModal({ initialId, onClose, onDone }) {
  const [step, setStep] = useState(1); // 1 본인확인 · 2 새 비밀번호
  const [uid, setUid] = useState(initialId || ""); const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(null); const [code, setCode] = useState(""); const [left, setLeft] = useState(0);
  const [pw1, setPw1] = useState(""); const [pw2, setPw2] = useState(""); const [err, setErr] = useState("");
  useEffect(() => { if (!left) return; const t = setTimeout(() => setLeft(l => l - 1), 1000); return () => clearTimeout(t); }, [left]);
  const fmtPhone = (v) => { const d = lgDigits(v).slice(0, 11); return d.length > 7 ? d.slice(0, 3) + "-" + d.slice(3, 7) + "-" + d.slice(7) : d.length > 3 ? d.slice(0, 3) + "-" + d.slice(3) : d; };
  const send = () => {
    setErr("");
    if (!uid.trim()) return setErr("아이디를 입력해 주세요.");
    if (lgDigits(phone).length < 10) return setErr("휴대폰 번호를 입력해 주세요.");
    const u = lgUsers().find(x => x.id === uid.trim());
    if (!u || lgDigits(u.phone) !== lgDigits(phone)) return setErr("아이디와 가입 휴대폰 번호가 일치하지 않습니다.");
    const c = String(Math.floor(100000 + Math.random() * 900000));
    setSent(c); setCode(""); setLeft(180);
  };
  const verify = () => {
    setErr("");
    if (!sent) return setErr("인증번호를 먼저 받아 주세요.");
    if (!left) return setErr("인증 시간이 만료되었습니다. 다시 받아 주세요.");
    if (code.trim() !== sent) return setErr("인증번호가 일치하지 않습니다.");
    setStep(2);
  };
  const save = (e) => {
    e && e.preventDefault(); setErr("");
    if (pw1.length < 8 || !/[A-Za-z]/.test(pw1) || !/\d/.test(pw1)) return setErr("영문·숫자를 포함해 8자 이상 입력해 주세요.");
    if (pw1 !== pw2) return setErr("비밀번호가 서로 다릅니다.");
    lgSaveUsers(lgUsers().map(u => u.id === uid.trim() ? { ...u, pw: pw1, pwAt: new Date().toISOString() } : u));
    const f = lgFails(); delete f[uid.trim()]; lgSetFails(f);
    onDone(uid.trim());
  };
  const mmss = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
  return (
    <LgModal title="비밀번호 재설정" sub={step === 1 ? "가입 시 등록한 휴대폰으로 본인 확인을 합니다." : "새 비밀번호를 입력하세요."} onClose={onClose}
      foot={step === 1 ? <><button type="button" className="lg-btn" onClick={onClose}>취소</button><button type="button" className="lg-btn is-pri" onClick={verify} disabled={!sent}>다음</button></>
        : <><button type="button" className="lg-btn" onClick={onClose}>취소</button><button type="button" className="lg-btn is-pri" onClick={save}>변경</button></>}>
      <div className="lg-steps"><span className={step === 1 ? "is-on" : "is-done"}>1 본인 확인</span><span className="lg-steps-line" /><span className={step === 2 ? "is-on" : ""}>2 새 비밀번호</span></div>
      {step === 1 ? (
        <div className="lg-form">
          <LgField label="아이디"><input className="lg-inp" autoFocus={!initialId} value={uid} onChange={(e) => setUid(e.target.value)} /></LgField>
          <LgField label="휴대폰">
            <div className="lg-row"><input className="lg-inp is-mono" autoFocus={!!initialId} value={phone} onChange={(e) => setPhone(fmtPhone(e.target.value))} inputMode="numeric" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); send(); } }} /><button type="button" className="lg-btn is-sm" onClick={send}>{sent ? "재전송" : "인증번호 받기"}</button></div>
          </LgField>
          {sent ? (
            <LgField label="인증번호">
              <div className="lg-row"><input className="lg-inp is-mono" autoFocus value={code} onChange={(e) => setCode(lgDigits(e.target.value).slice(0, 6))} inputMode="numeric" maxLength={6} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); verify(); } }} /><span className={`lg-timer ${left < 30 ? "is-warn" : ""}`}>{left ? mmss : "만료"}</span></div>
            </LgField>
          ) : null}
          {sent ? <div className="lg-msg is-info">목업 — 발송된 인증번호: <b className="is-mono">{sent}</b></div> : null}
        </div>
      ) : (
        <form className="lg-form" onSubmit={save}>
          <LgField label="새 비밀번호"><input className="lg-inp" type="password" autoFocus value={pw1} onChange={(e) => setPw1(e.target.value)} /></LgField>
          <LgField label="비밀번호 확인"><input className="lg-inp" type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} /></LgField>
          <div className="lg-msg">영문·숫자 포함 8자 이상</div>
          <button type="submit" hidden />
        </form>
      )}
      {err ? <div className="lg-msg is-err">{err}</div> : null}
    </LgModal>
  );
}

/* 분할 레이아웃 좌측 브랜드 패널 — window.__LOGIN_VARIANT: "a"(잉크) | "b"(종이) | "c"(테라코타) */
const LG_VARIANT = window.__LOGIN_VARIANT || null;
const LG_FEATURES = [["매입·매출", "전표 입력부터 거래명세서 인쇄까지"], ["재고", "입·출고가 전표에서 자동으로 반영"], ["입출금", "미수금·미지급을 한 화면에서"]];
function LgMark({ className }) {
  const ref = useRef(null);
  useEffect(() => { const src = document.querySelector(".brandbar-mark"); if (src && ref.current) ref.current.innerHTML = src.innerHTML; }, []);
  return <svg ref={ref} className={className} viewBox="0 0 40 40" aria-hidden="true" />;
}
function ArtPanel({ v }) {
  const now = new Date();
  const date = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
  return (
    <aside className={`lart lart-${v}`}>
      <div className="lart-top"><LgMark className="lart-mark" /><b>nonamed</b></div>
      {v === "c" ? (
        <div className="lart-mid">
          <h1 className="lart-h">오늘 장부,<br />여기서 시작합니다.</h1>
          <p className="lart-p">작은 사업장을 위한 판매·재고 관리</p>
        </div>
      ) : (
        <div className="lart-mid">
          <h1 className="lart-h">장부는 가볍게,<br />거래는 정확하게.</h1>
          <ul className="lart-list">{LG_FEATURES.map(([k, d]) => <li key={k}><b>{k}</b><span>{d}</span></li>)}</ul>
        </div>
      )}
      {v === "b" ? <LgMark className="lart-bigmark" /> : null}
      {v === "c" ? <div className="lart-word">nonamed</div> : null}
      <div className="lart-foot"><span>{date}</span><span>v4.2.1</span></div>
    </aside>
  );
}

function LoginCard() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useEffect(() => { if (LG_VARIANT) document.body.classList.add("is-split"); }, []);

  const [id, setId] = useState(() => { try { return localStorage.getItem(LG_SAVED_ID) || ""; } catch (e) { return ""; } });
  const [pw, setPw] = useState("");
  const [remember, setRemember] = useState(() => { try { return localStorage.getItem(LG_SAVED_ID) != null; } catch (e) { return true; } });
  const [keep, setKeep] = useState(false);
  const [findOpen, setFindOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [social, setSocial] = useState(() => { const k = new URLSearchParams(window.location.search).get("social"); return LG_SOCIAL.find(s => s.key === k) || null; });
  // 자동 로그인: "로그인 유지"로 저장된 세션이 있으면 바로 대시보드로
  useEffect(() => { try { const s = JSON.parse(localStorage.getItem(LG_SESSION)); if (s && s.keep && (!s.exp || s.exp > Date.now())) window.location.replace("dashboard.html"); } catch (e) {} }, []);
  const [showPw, setShowPw] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // null | 'error' | 'success'
  const [errMsg, setErrMsg] = useState("");
  const [focused, setFocused] = useState(null);

  const idRef = useRef(null);

  useEffect(() => { idRef.current?.focus(); }, []);
  const [, tick] = useState(0);
  const lockInfo = (() => { const f = lgFails()[id.trim()]; return f && f.until && f.until > Date.now() ? f : null; })();
  useEffect(() => { if (!lockInfo) return; const i = setInterval(() => tick(n => n + 1), 1000); return () => clearInterval(i); }, [!!lockInfo]);
  const lockLeft = lockInfo ? Math.ceil((lockInfo.until - Date.now()) / 1000) : 0;

  const accent = t.palette?.[0] || "#D97757";
  const ink    = t.palette?.[1] || "#1F1A14";
  const card   = t.palette?.[2] || "#FBF8F2";

  // live clock for the chip
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  const hh = String(now.getHours()).padStart(2,"0");
  const mm = String(now.getMinutes()).padStart(2,"0");
  const ss = String(now.getSeconds()).padStart(2,"0");
  const date = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,"0")}.${String(now.getDate()).padStart(2,"0")}`;
  const dow = ["일","월","화","수","목","금","토"][now.getDay()];

  const onKey = (e) => {
    if (e.getModifierState) setCapsLock(e.getModifierState("CapsLock"));
  };

  const submit = (e) => {
    e.preventDefault();
    if (submitting) return;
    setErrMsg("");
    if (!id.trim()) { setStatus("error"); setErrMsg("아이디를 입력해 주세요."); idRef.current?.focus(); return; }
    if (pw.length < 4) { setStatus("error"); setErrMsg("비밀번호는 4자 이상이어야 합니다."); return; }
    setSubmitting(true);
    setStatus(null);
    const uid = id.trim();
    if (lockInfo) { setStatus("error"); setErrMsg(`로그인 ${LG_MAX_FAIL}회 실패로 잠긴 계정입니다. 잠시 후 다시 시도하거나 비밀번호를 재설정해 주세요.`); setSubmitting(false); return; }
    setTimeout(() => {
      // demo: id "admin" + pw "1234" 또는 회원가입한 계정
      const users = lgUsers();
      const u = users.find(x => x.id === uid && x.pw === pw);
      const ok = (uid === "admin" && pw === "1234") || !!u;
      const fails = lgFails();
      if (ok) {
        delete fails[uid]; lgSetFails(fails);
        setStatus("success");
        setSubmitting(false);
        try {
          if (remember) localStorage.setItem(LG_SAVED_ID, uid); else localStorage.removeItem(LG_SAVED_ID);
          localStorage.setItem(LG_SESSION, JSON.stringify({ id: uid, company: u ? u.company : "nonamed", ceo: u ? u.ceo : "관리자", at: Date.now(), keep, exp: keep ? Date.now() + 30 * 864e5 : null }));
          if (!keep) sessionStorage.setItem("nonamed.sessionAlive.v1", "1");
        } catch (e) {}
        setTimeout(() => { window.location.href = "dashboard.html"; }, 700);
      } else {
        const known = uid === "admin" || users.some(x => x.id === uid);
        let msg = "아이디 또는 비밀번호가 올바르지 않습니다.";
        if (known) {
          const cur = (fails[uid] && fails[uid].count) || 0; const n = cur + 1;
          if (n >= LG_MAX_FAIL) { fails[uid] = { count: n, until: Date.now() + LG_LOCK_MIN * 60000 }; msg = `비밀번호를 ${LG_MAX_FAIL}회 잘못 입력해 ${LG_LOCK_MIN}분간 로그인이 제한됩니다.`; }
          else { fails[uid] = { count: n }; msg += ` (${n}/${LG_MAX_FAIL}회)`; }
          lgSetFails(fails);
        }
        setStatus("error");
        setErrMsg(msg);
        setSubmitting(false);
      }
    }, 900);
  };

  const isCircle = !LG_VARIANT && t.layout === "circle";
  const SIZE = LG_VARIANT ? 440 : (t.size || 560);

  return (
    <div className={"wrap" + (LG_VARIANT ? " is-split" : "")} style={{ "--accent": accent, "--ink": ink, "--card": card }}>
      {LG_VARIANT ? <ArtPanel v={LG_VARIANT} /> : null}

      {/* decorative orbit */}
      {t.showOrbit && isCircle ? <Orbit size={SIZE} accent={accent} /> : null}

      {LG_VARIANT ? null : <aside className="side side-r">
        <div className="chip">
          <span className="chip-dot" />
          <span>실시간 동기화</span>
          <span className="chip-sep" />
          <span className="chip-mono">{hh}:{mm}<span className="ss">:{ss}</span></span>
        </div>
        <div className="datechip">
          <div className="dc-day">{date}</div>
          <div className="dc-dow">{dow}요일 · 영업중</div>
        </div>
      </aside>}

      <form
        onSubmit={submit}
        onKeyUp={onKey}
        onKeyDown={onKey}
        className={`card ${isCircle ? "card-circle" : "card-rounded"} ${status==='success' ? "is-success" : ""}`}
        style={{ width: SIZE, height: isCircle ? SIZE : "auto" }}
      >
        {/* brand */}
        <div className="card-brand">
          <svg className="logo-mark" viewBox="0 0 40 40" aria-hidden="true">
            <g fill="none" stroke="var(--ink)" strokeLinecap="round">
              <path d="M15.66 8.32Q19.71 6.61 22.02 6.49Q24.33 6.37 26.47 7.30Q28.61 8.24 30.53 9.60Q32.44 10.96 33.33 13.11Q34.21 15.25 34.25 17.43Q34.29 19.61 34.63 21.76Q34.98 23.92 34.11 25.93Q33.24 27.94 32.23 30.08Q31.21 32.21 28.76 32.56Q26.31 32.91 24.24 33.20Q22.16 33.50 19.94 34.06Q17.72 34.63 15.32 34.23Q12.91 33.83 11.10 32.20Q9.29 30.57 8.73 28.25Q8.17 25.93 6.83 23.93Q5.50 21.93 6.76 19.83Q8.03 17.72 8.40 15.63Q8.78 13.53 10.14 11.86Q11.51 10.18 13.30 8.87Q15.09 7.55 17.30 7.20Q19.51 6.84 21.82 6.54T24.12 6.23" strokeWidth="1" opacity="0.95" vectorEffect="non-scaling-stroke" />
              <path d="M24.23 33.28Q19.35 33.05 16.77 33.00Q14.19 32.95 12.15 31.53Q10.11 30.11 8.60 28.30Q7.08 26.48 7.22 24.28Q7.36 22.07 6.65 19.98Q5.94 17.88 7.08 16.01Q8.22 14.13 9.47 12.24Q10.73 10.35 12.99 9.36Q15.25 8.37 17.76 8.24Q20.27 8.10 22.65 8.62Q25.03 9.14 26.91 10.42Q28.80 11.71 30.33 13.20Q31.85 14.68 33.65 16.33Q35.44 17.98 34.98 20.13Q34.52 22.29 34.57 24.51Q34.62 26.74 32.58 28.06Q30.55 29.38 28.64 30.47Q26.74 31.55 24.65 32.80Q22.57 34.05 20.08 33.56T17.60 33.07" strokeWidth="0.75" opacity="0.85" vectorEffect="non-scaling-stroke" />
              <path d="M7.01 24.30Q7.29 20.40 7.48 18.44Q7.68 16.48 8.47 14.51Q9.27 12.54 11.34 11.63Q13.41 10.72 15.02 9.10Q16.64 7.49 18.89 7.00Q21.15 6.52 23.38 6.91Q25.61 7.30 27.07 8.92Q28.53 10.54 30.35 11.52Q32.17 12.49 33.07 14.28Q33.97 16.07 33.93 18.06Q33.89 20.05 34.37 22.13Q34.86 24.21 33.65 26.04Q32.44 27.88 31.11 29.63Q29.78 31.39 27.83 32.58Q25.89 33.78 23.62 33.74Q21.36 33.70 19.15 34.17Q16.94 34.63 14.67 34.22Q12.40 33.81 10.69 32.39Q8.98 30.97 7.69 29.21Q6.40 27.45 5.93 25.34Q5.45 23.22 5.74 21.09T6.03 18.95" strokeWidth="1.1" opacity="0.9" vectorEffect="non-scaling-stroke" />
              <path d="M12.41 30.21Q8.63 27.12 7.57 25.01Q6.51 22.89 6.94 20.84Q7.38 18.78 7.61 16.85Q7.84 14.91 8.60 13.05Q9.36 11.18 11.13 10.11Q12.91 9.03 15.17 9.14Q17.44 9.25 19.55 9.63Q21.66 10.01 23.83 10.59Q26.01 11.17 28.28 12.32Q30.55 13.47 31.58 15.65Q32.61 17.83 32.83 19.95Q33.06 22.07 33.59 24.28Q34.13 26.49 32.98 28.19Q31.84 29.89 30.43 31.33Q29.03 32.77 26.90 33.18Q24.78 33.59 22.64 34.27Q20.51 34.96 18.10 34.28Q15.68 33.60 13.91 31.78Q12.13 29.96 10.33 28.35T8.53 26.74" strokeWidth="0.6" opacity="0.75" vectorEffect="non-scaling-stroke" />
              <path d="M25.91 32.06Q21.69 32.42 19.67 31.46Q17.64 30.50 15.57 30.28Q13.51 30.06 11.59 28.99Q9.68 27.91 8.96 25.95Q8.23 23.99 6.46 22.42Q4.68 20.85 5.23 18.92Q5.78 16.98 5.55 15.00Q5.32 13.01 6.37 11.42Q7.42 9.84 9.01 8.77Q10.61 7.70 12.63 7.55Q14.65 7.40 16.43 6.71Q18.21 6.01 20.25 6.33Q22.30 6.64 24.15 7.64Q26.01 8.64 27.26 10.22Q28.51 11.80 29.71 13.28Q30.90 14.76 31.99 16.45Q33.09 18.14 33.19 20.02Q33.28 21.90 32.52 23.52Q31.75 25.14 31.32 27.06Q30.89 28.98 29.09 29.84Q27.28 30.70 25.41 31.29Q23.53 31.88 21.48 31.89Q19.43 31.89 17.44 31.24T15.44 30.59" strokeWidth="0.95" opacity="0.9" vectorEffect="non-scaling-stroke" />
              <path d="M33.32 32.18Q29.42 34.10 27.76 35.29Q26.10 36.48 24.07 36.56Q22.05 36.63 20.06 36.43Q18.08 36.23 16.03 35.75Q13.98 35.26 12.15 33.96Q10.33 32.65 9.06 30.69Q7.80 28.74 7.92 26.34Q8.03 23.94 7.69 21.89Q7.36 19.84 7.28 17.64Q7.20 15.43 8.49 13.82Q9.79 12.21 10.79 10.38Q11.78 8.55 13.50 7.51Q15.22 6.47 17.16 6.12Q19.11 5.78 21.11 5.74Q23.10 5.69 25.08 6.32Q27.07 6.95 28.57 8.53Q30.07 10.12 32.14 11.28Q34.21 12.45 34.06 15.00Q33.90 17.55 34.65 19.63Q35.40 21.71 34.78 23.76Q34.16 25.81 34.14 28.21Q34.12 30.62 32.44 31.97Q30.77 33.33 29.32 34.96Q27.86 36.59 25.71 36.57T23.56 36.55" strokeWidth="0.55" opacity="0.7" vectorEffect="non-scaling-stroke" />
              <path d="M31.91 26.00Q28.85 29.65 26.83 30.76Q24.81 31.88 22.73 32.72Q20.65 33.56 18.34 34.01Q16.03 34.46 13.49 34.30Q10.95 34.13 9.40 32.23Q7.84 30.33 6.53 28.43Q5.23 26.53 5.01 24.23Q4.80 21.94 5.19 19.72Q5.59 17.51 6.54 15.44Q7.49 13.38 9.17 11.80Q10.85 10.22 12.75 8.69Q14.65 7.15 17.08 7.07Q19.50 6.98 21.67 7.68Q23.85 8.37 26.01 9.15Q28.16 9.94 30.05 11.43Q31.93 12.92 32.01 15.35Q32.09 17.78 32.06 19.96Q32.03 22.13 31.54 24.32Q31.06 26.50 30.01 28.69T28.96 30.87" strokeWidth="0.85" opacity="0.85" vectorEffect="non-scaling-stroke" />
              <path d="M15.86 7.60Q20.24 5.31 22.56 6.52Q24.88 7.74 27.06 9.02Q29.24 10.31 30.52 12.44Q31.80 14.58 32.77 16.81Q33.74 19.03 33.71 21.37Q33.68 23.71 32.39 25.51Q31.11 27.31 30.15 29.40Q29.20 31.50 27.15 32.70Q25.09 33.91 22.57 34.02Q20.06 34.13 17.55 33.49Q15.04 32.85 12.72 31.52Q10.41 30.20 8.88 28.04Q7.35 25.88 6.24 23.54Q5.13 21.19 5.15 18.72Q5.16 16.25 6.33 14.24Q7.49 12.23 8.97 10.61Q10.45 8.98 12.40 7.93Q14.36 6.87 16.63 6.17Q18.90 5.47 21.18 6.69T23.47 7.92" strokeWidth="0.45" opacity="0.6" vectorEffect="non-scaling-stroke" />
              <path d="M29.58 29.51Q26.61 31.68 24.93 32.51Q23.24 33.35 21.32 33.91Q19.39 34.48 17.26 34.50Q15.12 34.52 13.20 33.50Q11.29 32.48 9.80 30.92Q8.31 29.36 8.07 27.17Q7.83 24.97 6.73 23.27Q5.64 21.57 5.83 19.61Q6.02 17.64 6.07 15.59Q6.11 13.54 7.60 12.14Q9.08 10.75 10.54 9.58Q12.00 8.42 13.63 7.60Q15.26 6.77 17.05 6.36Q18.84 5.95 20.68 6.13Q22.51 6.30 24.29 6.82Q26.08 7.34 27.88 8.12Q29.69 8.90 31.41 10.15Q33.14 11.40 33.29 13.55Q33.44 15.70 34.40 17.59Q35.37 19.47 34.40 21.34Q33.44 23.21 32.91 25.04Q32.37 26.87 31.43 28.62Q30.48 30.37 29.00 31.80Q27.53 33.23 25.38 33.15T23.24 33.07" strokeWidth="0.8" opacity="0.85" vectorEffect="non-scaling-stroke" />
              <path d="M14.75 7.62Q18.83 4.34 21.18 4.84Q23.54 5.35 25.71 6.29Q27.88 7.24 29.55 8.90Q31.23 10.57 31.62 12.93Q32.01 15.29 32.61 17.39Q33.21 19.49 33.60 21.89Q33.98 24.29 32.22 26.08Q30.46 27.86 29.28 29.87Q28.10 31.89 26.10 33.14Q24.09 34.40 21.80 34.78Q19.51 35.16 17.25 34.94Q14.99 34.72 13.25 33.33Q11.52 31.93 9.01 31.40Q6.50 30.86 5.30 28.73Q4.11 26.61 4.42 24.13Q4.73 21.66 4.28 19.30Q3.83 16.94 4.64 14.60Q5.45 12.26 7.28 10.60Q9.11 8.94 11.40 8.32Q13.69 7.71 15.73 6.88T17.77 6.06" strokeWidth="0.5" opacity="0.65" vectorEffect="non-scaling-stroke" />
              <path d="M33.14 23.83Q30.00 27.01 28.12 28.10Q26.23 29.19 24.46 30.63Q22.68 32.08 20.35 31.63Q18.03 31.19 15.79 31.21Q13.55 31.23 11.91 29.89Q10.27 28.56 8.21 27.62Q6.16 26.69 6.09 24.57Q6.03 22.46 4.95 20.70Q3.87 18.94 4.51 17.04Q5.16 15.13 5.66 13.11Q6.17 11.09 7.72 9.49Q9.27 7.89 11.43 7.05Q13.59 6.21 15.87 6.39Q18.15 6.57 20.37 6.26Q22.58 5.96 24.54 6.89Q26.49 7.82 28.46 8.83Q30.43 9.84 31.61 11.60Q32.80 13.35 33.48 15.33Q34.16 17.32 33.23 19.27Q32.30 21.23 31.76 23.12Q31.22 25.01 30.10 26.83T28.98 28.64" strokeWidth="1" opacity="0.9" vectorEffect="non-scaling-stroke" />
              <path d="M24.44 32.20Q20.74 33.86 18.74 33.08Q16.73 32.29 14.88 31.71Q13.02 31.13 10.96 30.49Q8.90 29.85 7.63 28.30Q6.36 26.75 5.18 25.08Q3.99 23.41 4.23 21.52Q4.48 19.62 5.15 17.96Q5.81 16.29 6.84 14.86Q7.86 13.43 9.33 12.40Q10.80 11.36 12.11 9.90Q13.43 8.44 15.52 8.15Q17.62 7.87 19.62 8.63Q21.62 9.39 23.40 10.09Q25.18 10.80 27.37 11.27Q29.57 11.73 30.97 13.24Q32.36 14.75 32.23 16.70Q32.09 18.65 32.95 20.35Q33.81 22.05 33.70 23.90Q33.60 25.75 32.18 27.09Q30.77 28.43 29.51 29.78Q28.26 31.12 26.41 31.80Q24.56 32.48 22.64 33.11Q20.72 33.74 18.58 33.67T16.44 33.61" strokeWidth="0.7" opacity="0.8" vectorEffect="non-scaling-stroke" />
              <path d="M30.11 12.16Q33.31 14.78 34.33 16.64Q35.35 18.50 35.66 20.59Q35.98 22.68 35.73 24.75Q35.48 26.83 34.22 28.42Q32.96 30.01 32.06 31.84Q31.15 33.67 29.34 34.56Q27.52 35.45 25.49 35.41Q23.45 35.38 21.60 35.27Q19.75 35.16 17.59 35.87Q15.44 36.57 13.52 35.48Q11.61 34.38 10.66 32.30Q9.71 30.22 8.51 28.64Q7.31 27.05 6.52 25.19Q5.73 23.34 5.58 21.35Q5.42 19.37 5.89 17.49Q6.36 15.61 6.97 13.75Q7.57 11.88 9.37 11.02Q11.16 10.17 12.67 9.27Q14.19 8.37 15.78 7.25Q17.38 6.13 19.36 6.23Q21.34 6.33 23.20 7.06Q25.06 7.78 26.96 8.52Q28.86 9.26 30.51 10.60Q32.15 11.94 33.07 13.86T33.98 15.77" strokeWidth="0.4" opacity="0.55" vectorEffect="non-scaling-stroke" />
              <path d="M35.91 23.78Q32.63 27.63 31.39 29.62Q30.15 31.62 28.29 33.18Q26.44 34.75 24.11 35.13Q21.78 35.50 19.43 35.70Q17.09 35.90 14.96 34.98Q12.83 34.07 11.18 32.49Q9.53 30.91 8.10 29.09Q6.66 27.27 5.99 24.96Q5.31 22.65 6.24 20.32Q7.17 17.99 8.11 15.96Q9.05 13.93 9.71 11.42Q10.37 8.91 12.80 8.32Q15.23 7.72 17.25 6.41Q19.26 5.10 21.59 5.12Q23.93 5.15 25.83 6.40Q27.73 7.65 29.73 8.63Q31.73 9.61 32.82 11.59Q33.90 13.57 34.55 15.73Q35.19 17.89 34.65 20.12Q34.11 22.36 34.48 24.96T34.84 27.57" strokeWidth="0.65" opacity="0.75" vectorEffect="non-scaling-stroke" />
            </g>
          </svg>
          <div className="card-brand-text">
            <div className="cb-title">{LG_VARIANT ? "로그인" : "nonamed"}</div>
            <div className="cb-sub">{LG_VARIANT ? "아이디와 비밀번호를 입력하세요" : "SALES SUITE · LOGIN"}</div>
          </div>
        </div>

        {/* fields */}
        <div className="fields">
          <label className={`field ${focused==='id' ? 'is-focus':''} ${id ? 'is-filled':''}`}>
            <span className="field-label">아이디</span>
            <input
              ref={idRef}
              type="text"
              autoComplete="username"
              value={id}
              onChange={e => { setId(e.target.value); if(status==='error') setStatus(null); }}
              onFocus={() => setFocused('id')}
              onBlur={() => setFocused(null)}
              placeholder="아이디를 입력하세요"
              spellCheck={false}
            />
            {id ? (
              <button type="button" className="field-clear" onClick={()=>setId("")} aria-label="지우기">
                <svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
              </button>
            ) : null}
          </label>

          <label className={`field ${focused==='pw' ? 'is-focus':''} ${pw ? 'is-filled':''}`}>
            <span className="field-label">비밀번호</span>
            <input
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              value={pw}
              onChange={e => { setPw(e.target.value); if(status==='error') setStatus(null); }}
              onFocus={() => setFocused('pw')}
              onBlur={() => setFocused(null)}
              placeholder="••••••••"
            />
            <button type="button" className="field-eye" onClick={()=>setShowPw(s=>!s)}
                    aria-label={showPw ? "숨기기" : "표시"}>
              {showPw ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z" stroke="currentColor" strokeWidth="1.2"/>
                  <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8s2.5-4.5 6-4.5c1.3 0 2.5.4 3.5 1M14 8s-2.5 4.5-6 4.5c-1.3 0-2.5-.4-3.5-1M2 2l12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          </label>

          {capsLock ? (
            <div className="hint hint-warn">
              <span className="dot" /> Caps Lock이 켜져 있습니다.
            </div>
          ) : null}

          {status === 'error' ? (
            <div className="hint hint-err" role="alert">
              <span className="dot" /> {errMsg}
            </div>
          ) : null}
        </div>

        {/* options row */}
        <div className="row-opts">
          <button
            type="button"
            className={`check ${remember ? 'on' : ''}`}
            onClick={()=>setRemember(r=>!r)}
            aria-pressed={remember}
          >
            <span className="check-box">
              {remember ? (
                <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5.2l2 2L8 3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ) : null}
            </span>
            <span>아이디 저장</span>
          </button>
          <button type="button" className={`check ${keep ? 'on' : ''}`} onClick={() => setKeep(k => !k)} aria-pressed={keep} title="이 기기에서 30일간 로그인 유지">
            <span className="check-box">{keep ? <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5.2l2 2L8 3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg> : null}</span>
            <span>로그인 유지</span>
          </button>
        </div>
        <div className="row-links lg-links">
          <a href="#" onClick={(e) => { e.preventDefault(); setFindOpen(true); }}>아이디 찾기</a>
          <span className="dotsep" />
          <a href="#" onClick={(e) => { e.preventDefault(); setResetOpen(true); }}>비밀번호 재설정</a>
        </div>
        {lockInfo ? <div className="hint hint-err lg-lock" role="alert"><span className="dot" /> 계정 잠김 · {Math.floor(lockLeft / 60)}:{String(lockLeft % 60).padStart(2, "0")} 후 해제 <a href="#" onClick={(e) => { e.preventDefault(); setResetOpen(true); }}>비밀번호 재설정</a></div> : null}
        {notice ? <div className="hint lg-ok"><span className="dot" /> {notice}</div> : null}

        {/* submit */}
        <button
          type="submit"
          className={`submit ${submitting ? 'is-loading':''} ${status==='success' ? 'is-success':''}`}
          disabled={submitting || status==='success'}
        >
          <span className="submit-label">
            {status==='success' ? "로그인 완료" : submitting ? "확인 중…" : "로그인"}
          </span>
          <span className="submit-arrow" aria-hidden="true">
            {status==='success' ? (
              <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 7.3l2.6 2.6L11 4.4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </span>
        </button>

        {/* footer line */}
        <SocialRow onPick={setSocial} />

        <div className="card-foot">
          <span>최초 사용자이신가요?</span>
          <a href="signup.html">회원가입 →</a>
        </div>

        {/* tiny mono hint */}
        <div className="hint-demo">demo · admin / 1234</div>
      </form>
      {social ? <SocialModal provider={social} keep={keep} onClose={() => setSocial(null)} /> : null}
      {findOpen ? <FindIdModal onClose={() => setFindOpen(false)} onUseId={(v) => { setId(v); setPw(""); setFindOpen(false); setStatus(null); setNotice("아이디를 찾았습니다. 비밀번호를 입력해 주세요."); }} /> : null}
      {resetOpen ? <ResetPwModal initialId={id.trim()} onClose={() => setResetOpen(false)} onDone={(v) => { setId(v); setPw(""); setResetOpen(false); setStatus(null); setNotice("비밀번호가 변경되었습니다. 새 비밀번호로 로그인해 주세요."); }} /> : null}

      {/* success overlay */}
      {status==='success' ? (
        <div className="success-overlay" role="status">
          <div className="so-inner">
            <div className="so-ring" />
            <div className="so-text">대시보드로 이동합니다…</div>
          </div>
        </div>
      ) : null}

      {/* Tweaks */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="색상" />
        <TweakColor label="팔레트" value={t.palette}
          options={[
            ["#D97757", "#1F1A14", "#FBF8F2"], // warm terracotta
            ["#5B7C5A", "#1B2218", "#F2F1EB"], // sage
            ["#3D5A80", "#0F1822", "#F2F4F7"], // navy
            ["#1F1A14", "#1F1A14", "#FBF8F2"], // mono
            ["#B5895C", "#1F1A14", "#F4ECDD"], // sand
          ]}
          onChange={(v) => setTweak('palette', v)} />

        <TweakSection label="레이아웃" />
        <TweakRadio label="카드 형태" value={t.layout}
          options={["circle", "rounded"]}
          onChange={(v) => setTweak('layout', v)} />
        <TweakSlider label="카드 크기" value={t.size} min={460} max={680} step={10} unit="px"
          onChange={(v) => setTweak('size', v)} />
        <TweakToggle label="궤도 장식" value={t.showOrbit}
          onChange={(v) => setTweak('showOrbit', v)} />

        <TweakSection label="문구" />
        <TweakText label="태그라인" value={t.tagline}
          onChange={(v) => setTweak('tagline', v)} />
      </TweaksPanel>
    </div>
  );
}

/* ─── styles ─── */
const css = `
/* 분할 레이아웃 (시안 A/B/C) */
body.is-split{ background:var(--bg) !important; }
body.is-split::before, body.is-split .brandbar, body.is-split .footbar{ display:none; }
body.is-split .stage{ display:block; padding:0; min-height:100vh; }
.wrap.is-split{ display:grid; grid-template-columns:minmax(0,1.05fr) minmax(0,1fr); min-height:100vh; width:100%; place-items:stretch; }
.wrap.is-split > .card{ grid-column:2; grid-row:1; align-self:center; justify-self:center; max-width:calc(100% - 48px); background:transparent; box-shadow:none; border:0; padding:24px 8px; }
.wrap.is-split > .card .card-brand{ flex-direction:column; align-items:flex-start; gap:6px; width:100%; max-width:340px; }
.wrap.is-split > .card .card-brand .logo-mark{ display:none; }
.wrap.is-split > .card .cb-title{ font-family:"IBM Plex Sans KR",sans-serif; font-size:28px; font-weight:700; letter-spacing:-.02em; }
.wrap.is-split > .card .cb-sub{ font-family:"IBM Plex Sans KR",sans-serif; font-size:13px; letter-spacing:0; text-transform:none; color:var(--ink-2); }
.wrap.is-split .hint-demo{ position:static; transform:none; margin-top:6px; }
.lart{ grid-column:1; grid-row:1; position:relative; overflow:hidden; display:flex; flex-direction:column; justify-content:space-between; padding:44px 52px; min-height:100vh; }
.lart-top{ display:flex; align-items:center; gap:10px; font-size:15px; position:relative; z-index:1; }
.lart-mark{ width:34px; height:34px; overflow:visible; }
.lart-mid{ position:relative; z-index:1; display:flex; flex-direction:column; gap:28px; max-width:460px; }
.lart-h{ margin:0; font-family:"Gowun Batang",serif; font-weight:700; font-size:clamp(34px,3.6vw,52px); line-height:1.22; letter-spacing:-.01em; text-wrap:balance; }
.lart-p{ margin:0; font-size:15px; }
.lart-list{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:14px; }
.lart-list li{ display:grid; grid-template-columns:72px minmax(0,1fr); gap:14px; font-size:14px; padding-top:14px; }
.lart-list b{ font-weight:600; }
.lart-foot{ position:relative; z-index:1; display:flex; justify-content:space-between; font-family:"JetBrains Mono",monospace; font-size:11px; letter-spacing:.04em; }
/* A — 잉크 */
.lart-a{ background:var(--ink); color:#F1ECE3; }
.lart-a .lart-mark g{ stroke:#F1ECE3; }
.lart-a .lart-list li{ border-top:1px solid rgba(241,236,227,.18); }
.lart-a .lart-list span, .lart-a .lart-foot{ color:rgba(241,236,227,.62); }
.lart-a .lart-list b{ color:var(--accent); }
/* B — 종이 */
.lart-b{ background:var(--bg-2); color:var(--ink); border-right:1px solid rgba(31,26,20,.1); }
.lart-b .lart-list li{ border-top:1px solid rgba(31,26,20,.14); }
.lart-b .lart-list span, .lart-b .lart-foot{ color:var(--ink-2); }
.lart-b .lart-h{ color:var(--ink); }
.lart-bigmark{ position:absolute; right:-18%; bottom:-14%; width:78%; height:auto; overflow:visible; opacity:.16; z-index:0; }
.lart-bigmark g{ stroke:var(--accent); }
/* C — 테라코타 */
.lart-c{ background:var(--accent); color:var(--ink); }
.lart-c .lart-p, .lart-c .lart-foot{ color:color-mix(in oklab, var(--ink) 78%, transparent); }
.lart-word{ position:absolute; left:40px; right:40px; bottom:62px; z-index:0; font-family:"Gowun Batang",serif; font-weight:700; font-size:clamp(72px,10vw,156px); line-height:.9; letter-spacing:-.04em; color:color-mix(in oklab, var(--ink) 16%, transparent); white-space:nowrap; overflow:hidden; }
@media (max-width:900px){
  .wrap.is-split{ grid-template-columns:1fr; }
  .lart{ min-height:0; padding:28px 28px 24px; gap:22px; }
  .lart-list, .lart-bigmark, .lart-word, .lart-foot{ display:none; }
  .lart-h{ font-size:28px; }
  .wrap.is-split > .card{ grid-column:1; grid-row:2; padding:32px 8px 56px; }
}
`;
const cssBase = `
.wrap{
  position:relative;
  display:grid;place-items:center;
  width:100%;
  word-break: keep-all;
  overflow-wrap: break-word;
}

/* decorative feathered orbit */
.orbit{
  position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
  z-index:0;pointer-events:none;
}
.orbit > g{ transform-origin: 50% 50%; transform-box: fill-box; }
.orbit-solid       { animation: spinA 240s linear infinite; transform-origin:50% 50%; transform-box: view-box; }
.orbit-feather-a   { animation: spinA 140s linear infinite; transform-origin:50% 50%; transform-box: view-box; }
.orbit-feather-b   { animation: spinB 180s linear infinite; transform-origin:50% 50%; transform-box: view-box; }
.orbit-accent      { animation: spinA 320s linear infinite; transform-origin:50% 50%; transform-box: view-box; }
@keyframes spinA { to { transform: rotate(360deg); } }
@keyframes spinB { to { transform: rotate(-360deg); } }

/* circle / rounded card */
.card{
  position:relative;z-index:2;
  background:var(--card);
  border:1px solid rgba(31,26,20,.55);
  box-shadow:
    0 0 0 6px rgba(251,248,242,.7),
    0 30px 80px -20px rgba(31,26,20,.18),
    0 8px 24px -8px rgba(31,26,20,.10);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:22px;
  padding: 56px clamp(40px, 8%, 80px);
  transition: border-radius .5s cubic-bezier(.6,.2,.2,1), transform .35s ease, box-shadow .35s ease;
}
.card-circle{ border-radius: 50%; aspect-ratio: 1/1; }
.card-rounded{ border-radius: 36px; padding: 56px 56px 44px; }
.card.is-success{ transform: scale(.985); }

/* brand inside card */
.card-brand{
  display:flex;align-items:center;gap:12px;
}
.logo-mark{
  width:38px;height:38px;display:block;
  overflow:visible;
}
.card-brand-text .cb-title{
  font-weight:700;font-size:18px;letter-spacing:-0.01em;
  font-family:"Gowun Batang", "IBM Plex Sans KR", serif;
}
.card-brand-text .cb-sub{
  font-family:"JetBrains Mono",monospace;font-size:9.5px;
  letter-spacing:.16em;color:var(--ink-3);margin-top:2px;
}

/* fields */
.fields{ display:flex;flex-direction:column;gap:10px;width:100%;max-width:340px; }
.field{
  position:relative;display:flex;align-items:center;
  border-radius: var(--r-input);
  background: rgba(31,26,20,.04);
  border:1px solid transparent;
  transition: background .2s, border-color .2s, box-shadow .2s;
  padding: 0 14px 0 16px;height:48px;
}
.field.is-focus{
  background:#fff;
  border-color: var(--ink);
  box-shadow: 0 0 0 4px rgba(31,26,20,.06);
}
.field-label{
  position:absolute;left:18px;top:50%;transform:translateY(-50%);
  font-size:14px;color:var(--ink-3);pointer-events:none;
  transition: transform .18s ease, font-size .18s ease, color .18s ease, top .18s ease;
}
.field.is-focus .field-label,
.field.is-filled .field-label{
  top:9px;transform:none;font-size:10px;color:var(--ink-2);
  letter-spacing:.04em;font-weight:500;
}
.field input{
  appearance:none;border:0;outline:0;background:transparent;
  width:100%;height:100%;padding: 14px 0 0 0;
  font: 500 14.5px "IBM Plex Sans KR",ui-sans-serif,system-ui,sans-serif;
  color:var(--ink);letter-spacing:.005em;
}
.field input::placeholder{ color: rgba(31,26,20,.25); }
.field.is-focus input::placeholder{ color: rgba(31,26,20,.32); }
.field:not(.is-focus):not(.is-filled) input::placeholder{ color: transparent; }

.field-clear, .field-eye{
  appearance:none;border:0;background:transparent;
  width:24px;height:24px;border-radius:50%;
  display:grid;place-items:center;color:var(--ink-3);
  cursor:pointer;flex-shrink:0;
}
.field-clear:hover, .field-eye:hover{ background: rgba(31,26,20,.08); color:var(--ink); }

/* hints */
.hint{
  display:flex;align-items:center;gap:8px;
  font-size:12px;padding:2px 4px;
}
.hint .dot{
  width:6px;height:6px;border-radius:50%;background:currentColor;
}
.hint-warn{ color: oklch(0.55 0.13 70); }
.hint-err{ color: var(--bad); animation: shakey .35s ease; }
@keyframes shakey{
  0%,100%{transform:translateX(0)}
  20%{transform:translateX(-4px)} 40%{transform:translateX(4px)}
  60%{transform:translateX(-2px)} 80%{transform:translateX(2px)}
}

/* options row */
.row-opts{
  display:flex;align-items:center;justify-content:space-between;gap:12px;
  width:100%;max-width:340px;font-size:12px;color:var(--ink-2);
}
.check{
  appearance:none;border:0;background:transparent;color:var(--ink-2);
  display:flex;align-items:center;gap:8px;cursor:pointer;font:inherit;
  padding:0;
}
.check-box{
  width:16px;height:16px;border-radius:6px;
  border:1.2px solid var(--ink-2);
  display:grid;place-items:center;color:var(--card);
  transition: background .15s, border-color .15s;
}
.check.on .check-box{ background:var(--ink); border-color:var(--ink); }
.row-links{ display:flex;align-items:center;gap:10px; }
.lg-social{ width:100%; max-width:340px; display:flex; flex-direction:column; align-items:center; gap:8px; }
.lg-social-k{ width:100%; display:flex; align-items:center; gap:10px; font-size:11px; color:var(--ink-3); white-space:nowrap; }
.lg-social-k span{ flex:1; height:1px; background:rgba(31,26,20,.12); }
.lg-social-row{ display:flex; gap:12px; }
.lg-soc{ appearance:none; width:40px; height:40px; border-radius:50%; border:0; cursor:pointer; display:grid; place-items:center; font:800 15px "IBM Plex Sans KR",sans-serif; box-shadow:0 2px 6px -2px rgba(31,26,20,.25); transition:transform .15s; }
.lg-soc:hover{ transform:translateY(-1px); }
.lg-soc.is-line{ box-shadow:inset 0 0 0 1px rgba(31,26,20,.16), 0 2px 6px -2px rgba(31,26,20,.18); }
.lg-soc.is-sm{ width:30px; height:30px; font-size:12px; flex:none; cursor:default; }
.lg-soc-badge{ display:flex; align-items:center; gap:10px; font-size:12.5px; color:var(--ink-2); }
.lg-soc-badge em{ font-style:normal; color:var(--ink-3); font-size:11.5px; }
.lg-links{ justify-content:center; font-size:12px; margin-top:-4px; }
.lg-lock a{ color:inherit; text-decoration:underline; margin-left:6px; }
.lg-ok{ color:#2F7D4F; } .lg-ok .dot{ background:#2F7D4F; }
.lg-root{ position:fixed; inset:0; z-index:100; display:grid; place-items:center; padding:20px; }
.lg-scrim{ position:absolute; inset:0; background:rgba(31,26,20,.38); backdrop-filter:blur(2px); }
.lg-modal{ position:relative; width:min(420px,100%); background:var(--card); color:var(--ink); border-radius:20px; box-shadow:0 30px 80px -20px rgba(31,26,20,.45); display:flex; flex-direction:column; font-family:"IBM Plex Sans KR",sans-serif; }
.lg-head{ display:flex; align-items:flex-start; justify-content:space-between; gap:12px; padding:22px 24px 6px; }
.lg-title{ margin:0; font-size:18px; font-weight:700; letter-spacing:-.01em; }
.lg-sub{ margin-top:4px; font-size:12.5px; color:var(--ink-2); text-wrap:pretty; }
.lg-x{ appearance:none; border:0; background:transparent; color:var(--ink-3); width:30px; height:30px; border-radius:8px; cursor:pointer; display:grid; place-items:center; flex:none; }
.lg-x:hover{ background:rgba(31,26,20,.06); color:var(--ink); }
.lg-body{ padding:14px 24px 6px; display:flex; flex-direction:column; gap:12px; }
.lg-form{ display:flex; flex-direction:column; gap:12px; }
.lg-fld{ display:flex; flex-direction:column; gap:6px; }
.lg-fld-k{ font-size:12px; font-weight:600; color:var(--ink-2); }
.lg-row{ display:flex; gap:8px; align-items:center; }
.lg-row .lg-inp{ flex:1; min-width:0; }
.lg-inp{ height:42px; padding:0 14px; border:1px solid rgba(31,26,20,.16); border-radius:11px; background:#fff; font:500 14px "IBM Plex Sans KR",sans-serif; color:var(--ink); outline:none; }
.lg-inp:focus{ border-color:var(--accent); box-shadow:0 0 0 3px color-mix(in oklab, var(--accent) 22%, transparent); }
.is-mono{ font-family:"JetBrains Mono",monospace; letter-spacing:.02em; }
.lg-btn{ appearance:none; height:40px; padding:0 18px; border-radius:11px; border:1px solid rgba(31,26,20,.16); background:#fff; color:var(--ink); font:600 13.5px "IBM Plex Sans KR",sans-serif; cursor:pointer; white-space:nowrap; }
.lg-btn:hover{ border-color:rgba(31,26,20,.32); }
.lg-btn.is-pri{ background:var(--ink); border-color:var(--ink); color:var(--card); }
.lg-btn.is-pri:hover{ background:color-mix(in oklab, var(--ink) 86%, var(--accent)); }
.lg-btn:disabled{ opacity:.4; cursor:not-allowed; }
.lg-btn.is-sm{ height:42px; padding:0 14px; font-size:12.5px; }
.lg-foot{ display:flex; justify-content:flex-end; gap:8px; padding:14px 24px 22px; }
.lg-msg{ font-size:12px; color:var(--ink-3); }
.lg-msg.is-err{ color:#B5462F; }
.lg-msg.is-info{ background:color-mix(in oklab, var(--accent) 12%, #fff); color:var(--ink); padding:9px 12px; border-radius:10px; }
.lg-timer{ font:600 13px "JetBrains Mono",monospace; color:var(--accent); min-width:44px; text-align:right; }
.lg-timer.is-warn{ color:#B5462F; }
.lg-result{ background:#fff; border:1px solid rgba(31,26,20,.1); border-radius:12px; padding:12px 14px; display:flex; flex-direction:column; gap:8px; }
.lg-result-k{ font-size:11px; color:var(--ink-3); font-weight:600; }
.lg-result-row{ display:flex; align-items:baseline; justify-content:space-between; gap:12px; font-size:13px; }
.lg-result-row b{ font-size:16px; }
.lg-result-row span{ color:var(--ink-2); font-size:12px; }
.lg-steps{ display:flex; align-items:center; gap:10px; font-size:12px; color:var(--ink-3); font-weight:600; }
.lg-steps .is-on{ color:var(--ink); } .lg-steps .is-done{ color:var(--accent); }
.lg-steps-line{ flex:1; height:1px; background:rgba(31,26,20,.14); }
.row-links a{ color:var(--ink-2);text-decoration:none; }
.row-links a:hover{ color:var(--ink);text-decoration:underline;text-underline-offset:3px; }
.dotsep{ width:3px;height:3px;border-radius:50%;background:var(--ink-3); }

/* submit */
.submit{
  appearance:none;border:0;cursor:pointer;
  width:100%;max-width:340px;height:52px;
  border-radius: 999px;
  background: var(--ink);color:#fff;
  font: 600 15px "IBM Plex Sans KR",ui-sans-serif,sans-serif;
  letter-spacing:.01em;
  display:flex;align-items:center;justify-content:center;gap:10px;
  position:relative;overflow:hidden;
  transition: transform .12s ease, background .2s ease, opacity .2s;
}
.submit::before{
  content:"";position:absolute;inset:0;border-radius:inherit;
  background: radial-gradient(120% 200% at 0% 0%, rgba(255,255,255,.18), transparent 50%);
  pointer-events:none;
}
.submit:hover{ background: #2a241c; transform: translateY(-1px); }
.submit:active{ transform: translateY(0); }
.submit:disabled{ cursor: default; }
.submit.is-loading .submit-arrow{
  animation: pulse 1s ease-in-out infinite;
}
@keyframes pulse{ 0%,100%{opacity:.4} 50%{opacity:1} }
.submit.is-success{ background: var(--good); }
.submit-arrow{ display:grid;place-items:center; }

/* card footer */
.card-foot{
  font-size:12px;color:var(--ink-3);
  display:flex;align-items:center;gap:8px;
}
.card-foot a{ color:var(--ink); text-decoration:none; font-weight:500; }
.card-foot a:hover{ text-decoration:underline; text-underline-offset:3px; }

.hint-demo{
  position:absolute;bottom:-28px;left:50%;transform:translateX(-50%);
  font-family:"JetBrains Mono",monospace;font-size:10px;
  color:var(--ink-3);letter-spacing:.04em;
  background:rgba(31,26,20,.04);padding:4px 10px;border-radius:999px;
  white-space:nowrap;
}

/* side panels */
.side{
  position:absolute;z-index:2;
  pointer-events:none;
}
.side-l{ left: max(40px, 6vw); top: 50%; transform: translateY(-50%); max-width: 320px; }
.side-r{ right: max(40px, 6vw); top: 50%; transform: translateY(-50%); max-width: 240px;
         display:flex;flex-direction:column;gap:14px;align-items:flex-end; }

.kicker{
  font-family:"JetBrains Mono",monospace;font-size:11px;
  letter-spacing:.18em;color:var(--ink-3);text-transform:uppercase;
  margin-bottom:14px;
}
.hero{
  font-family:"Gowun Batang", serif;
  font-weight:700;font-size: clamp(28px, 2.6vw, 38px);
  line-height:1.2;letter-spacing:-0.02em;color:var(--ink);
  margin:0 0 14px 0;
}
.sub{
  font-size:14px;line-height:1.55;color:var(--ink-2);
  margin:0 0 26px 0;max-width: 260px;
}
.stats{
  display:flex;flex-direction:column;gap:14px;
  padding:18px 0;border-top:1px solid rgba(31,26,20,.12);
}
.stat{ display:flex;flex-direction:column;gap:2px; }
.stat-k{
  font-family:"JetBrains Mono",monospace;font-size:10px;
  letter-spacing:.14em;color:var(--ink-3);text-transform:uppercase;
}
.stat-v{
  font-family:"Gowun Batang",serif;font-weight:700;
  font-size: 22px;color:var(--ink);letter-spacing:-0.01em;
}
.stat-sub{ font-size:11.5px;color:var(--ink-2); }

.chip{
  pointer-events:auto;
  display:inline-flex;align-items:center;gap:8px;
  background: rgba(251,248,242,.7);
  -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
  border:1px solid rgba(31,26,20,.14);
  border-radius:999px;padding:7px 12px;
  font-size:11.5px;color:var(--ink-2);
}
.chip-dot{
  width:6px;height:6px;border-radius:50%;background: var(--good);
  box-shadow:0 0 0 3px color-mix(in oklab, var(--good) 30%, transparent);
  animation: blink 2s ease-in-out infinite;
}
@keyframes blink{ 50%{opacity:.45} }
.chip-sep{ width:1px;height:10px;background:rgba(31,26,20,.18); }
.chip-mono{ font-family:"JetBrains Mono",monospace;color:var(--ink);
  font-variant-numeric: tabular-nums;
}
.chip-mono .ss{ color:var(--ink-3); }
.datechip{
  background: var(--ink);color:#FBF8F2;
  border-radius:18px;padding:12px 16px;
  display:flex;flex-direction:column;gap:2px;
}
.datechip .dc-day{
  font-family:"JetBrains Mono",monospace;font-size:13px;letter-spacing:.02em;
}
.datechip .dc-dow{
  font-size:11px;color:rgba(251,248,242,.6);
}

/* success overlay */
.success-overlay{
  position:fixed;inset:0;z-index:50;display:grid;place-items:center;
  background: rgba(241,236,227,.7);
  -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
  animation: fadeIn .25s ease;
}
.so-inner{ display:flex;flex-direction:column;align-items:center;gap:18px; }
.so-ring{
  width:46px;height:46px;border-radius:50%;
  border:2px solid rgba(31,26,20,.15);border-top-color: var(--ink);
  animation: spin2 .8s linear infinite;
}
.so-text{
  font-size:13px;color:var(--ink-2);letter-spacing:.02em;
  font-family:"JetBrains Mono",monospace;
}
@keyframes spin2{ to{transform:rotate(360deg)} }
@keyframes fadeIn{ from{opacity:0} }

/* responsive */
@media (max-width: 1180px){
  .side{ display:none; }
}
`;

(function injectCss(){
  if (document.getElementById('login-css')) return;
  const s = document.createElement('style');
  s.id = 'login-css';
  s.textContent = cssBase + css;
  document.head.appendChild(s);
})();

ReactDOM.createRoot(document.getElementById('app')).render(<LoginCard />);
