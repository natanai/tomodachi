const LEGACY_BANDS = [
  [0, 3],
  [4, 7],
  [8, 11],
  [12, 15]
];

const LEGACY_BAND_LABELS = ['0–3', '4–7', '8–11', '12–15'];

// Legacy inferred 4x4 cell layout from older-series reverse engineering.
// This is useful for narrowing builds, but is not yet validated as exact for the current game.
const LEGACY_MODEL_GRID = [
  ['observer', 'thinker', 'rogue', 'maverick'],
  ['strategist', 'perfectionist', 'achiever', 'visionary'],
  ['buddy', 'daydreamer', 'charmer', 'goGetter'],
  ['sweetie', 'cheerleader', 'merrymaker', 'dynamo']
];

// Visible 1-8 slider positions mapped onto inferred hidden legacy-model values.
const LEGACY_SLIDER_MAPPED_VALUES = {
  movement: [0, 1, 2, 3, 4, 5, 6, 7],
  speech: [0, 1, 2, 3, 5, 6, 7, 8],
  expressiveness: [0, 1, 2, 3, 4, 5, 6, 7],
  attitude: [0, 1, 2, 3, 5, 6, 7, 8],
  overall: [0, 1, 2, 3, 4, 5, 6, 7]
};

const PERSONALITY_AXIS_KEYS = ['movement', 'speech', 'expressiveness', 'attitude'];
const ALL_SLIDER_KEYS = [...PERSONALITY_AXIS_KEYS, 'overall'];

const MODEL_MODES = {
  legacyInferred: {
    key: 'legacyInferred',
    label: 'Legacy inferred model',
    validationStatus: 'notValidatedCurrentGame'
  }
};

const ACTIVE_MODEL_MODE = MODEL_MODES.legacyInferred;

// Confirmed examples include overall for complete example reconstruction in the UI.
// Personality matching intentionally uses PERSONALITY_AXIS_KEYS only.
const CONFIRMED_EXAMPLES = {
  northAmerica: {
    sweetie: [{ personalitySliders: { movement: 1, speech: 1, expressiveness: 8, attitude: 8 }, exampleOverall: 8, evidenceStatus: 'confirmedExample', source: 'community chart' }],
    charmer: [{ personalitySliders: { movement: 5, speech: 5, expressiveness: 6, attitude: 7 }, exampleOverall: 8, evidenceStatus: 'confirmedExample', source: 'community chart' }],
    strategist: [{ personalitySliders: { movement: 2, speech: 2, expressiveness: 2, attitude: 3 }, exampleOverall: 4, evidenceStatus: 'confirmedExample', source: 'community chart' }],
    achiever: [{ personalitySliders: { movement: 6, speech: 5, expressiveness: 4, attitude: 3 }, exampleOverall: 2, evidenceStatus: 'confirmedExample', source: 'community chart' }],
    buddy: [{ personalitySliders: { movement: 2, speech: 3, expressiveness: 4, attitude: 5 }, exampleOverall: 6, evidenceStatus: 'confirmedExample', source: 'community chart' }],
    goGetter: [{ personalitySliders: { movement: 8, speech: 8, expressiveness: 8, attitude: 8 }, exampleOverall: 8, evidenceStatus: 'confirmedExample', source: 'community chart' }],
    perfectionist: [{ personalitySliders: { movement: 2, speech: 2, expressiveness: 2, attitude: 2 }, exampleOverall: 2, evidenceStatus: 'confirmedExample', source: 'community chart' }],
    visionary: [{ personalitySliders: { movement: 7, speech: 6, expressiveness: 5, attitude: 4 }, exampleOverall: 3, evidenceStatus: 'confirmedExample', source: 'community chart' }],
    cheerleader: [{ personalitySliders: { movement: 3, speech: 4, expressiveness: 7, attitude: 6 }, exampleOverall: 6, evidenceStatus: 'confirmedExample', source: 'community chart' }],
    merrymaker: [{ personalitySliders: { movement: 6, speech: 6, expressiveness: 6, attitude: 6 }, exampleOverall: 6, evidenceStatus: 'confirmedExample', source: 'community chart' }],
    observer: [{ personalitySliders: { movement: 1, speech: 1, expressiveness: 1, attitude: 1 }, exampleOverall: 1, evidenceStatus: 'confirmedExample', source: 'community chart' }],
    rogue: [{ personalitySliders: { movement: 7, speech: 6, expressiveness: 3, attitude: 4 }, exampleOverall: 3, evidenceStatus: 'confirmedExample', source: 'community chart' }],
    daydreamer: [{ personalitySliders: { movement: 3, speech: 4, expressiveness: 5, attitude: 6 }, exampleOverall: 7, evidenceStatus: 'confirmedExample', source: 'community chart' }],
    dynamo: [{ personalitySliders: { movement: 8, speech: 7, expressiveness: 6, attitude: 5 }, exampleOverall: 4, evidenceStatus: 'confirmedExample', source: 'community chart' }],
    thinker: [{ personalitySliders: { movement: 4, speech: 3, expressiveness: 2, attitude: 1 }, exampleOverall: 1, evidenceStatus: 'confirmedExample', source: 'community chart' }],
    maverick: [{ personalitySliders: { movement: 6, speech: 5, expressiveness: 1, attitude: 1 }, exampleOverall: 1, evidenceStatus: 'confirmedExample', source: 'community chart' }]
  }
};


const BASE_EN_UI = {
  pageTitle: 'Tomodachi Life Mii Personality Planner',
  pageSubtitle: 'Pick an inferred personality cell, then explore slider builds that fit the legacy model.',
  regionLabel: 'Region',
  personalityLabel: 'Target inferred personality cell',
  hintText: 'Click a number to select it. Grayed-out options are impossible under the legacy inferred model.',
  slidersHeading: 'Set your sliders',
  resultHeading: 'Inferred result',
  currentResultLabel: 'Legacy-model cell:',
  currentResultEmpty: 'Select Movement, Speech, Expressiveness, and Attitude to infer a legacy-model cell.',
  resultStatusLabel: 'Status:',
  resultStatusText: 'Not yet validated against current Tomodachi Life internals.',
  honestyNote: 'This planner uses an older inferred band model from previous games. Current-game wording may differ, multiple slider builds can land in the same hidden cell, and cell-to-name mapping is still being validated.',
  msSumLabel: 'Movement + Speech sum:',
  eaSumLabel: 'Expressiveness + Attitude sum:',
  msRangeLabel: 'Target Movement + Speech range:',
  eaRangeLabel: 'Target Expressiveness + Attitude range:',
  totalBuildsLabel: 'Total valid builds (including Overall):',
  msPairsSummary: 'Show valid Movement/Speech pairs',
  eaPairsSummary: 'Show valid Expressiveness/Attitude pairs',
  rangeText: 'Legacy-model target bands: Movement + Speech {ms}, Expressiveness + Attitude {ea}.',
  combinationsText: '{count} combinations',
  pairTitleMs: 'Movement + Speech',
  pairTitleEa: 'Expressiveness + Attitude',
  pairText: '{title} pairs ({count}):',
  resultText: '{legacyGroup} / {cellLabel}',
  inferredNameText: 'Inferred legacy-model label: {name}{matchSuffix}',
  confirmedResultText: 'Confirmed current-game example: {name}{matchSuffix}',
  confirmedStatusText: 'Status: confirmed example available.',
  inferredOnlyStatusText: 'Status: inferred only (no exact confirmed example match).',
  confirmedDisagreementText: 'Legacy model disagrees for this exact build.',
  legacyComparisonText: 'Legacy-model comparison: {legacyGroup} / {cellLabel} ({name}).',
  resultMatchSuffix: ' (matches selected target cell)',
  loadExampleLabel: 'Load confirmed example',
  loadExampleUnavailable: 'No confirmed example for this target in this region.'
};

const BASE_EN_GROUPS = {
  easygoing: 'Easy-going',
  energetic: 'Energetic',
  reserved: 'Reserved',
  confident: 'Confident'
};

const BASE_EN_SLIDERS = {
  movement: ['Movement', 'Slow', 'Quick'],
  speech: ['Speech', 'Polite', 'Direct'],
  expressiveness: ['Expressiveness (legacy-model axis)', 'Flat', 'Intense'],
  attitude: ['Attitude', 'Serious', 'Relaxed'],
  overall: ['Overall', 'Quirky', 'Normal']
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

const REGIONS = {
  northAmerica: createEnglishRegion('northAmerica', 'North America', {
    sliderLabels: {
      movement: ['Movement', 'Slow', 'Quick'],
      speech: ['Speech', 'Polite', 'Honest'],
      expressiveness: ['Energy', 'Flat', 'Varied'],
      attitude: ['Thinking', 'Serious', 'Chill'],
      overall: ['Overall', 'Normal', 'Quirky']
    }
  }),
  europeEnglish: createEnglishRegion('europeEnglish', 'Europe (English)', {
    personalities: {
      sweetie: { name: 'Softie', inGameName: 'Softie' },
      strategist: { name: 'Free Spirit', inGameName: 'Free Spirit' },
      achiever: { name: 'Busy Bee', inGameName: 'Busy Bee' },
      buddy: { name: 'Carer', inGameName: 'Carer' },
      goGetter: { name: 'Adventurer', inGameName: 'Adventurer' },
      cheerleader: { name: 'Optimist', inGameName: 'Optimist' },
      merrymaker: { name: 'Bubbly', inGameName: 'Bubbly' },
      daydreamer: { name: 'Dreamer', inGameName: 'Dreamer' },
      dynamo: { name: 'Hot-Blooded', inGameName: 'Hot-Blooded' },
      visionary: { name: 'Leader', inGameName: 'Leader' },
      observer: { name: 'Introvert', inGameName: 'Introvert' },
      rogue: { name: 'Individualist', inGameName: 'Individualist' },
      maverick: { name: 'Headstrong', inGameName: 'Headstrong' }
    }
  }),
  europeFrench: createEnglishRegion('europeFrench', 'Europe (Français)', {
    lang: 'fr',
    ui: {
      pageSubtitle: 'Choisis une personnalité, puis ajuste les curseurs correspondants.',
      regionLabel: 'Région',
      personalityLabel: 'Personnalité cible',
      slidersHeading: 'Réglez vos curseurs',
      resultHeading: 'Résultat',
      currentResultLabel: 'Cellule du modèle hérité :',
      currentResultEmpty: 'Choisissez Mouvement, Parole, Expressivité et Attitude pour déduire une cellule.',
      combinationsText: '{count} combinaisons',
      pairText: 'Paires {title} ({count}) :',
      resultMatchSuffix: ' (correspond à la cible)'
    },
    personalities: {
      sweetie: { name: 'Doux', inGameName: 'Doux' },
      charmer: { name: 'Charmeur', inGameName: 'Charmeur' },
      strategist: { name: 'Stratège', inGameName: 'Stratège' },
      achiever: { name: 'Bosseur', inGameName: 'Bosseur' },
      daydreamer: { name: 'Rêveur', inGameName: 'Rêveur' },
      visionary: { name: 'Leader', inGameName: 'Leader' }
    }
  }),
  europeGerman: createEnglishRegion('europeGerman', 'Europe (Deutsch)', {
    lang: 'de',
    ui: {
      pageSubtitle: 'Wähle eine Persönlichkeit und stelle passende Regler ein.',
      regionLabel: 'Region',
      personalityLabel: 'Ziel-Persönlichkeit',
      slidersHeading: 'Regler einstellen',
      resultHeading: 'Ergebnis',
      currentResultLabel: 'Legacy-Modell-Zelle:',
      currentResultEmpty: 'Wähle Bewegung, Sprechweise, Ausdruck und Haltung, um eine Modell-Zelle abzuleiten.',
      combinationsText: '{count} Kombinationen',
      pairText: '{title}-Paare ({count}):',
      resultMatchSuffix: ' (passt zum Ziel)'
    },
    personalities: {
      sweetie: { name: 'Sanft', inGameName: 'Sanft' },
      observer: { name: 'Beobachter', inGameName: 'Beobachter' },
      thinker: { name: 'Denker', inGameName: 'Denker' },
      achiever: { name: 'Macher', inGameName: 'Macher' },
      dynamo: { name: 'Energiebündel', inGameName: 'Energiebündel' }
    }
  }),
  australia: createEnglishRegion('australia', 'Australia / New Zealand', {
    personalities: {
      goGetter: { name: 'Trailblazer', inGameName: 'Adventurer (Trailblazer)' },
      maverick: { name: 'Firebrand', inGameName: 'Headstrong (Firebrand)' },
      cheerleader: { name: 'Upbeat', inGameName: 'Optimist (Upbeat)' }
    }
  }),
  japan: {
    code: 'japan',
    lang: 'ja',
    regionLabel: '日本',
    ui: {
      pageTitle: 'トモダチコレクション 新生活 性格プランナー',
      pageSubtitle: '推定セルを選び、旧モデルに合うスライダー構成を探しましょう。',
      regionLabel: '地域',
      personalityLabel: '目標（推定セル）',
      hintText: '数字を押して選択します。グレーは旧推定モデル上で不可能な値です。',
      slidersHeading: 'スライダー設定',
      resultHeading: '推定結果',
      currentResultLabel: '旧モデルのセル：',
      currentResultEmpty: '動き・話し方・表現・考え方を選ぶと旧モデルの推定セルが表示されます。',
      resultStatusLabel: 'ステータス：',
      resultStatusText: '現行ゲーム内部との対応は未検証です。',
      honestyNote: 'このツールは過去作由来の推定バンドモデルを使用しています。現行作の文言は異なる可能性があり、同じ隠しセルに複数の組み合わせが入ることがあります。セルと名称の対応は検証中です。',
      msSumLabel: '動き + 話し方 の合計：',
      eaSumLabel: '表現 + 考え方 の合計：',
      msRangeLabel: '目標の 動き + 話し方 範囲：',
      eaRangeLabel: '目標の 表現 + 考え方 範囲：',
      totalBuildsLabel: '有効な組み合わせ数（全体含む）：',
      msPairsSummary: '有効な動き/話し方の組を表示',
      eaPairsSummary: '有効な表現/考え方の組を表示',
      rangeText: '旧モデル目標帯：動き + 話し方 {ms}、表現 + 考え方 {ea}。',
      combinationsText: '{count} 通り',
      pairTitleMs: '動き + 話し方',
      pairTitleEa: '表現 + 考え方',
      pairText: '{title}の組み合わせ（{count}）:',
      resultText: '{legacyGroup} / {cellLabel}',
      inferredNameText: '旧モデル推定ラベル：{name}{matchSuffix}',
      resultMatchSuffix: '（選択セルと一致）'
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
      expressiveness: ['表現（旧モデル軸）', 'おだやか', 'はげしい'],
      attitude: ['考え方', 'まじめ', 'のびのび'],
      overall: ['全体', '個性的', 'ふつう']
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
  },
  southKorea: {
    code: 'southKorea',
    lang: 'ko',
    regionLabel: '대한민국',
    ui: {
      ...BASE_EN_UI,
      pageTitle: '미 톰오다치 라이프 성격 플래너',
      pageSubtitle: '추정 성격 셀을 고른 뒤 레거시 모델 기준으로 슬라이더를 맞춰 보세요.',
      regionLabel: '지역',
      personalityLabel: '목표(추정 셀)',
      slidersHeading: '슬라이더 설정',
      resultHeading: '추정 결과',
      currentResultLabel: '레거시 모델 셀:',
      resultStatusLabel: '상태:',
      resultStatusText: '레거시 모델 기반 추정치이며 현재 게임 내부 로직으로 검증되지 않았습니다.',
      honestyNote: '이 플래너는 과거 작품에서 추론된 밴드 모델을 사용합니다. 현재 게임의 표기와 다를 수 있고, 여러 슬라이더 조합이 같은 숨은 셀에 매핑될 수 있으며, 셀-이름 대응은 검증 중입니다.',
      combinationsText: '{count}개 조합',
      pairText: '{title} 조합 ({count}):',
      resultMatchSuffix: ' (목표와 일치)'
    },
    groups: {
      easygoing: '느긋함',
      energetic: '활발함',
      reserved: '신중함',
      confident: '자신감'
    },
    sliderLabels: {
      movement: ['움직임', '느림', '빠름'],
      speech: ['말투', '공손', '직설'],
      expressiveness: ['표현력(레거시 축)', '차분', '강함'],
      attitude: ['태도', '진지', '느긋'],
      overall: ['전체', '개성', '보통']
    },
    personalities: deepMerge(BASE_PERSONALITIES, {
      sweetie: { name: '다정형', inGameName: '다정형' },
      observer: { name: '관찰형', inGameName: '관찰형' },
      achiever: { name: '성취형', inGameName: '성취형' },
      visionary: { name: '리더형', inGameName: '리더형' }
    })
  }
};

const picks = {
  movement: null,
  speech: null,
  expressiveness: null,
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
const resultStatusEl = document.getElementById('resultStatus');
const honestyNoteEl = document.getElementById('honestyNote');
const loadExampleButtonEl = document.getElementById('loadExampleButton');

function initialize() {
  renderRegionOptions();
  regionSelectEl.value = 'northAmerica';
  regionSelectEl.addEventListener('change', () => {
    currentRegion = REGIONS[regionSelectEl.value] || REGIONS.northAmerica;
    for (const key of ALL_SLIDER_KEYS) picks[key] = null;
    setupForRegion();
  });
  loadExampleButtonEl.addEventListener('click', loadConfirmedExampleForCurrentGoal);

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
  loadExampleButtonEl.textContent = ui.loadExampleLabel || BASE_EN_UI.loadExampleLabel;
  loadExampleButtonEl.title = '';
  document.getElementById('hintText').textContent = ui.hintText;
  document.getElementById('slidersHeading').textContent = ui.slidersHeading;
  document.getElementById('resultHeading').textContent = ui.resultHeading;
  document.getElementById('currentResultLabel').textContent = ui.currentResultLabel;
  document.getElementById('resultStatusLabel').textContent = ui.resultStatusLabel;
  resultStatusEl.textContent = ui.resultStatusText;
  honestyNoteEl.textContent = ui.honestyNote;
  document.getElementById('msSumLabel').textContent = ui.msSumLabel;
  document.getElementById('eaSumLabel').textContent = ui.eaSumLabel;
  document.getElementById('msRangeLabel').textContent = ui.msRangeLabel;
  document.getElementById('eaRangeLabel').textContent = ui.eaRangeLabel;
  document.getElementById('totalBuildsLabel').textContent = ui.totalBuildsLabel;
  document.getElementById('msPairsSummary').textContent = ui.msPairsSummary;
  document.getElementById('eaPairsSummary').textContent = ui.eaPairsSummary;
  currentResultEl.textContent = ui.currentResultEmpty;
  currentResultEl.className = '';
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
  for (let row = 0; row < LEGACY_MODEL_GRID.length; row += 1) {
    for (let col = 0; col < LEGACY_MODEL_GRID[row].length; col += 1) {
      const personalityKey = LEGACY_MODEL_GRID[row][col];
      const detail = region.personalities[personalityKey];
      const legacyGroupKey = getGroupKey(row, col);
      built.push({
        id: built.length,
        name: detail.name,
        groupKey: legacyGroupKey,
        msBand: LEGACY_BANDS[col],
        eaBand: LEGACY_BANDS[row],
        msBandLabel: LEGACY_BAND_LABELS[col],
        eaBandLabel: LEGACY_BAND_LABELS[row],
        detail,
        personalityKey,
        modelMode: ACTIVE_MODEL_MODE.key,
        legacyCellId: `r${row}c${col}`,
        legacyGroup: region.groups[legacyGroupKey],
        inferredCurrentName: detail.inGameName || detail.name,
        inGameName: detail.inGameName || '',
        confidence: detail.confidence || 'hypothesis',
        validationStatus: detail.validationStatus || ACTIVE_MODEL_MODE.validationStatus
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
  const goalExamples = getConfirmedExamplesForGoal(currentRegion.code, goal.personalityKey);
  loadExampleButtonEl.disabled = goalExamples.length === 0;
  const unavailableText = currentRegion.ui.loadExampleUnavailable || BASE_EN_UI.loadExampleUnavailable;
  loadExampleButtonEl.title = goalExamples.length === 0 ? unavailableText : '';

  const msPairs = buildMappedPairs('movement', 'speech', goal.msBand[0], goal.msBand[1]);
  const eaPairs = buildMappedPairs('expressiveness', 'attitude', goal.eaBand[0], goal.eaBand[1]);

  goalBandsEl.innerHTML = `
    <span class="personality-title" style="--personality-color: ${goal.detail.color};">${goal.name}</span>
    <span class="personality-subtitle">${format(currentRegion.ui.inferredNameText, { name: goal.inferredCurrentName, matchSuffix: '' })}</span>
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

function loadConfirmedExampleForCurrentGoal() {
  const goal = goals[parseInt(selectEl.value || '0', 10)];
  const example = getConfirmedExamplesForGoal(currentRegion.code, goal.personalityKey)[0];
  if (!example) return;
  for (const key of PERSONALITY_AXIS_KEYS) {
    picks[key] = example.personalitySliders[key];
  }
  picks.overall = example.exampleOverall ?? null;
  render();
}

function renderSliders(goal) {
  sliderGridEl.innerHTML = '';
  ALL_SLIDER_KEYS.forEach((key) => {
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
    for (const key of ALL_SLIDER_KEYS) {
      if (picks[key] === null) continue;
      if (!isAllowedForGoal(key, picks[key], goal)) {
        picks[key] = null;
        changed = true;
      }
    }
  }
}

function isCompleteBuild(build) {
  return PERSONALITY_AXIS_KEYS.every((key) => build[key] !== null);
}

function getConfirmedExamplesForGoal(regionCode, personalityKey) {
  return CONFIRMED_EXAMPLES[regionCode]?.[personalityKey] || [];
}

function findMatchingConfirmedExample(regionCode, build) {
  if (!isCompleteBuild(build)) return null;
  const regionalExamples = CONFIRMED_EXAMPLES[regionCode] || {};

  for (const [personalityKey, examples] of Object.entries(regionalExamples)) {
    for (const example of examples) {
      const matches = PERSONALITY_AXIS_KEYS.every((key) => example.personalitySliders[key] === build[key]);
      if (matches) {
        return {
          personalityKey,
          exampleOverall: example.exampleOverall ?? null,
          evidenceStatus: example.evidenceStatus || 'confirmedExample',
          sourceNote: example.source || ''
        };
      }
    }
  }

  return null;
}

function inferLegacyResultKey(build) {
  if (build.movement === null || build.speech === null || build.expressiveness === null || build.attitude === null) return null;
  const msBand = findBandIndex(mappedValue('movement', build.movement) + mappedValue('speech', build.speech));
  const eaBand = findBandIndex(mappedValue('expressiveness', build.expressiveness) + mappedValue('attitude', build.attitude));
  return LEGACY_MODEL_GRID[eaBand][msBand];
}

function isLegacyCompatible(goal, build) {
  for (let m = 1; m <= 8; m += 1) {
    if (build.movement !== null && build.movement !== m) continue;
    for (let s = 1; s <= 8; s += 1) {
      if (build.speech !== null && build.speech !== s) continue;
      const ms = mappedValue('movement', m) + mappedValue('speech', s);
      if (ms < goal.msBand[0] || ms > goal.msBand[1]) continue;

      for (let e = 1; e <= 8; e += 1) {
        if (build.expressiveness !== null && build.expressiveness !== e) continue;
        for (let a = 1; a <= 8; a += 1) {
          if (build.attitude !== null && build.attitude !== a) continue;
          const ea = mappedValue('expressiveness', e) + mappedValue('attitude', a);
          if (ea >= goal.eaBand[0] && ea <= goal.eaBand[1]) return true;
        }
      }
    }
  }
  return false;
}

function doesBuildMatchGoal(goal, build, regionCode) {
  if (!isCompleteBuild(build)) return isLegacyCompatible(goal, build);
  const confirmed = findMatchingConfirmedExample(regionCode, build);
  if (confirmed) return confirmed.personalityKey === goal.personalityKey;
  const inferredKey = inferLegacyResultKey(build);
  return inferredKey === goal.personalityKey;
}

function isAllowedForGoal(key, value, goal) {
  const draft = { ...picks, [key]: value };
  if (!isCompleteBuild(draft)) return isLegacyCompatible(goal, draft);
  return doesBuildMatchGoal(goal, draft, currentRegion.code);
}

function renderCurrentResult(goal) {
  const hasMs = picks.movement !== null && picks.speech !== null;
  const hasEa = picks.expressiveness !== null && picks.attitude !== null;
  const hasFullBuild = isCompleteBuild(picks);

  const movementMapped = hasMs ? mappedValue('movement', picks.movement) : null;
  const speechMapped = hasMs ? mappedValue('speech', picks.speech) : null;
  const expressivenessMapped = hasEa ? mappedValue('expressiveness', picks.expressiveness) : null;
  const attitudeMapped = hasEa ? mappedValue('attitude', picks.attitude) : null;

  msSumEl.textContent = hasMs ? `${movementMapped + speechMapped}` : '—';
  eaSumEl.textContent = hasEa ? `${expressivenessMapped + attitudeMapped}` : '—';

  if (!hasMs || !hasEa) {
    currentResultEl.textContent = currentRegion.ui.currentResultEmpty;
    resultStatusEl.textContent = currentRegion.ui.resultStatusText;
    currentResultEl.className = '';
    return;
  }

  const msBand = findBandIndex(movementMapped + speechMapped);
  const eaBand = findBandIndex(expressivenessMapped + attitudeMapped);
  const inferredPersonalityKey = LEGACY_MODEL_GRID[eaBand][msBand];
  const result = currentRegion.personalities[inferredPersonalityKey];
  const resultGroup = currentRegion.groups[getGroupKey(eaBand, msBand)];
  const matchesGoal = doesBuildMatchGoal(goal, picks, currentRegion.code);
  const cellLabel = `${LEGACY_BAND_LABELS[eaBand]} EA × ${LEGACY_BAND_LABELS[msBand]} MS`;
  const matchingConfirmedExample = hasFullBuild ? findMatchingConfirmedExample(currentRegion.code, picks) : null;

  if (matchingConfirmedExample) {
    const confirmedResult = currentRegion.personalities[matchingConfirmedExample.personalityKey];
    const legacyDisagrees = matchingConfirmedExample.personalityKey !== inferredPersonalityKey;

    currentResultEl.textContent = format(currentRegion.ui.confirmedResultText || 'Confirmed current-game result: {name}{matchSuffix}', {
      name: confirmedResult.inGameName || confirmedResult.name,
      matchSuffix: matchesGoal ? currentRegion.ui.resultMatchSuffix : ''
    });

    const legacyComparison = format(currentRegion.ui.legacyComparisonText || 'Legacy-model comparison: {legacyGroup} / {cellLabel} ({name}).', {
      legacyGroup: resultGroup,
      cellLabel,
      name: result.inGameName || result.name
    });
    const disagreement = legacyDisagrees ? ` ${currentRegion.ui.confirmedDisagreementText || 'Legacy model disagrees for this exact build.'}` : '';
    resultStatusEl.textContent = `${currentRegion.ui.confirmedStatusText || 'Status: confirmed example available.'} ${legacyComparison}${disagreement}`;
    currentResultEl.className = matchesGoal ? 'ok' : 'warn';
    return;
  }

  currentResultEl.textContent = format(currentRegion.ui.resultText, {
    legacyGroup: resultGroup,
    cellLabel
  });
  const inferredName = format(currentRegion.ui.inferredNameText, {
    name: result.inGameName || result.name,
    matchSuffix: matchesGoal ? currentRegion.ui.resultMatchSuffix : ''
  });
  resultStatusEl.textContent = `${currentRegion.ui.inferredOnlyStatusText || currentRegion.ui.resultStatusText} ${inferredName}`;
  currentResultEl.className = matchesGoal ? 'ok' : 'warn';
}

function findBandIndex(sum) {
  for (let i = 0; i < LEGACY_BANDS.length; i += 1) {
    if (sum >= LEGACY_BANDS[i][0] && sum <= LEGACY_BANDS[i][1]) return i;
  }
  return 0;
}

function mappedValue(key, visibleValue) {
  const mapped = LEGACY_SLIDER_MAPPED_VALUES[key];
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
  return `${format(currentRegion.ui.pairText, { title, count: pairs.length })}\n${pairs.map(([a, b]) => `(${a}, ${b})`).join(', ')}`;
}

function format(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, token) => `${values[token] ?? ''}`);
}

initialize();
