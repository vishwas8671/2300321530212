# Logging Middleware

A promise-based, reusable, structured logging utility designed for the Campus Notifications Platform. It transmits structured logs to the AffordMed Logs API.

## Directory Structure

```
logging_middleware/
├── logger.js         # Core logging function
├── constants.js      # Validation constants (levels, stacks, packages)
├── logger.test.js    # Unit tests
└── README.md         # Documentation
```

## Features

- **Input Validation:** Restricts logs to predefined levels, stacks, and validates package names and messages.
- **Bearer Token Auth:** Automatically attaches environment-configured Bearer tokens in headers.
- **Failover / Retry:** Retries log transmission exactly once on failure before falling back to local console logging to prevent data loss.
- **Non-blocking Promise Interface:** Built using JS Promises.

## Environment Variables

The logger depends on the following environment variables (automatically parsed by dotenv/Next config in projects):

- `ACCESS_TOKEN` / `NEXT_PUBLIC_ACCESS_TOKEN`: Bearer token for authentication.
- `LOGS_API_URL` / `NEXT_PUBLIC_LOGS_API_URL`: Endpoint of the AffordMed Logs API. (Defaults to `http://4.224.186.213/evaluation-service/logs`).

## Usage

Import the `log` function into your Node.js code:

```javascript
const { log } = require('../logging_middleware/logger');

// Usage example
await log(
  "backend",                         // Stack: "frontend" | "backend"
  "info",                            // Level: "debug" | "info" | "warn" | "error" | "fatal"
  "service",                         // Package Name
  "Notifications fetched successfully" // Message
);
```

## Running Tests

Run the built-in test suite using standard Node.js (no external dependencies needed):

```bash
node logger.test.js
```
