// signup.jsx — nonamed 회원가입 (로그인 카드와 같은 스타일, 2단계: 사업자 정보 → 계정 정보)
const { useState, useEffect, useRef } = React;

const SU_ACCENT = "#D97757", SU_INK = "#1F1A14", SU_CARD = "#FBF8F2";
const suFormatBiz = (v) => { const d = (v || "").replace(/\D/g, "").slice(0, 10); if (d.length < 4) return d; if (d.length < 6) return d.slice(0, 3) + "-" + d.slice(3); return d.slice(0, 3) + "-" + d.slice(3, 5) + "-" + d.slice(5); };
const suFormatPhone = (v) => { const d = (v || "").replace(/\D/g, "").slice(0, 11); if (d.length < 4) return d; if (d.length < 8) return d.slice(0, 3) + "-" + d.slice(3); return d.slice(0, 3) + "-" + d.slice(3, 7) + "-" + d.slice(7); };

function SuField({ k, label, value, onChange, type = "text", focused, setFocused, autoComplete, inputMode, right, err, inputRef }) {
  return (
    <div className="su-fw">
      <label className={`field ${focused === k ? "is-focus" : ""} ${value ? "is-filled" : ""} ${err ? "is-err" : ""}`}>
        <span className="field-label">{label}</span>
        <input ref={inputRef} type={type} value={value} autoComplete={autoComplete} inputMode={inputMode} spellCheck={false}
          onChange={(e) => onChange(e.target.value)} onFocus={() => setFocused(k)} onBlur={() => setFocused(null)} />
        {right || null}
      </label>
      {err ? <div className="hint hint-err" role="alert"><span className="dot" /> {err}</div> : null}
    </div>
  );
}

function SignupApp() {
  const [step, setStep] = useState(1);
  const [f, setF] = useState({ company: "", ceo: "", biz: "", phone: "", id: "", pw: "", pw2: "", email: "", agree: false });
  const [errs, setErrs] = useState({});
  const [focused, setFocused] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const firstRef = useRef(null);
  const set = (k) => (v) => { setF(p => ({ ...p, [k]: v })); setErrs(e => { const n = { ...e }; delete n[k]; return n; }); };
  useEffect(() => { setTimeout(() => firstRef.current?.focus(), 60); }, [step]);

  const validate1 = () => {
    const n = {};
    if (!f.company.trim()) n.company = "상호(회사명)를 입력해 주세요.";
    if (!f.ceo.trim()) n.ceo = "대표자명을 입력해 주세요.";
    if (f.biz && f.biz.replace(/\D/g, "").length !== 10) n.biz = "사업자등록번호는 10자리입니다.";
    if (f.phone.replace(/\D/g, "").length < 10) n.phone = "휴대전화 번호를 확인해 주세요.";
    return n;
  };
  const validate2 = () => {
    const n = {};
    if (!/^[a-z0-9_]{4,20}$/i.test(f.id)) n.id = "아이디는 영문·숫자 4~20자입니다.";
    if (f.pw.length < 8) n.pw = "비밀번호는 8자 이상이어야 합니다.";
    if (f.pw2 !== f.pw) n.pw2 = "비밀번호가 일치하지 않습니다.";
    if (f.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) n.email = "이메일 형식을 확인해 주세요.";
    if (!f.agree) n.agree = "이용약관과 개인정보 처리방침에 동의해 주세요.";
    return n;
  };
  const next = (e) => { e.preventDefault(); const n = validate1(); setErrs(n); if (Object.keys(n).length) return; setStep(2); };
  const submit = (e) => {
    e.preventDefault();
    const n = validate2(); setErrs(n); if (Object.keys(n).length) return;
    setSubmitting(true);
    setTimeout(() => {
      try {
        const k = "nonamed.users.v1"; const list = JSON.parse(localStorage.getItem(k)) || [];
        if (list.some(u => u.id === f.id)) { setSubmitting(false); setErrs({ id: "이미 사용 중인 아이디입니다." }); return; }
        list.push({ id: f.id, pw: f.pw, company: f.company, ceo: f.ceo, biz: f.biz, phone: f.phone, email: f.email, at: new Date().toISOString() });
        localStorage.setItem(k, JSON.stringify(list));
      } catch (err) {}
      setSubmitting(false); setDone(true);
      setTimeout(() => { window.location.href = "login.html"; }, 1400);
    }, 700);
  };

  const eye = <button type="button" className="field-eye" onClick={() => setShowPw(s => !s)} aria-label={showPw ? "숨기기" : "표시"}>{showPw ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/></svg> : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8s2.5-4.5 6-4.5c1.3 0 2.5.4 3.5 1M14 8s-2.5 4.5-6 4.5c-1.3 0-2.5-.4-3.5-1M2 2l12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>}</button>;

  return (
    <div className="wrap" style={{ "--accent": SU_ACCENT, "--ink": SU_INK, "--card": SU_CARD }}>
      <form className={`card card-rounded su-card ${done ? "is-success" : ""}`} onSubmit={step === 1 ? next : submit} noValidate>
        <div className="card-brand">
          <SketchLogo size={38} />
          <div className="card-brand-text"><div className="cb-title">nonamed</div><div className="cb-sub">SALES SUITE · SIGN UP</div></div>
        </div>

        <div className="su-steps" aria-label="진행 단계">
          <span className={`su-step ${step === 1 ? "is-on" : "is-done"}`}><i>1</i>사업자 정보</span>
          <span className="su-step-line" />
          <span className={`su-step ${step === 2 ? "is-on" : ""}`}><i>2</i>계정 정보</span>
        </div>

        {step === 1 ? (
          <div className="fields su-fields">
            <SuField k="company" label="상호 (회사명)" value={f.company} onChange={set("company")} focused={focused} setFocused={setFocused} err={errs.company} inputRef={firstRef} autoComplete="organization" />
            <div className="su-2col">
              <SuField k="ceo" label="대표자" value={f.ceo} onChange={set("ceo")} focused={focused} setFocused={setFocused} err={errs.ceo} autoComplete="name" />
              <SuField k="biz" label="사업자등록번호" value={f.biz} onChange={(v) => set("biz")(suFormatBiz(v))} focused={focused} setFocused={setFocused} err={errs.biz} inputMode="numeric" />
            </div>
            <SuField k="phone" label="휴대전화" value={f.phone} onChange={(v) => set("phone")(suFormatPhone(v))} focused={focused} setFocused={setFocused} err={errs.phone} inputMode="tel" autoComplete="tel" />
          </div>
        ) : (
          <div className="fields su-fields">
            <SuField k="id" label="아이디" value={f.id} onChange={set("id")} focused={focused} setFocused={setFocused} err={errs.id} inputRef={firstRef} autoComplete="username" />
            <SuField k="pw" label="비밀번호 (8자 이상)" type={showPw ? "text" : "password"} value={f.pw} onChange={set("pw")} focused={focused} setFocused={setFocused} err={errs.pw} autoComplete="new-password" right={eye} />
            <SuField k="pw2" label="비밀번호 확인" type={showPw ? "text" : "password"} value={f.pw2} onChange={set("pw2")} focused={focused} setFocused={setFocused} err={errs.pw2} autoComplete="new-password" />
            <SuField k="email" label="이메일 (선택)" type="email" value={f.email} onChange={set("email")} focused={focused} setFocused={setFocused} err={errs.email} autoComplete="email" />
            <div className="su-agree">
              <button type="button" className={`check ${f.agree ? "on" : ""}`} onClick={() => set("agree")(!f.agree)} aria-pressed={f.agree}>
                <span className="check-box">{f.agree ? <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5.2l2 2L8 3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg> : null}</span>
                <span><a href="#" onClick={(e) => e.preventDefault()}>이용약관</a> 및 <a href="#" onClick={(e) => e.preventDefault()}>개인정보 처리방침</a>에 동의합니다</span>
              </button>
              {errs.agree ? <div className="hint hint-err" role="alert"><span className="dot" /> {errs.agree}</div> : null}
            </div>
          </div>
        )}

        <div className="su-actions">
          {step === 2 ? <button type="button" className="su-back" onClick={() => { setErrs({}); setStep(1); }}>← 이전</button> : <span />}
          <button type="submit" className={`submit ${submitting ? "is-loading" : ""} ${done ? "is-success" : ""}`} disabled={submitting || done}>
            <span className="submit-label">{done ? "가입 완료" : submitting ? "처리 중…" : step === 1 ? "다음" : "가입하기"}</span>
            <span className="submit-arrow" aria-hidden="true">{done ? <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 7.3l2.6 2.6L11 4.4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg> : <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}</span>
          </button>
        </div>

        <div className="su-social"><span className="su-social-k">간편 가입</span>{[["kakao", "K", "#FEE500", "#191600", "카카오"], ["naver", "N", "#03C75A", "#fff", "네이버"], ["google", "G", "#fff", "#1F1A14", "구글"]].map(([k, m, bg, fg, lb]) => <a key={k} href={"login.html?social=" + k} className="su-soc" style={{ background: bg, color: fg }} title={lb + "로 계속하기"}>{m}</a>)}</div>
        <div className="card-foot"><span>이미 계정이 있으신가요?</span><a href="login.html">로그인 →</a></div>
      </form>

      {done ? <div className="success-overlay" role="status"><div className="so-inner"><div className="so-ring" /><div className="so-text">가입이 완료되었습니다. 로그인 화면으로 이동합니다…</div></div></div> : null}
    </div>
  );
}

const suCss = `
.wrap{ position:relative; display:grid; place-items:center; width:100%; }
.card{ position:relative; z-index:2; background:var(--card); border:1px solid rgba(31,26,20,.55); box-shadow:0 0 0 6px rgba(251,248,242,.7),0 30px 80px -20px rgba(31,26,20,.18),0 8px 24px -8px rgba(31,26,20,.10); display:flex; flex-direction:column; align-items:center; gap:22px; transition:transform .35s ease; }
.card-rounded{ border-radius:36px; padding:48px 56px 40px; }
.su-card{ width:min(560px, 94vw); }
.card.is-success{ transform:scale(.985); }
.card-brand{ display:flex; align-items:center; gap:12px; }
.card-brand-text .cb-title{ font-weight:700; font-size:18px; letter-spacing:-0.01em; font-family:"Gowun Batang","IBM Plex Sans KR",serif; }
.card-brand-text .cb-sub{ font-family:"JetBrains Mono",monospace; font-size:9.5px; letter-spacing:.16em; color:var(--ink-3); margin-top:2px; }
.su-steps{ display:flex; align-items:center; gap:10px; font-size:12px; color:var(--ink-3); }
.su-step{ display:flex; align-items:center; gap:6px; }
.su-step i{ font-style:normal; width:18px; height:18px; border-radius:50%; display:grid; place-items:center; border:1.2px solid var(--ink-3); font:600 10px "JetBrains Mono",monospace; }
.su-step.is-on{ color:var(--ink); font-weight:600; } .su-step.is-on i{ background:var(--ink); border-color:var(--ink); color:#fff; }
.su-step.is-done i{ background:var(--accent); border-color:var(--accent); color:#fff; }
.su-step-line{ width:36px; height:1px; background:rgba(31,26,20,.2); }
.fields{ display:flex; flex-direction:column; gap:10px; width:100%; max-width:380px; }
.su-fw{ display:flex; flex-direction:column; gap:4px; min-width:0; }
.su-2col{ display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.field{ position:relative; display:flex; align-items:center; border-radius:999px; background:rgba(31,26,20,.04); border:1px solid transparent; transition:background .2s,border-color .2s,box-shadow .2s; padding:0 14px 0 16px; height:48px; }
.field.is-focus{ background:#fff; border-color:var(--ink); box-shadow:0 0 0 4px rgba(31,26,20,.06); }
.field.is-err{ border-color:var(--bad); }
.field-label{ position:absolute; left:18px; top:50%; transform:translateY(-50%); font-size:14px; color:var(--ink-3); pointer-events:none; white-space:nowrap; transition:transform .18s,font-size .18s,color .18s,top .18s; }
.field.is-focus .field-label,.field.is-filled .field-label{ top:9px; transform:none; font-size:10px; color:var(--ink-2); letter-spacing:.04em; font-weight:500; }
.field input{ appearance:none; border:0; outline:0; background:transparent; width:100%; height:100%; padding:14px 0 0; font:500 14.5px "IBM Plex Sans KR",sans-serif; color:var(--ink); min-width:0; }
.field-eye{ appearance:none; border:0; background:transparent; width:24px; height:24px; border-radius:50%; display:grid; place-items:center; color:var(--ink-3); cursor:pointer; flex-shrink:0; }
.field-eye:hover{ background:rgba(31,26,20,.08); color:var(--ink); }
.hint{ display:flex; align-items:center; gap:8px; font-size:12px; padding:0 8px; }
.hint .dot{ width:6px; height:6px; border-radius:50%; background:currentColor; flex:none; }
.hint-err{ color:var(--bad); }
.su-agree{ display:flex; flex-direction:column; gap:6px; padding:4px 6px 0; font-size:12.5px; color:var(--ink-2); }
.check{ appearance:none; border:0; background:transparent; color:var(--ink-2); display:flex; align-items:flex-start; gap:8px; cursor:pointer; font:inherit; padding:0; text-align:left; }
.check-box{ width:16px; height:16px; border-radius:6px; border:1.2px solid var(--ink-2); display:grid; place-items:center; color:var(--card); flex:none; margin-top:1px; transition:background .15s,border-color .15s; }
.check.on .check-box{ background:var(--ink); border-color:var(--ink); }
.check a{ color:var(--ink); font-weight:500; text-decoration:underline; text-underline-offset:3px; }
.su-actions{ display:flex; align-items:center; gap:12px; width:100%; max-width:380px; }
.su-back{ appearance:none; border:0; background:transparent; color:var(--ink-2); font:500 13px "IBM Plex Sans KR",sans-serif; cursor:pointer; padding:8px 6px; white-space:nowrap; }
.su-back:hover{ color:var(--ink); }
.submit{ appearance:none; border:0; cursor:pointer; flex:1; height:52px; border-radius:999px; background:var(--ink); color:#fff; font:600 15px "IBM Plex Sans KR",sans-serif; display:flex; align-items:center; justify-content:center; gap:10px; position:relative; overflow:hidden; transition:transform .12s,background .2s; }
.submit:hover{ background:#2a241c; transform:translateY(-1px); } .submit:disabled{ cursor:default; }
.submit.is-loading .submit-arrow{ animation:suPulse 1s ease-in-out infinite; } @keyframes suPulse{ 0%,100%{opacity:.4} 50%{opacity:1} }
.submit.is-success{ background:var(--good); }
.card-foot{ font-size:12px; color:var(--ink-3); display:flex; align-items:center; gap:8px; }
.card-foot a{ color:var(--ink); text-decoration:none; font-weight:500; } .card-foot a:hover{ text-decoration:underline; text-underline-offset:3px; }
.success-overlay{ position:fixed; inset:0; z-index:20; display:grid; place-items:center; background:rgba(241,236,227,.72); backdrop-filter:blur(4px); }
.so-inner{ display:flex; flex-direction:column; align-items:center; gap:14px; color:var(--ink-2); font-size:14px; }
.so-ring{ width:36px; height:36px; border-radius:50%; border:2px solid rgba(31,26,20,.15); border-top-color:var(--good); animation:suSpin .9s linear infinite; } @keyframes suSpin{ to{ transform:rotate(360deg); } }
@media (max-width:560px){ .card-rounded{ padding:36px 24px 30px; } .su-2col{ grid-template-columns:1fr; } }
`;
(function(){ const s = document.createElement("style"); s.id = "signup-css"; s.textContent = suCss + '.su-social{display:flex;align-items:center;justify-content:center;gap:10px;margin-top:4px}.su-social-k{font-size:11.5px;color:var(--ink-3,#8B8273);margin-right:2px}.su-soc{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;font:800 13px "IBM Plex Sans KR",sans-serif;text-decoration:none;box-shadow:inset 0 0 0 1px rgba(31,26,20,.1),0 2px 6px -2px rgba(31,26,20,.22)}.su-soc:hover{transform:translateY(-1px)}'; document.head.appendChild(s); })();

ReactDOM.createRoot(document.getElementById("app")).render(<SignupApp />);
