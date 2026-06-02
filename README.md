// MAKE THE BASIC SETUP AND CONNECT TO THE MONGO 
// MAKE THE SCHEMA IN MODELS 
( make a testing route to check )

// NOW INITIALIZE THE DATABASE 

// Perform the CRUD WITH THE DATA 
## CRUD Route Mapping

### Route Directory
| Operation | Purpose | Method | URL Path | Action / View File |
| :--- | :--- | :--- | :--- | :--- |
| **Read (All)** | Show all listings | GET | `/listings` | `views/listings/index.ejs` |
| **Create (Form)**| Show form to add a listing | GET | `/listings/new` | `views/listings/new.ejs` |
| **Create (Submit)**| Save new form data to DB | POST | `/listings` | Redirects to `/listings` |
| **Read (One)** | Show details for one listing | GET | `/listings/:id` | `views/listings/show.ejs` |
| **Update (Form)**| Show pre-filled edit form | GET | `/listings/:id/edit` | `views/listings/edit.ejs` |
| **Update (Submit)**| Save updated details to DB | PUT | `/listings/:id` | Redirects to `/listings/:id` |
| **Delete** | Remove listing from DB | DELETE | `/listings/:id` | Redirects to `/listings` |


