# Smart Attendance Management System

A full-stack college attendance platform for administrators, HODs, faculty, and students. It provides role-based access to academic setup, faculty assignments, class sessions, attendance records, correction requests, low-attendance reporting, and audit logs.

## Stack

- Frontend: React, Vite, React Router, Axios, Lucide React
- Backend: Node.js, Express, CommonJS
- Database: MongoDB with Mongoose
- Authentication: JWT and bcryptjs

## Project Structure

```text
client/   React + Vite application
server/   Express API, Mongoose models, controllers, routes, and seed script
```

## Roles

- **Admin**: manages departments, programs, sections, subjects, users, faculty assignments, sessions, reports, corrections, and audit logs.
- **HOD**: views department-scoped students, faculty, subjects, attendance, low-attendance reports, and correction requests.
- **Faculty**: views assigned work, creates their assigned sessions, and marks attendance for their sections.
- **Student**: views personal attendance and submits attendance correction requests.

## Requirements

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string
- npm

## Configuration

Copy `server/.env.example` to `server/.env` and set real values:

```env
MONGO_URI=mongodb://127.0.0.1:27017/smart_attendance
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_ORIGIN=http://localhost:5173
```

Never commit `server/.env`. It is ignored by Git.

## Install

```bash
cd server
npm install

cd ../client
npm install
```

## Run Locally

Start the API:

```bash
cd server
npm run dev
```

Start the frontend in a second terminal:

```bash
cd client
npm run dev
```

The frontend runs at `http://localhost:5173` and the API runs at `http://localhost:5000`.

## Seed Development Data

The seed script creates departments, programs, sections, subjects, users, faculty assignments, class sessions, and weekday attendance history.

```bash
cd server
npm run seed
```

The script refuses to run against a non-empty attendance database. To intentionally clear the attendance collections and recreate development data:

```bash
npm run seed -- --force
```

Optional settings:

```bash
npm run seed -- --force --students=200 --days=90
```

Seeded sample credentials:

```text
Admin:   admin@attendance.com / Admin@123
HOD:     hod.cse@college.edu / Hod@123
Faculty: faculty.1.cse@college.edu / Faculty@123
Student: student.1.cse@college.edu / Student@123
```

These credentials are for local development only.

## Useful Scripts

### Client

```bash
npm run dev       # start Vite development server
npm run build     # create a production build
npm run lint      # run ESLint
```

### Server

```bash
npm run dev       # start API with nodemon
npm start         # start API normally
npm run seed      # create development data
```

## API Modules

The API is mounted under `/api` and includes:

- `/auth`
- `/departments`
- `/programs`
- `/sections`
- `/students`
- `/subjects`
- `/faculty`
- `/faculty-assignments`
- `/class-sessions`
- `/attendance`
- `/corrections`
- `/audit-logs`

Protected endpoints require a JWT in the `Authorization: Bearer <token>` header.

## Attendance Rules

- A student can have only one attendance record per class session.
- Faculty can mark attendance only for their assigned sessions and section roster.
- Only `PRESENT` contributes to attendance percentage calculations.
- `ABSENT`, `LATE`, and `EXCUSED` do not count as present.
- Approved correction requests update the attendance record and create an audit log.

## Repository Hygiene

Generated dependencies, build output, logs, IDE files, and environment secrets are ignored by the root `.gitignore`. Source code, lockfiles, configuration templates, and documentation remain version-controlled.
