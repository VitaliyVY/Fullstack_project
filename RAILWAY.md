# Deploy to Railway

This repo is a monorepo with two services:
- `backend` (Express API)
- `client` (Vite frontend)

Create **two Railway services** from the same GitHub repo.

## 1) Backend service

Service settings:
- Root Directory: `backend`
- Build Command: `npm ci`
- Start Command: `npm start`

Required environment variables:
- `MONGO`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`
- `IK_URL_ENDPOINT`
- `IK_PUBLIC_KEY`
- `IK_PRIVATE_KEY`
- `CLIENT_URL` (set this to your Railway frontend public URL)

After deploy, note backend public URL, for example:
- `https://your-backend.up.railway.app`

Health check endpoint:
- `/health`

## 2) Client service

Service settings:
- Root Directory: `client`
- Build Command: `npm ci && npm run build`
- Start Command: `npm start`

Required environment variables:
- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_API_URL` (set to backend public URL, without trailing slash)

Example:
- `VITE_API_URL=https://your-backend.up.railway.app`

## 3) Clerk updates after both deploys

In Clerk dashboard:
- Add frontend Railway URL to allowed redirect/origin settings.
- Set webhook endpoint to:
  - `https://your-backend.up.railway.app/webhooks/clerk`

## 4) Final cross-check

- Backend logs show: `MongoDB is connected`.
- Backend logs show a dynamic port from `PORT`.
- Frontend loads and can call `${VITE_API_URL}/posts`.
- Protected routes work with Clerk auth.

