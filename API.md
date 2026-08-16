# VRAP API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## Authentication Endpoints

### POST /auth/signup
Register a new user with email and password.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@college.edu",
  "password": "SecurePass@123",
  "confirmPassword": "SecurePass@123",
  "designation": "Student",
  "studentId": "STU001",
  "department": "Computer Science"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered. OTP sent to email.",
  "data": {
    "userId": "user_id",
    "email": "john@college.edu"
  }
}
```

### POST /auth/verify-otp
Verify email with OTP.

**Request Body:**
```json
{
  "email": "john@college.edu",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "token": "jwt_token",
    "user": { /* user data */ }
  }
}
```

### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@college.edu",
  "password": "SecurePass@123",
  "rememberMe": false
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token",
    "refreshToken": "refresh_token",
    "user": { /* user data */ }
  }
}
```

---

## Venue Endpoints

### GET /venues
Get all venues with optional filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `building` (string): Filter by building ID
- `capacity` (number): Minimum capacity
- `type` (string): Venue type filter
- `status` (string): Available, Unavailable, Maintenance

**Response (200):**
```json
{
  "success": true,
  "data": {
    "venues": [ /* venues array */ ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

### POST /venues
Create a new venue (Admin only).

**Request Body:**
```json
{
  "name": "Lecture Theatre - LT101",
  "code": "LT-101",
  "building": "building_id",
  "floor": 1,
  "capacity": 150,
  "type": "Lecture Theatre",
  "description": "Large lecture hall",
  "facilities": ["AC", "Projector", "SmartBoard"],
  "status": "Available"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Venue created successfully",
  "data": { /* venue object */ }
}
```

### GET /venues/:id
Get venue details.

**Response (200):**
```json
{
  "success": true,
  "data": { /* venue object with full details */ }
}
```

### PUT /venues/:id
Update venue (Admin only).

**Request Body:** Same as POST /venues

**Response (200):**
```json
{
  "success": true,
  "message": "Venue updated successfully",
  "data": { /* updated venue */ }
}
```

### DELETE /venues/:id
Delete venue (Admin only).

**Response (200):**
```json
{
  "success": true,
  "message": "Venue deleted successfully"
}
```

---

## Venue Request Endpoints

### GET /requests
Get all requests (paginated, role-based filtering).

**Query Parameters:**
- `page` (number): Page number
- `status` (string): Pending, Approved, Rejected, Cancelled, Expired
- `venueId` (string): Filter by venue
- `dateStart` (ISO date): Start date filter

**Response (200):**
```json
{
  "success": true,
  "data": {
    "requests": [ /* requests array */ ],
    "pagination": { /* pagination info */ }
  }
}
```

### POST /requests
Create a new venue request.

**Request Body:**
```json
{
  "eventName": "Tech Conference 2025",
  "purpose": "Annual tech conference",
  "organizer": "CSE Department",
  "department": "Computer Science",
  "expectedParticipants": 200,
  "chiefGuest": "Dr. John Smith",
  "dateStart": "2025-03-15",
  "dateEnd": "2025-03-15",
  "startTime": "09:00",
  "endTime": "17:00",
  "venueId": "venue_id",
  "requirements": ["Projector", "WiFi", "Sound System"],
  "remarks": "Special seating arrangement needed",
  "attachments": []
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Request created successfully",
  "data": {
    "requestId": "REQ001",
    "status": "Pending",
    /* rest of request data */
  }
}
```

### GET /requests/:id
Get request details.

**Response (200):**
```json
{
  "success": true,
  "data": { /* complete request object */ }
}
```

### POST /requests/:id/approve
Approve a request (Authority only).

**Request Body:**
```json
{
  "note": "Approved with special arrangements"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Request approved",
  "data": { /* updated request */ }
}
```

### POST /requests/:id/reject
Reject a request (Authority only).

**Request Body:**
```json
{
  "reason": "Date conflict with another event"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Request rejected",
  "data": { /* updated request */ }
}
```

---

## Calendar Endpoints

### GET /calendar/events
Get calendar events with filtering.

**Query Parameters:**
- `startDate` (ISO date): Start of range
- `endDate` (ISO date): End of range
- `venueId` (string): Filter by venue
- `status` (string): Event status filter

**Response (200):**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "event_id",
        "title": "Event Name",
        "start": "2025-03-15T09:00:00Z",
        "end": "2025-03-15T17:00:00Z",
        "resource": { "venueId": "...", "status": "Approved" }
      }
    ]
  }
}
```

---

## Analytics Endpoints

### GET /analytics/dashboard
Get role-based analytics data.

**Query Parameters:**
- `role` (string): Admin, Authority, User

**Response (200):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalVenues": 45,
      "totalUsers": 2300,
      "pendingRequests": 15,
      "approvedToday": 8
    },
    "charts": {
      "monthlyTrend": [ /* data points */ ],
      "departmentWise": [ /* data points */ ]
    }
  }
}
```

---

## Notification Endpoints

### GET /notifications
Get user notifications.

**Query Parameters:**
- `page` (number): Page number
- `read` (boolean): Filter read/unread
- `type` (string): Notification type

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notifications": [ /* notifications */ ],
    "unreadCount": 5
  }
}
```

### PUT /notifications/:id
Mark notification as read.

**Request Body:**
```json
{
  "read": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Notification updated"
}
```

---

## Search Endpoints

### GET /search
Global search across all resources.

**Query Parameters:**
- `q` (string): Search query (min. 2 characters)
- `type` (string): venue, user, request, department

**Response (200):**
```json
{
  "success": true,
  "data": {
    "venues": [ /* matching venues */ ],
    "users": [ /* matching users */ ],
    "requests": [ /* matching requests */ ],
    "departments": [ /* matching departments */ ]
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Common Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict (e.g., duplicate email)
- `422`: Unprocessable Entity (validation error)
- `429`: Too Many Requests (rate limited)
- `500`: Server Error

---

## Rate Limiting

API is rate limited to prevent abuse:
- **General**: 100 requests per minute per IP
- **Auth**: 10 requests per minute (signup, login)
- **Create/Update**: 50 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

---

## Webhook Events

The system triggers webhooks for important events:

- `request.created`: When a new request is created
- `request.approved`: When a request is approved
- `request.rejected`: When a request is rejected
- `request.expired`: When a request expires

Configure webhook URL in settings.

---

## Examples

### cURL Example
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@college.edu",
    "password": "SecurePass@123"
  }'
```

### JavaScript/Fetch Example
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@college.edu',
    password: 'SecurePass@123'
  })
});

const data = await response.json();
console.log(data);
```

---

## Support

For API issues or questions, contact: dev@college.edu
