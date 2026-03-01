# 🎟 Lottery Man API

A modern NestJS-based backend API designed to replace a legacy PHP
lottery results service.

This service provides a legacy-compatible endpoint while preparing the
foundation for a future structured and optimized API architecture.

------------------------------------------------------------------------

## 🚀 Project Status

-   ✅ Legacy-compatible endpoint implemented
-   ✅ Date-range based query (no pagination)
-   ✅ MySQL indexed query optimization
-   ✅ Swagger documentation enabled
-   ✅ Environment variable configuration
-   🚧 Parallel deployment (PHP remains live)
-   🔜 Future structured API redesign

------------------------------------------------------------------------

## 📦 Tech Stack

-   **NestJS 11**
-   **MySQL (mysql2 driver)**
-   **Swagger (OpenAPI)**
-   **TypeScript**
-   **Render (Deployment Target)**

------------------------------------------------------------------------

## 📌 Available Endpoint

### GET `/lottery-results-legacy`

Returns lottery results between two dates.

#### Query Parameters

  Parameter   Type     Format       Required
  ----------- -------- ------------ ----------
  from        string   YYYY-MM-DD   Yes
  to          string   YYYY-MM-DD   Yes

#### Example

    GET /lottery-results-legacy?from=2024-01-01&to=2024-01-31

------------------------------------------------------------------------

## 📄 Response Structure

``` json
[
  {
    "id": "3490",
    "title": "FF-82",
    "result_prety": "[...]",
    "draw_number": "82",
    "grp": "FF",
    "result_date": "Wed 31-Jan-24",
    "short_date": "Wed 31 Jan",
    "created_at": "2024-03-17 16:35:43"
  }
]
```

⚠ Note: `result_prety` remains stringified for legacy compatibility.

------------------------------------------------------------------------

## 🔐 Environment Variables

Create a `.env` file for local development:

    DB_HOST=your_database_host
    DB_USER=your_database_user
    DB_PASS=your_database_password
    DB_NAME=balasonl_lottery
    DB_PORT=3306

⚠ Never commit `.env` to version control.

------------------------------------------------------------------------

## 🛠 Local Development

Install dependencies:

    npm install

Run in development mode:

    npm run start:dev

Build project:

    npm run build

Run production build:

    npm start

------------------------------------------------------------------------

## 📚 Swagger Documentation

Available at:

    /api

Example:

    http://localhost:3000/api

------------------------------------------------------------------------

## 🧠 Architecture Roadmap

1.  Deploy legacy-compatible endpoint
2.  Validate production stability
3.  Remove stringified result formatting
4.  Introduce structured JSON response
5.  Add DTO validation & typing
6.  Expand response model
7.  Migrate Flutter app to new API
8.  Retire legacy route (PHP remains untouched)

------------------------------------------------------------------------

## 📈 Performance Considerations

-   `result_date` column is indexed
-   Range queries use index scan
-   Current bottleneck: regex parsing logic
-   Future optimization: precomputed structured results

------------------------------------------------------------------------

## ⚖ Deployment Strategy

Recommended Render configuration:

Build Command:

    npm install && npm run build

Start Command:

    npm start

Add required environment variables via Render dashboard.

------------------------------------------------------------------------

## 🧾 License

UNLICENSED -- Internal Project

------------------------------------------------------------------------

## 👨‍💻 Author

Lottery Man Backend -- Phase 1 (Legacy Compatibility Mode)
