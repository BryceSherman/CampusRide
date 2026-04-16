# CampusRide - Development Setup Guide

This guide provides step-by-step instructions to set up the CampusRide project for local development.

## Prerequisites

- **Node.js** 20 LTS or later ([download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **PostgreSQL** 12+ (for Phase 2; optional for Phase 1 scaffolding)
- **Git** for version control

## Initial Setup

### 1. Clone or Open Project

```bash
# Navigate to project root
cd "Full Stack - [MIS-372T]/Final Project/Final Project Code"

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Phase 1 scaffolding"
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Copy environment template
cp .env.example .env

# Edit .env with your local configuration
# Defaults are fine for local development:
# - DATABASE_URL=postgresql://campusride:password@localhost:5432/campusride
# - JWT_SECRET=dev-secret-key (change in production!)
# - PORT=5000

# Install dependencies
npm install

# Verify backend starts
npm run dev

# You should see:
# 🚀 CampusRide API running on http://localhost:5000
# 📝 Health check: http://localhost:5000/api/health
```

Test the health endpoint:
```bash
curl http://localhost:5000/api/health
# Expected response: {"status":"ok","message":"CampusRide API is running"}
```

### 3. Frontend Setup

In a new terminal:

```bash
# Navigate to frontend (from project root)
cd frontend

# Copy environment template
cp .env.example .env

# Install dependencies
npm install

# Start dev server
npm run dev

# You should see:
# ➜  Local:   http://localhost:5173/
# Frontend will auto-open in your browser
```

## Development Workflow

### Running Both Services

Keep two terminal windows open:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The frontend proxy (configured in `vite.config.js`) will forward `/api/*` requests to the backend running on port 5000.

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm run test
```

### Building for Production

```bash
# Backend (no build needed for Node.js)
# Just ensure all dependencies are installed: npm install --production

# Frontend build
cd frontend
npm run build
# Output: dist/ folder (ready to deploy)
```

## Environment Variables Explained

### Backend (.env)

| Variable | Example | Purpose |
|---|---|---|
| `NODE_ENV` | development | Environment mode |
| `PORT` | 5000 | Express server port |
| `DATABASE_URL` | postgresql://user:pass@localhost:5432/campusride | PostgreSQL connection (Phase 2) |
| `JWT_SECRET` | your-secret-key | Secret for JWT signing (change in production!) |
| `JWT_EXPIRATION` | 7d | JWT token expiration time |
| `BCRYPT_ROUNDS` | 10 | Password hashing rounds (higher = slower but more secure) |
| `CORS_ORIGIN` | http://localhost:5173 | Frontend URL allowed to call API |

### Frontend (.env)

| Variable | Example | Purpose |
|---|---|---|
| `VITE_API_URL` | http://localhost:5000 | Backend API base URL |
| `VITE_APP_NAME` | CampusRide | App name (for UI) |

## Troubleshooting

### Backend won't start
- **Error: "Cannot find module 'express'"** → Run `npm install` in backend folder
- **Error: "Port 5000 already in use"** → Change PORT in .env or kill process on port 5000
- **Error: "Database connection failed"** → Skip for now (Phase 2). You can still test health endpoint.

### Frontend won't start
- **Error: "Cannot find module 'react'"** → Run `npm install` in frontend folder
- **Error: "Port 5173 in use"** → Vite will auto-use next available port (check terminal output)
- **Blank page** → Open browser DevTools (F12) and check console for errors

### API calls failing from frontend
- **Error: "Failed to fetch from /api/..."** → Ensure backend is running on port 5000
- **CORS error** → Check CORS_ORIGIN in backend .env matches frontend URL

## Next Steps

Once development environment is set up:

1. **Phase 1 Complete**: Project scaffolding and structure ✅
2. **Phase 2**: Build database models and migrations
3. **Phase 3**: Implement authentication (JWT + bcrypt)
4. **Phase 4**: Build ride management APIs
5. **Phase 5**: Create React pages and components
6. **Phase 6**: Deploy to Render

## Git Workflow

```bash
# After making changes:
git add .
git commit -m "Description of changes"

# Before starting new phase:
git status  # Ensure working directory is clean
```

## Useful Commands

```bash
# Backend
npm run dev              # Start dev server with auto-reload
npm test                 # Run tests
npm run lint             # Check code style
npm run db:reset         # Reset database (Phase 2+)

# Frontend
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build locally
npm test                 # Run tests
npm run test:ui          # Run tests with UI
npm run lint             # Check code style
```

## Need Help?

- Check `DESIGN.md` for project architecture and requirements
- Review `README.md` for feature overview
- Check error messages in terminal for clues
- Ask for clarification during development phases

Happy coding! 🚀
