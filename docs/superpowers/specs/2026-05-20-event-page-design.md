# Supercycl Mobile Launch Festival — 이벤트 페이지 프론트엔드 설계서

> **출처**: `supercycl_event_spec.md` (캠페인 운영 명세서) 기반
> **본 문서 범위**: 프론트엔드 프로토타입 (목업) 구현 설계
> **작성일**: 2026-05-20

---

## 0. 개요

### 0.1 목표

Supercycl Mobile Launch Festival(2026-06-08 ~ 2026-07-07) 이벤트 페이지의 **프론트엔드 프로토타입**을 구축한다. 프로토타입은 다음을 만족해야 한다.

- 스펙에 정의된 모든 화면·상태·인앱 표시를 시연 가능
- 디자이너·기획자·개발자가 동일 빌드로 UX 검토 가능
- 실제 백엔드 부재 상태에서도 모든 시나리오를 mock으로 재현 가능
- 추후 백엔드 연동 시 컴포넌트 그대로 재사용 가능한 구조

### 0.2 스코프

**포함:**
- 단일 페이지 + 모달들의 UI 구현
- Mock state store (10개 차원 독립 토글)
- 디버그 패널 (mock state 조작 UI)
- 입력 검증 (TRC20, OKX UID, ICON 주소, 이메일, 약관)
- 반응형 (Mobile-first, Tablet, Desktop)
- 디자인 액센트 (Festival gradient, Countdown numerals 등)

**제외:**
- 실제 백엔드 API / DB 스키마
- 실제 Supabase Auth 연동 (Google OAuth 등)
- 거래소 OAuth / 거래량 집계
- 어드민 대시보드
- 약관/개인정보 본문 (placeholder만)
- 분석·트래킹·로깅
- 슬롯 카운터의 5분 갱신(실 데이터 polling) — mock에서는 디버그 패널로 조작

### 0.3 결정 요약

| 항목 | 결정 |
|------|------|
| 스택 | Next.js (App Router) + TypeScript + Tailwind |
| 디자인 토큰 | Supercycl-Mobile `tokens-design.css` 재사용 + 이벤트 액센트 추가 |
| 언어 정책 | UI 영어 / 설문 13문항 한국어 / 스펙은 한국어 그대로 |
| 데이터·인증 | 100% Mock (디버그 패널로 모든 상태 토글, localStorage 영속화) |
| 라우팅 | 단일 URL `/` + 모달들 (스펙 §7.1) + 약관 메타 페이지 |
| Mock 깊이 | 차원별 독립 토글 (10개 차원) |
| 반응형 | 동일 컴포넌트 + Tailwind breakpoint (mobile-first) |

---

## 1. 아키텍처

### 1.1 디렉토리 구조

```
Supercycl-Event/                  # Next.js 프로젝트 root
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx               # 글로벌 레이아웃 (MockStateProvider, DebugDrawer mount)
│  │  ├─ page.tsx                 # 단일 진입점 — 로그인 상태로 분기
│  │  ├─ (legal)/terms/page.tsx   # 약관 메타 페이지 (직접 URL 접근 / SEO·공유용)
│  │  └─ (legal)/privacy/page.tsx # 개인정보 처리방침 메타 페이지 (직접 URL 접근 / SEO·공유용)
│  ├─ components/
│  │  ├─ landing/                 # 비로그인 콘텐츠
│  │  ├─ hub/                     # 로그인 콘텐츠
│  │  ├─ modals/                  # 모든 모달
│  │  ├─ banners/                 # TopBanner (D-3, 슬롯 잔여 등)
│  │  ├─ shared/                  # SlotCounter, ProgressBar, CountdownTimer, RewardStatusLabel
│  │  └─ debug/                   # MockToggleDrawer
│  ├─ lib/
│  │  ├─ mock-state/              # 단일 store (Context + reducer + selector)
│  │  ├─ validators/              # TRC20·OKX UID·ICON·이메일·약관 검증 (순수 함수)
│  │  └─ tokens/                  # Supercycl 토큰 → Tailwind config 매핑
│  └─ content/
│     ├─ en.ts                    # UI 텍스트 (영어)
│     └─ survey-ko.ts             # 설문 13문항 (한국어)
├─ tailwind.config.ts             # 토큰 + 액센트 매핑
├─ public/                        # 이미지·favicon·OG 이미지
└─ tests/                         # Vitest 유닛, Playwright visual (옵션)
```

### 1.2 페이지 진입 흐름

```
GET /
  ↓
<Page>
  ├─ <TopBanner/>           ← simulatedDate + slotsRemaining 기반 자동 선택
  ├─ {authStatus === 'logged_out' ? <Landing/> : <Hub/>}
  ├─ <ModalRoot/>           ← 현재 활성 모달 1개 렌더 (우선순위 기반)
  └─ <DebugDrawer/>         ← 단축키 ⌘+\ 또는 floating 아이콘
```

### 1.3 핵심 원칙

- 모든 데이터·인증 상태는 `MockStateProvider`의 단일 store에서 흘러나옴
- 디버그 패널은 store를 직접 mutate. 일반 UI는 동일 store를 read-only로 구독
- 모달은 라우트 없이 컴포넌트 mount/unmount + `data-modal-id`로 제어 (스펙 §7.1 단일 URL)
- 영어 UI 텍스트는 `content/en.ts` 한 곳에서 import (추후 i18n 확장 여지)
- 한국어 설문 문항은 `content/survey-ko.ts` 별도 파일 — 분리된 도메인

---

## 2. Mock State Store

### 2.1 State 정의 (10개 차원)

```typescript
type MockState = {
  // 1. 인증 차원
  authStatus: 'logged_out' | 'logged_in';

  // 2. 사용자 자격 차원
  hasKyc: boolean;
  hasOkxLinked: boolean;

  // 3. 거래 차원
  tradingVolume: number;            // 0 ~ 2000 ($)
  reachedAt: string | null;         // $500 도달 시각 (ISO) — null이면 미달성

  // 4. 슬롯 차원 (전역)
  slotsRemaining: number;           // 0 ~ 500
  userSlotNumber: number | null;    // 본인 슬롯 번호 (확보 시)

  // 5. USDT 수령 정보 차원
  usdtRegistration:
    | { status: 'none' }
    | { status: 'wallet'; trc20Address: string }
    | { status: 'exchange'; okxUid: string; email: string };
  usdtPayoutStatus:
    | '미달성' | '수령 정보 미등록' | '대기' | '보류'
    | '완료' | '만료' | '슬롯_마감_후_도달';
  usdtTxHash: string | null;

  // 6. 설문 차원
  surveyCompleted: boolean;
  surveyCompletedAt: string | null;
  isTrader: boolean;                // 캠페인 중 1회 이상 거래 체결 여부

  // 7. ICX 수령 정보 차원
  icxAddress: string | null;
  icxPayoutStatus: '미달성' | '수령 정보 미등록' | '대기' | '보류' | '완료' | '만료';
  icxTxHash: string | null;

  // 8. 시간 차원
  simulatedDate: string;            // ISO

  // 9. 인앱 표시 dismiss 상태
  dismissedFlags: {
    welcomeCard?: boolean;
    halfwayMilestone?: boolean;
    slotSecuredModal?: boolean;
    npsModal?: boolean;
    // ... 트리거별 키
  };

  // 10. Viewport 시뮬레이션 차원 (debug only)
  debugViewport: 'auto' | 'mobile-390' | 'tablet-768' | 'desktop-1280';
};
```

### 2.2 시간 차원 Quick Jump 프리셋

| 키 | ISO | 의미 |
|---|---|---|
| `D-day` | 2026-06-08 | 캠페인 시작 |
| `Mid` | 2026-06-25 | 거래 트랙 중반 |
| `End-trade` | 2026-06-28 | 거래 트랙 종료 |
| `Start-survey` | 2026-06-29 | 설문 트랙 시작 |
| `D-3` | 2026-07-04 | D-3 배너 트리거 |
| `End` | 2026-07-07 | 캠페인 종료 |
| `30d-cutoff` | 2026-08-07 | 수령 정보 등록 마감 후 |

### 2.3 Derived (selector)

직접 저장하지 않고 selector로 계산:

```typescript
isQualifiedForUsdt = tradingVolume >= 500 && hasOkxLinked
daysUntilEnd       = differenceInDays('2026-07-07', simulatedDate)
bannerType         = computeBanner(simulatedDate, slotsRemaining)
                     // 우선순위: d-3 > slots-10 > slots-50 > slots-100 > campaign-running
surveyTrackOpen    = simulatedDate >= '2026-06-29' && simulatedDate <= '2026-07-05'
tradingTrackOpen   = simulatedDate >= '2026-06-08' && simulatedDate <= '2026-06-28'
```

### 2.4 영속화

- 모든 dispatch 후 `localStorage['supercycl-event-mock-state']` 자동 동기화 (store middleware)
- 새로고침 시 자동 복원
- 디버그 패널에 `[Reset all]` `[Export]` `[Import]` 버튼

### 2.5 디버그 패널 UI

데스크탑: 우측 슬라이드 drawer (400px). 모바일: 하단 bottom sheet (50vh). 단축키 `⌘+\` 또는 floating bug 아이콘으로 토글.

```
┌─ Mock State Toggles ─────────────┐
│ AUTH                              │
│ [Logged in ○ Logged out ●]        │
│ ☐ KYC done   ☐ OKX linked         │
│                                   │
│ TRADING                           │
│ Volume:  $237  ━━━━━●━━━━ $2000   │
│ Presets: $0 │ $250 │ $499 │ $500 │ │
│          $1500                    │
│                                   │
│ SLOTS                             │
│ Remaining: 423 / 500              │
│ My slot #:  ─                     │
│ Presets: 500 │ 423 │ 100 │ 50 │   │
│          10 │ 0                   │
│                                   │
│ USDT                              │
│ Registration: [none ▾]            │
│ Status:       [미달성 ▾]           │
│                                   │
│ SURVEY                            │
│ ☐ Completed   ☐ Is trader         │
│                                   │
│ ICX                               │
│ Address:  ─                       │
│ Status:   [미달성 ▾]               │
│                                   │
│ TIME                              │
│ Date: 2026-06-08                  │
│ Quick jump: D-day │ Mid │         │
│             End-trade │           │
│             Start-survey │ D-3 │  │
│             End │ 30d-cutoff      │
│                                   │
│ VIEWPORT                          │
│ [Auto ● 390 ○ 768 ○ 1280 ○]      │
│ ☐ Show frame border               │
│                                   │
│ FLAGS                             │
│ [Reset all dismissed]             │
│                                   │
│ [Reset all] [Export] [Import]     │
└───────────────────────────────────┘
```

`debugViewport`가 `auto`가 아니면 페이지를 가운데 정렬 + 지정 width로 감싸서 frame border와 함께 표시 — 한 화면에서 두 사이즈를 비교 가능.

---

## 3. 반응형 전략 (Mobile-first)

스펙의 모든 ASCII mockup은 모바일 width 기준 — **mobile-first**로 작성한다.

### 3.1 Breakpoint

| Breakpoint | Width | Target | 레이아웃 변화 |
|------------|-------|--------|---|
| **base** (default) | 0~639px | Mobile | 단일 column, full-width 카드, 풀스크린 모달, 하단 sticky CTA |
| **md:** | 768px~ | Tablet | 좌우 여백(`max-w-2xl` center), 모달은 dialog(800px 폭), 폰트 ↑ |
| **lg:** | 1024px~ | Desktop | 2-column 그리드 일부 적용, `max-w-6xl`, motion·gradient·여백 풍부 |

### 3.2 컴포넌트별 적용

| 컴포넌트 | Mobile (base) | Desktop (lg) |
|----------|---|---|
| **LandingHero** | 세로 스택: 타이틀 → 기간 → 슬롯 → 보상 → 3-step → CTA | 좌우 스플릿: 좌측 타이틀+보상+CTA, 우측 large slot visual + 카운트다운 |
| **Hub** | 세로 스택: 진척도 → 슬롯 → USDT → ICX → CTA | 2-column 그리드: 좌측 진척도+슬롯, 우측 USDT+ICX 카드 |
| **TopBanner** | 100% width, 단일 줄 | `max-w-6xl` center, 단일 줄 |
| **모달** (Survey 등) | 풀스크린 sheet (top-down) | 가운데 dialog, `max-w-2xl`, backdrop dim |
| **DebugDrawer** | bottom sheet (50vh) | right drawer (400px) |
| **CountdownTimer** | 큼직한 D-XX 숫자 | D-XX + 시:분:초 라이브 카운터 |
| **SlotCounter** | 텍스트 + 슬림 progress | 텍스트 + progress + 마이크로 애니메이션 |

### 3.3 원칙

- 동일 컴포넌트 사용 — Tailwind `lg:flex-row lg:gap-8` 등으로 분기
- 디자인 토큰(색·타이포)은 viewport 무관 동일
- motion·gradient·glow effect는 `lg:` 에서만 활성 (모바일 perf 보호)
- 디버그 viewport는 미리보기용 — 실제 브라우저 크기 변경이 더 정확

---

## 4. 컴포넌트 카탈로그

### 4.1 Landing (비로그인 — 스펙 §7.2)

| 컴포넌트 | 역할 | 입력 |
|---|---|---|
| `<LandingHero/>` | 타이틀 + 기간 + 핵심 카피 (TRADE DIFFERENT · RIDE THE SUPERCYCL) | `simulatedDate` |
| `<RewardSummaryCard/>` | "💰 Rewards" 섹션 (20 USDT / ICX 안내) | static |
| `<LiveSlotCounter/>` | "423 / 500" 표시 + 색 변화 | `slotsRemaining` |
| `<ThreeStepGuide/>` | "How to participate" 3 step | static |
| `<JoinCta/>` | "Join now" 버튼 → mock login flow 트리거 | dispatch action |

> **Mock login flow**: `<JoinCta/>` 클릭 시 즉시 `authStatus`를 `logged_in`으로 dispatch하고 `hasKyc=false, hasOkxLinked=false`로 초기화 — 사용자는 그 직후 "신규 가입자" 상태의 Hub를 본다. 실제 Google OAuth 등은 mock 단계에서 시뮬레이션하지 않으며 (스펙 §6: 가입/KYC/거래소 OAuth는 본 서비스 redirect 흐름), Hub의 `<ProgressTracker/>` STEP 1에 "본 서비스에서 KYC/거래소 연동 완료 가정" 안내가 표시되도록 한다. 백엔드 연동 시 이 dispatch가 실제 SSO/JWT 흐름으로 교체된다.

### 4.2 Hub (로그인 — 스펙 §7.3)

| 컴포넌트 | 역할 | 입력 |
|---|---|---|
| `<HubHeader/>` | 타이틀 + 로그인 상태 + 본 서비스 링크 | `authStatus` |
| `<ProgressTracker/>` | STEP 1/2/3 진행 상태 | `hasOkxLinked`, `tradingVolume`, `surveyCompleted` |
| `<MyProgressMeter/>` | 누적 거래량 + 남은 거래량 + 카운트다운 + "Trade now" CTA | `tradingVolume`, derived |
| `<LiveSlotCounter/>` | 동일 (재사용) | `slotsRemaining` |
| `<UsdtRewardCard/>` | USDT 보상 영역, 상태 라벨 + CTA | `usdtPayoutStatus`, `usdtRegistration`, `usdtTxHash` |
| `<IcxRewardCard/>` | ICX 보상 영역, 상태 라벨 + CTA | `icxPayoutStatus`, `icxAddress`, `isTrader`, `icxTxHash` |
| `<HubCtaBar/>` | "Trade now →" / "Start survey" 버튼 | derived |

### 4.3 모달 (스펙 §5.7, §4.3, §9.1)

| 모달 | 트리거 | 내부 흐름 |
|---|---|---|
| `<SurveyModal/>` | "Start survey" 클릭 | 13문항 step form (KR 텍스트) → submit → 미니 리포트 → ICX 등록 안내 |
| `<UsdtRegistrationModal/>` | "Register USDT info" 클릭 (자격 충족 시) | 방식 선택 (Wallet/Exchange) → 입력 → 약관 동의 → 검증 → 등록 |
| `<IcxRegistrationModal/>` | "Register ICX wallet" 클릭 (설문 완료 시) | ICON 주소 입력 + 약관 동의 → 검증 → 등록 |
| `<SlotSecuredModal/>` | `reachedAt` 신규 발생 + dismiss 안 됨 | "🎉 Slot #237/500 secured!" + USDT 등록 CTA |
| `<MilestoneCardModal/>` | 진척도 50% 도달 (1회) | "Half way there! Trade $250 more to lock 20 USDT" |
| `<NpsModal/>` | 캠페인 종료 직후 (simulatedDate ≥ end) | NPS 1문항 + 미등록 시 등록 CTA |
| `<TermsViewerModal/>` | 등록 모달 내 "View terms" 링크 | 약관 본문 (긴 텍스트 스크롤) — 인앱 컨텍스트 유지 |

> **약관 채널 정책**: 약관·개인정보 본문은 두 경로로 동시 제공한다. 등록 모달 내부에서는 `<TermsViewerModal/>`(인앱 모달, 컨텍스트 유지)로, 외부 직접 링크·SEO·공유 목적으로는 `/terms`, `/privacy` 메타 페이지로 노출. 본문 콘텐츠는 `content/legal/*.mdx` 단일 소스에서 두 채널이 import한다.

### 4.4 공통/상태 표시 (스펙 §8.3, §9.1)

| 컴포넌트 | 표시 내용 |
|---|---|
| `<TopBanner/>` | 5가지 variant: `campaign-running` / `slots-100` / `slots-50` / `slots-10` / `d-3` |
| `<RewardStatusLabel status=.../>` | 6+1 상태 자동 매핑 (스펙 §7.3 표) |
| `<Toast/>` | "USDT payment completed" 등 1회성 알림 (auto-dismiss 4s) |
| `<CountdownTimer endDate=.../>` | D-day + HH:MM:SS 라이브 카운트 |

### 4.5 디버그

| 컴포넌트 | 역할 |
|---|---|
| `<DebugDrawer/>` | 섹션 2.5의 토글 패널 |
| `<MockStateExporter/>` | 현재 state JSON copy/paste — 시나리오 공유용 |

### 4.6 ModalRoot 우선순위 결정 (스펙 §9.2)

```
우선순위: 자격 충족 > 보상 지급 완료 > 진척도 마일스톤 > 일반 안내
```

```typescript
// 의사 코드
function ModalRoot() {
  const queue = selectModalQueue(state); // dismiss되지 않은 모달들
  const next = queue.sortByPriority()[0];
  return next ? <Modal id={next.id} onClose={dismiss}/> : null;
}
```

### 4.7 스펙 §9.1 트리거 ↔ 컴포넌트 매핑

| # | 트리거 | 컴포넌트 |
|---|---|---|
| 1 | 첫 진입 배너 | `<TopBanner variant="campaign-running"/>` |
| 2 | 환영 카드 | `<HubHeader/>` 상단 카드 (1회 표시) |
| 3 | 설문 완료 모달 + 미니 리포트 + ICX 등록 안내 | `<SurveyModal/>` 마지막 step |
| 4 | 50% 도달 카드 | `<MilestoneCardModal/>` |
| 5 | 슬롯 잔여 100/50/10 배너 | `<TopBanner variant="slots-*"/>` |
| 6 | $500 도달 모달 | `<SlotSecuredModal/>` |
| 7 | 지급 완료 토스트 | `<Toast/>` + 라벨 자동 갱신 |
| 8 | D-3 배너 | `<TopBanner variant="d-3"/>` |
| 9 | 종료 NPS 모달 + 미등록 안내 | `<NpsModal/>` |

---

## 5. 데이터 흐름 & 검증·에러 처리

### 5.1 데이터 흐름 (단방향)

```
[디버그 패널]──dispatch──┐
                        ▼
                ┌─────────────────┐
[모달 폼 입력]──dispatch─▶ MockStateStore │──persist──▶ localStorage
                └─────────────────┘
                        │
                        ▼ subscribe
              ┌─────────┴──────────┐
              ▼                    ▼
      [컴포넌트 (selector)]   [Modal Queue (selector)]
              │                    │
              ▼                    ▼
         render UI            mount/unmount 모달
```

**규칙:**
- store에 쓰는 경로는 단 두 곳 — 디버그 패널, 폼 제출 핸들러
- 컴포넌트는 read-only selector 만 사용
- localStorage 쓰기는 store middleware에서 일괄
- `simulatedDate` 변경 시 derived selector 자동 재계산

### 5.2 입력 검증 (스펙 §5.7)

`src/lib/validators/` 에 순수 함수로 분리.

| 항목 | 검증 규칙 |
|---|---|
| TRC20 주소 | `^T[A-Za-z0-9]{33}$` (T 시작, 총 34자) |
| OKX UID | `^\d{6,20}$` (잠정 — 스펙 Open Issue #11 확정 시 반영) |
| 이메일 | RFC 5322 간이형 |
| ICON 주소 | `^hx[0-9a-f]{40}$` (hx + 40 hex) |
| 네트워크 확인 체크박스 | TRC20 선택 시 필수 |
| 약관 동의 체크박스 | 수령 방식 무관 필수 (스펙 §5.7 명시) |

각 검증은 `{ ok: boolean; message?: string }` 반환. UI는 `message`를 인라인 표시.

### 5.3 에러 매트릭스

**A. 입력 폼 에러 (인라인 표시)**

| 상황 | 표시 |
|---|---|
| 빈 입력 + 제출 | "This field is required" + 빨간 border |
| 정규식 fail | "Invalid TRC20 address" / "Invalid OKX UID" / "Invalid email" |
| 체크박스 미동의 | "You must agree to the terms to continue" |
| 약관 미체크 | 제출 버튼 disabled + 툴팁 |

**B. 권한/상태 에러 (영역 비활성화)**

| 상황 | 처리 |
|---|---|
| USDT 자격 미충족에서 등록 모달 열기 | 모달 mount 안 됨 — 영역에 "Trade $X more to unlock" |
| 설문 트랙 미개시에 설문 시도 | "Survey opens June 29" disabled |
| 캠페인 종료 +30일 경과 후 등록 시도 | "Registration closed" — 모달 진입 차단 |
| 슬롯 마감 후 도달 | 영역에 "$500 reached — slot capacity full. Thank you." 단일 라벨 |

**C. Mock 한계 (개발자용)**

| 상황 | 처리 |
|---|---|
| 잘못된 mock state 조합 | 디버그 패널 상단에 ⚠️ "Inconsistent state: …" 경고 카드 |
| localStorage 직렬화 실패 / 손상 | 콘솔 에러 + state 초기화 + 토스트 "Mock state reset due to corruption" |
| simulatedDate가 캠페인 범위 밖 | "Outside campaign period" 안내 + 모든 자격 false |

### 5.4 인앱 표시 dismiss 정책 (스펙 §9.2)

- 모달/카드는 1회 표시 후 `dismissedFlags[key] = true` 자동 저장
- 디버그 패널의 `[Reset all dismissed]` 로 일괄 재현
- 토스트는 dismiss 기록 안 함 (트리거 발생 시마다 표시)

### 5.5 상태 전환 가드

| 전환 | 가드 |
|---|---|
| `usdtPayoutStatus: '대기' → '완료'` | `usdtRegistration.status !== 'none'` 필수 |
| `usdtRegistration` 변경 시도 | `usdtPayoutStatus === '완료'`일 때 차단 (스펙 §5.7) |
| `surveyCompleted: true` 설정 시 | 정상 경로에서는 `surveyTrackOpen` 가드 — 디버그 패널에서는 우회 허용 |

---

## 6. 디자인 액센트

### 6.1 재사용 토큰 (Supercycl-Mobile에서)

- 색: `--color-bg`, `--color-surface`, `--color-mono-green` (primary), neutral scale
- 타이포: 본 서비스 폰트 스택, weight scale
- 라디우스/그림자 스케일

### 6.2 이벤트 전용 액센트 (`event-accents.css`)

| 액센트 | 사용처 | 시각 표현 |
|---|---|---|
| **Festival gradient** | Landing Hero 배경, NPS 헤더, 종료 카드 | Mono Green → Cyan → Magenta 사선, 낮은 채도, dark base 위 glow처럼 |
| **Countdown numerals** | D-day 카운터, 진척도 큰 숫자, 슬롯 카운터 | 대형 mono 폰트, tabular-nums, subtle glow |
| **Slot tension state** | 100/50/10 도달 시 카운터 색 | 100: amber, 50: orange, 10: red + pulse |
| **Progress shimmer** | `<MyProgressMeter/>` 채워진 영역 | Mono Green 위 slow shimmer (3s loop) |
| **Celebration burst** | `<SlotSecuredModal/>` 진입 1회 | inline SVG spark/confetti + CSS animation (800ms) |
| **Status chip palette** | `<RewardStatusLabel/>` | 미달성: neutral / 미등록: amber / 대기: blue / 보류: orange / 완료: green / 만료: gray |

### 6.3 원칙

- 액센트는 **랜딩·모달·축하 시점**에 한정 — Hub 본문은 본 서비스 톤 유지
- 모든 모션은 `prefers-reduced-motion: reduce`로 무효화
- 그라데이션·glow는 `lg:`에서만 활성, base에서는 단색

---

## 7. 접근성

| 항목 | 처리 |
|---|---|
| **시맨틱 마크업** | `<main>`, `<section>`, `<dialog>`(모달), `aria-label`, `aria-live="polite"` (toast/배너) |
| **키보드** | 모달 trap focus, Esc로 닫기, Tab 순서 명시 |
| **컬러 대비** | WCAG AA 이상 (Status chip 검증) |
| **폼 접근성** | `<label for>`, 에러 메시지 `aria-describedby` |
| **모션** | `prefers-reduced-motion` 존중 |
| **읽기 순서** | 모바일·PC 동일 DOM order — 시각 순서 변경되어도 reading order 일관 |

---

## 8. 테스트·검증 전략

### 8.1 단위 테스트 (Vitest, P0)

- `lib/validators/*` — TRC20·OKX UID·ICON·이메일·약관 (정상/이상 입력)
- `lib/mock-state/selectors.ts` — derived 값 모든 분기
  (`isQualifiedForUsdt`, `bannerType`, `surveyTrackOpen` 등)

### 8.2 시각 회귀 (Playwright, P1 옵션)

- 6 시나리오 × 2 viewport(390, 1280) = 12 screenshot 베이스라인
- 시나리오: 비로그인 랜딩 / 신규 가입자 허브 / 거래 중 / $500 도달 / 등록 완료 / 캠페인 종료
- mock state는 URL `?mock=<base64>` 파라미터로 주입 (테스트 fixture)

### 8.3 수동 검증 체크리스트

`docs/qa-checklist.md`에 별도 저장. 핵심 항목:

```
□ Landing (비로그인) × 2 viewport
□ Hub × 12 페르소나 × 2 viewport
   신규 / OKX 연동 직후 / 거래 중 / 절반 도달 / $500 도달 직후 /
   USDT 등록 완료 (대기) / USDT 지급 완료 / 슬롯 마감 후 도달 /
   설문 미개시 / 설문 트랙 / 설문 완료 후 ICX 미등록 /
   캠페인 종료 (NPS) / +30일 경과
□ Modal — Survey, USDT(TRC20/UID), ICX, Terms, NPS
□ TopBanner — 5 variant 순환
□ Toast — 지급 완료 라벨 자동 갱신
□ DebugDrawer — 모든 차원 토글, Quick jump 7개, Reset/Export/Import
□ Accessibility — 키보드 완주, focus trap, Esc, reduced-motion, 대비 AA
```

### 8.4 CI

- Vitest 유닛 테스트 — 모든 PR 필수
- Visual regression Playwright — P1 (셋업 후 별도 PR)
- 빌드 — `next build` 성공 확인

---

## 9. 본 설계서의 Open Issues

스펙 §13의 Open Issues는 상위 의사결정 (캠페인 운영팀 영역)이므로 별도. 본 설계서 단계에서 새로 등장한 이슈만 정리.

| # | 이슈 | 영향 | 처리 시점 |
|---|------|------|----------|
| F-1 | OKX UID 정규식 — 잠정 `^\d{6,20}$` 사용. 스펙 Open Issue #11 확정 시 `validators/okxUid.ts` 한 곳만 수정 | 입력 검증 정확도 | OKX UID 사양 수집 시 |
| F-2 | 약관·개인정보 본문 — 현재 placeholder. 법무팀 완성본 도착 시 `content/legal/` 에 교체 | TermsViewerModal 본문, 메타 페이지 | 법무 검토 완료 시 |
| F-3 | OG 이미지 — 1200×630, 공유 시 표시. 디자인 확정 필요 | SEO/공유 외관 | 디자인 작업 시 |
| F-4 | favicon / 메타 정보 — 이벤트 전용 아이콘 사용 여부 | 브랜드 일관성 | 디자인 작업 시 |
| F-5 | 비거래자 ICX 인당 지급량 — 스펙 Open Issue #12로 "추후 확정". `IcxRewardCard` 비거래자 분기 카피는 "TBD"로 표시 | 비거래자 UX 카피 | 운영팀 확정 시 |
| F-6 | 슬롯 카운터 5분 갱신 시뮬레이션 — mock에서는 디버그 패널 조작으로 대체. 실 환경 polling 구현은 백엔드 연동 시점 | 실시간성 demo | 백엔드 연동 시 |

---

## 10. 본 문서가 다루지 않는 것

본 설계서는 프론트엔드 프로토타입에 한정한다. 다음 영역은 의도적으로 제외:

- API 엔드포인트 / DB 스키마 / 인증 토큰 흐름 — 개발팀 별도 기술 명세서
- 어드민 대시보드 — 스펙 §8.2 / §10 영역, 별도 산출물
- 실제 거래소 OAuth / API 키 / 거래량 집계 — 본 서비스 기존 구현 재사용
- 어뷰징 방지 백엔드 로직 (디바이스 fingerprint, 자전거래 탐지) — 백엔드 영역
- 운영팀 수동 송금 / TX 해시 입력 / 권한 분리 — 어드민 영역
- 법무 검토 (약관·개인정보) — 법무팀 영역
- 분석·트래킹 (퍼널, First Trade TTC, 2x 레버리지 검증) — 본 서비스 또는 별도 분석 영역
