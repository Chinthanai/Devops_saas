# Cloud Native AI HRMS Platform

[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A modern, cloud-native microservices SaaS platform built for Human Resources Management, featuring AI-powered resume parsing, observability mockups, and scalable architecture.

## 🚀 Project Overview

The Cloud Native AI HRMS Platform is designed to demonstrate enterprise-grade microservice architecture. It decouples business logic into discrete domain services, orchestrated by an API Gateway, and fronted by a sleek, dark-themed React SPA (Single Page Application). 

This project aims to be highly scalable, fault-tolerant, and ready for deployment into Kubernetes environments using modern GitOps and observability practices.

## 🏗️ Architecture

### Docker Architecture
The platform is containerized using Docker, allowing for a reproducible "local production stack". Docker Compose orchestrates 7 interconnected services attached to a custom internal Docker network:

1. **Frontend Container:** An Nginx-based image serving the compiled React application on port `3000`. It utilizes a `try_files` fallback rule for seamless client-side routing.
2. **API Gateway:** Acts as the single entry point (port `8081`) for the frontend, routing traffic to appropriate backend services while handling CORS.
3. **Domain Services:** Node.js Express instances (Auth, Employee, AI-Ops) isolated on the internal network.
4. **Data Layer:** PostgreSQL and Redis instances handling relational storage and rapid caching scenarios.

### Service Communication Flow
- The **React SPA** makes asynchronous HTTP requests using Axios to the `gateway-service` (`http://localhost:8081`).
- The **Gateway Service** inspects the path (e.g., `/api/aiops`) and proxies the request to the internal `aiops-service` on port `4003`.
- The internal microservices interact with **Postgres/Redis** before returning the consolidated data.

*(For detailed architectural diagrams, please refer to [Platform Architecture](docs/architecture/platform-architecture.md))*

## 🧩 Microservices Explanation

- **`gateway-service`**: Reverse proxy and CORS middleware handler. Consolidates frontend ingress.
- **`auth-service`**: Validates credentials and generates secure JSON Web Tokens (JWT) for stateless sessions.
- **`employee-service`**: Core CRUD service managing the employee lifecycle, role assignments, and statuses.
- **`aiops-service`**: Specialized service mocking advanced AI integrations, including Resume Parsing (score/skills matching) and Incident Log Analysis.
- **`frontend`**: The user interface. Built using Vite, React, TailwindCSS, and Lucide Icons. Features a protected dashboard.

## ☸️ Kubernetes Architecture

In Phase 4, the platform was migrated to a local Kubernetes deployment. This demonstrates enterprise-grade orchestration capabilities.

- **Namespace**: `cloud-native-ai-hrms` isolates all resources.
- **ConfigMaps & Secrets**: Secure injection of environment variables and database credentials.
- **Probes**: Implement `livenessProbe` and `readinessProbe` for high availability.
- **Resource Management**: Explicit CPU and Memory `requests` and `limits` to prevent noisy neighbor scenarios.
- **Scaling**: App services run with `replicas: 2` for redundancy.
- **Networking**: Internal microservices use internal `ClusterIP`. The Frontend and Gateway are exposed externally via `NodePort` mapping to `30080` and `30081`.

### Kubernetes Workflow Explanation
The Kubernetes manifests define the desired state. Applying these raw YAML manifests prompts the Kubernetes control plane to schedule Pods across nodes, setup internal DNS names (e.g. `http://auth-service:4001`), and manage self-healing if a container crashes. We rely on local images directly using `imagePullPolicy: Never` for a seamless local development loop.

## 📸 Screenshots

*(Add screenshots of the Dashboard, Employee Directory, and AI Resume Analyzer here)*
- [Dashboard View](screenshots/dashboard.png)
- [Resume Analyzer](screenshots/analyzer.png)
- [Kubernetes Deployment Logs](screenshots/kubernetes-deploy.png)

## 🏃 How to Run (Local Production Stack)

### Option A: Docker Compose
```bash
docker compose up -d --build
```
- **Frontend UI:** `http://localhost:3000`
- **API Gateway:** `http://localhost:8081`

### Option B: Kubernetes (Local)
See [kubernetes/README.md](kubernetes/README.md) for full instructions.
```bash
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/secret.yaml
kubectl apply -f kubernetes/deployments/
kubectl apply -f kubernetes/services/
```
- **Frontend UI:** `http://localhost:30080`
- **API Gateway:** `http://localhost:30081`

**Test Healthchecks:**
- Frontend: `curl http://localhost:3000/health`
- Gateway: `curl http://localhost:8081/health`

To view logs:
```bash
docker compose logs -f
```

To shut down:
```bash
docker compose down
```

## 🗺️ Future Roadmap

- **Kubernetes (K8s):** Migration from Docker Compose to Kubernetes manifests (Deployments, Services, Ingress).
- **GitOps:** CI/CD pipelines using GitHub Actions and ArgoCD.
- **Infrastructure as Code:** Terraform implementation for AWS EKS provisioning.
- **Observability:** Prometheus metrics, Grafana dashboards, and Jaeger distributed tracing.
