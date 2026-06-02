# WanderLust ✈️

WanderLust is a full-stack web application for listing and renting unique vacation places. This project focuses on building a clean backend with server-side routing and database storage.

---

## 🛠️ Project Status

- **Phase 1: Database Setup** (Done) - Connected the app to MongoDB and created the Listing schema.
- **Phase 2: Full CRUD Routing** (Done) - Added the ability to Create, Read, Update, and Delete listings.
- **Phase 3: Design & Styling** (Next Step) - Adding a layout engine, navbar, and clean styling.

---

## 🚀 How the System Works

1. **Database Connection:** The app connects locally to a MongoDB database named `wanderlust` using Mongoose.
2. **Data Modeling:** The structure of a listing is managed inside `./models/listing.js`.
3. **Database Seeding:** The files inside the `./init` folder are used to automatically clear out old data and insert fresh sample listings for development testing.

---

## 🗺️ CRUD Route Mapping

| Operation | Purpose | Method | URL Path | View File / Action |
| :--- | :--- | :--- | :--- | :--- |
| **Read (All)** | Show all listings | GET | `/listings` | `views/listings/index.ejs` |
| **Create (Form)**| Show form to add a listing | GET | `/listings/new` | `views/listings/new.ejs` |
| **Create (Submit)**| Save new form data to DB | POST | `/listings` | Redirects to `/listings` |
| **Read (One)** | Show details for one listing | GET | `/listings/:id` | `views/listings/show.ejs` |
| **Update (Form)**| Show pre-filled edit form | GET | `/listings/:id/edit` | `views/listings/edit.ejs` |
| **Update (Submit)**| Save updated details to DB | PUT | `/listings/:id` | Redirects to `/listings/:id` |
| **Delete** | Remove listing from DB | DELETE | `/listings/:id` | Redirects to `/listings` |

---

## ⚡ Tech Stack Used

- **Runtime:** Node.js
- **Backend:** Express.js
- **Database:** MongoDB & Mongoose
- **Frontend Views:** EJS (Embedded JavaScript)
- **Forms Handling:** `method-override` (to support PUT and DELETE requests)