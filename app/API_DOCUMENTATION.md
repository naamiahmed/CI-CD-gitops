# 🚀 Simple Node.js Backend API

A simple, well-documented Node.js backend with Express.js featuring REST APIs for User, Product, and Order management.

---

## 📋 Table of Contents

1. [Project Setup](#project-setup)
2. [Installation & Dependencies](#installation--dependencies)
3. [Project Structure](#project-structure)
4. [Running the Server](#running-the-server)
5. [API Endpoints](#api-endpoints)
   - [User APIs](#user-apis)
   - [Product APIs](#product-apis)
   - [Order APIs](#order-apis)
6. [Testing the APIs](#testing-the-apis)
7. [Environment Variables](#environment-variables)
8. [Error Handling](#error-handling)
9. [Future Improvements](#future-improvements)

---

## 📦 Project Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - For version control
- **Postman** or **cURL** - For testing APIs (optional)

### Check Installation

```bash
# Check Node.js version
node --version

# Check npm version
npm --version
```

---

## 📚 Installation & Dependencies

### Step 1: Clone or Download the Project

```bash
# If you haven't already, navigate to the app directory
cd app
```

### Step 2: Install Dependencies

The project depends on several npm packages. Install them using:

```bash
# Install all dependencies listed in package.json
npm install
```

**Dependencies Installed:**

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18.2 | Web framework for building APIs |
| cors | ^2.8.5 | Handles Cross-Origin Resource Sharing |
| dotenv | ^16.0.3 | Load environment variables from .env file |
| uuid | ^9.0.0 | Generate unique IDs for resources |
| nodemon | ^2.0.20 | Restart server on code changes (dev only) |

### Step 3: Verify Installation

```bash
# List all installed packages
npm list
```

---

## 🗂️ Project Structure

```
app/
├── server.js                    # Main server file (entry point)
├── package.json                 # Project dependencies and scripts
├── .env                        # Environment variables configuration
├── .gitignore                  # Files to exclude from git
├── README.md                   # This file
│
├── routes/                     # API route handlers
│   ├── userRoutes.js          # User-related endpoints
│   ├── productRoutes.js        # Product-related endpoints
│   └── orderRoutes.js          # Order-related endpoints
│
└── data/                       # Data storage (currently in-memory)
    └── database.js            # In-memory data store and sample data
```

### File Descriptions

- **server.js**: The main application file that initializes Express, configures middleware, and registers routes
- **routes/**: Contains the API endpoint handlers organized by resource type
- **data/database.js**: Currently stores data in memory (like an array). In production, this would connect to a real database
- **.env**: Configuration file for environment variables (port, database credentials, etc.)
- **package.json**: Lists all project dependencies and npm scripts

---

## 🏃 Running the Server

### Method 1: Using npm start (Standard Mode)

```bash
# Start the server in production mode
npm start

# Expected output:
# ╔════════════════════════════════════════╗
# ║   🚀 SERVER STARTED SUCCESSFULLY       ║
# ╚════════════════════════════════════════╝
#
#   📍 Server Running on: http://localhost:5000
#   ...
```

The server will start and listen on `http://localhost:5000`

### Method 2: Using npm run dev (Development Mode with Auto-Restart)

This method is RECOMMENDED for development. It uses **nodemon** to automatically restart the server when you make changes to your code.

```bash
# Start the server in development mode
npm run dev

# The server will restart automatically when you save files
```

### Method 3: Using node Directly

```bash
# Start the server using node directly
node server.js
```

### Stopping the Server

Press `Ctrl + C` in your terminal to stop the server.

---

## 📡 API Endpoints

The API base URL is: `http://localhost:5000`

All responses are in JSON format.

### Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* ... */ },
  "total": 5
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Additional error details"
}
```

---

## 👥 User APIs

Base URL: `http://localhost:5000/api/users`

### 1. GET All Users

```
GET /api/users
```

**Description**: Retrieve all users from the database

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Ahmed Hassan",
      "email": "ahmed@example.com",
      "phone": "03001234567",
      "createdAt": "2024-03-01T10:30:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Fatima Khan",
      "email": "fatima@example.com",
      "phone": "03009876543",
      "createdAt": "2024-03-01T10:35:00.000Z"
    }
  ],
  "total": 2
}
```

**cURL Example**:
```bash
curl -X GET http://localhost:5000/api/users
```

---

### 2. GET Single User

```
GET /api/users/:id
```

**Parameters:**
- `id` (path parameter): User ID

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Ahmed Hassan",
    "email": "ahmed@example.com",
    "phone": "03001234567",
    "createdAt": "2024-03-01T10:30:00.000Z"
  }
}
```

**Error Response (404 Not Found)**:
```json
{
  "success": false,
  "message": "User not found",
  "id": "invalid-id"
}
```

**cURL Example**:
```bash
curl -X GET http://localhost:5000/api/users/550e8400-e29b-41d4-a716-446655440000
```

---

### 3. CREATE New User

```
POST /api/users
```

**Request Body**:
```json
{
  "name": "Samir Ali",
  "email": "samir@example.com",
  "phone": "03005555555"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "name": "Samir Ali",
    "email": "samir@example.com",
    "phone": "03005555555",
    "createdAt": "2024-03-01T12:00:00.000Z"
  }
}
```

**Validation Error (400 Bad Request)**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Name is required",
    "Valid email is required"
  ]
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Samir Ali",
    "email": "samir@example.com",
    "phone": "03005555555"
  }'
```

---

### 4. UPDATE User

```
PUT /api/users/:id
```

**Parameters:**
- `id` (path parameter): User ID to update

**Request Body** (send only the fields you want to update):
```json
{
  "name": "Ahmed Hassan Updated",
  "email": "ahmed.new@example.com"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Ahmed Hassan Updated",
    "email": "ahmed.new@example.com",
    "phone": "03001234567",
    "createdAt": "2024-03-01T10:30:00.000Z"
  }
}
```

**cURL Example**:
```bash
curl -X PUT http://localhost:5000/api/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmed Hassan Updated",
    "email": "ahmed.new@example.com"
  }'
```

---

### 5. DELETE User

```
DELETE /api/users/:id
```

**Parameters:**
- `id` (path parameter): User ID to delete

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Ahmed Hassan",
    "email": "ahmed@example.com",
    "phone": "03001234567",
    "createdAt": "2024-03-01T10:30:00.000Z"
  }
}
```

**cURL Example**:
```bash
curl -X DELETE http://localhost:5000/api/users/550e8400-e29b-41d4-a716-446655440000
```

---

## 📦 Product APIs

Base URL: `http://localhost:5000/api/products`

### 1. GET All Products

```
GET /api/products?category=Electronics&minPrice=1000&maxPrice=100000
```

**Query Parameters** (all optional):
- `category`: Filter by product category
- `minPrice`: Filter by minimum price
- `maxPrice`: Filter by maximum price

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": "prod-001",
      "name": "Laptop",
      "description": "High-performance laptop for work",
      "price": 120000,
      "stock": 10,
      "category": "Electronics",
      "createdAt": "2024-03-01T10:00:00.000Z"
    },
    {
      "id": "prod-002",
      "name": "Smartphone",
      "description": "Latest smartphone with advanced features",
      "price": 80000,
      "stock": 25,
      "category": "Electronics",
      "createdAt": "2024-03-01T10:05:00.000Z"
    }
  ],
  "total": 2
}
```

**cURL Examples**:
```bash
# Get all products
curl -X GET http://localhost:5000/api/products

# Filter by category
curl -X GET "http://localhost:5000/api/products?category=Electronics"

# Filter by price range
curl -X GET "http://localhost:5000/api/products?minPrice=50000&maxPrice=150000"
```

---

### 2. GET Single Product

```
GET /api/products/:id
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": "prod-001",
    "name": "Laptop",
    "description": "High-performance laptop for work",
    "price": 120000,
    "stock": 10,
    "category": "Electronics",
    "createdAt": "2024-03-01T10:00:00.000Z"
  }
}
```

---

### 3. CREATE New Product

```
POST /api/products
```

**Request Body**:
```json
{
  "name": "Monitor",
  "description": "4K Ultra HD Monitor",
  "price": 35000,
  "stock": 15,
  "category": "Electronics"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "prod-004",
    "name": "Monitor",
    "description": "4K Ultra HD Monitor",
    "price": 35000,
    "stock": 15,
    "category": "Electronics",
    "createdAt": "2024-03-01T12:00:00.000Z"
  }
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Monitor",
    "description": "4K Ultra HD Monitor",
    "price": 35000,
    "stock": 15,
    "category": "Electronics"
  }'
```

---

### 4. UPDATE Product

```
PUT /api/products/:id
```

**Request Body**:
```json
{
  "price": 33000,
  "stock": 20
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": "prod-001",
    "name": "Laptop",
    "description": "High-performance laptop for work",
    "price": 33000,
    "stock": 20,
    "category": "Electronics",
    "createdAt": "2024-03-01T10:00:00.000Z"
  }
}
```

---

### 5. DELETE Product

```
DELETE /api/products/:id
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": { /* deleted product */ }
}
```

---

### 6. GET Available Products (Stock > 0)

```
GET /api/products/stock/available
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Available products retrieved successfully",
  "data": [ /* products with stock > 0 */ ],
  "total": 3
}
```

---

## 🛒 Order APIs

Base URL: `http://localhost:5000/api/orders`

### 1. GET All Orders

```
GET /api/orders?status=Delivered&userId=user-id
```

**Query Parameters** (all optional):
- `status`: Filter by order status (Pending, Processing, Shipped, Delivered)
- `userId`: Filter by user ID

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": [
    {
      "id": "order-001",
      "userId": "user-001",
      "items": [
        {
          "productId": "prod-001",
          "quantity": 1,
          "price": 120000,
          "productName": "Laptop"
        }
      ],
      "totalAmount": 120000,
      "status": "Delivered",
      "createdAt": "2024-03-01T10:00:00.000Z",
      "updatedAt": "2024-03-01T10:30:00.000Z"
    }
  ],
  "total": 1
}
```

---

### 2. GET Single Order

```
GET /api/orders/:id
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": {
    "id": "order-001",
    "userId": "user-001",
    "items": [ /* ... */ ],
    "totalAmount": 120000,
    "status": "Delivered",
    "createdAt": "2024-03-01T10:00:00.000Z",
    "updatedAt": "2024-03-01T10:30:00.000Z",
    "userInfo": {
      "id": "user-001",
      "name": "Ahmed Hassan",
      "email": "ahmed@example.com"
    }
  }
}
```

---

### 3. CREATE New Order

```
POST /api/orders
```

**Request Body**:
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "items": [
    {
      "productId": "prod-001",
      "quantity": 2
    },
    {
      "productId": "prod-002",
      "quantity": 1
    }
  ]
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "order-002",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "items": [
      {
        "productId": "prod-001",
        "quantity": 2,
        "price": 120000,
        "productName": "Laptop"
      },
      {
        "productId": "prod-002",
        "quantity": 1,
        "price": 80000,
        "productName": "Smartphone"
      }
    ],
    "totalAmount": 320000,
    "status": "Pending",
    "createdAt": "2024-03-01T12:00:00.000Z",
    "updatedAt": "2024-03-01T12:00:00.000Z"
  }
}
```

**Features:**
- Automatically calculates the total order amount
- Deducts stock from products
- Creates the order with "Pending" status
- Validates user and product existence

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "items": [
      {
        "productId": "prod-001",
        "quantity": 2
      },
      {
        "productId": "prod-002",
        "quantity": 1
      }
    ]
  }'
```

---

### 4. UPDATE Order Status

```
PUT /api/orders/:id
```

**Request Body**:
```json
{
  "status": "Shipped"
}
```

**Valid Statuses:**
- `Pending` - Order received, awaiting processing
- `Processing` - Order is being prepared
- `Shipped` - Order has been shipped
- `Delivered` - Order delivered to customer
- `Cancelled` - Order has been cancelled

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Order updated successfully",
  "data": {
    "id": "order-001",
    "status": "Shipped",
    "updatedAt": "2024-03-01T14:00:00.000Z"
    /* ... other fields ... */
  }
}
```

**Error Response (400 Bad Request)**:
```json
{
  "success": false,
  "message": "Invalid status",
  "errors": ["Status must be one of: Pending, Processing, Shipped, Delivered, Cancelled"]
}
```

**cURL Example**:
```bash
curl -X PUT http://localhost:5000/api/orders/order-001 \
  -H "Content-Type: application/json" \
  -d '{ "status": "Shipped" }'
```

---

### 5. DELETE Order

```
DELETE /api/orders/:id
```

**Important Rules:**
- Can only delete orders with status "Pending" or "Cancelled"
- Deleting an order restores the product stock

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Order deleted successfully",
  "data": { /* deleted order */ }
}
```

**Error Response (400 Bad Request)**:
```json
{
  "success": false,
  "message": "Cannot delete order",
  "reason": "Order status is Shipped. Can only delete Pending or Cancelled orders."
}
```

---

### 6. GET User Order History

```
GET /api/orders/user/:userId
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "User order history retrieved successfully",
  "user": {
    "id": "user-001",
    "name": "Ahmed Hassan",
    "email": "ahmed@example.com"
  },
  "data": [ /* all orders for this user */ ],
  "total": 5
}
```

---

## 🧪 Testing the APIs

### Using Postman (Recommended for Beginners)

1. **Download Postman** from [postman.com](https://www.postman.com/downloads/)
2. **Create a new request**:
   - Method: Select GET, POST, PUT, DELETE, etc.
   - URL: Enter the endpoint (e.g., `http://localhost:5000/api/users`)
   - Body: If POST/PUT, select "raw" and choose "JSON", then paste your JSON data
3. **Click Send** to make the request
4. **View the response** in the bottom panel

### Using cURL (Command Line)

```bash
# GET request
curl -X GET http://localhost:5000/api/users

# POST request with JSON data
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"1234567890"}'

# PUT request
curl -X PUT http://localhost:5000/api/users/user-id \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe"}'

# DELETE request
curl -X DELETE http://localhost:5000/api/users/user-id
```

### Using VS Code REST Client Extension

Install the "REST Client" extension in VS Code, then create a file like `test.http`:

```http
### Get all users
GET http://localhost:5000/api/users

### Create new user
POST http://localhost:5000/api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890"
}
```

Then click "Send Request" above each request.

---

## ⚙️ Environment Variables

Edit the `.env` file to configure your application:

### Available Variables

```
PORT=5000                    # Server listening port
NODE_ENV=development         # Environment (development/production)
API_VERSION=1.0.0           # API version
```

### How to Use

In your code, access environment variables with:

```javascript
const port = process.env.PORT;
const env = process.env.NODE_ENV;
```

---

## ❌ Error Handling

The API has comprehensive error handling:

### Error Response Format

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "Technical error details",
  "status": 400
}
```

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Validation failed, missing required fields |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Unexpected server error |

### Common Errors

**400 Bad Request - Missing Fields**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Name is required",
    "Email is required"
  ]
}
```

**404 Not Found**:
```json
{
  "success": false,
  "message": "User not found",
  "id": "invalid-id"
}
```

**500 Internal Server Error**:
```json
{
  "success": false,
  "message": "Error creating user",
  "error": "Database connection failed"
}
```

---

## 🚀 Future Improvements

Here are suggestions for enhancing this project:

### Immediate Enhancements
- [ ] Add input sanitization to prevent XSS attacks
- [ ] Add rate limiting to prevent API abuse
- [ ] Add request logging middleware
- [ ] Add pagination for list endpoints
- [ ] Add sorting and filtering options

### Database Integration
- [ ] Replace in-memory storage with MongoDB
- [ ] Create database models and schemas
- [ ] Add database migrations
- [ ] Implement connection pooling

### Authentication & Security
- [ ] Implement JWT authentication
- [ ] Add role-based access control (RBAC)
- [ ] Encrypt sensitive data
- [ ] Add HTTPS support
- [ ] Implement CORS properly

### Testing
- [ ] Write unit tests with Jest
- [ ] Write integration tests
- [ ] Add API documentation with Swagger/OpenAPI
- [ ] Setup CI/CD pipeline

### Advanced Features
- [ ] Add email notifications
- [ ] Add payment processing
- [ ] Add real-time updates with WebSockets
- [ ] Add caching with Redis
- [ ] Add search functionality with Elasticsearch

---

## 📞 Support & Troubleshooting

### Server Won't Start

**Problem**: Port already in use
```bash
# Solution 1: Change the port in .env
PORT=3001

# Solution 2: Kill the process using the port (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Solution 3: Kill the process using the port (Mac/Linux)
lsof -i :5000
kill -9 <PID>
```

### Dependencies Won't Install

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Changes Not Reflected

```bash
# Make sure you're using npm run dev (with auto-restart)
npm run dev

# Or restart the server manually if using npm start
```

---

## 📝 License

ISC License - Feel free to use, modify, and distribute this project.

---

## 👨‍💻 Author

**Naami Ahmed**
- Created: March 2026
- Purpose: Learning and teaching Node.js backend development

---

## 🎯 Key Learning Points Covered

1. ✅ Express.js server setup
2. ✅ Routing and middleware
3. ✅ CRUD operations (Create, Read, Update, Delete)
4. ✅ Request/Response handling
5. ✅ Error handling and validation
6. ✅ CORS configuration
7. ✅ Environment variables
8. ✅ API design best practices
9. ✅ Code documentation
10. ✅ In-memory data storage

---

## 📚 Recommended Learning Resources

- [Express.js Official Documentation](https://expressjs.com/)
- [Node.js Official Documentation](https://nodejs.org/docs/)
- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://http.cat/)
- [JSON Guide](https://www.json.org/)

---

**Happy Coding! 🚀**
