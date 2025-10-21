# Google Sheets API Route - Example Usage

## How Frontend Calls This API

The frontend **never** has access to the credentials. It simply calls the API route:

```typescript
// In any React component (client-side)
'use client';

import { useEffect, useState } from 'react';

export default function DataPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      // Frontend calls the API route
      // Credentials are handled server-side only
      const res = await fetch('/api/sheets/data');
      if (res.ok) {
        const data = await res.json();
        setData(data);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      {data.map((row) => (
        <div key={row.name}>{row.name}: {row.value}</div>
      ))}
    </div>
  );
}
```

## Security Flow

1. **Frontend** → Makes request to `/api/sheets/data`
2. **API Route** (server-side) → Reads `GOOGLE_SERVICE_ACCOUNT_JSON` from `.env.local`
3. **API Route** → Authenticates with Google using credentials
4. **API Route** → Fetches data from Google Sheets
5. **API Route** → Returns data to frontend
6. **Frontend** → Displays data

**The credentials NEVER touch the browser!**

## Verification

To verify credentials are not exposed:
1. Open browser DevTools → Network tab
2. Make a request to the API
3. Check the response - you'll only see the data, not the credentials
4. Check browser console → `console.log(process.env)` - server variables won't appear

## Setup Steps

1. Install googleapis package:
   ```bash
   npm install googleapis
   ```

2. Create a Google Cloud service account:
   - Go to Google Cloud Console
   - Create a service account
   - Download the JSON credentials file

3. Share your Google Sheet with the service account email:
   - Open your Google Sheet
   - Click "Share"
   - Add the service account email (from credentials JSON)
   - Give it "Viewer" access

4. Add credentials to `.env.local`:
   - Copy the entire JSON content
   - Set as `GOOGLE_SERVICE_ACCOUNT_JSON`
   - Get the sheet ID from the URL
   - Set as `GOOGLE_SHEET_ID`

5. Restart your dev server to pick up new env variables
