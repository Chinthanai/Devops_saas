# Monitoring Setup

## Apply Manifests
```bash
kubectl apply -f monitoring/
```

## Access URLs
- **Prometheus**: http://localhost:30090
- **Grafana**: http://localhost:30300 (login: admin / admin)

## Add Prometheus Data Source in Grafana
1. Open Grafana in your browser.
2. Log in with the credentials above.
3. Navigate to **Configuration → Data Sources → Add data source**.
4. Select **Prometheus**.
5. Set the URL to `http://prometheus:9090` (or `http://localhost:30090` for direct access).
6. Click **Save & Test**.

## Basic Troubleshooting
- Verify pods are running: `kubectl get pods -n cloud-native-ai-hrms`.
- Check logs: `kubectl logs <pod-name> -n cloud-native-ai-hrms`.
- Ensure NodePort ports are not blocked by your local firewall.
- If Prometheus has no metrics, confirm the ConfigMap is mounted correctly and the targets are reachable.
