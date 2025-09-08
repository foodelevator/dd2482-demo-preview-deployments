Manual setup on target server:

Install docker

```sh
git clone git@github.com:foodelevator/dd2482-demo-preview-deployments.git
cd dd2482-demo-preview
docker compose -f infra/traefik.compose.yaml up -d
```

```sh
sudo apt install postgresql
sudo -u postgres psql -U postgres

create user test password 'test';
create database test owner test;

echo 'host all all 172.16.0.0/12 scram-sha-256' | sudo tee -a /etc/postgresql/17/main/pg_hba.conf
echo "listen_addresses = '*'" | sudo tee -a /etc/postgresql/17/main/postgresql.conf
sudo systemctl restart postgresql
```

