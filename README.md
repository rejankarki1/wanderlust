# Wanderlust

Wanderlust is a full-stack MERN travel listing app for discovering stays, publishing listings, reserving trips, uploading listing images, writing reviews, and viewing listing locations on a map.

The project uses a React + Vite frontend, an Express API backend, MongoDB Atlas for persistence, Cloudinary for image storage, Passport for session authentication, and Mapbox for listing locations.

## Live Demo

Visit the deployed app: [https://wanderlust-bydc.onrender.com](https://wanderlust-bydc.onrender.com)

## Features

- Browse travel listings with search, category filters, guest filtering, tax toggle, and pagination
- View listing details with images, location data, owner information, and reviews
- Create, edit, and delete listings with owner-only permissions
- Reserve available listings, view guest trips, view host bookings, and cancel reservations
- Upload listing images to Cloudinary
- Add and delete reviews with author-only permissions
- Sign up with password strength validation, log in, log out, and persist sessions with MongoDB-backed sessions
- Geocode listing locations with Mapbox
- Serve the production React build from the Express app on Render

## Tech Stack

| Area | Tools |
| --- | --- |
| Frontend | React, Vite, React Router, Material UI |
| Backend | Node.js, Express, Passport, Joi |
| Database | MongoDB Atlas, Mongoose |
| Uploads | Cloudinary, Multer |
| Maps | Mapbox |
| Deployment | Render |

## Project Structure

```text
.
├── backend/
│   ├── app.js
│   ├── cloudConfig.js
│   ├── config/
│   ├── controllers/api/
│   ├── server.js
│   ├── tests/
│   ├── models/
│   ├── routes/api/
│   ├── schema.js
│   └── utils/
├── client/
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
├── package.json
└── README.md
```

## Getting Started

### 1. Install dependencies

Install the root dependencies, then install backend and frontend dependencies:

```bash
npm install
npm install --prefix backend
npm install --prefix client
```

### 2. Configure environment variables

Create a `backend/.env` file:

```text
ATLASDB_URL=your_mongodb_atlas_connection_string
SECRET=your_session_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
MAP_TOKEN=your_mapbox_token
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8080/api/auth/google/callback
```

### 3. Run the development app

```bash
npm run dev
```

Development URLs:

```text
Backend API: http://localhost:8080
Frontend:    http://localhost:5174
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the Express backend |
| `npm run dev` | Run the backend and Vite frontend together |
| `npm run backend:dev` | Run only the backend with Nodemon |
| `npm run backend:test` | Run backend API tests |
| `npm run client:dev` | Run only the Vite frontend |
| `npm run client:build` | Build the React frontend |
| `npm run build` | Install backend/client dependencies and build the frontend for production |

## API Testing

Run all backend API tests from the project root:

```bash
npm run backend:test
```

The tests use Jest, Supertest, and `mongodb-memory-server`, so they do not require `npm start`, localhost, Render, or the real Atlas database.

## API Routes

### Auth

```text
GET    /api/me
POST   /api/signup
POST   /api/login
POST   /api/logout
```

### Listings

```text
GET    /api/listings
POST   /api/listings
GET    /api/listings/:id
PUT    /api/listings/:id
DELETE /api/listings/:id
```

### Bookings

```text
GET    /api/bookings/me
GET    /api/bookings/host
POST   /api/listings/:id/bookings
PATCH  /api/bookings/:bookingId/cancel
```

### Reviews

```text
POST   /api/listings/:id/reviews
DELETE /api/listings/:id/reviews/:reviewId
```

## Production Build

Build the React app from the root of the project:

```bash
npm run build
```

The build output is created in `client/dist`. In production, the Express server serves that folder and keeps all API routes under `/api`.

## Render Deployment

Use these settings for a Render Web Service connected to this GitHub repository:

```text
Build Command: npm run build
Start Command: npm start
```

Add the same environment variables from `backend/.env` to the Render service environment.

For Google login in production, set `GOOGLE_CALLBACK_URL` to:

```text
https://wanderlust-bydc.onrender.com/api/auth/google/callback
```

Add the same URL as an authorized redirect URI in your Google Cloud OAuth client.

If Auto Deploy is turned off, deploy manually from Render:

1. Open the Render service.
2. Click `Manual Deploy`.
3. Choose `Deploy latest commit`.
4. Use `Clear build cache & deploy` only when a normal deploy fails or Render appears to reuse stale dependencies.

## Notes

- The root `npm start` command starts the backend with `npm start --prefix backend`.
- The backend listens on port `8080`.
- The app expects MongoDB Atlas, Cloudinary, and Mapbox credentials before listing creation and image upload can work.
- Session data is stored in MongoDB through `connect-mongo`.
