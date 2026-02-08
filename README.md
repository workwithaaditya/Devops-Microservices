# Social Media Microservices Application - Phase 1

A **learning-oriented** social media application built with a microservices architecture using Next.js.

## 🎯 Project Overview

This is a **Phase 1** implementation focusing on core functionality:
- User authentication (signup/login)
- Creating and viewing text posts
- Clean microservices architecture

**Future phases will add:** likes, comments, follows, chat, reels, CI/CD, monitoring, etc.

## 🏗️ Architecture

```
Frontend (Port 3000)
    ↓
Gateway (Port 4000)
    ↓
    ├─→ Auth Service (Port 4001) → PostgreSQL (auth_db)
    └─→ Post Service (Port 4002) → PostgreSQL (post_db)
```

### Services:

- **Frontend**: Next.js React app with signup, login, feed, and create post pages
- **Gateway**: API router that forwards requests to appropriate services
- **Auth Service**: Handles user registration, login, and JWT token generation
- **Post Service**: Manages post creation and retrieval

## 📁 Project Structure

```
microservices/
├── backend/
│   ├── auth-service/      # Authentication microservice
│   │   ├── app/api/       # API routes
│   │   ├── lib/           # Utilities (Prisma, JWT)
│   │   ├── prisma/        # Database schema
│   │   └── package.json
│   │
│   ├── post-service/      # Post management microservice
│   │   ├── app/api/       # API routes
│   │   ├── lib/           # Utilities (Prisma, Auth)
│   │   ├── prisma/        # Database schema
│   │   └── package.json
│   │
│   └── gateway/           # API Gateway
│       ├── app/api/       # Route handlers
│       └── package.json
│
└── frontend/              # Next.js frontend
    ├── app/               # Pages (Next.js 14 app router)
    ├── lib/               # API client
    ├── styles/            # Global styles
    └── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+

### 1. Setup Databases

Create two PostgreSQL databases:

```sql
CREATE DATABASE auth_db;
CREATE DATABASE post_db;
```

### 2. Setup Auth Service

```bash
cd backend/auth-service
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run Prisma migrations
npm run prisma:migrate
npm run prisma:generate

# Start service
npm run dev
# Runs on http://localhost:4001
```

### 3. Setup Post Service

```bash
cd backend/post-service
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run Prisma migrations
npm run prisma:migrate
npm run prisma:generate

# Start service
npm run dev
# Runs on http://localhost:4002
```

### 4. Setup Gateway

```bash
cd backend/gateway
npm install

# Configure environment
cp .env.example .env
# Edit .env with service URLs

# Start gateway
npm run dev
# Runs on http://localhost:4000
```

### 5. Setup Frontend

```bash
cd frontend
npm install

# Configure environment
cp .env.example .env
# Edit .env with gateway URL

# Start frontend
npm run dev
# Runs on http://localhost:3000
```

### 6. Access the Application

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed endpoint documentation.

## 🔑 Key Decisions & Boundaries

### Service Boundaries

**Auth Service owns:**
- User credentials (email, username, password)
- Authentication logic
- JWT token generation/verification

**Post Service owns:**
- Post content and metadata
- Post creation and retrieval
- Stores `userId` and `username` (denormalized)

**Gateway owns:**
- Request routing only
- No business logic
- No database access

### Database Design

Each service has its **own database** (no shared databases):
- `auth_db`: Users table
- `post_db`: Posts table

Posts store `userId` and `username` (denormalized) instead of foreign keys to maintain service independence.

### Communication

- Frontend ↔ Gateway: HTTP/REST
- Gateway ↔ Services: HTTP/REST
- Service ↔ Service: HTTP (e.g., Post Service verifies tokens with Auth Service)

## 🛠️ Development Commands

Each service supports:

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

Auth/Post services also support:

```bash
npm run prisma:migrate   # Run database migrations
npm run prisma:generate  # Generate Prisma client
npm run prisma:studio    # Open Prisma Studio GUI
```

## 📝 Phase 1 Constraints

**What's included:**
✅ Basic auth (email/password)
✅ Text-only posts
✅ Simple feed
✅ JWT authentication
✅ Microservices architecture

**What's NOT included (yet):**
❌ Likes, comments, shares
❌ User profiles
❌ Follow/unfollow
❌ Image/video uploads
❌ Real-time features
❌ Docker/Kubernetes
❌ CI/CD pipelines
❌ Monitoring/logging
❌ Caching (Redis)
❌ Message queues

## 🔮 Future Phases

- **Phase 2**: User profiles, follow system
- **Phase 3**: Likes and comments
- **Phase 4**: Media uploads (images, videos)
- **Phase 5**: Real-time notifications
- **Phase 6**: DevOps (Docker, CI/CD, monitoring)
- **Phase 7**: Advanced features (stories, reels, chat)

## 🎓 Learning Goals

This project demonstrates:

1. **Microservices Architecture**: Independent services with clear boundaries
2. **Database per Service**: Each service owns its data
3. **API Gateway Pattern**: Single entry point for clients
4. **Service Communication**: Inter-service HTTP calls
5. **Authentication**: JWT-based auth across services
6. **Modern Stack**: Next.js, TypeScript, Prisma, PostgreSQL

## 🤝 Contributing

This is a learning project. Feel free to:
- Experiment with the code
- Add features incrementally
- Document your learnings
- Break things and fix them

## 📄 License

MIT License - Feel free to use this for learning and portfolio projects.
