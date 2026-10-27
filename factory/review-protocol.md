# Review protocol (all four reviewers)

Every review is checked mechanically by `factory/check_review.py`. A review that
fails the check is re-run, and the tech-lead cannot approve a job with an
invalid review.

## 0. Is this a UI change?

Your prompt says `UI change: yes` or `UI change: no`. The orchestrator computes
it with `python3 factory/check_review.py ui-change <WT>`: **yes** when the branch
changes `src/app/**/*.tsx|css`, `src/components/`, `src/lib/fonts.ts`,
`messages/` or `public/`. What is required depends on it:

| Evidence line | UI change: yes | UI change: no |
|---|---|---|
| `Spec sections read:` | `§` citations — all reviewers | `§` citations for security and code; UX/UI may write `n/a — no visible change` |
| `Rendered checks:` | required — all reviewers | required — all reviewers |
| `Screenshots viewed:` | UX: `en-mobile-light`, `ar-mobile-light`, `ar-desktop-light` · UI: all five · others: optional | `n/a — no visible change` is fine |
| `Acceptance criteria verified myself:` | required | required |

## 1. Read the design spec, not just the job spec

Read the `docs/design-spec.md` sections listed in the job's `spec.md`
(*Design notes*) plus the sections named in your agent file, and cite them as
`§x.y`. Do not rely on the job spec's summary of the design spec.

## 2. Check the rendered site, not just the diff

The orchestrator serves a production build of the job branch for the whole
round at the **preview URL** in your prompt (`http://localhost:<PORT>`, one
port per job). Below, `$URL` is that URL.

```bash
curl -s  "$URL/en"  > "$OUT/en.html"
curl -s  "$URL/ar"  > "$OUT/ar.html"
curl -sI "$URL/en"          # status and headers
```

Grep the rendered output for what you are checking (text, `lang`/`dir`,
headings, `aria-*`, links, headers, new routes). Check every acceptance
criterion you can this way yourself — never mark one met because `build.md`
says so.

## 3. Screenshots (when the table above requires them)

```bash
OUT="${TMPDIR:-/tmp}/factory-<job-id>-r<n>-<reviewer>"; mkdir -p "$OUT"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
shot() { "$CHROME" --headless --disable-gpu --hide-scrollbars \
  --user-data-dir="$OUT/profile" --window-size="$2" $4 \
  --screenshot="$OUT/$3.png" "$URL/$1" 2>/dev/null; }
shot en 1280,2400 en-desktop-light
shot ar 1280,2400 ar-desktop-light
shot en 1280,2400 en-desktop-dark --force-dark-mode
shot en 500,2400  en-mobile-light
shot ar 500,2400  ar-mobile-light
```

Open **each required PNG** with the Read tool and look at it: layout, spacing,
alignment, RTL mirroring, overflow, contrast in both themes. Only list
screenshots you actually opened. Screenshots stay in `$OUT` (outside the repo).

Mobile shots are 500px wide: headless Chrome will not render a narrower
viewport (a smaller `--window-size` is silently cropped from a 500px layout and
looks like overflow, especially in RTL). 500px is still below the `sm` (640px)
breakpoint, so it shows the mobile layout. Overflow specific to 360–390px can't
be seen this way — check widths and `min-w-*`/fixed sizes in the code for that.

## 4. Rules

- Do not build, check out branches, or start/stop servers. Run git and npm
  commands inside the job worktree (`WT` in your prompt).
- Write only your own review file.
- `CHANGES` only for must-fix items; nits alone are a `PASS`.

## 5. End every review with this Evidence section

Use these exact labels — the checker looks for them:

```markdown
## Evidence
- Spec sections read: §2.2, §4.3
- Rendered checks: `curl $URL/ar | grep -c 'dir="rtl"'` → 1; …
- Screenshots viewed: en-mobile-light, ar-mobile-light, ar-desktop-light
- Acceptance criteria verified myself: 1, 2, 4 (not verified: 7 — needs a build)
```

Before you stop, run the checker on your own file and fix anything it reports:

```bash
python3 factory/check_review.py review <your review.md> <security|ux|ui|code> <yes|no>
```
