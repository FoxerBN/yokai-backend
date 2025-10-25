# 🏯 Yokai Backend

> A modern NodeJS backend API for exploring the mystical world of Japanese yokais

[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.21.1-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.3.2-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🔐 **Authentication** - Secure JWT-based authentication with bcrypt password hashing
- 📚 **Article Management** - Full CRUD operations for yokai articles
- 🏷️ **Categories** - Organize yokais by categories
- 👍 **Like System** - IP-based article liking functionality
- ☁️ **Cloudinary Integration** - Cloud-based image storage
- 🛡️ **Security** - Helmet, CORS, and MongoDB sanitization
- 🎨 **TypeScript** - Fully typed for better developer experience

## 📁 Project Structure

```
yokai-backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── db.ts         # MongoDB connection
│   │   └── cloudinary.ts # Cloudinary setup
│   ├── controllers/      # Route controllers
│   ├── interfaces/       # TypeScript interfaces
│   │   └── database/     # Database model interfaces
│   ├── middlewares/      # Custom middlewares
│   │   └── global/       # Global error handlers
│   ├── models/           # Mongoose models
│   │   └── DatabaseModels.ts
│   ├── routes/           # API routes
│   │   ├── articleRoute.ts
│   │   ├── updateArticleRoute.ts
│   │   └── authRoute.ts
│   ├── schemas/          # Mongoose schemas
│   │   ├── ArticleSchema.ts
│   │   ├── CategorySchema.ts
│   │   └── LikeSchema.ts
│   ├── utils/            # Helper utilities
│   │   └── ipHelper.ts   # IP address extraction
│   ├── app.ts            # Express app configuration
│   └── index.ts          # Server entry point
├── package.json
└── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/FoxerBN/yokai-backend.git
   cd yokai-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   CLIENT_URL=your_frontend_url
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the application**
   
   **Development mode:**
   ```bash
   npm run dev
   ```
   
   **Production mode:**
   ```bash
   npm run build
   npm run start:dist
   ```

## 📡 API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/articles` | Get all yokai articles |
| `GET` | `/api/articles/:id` | Get single article |
| `POST` | `/api/articles` | Create new article (auth required) |
| `PUT` | `/api/articles/:id` | Update article (auth required) |
| `DELETE` | `/api/articles/:id` | Delete article (auth required) |
| `POST` | `/api/articles/:id/like` | Like an article |
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login user |

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + bcryptjs
- **Image Storage:** Cloudinary
- **Security:** Helmet, CORS, express-mongo-sanitize
- **Development:** Nodemon, ts-node
- **Testing:** Jest, Supertest

## 🔧 Available Scripts

```bash
npm run dev          # Run development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Run with ts-node
npm run start:dist   # Run compiled JavaScript
npm run typecheck    # Type check without emitting
npm run test         # Run Jest tests
```

## 🏗️ How It Works

1. **Server Initialization** (`index.ts`) - Starts the Express server on the specified port
2. **App Configuration** (`app.ts`) - Sets up middleware, security, routes, and error handling
3. **Database Connection** (`config/db.ts`) - Establishes MongoDB connection
4. **Routes** - Handle incoming API requests and route them to appropriate controllers
5. **Controllers** - Process business logic and interact with database models
6. **Schemas & Models** - Define data structure and validation rules
7. **Middlewares** - Handle request validation, authentication, and error handling

### Security Features 🔒

- **Helmet** - Sets various HTTP headers for security
- **CORS** - Configured for specific client origin with credentials
- **MongoDB Sanitization** - Prevents NoSQL injection attacks
- **JWT Authentication** - Secure token-based authentication
- **Cookie Parser** - Secure cookie handling
- **Body Validation** - Custom middleware for request validation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Richard Tekula** ([@FoxerBN](https://github.com/FoxerBN))

## 🌟 Show Your Support

Give a ⭐️ if you like this project!

---

<div align="center">
  <sub>Built with 🦊 by FoxerBN</sub>
</div>
```
