# Lime Street Launch

A five-minute, competitive browser game about launching a new syndicate at Lloyd's.

You choose a business mix, pitch to the Business Opportunities Committee, raise Funds at Lloyd's, get through the red tape, and then bind portfolios through a year of account while catastrophes, Performance Management and three rival syndicates try to ruin your day. Everyone gets the same market each week, so the weekly leaderboard comes down to skill.

**Play:** open `index.html` in any modern browser. It is a single self-contained file with no build step. It works offline, apart from the Google Fonts.

## How a game runs (about 5 minutes)

| Step | What you do | The real thing it mirrors |
|---|---|---|
| 1. Enquiry & Triage | Pick one of 10 business mix types, drag chips to tweak the split (up to 4 classes), and choose your Active Underwriter | Triage templates and the SBF class split |
| 2. The BOC | Slide answers across the table to a three-person panel, then press and hold to stamp | Business Opportunities Committee, then Council in-principle approval |
| 3. Making it Happen | Flick capital into your vault until you cover your ECA, then scribble signatures on the red tape | Capital set on the Lloyd's Standard Model (ECA = SCR × 1.35); FAL from corporate members, Names via members' agents and London Bridge 2; PRA/SM&CR, ATLAS coverholder approval, SBF |
| 4. Year of Account | Brokers bring portfolios (binders, consortia, QSs, lineslips). Drag each slip left to decline, down for a small line, or right for a big line. Read the small print, play Favours, place your reinsurance shield on the Peril Board, and handle cash calls | Delegated authority, consortia and quota shares; RDS aggregation; PMD monitoring; coming into line |
| 5. Three-year close | Pull the lever to reveal reserve development, then read your front page in *The Lime Street Ledger* | Long-tail reserve development and the three-year close |

**Controls:** drag, tap or use the keyboard:
- `←` / `↓` / `→` decide on a slip
- `R` reads the small print
- `1` / `2` / `3` play a Favour
- `P` opens the Peril Board

## Business mix types

| Mix type | How it plays |
|---|---|
| Nat Cat Reinsurance | Fat margins and the most capital; a hurricane can end you |
| Property D&F / US E&S | Binder-heavy; leakage if you don't watch the bordereaux |
| Casualty Treaty | Looks great until year 3; reserve development bites |
| Financial & Professional Lines | Long tail and softening rates; nuclear verdicts hurt |
| Cyber & Tech | Growth, the softest rates and a cloud-outage tail |
| Marine, Energy & Transport | Proper Lloyd's: port explosions, Gulf windstorm, war |
| Specialty Lines | Riots, heists and coups; the best diversification |
| Accident & Health | The grinder: low capital, thin margins |
| Frontier Risks | Space, aviation and parametric; boom or bust |
| Diversified Composite | The steadiest, but the BOC doubts your expertise |

## Scoring

Your score is the value your syndicate creates for its capital providers: the underwriting result minus the cost of the capital behind it, at £1k = 1 point. Everyone applies for the same £100m stamp.

```
Gross written premium − commission − attritional losses − cat losses
− reserve development − expenses and reinsurance spend = underwriting result
− cost of capital (and any cash call)                 = value created
+ 1,000 if you stayed on plan − 1,000 per PMD letter   = score
```

## Fair competition

The market (its modifier, the two catastrophes and the hidden quality of every portfolio) is seeded from the ISO week, so colleagues who pick the same mix face the same deals. When the game is opened as a published Claude artifact, scores go to a shared weekly leaderboard, and you can race the ghost of the week's leader. Opened as a plain file, it keeps a leaderboard on your device and offers a "Copy result" line to paste into chat.

## Under the hood

- The engine (`<script id="engine">`) is pure and has no DOM access: market seeding, capital and diversification credit, deal generation, scoring and the AI rivals. The class economics were tuned with a headless simulation over 104 seeded weeks, so that every mix type wins some weeks and no mix type wins more than about 15% of them.
- All graphics are drawn in code (HTML/CSS, inline SVG and a canvas effects layer) and all sound is synthesised with WebAudio. There are no image or audio files.

*Unofficial. Not affiliated with or endorsed by Lloyd's. All brokers, investors, rivals and people are fictional, and the numbers are simplified for play.*
