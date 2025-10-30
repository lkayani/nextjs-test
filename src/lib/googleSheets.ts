import { google } from 'googleapis';

/**
 * Initialize and return an authenticated Google Sheets API client
 *
 * Reads service account credentials from GOOGLE_SERVICE_ACCOUNT_JSON environment variable.
 * The credentials should be base64 encoded.
 *
 * @returns Authenticated sheets client
 * @throws Error if credentials are missing or invalid
 */
export function getGoogleSheetsClient() {
  const encodedCredentials = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  if (!encodedCredentials) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON environment variable is not set');
  }

  try {
    // Decode base64 credentials
    const credentialsJson = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
    const credentials = JSON.parse(credentialsJson);

    // Create auth client with service account credentials
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    // Return authenticated sheets client
    return google.sheets({ version: 'v4', auth });
  } catch (error) {
    throw new Error(`Failed to initialize Google Sheets client: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the first sheet name from a Google Spreadsheet
 *
 * @param sheetId - The Google Sheet ID
 * @returns The name of the first sheet
 */
async function getFirstSheetName(sheetId: string): Promise<string> {
  const sheets = getGoogleSheetsClient();

  const response = await sheets.spreadsheets.get({
    spreadsheetId: sheetId,
  });

  const firstSheet = response.data.sheets?.[0];
  if (!firstSheet?.properties?.title) {
    throw new Error('No sheets found in the spreadsheet');
  }

  return firstSheet.properties.title;
}

/**
 * Read data from a Google Sheet and return it as an array of objects
 *
 * @param sheetId - The Google Sheet ID
 * @param range - Optional range to read. If not provided, reads from the first sheet
 * @returns Array of objects where keys are the header row values
 */
export async function readSheetData(sheetId: string, range?: string) {
  const sheets = getGoogleSheetsClient();

  try {
    // If no range specified, get the first sheet name
    let actualRange = range;
    if (!actualRange) {
      const firstSheetName = await getFirstSheetName(sheetId);
      actualRange = firstSheetName;
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: actualRange,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return [];
    }

    // First row is headers
    const headers = rows[0] as string[];

    // Convert remaining rows to objects
    const data = rows.slice(1).map((row) => {
      const obj: Record<string, string | null> = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] !== undefined ? row[index] : null;
      });
      return obj;
    });

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to read sheet data: ${error.message}`);
    }
    throw new Error('Failed to read sheet data: Unknown error');
  }
}
