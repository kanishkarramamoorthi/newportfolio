# Personal Portfolio Website

A full-stack portfolio website built with React, Express, and MongoDB. It showcases projects and skills, exposes API routes, stores project details in MongoDB, and can be deployed as one Node app.

## Features

- React frontend with responsive sections for intro, projects, skills, and contact.
- Express backend with REST endpoints for profile, projects, skills, health, and contact.
- MongoDB project storage with automatic starter data insertion.
- Local fallback sample data when MongoDB is not configured yet.
- Heroku-ready `Procfile`; also works on other Node hosting platforms.

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB connection string.

4. Start the app in development:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## Seed The Database

```bash
npm run seed
```

The server also inserts starter projects automatically if MongoDB is connected and the collection is empty.

## API Routes

- `GET /api/health`
- `GET /api/profile`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/skills`
- `POST /api/contact`

## Build And Deploy

Build the React app:

```bash
npm run build
```

Run the production server:

```bash
npm start
```

For Heroku:

1. Create a Heroku app.
2. Add `MONGODB_URI` and `CONTACT_EMAIL` config vars.
3. Push the repository to Heroku.

The production server serves the built React files from `dist`.
