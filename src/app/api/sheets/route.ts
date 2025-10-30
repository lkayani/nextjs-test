import { NextResponse } from 'next/server';
import { readSheetData } from '@/lib/googleSheets';

/**
 * GET /api/sheets
 *
 * Reads data from the configured Google Sheet and returns it as structured JSON.
 * The first row is treated as headers, and subsequent rows are returned as objects.
 *
 * Configuration via environment variables:
 * - GOOGLE_SHEET_ID: The spreadsheet ID
 * - GOOGLE_SERVICE_ACCOUNT_JSON: Base64 encoded service account credentials
 *
 * @returns JSON array of objects where keys are column headers
 */
export async function GET() {
  try {
    // Get sheet ID from environment variable
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!sheetId) {
      return NextResponse.json(
        { error: 'GOOGLE_SHEET_ID environment variable is not configured' },
        { status: 500 }
      );
    }

    // Read data from the sheet
    // By default reads from 'Sheet1', but you can customize the range if needed
    const data = await readSheetData(sheetId);

    return NextResponse.json({
      success: true,
      data,
      count: data.length,
    });
  } catch (error) {
    console.error('Error reading Google Sheet:', error);

    // Return detailed error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to read Google Sheet',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
