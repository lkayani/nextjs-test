'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

interface SheetDataRow {
  [key: string]: string | null;
}

interface SheetResponse {
  success: boolean;
  data: SheetDataRow[];
  count: number;
}

export default function SheetDataPage() {
  const [data, setData] = useState<SheetDataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/sheets');

        if (!response.ok) {
          throw new Error('Failed to fetch sheet data');
        }

        const result: SheetResponse = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          throw new Error('Failed to load sheet data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSheetData();
  }, []);

  // Get column headers from the first row
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        <Card>
          <CardHeader>
            <CardTitle>Google Sheet Data</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading sheet data...</span>
              </div>
            )}

            {error && (
              <div className="rounded-md bg-destructive/10 p-4 text-destructive">
                <p className="font-medium">Error loading data:</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {!loading && !error && data.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                No data found in the sheet
              </div>
            )}

            {!loading && !error && data.length > 0 && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((column) => (
                        <TableHead key={column} className="whitespace-nowrap">
                          {column}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((row, index) => (
                      <TableRow key={index}>
                        {columns.map((column) => (
                          <TableCell key={column} className="whitespace-nowrap">
                            {row[column] || '-'}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {!loading && !error && data.length > 0 && (
              <div className="mt-4 text-sm text-muted-foreground">
                Showing {data.length} rows
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
