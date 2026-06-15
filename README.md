# Cloud Native AI HRMS Platform

## Project Overview
This project is a microservices-based SaaS foundation for a DevOps portfolio. It implements a Cloud Native AI HRMS Platform (Phase 1).

## Architecture
The platform is built using a microservices architecture, orchestrated with Docker Compose for local development.

- **Frontend**: N/A (To be added)
- **API Gateway**: Routes traffic to appropriate backend services.
- **Microservices**: Auth, Employee, and AI-Ops services handling specific domains.
- **Databases**: PostgreSQL (Relational Data), Redis (Caching/Sessions).

## Service List & Ports

- `gateway-service`: `8081` (mapped to internal `8080`)
- `auth-service`: `4001`
- `employee-service`: `4002`
- `aiops-service`: `4003`
- `postgres`: `5432`
- `redis`: `6380` (mapped to internal `6379`)

## How to Run

1. Make sure you have Docker and Docker Compose installed.
2. Clone the repository and navigate to the root directory.
3. Run the following command to build and start all services in detached mode:

```bash
docker-compose up -d --build
```

4. To check the logs:
```bash
docker-compose logs -f
```

5. To shut down the services:
```bash
docker-compose down
```

## API Test Commands (using curl)

### Health Checks
```bash
curl http://localhost:8081/health
curl http://localhost:4001/health
curl http://localhost:4002/health
curl http://localhost:4003/health
```

### Auth Service
```bash
curl -X POST http://localhost:8081/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin", "password":"password"}'
```

### Employee Service
```bash
curl http://localhost:8081/api/employees/employees
curl -X POST http://localhost:8081/api/employees/employees -H "Content-Type: application/json" -d '{"name":"Alice","role":"Backend Developer"}'
```

### AI-Ops Service
```bash
curl -X POST http://localhost:8081/api/aiops/resume/analyze
curl -X POST http://localhost:8081/api/aiops/logs/analyze
curl -X POST http://localhost:8081/api/aiops/incidents/analyze
```

## Future Roadmap
- Kubernetes (K8s) deployment.
- Helm charts for packaging.
- ArgoCD for GitOps continuous delivery.
- Terraform for Infrastructure as Code (IaC).
- AWS EKS integration.
- Observability stack: Prometheus, Grafana, Loki, Jaeger.
- Message brokering with Kafka.
