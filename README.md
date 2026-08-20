# Movie Tracker

A full-stack movie watchlist app — add films, mark them watched, rate them, and sort your list — with a username-based login and cloud persistence via MongoDB.

**Live demo:** https://laurenceH-coder.github.io/movie-tracker

## Features

- **Username-based accounts** — enter a username to load (or automatically create) a personal watchlist; no password/auth flow, just per-user data storage
- **Add, watch-toggle, delete, and rate movies** from a simple form/card UI
- **Sorting** — order the list by title, genre, rating, or watched status
- **Persistent storage** — the list is saved to MongoDB Atlas via a small Express API, so it's there next time you log in from anywhere

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | React, deployed to GitHub Pages |
| Backend | Node.js, Express |
| Database | MongoDB Atlas (via Mongoose) |
| Hosting | Frontend on GitHub Pages, API on Render |

## Architecture

```
React app (GitHub Pages)
        │  fetch()
        ▼
Express API (Render) ── Mongoose ──▶ MongoDB Atlas
```

The frontend talks to a REST API with two endpoints:

- `GET /api/users/:username/movies` — fetch (or lazily create) a user's list
- `PUT /api/users/:username/movies` — overwrite a user's list with the current state

## Running it locally

### Backend

```bash
cd server
npm install
cp .env.example .env   # then fill in your own MONGO_URI
npm start
```

### Frontend

```bash
npm install
npm start
```

By default the frontend points at the deployed API (`API_BASE_URL` in `src/App.js`) — change that constant to `http://localhost:5000` to run fully locally against your own backend.

## Known limitations

- Login is username-only with no password — it's a personal-project convenience, not an auth system. Don't reuse this pattern for anything that needs real access control.
- No input validation/rate limiting on the API yet.

## License

MIT — see [LICENSE](LICENSE).
