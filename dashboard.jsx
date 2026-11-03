// dashboard.jsx — nonamed ERP 대시보드 (KPI · 메뉴 · 오늘 할 일 · 매출 추이)

const { useState, useEffect, useMemo, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "여유",
  "showTodos": true,
  "showChart": true,
  "showActivity": true
} /*EDITMODE-END*/;

/* nav targets per sidebar key — keep parity with 주문관리.jsx */

/* ─────────────────────────────────────────────
   Sketchy circle logo
   ───────────────────────────────────────────── */

/* ─────────────────────────────────────────────
   Icons
   ───────────────────────────────────────────── */
const I = {
  home: <svg viewBox="0 0 24 24" fill="none"><circle cx="8.5" cy="8.5" r="1.7" fill="currentColor"/><circle cx="15.5" cy="8.5" r="1.7" fill="currentColor"/><circle cx="8.5" cy="15.5" r="1.7" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.7" fill="currentColor"/></svg>,
  partners: <svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="9" r="2" fill="currentColor"/><circle cx="15.5" cy="9" r="2" fill="currentColor"/><path d="M5 16.5h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  items: <svg viewBox="0 0 24 24" fill="none"><circle cx="6.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="6.5" cy="12" r="1.5" fill="currentColor"/><circle cx="6.5" cy="16.5" r="1.5" fill="currentColor"/><path d="M11 7.5h8M11 12h8M11 16.5h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  orders: <svg viewBox="0 0 24 24" fill="none"><circle cx="6.5" cy="8" r="1.5" fill="currentColor"/><circle cx="6.5" cy="15" r="1.5" fill="currentColor"/><path d="M11 8h8M11 15h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  sales: <svg viewBox="0 0 24 24" fill="none"><path d="M5 16l5-5 3 3 6-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="19" cy="7" r="1.7" fill="currentColor"/></svg>,
  purchase: <svg viewBox="0 0 24 24" fill="none"><path d="M5 8l5 5 3-3 6 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="19" cy="17" r="1.7" fill="currentColor"/></svg>,
  collect: <svg viewBox="0 0 24 24" fill="none"><path d="M6 9h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="17.5" cy="9" r="1.6" fill="currentColor"/><path d="M6 15h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="6.5" cy="15" r="1.6" fill="currentColor"/></svg>,
  tax: <svg viewBox="0 0 24 24" fill="none"><circle cx="8.5" cy="8.5" r="1.7" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.7" fill="currentColor"/><path d="M17 7L7 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,

  stock: <svg viewBox="0 0 24 24" fill="none"><path d="M4 9l8-4 8 4v8l-8 4-8-4V9z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M4 9l8 4 8-4M12 13v8" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>,
  search: <svg viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.6" /><path d="M16 16l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>,
  chevron: <svg viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  arrow: <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,

  alert: <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 8v5M12 16v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>,
  phone: <svg viewBox="0 0 24 24" fill="none"><path d="M5 4l4 1 1 5-2 1c.7 2.8 3 5.1 5.8 5.8l1-2 5 1 1 4c-9.4 1.2-16-5.4-15.8-14.8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>,
  pkg: <svg viewBox="0 0 24 24" fill="none"><rect x="4" y="8" width="16" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6" /><path d="M4 12h16M9 4h6l2 4H7l2-4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>,
  doc: <svg viewBox="0 0 24 24" fill="none"><path d="M6 3h9l4 4v14H6V3z" stroke="currentColor" strokeWidth="1.6" /><path d="M15 3v4h4" stroke="currentColor" strokeWidth="1.6" /></svg>,

  trend: <svg viewBox="0 0 24 24" fill="none"><path d="M3 17l5-5 4 3 6-7M14 8h6v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
};

/* ─────────────────────────────────────────────
   Data
   ───────────────────────────────────────────── */


const KPIS = [
{ k: "오늘 주문", v: "12", unit: "건", delta: "+3 vs 어제", trend: "up" },
{ k: "오늘 매출", v: "3,840,000", unit: "원", delta: "+14% vs 어제", trend: "up" },
{ k: "받을 돈", v: "860,000", unit: "원", delta: "미수금 2건", trend: "warn" },
{ k: "발행 대기", v: "4", unit: "건", delta: "세금계산서", trend: "flat" }];


const MENU_CARDS = [
{ key: "partners", title: "거래처관리", desc: "납품처와 매입처를 등록·관리합니다.", stat: "등록 128곳", statSub: "이번 주 +3" },
{ key: "items", title: "품목관리", desc: "판매 품목, 가격, 단위, 재고를 관리합니다.", stat: "품목 2,415개", statSub: "품절 임박 6" },
{ key: "orders", title: "주문접수", desc: "전화·문자로 받은 주문을 빠르게 입력합니다.", stat: "오늘 12건", statSub: "확인 필요 2", hot: true },
{ key: "sales", title: "매출관리", desc: "일자별 매출과 거래 내역을 보여드립니다.", stat: "오늘 384만원", statSub: "전일 대비 +14%" },
{ key: "collect", title: "수금관리", desc: "받으실 돈과 입금 내역을 확인하세요.", stat: "미수금 2건", statSub: "합계 86만원" },
{ key: "tax", title: "세금계산서", desc: "세금계산서를 발행하고 조회합니다.", stat: "발행 대기 4건", statSub: "이번 달 21건" }];


const TODOS = [
{ id: 1, icon: "alert", tone: "new", text: "확인 필요한 새 주문", sub: "한양식자재 · 송파유통", count: 2, action: "확인하기", href: "매출관리.html" },
{ id: 2, icon: "phone", tone: "warn", text: "미수금 독촉 안내", sub: "7일 이상 미입금 거래처", count: 1, action: "연락하기", href: "#collect" },
{ id: 3, icon: "doc", tone: "info", text: "세금계산서 발행 대기", sub: "이번 주 마감 4건", count: 4, action: "발행하기", href: "#tax" },
{ id: 4, icon: "pkg", tone: "warn", text: "재고 임박 품목", sub: "오늘 입고 예정 없음", count: 6, action: "품목 보기", href: "품목리스트.html" }];


const SALES_BARS = [
{ d: "월", v: 2.4, label: "2,410,000" },
{ d: "화", v: 3.1, label: "3,120,000" },
{ d: "수", v: 2.8, label: "2,840,000" },
{ d: "목", v: 4.2, label: "4,210,000" },
{ d: "금", v: 3.6, label: "3,650,000" },
{ d: "토", v: 1.8, label: "1,840,000" },
{ d: "일", v: 3.84, label: "3,840,000", today: true }];


const ACTIVITY = [
{ t: "14:32", icon: "orders", tone: "accent", text: "한양식자재 주문 접수", meta: "384,000원 · 김치 외 3건" },
{ t: "13:18", icon: "orders", tone: "accent", text: "송파유통 주문 접수", meta: "128,000원 · 라면 외 2건" },
{ t: "12:55", icon: "collect", tone: "ink", text: "마포정육점 입금 확인", meta: "248,500원 · 7일 미수금 해소" },
{ t: "11:20", icon: "tax", tone: "ink", text: "종로식자재마트 세금계산서 발행", meta: "1,284,000원 · 5월 21장째" },
{ t: "09:30", icon: "items", tone: "ink", text: "품목 단가 수정 · 백김치", meta: "4,800 → 5,200원" }];


/* ─────────────────────────────────────────────
   Sidebar (parity with 주문관리.jsx)
   ───────────────────────────────────────────── */

/* ─────────────────────────────────────────────
   Top search bar
   ───────────────────────────────────────────── */
function TopSearch({ value, onChange }) {
  const q = value, setQ = onChange;
  const ref = useRef(null);

  useEffect(() => {
    const fn = (e) => {
      if (e.key !== "/") return;
      const a = document.activeElement;
      if (a && /input|textarea|select/i.test(a.tagName)) return;
      e.preventDefault();
      ref.current?.focus();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  return (
    <header className="topbar">
      <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
        <span className="search-icon">{I.search}</span>
        <input
          ref={ref}
          className="search-input"
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="거래처 또는 품목을 입력하면 전체 화면에 적용됩니다"
          autoComplete="off"
          spellCheck={false} />
        
        <span className="search-kbd"><kbd>/</kbd></span>
      </form>

      <div className="topbar-right">
        {window.AccountMenu ? <window.AccountMenu chevron={<span className="user-chev">{I.chevron}</span>} /> : null}
      </div>
    </header>);

}

/* ─────────────────────────────────────────────
   Dashboard widgets — 매출/매입/입출금/거래처/품목 데이터 기반
   ───────────────────────────────────────────── */
const H = window.HANA;

const WIDGETS = [
  { key: "kpi", label: "매출 요약" },
  { key: "compare", label: "매출·매입 비교" },
  { key: "stats", label: "거래처/품목 요약" },
  { key: "recent", label: "최근 전표" },
  { key: "status", label: "전표 상태" },
];

const WIDGET_OPTS = {
  kpi: { src: { label: "기준", type: "select", options: ["매출", "매입"], def: "매출" }, chart: { label: "차트 형태", type: "select", options: ["막대", "선"], def: "막대" } },
  compare: { metric: { label: "값", type: "select", options: ["합계액", "공급가액"], def: "합계액" }, prev: { label: "매입선", type: "select", options: ["표시", "숨김"], def: "표시" } },
  stats: { basis: { label: "기준", type: "select", options: ["거래처별", "품목별"], def: "거래처별" }, sort: { label: "정렬", type: "select", options: ["매출순", "이름순"], def: "매출순" }, rows: { label: "행 수", type: "select", options: ["4", "6", "8"], def: "6" } },
  recent: { kind: { label: "구분", type: "select", options: ["전체", "매출", "매입", "입출금"], def: "전체" }, rows: { label: "행 수", type: "select", options: ["4", "6", "8"], def: "6" } },
  status: { shape: { label: "차트 형태", type: "select", options: ["도넛", "막대"], def: "도넛" }, src: { label: "대상", type: "select", options: ["매출", "매입", "전체"], def: "전체" } },
};

const C1 = "var(--accent)";
const C2 = "color-mix(in oklab, var(--ink) 45%, #fff)";

function Spark({ data, color = C1 }) {
  if (!data.length) return null;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => (i / Math.max(1, data.length - 1)) * 100 + "," + (28 - ((v - min) / (max - min || 1)) * 24)).join(" ");
  return <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="spark"><polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinejoin="round" /></svg>;
}

function Empty({ msg = "해당 조건의 자료가 없습니다." }) {
  return <div className="dw-empty">{msg}</div>;
}

function OptPopover({ wkey, opt, setOpt, onClose }) {
  const defs = WIDGET_OPTS[wkey] || {};
  return (
    <div className="dw-pop" onMouseDown={(e) => e.stopPropagation()}>
      <div className="dw-pop-head">조건 설정</div>
      {Object.entries(defs).map(([k, d]) => (
        <label key={k} className="dw-pop-row">
          <span>{d.label}</span>
          <select value={opt[k] != null ? opt[k] : d.def} onChange={(e) => setOpt(wkey, k, e.target.value)}>
            {d.options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </label>
      ))}
      <div className="dw-pop-foot"><button type="button" onClick={onClose}>닫기</button></div>
    </div>
  );
}

function Card({ wkey, title, right, cfg, onRemove, span = 3, onResize, drag, opt = {}, setOpt, children }) {
  const [openOpt, setOpenOpt] = useState(false);
  return (
    <section className={"dw " + (cfg ? "is-cfg" : "")} style={{ gridColumn: "span " + span }} {...(cfg ? drag(wkey) : {})}>
      <header className="dw-head">
        <h2 className="dw-title">{title}</h2>
        <div className="dw-right">
          {right}
          <button type="button" className={"dw-cog " + (openOpt ? "is-on" : "")} title="설정" onClick={() => setOpenOpt(v => !v)}>⚙</button>
          {cfg ? <button type="button" className="dw-rm" title="숨기기" onClick={() => onRemove(wkey)}>×</button> : null}
          {openOpt ? <OptPopover wkey={wkey} opt={opt} setOpt={setOpt} onClose={() => setOpenOpt(false)} /> : null}
        </div>
      </header>
      {children}
      {cfg ? <span className="dw-rz" title="드래그해서 너비 조절" onMouseDown={(e) => onResize(e, wkey)} /> : null}
    </section>
  );
}

function KpiCard(p) {
  const { ds, opt = {} } = p;
  const src = opt.src || "매출";
  const docs = src === "매입" ? ds.purch : ds.sales;
  const series = H.byDate(docs);
  const total = H.sum(docs, d => d.total);
  const days = series.length || 1;
  const week = H.sum(series.slice(-7), d => d.v);
  const max = Math.max(1, ...series.map(d => d.v));
  const isLine = (opt.chart || "막대") === "선";
  return (
    <Card {...p} wkey="kpi" title={src + " 요약"}>
      <div className="kpi-row">
        <div className="kpi2"><div className="kpi2-k">기간 합계</div><div className="kpi2-v">{H.short(total)}</div><div className="kpi2-d">{docs.length}건</div></div>
        <div className="kpi2"><div className="kpi2-k">최근 7일</div><div className="kpi2-v">{H.short(week)}</div><div className="kpi2-d">{series.slice(-7).length}일</div></div>
        <div className="kpi2"><div className="kpi2-k">일 평균</div><div className="kpi2-v">{H.short(total / days)}</div><div className="kpi2-d">{days}일 기준</div></div>
      </div>
      {series.length ? (isLine ?
        <div className="bars"><Spark data={series.map(d => d.v)} /></div> :
        <div className="bars">{series.map((d, i) => <span key={i} className="bar" title={d.date + " · " + H.won(d.v) + "원"} style={{ height: (d.v / max) * 100 + "%" }} />)}</div>
      ) : <Empty />}
      {series.length ? <div className="dw-axis"><span>{series[0].date}</span><span>{series[series.length - 1].date}</span></div> : null}
    </Card>
  );
}

function CompareCard(p) {
  const { ds, opt = {} } = p;
  const metric = opt.metric || "합계액";
  const val = (d) => metric === "공급가액" ? d.supply : d.total;
  const dates = [...new Set([...ds.sales, ...ds.purch].map(d => d.date))].sort();
  const at = (docs, dt) => H.sum(docs.filter(d => d.date === dt), val);
  const sa = dates.map(dt => at(ds.sales, dt)), pa = dates.map(dt => at(ds.purch, dt));
  const max = Math.max(1, ...sa, ...pa);
  const pts = (arr) => arr.map((v, i) => (i / Math.max(1, arr.length - 1)) * 100 + "," + (60 - (v / max) * 52)).join(" ");
  const tS = H.sum(ds.sales, val), tP = H.sum(ds.purch, val);
  const margin = tS - tP, rate = tS ? (margin / tS) * 100 : 0;
  const showPrev = (opt.prev || "표시") === "표시";
  return (
    <Card {...p} wkey="compare" title="매출·매입 비교">
      <div className="kpi-row">
        <div className="kpi2"><div className="kpi2-k">매출</div><div className="kpi2-v">{H.short(tS)}</div><div className="kpi2-d">{ds.sales.length}건</div></div>
        <div className="kpi2"><div className="kpi2-k">매입</div><div className="kpi2-v">{H.short(tP)}</div><div className="kpi2-d">{ds.purch.length}건</div></div>
        <div className="kpi2"><div className="kpi2-k">이익</div><div className="kpi2-v">{H.short(margin)}</div><div className={"kpi2-d " + (margin >= 0 ? "up" : "down")}>{margin >= 0 ? "▲" : "▼"} {rate.toFixed(1)}%</div></div>
      </div>
      {dates.length ?
        <svg viewBox="0 0 100 64" preserveAspectRatio="none" className="line-chart">
          {[0, 1, 2, 3].map(i => <line key={i} x1="0" x2="100" y1={8 + i * 16} y2={8 + i * 16} stroke="var(--line)" strokeWidth=".5" vectorEffect="non-scaling-stroke" />)}
          {showPrev ? <polyline points={pts(pa)} fill="none" stroke={C2} strokeWidth="1.4" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" /> : null}
          <polyline points={pts(sa)} fill="none" stroke={C1} strokeWidth="1.8" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        </svg> : <Empty />}
      {dates.length ? <div className="dw-axis"><span>{dates[0]}</span><span>{dates[dates.length - 1]}</span></div> : null}
      <div className="donut-legend"><span className="dl"><i style={{ background: C1 }} />매출</span><span className="dl"><i style={{ background: C2 }} />매입</span></div>
    </Card>
  );
}

function StatsCard(p) {
  const { ds, opt = {} } = p;
  const basis = opt.basis || "거래처별";
  let rows;
  if (basis === "거래처별") {
    const names = [...new Set([...ds.sales, ...ds.purch, ...ds.cash].map(d => d.partner))];
    rows = names.map(n => {
      const sale = H.sum(ds.sales.filter(d => d.partner === n), d => d.total);
      const buy = H.sum(ds.purch.filter(d => d.partner === n), d => d.total);
      const paid = H.sum(ds.cash.filter(c => c.partner === n && c.kind === "입금"), c => c.amount);
      return { k: n, a: sale, b: buy, c: sale - paid, spark: H.byDate(ds.sales.filter(d => d.partner === n)).map(x => x.v) };
    });
  } else {
    const m = new Map();
    ds.sales.forEach(d => d.lines.forEach(l => {
      const r = m.get(l.name) || { k: l.name, a: 0, b: 0, c: 0, spark: [] };
      r.a += l.qty * l.price; r.b += l.qty; m.set(l.name, r);
    }));
    ds.purch.forEach(d => d.lines.forEach(l => { const r = m.get(l.name); if (r) r.c += l.qty * l.price; }));
    rows = [...m.values()].map(r => {
      const it = H.ITEMS.find(i => i.name === r.k || r.k.includes(i.name));
      return { ...r, stock: it ? it.stock : null, spark: [] };
    });
  }
  rows = (opt.sort || "매출순") === "이름순" ? rows.sort((x, y) => x.k.localeCompare(y.k)) : rows.sort((x, y) => y.a - x.a);
  rows = rows.slice(0, Number(opt.rows || 6));
  const heads = basis === "거래처별" ? ["거래처", "매출", "매입", "미수", "추이"] : ["품목", "매출액", "수량", "매입액", "재고"];
  return (
    <Card {...p} wkey="stats" title={basis === "거래처별" ? "거래처 요약" : "품목 요약"}>
      {rows.length ?
        <div className="stat-tbl">
          <div className="st-row st-head"><span>{heads[0]}</span><span>{heads[1]}</span><span>{heads[2]}</span><span>{heads[3]}</span><span>{heads[4]}</span></div>
          {rows.map(r => (
            <div key={r.k} className="st-row">
              <span className="st-name">{r.k}</span>
              <span className="mono">{H.won(r.a)}</span>
              <span className="mono muted">{basis === "거래처별" ? H.won(r.b) : r.b}</span>
              <span className={"mono " + (basis === "거래처별" && r.c > 0 ? "down" : "")}>{H.won(r.c)}</span>
              <span className="st-spark">{basis === "거래처별" ? <Spark data={r.spark.length ? r.spark : [0, 0]} /> : <b className="mono">{r.stock == null ? "-" : r.stock}</b>}</span>
            </div>
          ))}
        </div> : <Empty />}
    </Card>
  );
}

function RecentCard(p) {
  const { ds, opt = {} } = p;
  const kind = opt.kind || "전체";
  let list = [];
  if (kind === "전체" || kind === "매출") list = list.concat(ds.sales.map(d => ({ id: d.id, date: d.date, k: "매출", name: d.partner, amt: d.total, st: d.status })));
  if (kind === "전체" || kind === "매입") list = list.concat(ds.purch.map(d => ({ id: d.id, date: d.date, k: "매입", name: d.partner, amt: d.total, st: d.status })));
  if (kind === "전체" || kind === "입출금") list = list.concat(ds.cash.map(c => ({ id: c.id, date: c.date, k: c.kind, name: c.partner, amt: c.amount, st: c.source })));
  list.sort((a, b) => a.date < b.date ? 1 : -1);
  list = list.slice(0, Number(opt.rows || 6));
  const href = { 매출: "매출관리.html", 매입: "매입관리.html", 입금: "입출금관리.html", 출금: "입출금관리.html" };
  return (
    <Card {...p} wkey="recent" title="최근 전표" right={<a className="dw-link" href="매출관리.html">전체 보기</a>}>
      {list.length ?
        <div className="stat-tbl">
          <div className="st-row st-row-5 st-head"><span>일자</span><span>구분</span><span>거래처</span><span>금액</span><span>상태</span></div>
          {list.map((r, i) => (
            <a key={i} className="st-row st-row-5 st-link" href={href[r.k] || "#"}>
              <span className="mono">{r.date.slice(5)}</span>
              <span className={"tag t-" + r.k}>{r.k}</span>
              <span className="st-name">{r.name}</span>
              <span className="mono">{H.won(r.amt)}</span>
              <span className="pill">{r.st}</span>
            </a>
          ))}
        </div> : <Empty />}
    </Card>
  );
}

function StatusCard(p) {
  const { ds, opt = {} } = p;
  const src = opt.src || "전체";
  const docs = src === "매출" ? ds.sales : src === "매입" ? ds.purch : [...ds.sales, ...ds.purch];
  const seg = [
    { k: "완료", v: docs.filter(d => d.status === "완료").length, c: C1 },
    { k: "주문", v: docs.filter(d => d.status === "주문").length, c: "color-mix(in oklab, var(--accent) 45%, #fff)" },
    { k: "입금", v: ds.cash.filter(c => c.kind === "입금").length, c: "color-mix(in oklab, var(--ink) 22%, #fff)" },
    { k: "출금", v: ds.cash.filter(c => c.kind === "출금").length, c: C2 },
  ].filter(x => x.v > 0);
  const total = seg.reduce((s2, d) => s2 + d.v, 0);
  const R = 34, CIRC = 2 * Math.PI * R;
  let acc = 0;
  return (
    <Card {...p} wkey="status" title="전표 상태">
      {total ?
        <div className="donut-wrap">
          {(opt.shape || "도넛") === "막대" ?
            <div className="sbars">
              {seg.map(d => <div key={d.k} className="sbar-row"><span className="sbar-k">{d.k}</span><span className="sbar-track"><i style={{ width: (d.v / total) * 100 + "%", background: d.c }} /></span><span className="mono sbar-v">{d.v}</span></div>)}
            </div> :
            <svg viewBox="0 0 100 100" className="donut">
              {seg.map((d, i) => {
                const len = (d.v / total) * CIRC;
                const el = <circle key={i} cx="50" cy="50" r={R} fill="none" stroke={d.c} strokeWidth="14" strokeDasharray={len + " " + (CIRC - len)} strokeDashoffset={-acc} transform="rotate(-90 50 50)" />;
                acc += len; return el;
              })}
              <text x="50" y="53" textAnchor="middle" fontSize="13" fontFamily="JetBrains Mono, monospace" fill="var(--ink)">{total}</text>
            </svg>}
          <div className="donut-legend">{seg.map(d => <span key={d.k} className="dl"><i style={{ background: d.c }} />{d.k} <b>{d.v}</b></span>)}</div>
        </div> : <Empty />}
    </Card>
  );
}

/* ─────────────────────────────────────────────
   App
   ───────────────────────────────────────────── */
/* 소셜 가입 직후 첫 로그인 — 회사 정보 입력 팝업 (나중에 가능) */
function ProfileSetupModal({ onClose }) {
  let s = {}; try { s = JSON.parse(localStorage.getItem("nonamed.session.v1")) || {}; } catch (e) {}
  const [f, setF] = useState({ company: "", ceo: s.ceo || "", biz: "", phone: "" });
  const [err, setErr] = useState("");
  const dg = (v) => String(v || "").replace(/\D/g, "");
  const fmtBiz = (v) => { const d = dg(v).slice(0, 10); return d.length > 5 ? d.slice(0, 3) + "-" + d.slice(3, 5) + "-" + d.slice(5) : d.length > 3 ? d.slice(0, 3) + "-" + d.slice(3) : d; };
  const fmtPh = (v) => { const d = dg(v).slice(0, 11); return d.length > 7 ? d.slice(0, 3) + "-" + d.slice(3, 7) + "-" + d.slice(7) : d.length > 3 ? d.slice(0, 3) + "-" + d.slice(3) : d; };
  const later = () => { try { localStorage.setItem("nonamed.session.v1", JSON.stringify({ ...s, needsProfile: false, profileSkipped: true })); } catch (e) {} onClose(); };
  const save = (e) => {
    e && e.preventDefault(); setErr("");
    if (!f.company.trim()) return setErr("회사명을 입력해 주세요.");
    if (f.biz && dg(f.biz).length !== 10) return setErr("사업자등록번호 10자리를 확인해 주세요.");
    try {
      const users = JSON.parse(localStorage.getItem("nonamed.users.v1")) || [];
      localStorage.setItem("nonamed.users.v1", JSON.stringify(users.map(u => u.id === s.id ? { ...u, company: f.company.trim(), ceo: f.ceo.trim() || u.ceo, biz: f.biz, phone: f.phone } : u)));
      localStorage.setItem("nonamed.session.v1", JSON.stringify({ ...s, company: f.company.trim(), ceo: f.ceo.trim() || s.ceo, needsProfile: false }));
    } catch (e) {}
    onClose(true);
  };
  useEffect(() => { const fn = (e) => { if (e.key === "Escape") later(); }; window.addEventListener("keydown", fn); return () => window.removeEventListener("keydown", fn); }, []);
  const fld = (k, label, fmt, extra) => (
    <label className="psm-fld"><span>{label}</span><input value={f[k]} onChange={(e) => setF(p => ({ ...p, [k]: fmt ? fmt(e.target.value) : e.target.value }))} {...extra} /></label>
  );
  return (
    <div className="psm-root" role="dialog" aria-modal="true">
      <div className="psm-scrim" />
      <form className="psm" onSubmit={save}>
        <h2>환영합니다{s.ceo ? `, ${s.ceo}님` : ""}</h2>
        <p>회사 정보를 입력하면 거래명세서·세금계산서에 자동으로 들어갑니다. 나중에 입력해도 됩니다.</p>
        <div className="psm-grid">
          {fld("company", "회사명 *", null, { autoFocus: true })}
          {fld("ceo", "대표자")}
          {fld("biz", "사업자등록번호", fmtBiz, { inputMode: "numeric", className: "is-mono" })}
          {fld("phone", "휴대폰", fmtPh, { inputMode: "numeric", className: "is-mono" })}
        </div>
        {err ? <div className="psm-err">{err}</div> : null}
        <div className="psm-foot"><button type="button" className="psm-btn" onClick={later}>나중에</button><button type="submit" className="psm-btn is-pri">저장 <kbd>F8</kbd></button></div>
      </form>
    </div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [profileOpen, setProfileOpen] = useState(() => { try { const s = JSON.parse(localStorage.getItem("nonamed.session.v1")); return !!(s && s.needsProfile); } catch (e) { return false; } });
  const [, bump] = useState(0);
  const [cfg, setCfg] = useState(false);
  const [q, setQ] = useState("");
  const ds = useMemo(() => H.filterAll(q), [q]);
  const [hidden, setHidden] = useState(() => { try { const v = JSON.parse(localStorage.getItem("nonamed.dash.hidden.v1")); return Array.isArray(v) ? v : []; } catch (e) { return []; } });
  useEffect(() => { try { localStorage.setItem("nonamed.dash.hidden.v1", JSON.stringify(hidden)); } catch (e) {} }, [hidden]);
  const [order, setOrder] = useState(() => { try { const v = JSON.parse(localStorage.getItem("nonamed.dash.order.v1")); return Array.isArray(v) ? v : null; } catch (e) { return null; } });
  const [spans, setSpans] = useState(() => { try { const v = JSON.parse(localStorage.getItem("nonamed.dash.spans.v1")); return v && typeof v === "object" ? v : {}; } catch (e) { return {}; } });
  const [opts, setOpts] = useState(() => { try { const v = JSON.parse(localStorage.getItem("nonamed.dash.opts.v1")); return v && typeof v === "object" ? v : {}; } catch (e) { return {}; } });
  const setOpt = (w, k, val) => setOpts(p => ({ ...p, [w]: { ...(p[w] || {}), [k]: val } }));
  useEffect(() => { try { localStorage.setItem("nonamed.dash.order.v1", JSON.stringify(order)); localStorage.setItem("nonamed.dash.spans.v1", JSON.stringify(spans)); localStorage.setItem("nonamed.dash.opts.v1", JSON.stringify(opts)); } catch (e) {} }, [order, spans, opts]);

  const gridRef = useRef(null);
  const DEF_SPAN = { kpi: 3, compare: 3, stats: 2, recent: 2, status: 2 };
  const spanOf = (k) => spans[k] || DEF_SPAN[k] || 3;
  const onResize = (e, k) => {
    e.preventDefault(); e.stopPropagation();
    const g = gridRef.current; if (!g) return;
    const colW = (g.clientWidth + 16) / 6, x0 = e.clientX, s0 = spanOf(k);
    const mv = (ev) => { const n = Math.max(1, Math.min(6, Math.round(s0 + (ev.clientX - x0) / colW))); setSpans(p => (p[k] === n ? p : { ...p, [k]: n })); };
    const up = () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
    window.addEventListener("mousemove", mv); window.addEventListener("mouseup", up);
  };
  const dref = useRef(null);
  const keys = (() => { const base = WIDGETS.map(w => w.key); if (!order) return base; const kept = order.filter(k => base.includes(k)); base.forEach(k => { if (!kept.includes(k)) kept.push(k); }); return kept; })();
  const move = (from, to) => { if (from === to) return; const arr = keys.slice(); const fi = arr.indexOf(from), ti = arr.indexOf(to); if (fi < 0 || ti < 0) return; arr.splice(ti, 0, arr.splice(fi, 1)[0]); setOrder(arr); };
  const drag = (key) => ({
    draggable: true,
    onDragStart: (e) => { dref.current = key; e.dataTransfer.effectAllowed = "move"; },
    onDragOver: (e) => { e.preventDefault(); },
    onDrop: (e) => { e.preventDefault(); if (dref.current) move(dref.current, key); dref.current = null; },
    onDragEnd: () => { dref.current = null; },
  });
  const on = (k) => !hidden.includes(k);
  const remove = (k) => setHidden(p => p.includes(k) ? p : [...p, k]);
  const restore = (k) => setHidden(p => p.filter(x => x !== k));

  return (
    <div className="layout" data-density={t.density}>
      <Sidebar active="home" />
      <div className="main">
        <TopSearch value={q} onChange={setQ} />
        <div className={"content " + (cfg ? "is-cfg-mode" : "")}>
          <div className="dash-bar">
            <h1 className="dash-h1">대시보드</h1>
            <div className="dash-bar-r">
              {ds.q ? <span className="dash-filter">{ds.kind} · {ds.q}<button type="button" onClick={() => setQ("")}>×</button></span> : null}
              <button type="button" className={"btn-ghost btn-sm " + (cfg ? "is-on-cfg" : "")} onClick={() => setCfg(v => !v)}>{cfg ? "설정 완료" : "화면 설정"}</button>
            </div>
          </div>
          {cfg && hidden.length ? (
            <div className="dash-hidden">
              <span className="dh-k">숨긴 항목</span>
              {hidden.map(k => <button key={k} type="button" className="dh-chip" onClick={() => restore(k)}>+ {(WIDGETS.find(w => w.key === k) || {}).label}</button>)}
            </div>
          ) : null}
          <div className="dash-grid" ref={gridRef}>
            {keys.filter(on).map(k => {
              const Comp = { kpi: KpiCard, compare: CompareCard, stats: StatsCard, recent: RecentCard, status: StatusCard }[k];
              return <Comp key={k} ds={ds} cfg={cfg} onRemove={remove} span={spanOf(k)} onResize={onResize} drag={drag} opt={opts[k] || {}} setOpt={setOpt} />;
            })}
          </div>
        </div>
      </div>
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
.layout[data-density="촘촘"] { --pad-block: 24px; --gap-block: 18px; }
.layout[data-density="여유"] { --pad-block: 32px; --gap-block: 28px; }

/* ── Sidebar (parity with 주문관리) ── */
.sidebar{
  position: sticky; top: 0;
  align-self: start;
  height: 100vh;
  background: var(--card);
  border-right: 1px solid var(--line);
  display: flex; flex-direction: column; align-items: center;
  padding: 22px 0 24px;
  gap: 14px;
}
.sb-logo{
  width: 44px; height: 44px;
  display: grid; place-items: center;
  text-decoration: none;
}
.sb-nav{
  flex: 1;
  margin-top: 22px;
  display: flex; flex-direction: column; align-items: stretch;
  gap: 6px;
  width: 100%; padding: 0 14px;
}
.sb-item{
  appearance: none; cursor: pointer; background: transparent; border: 0;
  display: flex; flex-direction: column; align-items: center;
  gap: 4px;
  width: 100%; padding: 11px 6px;
  border-radius: 14px;
  color: var(--ink-3);
  transition: background .15s, color .15s;
  position: relative;
}
.sb-item:hover{ background: var(--card-2); color: var(--ink); }
.sb-item.is-active{ background: var(--ink); color: var(--card); }
.sb-item.is-active::before{
  content:""; position:absolute; left:-14px; top:50%; transform:translateY(-50%);
  width:4px; height:22px; border-radius:0 4px 4px 0; background: var(--accent);
}
.sb-icon{ width: 24px; height: 24px; display: grid; place-items: center; }
.sb-icon svg{ width: 22px; height: 22px; display: block; }
.sb-label{ font-size: 11px; font-weight: 500; }
.sb-plus{
  appearance: none; cursor: pointer; border: 0;
  width: 48px; height: 48px; border-radius: 50%;
  background: var(--accent); color:#fff;
  display: grid; place-items: center;
  margin-top: 8px;
  box-shadow:
    0 0 0 6px color-mix(in oklab, var(--accent) 18%, transparent),
    0 12px 26px -10px color-mix(in oklab, var(--accent) 60%, transparent);
  transition: transform .15s, box-shadow .2s;
}
.sb-plus svg{ width: 22px; height: 22px; }
.sb-plus:hover{ transform: translateY(-1px) scale(1.03); }

/* ── Top bar ── */
.main{ display: flex; flex-direction: column; min-width: 0; }
.topbar{
  position: sticky; top: 0; z-index: 5;
  background: rgba(244,239,229,.85);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line-soft);
  padding: 20px clamp(20px, 3vw, 40px);
  display: flex; align-items: center; gap: 18px;
}
.search{
  position: relative; flex: 1; max-width: 720px;
  display: flex; align-items: center; gap: 12px;
  background: var(--card); border: 1px solid var(--line);
  border-radius: 999px; padding: 6px 6px 6px 18px; height: 48px;
  transition: border-color .2s, box-shadow .2s;
}
.search:focus-within{ border-color: var(--ink); box-shadow: 0 0 0 4px rgba(31,26,20,.06); }
.search-icon{ flex: none; width: 22px; height: 22px; color: var(--ink-3); display: grid; place-items: center; }
.search-icon svg{ width: 20px; height: 20px; }
.search-input{
  flex: 1; appearance: none; border: 0; outline: 0; background: transparent;
  height: 100%; font: 500 15px "IBM Plex Sans KR", sans-serif; color: var(--ink);
}
.search-input::placeholder{ color: rgba(31,26,20,.34); font-weight: 400; }
.search-kbd kbd{
  display: inline-grid; place-items: center;
  min-width: 24px; height: 24px; padding: 0 8px;
  border: 1px solid var(--line); border-bottom-width: 2px; border-radius: 7px;
  background: var(--bg-2);
  font-family: "JetBrains Mono", monospace; font-size: 11.5px; color: var(--ink-2);
  margin-right: 6px;
}
.topbar-right{ margin-left: auto; }
.user-pill{
  appearance: none; cursor: pointer; border: 0;
  display: inline-flex; align-items: center; gap: 10px;
  background: var(--card); border: 1px solid var(--line);
  border-radius: 999px; padding: 5px 14px 5px 5px; height: 44px;
}
.user-pill:hover{ background: var(--card-2); }
.user-av{
  width: 34px; height: 34px; border-radius: 50%;
  background: var(--ink); color:#fff;
  display: grid; place-items: center;
  font-weight: 700; font-size: 13px;
}
.user-name{ font-size: 14px; font-weight: 500; color: var(--ink); }
.user-chev{ width: 18px; height: 18px; color: var(--ink-3); display: grid; place-items: center; }
.user-chev svg{ width: 16px; height: 16px; }

/* ── Content ── */
.content{
  padding: var(--pad-block) clamp(20px, 3vw, 40px) 80px;
  display: flex; flex-direction: column; gap: var(--gap-block);
  max-width: 1480px; width: 100%;
}

/* ── Block head (shared) ── */
.block-head{
  display: flex; align-items: baseline; justify-content: space-between;
  gap: 14px; margin-bottom: 14px;
}
.block-title{
  font-family:"Gowun Batang","IBM Plex Sans KR",serif;
  font-weight: 700; font-size: 22px; letter-spacing: -.015em;
  margin: 0;
}
.block-sub{ font-size: 13.5px; color: var(--ink-3); }
.block-link{
  font-size: 13px; color: var(--ink-2); text-decoration: none;
  display: inline-flex; align-items: center; gap: 4px;
}
.block-link svg{ width: 14px; height: 14px; }
.block-link:hover{ color: var(--ink); }

/* ── Greeting + KPIs ── */
.greet{
  display: grid;
  grid-template-columns: minmax(260px, 1fr) 2.4fr;
  gap: 26px;
  align-items: stretch;
}
.greet-text{
  display: flex; flex-direction: column; justify-content: center;
  padding: 4px 0;
}
.greet-meta{
  display: flex; align-items: center; gap: 10px;
  font-family:"JetBrains Mono", monospace; font-size: 12px;
  color: var(--ink-3); letter-spacing: .04em;
  margin-bottom: 12px;
}
.g-sep{ width: 3px; height: 3px; border-radius: 50%; background: var(--ink-3); opacity: .5; }
.g-time{ color: var(--ink); }
.greet-h1{
  font-family:"Gowun Batang", serif;
  font-weight: 700; font-size: clamp(28px, 3vw, 36px);
  line-height: 1.18; letter-spacing: -.02em;
  margin: 0; color: var(--ink);
}
.greet-h1 b{ color: var(--accent-ink); font-weight: 700; }

.kpis{
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;
}
.kpi{
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 18px 20px;
  display: flex; flex-direction: column; gap: 6px;
  position: relative; overflow: hidden;
}
.kpi::before{
  content:""; position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
  background: var(--ink-3); opacity: .4;
}
.kpi.t-up::before  { background: var(--good); opacity: .8; }
.kpi.t-warn::before{ background: var(--warn); opacity: .8; }
.kpi.t-flat::before{ background: var(--ink-3); opacity: .5; }

.kpi-k{
  font-family:"JetBrains Mono", monospace; font-size: 11px;
  letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3);
}
.kpi-v{ display: flex; align-items: baseline; gap: 6px; }
.kpi-n{
  font-family:"Gowun Batang", serif; font-weight: 700;
  font-size: 30px; letter-spacing: -.015em; color: var(--ink);
  font-variant-numeric: tabular-nums;
}
.kpi-u{ font-size: 14px; color: var(--ink-2); font-weight: 500; }
.kpi-d{
  font-size: 12.5px; color: var(--ink-2);
  display: inline-flex; align-items: center; gap: 6px;
}
.kpi-dot{
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--ink-3);
}
.kpi.t-up .kpi-dot  { background: var(--good); }
.kpi.t-warn .kpi-dot{ background: var(--warn); }

/* ── Row-2 (Menus + Todos) ── */
.row-2{
  display: grid;
  grid-template-columns: 2.1fr 1fr;
  gap: var(--gap-block);
  align-items: stretch;
}

/* Menu grid */
.menus-grid{
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
.menu-card{
  appearance: none; cursor: pointer; border: 0;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 22px 22px 18px;
  text-align: left;
  display: flex; flex-direction: column; gap: 14px;
  min-height: 188px;
  position: relative; overflow: hidden;
  transition: border-color .15s, transform .2s, box-shadow .25s;
}
.menu-card:hover{
  border-color: rgba(31,26,20,.32);
  transform: translateY(-3px);
  box-shadow: 0 24px 40px -22px rgba(31,26,20,.22);
}
.menu-card.is-hot{
  background: linear-gradient(160deg, var(--accent-soft) 0%, var(--card) 60%);
  border-color: color-mix(in oklab, var(--accent) 30%, transparent);
}
.mc-icon{
  width: 48px; height: 48px;
  border-radius: 14px;
  background: var(--bg-2);
  color: var(--ink);
  display: grid; place-items: center;
}
.mc-icon svg{ width: 26px; height: 26px; }
.menu-card.is-hot .mc-icon{
  background: var(--accent);
  color: #fff;
}
.mc-text{ display: flex; flex-direction: column; gap: 4px; }
.mc-title{
  font-family:"Gowun Batang","IBM Plex Sans KR",serif;
  font-weight: 700; font-size: 22px;
  color: var(--ink); letter-spacing: -.015em; line-height: 1.1;
}
.mc-desc{ font-size: 13.5px; color: var(--ink-2); line-height: 1.4; }
.mc-foot{
  margin-top: auto;
  display: flex; flex-direction: column; gap: 1px;
  padding-top: 8px;
  border-top: 1px dashed var(--line);
}
.mc-stat{
  font-family:"JetBrains Mono", monospace;
  font-size: 13px; color: var(--ink); font-weight: 500;
  font-variant-numeric: tabular-nums;
}
.mc-sub{ font-size: 11.5px; color: var(--ink-3); }
.mc-arrow{
  position: absolute; right: 18px; top: 22px;
  width: 30px; height: 30px; border-radius: 50%;
  background: rgba(31,26,20,.06); color: var(--ink-2);
  display: grid; place-items: center;
  transition: background .15s, color .15s, transform .2s;
}
.mc-arrow svg{ width: 16px; height: 16px; }
.menu-card:hover .mc-arrow{
  background: var(--ink); color: var(--card);
  transform: translateX(2px);
}
.mc-hot-dot{
  position: absolute; left: 0; top: 24px;
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--accent);
  transform: translateX(-50%);
  box-shadow: 0 0 0 4px color-mix(in oklab, var(--accent) 30%, transparent);
}

/* ── Todos ── */
.todos{
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 22px 20px 14px;
  display: flex; flex-direction: column;
  align-self: start;
}
.todos .block-head{ margin-bottom: 12px; }
.todos-total{
  font-family:"JetBrains Mono", monospace;
  background: var(--ink); color: var(--card);
  padding: 4px 10px; border-radius: 999px;
  font-size: 12px; letter-spacing: .04em;
}
.todo-list{ list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.todo{
  display: grid;
  grid-template-columns: 36px 1fr auto auto;
  align-items: center; gap: 12px;
  padding: 12px 6px;
  border-bottom: 1px dashed var(--line-soft);
}
.todo:last-child{ border-bottom: 0; }
.todo-icon{
  width: 36px; height: 36px; border-radius: 10px;
  display: grid; place-items: center;
  background: var(--bg-2); color: var(--ink-2);
}
.todo-icon svg{ width: 20px; height: 20px; }
.todo.t-new .todo-icon { background: color-mix(in oklab, var(--accent) 22%, var(--bg-2)); color: var(--accent-ink); }
.todo.t-warn .todo-icon{ background: #F6EBC4; color: #7A5C18; }
.todo.t-info .todo-icon{ background: #DCE5F3; color: #2F4B7C; }
.todo-body{ display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.todo-text{ font-size: 15px; font-weight: 600; color: var(--ink); letter-spacing: -.005em; }
.todo-sub{ font-size: 12px; color: var(--ink-3); }
.todo-count{
  font-family:"Gowun Batang", serif;
  font-weight: 700; font-size: 22px;
  color: var(--ink);
  letter-spacing: -.01em;
  font-variant-numeric: tabular-nums;
  padding: 0 4px;
}
.todo-action{
  appearance: none; text-decoration: none;
  background: var(--ink); color: var(--card);
  font: 500 12.5px "IBM Plex Sans KR", sans-serif;
  padding: 7px 12px; border-radius: 999px;
  display: inline-flex; align-items: center; gap: 4px;
  white-space: nowrap;
  transition: background .15s, transform .12s;
}
.todo-action svg{ width: 14px; height: 14px; }
.todo-action:hover{ background: var(--accent); transform: translateX(1px); }

/* ── Bottom row ── */
.row-bottom{
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: var(--gap-block);
  align-items: stretch;
}

/* Trend chart */
.trend{
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 22px 24px;
  display: flex; flex-direction: column; gap: 10px;
}
.trend-meta{ display: flex; align-items: baseline; gap: 10px; font-size: 13px; }
.tm-k{
  font-family:"JetBrains Mono", monospace; font-size: 11px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--ink-3);
}
.tm-v{ font-family:"JetBrains Mono", monospace; font-weight: 500; color: var(--ink); font-size: 14px; }
.tm-delta{ color: var(--good); font-weight: 600; font-size: 13px; }
.trend-chart{ width: 100%; height: 180px; }
.trend-svg{ width: 100%; height: 100%; display: block; }
.trend-legend{
  display: grid; grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  padding-top: 14px;
  border-top: 1px dashed var(--line);
}
.tl-item{ display: flex; flex-direction: column; gap: 2px; align-items: center; padding: 6px 0; }
.tl-d{ font-size: 11px; color: var(--ink-3); font-family:"JetBrains Mono", monospace; }
.tl-v{ font-size: 11.5px; color: var(--ink); font-family:"JetBrains Mono", monospace; font-variant-numeric: tabular-nums; }
.tl-item.is-today{
  background: color-mix(in oklab, var(--accent-soft) 60%, transparent);
  border-radius: 8px;
}
.tl-item.is-today .tl-d{ color: var(--accent-ink); font-weight: 600; }
.tl-item.is-today .tl-v{ color: var(--accent-ink); font-weight: 600; }

/* Activity */
.activity{
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 22px 22px 14px;
}
.act-list{ list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
.act{
  display: grid;
  grid-template-columns: 48px 24px 36px 1fr;
  align-items: flex-start; gap: 10px;
  padding: 10px 0;
  position: relative;
}
.act-time{
  font-family:"JetBrains Mono", monospace; font-size: 12px;
  color: var(--ink-3); padding-top: 8px;
}
.act-rail{ position: relative; align-self: stretch; display: flex; justify-content: center; }
.act-dot{
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--ink-3); margin-top: 12px;
  box-shadow: 0 0 0 3px var(--card);
  z-index: 1;
}
.act.t-accent .act-dot{ background: var(--accent); }
.act-line{
  position: absolute; left: 50%; top: 22px; bottom: -10px;
  transform: translateX(-50%);
  width: 1px; background: var(--line);
}
.act-icon{
  width: 36px; height: 36px; border-radius: 10px;
  background: var(--bg-2); color: var(--ink-2);
  display: grid; place-items: center;
  flex: none;
}
.act-icon svg{ width: 20px; height: 20px; }
.act.t-accent .act-icon{ background: var(--accent-soft); color: var(--accent-ink); }
.act-body{ display: flex; flex-direction: column; gap: 2px; min-width: 0; padding-top: 5px; }
.act-text{ font-size: 14.5px; font-weight: 500; color: var(--ink); }
.act-meta{ font-size: 12.5px; color: var(--ink-3); }

/* ── Responsive ── */
@media (max-width: 1280px){
  .greet{ grid-template-columns: 1fr; gap: 18px; }
  .kpis{ grid-template-columns: repeat(4, 1fr); }
  .row-2{ grid-template-columns: 1.6fr 1fr; }
}
@media (max-width: 1080px){
  .row-2{ grid-template-columns: 1fr; }
  .menus-grid{ grid-template-columns: repeat(2, 1fr); }
  .kpis{ grid-template-columns: repeat(2, 1fr); }
  .row-bottom{ grid-template-columns: 1fr; }
}
@media (max-width: 720px){
  .layout{ grid-template-columns: 72px 1fr; }
  .menus-grid{ grid-template-columns: 1fr; }
  .kpis{ grid-template-columns: 1fr; }
}

/* ── Dashboard widgets ── */
.dash-bar{ display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
.dash-bar-r{ display:flex; align-items:center; gap:10px; }
.dash-filter{ display:inline-flex; align-items:center; gap:6px; background:var(--accent-soft); color:var(--accent-ink); font:600 12px "IBM Plex Sans KR",sans-serif; border-radius:999px; padding:4px 6px 4px 12px; }
.dash-filter button{ appearance:none; border:0; background:transparent; color:inherit; cursor:pointer; font-size:14px; line-height:1; padding:0 4px; }
.dw-empty{ padding:22px 0; text-align:center; font:500 12.5px "IBM Plex Sans KR",sans-serif; color:var(--ink-3); }
.st-row-5{ grid-template-columns:56px 48px 1fr 96px 58px; }
.st-name{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.st-link{ text-decoration:none; color:inherit; }
.st-link:hover{ background:var(--bg-2); }
.tag{ justify-self:start; font:600 10.5px "IBM Plex Sans KR",sans-serif; padding:2px 7px; border-radius:5px; background:var(--bg-2); color:var(--ink-2); }
.tag.t-매출{ background:color-mix(in oklab, var(--accent) 18%, transparent); color:var(--accent-ink); }
.tag.t-입금{ background:color-mix(in oklab, var(--good) 18%, transparent); color:#2e7d5b; }
.dash-h1{ margin:0; font:600 20px "IBM Plex Sans KR",sans-serif; color:var(--ink); }
.dash-hidden{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:14px; }
.dh-k{ font:600 12px "IBM Plex Sans KR",sans-serif; color:var(--ink-3); }
.dh-chip{ appearance:none; cursor:pointer; border:1px dashed var(--line); background:transparent; color:var(--ink-2); font:500 12px "IBM Plex Sans KR",sans-serif; border-radius:999px; padding:4px 12px; }
.dh-chip:hover{ border-color:var(--accent); color:var(--accent-ink); }
.dash-grid{ display:grid; grid-template-columns:repeat(6,1fr); gap:16px; align-content:start; }
.dw{ background:var(--card); border:1px solid var(--line); border-radius:14px; padding:16px 18px 14px; display:flex; flex-direction:column; gap:12px; min-width:0; }
.dw{ position:relative; }
.dw.is-cfg{ cursor:grab; outline:1px dashed color-mix(in oklab, var(--accent) 45%, transparent); outline-offset:2px; }
.dw.is-cfg:active{ cursor:grabbing; }
.dw-rz{ position:absolute; top:0; right:-8px; width:14px; height:100%; cursor:col-resize; z-index:5; }
.dw-rz::after{ content:""; position:absolute; top:12px; bottom:12px; left:6px; width:3px; border-radius:3px; background:color-mix(in oklab, var(--accent) 60%, transparent); }
.dw-head{ display:flex; align-items:center; justify-content:space-between; gap:8px; }
.dw-title{ margin:0; font:600 13.5px "IBM Plex Sans KR",sans-serif; color:var(--ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; min-width:0; flex:1 1 auto; }
.dw-right{ display:flex; align-items:center; gap:8px; flex:none; }
.dw-link{ font:500 12px "IBM Plex Sans KR",sans-serif; color:var(--accent-ink); text-decoration:none; }
.dw-right{ position:relative; }
.dw-cog{ appearance:none; border:0; background:transparent; color:var(--ink-3); font-size:13px; line-height:1; cursor:pointer; padding:3px 5px; border-radius:6px; }
.dw-cog:hover, .dw-cog.is-on{ background:var(--bg-2); color:var(--ink); }
.dw-pop{ position:absolute; top:26px; right:0; z-index:30; width:210px; background:var(--card); border:1px solid var(--line); border-radius:10px; box-shadow:0 10px 28px rgba(31,26,20,.14); padding:10px; display:flex; flex-direction:column; gap:8px; }
.dw-pop-head{ font:600 12px "IBM Plex Sans KR",sans-serif; color:var(--ink); }
.dw-pop-row{ display:flex; align-items:center; justify-content:space-between; gap:8px; font:500 12px "IBM Plex Sans KR",sans-serif; color:var(--ink-2); }
.dw-pop-row select{ font:500 12px "IBM Plex Sans KR",sans-serif; padding:3px 6px; border:1px solid var(--line); border-radius:6px; background:var(--card); color:var(--ink); }
.dw-pop-foot{ display:flex; justify-content:flex-end; }
.dw-pop-foot button{ appearance:none; border:1px solid var(--line); background:var(--card); border-radius:6px; padding:4px 10px; font:500 12px "IBM Plex Sans KR",sans-serif; cursor:pointer; color:var(--ink-2); }
.sbars{ display:flex; flex-direction:column; gap:10px; width:100%; padding:6px 0; }
.sbar-row{ display:grid; grid-template-columns:48px 1fr 36px; align-items:center; gap:10px; font:500 12px "IBM Plex Sans KR",sans-serif; color:var(--ink-2); }
.sbar-track{ height:10px; border-radius:999px; background:var(--bg-2); overflow:hidden; }
.sbar-track i{ display:block; height:100%; border-radius:999px; }
.sbar-v{ text-align:right; }
.dw-rm{ appearance:none; border:0; background:transparent; color:var(--ink-3); font-size:16px; line-height:1; cursor:pointer; padding:2px 4px; border-radius:6px; }
.dw-rm:hover{ background:color-mix(in oklab, var(--bad) 12%, transparent); color:var(--bad); }
.kpi-row{ display:flex; gap:22px; flex-wrap:wrap; }
.kpi2{ display:flex; flex-direction:column; gap:2px; }
.kpi2-k{ font:500 11.5px "IBM Plex Sans KR",sans-serif; color:var(--ink-3); white-space:nowrap; }
.kpi2-v{ font:600 22px "JetBrains Mono",monospace; color:var(--ink); letter-spacing:-.02em; }
.kpi2-d{ font:500 11.5px "JetBrains Mono",monospace; white-space:nowrap; }
.kpi2-d.up, .up{ color:#2e7d5b; }
.kpi2-d.down, .down{ color:var(--bad); }
.bars{ display:flex; align-items:flex-end; gap:4px; height:110px; }
.bar{ flex:1; background:color-mix(in oklab, var(--accent) 65%, #fff); border-radius:3px 3px 0 0; }
.line-chart{ width:100%; height:120px; }
.dw-axis{ display:flex; justify-content:space-between; font:500 10.5px "JetBrains Mono",monospace; color:var(--ink-3); }
.stat-tbl{ display:flex; flex-direction:column; }
.st-row{ display:grid; grid-template-columns:60px 1fr 1fr 80px 84px; align-items:center; gap:8px; padding:8px 0; border-bottom:1px solid var(--line); font:500 12.5px "IBM Plex Sans KR",sans-serif; color:var(--ink); }
.st-row-4{ grid-template-columns:70px 1fr 100px 62px; }
.st-row:last-child{ border-bottom:0; }
.st-head{ font:600 11.5px "IBM Plex Sans KR",sans-serif; color:var(--ink-3); }
.mono{ font-family:"JetBrains Mono",monospace; }
.muted{ color:var(--ink-3); }
.spark{ width:100%; height:26px; }
.pill{ justify-self:start; font:600 11px "IBM Plex Sans KR",sans-serif; padding:2px 9px; border-radius:999px; background:var(--bg-2); color:var(--ink-2); }
.pill.p-완료{ background:color-mix(in oklab, var(--accent) 16%, transparent); color:var(--accent-ink); }
.pill.p-미수{ background:color-mix(in oklab, var(--bad) 14%, transparent); color:var(--bad); }
.donut-wrap{ display:flex; flex-direction:column; align-items:center; gap:12px; }
.donut{ width:170px; height:170px; }
.donut-legend{ display:flex; flex-wrap:wrap; gap:8px 14px; justify-content:center; }
.dl{ display:inline-flex; align-items:center; gap:6px; white-space:nowrap; font:500 12px "IBM Plex Sans KR",sans-serif; color:var(--ink-2); }
.dl i{ width:9px; height:9px; border-radius:2px; display:inline-block; }
@media (max-width:1180px){ .dash-grid{ grid-template-columns:repeat(2,1fr); } .dw{ grid-column:span 1 !important; } }
@media (max-width:820px){ .dash-grid{ grid-template-columns:1fr; } }
`;

(function injectCss() {
  if (document.getElementById('dash-css')) return;
  const s = document.createElement('style');
  s.id = 'dash-css';
  s.textContent = css + `
.psm-root{ position:fixed; inset:0; z-index:120; display:grid; place-items:center; padding:20px; }
.psm-scrim{ position:absolute; inset:0; background:rgba(31,26,20,.4); backdrop-filter:blur(2px); }
.psm{ position:relative; width:min(520px,100%); background:var(--card); color:var(--ink); border-radius:20px; padding:26px 28px 22px; box-shadow:0 30px 80px -20px rgba(31,26,20,.45); display:flex; flex-direction:column; gap:14px; }
.psm h2{ margin:0; font-size:20px; letter-spacing:-.01em; }
.psm p{ margin:0; font-size:13px; color:var(--ink-2); text-wrap:pretty; }
.psm-grid{ display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
.psm-fld{ display:flex; flex-direction:column; gap:6px; font-size:12px; font-weight:600; color:var(--ink-2); }
.psm-fld input{ height:42px; padding:0 13px; border:1px solid var(--line); border-radius:11px; background:#fff; font:500 14px "IBM Plex Sans KR",sans-serif; color:var(--ink); outline:none; }
.psm-fld input:focus{ border-color:var(--accent); box-shadow:0 0 0 3px color-mix(in oklab, var(--accent) 22%, transparent); }
.psm-fld input.is-mono{ font-family:"JetBrains Mono",monospace; }
.psm-err{ font-size:12px; color:#B5462F; }
.psm-foot{ display:flex; justify-content:flex-end; gap:8px; margin-top:4px; }
.psm-btn{ appearance:none; height:40px; padding:0 18px; border-radius:11px; border:1px solid var(--line); background:#fff; color:var(--ink); font:600 13.5px "IBM Plex Sans KR",sans-serif; cursor:pointer; display:inline-flex; align-items:center; gap:8px; }
.psm-btn.is-pri{ background:var(--ink); border-color:var(--ink); color:var(--card); }
.psm-btn kbd{ font:600 10px "JetBrains Mono",monospace; opacity:.7; }
@media (max-width:560px){ .psm-grid{ grid-template-columns:1fr; } }`;
  document.head.appendChild(s);
})();

ReactDOM.createRoot(document.getElementById('app')).render(<App />);