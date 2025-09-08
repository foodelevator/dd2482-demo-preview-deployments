Manual setup on target server:

Install docker

```sh
git clone git@github.com:foodelevator/dd2482-demo-preview-deployments.git
cd dd2482-demo-preview
docker compose -f infra/traefik.compose.yaml up -d
```
