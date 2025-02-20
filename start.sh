# Stop old docker
docker compose down -v

# Building
docker compose build

# Start docker compose with env variables - detached
docker compose --env-file config/.env.dev up -d