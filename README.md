# Wanderlust

A MERN travel listing app for browsing stays, creating listings, uploading images, writing reviews, and viewing listing locations on a map.

## Features

- React + Vite frontend with Material UI
- Express API backend with Passport session authentication
- MongoDB Atlas with Mongoose models
- Cloudinary image uploads
- Joi validation for listings and reviews
- Mapbox geocoding and listing maps
- Owner-only listing edit/delete
- Review author-only review delete
- Search, category filters, guest filtering, taxes toggle, and pagination

## Tech Stack

- **Frontend:** React, React Router, Material UI, Vite
- **Backend:** Node.js, Express, Passport, Joi
- **Database:** MongoDB Atlas, Mongoose
- **Uploads:** Cloudinary, Multer
- **Maps:** Mapbox

## Project Structure

```text
backend/
  app.js
  cloudConfig.js
  schema.js
  controllers/api/
  models/
  routes/api/
  utils/

client/
  vite.config.js
  src/
    components/
    context/
    pages/
    services/
```

## Getting Started

Install root, backend, and client dependencies:

```bash
npm install
npm install --prefix backend
npm install --prefix client
```

Create `backend/.env`:

```text
ATLASDB_URL=your_mongodb_atlas_url
SECRET=your_session_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
MAP_TOKEN=your_mapbox_token
```

Run the app in development:

```bash
npm run dev
```

- Backend: `http://localhost:8080`
- Frontend: `http://localhost:5174`

## Scripts

```bash
npm start              # start Express backend
npm run dev            # run backend and Vite frontend together
npm run client:dev     # run only Vite frontend
npm run client:build   # build React frontend
npm run build          # install/build frontend for production
```

## API Routes

```text
GET    /api/me
POST   /api/signup
POST   /api/login
POST   /api/logout

GET    /api/listings
POST   /api/listings
GET    /api/listings/:id
PUT    /api/listings/:id
DELETE /api/listings/:id

POST   /api/listings/:id/reviews
DELETE /api/listings/:id/reviews/:reviewId
```

## Render Deployment

Use these Render settings:

```text
Build Command: npm run build
Start Command: npm start
```

Add the same environment variables from `backend/.env` to Render.

In production, Express serves the built React app from `client/dist`, and all API routes stay under `/api`.
