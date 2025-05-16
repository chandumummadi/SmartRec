# 📡 SmartRec API Reference

This document provides an overview of all REST API endpoints available in the SmartRec platform. APIs are grouped into the following categories:

* Authentication APIs
* News APIs
* Event APIs

---

## 🔐 Authentication APIs

### POST `/register/`

Registers a new user.

**Request Body**

```json
{
  "email": "testuser@example.com",
  "full_name": "Test User",
  "password": "SecurePass123"
}
```

**Success Response**

```json
{
  "message": "Registration successful"
}
```

---

### POST `/login/`

Authenticates a user and returns JWT tokens.

**Request Body**

```json
{
  "email": "testuser@example.com",
  "password": "SecurePass123"
}
```

**Success Response**

```json
{
  "refresh": "<refresh_token>",
  "access": "<access_token>",
  "user": {
    "email": "testuser@example.com",
    "full_name": "Test User",
    "user_id": 1
  }
}
```

---

### GET `/profile/`

Returns user profile information.

**Headers**

```
Authorization: Bearer <access_token>
```

**Response**

```json
{
  "email": "testuser@example.com",
  "full_name": "Test User",
  "user_id": 1
}
```

---

### POST `/logout/`

Logs out the user by blacklisting the refresh token.

**Headers**

```
Authorization: Bearer <access_token>
```

**Request Body**

```json
{
  "refresh": "<refresh_token>"
}
```

**Response**

```json
{
  "message": "Logout successful"
}
```

---

## 📰 News APIs

### GET `/api/news/populate/`

Fetches and stores the latest news articles from NewsAPI.

**Response**

```json
{
  "message": "News data populated successfully"
}
```

---

### GET `/api/news/trending/`

Returns a list of trending news articles.

**Response**

```json
{
  "trending_news": [
    {
      "title": "AI Breakthrough in Cancer Detection",
      "category": "science",
      "genuineness_score": 87.5,
      "published_at": "2025-05-08T00:34:00Z"
    }
  ]
}
```

---

### GET `/api/news/recommend_news/?user_id=<id>`

Returns personalized news for a specific user.

**Response**

```json
{
  "recommended_articles": [
    {
      "title": "SpaceX launches Starlink V3...",
      "category": "technology",
      "genuineness_score": 91.3
    }
  ]
}
```

---

### GET `/api/news/user_preferences/?user_id=<id>`

Returns the user's news category preference weights.

**Response**

```json
{
  "preferences": [
    { "category": "technology", "weight": 0.6 },
    { "category": "science", "weight": 0.4 }
  ]
}
```

---

### GET `/api/news/categories/?categories=...`

Returns news articles filtered by categories.

**Query Parameters**

* `categories` (repeatable): e.g., `?categories=technology&categories=science`

**Response**

```json
{
  "filtered_articles": [
    {
      "title": "NASA confirms black hole activity...",
      "category": "science"
    }
  ]
}
```

---

## 🎟 Event APIs

### GET `/api/events/populate/`

Fetches and stores events from the Ticketmaster API.

**Response**

```json
{
  "message": "Event data populated successfully"
}
```

---

### POST `/api/events/update_user_preferences/?user_id=<id>`

Updates user's preferred event categories.

**Request Body**

```json
{
  "categories": ["rock", "baseball"]
}
```

**Response**

```json
{
  "message": "Preferences updated"
}
```

---

### GET `/api/events/user_preferences/?user_id=<id>`

Returns user's event category preferences.

**Response**

```json
{
  "preferences": [
    { "category": "rock", "weight": 0.8 },
    { "category": "baseball", "weight": 0.2 }
  ]
}
```

---

### GET `/api/events/trending/?top_n=<number>`

Returns top N trending events.

**Response**

```json
{
  "trending_events": [
    { "title": "Rock Fest 2025", "location": "San Jose", "genre": "rock" }
  ]
}
```

---

### GET `/api/events/categories/?categories=...`

Returns events filtered by one or more categories.

**Query Parameters**

* `categories` (repeatable): e.g., `?categories=rock&categories=baseball`

**Response**

```json
{
  "filtered_events": [
    { "title": "Baseball Finals", "genre": "baseball", "location": "SF" }
  ]
}
```

---

### GET `/api/events/recommend_events/?user_id=<id>`

Returns personalized event recommendations.

**Response**

```json
{
  "recommended_events": [
    { "title": "Live Rock Concert", "genre": "rock" }
  ]
}
```

---

### POST `/api/events/handle_click/?user_id=<id>&event_id=<id>`

Logs user interaction with an event.

**Response**

```json
{
  "message": "Interaction logged"
}
```
