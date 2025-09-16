# watchthis-home-service

Home service for WatchThis - Web interface and service orchestration

## Overview

The watchthis-home-service provides the main web interface for the WatchThis application and orchestrates communication between other microservices. It handles:

- **Web UI**: Session-based authentication for browser users
- **Service Integration**: Converts web sessions to JWT tokens for API calls
- **API Orchestration**: Calls sharing, inbox, and media services on behalf of users

## Architecture Integration

This service acts as a bridge between the web UI (which uses sessions) and the microservice APIs (which use JWT):

1. Users authenticate via web sessions in the browser
2. Home service converts sessions to JWT tokens using `/api/v1/auth/session-to-jwt`
3. Home service uses JWT tokens to call other service APIs
4. Results are presented in the web interface

## Getting started

### Environment Variables

All service URLs are configured via environment variables. Copy `.env.example` to `.env` and adjust as needed.

### Install Dependencies

Install npm dependencies

```bash
npm install
```

## Build the source code

```bash
npm run build
```

## Run unit tests

```bash
npm run test
```

## Build CSS

```bash
npm run tailwind:css
```

## Run the server locally

```bash
npm run start
```

Visit http://localhost:7279 in your browser

## Run in development mode

```bash
npm run dev
```

This will automatically rebuild the source code and restart the server for you.

## Service Integration

### JWT Authentication Pattern

When calling other WatchThis service APIs, use this pattern to convert web sessions to JWT tokens:

```javascript
// Get JWT tokens from user session
const response = await fetch(`${USER_SERVICE_URL}/api/v1/auth/session-to-jwt`, {
  headers: {
    Cookie: req.headers.cookie, // Forward session cookie
  },
});

if (!response.ok) {
  // Handle authentication error - redirect to login
  return res.redirect("/login");
}

const { data } = await response.json();
const { accessToken } = data;

// Use JWT token to call other services
const sharingResponse = await fetch(`${SHARING_SERVICE_URL}/api/v1/shares/received`, {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

## Format code

The project uses ESLint and Prettier to ensure consistent coding standards.

```bash
npm run lint
npm run format
npm run package:lint
```

- `lint` will check for errors and fix formatting in `.ts` and `.js` files.
- `format` will apply format rules to all possible files.
- `package:lint` will warn of any inconsistencies in the `package.json` file.
