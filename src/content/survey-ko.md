# Supercycl Festival Survey (KO)

> 이 파일이 설문지의 단일 출처입니다.
> 편집 후 저장하면 dev 서버에서 자동으로 반영됩니다 (`SurveyModal`).
>
> 형식:
> - 질문은 `## Q<번호>`로 시작
> - 메타데이터는 `- <key>: <value>` 한 줄
> - `type`은 `multi` / `single` / `free` / `scale5` 중 하나
> - `multi`/`single`은 `- options:` 아래 들여쓰기로 보기 나열
> - `single`에서 자유응답 허용하려면 `- allowFree: true`
> - `free`에서 필수로 받으려면 `- required: true`

## Q1
- area: 만족
- type: multi
- question: Supercycl을 쓰면서 가장 좋았던 점
- options:
  - 속도/반응성
  - UI/UX (조작 편의성)
  - 시그널 알림(매수/매도 시그널)
  - 시그널 알림(역방향 경고 시그널)
  - 원탭 주문 / 간편 매매
  - 기타

## Q2
- area: UX
- type: single
- allowFree: true
- question: 가장 조작이 어려웠던 화면/기능
- options:
  - 거래소 연결
  - 주문 실행
  - 시그널 화면
  - 포트폴리오
  - 없음
  - 기타(직접 입력)

## Q3
- area: UX
- type: free
- required: true
- question: 추가되었으면 하는 기능

## Q4
- area: 자동매매
- type: scale5
- question: AI 자동매매 출시 시 사용 의향 (1~5)

## Q5
- area: 거래소
- type: multi
- question: 현재 쓰고 있는 거래소
- options:
  - Bybit
  - OKX
  - Bitget
  - Binance
  - BingX
  - Gate
  - Hyperliquid
  - 기타

## Q6
- area: 2x 레버리지
- type: single
- question: 다른 거래소 평균 사용 레버리지
- options:
  - 2x
  - 3x
  - 5x
  - 10x+
  - 직접 입력

## Q7
- area: 2x 레버리지
- type: scale5
- question: Supercycl의 2x 레버리지 제한이 리스크 관리에 도움이 되나요

## Q8
- area: 2x 레버리지
- type: multi
- question: Supercycl의 2x 제한에 대한 본인의 입장
- options:
  - 리스크 관리에 적합
  - 시그널 품질
  - 2x 제한 때문에 이용 안 함
  - 기타

## Q9
- area: 인지
- type: single
- question: Supercycl을 어떻게 알게 되었나요
- options:
  - 지인 추천
  - 소셜미디어
  - 커뮤니티
  - 검색
  - 기타

## Q10
- area: 프로필
- type: single
- question: 월평균 크립토 거래 금액대
- options:
  - $1,000 미만
  - $1,000 – $10,000
  - $10,000 – $50,000
  - $50,000 – $200,000
  - $200,000 이상

## Q11
- area: 시그널 개인화
- type: multi
- question: 관심 자산 카테고리
- options:
  - BTC
  - ETH
  - Alt
  - Meme
  - RWA (하이닉스, 삼성전자, 코스피 등)
