# WanderLust ✈️

WanderLust is a full-stack web application for listing and renting unique vacation places. This project focuses on building a clean backend with server-side routing, layout templating, and database storage.

---

## 🛠️ Project Status

- **Phase 1: Database Setup** (Done) - Connected the app to MongoDB and created the Listing schema.
- **Phase 2: Full CRUD Routing** (Done) - Added the ability to Create, Read, Update, and Delete listings.
- **Phase 3: Design, Layouts & Styling** (Done) - Integrated the `ejs-mate` templating engine for boilerplate layouts, created standard navbar/footer partial components, and built a responsive grid layout for listings.
- **Phase 4: Form Validation & Security** (Next Step) - Adding backend and frontend form validation.

---

## 🚀 How the System Works

1. **Database Connection:** The app connects locally to a MongoDB database named `wanderlust` using Mongoose.
2. **Data Modeling:** The structure of a listing is managed inside `./models/listing.js`.
3. **Database Seeding:** The files inside the `./init` folder automatically clear out old records and insert fresh sample listings for testing.
4. **Layout Templating:** Uses a master boilerplate template engine to cleanly share navigation layouts and footers across all user pages without code duplication.

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
- **Backend Framework:** Express.js
- **Database:** MongoDB & Mongoose
- **Templating Engine:** EJS (Embedded JavaScript) & `ejs-mate`
- **UI Framework:** Bootstrap 5 (Responsive Layout Cards, Navbars, Footers)
- **Forms Handling:** `method-override` (to support PUT and DELETE requests)