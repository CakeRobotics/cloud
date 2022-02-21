# Testing Guide

## Intro

Microservices are cool but testing them is a pain in the butt.
Any microservice usually depends on multiple other services and databases that should be up and running before any useful testing can be done.
This directory contains files and scripts that help with the problem.

Two slightly different methods are introduced. This method is good for CI, and the second method is good for development.

## Method 1. All in docker

Everything is dockerized in this method; both dependencies, and the app itself.
This means you can't attach debuggers.
It is slower too, because it takes some extra time to start/stop dependencies each time, and to build the main app image.
Also, we're currently building the app entirely inside docker, which means modifying package.json creates a big cache invalidation.
The pros of this method are that it doesn't need installing nodejs on the host, and it's also more reproducible.

To use this method, make sure that Docker and Docker Compose are installed. Then just run this script:
```
./run-tests.sh
```

The return code from this command can be used in CI to find out whether the tests were passed or failed.
Before finishing, the script removes residuals like docker containers and networks created for running the tests.

## Method 2. Dependencies in docker, main app on host

This method is better for debugging. You'll need to open a terminal for dependencies. Run this to start them:
```
./run-tests
```

In another terminal, `cd` to project main directory and run:
```
yarn
yarn test-local
```

Note: You don't have to restart the dependencies each time you run the tests.

Test configurations can be found in `dependencies.yaml` and `/.env.test`.
