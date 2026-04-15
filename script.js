const BANDS = [
  [0, 3],
  [4, 7],
  [8, 11],
  [12, 15]
];

const BAND_LABELS = ["0–3", "4–7", "8–11", "12–15"];

// Old-game 4x4 math coordinates with latest-game names.
// Rows are Energy+Attitude bands from low (0-3) to high (12-15).
// Columns are Movement+Speech bands from low (0-3) to high (12-15).
const PERSONALITY_GRID = [
  ["Introvert", "Thinker", "Individualist", "Headstrong"],
  ["Patient", "Perfectionist", "Busy Bee", "Leader"],
  ["Carer", "Dreamer", "Charmer", "Adventurer"],
  ["Softie", "Optimist", "Bubbly", "Hot-Blooded"]
];

const SLIDERS = [
  ["movement", "Movement", "Slow", "Quick"],
  ["speech", "Speech", "Polite", "Direct"],
  ["energy", "Energy", "Flat", "Intense"],
  ["attitude", "Attitude", "Serious", "Relaxed"],
  ["overall", "Overall", "Normal", "Quirky"]
];

const SLIDER_MAPPED_VALUES = {
  movement: [0, 1, 2, 3, 4, 5, 6, 7],
  speech: [0, 1, 2, 3, 5, 6, 7, 8],
  energy: [0, 1, 2, 3, 4, 5, 6, 7],
  attitude: [0, 1, 2, 3, 5, 6, 7, 8],
  overall: [0, 1, 2, 3, 4, 5, 6, 7]
};

const GOAL_GROUP_ORDER = ["Easy-going", "Energetic", "Reserved", "Confident"];

const picks = {
  movement: null,
  speech: null,
  energy: null,
  attitude: null,
  overall: null
};

const selectEl = document.getElementById('personalitySelect');
const goalBandsEl = document.getElementById('goalBands');
const sliderGridEl = document.getElementById('sliderGrid');
const currentResultEl = document.getElementById('currentResult');
const msSumEl = document.getElementById('msSum');
const eaSumEl = document.getElementById('eaSum');
const msRangeEl = document.getElementById('msRange');
const eaRangeEl = document.getElementById('eaRange');
const totalBuildsEl = document.getElementById('totalBuilds');
const msPairsEl = document.getElementById('msPairs');
const eaPairsEl = document.getElementById('eaPairs');

const GOALS = buildGoals();

GOAL_GROUP_ORDER.forEach((groupName) => {
  const groupEl = document.createElement('optgroup');
  groupEl.label = groupName;

  GOALS.filter((goal) => goal.group === groupName).forEach((goal) => {
    const option = document.createElement('option');
    option.value = goal.id;
    option.textContent = goal.name;
    groupEl.appendChild(option);
  });

  selectEl.appendChild(groupEl);
});

selectEl.addEventListener('change', render);
render();

function buildGoals() {
  const goals = [];
  for (let row = 0; row < PERSONALITY_GRID.length; row += 1) {
    for (let col = 0; col < PERSONALITY_GRID[row].length; col += 1) {
      goals.push({
        id: goals.length,
        name: PERSONALITY_GRID[row][col],
        group: getGroupName(row, col),
        msBand: BANDS[col],
        eaBand: BANDS[row],
        msBandLabel: BAND_LABELS[col],
        eaBandLabel: BAND_LABELS[row]
      });
    }
  }
  return goals;
}

function getGroupName(row, col) {
  const lowMs = col <= 1;
  const highEa = row >= 2;

  if (lowMs && highEa) return 'Easy-going';
  if (!lowMs && highEa) return 'Energetic';
  if (lowMs && !highEa) return 'Reserved';
  return 'Confident';
}

function render() {
  const goal = GOALS[parseInt(selectEl.value || '0', 10)];
  sanitizeInvalidPicks(goal);

  const msPairs = buildMappedPairs("movement", "speech", goal.msBand[0], goal.msBand[1]);
  const eaPairs = buildMappedPairs("energy", "attitude", goal.eaBand[0], goal.eaBand[1]);

  goalBandsEl.textContent = `Goal uses old-game sum math: (Movement + Speech) in ${goal.msBandLabel}, and (Energy + Attitude) in ${goal.eaBandLabel}.`;
  msRangeEl.textContent = `${goal.msBand[0]} to ${goal.msBand[1]}`;
  eaRangeEl.textContent = `${goal.eaBand[0]} to ${goal.eaBand[1]}`;
  totalBuildsEl.textContent = `${msPairs.length * eaPairs.length * 8} combinations`;
  msPairsEl.textContent = pairLines('Movement + Speech', msPairs);
  eaPairsEl.textContent = pairLines('Energy + Attitude', eaPairs);

  renderSliders(goal);
  renderCurrentResult(goal);
}

function renderSliders(goal) {
  sliderGridEl.innerHTML = '';
  SLIDERS.forEach(([key, label, left, right]) => {
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
      btn.textContent = i;
      btn.setAttribute('aria-label', `${label} ${i}`);

      const allowed = isAllowedForGoal(key, i, goal);
      if (allowed) {
        btn.classList.add('allowed');
      } else {
        btn.classList.add('disabled');
        btn.disabled = true;
      }

      if (picks[key] === i) {
        btn.classList.add('selected');
        btn.textContent = '✓';
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

    row.append(trait, leftPole, boxes, rightPole);
    sliderGridEl.appendChild(row);
  });
}

function sanitizeInvalidPicks(goal) {
  let changed = true;
  while (changed) {
    changed = false;
    for (const [key] of SLIDERS) {
      if (picks[key] === null) continue;
      if (!isAllowedForGoal(key, picks[key], goal)) {
        picks[key] = null;
        changed = true;
      }
    }
  }
}

function isAllowedForGoal(key, value, goal) {
  if (key === 'overall') return true;

  const draft = { ...picks, [key]: value };
  for (let m = 1; m <= 8; m += 1) {
    if (draft.movement !== null && draft.movement !== m) continue;
    for (let s = 1; s <= 8; s += 1) {
      if (draft.speech !== null && draft.speech !== s) continue;
      const ms = mappedValue("movement", m) + mappedValue("speech", s);
      if (ms < goal.msBand[0] || ms > goal.msBand[1]) continue;

      for (let e = 1; e <= 8; e += 1) {
        if (draft.energy !== null && draft.energy !== e) continue;
        for (let a = 1; a <= 8; a += 1) {
          if (draft.attitude !== null && draft.attitude !== a) continue;
          const ea = mappedValue("energy", e) + mappedValue("attitude", a);
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

  const movementMapped = hasMs ? mappedValue("movement", picks.movement) : null;
  const speechMapped = hasMs ? mappedValue("speech", picks.speech) : null;
  const energyMapped = hasEa ? mappedValue("energy", picks.energy) : null;
  const attitudeMapped = hasEa ? mappedValue("attitude", picks.attitude) : null;

  msSumEl.textContent = hasMs ? `${movementMapped + speechMapped}` : '—';
  eaSumEl.textContent = hasEa ? `${energyMapped + attitudeMapped}` : '—';

  if (!hasMs || !hasEa) {
    currentResultEl.textContent = 'Not enough values selected yet.';
    currentResultEl.className = '';
    return;
  }

  const msBand = findBandIndex(movementMapped + speechMapped);
  const eaBand = findBandIndex(energyMapped + attitudeMapped);
  const resultName = PERSONALITY_GRID[eaBand][msBand];
  const resultGroup = getGroupName(eaBand, msBand);
  const matchesGoal = resultName === goal.name;

  currentResultEl.textContent = `${resultName} — ${resultGroup}${matchesGoal ? ' (matches target)' : ''}`;
  currentResultEl.className = matchesGoal ? 'ok' : 'warn';
}

function findBandIndex(sum) {
  for (let i = 0; i < BANDS.length; i += 1) {
    if (sum >= BANDS[i][0] && sum <= BANDS[i][1]) return i;
  }
  return 0;
}

function mappedValue(key, visibleValue) {
  const mapped = SLIDER_MAPPED_VALUES[key];
  if (!mapped || visibleValue < 1 || visibleValue > 8) return 0;
  return mapped[visibleValue - 1];
}

function buildMappedPairs(firstKey, secondKey, minSum, maxSum) {
  const pairs = [];
  for (let a = 1; a <= 8; a += 1) {
    for (let b = 1; b <= 8; b += 1) {
      const sum = mappedValue(firstKey, a) + mappedValue(secondKey, b);
      if (sum >= minSum && sum <= maxSum) pairs.push([a, b]);
    }
  }
  return pairs;
}

function pairLines(title, pairs) {
  return `${title} valid pairs (${pairs.length}):\n${pairs.map(([a, b]) => `(${a}, ${b})`).join(', ')}`;
}
