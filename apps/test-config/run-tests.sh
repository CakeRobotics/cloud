#!/bin/sh

SERVICE_NAME=apps

set -e
SCRIPT=$(readlink -f "$0")
CWD=$(dirname "$SCRIPT")
cd ${CWD}

docker-compose -f dependencies.yaml up -d

set +e
docker-compose -f main.yaml up --build --exit-code-from ${SERVICE_NAME}
EXITCODE=$?

set -e
docker-compose -f main.yaml stop
docker-compose -f dependencies.yaml stop
docker-compose -f main.yaml down
docker-compose -f dependencies.yaml down

exit ${EXITCODE}
