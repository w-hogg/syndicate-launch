// Lime Street Launch · game stats receiver for a Google Sheet.
// One row per game, keyed by an anonymous game ID, updated as the player moves through the game.
//
// Setup:
//   1. Make a new Google Sheet. Extensions → Apps Script. Replace the code with this file. Save.
//   2. Deploy → New deployment → type "Web app". Execute as: Me. Who has access: Anyone. Deploy.
//   3. Copy the web app URL (it ends in /exec) and put it in the game as STATS_URL.
// The sheet tab "Games" and its header row are created on the first game.

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

// open the URL in a browser to check the deployment is live
function doGet() { return reply_('Lime Street Launch stats receiver is running.'); }

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
