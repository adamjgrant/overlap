const DATA_URL = './data/events.json';

const DATE_REGEX = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/;

function pad(value) {
  return value.toString().padStart(2, '0');
}

function expandDate(dateString, { isEnd } = {}) {
  if (!dateString) return null;
  const match = DATE_REGEX.exec(dateString);
  if (!match) {
    throw new Error(`Invalid date string: ${dateString}`);
  }

  const year = Number(match[1]);
  const month = match[2] ? Number(match[2]) : isEnd ? 12 : 1;
  const day = match[3]
    ? Number(match[3])
    : isEnd
    ? new Date(year, month, 0).getDate()
    : 1;

  return `${year}-${pad(month)}-${pad(day)}`;
}

function toTimestamp(dateString, { isEnd } = {}) {
  if (!dateString) return null;
  const fullDate = expandDate(dateString, { isEnd });
  return new Date(`${fullDate}T00:00:00Z`).valueOf();
}

function normaliseItem(raw) {
  const startTimestamp = toTimestamp(raw.start);
  const effectiveEnd = raw.end ?? raw.start;
  const endTimestamp = toTimestamp(effectiveEnd, { isEnd: true });

  return {
    ...raw,
    category: raw.category ?? 'General',
    startTimestamp,
    endTimestamp,
    duration: endTimestamp - startTimestamp,
  };
}

function rangesOverlap(a, b) {
  return a.startTimestamp <= b.endTimestamp && a.endTimestamp >= b.startTimestamp;
}

function intersectionRange(items) {
  const start = Math.max(...items.map((item) => item.startTimestamp));
  const end = Math.min(...items.map((item) => item.endTimestamp));
  return { start, end };
}

function differenceFromRange(item, range) {
  if (item.startTimestamp > range.end) {
    return item.startTimestamp - range.end;
  }
  if (item.endTimestamp < range.start) {
    return range.start - item.endTimestamp;
  }
  return 0;
}

function shuffle(items, rng = Math.random) {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

function getRandomItem(items, rng) {
  return items[Math.floor(rng() * items.length)];
}

function findOverlappingTriple(items, rng = Math.random, attempts = 400) {
  if (items.length < 3) return null;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const first = getRandomItem(items, rng);
    const overlappingWithFirst = items.filter(
      (item) => item.id !== first.id && item.category !== first.category && rangesOverlap(item, first),
    );
    if (overlappingWithFirst.length < 2) {
      continue;
    }

    const second = getRandomItem(overlappingWithFirst, rng);
    const overlappingBoth = items.filter((item) => {
      if (item.id === first.id || item.id === second.id) return false;
      if (item.category === first.category || item.category === second.category) return false;
      return rangesOverlap(item, first) && rangesOverlap(item, second);
    });

    if (overlappingBoth.length === 0) {
      continue;
    }

    const third = getRandomItem(overlappingBoth, rng);
    const triple = [first, second, third];
    const uniqueCategories = new Set(triple.map((item) => item.category));
    const range = intersectionRange(triple);

    if (uniqueCategories.size === triple.length && range.start <= range.end) {
      return { triple, range };
    }
  }

  return null;
}

function findOutlier(triple, range, items, rng = Math.random) {
  const usedIds = new Set(triple.map((item) => item.id));
  const usedCategories = new Set(triple.map((item) => item.category));
  const candidates = items
    .filter((item) => !usedIds.has(item.id) && !usedCategories.has(item.category))
    .filter((item) => {
      // Outlier must not overlap the intersection range shared by the triple
      return item.startTimestamp > range.end || item.endTimestamp < range.start;
    })
    .map((item) => ({ item, gap: differenceFromRange(item, range) }))
    .sort((a, b) => a.gap - b.gap);

  if (candidates.length > 0) {
    const tightestGap = candidates[0].gap;
    const closest = candidates.filter((candidate) => candidate.gap === tightestGap);
    return getRandomItem(closest.map((entry) => entry.item), rng);
  }

  // Fallback: relax the category constraint first
  const relaxedCandidates = items
    .filter((item) => !usedIds.has(item.id))
    .filter((item) => item.startTimestamp > range.end || item.endTimestamp < range.start)
    .map((item) => ({ item, gap: differenceFromRange(item, range) }))
    .sort((a, b) => a.gap - b.gap);

  if (relaxedCandidates.length > 0) {
    return relaxedCandidates[0].item;
  }

  // Final fallback: pick any item not already used
  const unused = items.filter((item) => !usedIds.has(item.id));
  return unused.length ? getRandomItem(unused, rng) : null;
}

function formatYearRange(item) {
  const start = new Date(item.startTimestamp);
  const end = new Date(item.endTimestamp);
  const startYear = start.getUTCFullYear();
  const endYear = end.getUTCFullYear();

  if (startYear === endYear) {
    return `${startYear}`;
  }
  return `${startYear} – ${endYear}`;
}

export async function fetchTimelineItems(url = DATA_URL) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load data: ${response.status}`);
  }
  const payload = await response.json();
  return payload.map(normaliseItem);
}

export function createRound(items, rng = Math.random) {
  if (items.length < 4) {
    throw new Error('At least four items are required to create a round.');
  }

  const overlapResult = findOverlappingTriple(items, rng);
  if (!overlapResult) {
    throw new Error('Unable to find overlapping timeline items for the round.');
  }

  const { triple, range } = overlapResult;
  const outlier = findOutlier(triple, range, items, rng);
  if (!outlier) {
    throw new Error('Unable to determine an outlier item for this round.');
  }

  const options = shuffle([...triple, outlier], rng).map((item, index) => ({
    ...item,
    label: String.fromCharCode(65 + index),
    yearRange: formatYearRange(item),
  }));

  return {
    options,
    answerId: outlier.id,
    intersection: range,
  };
}

export function describeIntersection(range) {
  const start = new Date(range.start);
  const end = new Date(range.end);
  const startYear = start.getUTCFullYear();
  const endYear = end.getUTCFullYear();
  if (startYear === endYear) {
    return `${startYear}`;
  }
  return `${startYear} – ${endYear}`;
}
