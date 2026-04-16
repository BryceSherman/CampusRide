# CampusRide - Phase 1: Initial Design Submission
Bryce Sherman & Suman Patra | Full Stack Web App Development

## 1. Problem & Solution
Users need a simple way to request rides, and drivers need a way to view and accept those requests. CampusRide solves this by allowing riders to create ride requests and drivers to accept and complete them. The application provides Asgardeo authentication, role-based access, and straightforward ride management so that each user only sees and interacts with what is relevant to their role.

Application Flow:
- User logs in → system identifies role (rider or driver)
- If rider: creates a ride request → ride is stored in the database
- If driver: views available rides → accepts a ride → marks ride as completed
- The system ensures users only see rides they are allowed to access

## 2. Users

### Rider
- Can create a ride request by entering a pickup and dropoff location
- Can view the status of their active ride
- Can view their full ride history
- Can cancel a ride if it has not yet been accepted
- Can see the calculated fare for each completed ride

### Driver
- Can toggle their availability status on or off
- Can view available ride requests
- Can accept a ride
- Can mark a ride as completed
- Can view rides assigned to them

## 3. Finalized ERD
The MVP data model consists of two tables. The Users table stores all account information for both riders and drivers, differentiated by a role field. The Rides table stores all ride data and references Users twice — once for the rider and once for the driver.

Relationships:
- A User (rider) can create many rides (1 → many)
- A User (driver) can accept many rides (1 → many)
- Each Ride belongs to one rider and optionally one driver

### Users Table
| Field | Type | Description |
|---|---|---|
| id | UUID (PK) | Unique identifier |
| name | STRING | Full name of the user |
| email | STRING | Unique email address |
| password_hash | STRING | Hashed password (bcrypt) |
| phone | STRING | Contact phone number |
| role | ENUM | 'rider' or 'driver' |
| authId | STRING | Identifier from Asgardeo / JWT |
| created_at | TIMESTAMP | Account creation timestamp |

### Rides Table
| Field | Type | Description |
|---|---|---|
| id | UUID (PK) | Unique identifier |
| riderId | UUID (FK → Users.id) | The rider requesting the ride |
| driverId | UUID (FK → Users.id) | Assigned driver (nullable until accepted) |
| pickupLocation | STRING | Pickup location text |
| dropoffLocation | STRING | Dropoff location text |
| status | ENUM | 'requested', 'accepted', 'in_progress', 'completed', 'cancelled' |
| fare_amount | DECIMAL | Calculated total fare in USD |
| distance_miles | FLOAT | Estimated ride distance in miles |
| createdAt | TIMESTAMP | When the ride request was created |
| completed_at | TIMESTAMP | When the ride ended (nullable) |

## 4. General Requirements

### Functional Requirements
- Users can log in using Asgardeo authentication
- The system assigns a role (rider or driver) to each user

**Rider:**
- Can create a ride request
- Can view their own rides and active ride status
- Can cancel a ride if it has not been accepted
- Can see the calculated fare upon ride completion

**Driver:**
- Can toggle their availability status on or off
- Can view available ride requests
- Can accept a ride
- Can mark a ride as completed
- Can view rides assigned to them

**Fare Calculation:**
- Fares are calculated automatically upon ride completion
- Fare formula: base rate + (distance in miles x rate per mile) + (duration in minutes x rate per minute)

### Non-Functional Requirements
- The system uses JWT for secure authentication
- Row-level authorization restricts access to data based on user role
- All passwords are stored using bcrypt hashing
- All secrets (DB credentials, JWT secret, etc.) are stored in environment variables
- The application is responsive and usable on both desktop and mobile browsers
- API responses should return within a reasonable time; database queries are optimized using Sequelize associations to minimize load
- The UI provides clear feedback for all user actions (loading states, error messages, success confirmations)

## 5. Routes List

| Method | Endpoint | Description | Access |
|---|---|---|---|
| — | /login | Login page | Public |
| — | /rider/dashboard | Rider dashboard (create ride, view rides) | Rider |
| — | /driver/dashboard | Driver dashboard (view and accept rides) | Driver |
| POST | /api/auth/register | Register a new user | Public |
| POST | /api/auth/login | Log in; returns JWT | Public |
| GET | /api/users/me | Get current user profile | Auth |
| PUT | /api/users/me | Update current user profile | Auth |
| POST | /api/rides | Create a new ride request | Rider |
| GET | /api/rides | Get rides (filtered by role) | Auth |
| GET | /api/rides/available | List available unaccepted rides | Driver |
| PATCH | /api/rides/:id/accept | Driver accepts a ride | Driver |
| PATCH | /api/rides/:id/complete | Driver marks ride as completed | Driver |
| PATCH | /api/rides/:id/cancel | Rider cancels a pending ride | Rider |
| PUT | /api/drivers/availability | Toggle driver availability on/off | Driver |

## 6. Tech Stack
- Frontend: React + JavaScript with Tailwind CSS
- Authentication: Asgardeo with JWT
- Backend: Node.js + Express API with protected routes using JWT middleware
- Database: PostgreSQL
- ORM: Sequelize
- Hosting: Render
- Security: Row-level authorization based on user role

## 7. UI Mockup
Core Pages:
- Login Page: User logs in using Asgardeo
- Rider Dashboard: Create ride form and view their rides
- Driver Dashboard: View available rides, accept a ride, view assigned rides

## 8. Flow Diagram
All users log in via Asgardeo → Role check:

**Rider path:**
Create ride (enter pickup + dropoff) → Ride stored in DB → Await driver / view ride status → [can cancel] → Ride complete (fare shown to rider) → End

**Driver path:**
View rides (available requests) → Accept ride (status → accepted) → Update status (en route → in progress) → Complete ride (status → completed) → End

Row-level auth enforced throughout.

Splash Page: https://campus-ride-app.onrender.com