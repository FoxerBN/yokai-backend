# Yokai API Documentation

## Overview
Yokai is a robust Express.js TypeScript backend API for article management with authentication, categorization, and user interaction features.

**Tech Stack:** Node.js, Express.js, TypeScript, MongoDB, Mongoose, JWT

---

## 📁 Project Structure

```
yokai/
├── src/
│   ├── app.ts                  # Express app configuration
│   ├── index.ts                # Server entry point
│   ├── config/
│   │   ├── db.ts              # MongoDB connection
│   │   └── cloudinary.ts      # Cloudinary configuration
│   ├── interfaces/
│   │   ├── database/
│   │   │   ├── IArticle.ts    # Article interface
│   │   │   ├── ICategory.ts   # Category interface
│   │   │   └── ILike.ts       # Like interface
│   │   ├── AuthRequest.ts     # Authenticated request interface
│   │   ├── CreateArticleRequest.ts
│   │   ├── ErrorResponse.ts   # Error response interface
│   │   ├── JwtPayload.ts     # JWT payload interface
│   │   └── MessageResponse.ts # Standard message response
│   ├── middlewares/
│   │   └── global/
│   │       ├── errorHandler.ts    # Global error handling
│   │       ├── notFound.ts        # 404 handler
│   │       ├── validateBody.ts    # Request validation
│   │       └── verifyToken.ts     # JWT verification
│   ├── models/
│   │   └── DatabaseModels.ts  # Mongoose models export
│   ├── routes/
│   │   ├── articleRoute.ts    # Article read operations
│   │   ├── authRoute.ts       # Authentication endpoints
│   │   └── updateArticleRoute.ts # Article write operations
│   ├── schemas/
│   │   ├── ArticleSchema.ts   # Article Mongoose schema
│   │   ├── CategorySchema.ts  # Category Mongoose schema
│   │   └── LikeSchema.ts      # Like Mongoose schema
│   ├── services/
│   │   ├── articleService.ts  # Article business logic
│   │   ├── authService.ts     # Authentication logic
│   │   └── updateArticleService.ts # Article update logic
│   └── utils/
│       └── ipHelper.ts        # IP address utilities
├── __tests__/
│   └── example.test.ts        # Test files
├── package.json
├── tsconfig.json
└── .env
```

---

## 🔐 Authentication Routes
**Base Path:** `/api`

### POST `/auth/login`
Admin authentication endpoint.

**Request Body:**
```json
{
  "password": "string"
}
```

**Response:**
- **200:** `{ "message": "Login successful" }`
- **400:** `{ "message": "Password is required" }`
- **401:** `{ "message": "Invalid password" }`
- **500:** `{ "message": "Login failed" }`

**Features:**
- Sets HTTP-only cookie (`adminToken`)
- 7-day token expiration
- Secure cookie configuration for production

### POST `/auth/logout`
Clears admin authentication.

**Response:**
- **200:** `{ "message": "Logged out successfully" }`

### GET `/auth/check`
Verifies admin authentication status.

**Response:**
- **200:** `{ "isAdmin": true }`
- **401:** `{ "isAdmin": false }`

---

## 📖 Article Routes (Read Operations)
**Base Path:** `/api`

### GET `/articles`
Retrieves paginated articles.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
- **200:** Array of articles with pagination metadata
- **500:** `{ "message": "Failed to fetch articles" }`

### GET `/articles/category/:categorySlug`
Retrieves articles by category with pagination.

**Parameters:**
- `categorySlug`: Category identifier

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
- **200:** Array of categorized articles
- **404:** `{ "message": "Category not found" }`
- **500:** `{ "message": "Failed to fetch articles by category" }`

### GET `/articles/popular`
Retrieves 6 most liked articles.

**Response:**
- **200:** Array of popular articles
- **500:** `{ "message": "Failed to fetch most liked articles" }`

### GET `/articles/category/:categorySlug/limited`
Retrieves up to 10 articles by category (no pagination).

**Parameters:**
- `categorySlug`: Category identifier

**Response:**
- **200:** Array of articles (max 10)
- **404:** `{ "message": "Category not found" }`
- **500:** `{ "message": "Failed to fetch articles by category" }`

### GET `/articles/search/quick`
Quick search for dropdown/autocomplete functionality.

**Query Parameters:**
- `q`: Search term (required)
- `limit` (optional): Results limit (default: 8)

**Response:**
- **200:** Array of simplified article objects `{ id, title, slug }`
- **400:** `{ "message": "Search term is required" }`
- **500:** `{ "message": "Quick search failed" }`

### GET `/articles/:slug`
Retrieves single article by slug.

**Parameters:**
- `slug`: Article slug identifier

**Response:**
- **200:** Complete article object
- **404:** `{ "message": "Article not found" }`
- **500:** `{ "message": "Failed to fetch article" }`

### GET `/count/articles/count`
Retrieves article count for pagination.

**Query Parameters:**
- `category` (optional): Category slug for filtered count

**Response:**
- **200:** `{ "count": number }`
- **500:** `{ "message": "Failed to get article count" }`

---

## ✏️ Article Routes (Write Operations)
**Base Path:** `/api`

### POST `/articles/create-article` 🔒
Creates new article (Admin only).

**Headers:**
- Cookie: `adminToken` (required)

**Request Body:**
```json
{
  "title": "string",
  "slug": "string",
  "content": "string",
  "excerpt": "string (optional)",
  "category": "string"
}
```

**Response:**
- **201:** Created article object
- **400:** `{ "message": "Title, slug, content, and category are required" }`
- **404:** `{ "message": "Category not found" }`
- **409:** `{ "message": "Article with this slug already exists" }`
- **500:** `{ "message": "Failed to create article" }`

### POST `/articles/:slug/view`
Increments article view count.

**Parameters:**
- `slug`: Article slug identifier

**Response:**
- **200:** `{ "message": "Views updated successfully" }`
- **500:** `{ "message": "Failed to update article views" }`

### POST `/articles/:slug/like`
Toggles like status for an article (IP-based).

**Parameters:**
- `slug`: Article slug identifier

**Response:**
- **200:**
```json
{
  "message": "Article liked|Article unliked",
  "likes": number,
  "liked": boolean
}
```
- **404:** `{ "message": "Article not found" }`
- **500:** `{ "message": "Failed to toggle like" }`

### GET `/articles/:slug/like-status`
Checks if user has liked an article (IP-based).

**Parameters:**
- `slug`: Article slug identifier

**Response:**
- **200:** `{ "liked": boolean }`
- **500:** `{ "message": "Failed to check like status" }`

---

## 🗃️ Database Models

### Article
- `title`: string
- `slug`: string (unique)
- `content`: string
- `excerpt`: string
- `category`: ObjectId (ref: Category)
- `views`: number
- `likes`: number
- `createdAt`: Date
- `updatedAt`: Date

### Category
- `name`: string
- `slug`: string (unique)
- `description`: string
- `createdAt`: Date
- `updatedAt`: Date

### Like
- `article`: ObjectId (ref: Article)
- `ipAddress`: string
- `createdAt`: Date

---

## 🛡️ Security Features

### Middleware Stack
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Morgan**: HTTP request logging
- **Express Mongo Sanitize**: NoSQL injection prevention
- **Cookie Parser**: Secure cookie handling

### Authentication
- JWT-based admin authentication
- HTTP-only cookies for token storage
- IP-based like tracking
- Request body validation

### Error Handling
- Global error handler
- 404 handler for undefined routes
- Structured error responses
- Request validation middleware

---

## 🚀 Development Scripts

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run typecheck

# Run tests
npm test
```

---

## 🔧 Configuration

### Environment Variables
Create `.env` file with:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_PASSWORD=your_admin_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### Database Connection
MongoDB connection configured in `src/config/db.ts` with error handling and connection logging.

---

## 📝 Usage Examples

### Create Article (Admin)
```javascript
// Login first
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password: 'admin_password' })
});

// Create article
const articleResponse = await fetch('/api/articles/create-article', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    title: 'My Article',
    slug: 'my-article',
    content: 'Article content...',
    category: 'tech'
  })
});
```

### Fetch Articles with Pagination
```javascript
const response = await fetch('/api/articles?page=1&limit=10');
const articles = await response.json();
```

### Like an Article
```javascript
const response = await fetch('/api/articles/my-article-slug/like', {
  method: 'POST'
});
const result = await response.json();
// { message: "Article liked", likes: 42, liked: true }
```

---

## 📊 API Response Patterns

### Success Response
```json
{
  "data": "object|array",
  "message": "string"
}
```

### Error Response
```json
{
  "message": "string"
}
```

### Pagination Response
```json
{
  "articles": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalArticles": 100,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```