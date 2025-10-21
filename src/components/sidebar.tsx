'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, Image, FlaskConical, Globe, TrendingUp } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="w-64 min-h-screen bg-gray-50 dark:bg-gray-900 border-r p-4 flex flex-col gap-2">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1">Ad Creative</h2>
        <p className="text-xs text-muted-foreground">Testing Dashboard</p>
      </div>

      <nav className="space-y-1">
        <Link href="/">
          <Button
            variant={isActive('/') && pathname === '/' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
          >
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>

        <Link href="/creatives">
          <Button
            variant={isActive('/creatives') ? 'secondary' : 'ghost'}
            className="w-full justify-start"
          >
            <Image className="mr-2 h-4 w-4" />
            Creatives
          </Button>
        </Link>

        <Link href="/tests">
          <Button
            variant={isActive('/tests') ? 'secondary' : 'ghost'}
            className="w-full justify-start"
          >
            <FlaskConical className="mr-2 h-4 w-4" />
            A/B Tests
          </Button>
        </Link>

        <Link href="/platforms">
          <Button
            variant={isActive('/platforms') ? 'secondary' : 'ghost'}
            className="w-full justify-start"
          >
            <Globe className="mr-2 h-4 w-4" />
            Platforms
          </Button>
        </Link>
      </nav>

      <div className="flex-1" />

      <div className="pt-4 mt-4 border-t">
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Quick Stats</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3 w-3" />
            <span>60 Active Creatives</span>
          </div>
          <div className="flex items-center gap-2">
            <FlaskConical className="h-3 w-3" />
            <span>3 Running Tests</span>
          </div>
        </div>
      </div>
    </div>
  );
}
