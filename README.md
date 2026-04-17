# tomodachi

Personality planner tool for Tomodachi Life.

## Localization data

Region selector options and locale text now come from `localizations.csv`.

- File format: `region_code,lang,region_label,path,value`
- `path` supports nested keys such as `ui.pageTitle` or `personalities.sweetie.name`.
- Slider labels are pipe-delimited arrays, for example:
  - `sliderLabels.movement,Movement|Slow|Quick`

To add a new localization, add rows with a new `region_code` and the fields you want to override.
