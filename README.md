# Tomodachi Life Mii Personality Planner

A small static web app that helps you target a specific **Tomodachi Life personality** by showing valid slider combinations and computing the resulting personality in real time.

## What the site does

- Lets the player pick a **Region** and a **Target personality**.
- Displays four gameplay-relevant sliders used in personality math:
  - Movement
  - Speech
  - Energy
  - Attitude
- Displays an additional **Overall** slider for completeness (it is intentionally excluded from personality classification).
- Grays out invalid slider choices when a target personality is selected.
- Shows the live resulting personality and whether it matches the target.

## How it works (high level)

1. On load, the app fetches `localizations.csv`.
2. `personality-localization.js` parses CSV rows into region objects (UI labels, group labels, slider labels, and personality names).
3. Region metadata (`datasetKey`, `sourceRegion`, `aliases`, `selectable`) is parsed from the sheet.
4. Regions are transformed into canonical personality datasets and dropdown options directly from those metadata rows.
5. The selected region key is resolved to one canonical dataset alias (for example, `australia` -> `en_gb`).
6. `script.js` computes personality slots using banded sums from:
   - Movement + Speech
   - Energy + Attitude
7. The current slot is mapped to a personality key, then localized name/text is rendered.

## Repository structure

- `index.html`
  - App shell + semantic sections for controls, sliders, and result output.
- `script.js`
  - Main runtime behavior:
    - region initialization
    - dropdown wiring
    - slider rendering and validation
    - result computation and display
- `personality-localization.js`
  - Localization/data plumbing:
    - CSV parsing
    - deep merge fallback behavior
    - sheet-driven region routing (`datasetKey`, `sourceRegion`, `aliases`, `selectable`)
    - region-to-dataset alias resolution + dropdown option generation
- `localizations.csv`
  - Source-of-truth localization sheet for:
    - metadata (`meta`)
    - UI strings (`ui`)
    - group labels (`groups`)
    - slider labels (`sliderLabels`)
    - per-personality labels (`personalities`)
- `styles.css`
  - All visual styling.
- `localization.test.js`
  - Node tests that verify alias resolution and canonical label expectations.
- `site.webmanifest`, `pull-icon.svg`, `social-preview.svg`
  - PWA + social/favicon assets.

## Information structure

### 1) Personality slot model

The app uses a fixed 4x4 slot grid (see `SLOT_GRID` in `personality-localization.js`).

- Columns are Movement+Speech bands: `0–3`, `4–7`, `8–11`, `12–15`
- Rows are Energy+Attitude bands: `0–3`, `4–7`, `8–11`, `12–15`
- Each slot ID (example: `red.2`) maps to one stable personality key (example: `goGetter`)

This slot mapping is intentionally stable across regions. Regions only change labels/text.

### 2) Slider math model

Visible slider positions are `1..8`, but internal mapped values differ by trait:

- Movement/Energy map to internal `0..7`
- Speech/Attitude map to internal `0,1,2,3,5,6,7,8` (skip 4)

That mapped value is what the personality algorithm uses.

### 3) Localization model (`localizations.csv`)

Every row has:

```csv
region,category,key,subkey,value
```

Categories:

- `meta`
  - `lang`, `regionLabel`, `datasetKey`, `sourceRegion`, `aliases`, `selectable`
- `ui`
  - page labels, hints, result templates
- `groups`
  - personality quadrant names
- `sliderLabels`
  - triplets per slider key: `label`, `left`, `right`
- `personalities`
  - per personality key fields like `name`, `inGameName`, `description`

### 4) Fallback behavior

- `northAmerica` rows are required and act as the baseline fallback.
- For each region, missing fields are deep-merged from `northAmerica`.
- Dataset and dropdown behavior is fully sheet-driven via `meta` rows:
  - `datasetKey`: canonical dataset ID (e.g. `en_gb`)
  - `sourceRegion`: which region record supplies dataset text
  - `aliases`: additional accepted keys for URL/localStorage
  - `selectable`: whether region appears in the dropdown

## Guide: add more localizations/regions to the Region dropdown

Use this checklist when adding a new region or locale.

### Step 1: Decide the region behavior you want

- **Standalone dataset**: region has its own text set (`datasetKey` points to itself).
- **Alias-only region**: region should reuse another region's text (`sourceRegion` points to that region).

### Step 2: Add/verify localization rows in `localizations.csv`

At minimum, add `meta` rows:

```csv
newRegionCode,meta,lang,,xx
newRegionCode,meta,regionLabel,,Display Name
```

Then add any override rows you need (`ui`, `groups`, `sliderLabels`, `personalities`).

> Tip: You can add partial translations first. Missing keys fall back to `northAmerica`.

### Step 3: Configure region routing in CSV metadata (no JS edits)

Add these optional `meta` rows for your region:

```csv
newRegionCode,meta,datasetKey,,xx_xx
newRegionCode,meta,sourceRegion,,pal
newRegionCode,meta,aliases,,shortCode|alternateName
newRegionCode,meta,selectable,,true
```

- `datasetKey`: canonical dataset identifier used internally.
- `sourceRegion`: which CSV region provides text for this dataset (defaults to the region itself).
- `aliases`: `|`-separated alternate keys accepted from URL/localStorage.
- `selectable`: `true` to show this region in the dropdown.

The site now builds dropdown options, alias resolution, and dataset wiring directly from this sheet metadata.

### Step 4: Verify behavior locally

Run:

```bash
node --test localization.test.js
```

Add/update tests in `localization.test.js` for:

- new alias resolution
- expected localized personality label differences (if any)
- stability of slot mapping across regions

### Step 5: Manual smoke check

Open the site, select your new region in the dropdown, and verify:

- Region appears and persists in URL/localStorage
- UI labels are expected
- Personality names are expected
- Result logic still functions

## Development notes

- The app is static and has no backend.
- All dynamic text comes from CSV-driven localization.
- Personality slot IDs/algorithm are kept region-independent by design.
