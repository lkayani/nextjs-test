// Mock data generator for Mobile Game Ad Creative Testing Dashboard
import { subDays, format } from 'date-fns';
import type {
  Creative,
  CreativePerformance,
  ABTest,
  Platform,
  CreativeType,
  CreativeStatus,
} from './types';

// Seed for consistent random data
let seed = 12345;
function seededRandom(): number {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

function randomInt(min: number, max: number): number {
  return Math.floor(seededRandom() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return seededRandom() * (max - min) + min;
}

function randomChoice<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)];
}

// Creative element options
const hooks = [
  'Can you beat level 10?',
  'Only 1% can solve this',
  'This game is ADDICTIVE',
  'FREE rewards inside!',
  'Play now and win',
  'Impossible challenge',
  'Beat your friends',
  'Limited time offer',
  'New game alert',
  'Trending now',
];

const characters = [
  'Hero Knight',
  'Magic Wizard',
  'Space Explorer',
  'Ninja Warrior',
  'Dragon Rider',
  'Robot Commander',
  'Princess Warrior',
  'Zombie Hunter',
];

const themes = [
  'Fantasy Adventure',
  'Space Battle',
  'Medieval Quest',
  'Modern Warfare',
  'Puzzle Challenge',
  'Racing Action',
  'City Building',
  'Match-3 Fun',
];

const ctas = [
  'Play Now',
  'Download Free',
  'Start Playing',
  'Join Now',
  'Install Game',
  'Try Now',
  'Get Started',
  'Play Free',
];

const platforms: Platform[] = ['facebook', 'google', 'tiktok', 'unity', 'ironsource'];
const creativeTypes: CreativeType[] = ['video', 'static', 'playable'];

// Platform-specific performance characteristics
const platformMetrics: Record<Platform, { baseCTR: number; baseCPI: number; variance: number }> = {
  facebook: { baseCTR: 4.5, baseCPI: 1.2, variance: 0.3 },
  google: { baseCTR: 3.8, baseCPI: 1.5, variance: 0.25 },
  tiktok: { baseCTR: 6.2, baseCPI: 0.9, variance: 0.4 },
  unity: { baseCTR: 5.1, baseCPI: 1.0, variance: 0.35 },
  ironsource: { baseCTR: 4.8, baseCPI: 1.1, variance: 0.3 },
};

// Creative type multipliers
const creativeTypeMultipliers: Record<CreativeType, { ctrMultiplier: number; cpiMultiplier: number }> = {
  video: { ctrMultiplier: 1.3, cpiMultiplier: 0.9 },
  playable: { ctrMultiplier: 1.5, cpiMultiplier: 0.8 },
  static: { ctrMultiplier: 1.0, cpiMultiplier: 1.0 },
};

export function generateCreatives(count = 60): Creative[] {
  const creatives: Creative[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const platform = randomChoice(platforms);
    const type = randomChoice(creativeTypes);
    const status: CreativeStatus = i < 40 ? 'active' : randomChoice(['paused', 'testing', 'archived'] as CreativeStatus[]);

    const creative: Creative = {
      id: `creative_${i + 1}`,
      name: `${randomChoice(themes)} - ${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1}`,
      type,
      platform,
      thumbnailUrl: `/placeholder-${type}-${i % 10}.jpg`, // Placeholder
      duration: type === 'video' ? randomInt(15, 60) : undefined,
      createdDate: subDays(now, randomInt(0, 180)),
      status,
      elements: {
        hook: randomChoice(hooks),
        character: type === 'video' || type === 'playable' ? randomChoice(characters) : undefined,
        theme: randomChoice(themes),
        cta: randomChoice(ctas),
      },
    };

    creatives.push(creative);
  }

  return creatives;
}

export function generatePerformanceData(creative: Creative, days = 90): CreativePerformance[] {
  const performances: CreativePerformance[] = [];
  const now = new Date();

  const platformMetric = platformMetrics[creative.platform];
  const typeMultiplier = creativeTypeMultipliers[creative.type];

  // Base performance for this creative
  const baseCTR = platformMetric.baseCTR * typeMultiplier.ctrMultiplier * randomFloat(0.7, 1.3);
  const baseCPI = platformMetric.baseCPI * typeMultiplier.cpiMultiplier * randomFloat(0.8, 1.2);
  const baseD1Retention = randomFloat(35, 55);
  const baseD7Retention = randomFloat(15, 30);

  // Trend: gradually declining performance over time (ad fatigue)
  for (let i = 0; i < days; i++) {
    const dayAgo = subDays(now, days - i - 1);

    // Skip if creative wasn't created yet
    if (dayAgo < creative.createdDate) {
      continue;
    }

    // Performance decay over time (ad fatigue)
    const ageDays = Math.floor((now.getTime() - creative.createdDate.getTime()) / (1000 * 60 * 60 * 24));
    const decayFactor = Math.max(0.5, 1 - (ageDays * 0.003)); // 0.3% decay per day

    // Daily variance
    const dailyVariance = randomFloat(0.85, 1.15);

    const impressions = creative.status === 'active'
      ? randomInt(10000, 100000) * dailyVariance
      : randomInt(0, 20000) * dailyVariance;

    const ctr = (baseCTR * decayFactor * dailyVariance) / 100;
    const clicks = Math.floor(impressions * ctr);

    const ipm = randomFloat(2, 8) * decayFactor * dailyVariance;
    const installs = Math.floor((impressions / 1000) * ipm);

    const cpi = baseCPI * randomFloat(0.9, 1.1);
    const spend = installs * cpi;

    // Revenue: some installs generate revenue, ROAS typically 0.3 - 2.5
    const roas = randomFloat(0.3, 2.5) * dailyVariance;
    const revenue = spend * roas;

    const performance: CreativePerformance = {
      id: `perf_${creative.id}_${i}`,
      creativeId: creative.id,
      date: dayAgo,
      impressions: Math.floor(impressions),
      clicks,
      installs,
      spend: parseFloat(spend.toFixed(2)),
      revenue: parseFloat(revenue.toFixed(2)),
      d1Retention: parseFloat((baseD1Retention * dailyVariance).toFixed(2)),
      d7Retention: parseFloat((baseD7Retention * dailyVariance).toFixed(2)),
    };

    performances.push(performance);
  }

  return performances;
}

export function generateABTests(creatives: Creative[]): ABTest[] {
  const tests: ABTest[] = [];
  const now = new Date();

  // Create 10 A/B tests
  for (let i = 0; i < 10; i++) {
    const isRunning = i < 3; // 3 running tests, 7 completed
    const testCreatives = [
      creatives[randomInt(0, creatives.length - 1)],
      creatives[randomInt(0, creatives.length - 1)],
    ].filter((c, index, self) => self.findIndex(t => t.id === c.id) === index); // Ensure unique

    // If we didn't get 2 unique creatives, add another
    if (testCreatives.length < 2 && creatives.length > 1) {
      const remaining = creatives.filter(c => !testCreatives.find(tc => tc.id === c.id));
      if (remaining.length > 0) {
        testCreatives.push(remaining[0]);
      }
    }

    const startDate = subDays(now, randomInt(5, 60));

    const test: ABTest = {
      id: `test_${i + 1}`,
      name: `${testCreatives[0]?.elements.theme || 'Creative'} Test ${i + 1}`,
      status: isRunning ? 'running' : 'completed',
      startDate,
      endDate: isRunning ? undefined : subDays(now, randomInt(0, 5)),
      creativeIds: testCreatives.map(c => c.id),
      winner: isRunning ? undefined : testCreatives[randomInt(0, testCreatives.length - 1)].id,
      confidence: isRunning ? randomFloat(60, 85) : randomFloat(85, 99),
    };

    tests.push(test);
  }

  return tests;
}

// Generate all mock data
export function generateAllMockData() {
  const creatives = generateCreatives(60);
  const performances = creatives.flatMap(creative => generatePerformanceData(creative, 90));
  const tests = generateABTests(creatives);

  return {
    creatives,
    performances,
    tests,
  };
}
