# 📝 Posts API

This API manages user posts in the social media app.  
Supports **CRUD operations**: Create, Read, Update, and Delete posts.

---

## 🔐 Authentication
All routes require authentication.  
Users can only update or delete their own posts.

---

## 📌 Endpoints

---

### 1️⃣ Create Post
**POST** `/api/posts`

Create a new post.

#### Request Body
```json
{
  "content": "My first post 🚀",
  "imageUrl": "https://example.com/image.png" // optional
}
```

#### Success Response
**Status:** `201 Created`
```json
{
  "id": "post_123",
  "content": "My first post 🚀",
  "imageUrl": "https://example.com/image.png",
  "author": {
    "id": "user_456",
    "name": "John Doe",
    "username": "johndoe",
    "image": "https://example.com/avatar.png"
  },
  "_count": {
    "likes": 0,
    "comments": 0
  }
}
```

---

### 2️⃣ Get Posts
**GET** `/api/posts`

Fetch paginated posts.  
Can filter by user.

#### Query Parameters
| Name       | Type   | Default | Description                  |
|------------|--------|---------|------------------------------|
| `page`     | number | 1       | Page number                  |
| `limit`    | number | 10      | Number of posts per page     |
| `userId`   | string | null    | (Optional) Filter by user ID |

#### Example Request
```
GET /api/posts?page=2&limit=5&userId=user_456
```

#### Success Response
```json
{
  "posts": [
    {
      "id": "post_123",
      "content": "Another post here",
      "imageUrl": null,
      "author": {
        "id": "user_456",
        "name": "John Doe",
        "username": "johndoe",
        "image": "https://example.com/avatar.png"
      },
      "likes": [{ "userId": "user_789" }],
      "comments": [
        {
          "id": "comment_001",
          "content": "Nice post!",
          "author": {
            "id": "user_987",
            "name": "Jane",
            "username": "janedoe",
            "image": "https://example.com/jane.png"
          }
        }
      ],
      "_count": {
        "likes": 1,
        "comments": 1
      }
    }
  ],
  "pagination": {
    "page": 2,
    "limit": 5,
    "total": 35,
    "totalPages": 7
  }
}
```

---

### 3️⃣ Update Post
**PUT** `/api/posts`

Update an existing post (only by author).

#### Request Body
```json
{
  "postId": "post_123",
  "content": "Updated content ✨",
  "imageUrl": "https://example.com/new.png"
}
```

#### Success Response
```json
{
  "id": "post_123",
  "content": "Updated content ✨",
  "imageUrl": "https://example.com/new.png",
  "author": {
    "id": "user_456",
    "name": "John Doe",
    "username": "johndoe",
    "image": "https://example.com/avatar.png"
  },
  "_count": {
    "likes": 3,
    "comments": 5
  }
}
```

---

### 4️⃣ Delete Post
**DELETE** `/api/posts?postId=post_123`

Deletes a post (only by author).  
Likes and comments will cascade delete.

#### Success Response
```json
{
  "message": "Post deleted successfully"
}
```

---

## ❌ Error Responses

| Status | Message                          |
|--------|----------------------------------|
| 400    | Missing fields (e.g., postId)   |
| 401    | Unauthorized (no user session) |
| 403    | Not your post (for edit/delete) |
| 404    | Post not found                  |
| 500    | Internal server error           |

---

## ✅ Features
- Authenticated CRUD
- Pagination support
- Cascade delete (likes/comments)
- Auto-includes counts, author, and preview comments
- Only post owners can edit/delete

---



**Maintainer:** Muhammad Rabbi  
**Tech:** Next.js 15 (App Router), Prisma, Auth.js, TypeScript
