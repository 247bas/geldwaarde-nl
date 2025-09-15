# API Rate Limiting Documentation

## Overview
The price API now implements **strict 24-hour rate limiting** to stay within the 100 API calls/month limit from MetalPrice API.

## How It Works

### Automatic Rate Limiting
- **Maximum 1 API call per 24 hours**
- Prices are cached for 24 hours
- Subsequent requests return cached data
- No manual intervention needed

### API Response Fields
```json
{
  "gold": 99.83,
  "silver": 1.156,
  "cached": true,
  "lastUpdated": "2025-09-15T14:20:21.714Z",
  "dataDate": "2025-09-14",
  "source": "metalpriceapi.com",
  "isStale": false,
  "rateLimited": false,
  "lastApiCall": "2025-09-15T14:20:21.529Z"
}
```

### Status Indicators
- `cached: true` - Data from cache (no API call made)
- `rateLimited: true` - Request blocked due to 24-hour limit
- `lastApiCall` - Timestamp of last actual API call

## Manual Price Updates

### Admin Endpoint
```bash
POST /api/prices/update
Header: x-admin-key: your-admin-key
```

### Example Usage
```bash
curl -X POST \
  -H "x-admin-key: your-admin-key" \
  https://geldwaardenl.vercel.app/api/prices/update
```

⚠️ **Warning**: Manual updates bypass rate limiting and count toward your monthly quota. Use sparingly!

## Monthly Usage Tracking
With strict 24-hour limiting:
- **Maximum**: 31 API calls per month (once per day)
- **Quota**: 100 calls per month
- **Safety margin**: 69 calls remaining for manual updates or errors

## Environment Variables
```bash
# Required for price fetching
METALPRICE_API_KEY=your-api-key

# Required for manual updates
ADMIN_KEY=your-secure-admin-key
```