# AWS EKS Infrastructure

This Terraform setup provisions:

- VPC
- Public Subnets
- Internet Gateway
- Route Tables
- IAM Roles
- EKS Cluster
- Managed Node Group

## Commands

```bash
terraform init
terraform fmt
terraform validate
terraform plan
```

## Important

terraform apply is intentionally NOT executed in this repository to avoid AWS costs.

Estimated monthly cost:
- EKS Control Plane: ~$73/month
- EC2 worker nodes extra

This project is for DevOps portfolio demonstration and Infrastructure as Code practices.
