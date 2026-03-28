CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Default user (no auth needed — assume logged in)
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    username    VARCHAR(50) UNIQUE NOT NULL,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    timezone    VARCHAR(50) DEFAULT 'Asia/Kolkata',
    created_at  TIMESTAMP DEFAULT NOW()
);

-- Event types (30-min meeting, 1-hour consultation, etc.)
CREATE TABLE event_types (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(200) NOT NULL,
    slug            VARCHAR(200) NOT NULL,
    description     TEXT,
    duration        INTEGER NOT NULL,
    buffer_time     INTEGER DEFAULT 0,          -- buffer minutes between slots
    is_active       BOOLEAN DEFAULT true,
    custom_questions JSONB DEFAULT '[]',         -- [{label, type, required}]
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, slug)
);

-- Weekly availability schedule
CREATE TABLE availability (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time  TIME NOT NULL,
    end_time    TIME NOT NULL,
    is_active   BOOLEAN DEFAULT true,
    UNIQUE(user_id, day_of_week)
);

-- Actual bookings made by external people
CREATE TABLE bookings (
    id              SERIAL PRIMARY KEY,
    event_type_id   INTEGER REFERENCES event_types(id) ON DELETE CASCADE,
    booker_name     VARCHAR(200) NOT NULL,
    booker_email    VARCHAR(255) NOT NULL,
    start_time      TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time        TIMESTAMP WITH TIME ZONE NOT NULL,
    status          VARCHAR(20) DEFAULT 'confirmed'
                    CHECK (status IN ('confirmed', 'cancelled', 'rescheduled')),
    booker_timezone VARCHAR(50),
    rescheduled_from INTEGER REFERENCES bookings(id),
    created_at      TIMESTAMP DEFAULT NOW(),
    EXCLUDE USING gist (
        event_type_id WITH =,
        tstzrange(start_time, end_time) WITH &&
    ) WHERE (status = 'confirmed')
);

-- Custom question answers for bookings
CREATE TABLE booking_answers (
    id          SERIAL PRIMARY KEY,
    booking_id  INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    question    VARCHAR(500) NOT NULL,
    answer      TEXT NOT NULL
);

CREATE INDEX idx_bookings_time ON bookings(event_type_id, start_time, status);
CREATE INDEX idx_event_types_user ON event_types(user_id);
CREATE INDEX idx_booking_answers ON booking_answers(booking_id);
