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
  "data": [ Array of festivals ] or { Only next event details },
  "status": 200
}
```
### Event Details
```json
{
  "_id": "MongoDB Document _id",
  "title": "Title of the Event",
  "description": "Description of Event",
  "location": "Location in address form",
  "date": "Date in ISO 8601 format",
  "banner": "Link to image to display with Event",
  "createdAt": "MongoDB Generated Time of creation",
  "updatedAt": "MongoDB Generated Time of Update"
}
```
# PATHS THAT NEED DOCUMENTATION
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


