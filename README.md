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
  "data": [ { Array of festivals } ] or { Only next festival details },
  "status": 200
}
```
### Festival Details
```json
{
  "_id": "MongoDB Document _id", // Object._id
  "title": "Title of the Event", // String
  "description": "Description of Event", // String
  "location": "Location in address form", // String 
  "banner": "Link to image to display with Event", // String to URI in Cloudinary
  "start": 2024-02-05T19:03:23.291Z, // Start date object in ISO8601 format
  "end": 2024-03-05T19:03:23.291Z, // End date object in ISO8601 format
  "createdAt": 2024-03-05T19:03:23.291Z, // Date object in ISO8601 format
  "updatedAt": 2024-03-05T19:03:23.291Z // Date object in ISO8601 format
}
```
# PATHS THAT NEED DOCUMENTATION
- Festivals
- `POST https://wlba-project.vercel.app/api/events/festivals`
- `PUT https://wlba-project.vercel.app/api/events/festivals`
- `DELETE https://wlba-project.vercel.app/api/events/festivals`
- `------------------------------------------------------------`
- Volunteer
- `POST https://wlba-project.vercel.app/api/events/volunteer`
- `------------------------------------------------------------`
- Volunteerable Events
- `POST https://wlba-project.vercel.app/api/events/volunteerable-event`
- `DELETE https://wlba-project.vercel.app/api/events/volunteerable-event`
- `------------------------------------------------------------`
- Register
- `GET https://wlba-project.vercel.app/api/vendor`
- `POST https://wlba-project.vercel.app/api/vendor`
- `PUT https://wlba-project.vercel.app/api/vendor`
- `DELETE https://wlba-project.vercel.app/api/vendor`
- `------------------------------------------------------------`
- User
- `GET https://wlba-project.vercel.app/api/user`
- `POST https://wlba-project.vercel.app/api/user`
- `PUT https://wlba-project.vercel.app/api/user`
- `DELETE https://wlba-project.vercel.app/api/user`


