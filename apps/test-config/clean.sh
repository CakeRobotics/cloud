#!/bin/sh
docker-compose -f main.bridge.yaml stop
docker-compose -f dependencies.base.yaml stop
docker-compose -f main.bridge.yaml down
docker-compose -f dependencies.base.yaml -f dependencies.bridge.yaml down
