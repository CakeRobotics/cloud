#!/bin/sh

SERVICE_NAME=devices

set -e
SCRIPT=$(readlink -f "$0")
CWD=$(dirname "$SCRIPT")
cd ${CWD}

docker-compose -f dependencies.yaml up -d

sleep 10

set +e
docker-compose -f main.yaml up --build --exit-code-from ${SERVICE_NAME}
EXITCODE=$?

set -e
docker-compose -f main.yaml down --remove-orphans
docker-compose -f dependencies.yaml down --remove-orphans

exit ${EXITCODE}
