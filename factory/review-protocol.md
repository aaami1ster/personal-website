# Review protocol (all four reviewers)

Every reviewer follows this before writing its review. A review that skips it
is invalid and the orchestrator re-runs it.

## 1. Read the design spec, not just the job spec

- Read the `docs/design-spec.md` sections listed in the job's `spec.md`
  (*Design notes*), plus the sections named in your own agent file.
- Cite them as `§x.y` in your findings. Do not rely on the job spec's summary
  of the design spec.

## 2. Check the rendered site, not just the diff

The orchestrator serves a production build of the job branch for the whole
round at the **preview URL** in your prompt (normally `http://localhost:3300`).

```bash
curl -s  http://localhost:3300/en  > "$OUT/en.html"
curl -s  http://localhost:3300/ar  > "$OUT/ar.html"
curl -sI http://localhost:3300/en          # status and headers
```

Grep the rendered HTML for what you are checking (text, `lang`/`dir`,
headings, `aria-*`, links, classes). Check every acceptance criterion that can
be checked this way yourself — never mark one met because `build.md` says so.

## 3. Look at it (required for UX and UI, optional for others)

```bash
OUT="${TMPDIR:-/tmp}/factory-<job-id>-r<n>-<reviewer>"; mkdir -p "$OUT"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
shot() { "$CHROME" --headless --disable-gpu --hide-scrollbars \
  --user-data-dir="$OUT/profile" --window-size="$2" $4 \
  --screenshot="$OUT/$3.png" "http://localhost:3300/$1" 2>/dev/null; }
shot en 1280,2400 en-desktop-light
shot ar 1280,2400 ar-desktop-light
shot en 1280,2400 en-desktop-dark --force-dark-mode
shot en 500,2400  en-mobile-light
shot ar 500,2400  ar-mobile-light
```

Mobile shots are 500px wide: headless Chrome will not render a narrower
viewport (a smaller `--window-size` is silently cropped from a 500px layout and
looks like overflow, especially in RTL). 500px is still below the `sm` (640px)
breakpoint, so it shows the mobile layout. Overflow specific to 360–390px can't
be seen this way — check widths and `min-w-*`/fixed sizes in the code for that.

Then open each PNG with the Read tool and look at it: layout, spacing,
alignment, RTL mirroring, overflow, contrast in both themes. Screenshots stay
in `$OUT` (outside the repo).

## 4. Rules

- Do not build, check out branches, or start/stop servers.
- Write only your own review file.
- `CHANGES` only for must-fix items; nits alone are a `PASS`.

## 5. End every review with an Evidence section

```markdown
## Evidence
- Spec sections read: §2.2, §4.3, …
- Rendered checks: `curl …/ar | grep -c 'dir="rtl"'` → 1, …
- Screenshots viewed: en-desktop-light, ar-mobile-light, …
- Acceptance criteria verified myself: 1, 2, 4 … (not verified: 7 — why)
```
