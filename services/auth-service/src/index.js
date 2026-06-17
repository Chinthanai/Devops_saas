const express = require('express');
const promClient = require('prom-client');

const app = express();
const port = process.env.PORT || 4001;

const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const httpRequestCounter = new promClient.Counter({
  name: 'auth_service_http_requests_total',
  help: 'Total HTTP requests received by auth service',
  labelNames: ['method', 'route', 'status_code'],
});

register.registerMetric(httpRequestCounter);

app.use(express.json());

app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status_code: String(res.statusCode),
    });
  });
  next();
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'auth-service' });
});

app.post('/login', (req, res) => {
  res.status(200).json({
    message: 'Login successful',
    token: 'mock-jwt-token-12345'
  });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(port, () => {
  console.log(`Auth Service listening on port ${port}`);
});