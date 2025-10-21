// Google Sheets helper - SERVER-SIDE ONLY
// This file should only be imported in API routes or server components

import { google } from 'googleapis';

/**
 * Get Google Sheets API client using service account credentials
 * This function is ONLY available on the server side
 */
export function getGoogleSheetsClient() {
  // Parse the service account JSON from environment variable
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '{}');

  // Alternative: If using individual fields
  // const credentials = {
  //   client_email: process.env.GOOGLE_CLIENT_EMAIL,
  //   private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  // };

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  return sheets;
}

/**
 * Read data from a Google Sheet
 * @param spreadsheetId - The ID of the spreadsheet (from URL)
 * @param range - The range to read (e.g., 'Sheet1!A1:D10')
 */
export async function readSheet(spreadsheetId: string, range: string) {
  try {
    const sheets = getGoogleSheetsClient();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return response.data.values || [];
  } catch (error) {
    console.error('Error reading Google Sheet:', error);
    throw new Error('Failed to read Google Sheet');
  }
}

/**
 * Example: Parse sheet data into typed objects
 */
export function parseSheetData<T>(rows: any[][], headerRow = 0): T[] {
  if (rows.length <= headerRow) return [];

  const headers = rows[headerRow];
  const dataRows = rows.slice(headerRow + 1);

  return dataRows.map(row => {
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj as T;
  });
}
