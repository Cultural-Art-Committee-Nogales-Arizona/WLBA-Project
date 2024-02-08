# CACNA API Documentation

## Response Objects

### Success
```json
{
  "success": true,
  "message": Success message,
  "data": {Single object} or [{Array of objects},...], //Returned only by GET, POST, and PUT requests
  "status": 200
}
```

### Error
```json
{
  "success": false,
  "message": General error message,
  "errorMessage": Specific message of error encountered,
  "err": {Error object},
  "status": 500
}
```

# Routes

## Get Festivals

### Description
Get either all festivals for display in the dashboard or calendar, or get the closest festival.

### Endpoint
`GET https://wlba-project.vercel.app/api/events/festivals`

### Query Parameters
- `nextEvent`: If set to "true", it returns only the next event. Otherwise, it returns all events.

### Data Unit Returned
Returns either an array of all recorded events or the next event.
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

## Post Festivals

### Description 
Add a new festival to the database.

### Endpoint
`POST https://wlba-project.vercel.app/api/events/festivals`

### Query Parameters
- `adminId`: Authentication token for administrators. Ensures that only users with an admin token can create festivals.

### Request Body
```json
{
  "title": "Title of the Event", // String
  "description": "Description of Event", // String
  "location": "Location in address form", // String 
  "banner": "Link to image to display with Event", // String to URI in Cloudinary
  "start": 2024-02-05T19:03:23.291Z, // Start date object in ISO8601 format
  "end": 2024-03-05T19:03:23.291Z, // End date object in ISO8601 format
}
```

### Data Unit Returned
Returns the festival which has been created.
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

## Edit Festivals

### Description 
Edit existing festival information

### Endpoint
`PUT https://wlba-project.vercel.app/api/events/festivals`

### Query Parameters
- `festivalId`: Database identifier of festival to update.
- `adminId`: Authentication token for administrators. Ensures that only users with an admin token can update festivals.

### Request Body
```json
{
  "title": "Title of the Event", // String
  "description": "Description of Event", // String
  "location": "Location in address form", // String 
  "banner": "Link to image to display with Event", // String to URI in Cloudinary
  "start": 2024-02-05T19:03:23.291Z, // Start date object in ISO8601 format
  "end": 2024-03-05T19:03:23.291Z, // End date object in ISO8601 format
}
```

### Data Unit Returned
Returns the edited festival object.
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
- `DELETE https://wlba-project.vercel.app/api/events/festivals`
- `------------------------------------------------------------`
- Volunteer
- `GET https://wlba-project.vercel.app/api/events/volunteer`
- `POST https://wlba-project.vercel.app/api/events/volunteer`
- `DELETE https://wlba-project.vercel.app/api/events/volunteer`
- `------------------------------------------------------------`
- Vendor
- `GET https://wlba-project.vercel.app/api/vendor`
- `POST https://wlba-project.vercel.app/api/vendor`
- `PUT https://wlba-project.vercel.app/api/vendor`
- `DELETE https://wlba-project.vercel.app/api/vendor`
- `------------------------------------------------------------`
- Vendor Accept
- `POST https://wlba-project.vercel.app/api/vendor/accept`
- `DELETE https://wlba-project.vercel.app/api/vendor/accept`
- `------------------------------------------------------------`
- User
- `GET https://wlba-project.vercel.app/api/user`
- `POST https://wlba-project.vercel.app/api/user`
- `PUT https://wlba-project.vercel.app/api/user`
- `DELETE https://wlba-project.vercel.app/api/user`
- Admin
- `GET https://wlba-project.vercel.app/api/admin`
- `POST https://wlba-project.vercel.app/api/admin`
- `DELETE https://wlba-project.vercel.app/api/admin`
- Contact
- `POST https://wlba-project.vercel.app/api/contact`
