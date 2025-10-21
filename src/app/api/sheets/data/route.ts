// Example API route: GET /api/sheets/data
// This demonstrates how to safely use Google Sheets credentials
// These environment variables are ONLY available in API routes (server-side)

import { NextResponse } from 'next/server';
import { readSheet, parseSheetData } from '@/lib/googleSheets';

// Example interface for your sheet data
interface SheetRow {
  name: string;
  value: string;
  category: string;
}

export async function GET(request: Request) {
  try {
    // Get the sheet ID from environment variable
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'Google Sheet ID not configured' },
        { status: 500 }
      );
    }

    // Read data from the sheet
    // Adjust the range to match your sheet structure
    const rows = await readSheet(spreadsheetId, 'Sheet1!A1:C100');

    // Parse the data (assumes first row is headers)
    const data = parseSheetData<SheetRow>(rows);

    // Return the data to the client
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch Google Sheets data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Google Sheets' },
      { status: 500 }
    );
  }
}
