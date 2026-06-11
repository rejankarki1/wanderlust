# WanderLust ✈️

WanderLust is a full-stack web application designed for listing and renting unique vacation properties. This project emphasizes a robust backend architecture featuring centralized error handling, robust schema validations, server-side routing, and responsive frontend templating.

---

## 🛠️ Project Status

- **Phase 1: Database Setup** (Completed) - Established local MongoDB connections and structured the core Mongoose Listing schema.
- **Phase 2: Full CRUD Routing** (Completed) - Configured predictable RESTful routes for full asset creation, reading, updating, and deleting operations.
- **Phase 3: Design, Layouts & Styling** (Completed) - Integrated the `ejs-mate` engine for master layouts, engineered reusable structural partials (navbar/footer), and designed a responsive Bootstrap 5 grid.
- **Phase 4: Validation & Error Handling** (Completed) - Deployed unified client-side feedback and strict backend data schema integrity filters.
- **Phase 5: Database Relationships** (Next Up) - Preparing to handle data models for reviews, users, and multi-document relationships.

---

## 🚀 Architectural Mechanics

1. **Data Integrity Pipeline:** Inbound request payloads undergo multi-layered checking—failing fast at the client browser level before confronting comprehensive constraint validations on the server controller.
2. **Database Seeding Engine:** An automated lifecycle system located in `./init` programmatically flushes existing documents and hydrates MongoDB with uniform mock profiles during development environments.
3. **Template Inheritance:** Leverages advanced block-placeholder injection patterns via `ejs-mate` to seamlessly share standard structural modules without violating dry code fundamentals.

---

## 🗺️ RESTful API Route Architecture

| Operation | Purpose | Method | URL Path | Middleware / Action |
| :--- | :--- | :--- | :--- | :--- |
| **Read (All)** | Fetch and render all active listings | GET | `/listings` | `views/listings/index.ejs` |
| **Create (Form)** | Display asset generation form | GET | `/listings/new` | `views/listings/new.ejs` |
| **Create (Submit)**| Commit new listing payload to database | POST | `/listings` | `validateListing` ➔ Redirects to `/listings` |
| **Read (One)** | Isolate and display singular asset details | GET | `/listings/:id` | `views/listings/show.ejs` |
| **Update (Form)**| Pull existing dataset into editable form fields| GET | `/listings/:id/edit` | `views/listings/edit.ejs` |
| **Update (Submit)**| Patch mutated property fields inside MongoDB | PUT | `/listings/:id` | `validateListing` ➔ Redirects to `/listings/:id` |
| **Delete** | Purge asset record permanently from database | DELETE | `/listings/:id` | Redirects to `/listings` |

---

## 🛡️ Robust Validation & Centralized Error Handling

### 1. Dual-Layer Validation
* **Client-Side Verification:** Uses native Bootstrap 5 custom form styles matching `:valid` and `:invalid` pseudoclasses along with explicit `required` attributes to instantly guide the user through accurate submission formats.
* **Server-Side Validation (Joi Schema):** To protect the API against malicious or bypassed input requests (e.g., Postman payloads), incoming datasets are structurally filtered through an immutable blueprint defined in `schema.js`.

### 2. Centralized Error Pipeline
* **Asynchronous Error Catching (`utils/wrapAsync.js`):** A custom utility higher-order function that seamlessly handles asynchronous database query rejections, catching hidden errors and bubbling them up via the Express execution stack `next()`.
* **Explicit Exceptions (`utils/ExpressError.js`):** Instantiates a structured subclass extending native JavaScript errors to enforce explicit HTTP Status Codes (e.g., `400 Bad Request`, `404 Not Found`) along with targeted messaging.
* **Global Error Middleware:** Captures generic failures and unhandled routes, rendering them cleanly onto a standardized, user-facing UI inside `views/error.ejs` to keep the application execution safe from breaking crashes.

---

## ⚡ Technical Stack

- **Runtime Environment:** Node.js
- **Backend Framework:** Express.js
- **Data Persistence:** MongoDB & Mongoose Object Modeling
- **Schema Validation Library:** Joi
- **Templating Engines:** Embedded JavaScript (EJS) & `ejs-mate`
- **UI Architecture:** Bootstrap 5 (Flexbox Utilities, Grid Components, Validation States)
- **HTTP Method Customization:** `method-override`
