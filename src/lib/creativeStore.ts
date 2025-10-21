// Creative Store - manages ad creatives
import type { Creative, CreativeStatus, Platform, CreativeType } from './types';
import { generateCreatives } from './mockData';

class CreativeStore {
  private creatives: Map<string, Creative> = new Map();

  constructor() {
    // Initialize with mock data
    const mockCreatives = generateCreatives(60);
    mockCreatives.forEach(creative => {
      this.creatives.set(creative.id, creative);
    });
  }

  getAll(): Creative[] {
    return Array.from(this.creatives.values());
  }

  getById(id: string): Creative | undefined {
    return this.creatives.get(id);
  }

  getByStatus(status: CreativeStatus): Creative[] {
    return this.getAll().filter(creative => creative.status === status);
  }

  getByPlatform(platform: Platform): Creative[] {
    return this.getAll().filter(creative => creative.platform === platform);
  }

  getByType(type: CreativeType): Creative[] {
    return this.getAll().filter(creative => creative.type === type);
  }

  filter(filters: {
    status?: CreativeStatus;
    platform?: Platform;
    type?: CreativeType;
    search?: string;
  }): Creative[] {
    let results = this.getAll();

    if (filters.status) {
      results = results.filter(c => c.status === filters.status);
    }

    if (filters.platform) {
      results = results.filter(c => c.platform === filters.platform);
    }

    if (filters.type) {
      results = results.filter(c => c.type === filters.type);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(c =>
        c.name.toLowerCase().includes(searchLower) ||
        c.elements.hook.toLowerCase().includes(searchLower) ||
        c.elements.theme.toLowerCase().includes(searchLower)
      );
    }

    return results;
  }

  create(creative: Creative): Creative {
    this.creatives.set(creative.id, creative);
    return creative;
  }

  update(id: string, updates: Partial<Creative>): Creative | undefined {
    const creative = this.creatives.get(id);
    if (!creative) return undefined;

    const updated = { ...creative, ...updates };
    this.creatives.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.creatives.delete(id);
  }
}

// Singleton pattern for Next.js hot reload
const globalForCreativeStore = globalThis as unknown as {
  creativeStore: CreativeStore | undefined;
};

if (!globalForCreativeStore.creativeStore) {
  globalForCreativeStore.creativeStore = new CreativeStore();
}

export const creativeStore = globalForCreativeStore.creativeStore;
