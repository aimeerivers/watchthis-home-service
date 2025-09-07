You are assisting with the watchthis-home-service, a Node.js/Express frontend microservice that serves as the landing page for the WatchThis application ecosystem with authentication integration via the watchthis-user-service.

When working in this codebase:

1. **Frontend Focus**: This is a presentation service - prioritize user experience, service integration, and graceful degradation

2. **TypeScript & ES Modules**: Use proper ES module syntax with `.js` extensions in imports for compiled output

3. **Service Integration**: Always handle user-service communication failures gracefully without breaking the page

4. **Testing**: Test both successful auth integration and service failure scenarios using Node.js test runner and Supertest

5. **Security**: Implement security headers with Helmet, validate callback URLs, handle session cookies securely

6. **Environment Configuration**: Support both development and production with proper defaults for service URLs

7. **Express Patterns**: Keep routes simple and focused on presentation, delegate complex logic to services

8. **Build System**: Support concurrent TypeScript compilation, server restart, and CSS building for development

9. **Code Quality**: Always ensure code passes `npm run build`, `npm run test`, `npm run lint`, and `npm run format`

10. **Microservice Patterns**:
    - Handle user-service unavailability gracefully
    - Don't store or manipulate user data directly
    - Forward authentication concerns to user-service
    - Implement proper timeouts for service calls

Remember: This service is the user's first impression of WatchThis - it should always work even when other services are down. Graceful degradation and reliability are more important than feature richness.
