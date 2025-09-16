# WatchThis - Architectural Plan

_Share media with friends - YouTube videos, music, articles, and more_

## Vision

WatchThis aims to solve the problem of sharing media content with friends by providing a dedicated platform where users can share videos, music, articles, and other media into their friends' "inboxes". When content is consumed, it gets marked as watched, creating a clean and organized way to share and track media consumption among friends.

## Current State

### Existing Services

#### watchthis-home-service

- **Purpose**: Landing page and main dashboard
- **Tech Stack**: Node.js, Express, TypeScript, Pug templates, TailwindCSS
- **Port**: 7279 (development), 17279 (testing)
- **Responsibilities**:
  - User-facing dashboard
  - Session-based web authentication
  - Session-to-JWT conversion for API calls
  - Service orchestration and health monitoring
- **Status**: ✅ Basic implementation complete 🚧 JWT integration needed

#### watchthis-user-service

- **Purpose**: User management and authentication
- **Tech Stack**: Node.js, Express, TypeScript, MongoDB, Passport.js
- **Port**: 8583 (development), 18583 (testing)
- **Responsibilities**:
  - User signup, login, logout
  - Session management (web UI)
  - JWT authentication (APIs)
  - Session-to-JWT bridge conversion
  - User profile management
- **Status**: ✅ Fully implemented with comprehensive JWT authentication system

#### watchthis-media-service

- **Purpose**: Manage shared media items and metadata
- **Tech Stack**: Node.js, Express, TypeScript, MongoDB, Mongoose
- **Port**: 7769 (development), 17769 (testing)
- **Responsibilities**:
  - Store media URLs, titles, descriptions, metadata
  - URL validation and normalization
  - Platform detection (YouTube, generic)
  - Media search and filtering APIs
  - CRUD operations for media items
- **Status**: ✅ Phase 1 Complete! Core functionality implemented
- **Implemented Features**:
  - ✅ Full CRUD API endpoints
  - ✅ MongoDB schema and models
  - ✅ URL validation and normalization
  - ✅ Platform detection (YouTube focus)
  - ✅ Search and filtering capabilities
  - ✅ Comprehensive test suite (80%+ coverage)

#### watchthis-sharing-service

- **Purpose**: Handle the sharing logic between users
- **Tech Stack**: Node.js, Express, TypeScript, MongoDB, Mongoose
- **Port**: 8372 (development), 18372 (testing)
- **Responsibilities**:
  - Create shares (user A shares media X with user B)
  - Manage share status (pending, watched, archived)
  - Handle share permissions and privacy settings
  - Generate share events for other services
- **Status**: ✅ Phase 1 Complete! Core functionality and JWT authentication implemented
- **Implemented Features**:
  - ✅ Service structure and boilerplate
  - ✅ Basic Express app with middleware
  - ✅ Complete MongoDB schema with indexing
  - ✅ Full CRUD API endpoints (all 7 endpoints)
  - ✅ Share status management (pending/watched/archived)
  - ✅ Statistics and analytics endpoints
  - ✅ Comprehensive test suite (31 passing tests)
  - ✅ **JWT-only authentication implementation completed**
  - ✅ **Full integration with user-service JWT validation**
  - 📋 Media service validation (planned for production)

### Current Architecture Patterns

- ✅ Microservice architecture with HTTP communication
- ✅ JWT-based authentication for API services
  - User service provides JWT authentication endpoints (`/api/v1/auth/*`)
  - Access tokens (24h expiry) for API authentication via Authorization header
  - Refresh tokens (7d expiry) for obtaining new access tokens
  - Services validate JWT tokens by calling user service `/api/v1/auth/me` endpoint
  - Stateless authentication enabling better scalability and mobile support
- ✅ Legacy session-based authentication for web interface
  - Session cookies for web UI authentication and backwards compatibility
  - Session validation via `/api/v1/session` endpoint
- ✅ Graceful degradation when services are unavailable
- ✅ Health check endpoints for monitoring
- ✅ TypeScript with ES modules
- ✅ Comprehensive testing with Node.js test runner

## Target Architecture

### Core Services (MVP - Phase 1)

#### watchthis-media-service ✅ COMPLETED

- **Purpose**: Manage shared media items and metadata
- **Priority**: ✅ Complete - Phase 1 Done!
- **Tech Stack**: Node.js, Express, TypeScript, MongoDB
- **Port**: 8584 (development), 18584 (testing)
- **Status**: ✅ Full CRUD API implemented with comprehensive testing

**Completed Features**:

- ✅ Store media URLs, titles, descriptions, metadata
- ✅ URL validation and normalization (YouTube focus)
- ✅ Platform detection and categorization
- ✅ Search and filtering APIs
- ✅ MongoDB schema with Mongoose ODM
- ✅ Comprehensive test suite

**Key Endpoints**:

```
POST   /api/v1/media              # Add new media ✅
GET    /api/v1/media/:id          # Get media details ✅
GET    /api/v1/media/extract      # Extract metadata from URL ✅
PATCH  /api/v1/media/:id          # Update media metadata ✅
DELETE /api/v1/media/:id          # Remove media ✅
GET    /api/v1/media/search       # Search media items ✅
```

#### watchthis-sharing-service ✅ COMPLETED

- **Purpose**: Handle the sharing logic between users
- **Priority**: ✅ Complete - Phase 1 Done!
- **Tech Stack**: Node.js, Express, TypeScript, MongoDB
- **Port**: 8372 (development), 18372 (testing)
- **Status**: ✅ Full CRUD API implemented with comprehensive testing

**Completed Features**:

- ✅ Complete MongoDB schema with proper indexing
- ✅ Full user validation and error handling
- ✅ Share status tracking (pending/watched/archived)
- ✅ Statistics and analytics endpoints
- ✅ Comprehensive test suite (31 passing tests)

**Key Endpoints** ✅ Implemented:

```
POST   /api/v1/shares             # Create new share ✅
GET    /api/v1/shares/:id         # Get share details ✅
PATCH  /api/v1/shares/:id         # Update share status ✅
DELETE /api/v1/shares/:id         # Delete share ✅
GET    /api/v1/shares/sent        # Get shares sent by user ✅
GET    /api/v1/shares/received    # Get shares received by user ✅
GET    /api/v1/shares/stats       # Get sharing statistics ✅
```

**Remaining Integration**: Media service validation (for production deployment)

#### watchthis-inbox-service 📋 PLANNED

- **Purpose**: Manage user's personal inbox of shared content
- **Priority**: 🔴 Critical - Implement After Sharing Service
- **Tech Stack**: Node.js, Express, TypeScript, MongoDB
- **Port**: TBD (suggested: 7378)
- **Status**: 📋 Not yet started - depends on sharing service completion
- **Responsibilities**:
  - Aggregate shares into user-specific inboxes
  - Track watch status and progress
  - Provide inbox filtering and organization
  - Handle read/unread states
  - Generate personalized inbox views

**Key Endpoints**:

```
GET    /api/v1/inbox              # Get user's inbox
GET    /api/v1/inbox/unread       # Get unread items
PATCH  /api/v1/inbox/:id/read     # Mark item as read
DELETE /api/v1/inbox/:id          # Remove from inbox
GET    /api/v1/inbox/stats        # Get inbox statistics
```

### Enhancement Services (Phase 2)

#### watchthis-notification-service

- **Purpose**: Handle all notifications across the platform
- **Priority**: 🟠 High - Enhance user experience
- **Tech Stack**: Node.js, Express, TypeScript, Redis, WebSocket
- **Port**: TBD (suggested: 7879)
- **Responsibilities**:
  - Email notifications for new shares
  - Real-time notifications (WebSocket/Server-Sent Events)
  - Push notifications (future mobile app)
  - Notification preferences management
  - Delivery tracking and retry logic

#### watchthis-api-gateway

- **Purpose**: Central API routing and management
- **Priority**: 🟠 High - Simplify client integration
- **Tech Stack**: Node.js, Express, TypeScript
- **Responsibilities**:
  - Route requests to appropriate services
  - Handle authentication/authorization
  - Provide rate limiting and caching
  - Aggregate responses from multiple services
  - API versioning and documentation

### Future Services (Phase 3)

#### watchthis-analytics-service

- **Purpose**: Track usage patterns and generate insights
- **Priority**: 🟡 Medium - Data-driven improvements
- **Responsibilities**:
  - Track user behavior and media consumption
  - Generate viewing statistics and reports
  - Provide recommendation algorithms
  - User engagement analytics

#### watchthis-social-service

- **Purpose**: Social features and friend management
- **Priority**: 🟡 Medium - Community building
- **Responsibilities**:
  - Friend requests and management
  - Groups and shared lists
  - Comments and reactions
  - Social activity feeds

## Event-Driven Architecture

### Core Events

```typescript
// Media Events
interface MediaCreatedEvent {
  type: "MEDIA_CREATED";
  mediaId: string;
  userId: string;
  url: string;
  metadata: MediaMetadata;
  timestamp: Date;
}

// Sharing Events
interface MediaSharedEvent {
  type: "MEDIA_SHARED";
  shareId: string;
  fromUserId: string;
  toUserId: string;
  mediaId: string;
  message?: string;
  timestamp: Date;
}

interface MediaWatchedEvent {
  type: "MEDIA_WATCHED";
  shareId: string;
  userId: string;
  mediaId: string;
  watchDuration?: number;
  timestamp: Date;
}

// User Events
interface UserRegisteredEvent {
  type: "USER_REGISTERED";
  userId: string;
  email: string;
  timestamp: Date;
}
```

### Event Flow Examples

#### Sharing Workflow

1. User shares media → `MediaSharedEvent`
2. Inbox Service receives event → Updates recipient's inbox
3. Notification Service receives event → Sends notification
4. Analytics Service receives event → Records sharing activity

#### Watch Workflow

1. User marks as watched → `MediaWatchedEvent`
2. Sharing Service updates share status
3. Analytics Service records consumption
4. Notification Service may notify sharer

## Authentication Architecture

### Session-to-JWT Bridge Strategy ✅ RECOMMENDED

**Philosophy**: Clean separation of concerns - web UI uses sessions, all APIs use JWT. Bridge between them via session-to-JWT conversion.

#### Authentication Layers

**Web UI Layer (Session-based)**

- Traditional web pages with server-side rendering
- Login redirects and session cookies managed by user service
- Familiar user experience for web browsers
- Used by: Home service dashboard, future service web interfaces

**API Layer (JWT-only)**

- All API services exclusively use JWT authentication
- Stateless, scalable, mobile-ready
- No hybrid complexity - single auth method per service
- Used by: All service APIs, mobile apps, service-to-service calls

### User Authentication Flows

#### Web User Journey

1. **Session Login**: User visits home service → redirected to user service login
2. **Session Creation**: User service creates session cookie after successful login
3. **JWT Conversion**: When home service needs to call APIs, it converts session to JWT
4. **API Calls**: Home service uses JWT tokens to call other services
5. **Clean Separation**: Web pages use sessions, API calls use JWT

```typescript
// Home service flow
app.get("/dashboard", ensureAuthenticated, async (req, res) => {
  // 1. User has session (from session middleware)

  // 2. Convert session to JWT when needed for API calls
  const tokens = await userService.getJWTFromSession(req.headers.cookie);

  // 3. Use JWT to call other services
  const shares = await sharingService.getShares(tokens.accessToken);
  const inbox = await inboxService.getInbox(tokens.accessToken);

  // 4. Render page with data
  res.render("dashboard", { shares, inbox });
});
```

#### Mobile App Journey

1. **Direct JWT Login**: App calls `/api/v1/auth/login` directly
2. **Pure JWT Flow**: All communication uses JWT tokens
3. **No Sessions**: Completely stateless authentication
4. **Token Management**: App handles token refresh automatically

### Session-to-JWT Bridge Implementation

#### User Service: Session-to-JWT Endpoint

```typescript
// GET /api/v1/auth/session-to-jwt
// Converts current session to JWT tokens
export const sessionToJWT = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      res.status(401).json({
        success: false,
        error: { code: "NO_SESSION", message: "No valid session found" },
      });
      return;
    }

    // Generate JWT tokens for the authenticated user
    const tokens = generateTokenPair(req.user);

    res.json({
      success: true,
      data: {
        user: { _id: req.user._id, username: req.user.username },
        ...tokens,
      },
    });
  } catch (error) {
    console.error("Session to JWT conversion error:", error);
    res.status(500).json({
      success: false,
      error: { code: "CONVERSION_ERROR", message: "Failed to convert session to JWT" },
    });
  }
};
```

#### Home Service: JWT Token Acquisition

```typescript
class UserServiceClient {
  async getJWTFromSession(sessionCookie: string): Promise<JWTTokens | null> {
    try {
      const response = await fetch(`${userServiceUrl}/api/v1/auth/session-to-jwt`, {
        method: "GET",
        headers: { Cookie: sessionCookie },
      });

      if (response.ok) {
        const { data } = await response.json();
        return {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresIn: data.expiresIn,
        };
      }
      return null;
    } catch (error) {
      console.error("Failed to get JWT from session:", error);
      return null;
    }
  }
}
```

#### Service API Pattern: JWT-Only Authentication

All API services use this simple, consistent pattern:

```typescript
// JWT-only authentication middleware
export const requireJWT = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

  if (!token) {
    res.status(401).json({
      success: false,
      error: { code: "NO_TOKEN", message: "JWT token required" }
    });
    return;
  }

  try {
    // Validate token with user service
    const response = await fetch(`${userServiceUrl}/api/v1/auth/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.ok) {
      const { data } = await response.json();
      req.user = data.user;
      next();
    } else {
      res.status(401).json({
        success: false,
        error: { code: "INVALID_TOKEN", message: "Invalid JWT token" }
      });
    }
  } catch (error) {
    console.error("JWT validation error:", error);
    res.status(401).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: "Token validation failed" }
    });
  }
};

### JWT Token Management ✅ IMPLEMENTED

#### User Service JWT Endpoints

```

POST /api/v1/auth/login # Direct login → returns JWT tokens (for mobile)
POST /api/v1/auth/refresh # Refresh access token using refresh token  
GET /api/v1/auth/me # Get current user info (requires JWT token)
GET /api/v1/auth/session-to-jwt # Convert session to JWT tokens (for web services)

````

#### Token Configuration

```bash
# Access token: Short-lived for security
JWT_EXPIRES_IN=24h

# Refresh token: Longer-lived for convenience
JWT_REFRESH_EXPIRES_IN=7d

# JWT secret: Auto-generated if not provided
JWT_SECRET=your-secret-key
````

#### JWT Authentication Flows

**Direct JWT Login (Mobile Apps)**

1. **Login**: App sends credentials to `/api/v1/auth/login`
2. **Token Pair**: User service returns access token (24h) + refresh token (7d)
3. **API Requests**: App includes access token in `Authorization: Bearer <token>` header
4. **Token Validation**: Services validate tokens by calling user service `/api/v1/auth/me`
5. **Token Refresh**: Use refresh token at `/api/v1/auth/refresh` before access token expires

**Session-to-JWT Bridge (Web Services)**

1. **Session**: Web service has user session cookie
2. **Conversion**: Service calls `/api/v1/auth/session-to-jwt` with session cookie
3. **JWT Tokens**: User service returns JWT tokens for the session user
4. **API Calls**: Web service uses JWT tokens to call other APIs

### Service Authentication Status

- ✅ **User Service**: JWT endpoints implemented and tested + session-to-JWT bridge
- ✅ **Home Service**: Session-based web UI + JWT for API calls (session-to-JWT bridge ready)
- ✅ **Sharing Service**: **JWT-only APIs completed** - Full JWT authentication implemented
- 📋 **Media Service**: Needs service-to-service authentication (JWT service tokens)
- 📋 **Inbox Service**: Should implement JWT-only from start
- 📋 **Future Services**: Should implement JWT-only pattern from start

### Implementation Strategy

#### Phase 1: Complete JWT Infrastructure ✅

- JWT endpoints implemented in user service
- Session-to-JWT bridge endpoint ready

#### Phase 2: Migrate Services to JWT-Only ✅ COMPLETED

- ✅ **Sharing Service**: JWT-only middleware implemented and tested (31 tests passing)
- 📋 **Home Service**: Add session-to-JWT conversion for API calls
- ✅ **End-to-end JWT flow**: Complete authentication architecture ready

#### Phase 3: New Services JWT-First

- **Inbox Service**: Implement with JWT-only authentication from start
- **Media Service**: Add service-to-service JWT authentication
- Establish JWT-only pattern for all new services

#### Phase 4: Service-to-Service Authentication

- Implement service credential management
- Add service-to-service JWT tokens for internal API security
- Complete zero-trust service architecture

### Benefits of Session-to-JWT Bridge

✅ **Clean Architecture**: Each service has single authentication method  
✅ **No Hybrid Complexity**: APIs are purely JWT, no dual auth logic  
✅ **Familiar Web UX**: Traditional session login flow preserved  
✅ **Mobile Ready**: Pure JWT flow available for apps  
✅ **Scalable**: All APIs are stateless with JWT tokens  
✅ **Future-Proof**: Clear JWT-first architecture for new services  
✅ **Simple Migration**: Convert existing services to JWT-only one at a time

## Database Strategy

### Service-Specific Databases

#### User Service - MongoDB ✅ IMPLEMENTED

```javascript
// User collection
{
  _id: ObjectId,
  username: String,
  email: String,
  passwordHash: String,
  profile: {
    displayName: String,
    avatar: String,
    preferences: Object
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Media Service - MongoDB ✅ IMPLEMENTED

```javascript
// Media collection - Current Schema
{
  _id: ObjectId,
  url: String,                    // Original URL
  normalizedUrl: String,          // Cleaned/normalized URL
  platform: String,              // 'youtube', 'generic', etc.
  title: String,                  // Extracted or provided title
  description: String,            // Media description
  thumbnail: String,              // Thumbnail image URL
  metadata: {
    duration: Number,             // Duration in seconds
    author: String,               // Content creator
    publishedAt: Date,            // When content was published
    tags: [String],               // Content tags/categories
    viewCount: Number,            // View count if available
    // Platform-specific metadata
    youtubeId: String,            // For YouTube videos
    channelId: String,            // YouTube channel ID
    // Generic metadata
    siteName: String,             // Website name for articles
    favicon: String               // Site favicon URL
  },
  createdBy: ObjectId,            // User who added this media
  createdAt: Date,
  updatedAt: Date
}
```

#### Sharing Service - MongoDB ✅ IMPLEMENTED

```javascript
// Shares collection - Planned Schema
{
  _id: ObjectId,
  mediaId: ObjectId,              // Reference to media service
  fromUserId: ObjectId,           // User sharing the media
  toUserId: ObjectId,             // User receiving the share
  message: String,                // Optional message with share
  status: String,                 // 'pending', 'watched', 'archived'
  watchedAt: Date,                // When marked as watched
  watchDuration: Number,          // How long they watched (optional)
  createdAt: Date,
  updatedAt: Date,

  // Indexes needed:
  // - { fromUserId: 1, createdAt: -1 }  # Get sent shares
  // - { toUserId: 1, status: 1, createdAt: -1 }  # Get received shares
  // - { mediaId: 1 }  # Get shares for specific media
}
```

#### Inbox Service - MongoDB 🚧 TO IMPLEMENT

```javascript
// Inbox items (denormalized for performance)
{
  _id: ObjectId,
  userId: ObjectId,
  shareId: ObjectId,
  mediaId: ObjectId,
  media: {
    title: String,
    thumbnail: String,
    platform: String,
    url: String
  },
  sharedBy: {
    userId: ObjectId,
    displayName: String,
    avatar: String
  },
  message: String,
  status: String,
  isRead: Boolean,
  readAt: Date,
  sharedAt: Date,
  updatedAt: Date
}
```

## Frontend Enhancement Plan

### Enhanced Home Service Dashboard

#### Current Features

- ✅ Landing page with authentication
- ✅ User session display
- ✅ Health monitoring

#### Planned Features

##### Phase 1: Core Dashboard

- **Inbox Overview**: Show unread count and recent items
- **Quick Share**: Simple form to share media URLs
- **Recent Activity**: Show recently shared and watched items
- **Navigation**: Links to full inbox, sharing history, profile

##### Phase 2: Rich Interface

- **Real-time Updates**: WebSocket connection for live notifications
- **Media Previews**: Embedded thumbnails and metadata
- **Filtering**: By platform, status, date
- **Search**: Find specific shared content

##### Phase 3: Advanced Features

- **Recommendations**: Suggested content based on history
- **Social Features**: Friend activity, groups
- **Analytics Dashboard**: Personal usage statistics

### Mobile App Preparation

#### API Design Principles

- **RESTful Endpoints**: Consistent HTTP methods and status codes
- **JSON Responses**: Standardized response format
- **Authentication**: JWT tokens for mobile sessions
- **Pagination**: Cursor-based pagination for performance
- **Caching**: ETags and cache headers
- **Offline Support**: Optimistic updates and sync

#### Standardized Response Format

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: {
    hasNext: boolean;
    cursor?: string;
    total?: number;
  };
}
```

## Implementation Roadmap

### ✅ COMPLETED: Phase 1A - Media Service (Target: 4-6 weeks)

#### ✅ Weeks 1-2: Media Service Foundation

- ✅ Set up service structure (using existing templates)
- ✅ Implement basic media storage and retrieval
- ✅ Add URL validation and normalization
- ✅ Create comprehensive tests
- ✅ Deploy and integrate with development environment

#### ✅ Additional Media Service Features Completed

- ✅ MongoDB integration with Mongoose ODM
- ✅ Platform detection (YouTube, generic)
- ✅ Search and filtering APIs
- ✅ Full CRUD operations
- ✅ Comprehensive test suite with 80%+ coverage

### 🚧 IN PROGRESS: Phase 1B - Sharing Service (Target: 2-3 weeks)

#### Week 1: Core Sharing Implementation ✅ COMPLETED

- ✅ Service structure and boilerplate completed
- ✅ **DONE**: Implement MongoDB schema for shares
- ✅ **DONE**: Create core sharing endpoints (POST, GET, PATCH, DELETE)
- ✅ **DONE**: Add share status tracking (pending, watched, archived)
- ✅ **DONE**: Implement statistics endpoints

#### Week 2: Testing and Integration ✅ COMPLETED

- ✅ Create comprehensive test suite for sharing operations (31 passing tests)
- ✅ Add error handling and validation
- ✅ Document API endpoints and usage
- ✅ **JWT-only authentication implementation completed**
- ✅ Full integration with user-service JWT authentication
- 📋 Integration with media-service (planned for production)

### 📋 UPCOMING: Phase 1C - Inbox Service & Integration (Target: 3-4 weeks)

#### Week 3-4: Inbox Service Development

- 📋 Set up service structure (using established JWT-only pattern)
- 📋 Design inbox aggregation logic
- 📋 Implement JWT-only authentication from start
- 📋 Implement inbox management endpoints
- 📋 Create denormalized views for performance
- 📋 Add real-time inbox updates

#### Week 5-6: Dashboard Enhancement & MVP Complete

- 📋 Enhance home service with rich dashboard features
- 📋 Implement session-to-JWT conversion in home service
- 📋 Add inbox overview and quick sharing to main dashboard
- 📋 Integrate all services: user → sharing → inbox
- 📋 End-to-end testing of complete sharing workflow
- 📋 MVP deployment and user testing

### Phase 2: Enhanced Experience (Target: 3-4 weeks) - PLANNED

#### Weeks 7-8: Notification Service

- 📋 Set up service structure
- 📋 Implement email notifications
- 📋 Add real-time WebSocket notifications
- 📋 Integrate notification preferences

#### Weeks 9-10: API Gateway & Polish

- 📋 Set up API gateway service
- 📋 Implement request routing and aggregation
- 📋 Add rate limiting and caching
- 📋 Polish UI/UX based on testing feedback

## 🎯 Immediate Next Steps (This Week)

### Priority 1: Complete Sharing Service Core

1. **Design Shares MongoDB Schema**

   ```javascript
   // Shares collection structure needed
   {
     _id: ObjectId,
     mediaId: ObjectId,     // Reference to media-service
     fromUserId: ObjectId,  // Reference to user-service
     toUserId: ObjectId,    // Reference to user-service
     message: String,       // Optional message with share
     status: String,        // 'pending', 'watched', 'archived'
     watchedAt: Date,
     createdAt: Date,
     updatedAt: Date
   }
   ```

2. **Implement Core API Endpoints**
   - POST /api/v1/shares (create new share)
   - GET /api/v1/shares/:id (get share details)
   - GET /api/v1/shares/sent (user's sent shares)
   - GET /api/v1/shares/received (user's received shares)
   - PATCH /api/v1/shares/:id/watched (mark as watched)

3. **Add Service Integration**
   - Validate mediaId exists in media-service
   - Validate userIds exist in user-service
   - Handle service communication errors gracefully

### Priority 2: Service Health and Monitoring

1. **Update Home Service Dashboard**
   - Add sharing-service to health monitoring
   - Display sharing-service status on dashboard
   - Update service links and navigation

2. **Inter-Service Communication**
   - Establish HTTP communication patterns
   - Add service discovery/configuration
   - Implement proper error handling

### Phase 2: Enhanced Experience (Target: 3-4 weeks)

#### Week 7-8: Notification Service

- [ ] Set up service structure
- [ ] Implement email notifications
- [ ] Add real-time WebSocket notifications
- [ ] Integrate notification preferences

#### Week 9-10: API Gateway & Polish

- [ ] Set up API gateway service
- [ ] Implement request routing and aggregation
- [ ] Add rate limiting and caching
- [ ] Polish UI/UX based on testing feedback

### Phase 3: Advanced Features (Target: 4-6 weeks)

#### Weeks 11-14: Analytics & Social

- [ ] Analytics service for usage tracking
- [ ] Friend management system
- [ ] Recommendation engine
- [ ] Mobile app API optimization

#### Weeks 15-16: Mobile App Foundation

- [ ] Mobile-optimized API endpoints
- [ ] Authentication flow for mobile
- [ ] Offline capability planning
- [ ] Performance optimization

## Technical Standards

### Code Quality

- **TypeScript**: Strict type checking across all services
- **Testing**: Minimum 80% test coverage with Node.js test runner
- **Linting**: ESLint with consistent configuration
- **Formatting**: Prettier for code formatting
- **Documentation**: Comprehensive README and API docs per service

### Security

- **Authentication**: Secure session handling and JWT tokens
- **Input Validation**: Validate all user inputs
- **Rate Limiting**: Prevent abuse and DOS attacks
- **HTTPS**: Secure communication between services
- **Environment Variables**: Secure configuration management

### Monitoring & Operations

- **Health Checks**: All services implement `/health` endpoints
- **Logging**: Structured logging with appropriate levels
- **Error Handling**: Graceful degradation and proper error responses
- **Deployment**: Docker containers with environment-specific configs
- **Monitoring**: Service uptime and performance metrics

## Platform Support Strategy

### Initial Platform Support

1. **YouTube**: Video sharing (primary use case)
2. **Direct URLs**: Articles, blog posts, web content
3. **Generic Links**: Basic metadata extraction

### Future Platform Integration

1. **Spotify/Apple Music**: Music sharing
2. **Netflix/Streaming**: Movie/TV show sharing (where legally possible)
3. **Social Media**: Twitter threads, Instagram posts
4. **Podcasts**: Podcast episode sharing
5. **Books**: Goodreads integration, book recommendations

## Success Metrics

### MVP Success Criteria

- [x] **Sharing infrastructure**: Complete CRUD API for shares (sharing-service)
- [x] **Media management**: Full media storage and retrieval (media-service)
- [x] **Status tracking**: Share status management works correctly (pending/watched/archived)
- [x] **JWT Authentication**: Full JWT authentication system implemented
- [x] **Service Integration**: Session-to-JWT bridge ready for web-to-API integration
- [ ] Users can successfully share YouTube videos (UI integration needed)
- [ ] Recipients can view shared content in their inbox (inbox-service needed)
- [ ] Email notifications are delivered (notification-service needed)
- [ ] System handles 100+ concurrent users
- [ ] All services maintain 99%+ uptime

### Growth Metrics

- **User Engagement**: Daily/monthly active users
- **Content Sharing**: Number of items shared per user
- **Platform Adoption**: Which media types are most popular
- **User Retention**: 7-day and 30-day retention rates
- **Performance**: Response times and system reliability

---

## Getting Started

### For Developers

1. Clone all service repositories
2. Follow setup instructions in each service's README
3. Run tests before submitting changes
4. Follow the established coding standards

### For Product Development

1. Start with the MVP features in Phase 1
2. Gather user feedback early and often
3. Iterate based on actual usage patterns
4. Plan mobile app development based on web success

This architecture provides a solid foundation for building WatchThis into a comprehensive media sharing platform while maintaining the flexibility to adapt and scale based on user needs and feedback.
