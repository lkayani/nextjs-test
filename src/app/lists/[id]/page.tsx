'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Todo {
  id: string;
  listId: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

interface TodoList {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function ListPage() {
  const params = useParams();
  const router = useRouter();
  const listId = params.id as string;

  const [list, setList] = useState<TodoList | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListLoading, setIsListLoading] = useState(true);

  useEffect(() => {
    if (listId) {
      console.log('[Frontend] ListPage mounted - listId:', listId, 'at', new Date().toISOString());
      fetchList();
      fetchTodos();
    }
  }, [listId]);

  const fetchList = async () => {
    console.log('[Frontend] fetchList() - Fetching list:', listId);
    try {
      const res = await fetch(`/api/lists/${listId}`);
      console.log('[Frontend] fetchList() - Response status:', res.status, '- ok:', res.ok);
      if (res.ok) {
        const data = await res.json();
        console.log('[Frontend] fetchList() - List data received:', data);
        setList(data);
      } else if (res.status === 404) {
        console.log('[Frontend] fetchList() - List not found (404), redirecting to home');
        router.push('/');
      }
    } catch (error) {
      console.error('[Frontend] fetchList() - Error:', error);
    } finally {
      setIsListLoading(false);
    }
  };

  const fetchTodos = async () => {
    console.log('[Frontend] fetchTodos() - Fetching todos for list:', listId);
    try {
      const res = await fetch(`/api/lists/${listId}/todos`);
      console.log('[Frontend] fetchTodos() - Response status:', res.status, '- ok:', res.ok);
      if (res.ok) {
        const data = await res.json();
        console.log('[Frontend] fetchTodos() - Todos data received:', data.length, 'todos');
        setTodos(data);
      } else {
        console.log('[Frontend] fetchTodos() - Request failed with status:', res.status);
      }
    } catch (error) {
      console.error('[Frontend] fetchTodos() - Error:', error);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/lists/${listId}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTodo }),
      });

      if (res.ok) {
        const todo = await res.json();
        setTodos([todo, ...todos]);
        setNewTodo('');
      }
    } catch (error) {
      console.error('Failed to add todo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const res = await fetch(`/api/lists/${listId}/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });

      if (res.ok) {
        setTodos(todos.map(todo =>
          todo.id === id ? { ...todo, completed } : todo
        ));
      }
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const res = await fetch(`/api/lists/${listId}/todos/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setTodos(todos.filter(todo => todo.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  if (isListLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!list) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lists
          </Button>
        </Link>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{list.name}</CardTitle>
            <CardDescription>Manage your tasks for this list</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-6">
              <Input
                placeholder="Add a new todo..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                onClick={addTodo}
                disabled={isLoading || !newTodo.trim()}
              >
                {isLoading ? 'Adding...' : 'Add Todo'}
              </Button>
            </div>

            <div className="space-y-2">
              {todos.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No todos yet. Add one to get started!
                </p>
              ) : (
                todos.map((todo) => (
                  <Card key={todo.id} className="transition-all hover:shadow-md">
                    <CardContent className="flex items-center gap-3 p-4">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={(checked) =>
                          toggleTodo(todo.id, checked as boolean)
                        }
                      />
                      <span
                        className={`flex-1 ${
                          todo.completed
                            ? 'line-through text-muted-foreground'
                            : ''
                        }`}
                      >
                        {todo.text}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTodo(todo.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {todos.length > 0 && (
              <div className="mt-6 text-sm text-muted-foreground text-center">
                {todos.filter(t => !t.completed).length} of {todos.length} tasks remaining
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
