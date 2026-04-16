const BANDS = [
  [0, 3],
  [4, 7],
  [8, 11],
  [12, 15]
];

const BAND_LABELS = ["0–3", "4–7", "8–11", "12–15"];

const PERSONALITY_GRID = [
  ["observer", "thinker", "rogue", "maverick"],
  ["strategist", "perfectionist", "achiever", "visionary"],
  ["buddy", "daydreamer", "charmer", "goGetter"],
  ["sweetie", "cheerleader", "merrymaker", "dynamo"]
];

const SLIDER_MAPPED_VALUES = {
  movement: [0, 1, 2, 3, 4, 5, 6, 7],
  speech: [0, 1, 2, 3, 5, 6, 7, 8],
  energy: [0, 1, 2, 3, 4, 5, 6, 7],
  attitude: [0, 1, 2, 3, 5, 6, 7, 8],
  overall: [0, 1, 2, 3, 4, 5, 6, 7]
};

const REGIONS = {
  northAmerica: {
    code: 'northAmerica',
    lang: 'en',
    regionLabel: 'North America',
    ui: {
      pageTitle: 'Tomodachi Life Mii Personality Planner',
      pageSubtitle: 'Pick a personality, then build sliders that match it.',
      regionLabel: 'Region',
      personalityLabel: 'Target personality',
      hintText: 'Click a number to select it. Grayed-out options can’t be used for this target.',
      slidersHeading: 'Set your sliders',
      resultHeading: 'Result',
      currentResultLabel: 'Current result:',
      currentResultEmpty: 'Select Movement, Speech, Energy, and Attitude to see your result.',
      msSumLabel: 'Movement + Speech sum:',
      eaSumLabel: 'Energy + Attitude sum:',
      msRangeLabel: 'Target Movement + Speech range:',
      eaRangeLabel: 'Target Energy + Attitude range:',
      totalBuildsLabel: 'Total valid builds (including Overall):',
      msPairsSummary: 'Show valid Movement/Speech pairs',
      eaPairsSummary: 'Show valid Energy/Attitude pairs',
      rangeText: 'Target ranges: Movement + Speech {ms}, Energy + Attitude {ea}.',
      combinationsText: '{count} combinations',
      pairTitleMs: 'Movement + Speech',
      pairTitleEa: 'Energy + Attitude',
      resultText: '{name} — {group}{matchSuffix}',
      resultMatchSuffix: ' (matches target)'
    },
    groups: {
      easygoing: 'Easy-going',
      energetic: 'Energetic',
      reserved: 'Reserved',
      confident: 'Confident'
    },
    sliderLabels: {
      movement: ['Movement', 'Slow', 'Quick'],
      speech: ['Speech', 'Polite', 'Direct'],
      energy: ['Energy', 'Flat', 'Intense'],
      attitude: ['Attitude', 'Serious', 'Relaxed'],
      overall: ['Overall', 'Normal', 'Quirky']
    },
    personalities: {
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
    }
  },
  japan: {
    code: 'japan',
    lang: 'ja',
    regionLabel: '日本',
    ui: {
      pageTitle: 'トモダチコレクション 新生活 性格プランナー',
      pageSubtitle: '性格を選んで、条件に合うスライダーを作成しましょう。',
      regionLabel: '地域',
      personalityLabel: '目標の性格',
      hintText: '数字を押して選択します。グレーの数字はこの目標では使えません。',
      slidersHeading: 'スライダー設定',
      resultHeading: '結果',
      currentResultLabel: '現在の結果：',
      currentResultEmpty: '動き・話し方・感情・考え方を選ぶと結果が表示されます。',
      msSumLabel: '動き + 話し方 の合計：',
      eaSumLabel: '感情 + 考え方 の合計：',
      msRangeLabel: '目標の 動き + 話し方 範囲：',
      eaRangeLabel: '目標の 感情 + 考え方 範囲：',
      totalBuildsLabel: '有効な組み合わせ数（全体含む）：',
      msPairsSummary: '有効な動き/話し方の組を表示',
      eaPairsSummary: '有効な感情/考え方の組を表示',
      rangeText: '目標範囲：動き + 話し方 {ms}、感情 + 考え方 {ea}。',
      combinationsText: '{count} 通り',
      pairTitleMs: '動き + 話し方',
      pairTitleEa: '感情 + 考え方',
      resultText: '{name} — {group}{matchSuffix}',
      resultMatchSuffix: '（目標と一致）'
    },
    groups: {
      easygoing: 'のんびり',
      energetic: 'アクティブ',
      reserved: 'おちつき',
      confident: 'じしん家'
    },
    sliderLabels: {
      movement: ['動き', 'ゆっくり', 'すばやい'],
      speech: ['話し方', 'ていねい', 'はっきり'],
      energy: ['感情', 'おだやか', 'はげしい'],
      attitude: ['考え方', 'まじめ', 'のびのび'],
      overall: ['全体', 'ふつう', '個性的']
    },
    personalities: {
      sweetie: { name: 'やさしい', inGameName: 'やさしい', description: '感受性が高く、まわりの気持ちに寄りそうタイプ。', color: '#f2cf62' },
      charmer: { name: 'みりょくてき', inGameName: 'みりょくてき', description: '華やかで空気を読むのが得意。新しい環境にもすぐなじめます。', color: '#e68bb3' },
      strategist: { name: 'しんちょう', inGameName: 'しんちょう', description: 'マイペースで発想豊か。人の目を気にせず自分らしく行動します。', color: '#95c95e' },
      achiever: { name: 'しっかり者', inGameName: 'しっかり者', description: '計画性があり、やると決めたことを着実に進めるタイプ。', color: '#2f93de' },
      buddy: { name: 'きづかい上手', inGameName: 'きづかい上手', description: '思いやりがあり、周りを大切にしながら関係をまとめます。', color: '#d7c25e' },
      goGetter: { name: 'チャレンジャー', inGameName: 'チャレンジャー', description: '大胆で行動力があり、場を明るくする存在です。', color: '#ec709c' },
      cheerleader: { name: 'ポジティブ', inGameName: 'ポジティブ', description: '前向きで元気。周りまで笑顔にする力があります。', color: '#efc457' },
      merrymaker: { name: 'にぎやか', inGameName: 'にぎやか', description: '人付き合いが得意で、どんな場面でも明るさを見つけます。', color: '#cd586f' },
      daydreamer: { name: 'ロマンチスト', inGameName: 'ロマンチスト', description: '理想を大切にし、想像の中からアイデアを見つけるタイプ。', color: '#f0b669' },
      dynamo: { name: 'ねっけつ', inGameName: 'ねっけつ', description: '意志が強く、自分の直感でぐいぐい進みます。', color: '#ef873b' },
      perfectionist: { name: 'こだわり派', inGameName: 'こだわり派', description: '細部まで大切にし、ものづくりや工夫に喜びを感じます。', color: '#39c4af' },
      visionary: { name: 'リーダー', inGameName: 'リーダー', description: '挑戦を恐れず、勢いよく前へ進む力強いタイプ。', color: '#2e7fd8' },
      observer: { name: 'クール', inGameName: 'クール', description: '感情を表に出しにくいけれど、内面はとても豊かです。', color: '#56c6ca' },
      thinker: { name: 'じっくり', inGameName: 'じっくり', description: '落ち着いて考えるのが得意で、物事を多角的に見られます。', color: '#37b5ae' },
      rogue: { name: 'マイペース', inGameName: 'マイペース', description: '知識が豊富で自分の考えをはっきり伝えられます。', color: '#5d78d7' },
      maverick: { name: 'どんどん', inGameName: 'どんどん', description: '決断が早く、迷わず自分の道を切り開くタイプ。', color: '#8e77d6' }
    }
  }
};

const SLIDER_KEYS = ['movement', 'speech', 'energy', 'attitude', 'overall'];

const picks = {
  movement: null,
  speech: null,
  energy: null,
  attitude: null,
  overall: null
};

let currentRegion = REGIONS.northAmerica;
let goals = [];

const regionSelectEl = document.getElementById('regionSelect');
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

function initialize() {
  renderRegionOptions();
  regionSelectEl.value = 'northAmerica';
  regionSelectEl.addEventListener('change', () => {
    currentRegion = REGIONS[regionSelectEl.value] || REGIONS.northAmerica;
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
  document.getElementById('msSumLabel').textContent = ui.msSumLabel;
  document.getElementById('eaSumLabel').textContent = ui.eaSumLabel;
  document.getElementById('msRangeLabel').textContent = ui.msRangeLabel;
  document.getElementById('eaRangeLabel').textContent = ui.eaRangeLabel;
  document.getElementById('totalBuildsLabel').textContent = ui.totalBuildsLabel;
  document.getElementById('msPairsSummary').textContent = ui.msPairsSummary;
  document.getElementById('eaPairsSummary').textContent = ui.eaPairsSummary;
  currentResultEl.textContent = ui.currentResultEmpty;
}

function populatePersonalityOptions() {
  selectEl.innerHTML = '';
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

  selectEl.value = '0';
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
  const goal = goals[parseInt(selectEl.value || '0', 10)];
  sanitizeInvalidPicks(goal);

  const msPairs = buildMappedPairs('movement', 'speech', goal.msBand[0], goal.msBand[1]);
  const eaPairs = buildMappedPairs('energy', 'attitude', goal.eaBand[0], goal.eaBand[1]);

  goalBandsEl.innerHTML = `
    <span class="personality-title" style="--personality-color: ${goal.detail.color};">${goal.name}</span>
    <span class="personality-subtitle">${goal.detail.inGameName}</span>
    <span>${goal.detail.description}</span>
    <span class="personality-range">${format(currentRegion.ui.rangeText, { ms: goal.msBandLabel, ea: goal.eaBandLabel })}</span>
  `;

  msRangeEl.textContent = `${goal.msBand[0]} to ${goal.msBand[1]}`;
  eaRangeEl.textContent = `${goal.eaBand[0]} to ${goal.eaBand[1]}`;
  totalBuildsEl.textContent = format(currentRegion.ui.combinationsText, { count: msPairs.length * eaPairs.length * 8 });
  msPairsEl.textContent = pairLines(currentRegion.ui.pairTitleMs, msPairs);
  eaPairsEl.textContent = pairLines(currentRegion.ui.pairTitleEa, eaPairs);

  renderSliders(goal);
  renderCurrentResult(goal);
}

function renderSliders(goal) {
  sliderGridEl.innerHTML = '';
  SLIDER_KEYS.forEach((key) => {
    const [label, left, right] = currentRegion.sliderLabels[key];

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

    const scale = document.createElement('div');
    scale.className = 'slider-scale';
    scale.append(leftPole, boxes, rightPole);

    row.append(trait, scale);
    sliderGridEl.appendChild(row);
  });
}

function sanitizeInvalidPicks(goal) {
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

  msSumEl.textContent = hasMs ? `${movementMapped + speechMapped}` : '—';
  eaSumEl.textContent = hasEa ? `${energyMapped + attitudeMapped}` : '—';

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
  const matchesGoal = personalityKey === goal.personalityKey;

  currentResultEl.textContent = format(currentRegion.ui.resultText, {
    name: result.name,
    group: resultGroup,
    matchSuffix: matchesGoal ? currentRegion.ui.resultMatchSuffix : ''
  });
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
  return `${title} pairs (${pairs.length}):\n${pairs.map(([a, b]) => `(${a}, ${b})`).join(', ')}`;
}

function format(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, token) => `${values[token] ?? ''}`);
}

initialize();
