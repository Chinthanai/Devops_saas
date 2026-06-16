const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4003;

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Skills list for resume analysis
const SKILLS = [
  'AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'GitHub Actions',
  'Linux', 'NGINX', 'Prometheus', 'Grafana', 'Loki', 'ArgoCD', 'Redis', 'PostgreSQL'
];

// Initialize DB: create tables if not exist and seed incidents
const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ai_analysis (
        id SERIAL PRIMARY KEY,
        count INTEGER DEFAULT 0
      );
    `);
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
    // Ensure a single row in ai_analysis exists
    const { rows } = await pool.query('SELECT * FROM ai_analysis LIMIT 1');
    if (rows.length === 0) {
      await pool.query('INSERT INTO ai_analysis (count) VALUES (0)');
    }
    // Seed incidents if empty
    const incRes = await pool.query('SELECT COUNT(*) FROM incidents');
    if (parseInt(incRes.rows[0].count) === 0) {
      const seed = [
        ['High CPU Usage on Auth Service', 'High', 'Auth Service'],
        ['Database Read Latency Spike', 'Medium', 'Database'],
        ['Pod CrashLoopBackOff', 'High', 'Kubernetes']
      ];
      for (const [title, severity, affected] of seed) {
        await pool.query(
          'INSERT INTO incidents (title, severity, affected_service) VALUES ($1, $2, $3)',
          [title, severity, affected]
        );
      }
    }
    console.log('AI-Ops DB initialized');
  } catch (err) {
    console.error('DB init error', err);
    process.exit(1);
  }
};

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'aiops-service' });
});

// Resume analyzer (rule‑based)
app.post('/resume/analyze', async (req, res) => {
  const payload = req.body;
  const text = payload.resumeText || payload.text;
  if (!text) {
    return res.status(400).json({ error: 'resume text is required' });
  }
  const lower = text.toLowerCase();
  const detected = SKILLS.filter(skill => lower.includes(skill.toLowerCase()));
  const missing = SKILLS.filter(skill => !detected.includes(skill));
  const score = Math.round((detected.length / SKILLS.length) * 100);
  let recommendation = '';
  if (score >= 80) recommendation = 'Strong match for DevOps role';
  else if (score >= 50) recommendation = 'Good candidate, needs improvement';
  else recommendation = 'Needs more DevOps project exposure';
  // Increment analysis count
  await pool.query('UPDATE ai_analysis SET count = count + 1 WHERE id = 1');
  res.status(200).json({
    summary: `Analyzed resume for ${detected.length} detected skills`,
    detectedSkills: detected,
    missingSkills: missing,
    score,
    recommendation,
  });
});

// Metrics summary
app.get('/metrics/summary', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT count FROM ai_analysis WHERE id = 1');
    const count = rows[0]?.count || 0;
    res.status(200).json({ aiAnalysisCount: count, supportedSkills: SKILLS.length, aiMode: process.env.AI_MODE || 'RULE_BASED' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Incident endpoints
app.get('/incidents', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM incidents ORDER BY id');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/incidents', async (req, res) => {
  const { title, severity, affectedService } = req.body;
  if (!title || !severity || !affectedService) {
    return res.status(400).json({ error: 'title, severity, and affectedService are required' });
  }
  try {
    const { rows } = await pool.query(
      'INSERT INTO incidents (title, severity, affected_service) VALUES ($1, $2, $3) RETURNING *',
      [title, severity, affectedService]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/incidents/:id/resolve', async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query(
      "UPDATE incidents SET status='Resolved', resolved_at=NOW() WHERE id=$1 AND status!='Resolved'",
      [id]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Incident not found or already resolved' });
    }
    const { rows } = await pool.query('SELECT * FROM incidents WHERE id=$1', [id]);
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, async () => {
  await initDb();
  console.log(`AI-Ops Service listening on port ${port}`);
});
