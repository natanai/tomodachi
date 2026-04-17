const BANDS = [
  [0, 3],
  [4, 7],
  [8, 11],
  [12, 15]
];

const BAND_LABELS = ['0–3', '4–7', '8–11', '12–15'];

// The personality algorithm is intentionally based on mapped internal values.
// UI sliders now display those mapped values so the visuals match the real math.
const PERSONALITY_GRID = [
  ['observer', 'thinker', 'rogue', 'maverick'],
  ['strategist', 'perfectionist', 'achiever', 'visionary'],
  ['buddy', 'daydreamer', 'merrymaker', 'dynamo'],
  ['sweetie', 'cheerleader', 'charmer', 'goGetter']
];

const BASE_EN_UI = {
  pageTitle: 'Tomodachi Life Mii Personality Planner',
  pageSubtitle: 'Pick a personality, then build sliders that match it.',
  regionLabel: 'Region',
  personalityLabel: 'Target personality',
  freePlacementOption: 'Place Freely',
  freePlacementDescription: 'No target restrictions. Pick any slider values to see the resulting personality.',
  hintText: 'Click a number to select it. Grayed-out options can’t be used for this target.',
  slidersHeading: 'Set your sliders',
  resultHeading: 'Result',
  currentResultLabel: 'Current result:',
  currentResultEmpty: 'Select Movement, Speech, Energy, and Attitude to see your result.',
  rangeText: 'Target ranges: Movement + Speech {ms}, Energy + Attitude {ea}.',
  resultText: '{name} — {group}{matchSuffix}',
  resultMatchSuffix: ' (matches target)',
  weightingNote: 'Speech and Attitude are weighted differently in the game’s personality math.',
  overallNote: 'not used for personality'
};

const BASE_EN_GROUPS = {
  easygoing: 'Considerate',
  energetic: 'Outgoing',
  reserved: 'Reserved',
  confident: 'Ambitious'
};

const BASE_EN_SLIDERS = {
  movement: ['Movement', 'Slow', 'Quick'],
  speech: ['Speech', 'Polite', 'Direct'],
  energy: ['Energy', 'Flat', 'Intense'],
  attitude: ['Attitude', 'Serious', 'Relaxed'],
  overall: ['Overall', 'Normal', 'Quirky']
};

const BASE_PERSONALITIES = {
  sweetie: { name: 'Sweetie', inGameName: 'Softie (Sweetie)', description: 'Sensitive, emotional, and in tune with the feelings of those around them. Empathetic and sentimental.', color: '#f2cf62' },
  charmer: { name: 'Charmer', inGameName: 'Charmer', description: 'Radiant and always on form. Their effortless style is admired by all. Easily adapts to new situations.', color: '#e68bb3' },
  strategist: { name: 'Strategist', inGameName: 'Patient (Strategist)', description: 'Unique, carefree and creative. Always thinks way outside the box, without worrying what others think.', color: '#95c95e' },
  achiever: { name: 'Achiever', inGameName: 'Busy Bee (Achiever)', description: 'Diligent, productive, and highly efficient. An excellent planner who always follows through.', color: '#2f93de' },
  buddy: { name: 'Buddy', inGameName: 'Carer (Buddy)', description: 'Trustworthy and considerate. Puts their friends first and works hard to make sure everyone gets along.', color: '#d7c25e' },
  goGetter: { name: 'Go-Getter', inGameName: 'Adventurer (Go-Getter)', description: 'Bold and captivating. Their wit and charm lights up a room. It\'s never a dull moment when they\'re around!', color: '#ec709c' },
  cheerleader: { name: 'Cheerleader', inGameName: 'Optimist (Cheerleader)', description: 'Positive, enthusiastic, and always smiling. Smiles not only for their own sake, but to help others smile too.', color: '#efc457' },
  merrymaker: { name: 'Merrymaker', inGameName: 'Bubbly (Merrymaker)', description: 'Outgoing and pleasant to be around. Makes friends easily, and finds the silver lining to any bad situation.', color: '#cd586f' },
  daydreamer: { name: 'Daydreamer', inGameName: 'Dreamer (Daydreamer)', description: 'Idealistic and romantic. Often has their head in the clouds, but finds a lot of great ideas up there.', color: '#f0b669' },
  dynamo: { name: 'Dynamo', inGameName: 'Hot-Blooded (Dynamo)', description: 'Assertive and highly regarded. Trusts their instincts, and easily commands the respect of others.', color: '#ef873b' },
  perfectionist: { name: 'Perfectionist', inGameName: 'Perfectionist', description: 'Imaginative and inspired. Happiest when creating something. Finds beauty in even the smallest details.', color: '#39c4af' },
  visionary: { name: 'Visionary', inGameName: 'Leader (Visionary)', description: 'Ambitious and takes risks. Full of energy and does things on a whim. A force to be reckoned with.', color: '#2e7fd8' },
  observer: { name: 'Observer', inGameName: 'Introvert (Observer)', description: 'Self-sufficient and highly individual. Doesn\'t let their emotions show, but has a lot going on deep down.', color: '#56c6ca' },
  thinker: { name: 'Thinker', inGameName: 'Thinker', description: 'Thoughtful and introspective. Great at thinking things through and analysing from every angle.', color: '#37b5ae' },
  rogue: { name: 'Rogue', inGameName: 'Individualist (Rogue)', description: 'Intelligent and not afraid to show it. Knowledgeable in a wide range of subjects. Speaks with confidence.', color: '#5d78d7' },
  maverick: { name: 'Maverick', inGameName: 'Headstrong (Maverick)', description: 'A determined self-starter. Cuts their own path, letting nothing stand in their way. Quick to execute plans.', color: '#8e77d6' }
};

function deepMerge(base, override) {
  const output = Array.isArray(base) ? [...base] : { ...base };
  for (const [key, value] of Object.entries(override || {})) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      output[key] = deepMerge(base[key] || {}, value);
    } else {
      output[key] = value;
    }
  }
  return output;
}

function createEnglishRegion(code, regionLabel, overrides = {}) {
  return {
    code,
    lang: overrides.lang || 'en',
    regionLabel,
    ui: deepMerge(BASE_EN_UI, overrides.ui || {}),
    groups: deepMerge(BASE_EN_GROUPS, overrides.groups || {}),
    sliderLabels: deepMerge(BASE_EN_SLIDERS, overrides.sliderLabels || {}),
    personalities: deepMerge(BASE_PERSONALITIES, overrides.personalities || {})
  };
}

let REGIONS = {};

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
      continue;
    }
    current += char;
  }
  values.push(current);
  return values;
}

function setByPath(target, path, value) {
  const segments = path.split('.');
  let node = target;
  for (let i = 0; i < segments.length - 1; i += 1) {
    const segment = segments[i];
    if (!node[segment] || typeof node[segment] !== 'object') {
      node[segment] = {};
    }
    node = node[segment];
  }
  node[segments[segments.length - 1]] = value;
}

function buildRegionsFromSpreadsheet(csvText) {
  const lines = csvText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  lines.shift();
  const drafts = {};
  for (const line of lines) {
    const [code, lang, regionLabel, path, value] = parseCsvLine(line);
    if (!code || !path) continue;
    if (!drafts[code]) drafts[code] = { code, lang: lang || 'en', regionLabel };
    const parsedValue = path.startsWith('sliderLabels.') ? value.split('|') : value;
    setByPath(drafts[code], path, parsedValue);
  }

  const regions = {};
  Object.values(drafts).forEach((draft) => {
    regions[draft.code] = createEnglishRegion(draft.code, draft.regionLabel, {
      lang: draft.lang || 'en',
      ui: draft.ui || {},
      groups: draft.groups || {},
      sliderLabels: draft.sliderLabels || {},
      personalities: draft.personalities || {}
    });
  });
  return regions;
}

async function loadRegions() {
  const response = await fetch('localizations.csv');
  if (!response.ok) throw new Error('Could not load localizations.csv');
  const csvText = await response.text();
  REGIONS = buildRegionsFromSpreadsheet(csvText);
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
  renderRegionOptions();
  regionSelectEl.value = REGIONS.northAmerica ? 'northAmerica' : Object.keys(REGIONS)[0];
  currentRegion = REGIONS[regionSelectEl.value];
  regionSelectEl.addEventListener('change', () => {
    currentRegion = REGIONS[regionSelectEl.value] || Object.values(REGIONS)[0];
    for (const key of SLIDER_KEYS) picks[key] = null;
    setupForRegion();
  });

  setupForRegion();
}

function renderRegionOptions() {
  regionSelectEl.innerHTML = '';
  Object.values(REGIONS).forEach((region) => {
    const option = document.createElement('option');
    option.value = region.code;
    option.textContent = region.regionLabel;
    regionSelectEl.appendChild(option);
  });
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

  const groupOrder = ['easygoing', 'energetic', 'reserved', 'confident'];

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
  for (let row = 0; row < PERSONALITY_GRID.length; row += 1) {
    for (let col = 0; col < PERSONALITY_GRID[row].length; col += 1) {
      const personalityKey = PERSONALITY_GRID[row][col];
      const detail = region.personalities[personalityKey];
      built.push({
        id: built.length,
        name: detail.name,
        groupKey: getGroupKey(row, col),
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

  if (lowMs && highEa) return 'easygoing';
  if (!lowMs && highEa) return 'energetic';
  if (lowMs && !highEa) return 'reserved';
  return 'confident';
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
    const label = key === 'overall'
      ? `${baseLabel} (${currentRegion.ui.overallNote})`
      : baseLabel;

    const row = document.createElement('div');
    row.className = 'slider-row';

    const trait = document.createElement('div');
    trait.className = 'trait';
    trait.textContent = label;

    const leftPole = document.createElement('div');
    leftPole.className = 'pole';
    leftPole.textContent = left;

    const boxes = document.createElement('div');
    boxes.className = 'boxes';

    for (let i = 1; i <= 8; i += 1) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'box';
      const displayedValue = key === 'overall' ? i : mappedValue(key, i);
      btn.textContent = displayedValue;
      btn.setAttribute('aria-label', `${label} ${displayedValue}`);

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
  const personalityKey = PERSONALITY_GRID[eaBand][msBand];
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
  console.error('Failed to initialize localizations', error);
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
