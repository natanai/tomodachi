const BANDS = [
  [0, 3],
  [4, 7],
  [8, 11],
  [12, 15]
];

const BAND_LABELS = ['0–3', '4–7', '8–11', '12–15'];

// The personality algorithm is intentionally based on mapped internal values.
// UI sliders now display those mapped values so the visuals match the real math.
const {
  SLOT_GRID,
  resolvePersonalityDataset,
  getPersonalityKeyForSlot,
  buildRegionsFromSheet,
  buildRegionRouting
} = PersonalityLocalization;

const BASE_EN_UI = {
  pageTitle: 'Tomodachi Life Mii Personality Planner',
  pageSubtitle: '',
  regionLabel: 'Region',
  personalityLabel: 'Target personality',
  freePlacementOption: 'Place Freely',
  freePlacementDescription: 'No target restrictions. Pick any slider values to see the resulting personality.',
  hintText: '',
  slidersHeading: 'Set your sliders',
  resultHeading: 'Result',
  currentResultLabel: 'Current result:',
  currentResultEmpty: 'Select Movement, Speech, Energy, and Attitude to see your result.',
  rangeText: 'Target ranges: Movement + Speech {ms}, Energy + Attitude {ea}.',
  resultText: '{name} — {group}{matchSuffix}',
  resultMatchSuffix: ' (matches target)',
  weightingNote: 'As you make selections, invalid options for the selected target personality will be grayed out.',
  overallNote: 'not used for personality'
};

const BASE_EN_GROUPS = {
  yellow: 'Considerate',
  green: 'Reserved',
  red: 'Outgoing',
  blue: 'Ambitious'
};

const BASE_EN_SLIDERS = {
  movement: ['Movement', 'Slow', 'Quick'],
  speech: ['Speech', 'Polite', 'Direct'],
  energy: ['Energy', 'Flat', 'Intense'],
  attitude: ['Attitude', 'Serious', 'Relaxed'],
  overall: ['Overall', 'Normal', 'Quirky']
};

const BASE_PERSONALITIES = {
  sweetie: { color: '#f2cf62' },
  charmer: { color: '#e68bb3' },
  strategist: { color: '#95c95e' },
  achiever: { color: '#2f93de' },
  buddy: { color: '#d7c25e' },
  goGetter: { color: '#ec709c' },
  cheerleader: { color: '#efc457' },
  merrymaker: { color: '#cd586f' },
  daydreamer: { color: '#f0b669' },
  dynamo: { color: '#ef873b' },
  perfectionist: { color: '#39c4af' },
  visionary: { color: '#2e7fd8' },
  observer: { color: '#56c6ca' },
  thinker: { color: '#37b5ae' },
  rogue: { color: '#5d78d7' },
  maverick: { color: '#8e77d6' }
};

let DATASETS = {};
let REGION_OPTIONS = [];
let REGION_DATASET_ALIASES = {};

async function loadRegions() {
  const response = await fetch('localizations.csv', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Unable to load localizations.csv (${response.status})`);
  }
  const csvText = await response.text();
  const regions = buildRegionsFromSheet(csvText);
  const routing = buildRegionRouting(regions, BASE_PERSONALITIES);
  DATASETS = routing.datasets;
  REGION_OPTIONS = routing.options;
  REGION_DATASET_ALIASES = routing.aliasMap;

  if (REGION_OPTIONS.length === 0) {
    throw new Error('No selectable regions were found in localizations.csv.');
  }
}

const SLIDER_KEYS = ['movement', 'speech', 'energy', 'attitude', 'overall'];

const picks = {
  movement: null,
  speech: null,
  energy: null,
  attitude: null,
  overall: null
};

let currentRegion = null;
let goals = [];

const regionSelectEl = document.getElementById('regionSelect');
const selectEl = document.getElementById('personalitySelect');
const goalBandsEl = document.getElementById('goalBands');
const sliderGridEl = document.getElementById('sliderGrid');
const currentResultEl = document.getElementById('currentResult');

async function initialize() {
  await loadRegions();
  currentRegion = getRegionContext('northAmerica');

  renderRegionOptions();
  const persistedRegion = new URLSearchParams(window.location.search).get('region')
    || window.localStorage.getItem('tomodachi.regionKey')
    || 'northAmerica';
  regionSelectEl.value = persistedRegion;
  if (!regionSelectEl.value) regionSelectEl.value = 'northAmerica';
  regionSelectEl.addEventListener('change', () => {
    currentRegion = getRegionContext(regionSelectEl.value);
    window.localStorage.setItem('tomodachi.regionKey', currentRegion.regionKey);
    const params = new URLSearchParams(window.location.search);
    params.set('region', currentRegion.regionKey);
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
    for (const key of SLIDER_KEYS) picks[key] = null;
    setupForRegion();
  });

  currentRegion = getRegionContext(regionSelectEl.value);
  setupForRegion();
}

function renderRegionOptions() {
  regionSelectEl.innerHTML = '';
  REGION_OPTIONS.forEach((region) => {
    const option = document.createElement('option');
    option.value = region.key;
    option.textContent = region.label;
    regionSelectEl.appendChild(option);
  });
}

function getRegionContext(regionKey) {
  const datasetKey = resolvePersonalityDataset(regionKey, REGION_DATASET_ALIASES);
  const dataset = DATASETS[datasetKey] || DATASETS.en_us;
  const ui = PersonalityLocalization.deepMerge(BASE_EN_UI, dataset.ui);
  const groups = normalizeGroupLabels(dataset.groups);
  const sliderLabels = PersonalityLocalization.deepMerge(BASE_EN_SLIDERS, dataset.sliderLabels);
  return {
    regionKey,
    datasetKey,
    lang: dataset.lang || 'en',
    ui,
    groups,
    sliderLabels,
    personalities: dataset.personalities
  };
}

function normalizeGroupLabels(rawGroups = {}) {
  const translated = {
    yellow: rawGroups.yellow || rawGroups.easygoing,
    green: rawGroups.green || rawGroups.reserved,
    red: rawGroups.red || rawGroups.energetic,
    blue: rawGroups.blue || rawGroups.confident
  };
  return PersonalityLocalization.deepMerge(BASE_EN_GROUPS, translated);
}

function setupForRegion() {
  document.documentElement.lang = currentRegion.lang;
  renderStaticText();
  goals = buildGoals(currentRegion);
  populatePersonalityOptions();
  selectEl.removeEventListener('change', render);
  selectEl.addEventListener('change', render);
  render();
}

function renderStaticText() {
  const { ui } = currentRegion;

  document.getElementById('pageTitle').textContent = ui.pageTitle;
  document.getElementById('pageSubtitle').textContent = ui.pageSubtitle;
  document.getElementById('regionLabel').textContent = ui.regionLabel;
  document.getElementById('personalityLabel').textContent = ui.personalityLabel;
  document.getElementById('hintText').textContent = ui.hintText;
  document.getElementById('slidersHeading').textContent = ui.slidersHeading;
  document.getElementById('resultHeading').textContent = ui.resultHeading;
  document.getElementById('currentResultLabel').textContent = ui.currentResultLabel;
  document.getElementById('weightingNote').textContent = ui.weightingNote;
  currentResultEl.textContent = ui.currentResultEmpty;
}

function populatePersonalityOptions() {
  selectEl.innerHTML = '';
  const freeOption = document.createElement('option');
  freeOption.value = 'free';
  freeOption.textContent = currentRegion.ui.freePlacementOption;
  selectEl.appendChild(freeOption);

  const groupOrder = ['yellow', 'red', 'green', 'blue'];

  groupOrder.forEach((groupKey) => {
    const groupEl = document.createElement('optgroup');
    groupEl.label = currentRegion.groups[groupKey];

    goals
      .filter((goal) => goal.groupKey === groupKey)
      .forEach((goal) => {
        const option = document.createElement('option');
        option.value = goal.id;
        option.textContent = goal.name;
        groupEl.appendChild(option);
      });

    selectEl.appendChild(groupEl);
  });

  const firstOption = selectEl.querySelector('option');
  if (firstOption) {
    selectEl.value = firstOption.value;
  }
}

function buildGoals(region) {
  const built = [];
  for (let row = 0; row < SLOT_GRID.length; row += 1) {
    for (let col = 0; col < SLOT_GRID[row].length; col += 1) {
      const slotId = SLOT_GRID[row][col];
      const personalityKey = getPersonalityKeyForSlot(slotId);
      const detail = region.personalities[personalityKey];
      built.push({
        id: built.length,
        name: detail.name,
        groupKey: getGroupKey(row, col),
        slotId,
        msBand: BANDS[col],
        eaBand: BANDS[row],
        msBandLabel: BAND_LABELS[col],
        eaBandLabel: BAND_LABELS[row],
        detail,
        personalityKey
      });
    }
  }
  return built;
}

function getGroupKey(row, col) {
  const lowMs = col <= 1;
  const highEa = row >= 2;

  if (lowMs && highEa) return 'yellow';
  if (!lowMs && highEa) return 'red';
  if (lowMs && !highEa) return 'green';
  return 'blue';
}

function render() {
  const isFreePlacement = selectEl.value === 'free';
  const goal = isFreePlacement ? null : goals[parseInt(selectEl.value || '0', 10)];
  if (!isFreePlacement && !goal) return;
  if (goal) {
    sanitizeInvalidPicks(goal);
    goalBandsEl.innerHTML = `
      <span class="personality-title" style="--personality-color: ${goal.detail.color};">${goal.name}</span>
      <span class="personality-subtitle">${goal.detail.inGameName}</span>
      <span>${goal.detail.description}</span>
      <span class="personality-range">${format(currentRegion.ui.rangeText, { ms: goal.msBandLabel, ea: goal.eaBandLabel })}</span>
    `;
  } else {
    goalBandsEl.textContent = currentRegion.ui.freePlacementDescription;
  }

  renderSliders(goal);
  renderCurrentResult(goal);
}

function renderSliders(goal) {
  // Keep allowed/disabled logic untouched; only the button text changed to mapped values.
  // Speech/Attitude intentionally skip internal 4 => 0,1,2,3,5,6,7,8.
  sliderGridEl.innerHTML = '';
  SLIDER_KEYS.forEach((key) => {
    const [baseLabel, left, right] = currentRegion.sliderLabels[key];
    const ariaLabel = key === 'overall'
      ? `${baseLabel} (${currentRegion.ui.overallNote})`
      : baseLabel;

    const row = document.createElement('div');
    row.className = 'slider-row';

    const trait = document.createElement('div');
    trait.className = 'trait';
    trait.textContent = baseLabel;

    const leftPole = document.createElement('div');
    leftPole.className = 'pole';
    leftPole.textContent = left;

    const boxes = document.createElement('div');
    boxes.className = 'boxes';

    for (let i = 1; i <= 8; i += 1) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'box';
      btn.classList.add(`pos-${i}`);
      const displayedValue = key === 'overall' ? i : mappedValue(key, i);
      btn.textContent = '';
      btn.setAttribute('aria-label', `${ariaLabel} ${displayedValue}`);

      const allowed = isAllowedForGoal(key, i, goal);
      if (allowed) {
        btn.classList.add('allowed');
      } else {
        btn.classList.add('disabled');
        btn.disabled = true;
      }

      if (picks[key] === i) {
        btn.classList.add('selected');
      }

      btn.addEventListener('click', () => {
        if (!allowed) return;
        picks[key] = picks[key] === i ? null : i;
        render();
      });

      boxes.appendChild(btn);
    }

    const rightPole = document.createElement('div');
    rightPole.className = 'pole';
    rightPole.textContent = right;

    const scale = document.createElement('div');
    scale.className = 'slider-scale';
    scale.append(leftPole, boxes, rightPole);

    row.append(trait, scale);
    sliderGridEl.appendChild(row);
  });
}

function sanitizeInvalidPicks(goal) {
  if (!goal) return;
  let changed = true;
  while (changed) {
    changed = false;
    for (const key of SLIDER_KEYS) {
      if (picks[key] === null) continue;
      if (!isAllowedForGoal(key, picks[key], goal)) {
        picks[key] = null;
        changed = true;
      }
    }
  }
}

function isAllowedForGoal(key, value, goal) {
  if (!goal) return true;
  if (key === 'overall') return true;

  const draft = { ...picks, [key]: value };
  for (let m = 1; m <= 8; m += 1) {
    if (draft.movement !== null && draft.movement !== m) continue;
    for (let s = 1; s <= 8; s += 1) {
      if (draft.speech !== null && draft.speech !== s) continue;
      const ms = mappedValue('movement', m) + mappedValue('speech', s);
      if (ms < goal.msBand[0] || ms > goal.msBand[1]) continue;

      for (let e = 1; e <= 8; e += 1) {
        if (draft.energy !== null && draft.energy !== e) continue;
        for (let a = 1; a <= 8; a += 1) {
          if (draft.attitude !== null && draft.attitude !== a) continue;
          const ea = mappedValue('energy', e) + mappedValue('attitude', a);
          if (ea >= goal.eaBand[0] && ea <= goal.eaBand[1]) return true;
        }
      }
    }
  }
  return false;
}

function renderCurrentResult(goal) {
  const hasMs = picks.movement !== null && picks.speech !== null;
  const hasEa = picks.energy !== null && picks.attitude !== null;

  const movementMapped = hasMs ? mappedValue('movement', picks.movement) : null;
  const speechMapped = hasMs ? mappedValue('speech', picks.speech) : null;
  const energyMapped = hasEa ? mappedValue('energy', picks.energy) : null;
  const attitudeMapped = hasEa ? mappedValue('attitude', picks.attitude) : null;

  if (!hasMs || !hasEa) {
    currentResultEl.textContent = currentRegion.ui.currentResultEmpty;
    currentResultEl.className = '';
    return;
  }

  const msBand = findBandIndex(movementMapped + speechMapped);
  const eaBand = findBandIndex(energyMapped + attitudeMapped);
  const slotId = SLOT_GRID[eaBand][msBand];
  const personalityKey = getPersonalityKeyForSlot(slotId);
  const result = currentRegion.personalities[personalityKey];
  const resultGroup = currentRegion.groups[getGroupKey(eaBand, msBand)];
  const matchesGoal = goal ? personalityKey === goal.personalityKey : false;

  currentResultEl.textContent = format(currentRegion.ui.resultText, {
    name: result.name,
    group: resultGroup,
    matchSuffix: matchesGoal ? currentRegion.ui.resultMatchSuffix : ''
  });
  currentResultEl.className = goal ? (matchesGoal ? 'ok' : 'warn') : '';
}

function findBandIndex(sum) {
  if (sum <= 3) return 0;
  if (sum <= 7) return 1;
  if (sum <= 11) return 2;
  return 3;
}

function mappedValue(key, visibleValue) {
  // Mapping from visible slider positions (1..8) to internal values used by personality math.
  // Movement/Energy map to 0..7; Speech/Attitude skip 4 and map to 0,1,2,3,5,6,7,8.
  const sliderIndex = visibleValue - 1;
  if (sliderIndex < 0 || sliderIndex > 7) return 0;
  if (key === 'speech' || key === 'attitude') {
    return sliderIndex <= 3 ? sliderIndex : sliderIndex + 1;
  }
  return sliderIndex;
}

function format(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, token) => `${values[token] ?? ''}`);
}

initialize().catch((error) => {
  console.error('Failed to initialize localizations:', error);
  currentResultEl.textContent = 'Unable to load localization sheet.';
});

console.assert(mappedValue('speech', 1) === 0, 'speech 1 should map to 0');
console.assert(mappedValue('speech', 5) === 5, 'speech 5 should map to 5');
console.assert(mappedValue('speech', 8) === 8, 'speech 8 should map to 8');
console.assert(mappedValue('attitude', 1) === 0, 'attitude 1 should map to 0');
console.assert(mappedValue('attitude', 5) === 5, 'attitude 5 should map to 5');
console.assert(mappedValue('movement', 1) === 0, 'movement 1 should map to 0');
console.assert(mappedValue('movement', 5) === 4, 'movement 5 should map to 4');
console.assert(mappedValue('energy', 8) === 7, 'energy 8 should map to 7');
console.assert(findBandIndex(3) === 0, '3 should be in band 0');
console.assert(findBandIndex(4) === 1, '4 should be in band 1');
console.assert(findBandIndex(7) === 1, '7 should be in band 1');
console.assert(findBandIndex(8) === 2, '8 should be in band 2');
console.assert(findBandIndex(11) === 2, '11 should be in band 2');
console.assert(findBandIndex(12) === 3, '12 should be in band 3');
