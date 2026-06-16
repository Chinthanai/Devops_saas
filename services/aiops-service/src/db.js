// src/db.js
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function initDb() {
  // create ai_analysis table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ai_analysis (
      id SERIAL PRIMARY KEY,
      count INTEGER DEFAULT 0
    );
  `);
  // ensure there's a single row to hold count
  const { rows } = await pool.query('SELECT id FROM ai_analysis LIMIT 1');
  if (rows.length === 0) {
    await pool.query('INSERT INTO ai_analysis (count) VALUES (0)');
  }

  // create incidents table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS incidents (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      severity TEXT NOT NULL,
      affected_service TEXT NOT NULL,
      status TEXT DEFAULT 'Open',
      created_at TIMESTAMP DEFAULT NOW(),
      resolved_at TIMESTAMP
    );
  `);

  // seed incidents if empty
  const { rowCount } = await pool.query('SELECT id FROM incidents LIMIT 1');
  if (rowCount === 0) {
    const seeds = [
      ['High CPU Usage on Auth Service', 'high', 'auth-service'],
      ['Database Read Latency Spike', 'medium', 'database'],
      ['Pod CrashLoopBackOff', 'critical', 'kubernetes']
    ];
    for (const [title, severity, service] of seeds) {
      await pool.query(
        'INSERT INTO incidents (title, severity, affected_service) VALUES ($1, $2, $3)',
        [title, severity, service]
      );
    }
  }
}

module.exports = { pool, initDb };
