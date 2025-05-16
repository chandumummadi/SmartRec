# ⚛️ SmartRec Frontend Documentation

This document outlines the structure and logic of the SmartRec frontend built with React and Material-UI, including routing, components, context, authentication, and responsiveness.

---

## 📁 Folder Structure

```
smartrec-frontend/
├── public/
├── src/
│   ├── App.js                # Route config and app layout
│   ├── components/           # Reusable UI elements
│   ├── contexts/             # Global auth and toast state
│   ├── pages/                # Top-level views/screens
│   ├── index.js              # App bootstrap
│   └── index.css, App.css    # Global styling
```

---

## 🛣 `App.js` – Routing Overview

```jsx
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="news" element={<NewsPage />} />
    <Route path="newsfeed" element={<NewsFeed />} />
    <Route path="trendingnewspage" element={<TrendingNewsPage />} />
    <Route path="events" element={<EventPage />} />
    <Route path="eventfeed" element={<EventFeed />} />
    <Route path="trendingevents" element={<TrendingEvents />} />
    <Route path="profile" element={<Profile />} />
    <Route path="preferences" element={<Preferences />} />
  </Route>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
</Routes>
```

---

## 📄 Pages (`/pages/`)

| File                    | Description                                                       |
| ----------------------- | ----------------------------------------------------------------- |
| `Home.js`               | Landing page with trending news/events carousels                  |
| `Login.js`              | Login form and token handling                                     |
| `Register.js`           | New user sign-up screen                                           |
| `Profile.js`            | Displays user profile info from token/session                     |
| `Preferences.js`        | Lets user set/update news/event category weights                  |
| `NewsFeed.js`           | Personalized news list (requires login)                           |
| `NewsPage.js`           | Smart redirect: if user → `/newsfeed`, else → `/trendingnewspage` |
| `TrendingNewsPage.js`   | Public view of trending news (guest access)                       |
| `EventFeed.js`          | Personalized events list (requires login)                         |
| `EventPage.js`          | Smart redirect: if user → `/eventfeed`, else → `/trendingevents`  |
| `TrendingEventsPage.js` | Public view of trending events                                    |

---

## 🧩 Components

| Component                | Description                                |
| ------------------------ | ------------------------------------------ |
| `Layout.js`              | Wraps all main routes with Navbar + Footer |
| `Navbar.js`              | Site-wide navigation                       |
| `Footer.js`              | Persistent footer                          |
| `TrendingNewsBlock.js`   | Carousel of trending news articles         |
| `TrendingEventsBlock.js` | Carousel of trending events                |

---

## 🔐 API Authentication

* Auth flow handled in `AuthContext.js`
* JWT tokens stored in `localStorage`
* All secure API calls use:

```js
headers: {
  Authorization: `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
}
```

---

## 🔁 Redirect Logic

**Smart Redirector Pages:**

* `NewsPage.js`:
  If logged in → `/newsfeed`
  Else → `/trendingnewspage`

* `EventPage.js`:
  If logged in → `/eventfeed`
  Else → `/trendingevents`

Used to centralize access and fallback logic for protected feeds.

---

## 🧠 Contexts Summary

### `AuthContext.js`

* Handles login/logout
* Stores user and tokens
* Refresh token handling

### `ToastContext.jsx`

* Provides global MUI snackbar notifications
* Usage: `showToast("Login failed", "error")`

---

## 📱 Responsive Design

* MUI Grid and Flexbox layouts
* Mobile-first design strategy
* Adaptive typography and spacing
* Fully keyboard accessible with ARIA attributes

---

# 🧭 SmartRec – User Flow

1. **🔓 User lands on `/login` or `/register`**

   * Registers or logs in with email/password
   * On success: receives JWT `access` and `refresh` tokens

2. **🔐 Authenticated session begins**

   * Tokens are stored in `localStorage`
   * User is redirected to `/newsfeed` (personalized view)

3. **📥 User sets preferences**

   * Navigates to `/preferences`
   * Selects preferred categories for news and events
   * Preferences are sent to backend and saved

4. **📰 User browses personalized content**

   * News: `/newsfeed`
   * Events: `/eventfeed`
   * Can interact: click, save, or open full views (`/news`, `/events`)
   * Clicks are logged to refine recommendations

5. **🌍 Guest users (unauthenticated)**

   * Visiting `/news` or `/events` redirects to:

     * `/trendingnewspage` or `/trendingevents`
   * These are public views of trending content

6. **👤 User explores profile**

   * Visits `/profile`
   * Views account info and session metadata

7. **🚪 User logs out**

   * Tokens are cleared from localStorage
   * Redirected to `/login`

---

## 🛠 Developer Notes

* ✅ **Run project**

  ```bash
  npm install
  npm start
  ```

* ⚙️ **Environment setup**

  ```
  REACT_APP_API_BASE=http://localhost:8000
  ```

* 🧪 **Tests**

  * Basic test scaffold in `App.test.js`
  * Jest + React Testing Library ready

* 🎯 **Linting**
  `.eslintrc.js` and Prettier included

---

