# Phase 6 – Monitoring Port‑Access Fix

## Goal
Make Prometheus (NodePort 30090) and Grafana (NodePort 30300) reachable directly from the host browser, while keeping the existing namespace `cloud-native-ai-hrms`, frontend (30080) and gateway (30081) unchanged.

## Current Issue
The k3d cluster was created with only the load‑balancer ports `30080` and `30081`. Consequently the NodePort services for Prometheus (`30090`) and Grafana (`30300`) are **not exposed** on the host. Access works only via `kubectl port-forward`.

## Safe Fix Strategy
1. **Re‑create the k3d cluster** with all required port mappings.
2. **Import** the locally built Docker images into the new cluster.
3. **Re‑apply** the existing Kubernetes manifests (`kubernetes/` and `monitoring/`).
4. **Add** a missing Grafana Service manifest (service.yaml) if it does not exist.
5. Verify that all services show the expected NodePort mappings.

This approach avoids deleting any manifests or changing the application code. Only the cluster itself is recreated, which is safe because all resources are declarative and will be re‑applied.

---
## Open Questions
> [!IMPORTANT] No open questions – the plan is concrete.

---
## Proposed Changes
### 1. Cluster recreation (no file changes)
```bash
# Delete existing cluster (preserves local Docker images on host)
k3d cluster delete devops-saas

# Re‑create with required ports
k3d cluster create devops-saas \
  -p "30080:30080@loadbalancer" \
  -p "30081:30081@loadbalancer" \
  -p "30090:30090@loadbalancer" \
  -p "30300:30300@loadbalancer"
```

### 2. Image import (no file changes)
```bash
k3d image import devops_saas-frontend devops_saas-gateway-service \
  devops_saas-auth-service devops_saas-employee-service \
  devops_saas-aiops-service -c devops-saas
```
*(The `-c devops-saas` flag loads the images into the newly created `devops-saas` cluster.)*

### 3. Manifest re‑apply (existing files)
```bash
kubectl apply -f kubernetes/ -n cloud-native-ai-hrms
kubectl apply -f monitoring/ -n cloud-native-ai-hrms
```

### 4. Grafana Service (new file if missing)
Create `monitoring/grafana/service.yaml`:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: grafana-service
  namespace: cloud-native-ai-hrms
  labels:
    app: grafana
spec:
  type: NodePort
  selector:
    app: grafana
  ports:
    - protocol: TCP
      port: 3000        # container port
      targetPort: 3000
      nodePort: 30300   # host port
```
(If the file already exists, ensure the `nodePort` is set to `30300`.)

### 5. Prometheus Service (verify)
Ensure `monitoring/prometheus/service.yaml` has `nodePort: 30090`.

---
## Verification Plan
1. **Cluster check** – `k3d cluster list` should show the four port mappings.
2. **Service check** – `kubectl get svc -n cloud-native-ai-hrms` must list:
   - `frontend` NodePort 30080
   - `gateway-service` NodePort 30081
   - `prometheus-service` NodePort 30090
   - `grafana-service` NodePort 30300
3. **Browser test** – Open `http://localhost:30090` (Prometheus) and `http://localhost:30300` (Grafana) **without** any `kubectl port-forward`.
4. **Grafana login** – `admin / admin`.
5. **Optional** – Run `curl http://localhost:30090/api/v1/targets` to verify Prometheus is scraping.

---
## Post‑Implementation
After confirming access, continue with the Prometheus metrics integration (exporters, `prom-client` instrumentation) as planned in Phase 6.
