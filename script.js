const GROUPS = {
  low: [0, 7],
  high: [8, 15]
};

const PERSONALITIES = [
  ["Softie (Sweetie)", "Easy-going (Considerate)", "low", "high"],
  ["Carer (Buddy)", "Easy-going (Considerate)", "low", "midHigh"],
  ["Optimist (Cheerleader)", "Easy-going (Considerate)", "low", "midLow"],
  ["Dreamer (Daydreamer)", "Easy-going (Considerate)", "low", "low"],

  ["Charmer", "Energetic (Outgoing)", "high", "high"],
  ["Adventurer (Go-Getter)", "Energetic (Outgoing)", "high", "midHigh"],
  ["Bubbly (Merrymaker)", "Energetic (Outgoing)", "high", "midLow"],
  ["Hot-Blooded (Dynamo)", "Energetic (Outgoing)", "high", "low"],

  ["Patient (Strategist)", "Reserved", "low", "high"],
  ["Perfectionist", "Reserved", "low", "midHigh"],
  ["Introvert (Observer)", "Reserved", "low", "midLow"],
  ["Thinker", "Reserved", "low", "low"],

  ["Busy Bee (Achiever)", "Confident (Ambitious)", "high", "high"],
  ["Leader (Visionary)", "Confident (Ambitious)", "high", "midHigh"],
  ["Individualist (Rouge)", "Confident (Ambitious)", "high", "midLow"],
  ["Headstrong (Maverick)", "Confident (Ambitious)", "high", "low"]
];

const VERTICAL_BANDS = {
  high: [12, 15],
  midHigh: [8, 11],
  midLow: [4, 7],
  low: [0, 3]
};

const selectEl = document.getElementById('personalitySelect');
const descriptionEl = document.getElementById('description');
const sliderGridEl = document.getElementById('sliderGrid');
const msRangeEl = document.getElementById('msRange');
const eaRangeEl = document.getElementById('eaRange');
const totalBuildsEl = document.getElementById('totalBuilds');
const msPairsEl = document.getElementById('msPairs');
const eaPairsEl = document.getElementById('eaPairs');

PERSONALITIES.forEach(([name, group], index) => {
  const option = document.createElement('option');
  option.value = index;
  option.textContent = `${name} — ${group}`;
  selectEl.appendChild(option);
});

selectEl.addEventListener('change', () => render(parseInt(selectEl.value, 10)));
render(0);

function render(index) {
  const [name, group, msBandName, eaBandName] = PERSONALITIES[index];
  const msBand = msBandName === 'high' ? GROUPS.high : GROUPS.low;
  const eaBand = VERTICAL_BANDS[eaBandName];

  const msPairs = buildPairs(msBand[0], msBand[1]);
  const eaPairs = buildPairs(eaBand[0], eaBand[1]);

  const movementAllowed = collectValues(msPairs, 0);
  const speechAllowed = collectValues(msPairs, 1);
  const energyAllowed = collectValues(eaPairs, 0);
  const attitudeAllowed = collectValues(eaPairs, 1);
  const overallAllowed = [0, 1, 2, 3, 4, 5, 6, 7];

  descriptionEl.textContent = `Goal: ${name} (${group}). Pick any values highlighted in green. Orange is one sample value from the chart aesthetic.`;

  sliderGridEl.innerHTML = '';
  addSlider('Movement', 'Slow', 'Quick', movementAllowed);
  addSlider('Speech', 'Polite', 'Direct', speechAllowed);
  addSlider('Energy', 'Flat', 'Intense', energyAllowed);
  addSlider('Attitude', 'Serious', 'Relaxed', attitudeAllowed);
  addSlider('Overall', 'Normal', 'Quirky', overallAllowed);

  msRangeEl.textContent = `${msBand[0]} to ${msBand[1]}`;
  eaRangeEl.textContent = `${eaBand[0]} to ${eaBand[1]}`;
  totalBuildsEl.textContent = `${msPairs.length * eaPairs.length * 8} combinations`;
  msPairsEl.textContent = pairLines('Movement + Speech', msPairs);
  eaPairsEl.textContent = pairLines('Energy + Attitude', eaPairs);
}

function buildPairs(minSum, maxSum) {
  const pairs = [];
  for (let a = 0; a <= 7; a += 1) {
    for (let b = 0; b <= 7; b += 1) {
      const sum = a + b;
      if (sum >= minSum && sum <= maxSum) pairs.push([a, b]);
    }
  }
  return pairs;
}

function collectValues(pairs, index) {
  return [...new Set(pairs.map((pair) => pair[index]))].sort((a, b) => a - b);
}

function addSlider(label, left, right, allowedValues) {
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

  for (let i = 0; i < 8; i += 1) {
    const box = document.createElement('div');
    box.className = 'box';
    if (allowedValues.includes(i)) box.classList.add('allowed');
    if (i === allowedValues[0]) {
      box.classList.add('selected');
      box.textContent = '✓';
    } else {
      box.textContent = i;
    }
    boxes.appendChild(box);
  }

  const rightPole = document.createElement('div');
  rightPole.className = 'pole';
  rightPole.textContent = right;

  row.append(trait, leftPole, boxes, rightPole);
  sliderGridEl.appendChild(row);
}

function pairLines(title, pairs) {
  return `${title} valid pairs (${pairs.length}):\n${pairs.map(([a, b]) => `(${a}, ${b})`).join(', ')}`;
}
