(function initPersonalityLocalization(globalScope) {
  const SLOT_GRID = [
    ['green.3', 'green.4', 'blue.3', 'blue.4'],
    ['green.1', 'green.2', 'blue.1', 'blue.2'],
    ['yellow.3', 'yellow.4', 'red.3', 'red.4'],
    ['yellow.1', 'yellow.2', 'red.1', 'red.2']
  ];

  const SLOT_ID_TO_PERSONALITY_KEY = {
    'yellow.1': 'sweetie',
    'yellow.2': 'cheerleader',
    'yellow.3': 'buddy',
    'yellow.4': 'daydreamer',
    'green.1': 'strategist',
    'green.2': 'perfectionist',
    'green.3': 'observer',
    'green.4': 'thinker',
    'red.1': 'charmer',
    'red.2': 'goGetter',
    'red.3': 'merrymaker',
    'red.4': 'dynamo',
    'blue.1': 'achiever',
    'blue.2': 'visionary',
    'blue.3': 'rogue',
    'blue.4': 'maverick'
  };

  function normalizeRegionKey(regionKey) {
    return String(regionKey || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  function resolvePersonalityDataset(regionKey, aliasMap) {
    if (!aliasMap || typeof aliasMap !== 'object') {
      throw new Error('resolvePersonalityDataset requires a routing alias map.');
    }
    const normalized = normalizeRegionKey(regionKey);
    return aliasMap[normalized] || 'en_us';
  }

  function getPersonalityKeyForSlot(slotId) {
    return SLOT_ID_TO_PERSONALITY_KEY[slotId];
  }

  function deepMerge(base, override) {
    const output = Array.isArray(base) ? [...base] : { ...(base || {}) };
    for (const [key, value] of Object.entries(override || {})) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        output[key] = deepMerge(base?.[key] || {}, value);
      } else {
        output[key] = value;
      }
    }
    return output;
  }

  function parseCsvRow(line) {
    const out = [];
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
        out.push(current.trim());
        current = '';
        continue;
      }

      current += char;
    }

    out.push(current.trim());
    return out;
  }

  function buildRegionsFromSheet(csvText) {
    const lines = csvText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length < 2) {
      throw new Error('Localization sheet is empty.');
    }

    const byRegion = {};
    for (let i = 1; i < lines.length; i += 1) {
      const parsedRow = parseCsvRow(lines[i]);
      const [region, category, key, subkey = ''] = parsedRow;
      const value = parsedRow.slice(4).join(', ').trim();
      if (!region || !category || !key) continue;

      if (!byRegion[region]) {
        byRegion[region] = {
          code: region,
          lang: 'en',
          regionLabel: region,
          datasetKey: '',
          sourceRegion: '',
          aliases: [],
          selectable: false,
          ui: {},
          groups: {},
          sliderLabels: {},
          personalities: {}
        };
      }

      const record = byRegion[region];
      if (category === 'meta') {
        if (key === 'lang') record.lang = value || 'en';
        if (key === 'regionLabel') record.regionLabel = value || region;
        if (key === 'datasetKey') record.datasetKey = value;
        if (key === 'sourceRegion') record.sourceRegion = value;
        if (key === 'aliases') {
          record.aliases = value
            .split('|')
            .map((item) => item.trim())
            .filter(Boolean);
        }
        if (key === 'selectable') record.selectable = value.toLowerCase() === 'true';
        continue;
      }

      if (category === 'ui') {
        record.ui[key] = value;
        continue;
      }

      if (category === 'groups') {
        record.groups[key] = value;
        continue;
      }

      if (category === 'sliderLabels') {
        if (!record.sliderLabels[key]) {
          record.sliderLabels[key] = ['', '', ''];
        }
        if (subkey === 'label') record.sliderLabels[key][0] = value;
        if (subkey === 'left') record.sliderLabels[key][1] = value;
        if (subkey === 'right') record.sliderLabels[key][2] = value;
        continue;
      }

      if (category === 'personalities') {
        if (!record.personalities[key]) record.personalities[key] = {};
        if (subkey) record.personalities[key][subkey] = value;
      }
    }

    const northAmerica = byRegion.northAmerica;
    if (!northAmerica) {
      throw new Error('The sheet must include northAmerica base rows.');
    }

    const finalRegions = {};
    for (const regionCode of Object.keys(byRegion)) {
      const region = byRegion[regionCode];
      finalRegions[regionCode] = {
        code: region.code,
        lang: region.lang || 'en',
        regionLabel: region.regionLabel,
        datasetKey: region.datasetKey,
        sourceRegion: region.sourceRegion,
        aliases: region.aliases,
        selectable: region.selectable,
        ui: deepMerge(northAmerica.ui, region.ui),
        groups: deepMerge(northAmerica.groups, region.groups),
        sliderLabels: deepMerge(northAmerica.sliderLabels, region.sliderLabels),
        personalities: deepMerge(northAmerica.personalities, region.personalities)
      };
    }

    return finalRegions;
  }

  function buildRegionRouting(regions, basePersonalities) {
    const fallbackRegion = regions.northAmerica;
    const options = [];
    const aliasMap = {};
    const datasets = {};

    Object.values(regions).forEach((region) => {
      const datasetKey = region.datasetKey || normalizeRegionKey(region.code);
      const sourceRegionCode = region.sourceRegion || region.code;
      const sourceRegion = regions[sourceRegionCode] || fallbackRegion;
      if (!sourceRegion) {
        throw new Error(`Unknown sourceRegion '${sourceRegionCode}' configured for '${region.code}'.`);
      }

      if (region.selectable) {
        options.push({ key: region.code, label: region.regionLabel });
      }

      const aliases = [region.code, ...(region.aliases || [])];
      aliases.forEach((alias) => {
        aliasMap[normalizeRegionKey(alias)] = datasetKey;
      });

      if (!datasets[datasetKey]) {
        datasets[datasetKey] = {
          datasetKey,
          ...sourceRegion,
          personalities: deepMerge(sourceRegion.personalities, basePersonalities)
        };
      }
    });

    return { options, aliasMap, datasets };
  }

  const api = {
    SLOT_GRID,
    SLOT_ID_TO_PERSONALITY_KEY,
    resolvePersonalityDataset,
    normalizeRegionKey,
    getPersonalityKeyForSlot,
    deepMerge,
    parseCsvRow,
    buildRegionsFromSheet,
    buildRegionRouting
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  globalScope.PersonalityLocalization = api;
})(typeof window !== 'undefined' ? window : globalThis);
