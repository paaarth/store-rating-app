# Store Rating Application

A full stack web application where users can sign up, browse stores, and submit ratings (1-5) for stores. Built as part of a coding challenge.

## Tech Stack

- **Frontend**: React JS (React Router, Axios)
- **Backend**: Java 21, Spring Boot 3, Spring Data JPA
- **Database**: PostgreSQL

## Features

- Single login system with role-based access (Admin, Normal User, Store Owner)
- Admin dashboard with total users, stores, and ratings count
- Admin can add new users (admins, normal users, store owners) and stores
- Admin can view/filter/sort all users and stores
- Normal users can sign up, browse stores, search by name/address, and submit/update ratings (1-5)
- Store owners can view a dashboard with average rating and list of users who rated their store
- Profile page with update profile, change password, light/dark theme toggle, and logout

## Folder Structure

```
store-rating-app/
├── backend/        # Spring Boot application
├── frontend/       # React application
└── database/       # SQL schema file
```

## Architecture

This project avoids CORS entirely by serving the React frontend and the Spring Boot backend from the **same origin**. During development you can still run them on separate ports (3000 and 8080) using the React dev server's proxy, but for a production-style run, the React app is built into static files and placed inside the Spring Boot app, so both the UI and the API are served from `http://localhost:8080`.

The Axios instance (`frontend/src/api/axios.js`) uses a **relative** base URL (`/api`), so it automatically works whether the frontend is served by Spring Boot directly or via the React dev server proxy.

## Getting Started

### 1. Database Setup

Create a PostgreSQL database and run the schema file:

```bash
createdb -U postgres store_rating_db
psql -U postgres -d store_rating_db -f database/schema.sql
```

This will also create a default admin account:

- Email: `admin@gmail.com`
- Password: `Admin@123`

### 2. Single Server Run

```bash
# 1. Build the frontend
cd frontend
npm install
npm run build

Then run each normally:

```bash
# Terminal 1
cd backend
mvn spring-boot:run

# Terminal 2
cd frontend
npm start
```

The React dev server (port 3000) forwards any `/api/**` request to `http://localhost:8080`, so the browser only ever talks to port 3000 — avoiding cross-origin requests during development too.

## Form Validation Rules

- **Name**: 20-60 characters
- **Address**: Max 400 characters
- **Password**: 8-16 characters, at least one uppercase letter and one special character
- **Email**: Standard email format

## Default Roles

- `ADMIN` - System Administrator
- `NORMAL_USER` - Regular user who can rate stores
- `STORE_OWNER` - Owner of a store who can view ratings dashboard

## Notes

- To create a Store Owner account, log in as an admin and add a user with the `STORE_OWNER` role, then assign them to a store while adding a store.
- This project does not implement authentication tokens/sessions for simplicity; user details from login are stored in browser local storage.
