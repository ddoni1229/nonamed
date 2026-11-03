# 하나프로젝트 — 작업 규칙

## 화면 구성
- **매입관리** (`maeip.jsx` / `매입관리.html`) — 기준(마스터) 화면. 새 기능은 보통 여기서 먼저 구현.
- **매출관리** (`매출관리.jsx`) — **maeip.jsx에서 자동 생성**(용어 치환: 매입처→거래처, 매입→매출, purchase→sales, 지급/출금→수금/입금, P-→S-; 매입가·매입단가는 원가 의미로 유지). 매입관리를 고친 뒤 같은 치환으로 재생성하면 동기화됨. 이전 버전: `_backup/매출관리.old.jsx`.
- **품목** (`품목리스트.jsx` + `재고관리.jsx` embedded) — 탭: 품목/현황/변동표/수불부/조정. 재고 탭은 `window.StockApp`(재고관리.jsx, `embedded` 모드)이 렌더. 재고관리.html은 삭제됨.
- **거래처** (`거래처등록.jsx` + `활동관리.jsx`/`활동입력.jsx` embedded) — 탭: 거래처/활동. 활동 탭은 `window.ActivityApp`(활동관리.jsx, `embedded` 모드)이 렌더. 활동관리.html 은 단독 확인용.
- **계정·회사** (`account.jsx`, 모든 앱 화면이 shell.jsx 다음에 로드) — 가입은 개인, 데이터는 회사 단위. `nonamed.companies.v1`(회사·초대코드·구성원·권한), 세션에 companyId/company/role. 상단 사용자 버튼 = `AccountMenu`(구성원 관리·회사 정보·로그아웃). 회사 미지정 세션은 첫 진입 시 `OnboardModal`(새 회사 만들기 / 초대코드로 합류). 권한: 관리자/일반/조회전용 + 메뉴별 입력/조회/숨김.
- **요금** (account.jsx `acBilling`/`PaymentModal`) — 회사 생성 시 7일 무료(trialEnd). 만료 후 결제수단 등록 전까지 전 화면 잠금(관리자=카드 등록 팝업, 그 외=관리자 요청 안내). 회사당 월 정액 `AC_PRICE`(임시 29,000원, VAT 별도). 실제 PG 정기결제는 배포 단계. 테스트: URL `?expire=1`.
- **주문관리** (`주문관리.jsx`), **품목리스트** (`품목리스트.jsx`), **거래처등록** (`거래처등록.jsx`) — 평면 테이블 화면.
- **공통 모듈** (`colconfig.jsx`) — 화면설정/저장된 화면(뷰) 프리셋/토스트/확인팝업/열추가 모달을 모든 화면이 공용으로 사용. 각 HTML이 `colconfig.jsx`를 로드함.
  - 전표(매입·매출) 목록/입력용: `AddColModal`, `ViewPresetMenu`, `SaveViewModal`, `ConfirmModal`, `showToast`, `nextViewCode`
  - 평면 테이블용: `useColConfig`, `ColCfgPopover`, `FlatAddColModal`, `calcFlatCol`
  - 입력화면 우측 "품목 정보 패널" 설정용: `PANEL_FIELD_DEFS`, `panelFieldValue`, `PanelFieldPicker`
  - ★ maeip.jsx(매입관리)도 이제 `colconfig.jsx`를 로드함 — 입력화면 패널이 공통 모듈 사용.

## ★ 핵심 규칙: 매입입력 변경은 전 화면 동시 적용
사용자가 **매입관리(매입입력) 화면**에 기능/UI 변경을 요청하면, 그 변경을 **매출관리·주문관리·품목리스트·거래처등록에도 동시에 같이 적용**한다.
- 공통 UI는 가능하면 `colconfig.jsx`에서 한 번만 고쳐 전 화면에 반영되게 한다.
- 화면별 테이블 구조가 달라 개별 반영이 필요하면 각 파일에 같은 취지로 적용한다.
- 완료 후 각 화면이 콘솔 에러 없이 로드되는지 확인한다.

- **데이터 저장** — 각 화면 목록은 `usePersistedList(NM_LIST_KEY.x)`(colconfig.jsx)로 localStorage 에 저장. 품목·재고는 `NM_LIST_KEY.품목` 하나를 공유. 매입·매출의 PARTNER_MASTER/ITEM_MASTER 는 `syncMasters()`가 거래처·품목 저장소에서 채움(저장소 비었을 때만 샘플 유지).

## 미완료 / 다음 작업
- 그룹1·2 (코드)/(값) 분리 검증 (품목·거래처).
- 대시보드(dashboard.jsx/dashdata.js) 샘플 데이터 → 실데이터 연동(BaaS 예정).
- 샘플 마스터(PARTNER_MASTER/ITEM_MASTER/MGR_MASTER) 완전 제거는 저장소 연동 후.
