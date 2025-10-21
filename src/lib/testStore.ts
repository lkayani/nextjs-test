// Test Store - manages A/B tests
import type { ABTest, TestStatus } from './types';
import { generateABTests } from './mockData';
import { creativeStore } from './creativeStore';

class TestStore {
  private tests: Map<string, ABTest> = new Map();

  constructor() {
    // Initialize with mock data
    const mockTests = generateABTests(creativeStore.getAll());
    mockTests.forEach(test => {
      this.tests.set(test.id, test);
    });
  }

  getAll(): ABTest[] {
    return Array.from(this.tests.values());
  }

  getById(id: string): ABTest | undefined {
    return this.tests.get(id);
  }

  getByStatus(status: TestStatus): ABTest[] {
    return this.getAll().filter(test => test.status === status);
  }

  getByCreativeId(creativeId: string): ABTest[] {
    return this.getAll().filter(test => test.creativeIds.includes(creativeId));
  }

  create(test: ABTest): ABTest {
    this.tests.set(test.id, test);
    return test;
  }

  update(id: string, updates: Partial<ABTest>): ABTest | undefined {
    const test = this.tests.get(id);
    if (!test) return undefined;

    const updated = { ...test, ...updates };
    this.tests.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.tests.delete(id);
  }

  // Complete a test by setting winner and end date
  completeTest(id: string, winnerId: string): ABTest | undefined {
    const test = this.tests.get(id);
    if (!test || test.status === 'completed') return undefined;

    const updated: ABTest = {
      ...test,
      status: 'completed',
      endDate: new Date(),
      winner: winnerId,
      confidence: Math.max(test.confidence, 95), // Ensure high confidence for completion
    };

    this.tests.set(id, updated);
    return updated;
  }
}

// Singleton pattern for Next.js hot reload
const globalForTestStore = globalThis as unknown as {
  testStore: TestStore | undefined;
};

if (!globalForTestStore.testStore) {
  globalForTestStore.testStore = new TestStore();
}

export const testStore = globalForTestStore.testStore;
