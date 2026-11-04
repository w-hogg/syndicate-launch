/** @OnlyCurrentDoc */
// Lime Street Launch · game stats and the all-time top 5, kept in a Google Sheet.
// Games: one anonymous row per game, keyed by a game ID, updated as the player moves through the game.
// Top 5: names that players chose to add when they made the all-time top 5, shown to everyone in the game.
// (@OnlyCurrentDoc limits the script's Google permission to this one spreadsheet.)
//
// Setup:
//   1. Make a new Google Sheet. Extensions → Apps Script. Replace the code with this file. Save.
//   2. Deploy → New deployment → type "Web app". Execute as: Me. Who has access: Anyone. Deploy.
//   3. Copy the web app URL (it ends in /exec) and put it in the game as STATS_URL.
// The tabs "Games" and "Top 5" and their header rows are created when first needed.
// After changing this code: Deploy → Manage deployments → Edit → Version: New version → Deploy (the URL stays the same).

const SHEET = 'Games';
const MAX_ROWS = 50000; // stop adding rows past this, in case the URL is ever spammed
const COLS = [
  ['gameId', 'Game ID'], ['status', 'Reached'], ['started', 'Started'], ['updated', 'Last update'],
  ['player', 'Player (anonymous)'], ['playerGame', 'Player’s game no.'], ['minutes', 'Minutes played'],
  ['market', 'Market'], ['mix', 'Mix'], ['au', 'Active Underwriter'], ['share', 'Own share %'],
  ['score', 'Score'], ['grade', 'Grade'], ['y1', 'Year 1 £m'], ['y2', 'Year 2 £m'], ['y3', 'Year 3 £m'],
  ['cor', 'Combined ratio %'], ['pmd', 'PMD letters'], ['cashCalls', 'Cash calls'], ['runoff', 'Run-off in'],
  ['missed', '1.1 slips missed (Y1 / Y2 / Y3)'], ['early', 'Finished 1.1 early'], ['askTime', 'Ask for time'],
  ['shields', 'Cat XL shields (Y1 / Y2 / Y3)'], ['ilws', 'ILWs (Y1 / Y2 / Y3)'], ['liveCat', 'Live cat covers'],
  ['reinsCall', 'Reinsurance Call used'], ['inTray', 'In-tray answers'], ['badges', 'Badges'],
  ['feedback', 'Feedback sent'], ['shared', 'Result shared'], ['device', 'Device'], ['screen', 'Screen'], ['build', 'Game version']
];
// how far a game got, in order: a late or repeated message never moves a game backwards
const STATUSES = ['BOC', 'Capital', 'Red tape', 'Year 1', 'Year 2', 'Year 3', 'Close', 'Finished', 'Run-off'];
const rank_ = (s) => (s === 'Run-off' ? STATUSES.indexOf('Finished') : STATUSES.indexOf(s));
const col_ = (k) => COLS.findIndex((c) => c[0] === k);

function doPost(e) {
  let d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return reply_('bad request'); }
  if (d && d.app === 'lsl' && d.kind === 'top') return json_(addToTop_(d));
  if (!d || d.app !== 'lsl' || !/^g-[a-z0-9]{8,20}$/.test(String(d.gameId)) || STATUSES.indexOf(d.status) < 0) return reply_('ignored');
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return reply_('busy');
  try {
    const sh = sheet_();
    const now = new Date();
    const last = sh.getLastRow();
    const found = last > 1 ? sh.getRange(2, 1, last - 1, 1).createTextFinder(d.gameId).matchEntireCell(true).findNext() : null;
    let row, vals;
    if (found) {
      row = found.getRow();
      vals = sh.getRange(row, 1, 1, COLS.length).getValues()[0];
      if (rank_(d.status) < rank_(vals[col_('status')])) return reply_('stale');
    } else {
      if (last >= MAX_ROWS) return reply_('full');
      row = last + 1;
      vals = COLS.map(() => '');
      vals[col_('started')] = now;
    }
    COLS.forEach(([k], i) => {
      if (k === 'started') return;
      if (k === 'updated') vals[i] = now;
      else if (d[k] !== undefined && d[k] !== null) vals[i] = clean_(d[k]);
    });
    sh.getRange(row, 1, 1, COLS.length).setValues([vals]);
  } finally {
    lock.releaseLock();
  }
  return reply_('ok');
}

// ?top=1 returns the all-time top 5 as JSON; anything else confirms the deployment is live
function doGet(e) {
  if (e && e.parameter && e.parameter.top) return json_({ ok: true, top: top5_() });
  return reply_('Lime Street Launch stats receiver is running.');
}

// ---------- the all-time top 5: each player's best score, one entry per player ----------
const TOP_SHEET = 'Top 5';
const TOP_COLS = ['Name', 'Score', 'Mix', 'Active Underwriter', 'Market', 'Added', 'Player (anonymous)', 'Game ID'];
const TOP_N = 5, TOP_MAX = 250000;
// the same rules as the game: 2–20 letters, numbers, spaces and . ' & -, with at least one letter, and no rude words
const RUDE_PART = ['fuck', 'shit', 'wank', 'bitch', 'nigg', 'whore', 'slut', 'bastard', 'retard', 'pussy', 'bollock', 'hitler', 'faggot', 'paedo', 'pedo'];
const RUDE_WORD = ['cunt', 'cunts', 'cunty', 'dick', 'cock', 'prick', 'arse', 'ass', 'twat', 'rape', 'piss', 'nazi', 'fag', 'tit', 'tits', 'knob', 'slag', 'porn', 'sex', 'cum', 'anal', 'nob', 'poo', 'crap'];
function topName_(raw) {
  const s = String(raw == null ? '' : raw).replace(/\s+/g, ' ').trim();
  if (s.length < 2 || s.length > 20 || !/^[\p{L}\p{N} .'&-]+$/u.test(s) || !/\p{L}/u.test(s)) return null;
  const flat = s.toLowerCase().replace(/0/g, 'o').replace(/1/g, 'i').replace(/3/g, 'e').replace(/4/g, 'a').replace(/5/g, 's').replace(/7/g, 't');
  if (RUDE_PART.some((w) => flat.replace(/[^a-z]/g, '').includes(w))) return null;
  if (flat.split(/[^a-z]+/).some((w) => RUDE_WORD.includes(w))) return null;
  return s;
}
function topSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(TOP_SHEET) || ss.insertSheet(TOP_SHEET);
  if (sh.getLastRow() === 0) {
    sh.appendRow(TOP_COLS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, TOP_COLS.length).setFontWeight('bold');
  }
  return sh;
}
// every entry, best first: a player who has several keeps only their best (an earlier entry wins a tie)
function topAll_() {
  const sh = topSheet_(), n = sh.getLastRow() - 1;
  const rows = n > 0 ? sh.getRange(2, 1, n, TOP_COLS.length).getValues() : [];
  const best = {};
  rows.forEach((r) => {
    const score = Number(r[1]), player = String(r[6]), name = String(r[0]).replace(/^'/, '');
    if (!player || !name || !isFinite(score)) return;
    const t = r[5] instanceof Date ? r[5].getTime() : Date.parse(r[5]) || 0;
    const b = best[player];
    if (!b || score > b.score || (score === b.score && t < b.t)) best[player] = { name, score, mix: String(r[2]), au: String(r[3]), t, player, gameId: String(r[7]) };
  });
  return Object.keys(best).map((k) => best[k]).sort((a, b) => b.score - a.score || a.t - b.t);
}
const pub_ = (x) => ({ name: x.name, score: x.score, mix: x.mix, au: x.au, date: x.t ? Utilities.formatDate(new Date(x.t), 'Europe/London', 'd MMM yyyy') : '' });
function top5_() {
  const cache = CacheService.getScriptCache(), hit = cache.get('top5');
  if (hit) return JSON.parse(hit);
  const top = topAll_().slice(0, TOP_N).map(pub_);
  cache.put('top5', JSON.stringify(top), 60);
  return top;
}
function addToTop_(d) {
  const name = topName_(d.name), score = Math.round(Number(d.score));
  if (!name) return { ok: false, why: 'name' };
  if (!/^g-[a-z0-9]{8,20}$/.test(String(d.gameId)) || !/^p-[a-z0-9]{8,20}$/.test(String(d.player))) return { ok: false, why: 'bad request' };
  if (!isFinite(score) || score <= 0 || score > TOP_MAX) return { ok: false, why: 'score' };
  const cache = CacheService.getScriptCache(), rl = 'rl-' + d.player, tries = Number(cache.get(rl) || 0);
  if (tries >= 10) return { ok: false, why: 'busy' };
  cache.put(rl, String(tries + 1), 3600);
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return { ok: false, why: 'busy' };
  try {
    const all = topAll_();
    if (all.some((x) => x.gameId === d.gameId)) return { ok: true, top: all.slice(0, TOP_N).map(pub_), rank: rankOf_(all, d.player) };
    const mine = all.find((x) => x.player === d.player);
    const others = all.filter((x) => x.player !== d.player);
    const qualifies = (!mine || score > mine.score) && (others.length < TOP_N || score > others[TOP_N - 1].score);
    if (!qualifies) return { ok: false, why: 'not top 5', top: all.slice(0, TOP_N).map(pub_) };
    topSheet_().appendRow([clean_(name), score, clean_(d.mix || ''), clean_(d.au || ''), clean_(d.market || ''), new Date(), clean_(d.player), clean_(d.gameId)]);
    cache.remove('top5');
    const after = topAll_();
    return { ok: true, top: after.slice(0, TOP_N).map(pub_), rank: rankOf_(after, d.player) };
  } finally {
    lock.releaseLock();
  }
}
const rankOf_ = (all, player) => all.findIndex((x) => x.player === player) + 1;
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
  if (sh.getLastRow() === 0) {
    sh.appendRow(COLS.map((c) => c[1]));
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, COLS.length).setFontWeight('bold');
  }
  return sh;
}

// numbers stay numbers; text is capped and can never start a formula
function clean_(v) {
  if (typeof v === 'number') return isFinite(v) ? v : '';
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  let s = String(v).slice(0, 300);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function reply_(t) { return ContentService.createTextOutput(t); }
