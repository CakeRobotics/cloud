#!/bin/sh

set +e
docker stop auth-db-test || "No test database container was found. No action is required."

set -e
export $(xargs < .env)
docker run --rm -d --name=auth-db-test \
    -v $(pwd)/utils/50-init-tables.sql:/docker-entrypoint-initdb.d/50-init-tables.sql:ro \
    -p 5432:5432 \
    -e POSTGRES_USER=${POSTGRES_USER} \
    -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
    -e POSTGRES_DB=${POSTGRES_DB} \
    postgres

set +e
yarn test
EXITCODE=$?

set -e
docker stop auth-db-test

exit ${EXITCODE}