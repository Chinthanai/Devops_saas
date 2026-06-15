const express = require('express');

const app = express();
const port = process.env.PORT || 4003;

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'aiops-service' });
});

app.post('/resume/analyze', (req, res) => {
  res.status(200).json({ status: 'success', analysis: 'Mock resume analysis: Candidate is a strong match for DevOps role.' });
});

app.post('/logs/analyze', (req, res) => {
  res.status(200).json({ status: 'success', analysis: 'Mock log analysis: No critical errors found. Everything looks good.' });
});

app.post('/incidents/analyze', (req, res) => {
  res.status(200).json({ status: 'success', analysis: 'Mock incident analysis: Incident was likely caused by a network timeout.' });
});

app.listen(port, () => {
  console.log(`AI-Ops Service listening on port ${port}`);
});
