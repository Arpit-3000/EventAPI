import pool from '../db.js';

export async function createUser(req, res) {
  try {
    const { name, email } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: "Name must be at least 2 characters" });
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function getUser(req, res) {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: "Name must be at least 2 characters" });
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const result = await pool.query(
      'UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *',
      [name, email, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const result = await pool.query(
      'DELETE FROM users WHERE id=$1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function listUsers(req, res) {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
