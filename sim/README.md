# Ops notes

## Tests

- A working openshift client is required before running tests. See src/config dir.
- All dependencies must be running before running tests. See test-config/README.md
- To run pipeline tests, set TEST_FULL=1
- Exception scenarios are not covered in tests.
- Watchdogs are not covered in tests.

## Deployment

- No CI/CD for now. Build locally and push to images.cakerobotics.com/sim
- Make sure src/config is set to load correct config. Also make sure kubernetes config file
  is correctly mounted.
