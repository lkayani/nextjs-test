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

  constructor() {
    console.log('[TodoStore] Initializing TodoStore at', new Date().toISOString());
  }

  getAll(): Todo[] {
    const todos = Array.from(this.todos.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
    console.log('[TodoStore] getAll() called - returning', todos.length, 'todos');
    return todos;
  }

  getByListId(listId: string): Todo[] {
    const todos = Array.from(this.todos.values())
      .filter(todo => todo.listId === listId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    console.log('[TodoStore] getByListId(' + listId + ') - Found', todos.length, 'todos - Total todos in store:', this.todos.size);
    return todos;
  }

  getById(id: string): Todo | undefined {
    const todo = this.todos.get(id);
    console.log('[TodoStore] getById(' + id + ') -', todo ? 'FOUND' : 'NOT FOUND');
    return todo;
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
    console.log('[TodoStore] create(' + text + ', listId: ' + listId + ') - Created todo with ID:', todo.id, '- Total todos:', this.todos.size);
    return todo;
  }

  update(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): Todo | null {
    const todo = this.todos.get(id);
    if (!todo) {
      console.log('[TodoStore] update(' + id + ') - Todo NOT FOUND');
      return null;
    }

    const updatedTodo = { ...todo, ...updates };
    this.todos.set(id, updatedTodo);
    console.log('[TodoStore] update(' + id + ') - Updated successfully');
    return updatedTodo;
  }

  delete(id: string): boolean {
    const result = this.todos.delete(id);
    console.log('[TodoStore] delete(' + id + ') -', result ? 'DELETED' : 'NOT FOUND', '- Remaining todos:', this.todos.size);
    return result;
  }

  deleteByListId(listId: string): void {
    const todosToDelete = Array.from(this.todos.values())
      .filter(todo => todo.listId === listId);
    console.log('[TodoStore] deleteByListId(' + listId + ') - Deleting', todosToDelete.length, 'todos');
    todosToDelete.forEach(todo => this.todos.delete(todo.id));
  }

  clear(): void {
    console.log('[TodoStore] clear() - Clearing all todos');
    this.todos.clear();
  }
}

// Ensure true singleton across Next.js hot reloads and different runtime contexts
const globalForTodoStore = globalThis as unknown as {
  todoStore: TodoStore | undefined;
};

if (!globalForTodoStore.todoStore) {
  console.log('[TodoStore] Creating NEW singleton instance');
  globalForTodoStore.todoStore = new TodoStore();
} else {
  console.log('[TodoStore] Reusing existing singleton instance');
}

// Export the singleton instance
export const todoStore = globalForTodoStore.todoStore;
