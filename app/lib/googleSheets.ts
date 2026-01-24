import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
const NEW_LEADS_TAB = 'New Leads';


function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

function getSheets() {
  return google.sheets({ version: 'v4', auth: getAuth() });
}

/**
 * Find the column index of "email" by reading the header row.
 * Returns the column letter (e.g., "D") or null if not found.
 */
async function getEmailColumnIndex(): Promise<number | null> {
  console.log('[Sheets] Reading headers from tab:', NEW_LEADS_TAB);
  const sheets = getSheets();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${NEW_LEADS_TAB}'!1:1`,
  });

  const headers = response.data.values?.[0] || [];
  console.log('[Sheets] Headers found:', headers);
  const emailIndex = headers.findIndex(
    (header: string) => header.toLowerCase().trim() === 'email'
  );

  console.log('[Sheets] Email column index:', emailIndex >= 0 ? `${emailIndex} (${columnIndexToLetter(emailIndex)})` : 'NOT FOUND');
  return emailIndex >= 0 ? emailIndex : null;
}

/**
 * Convert a 0-based column index to a column letter (0=A, 1=B, ..., 3=D).
 */
function columnIndexToLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

/**
 * Check if an email already exists in the "New Leads" tab.
 * Dynamically finds the email column by header name.
 */
export async function findByEmail(email: string): Promise<boolean> {
  console.log('[Sheets] findByEmail called for:', email);
  const emailColIndex = await getEmailColumnIndex();
  if (emailColIndex === null) {
    console.error('[Sheets] Could not find "email" column in headers');
    return false;
  }

  const colLetter = columnIndexToLetter(emailColIndex);
  console.log('[Sheets] Reading email column:', colLetter);
  const sheets = getSheets();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${NEW_LEADS_TAB}'!${colLetter}:${colLetter}`,
  });

  const rows = response.data.values || [];
  const normalizedEmail = email.toLowerCase().trim();
  console.log('[Sheets] Total rows in column:', rows.length - 1, '(excluding header)');

  // Skip header row (index 0)
  const found = rows.slice(1).some(
    (row) => row[0]?.toLowerCase().trim() === normalizedEmail
  );
  console.log('[Sheets] Duplicate found:', found);
  return found;
}

