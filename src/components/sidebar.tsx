'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, List, Home } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface TodoList {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export function Sidebar() {
  const [lists, setLists] = useState<TodoList[]>([]);
  const [newListName, setNewListName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const res = await fetch('/api/lists');
      if (res.ok) {
        const data = await res.json();
        setLists(data);
      }
    } catch (error) {
      console.error('Failed to fetch lists:', error);
    }
  };

  const createList = async () => {
    if (!newListName.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newListName }),
      });

      if (res.ok) {
        const list = await res.json();
        setLists([list, ...lists]);
        setNewListName('');
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Failed to create list:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      createList();
    }
  };

  return (
    <div className="w-64 min-h-screen bg-gray-50 dark:bg-gray-900 border-r p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">My Lists</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="icon" variant="ghost">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New List</DialogTitle>
              <DialogDescription>
                Give your new todo list a name.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="List name..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                onClick={createList}
                disabled={isCreating || !newListName.trim()}
              >
                {isCreating ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Link href="/">
        <Button
          variant={pathname === '/' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
      </Link>

      <div className="flex-1 space-y-2">
        {lists.map((list) => (
          <Link key={list.id} href={`/lists/${list.id}`}>
            <Button
              variant={pathname === `/lists/${list.id}` ? 'secondary' : 'ghost'}
              className="w-full justify-start"
            >
              <List className="mr-2 h-4 w-4" />
              {list.name}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
