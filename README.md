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
```

# NEW PATHS NEED DOCUMENTATION
- Festivals
- `POST https://wlba-project.vercel.app/api/events/festivals`
- `PUT https://wlba-project.vercel.app/api/events/festivals`
- `DELETE https://wlba-project.vercel.app/api/events/festivals`
- `------------------------------------------------------------`
- Volunteering
- `GET https://wlba-project.vercel.app/api/events/volunteering`
- `------------------------------------------------------------`
- Register
- `GET https://wlba-project.vercel.app/api/register/vendors`
- `POST https://wlba-project.vercel.app/api/register/vendors`
- `PUT https://wlba-project.vercel.app/api/register/vendors`
- `DELETE https://wlba-project.vercel.app/api/register/vendors`
- `------------------------------------------------------------`
- Volunteers
- `POST https://wlba-project.vercel.app/api/register/volunteers`
- `DELETE https://wlba-project.vercel.app/api/register/volunteers`
- `------------------------------------------------------------`
- User
- `GET https://wlba-project.vercel.app/api/user`
- `POST https://wlba-project.vercel.app/api/user`
- `PUT https://wlba-project.vercel.app/api/user`
- `DELETE https://wlba-project.vercel.app/api/user`


