/* dashdata.js — 매출/매입/입출금/거래처/품목 공용 데이터 (각 화면 시드와 동일) */
(function () {
  function mk(id, date, partner, mgr, status, lines) {
    const supply = lines.reduce((s, l) => s + l.qty * l.price, 0);
    const vat = lines.reduce((s, l) => s + (l.tax === "과세" ? Math.round(l.qty * l.price * 0.1) : 0), 0);
    return { id, date, partner, mgr, status, lines, supply, vat, total: supply + vat };
  }
  const L = {
    한양1: [{ name: "양배추", spec: "1kg", qty: 20, price: 1800, tax: "면세" }, { name: "백김치", spec: "500g", qty: 10, price: 5200, tax: "면세" }, { name: "대파", spec: "500g", qty: 15, price: 3000, tax: "면세" }],
    송파1: [{ name: "신라면", spec: "5입", qty: 8, price: 4500, tax: "과세" }, { name: "콜라", spec: "500ml", qty: 24, price: 1200, tax: "과세" }],
    동대문1: [{ name: "식용유", spec: "1.8L", qty: 12, price: 6900, tax: "과세" }, { name: "고추장", spec: "3kg", qty: 6, price: 14500, tax: "과세" }, { name: "참기름", spec: "320ml", qty: 5, price: 9200, tax: "과세" }],
    마포1: [{ name: "한우 등심", spec: "500g", qty: 4, price: 62000, tax: "면세" }, { name: "삼겹살", spec: "1kg", qty: 8, price: 18900, tax: "면세" }],
    성수1: [{ name: "닭가슴살", spec: "1kg", qty: 10, price: 10500, tax: "면세" }, { name: "새우", spec: "500g", qty: 6, price: 24000, tax: "면세" }],
    종로1: [{ name: "백미", spec: "20kg", qty: 12, price: 62000, tax: "면세" }],
    광진1: [{ name: "고등어", spec: "마리", qty: 20, price: 5500, tax: "면세" }, { name: "새우", spec: "500g", qty: 8, price: 24000, tax: "면세" }],
    강서1: [{ name: "양배추", spec: "1kg", qty: 30, price: 1800, tax: "면세" }, { name: "대파", spec: "500g", qty: 20, price: 3000, tax: "면세" }],
    한양2: [{ name: "백김치", spec: "500g", qty: 18, price: 5200, tax: "면세" }],
    송파2: [{ name: "신라면", spec: "5입", qty: 14, price: 4500, tax: "과세" }, { name: "콜라", spec: "500ml", qty: 48, price: 1200, tax: "과세" }, { name: "보리음료", spec: "500ml", qty: 24, price: 1400, tax: "과세" }],
    마포2: [{ name: "삼겹살", spec: "1kg", qty: 12, price: 18900, tax: "면세" }],
    동대문2: [{ name: "고추장", spec: "3kg", qty: 10, price: 14500, tax: "과세" }, { name: "식용유", spec: "1.8L", qty: 8, price: 6900, tax: "과세" }]
  };
  const SEQ = [
    ["0142", "2026-05-31", "한양식자재", "박지영", "완료", L.한양1],
    ["0141", "2026-05-31", "송파유통", "최영민", "주문", L.송파1],
    ["0140", "2026-05-30", "동대문푸드", "이수진", "완료", L.동대문1],
    ["0139", "2026-05-30", "마포정육점", "강마포", "완료", L.마포1],
    ["0138", "2026-05-29", "성수냉동", "문호철", "완료", L.성수1],
    ["0137", "2026-05-29", "종로식자재마트", "한종로", "주문", L.종로1],
    ["0136", "2026-05-28", "광진수산", "권광진", "완료", L.광진1],
    ["0135", "2026-05-28", "강서물산", "문강서", "완료", L.강서1],
    ["0134", "2026-05-27", "한양식자재", "박지영", "완료", L.한양2],
    ["0133", "2026-05-26", "송파유통", "최영민", "완료", L.송파2],
    ["0132", "2026-05-25", "마포정육점", "강마포", "주문", L.마포2],
    ["0131", "2026-05-24", "동대문푸드", "이수진", "완료", L.동대문2]
  ];
  const SALES = SEQ.map(r => mk("S-26-" + r[0], r[1], r[2], r[3], r[4], r[5]));
  const PURCH = SEQ.map(r => mk("P-26-" + r[0], r[1], r[2], r[3], r[4], r[5].map(l => ({ ...l, price: Math.round(l.price * 0.78) }))));

  const CASH = [
    { id: "C-26-0011", date: "2026-06-04", kind: "입금", partner: "한양식자재", amount: 1200000, memo: "5월분 수금", source: "문자" },
    { id: "C-26-0010", date: "2026-06-03", kind: "출금", partner: "송파유통", amount: 640000, memo: "매입대금 지급", source: "직접" },
    { id: "C-26-0009", date: "2026-06-02", kind: "입금", partner: "동대문푸드", amount: 355000, memo: "입금", source: "문자" },
    { id: "C-26-0008", date: "2026-06-01", kind: "출금", partner: "마포정육점", amount: 980000, memo: "정산 지급", source: "직접" },
    { id: "C-26-0007", date: "2026-05-31", kind: "입금", partner: "종로식자재마트", amount: 1284000, memo: "주문 결제", source: "문자" },
    { id: "C-26-0006", date: "2026-05-30", kind: "출금", partner: "성수냉동", amount: 96000, memo: "운송비 포함", source: "직접" }
  ];

  const PARTNERS = [
    { code: "P-001", name: "한양식자재", ceo: "이한양", kind: "납품처", region: "강남구" },
    { code: "P-002", name: "송파유통", ceo: "김송파", kind: "납품처", region: "송파구" },
    { code: "P-003", name: "동대문푸드", ceo: "정동대", kind: "매입처", region: "동대문구" },
    { code: "P-004", name: "마포정육점", ceo: "강마포", kind: "둘다", region: "마포구" },
    { code: "P-005", name: "성수냉동", ceo: "문성수", kind: "매입처", region: "성동구" },
    { code: "P-006", name: "종로식자재마트", ceo: "한종로", kind: "납품처", region: "종로구" },
    { code: "P-007", name: "강서물산", ceo: "문강서", kind: "납품처", region: "강서구" },
    { code: "P-008", name: "광진수산", ceo: "권광진", kind: "매입처", region: "광진구" }
  ];

  const ITEMS = [
    { code: "VG-001", name: "양배추", spec: "1kg", unit: "kg", cost: 1200, price: 1800, stock: 48, safety: 20, status: "판매중", tax: "면세", partner: "한양식자재" },
    { code: "VG-002", name: "백김치", spec: "500g", unit: "개", cost: 4800, price: 5200, stock: 32, safety: 15, status: "판매중", tax: "면세", partner: "한양식자재" },
    { code: "NL-001", name: "신라면", spec: "5입", unit: "박스", cost: 3600, price: 4500, stock: 12, safety: 20, status: "판매중", tax: "과세", partner: "송파유통" },
    { code: "MT-001", name: "한우 등심", spec: "500g", unit: "kg", cost: 48000, price: 62000, stock: 6, safety: 5, status: "판매중", tax: "면세", partner: "마포정육점" },
    { code: "MT-002", name: "삼겹살", spec: "1kg", unit: "kg", cost: 14000, price: 18900, stock: 14, safety: 10, status: "판매중", tax: "면세", partner: "마포정육점" },
    { code: "SF-001", name: "새우", spec: "500g", unit: "kg", cost: 18000, price: 24000, stock: 8, safety: 6, status: "판매중", tax: "면세", partner: "광진수산" },
    { code: "OI-001", name: "식용유", spec: "1.8L", unit: "병", cost: 5200, price: 6900, stock: 24, safety: 12, status: "판매중", tax: "과세", partner: "동대문푸드" },
    { code: "RC-001", name: "백미", spec: "20kg", unit: "포", cost: 48000, price: 62000, stock: 5, safety: 3, status: "판매중", tax: "면세", partner: "종로식자재마트" },
    { code: "SP-001", name: "고추장", spec: "3kg", unit: "통", cost: 11000, price: 14500, stock: 18, safety: 8, status: "판매중", tax: "과세", partner: "동대문푸드" },
    { code: "DR-001", name: "콜라", spec: "500ml", unit: "캔", cost: 600, price: 1200, stock: 120, safety: 48, status: "판매중", tax: "과세", partner: "송파유통" },
    { code: "DR-002", name: "보리음료", spec: "500ml", unit: "병", cost: 800, price: 1400, stock: 0, safety: 24, status: "품절", tax: "과세", partner: "송파유통" },
    { code: "VG-003", name: "대파", spec: "500g", unit: "단", cost: 2200, price: 3000, stock: 30, safety: 15, status: "판매중", tax: "면세", partner: "한양식자재" },
    { code: "SF-002", name: "고등어", spec: "마리", unit: "마리", cost: 3500, price: 5500, stock: 20, safety: 10, status: "판매중", tax: "면세", partner: "광진수산" },
    { code: "SP-002", name: "참기름", spec: "320ml", unit: "병", cost: 6800, price: 9200, stock: 14, safety: 8, status: "판매중", tax: "과세", partner: "동대문푸드" },
    { code: "FR-001", name: "닭가슴살", spec: "1kg", unit: "kg", cost: 7800, price: 10500, stock: 22, safety: 12, status: "판매중", tax: "면세", partner: "성수냉동" }
  ];

  /* 검색어(거래처명 / 품목명·코드)로 데이터 일괄 필터 */
  function filterAll(q) {
    const s = String(q || "").trim().toLowerCase();
    if (!s) return { q: "", kind: null, sales: SALES, purch: PURCH, cash: CASH, partners: PARTNERS, items: ITEMS };
    const hitPartner = PARTNERS.filter(p => (p.name + p.code + p.ceo).toLowerCase().includes(s));
    const hitItems = ITEMS.filter(i => (i.name + i.code + i.spec).toLowerCase().includes(s));
    const kind = hitPartner.length && !hitItems.length ? "거래처" : hitItems.length && !hitPartner.length ? "품목" : hitPartner.length ? "거래처" : "품목";
    const pnames = hitPartner.map(p => p.name);
    const inames = hitItems.map(i => i.name);
    const keepDoc = (d) => {
      if (pnames.includes(d.partner)) return true;
      return d.lines.some(l => inames.some(n => l.name.includes(n) || n.includes(l.name)));
    };
    const trim = (d) => {
      if (!inames.length || pnames.includes(d.partner)) return d;
      const lines = d.lines.filter(l => inames.some(n => l.name.includes(n) || n.includes(l.name)));
      if (!lines.length) return d;
      const supply = lines.reduce((a, l) => a + l.qty * l.price, 0);
      const vat = lines.reduce((a, l) => a + (l.tax === "과세" ? Math.round(l.qty * l.price * 0.1) : 0), 0);
      return { ...d, lines, supply, vat, total: supply + vat };
    };
    return {
      q: String(q).trim(), kind,
      sales: SALES.filter(keepDoc).map(trim),
      purch: PURCH.filter(keepDoc).map(trim),
      cash: CASH.filter(c => pnames.includes(c.partner)),
      partners: hitPartner.length ? hitPartner : PARTNERS,
      items: hitItems.length ? hitItems : ITEMS
    };
  }

  const sum = (arr, f) => arr.reduce((a, x) => a + f(x), 0);
  function byDate(docs) {
    const m = new Map();
    docs.forEach(d => m.set(d.date, (m.get(d.date) || 0) + d.total));
    return [...m.entries()].sort((a, b) => a[0] < b[0] ? -1 : 1).map(([date, v]) => ({ date, v }));
  }
  const won = (n) => Math.round(n).toLocaleString("ko-KR");
  const short = (n) => n >= 100000000 ? (n / 100000000).toFixed(2) + "억" : n >= 10000 ? (n / 10000).toFixed(0) + "만" : won(n);

  window.HANA = { SALES, PURCH, CASH, PARTNERS, ITEMS, filterAll, sum, byDate, won, short };
})();
