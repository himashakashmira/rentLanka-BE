# ⚡ RentLanka - Backend RESTful API

> **ITS2020 - Rapid Application Development (RAD) | Final Coursework Assignment**  
> **Graduate Diploma in Software Engineering (GDSE)**  
> **Institute of Software Engineering (IJSE)**  
> **Module Lecturer:** Mr. Shamodha Sahan  
> **Student Name:** Himasha Kashmira  

---

## 🌐 Live Deployment & Source Code Links
- **⚡ Live Production API Base URL:** [https://rent-lanka-be.vercel.app/](https://rent-lanka-be.vercel.app/)
- **🚀 Live Frontend Web App:** [https://rentlanka-fe.vercel.app/](https://rentlanka-fe.vercel.app/)
- **📦 Backend Repository:** [https://github.com/himashakashmira/rentLanka-BE.git](https://github.com/himashakashmira/rentLanka-BE.git)
- **📦 Frontend Repository:** [https://github.com/himashakashmira/rentLanka-FE.git](https://github.com/himashakashmira/rentLanka-FE.git)

---

## 📖 1. System Overview
The **RentLanka API** is a high-performance, modular RESTful backend developed with **Node.js, Express.js, TypeScript, and MongoDB Atlas (Mongoose ODM)**. It powers all transactional business logic, authentication, role-based authorization, inventory categorization, automated booking lifecycles, file uploads, and generative AI features for the RentLanka ecosystem.

The system adheres strictly to the **ITS2020 Coursework Specification**, maintaining clear client-server separation, standardized HTTP methods and status codes, and environment variable security.

---

## 🏛️ 2. Architectural Highlights & Engineering Decisions
1. **Cloud-Native Database (MongoDB Atlas):** Primary transactional records (Items, Bookings, Users, Categories) are modeled using Mongoose schemas with validation, indexing, and relational object referencing.
2. **Hybrid Storage Strategy (Supabase Storage):** To preserve MongoDB database throughput, binary image uploads are piped via `multer` into **Supabase S3-compatible public storage buckets**, returning secure CDN URLs to MongoDB.
3. **Enterprise Security (JWT + bcryptjs):** Passwords are cryptographically salted and hashed with `bcryptjs`. Protected endpoints utilize stateless JWT Bearer authorization middleware with Role-Based Access Control (RBAC).
4. **Google Gemini Generative AI Integration (Section 6.5):** A multi-tier waterfall fallback mechanism generates natural language marketing copy for rental listings based on equipment specifications.
5. **Serverless Connection Resiliency:** Features an automated connection state middleware (`readyState`) ensuring seamless zero-downtime database reconnects under Vercel Serverless execution.

---

## 🛠️ 3. Technologies & Packages
| Package | Purpose |
|---|---|
| `express` | HTTP server & routing pipeline |
| `typescript` | Type safety and modern ES execution |
| `mongoose` | Object Data Modeling (ODM) for MongoDB Atlas |
| `bcryptjs` | 10-round salted password encryption |
| `jsonwebtoken` | Secure stateless auth token issuance & validation |
| `multer` | In-memory multipart/form-data image stream processing |
| `@supabase/supabase-js` | Cloud bucket storage management |
| `cors` | Cross-Origin Resource Sharing security headers |
| `dotenv` | Environment variable isolation |
| `tsx` | Fast TypeScript execution runtime |

---

## 📂 4. Project Structure (Standardized RAD Pattern)
```text
rentlanka-be/
├── src/
│   ├── config/
│   │   ├── db.ts                  # Resilient Mongoose connection to MongoDB Atlas
│   │   └── supabase.ts            # Supabase Storage client initialization
│   ├── models/
│   │   ├── User.ts                # User schema (Name, Email, Password, Role)
│   │   ├── Item.ts                # Rental asset schema (Title, Category, Price, Location, Image, Specs)
│   │   ├── Booking.ts             # Relational booking schema (item_id ref Item, Renter, Dates, Status)
│   │   └── Category.ts            # Marketplace category schema
│   ├── controllers/
│   │   ├── auth.controller.ts     # Register, Login, Token generation
│   │   ├── item.controller.ts     # Items CRUD, category query filtering, seeding
│   │   ├── booking.controller.ts  # Booking creation, Admin approval/rejection lifecycle
│   │   ├── category.controller.ts # Category fetch & initialization
│   │   ├── ai.controller.ts       # 3-tier Gemini AI description generator
│   │   ├── upload.controller.ts   # Multer-to-Supabase Storage pipeline
│   │   └── health.controller.ts   # Infrastructure ping & telemetry check
│   ├── routes/
│   │   ├── auth.routes.ts         # /api/v1/auth
│   │   ├── item.routes.ts         # /api/v1/items
│   │   ├── booking.routes.ts      # /api/v1/bookings
│   │   ├── category.routes.ts     # /api/v1/categories
│   │   ├── ai.routes.ts           # /api/v1/ai
│   │   ├── upload.routes.ts       # /api/v1/upload
│   │   └── health.routes.ts       # /api/v1/health
│   ├── middleware/
│   │   └── auth.middleware.ts     # JWT verification & RBAC guards (requireAdmin)
│   └── index.ts                   # App bootstrap, middleware stack, route registration
├── vercel.json                    # Vercel serverless deployment routing config
├── tsconfig.json                  # TypeScript compiler options
└── package.json

📡 5. RESTful API Endpoints Summary

Authentication (/api/v1/auth)
POST /register - Register a new user (customer, host, admin)
POST /login - Authenticate credentials and receive signed JWT token
Rental Items (/api/v1/items)
GET / - Retrieve all listings (supports ?category=, ?location=, ?search=)
GET /:id - Retrieve full specifications and availability for a single item
POST / - Create a new rental listing (Protected)
PUT /:id - Update listing details (Protected)
DELETE /:id - Remove listing from platform (Protected)
Booking & Escrow Operations (/api/v1/bookings)
GET / - Retrieve all bookings for Admin / Host audits (Protected)
POST / - Submit a new rental booking request
PUT /:id/status - Approve (Confirmed) or decline (Rejected) a booking (Updates asset availability)
Generative AI & Utilities
POST /api/v1/ai/generate-description - Trigger Gemini AI marketing description generator
POST /api/v1/upload - Upload image binary to Supabase Storage and obtain public CDN URL
GET /api/v1/health - Ping server and database connectivity

🚀 6. Local Setup Instructions

Bash
# 1. Clone repository
git clone https://github.com/himashakashmira/rentLanka-BE.git

# 2. Navigate to directory
cd rentLanka-BE

# 3. Install dependencies
npm install

# 4. Configure environment (.env file in root):
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.5wwmvdh.mongodb.net/rentlanka_db?retryWrites=true&w=majority

# 5. Run in development mode
npm run dev
API endpoints will be served live at http://localhost:5000.

👨‍💻 Author & Academic Submission

Developer: Himasha Kashmira
Module: ITS2020 - Rapid Application Development (RAD)
Lecturer: Mr. Shamodha Sahan
Institute: Institute of Software Engineering (IJSE)
Contact: himashakashmira7@gmail.com | +94 78 360 4911