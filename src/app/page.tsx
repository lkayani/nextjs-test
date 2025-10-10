'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { List, Trash2, Edit2 } from 'lucide-react';
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

export default function Home() {
  const [lists, setLists] = useState<TodoList[]>([]);
  const [editingList, setEditingList] = useState<TodoList | null>(null);
  const [editName, setEditName] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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

  const deleteList = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm('Are you sure you want to delete this list and all its todos?')) {
      return;
    }

    try {
      const res = await fetch(`/api/lists/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setLists(lists.filter(list => list.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete list:', error);
    }
  };

  const startEdit = (list: TodoList, e: React.MouseEvent) => {
    e.preventDefault();
    setEditingList(list);
    setEditName(list.name);
    setIsEditDialogOpen(true);
  };

  const updateList = async () => {
    if (!editingList || !editName.trim()) return;

    try {
      const res = await fetch(`/api/lists/${editingList.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName }),
      });

      if (res.ok) {
        const updatedList = await res.json();
        setLists(lists.map(list =>
          list.id === updatedList.id ? updatedList : list
        ));
        setIsEditDialogOpen(false);
        setEditingList(null);
        setEditName('');
      }
    } catch (error) {
      console.error('Failed to update list:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Lists</h1>
          <p className="text-muted-foreground">
            Manage and organize your todo lists
          </p>
        </div>

        {lists.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <List className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No lists yet. Create one using the + button in the sidebar!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lists.map((list) => (
              <Link key={list.id} href={`/lists/${list.id}`}>
                <Card className="transition-all hover:shadow-lg cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <List className="h-5 w-5" />
                      {list.name}
                    </CardTitle>
                    <CardDescription>
                      Created {new Date(list.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => startEdit(list, e)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => deleteList(list.id, e)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit List Name</DialogTitle>
              <DialogDescription>
                Update the name of your todo list.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="List name..."
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && updateList()}
                className="flex-1"
              />
              <Button
                onClick={updateList}
                disabled={!editName.trim()}
              >
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
