// In-memory store for todos
export interface Todo {
  id: string;
  listId: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

class TodoStore {
  private todos: Map<string, Todo> = new Map();

  getAll(): Todo[] {
    return Array.from(this.todos.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  getByListId(listId: string): Todo[] {
    return Array.from(this.todos.values())
      .filter(todo => todo.listId === listId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getById(id: string): Todo | undefined {
    return this.todos.get(id);
  }

  create(text: string, listId: string): Todo {
    const todo: Todo = {
      id: crypto.randomUUID(),
      listId,
      text,
      completed: false,
      createdAt: new Date(),
    };
    this.todos.set(todo.id, todo);
    return todo;
  }

  update(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): Todo | null {
    const todo = this.todos.get(id);
    if (!todo) return null;

    const updatedTodo = { ...todo, ...updates };
    this.todos.set(id, updatedTodo);
    return updatedTodo;
  }

  delete(id: string): boolean {
    return this.todos.delete(id);
  }

  deleteByListId(listId: string): void {
    const todosToDelete = Array.from(this.todos.values())
      .filter(todo => todo.listId === listId);
    todosToDelete.forEach(todo => this.todos.delete(todo.id));
  }

  clear(): void {
    this.todos.clear();
  }
}

// Export a singleton instance
export const todoStore = new TodoStore();
