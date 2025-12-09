# MindTrace API Documentation

Complete API reference for MindTrace backend services.

**Base URL**: `http://localhost:8000` (development)

**API Version**: 1.0.0

**Authentication**: JWT Bearer Token (for protected endpoints)

---

## Table of Contents

- [Authentication](#authentication)
- [Face Recognition](#face-recognition)
- [Speech-to-Text](#speech-to-text)
- [AI Services](#ai-services)
- [Contacts](#contacts)
- [Interactions](#interactions)
- [Reminders](#reminders)
- [SOS](#sos)
- [Statistics](#statistics)
- [Search](#search)
- [User Management](#user-management)

---

## Authentication

### Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Login

**POST** `/auth/login`

Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Get Current User

**GET** `/auth/me`

Get authenticated user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

## Face Recognition

### Recognize Faces

**POST** `/face/recognize`

Detect and recognize faces in an image.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
```
image: [binary image file]
user_id: 1
```

**Response:** `200 OK`
```json
{
  "faces": [
    {
      "name": "John Doe",
      "relation": "Friend",
      "confidence": 0.87,
      "bbox": [100, 150, 300, 400],
      "det_score": 0.95,
      "contact_id": 123
    },
    {
      "name": "Unknown",
      "relation": "Unidentified Person",
      "confidence": 0.0,
      "bbox": [400, 200, 600, 500],
      "det_score": 0.92
    }
  ],
  "processing_time_ms": 85
}
```

### Sync Face Embeddings

**POST** `/face/sync`

Generate face embeddings from contact profile photos.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "user_id": 1
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 15,
  "message": "Successfully synced 15 face embeddings"
}
```

---

## Speech-to-Text

### Stream Audio (WebSocket)

**WebSocket** `/asr/stream`

Real-time audio transcription via WebSocket.

**Connection:**
```javascript
const ws = new WebSocket('ws://localhost:8000/asr/stream');
```

**Send Message:**
```json
{
  "audio": "base64_encoded_audio_chunk",
  "user_id": 1,
  "contact_name": "John Doe",
  "sample_rate": 16000
}
```

**Receive Message:**
```json
{
  "transcript": "Hello, how are you doing today?",
  "is_final": true,
  "confidence": 0.95
}
```

### Get Conversation History

**GET** `/asr/conversations`

Retrieve stored conversation transcripts.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `user_id` (required): User ID
- `contact_name` (optional): Filter by contact
- `start_date` (optional): ISO 8601 date
- `end_date` (optional): ISO 8601 date
- `limit` (optional): Max results (default: 50)

**Response:** `200 OK`
```json
{
  "conversations": [
    {
      "id": "conv_123",
      "user_id": 1,
      "contact_name": "John Doe",
      "transcript": "Full conversation transcript...",
      "start_time": "2024-01-01T10:00:00Z",
      "end_time": "2024-01-01T10:15:00Z",
      "duration_seconds": 900
    }
  ],
  "total": 25
}
```

---


## AI Services

### Summarize Interactions

**POST** `/ai/summarize`

Generate AI-powered summary of interactions.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "user_id": 1,
  "summary_type": "brief",
  "days": 7,
  "contact_id": 123,
  "focus_areas": ["health", "family"]
}
```

**Parameters:**
- `summary_type`: "brief", "detailed", or "analytical"
- `days`: Number of days to include (optional)
- `contact_id`: Filter by specific contact (optional)
- `focus_areas`: Topics to emphasize (optional)

**Response:** `200 OK`
```json
{
  "summary": "Over the past week, you had 5 interactions with John Doe. The main topics discussed were health concerns and family updates. You talked about scheduling a doctor's appointment and planning a family gathering...",
  "interaction_count": 5,
  "time_period": {
    "start": "2024-01-01T00:00:00Z",
    "end": "2024-01-07T23:59:59Z",
    "days": 7
  },
  "summary_type": "brief",
  "focus_areas": ["health", "family"]
}
```

### RAG Query

**POST** `/ai/rag/query`

Ask questions about interaction history using RAG.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "question": "What did I discuss with Sarah last week?",
  "user_id": 1,
  "n_results": 10,
  "include_context": true
}
```

**Response:** `200 OK`
```json
{
  "answer": "Last week, you discussed the upcoming project deadline with Sarah. She mentioned concerns about the timeline and suggested having a team meeting to reallocate resources...",
  "sources": [
    {
      "interaction_id": 456,
      "contact_name": "Sarah",
      "timestamp": "2024-01-05T14:30:00Z",
      "relevance_score": 0.92,
      "snippet": "We talked about the upcoming project deadline..."
    }
  ],
  "retrieved_count": 5,
  "question": "What did I discuss with Sarah last week?",
  "used_contacts": true,
  "used_stats": false
}
```

### Multi-turn RAG Query

**POST** `/ai/rag/multi-turn`

Continue conversation with context from previous turns.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "question": "What about her family?",
  "user_id": 1,
  "conversation_history": [
    {
      "question": "What did I discuss with Sarah?",
      "answer": "You discussed work projects and deadlines..."
    }
  ],
  "n_results": 5
}
```

**Response:** `200 OK`
```json
{
  "answer": "Regarding Sarah's family, you asked about her daughter's college applications. Sarah mentioned her daughter is applying to engineering programs...",
  "sources": [...],
  "retrieved_count": 3
}
```

### Generate Insights

**POST** `/ai/insights`

Generate behavioral insights and patterns.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "user_id": 1,
  "topic": "health"
}
```

**Response:** `200 OK`
```json
{
  "insights": "Your health-related interactions show a consistent pattern of weekly check-ins with Dr. Smith. You've discussed blood pressure management 3 times this month. Key recommendations: 1. Continue weekly monitoring. 2. Consider scheduling the follow-up appointment mentioned on Jan 5...",
  "topic": "health",
  "analyzed_interactions": 30,
  "total_contacts": 15,
  "total_interactions": 150
}
```

---

## Contacts

### List Contacts

**GET** `/contacts`

Get all contacts for authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `search` (optional): Search by name
- `relationship` (optional): Filter by relationship type
- `limit` (optional): Max results (default: 100)
- `offset` (optional): Pagination offset

**Response:** `200 OK`
```json
{
  "contacts": [
    {
      "id": 1,
      "user_id": 1,
      "name": "John Doe",
      "relationship": "friend",
      "relationship_detail": "College friend",
      "phone_number": "+1234567890",
      "email": "john@example.com",
      "notes": "Met at university in 2015",
      "visit_frequency": "weekly",
      "last_seen": "2024-01-05T14:30:00Z",
      "profile_photo_url": "/api/contacts/1/photo",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-05T14:30:00Z"
    }
  ],
  "total": 25,
  "limit": 100,
  "offset": 0
}
```

### Get Contact

**GET** `/contacts/{contact_id}`

Get specific contact details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "user_id": 1,
  "name": "John Doe",
  "relationship": "friend",
  "relationship_detail": "College friend",
  "phone_number": "+1234567890",
  "email": "john@example.com",
  "notes": "Met at university in 2015",
  "visit_frequency": "weekly",
  "last_seen": "2024-01-05T14:30:00Z",
  "profile_photo_url": "/api/contacts/1/photo",
  "interaction_count": 45,
  "last_interaction": "2024-01-05T14:30:00Z"
}
```

### Create Contact

**POST** `/contacts`

Create a new contact with optional profile photo.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
```
name: "Jane Smith"
relationship: "family"
relationship_detail: "Sister"
phone_number: "+1234567890"
email: "jane@example.com"
notes: "Lives in Seattle"
visit_frequency: "monthly"
profile_photo: [binary image file]
```

**Response:** `201 Created`
```json
{
  "id": 2,
  "user_id": 1,
  "name": "Jane Smith",
  "relationship": "family",
  "relationship_detail": "Sister",
  "phone_number": "+1234567890",
  "email": "jane@example.com",
  "notes": "Lives in Seattle",
  "visit_frequency": "monthly",
  "profile_photo_url": "/api/contacts/2/photo",
  "created_at": "2024-01-06T10:00:00Z"
}
```

### Update Contact

**PUT** `/contacts/{contact_id}`

Update contact information.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
```
name: "Jane Smith-Johnson"
phone_number: "+1234567891"
notes: "Lives in Portland now"
profile_photo: [binary image file] (optional)
```

**Response:** `200 OK`
```json
{
  "id": 2,
  "name": "Jane Smith-Johnson",
  "phone_number": "+1234567891",
  "notes": "Lives in Portland now",
  "updated_at": "2024-01-07T15:00:00Z"
}
```

### Delete Contact

**DELETE** `/contacts/{contact_id}`

Delete a contact and associated data.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `204 No Content`

### Get Contact Photo

**GET** `/contacts/{contact_id}/photo`

Retrieve contact profile photo.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```
Content-Type: image/jpeg
[binary image data]
```

---


## Interactions

### List Interactions

**GET** `/interactions`

Get interaction history with filters.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `user_id` (required): User ID
- `contact_id` (optional): Filter by contact
- `start_date` (optional): ISO 8601 date
- `end_date` (optional): ISO 8601 date
- `limit` (optional): Max results (default: 50)
- `offset` (optional): Pagination offset

**Response:** `200 OK`
```json
{
  "interactions": [
    {
      "id": 1,
      "user_id": 1,
      "contact_id": 123,
      "contact_name": "John Doe",
      "summary": "Discussed project timeline and deliverables",
      "full_details": "We talked about the Q1 project timeline...",
      "key_topics": ["work", "deadlines", "team"],
      "location": "Office",
      "timestamp": "2024-01-05T14:30:00Z",
      "duration_minutes": 30,
      "created_at": "2024-01-05T15:00:00Z"
    }
  ],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

### Get Interaction

**GET** `/interactions/{interaction_id}`

Get specific interaction details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "user_id": 1,
  "contact_id": 123,
  "contact_name": "John Doe",
  "summary": "Discussed project timeline",
  "full_details": "Full conversation details...",
  "key_topics": ["work", "deadlines"],
  "location": "Office",
  "timestamp": "2024-01-05T14:30:00Z",
  "duration_minutes": 30,
  "transcript": "Full transcript if available...",
  "created_at": "2024-01-05T15:00:00Z"
}
```

### Create Interaction

**POST** `/interactions`

Record a new interaction.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "user_id": 1,
  "contact_id": 123,
  "contact_name": "John Doe",
  "summary": "Discussed project timeline",
  "full_details": "We talked about Q1 deliverables...",
  "key_topics": ["work", "deadlines"],
  "location": "Office",
  "timestamp": "2024-01-05T14:30:00Z",
  "duration_minutes": 30
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "user_id": 1,
  "contact_id": 123,
  "contact_name": "John Doe",
  "summary": "Discussed project timeline",
  "timestamp": "2024-01-05T14:30:00Z",
  "created_at": "2024-01-05T15:00:00Z"
}
```

### Update Interaction

**PUT** `/interactions/{interaction_id}`

Update interaction details.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "summary": "Updated summary",
  "full_details": "Updated details...",
  "key_topics": ["work", "deadlines", "budget"]
}
```

**Response:** `200 OK`

### Delete Interaction

**DELETE** `/interactions/{interaction_id}`

Delete an interaction record.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `204 No Content`

---

## Reminders

### List Reminders

**GET** `/reminders`

Get all reminders for user.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `user_id` (required): User ID
- `type` (optional): Filter by type (medication, meal, activity)
- `status` (optional): Filter by status (active, completed, snoozed)

**Response:** `200 OK`
```json
{
  "reminders": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Take blood pressure medication",
      "description": "Take 1 pill with water",
      "type": "medication",
      "scheduled_time": "08:00:00",
      "days_of_week": [1, 2, 3, 4, 5],
      "is_active": true,
      "last_completed": "2024-01-05T08:00:00Z",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 10
}
```

### Create Reminder

**POST** `/reminders`

Create a new reminder.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "user_id": 1,
  "title": "Take medication",
  "description": "Blood pressure pill",
  "type": "medication",
  "scheduled_time": "08:00:00",
  "days_of_week": [1, 2, 3, 4, 5],
  "is_active": true
}
```

**Response:** `201 Created`

### Update Reminder

**PUT** `/reminders/{reminder_id}`

Update reminder details.

**Response:** `200 OK`

### Delete Reminder

**DELETE** `/reminders/{reminder_id}`

Delete a reminder.

**Response:** `204 No Content`

### Complete Reminder

**POST** `/reminders/{reminder_id}/complete`

Mark reminder as completed.

**Response:** `200 OK`
```json
{
  "id": 1,
  "status": "completed",
  "completed_at": "2024-01-06T08:05:00Z"
}
```

---

## SOS

### Trigger SOS Alert

**POST** `/sos/alert`

Send emergency SOS alert.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "user_id": 1,
  "location": {
    "latitude": 47.6062,
    "longitude": -122.3321
  },
  "message": "Emergency assistance needed",
  "contact_ids": [1, 2, 3]
}
```

**Response:** `201 Created`
```json
{
  "alert_id": "sos_123",
  "status": "sent",
  "notified_contacts": 3,
  "timestamp": "2024-01-06T15:30:00Z"
}
```

### Get SOS History

**GET** `/sos/history`

Retrieve SOS alert history.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "alerts": [
    {
      "id": "sos_123",
      "user_id": 1,
      "location": {
        "latitude": 47.6062,
        "longitude": -122.3321
      },
      "message": "Emergency assistance needed",
      "status": "resolved",
      "timestamp": "2024-01-06T15:30:00Z",
      "resolved_at": "2024-01-06T16:00:00Z"
    }
  ]
}
```

---

## Statistics

### Dashboard Stats

**GET** `/stats/dashboard`

Get comprehensive dashboard statistics.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `user_id` (required): User ID

**Response:** `200 OK`
```json
{
  "total_contacts": 25,
  "total_interactions": 150,
  "interactions_today": 3,
  "interactions_this_week": 12,
  "interactions_this_month": 45,
  "top_contacts": [
    {
      "contact_id": 123,
      "name": "John Doe",
      "interaction_count": 20,
      "last_interaction": "2024-01-05T14:30:00Z"
    }
  ],
  "recent_interactions": [...],
  "interaction_trend": [
    {
      "date": "2024-01-01",
      "count": 5
    }
  ],
  "reminders_pending": 3,
  "reminders_completed_today": 2
}
```

### Interaction Analytics

**GET** `/stats/interactions`

Get detailed interaction analytics.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `user_id` (required): User ID
- `start_date` (optional): ISO 8601 date
- `end_date` (optional): ISO 8601 date

**Response:** `200 OK`
```json
{
  "total_interactions": 150,
  "average_per_day": 5.2,
  "by_contact": [...],
  "by_topic": {
    "work": 45,
    "family": 30,
    "health": 25
  },
  "by_day_of_week": {
    "Monday": 25,
    "Tuesday": 22
  },
  "by_hour": {
    "09:00": 15,
    "14:00": 20
  }
}
```

---

## Search

### Semantic Search

**POST** `/search/semantic`

Search interactions using semantic similarity.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "query": "health discussions",
  "user_id": 1,
  "n_results": 10,
  "filters": {
    "contact_id": 123,
    "start_date": "2024-01-01",
    "end_date": "2024-01-31"
  }
}
```

**Response:** `200 OK`
```json
{
  "results": [
    {
      "interaction_id": 123,
      "contact_name": "Dr. Smith",
      "timestamp": "2024-01-03T10:00:00Z",
      "content": "Discussed blood pressure management...",
      "relevance_score": 0.89,
      "key_topics": ["health", "medication"]
    }
  ],
  "total": 15,
  "query": "health discussions"
}
```

---

## User Management

### Update Profile

**PUT** `/users/profile`

Update user profile information.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "newemail@example.com",
  "phone": "+1234567890"
}
```

**Response:** `200 OK`

### Change Password

**POST** `/users/change-password`

Change user password.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "current_password": "oldpassword",
  "new_password": "newpassword123"
}
```

**Response:** `200 OK`

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "detail": "Invalid request parameters",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "detail": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "detail": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error",
  "error_id": "err_123456"
}
```

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication**: 5 requests per minute
- **Face Recognition**: 30 requests per minute
- **AI Services**: 10 requests per minute
- **Other endpoints**: 100 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```

---

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `limit`: Number of results per page (default: 50, max: 100)
- `offset`: Number of results to skip

**Response Headers:**
```
X-Total-Count: 150
X-Page-Limit: 50
X-Page-Offset: 0
```

---

## Interactive API Documentation

For interactive API documentation with request/response examples:

**Swagger UI**: `http://localhost:8000/docs`

**ReDoc**: `http://localhost:8000/redoc`

---

## SDK Examples

### Python
```python
import requests

# Login
response = requests.post(
    "http://localhost:8000/auth/login",
    json={"email": "user@example.com", "password": "password"}
)
token = response.json()["access_token"]

# Recognize faces
with open("photo.jpg", "rb") as f:
    response = requests.post(
        "http://localhost:8000/face/recognize",
        headers={"Authorization": f"Bearer {token}"},
        files={"image": f},
        data={"user_id": 1}
    )
faces = response.json()["faces"]
```

### JavaScript
```javascript
// Login
const response = await fetch('http://localhost:8000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password'
  })
});
const { access_token } = await response.json();

// Get contacts
const contacts = await fetch('http://localhost:8000/contacts', {
  headers: { 'Authorization': `Bearer ${access_token}` }
}).then(r => r.json());
```

---

