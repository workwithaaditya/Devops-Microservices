# API Documentation

## Base URLs

- **Frontend**: `http://localhost:3000`
- **Gateway**: `http://localhost:4000`
- **Auth Service**: `http://localhost:4001`
- **Post Service**: `http://localhost:4002`

**Important**: Frontend should ONLY communicate with the Gateway, never directly with services.

---

## Gateway Endpoints

### Authentication

#### POST /api/auth/signup
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

**Error Responses:**
- `400`: Missing required fields or password too short
- `409`: Email or username already exists
- `500`: Server error

---

#### POST /api/auth/login
Authenticate an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

**Error Responses:**
- `400`: Missing email or password
- `401`: Invalid credentials
- `500`: Server error

---

### Posts

#### GET /api/posts
Fetch all posts (feed).

**Headers:**
None required (public endpoint)

**Response (200):**
```json
{
  "posts": [
    {
      "id": "uuid",
      "content": "This is my first post!",
      "userId": "user-uuid",
      "username": "johndoe",
      "createdAt": "2026-02-08T10:30:00.000Z",
      "updatedAt": "2026-02-08T10:30:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `500`: Server error

---

#### POST /api/posts
Create a new post.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "content": "This is my post content"
}
```

**Response (201):**
```json
{
  "message": "Post created successfully",
  "post": {
    "id": "uuid",
    "content": "This is my post content",
    "userId": "user-uuid",
    "username": "johndoe",
    "createdAt": "2026-02-08T10:30:00.000Z",
    "updatedAt": "2026-02-08T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Content is required or exceeds 500 characters
- `401`: Unauthorized (invalid or missing token)
- `500`: Server error

---

## Auth Service Endpoints (Internal)

These are called by the Gateway, not directly by the frontend.

### POST /api/signup
Register a new user.

### POST /api/login
Authenticate a user.

### POST /api/verify
Verify a JWT token.

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "valid": true,
  "user": {
    "userId": "uuid",
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

**Error Response (401):**
```json
{
  "valid": false,
  "error": "Invalid or expired token"
}
```

---

## Post Service Endpoints (Internal)

These are called by the Gateway, not directly by the frontend.

### GET /api/posts
Fetch all posts.

### POST /api/posts
Create a new post (requires Authorization header).

---

## Authentication Flow

1. User signs up or logs in via Gateway
2. Gateway forwards request to Auth Service
3. Auth Service returns JWT token
4. Frontend stores token (localStorage)
5. For protected requests, frontend sends token in Authorization header
6. Gateway forwards token to respective service
7. Service verifies token with Auth Service
8. Service processes request and returns response

---

## Error Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (invalid/missing token)
- `409`: Conflict (duplicate resource)
- `500`: Internal Server Error

---

## Token Format

JWT tokens are sent in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token payload contains:
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "username": "johndoe",
  "iat": 1704711600,
  "exp": 1705316400
}
```

Default expiration: 7 days

---

## Rate Limits

Currently no rate limiting (Phase 1).

Future phases will implement rate limiting per service.

---

## CORS

CORS is configured to allow requests from the frontend origin.

In production, update CORS settings to allow only your frontend domain.

---

## Data Validation

### User Registration
- Email: Valid email format, unique
- Username: 3-50 characters, unique
- Password: Minimum 6 characters

### Post Creation
- Content: Required, 1-500 characters
- Must be authenticated

---

## Testing with cURL

### Signup
```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get Posts
```bash
curl http://localhost:4000/api/posts
```

### Create Post
```bash
curl -X POST http://localhost:4000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"content":"My first post!"}'
```
