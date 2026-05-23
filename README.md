# PetMart — Pet Supplies E-Commerce

A single-page e-commerce demo for a pet-supplies store. Customers can browse a
product catalogue, manage a persistent shopping cart, and place an order with
shipping details. Administrators can manage three resources end-to-end:
**products**, **users**, and **carts (orders)**.

This is a group submission for **31748 / 32516 Web Programming — Assignment 2**.
## Group members

| Member          | Student ID |
| --------------- | ---------- |
| Chia-Ming Chang | 25421850   |
| Van Dao Le      | 25680051   |
| Kailai Ran      | 25956727   |

---

## What problem does it solve?

Most "shopping cart" demos use static, in-memory data and have no real backend.
PetMart shows a realistic, full-stack workflow:

- a relational database is the source of truth for the catalog and orders,
- JWT-based authentication separates customers from admin users,
- role-based access control restricts CRUD on users/products/orders to admins,
- a React UI handles browsing, search, filtering, cart persistence, and checkout.

---

## Tech stack

| Layer    | Technology                                  |
| -------- | ------------------------------------------- |
| Frontend | React 19 (Vite), Axios, react-icons         |
| Backend  | FastAPI (Python 3.12), Pydantic v2          |
| Database | MySQL 8 (via SQLAlchemy ORM)                |
| Auth     | JWT (PyJWT) + bcrypt password hashing       |
| Dev      | `docker-compose` for MySQL, `.env` for secrets |

CRUD is implemented over three conceptual entities (**Product**, **Cart/Order**,
**User**), satisfying the assignment's "≥3 entities" requirement.

---

## Folder structure

```
petmart/
├── README.md                   # this file
├── WORKLOAD.md                 # per-member workload allocation (template)
├── docker-compose.yml          # MySQL container for local dev
├── Dump20260408.sql            # sample database dump
│
├── client/                     # React SPA (Vite)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx            # React entrypoint
│       ├── App.jsx             # top-level shell: auth provider + state-based nav
│       ├── App.css, index.css  # global styles
│       ├── assets/             # static images / svgs
│       ├── contexts/
│       │   └── AuthContext.jsx # currentUser + login/register/logout
│       ├── hooks/
│       │   ├── useProducts.js  # catalog list, search/filter/sort
│       │   ├── useShopCart.js  # customer cart state (localStorage)
│       │   └── useCarts.js     # paginated admin cart table
│       ├── services/           # axios-based REST wrappers (one per resource)
│       │   ├── api.js          # shared axios instance with JWT interceptor
│       │   ├── productService.js
│       │   ├── userService.js
│       │   └── cartService.js
│       ├── components/         # reusable presentational pieces
│       │   ├── Header.jsx
│       │   ├── Toast.jsx
│       │   ├── ProductCard.jsx
│       │   ├── ProductGrid.jsx
│       │   └── CartSidebar.jsx (+ .module.css)
│       ├── pages/              # screens wired up via state-based nav
│       │   ├── HomePage.jsx          # shop catalog + cart sidebar
│       │   ├── LoginPage.jsx         # login / register form
│       │   ├── ProductManagement.jsx # admin CRUD over products
│       │   ├── UserManagement.jsx    # admin CRUD over users (+ .module.css)
│       │   └── AdminCart.jsx         # admin CRUD over carts (+ .module.css)
│       └── utils/
│           ├── storage.js      # localStorage wrapper (auth + cart)
│           └── shipping.js     # shipping-form validation helpers
│
└── server/                     # FastAPI service
    ├── requirements.txt
    ├── start_backend.sh
    ├── .env                    # DATABASE_URL, JWT_SECRET_KEY (gitignored)
    └── app/
        ├── main.py             # FastAPI app, CORS, router wiring
        ├── database.py         # SQLAlchemy engine + get_db dependency
        ├── core/               # cross-cutting infrastructure
        │   ├── config.py       # env-var loading (DATABASE_URL, JWT)
        │   └── security.py     # bcrypt, JWT, get_current_user, require_admin
        ├── models/             # SQLAlchemy ORM models (one file per entity)
        │   ├── product.py
        │   ├── cart.py         # Cart + CartItem
        │   └── user.py
        ├── schemas/            # Pydantic request/response models
        │   ├── product_schema.py
        │   ├── cart_schema.py
        │   └── user_schema.py
        ├── services/           # business + DB logic (called from routers)
        │   ├── product_service.py
        │   ├── cart_service.py
        │   └── user_service.py
        └── routers/            # FastAPI APIRouter modules (thin glue)
            ├── products.py
            ├── cart.py
            └── users.py
```

The layered backend (`routers → services → models`) keeps HTTP concerns
separate from business logic, which keeps routers short and makes each layer
testable in isolation.

---

## Prerequisites

- **Node.js ≥ 20** and **npm**
- **Python 3.12**
- **MySQL 8** (a `docker-compose.yml` is provided to start one locally)

---

## How to run

### 1. Database

```bash
docker compose up -d         # starts MySQL on localhost:3306
# `Dump20260408.sql` is auto-loaded into the `petmart` database by
# docker-compose (see the volume mount). No manual import needed.
#
# If you'd rather use an existing MySQL server, run:
#   mysql -u root -p petmart < Dump20260408.sql
```

### 2. Backend (FastAPI)

```bash
cd server
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# create server/.env with:
#   DATABASE_URL=mysql+pymysql://root:password@localhost:3306/petmart
#   JWT_SECRET_KEY=replace-me-with-a-random-string
#   ACCESS_TOKEN_EXPIRE_MINUTES=60

uvicorn app.main:app --reload
# Docs: http://127.0.0.1:8000/docs
```

### 3. Frontend (React + Vite)

```bash
cd client
npm install
npm run dev
# App: http://localhost:5173
```

Build for production with `npm run build` (output goes to `client/dist`).

---

## Test accounts

Pre-seeded in the SQL dump (`Dump20260408.sql`):

| Role  | Email               | Password   |
| ----- | ------------------- | ---------- |
| Admin | `admin@gmail.com`   | `12345678` |
| User  | `test2@gmail.com`   | `12345678` |

---

## Features

### Customer

- Browse the product catalog with search, category filter, and sort
- Add products to a persistent shopping cart (survives refresh via localStorage)
- Adjust quantity, remove items, see live total
- Place an order with recipient/phone/address + optional note
- Register and log in (JWT)

### Admin (role-gated)

- **Product Admin** — CRUD products (name, price, category, image, stock)
- **User Admin** — CRUD users; admins cannot be deleted
- **Cart Admin** — paginated table of all carts/orders; edit status, delete

---

## Security

- Passwords hashed with **bcrypt** before storage
- API auth via short-lived **JWT** in `Authorization: Bearer …`
- `require_admin` dependency guards every admin-only endpoint
- Secrets (DB URL, JWT signing key) are sourced from `.env`, never committed

---

## Workload allocation

See [WORKLOAD.md](./WORKLOAD.md) for the per-member breakdown of files and
features.

---

## Future improvements

- Migrate schema management to Alembic instead of `Base.metadata.create_all`
- Move customer cart state from localStorage to a server-backed draft cart
- Add automated tests (pytest + React Testing Library)
- Cloud deployment + payment gateway integration
