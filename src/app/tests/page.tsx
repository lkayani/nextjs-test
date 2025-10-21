'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, TrendingUp, Award } from 'lucide-react';
import { format } from 'date-fns';
import type { ABTest, Creative } from '@/lib/types';

export default function TestsPage() {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [creatives, setCreatives] = useState<Map<string, Creative>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestsData();
  }, []);

  const fetchTestsData = async () => {
    try {
      setLoading(true);

      // Fetch all tests
      const testsRes = await fetch('/api/tests');
      if (testsRes.ok) {
        const data = await testsRes.json();
        setTests(data);

        // Fetch creative details for all creatives in tests
        const creativeIds = new Set<string>();
        data.forEach((test: ABTest) => {
          test.creativeIds.forEach(id => creativeIds.add(id));
        });

        const creativesRes = await fetch('/api/creatives');
        if (creativesRes.ok) {
          const allCreatives = await creativesRes.json();
          const creativeMap = new Map<string, Creative>();
          allCreatives.forEach((creative: Creative) => {
            if (creativeIds.has(creative.id)) {
              creativeMap.set(creative.id, creative);
            }
          });
          setCreatives(creativeMap);
        }
      }
    } catch (error) {
      console.error('Failed to fetch tests data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRunningTests = () => tests.filter(t => t.status === 'running');
  const getCompletedTests = () => tests.filter(t => t.status === 'completed');

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">A/B Tests</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">A/B Tests</h1>
          <p className="text-muted-foreground">
            Compare creative performance and identify winners
          </p>
        </div>

        {/* Running Tests */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FlaskConical className="h-6 w-6" />
            Running Tests ({getRunningTests().length})
          </h2>
          {getRunningTests().length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No running tests
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {getRunningTests().map((test) => (
                <Card key={test.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {test.name}
                          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                            Running
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Started {format(new Date(test.startDate), 'MMM d, yyyy')}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Confidence</p>
                        <p className="text-2xl font-bold">{test.confidence.toFixed(0)}%</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Testing Creatives:</p>
                      {test.creativeIds.map((creativeId) => {
                        const creative = creatives.get(creativeId);
                        return creative ? (
                          <div key={creativeId} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{creative.name}</p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {creative.type} • {creative.platform}
                              </p>
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Completed Tests */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Award className="h-6 w-6" />
            Completed Tests ({getCompletedTests().length})
          </h2>
          {getCompletedTests().length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No completed tests
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {getCompletedTests().map((test) => {
                const winnerCreative = test.winner ? creatives.get(test.winner) : null;
                return (
                  <Card key={test.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {test.name}
                            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                              Completed
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            {format(new Date(test.startDate), 'MMM d')} - {test.endDate && format(new Date(test.endDate), 'MMM d, yyyy')}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Confidence</p>
                          <p className="text-2xl font-bold text-green-600">{test.confidence.toFixed(0)}%</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {winnerCreative && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Award className="h-4 w-4 text-green-600" />
                              <span className="text-xs font-semibold text-green-700">WINNER</span>
                            </div>
                            <p className="font-medium text-sm">{winnerCreative.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {winnerCreative.type} • {winnerCreative.platform}
                            </p>
                          </div>
                        )}
                        <p className="text-sm font-medium">All Variants:</p>
                        {test.creativeIds.map((creativeId) => {
                          const creative = creatives.get(creativeId);
                          const isWinner = creativeId === test.winner;
                          return creative && !isWinner ? (
                            <div key={creativeId} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div>
                                <p className="font-medium text-sm">{creative.name}</p>
                                <p className="text-xs text-muted-foreground capitalize">
                                  {creative.type} • {creative.platform}
                                </p>
                              </div>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
