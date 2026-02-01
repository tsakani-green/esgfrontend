# Render Deployment Setup - Frontend

## Overview
The frontend needs to know the backend API URL when deployed on Render. This guide explains how to configure it.

## Current Issue
- Frontend: `https://frontend-c3bv.onrender.com/` (or similar)
- Backend: Not configured in frontend's environment
- Result: CORS and connection errors when trying to log in

## Solution: Set VITE_API_URL Environment Variable

### Step 1: Identify Your Backend Service URL
On Render, you have a backend admin service deployed. Find its URL:
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Find your `backendadmin` service
3. Copy its public URL (looks like: `https://backendadmin-xxxx.onrender.com`)

### Step 2: Configure Frontend Environment Variables in Render

1. Go to your **frontend** service in Render dashboard
2. Click **Settings**
3. Scroll to **Environment**
4. Click **Add Environment Variable**
5. Add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://backendadmin-xxxx.onrender.com` (replace with your actual backend URL)
6. Click **Save**

### Step 3: Trigger a Redeploy
1. Go back to the main service page
2. Click **Manual Deploy** (or wait for next commit to trigger auto-deploy)
3. Watch the build logs for any errors

## Verification

After redeployment, test the login:
1. Open your frontend URL in a browser
2. Try logging in with:
   - **Username:** `admin`
   - **Password:** `admin123`
3. If successful, you'll see the dashboard
4. If it fails, check the browser console (F12 → Console tab) for error messages

## Common Issues

### "Cannot connect to backend at http://localhost:8002"
- **Cause:** VITE_API_URL environment variable is not set
- **Fix:** Make sure you added the environment variable in Render and triggered a redeploy

### "CORS Connection Refused"
- **Cause:** Backend CORS settings don't include the frontend URL
- **Fix:** On the `backendadmin` Render service, ensure `CORS_ORIGINS` environment variable includes your frontend URL
  - Example: `https://frontend-c3bv.onrender.com,https://frontend-c3bv.onrender.com`

### Logs show "502 Bad Gateway"
- **Cause:** Backend service might be down or not responding
- **Fix:** Check the backendadmin service logs and ensure it deployed successfully

## Local Development

For local development, use `.env.example`:
```env
VITE_API_URL=http://localhost:8002
```

Or create `.env.local`:
```env
VITE_API_URL=http://localhost:8002
```

## What Gets Built

When Render builds your frontend, it:
1. Reads environment variables (including `VITE_API_URL`)
2. Builds with Vite: `npm run build`
3. Serves the static files via the Render Node.js server

Vite embeds the API URL at build time, so the browser always uses the correct backend address.

## Still Having Issues?

1. Check Render service logs:
   - Frontend: Settings → Logs
   - Backend: Settings → Logs
   
2. Look at browser console (F12):
   - Network tab shows API requests
   - Console tab shows JavaScript errors
   
3. Verify services are actually running:
   - Frontend shows "Status: Available"
   - Backend shows "Status: Available"

4. Test the API directly:
   - Open a new tab and go to: `https://backendadmin-xxxx.onrender.com/api/auth/me`
   - Should ask for login (or show error), not network error
