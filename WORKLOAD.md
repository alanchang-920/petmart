# Workload Allocation — PetMart (Assignment 2)

> **TEMPLATE — fill in each member's name, GitHub handle, and the files /
> features they own before submission.**
>
> Tips for the rubric ("Allocation of Workload", 4 marks):
> 1. Make the split explicit — list the *files* each member authored.
> 2. Avoid relying on a single member: each person should own at least one
>    feature end-to-end (model + schema + service + router + UI page).
> 3. Git commits should match this allocation (each member commits the files
>    listed under their name).

---

## Group members

| Member          | Student ID |
| --------------- | ---------- |
| Chia-Ming Chang | 25421850   |
| Van Dao Le      | 25680051   |
| Kailai Ran      | 25956727   |


---

## File-level ownership

The codebase is organised so each entity (Product, Cart, User) cuts a vertical
slice through `models → schemas → services → routers → pages/components`.
This makes per-member ownership clean.

### Member 1 — `Chia-Ming Chang` (feature: **Product**)

**Backend**
- `server/app/models/product.py`
- `server/app/schemas/product_schema.py`
- `server/app/services/product_service.py`
- `server/app/routers/products.py`

**Frontend**
- `client/src/services/productService.js`
- `client/src/hooks/useProducts.js`
- `client/src/components/ProductCard.jsx`
- `client/src/components/ProductGrid.jsx`
- `client/src/pages/ProductManagement.jsx`

---

### Member 2 — `Van Dao Le` (feature: **Cart / Orders**)

**Backend**
- `server/app/models/cart.py`            (Cart + CartItem)
- `server/app/schemas/cart_schema.py`
- `server/app/services/cart_service.py`
- `server/app/routers/cart.py`

**Frontend**
- `client/src/services/cartService.js`
- `client/src/hooks/useShopCart.js`
- `client/src/hooks/useCarts.js`         (admin pagination)
- `client/src/components/CartSidebar.jsx` (+ `.module.css`)
- `client/src/pages/AdminCart.jsx`        (+ `.module.css`)
- `client/src/utils/shipping.js`

---

### Member 3 — `Kailai Ran` (feature: **User / Auth**)

**Backend**
- `server/app/models/user.py`
- `server/app/schemas/user_schema.py`
- `server/app/services/user_service.py`
- `server/app/routers/users.py`
- `server/app/core/security.py`           (bcrypt + JWT helpers)
- `server/app/core/config.py`

**Frontend**
- `client/src/services/userService.js`
- `client/src/services/api.js`            (axios + JWT interceptor)
- `client/src/contexts/AuthContext.jsx`
- `client/src/pages/LoginPage.jsx`
- `client/src/pages/UserManagement.jsx`   (+ `.module.css`)
- `client/src/utils/storage.js`

---

## Verification

- Each file in `client/src` and `server/app` is claimed by exactly one member
  above.
- Cross-cutting concerns (auth, app shell) sit with the member responsible for
  user/auth and the shell member respectively — no two members both edit the
  same module in steady state.
- The Git history reflects this allocation: see `git log --author="<name>"`
  for each member.
