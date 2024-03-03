v1.2
# CACNA API Documentation

### Changelog
```
- v1.2 changelog:
- Added admin recovery routes
- This might be the final version of the API, remove changelog and version for production
```

## Contents

- [Response Objects](#response-objects)
- [Festivals](#festivals-route)
- [Volunteers](#volunteers-route)
- [Vendors](#vendors-route)
- [Users and Admins](#user-route)
- [Contact Routes](#contact-routes)

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

#### Headers
- `token`: A JWT token containing administrator's authorization token and database identifier.

#### Request Body
```json
{
  "title": "Title of the Event", // String
  "description": "Description of Event", // String
  "location": "Location in address form", // String 
  "banner": "Link to image to display with Event", // String to URI in Cloudinary
  "start": 2024-02-05T19:03:23.291Z, // Start date object in ISO8601 format
  "end": 2024-03-05T19:03:23.291Z // End date object in ISO8601 format
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

#### Headers
- `token`: A JWT token containing administrator's authorization token and database identifier.

#### Request Body
```json
{
  "title": "Title of the Event", // String
  "description": "Description of Event", // String
  "location": "Location in address form", // String 
  "banner": "Link to image to display with Event", // String to URI in Cloudinary
  "start": 2024-02-05T19:03:23.291Z, // Start date object in ISO8601 format
  "end": 2024-03-05T19:03:23.291Z // End date object in ISO8601 format
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

#### Headers
- `token`: A JWT token containing administrator's authorization token and database identifier.

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
  "interest": "Volunteer's volunteering interests" // String
}
```

#### Data Unit Returned
Returns new volunteer object created.

### Delete Volunteers

#### Description
Delete a list of existing volunteers.

#### Endpoint
`DELETE https://wlba-project.vercel.app/api/event/volunteer`

#### Request Body
```json
{
  "volunteers" : [] "Array of database identifiers of volunteers to delete." //Array
}
```

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

### Accepted Vendor Object
```json
{
  "_id": "MongoDB Document _id", // Object._id
  "name": "Name of the vendor", // 
  "id": "MongoDB Vendor _id", // 
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
- `userId`: Optional user database identifier. If a valid user value is passed only vendors registered by this user will be returned.

#### Data Unit Returned
Returns all registered vendors or all vendors corresponding to a specific user.

### Post Vendor

#### Description
Registers a new vendor.

#### Endpoint
`POST https://wlba-project.vercel.app/api/vendor`

#### Request Body
```json
{
  "name": "Name of the vendor", // String
  "description": "Vendor's description", // String
  "tags": "Vendor's tags", // String
  "email": "Vendor's email", // String 
  "user": "MongoDB User _id of user related to the vendor" // Object._id
}
```

#### Data Unit Returned
Vendor object recently created.

### Edit Vendor

#### Description
Edit an existing registered vendor's information.

#### Endpoint
`PUT https://wlba-project.vercel.app/api/vendor`

#### Query Parameters
- `vendorId`: Database identifier of the vendor to edit.

#### Request Body
```json
{
  "name": "Name of the vendor", // String
  "description": "Vendor's description", // String
  "tags": "Vendor's tags", // String
  "email": "Vendor's email" // String 
}
```

#### Data Unit Returned
Updated vendor object.

### Delete Vendors

#### Description
Delete a list of existing vendors

#### Endpoint
`DELETE https://wlba-project.vercel.app/api/vendor`

#### Request Body
```json
{
  "vendors" : [] "Array of database identifiers of vendors to delete." //Array
}
```

### Accept Vendor

#### Description
Accept one or more registered vendors.

#### Endpoint 
`POST https://wlba-project.vercel.app/api/vendor/accept`

#### Headers
- `token`: A JWT token containing administrator's authorization token and database identifier.

#### Request Body
```json
{
  "vendors": [
    {
      "name" : "Name of vendor", // String
      "id": "ID of existing vendor document", // Object._id
      "email": "Email of vendor to contact" // String
    }
  ], //Array
  "id": "MongoDB Vendor _id" //Object._id
}
```

#### Data Unit Returned
```json
{
  "vendor": "Created accepted vendor object", // Object
  "mail": "Vendor's mail options" // Object
}
```

### Remove Accepted Vendor

#### Description
Remove an accepted vendor from the accepted documents list.

#### Endpoint
`DELETE https://wlba-project.vercel.app/api/vendor/reject`

#### Headers
- `token`: A JWT token containing administrator's authorization token and database identifier.

#### Request Body
```json
{
  "vendorId": "MongoDB Vendor _id", // Object._id
  "id": "Message to send to that vendor's email", // String
  "email": "Vendor's email" // String
}
```

## User Route

### User Data Object
```json
{
  "_id": "MongoDB Document _id", // Object._id
  "username": "Username specific to the user's auth0 or google account", // String
  "email": "Email specific to the user's account", // String
  "admin": "Attribute describing user's admin status", // Boolean
  "adminAuthId": "Authentication token for administrators", // String
  "adminPassword": "Password for admin authentication", // String
  "createdAt": "2024-03-05T19:03:23.291Z", // Date object in ISO8601 format
  "updatedAt": "2024-03-05T19:03:23.291Z" // Date object in ISO8601 format
}
```

### Get User

#### Description
Get all users

#### Endpoint
`GET https://wlba-project.vercel.app/api/user`

#### Headers
- `token`: A JWT token containing administrator's authorization token and database identifier.

#### Data Unit Returned
Returns the best macthing user's information in the following format:
```json
{
  "_id": "MongoDB Document _id", // String
  "username": "Username specific to the user's auth0 or google account", // String
  "email": "Email specific to the user's account", // String
  "admin": "Attribute describing user's admin status" // Boolean
}
```

### Post User

#### Description
Upon sign in, either register any new users in the database if they don't already exist or return existing user with same username/email.

#### Endpoint 
`POST https://wlba-project.vercel.app/api/user`

#### Request Body
```json
{
  "username": "Username specific to the user's auth0 or google account.", //String
  "email": "Email specific to the user's account" //String
}
```

#### Data Unit Returned
If a user with that Username and Email didn't already exist:
```json
{
  "_id": "MongoDB Document _id", // String
  "username": "New user's username", // String
  "email": "Email specific to the user's account", // String
  "admin": "Attribute describing user's admin status" // Boolean
}
```

If a user already existed:
```json
{
  "_id": "MongoDB Document _id", // String
  "username": "Username specific to the user's auth0 or google account", // String
  "email": "Email specific to the user's account", // String
  "admin": "Attribute describing user's admin status" // Boolean
}
```

### Edit User

#### Description
Edit existing registered users. 

#### Endpoint
`PUT https://wlba-project.vercel.app/api/user`

#### Query Parameters 
- `userId`: Database identifier of user to edit.

#### Request Body
It is not required to input an updated value for every asset, however, un-updated fields must contain the original value.
```json
{
  "username": "Username specific to the user's auth0 or google account, either a new value or the original value", //String
  "email": "Email specific to the user's account, either a new value or the original value" //String
}
```

#### Data Unit Returned
```json
{
  "_id": "MongoDB Document _id", // String
  "username": "Updated username", // String
  "email": "Updated email", // String
  "admin": "Attribute describing user's admin status" // Boolean
}
```

### Delete User

#### Description
Deletes an user document.

#### Endpoint
`DELETE https://wlba-project.vercel.app/api/user`

#### Query Parameters
- `deleteId`: Database identifier of user to delete.

#### Headers
- `token`: A JWT token containing administrator's authorization token and database identifier.

### User Account

#### Description
Fetches an authenticated user's account by their email. Since this route is unprotected, it is best kept secret.

#### Endpoint
`GET https://wlba-project.vercel.app/api/user/account`

#### Query Parameters
- `Email`: User's email. Usually sent without the sign and domain extensions.

#### Data Unit Returned
```json
{
  "_id": "MongoDB Document _id", // String
  "username": "Updated username", // String
  "email": "Updated email", // String
  "admin": "Attribute describing user's admin status" // Boolean
}
```

### Admin Sign In

#### Description
Validates admin credentials and returns a corresponding admin object.

#### Endpoint
`GET https://wlba-project.vercel.app/api/admin`

#### Query Parameters
- `userId`: Database Identifier of user logging in as admin.
- `username`: Username of the admin logging in.
- `password`: Admin password related to the admin account.

#### Data Unit Returned
```json
{
  "adminAuthId": "Hashed administrator token" // String
}
```

#### Response Cookies
- `token`: A JWT token containing administrator's authorization token and database identifier.

### Post Admin

#### Description
Register a user as an admin

#### Endpoint
`POST https://wlba-project.vercel.app/api/admin`

#### Headers
- `token`: A JWT token containing administrator's authorization token and database identifier.

#### Request Body
```json
{
  "id": "MongoDB User _id of the account which is to be made an admin", // Object._id
  "password": "New password for the user" // String
}
```

#### Data Unit Returned
```json
{
  "_id": "MongoDB Document _id", // Object._id
  "username": "Username of the admin", // String
  "email": "Email of the admin", // String
  "admin": "Admin status of the admin", // String
  "adminAuthId": "New admin or existing admin's hashed token" // String
}
```

### Delete Admin

#### Description
Remove a user's admin status.

#### Endpoint
`DELETE https://wlba-project.vercel.app/api/admin`

#### Query Parameters
- `deleteId`: Database identifier of user who's admin status to delete.

#### Headers
- `token`: A JWT token containing administrator's authorization token and database identifier.

## Admin password recovery
NOTE: Recovery POST Requests are the only POST requests that don't return a data unit. This is done to keep the recovery system as secure as possible.

### Create recovery token

#### Description
Creates a valid token for password recovery for administrators and sends it to their email for recovery. Only one token can exist at a time for one user. The token will be set to expire in one day.

#### Endpoint 
`POST https://wlba-project.vercel.app/api/admin/recovery`

#### Query Parameters
- `userId`: Database identifier of the user trying to recover password. Must correspond to an administrator user.

### Confirm password recovery

#### Description
Authenticate administrator's attempt at recovering password. Validates provided token with existing token in the database.

#### Endpoint
`POST https://wlba-project.vercel.app/api/admin/recovery/confirm`

#### Query Parameters
- `userId`: Database identifier of the user trying to recover password. Must correspond to an administrator user.

#### Request Body
```json
{
  "newPassword": "Admin's new password", // String
  "token": "The token that the administrator received in their email" // String
}
```

## Contact Routes

### Contact CACNA

#### Description
Sends an email to the CACNA organization when called. Used in the contact us page to send user messages to CACNA.

#### Endpoint
`POST https://wlba-project.vercel.app/api/contact`

#### Request Body
```json
{
  "name": "Contacter's name", // String
  "email": "Contacter's email", // String
  "referralSource": "How did you hear about us?", // String
  "message": "Email body" // Sting
}
```

#### Data Unit Returned
Success string from nodemail.
`250 2.0.0 OK  1707455489 l20-20020a170902d05400b001d8f12b0009sm629494pll.293 - gsmtp`

### Contact Volunteer

#### Description
Sends an email to a specific volunteer from the volunteers database.

#### Endpoint
`POST https://wlba-project.vercel.app/api/contact/volunteer`

#### Headers
- `token`: A JWT token containing administrator's authorization token and database identifier.

#### Request Body
```json
{
  "name": "Contacter's name", // String
  "email": "Contacter's email", // String
  "referralSource": "", // String
  "message": "Email body" // Sting
}
```

#### Data Unit Returned
Success string from nodemail.
`250 2.0.0 OK  1707455489 l20-20020a170902d05400b001d8f12b0009sm629494pll.293 - gsmtp`