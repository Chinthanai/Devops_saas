const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'gateway-service' });
});

// Proxy routes
app.use('/api/auth', createProxyMiddleware({ target: process.env.AUTH_SERVICE_URL || 'http://auth-service:4001', changeOrigin: true, pathRewrite: { '^/api/auth': '' } }));
app.use('/api/employees', createProxyMiddleware({ target: process.env.EMPLOYEE_SERVICE_URL || 'http://employee-service:4002', changeOrigin: true, pathRewrite: { '^/api/employees': '' } }));
app.use('/api/aiops', createProxyMiddleware({ target: process.env.AIOPS_SERVICE_URL || 'http://aiops-service:4003', changeOrigin: true, pathRewrite: { '^/api/aiops': '' } }));

app.listen(port, () => {
  console.log(`Gateway Service listening on port ${port}`);
});
