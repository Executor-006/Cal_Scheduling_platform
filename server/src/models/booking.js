const db = require('../db');

const DEFAULT_USER_ID = 1;

const Booking = {
  async findUpcoming() {
    const { rows } = await db.query(
      `SELECT b.*, et.title as event_title, et.duration, et.slug as event_slug,
              u.username as host_username
       FROM bookings b
       JOIN event_types et ON b.event_type_id = et.id
       JOIN users u ON et.user_id = u.id
       WHERE et.user_id = $1 AND b.start_time > NOW() AND b.status = 'confirmed'
       ORDER BY b.start_time ASC`,
      [DEFAULT_USER_ID]
    );
    // Attach answers
    for (const booking of rows) {
      const { rows: answers } = await db.query(
        'SELECT question, answer FROM booking_answers WHERE booking_id = $1',
        [booking.id]
      );
      booking.answers = answers;
    }
    return rows;
  },

  async findPast() {
    const { rows } = await db.query(
      `SELECT b.*, et.title as event_title, et.duration, et.slug as event_slug,
              u.username as host_username
       FROM bookings b
       JOIN event_types et ON b.event_type_id = et.id
       JOIN users u ON et.user_id = u.id
       WHERE et.user_id = $1 AND (b.start_time <= NOW() OR b.status IN ('cancelled', 'rescheduled'))
       ORDER BY b.start_time DESC`,
      [DEFAULT_USER_ID]
    );
    for (const booking of rows) {
      const { rows: answers } = await db.query(
        'SELECT question, answer FROM booking_answers WHERE booking_id = $1',
        [booking.id]
      );
      booking.answers = answers;
    }
    return rows;
  },

  async findById(id) {
    const { rows } = await db.query(
      `SELECT b.*, et.title as event_title, et.duration, et.slug as event_slug,
              et.custom_questions, u.username as host_username
       FROM bookings b
       JOIN event_types et ON b.event_type_id = et.id
       JOIN users u ON et.user_id = u.id
       WHERE b.id = $1`,
      [id]
    );
    if (rows[0]) {
      const { rows: answers } = await db.query(
        'SELECT question, answer FROM booking_answers WHERE booking_id = $1',
        [rows[0].id]
      );
      rows[0].answers = answers;
    }
    return rows[0];
  },

  async findByEventTypeAndDateRange(eventTypeId, startOfDay, endOfDay) {
    const { rows } = await db.query(
      `SELECT * FROM bookings
       WHERE event_type_id = $1
       AND status = 'confirmed'
       AND start_time >= $2
       AND start_time < $3`,
      [eventTypeId, startOfDay, endOfDay]
    );
    return rows;
  },

  async findByUserAndDateRange(userId, startOfDay, endOfDay) {
    const { rows } = await db.query(
      `SELECT b.* FROM bookings b
       JOIN event_types et ON b.event_type_id = et.id
       WHERE et.user_id = $1
       AND b.status = 'confirmed'
       AND b.start_time >= $2
       AND b.start_time < $3`,
      [userId, startOfDay, endOfDay]
    );
    return rows;
  },

  async create({ event_type_id, booker_name, booker_email, start_time, end_time, booker_timezone, rescheduled_from, answers }) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      const { rows } = await client.query(
        `INSERT INTO bookings (event_type_id, booker_name, booker_email, start_time, end_time, booker_timezone, rescheduled_from)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [event_type_id, booker_name, booker_email, start_time, end_time, booker_timezone, rescheduled_from || null]
      );

      const booking = rows[0];

      // Save custom question answers
      if (answers && answers.length > 0) {
        for (const ans of answers) {
          await client.query(
            'INSERT INTO booking_answers (booking_id, question, answer) VALUES ($1, $2, $3)',
            [booking.id, ans.question, ans.answer]
          );
        }
      }

      await client.query('COMMIT');
      booking.answers = answers || [];
      return booking;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async cancel(id) {
    const { rows } = await db.query(
      `UPDATE bookings SET status = 'cancelled'
       WHERE id = $1 AND status = 'confirmed' RETURNING *`,
      [id]
    );
    return rows[0];
  },

  async reschedule(oldBookingId, newBookingData) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      // Mark old booking as rescheduled
      const { rows: oldRows } = await client.query(
        `UPDATE bookings SET status = 'rescheduled'
         WHERE id = $1 AND status = 'confirmed' RETURNING *`,
        [oldBookingId]
      );
      if (!oldRows[0]) throw new Error('Original booking not found or already cancelled');

      // Create new booking
      const { rows: newRows } = await client.query(
        `INSERT INTO bookings (event_type_id, booker_name, booker_email, start_time, end_time, booker_timezone, rescheduled_from)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          newBookingData.event_type_id,
          newBookingData.booker_name,
          newBookingData.booker_email,
          newBookingData.start_time,
          newBookingData.end_time,
          newBookingData.booker_timezone,
          oldBookingId,
        ]
      );

      // Copy over answers from old booking if no new ones provided
      if (newBookingData.answers && newBookingData.answers.length > 0) {
        for (const ans of newBookingData.answers) {
          await client.query(
            'INSERT INTO booking_answers (booking_id, question, answer) VALUES ($1, $2, $3)',
            [newRows[0].id, ans.question, ans.answer]
          );
        }
      }

      await client.query('COMMIT');
      newRows[0].answers = newBookingData.answers || [];
      return newRows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },
};

module.exports = Booking;
