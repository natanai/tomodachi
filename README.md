# tomodachi
personality tool

## Model note

This planner currently uses a **legacy inferred personality-band model** (the older 4x4 sum-band approach) to narrow valid slider builds.

- Legacy-model cell calculations are useful for exploration, but not fully confirmed as the current Tomodachi Life hidden implementation.
- Exact confirmed in-game observations now override legacy-model predictions when an exact slider build match exists.
- Confirmed current-game example builds are stored separately from the legacy model and can be loaded directly in the UI.
- Current-game personality wording/mapping is still under validation and is shown as inferred where applicable.
- For builds without confirmed observations, the planner still relies on the legacy inferred model for exploration.
- Confirmed examples prove those exact builds work, but they are not treated as exhaustive or unique.
- Overall is preserved in example builds for UI parity, but personality matching assumes Overall does not change personality outcome.
