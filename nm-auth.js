/* nm-auth.js — Supabase 로그인·회사 연동 (3단계)
   모든 화면에서 supabase-js · supabase-config.js 다음, babel 스크립트 전에 로드.
   화면 코드(account.jsx 등)는 기존처럼 localStorage 캐시(nonamed.session.v1 / nonamed.companies.v1)를 읽고,
   이 파일이 로그인할 때·화면을 열 때마다 서버(nm_* 표)에서 그 캐시를 다시 채운다. */
(function () {
  var cfg = window.NM_SUPABASE || {};
  var LS_SESSION = "nonamed.session.v1", LS_COMP = "nonamed.companies.v1", ALIVE = "nonamed.sessionAlive.v1";
  var page = decodeURIComponent(location.pathname.split("/").pop() || "");
  var isAuthPage = /^(login|signup)\.html$/.test(page);
  var base = location.href.split("#")[0].split("?")[0].replace(/[^/]*$/, "");

  var sb = null;
  if (cfg.url && cfg.anonKey && window.supabase && window.supabase.createClient) {
    sb = window.supabase.createClient(cfg.url, cfg.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: "nonamed.sb.auth" }
    });
  } else {
    console.warn("[nonamed] Supabase 설정이 없어 브라우저 저장 모드로 동작합니다.");
  }

  function rd(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function wr(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function emit() { window.dispatchEvent(new CustomEvent("nonamed:account")); }
  function clearLocal() {
    try { localStorage.removeItem(LS_SESSION); localStorage.removeItem(LS_COMP); sessionStorage.removeItem(ALIVE); } catch (e) {}
  }

  /* Supabase 오류 → 한국어 문구 */
  function errMsg(err) {
    var m = String((err && (err.message || err.error_description)) || err || "");
    if (/Invalid login credentials/i.test(m)) return "이메일 또는 비밀번호가 올바르지 않습니다.";
    if (/Email not confirmed/i.test(m)) return "이메일 인증이 아직 안 됐습니다. 받은 메일의 링크를 누른 뒤 로그인해 주세요.";
    if (/already registered|already been registered|User already exists/i.test(m)) return "이미 가입된 이메일입니다. 로그인하거나 비밀번호를 재설정해 주세요.";
    if (/Password should be at least/i.test(m)) return "비밀번호가 너무 짧습니다.";
    if (/rate limit|For security purposes|too many/i.test(m)) return "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
    if (/invalid.*email|Unable to validate email/i.test(m)) return "이메일 형식을 확인해 주세요.";
    if (/Auth session missing|JWT expired|refresh token/i.test(m)) return "로그인이 만료되었습니다. 다시 로그인해 주세요.";
    if (/일치하는 회사가 없습니다/.test(m)) return "일치하는 회사가 없습니다. 초대코드를 다시 확인해 주세요.";
    if (/Failed to fetch|NetworkError/i.test(m)) return "서버에 연결할 수 없습니다. 인터넷 연결을 확인해 주세요.";
    return m || "알 수 없는 오류가 발생했습니다.";
  }
  function need() { if (!sb) throw new Error("Supabase 설정(supabase-config.js)이 비어 있습니다."); }
  function chk(r) { if (r && r.error) throw r.error; return r ? r.data : null; }

  /* 서버 → localStorage 캐시 */
  async function sync() {
    need();
    var sess = chk(await sb.auth.getSession()).session;
    if (!sess) return null;
    var u = sess.user, meta = u.user_metadata || {};
    var prof = chk(await sb.from("nm_profiles").select("name,phone").eq("id", u.id).maybeSingle());
    var name = (prof && prof.name) || meta.name || String(u.email || "").split("@")[0];
    var mine = chk(await sb.from("nm_members").select("company_id").eq("user_id", u.id)) || [];
    var ids = mine.map(function (m) { return m.company_id; });
    var comps = [];
    if (ids.length) {
      var cs = chk(await sb.from("nm_companies").select("*").in("id", ids)) || [];
      var ms = chk(await sb.from("nm_members").select("company_id,user_id,name,email,role,joined_at").in("company_id", ids)) || [];
      comps = cs.map(function (c) {
        return {
          id: c.id, name: c.name, ceo: c.ceo || "", biz: c.biz || "", phone: c.phone || "", owner: c.owner, invite: c.invite,
          created: c.created_at, trialEnd: c.trial_end, billing: c.billing || null, perms: c.perms || null,
          members: ms.filter(function (m) { return m.company_id === c.id; }).map(function (m) {
            return { userId: m.user_id, name: m.name || m.email || "구성원", email: m.email || "", role: m.role, joined: m.joined_at };
          })
        };
      });
    }
    var old = rd(LS_SESSION, {}) || {};
    var cur = comps.filter(function (c) { return c.id === old.companyId; })[0] || comps[0] || null;
    var me = cur ? cur.members.filter(function (m) { return m.userId === u.id; })[0] : null;
    var s = {
      id: u.id, email: u.email, ceo: name, at: old.at || Date.now(), keep: !!old.keep, exp: old.exp || null,
      companyId: cur ? cur.id : null, company: cur ? cur.name : "", role: me ? me.role : null
    };
    wr(LS_COMP, comps); wr(LS_SESSION, s); emit();
    return s;
  }

  function markLogin(keep) {
    wr(LS_SESSION, { at: Date.now(), keep: !!keep, exp: keep ? Date.now() + 30 * 864e5 : null });
    try { if (keep) sessionStorage.removeItem(ALIVE); else sessionStorage.setItem(ALIVE, "1"); } catch (e) {}
  }

  async function createCompanyFromMeta(meta) {
    if (!meta || !meta.company) return false;
    chk(await sb.rpc("nm_create_company", { p_name: meta.company, p_ceo: meta.name || null, p_biz: meta.biz || null, p_phone: meta.phone || null }));
    return true;
  }

  async function signIn(email, pw, keep) {
    need();
    var d = chk(await sb.auth.signInWithPassword({ email: String(email).trim(), password: pw }));
    markLogin(keep);
    var s = await sync();
    // 가입할 때 적은 회사 정보가 있고 아직 회사가 없으면 자동으로 회사 생성(관리자)
    if (s && !s.companyId && await createCompanyFromMeta(d.user && d.user.user_metadata)) s = await sync();
    return s;
  }

  async function signUp(f) {
    need();
    var d = chk(await sb.auth.signUp({
      email: String(f.email).trim(), password: f.pw,
      options: { data: { name: f.name || "", phone: f.phone || "", company: f.company || "", biz: f.biz || "" }, emailRedirectTo: base + "login.html" }
    }));
    // 이메일 인증을 켜 둔 경우 이미 가입된 이메일이면 identities 가 비어서 온다
    if (d.user && d.user.identities && d.user.identities.length === 0) throw new Error("User already registered");
    if (!d.session) return { needConfirm: true };
    markLogin(false);
    await sync();
    await createCompanyFromMeta(d.user && d.user.user_metadata);
    await sync();
    return { needConfirm: false };
  }

  async function resetPw(email) {
    need();
    chk(await sb.auth.resetPasswordForEmail(String(email).trim(), { redirectTo: base + "login.html?reset=1" }));
  }
  async function updatePw(pw) { need(); chk(await sb.auth.updateUser({ password: pw })); }

  async function signOut() {
    // scope:"local" — 이 브라우저만 로그아웃 (같은 계정의 trade-system 로그인은 유지)
    try { if (sb) await sb.auth.signOut({ scope: "local" }); } catch (e) {}
    clearLocal();
    location.href = "login.html";
  }

  async function createCompany(f) {
    need();
    var c = chk(await sb.rpc("nm_create_company", { p_name: String(f.name || "").trim(), p_ceo: f.ceo || null, p_biz: f.biz || null, p_phone: f.phone || null }));
    var row = Array.isArray(c) ? c[0] : c;
    var s = rd(LS_SESSION, {}) || {}; if (row && row.id) wr(LS_SESSION, Object.assign({}, s, { companyId: row.id }));
    return sync();
  }
  async function joinCompany(code) {
    need();
    var c = chk(await sb.rpc("nm_join_company", { p_code: String(code || "") }));
    var row = Array.isArray(c) ? c[0] : c;
    var s = rd(LS_SESSION, {}) || {}; if (row && row.id) wr(LS_SESSION, Object.assign({}, s, { companyId: row.id }));
    return sync();
  }

  /* 회사 정보·권한·구성원 변경을 서버에 반영 (결제 정보는 5단계 서버 함수만 기록) */
  async function saveCompany(next, prev) {
    need();
    chk(await sb.from("nm_companies").update({
      name: next.name, ceo: next.ceo || null, biz: next.biz || null, phone: next.phone || null, invite: next.invite, perms: next.perms || null
    }).eq("id", next.id));
    var before = (prev && prev.members) || [];
    for (var i = 0; i < next.members.length; i++) {
      var m = next.members[i], p = before.filter(function (x) { return x.userId === m.userId; })[0];
      if (p && p.role !== m.role) chk(await sb.from("nm_members").update({ role: m.role }).eq("company_id", next.id).eq("user_id", m.userId));
    }
    for (var j = 0; j < before.length; j++) {
      var q = before[j];
      if (!next.members.some(function (x) { return x.userId === q.userId; }))
        chk(await sb.from("nm_members").delete().eq("company_id", next.id).eq("user_id", q.userId));
    }
    return sync();
  }

  var recovery = /[?&]reset=1/.test(location.search) || /type=recovery/.test(location.hash);
  if (sb) sb.auth.onAuthStateChange(function (ev) {
    if (ev === "PASSWORD_RECOVERY") { recovery = true; window.nmAuth.recovery = true; window.dispatchEvent(new CustomEvent("nonamed:recovery")); }
  });

  window.nmAuth = {
    sb: sb, on: !!sb, recovery: recovery, errMsg: errMsg,
    sync: sync, signIn: signIn, signUp: signUp, resetPw: resetPw, updatePw: updatePw, signOut: signOut,
    createCompany: createCompany, joinCompany: joinCompany, saveCompany: saveCompany,
    getSession: async function () { if (!sb) return null; return chk(await sb.auth.getSession()).session; }
  };

  /* 앱 화면 보호: 로그인 안 했으면 로그인 화면으로, 했으면 회사·권한 캐시 갱신 */
  if (sb && !isAuthPage) {
    var ls = rd(LS_SESSION, null);
    var alive = false; try { alive = !!sessionStorage.getItem(ALIVE); } catch (e) {}
    if (ls && !ls.keep && !alive) { signOut(); return; }           // "로그인 유지" 안 하고 브라우저를 닫았다 연 경우
    if (ls && ls.keep && ls.exp && ls.exp < Date.now()) { signOut(); return; } // 30일 지남
    sb.auth.getSession().then(function (r) {
      if (!r.data || !r.data.session) { clearLocal(); location.replace("login.html"); return; }
      sync().catch(function (e) { console.warn("[nonamed] 동기화 실패:", errMsg(e)); });
    });
  }
})();
