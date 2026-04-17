const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  resolvePersonalityDataset,
  buildRegionsFromSheet,
  buildDatasetsFromRegions,
  SLOT_GRID,
  getPersonalityKeyForSlot
} = require('./personality-localization.js');

function loadDatasets() {
  const csv = fs.readFileSync(path.join(__dirname, 'localizations.csv'), 'utf8');
  const regions = buildRegionsFromSheet(csv);
  return buildDatasetsFromRegions(regions, {});
}

test('dataset resolver maps required regions correctly', () => {
  assert.equal(resolvePersonalityDataset('northAmerica'), 'en_us');
  assert.equal(resolvePersonalityDataset('us'), 'en_us');
  assert.equal(resolvePersonalityDataset('pal'), 'en_gb');
  assert.equal(resolvePersonalityDataset('europe'), 'en_gb');
  assert.equal(resolvePersonalityDataset('australia'), 'en_gb');
  assert.equal(resolvePersonalityDataset('newZealand'), 'en_gb');
  assert.equal(resolvePersonalityDataset('japan'), 'ja_jp');
  assert.equal(resolvePersonalityDataset('korea'), 'ko_kr');
});

test('canonical en_us and en_gb slot labels are correct', () => {
  const datasets = loadDatasets();
  assert.equal(datasets.en_us.personalities.goGetter.name, 'Go-Getter');
  assert.equal(datasets.en_gb.personalities.goGetter.name, 'Adventurer');
  assert.equal(datasets.en_us.personalities.maverick.name, 'Maverick');
  assert.equal(datasets.en_gb.personalities.maverick.name, 'Headstrong');
  assert.equal(datasets.en_us.personalities.cheerleader.name, 'Cheerleader');
  assert.equal(datasets.en_gb.personalities.cheerleader.name, 'Optimist');
});

test('AU and NZ aliases resolve to the same English label set as UK/EU/PAL', () => {
  const datasets = loadDatasets();
  const auDataset = datasets[resolvePersonalityDataset('australia')];
  const nzDataset = datasets[resolvePersonalityDataset('newZealand')];
  const palDataset = datasets[resolvePersonalityDataset('pal')];

  assert.equal(auDataset.personalities.goGetter.name, palDataset.personalities.goGetter.name);
  assert.equal(nzDataset.personalities.maverick.name, palDataset.personalities.maverick.name);
  assert.notEqual(auDataset.personalities.goGetter.name, datasets.en_us.personalities.goGetter.name);
});

test('switching region affects labels only; stable slot IDs and slot mapping remain unchanged', () => {
  const usSlot = SLOT_GRID[3][3];
  const gbSlot = SLOT_GRID[3][3];
  assert.equal(usSlot, 'red.2');
  assert.equal(gbSlot, 'red.2');
  assert.equal(getPersonalityKeyForSlot(usSlot), 'goGetter');

  const datasets = loadDatasets();
  assert.equal(datasets.en_us.personalities.goGetter.name, 'Go-Getter');
  assert.equal(datasets.en_gb.personalities.goGetter.name, 'Adventurer');
});
