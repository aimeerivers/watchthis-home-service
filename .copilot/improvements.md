# Refactoring and Best Practices Recommendations for watchthis-home-service

## Project Status Overview

The `watchthis-home-service` is a minimal frontend service that provides a landing page with authentication integration. While the code is functional and follows basic patterns, there are several areas for improvement to bring it in line with modern Node.js/Express best practices and to match the quality level of `watchthis-user-service`.

## Critical Improvements Needed

### 1. Security Headers Implementation

**Current Issue**: Missing security headers
**Priority**: HIGH

The service lacks basic security headers that should be standard for any web application.

**Solution**:
```typescript
// Add to src/app.ts
import helmet from "helmet";

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles for TailwindCSS
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'"],
      },
    },
  })
);
```

**Dependencies to add**:
```bash
npm install helmet
npm install --save-dev @types/helmet
```

### 2. Error Handling and Logging Improvements

**Current Issue**: Silent failures in authentication middleware
**Priority**: HIGH

The current `findUserFromSession` middleware silently catches all errors, which makes debugging difficult.

**Current code**:
```typescript
try {
  const response = await fetch(userServiceUrl + "/api/v1/session", {
    method: "GET",
    headers: {
      Cookie: `connect.sid=${sessionCookie}`,
    },
  });

  if (response.ok) {
    const data = (await response.json()) as SessionData;
    req.user = data.user;
  }
  return next();
} catch {
  return next();
}
```

**Better approach**:
```typescript
try {
  const response = await fetch(userServiceUrl + "/api/v1/session", {
    method: "GET",
    headers: {
      Cookie: `connect.sid=${sessionCookie}`,
    },
    signal: AbortSignal.timeout(5000), // 5-second timeout
  });

  if (response.ok) {
    const data = (await response.json()) as SessionData;
    req.user = data.user;
  } else {
    console.log(`Session validation failed: ${response.status}`);
  }
  return next();
} catch (error) {
  console.error("Session validation error:", error instanceof Error ? error.message : "Unknown error");
  return next();
}
```

### 3. Health Check Endpoint

**Current Issue**: No health monitoring capability
**Priority**: MEDIUM

Add a health check endpoint similar to the user service for monitoring and service discovery.

**Solution**:
```typescript
// Add to src/app.ts
app.get("/health", async (req, res) => {
  try {
    // Test connectivity to user service
    const userServiceHealthUrl = `${userServiceUrl}/health`;
    const response = await fetch(userServiceHealthUrl, {
      signal: AbortSignal.timeout(5000),
    });
    
    const userServiceStatus = response.ok ? "healthy" : "unhealthy";
    
    res.json({
      service: packageJson.name,
      version: packageJson.version,
      status: "healthy",
      timestamp: new Date().toISOString(),
      dependencies: {
        userService: userServiceStatus,
      },
    });
  } catch (error) {
    res.status(503).json({
      service: packageJson.name,
      version: packageJson.version,
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
```

### 4. Input Validation and Security

**Current Issue**: No validation for callback URLs
**Priority**: HIGH

The service accepts callback URLs without validation, which could lead to open redirect vulnerabilities.

**Solution**:
```typescript
// Create src/middleware/validation.ts
import type { NextFunction, Request, Response } from "express";

export const validateCallbackUrl = (req: Request, res: Response, next: NextFunction) => {
  const { callbackUrl } = req.query;
  
  if (callbackUrl && typeof callbackUrl === "string") {
    try {
      const url = new URL(callbackUrl);
      const baseUrl = new URL(process.env.BASE_URL ?? "http://localhost:7279");
      
      // Only allow same origin or user service URLs
      const userServiceUrl = new URL(process.env.USER_SERVICE_URL ?? "http://localhost:8583");
      
      if (url.origin !== baseUrl.origin && url.origin !== userServiceUrl.origin) {
        console.warn(`Invalid callback URL rejected: ${callbackUrl}`);
        return res.status(400).send("Invalid callback URL");
      }
    } catch (error) {
      console.warn(`Malformed callback URL rejected: ${callbackUrl}`);
      return res.status(400).send("Invalid callback URL format");
    }
  }
  
  next();
};
```

### 5. Code Organization and Structure

**Current Issue**: Missing utilities and middleware organization
**Priority**: MEDIUM

Following the pattern from user-service, create proper directory structure:

```
src/
├── middleware/
│   └── validation.ts
├── utils/
│   └── asyncHandler.ts
├── app.ts
├── auth.ts
└── server.ts
```

**Create src/utils/asyncHandler.ts**:
```typescript
import type { NextFunction, Request, Response } from "express";

export const asyncHandler = <T extends Request = Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: T, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```

### 6. Enhanced Testing

**Current Issue**: Minimal test coverage
**Priority**: MEDIUM

The current tests only cover basic functionality. Add tests for:

1. Authentication integration
2. Service failure scenarios
3. Callback URL validation
4. Health endpoint

**Enhanced test structure**:
```typescript
// test/app.test.ts additions
describe("Authentication Integration", () => {
  it("should handle user service unavailability gracefully", async () => {
    // Mock user service down
    const res = await request(app).get("/");
    assert.equal(res.statusCode, 200);
    assert.ok(res.text.includes("Welcome, guest!"));
  });
  
  it("should validate callback URLs", async () => {
    const res = await request(app).get("/?callbackUrl=https://evil.com");
    assert.equal(res.statusCode, 400);
  });
});

describe("Health Check", () => {
  it("should return health status", async () => {
    const res = await request(app).get("/health");
    assert.equal(res.statusCode, 200);
    const health = JSON.parse(res.text);
    assert.equal(health.service, "watchthis-home-service");
  });
});
```

### 7. Environment Configuration Improvements

**Current Issue**: Limited environment variable validation
**Priority**: LOW

Add validation for required environment variables and better defaults.

**Solution**:
```typescript
// Add to src/app.ts or create src/config.ts
const validateEnvironment = () => {
  const baseUrl = process.env.BASE_URL ?? "http://localhost:7279";
  const userServiceUrl = process.env.USER_SERVICE_URL ?? "http://localhost:8583";
  
  try {
    new URL(baseUrl);
    new URL(userServiceUrl);
  } catch (error) {
    throw new Error(`Invalid URL configuration: ${error}`);
  }
  
  return { baseUrl, userServiceUrl };
};

const config = validateEnvironment();
```

## Recommended Implementation Order

1. **Security Headers** (helmet.js) - Quick win, high impact
2. **Input Validation** - Callback URL validation middleware
3. **Error Handling** - Better logging and timeout handling
4. **Health Check** - Monitoring and service discovery
5. **Code Organization** - Directory structure and utilities
6. **Enhanced Testing** - Better coverage of edge cases
7. **Environment Validation** - Configuration validation

## Dependencies to Add

```json
{
  "dependencies": {
    "helmet": "^8.1.0"
  },
  "devDependencies": {
    "@types/helmet": "^4.0.0"
  }
}
```

## Quality Checklist

After implementing these improvements, ensure:

- [ ] `npm run build` passes
- [ ] `npm run test` passes
- [ ] `npm run lint` passes
- [ ] `npm run format` passes
- [ ] Health endpoint responds correctly
- [ ] Security headers are present
- [ ] Callback URL validation works
- [ ] Service failure scenarios are handled gracefully

## Alignment with watchthis-user-service

These improvements will bring the home service in line with the user service in terms of:

- Security practices (helmet, input validation)
- Error handling patterns
- Code organization
- Testing standards
- Monitoring capabilities

The home service should remain simpler than the user service as it has fewer responsibilities, but it should follow the same quality standards and patterns.
