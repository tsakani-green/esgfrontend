# Frontend Deployment Setup (Render / Vercel)

## Overview
The frontend needs to know the backend API URL at *build time* so client requests go to the correct service. This guide covers adding the environment variables and verifying connectivity.

## Env vars to set
- **VITE_API_URL** (required for production builds)
  - Value: `https://<your-backend-service>.onrender.com` (no trailing slash)
  - Purpose: Base URL used by the frontend to call the backend API (e.g. `https://api.example.com`)
- **VITE_WS_URL** (optional for websockets)
  - Value: `wss://<your-backend-service>.onrender.com` or production wss URL
- **Note:** Vite reads `VITE_` variables at *build time*. After changing these, you must redeploy the frontend.

## How to set env vars (Render)
1. Open your Frontend service in Render
2. Go to **Settings → Environment**
3. Click **Add Environment Variable** and add `VITE_API_URL` with the backend URL
4. Save and **Manual Deploy** (or push to repo to trigger auto-deploy)

## How to set env vars (Vercel)
1. Open your Vercel project
2. Go to **Settings → Environment Variables**
3. Add `VITE_API_URL` in the **Production** scope (and Preview if desired)
4. Click **Redeploy** from the project Overview or push a commit

## Backend envs to verify (Render)
- **CORS_ORIGINS** (comma-separated) — include your frontend URL(s)
  - Example: `https://esgfrontend-delta.vercel.app,https://esgfrontend.example.com`
- **FRONTEND_URL** — set to your frontend base URL

## Redeploy steps
1. Set `VITE_API_URL` on your frontend host (Render or Vercel)
2. Trigger a redeploy (Manual Deploy / Redeploy / commit)
3. Watch the build logs for `VITE_API_URL` usage (build output won’t echo secret values but the build should succeed)

## Quick verification commands
- DNS/Connectivity
  - Windows PowerShell: `nslookup <your-backend-service>.onrender.com`
  - PowerShell: `Test-NetConnection -ComputerName <your-backend-service>.onrender.com -Port 443`
- Health endpoint
  - `curl -i https://<your-backend-service>.onrender.com/api/status`
- CORS check (ensure backend allows your frontend origin)
  - `curl -i -H "Origin: https://<your-frontend-domain>" https://<your-backend-service>.onrender.com/api/status`
    - Expect `Access-Control-Allow-Origin: https://<your-frontend-domain>` in response headers

## Browser verification
1. Open the frontend URL and attempt to log in
2. Open DevTools → Network tab and watch requests to `VITE_API_URL` / `/api/*`
3. Confirm there are no `ERR_NAME_NOT_RESOLVED` DNS errors, and check CORS errors in Console if any

## Local development
- Use `.env.local` or `.env` with:
```env
VITE_API_URL=http://localhost:8002
```
- Start backend locally: `cd esgbackend && uvicorn app.main:app --port 8002 --reload`
- Start frontend dev server: `cd esgfrontend && npm run dev`

## Common gotchas & tips
- No trailing slash on `VITE_API_URL` (keep it clean)
- Vite bakes `VITE_` variables at build time — redeploy after changes
- Prefer leaving `VITE_API_URL` empty when serving frontend & backend from the same origin and use relative `/api/*` paths

## Still stuck?
- Check Render / Vercel logs for build/runtime errors
- Confirm `CORS_ORIGINS` on backend includes your frontend origin
- Run the `curl` checks above to confirm network reachability
- Share the frontend build logs and a screenshot of the browser console if you want me to review them
