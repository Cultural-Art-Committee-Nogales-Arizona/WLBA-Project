# Festival API Documentation

## Get Festivals

### Description
Get either all festivals for display in the dashboard or calendar, or get the closest festival.

### Endpoint
`GET https://wlba-project.vercel.app/api/events/festivals`

### Query Parameters
- `nextEvent`: If set to "true", it returns only the next event. Otherwise, it returns all events.

### Response
```json
{
  "success": true,
  "message": "Successfully fetched all festivals",
  "data": [/* List of festivals */] or /* Next event details */,
  "status": 200
}
