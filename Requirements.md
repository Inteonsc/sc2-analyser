# sc2-analyser Requirements

A living document. Tags: `[must]` = core functionality, `[should]` = strong preference, `[nice]` = backlog/ideas.

---

## Replay Library

The default home view. Shows all replays across all scanned accounts, merged into one table.

- `[must]` Display replays in a sortable table (columns: date, map, matchup, result, duration, players, APM)
- `[must]` Simple filter bar at the top of the table (race, matchup, result, account)
- `[must]` Clicking a replay navigates to the Replay Detail view
- `[should]` Virtual scrolling / pagination to handle 5000+ replays without performance issues
- `[should]` Persist last sort/filter state so returning from a replay detail view restores where you were
- `[should]` Advanced filter panel (expandable) for date range, duration range, map, patch/expansion, MMR range, build label, tags, and deep stats (e.g. supply blocked > N seconds in early game, unit count > N)
- `[nice]` Inline win/loss colouring on result column
- `[nice]` Quick preview on hover (players, map, result — no navigation required)
- `[nice]` Bulk select replays for comparison or export

---

## Sidebar

Persistent left-hand navigation. Minimal — only shows things the user has created or recently touched.

- `[must]` **Saved Views** section: list of user-created filtered/aggregated view presets
- `[must]` **Recent Replays** section: short list of individually opened replays
- `[must]` Double-clicking a Saved View loads it into the main view
- `[must]` Double-clicking a Recent Replay opens the Replay Detail view
- `[should]` Ability to rename or delete Saved Views
- `[should]` Recent Replays capped at a sensible number (e.g. 10–20), auto-trimmed
- `[nice]` Drag to reorder Saved Views
- `[nice]` Sidebar collapsible to icon-only mode

---

## Saved Views (Aggregated Stats)

Loaded into the main view when a Saved View is selected from the sidebar. Shows aggregate statistics for the filter set that defined the view.

- `[must]` Overall win/loss record and win rate
- `[must]` Breakdown by matchup (ZvT, ZvP, ZvZ etc.)
- `[must]` Most played maps with win rates per map
- `[should]` Win rate over time (trend chart)
- `[should]` Average game duration, APM
- `[should]` Save current filter state as a new Saved View from the Library filter bar
- `[nice]` Race distribution of opponents
- `[nice]` Exportable as CSV or image

---

## Replay Detail View

Full-screen view opened by clicking a replay. Header shows headline info; tabs show different analysis modes.

### Header (always visible)
- `[must]` Player names, races, result
- `[must]` Map name, game duration, date played
- `[must]` Matchup label (e.g. TvP)
- `[should]` Account the replay belongs to

### Build Order tab
- `[must]` Chronological list of units, buildings, upgrades produced by each player
- `[must]` Timestamps for each event
- `[should]` Side-by-side view for both players
- `[should]` Colour-coded by unit type (unit / building / upgrade / ability)
- `[nice]` Highlight supply blocks
- `[nice]` Highlight benchmark timings (e.g. first rax, first CC)

### Stats tab

All per-player time-series data sourced from `PlayerStats` tracker events (fired every 10 seconds).

- `[must]` Resource collection rate over time (minerals + gas, per player)
- `[must]` Resources mined over time — cumulative `minerals_collected` + `vespene_collected` per player
- `[must]` Resources lost over time — cumulative value of units/buildings lost per player
- `[must]` **Graph overlay mode** — individual metrics (e.g. resources mined, resources lost, army value) can be toggled on/off and overlaid on the same graph axes for direct comparison
- `[must]` **Effective resources graph** — a dedicated graph showing a single line per player of `resources mined − resources lost`; not an overlay, always its own clean view
- `[must]` Army value over time
- `[must]` Stats broken down by game phase (early / mid / late / all) — e.g. supply blocked 2min in early, 6min overall
- `[must]` **Fight overlay** — red/green bands rendered on top of graphs at timestamps where a significant lopsided exchange occurred; green = came out ahead, red = came out behind; band opacity scales with how one-sided the exchange was
- `[should]` Fight detection threshold configurable (minimum total value destroyed, minimum loss ratio) — defaults tuned per matchup since ZvZ has many small cheap fights vs late TvT
- `[should]` Click a fight band to jump to that timestamp in the event log
- `[should]` APM over time
- `[should]` Workers active over time
- `[should]` Spending efficiency
- `[should]` Supply block duration displayed per phase and in total; highlighted on timeline
- `[nice]` Overlay multiple replays for comparison
- `[nice]` Annotate key moments on the timeline

### Game Events tab (power user)
- `[should]` Raw event log, filterable by event type
- `[should]` Searchable
- `[nice]` Export events as JSON

### Chat tab
- `[should]` In-game chat messages with timestamps

---

## Settings

- `[must]` Add / remove / change replay folder paths
- `[must]` Trigger manual rescan of folders
- `[must]` Configurable game phase time brackets (early/mid/late), with matchup-specific defaults (e.g. ZvZ early = 0–4min, TvT early = 0–7min)
- `[should]` Per-account enable/disable (if multiple Battle.net accounts detected)
- `[should]` Auto-scan on app start toggle
- `[nice]` Watch folder for new replays and update library live
- `[nice]` Theme toggle (dark / light)

---

## General / App-wide

- `[must]` Electron desktop app (Windows primary target)
- `[must]` Powered by sc2js for all replay parsing
- `[must]` Handles 5000+ replays without significant slowdown
- `[should]` App remembers window size and last open view between sessions
- `[should]` Graceful handling of corrupt or unreadable replay files (log error, skip, don't crash)
- `[nice]` Keyboard shortcuts for common actions (open replay, back, next/previous replay)
- `[nice]` macOS / Linux support

---

## Advanced Filters

Filters split into two tiers. Tier 1 (header-level) is always fast — queried directly from the index. Tier 2 (deep stats) requires precomputed values stored in the database at scan time.

**Tier 1 — always available:**
- `[must]` Date range, matchup, result, map, duration, account
- `[must]` MMR / MMR difference range
- `[should]` Patch / expansion

**Tier 2 — precomputed at scan time (full parse):**
- `[must]` Supply blocked duration per game phase (early/mid/late/total)
- `[must]` Unit or building count (e.g. built more than N roaches)
- `[must]` Resources lost per game phase and total
- `[must]` Effective resources at end of game (mined minus lost) — useful for filtering lopsided economic games
- `[should]` First occurrence time of a specific unit/building (e.g. first barracks before 60s)
- `[should]` Worker count at specific timestamps (e.g. 16 workers at 4 minutes)
- `[should]` Build label (see User Data section)
- `[should]` Tags (see User Data section)
- `[nice]` Spending efficiency thresholds
- `[nice]` APM range

> **Note:** Tier 2 stats must be precomputed and stored in the database at scan time. Adding new filterable stats later requires a rescan. Decide on the core set before finalising the DB schema.

---

## User Data (Tags, Builds, Notes)

Stored as extra columns on the replay database record. Lightweight — no separate system needed.

- `[must]` User can manually assign a **build label** to a replay (e.g. "12 pool", "roach ravager all-in")
- `[must]` User can assign one or more **tags** to a replay (e.g. "cheese", "tournament", "good game")
- `[must]` Apply a build label or tags to all replays matching the current filter in one action
- `[should]` User can add free-text **notes** to a replay
- `[should]` **Auto-assign build labels** based on configurable fingerprints — a build is matched if defined conditions are met within tolerance (e.g. SpawningPool before supply 13 ± 1 → "12 pool")
- `[should]` Manual labels always override auto-assigned ones
- `[should]` User can define and save custom build fingerprints
- `[nice]` Simple opening detection for common builds (12 pool, hatch first, 3 hatch before pool etc.) shipped as defaults
- `[nice]` Tag autocomplete based on previously used tags

---

## Custom Graphs

Lets users plot any metric against any dimension, scoped to a filter set.

- `[must]` User picks a **metric** (Y axis) from a fixed set: winrate, avg supply blocked, avg APM, avg game duration, unit count, worker count at time T, avg resources mined, avg resources lost, avg effective resources (mined − lost)
- `[must]` User picks a **dimension** (X axis / grouping) from a fixed set: map, matchup, build label, MMR range bucket, date bucket
- `[must]` Apply any saved filter as the scope of the graph (e.g. "only ZvP", "only 2025 games")
- `[must]` Save a graph configuration and display it from the sidebar or a dedicated graphs view
- `[should]` Support bar chart, line chart, and scatter plot types
- `[should]` Multiple graph configs can be saved and named
- `[nice]` Display multiple filter scopes on the same graph as separate series (e.g. ZvT vs ZvP winrate over time on one chart)
- `[nice]` Export graph as image

> **Note:** Aggregation is done via SQL GROUP BY on the precomputed stats DB. The graph system generates the right query from the user's dimension/metric/filter selection.

---

## Notes / Half-formed ideas

- Could support multiple ladder accounts being merged with a toggle to filter by account
- Replay comparison mode (two replays side by side) could be interesting for studying build order variations
- Potentially show minimap snapshots at key timestamps if map image data is available
- Precomputed stats schema needs to be decided before building the scan pipeline — adding new stats later requires a full rescan
- Build fingerprint system could eventually support community-shared fingerprint packs