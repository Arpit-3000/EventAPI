import pool from '../db.js';

export async function createEvent(req, res) {
  try {
    const { title, datetime, location, capacity } = req.body;
    if (capacity <= 0 || capacity > 1000) {
      return res.status(400).json({ error: "Invalid capacity" });
    }
    const result = await pool.query(
      `INSERT INTO events (title, datetime, location, capacity)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, datetime, location, capacity]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function getEventDetails(req, res) {
  try {
    const { id } = req.params;
    const event = await pool.query(`SELECT * FROM events WHERE id=$1`, [id]);
    const users = await pool.query(
      `SELECT users.id, name, email FROM users
       JOIN registrations ON users.id = registrations.user_id
       WHERE registrations.event_id=$1`, [id]);

    res.json({ ...event.rows[0], registrations: users.rows });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function registerUser(req, res) {
  try {
    const { name, email } = req.body;
    const { id: eventId } = req.params;

    const event = await pool.query(`SELECT * FROM events WHERE id=$1`, [eventId]);
    if (event.rows.length === 0) return res.status(404).json({ error: "Event not found" });

    const { datetime, capacity } = event.rows[0];
    if (new Date(datetime) < new Date()) return res.status(400).json({ error: "Event already occurred" });

    let user = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
    if (user.rows.length === 0) {
      user = await pool.query(`INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *`, [name, email]);
    }

    const regCount = await pool.query(`SELECT COUNT(*) FROM registrations WHERE event_id=$1`, [eventId]);
    if (parseInt(regCount.rows[0].count) >= capacity) {
      return res.status(400).json({ error: "Event full" });
    }

    const alreadyReg = await pool.query(
      `SELECT * FROM registrations WHERE user_id=$1 AND event_id=$2`,
      [user.rows[0].id, eventId]
    );
    if (alreadyReg.rows.length > 0) return res.status(400).json({ error: "Already registered" });

    await pool.query(`INSERT INTO registrations (user_id, event_id) VALUES ($1, $2)`,
      [user.rows[0].id, eventId]);

    res.json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function cancelRegistration(req, res) {
  try {
    const { name, email } = req.body;
    const { id: eventId } = req.params;

    const user = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
    if (user.rows.length === 0) return res.status(404).json({ error: "User not found" });

    const deleted = await pool.query(
      `DELETE FROM registrations WHERE user_id=$1 AND event_id=$2 RETURNING *`,
      [user.rows[0].id, eventId]
    );

    if (deleted.rows.length === 0) return res.status(400).json({ error: "User was not registered" });

    res.json({ message: "Registration canceled" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function listUpcomingEvents(req, res) {
  try {
    console.log("✅ /api/events called"); 
    const result = await pool.query(
      `SELECT * FROM events WHERE datetime > CURRENT_TIMESTAMP
       ORDER BY datetime ASC, location ASC`
    );
    console.log("🎯 Query successful", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error in listUpcomingEvents:", err);
    res.status(500).json({ error: "Server error" });
  }

  const result = await pool.query(`
  SELECT e.*, (
    SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id
  ) AS registered
  FROM events e
  WHERE e.datetime > CURRENT_TIMESTAMP
  ORDER BY e.datetime ASC, e.location ASC
`);

}

export async function eventStats(req, res) {
  try {
    const { id } = req.params;
    const event = await pool.query(`SELECT * FROM events WHERE id=$1`, [id]);
    if (event.rows.length === 0) return res.status(404).json({ error: "Event not found" });

    const regCount = await pool.query(`SELECT COUNT(*) FROM registrations WHERE event_id=$1`, [id]);

    const used = parseInt(regCount.rows[0].count);
    const remaining = event.rows[0].capacity - used;

    res.json({
      total_registrations: used,
      remaining_capacity: remaining,
      percent_full: ((used / event.rows[0].capacity) * 100).toFixed(2) + "%"
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
