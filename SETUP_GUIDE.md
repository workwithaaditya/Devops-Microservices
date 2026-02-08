# Setup Guide

Complete step-by-step guide to set up and run the microservices application.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher): [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** (v14 or higher): [Download PostgreSQL](https://www.postgresql.org/download/)
- **Git** (optional, for version control)

### Verify Installation

```bash
node --version   # Should be v18+
npm --version    # Should be 8+
psql --version   # Should be 14+
```

---

## Step 1: Database Setup

### 1.1 Start PostgreSQL

Make sure PostgreSQL is running on your system.

**Windows:**
- PostgreSQL should start automatically after installation
- Check services: Services → PostgreSQL

**macOS/Linux:**
```bash
brew services start postgresql  # macOS with Homebrew
sudo service postgresql start   # Linux
```

### 1.2 Create Databases

Open PostgreSQL command line:

```bash
psql -U postgres
```

Create two separate databases:

```sql
-- Create databases
CREATE DATABASE auth_db;
CREATE DATABASE post_db;

-- Verify
\l

-- Exit
\q
```

### 1.3 Note Your Credentials

You'll need:
- Username (usually `postgres`)
- Password (set during PostgreSQL installation)
- Host (`localhost`)
- Port (default: `5432`)

---

## Step 2: Auth Service Setup

### 2.1 Navigate to Auth Service

```bash
cd backend/auth-service
```

### 2.2 Install Dependencies

```bash
npm install
```

### 2.3 Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
# Database connection
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/auth_db?schema=public"

# JWT configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
```

**Replace:**
- `YOUR_PASSWORD` with your PostgreSQL password
- `JWT_SECRET` with a random secure string (production: use strong random key)

### 2.4 Run Database Migrations

```bash
npm run prisma:migrate
```

When prompted for migration name, enter: `init`

### 2.5 Generate Prisma Client

```bash
npm run prisma:generate
```

### 2.6 Start Auth Service

```bash
npm run dev
```

You should see:
```
- ready started server on 0.0.0.0:4001
```

**Keep this terminal open** and open a new terminal for the next service.

---

## Step 3: Post Service Setup

### 3.1 Navigate to Post Service

Open a **new terminal** and run:

```bash
cd backend/post-service
```

### 3.2 Install Dependencies

```bash
npm install
```

### 3.3 Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
# Database connection
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/post_db?schema=public"

# Auth Service URL
AUTH_SERVICE_URL="http://localhost:4001"
```

**Replace:**
- `YOUR_PASSWORD` with your PostgreSQL password

### 3.4 Run Database Migrations

```bash
npm run prisma:migrate
```

When prompted for migration name, enter: `init`

### 3.5 Generate Prisma Client

```bash
npm run prisma:generate
```

### 3.6 Start Post Service

```bash
npm run dev
```

You should see:
```
- ready started server on 0.0.0.0:4002
```

**Keep this terminal open** and open a new terminal for the gateway.

---

## Step 4: Gateway Setup

### 4.1 Navigate to Gateway

Open a **new terminal** and run:

```bash
cd backend/gateway
```

### 4.2 Install Dependencies

```bash
npm install
```

### 4.3 Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
# Service URLs
AUTH_SERVICE_URL="http://localhost:4001"
POST_SERVICE_URL="http://localhost:4002"
```

No changes needed unless you changed service ports.

### 4.4 Start Gateway

```bash
npm run dev
```

You should see:
```
- ready started server on 0.0.0.0:4000
```

**Keep this terminal open** and open a new terminal for the frontend.

---

## Step 5: Frontend Setup

### 5.1 Navigate to Frontend

Open a **new terminal** and run:

```bash
cd frontend
```

### 5.2 Install Dependencies

```bash
npm install
```

### 5.3 Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
# Gateway URL (single entry point for all API calls)
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
```

No changes needed unless you changed gateway port.

### 5.4 Start Frontend

```bash
npm run dev
```

You should see:
```
- ready started server on 0.0.0.0:3000
```

---

## Step 6: Verify Everything Works

### 6.1 Check All Services Are Running

You should have **4 terminals** open:

1. ✅ Auth Service: `http://localhost:4001`
2. ✅ Post Service: `http://localhost:4002`
3. ✅ Gateway: `http://localhost:4000`
4. ✅ Frontend: `http://localhost:3000`

### 6.2 Open the Application

Open your browser and navigate to:

```
http://localhost:3000
```

### 6.3 Test the Application

1. **Sign Up**
   - Click "Sign up" or navigate to `/signup`
   - Enter: email, username, password
   - Click "Sign Up"
   - You should be redirected to the feed

2. **Create a Post**
   - Click "Create Post"
   - Enter some text (max 500 characters)
   - Click "Post"
   - You should see your post in the feed

3. **Log Out and Log In**
   - Click "Logout"
   - Click "Log in"
   - Enter your email and password
   - You should see the feed with your post

---

## Troubleshooting

### Port Already in Use

If you see "Port 3000 is already in use":

```bash
# Find process using the port
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # macOS/Linux

# Kill the process
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                 # macOS/Linux
```

### Database Connection Error

If Prisma can't connect to PostgreSQL:

1. Verify PostgreSQL is running
2. Check credentials in `.env` file
3. Test connection:
   ```bash
   psql -U postgres -d auth_db
   ```

### Prisma Client Not Generated

If you see "Cannot find module '@prisma/client'":

```bash
npm run prisma:generate
```

### JWT Token Invalid

If you get "Invalid token" errors:

1. Make sure JWT_SECRET is the same in Auth Service `.env`
2. Log out and log in again to get a new token
3. Check token hasn't expired (default: 7 days)

### Services Can't Communicate

If Post Service can't verify tokens:

1. Make sure Auth Service is running on port 4001
2. Check `AUTH_SERVICE_URL` in Post Service `.env`
3. Check firewall settings

---

## Optional: Database GUI

To view your data visually, use Prisma Studio:

### Auth Service Data

```bash
cd backend/auth-service
npm run prisma:studio
```

Opens on `http://localhost:5555`

### Post Service Data

```bash
cd backend/post-service
npm run prisma:studio
```

Opens on `http://localhost:5555` (close Auth Studio first, or it uses a different port)

---

## Development Workflow

### Starting All Services (Quick Start)

Create a script or open 4 terminals and run:

**Terminal 1**: Auth Service
```bash
cd backend/auth-service && npm run dev
```

**Terminal 2**: Post Service
```bash
cd backend/post-service && npm run dev
```

**Terminal 3**: Gateway
```bash
cd backend/gateway && npm run dev
```

**Terminal 4**: Frontend
```bash
cd frontend && npm run dev
```

### Stopping Services

Press `Ctrl + C` in each terminal to stop the service.

---

## Next Steps

Now that everything is running:

1. Explore the code to understand how microservices communicate
2. Try adding a new endpoint
3. Experiment with the database schemas
4. Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
5. Plan your Phase 2 features

---

## Need Help?

Common issues and solutions:

- **"npm install" fails**: Delete `node_modules` and `package-lock.json`, then retry
- **Migrations fail**: Drop database and recreate: `DROP DATABASE auth_db; CREATE DATABASE auth_db;`
- **TypeScript errors**: Run `npm run build` to check for type errors
- **Port conflicts**: Change ports in package.json scripts and .env files

---

Congratulations! 🎉 Your microservices application is now running!
