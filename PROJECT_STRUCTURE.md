# Yokai Project Structure

## Overview
**Yokai** is a Node.js/Express REST API backend for managing articles with categories, likes, views, and admin authentication. Built with TypeScript, MongoDB/Mongoose, and follows a service-based architecture.

---

## Tech Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with HTTP-only cookies
- **Security**: Helmet, CORS, Express-Mongo-Sanitize, bcryptjs
- **Image Storage**: Cloudinary integration
- **Testing**: Jest + Supertest
- **Dev Tools**: Nodemon, ts-node, ESLint

---

## Project Architecture

### Directory Structure
```
src/
├── app.ts                          # Express app configuration & middleware setup
├── index.ts                        # Server entry point (port binding)
├── config/
│   ├── cloudinary.ts              # Cloudinary configuration for image uploads
│   └── db.ts                      # MongoDB connection setup
├── interfaces/
│   ├── CreateArticleRequest.ts    # Request interface for creating articles
│   ├── ErrorResponse.ts           # Error response type
│   ├── JwtPayload.ts             # JWT token payload interface
│   ├── MessageResponse.ts        # Standard message response type
│   └── database/
│       ├── IArticle.ts           # Article document interface
│       ├── ICategory.ts          # Category document interface
│       └── ILike.ts              # Like document interface
├── middlewares/
│   └── global/
│       ├── errorHandler.ts       # Global error handling middleware
│       ├── notFound.ts          # 404 handler
│       ├── validateBody.ts      # Request body validation
│       └── verifyToken.ts       # JWT authentication middleware (requireAdmin)
├── models/
│   └── DatabaseModels.ts         # Mongoose model exports (Article, Category, Like)
├── routes/
│   ├── articleRoute.ts           # Article read/fetch endpoints
│   ├── authRoute.ts              # Authentication endpoints (login/logout/check)
│   └── updateArticleRoute.ts     # Article write/update endpoints (create, like, view)
├── schemas/
│   ├── ArticleSchema.ts          # Mongoose schema for Article
│   ├── CategorySchema.ts         # Mongoose schema for Category
│   └── LikeSchema.ts            # Mongoose schema for Like
├── services/
│   ├── articleService.ts         # Business logic for fetching articles
│   ├── authService.ts            # Authentication & JWT logic
│   └── updateArticleService.ts   # Business logic for creating/updating articles
└── utils/
    └── ipHelper.ts               # IP address extraction utility
```

---

## Database Schemas & Interfaces

### 1. **Category** (`ICategory`)
```typescript
interface ICategory {
  _id: ObjectId
  name: string              // Category name (unique)
  slug: string              // URL-friendly identifier (unique)
  description?: string      // Optional description
  color?: string           // Optional color for UI
  createdAt: Date
  updatedAt: Date
}
```

**Schema**: `CategorySchema.ts`
**Model**: `Category` (DatabaseModels.ts:10)

---

### 2. **Article** (`IArticle`)
```typescript
interface IArticle {
  _id: ObjectId
  title: string             // Article title
  slug: string              // URL slug (unique)
  content: string           // Article body/content
  excerpt?: string          // Short description
  author: string            // Author name (default: 'Admin' / 'foxerBN')
  category: ObjectId        // Reference to Category
  publishedAt?: Date        // Publication timestamp
  views: number             // View counter (default: 0)
  likes: number             // Like counter (default: 0)
  imageUrl?: string         // Cover image URL (Cloudinary)
  sources?: string[]        // Reference sources/links
  readingTime?: number      // Estimated reading time in minutes
  createdAt: Date
  updatedAt: Date
}
```

**Schema**: `ArticleSchema.ts`
**Model**: `Article` (DatabaseModels.ts:11)
**Relations**:
- `category` → References `Category._id`
- Populated with: `name`, `slug`, `description`

---

### 3. **Like** (`ILike`)
```typescript
interface ILike {
  _id: ObjectId
  article: ObjectId         // Reference to Article
  ipAddress: string         // User's IP address (for like tracking)
  createdAt: Date
}
```

**Schema**: `LikeSchema.ts`
**Model**: `Like` (DatabaseModels.ts:12)
**Relations**:
- `article` → References `Article._id`

---

## How Components Connect

### Request Flow

```
Client Request
    ↓
Express App (app.ts)
    ↓
[Global Middlewares]
├── morgan (logging)
├── helmet (security headers)
├── cors (CORS policy)
├── cookieParser (parse cookies)
├── validateBody (body validation)
    ↓
[Route Handlers]
├── /api → articleRoute.ts (GET endpoints)
├── /api → updateArticleRoute.ts (POST endpoints)
├── /api → authRoute.ts (auth endpoints)
    ↓
[Middleware Protection]
└── requireAdmin (verifyToken.ts) → Protects write operations
    ↓
[Service Layer]
├── articleService.ts (read operations)
├── updateArticleService.ts (write operations)
├── authService.ts (authentication)
    ↓
[Database Models]
├── Article (DatabaseModels.ts)
├── Category (DatabaseModels.ts)
├── Like (DatabaseModels.ts)
    ↓
MongoDB Database
```

---

## API Endpoints

### **Article Routes** (`articleRoute.ts`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles` | Get all articles (paginated) |
| GET | `/api/articles/category/:categorySlug` | Get articles by category (paginated) |
| GET | `/api/articles/popular` | Get 6 most liked articles |
| GET | `/api/articles/category/:categorySlug/limited` | Get 10 articles by category (no pagination) |
| GET | `/api/articles/search/quick` | Quick search (autocomplete) |
| GET | `/api/articles/:slug` | Get single article by slug |
| GET | `/api/count/articles/count` | Get article count for pagination |

### **Update Routes** (`updateArticleRoute.ts`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/api/articles/create-article` | Create new article | ✅ Admin |
| POST | `/api/articles/:slug/view` | Increment article views | ❌ |
| POST | `/api/articles/:slug/like` | Toggle like on article | ❌ |
| GET | `/api/articles/:slug/like-status` | Check if user liked article | ❌ |

### **Auth Routes** (`authRoute.ts`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login (sets HTTP-only cookie) |
| POST | `/api/auth/logout` | Admin logout (clears cookie) |
| GET | `/api/auth/check` | Check admin authentication status |

---

## Service Layer Logic

### **articleService.ts** (Read Operations)
- `getAllArticles(page, limit)` - Fetch paginated articles
- `getArticlesByCategory(categorySlug, page, limit)` - Filter by category
- `getMostLikedArticles()` - Get top 6 liked articles
- `getArticlesByCategoryLimited(categorySlug)` - Get 10 articles by category
- `getArticleBySlug(slug)` - Fetch single article
- `getArticleCount(categorySlug?)` - Count articles for pagination
- `quickSearchArticles(searchTerm, limit)` - Search by title/excerpt/content

### **updateArticleService.ts** (Write Operations)
- `createArticle(articleData)` - Create new article with auto-calculated reading time
- `toggleLike(slug, ipAddress)` - Add/remove like (IP-based tracking)
- `hasUserLikedArticle(slug, ipAddress)` - Check like status
- `incrementArticleViews(slug)` - Increment view counter
- `calculateReadingTime(content)` - Helper: ~200 words/minute

### **authService.ts** (Authentication)
- `verifyPassword(password)` - Compare with hashed admin password
- `generateAdminToken()` - Create JWT with 7-day expiry
- `verifyToken(token)` - Decode & validate JWT

---

## Key Features & Patterns

### 1. **Authentication Flow**
```
Admin Login → Password Verification (bcrypt) → Generate JWT → Set HTTP-only Cookie
Protected Routes → requireAdmin Middleware → Verify JWT from Cookie → Grant Access
```

### 2. **Like System**
- IP-based like tracking (no user accounts needed)
- Toggle functionality (like/unlike)
- Stores likes in separate `Like` collection
- Updates `Article.likes` counter atomically

### 3. **Article Relationship**
```
Article.category (ObjectId) → Category._id
    ↓ (Mongoose populate)
Article with populated category: { name, slug, description }
```

### 4. **Middleware Chain**
```
Request → CORS → Helmet → Body Parser → Custom Validators → Route Handler → Service → Database
```

### 5. **Error Handling**
- Global `errorHandler` middleware (errorHandler.ts:11)
- Custom error responses (ErrorResponse interface)
- Service-level try-catch with specific error messages

---

## Configuration & Environment

### Required Environment Variables
```env
PORT=5000                          # Server port
MONGODB_URI=<mongodb_connection>   # MongoDB connection string
JWT_SECRET=<secret_key>            # JWT signing secret
ADMIN_PASSWORD=<hashed_password>   # Bcrypt hashed admin password
CLIENT_URL=<frontend_url>          # CORS origin
CLOUDINARY_CLOUD_NAME=<name>       # Cloudinary config
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
```

---

## Data Flow Examples

### Creating an Article
```
POST /api/articles/create-article
    ↓
requireAdmin middleware (verifyToken.ts:7) checks JWT cookie
    ↓
updateArticleRoute.ts:14 validates request body
    ↓
updateArticleService.createArticle() finds category by slug
    ↓
Creates Article with:
  - Author: 'foxerBN'
  - Category: ObjectId reference
  - Reading time: auto-calculated from content
  - Published: true with timestamp
    ↓
Returns populated article with category details
```

### Liking an Article
```
POST /api/articles/:slug/like
    ↓
getRealIP() extracts user IP (ipHelper.ts)
    ↓
updateArticleService.toggleLike(slug, ipAddress)
    ↓
Check if Like exists (article + ipAddress)
    ↓
IF exists: Delete Like & decrement Article.likes
ELSE: Create Like & increment Article.likes
    ↓
Returns { likes, liked } status
```

### Fetching Articles by Category
```
GET /api/articles/category/:categorySlug?page=1&limit=10
    ↓
articleRoute.ts:25 parses query params
    ↓
articleService.getArticlesByCategory()
    ↓
Find Category by slug
    ↓
Find Articles where:
  - category = Category._id
  - publishedAt exists (published articles only)
    ↓
Populate category details
    ↓
Sort by publishedAt (newest first)
    ↓
Apply pagination (skip/limit)
    ↓
Return article array
```

---

## Testing & Scripts

### Available Commands
```bash
npm start          # Run with ts-node
npm run dev        # Development mode with nodemon
npm run build      # Compile TypeScript to dist/
npm run start:dist # Run compiled JavaScript
npm run typecheck  # Type checking only
npm test           # Run Jest tests
```

### Jest Configuration
- Preset: `ts-jest`
- Environment: `node`
- Test framework for API endpoint testing with Supertest

---

## Security Features

1. **Helmet** - Sets security HTTP headers
2. **CORS** - Restricted to `CLIENT_URL` with credentials
3. **Mongo Sanitize** - Prevents NoSQL injection
4. **JWT Auth** - HTTP-only cookies (not accessible via JavaScript)
5. **bcryptjs** - Password hashing for admin authentication
6. **IP-based Like Tracking** - Prevents multiple likes from same user

---

## Summary

This project implements a **complete blog/article management system** with:
- **3 MongoDB collections**: Article, Category, Like
- **RESTful API** with public read endpoints and protected write endpoints
- **JWT-based admin authentication** via HTTP-only cookies
- **IP-tracked like system** without requiring user accounts
- **Article features**: views, likes, categories, search, pagination, reading time
- **Service-based architecture** separating business logic from routes
- **Type-safe** TypeScript implementation with proper interfaces

The flow is: **Routes → Middleware → Services → Models → Database**, with clean separation of concerns and comprehensive error handling throughout.
