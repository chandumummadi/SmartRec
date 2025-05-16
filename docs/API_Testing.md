# 🧪 API Testing Guide – SmartRec

This guide provides sample test cases and `curl` commands to validate the functionality of SmartRec's API endpoints. Use this for manual testing via terminal, Postman, or integration scripts.

---

## 🔐 Authentication APIs

### ✅ Register User

```bash
curl --location 'http://localhost:8000/register/' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "testuser@example.com",
  "full_name": "Test User",
  "password": "SecurePass123"
}'
```

**Expected:**

* ✅ 201 Created (new user)
* ❌ 400 Bad Request (duplicate email)

---

### ✅ Login User

```bash
curl --location 'http://localhost:8000/login/' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "testuser@example.com",
  "password": "SecurePass123"
}'
```

**Expected:**

* Returns access and refresh tokens
* Use `access` token for authenticated requests

---

### ✅ Get Profile (Authenticated)

```bash
curl --location 'http://localhost:8000/profile/' \
--header 'Authorization: Bearer <access_token>' \
--header 'Content-Type: application/json'
```

**Expected:**

* Returns user's email, name, ID

---

### ✅ Logout User

```bash
curl --location 'http://localhost:8000/logout/' \
--header 'Authorization: Bearer <access_token>' \
--header 'Content-Type: application/json' \
--data '{"refresh": "<refresh_token>"}'
```

**Expected:**

* Logout success message
* Refresh token becomes invalid

---

## 📰 News APIs

### ✅ Populate News

```bash
curl --location 'http://localhost:8000/api/news/populate/'
```

---

### ✅ Get Trending News

```bash
curl --location 'http://localhost:8000/api/news/trending/'
```

---

### ✅ Recommend News

```bash
curl --location 'http://localhost:8000/api/news/recommend_news/?user_id=1'
```

**Expected:**

* List of personalized news
* Should reflect preference weights

---

### ✅ Get User News Preferences

```bash
curl --location 'http://localhost:8000/api/news/user_preferences/?user_id=1'
```

---

### ✅ Filter News by Categories

```bash
curl --location 'http://localhost:8000/api/news/categories/?categories=technology&categories=science'
```

---

## 🎟 Event APIs

### ✅ Populate Events

```bash
curl --location 'http://localhost:8000/api/events/populate/'
```

---

### ✅ Update Event Preferences

```bash
curl --location 'http://localhost:8000/api/events/update_user_preferences/?user_id=1' \
--header 'Content-Type: application/json' \
--data '{"categories": ["rock", "baseball"]}'
```

---

### ✅ Get Event Preferences

```bash
curl --location 'http://localhost:8000/api/events/user_preferences/?user_id=1'
```

---

### ✅ Get Trending Events

```bash
curl --location 'http://localhost:8000/api/events/trending/?top_n=5'
```

---

### ✅ Filter Events by Category

```bash
curl --location 'http://localhost:8000/api/events/categories/?categories=rock&categories=baseball'
```

---

### ✅ Recommend Events for User

```bash
curl --location 'http://localhost:8000/api/events/recommend_events/?user_id=1'
```

---

### ✅ Log Event Click

```bash
curl --location --request POST 'http://localhost:8000/api/events/handle_click/?user_id=test_user&event_id=REAL_EVENT_ID'
```
