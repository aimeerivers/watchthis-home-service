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
  - Authentication integration
  - Service health monitoring
- **Status**: ✅ Implemented and operational

#### watchthis-user-service  
- **Purpose**: User management and authentication
- **Tech Stack**: Node.js, Express, TypeScript, MongoDB, Passport.js
- **Port**: 8583 (development), 18583 (testing)
- **Responsibilities**:
  - User signup, login, logout
  - Session management
  - User profile management
- **Status**: ✅ Implemented and operational

### Current Architecture Patterns

- ✅ Microservice architecture with HTTP communication
- ✅ Service-to-service authentication via session forwarding
- ✅ Graceful degradation when services are unavailable
- ✅ Health check endpoints for monitoring
- ✅ TypeScript with ES modules
- ✅ Comprehensive testing with Node.js test runner

## Target Architecture

### Core Services (MVP - Phase 1)

#### watchthis-media-service

- **Purpose**: Manage shared media items and metadata
- **Priority**: 🔴 Critical - Implement First
- **Tech Stack**: Node.js, Express, TypeScript, MongoDB
- **Port**: 7769 (development), 17769 (testing)
- **Responsibilities**:
  - Store media URLs, titles, descriptions, thumbnails
  - Extract metadata from YouTube/Spotify/other platforms
  - Handle media validation and categorization
  - Provide media search and filtering APIs
  - Generate preview images and summaries

**Key Endpoints**:

```
POST   /api/v1/media              # Add new media
GET    /api/v1/media/:id          # Get media details
GET    /api/v1/media/extract      # Extract metadata from URL
PATCH  /api/v1/media/:id          # Update media metadata
DELETE /api/v1/media/:id          # Remove media
```

#### watchthis-sharing-service

- **Purpose**: Handle the sharing logic between users
- **Priority**: 🔴 Critical - Implement Second
- **Tech Stack**: Node.js, Express, TypeScript, MongoDB
- **Responsibilities**:
  - Create shares (user A shares media X with user B)
  - Manage share status (pending, watched, archived)
  - Handle share permissions and privacy settings
  - Generate share events for other services

**Key Endpoints**:

```
POST   /api/v1/shares             # Create new share
GET    /api/v1/shares/:id         # Get share details
PATCH  /api/v1/shares/:id/watched # Mark as watched
DELETE /api/v1/shares/:id         # Delete share
GET    /api/v1/shares/sent        # Get shares sent by user
GET    /api/v1/shares/received    # Get shares received by user
```

#### watchthis-inbox-service

- **Purpose**: Manage user's personal inbox of shared content
- **Priority**: 🔴 Critical - Implement Third
- **Tech Stack**: Node.js, Express, TypeScript, MongoDB
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
- **Priority**: 🟡 High - Enhance user experience
- **Tech Stack**: Node.js, Express, TypeScript, Redis, WebSocket
- **Responsibilities**:
  - Email notifications for new shares
  - Real-time notifications (WebSocket/Server-Sent Events)
  - Push notifications (future mobile app)
  - Notification preferences management
  - Delivery tracking and retry logic

#### watchthis-api-gateway

- **Purpose**: Central API routing and management
- **Priority**: 🟡 High - Simplify client integration
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
- **Priority**: 🟢 Medium - Data-driven improvements
- **Responsibilities**:
  - Track user behavior and media consumption
  - Generate viewing statistics and reports
  - Provide recommendation algorithms
  - User engagement analytics

#### watchthis-social-service

- **Purpose**: Social features and friend management
- **Priority**: 🟢 Medium - Community building
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

## Database Strategy

### Service-Specific Databases

#### User Service - MongoDB

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

#### Media Service - MongoDB

```javascript
// Media collection
{
  _id: ObjectId,
  url: String,
  platform: String, // 'youtube', 'spotify', 'article', etc.
  metadata: {
    title: String,
    description: String,
    thumbnail: String,
    duration: Number,
    author: String,
    publishedAt: Date
  },
  extractedAt: Date,
  createdBy: ObjectId, // User ID
  createdAt: Date
}
```

#### Sharing Service - MongoDB

```javascript
// Shares collection
{
  _id: ObjectId,
  mediaId: ObjectId,
  fromUserId: ObjectId,
  toUserId: ObjectId,
  message: String,
  status: String, // 'pending', 'watched', 'archived'
  watchedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Inbox Service - MongoDB

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

### Phase 1: MVP Core (Target: 4-6 weeks)

#### Week 1-2: Media Service

- [ ] Set up service structure (using existing templates)
- [ ] Implement basic media storage and retrieval
- [ ] Add YouTube metadata extraction
- [ ] Create comprehensive tests
- [ ] Deploy and integrate with home service

#### Week 3-4: Sharing Service

- [ ] Set up service structure
- [ ] Implement share creation and management
- [ ] Add share status tracking
- [ ] Integrate with user service for validation
- [ ] Create comprehensive tests

#### Week 5-6: Inbox Service & Integration

- [ ] Set up service structure
- [ ] Implement inbox aggregation logic
- [ ] Create inbox management endpoints
- [ ] Enhance home service with dashboard features
- [ ] End-to-end testing of complete sharing workflow

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

- [ ] Users can successfully share YouTube videos
- [ ] Recipients can view shared content in their inbox
- [ ] Watch status tracking works correctly
- [ ] Email notifications are delivered
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
3. Use the development environment with Docker Compose
4. Run tests before submitting changes
5. Follow the established coding standards

### For Product Development

1. Start with the MVP features in Phase 1
2. Gather user feedback early and often
3. Iterate based on actual usage patterns
4. Plan mobile app development based on web success

This architecture provides a solid foundation for building WatchThis into a comprehensive media sharing platform while maintaining the flexibility to adapt and scale based on user needs and feedback.
