# Golf Sim Tracker

A simple, self-contained web app for logging and tracking golf shot numbers from a
golf simulator or launch monitor (TrackMan, Uneekor, Foresight/GCQuad, SkyTrak,
Garmin, Rapsodo, and others).

The app has three tabs: **Log** for shot entry and stats, **Wedge Matrix** for
your partial-wedge distance chart, and **Drills** for scored practice.

## Log

- **Log shots** with the metrics that matter: club, swing length, shot number,
  club speed, ball speed, launch angle, spin rate, carry, and total distance.
  The shot number auto-increments so you can just keep hitting.
- **Extra metrics**, under *More metrics* on the form: attack angle, club path,
  face angle, offline (side) distance, peak height, and descent angle. Fill in
  whatever your monitor gives you — blanks are ignored everywhere. Hit
  **Show all metrics** above the table to bring those columns into view.
- **Swing length** — Full, 3/4 (10:30), 1/2 (9:00) or 1/4 (7:30) — is tagged on
  every shot and feeds the wedge matrix. It stays selected between shots, so you
  can hit five in a row at the same swing without touching it.
- **Scan from a photo** — take or upload a picture of your launch monitor screen
  and on-device OCR reads the numbers straight into the form for you to confirm
  before saving. (Needs internet the first time you scan, to load the OCR
  engine; after that the numbers still get filled locally.)
- **Keeps the photo** with each shot, stored on your device (in the browser's
  IndexedDB, downscaled to save space). Tap the 📷 in the shots table to view
  it, and **Save to phone** to drop it into your Photos/Files.
- **Smash factor** is calculated automatically (ball speed ÷ club speed).
- **Session stats** — shot count, average carry, average ball speed, average
  smash factor, and longest carry — update live.
- **Insights** — a one-tap analysis of all your shots: plain-language takeaways
  (longest club, most consistent, biggest yardage gap, driver efficiency, your
  path-and-face shot shape, driver attack angle, alignment bias), an
  average-carry-by-club chart with dispersion, a per-club breakdown table
  (carry, consistency, total, ball/club speed, smash, launch, spin) and — when
  you've logged them — a delivery and flight table.
- **Filter** the shot table by club.
- **Import from CSV or Excel** — load an existing spreadsheet of shots. Columns
  are matched by header name (e.g. `Club`, `Swing`, `Ball Speed`, `Spin Rate`,
  `Carry`, `Total`, `Attack Angle`, `Club Path`, `Offline`), so it works with the
  app's own exports and with files from
  most sim/launch-monitor software. `.csv` is read directly; `.xlsx` loads a
  reader on first use (needs internet once — otherwise Save As CSV in Excel).
- **Export to CSV** for analysis in a spreadsheet.
- **Persistent** — everything is saved to your browser's local storage, so your
  data is still there when you come back.

Partial swings count as their own shot in the stats: a half PW is a different
club from a full PW, so it gets its own line in Insights rather than being
averaged in and making your wedges look wilder than they are.

## Wedge Matrix

Your carry distance for every wedge at every swing length, built from the shots
you log — the chart that tells you what to hit from 68 yards.

- **Distance chart** — PW / GW / SW / LW down the side, Full / 3/4 / 1/2 / 1/4
  across the top. Each square shows your average carry, how many shots it's
  based on, and how tight they were. A green dot means five or more shots (trust
  it), red means you're still filling it in.
- **Type a number in by hand** for any square you already know — tap the square.
  Hand-typed numbers are marked as such, and logged shots take over as soon as
  you have some.
- **What do I hit from…** — enter a yardage and get the three closest club-and-
  swing combinations, how far each one is over or under the number, and how
  reliable it's been.
- **Coverage & gaps** — every number you own, longest to shortest, with the gap
  between each. Holes over 12 yards are flagged in red (the yardages you get
  stuck between clubs on) and near-duplicates in amber.

Clubs are matched by name or by loft, so `SW`, `Sand Wedge` and `56°` all land
on the same row. Shots logged before swing lengths existed count as full swings.

## Drills

Ten drills covering wedge distance control, strike, gapping, dispersion, tempo
and short game. Each one gives you the point of the drill, how to set it up,
how to run it, and a target to beat.

- **Self-scoring drills** read your logged shots: *Build the Matrix* tracks how
  many squares are dialled in, *Centre-Strike Chase* scores your last 25 shots
  against a smash-factor target for the club in hand, *Carry Window* measures
  how many of your last ten carries land inside a 10-yard window, and *Start
  Line Gate* uses your offline numbers.
- **Hand-scored drills** — Ladder, Random Number Game, Two-Club Gap Test, 3:1
  Tempo, Towel Low-Point, Up & Down 9 — take a score out of 9 or 10 plus a note.
- **Every session is saved**, so each drill shows your last score, your best, and
  how many times you've played it.
- The Random Number Game throws you a yardage from inside your own matrix range,
  and reveals what the matrix says only after you've committed to a club.

No build step, no dependencies, no server.

**Live:** https://afternoongolfclub.github.io/golfsimtracker/

## Usage

Open `index.html` in any modern web browser.

That's it. Log a shot with the form on the left; your shots and stats appear on
the right.

To log from a photo, tap **Take / choose photo**, point at (or select) a picture
of your launch monitor screen, and the readable numbers are filled in for you. Always
give them a quick check before hitting **Add Shot** — OCR is best-effort and can
misread on blurry or angled shots.

On a phone, open the deployed site and use **Add to Home Screen**; the web
manifest and icons are set up so it launches like an app.

## Deploying

The site is static — every file is served as-is from the repository root, so any
static host works.

**GitHub Pages** is wired up in `.github/workflows/deploy-pages.yml`: every push
to `main` publishes the repository root.

**Netlify.** `netlify.toml` is checked in with the publish directory and cache
headers, so there is nothing to configure — import the repository and leave the
build command empty.

## Data & privacy

All data stays in your browser — shots, hand-typed matrix numbers and drill
scores in `localStorage`, photos in IndexedDB. Nothing is uploaded
anywhere. Use **Export CSV** to back up or move your data, and **Clear All** to
wipe it.

## Related

Hosel adjustment charts for adjustable drivers, fairways and hybrids live in
their own app: [afternoongolfclub/golf](https://github.com/afternoongolfclub/golf).
