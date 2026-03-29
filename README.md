# 🇧🇩 Smart Government Service Navigator

একটি সম্পূর্ণ Full-Stack Web Application যা বাংলাদেশের নাগরিকদের সরকারি সেবা সহজে খুঁজে পেতে এবং নেভিগেট করতে সাহায্য করে।

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Default Credentials](#default-credentials)
- [Screenshots Overview](#screenshots-overview)

---

## 🎯 Project Overview

**Smart Government Service Navigator** হলো একটি Civic Tech প্ল্যাটফর্ম যেখানে বাংলাদেশের নাগরিকরা:

- যেকোনো সরকারি সেবা সহজে **খুঁজে পেতে** পারে
- প্রতিটি সেবার জন্য **ধাপে ধাপে গাইড** পাবে
- **প্রয়োজনীয় কাগজপত্রের** তালিকা দেখতে পারবে
- নিকটবর্তী **সরকারি অফিসের** তথ্য জানতে পারবে
- **Eligibility Checker** দিয়ে আবেদনের যোগ্যতা যাচাই করতে পারবে
- সেবা **Bookmark** করে রাখতে পারবে
- সেবা সম্পর্কে **রিভিউ ও রেটিং** দিতে পারবে

---

## 🛠️ Tech Stack

## Repository Link Backend

[Smart Gov Navigator Backend](https://github.com/NajibHossain49/smart-gov-navigator_backend)

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | REST API framework |
| **TypeScript** | Type safety |
| **Prisma ORM** | Database ORM |
| **PostgreSQL** | Relational database |
| **JWT** | Authentication |
| **bcryptjs** | Password hashing |
| **Helmet + CORS** | Security |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **Next.js 14** | React framework (App Router) |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **TanStack Query** | Server state management |
| **Zustand** | Client state management |
| **Axios** | HTTP client |
| **react-hot-toast** | Notifications |
| **lucide-react** | Icons |

---

## ✨ Features

### 👤 User Features

| Feature | Description |
|---------|-------------|
| **Registration & Login** | JWT-based secure authentication |
| **Service Directory** | সব সরকারি সেবার কেন্দ্রীয় তালিকা |
| **Advanced Search** | Keyword, category বা service type অনুযায়ী সার্চ |
| **Category Filter** | ৮টি ক্যাটাগরিতে সেবা ব্রাউজ |
| **Step-by-Step Guide** | প্রতিটি সেবার বিস্তারিত ধাপে ধাপে নির্দেশনা |
| **Required Documents** | প্রয়োজনীয় কাগজপত্রের তালিকা |
| **Office Locator** | জেলা/উপজেলা অনুযায়ী সরকারি অফিস খোঁজা |
| **Service Bookmark** | গুরুত্বপূর্ণ সেবা সংরক্ষণ |
| **Feedback & Rating** | সেবা সম্পর্কে রিভিউ ও রেটিং (১-৫ স্টার) |
| **Eligibility Checker** | প্রশ্নের মাধ্যমে আবেদনের যোগ্যতা যাচাই |
| **Related Services** | একই ক্যাটাগরির সম্পর্কিত সেবা দেখা |
| **Recently Viewed** | সম্প্রতি দেখা সেবার ইতিহাস |
| **User Dashboard** | Profile, Bookmarks, History একসাথে |

### 🔑 Admin Features

| Feature | Description |
|---------|-------------|
| **Admin Dashboard** | Platform overview with stats |
| **Service Management** | সেবা Create, Edit, Delete (CRUD) |
| **Category Management** | ক্যাটাগরি CRUD |
| **Office Management** | সরকারি অফিস CRUD |
| **User Management** | Ban/Activate users, Role change |
| **Feedback Moderation** | Review এবং delete user feedbacks |
| **Analytics Dashboard** | Top viewed, bookmarked services, rating stats |
| **Eligibility Rules** | সেবার eligibility rules তৈরি ও সম্পাদনা |

### 🔐 Security Features

- JWT Token Authentication
- Role-Based Access Control (RBAC) — Admin / User
- Password Hashing (bcryptjs)
- Helmet.js security headers
- CORS protection
- Input validation সব API-তে

---

## 📁 Project Structure

```
smart-gov-navigator/          ← Backend
├── prisma/
│   ├── schema.prisma         ← 12 entities with relations
│   └── seed.ts               ← Production-ready seed data
├── src/
│   ├── config/db.ts          ← Prisma client
│   ├── controllers/          ← 10 controllers
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── categoryController.ts
│   │   ├── serviceController.ts
│   │   ├── stepController.ts
│   │   ├── documentController.ts
│   │   ├── officeController.ts
│   │   ├── serviceOfficeController.ts
│   │   ├── bookmarkController.ts
│   │   ├── feedbackController.ts
│   │   ├── eligibilityController.ts
│   │   ├── recentlyViewedController.ts
│   │   ├── statsController.ts
│   │   └── adminUserController.ts
│   ├── middlewares/
│   │   ├── authMiddleware.ts  ← JWT verification
│   │   ├── roleMiddleware.ts  ← RBAC
│   │   └── errorMiddleware.ts ← Global error handler
│   ├── routes/               ← 8 route files
│   ├── types/index.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── response.ts
│   │   └── validate.ts
│   └── server.ts
├── vercel.json
├── tsconfig.json
└── package.json

gov-navigator-frontend/       ← Frontend
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   └── (main)/
│   │       ├── page.tsx              ← Home
│   │       ├── services/page.tsx     ← Service list
│   │       ├── services/[id]/page.tsx ← Service detail
│   │       ├── offices/page.tsx      ← Office locator
│   │       ├── dashboard/page.tsx    ← User dashboard
│   │       └── admin/
│   │           ├── page.tsx          ← Admin dashboard
│   │           ├── services/
│   │           ├── categories/
│   │           ├── offices/
│   │           ├── users/
│   │           ├── feedbacks/
│   │           └── stats/
│   ├── components/
│   │   ├── admin/AdminSidebar.tsx
│   │   ├── auth/AuthGuard.tsx
│   │   ├── layout/ (Navbar, Footer, Providers)
│   │   └── ui/ (Modal, Badge, Pagination, StarRating, etc.)
│   ├── lib/
│   │   ├── api.ts            ← All API functions
│   │   ├── axios.ts          ← Axios instance with interceptors
│   │   └── utils.ts
│   ├── store/authStore.ts    ← Zustand auth state
│   └── types/index.ts        ← All TypeScript types
└── package.json
```

---

## 🗄️ Database Schema

### Entities (12 total)

```
Roles ──────────────── Users
                          │
              ┌───────────┼───────────┐
              │           │           │
         Bookmarks   Feedbacks   RecentlyViewed
              │           │
              └─────── Services ──────────────┐
                          │                   │
              ┌───────────┼────────────┐      │
              │           │            │      │
         ServiceSteps  RequiredDocs  ServiceOffices
                                         │
                                    GovOffices

ServiceCategories ──── Services
EligibilityRules ────── Services
```

| Entity | Description |
|--------|-------------|
| `roles` | Admin / User roles |
| `users` | System users (is_active field) |
| `service_categories` | ৮টি service category |
| `services` | সরকারি সেবা (view_count সহ) |
| `service_steps` | ধাপে ধাপে প্রক্রিয়া |
| `required_documents` | প্রয়োজনীয় কাগজপত্র |
| `government_offices` | সরকারি অফিস তথ্য |
| `service_offices` | Service ↔ Office mapping (M:N) |
| `bookmarks` | User saved services |
| `feedbacks` | Ratings & reviews |
| `recently_viewed` | View history |
| `eligibility_rules` | Eligibility checker rules |

---

## 🔌 API Endpoints

**Base URL:** `/api/v1`

### Authentication
```
POST   /auth/register          ← New user registration
POST   /auth/login             ← Login
POST   /auth/logout            ← Logout
GET    /auth/me                ← Current user info
```

### User Profile
```
GET    /users/profile          ← View profile
PUT    /users/profile          ← Update profile
DELETE /users/account          ← Delete account
GET    /users/recently-viewed  ← View history
DELETE /users/recently-viewed  ← Clear history
```

### Categories
```
GET    /categories             ← All categories (public)
GET    /categories/:id         ← Single category
POST   /admin/categories       ← Create (Admin)
PUT    /admin/categories/:id   ← Update (Admin)
DELETE /admin/categories/:id   ← Delete (Admin)
```

### Services
```
GET    /services               ← All services (paginated)
GET    /services/:id           ← Service detail
GET    /services/search?q=     ← Search
GET    /services/category/:id  ← Filter by category
GET    /services/:id/steps     ← Steps
GET    /services/:id/documents ← Documents
GET    /services/:id/offices   ← Offices
GET    /services/:id/feedbacks ← Reviews
GET    /services/:id/related   ← Related services
GET    /services/:id/eligibility-rules ← Eligibility rules
POST   /services/:id/check-eligibility ← Check eligibility
POST   /admin/services         ← Create (Admin)
PUT    /admin/services/:id     ← Update (Admin)
DELETE /admin/services/:id     ← Delete (Admin)
```

### Steps & Documents (Admin)
```
POST   /admin/services/:id/steps       ← Add step
PUT    /admin/steps/:id                ← Update step
DELETE /admin/steps/:id               ← Delete step
POST   /admin/services/:id/documents   ← Add document
PUT    /admin/documents/:id            ← Update document
DELETE /admin/documents/:id           ← Delete document
```

### Offices
```
GET    /offices                ← All offices
GET    /offices?district=Dhaka ← Filter by district
GET    /offices?upazila=       ← Filter by upazila
GET    /offices/:id            ← Single office
POST   /admin/offices          ← Create (Admin)
PUT    /admin/offices/:id      ← Update (Admin)
DELETE /admin/offices/:id      ← Delete (Admin)
POST   /admin/service-offices  ← Map service to office
DELETE /admin/service-offices/:id ← Remove mapping
```

### Bookmarks
```
GET    /bookmarks              ← My bookmarks
POST   /bookmarks              ← Add bookmark
DELETE /bookmarks/:id          ← Remove bookmark
```

### Feedbacks
```
POST   /feedbacks              ← Submit review
PUT    /feedbacks/:id          ← Update own review
DELETE /feedbacks/:id          ← Delete own review
GET    /admin/feedbacks        ← All feedbacks (Admin)
DELETE /admin/feedbacks/:id    ← Delete any (Admin)
```

### Admin
```
GET    /admin/stats/dashboard       ← Full platform stats
GET    /admin/stats/services/:id    ← Single service stats
GET    /admin/users                 ← All users
GET    /admin/users/:id             ← Single user
PATCH  /admin/users/:id/toggle-status   ← Ban/Activate
PATCH  /admin/users/:id/change-role    ← Change role
DELETE /admin/users/:id             ← Delete user
POST   /admin/services/:id/eligibility-rules ← Add rule
PUT    /admin/eligibility-rules/:id  ← Update rule
DELETE /admin/eligibility-rules/:id  ← Delete rule
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- npm or yarn

---

### Backend Setup

```bash
# 1. Clone and enter backend directory
cd smart-gov-navigator

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your database credentials

# 4. Run database migrations
npm run db:migrate

# 5. Generate Prisma client
npm run db:generate

# 6. Seed initial data
npm run db:seed

# 7. Start development server
npm run dev
```

Backend will run at: `http://localhost:5000`

---

### Frontend Setup

```bash
# 1. Enter frontend directory
cd gov-navigator-frontend

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL to your backend URL

# 4. Start development server
npm run dev
```

Frontend will run at: `http://localhost:3000`

---

## ⚙️ Environment Variables

### Backend `.env`
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/smart_gov_navigator"

# JWT
JWT_SECRET="your_super_secret_jwt_key_min_32_characters"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV=development
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 📦 Available Scripts

### Backend
```bash
npm run dev          # Development server (hot reload)
npm run build        # Compile TypeScript → dist/
npm start            # Production server
npm run db:migrate   # Run Prisma migrations
npm run db:generate  # Regenerate Prisma client
npm run db:seed      # Seed initial data
npm run db:studio    # Open Prisma Studio GUI
```

### Frontend
```bash
npm run dev          # Development server
npm run build        # Production build
npm start            # Production server
npm run lint         # ESLint check
```

---

## 🌐 Deployment

### Backend → Vercel

```bash
# vercel.json is already configured
# Just connect GitHub repo to Vercel

# After deploy, run migrations:
DATABASE_URL="your-prod-db-url" npx prisma migrate deploy
DATABASE_URL="your-prod-db-url" npx ts-node prisma/seed.ts
```

**Vercel Environment Variables:**
```
DATABASE_URL    = your PostgreSQL connection string
JWT_SECRET      = random 32+ char string
JWT_EXPIRES_IN  = 7d
NODE_ENV        = production
```

### Frontend → Vercel

```bash
# Connect GitHub repo to Vercel
# Set environment variable:
NEXT_PUBLIC_API_URL = https://your-backend.vercel.app
```

> ⚠️ **Note:** Vercel is serverless — for production workloads, consider **Render** or **Railway** for the backend.

---

## 🔑 Default Credentials

After running `npm run db:seed`:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@govnavigator.com | admin123456 |
| **User** | rahim@example.com | user123456 |
| **User** | fatema@example.com | user123456 |

---

## 🌱 Seed Data

Running the seed script creates:

| Data | Count |
|------|-------|
| Roles | 2 (Admin, User) |
| Users | 6 (1 Admin + 5 Users) |
| Service Categories | 8 |
| Services | 15 |
| Service Steps | 65+ |
| Required Documents | 60+ |
| Government Offices | 12 |
| Service-Office Mappings | 20+ |
| Feedbacks | 12 |
| Bookmarks | 6 |
| Eligibility Rules | 7 |

### Service Categories in Seed:
- 🪪 Identity Services (Passport, NID, Birth Certificate)
- 🏢 Business Services (Trade License, Company Registration, e-TIN)
- 🗺️ Land Services (Registration, Mutation)
- 🎓 Education Services (Attestation, School Admission)
- 🤝 Social Services (Old Age Allowance, Disability)
- 🏥 Health Services (Medical Certificate)
- 💰 Tax & Finance (Income Tax Return)
- ⚡ Utility Services (Electricity Connection)

---

## 📡 API Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful.",
  "data": { }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description.",
  "errors": []
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Services fetched successfully.",
  "data": {
    "services": [...],
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 10,
      "totalPages": 2
    }
  }
}
```

---

## 🔒 Authentication

All protected routes require a Bearer token:

```http
Authorization: Bearer <your_jwt_token>
```

### Access Levels:
- **Public** — No token required (service browsing, search)
- **Auth** — Token required (bookmarks, feedback, profile)
- **Admin** — Admin role required (CRUD operations, user management)

---

## 🧪 Testing the API

```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@govnavigator.com","password":"admin123456"}'

# Get all services
curl http://localhost:5000/api/v1/services

# Search services
curl "http://localhost:5000/api/v1/services/search?q=passport"
```

---

## 🏗️ Business Rules

| Rule | Description |
|------|-------------|
| **One feedback per service** | একজন user একটি service এ একবারই review দিতে পারবে |
| **One bookmark per service** | Duplicate bookmark প্রতিরোধ করা হয় |
| **Rating range** | Rating অবশ্যই ১-৫ এর মধ্যে হতে হবে |
| **Owner-only edits** | User শুধু নিজের feedback ও bookmark মুছতে পারবে |
| **Admin protection** | Admin user কে ban বা delete করা যাবে না |
| **Cascade deletes** | Service মুছলে তার steps, documents, mappings ও মুছে যাবে |

---

## 👥 Contributors

Built with ❤️ for the citizens of Bangladesh 🇧🇩

---

## 📄 License

This project is for educational and civic purposes.
