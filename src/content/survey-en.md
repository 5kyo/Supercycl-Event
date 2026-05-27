# Supercycl Festival Survey (EN)

> Mirror of survey-ko.md in English. Edit both files in lockstep so
> Q numbers / types / required flags stay aligned. The parser is shared
> (`survey-parser.ts`); the only difference is user-facing strings.

## Q1
- area: 만족
- type: multi
- question: What did you like most about Supercycl?
- options:
  - Speed / responsiveness
  - UI / UX (ease of use)
  - Signal alerts (buy/sell signals)
  - Signal alerts (reverse warning signals)
  - One-tap orders / quick trading
  - Other

## Q2
- area: UX
- type: multi
- question: Which screen or feature was hardest to use?
- options:
  - Exchange connection
  - Order execution
  - Signal screen
  - Portfolio
  - None
  - Other

## Q3
- area: UX
- type: free
- required: true
- question: What feature would you like added?

## Q4
- area: 자동매매
- type: scale5
- question: Would you use AI auto-trading at launch? (1–5)

## Q5
- area: 거래소
- type: multi
- question: Which exchanges do you currently use?
- options:
  - Bybit
  - OKX
  - Bitget
  - Binance
  - BingX
  - Gate
  - Hyperliquid
  - Other

## Q6
- area: 2x 레버리지
- type: single
- question: Average leverage on other exchanges
- options:
  - 2x
  - 3x
  - 5x
  - 10x+
  - Custom

## Q7
- area: 2x 레버리지
- type: scale5
- question: Does Supercycl's 2x leverage cap help with risk management?

## Q8
- area: 인지
- type: single
- question: How did you hear about Supercycl?
- options:
  - Referral from a friend
  - Social media
  - Community
  - Search
  - Other

## Q9
- area: 프로필
- type: single
- question: Monthly crypto trading volume
- options:
  - Under $1,000
  - $1,000 – $10,000
  - $10,000 – $50,000
  - $50,000 – $200,000
  - $200,000+

## Q10
- area: 시그널 개인화
- type: multi
- question: Asset categories you're interested in
- options:
  - BTC
  - ETH
  - Alt
  - Meme
  - RWA (SK Hynix, Samsung, KOSPI, etc.)

## Q11
- area: 피드백
- type: free
- question: Anything you'd like Supercycl to improve? (optional)
