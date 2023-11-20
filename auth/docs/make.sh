#!/bin/sh
SCRIPT=$(readlink -f "$0")
CWD=$(dirname "$SCRIPT")
docker run --rm -v ${CWD}:/shared openapitools/openapi-generator-cli generate --generator-name html2 --output /shared --input-spec /shared/openapi.yaml
docker run --rm -v ${CWD}:/shared --entrypoint=bash openapitools/openapi-generator-cli -c 'shopt -s dotglob && chown -R 1000 /shared'
