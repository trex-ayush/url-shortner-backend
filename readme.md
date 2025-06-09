# 🔗 URL Shortener API

A feature-rich URL shortening service built with Node.js, Express, and MongoDB. Supports user authentication, short link analytics, expiration dates, QR code generation, and more.

---

## 📌 Base URL
http://localhost:3000


---

## 📂 Authentication Endpoints

| **Method** | **Endpoint**         | **Description**                      | **Auth**        |
|------------|----------------------|--------------------------------------|-----------------|
| `POST`     | `/api/user/register` | Register a new user                  | ❌ Public        |
| `POST`     | `/api/user/login`    | Login and receive a cookie token     | ❌ Public        |
| `GET`      | `/api/user/profile`  | Get the logged-in user’s profile     | ✅ Required      |
| `POST`     | `/api/user/logout`   | Logout the current session           | ✅ Required      |

---

## 🔗 URL Shortener Endpoints

| **Method** | **Endpoint**                          | **Description**                                                       | **Auth**         |
|------------|---------------------------------------|-----------------------------------------------------------------------|------------------|
| `POST`     | `/api/url/create`                     | Create a new short URL                                                | 🔑 Optional       |
| `DELETE`   | `/api/url/delete/:id`                 | Delete a short URL (owned by user)                                    | ✅ Required       |
| `PATCH`    | `/api/url/update/:id`                 | Update a short URL (original/custom/expiration)                       | ✅ Required       |
| `GET`      | `/api/url/stats/:id`                  | Get analytics for a specific short URL                                | ✅ Required       |
| `PATCH`    | `/api/url/deactivate-url/:id`         | Deactivate a short URL (without deleting)                             | ✅ Required       |
| `GET`      | `/api/url/user`                       | Get all short URLs created by the logged-in user                      | ✅ Required       |

---

## 🧪 Redirection Endpoint

| **Method** | **Endpoint**      | **Description**                        | **Auth**    |
|------------|-------------------|----------------------------------------|-------------|
| `GET`      | `/:shortId`       | Redirect to the original destination   | ❌ Public    |

---

## 🛠️ Planned / TODO Endpoints

| **Method** | **Endpoint**                  | **Description**                                       |
|------------|-------------------------------|-------------------------------------------------------|
| `POST`     | `/api/url/bulk-create`        | Bulk create short URLs from a list                    |
| `GET`      | `/api/url/expired`            | List all expired short URLs                          |
| `GET`      | `/api/url/preview/:shortId`   | Preview destination URL before redirecting           |
| `GET`      | `/api/url/qr/:shortId`        | Generate a QR code for the short URL                 |
| `POST`     | `/api/url/alias`              | Create a short URL with a custom alias               |
| `POST`     | `/api/url/blacklist`          | Add a malicious URL to the blacklist                 |
| `GET`      | `/api/url/check/:shortId`     | Check if the original URL is still working           |
| `GET`      | `/api/user/dashboard`         | User dashboard with created links and analytics      |

---

## 🔐 Middleware Overview

| Middleware              | Description                                            |
|------------------------|--------------------------------------------------------|
| `authenticate`          | Requires valid login (checks for cookie/session token)|
| `optionalAuthenticate`  | Tries to authenticate, but allows anonymous users     |

---

## 🚫 Guest Limitations

- **Unauthenticated (guest) users** can create up to **50 short URLs** per IP address.

---

## 🚀 Technologies Used

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication (stored in HTTP-only cookies)
- bcrypt for password hashing

---

## 🧾 License

MIT License
