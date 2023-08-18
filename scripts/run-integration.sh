#!/usr/bin/env bash
# scripts/run-integration.sh

DIR="$(cd "$(dirname "$0")" && pwd)"

# Export env vars
export $(grep -v '^#' .env.test | xargs)

docker compose -f ./docker/integration-test-docker.yml up -d
echo '🟡 - Waiting for database to be ready...'
$DIR/wait-for-it.sh "${DATABASE_URL}" -- echo '🟢 - Database is ready!'
npx prisma migrate dev --schema=src/prisma/schema.prisma --name init
jest integration
docker compose -f ./docker/integration-test-docker.yml down
