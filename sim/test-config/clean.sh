#!/bin/sh
docker-compose -f main.yaml down --remove-orphans
docker-compose -f dependencies.yaml down --remove-orphans
