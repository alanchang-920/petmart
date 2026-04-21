```md
# 🐾 Pet Supplies E-commerce Shopping Cart

---

## 📌 Project Overview

- Single-page application (SPA)
- Pet products browsing system
- Full shopping cart functionality with database integration

---

## 🎯 Problem Statement

- Traditional demos only use static frontend data
- This project simulates a real e-commerce workflow with backend + database

---

## ⚙️ Tech Stack

- Frontend: React (Vite)
- Backend: FastAPI (Python)
- Database: MySQL
- ORM: SQLAlchemy
- Uses environment variables (.env) to securely manage database connection

---

## ✨ Features

### 🛍 Product Features

- Display all products from database
- Search products
- Filter by category
- Sort options:
  - Featured
  - Price (Low → High)
  - Price (High → Low)
  - Name (A → Z / Z → A)

---

### 🛒 Cart Features

- Add to cart
- Increase / decrease quantity
- Remove items
- Real-time total price calculation
- Sticky cart sidebar for better UX

---

### 🔄 Database (CRUD)

- Create: Add products and cart items
- Read: Fetch products and cart data
- Update: Modify quantity and product info
- Delete: Remove cart items and products

---

### 🎨 UI/UX Features

- Clean and modern design
- Responsive layout
- Hover effects and visual feedback
- Clear visual hierarchy and spacing

---

## 🚀 How to Run

### Backend

cd server  
uvicorn app.main:app --reload

### Frontend

cd client  
npm install  
npm run dev

---

## 🧪 Challenges

- Connecting React with FastAPI APIs
- Designing relational database schema
- Synchronizing frontend state with backend data
- Building smooth and intuitive UI

---

## 📦 Future Improvements

- User authentication (login system)
- Checkout system
- Payment integration
- Cloud deployment

---

## 👨‍💻 Author

- Chia-Ming Chang
```
