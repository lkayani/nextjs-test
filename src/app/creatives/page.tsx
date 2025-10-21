'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Image, Video, Gamepad2 } from 'lucide-react';
import type { Creative, Platform, CreativeType, CreativeStatus } from '@/lib/types';

export default function CreativesPage() {
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [filteredCreatives, setFilteredCreatives] = useState<Creative[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const [selectedType, setSelectedType] = useState<CreativeType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<CreativeStatus | 'all'>('all');

  useEffect(() => {
    fetchCreatives();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [creatives, searchQuery, selectedPlatform, selectedType, selectedStatus]);

  const fetchCreatives = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/creatives');
      if (res.ok) {
        const data = await res.json();
        setCreatives(data);
      }
    } catch (error) {
      console.error('Failed to fetch creatives:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = creatives;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.elements.hook.toLowerCase().includes(query) ||
        c.elements.theme.toLowerCase().includes(query)
      );
    }

    // Apply platform filter
    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(c => c.platform === selectedPlatform);
    }

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(c => c.type === selectedType);
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(c => c.status === selectedStatus);
    }

    setFilteredCreatives(filtered);
  };

  const getTypeIcon = (type: CreativeType) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'playable':
        return <Gamepad2 className="h-4 w-4" />;
      case 'static':
        return <Image className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Creative Library</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Creative Library</h1>
          <p className="text-muted-foreground">
            Browse and manage your ad creatives ({filteredCreatives.length} of {creatives.length})
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search creatives by name, hook, or theme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-4">
            {/* Platform filter */}
            <div className="flex gap-2">
              <span className="text-sm font-medium my-auto">Platform:</span>
              <Button
                variant={selectedPlatform === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPlatform('all')}
              >
                All
              </Button>
              {(['facebook', 'google', 'tiktok', 'unity', 'ironsource'] as Platform[]).map((platform) => (
                <Button
                  key={platform}
                  variant={selectedPlatform === platform ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPlatform(platform)}
                >
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </Button>
              ))}
            </div>

            {/* Type filter */}
            <div className="flex gap-2">
              <span className="text-sm font-medium my-auto">Type:</span>
              <Button
                variant={selectedType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('all')}
              >
                All
              </Button>
              {(['video', 'static', 'playable'] as CreativeType[]).map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>

            {/* Status filter */}
            <div className="flex gap-2">
              <span className="text-sm font-medium my-auto">Status:</span>
              <Button
                variant={selectedStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedStatus('all')}
              >
                All
              </Button>
              {(['active', 'paused', 'testing', 'archived'] as CreativeStatus[]).map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Creative Grid */}
        {filteredCreatives.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Image className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No creatives found matching your filters
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCreatives.map((creative) => (
              <Link key={creative.id} href={`/creatives/${creative.id}`}>
                <Card className="transition-all hover:shadow-lg cursor-pointer h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(creative.type)}
                        <CardTitle className="text-base line-clamp-2">{creative.name}</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-xs line-clamp-1">
                      {creative.elements.hook}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Platform</span>
                        <span className="font-medium capitalize">{creative.platform}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Theme</span>
                        <span className="font-medium text-right line-clamp-1">{creative.elements.theme}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Status</span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          creative.status === 'active' ? 'bg-green-100 text-green-700' :
                          creative.status === 'testing' ? 'bg-blue-100 text-blue-700' :
                          creative.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {creative.status}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
