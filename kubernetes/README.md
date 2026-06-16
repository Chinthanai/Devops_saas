# Local Kubernetes Deployment

This directory contains the Kubernetes manifests required to run the Cloud Native AI HRMS Platform on a local cluster.

## 1. Prerequisites

- **Kubernetes Cluster**: You need a running local cluster.
  - **Docker Desktop**: Go to Settings -> Kubernetes -> Enable Kubernetes.
  - OR **Kind**: `kind create cluster`
- **kubectl**: Ensure the Kubernetes command-line tool is installed and configured to connect to your cluster.

## 2. Build Local Docker Images

Before applying the manifests, ensure you have the local Docker images built. If you haven't already, run this from the repository root:

```bash
docker compose build
```

This will create the following images locally:
- `devops_saas-frontend`
- `devops_saas-gateway-service`
- `devops_saas-auth-service`
- `devops_saas-employee-service`
- `devops_saas-aiops-service`

Since the Deployments use `imagePullPolicy: Never`, Kubernetes will exclusively look for these locally built images.

## 3. Deployment

Apply the manifests in the following order:

```bash
# 1. Create Namespace
kubectl apply -f kubernetes/namespace.yaml

# 2. Create ConfigMap and Secret
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/secret.yaml

# 3. Deploy Databases
kubectl apply -f kubernetes/deployments/postgres-deployment.yaml
kubectl apply -f kubernetes/services/postgres-service.yaml
kubectl apply -f kubernetes/deployments/redis-deployment.yaml
kubectl apply -f kubernetes/services/redis-service.yaml

# 4. Deploy Microservices
kubectl apply -f kubernetes/deployments/auth-deployment.yaml
kubectl apply -f kubernetes/services/auth-service.yaml
kubectl apply -f kubernetes/deployments/employee-deployment.yaml
kubectl apply -f kubernetes/services/employee-service.yaml
kubectl apply -f kubernetes/deployments/aiops-deployment.yaml
kubectl apply -f kubernetes/services/aiops-service.yaml

# 5. Deploy Gateway & Frontend
kubectl apply -f kubernetes/deployments/gateway-deployment.yaml
kubectl apply -f kubernetes/services/gateway-service.yaml
kubectl apply -f kubernetes/deployments/frontend-deployment.yaml
kubectl apply -f kubernetes/services/frontend-service.yaml

# 6. (Optional) Apply Ingress
kubectl apply -f kubernetes/ingress/ingress.yaml
```

*Alternatively, you can apply everything at once:*
```bash
kubectl apply -f kubernetes/
kubectl apply -f kubernetes/deployments/
kubectl apply -f kubernetes/services/
kubectl apply -f kubernetes/ingress/
```

## 4. Verification Commands

Check the status of your deployments:

```bash
# Get Pods
kubectl get pods -n cloud-native-ai-hrms

# Get Services
kubectl get svc -n cloud-native-ai-hrms

# Get Ingress
kubectl get ingress -n cloud-native-ai-hrms
```

## 5. Access URLs

The Frontend and Gateway are exposed using `NodePort` services.

- **Frontend UI**: `http://localhost:30080`
- **Gateway API**: `http://localhost:30081`

*(Note: On some systems like Docker Desktop for Windows/Mac, `localhost` maps directly to the Node IP. If using Minikube, you may need to use `minikube ip` instead of `localhost`.)*

## 6. Troubleshooting

- **ImagePullBackOff**: Your cluster cannot find the local image. Ensure you built the images using `docker compose build` *inside* the environment your cluster shares. For example, `kind` requires loading the image: `kind load docker-image devops_saas-frontend:latest`.
- **CrashLoopBackOff**: A container is starting but immediately exiting. Check the logs: `kubectl logs <pod-name> -n cloud-native-ai-hrms`.
- **Service DNS issues**: Internal services cannot resolve each other. Ensure all services are deployed in the same `cloud-native-ai-hrms` namespace.
- **NodePort not accessible**: Verify your cluster networking supports `localhost` forwarding, or check your specific local cluster's IP (e.g., `minikube ip`).
