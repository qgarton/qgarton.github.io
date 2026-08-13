# Quaid Garton — Portfolio Site

A space-themed personal site built around a real, physically-verified n-body orbit animation. Static HTML/CSS/JS, no build step, deployed via GitHub Pages.

```
portfolio-site/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── orbits-data.js   (verified three-body orbit data for the hero animation)
│   └── script.js
└── img/
    ├── HeadShotJan2022.png
    ├── Earth-Mars_dV_Total.png
    ├── Star_Tracker_CubIST.png
    └── Rocket_Recovery.png
```

## Deploy it

1. Push this folder's contents to the root of a repo named `qgarton.github.io` (site lands at `https://qgarton.github.io`), or any repo with Pages enabled (site lands at `https://qgarton.github.io/repo-name/`).
2. **Settings → Pages** → Source: "Deploy from a branch," branch `main`, folder `/ (root)`. Save.
3. Live in a minute or two, at the URL GitHub shows on that settings page.

No dependencies. Fonts load from Google Fonts via a CDN link in `index.html`; everything else is plain HTML/CSS/JS.

---

## What's on the site

- **Hero**: name, tagline, and a glowing three-body orbit animation (see below), plus a circular headshot pinned to the top-right on desktop.
- **About**: bio, headshot, skills.
- **Projects**: three cards (OrbitKit, Star Tracker, Rocket Launch Controller), each with a photo, status chip, description, tags, and links.
- **Contact**: email / LinkedIn / GitHub.
- **Mobile nav**: below 900px, the desktop layout collapses into a hamburger dropdown, with a small version of the headshot pinned in the nav bar itself.

---

## The orbit animation

The glowing three-body system behind your name isn't decorative filler — every orbit in `js/orbits-data.js` is a **real, numerically-verified solution** to the Newtonian three-body problem. On each page load, `script.js` picks one of the entries at random, builds it into an SVG (glow-halo dots + fading comet trails, both riding the same verified path data), and animates it at the correct *non-uniform* speed — bodies genuinely move faster and slower over the course of the orbit, matching the real physics, not just a constant-speed loop.

Every entry was checked two ways before being added: **energy conservation** (should stay constant to within numerical noise) and **closure** (the orbit should return to ~its starting state after one period).

### 1. Figure-Eight
The classic Moore (1993) / Chenciner–Montgomery (2000) solution — three equal masses chasing each other around a single figure-eight-shaped curve, each offset by a third of the period. It's a genuine mathematical celebrity: proven stable, and one of the most famous periodic solutions to the three-body problem. Verified to a closure error of ~2×10⁻⁸.

### 2. Goggles
One of 13 new periodic families discovered by Šuvakov & Dmitrašinović (2013, *Physical Review Letters*) via a systematic numerical search. Unlike the figure-eight, the three bodies each trace their *own* distinct path rather than sharing one curve — this one gets its name from the two interlocking loop shapes it traces.

### 3. Yin-Yang I
Another family from the same 2013 paper — a denser, more folded orbit with the swirling two-lobe character its name suggests.

### Adding another orbit

1. **Get real initial conditions.** Either from a published source (Šuvakov & Dmitrašinović 2013, Li & Liao 2017, and Broucke/Hénon-family catalogs are all good hunting grounds), or by measuring your own from video/data and searching for a nearby periodic solution via Monte Carlo + refinement. Don't guess ICs from an image — three-body systems are chaotically sensitive, and close-but-wrong numbers diverge fast instead of looking "almost right."
2. **Integrate and verify.** Use an adaptive high-order integrator (`scipy.integrate.solve_ivp` with `DOP853` and tight `rtol`/`atol` is what every orbit here used) over one claimed period, and check both closure (does it return to its start?) and energy conservation (does it stay constant?). Both should be small — anything under ~10⁻⁴ is trustworthy for a decorative animation.
3. **Check for extreme close encounters**, not just closure/energy — a mathematically valid orbit can still involve two bodies swinging within a hair of each other, which reads visually as "bouncing" rather than "orbiting." Worth plotting the full path and eyeballing it before adding it to the rotation.
4. **Sample and format.** Take ~180 points at *equal time steps* (not equal arc-length) across one period, per body. That unevenness is what lets the animation move at realistic non-constant speed later. Build an SVG path string from the points, and compute `keyPoints` as the cumulative arc-length fraction at each sample (paired with `keyTimes` as the equal-time fractions) — this is what makes `calcMode="linear"` respect the true speed profile instead of SVG's default constant-speed "paced" mode.
5. **Push a new entry** into the `ORBITS` array in `orbits-data.js`. If every body shares one curve (a "choreography," like the figure-eight), you only need one shared `path`/`keyTimes`/`keyPoints` at the orbit level, with each body's `begin` offset staggering it along that shared curve. Otherwise, give each body its own `path`/`keyTimes`/`keyPoints`, and leave `begin` at `0`.

No changes to `script.js` are needed — it already picks a random entry and renders whatever shape the data describes.

---

## Adding a 4th (or 5th) project

Copy one `<article class="card">...</article>` block under `#projects` in `index.html`, edit the content, and it drops into the grid automatically — no CSS changes needed.
