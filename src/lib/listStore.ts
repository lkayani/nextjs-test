// In-memory store for todo lists
export interface TodoList {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

class ListStore {
  private lists: Map<string, TodoList> = new Map();

  getAll(): TodoList[] {
    return Array.from(this.lists.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  getById(id: string): TodoList | undefined {
    return this.lists.get(id);
  }

  create(name: string): TodoList {
    const list: TodoList = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.lists.set(list.id, list);
    return list;
  }

  update(id: string, updates: Partial<Omit<TodoList, 'id' | 'createdAt'>>): TodoList | null {
    const list = this.lists.get(id);
    if (!list) return null;

    const updatedList = {
      ...list,
      ...updates,
      updatedAt: new Date(),
    };
    this.lists.set(id, updatedList);
    return updatedList;
  }

  delete(id: string): boolean {
    return this.lists.delete(id);
  }

  clear(): void {
    this.lists.clear();
  }
}

// Export a singleton instance
export const listStore = new ListStore();

// Create a default list on startup
listStore.create('Personal');
