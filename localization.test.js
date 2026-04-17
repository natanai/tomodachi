const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  resolvePersonalityDataset,
  buildRegionsFromSheet,
  buildRegionRouting,
  SLOT_GRID,
  getPersonalityKeyForSlot
} = require('./personality-localization.js');

function loadDatasets() {
  const csv = fs.readFileSync(path.join(__dirname, 'localizations.csv'), 'utf8');
  const regions = buildRegionsFromSheet(csv);
  const routing = buildRegionRouting(regions, {});
  return { datasets: routing.datasets, aliasMap: routing.aliasMap, options: routing.options };
}

test('dataset resolver maps required regions correctly', () => {
  const { aliasMap } = loadDatasets();
  assert.equal(resolvePersonalityDataset('northAmerica', aliasMap), 'en_us');
  assert.equal(resolvePersonalityDataset('us', aliasMap), 'en_us');
  assert.equal(resolvePersonalityDataset('pal', aliasMap), 'en_gb');
  assert.equal(resolvePersonalityDataset('europe', aliasMap), 'en_gb');
  assert.equal(resolvePersonalityDataset('australia', aliasMap), 'en_gb');
  assert.equal(resolvePersonalityDataset('newZealand', aliasMap), 'en_gb');
  assert.equal(resolvePersonalityDataset('japan', aliasMap), 'ja_jp');
  assert.equal(resolvePersonalityDataset('korea', aliasMap), 'ko_kr');
});

test('dataset resolver requires an explicit alias map', () => {
  assert.throws(() => resolvePersonalityDataset('northAmerica'), /requires a routing alias map/i);
});

test('canonical en_us and en_gb slot labels are correct', () => {
  const { datasets } = loadDatasets();
  assert.equal(datasets.en_us.personalities.goGetter.name, 'Go-Getter');
  assert.equal(datasets.en_gb.personalities.goGetter.name, 'Adventurer');
  assert.equal(datasets.en_us.personalities.maverick.name, 'Maverick');
  assert.equal(datasets.en_gb.personalities.maverick.name, 'Headstrong');
  assert.equal(datasets.en_us.personalities.cheerleader.name, 'Cheerleader');
  assert.equal(datasets.en_gb.personalities.cheerleader.name, 'Optimist');
});

test('AU and NZ aliases resolve to the same English label set as UK/EU/PAL', () => {
  const { datasets, aliasMap } = loadDatasets();
  const auDataset = datasets[resolvePersonalityDataset('australia', aliasMap)];
  const nzDataset = datasets[resolvePersonalityDataset('newZealand', aliasMap)];
  const palDataset = datasets[resolvePersonalityDataset('pal', aliasMap)];

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

  const { datasets } = loadDatasets();
  assert.equal(datasets.en_us.personalities.goGetter.name, 'Go-Getter');
  assert.equal(datasets.en_gb.personalities.goGetter.name, 'Adventurer');
});

test('region dropdown options are sheet-driven', () => {
  const { options } = loadDatasets();
  assert.deepEqual(options, [
    { key: 'northAmerica', label: 'North America' },
    { key: 'pal', label: 'Europe / UK / PAL' },
    { key: 'australia', label: 'Australia / New Zealand' },
    { key: 'japan', label: '日本' },
    { key: 'southKorea', label: '대한민국' }
  ]);
});
