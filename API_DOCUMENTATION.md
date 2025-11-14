# API Documentation - Complete Request & Response Data

## Authentication Endpoints

### 1. POST /register
**Request Data:**
- `name` (string, required, max: 255 characters)
- `email` (string, required, email format, unique in database, max: 255 characters)
- `password` (string, required, must be confirmed, min: 8 characters)
- `password_confirmation` (string, required, must match password)

**Response Data (200):**
```json
{
  "status": "success",
  "message": null,
  "data": null
}
```
*Note: Redirects to `/admin/dashboard` after successful registration*

---

### 2. POST /login
**Request Data:**
- `email` (string, required, email format, max: 255 characters)
- `password` (string, required)
- `remember` (boolean, optional, default: false)

**Response Data (302):**
```json
{
  "status": "success",
  "message": null,
  "data": null
}
```
*Note: Redirects to `/admin` and creates Sanctum auth token*

---

### 3. POST /logout
**Request Data:**
- None (requires authentication via Bearer token)

**Response Data (302):**
*Redirects to `/` after deleting all user tokens*

---

### 4. POST /forgot-password
**Request Data:**
- `email` (string, required, email format, max: 255 characters)

**Response Data (302):**
```json
{
  "status": "A reset link will be sent if the account exists."
}
```
*Note: Redirects back with status message*

---

### 5. POST /reset-password
**Request Data:**
- `token` (string, required, max: 255 characters)
- `email` (string, required, email format, max: 255 characters)
- `password` (string, required, must be confirmed, min: 8 characters)
- `password_confirmation` (string, required, must match password)

**Response Data (302):**
*Redirects to `/login` with success status message*

---

### 6. POST /email/verification-notification
**Request Data:**
- None (requires authentication)

**Response Data (302):**
*Redirects back with verification status*

---

### 7. POST /confirm-password
**Request Data:**
- `password` (string, required, must match current user password)

**Response Data (302):**
*Redirects to intended route after confirmation*

---

### 8. GET /verify-email/{id}/{hash}
**Request Data:**
- None (uses signed URL parameters)

**Response Data (302):**
*Redirects after email verification*

---

## Admin Management Endpoints

### 9. GET /api/v1/admin
**Request Data:**
- None (requires authentication)

**Response Data (200):**
```json
{
  "status": "success",
  "message": "Admins fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "email_verified_at": "2024-01-01T12:00:00.000000Z",
      "created_at": "2024-01-01T12:00:00.000000Z",
      "updated_at": "2024-01-01T12:00:00.000000Z",
      "company_id": null,
      "roles": [
        {
          "id": 1,
          "name": "admin",
          "guard_name": "web",
          "created_at": "2024-01-01T12:00:00.000000Z",
          "updated_at": "2024-01-01T12:00:00.000000Z"
        }
      ]
    }
  ]
}
```

---

### 10. POST /api/v1/admin
**Request Data:**
- `name` (string, required, max: 255 characters)
- `email` (string, required, email format, unique in users table, max: 255 characters)
- `role` (string, required, must be one of: super_admin, admin, standard, guest)

**Response Data (200):**
```json
{
  "status": "success",
  "message": "Admin created successfully",
  "data": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "email_verified_at": null,
    "created_at": "2024-01-01T12:00:00.000000Z",
    "updated_at": "2024-01-01T12:00:00.000000Z",
    "company_id": null
  }
}
```
*Note: Sends invitation email with temporary password*

---

### 11. PUT /api/v1/admin
**Request Data:**
- `id` (integer, required, must exist in users table)
- `name` (string, optional, max: 255 characters)
- `email` (string, optional, email format, unique except current user, max: 255 characters)
- `role` (string, optional, must be one of: super_admin, admin, standard, guest)

**Response Data (200):**
```json
{
  "status": "success",
  "message": "Admin updated successfully",
  "data": {
    "id": 2,
    "name": "Jane Smith Updated",
    "email": "jane@example.com",
    "email_verified_at": null,
    "created_at": "2024-01-01T12:00:00.000000Z",
    "updated_at": "2024-01-01T12:30:00.000000Z",
    "company_id": null
  }
}
```

---

### 12. DELETE /api/v1/admin
**Request Data:**
- `id` (integer, required, must exist in users table)

**Response Data (200):**
```json
{
  "status": "success",
  "message": "Admin deleted successfully",
  "data": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com"
  }
}
```

---

## Profile & Settings Endpoints

### 13. PATCH /settings/profile
**Request Data:**
- `name` (string, required, max: 255 characters)
- `email` (string, required, lowercase, email format, unique except current user, max: 255 characters)

**Response Data (302):**
*Redirects to `/admin/settings/profile`*

---

### 14. DELETE /settings/profile
**Request Data:**
- `password` (string, required, must match current user password)

**Response Data (302):**
*Redirects to `/` after deleting account*

---

### 15. PUT /settings/password
**Request Data:**
- `current_password` (string, required, must match current user password)
- `password` (string, required, must be confirmed, min: 8 characters)
- `password_confirmation` (string, required, must match password)

**Response Data (302):**
*Redirects back to password settings page*

---

## Product Endpoints

### 16. GET /api/v1/products (List/Search - Public)
**Request Data (Query Parameters):**
- `id` (integer, optional, must exist in products table)
- `name` (string, optional, max: 255 characters)
- `brand` (integer, optional, must exist in brands table)
- `categories` (array, optional, array of integers, each must exist in categories table)
- `all_categories` (array, optional, array of integers, each must exist in categories table)
- `min_price` (numeric, optional, min: 0)
- `max_price` (numeric, optional, must be greater than min_price)
- `sort_by` (string, optional, one of: price_asc, price_desc, name_asc, name_desc)
- `per_page` (integer, optional, min: 1, max: 100)
- `with` (array, optional, array of strings, allowed values: categories, brand, images)

**Response Data (200) - When searching (no id):**
```json
{
  "status": "success",
  "message": null,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "brand_id": 2,
        "name": "Product Name",
        "description": "Product description",
        "sku": "SKU123",
        "is_active": true,
        "created_at": "2024-01-01 12:00:00",
        "updated_at": "2024-01-01 12:00:00",
        "price": 99.99,
        "discount_type": "percentage",
        "discount_value": 10.00,
        "quantity": 50,
        "final_price": 89.99,
        "categories": [],
        "brand": {
          "id": 2,
          "name": "Brand Name",
          "slug": "brand-name",
          "logo": "https://example.com/logo.png"
        },
        "images": [
          {
            "product_id": 1,
            "url": "https://example.com/storage/images/product.jpg",
            "alt_text": "Product image",
            "is_primary": true,
            "order": 0
          }
        ],
        "taxonomies": []
      }
    ],
    "first_page_url": "https://example.com/api/v1/products?page=1",
    "from": 1,
    "last_page": 5,
    "last_page_url": "https://example.com/api/v1/products?page=5",
    "next_page_url": "https://example.com/api/v1/products?page=2",
    "path": "https://example.com/api/v1/products",
    "per_page": 15,
    "prev_page_url": null,
    "to": 15,
    "total": 75
  }
}
```

**Response Data (200) - When requesting single product (with id):**
```json
{
  "status": "success",
  "message": null,
  "data": {
    "id": 1,
    "brand_id": 2,
    "name": "Product Name",
    "description": "Product description",
    "sku": "SKU123",
    "is_active": true,
    "created_at": "2024-01-01 12:00:00",
    "updated_at": "2024-01-01 12:00:00",
    "price": 99.99,
    "discount_type": "percentage",
    "discount_value": 10.00,
    "quantity": 50,
    "final_price": 89.99,
    "categories": [],
    "brand": null,
    "images": [],
    "taxonomies": []
  }
}
```

---

### 17. POST /api/v1/products (Protected)
**Request Data:**
- `brand_id` (integer, nullable, must exist in brands table)
- `name` (string, required, max: 255 characters)
- `description` (string, nullable, max: 1024 characters)
- `sku` (string, nullable, unique in products table, max: 255 characters)
- `price` (numeric, nullable, min: 0, decimal: 2)
- `discount_type` (string, nullable, one of: percentage, fixed)
- `discount_value` (numeric, required, decimal: 2)
  - If discount_type is "percentage": min: 0, max: 100
  - If discount_type is "fixed": must be less than price
- `quantity` (integer, nullable, min: 1)
- `is_active` (boolean, default: true)
- `category_ids` (array, optional, array of integers, each must exist in categories table)
- `images` (array, optional)
  - `images.*.id` (integer, required if images provided, must exist in product_images table)

**Response Data (201):**
```json
{
  "status": "success",
  "message": null,
  "data": {
    "id": 5,
    "brand_id": 2,
    "name": "New Product",
    "description": "Product description",
    "sku": "SKU999",
    "is_active": true,
    "created_at": "2024-01-01 12:00:00",
    "updated_at": "2024-01-01 12:00:00",
    "price": 149.99,
    "discount_type": "fixed",
    "discount_value": 20.00,
    "quantity": 100,
    "final_price": 129.99,
    "categories": [],
    "brand": null,
    "images": [],
    "taxonomies": []
  }
}
```

---

### 18. GET /api/v1/products/{id} (Protected)
**Request Data:**
- None (product id in URL)

**Response Data (200):**
```json
{
  "id": 1,
  "brand_id": 2,
  "name": "Product Name",
  "description": "Product description",
  "sku": "SKU123",
  "is_active": true,
  "created_at": "2024-01-01 12:00:00",
  "updated_at": "2024-01-01 12:00:00",
  "price": 99.99,
  "discount_type": "percentage",
  "discount_value": 10.00,
  "quantity": 50,
  "final_price": 89.99,
  "categories": [],
  "brand": null,
  "images": [],
  "taxonomies": []
}
```

---

### 19. PUT/PATCH /api/v1/products/{id} (Protected)
**Request Data:**
- `brand_id` (integer, optional, nullable, must exist in brands table)
- `name` (string, optional, max: 255 characters)
- `description` (string, optional, nullable, max: 1024 characters)
- `sku` (string, optional, unique except current product, max: 255 characters)
- `price` (numeric, optional, min: 0, decimal: 2)
- `discount_type` (string, optional, nullable, one of: percentage, fixed)
- `discount_value` (numeric, optional, decimal: 2)
- `quantity` (integer, optional, min: 1)
- `is_active` (boolean, optional)
- `category_ids` (array, optional, array of integers)
- `images` (array, optional)

**Response Data (200):**
```json
{
  "id": 1,
  "brand_id": 2,
  "name": "Updated Product Name",
  "description": "Updated description",
  "sku": "SKU123",
  "is_active": true,
  "created_at": "2024-01-01 12:00:00",
  "updated_at": "2024-01-01 13:00:00",
  "price": 109.99,
  "discount_type": "percentage",
  "discount_value": 15.00,
  "quantity": 45,
  "final_price": 93.49,
  "categories": [],
  "brand": null,
  "images": [],
  "taxonomies": []
}
```

---

### 20. DELETE /api/v1/products (Protected)
**Request Data:**
- `id` (integer, required, must exist in products table and not be soft-deleted)

**Response Data (200):**
```json
{
  "status": "success",
  "message": "Product Deleted SuccessFully!",
  "data": {
    "id": 1,
    "brand_id": 2,
    "name": "Product Name",
    "deleted_at": "2024-01-01 14:00:00"
  }
}
```

---

## Product Image Endpoints

### 21. POST /api/v1/products/images (Protected)
**Request Data:**
- `image` (file, required, must be image type, allowed types: jpg, jpeg, png, gif, webp, max size: 2048 KB)

**Response Data (200):**
```json
{
  "status": "success",
  "message": "Images uploaded successfully.",
  "data": {
    "product_id": 1,
    "url": "https://example.com/storage/images/new-image.jpg",
    "alt_text": null,
    "is_primary": false,
    "order": 0
  }
}
```

---

### 22. DELETE /api/v1/products/images (Protected)
**Request Data:**
- `image_id` (integer, optional, must exist in product_images table)

**Response Data (200):**
```json
{
  "status": "success",
  "message": "Image Removed Successfully",
  "data": null
}
```

---

## Brand Endpoints

### 23. GET /api/v1/brands (Public)
**Request Data:**
- None (standard query parameters supported)

**Response Data (200):**
```json
{
  "status": "success",
  "message": null,
  "data": [
    {
      "id": 1,
      "name": "Nike",
      "slug": "nike",
      "logo": "https://example.com/logos/nike.png"
    },
    {
      "id": 2,
      "name": "Adidas",
      "slug": "adidas",
      "logo": "https://example.com/logos/adidas.png"
    }
  ]
}
```

---

### 24. POST /api/v1/brands (Protected)
**Request Data:**
- `name` (string, required, max: 255 characters)
- `slug` (string, required, unique in brands table, max: 255 characters)
- `logo` (string, nullable, must be valid URL, max: 2048 characters)

**Response Data (201):**
```json
{
  "status": "success",
  "message": "Brand created successfully.",
  "data": {
    "id": 3,
    "name": "Puma",
    "slug": "puma",
    "logo": "https://example.com/logos/puma.png"
  }
}
```

---

### 25. GET /api/v1/brands/{id} (Protected)
**Request Data:**
- None (brand id in URL)

**Response Data (200):**
```json
{
  "id": 1,
  "name": "Nike",
  "slug": "nike",
  "logo": "https://example.com/logos/nike.png"
}
```

---

### 26. PUT/PATCH /api/v1/brands/{id} (Protected)
**Request Data:**
- `name` (string, optional, max: 255 characters)
- `slug` (string, optional, unique except current brand, max: 255 characters)
- `logo` (string, optional, nullable, must be valid URL, max: 2048 characters)

**Response Data (200):**
```json
{
  "status": "success",
  "message": "Brand updated successfully.",
  "data": {
    "id": 1,
    "name": "Nike Inc.",
    "slug": "nike-inc",
    "logo": "https://example.com/logos/nike-new.png"
  }
}
```

---

### 27. DELETE /api/v1/brands/{id} (Protected)
**Request Data:**
- None (brand id in URL)

**Response Data (200):**
```json
{
  "status": "success",
  "message": "Brand deleted successfully.",
  "data": null
}
```

---

## Category Endpoints (Archived)

### 28. GET /api/v1/categories (Public)
**Request Data:**
- None

**Response Data (200):**
```json
[
  {
    "id": 1,
    "parent_id": null,
    "name": "Electronics",
    "slug": "electronics",
    "children": [
      {
        "id": 2,
        "parent_id": 1,
        "name": "Laptops",
        "slug": "laptops",
        "children": []
      }
    ]
  }
]
```

---

### 29. POST /api/v1/categories (Protected)
**Request Data:**
- `name` (string, required, max: 255 characters)
- `slug` (string, required, unique in categories table, max: 255 characters)
- `parent_id` (integer, nullable, must exist in categories table)

**Response Data (201):**
```json
{
  "id": 3,
  "parent_id": 1,
  "name": "Smartphones",
  "slug": "smartphones",
  "children": []
}
```

---

### 30. GET /api/v1/categories/{id} (Protected)
**Request Data:**
- None (category id in URL)

**Response Data (200):**
```json
{
  "id": 1,
  "parent_id": null,
  "name": "Electronics",
  "slug": "electronics",
  "children": []
}
```

---

### 31. PUT/PATCH /api/v1/categories/{id} (Protected)
**Request Data:**
- `name` (string, optional, max: 255 characters)
- `slug` (string, optional, unique except current category, max: 255 characters)
- `parent_id` (integer, optional, nullable, must exist in categories table, cannot be same as current category id)

**Response Data (200):**
```json
{
  "id": 1,
  "parent_id": null,
  "name": "Electronics & Gadgets",
  "slug": "electronics-gadgets",
  "children": []
}
```

---

### 32. DELETE /api/v1/categories/{id} (Protected)
**Request Data:**
- None (category id in URL)

**Response Data (204):**
*No content (successful deletion)*

---

## Taxonomy Type Endpoints

### 33. GET /api/v1/taxonomy-types (Public)
**Request Data (Query Parameters):**
- Standard filtering parameters supported

**Response Data (200):**
```json
{
  "status": "success",
  "message": "Taxonomy types retrieved successfully.",
  "data": [
    {
      "id": 1,
      "name": "Categories",
      "slug": "categories",
      "description": "Product categories",
      "created_at": "2024-01-01T12:00:00.000000Z",
      "updated_at": "2024-01-01T12:00:00.000000Z",
      "taxonomies": []
    },
    {
      "id": 2,
      "name": "Tags",
      "slug": "tags",
      "description": "Product tags",
      "created_at": "2024-01-01T12:00:00.000000Z",
      "updated_at": "2024-01-01T12:00:00.000000Z",
      "taxonomies": []
    }
  ]
}
```

---

### 34. POST /api/v1/taxonomy-types (Protected)
**Request Data:**
- `name` (string, required, max: 255 characters)
- `slug` (string, required, unique in taxonomy_types table, max: 255 characters)
- `description` (string, nullable, no max length)

**Response Data (200):**
```json
{
  "status": "success",
  "message": "Taxonomy type created successfully.",
  "data": {
    "id": 3,
    "name": "Collections",
    "slug": "collections",
    "description": "Product collections",
    "created_at": "2024-01-01T12:00:00.000000Z",
    "updated_at": "2024-01-01T12:00:00.000000Z",
    "taxonomies": []
  }
}
```

---

### 35. PUT/PATCH /api/v1/taxonomy-types/{id} (Protected)
**Request Data:**
- `name` (string, optional, max: 255 characters)
- `slug` (string, optional, unique in taxonomy_types table, max: 255 characters)
- `description` (string, optional, nullable, no max length)

**Response Data (200):**
```json
{
  "status": "success",
  "message": "Taxonomy type updated successfully.",
  "data": {
    "id": 1,
    "name": "Product Categories",
    "slug": "product-categories",
    "description": "All product categories",
    "created_at": "2024-01-01T12:00:00.000000Z",
    "updated_at": "2024-01-01T13:00:00.000000Z",
    "taxonomies": []
  }
}
```

---

### 36. DELETE /api/v1/taxonomy-types/{id} (Protected)
**Request Data:**
- None (taxonomy type id in URL)

**Response Data (200):**
```json
{
  "status": "success",
  "message": "Taxonomy type deleted successfully.",
  "data": null
}
```

---

## Taxonomy Endpoints

### 37. GET /api/v1/taxonomies (Public)
**Request Data (Query Parameters):**
- Standard filtering parameters supported

**Response Data (200):**
```json
{
  "data": [
    {
      "id": 1,
      "taxonomy_type_id": 1,
      "parent_id": null,
      "name": "Electronics",
      "slug": "electronics",
      "description": "Electronic products",
      "sort_order": 0,
      "meta": {"featured": true},
      "created_at": "2024-01-01T12:00:00.000000Z",
      "updated_at": "2024-01-01T12:00:00.000000Z",
      "type": {
        "id": 1,
        "name": "Categories",
        "slug": "categories",
        "description": "Product categories",
        "created_at": "2024-01-01T12:00:00.000000Z",
        "updated_at": "2024-01-01T12:00:00.000000Z"
      },
      "parent": null,
      "children": [
        {
          "id": 2,
          "taxonomy_type_id": 1,
          "parent_id": 1,
          "name": "Laptops",
          "slug": "laptops",
          "description": null,
          "sort_order": 1,
          "meta": null,
          "created_at": "2024-01-01T12:00:00.000000Z",
          "updated_at": "2024-01-01T12:00:00.000000Z"
        }
      ]
    }
  ]
}
```

---

### 38. POST /api/v1/taxonomies (Protected)
**Request Data:**
- `taxonomy_type_id` (integer, required, must exist in taxonomy_types table)
- `parent_id` (integer, nullable, must exist in taxonomies table)
- `name` (string, required, max: 255 characters)
- `slug` (string, required, unique within same taxonomy_type_id, max: 255 characters)
- `description` (string, nullable, no max length)
- `sort_order` (integer, nullable, min: 0)
- `meta` (array, nullable, JSON object)

**Response Data (201):**
```json
{
  "status": "success",
  "message": "Taxonomy created successfully.",
  "data": {
    "id": 5,
    "taxonomy_type_id": 1,
    "parent_id": 1,
    "name": "Tablets",
    "slug": "tablets",
    "description": "Tablet devices",
    "sort_order": 2,
    "meta": {"new": true},
    "created_at": "2024-01-01T12:00:00.000000Z",
    "updated_at": "2024-01-01T12:00:00.000000Z",
    "type": null,
    "parent": null,
    "children": []
  }
}
```

---

### 39. PUT/PATCH /api/v1/taxonomies/{id} (Protected)
**Request Data:**
- `parent_id` (integer, optional, nullable, must exist in taxonomies table)
- `taxonomy_type_id` (integer, optional, must exist in taxonomy_types table)
- `name` (string, optional, max: 255 characters)
- `slug` (string, optional, max: 255 characters)
- `description` (string, optional, nullable, no max length)
- `sort_order` (integer, optional, nullable, min: 0)
- `meta` (array, optional, nullable, JSON object)

**Response Data (200):**
```json
{
  "status": "success",
  "message": "Taxonomy updated successfully.",
  "data": {
    "id": 5,
    "taxonomy_type_id": 1,
    "parent_id": 1,
    "name": "Tablets & iPads",
    "slug": "tablets-ipads",
    "description": "All tablet devices",
    "sort_order": 2,
    "meta": {"featured": true},
    "created_at": "2024-01-01T12:00:00.000000Z",
    "updated_at": "2024-01-01T13:00:00.000000Z",
    "type": null,
    "parent": null,
    "children": []
  }
}
```

---

### 40. DELETE /api/v1/taxonomies/{id} (Protected)
**Request Data:**
- None (taxonomy id in URL)

**Response Data (200):**
```json
{
  "status": "success",
  "message": "Taxonomy and its children deleted successfully.",
  "data": null
}
```

---

## Product-Taxonomy Linking Endpoints

### 41. POST /api/v1/products/{product}/taxonomies/attach (Protected)
**Request Data:**
- `taxonomy_ids` (array, required, array of integers, each must exist in taxonomies table)

**Response Data (200):**
```json
{
  "status": "success",
  "message": "Taxonomies attached to product successfully.",
  "data": null
}
```

---

### 42. PUT /api/v1/products/{product}/taxonomies/sync (Protected)
**Request Data:**
- `taxonomy_ids` (array, required, array of integers, each must exist in taxonomies table)

**Response Data (200):**
```json
{
  "status": "success",
  "message": "Product taxonomies synced successfully.",
  "data": null
}
```
*Note: This replaces all existing taxonomies with the provided list*

---

### 43. DELETE /api/v1/products/{product}/taxonomies/{taxonomy} (Protected)
**Request Data:**
- None (product id and taxonomy id in URL)

**Response Data (200):**
```json
{
  "status": "success",
  "message": "Taxonomy detached from product successfully.",
  "data": null
}
```

---

## Analytics Endpoints

### 44. POST /api/v1/analytics (Track Event)
**Request Data:**
- `event_key` (string, required, max: 100 characters)
- `type` (string, required, one of: system, user)
- `payload` (array, optional, JSON object with any structure)

**Response Data (200):**
```json
{
  "status": "success",
  "message": "Event tracked.",
  "data": null
}
```

---

### 45. GET /api/v1/analytics (Query Analytics)
**Request Data (Query Parameters):**
- `queries` (array, required)
  - `queries.*.key` (string, required, analytics metric key)
  - `queries.*.type` (string, required, one of: system, user)
- `user_id` (integer, required if type is 'user', must exist in users table)

**Response Data (200):**
```json
{
  "status": "success",
  "message": "Analytics data fetched.",
  "data": {
    "page_views": {
      "count": 1523,
      "trend": "up",
      "metadata": {}
    },
    "user_signups": {
      "count": 45,
      "trend": "down",
      "metadata": {}
    }
  }
}
```

---

## Core Resources Endpoints

### 46. GET /api/v1/cores (Protected - auth:sanctum)
**Request Data:**
- None

**Response Data (200):**
*Implementation pending - returns view*

---

### 47. POST /api/v1/cores (Protected)
**Request Data:**
- Implementation pending

**Response Data (200):**
*Implementation pending*

---

### 48. GET /api/v1/cores/{id} (Protected)
**Request Data:**
- None (core id in URL)

**Response Data (200):**
*Implementation pending - returns view*

---

### 49. PUT/PATCH /api/v1/cores/{id} (Protected)
**Request Data:**
- Implementation pending

**Response Data (200):**
*Implementation pending*

---

### 50. DELETE /api/v1/cores/{id} (Protected)
**Request Data:**
- None (core id in URL)

**Response Data (200):**
*Implementation pending*

---

## Site Resources Endpoints

### 51. GET /api/v1/sites (Protected - auth:sanctum)
**Request Data:**
- None

**Response Data (200):**
*Implementation pending - returns view*

---

### 52. POST /api/v1/sites (Protected)
**Request Data:**
- Implementation pending

**Response Data (200):**
*Implementation pending*

---

### 53. GET /api/v1/sites/{id} (Protected)
**Request Data:**
- None (site id in URL)

**Response Data (200):**
*Implementation pending - returns view*

---

### 54. PUT/PATCH /api/v1/sites/{id} (Protected)
**Request Data:**
- Implementation pending

**Response Data (200):**
*Implementation pending*

---

### 55. DELETE /api/v1/sites/{id} (Protected)
**Request Data:**
- None (site id in URL)

**Response Data (200):**
*Implementation pending*

---

### 56. POST /api/v1/site/test
**Request Data:**
- Any data (logs all request data)

**Response Data (200):**
```json
{
  "status": "success",
  "message": "all works well",
  "data": null
}
```

---

## Utility & Test Endpoints

### 57. GET /api/user (Protected - auth:sanctum)
**Request Data:**
- None (requires authentication)

**Response Data (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "email_verified_at": "2024-01-01T12:00:00.000000Z",
  "created_at": "2024-01-01T12:00:00.000000Z",
  "updated_at": "2024-01-01T12:00:00.000000Z",
  "company_id": null
}
```

---

### 58. GET /sanctum/csrf-cookie
**Request Data:**
- None

**Response Data (200):**
```json
{
  "csrf_token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
}
```

---

### 59. GET /api/auth-test (Protected)
**Request Data:**
- None (requires authentication)

**Response Data (200):**
*Test response for authentication*

---

### 60. GET /api/role-test (Protected - permission:manage_standard)
**Request Data:**
- None (requires authentication and manage_standard permission)

**Response Data (200):**
*Test response for role/permission*

---

### 61. GET /api/event-test (Protected)
**Request Data:**
- None (requires authentication)

**Response Data (200):**
*Test response for events*

---

### 62. GET /api/log-test
**Request Data:**
- None

**Response Data (200):**
*Test response for logging system*

---

### 63. GET /api/test-audit-middleware
**Request Data:**
- None

**Response Data (200):**
```json
{
  "message": "Audit middleware test",
  "timestamp": "2024-01-01T12:00:00.000000Z",
  "user": "guest",
  "middleware_active": "yes"
}
```

---

### 64. GET /test-mail
**Request Data:**
- None

**Response Data (200):**
*Test response for email system*

---

### 65. GET /api/product-test
**Request Data:**
- None

**Response Data (200):**
*Test response for product functionality*

---

## Error Response Format

All endpoints return errors in the following format:

**Validation Error (422):**
```json
{
  "status": "error",
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

**Unauthorized (401):**
```json
{
  "status": "error",
  "message": "Unauthenticated.",
  "errors": null
}
```

**Forbidden (403):**
```json
{
  "status": "error",
  "message": "This action is unauthorized.",
  "errors": null
}
```

**Not Found (404):**
```json
{
  "status": "error",
  "message": "Resource not found.",
  "errors": null
}
```

**Server Error (500):**
```json
{
  "status": "error",
  "message": "Server error occurred.",
  "errors": null
}
```

---

## Notes

1. All protected endpoints require authentication via Laravel Sanctum (Bearer token in Authorization header)
2. CSRF token is required for web routes
3. All string fields are trimmed automatically
4. All numeric fields accept both integer and float values
5. Boolean fields accept: true, false, 1, 0, "1", "0", "true", "false"
6. Date/time fields are returned in ISO 8601 format
7. Soft-deleted records are excluded from queries by default
8. Pagination is available on list endpoints with default per_page of 15
9. File uploads must use multipart/form-data encoding
10. All API responses use JSON format

