# Lime Street Launch

A seven-minute, competitive browser game about launching a new syndicate at Lloyd's.

You choose a business mix, pitch to the Business Opportunities Committee, raise Funds at Lloyd's and get through the red tape. Then you run three years of account through the real syndicate calendar: the 1.1 renewal rush, catastrophes tracked as Realistic Disaster Scenarios, the business plan, coming into line and the close. Three rival syndicates are trying to ruin your day. Everyone gets the same three-year market each week, so the weekly leaderboard comes down to skill.

**Play:** open `index.html` in any modern browser. It is a single self-contained file with no build step. It works offline, apart from the Google Fonts.

The game waits for you between steps: every "In reality" card has a Continue button (Enter or Space), and the Pause button (or `Esc`) stops the clock during timed parts.

After you press Start, **The road to the Room** gives an overview of every step ahead. A **journey bar** along the bottom of the screen then shows where you are: pre-launch (gold), the three years as an active syndicate (blue) and the close (green), with an estimate of the time left. Tap the bar at any time to see the full road with your completed steps ticked off; the game pauses while it's open.

## How a game runs (about 7 minutes)

**The opening (about 2 minutes)**

| Step | What you do | The real thing it mirrors |
|---|---|---|
| 1. Enquiry & Triage | Pick one of 10 business mix types, drag chips to tweak the split (up to 4 classes), and choose your Active Underwriter | Triage templates and the SBF class split |
| 2. The BOC | Slide answers across the table to a three-person panel, then press and hold to stamp | Business Opportunities Committee, then Council in-principle approval |
| 3. Making it Happen | **Fill the Stamp**: flick members' shares (Names via members' agents, a corporate investor, an ILS fund, a family office) and your agency's own capital into your £100m stamp, keeping at least 20% yourself. Then scribble signatures on the red tape | Syndicate capacity split between members; each member's Funds at Lloyd's (FAL) covers its share of the ECA (SCR × 1.35); managing agent's fee and profit commission on third-party capital; PRA/SM&CR, ATLAS coverholder approval, SBF |

**Three years of account (about 1½ minutes each)**

A planner bar runs January to December, with pins for 1.1, the Q1 review, 1.4 and 1.6 (not your dates), 1.7, SBF day and coming into line, plus a striped hurricane season. The playhead fast-forwards and stops at each beat:

| Beat | What you do | The real thing it mirrors |
|---|---|---|
| Renewal review (years 2 and 3) | Last year's books show traffic lights and the broker's offered rate. Drag the dogs into the shredder, or tap to cycle Renew → Grow → Shred | Renewal strategy before 1.1 |
| 1.1 rush | A flip clock counts down to midnight on 31 December. Brokers bring portfolios (binders, consortia, QSs, lineslips); drag each slip left to decline, down for a small line or right for a big line. Every slip shows which RDS it adds to, and whether it helps your mix or moves you off plan. The clock doesn't stop for the RDS Board | Most of the market renews on 1 January |
| Outwards | Place two annual cat XL shields on your RDS rows | Buying the reinsurance programme at 1.1 |
| Q1 review | Lloyd's checks your RDS against appetite and your mix against plan | PMD quarterly monitoring |
| Portfolio alerts | A coverholder misbehaves: audit it (£0.3m), exit the book, or ignore it and its loss ratio rises 35% | Binder oversight and bordereaux |
| Catastrophes | Forecast storms give you 10 seconds to buy a last-minute ILW or make the Reinsurance Call; earthquakes, cyber and man-made losses arrive without warning | Lloyd's RDS: compulsory natural and man-made scenarios, specialist scenarios and syndicate-defined ones |
| 1.7 window | A few mid-year slips, mostly property cat | The 1 July renewals |
| SBF day (1 September) | Read the market outlook, choose next year's stamp (Shrink, Hold, Grow, Go large, all based on this year's actual stamp), move up to two chips, and get PMD's stamp. PMD caps growth above a 95% projected combined ratio, blocks it above 105% and cuts the stamp by 20% above 115% | The Syndicate Business Forecast |
| Coming into line (30 November) | If your FAL plus funds held in the syndicate covers next year's ECA, you're in line. If not, a 12-second capital grab, or shrink the plan | Members coming into line |
| Annual report (31 December) | Projected combined ratio per open year (crediting your shields, ILWs and Reinsurance Calls), whether the year is on plan and why, reserve development, member and rival news, and the Derby standings | Year-end reporting |

**The close (about 45 seconds)**: pull the lever on a three-reel slot machine. Your first year of account closes by reinsurance to close (RITC) after 36 months; the other two are projected. Then read your front page in *The Lime Street Ledger*.

The **Capital**, **GWP** and **Mix** gauges show their reference marks (the solvency line and ECA, the on-plan band and the 120% PMD line, the plan mix) and open a short explanation when tapped. **Help** (?) explains the scoring and has a glossary of every Lloyd's term in the game.

**Controls:** drag, tap or use the keyboard:
- `←` / `↓` / `→` decide on a slip
- `R` reads the small print
- `1` / `2` / `3` play a Favour
- `P` opens the RDS Board (between renewal windows)
- `Esc` pauses

## Catastrophes and RDS

Each year draws one or two events from 23 scenarios, about half natural and half man-made or specialist. Hurricanes, typhoons, winter storms, floods, political crises and solar storms come with a forecast. Earthquakes, cyber, terrorism, marine, refinery and aviation losses do not, so only cover you bought in advance helps. Your exposure to each scenario is shown on the RDS Board against the appetite in your business plan. Terrorism and aviation scenarios are treated soberly.

## Business mix types

| Mix type | How it plays |
|---|---|
| Nat Cat Reinsurance | Fat margins and the most capital; a hurricane can end you |
| Property D&F / US E&S | Binder-heavy; leakage if you don't watch the bordereaux |
| Casualty Treaty | Looks great until the reserves develop |
| Financial & Professional Lines | Long tail and softening rates; nuclear verdicts hurt |
| Cyber & Tech | Growth, the softest rates and a cloud-outage tail |
| Marine, Energy & Transport | Proper Lloyd's: port explosions, Gulf windstorm, war |
| Specialty Lines | Riots, heists and coups; the best diversification |
| Accident & Health | The grinder: low capital, thin margins |
| Frontier Risks | Space, aviation and parametric; boom or bust |
| Diversified Composite | The steadiest, but the BOC doubts your expertise |

## Scoring

Your score is the value **your managing agency** creates over three years of account, at £1k = 1 point. Everyone applies for the same £100m stamp in year 1.

```
For each year of account:
  Gross written premium − commission − attritional losses − cat losses (after outwards)
  − reserve development − expenses and outwards spend  = syndicate underwriting result
  − members' share of that result                      = your share of the result
  − cost of your own capital (and your share of any cash call)
  + managing agency fees on members' shares
  + profit commission on members' profits (after their losses are made good)
                                                        = value to your agency
Add the three years, then
  + £0.5m (500 points) for each year on plan
  − £1.0m (1,000 points) per PMD letter                 = score (£1k = 1 point)
```

**Your stamp is split into shares.** Third-party members bring their own FAL, keep their share of the profit or loss, and pay you a fee and profit commission. Lloyd's wants at least 20% of the stamp to be your own. A big share of your own means more upside and more risk; a small one means steadier fee income. Every November, at coming into line, members react to the year by their own rules (shown on each card): after a bad one some walk away and you must fund their share, and after a good one some ask for a bigger share, which you can accept or decline.

**On plan** means a year's premium is within 85–115% of its stamp and no more than 20% of it is in different classes from the plan. The GWP and Mix gauges turn green when you're there, and the annual report says whether you made it.

**Grades** go on the final score: Lloyd's darling (45,000+), Solid franchise (28,000+), Keep calm and carry on (15,000+), PMD on speed-dial (0+) and Remediation plan (below 0). A careful player lands roughly 15/35/30/15/5% across them.

Profits stay in the syndicate until a year closes, so your share counts towards your capital but growth still needs FAL. Fall below 60% of your ECA after a catastrophe and Lloyd's calls for cash, and you pay your share of it. Pay up, or go into run-off and end the game.

**How likely are you to succeed?** In simulation over 52 seeded weeks, a careful player (reads the small print, buys outwards on the biggest scenarios, shreds bad renewals, watches the mix, follows the rate cycle) finishes with a positive score **more than 9 times in 10** whatever their own share. A casual player does so 8 to 9 times in 10, with a lower score. Random swiping succeeds about 1 time in 4. Keeping all of the stamp yourself gives the highest average (about 38,000 for a careful player); keeping 20% gives about 20,000, but a gentler worst case.

## Fair competition

The three-year market (each year's modifier, the catastrophes, the rate cycle and the hidden quality of every portfolio) is seeded from the ISO week, so colleagues who pick the same mix face the same deals. When the game is opened as a published Claude artifact, scores go to a shared weekly leaderboard, and you can race the ghost of the week's leader over 36 months. Opened as a plain file, it keeps a leaderboard on your device and offers a "Copy result" line to paste into chat.

## Under the hood

- The engine (`<script id="engine">`) is pure and has no DOM access: market seeding, the RDS catalogue, capital and diversification credit, deal generation, renewals, three-year scoring and the AI rivals. The class economics were tuned with a headless simulation of three-year games over 104 seeded weeks, so that skilled play beats naive play, outwards cut the downside, and every mix type wins some weeks.
- All graphics are drawn in code (HTML/CSS, inline SVG and a canvas effects layer) and all sound is synthesised with WebAudio. There are no image or audio files.

*Unofficial. Not affiliated with or endorsed by Lloyd's. All brokers, investors, rivals and people are fictional, and the numbers are simplified for play.*
