# Quick Reference

## 🚀 Starting All Services

You need **4 terminal windows** open:

### Terminal 1: Auth Service
```bash
cd backend/auth-service
npm run dev
```
Runs on: http://localhost:4001

### Terminal 2: Post Service
```bash
cd backend/post-service
npm run dev
```
Runs on: http://localhost:4002

### Terminal 3: Gateway
```bash
cd backend/gateway
npm run dev
```
Runs on: http://localhost:4000

### Terminal 4: Frontend
```bash
cd frontend
npm run dev
```
Runs on: http://localhost:3000

---

## 📊 Database Schemas

### Auth Service - Users Table
```sql
User {
  id        String   (UUID)
  email     String   (unique)
  username  String   (unique)
  password  String   (hashed)
  createdAt DateTime
  updatedAt DateTime
}
```

### Post Service - Posts Table
```sql
Post {
  id        String   (UUID)
  content   String   (text)
  userId    String   (UUID - references Auth Service)
  username  String   (denormalized)
  createdAt DateTime
  updatedAt DateTime
}
```

---

## 🔌 API Endpoints Summary

### Authentication (via Gateway)

| Method | Endpoint             | Description      | Auth Required |
|--------|---------------------|------------------|---------------|
| POST   | /api/auth/signup    | Create account   | No            |
| POST   | /api/auth/login     | Login user       | No            |

### Posts (via Gateway)

| Method | Endpoint      | Description      | Auth Required |
|--------|---------------|------------------|---------------|
| GET    | /api/posts    | Get all posts    | No            |
| POST   | /api/posts    | Create new post  | Yes (JWT)     |

---

## 🔑 Environment Variables

### Auth Service (.env)
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/auth_db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
```

### Post Service (.env)
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/post_db"
AUTH_SERVICE_URL="http://localhost:4001"
```

### Gateway (.env)
```env
AUTH_SERVICE_URL="http://localhost:4001"
POST_SERVICE_URL="http://localhost:4002"
```

### Frontend (.env)
```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
```

---

## 🛠️ Common Commands

### Install Dependencies
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm run start
```

### Prisma (Auth/Post Services Only)
```bash
npm run prisma:migrate      # Run migrations
npm run prisma:generate     # Generate Prisma Client
npm run prisma:studio       # Open Prisma Studio GUI
```

---

## 🗄️ Database Commands

### Create Databases
```sql
CREATE DATABASE auth_db;
CREATE DATABASE post_db;
```

### Drop Databases (reset)
```sql
DROP DATABASE auth_db;
DROP DATABASE post_db;
```

### Connect to Database
```bash
psql -U postgres -d auth_db
psql -U postgres -d post_db
```

---

## 🧪 Testing with cURL

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
  -d '{"content":"Hello, world!"}'
```

---

## 🎯 Port Reference

| Service      | Port | URL                      |
|--------------|------|--------------------------|
| Frontend     | 3000 | http://localhost:3000    |
| Gateway      | 4000 | http://localhost:4000    |
| Auth Service | 4001 | http://localhost:4001    |
| Post Service | 4002 | http://localhost:4002    |
| PostgreSQL   | 5432 | localhost:5432           |

---

## 📁 Project Structure

```
microservices/
├── backend/
│   ├── auth-service/        # Port 4001
│   │   ├── app/api/         # Routes: /signup, /login, /verify
│   │   ├── lib/             # prisma.ts, jwt.ts
│   │   ├── prisma/          # schema.prisma
│   │   ├── .env
│   │   └── package.json
│   │
│   ├── post-service/        # Port 4002
│   │   ├── app/api/         # Routes: /posts
│   │   ├── lib/             # prisma.ts, auth.ts
│   │   ├── prisma/          # schema.prisma
│   │   ├── .env
│   │   └── package.json
│   │
│   └── gateway/             # Port 4000
│       ├── app/api/         # Routes: /auth/*, /posts
│       ├── .env
│       └── package.json
│
├── frontend/                # Port 3000
│   ├── app/                 # Pages
│   │   ├── signup/
│   │   ├── login/
│   │   ├── feed/
│   │   └── create-post/
│   ├── lib/                 # api.ts
│   ├── styles/              # globals.css
│   ├── .env
│   └── package.json
│
├── README.md
├── SETUP_GUIDE.md
├── API_DOCUMENTATION.md
├── ARCHITECTURE.md
└── .gitignore
```

---

## 🐛 Troubleshooting

### "Port already in use"
```bash
# Find and kill process (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Find and kill process (Mac/Linux)
lsof -i :3000
kill -9 <PID>
```

### "Cannot connect to database"
1. Check PostgreSQL is running
2. Verify credentials in .env
3. Ensure databases exist: `\l` in psql

### "Prisma Client not generated"
```bash
cd backend/auth-service  # or post-service
npm run prisma:generate
```

### "CORS error"
- Make sure all services are running
- Check URLs in .env files
- Clear browser cache

---

## ✅ Phase 1 Checklist

Before considering Phase 1 complete:

- [ ] All 4 services start without errors
- [ ] Can signup a new user
- [ ] Can login with created user
- [ ] Can create a post (authenticated)
- [ ] Can view posts in feed
- [ ] Can logout and login again
- [ ] Data persists in PostgreSQL
- [ ] Read and understand ARCHITECTURE.md

---

## 🔮 Next Steps (Phase 2)

Ideas for extending the application:

1. **User Profiles**
   - View user profile page
   - Edit profile (bio, avatar)
   - View user's posts

2. **Social Features**
   - Like posts
   - Comment on posts
   - Follow/unfollow users

3. **Improved Auth**
   - Refresh tokens
   - Password reset
   - Email verification

4. **Better UX**
   - Infinite scroll
   - Real-time updates
   - Loading states
   - Error boundaries

5. **DevOps**
   - Docker containers
   - Docker Compose
   - CI/CD pipeline
   - Monitoring

---

## 📚 Learning Resources

- [Microservices Architecture](https://microservices.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [JWT Introduction](https://jwt.io/introduction)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/tutorial/)

---

## 💡 Tips

1. **Keep it running**: Leave all 4 terminals open while developing
2. **Check logs**: Watch terminal output for errors
3. **Prisma Studio**: Use it to view/edit database data visually
4. **Git commits**: Commit after each working feature
5. **Test often**: Test in browser after each change
6. **Read docs**: Understand why things work, not just that they work

---

Happy coding! 🚀
