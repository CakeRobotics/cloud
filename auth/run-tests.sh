#!/bin/sh

set +e
docker stop auth-db-test || echo "No test database container was found. No action is required."

set -e
export $(xargs < .env)
docker run --rm -d --name=auth-db-test \
    -p 5432:5432 \
    -e POSTGRES_USER=${POSTGRES_USER} \
    -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
    -e POSTGRES_DB=${POSTGRES_DB} \
    postgres

set +e
docker run --rm -t \
    -v $(pwd)/.env:/app/.env \
    --entrypoint=/bin/sh \
    --network host \
    images.cakerobotics.com/mostafa/auth:latest \
    -c "cd /app && yarn test"
EXITCODE=$?

set -e
docker stop auth-db-test

exit ${EXITCODE}