# API Contract

## Global Error Contract
All API errors follow this unified format:
```json
{
  "error": {
    "code": "STRING_CODE",
    "message": "Human readable message",
    "details": {} 
  }
}
```

## 1. Categories Resource

### `GET /api/categories`
- **Query Params:**
  - `page` (number, default: 1)
  - `pageSize` (number, default: 10)
- **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "name": "Work",
        "color": "#ff0000"
      }
    ],
    "meta": {
      "total": 1,
      "page": 1,
      "pageSize": 10,
      "totalPages": 1
    }
  }
  ```

### `POST /api/categories`
- **Body:**
  - `name` (string, required)
  - `color` (string, required)
- **Response (201 Created):** Category object

### `DELETE /api/categories/:id`
- **Response (204 No Content)**

## 2. Todos Resource

### `GET /api/todos`
- **Query Params:**
  - `search` (string, optional) - case-insensitive search on title
  - `categoryId` (string, optional) - filter by category
  - `page` (number, default: 1)
  - `pageSize` (number, default: 10)
- **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "title": "Buy milk",
        "completed": false,
        "categoryId": "uuid_or_null",
        "createdAt": "iso_date",
        "updatedAt": "iso_date"
      }
    ],
    "meta": {
      "total": 1,
      "page": 1,
      "pageSize": 10,
      "totalPages": 1
    }
  }
  ```

### `POST /api/todos`
- **Body:**
  - `title` (string, required)
  - `categoryId` (string, optional)
- **Response (201 Created):** Todo object

### `PATCH /api/todos/:id`
- **Body:**
  - `title` (string, optional)
  - `completed` (boolean, optional)
  - `categoryId` (string, optional)
- **Response (200 OK):** Updated Todo object

### `DELETE /api/todos/:id`
- **Response (204 No Content)**

## 3. Statistics Resource

### `GET /api/statistics`
- **Response (200 OK):**
  ```json
  {
    "total": 10,
    "completed": 4,
    "pending": 6,
    "byCategory": [
      {
        "categoryId": "uuid",
        "name": "Work",
        "count": 5
      },
      {
        "categoryId": null,
        "name": "Uncategorized",
        "count": 5
      }
    ]
  }
  ```

