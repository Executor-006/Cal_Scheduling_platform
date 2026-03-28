const db = require('../db');

const DEFAULT_USER_ID = 1;

const Availability = {
  async findAll() {
    const { rows } = await db.query(
      'SELECT * FROM availability WHERE user_id = $1 ORDER BY day_of_week',
      [DEFAULT_USER_ID]
    );
    return rows;
  },

  async findByDay(dayOfWeek) {
    const { rows } = await db.query(
      'SELECT * FROM availability WHERE user_id = $1 AND day_of_week = $2',
      [DEFAULT_USER_ID, dayOfWeek]
    );
    return rows[0];
  },

  async findByDayForUser(userId, dayOfWeek) {
    const { rows } = await db.query(
      'SELECT * FROM availability WHERE user_id = $1 AND day_of_week = $2 AND is_active = true',
      [userId, dayOfWeek]
    );
    return rows[0];
  },

  async bulkUpdate(schedules) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM availability WHERE user_id = $1', [DEFAULT_USER_ID]);

      for (const schedule of schedules) {
        if (schedule.is_active) {
          await client.query(
            `INSERT INTO availability (user_id, day_of_week, start_time, end_time, is_active)
             VALUES ($1, $2, $3, $4, $5)`,
            [DEFAULT_USER_ID, schedule.day_of_week, schedule.start_time, schedule.end_time, schedule.is_active]
          );
        }
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
    return this.findAll();
  },
};

module.exports = Availability;
