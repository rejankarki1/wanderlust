# WanderLust

WanderLust is a full-stack vacation rental listing application inspired by
Airbnb. Users can browse property listings, view listing details, create and
manage their own listings, write reviews, and use account features such as
signup, login, and logout.

This project was built while following the Apna College Delta/Wanderlust
curriculum. It focuses on RESTful routing, MongoDB relationships, validation,
authentication, authorization, reusable EJS layouts, and centralized error
handling.

---

## Features

- Create, read, update, and delete vacation rental listings
- Add and display reviews for individual listings
- Delete reviews and remove their references from listings
- User signup, login, and logout
- Password hashing and salting with Passport Local Mongoose
- Session-based authentication with `express-session`
- Success and error feedback with `connect-flash`
- Login protection for listing and review creation
- Owner-only listing edit and delete actions
- Author-only review deletion
- Server-side request validation with Joi
- Client-side form validation with Bootstrap
- Reusable EJS layouts and partials
- Referenced MongoDB relationships with nested Mongoose population
- Centralized asynchronous and application error handling
- Responsive Bootstrap-based interface

---

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js
- Passport Local Mongoose
- Express Session
- Connect Flash
- Joi
- Method Override

### Frontend

- EJS
- ejs-mate
- Bootstrap 5
- CSS
- JavaScript

### Development Tools

- Git and GitHub
- Local MongoDB database

---

## Project Structure

```txt
MAJORPROJECT/
|
|-- init/
|   |-- data.js
|   `-- index.js
|
|-- models/
|   |-- listing.js
|   |-- review.js
|   `-- user.js
|
|-- routes/
|   |-- listing.js
|   |-- review.js
|   `-- user.js
|
|-- views/
|   |-- includes/
|   |   |-- flash.ejs
|   |   |-- footer.ejs
|   |   `-- navbar.ejs
|   |
|   |-- layouts/
|   |   `-- boilerplate.ejs
|   |
|   |-- listings/
|   |   |-- edit.ejs
|   |   |-- index.ejs
|   |   |-- new.ejs
|   |   `-- show.ejs
|   |
|   |-- users/
|   |   |-- login.ejs
|   |   `-- signUp.ejs
|   |
|   `-- error.ejs
|
|-- public/
|   |-- css/
|   |   `-- style.css
|   `-- js/
|       `-- script.js
|
|-- utils/
|   |-- ExpressError.js
|   `-- wrapAsync.js
|
|-- app.js
|-- middleware.js
|-- schema.js
|-- package.json
|-- package-lock.json
`-- README.md
```

The repository also contains a separate `classroom/` practice directory. It is
not part of the main WanderLust application.

---

## What Each Folder and File Does

### `app.js`

The application entry point. It connects to MongoDB, configures Express, EJS,
static files, sessions, flash messages, Passport authentication, routers, and
global error handling. The server listens on port `8080`.

### `init/data.js`

Contains sample vacation rental listings used to seed the local database.

### `init/index.js`

Connects to MongoDB, removes existing listings, assigns the configured owner ID
to each sample listing, and inserts the seed data.

### `models/listing.js`

Defines the Mongoose listing schema. Each listing stores its property details,
image metadata, owner reference, and an array of review references.

### `models/review.js`

Defines the review schema, including its comment, rating, creation date, and
author reference.

### `models/user.js`

Defines the user schema and applies Passport Local Mongoose, which supplies the
username, password hash, salt, and authentication helpers.

### `routes/listing.js`

Contains the listing routes for:

- Showing all listings
- Showing the new listing form
- Creating a listing
- Showing one listing with its owner and reviews
- Showing the edit form
- Updating an owned listing
- Deleting an owned listing

### `routes/review.js`

Contains routes for creating and deleting reviews. New reviews are associated
with the logged-in user. Review deletion is restricted to the review author.

### `routes/user.js`

Contains the signup, login, and logout routes. Successful signup automatically
logs in the new user, and login redirects users back to their originally
requested page when available.

### `views/layouts/boilerplate.ejs`

The reusable HTML layout shared by the EJS pages. It includes Bootstrap,
application CSS and JavaScript, the navbar, flash messages, footer, and page
body placeholder.

### `views/includes/`

Stores shared EJS partials:

- `navbar.ejs`: navigation and authentication links
- `footer.ejs`: shared page footer
- `flash.ejs`: success and error alerts

### `views/listings/`

Stores the listing pages:

- `index.ejs`: displays all listings
- `show.ejs`: displays one listing and its reviews
- `new.ejs`: creates a listing
- `edit.ejs`: edits an existing listing

### `views/users/`

Stores the signup and login forms.

### `views/error.ejs`

Displays errors handled by the global Express error middleware.

### `public/css/style.css`

Contains the application's custom styles.

### `public/js/script.js`

Applies Bootstrap client-side validation behavior to forms marked with
`needs-validation`.

### `utils/wrapAsync.js`

Wraps asynchronous route handlers and forwards rejected promises to Express
error middleware.

### `utils/ExpressError.js`

Defines a custom error class with an HTTP status code and message.

### `schema.js`

Contains the Joi schemas used to validate listing and review request bodies.

### `middleware.js`

Contains reusable middleware for login checks, redirect handling, Joi
validation, listing-owner authorization, and review-author authorization.

---

## RESTful Listing Routes

| Action | Method | Route |
| :-- | :-- | :-- |
| Show all listings | GET | `/listings` |
| Show new listing form | GET | `/listings/new` |
| Create listing | POST | `/listings` |
| Show one listing | GET | `/listings/:id` |
| Show edit form | GET | `/listings/:id/edit` |
| Update listing | PUT | `/listings/:id` |
| Delete listing | DELETE | `/listings/:id` |

Review routes are nested under a listing:

| Action | Method | Route |
| :-- | :-- | :-- |
| Create review | POST | `/listings/:id/reviews` |
| Delete review | DELETE | `/listings/:id/reviews/:reviewId` |

Authentication routes:

| Action | Method | Route |
| :-- | :-- | :-- |
| Show signup form | GET | `/signup` |
| Create account | POST | `/signup` |
| Show login form | GET | `/login` |
| Log in | POST | `/login` |
| Log out | GET | `/logout` |

---

## Mongoose `populate()`

Referenced MongoDB documents store ObjectIds instead of duplicating complete
documents. Mongoose `populate()` replaces those IDs with the referenced
documents when the application reads the data.

For example, the listing show route loads both reviews and each review's
author:

```js
const listing = await Listing.findById(id)
  .populate({
    path: "reviews",
    populate: {
      path: "author",
    },
  })
  .populate("owner", "username email");
```

This nested population allows `show.ejs` to access values such as
`review.author.username` and `listing.owner.username`.

---

## MongoDB Relationship Design

This application uses references for relationships:

- A listing stores the ObjectId of its owner.
- A listing stores an array of review ObjectIds.
- A review stores the ObjectId of its author.

Referencing is useful here because users and reviews have their own documents
and can be queried or updated independently. The review deletion route removes
the review ID from its listing before deleting the review document.

---

## Validation and Error Handling

### Client-Side Validation

Required form fields and Bootstrap validation classes provide immediate browser
feedback before a form is submitted.

### Server-Side Validation

The listing and review Joi schemas validate request bodies on the server. This
protects the application when browser validation is bypassed.

### Async Error Handling

`wrapAsync.js` catches rejected promises from asynchronous route handlers and
passes them to Express error middleware.

### Global Error Handling

Unknown routes create a `404` error. The final error middleware renders
`views/error.ejs` with the appropriate status code and message.

---

## Authentication and Authorization

Authentication determines who a user is. Passport Local Mongoose manages
password hashing, salting, registration, and credential verification. Passport
sessions keep users logged in between requests.

Authorization determines what an authenticated user can do:

- Only logged-in users can create listings or reviews.
- Only a listing owner can edit or delete that listing.
- Only a review author can delete that review.
- EJS templates hide owner- and author-only controls from other users.
- Backend middleware enforces the same permissions even if a request bypasses
  the frontend.

---

## Run Locally

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd MAJORPROJECT
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start MongoDB

Make sure a local MongoDB server is available at:

```txt
mongodb://127.0.0.1:27017/wanderlust
```

### 4. Prepare the seed owner

`init/index.js` currently assigns a specific existing MongoDB user ID to every
seed listing. Replace `OWNER_ID` with the ID of a user in your local `users`
collection before seeding.

### 5. Seed the listings

```bash
node init/index.js
```

Warning: the seed script deletes all existing listing documents before
inserting the sample data.

### 6. Start the application

```bash
node app.js
```

### 7. Open the application

```txt
http://localhost:8080/listings
```

---

## Current Status

Implemented:

- MongoDB connection and seed data
- Listing, review, and user models
- Listing CRUD operations
- Review creation and deletion
- EJS layouts and Bootstrap styling
- Client-side and Joi server-side validation
- Centralized error handling
- Sessions and flash messages
- Signup, login, and logout
- Listing-owner and review-author authorization

Possible next improvements:

- Move secrets and environment-specific values into environment variables
- Add persistent production session storage
- Cascade-delete reviews when a listing is deleted
- Add Cloudinary image uploads
- Add maps, search, and filters
- Add automated tests
- Add deployment configuration

---

## Learning Purpose

This project is part of a full-stack web development learning journey. It
demonstrates how routing, databases, authentication, authorization, validation,
and server-rendered frontend pages work together in one application.

---

## Author

Rejan Karki
