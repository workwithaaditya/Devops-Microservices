# Microservices Architecture Overview

Detailed explanation of the Phase 1 architecture and design decisions.

## Table of Contents

1. [Architecture Principles](#architecture-principles)
2. [Service Boundaries](#service-boundaries)
3. [Communication Patterns](#communication-patterns)
4. [Data Management](#data-management)
5. [Authentication & Authorization](#authentication--authorization)
6. [Design Decisions](#design-decisions)
7. [Trade-offs](#trade-offs)

---

## Architecture Principles

### 1. Single Responsibility

Each service has a clear, focused purpose:
- **Auth Service**: Only authentication concerns
- **Post Service**: Only post management
- **Gateway**: Only request routing

### 2. Independence

Services are:
- Independently deployable
- Use separate databases
- Have their own dependencies
- Can be developed by different teams

### 3. Loose Coupling

Services communicate via HTTP REST APIs, not direct database access.

### 4. API Gateway Pattern

Single entry point (Gateway) for all client requests:
- Simplifies client code
- Centralized cross-cutting concerns (future: rate limiting, logging)
- Easier to manage API versioning

---

## Service Boundaries

### Auth Service

```
┌─────────────────────────────────┐
│       Auth Service              │
│                                 │
│  Responsibilities:              │
│  • User registration            │
│  • User authentication          │
│  • Password hashing             │
│  • JWT token generation         │
│  • Token verification           │
│                                 │
│  Database:                      │
│  • Users table                  │
│    - id, email, username        │
│    - password (hashed)          │
│    - timestamps                 │
└─────────────────────────────────┘
```

**Why separate Auth Service?**
- Authentication is a cross-cutting concern
- Centralized user management
- Easy to add OAuth, 2FA later
- Can scale independently

### Post Service

```
┌─────────────────────────────────┐
│       Post Service              │
│                                 │
│  Responsibilities:              │
│  • Create posts                 │
│  • Retrieve posts (feed)        │
│  • Post validation              │
│  • Token verification via Auth  │
│                                 │
│  Database:                      │
│  • Posts table                  │
│    - id, content                │
│    - userId, username           │
│    - timestamps                 │
└─────────────────────────────────┘
```

**Why separate Post Service?**
- Posts are a core domain entity
- Can scale independently (high write volume)
- Easy to add features (likes, comments) later
- Isolation from auth logic

### Gateway

```
┌─────────────────────────────────┐
│         Gateway                 │
│                                 │
│  Responsibilities:              │
│  • Route /auth/* → Auth Service │
│  • Route /posts → Post Service  │
│  • Forward headers & body       │
│  • Return responses             │
│                                 │
│  NO Database                    │
│  NO Business Logic              │
└─────────────────────────────────┘
```

**Why API Gateway?**
- Single entry point for clients
- Clients don't need to know service locations
- Future: rate limiting, caching, logging
- Simpler frontend code

---

## Communication Patterns

### 1. Frontend → Gateway

**Protocol:** HTTP/REST

**Example:**
```
Frontend                Gateway
   |                       |
   |--- POST /api/posts ---|
   |    Authorization:     |
   |    Bearer <token>     |
   |                       |
   |<-- 201 Created -------|
```

### 2. Gateway → Services

**Protocol:** HTTP/REST (synchronous)

**Example:**
```
Gateway              Post Service
   |                      |
   |- POST /api/posts ----|
   |  Authorization:      |
   |  Bearer <token>      |
   |                      |
   |<- 201 Created -------|
```

### 3. Service → Service

**Protocol:** HTTP/REST

**Example: Post Service verifies token**
```
Post Service         Auth Service
     |                    |
     |- POST /api/verify -|
     |  { token: ... }    |
     |                    |
     |<- { valid: true }--|
```

**Why HTTP for inter-service communication?**
- Simple and widely understood
- Easy to debug
- No additional infrastructure needed
- Future: Can replace with message queues if needed

---

## Data Management

### Database per Service Pattern

```
┌─────────────┐         ┌─────────────┐
│  auth_db    │         │  post_db    │
│             │         │             │
│ ┌─────────┐ │         │ ┌─────────┐ │
│ │  users  │ │         │ │  posts  │ │
│ └─────────┘ │         │ └─────────┘ │
└─────────────┘         └─────────────┘
       ↑                       ↑
       │                       │
  Auth Service            Post Service
```

**Key Principle:** Each service owns its database exclusively.

### Data Duplication (Denormalization)

Posts table stores `userId` AND `username`:

```sql
-- Post Service database
CREATE TABLE posts (
  id        UUID PRIMARY KEY,
  content   TEXT,
  userId    UUID,        -- Reference to user (no FK)
  username  VARCHAR,     -- Denormalized!
  ...
);
```

**Why denormalize?**
- Avoid cross-service joins
- Improve read performance (no need to call Auth Service)
- Post Service doesn't need Auth Service to display posts

**Trade-off:**
- If username changes, posts keep old username
- Solution (Phase 2): Event-driven updates

### No Foreign Keys Across Services

```sql
-- ❌ DON'T DO THIS (violates microservices principles)
CREATE TABLE posts (
  userId UUID REFERENCES auth_db.users(id)  -- Cross-database FK
);

-- ✅ DO THIS
CREATE TABLE posts (
  userId UUID  -- Just store the ID, no FK constraint
);
```

**Why no foreign keys?**
- Services must be independently deployable
- Can't enforce FK across databases
- Services can use different databases entirely

---

## Authentication & Authorization

### JWT-Based Authentication

```
┌─────────────────────────────────────────────────┐
│  JWT Token Structure                            │
│                                                 │
│  Header:                                        │
│  { "alg": "HS256", "typ": "JWT" }              │
│                                                 │
│  Payload:                                       │
│  {                                              │
│    "userId": "uuid",                            │
│    "email": "user@example.com",                 │
│    "username": "johndoe",                       │
│    "iat": 1704711600,                           │
│    "exp": 1705316400                            │
│  }                                              │
│                                                 │
│  Signature: HMACSHA256(header + payload)        │
└─────────────────────────────────────────────────┘
```

### Authentication Flow

```
1. User signs up/logs in
   ↓
2. Auth Service generates JWT token
   ↓
3. Frontend stores token (localStorage)
   ↓
4. Frontend sends token with protected requests
   ↓
5. Gateway forwards token to service
   ↓
6. Service verifies token with Auth Service
   ↓
7. Service processes request
```

### Why JWT?

**Pros:**
- Stateless (no session storage needed)
- Contains user info (no DB lookup)
- Cross-domain friendly
- Scalable

**Cons:**
- Can't revoke before expiry (Phase 2: add refresh tokens)
- Larger than session IDs
- Need to protect secret key

---

## Design Decisions

### 1. Why Next.js for Backend?

**Pros:**
- Familiar for frontend developers
- Fast development
- Built-in API routes
- TypeScript support
- Easy deployment (Vercel)

**Cons:**
- Not traditional for microservices
- Alternative: Express.js, NestJS, FastAPI

**Decision:** Good for learning; can migrate later

### 2. Why Prisma?

**Pros:**
- Type-safe database access
- Great developer experience
- Automatic migrations
- Built-in query builder

**Cons:**
- Adds abstraction layer
- Alternative: TypeORM, raw SQL

**Decision:** Excellent for beginners learning databases

### 3. Why PostgreSQL?

**Pros:**
- Robust and mature
- ACID compliance
- Good performance
- Free and open-source

**Cons:**
- Requires separate installation
- Alternative: MongoDB, MySQL, SQLite

**Decision:** Industry standard for relational data

### 4. Synchronous vs Asynchronous Communication

**Current (Phase 1):** Synchronous HTTP

**Future (Phase 2+):** Asynchronous messaging

```
Synchronous (now):
Frontend → Gateway → Service → Response

Asynchronous (future):
Service → Message Queue → Other Services
```

**Why synchronous for now?**
- Simpler to understand
- Easier to debug
- No additional infrastructure (no RabbitMQ, Kafka)

---

## Trade-offs

### 1. Microservices vs Monolith

**We chose Microservices:**

✅ **Pros:**
- Learn modern architecture
- Independent scaling
- Technology flexibility
- Clear boundaries

❌ **Cons:**
- More complex than monolith
- Network latency
- Distributed debugging
- More infrastructure

**Verdict:** Worth it for learning experience

### 2. Denormalization

**We store username in posts:**

✅ **Pros:**
- Fast reads (no cross-service call)
- Post Service independence

❌ **Cons:**
- Data duplication
- Eventual consistency issues

**Verdict:** Acceptable for Phase 1; add event-driven updates later

### 3. Gateway Pattern

**We use API Gateway:**

✅ **Pros:**
- Single client endpoint
- Easy to add middleware
- Hides internal structure

❌ **Cons:**
- Single point of failure
- Potential bottleneck

**Verdict:** Standard pattern; benefits outweigh costs

---

## Future Enhancements (Phase 2+)

### 1. Service Discovery

Current: Hardcoded URLs
Future: Consul, Eureka

### 2. Message Queues

Current: Synchronous HTTP
Future: RabbitMQ, Kafka for async events

### 3. Caching

Current: None
Future: Redis for frequently accessed data

### 4. Database Replication

Current: Single database instances
Future: Read replicas for scaling

### 5. Event-Driven Updates

Current: Denormalized data never updates
Future: Publish/subscribe for data consistency

Example:
```
Auth Service: User changes username
    ↓
Publish "UserUpdated" event
    ↓
Post Service: Update username in all posts
```

---

## Key Takeaways

1. **Service Independence**: Each service can be developed, deployed, and scaled independently

2. **Database Isolation**: No shared databases; services communicate via APIs

3. **Clear Boundaries**: Each service has a single, well-defined responsibility

4. **Trade-offs Are OK**: Denormalization, eventual consistency are acceptable

5. **Start Simple**: HTTP/REST is fine for Phase 1; can add complexity later

6. **Gateway Pattern**: Simplifies client-side code and provides flexibility

7. **JWT Authentication**: Stateless, scalable authentication across services

---

## Conclusion

This Phase 1 architecture demonstrates core microservices principles while remaining simple and learnable. The design can be extended incrementally in future phases without major rewrites.

Focus on understanding these patterns now; optimization comes later.
