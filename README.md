# ShoppyGlobe Backend

Backend REST API for the ShoppyGlobe e-commerce application, built with Node.js, Express, and MongoDB. Built as part of the "Build APIs with Node.js and Express.js for Shoppyglobe E-commerce" project.

## Tech Stack

- **Node.js** + **Express.js** — server and routing
- **MongoDB** + **Mongoose** — database and schema modeling
- **jsonwebtoken (JWT)** — authentication
- **bcryptjs** — password hashing
- **dotenv** — environment variable management
- **nodemon** — auto-restart during development

## Project Structure
shoppyglobe-backend/

├── config/

│   └── db.js              # MongoDB connection logic

├── controllers/

│   ├── authController.js  # register/login logic

│   ├── productController.js

│   └── cartController.js

├── middleware/

│   └── auth.js            # JWT verification (protect routes)

├── models/

│   ├── User.js

│   ├── Product.js

│   └── Cart.js

├── routes/

│   ├── authRoutes.js

│   ├── productRoutes.js

│   └── cartRoutes.js

├── seed/

│   └── seedProducts.js    # inserts sample product data

├── .env                   # local environment variables (not committed)

├── .gitignore

├── server.js               # app entry point

└── package.json

## Setup Instructions

1. Clone the repo and install dependencies:
```bash
   git clone <repo-url>
   cd shoppyglobe-backend
   npm install
```

2. Create a `.env` file in the root with:
PORT=5100

MONGO_URI=mongodb://localhost:27017/shoppyglobe

JWT_SECRET=<your own long random string>

3. Seed sample products into the database:
```bash
   npm run seed
```

4. Start the server:
```bash
   npm run dev
```

The API will be available at `http://localhost:5100`.

## API Endpoints

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a new user |
| POST | `/login` | Public | Authenticate and receive a JWT |

**POST /register** — body:
```json
{ "name": "John Doe", "email": "john@example.com", "password": "password123" }
```

**POST /login** — body:
```json
{ "email": "john@example.com", "password": "password123" }
```
Both return a `token` to be used in the `Authorization` header for protected routes.

### Products

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/products` | Public | Get all products |
| GET | `/products/:id` | Public | Get a single product by ID |

### Cart (requires authentication)

All cart routes require the header:
Authorization: Bearer <token>

| Method | Endpoint | Description |
|---|---|---|
| GET | `/cart` | Get the logged-in user's cart |
| POST | `/cart` | Add a product to the cart — body: `{ "productId": "...", "quantity": 2 }` |
| PUT | `/cart/:id` | Update quantity of a cart item — body: `{ "quantity": 5 }` (`:id` is the cart item's own ID) |
| DELETE | `/cart/:id` | Remove a cart item |

## Validation & Error Handling

- All routes are wrapped in try/catch with descriptive error messages and appropriate HTTP status codes (400, 401, 404, 500).
- Adding to cart validates that the `productId` exists and that there's enough stock before creating a cart entry.
- Cart routes verify the JWT and confirm the cart item belongs to the requesting user before allowing updates/deletes.

## Testing

All endpoints were manually tested using ThunderClient, including:
- Successful registration/login
- Successful product retrieval (list + single)
- Successful add/update/view/delete on cart
- Negative cases: invalid product ID, missing/invalid JWT, duplicate email registration, wrong login credentials

Screenshots of these tests are included in the submission.


## Author 

Shashwat Gupta
Built as part of an Internshala Trainings backend assignment.

## Github Link 
https://github.com/sushashwat/shoppyglobe-Backend
