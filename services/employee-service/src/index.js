const express = require('express');

const app = express();
const port = process.env.PORT || 4002;

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'employee-service' });
});

let employees = [
  { id: 1, name: 'John Doe', role: 'DevOps Engineer' },
  { id: 2, name: 'Jane Smith', role: 'Software Engineer' }
];

app.get('/employees', (req, res) => {
  res.status(200).json(employees);
});

app.post('/employees', (req, res) => {
  const newEmployee = { id: employees.length + 1, ...req.body };
  employees.push(newEmployee);
  res.status(201).json(newEmployee);
});

app.listen(port, () => {
  console.log(`Employee Service listening on port ${port}`);
});
