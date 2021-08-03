#!/bin/sh
SCRIPT=$(readlink -f "$0")
CWD=$(dirname "$SCRIPT")
docker run -v ${CWD}:/shared --rm openapitools/openapi-generator-cli generate --generator-name html2 --output /shared --input-spec /shared/openapi.yaml