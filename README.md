# Cal Clone - Scheduling Platform

A full-stack scheduling/booking web application inspired by [Cal.com](https://cal.com). Users can create event types, set their availability, and let others book time slots through a public booking page.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, Tailwind CSS, React Router, dayjs, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL |

## Features

### Core Features
- **Event Types Management** - Create, edit, delete event types with title, description, duration, and URL slug. Each event type has a unique public booking link.
- **Availability Settings** - Set available days and time ranges per day with timezone support.
- **Public Booking Page** - Calendar date picker, available time slots display, booking form (name + email), double-booking prevention, and confirmation page.
- **Bookings Dashboard** - View upcoming/past bookings with cancel functionality.

### Bonus Features
- **Responsive Design** - Fully responsive across mobile, tablet, and desktop. Mobile sidebar collapses into hamburger menu, public booking page uses step-by-step flow on small screens.
- **Buffer Time** - Configurable buffer time between meetings (0, 5, 10, 15, or 30 minutes).
- **Rescheduling** - Reschedule existing bookings through a modal with calendar + time slot picker.
- **Custom Booking Questions** - Add custom questions (text, textarea, phone) to event types. Answers are collected during booking and displayed in the bookings dashboard.

## Database Schema

```
users            - Default hardcoded user (no auth)
event_types      - Title, slug, duration, buffer_time, custom_questions (JSONB)
availability     - Day of week, start/end time per user
bookings         - Start/end time (UTC), status, booker info, rescheduled_from reference
booking_answers  - Custom question responses per booking
```

Key design decisions:
- **UTC storage** - All booking times stored in UTC, converted for display
- **EXCLUDE constraint** - PostgreSQL range exclusion prevents double-booking at the database level
- **JSONB for questions** - Flexible custom questions without extra join tables for the schema
- **Rescheduling chain** - `rescheduled_from` foreign key tracks booking history

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Database Setup

```bash
# Create database
psql -U postgres -c "CREATE DATABASE calclone"

# Run schema (creates tables, indexes, constraints)
psql -U postgres -d calclone -f server/src/db/schema.sql

# Seed sample data (default user, event types, availability, sample bookings)
psql -U postgres -d calclone -f server/src/db/seed.sql
```

### 2. Backend Setup

```bash
cd server
cp ../.env.example .env
# Edit .env with your PostgreSQL credentials:
# DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/calclone
npm install
npm run dev          # Starts on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd client
npm install
npm start            # Starts on http://localhost:3000
```

### 4. Access the App

- **Admin Dashboard**: http://localhost:3000/dashboard
- **Public Booking Page**: http://localhost:3000/john/30min

## Assumptions

- **No authentication** - A single default user (John Doe) is assumed to be logged in on the admin side. The public booking page is accessible without login.
- **Weekly recurring availability** - The same schedule repeats every week (no date-specific overrides).
- **Slug uniqueness** - Event type slugs are unique per user, enforced at the database level.
- **UTC storage** - All booking timestamps are stored in UTC and converted to the appropriate timezone for display.
- **Buffer time** - Applied symmetrically around bookings during slot generation.

## Project Structure

```
cal-clone/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── layout/         # Shell, Sidebar, TopBar
│   │   │   ├── event-types/    # EventTypeCard, EventTypeForm, EventTypeList
│   │   │   ├── availability/   # AvailabilityForm, DaySlotPicker, TimezoneSelect
│   │   │   ├── booking/        # CalendarView, TimeSlotList, BookingForm, Confirmation
│   │   │   ├── bookings/       # BookingCard, BookingsList, RescheduleModal
│   │   │   └── ui/             # Button, Modal, Badge, Toggle, Input
│   │   ├── pages/              # Dashboard, Availability, Bookings, PublicBooking
│   │   ├── hooks/              # useEventTypes, useAvailability, useBookings, useUser
│   │   └── lib/                # API client, date utilities, constants
│   └── package.json
│
├── server/                     # Express backend
│   ├── src/
│   │   ├── routes/             # Express route definitions
│   │   ├── controllers/        # Request handling logic
│   │   ├── models/             # Database query functions
│   │   ├── middleware/         # Error handler, request validation
│   │   ├── utils/              # Slot generation algorithm
│   │   └── db/                 # Connection pool, schema, seed data
│   └── package.json
│
└── README.md
```

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/me` | Get current user info |
| GET | `/api/event-types` | List all event types |
| POST | `/api/event-types` | Create event type |
| PUT | `/api/event-types/:id` | Update event type |
| PATCH | `/api/event-types/:id/toggle` | Toggle active status |
| DELETE | `/api/event-types/:id` | Delete event type |
| GET | `/api/availability` | Get weekly availability |
| PUT | `/api/availability` | Update availability (bulk) |
| GET | `/api/bookings?status=upcoming\|past` | List bookings |
| GET | `/api/bookings/:id` | Get single booking |
| PATCH | `/api/bookings/:id/cancel` | Cancel booking |
| POST | `/api/bookings/:id/reschedule` | Reschedule booking |
| GET | `/api/public/:username/:slug` | Get event type info (public) |
| GET | `/api/public/:username/:slug/slots` | Get available slots (public) |
| POST | `/api/public/:username/:slug/book` | Create booking (public) |
