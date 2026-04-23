# Company Core Admin Frontend

Enterprise admin frontend for the NestJS + MongoDB backend.

## Stack

- Next.js App Router
- React Query
- React Hook Form
- Internal Next.js route handlers as a BFF layer
- Global design tokens and CSS utilities

## Why this frontend is structured this way

- It matches the backend routes that already exist today.
- It keeps the NestJS access token in an httpOnly cookie instead of exposing it to browser JavaScript.
- It uses a single proxy route so new backend modules can be added without rewriting the whole auth flow.
- It separates route files, reusable UI, and domain features for easier long-term growth.

## Current backend modules supported

- auth bootstrap and login
- company profile
- roles and permissions
- branches
- org units
- positions
- employees
- parties
- contacts
- audit logs

## Future-ready placeholders

- products catalog page structure
- dashboard cards and quick actions
- room for extra business modules

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000

## Important environment variable

`API_BASE_URL` must point to your NestJS backend, for example:

```bash
API_BASE_URL=http://localhost:5003/api
```

## Auth model

1. The login page posts to `POST /api/session/login`.
2. That Next.js route handler forwards credentials to the backend login endpoint.
3. On success, it stores the backend JWT in an httpOnly cookie.
4. Authenticated UI calls use `/api/proxy/...`, which forwards requests to the backend with the Bearer token.

This keeps the backend token out of browser JavaScript while still allowing a client-side admin experience.
