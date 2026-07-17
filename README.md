# Zeta Admin Panel

A Node.js admin panel with authentication, cookie-based session handling, and a simple dashboard built using Express, MongoDB, and EJS.

## Features

- Admin registration and login
- Cookie-based authentication middleware
- Express + EJS views
- MongoDB via Mongoose
- Static asset serving from `public/`
- Debug route for clearing authentication cookie

## Requirements

- Node.js 18+ (or compatible)
- MongoDB instance

## Installation

1. Clone the repository or copy files.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root with the required environment variables, for example:

```env
MONGO_URI=mongodb://localhost:27017/zeta-admin-cookie
JWT_SECRET=your_secret_key
PORT=3000
```

4. Start the app:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

## Project Structure

- `app.js` - main Express application entrypoint
- `config/db.js` - database connection logic
- `controllers/` - auth and admin controller logic
- `middleware/` - authentication middleware
- `models/` - Mongoose models
- `route/` - Express routes
- `views/` - EJS templates
- `public/` - static assets (CSS, JavaScript, images)

## Available Scripts

- `npm start` - run the app
- `npm run dev` - run the app with `nodemon`
- `npm run seed` - run seed script if available

## Notes

- Ensure MongoDB is running and the connection string in `.env` is correct.
- The app uses cookies for auth. The temporary debug route is available at `/debug/clear-user-cookie`.

## License

This project is licensed under ISC.
