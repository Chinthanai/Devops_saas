# Cloud Native AI HRMS Platform

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://hub.docker.com/r/your-repo/hrms)  
[![Kubernetes](https://img.shields.io/badge/K8s-Ready-326CE5?logo=kubernetes)](https://kubernetes.io)  
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)](https://nodejs.org)  
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org)  
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwindcss)](https://tailwindcss.com)

---

## 📖 Project Overview

**Cloud Native AI HRMS Platform** is a modern, micro‑service based Human Resource Management System powered by AI‑driven resume analysis.  It showcases end‑to‑end cloud‑native best practices: Docker, Kubernetes (k3d), API‑gateway routing, PostgreSQL persistence, Redis caching, and a responsive React dashboard built with Vite & TailwindCSS.

---

## 🏗 Architecture Diagram

```mermaid
flowchart TB
    subgraph Frontend[Frontend (localhost:30080)]
        FE[React Dashboard]
    end
    subgraph Gateway[API Gateway (localhost:30081)]
        GW[Express.js]
    end
    subgraph Auth[Auth Service]
        A[auth-service:4001]
    end
    subgraph Employee[Employee Service]
        E[employee-service:4002]
    end
    subgraph AIops[AI‑Ops Service]
        I[aiops-service:4003]
    end
    FE -->|HTTPS| GW
    GW -->|/api/auth| A
    GW -->|/api/employees| E
    GW -->|/api/aiops| I
    A -->|PostgreSQL| PG[PostgreSQL]
    E -->|PostgreSQL| PG
    I -->|Redis| R[Redis]
    style Frontend fill:#E3F2FD,stroke:#90CAF9,stroke-width:2px;
    style Gateway fill:#FFF3E0,stroke:#FFB74D,stroke-width:2px;
    style Auth fill:#F1F8E9,stroke:#8BC34A,stroke-width:2px;
    style Employee fill:#FCE4EC,stroke:#EC407A,stroke-width:2px;
    style AIops fill:#EDE7F6,stroke:#7E57C2,stroke-width:2px;
```

---

## 📸 Screenshots

| Dashboard | Employees |
|---|---|
| ![Dashboard](/screenshots/dashboard.png) | ![Employees](/screenshots/employees.png) |
| Incidents | Pods |
| ![Incidents](/screenshots/incidents.png) | ![Pods](/screenshots/pods.png) |
| Resume Analyzer |
| ![Resume Analyzer](/screenshots/resume-analyzer.png) |

---

## ✨ Features

- **Live Metrics Dashboard** – real‑time charts powered by WebSockets.
- **Employee CRUD** – full Create/Read/Update/Delete with PostgreSQL.
- **AI Resume Analyzer** – rule‑based AI that scores CVs and extracts key skills.
- **Incident Monitoring** – visual alert panels for service health.
- **API‑Gateway Routing** – single entry point with path‑based routing.
- **Dockerized Microservices** – each service runs in its own container.
- **Kubernetes (k3d) Deployments** – Helm‑style manifests for local clusters.
- **Redis Caching Layer** – fast look‑ups for auth tokens and AI results.
- **Health‑check Endpoints** – `/healthz` for each service.
- **Rolling Updates** – zero‑downtime deployments via K8s rolling strategy.

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, TailwindCSS, TypeScript
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Cache:** Redis
- **API Gateway:** Express‑based router
- **Containerisation:** Docker & Docker‑Compose
- **Orchestration:** Kubernetes (k3d)
- **CI/CD:** GitHub Actions (template included)

---

## 📦 Microservices Overview

| Service | Port | Primary DB | Cache |
|---|---|---|---|
| **Auth Service** | 4001 | PostgreSQL | Redis |
| **Employee Service** | 4002 | PostgreSQL | Redis |
| **AI‑Ops Service** | 4003 | — | Redis |
| **Frontend** | 30080 | — | — |
| **API Gateway** | 30081 | — | — |

---

## 🌐 API Gateway Routing

| Route | Destination Service |
|---|---|
| `/api/auth` | auth‑service:4001 |
| `/api/employees` | employee‑service:4002 |
| `/api/aiops` | aiops‑service:4003 |

---

## 🔌 API Endpoints (curl examples)

```bash
# Auth – login
curl -X POST http://localhost:30081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"s3cr3t"}'

# Employees – list
curl http://localhost:30081/api/employees \
  -H "Authorization: Bearer <JWT>"

# AI‑Ops – analyze resume
curl -X POST http://localhost:30081/api/aiops/analyze \
  -H "Authorization: Bearer <JWT>" \
  -F "file=@/path/to/resume.pdf"
```

---

## 🐳 Docker Setup

```bash
# Build all images
docker compose build

# Run locally (all services)
docker compose up -d

# View logs
docker compose logs -f
```

*Each service has its own `Dockerfile` under `services/<service-name>/`.*

---

## 📦 Kubernetes (k3d) Setup

```bash
# Create a local k3d cluster
k3d cluster create hrms-demo --agents 2 --api-port 6443

# Apply manifests
kubectl apply -f kubernetes/

# Verify pods
kubectl get pods -n hrms
```

---

## 🛠️ Useful `kubectl` Commands

| Command | Description |
|---|---|
| `kubectl get pods -n hrms` | List all pods |
| `kubectl logs <pod> -n hrms` | View pod logs |
| `kubectl exec -it <pod> -n hrms -- /bin/sh` | Open shell in a pod |
| `kubectl rollout restart deployment <name> -n hrms` | Trigger rolling update |
| `kubectl delete svc <service> -n hrms` | Remove a service |

---

## ⚠️ Troubleshooting

- **Container not starting** – check `docker compose logs <service>` for missing env vars.
- **K8s pod crashloop** – `kubectl describe pod <pod> -n hrms` reveals image pull errors or liveness‑probe failures.
- **Database connection refused** – ensure `POSTGRES_HOST` points to the service name (`postgres`) inside Docker/K8s network.
- **Redis cache miss** – verify the `REDIS_HOST` env var matches the Redis service name.
- **CORS errors** – add missing origins in `gateway/config/cors.js`.

---

## 🚀 Future Roadmap

- **AWS EKS Migration** – production‑grade managed Kubernetes.
- **Terraform IaC** – reproducible infrastructure provisioning.
- **Helm Charts** – version‑controlled K8s deployments.
- **Observability Stack** – Prometheus + Grafana dashboards.
- **GitOps** – ArgoCD for automated rollouts.
- **Advanced AI** – integrate LLM‑powered resume parsing (Mistral, Ollama).
- **Multi‑tenant SaaS** – tenant isolation & RBAC enhancements.

---

## 📄 Resume / Interview Highlights

- **Designed & delivered** a full‑stack, cloud‑native HRMS platform adopted by internal recruiting teams.
- **Implemented** Docker‑based microservices architecture with API‑gateway routing, enabling zero‑downtime deployments.
- **Automated** Kubernetes (k3d) deployments, demonstrating competence in container orchestration and CI/CD pipelines.
- **Built** AI‑driven resume analysis feature using rule‑based scoring, showcasing ability to blend ML concepts with production code.
- **Optimised** PostgreSQL schema and Redis caching for high‑throughput employee CRUD operations.
- **Authored** comprehensive documentation (README, architecture diagrams, troubleshooting guide) to accelerate onboarding for new engineers.

---

*Happy hacking!*
