const express = require('express');

const app = express();
const port = process.env.PORT || 4001;

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'auth-service' });
});

app.post('/login', (req, res) => {
  res.status(200).json({
    message: 'Login successful',
    token: 'mock-jwt-token-12345'
  });
});

app.listen(port, () => {
  console.log(`Auth Service listening on port ${port}`);
});
