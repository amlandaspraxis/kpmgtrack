# Amar Kotha (আমার কথা)

Amar Kotha is a clean, minimal journal and guestbook application designed for sharing thoughts, comments, and expressions. Built with Node.js, Express, EJS templates, and MongoDB, it features a glassmorphic light-theme layout and async reaction buttons.

## Features

- **Full CRUD Support:** Post new thoughts, view detailed entries, edit details, or remove them easily.
- **Interactive Reactions:** Async like and dislike buttons that update counts immediately using standard fetch requests (no full-page reloads).
- **Responsive Light Theme:** Designed with a clean glassmorphism aesthetic, subtle background gradients, and Outfit/Plus Jakarta typography.
- **Standard Routing:** Structured RESTful endpoints for managing entry states.

---

## Project Structure

```
├── models/
│   └── comments.js      # Mongoose schema mapping the entries collection
├── public/
│   └── style.css        # Core stylesheet for light theme and animations
├── views/
│   ├── 404.ejs          # Fallback error page
│   ├── dash.ejs         # Landing dashboard/features overview
│   ├── index.ejs        # List view showing all posted entries
│   ├── new.ejs          # Create form for adding entries
│   ├── edit.ejs         # Edit form for updating entries
│   └── show.ejs         # Single entry detail view
├── server.js            # Express app config, database connections, and routes
├── package.json         # Node metadata and dependencies
└── README.md            # You are here
```
