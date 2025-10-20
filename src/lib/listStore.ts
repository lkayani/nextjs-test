// In-memory store for todo lists
export interface TodoList {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

class ListStore {
  private lists: Map<string, TodoList> = new Map();

  constructor() {
    console.log('[ListStore] Initializing ListStore at', new Date().toISOString());
  }

  getAll(): TodoList[] {
    const lists = Array.from(this.lists.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
    console.log('[ListStore] getAll() called - returning', lists.length, 'lists:', lists.map(l => ({ id: l.id, name: l.name })));
    return lists;
  }

  getById(id: string): TodoList | undefined {
    const list = this.lists.get(id);
    console.log('[ListStore] getById(' + id + ') -', list ? 'FOUND' : 'NOT FOUND', '- Available list IDs:', Array.from(this.lists.keys()));
    return list;
  }

  create(name: string): TodoList {
    const list: TodoList = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.lists.set(list.id, list);
    console.log('[ListStore] create(' + name + ') - Created list with ID:', list.id, '- Total lists:', this.lists.size);
    return list;
  }

  update(id: string, updates: Partial<Omit<TodoList, 'id' | 'createdAt'>>): TodoList | null {
    const list = this.lists.get(id);
    if (!list) {
      console.log('[ListStore] update(' + id + ') - List NOT FOUND');
      return null;
    }

    const updatedList = {
      ...list,
      ...updates,
      updatedAt: new Date(),
    };
    this.lists.set(id, updatedList);
    console.log('[ListStore] update(' + id + ') - Updated successfully');
    return updatedList;
  }

  delete(id: string): boolean {
    const result = this.lists.delete(id);
    console.log('[ListStore] delete(' + id + ') -', result ? 'DELETED' : 'NOT FOUND', '- Remaining lists:', this.lists.size);
    return result;
  }

  clear(): void {
    console.log('[ListStore] clear() - Clearing all lists');
    this.lists.clear();
  }
}

// Ensure true singleton across Next.js hot reloads and different runtime contexts
const globalForListStore = globalThis as unknown as {
  listStore: ListStore | undefined;
};

if (!globalForListStore.listStore) {
  console.log('[ListStore] Creating NEW singleton instance');
  globalForListStore.listStore = new ListStore();

  // Create a default list on startup
  console.log('[ListStore] Creating default "Personal" list on startup');
  const defaultList = globalForListStore.listStore.create('Personal');
  console.log('[ListStore] Startup complete - Default list ID:', defaultList.id);
} else {
  console.log('[ListStore] Reusing existing singleton instance');
}

// Export the singleton instance
export const listStore = globalForListStore.listStore;
