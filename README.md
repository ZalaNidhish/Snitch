# Snitch – E-commerce Store (Auth + Product CRUD)

Snitch is a small full-stack e-commerce app. **Sellers** manage a product catalogue (create, edit, delete, list / unlist, image upload). **Users** browse the listed products. Authentication uses JWT access + refresh tokens.

- **Live link:** `<add your deployed frontend URL>`
- **Backend API (deployed):** https://snitch-beka.onrender.com
- **GitHub:** https://github.com/ZalaNidhish/Snitch

---

## Tech Stack

| Layer | Tools |
|-------|-------|
| Backend | Node.js, Express 5, MongoDB + Mongoose, JWT (`jsonwebtoken`), `bcrypt`, `express-validator`, `multer`, `cookie-parser`, `cors`, ImageKit (image storage) |
| Frontend | React 19, Vite, React Router 7, Redux Toolkit (auth state), TanStack React Query (server state), React Hook Form, Axios, Tailwind CSS 4, React-Toastify |

---

## Features

- Register / login / logout / get current user
- Short-lived **access token** (15 min) + long-lived **refresh token** (7 days, `httpOnly` cookie, stored on the user in the DB)
- Automatic silent token refresh on the frontend (Axios interceptor retries the failed request once)
- Logged-out access tokens are **blacklisted** (auto-expire after 15 min via a TTL index)
- Role based access: `user` and `seller`; all write routes on products are **seller only**
- Product CRUD with multi-image upload (max 5 images, 1 MB each) to ImageKit
- List / unlist products (only listed products are visible to the public)
- Request validation with `express-validator` on auth and product routes (field-level 400 errors)

---

## Project Structure

```
Snitch/
├── backend/
│   ├── server.js                # entry point (connects DB, starts server)
│   └── src/
│       ├── app.js               # express app, middlewares, route mounting
│       ├── config/              # env config + DB connection
│       ├── controllers/         # auth, product, cart logic
│       ├── middlewares/         # authenticate (JWT) + authorize (seller role)
│       ├── models/              # user, product, cart, blacklist
│       ├── routes/              # auth, product, cart routes
│       ├── services/            # ImageKit upload / delete
│       ├── utils/               # token helpers
│       └── validators/          # express-validator chains
└── frontend/
    └── src/
        ├── config/              # axios instance (+ refresh interceptor), redux store
        ├── routes/              # router + route guards
        ├── shared/              # navbar, loader, error helper
        └── features/
            ├── auth/            # login / register, redux slice + thunks
            ├── user/            # public product list + details
            └── seller/          # dashboard, create / edit / delete / list / unlist
```

---

## Setup

### Prerequisites
- Node.js 18+
- A MongoDB database (local or MongoDB Atlas)
- An [ImageKit](https://imagekit.io) account (for product image uploads)

### 1. Clone
```bash
git clone https://github.com/ZalaNidhish/Snitch.git
cd Snitch
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env      # then fill in the values
npm start                 # runs on http://localhost:3000
```

`backend/.env`:

| Variable | Description |
|----------|-------------|
| `PORT` | Port for the API (e.g. `3000`) |
| `BACKEND_URL` | Base URL, used only for the startup log (e.g. `http://localhost`) |
| `MONGO_URI` | MongoDB connection string |
| `ACCESS_TOKEN_SECRET` | Secret for signing access tokens |
| `REFRESH_TOKEN_SECRET` | Secret for signing refresh tokens (use a different value) |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key |

### 3. Frontend
```bash
cd frontend
npm install
npm run dev               # runs on http://localhost:5173
```

In dev, the frontend calls `/api` and Vite proxies it to the backend. By default it proxies to the deployed API; to use your local backend create `frontend/.env`:

```env
VITE_PROXY_TARGET=http://localhost:3000
```

Other optional variables are listed in `frontend/.env.example`.

### 4. Create a seller account
Anyone who registers gets the role `user`. Sellers are promoted manually:

1. Register normally from the app.
2. In MongoDB (Compass / Atlas), open the `users` collection and change that user's `role` from `"user"` to `"seller"`.
3. Log out and log in again — you'll be redirected to the seller dashboard (`/seller`).

---

## API Reference

Base URL: `http://localhost:3000` (local) · `https://snitch-beka.onrender.com` (deployed)

Protected routes need the header `Authorization: Bearer <accessToken>`.

### Auth – `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Create an account. Body: `name`, `email`, `password` |
| POST | `/api/auth/login` | Public | Login. Body: `email`, `password`. Returns the access token; sets the refresh token cookie |
| POST | `/api/auth/refresh` | Public (needs refresh cookie) | Verifies the refresh token, rotates it and returns a new access token |
| POST | `/api/auth/logout` | Authenticated | Blacklists the access token, clears the stored refresh token and the cookie |
| GET | `/api/auth/me` | Authenticated | Returns the logged-in user's profile |

**Validation:** `name` 2–50 chars · `email` valid format · `password` min 6 chars (register).

### Products – `/api/product`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/product` | Public | List all **listed** products |
| GET | `/api/product/:id` | Public | Get a single product |
| GET | `/api/product/seller` | Seller | List all products (listed + unlisted) for the seller dashboard |
| POST | `/api/product` | Seller | Create a product (`multipart/form-data`) |
| PUT | `/api/product/:id` | Seller | Update a product (`multipart/form-data`) — only the seller who owns it |
| DELETE | `/api/product/:id` | Seller | Delete a product and its images |
| POST | `/api/product/list/:id` | Seller | Make a product visible to the public |
| POST | `/api/product/unlist/:id` | Seller | Hide a product from the public |

**Create / update body (`multipart/form-data`):**

| Field | Type | Rules |
|-------|------|-------|
| `title` | string | 2–30 chars |
| `description` | string | 10–500 chars |
| `price` | JSON string | `{"amount": 499, "currency": "INR"}` — amount ≥ 0, currency `INR` or `USD` |
| `sizes` | JSON string | `[{"size": "M", "stock": 10}]` — size one of `XS, M, L, XL, XXL`, stock integer ≥ 0 |
| `images` | files | Up to 5 images, 1 MB each (optional on update — new files are added to the existing ones) |
| `imagesToDelete` | JSON string | *(update only)* array of ImageKit file ids to remove |

### Cart – `/api/cart`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/cart` | Authenticated + role check | Add a product to the cart. Body: `productID`, `quantity`, `size` |

### Error format

Validation failures return `400` with a message and field-level errors:

```json
{
  "message": "Invalid Request",
  "errors": [
    { "type": "field", "path": "email", "msg": "Invalid Email Format.", "location": "body" }
  ]
}
```

| Status | Meaning |
|--------|---------|
| 400 | Validation failed / invalid credentials / access token missing or blacklisted |
| 401 | Access token invalid or expired / refresh token missing |
| 403 | Logged in but not a seller |
| 404 | Product not found (or not owned by the seller on update) |
| 500 | Unexpected server error |

---

## How Authentication Works

1. **Login / Register** → the server returns an **access token** (JSON body, 15 min) and sets a **refresh token** (`httpOnly` cookie, 7 days). The refresh token is also saved on the user document.
2. The frontend keeps the access token in `localStorage` and the Axios request interceptor adds `Authorization: Bearer <token>` to every call.
3. When a request fails with **401** (expired access token), the Axios response interceptor calls `POST /api/auth/refresh` **once**, saves the new access token and **retries** the original request. Parallel failures share one refresh call.
4. If the refresh is rejected, the session is cleared and the user is asked to log in again.
5. **Logout** blacklists the current access token, clears the stored refresh token and removes the cookie.
6. On page load, the app calls `GET /api/auth/me` to restore the session.

---

## Frontend Routes

| Path | Who | Page |
|------|-----|------|
| `/` | Everyone | Product listing |
| `/product/:id` | Everyone | Product details |
| `/auth`, `/auth/register` | Logged-out users | Login / Register |
| `/seller` | Seller | Dashboard (all / listed / unlisted / create product) |
| `/seller/product/:id` | Seller | Seller product details |
| `/seller/product/edit/:id` | Seller | Edit product |
