# Velmora Frontend API Contract (v1)

This contract is designed to replace current dummy/local state flows with backend APIs while keeping existing UI behavior unchanged.

## 1) API Conventions

- Base URL: `/api/v1`
- Auth: secure HTTP-only session cookie (or Bearer token if needed later)
- Content-Type: `application/json`
- Date format: ISO-8601
- Pagination defaults: `page=1`, `limit=20`

### Standard success envelope

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

### Standard error envelope

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human readable message",
    "details": {
      "field": "reason"
    }
  }
}
```

### Common error codes

- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `VALIDATION_ERROR`
- `CONFLICT`
- `RATE_LIMITED`
- `INTERNAL_ERROR`

---

## 2) Core Resource Shapes

### User

```json
{
  "id": "usr_123",
  "name": "John Doe",
  "email": "john@example.com",
  "image": "https://..."
}
```

### Product

```json
{
  "id": "prod_123",
  "name": "Product Name",
  "description": "...",
  "mrp": 1299,
  "price": 999,
  "images": ["https://..."],
  "category": "Electronics",
  "inStock": true,
  "storeId": "store_1",
  "createdAt": "2026-03-15T10:00:00.000Z",
  "updatedAt": "2026-03-15T10:00:00.000Z"
}
```

### Address

```json
{
  "id": "addr_123",
  "userId": "usr_123",
  "name": "John Doe",
  "email": "john@example.com",
  "street": "Street 1",
  "city": "Pune",
  "state": "MH",
  "zip": "411001",
  "country": "India",
  "phone": "9999999999"
}
```

### Coupon

```json
{
  "code": "SAVE10",
  "description": "10% off",
  "discount": 10,
  "discountType": "percentage",
  "minOrderValue": 500,
  "maxUsageLimit": 100,
  "usageCount": 20,
  "isPublic": true,
  "forNewUser": false,
  "forMember": false,
  "expiresAt": "2026-12-31T23:59:59.000Z"
}
```

### Order

```json
{
  "id": "ord_123",
  "userId": "usr_123",
  "storeId": "store_1",
  "addressId": "addr_123",
  "status": "ORDER_PLACED",
  "paymentMethod": "COD",
  "isPaid": false,
  "isCouponUsed": true,
  "coupon": { "code": "SAVE10", "discount": 10 },
  "total": 1499,
  "orderItems": [
    {
      "productId": "prod_123",
      "quantity": 2,
      "price": 749
    }
  ],
  "createdAt": "2026-03-15T10:00:00.000Z"
}
```

### Rating

```json
{
  "id": "rat_123",
  "userId": "usr_123",
  "productId": "prod_123",
  "orderId": "ord_123",
  "rating": 5,
  "review": "Great product",
  "createdAt": "2026-03-15T10:00:00.000Z"
}
```

### Store

```json
{
  "id": "store_1",
  "userId": "usr_123",
  "name": "My Store",
  "username": "my-store",
  "description": "...",
  "address": "...",
  "status": "pending",
  "isActive": false,
  "logo": "https://...",
  "email": "store@example.com",
  "contact": "9999999999"
}
```

---

## 3) Auth APIs

Implemented in current backend foundation:
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `GET /admin/me` (role-protected: `ADMIN|MANAGER|STAFF`)

### `POST /auth/signup`
Create account.

Request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "agreeTerms": true
}
```

Response: `201 Created` + user profile.

### `POST /auth/login`
Sign in and set session.

Request:

```json
{
  "email": "john@example.com",
  "password": "secret123",
  "rememberMe": true
}
```

Response: `200 OK` + user profile.

### `POST /auth/logout`
Clear session.

### `GET /auth/me`
Get current user.

### `POST /auth/forgot-password`
Request a password reset token for an email.

Request:

```json
{
  "email": "john@example.com"
}
```

Response: always generic success message; in non-production may include `debug.resetUrl`.

### `POST /auth/reset-password`
Reset password using reset token.

Request:

```json
{
  "token": "raw_reset_token",
  "password": "newSecret123"
}
```

---

## 4) Product APIs

### `GET /products`
Public listing with filters/sort/search.

Query params:
- `search`
- `category`
- `minPrice`
- `maxPrice`
- `minRating`
- `inStock`
- `sort` (`newest|price_low|price_high|best_rated`)
- `page`, `limit`

### `GET /products/:productId`
Get product details.

### `POST /stores/:storeId/products`
Create product (seller only).

### `PATCH /products/:productId`
Update product fields (seller/admin).

### `PATCH /products/:productId/stock`
Quick stock toggle.

Request:

```json
{ "inStock": true }
```

### `DELETE /products/:productId`
Delete product.

---

## 5) Wishlist APIs

### `GET /wishlist`
Get current user wishlist product IDs (or expanded products).

### `PUT /wishlist/:productId`
Add to wishlist.

### `DELETE /wishlist/:productId`
Remove from wishlist.

### `DELETE /wishlist`
Clear wishlist.

---

## 6) Address APIs

### `GET /addresses`
List user addresses.

### `POST /addresses`
Add address.

### `PATCH /addresses/:addressId`
Update address.

### `DELETE /addresses/:addressId`
Delete address.

---

## 7) Coupon APIs

### `POST /coupons/validate`
Validate and compute discount for cart total.

Request:

```json
{
  "code": "SAVE10",
  "cartTotal": 2000
}
```

Response:

```json
{
  "success": true,
  "data": {
    "applied": true,
    "coupon": { "code": "SAVE10", "discount": 10, "discountType": "percentage" },
    "discountAmount": 200
  }
}
```

### Admin coupon management
- `GET /admin/coupons`
- `POST /admin/coupons`
- `PATCH /admin/coupons/:code`
- `DELETE /admin/coupons/:code`

---

## 8) Cart APIs

> Frontend currently stores only `{ productId: quantity }` with `total` count. Backend should return expanded cart for checkout.

### `GET /cart`
Return persisted cart.

### `PUT /cart/items/:productId`
Set quantity.

Request:

```json
{ "quantity": 3 }
```

### `DELETE /cart/items/:productId`
Remove line item.

### `DELETE /cart`
Clear cart.

---

## 9) Order APIs

### `POST /orders`
Create order from cart/checkout selection.

Request:

```json
{
  "addressId": "addr_123",
  "paymentMethod": "COD",
  "couponCode": "SAVE10"
}
```

Response: created order with items and totals.

### `GET /orders/me`
Customer order history.

### `GET /orders/:orderId`
Order detail.

### Seller order management
- `GET /stores/:storeId/orders`
- `PATCH /orders/:orderId/status` with `ORDER_PLACED|PROCESSING|SHIPPED|DELIVERED`

### Admin visibility
- `GET /admin/orders`
- `PATCH /admin/orders/:orderId/status` with `ORDER_PLACED|PROCESSING|SHIPPED|DELIVERED`

---

## 10) Rating APIs

### `POST /ratings`
Submit rating (must belong to delivered order item).

Request:

```json
{
  "productId": "prod_123",
  "orderId": "ord_123",
  "rating": 5,
  "review": "Great"
}
```

### `GET /products/:productId/ratings`
List product ratings.

---

## 11) Store + Admin APIs

### Seller
- `GET /stores/me/dashboard` (kpis + ratings)
- `GET /stores/me`
- `PATCH /stores/me`

### Public store pages
- `GET /stores/:username`
- `GET /stores/:username/products`

### Admin stores approval & activation
- `GET /admin/stores?status=pending|approved|rejected`
- `PATCH /admin/stores/:storeId/approval` with `{ "status": "approved|rejected" }`
- `PATCH /admin/stores/:storeId/active` with `{ "isActive": true }`
- `GET /admin/dashboard`

### Admin users management
- `GET /admin/users?role=&status=&search=&page=&limit=`
- `PATCH /admin/users/:userId/status` with `{ "status": "ACTIVE|BLOCKED|DEACTIVATED" }`

### Admin products management
- `GET /admin/products?category=&inStock=&search=&page=&limit=`
- `POST /admin/products`
- `POST /admin/products/bulk`
- `PATCH /admin/products/:productId`
- `PATCH /admin/products/:productId/stock` with `{ "inStock": true }`
- `DELETE /admin/products/:productId`

Bulk upload JSON template (`POST /admin/products/bulk` request body uses `{ "products": [...] }`):

```json
[
  {
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse with silent clicks",
    "category": "Electronics",
    "mrp": 1499,
    "price": 1099,
    "images": ["https://..."],
    "inStock": true,
    "storeId": "optional_store_id"
  }
]
```

---

## 12) Frontend Mapping (Current Redux -> API)

- `productSlice`
  - `setProduct/addProduct/updateProduct/deleteProduct` -> product endpoints in section 4
- `cartSlice`
  - `addToCart/removeFromCart/deleteItemFromCart/clearCart` -> cart endpoints in section 8
- `addressSlice`
  - `addAddress` -> address endpoints in section 6
- `couponSlice`
  - `applyCoupon/removeCoupon` -> coupon validate endpoint in section 7
- `wishlistSlice`
  - `toggle/add/remove/clear` -> wishlist endpoints in section 5
- `ratingSlice`
  - `addRating` -> rating endpoints in section 10

---

## 13) Rollout Plan (Backend Integration)

### Phase A (safe, low-risk)
1. Auth (`/auth/*`)
2. Products list/details (`GET /products`, `GET /products/:id`)
3. Wishlist + addresses

### Phase B (checkout path)
4. Cart persistence
5. Coupon validation API
6. Order creation + customer orders

### Phase C (seller/admin)
7. Store dashboard + product management APIs
8. Store orders status API
9. Admin dashboard/stores/coupons/orders

---

## 14) Notes for Implementation

- Keep Prisma enums aligned with frontend statuses:
  - `OrderStatus`: `ORDER_PLACED | PROCESSING | SHIPPED | DELIVERED`
  - `PaymentMethod`: `COD | STRIPE`
- Keep coupon response compatible with current `couponSlice` fields:
  - `discount`, `discountType`, `discountAmount`, `error`
- Ensure `Order` responses include nested `orderItems.product` and `address` to support current UI directly.
- Prefer returning normalized IDs + expanded payloads where UI currently expects full objects.
