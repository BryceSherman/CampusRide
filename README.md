# CampusRide - Full Stack Ride Sharing App
**Bryce Sherman & Suman Patra | Full Stack Web App Development (MIS-372T)**

A full-stack ride-sharing application built with React, Node.js, Express, PostgreSQL, and Sequelize.

## Project Structure
```
CampusRide/
├── backend/          # Node.js + Express API
├── frontend/         # React + Vite frontend
├── DESIGN.md         # Phase 1 design document
└── README.md         # This file
```

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, React Router
- **Backend**: Node.js 20, Express.js, Sequelize ORM
- **Database**: PostgreSQL (added in Phase 2)
- **Authentication**: JWT (local bcrypt for MVP, Asgardeo integration in Phase 2)
- **Testing**: Jest, React Testing Library
- **Hosting**: Render (deployment in Phase 6)

## Quick Start

### Prerequisites
- Node.js 20 LTS or later
- npm or yarn
- PostgreSQL (when attached in Phase 2)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Configure environment variables
npm run dev          # Start development server (port 5000)
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env  # Configure API endpoint
npm run dev          # Start Vite dev server (port 5173)
```

## Implementation Phases

1. **Phase 1: Project Setup** ✅ (Current)
   - Project structure, git initialization
   - Backend scaffolding (Express, Sequelize, Jest)
   - Frontend scaffolding (Vite, React, Tailwind)

2. **Phase 2: Database Layer**
   - Sequelize models (User, Ride)
   - Database migrations
   - PostgreSQL setup

3. **Phase 3: Backend Authentication**
   - JWT middleware
   - Auth routes (register, login)
   - User profile routes

4. **Phase 4: Backend Ride APIs**
   - Ride CRUD operations
   - Role-based authorization
   - Fare calculation logic

5. **Phase 5: Frontend Application**
   - Login page, Rider dashboard, Driver dashboard
   - API integration, state management
   - Responsive UI with Tailwind

6. **Phase 6: Deployment**
   - Deploy to Render
   - Database provisioning
   - End-to-end testing

## API Endpoints (Reference)

See [DESIGN.md](./DESIGN.md) for full API specification.

Core endpoints:
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login (JWT)
- `POST /api/rides` - Create ride request (rider)
- `GET /api/rides` - View rides (role-filtered)
- `PATCH /api/rides/:id/accept` - Accept ride (driver)
- `PATCH /api/rides/:id/complete` - Complete ride (driver)

## Database Schema

### Users Table
- id (UUID, primary key)
- name, email, phone
- password_hash (bcrypt)
- role (enum: 'rider' | 'driver')
- isAvailable (boolean)
- authId, created_at

### Rides Table
- id (UUID, primary key)
- riderId, driverId (foreign keys to Users)
- pickupLocation, dropoffLocation
- status (enum: 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled')
- fare_amount, distance_miles
- createdAt, completed_at

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/campusride
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=7d
BCRYPT_ROUNDS=10
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

## Development

### Run Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Run Linter
```bash
npm run lint
```

### Build for Production
```bash
# Backend (if applicable)
npm run build

# Frontend
npm run build
```

## Project Features

### Rider Features
- ✅ Create ride requests
- ✅ View ride history and status
- ✅ Cancel pending rides
- ✅ View completed ride fare

### Driver Features
- ✅ Toggle availability status
- ✅ View available ride requests
- ✅ Accept rides
- ✅ Mark rides as complete
- ✅ View assigned rides

## Security
- JWT tokens for stateless authentication
- Bcrypt password hashing
- Row-level authorization (users see only their data)
- Environment variables for secrets
- CORS configured for frontend domain

## Future Enhancements (Phase 2+)
- Real-time ride updates (WebSocket)
- Google Maps integration for distance calculation
- Payment processing (Stripe)
- Driver ratings and reviews
- Asgardeo OAuth integration
- Phone verification
- Ride history analytics

## Contributing
- Bryce Sherman
- Suman Patra

## License
Educational project - MIS-372T

## Splash Page
https://campus-ride-app.onrender.com
