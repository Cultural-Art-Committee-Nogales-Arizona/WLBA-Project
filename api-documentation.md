v0.1
# CACNA API Documentation

## Response Objects

### Success
```json
{
  "success": true,
  "message": Success message,
  "data": {Single object} or [{Array of objects},...], //Returned only by GET, POST, and PUT requests
}
```

### Error
```json
{
  "success": false,
  "message": General error message,
  "errorMessage": Specific message of error encountered,
  "err": {Error object}
}
```

# Routes

## Festivals Route

### Festival Data Object
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

### Get Festivals

#### Description
Get either all festivals for display in the dashboard or calendar, or get the closest festival.

#### Endpoint
`GET https://wlba-project.vercel.app/api/events/festivals`

#### Query Parameters
- `nextEvent`: If set to "true", it returns only the next event. Otherwise, it returns all events.

#### Data Unit Returned
Returns either an array of all festivals in the database or the next festival.

### Post Festival

#### Description 
Add a new festival to the database.

#### Endpoint
`POST https://wlba-project.vercel.app/api/events/festivals`

#### Query Parameters
- `adminId`: Authentication token for administrators. Ensures that only users with an admin token can create festivals.

#### Request Body
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

#### Data Unit Returned
Returns the festival which has been created.

### Edit Festival

#### Description 
Edit existing festival information

#### Endpoint
`PUT https://wlba-project.vercel.app/api/events/festivals`

#### Query Parameters
- `festivalId`: Database identifier of festival to update.
- `adminId`: Authentication token for administrators. Ensures that only users with an admin token can update festivals.

#### Request Body
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

#### Data Unit Returned
Returns the edited festival object.

### Delete Festival

#### Description
Delete existing festival by ID.

#### Endpoint
`DELETE https://wlba-project.vercel.app/api/events/festivals`

#### Query Parameters
- `festivalId`: Database identifier of festival to delete.
- `adminId`: Authentication token for administrators. Ensures that only users with an admin token can delete festivals.

## Volunteers Route

### Volunteer Data Object
```json
{
  "_id": "MongoDB Document _id", // Object._id
  "name": "Name of the volunteer", // String
  "phone": "Volunteer's phone number", // String
  "email": "Volunteer's email", // String 
  "interest": "Volunteer's volunteering interests", // String
  "createdAt": 2024-03-05T19:03:23.291Z, // Date object in ISO8601 format
  "updatedAt": 2024-03-05T19:03:23.291Z // Date object in ISO8601 format
}
```

### Get Volunteers

#### Description
Gets all regisered volunteers

#### Endpoint 
`GET https://wlba-project.vercel.app/api/events/volunteer`

#### Data Unit Returned
Returns an array of volunteer objects.

### Post Volunteer

#### Description
Registers a person as a volunteer. Phone Number must be unique.

#### Endpoint
`POST https://wlba-project.vercel.app/api/events/volunteer`

#### Request Body
```json
{
  "name": "Name of the volunteer", // String
  "phone": "Volunteer's phone number", // String
  "email": "Volunteer's email", // String 
  "interest": "Volunteer's volunteering interests", // String
}
```

#### Data Unit Returned
Returns new volunteer object created.

### Delete Volunteer

#### Description
Delete existing volunteer by ID.

#### Endpoint 
`DELETE https://wlba-project.vercel.app/api/events/volunteer`

#### Query Parameters
- `volunteerId`: Database identifier of volunteer to delete.

## Vendors Route

### Vendor Data Object
```json
{
  "_id": "MongoDB Document _id", // Object._id
  "name": "Name of the vendor", // String
  "description": "Vendor's description", // String
  "tags": "Vendor's tags", // String
  "email": "Vendor's email", // String 
  "user": "MongoDB User _id of user related to the vendor", // Object._id
  "accepted": "Returned only by GET requests, depends on whether the vendor's database identifier has been accepted", // Boolean
  "createdAt": "2024-03-05T19:03:23.291Z", // Date object in ISO8601 format
  "updatedAt": "2024-03-05T19:03:23.291Z" // Date object in ISO8601 format
}
```

### Get Vendors

#### Description
Get a list of all vendors in the database.

#### Endpoint
`GET https://wlba-project.vercel.app/api/vendor`

#### Query Parameters
- `adminId`: Admin authentication token to ensure only administrators can look at registered vendors.

#### Data Unit Returned
Returns all registered vendors.

### Post Vendor

#### Description
Registers a new vendor.

#### Endpoint
`POST https://wlba-project.vercel.app/api/vendor`

#### Request Body

# PATHS THAT NEED DOCUMENTATION
- Vendor
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
