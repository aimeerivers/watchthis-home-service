# Copilot Rules for watchthis-home-service

## Project Overview

This is a Node.js/Express frontend service built with TypeScript that serves as the home page for the WatchThis application ecosystem. It provides a simple landing page with authentication integration via the `watchthis-user-service`.

## Architecture & Patterns

### Application Structure

- **Entry Point**: `src/server.ts` - Simple server startup
- **Main App**: `src/app.ts` - Express application configuration and routes
- **Authentication**: `src/auth.ts` - Session validation via user service
- **Views**: `views/` - Pug templates for UI
- **Tests**: `test/` - Node.js test runner with Supertest

### Technology Stack

- **Runtime**: Node.js with ES modules (`"type": "module"`)
- **Framework**: Express.js
- **Authentication**: Session-based via user-service integration
- **Templates**: Pug view engine
- **Styling**: TailwindCSS with PostCSS
- **Testing**: Node.js built-in test runner with Supertest
- **Build**: TypeScript compilation to `dist/` directory

## Code Style & Conventions

### TypeScript Configuration

- Use ES modules throughout (`import/export`)
- Target output to `dist/` directory
- Enable strict type checking
- Use proper interface definitions for user sessions
- Always type Express middleware functions with proper request types

### Authentication & Session Management

- **Session Validation**: Fetch user session from user-service via cookie forwarding
- **User Context**: Populate `req.user` for authenticated users
- **Error Handling**: Gracefully handle auth service failures
- **Environment Variables**: Provide sensible defaults for service URLs

### Service Integration Patterns

- Use fetch API for HTTP requests to user service
- Forward session cookies properly between services
- Handle network failures gracefully without breaking page load
- Use proper typing for service responses

### Route Handling

- Use middleware for session validation
- Pass user context to templates
- Support callback URL forwarding for authentication flows
- Implement health check endpoints for monitoring

### Error Handling

- Use try/catch blocks for all async operations
- Never expose service errors to end users
- Continue page rendering even if auth service is unavailable
- Log errors appropriately for debugging

## Development Conventions

### File Organization

- Keep route definitions in `app.ts`
- Separate authentication logic in `auth.ts`
- Use proper imports with `.js` extension for compiled output
- Keep types and interfaces close to their usage
- Maintain minimal, focused file structure

### Testing Standards

- Use Node.js built-in test runner
- Test route responses and status codes
- Mock external service dependencies when needed
- Test both authenticated and unauthenticated scenarios
- Use Supertest for HTTP endpoint testing

### Environment Configuration

- Use dotenv for environment variable management
- Provide defaults for all environment variables
- Support different service URLs for different environments
- Configure base URL and user service URL properly

### Build & Development

- Use concurrent builds for TypeScript, server, and CSS
- Support watch mode for development
- Separate build and start commands
- Use nodemon for development server restarts
- Build CSS with PostCSS and TailwindCSS

## Security Best Practices

### Session Security

- Never store or manipulate session data directly
- Forward session cookies to user service for validation
- Don't cache or persist user session information
- Validate all authentication responses

### Service Communication

- Use HTTPS in production for service-to-service communication
- Implement proper timeout handling for service calls
- Don't expose user service internals to frontend
- Handle service unavailability gracefully

### Input Validation

- Validate callback URLs to prevent open redirects
- Sanitize any user inputs before passing to services
- Use proper error handling for malformed requests

## API Design

### Endpoint Patterns

- Keep routes simple and focused on presentation
- Delegate authentication logic to user service
- Support callback URL patterns for auth flows
- Provide health check endpoints

### Response Handling

- Return appropriate content types (HTML)
- Implement proper redirects for authentication
- Gracefully degrade when services are unavailable
- Use semantic HTTP status codes

## Performance Considerations

### Service Integration

- Implement reasonable timeouts for service calls
- Avoid blocking the main thread on service failures
- Consider caching strategies for user data if needed
- Handle concurrent requests efficiently

### Static Assets

- Serve static assets efficiently
- Use proper cache headers for CSS/JS
- Optimize TailwindCSS build output

## Testing Guidelines

### Unit Testing

- Test middleware functions independently
- Test service integration with mocked responses
- Test route handlers with different scenarios
- Test error handling paths

### Integration Testing

- Test complete page rendering flows
- Test authentication integration end-to-end
- Test service failure scenarios
- Test callback URL handling

### Test Data Management

- Use realistic test data for URLs and user objects
- Mock external service calls appropriately
- Clean up any test state after tests
- Avoid hardcoded values in tests

## Debugging & Monitoring

### Logging

- Use console.log for development debugging
- Log service integration failures
- Log authentication events for debugging
- Avoid logging sensitive user information

### Error Tracking

- Log service communication errors
- Implement graceful error recovery
- Provide meaningful error context
- Monitor service availability

## Code Quality

### Linting & Formatting

- Use eslint-config-plus-prettier for consistency
- Run linting on all TypeScript files with `npm run lint`
- Use Prettier for code formatting with `npm run format`
- Validate package.json structure with `npm run package:lint`
- Always ensure code passes: `npm run build`, `npm run test`, `npm run lint`, `npm run format`

### Development Workflow

- Always run the full quality check before committing changes:
  ```bash
  npm run build && npm run test
  npm run lint && npm run format
  ```
- Ensure all tests pass before making changes
- Build successfully before deploying
- Maintain consistent code formatting across the project

### Documentation Maintenance

- Update Copilot documentation periodically when new patterns or information are learned
- Keep rules.md, workspace.md, and improvements.md synchronized with actual codebase
- Document new conventions and patterns as they are established
- Review and update documentation during significant refactoring efforts
- Maintain alignment with watchthis-user-service patterns and practices

### Type Safety

- Use proper TypeScript interfaces for user objects
- Type all function parameters and returns
- Use proper typing for service responses
- Avoid `any` types where possible

## Deployment Considerations

### Build Process

- Compile TypeScript to JavaScript
- Build CSS from TailwindCSS sources
- Include all necessary files in distribution
- Support Heroku deployment with Procfile

### Environment Variables

- Document all required environment variables
- Provide development defaults for local development
- Configure proper service URLs for production
- Secure all configuration values

### Service Dependencies

- Handle user service unavailability gracefully
- Implement proper health checks
- Monitor service connectivity
- Plan for service deployment dependencies

## Microservice Patterns

### Service Communication

- Use HTTP for service-to-service communication
- Implement circuit breaker patterns for reliability
- Handle service discovery if needed
- Maintain loose coupling between services

### Data Flow

- User service owns all user data and sessions
- Home service only displays user context
- No shared database between services
- Clear service boundaries and responsibilities

### Error Handling

- Fail gracefully when dependent services are down
- Provide degraded functionality when possible
- Implement proper timeouts and retries
- Log service communication issues appropriately
