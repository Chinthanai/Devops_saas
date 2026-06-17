const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const promClient = require('prom-client');

const app = express();
const port = process.env.PORT || 8080;

// Prometheus metrics setup
const register = new promClient.Registry();

promClient.collectDefaultMetrics({
  register,
  prefix: 'gateway_service_',
});

const httpRequestCounter = new promClient.Counter({
  name: 'gateway_service_http_requests_total',
  help: 'Total HTTP requests received by gateway service',
  labelNames: ['method', 'route', 'status_code'],
});

register.registerMetric(httpRequestCounter);

// HTTP request counter middleware
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

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'gateway-service',
  });
});

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).json({
      error: 'Failed to generate metrics',
    });
  }
});

// Proxy routes
app.use(
  '/api/auth',
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || 'http://auth-service:4001',
    changeOrigin: true,
    pathRewrite: {
      '^/api/auth': '',
    },
  })
);

app.use(
  '/api/employees',
  createProxyMiddleware({
    target: process.env.EMPLOYEE_SERVICE_URL || 'http://employee-service:4002',
    changeOrigin: true,
    pathRewrite: {
      '^/api/employees': '',
    },
  })
);

app.use(
  '/api/aiops',
  createProxyMiddleware({
    target: process.env.AIOPS_SERVICE_URL || 'http://aiops-service:4003',
    changeOrigin: true,
    pathRewrite: {
      '^/api/aiops': '',
    },
  })
);

app.listen(port, () => {
  console.log(`Gateway Service listening on port ${port}`);
});