const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 4002;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'employee-service' });
});

app.get('/employees', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/employees', async (req, res) => {
  const { name, role } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO employees (name, role) VALUES ($1, $2) RETURNING *',
      [name, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Employee Service listening on port ${port}`);
});
