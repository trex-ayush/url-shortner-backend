# URL API Endpoints Overview

| **Method** | **Endpoint**                          | **Description**                                                       |
|------------|---------------------------------------|-----------------------------------------------------------------------|
| **POST**   | `/api/url/create`                     | Create a new short URL.                                               |
| **GET**    | `/:shortId`                           | Redirect to the original URL using a short URL.                       |
| **DELETE** | `/api/url/delete/:shortId`            | Delete a short URL by its `shortId`.                                  |
| **PATCH**  | `/api/url/update/:shortId`            | Update the original URL or custom short URL.                          |

## TODO

| **Method** | **Endpoint**                          | **Description**                                                       |
|------------|---------------------------------------|-----------------------------------------------------------------------|
| **GET**    | `/api/url/stats/:shortId`             | Retrieve analytics (clicks, referrers) for a short URL.               |
| **POST**   | `/api/url/bulk-create`                | Bulk create short URLs from a list.                                   |
| **GET**    | `/api/url/expired`                    | List of all expired short URLs.                                       |
| **GET**    | `/api/url/preview/:shortId`           | Preview the destination of a short URL.                               |
| **GET**    | `/api/url/qr/:shortId`                | Generate a QR code for a short URL.                                   |
| **POST**   | `/api/url/alias`                      | Create a custom short URL with a specific alias.                      |
| **POST**   | `/api/url/blacklist`                  | Add a URL to the blacklist.                                           |
| **GET**    | `/api/url/check/:shortId`             | Check if the original URL for the short link is working.              |
| **GET**    | `/api/user/dashboard`                 | User dashboard showing created URLs and analytics.                    |
