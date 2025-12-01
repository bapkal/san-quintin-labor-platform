# Deployment Guide

Complete guide to deploy the Mexico Labor Project to production.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Database Setup (Supabase)](#database-setup-supabase)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Environment Variables](#environment-variables)
7. [Post-Deployment Verification](#post-deployment-verification)

---

## Quick Start

**Fastest way to deploy (5 minutes):**

1. **Backend on Railway:**

   ```bash
   # Install Railway CLI
   npm i -g @railway/cli

   # Login and deploy
   cd backend
   railway login
   railway init
   railway up
   # Set environment variables in Railway dashboard
   ```

2. **Frontend on Vercel:**

   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy from root directory
   vercel
   # Set environment variables when prompted
   ```

3. **Update CORS:**
   - After getting your frontend URL, update `ALLOWED_ORIGINS` in Railway
   - Or set it in backend environment variables

See detailed instructions below for each platform.

---

## Prerequisites

- ✅ Supabase project created and database schema applied
- ✅ Git repository (GitHub, GitLab, etc.)
- ✅ Accounts on deployment platforms (see options below)

---

## Database Setup (Supabase)

The database is already cloud-hosted on Supabase. Ensure:

1. **Database Schema Applied**

   - Go to Supabase Dashboard → SQL Editor
   - Run `backend/supabase_schema.sql` if not already done

2. **API Keys Ready**

   - Settings → API
   - Copy: Project URL and anon/public key
   - You'll need these for both backend and frontend

3. **Row Level Security (Optional)**
   - Consider enabling RLS policies for production
   - Currently using service role key in backend (if needed)

---

## Backend Deployment

### Option 1: Railway (Recommended - Easiest)

1. **Sign up**: [railway.app](https://railway.app)

2. **Create New Project**

   ```bash
   # Install Railway CLI (optional)
   npm i -g @railway/cli
   railway login
   ```

3. **Deploy from GitHub**

   - Connect your GitHub repo
   - Select the `backend` folder as root
   - Railway auto-detects Python

4. **Set Environment Variables**

   - Go to Variables tab
   - Add:
     ```
     SUPABASE_URL=https://your-project.supabase.co
     SUPABASE_KEY=your-anon-key-here
     PORT=8000
     ```

5. **Configure Start Command**

   - Settings → Deploy
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

6. **Deploy**
   - Railway will auto-deploy on push to main branch
   - Get your backend URL: `https://your-app.railway.app`

### Option 2: Render

1. **Sign up**: [render.com](https://render.com)

2. **Create New Web Service**

   - Connect GitHub repo
   - Root Directory: `backend`
   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Environment Variables**

   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-anon-key-here
   ```

4. **Deploy**
   - Render provides: `https://your-app.onrender.com`

### Option 3: Fly.io

1. **Install Fly CLI**

   ```bash
   curl -L https://fly.io/install.sh | sh
   fly auth login
   ```

2. **Create `backend/fly.toml`** (see below)

3. **Deploy**
   ```bash
   cd backend
   fly launch
   fly secrets set SUPABASE_URL=https://your-project.supabase.co
   fly secrets set SUPABASE_KEY=your-anon-key-here
   fly deploy
   ```

### Option 4: Docker (Any Platform)

1. **Create `backend/Dockerfile`** (see below)

2. **Build and Deploy**
   ```bash
   cd backend
   docker build -t mexico-labor-backend .
   docker run -p 8000:8000 -e SUPABASE_URL=... -e SUPABASE_KEY=... mexico-labor-backend
   ```

---

## Frontend Deployment

### Option 1: Vercel (Recommended - Best for React)

1. **Sign up**: [vercel.com](https://vercel.com)

2. **Import Project**

   - Connect GitHub repo
   - Framework Preset: Vite
   - Root Directory: `.` (root)

3. **Environment Variables**

   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_API_URL=https://your-backend-url.com
   ```

4. **Build Settings**

   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Deploy**
   - Vercel auto-deploys on push
   - Get URL: `https://your-app.vercel.app`

### Option 2: Netlify

1. **Sign up**: [netlify.com](https://netlify.com)

2. **Deploy from Git**

   - Connect repo
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables**

   - Site settings → Environment variables
   - Add same variables as Vercel

4. **Deploy**
   - Netlify provides: `https://your-app.netlify.app`

### Option 3: GitHub Pages

1. **Update `vite.config.ts`** (see below)

2. **GitHub Actions** (create `.github/workflows/deploy.yml` - see below)

3. **Push to GitHub**
   - Actions will auto-deploy
   - URL: `https://your-username.github.io/mexico-labor-project`

---

## Environment Variables

### Backend (`.env` or Platform Variables)

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key-here
PORT=8000  # Some platforms set this automatically
```

### Frontend (Platform Environment Variables)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_URL=https://your-backend-url.com
```

**Important**: Update `src/lib/api.ts` and `src/pages/JobsPage.tsx` to use `VITE_API_URL` instead of hardcoded `http://localhost:8000`.

---

## Post-Deployment Verification

### 1. Backend Health Check

```bash
curl https://your-backend-url.com/health
```

Should return:

```json
{
  "status": "healthy",
  "database": "connected",
  "jobs_count": 0,
  "contracts_count": 0
}
```

### 2. Frontend Check

- Visit your frontend URL
- Check browser console for errors
- Try logging in
- Verify API calls work

### 3. API Documentation

- Visit: `https://your-backend-url.com/docs`
- Test endpoints interactively

### 4. Database Connection

- Verify jobs load on frontend
- Try creating a job (grower account)
- Try applying to a job (worker account)

---

## Troubleshooting

### CORS Errors

If you see CORS errors, update `backend/main.py` to include your frontend URL:

```python
allow_origins=[
    "http://localhost:5173",
    "http://localhost:3000",
    "https://your-frontend-url.vercel.app",
    "https://your-frontend-url.netlify.app",
]
```

### Environment Variables Not Working

- **Backend**: Ensure variables are set in platform dashboard
- **Frontend**: Vite requires `VITE_` prefix. Rebuild after adding variables.

### Database Connection Issues

- Verify Supabase project is active
- Check API keys are correct
- Ensure database schema is applied

### Build Failures

- Check Node.js/Python versions match platform requirements
- Review build logs for specific errors
- Ensure all dependencies are in `requirements.txt` / `package.json`

---

## Next Steps

1. ✅ Set up custom domains (optional)
2. ✅ Enable HTTPS (automatic on most platforms)
3. ✅ Set up monitoring/error tracking (Sentry, etc.)
4. ✅ Configure CI/CD for automatic deployments
5. ✅ Set up database backups in Supabase

---

## Quick Deploy Commands

### Railway (Backend)

```bash
railway login
railway init
railway up
```

### Vercel (Frontend)

```bash
npm i -g vercel
vercel
```

### Fly.io (Backend)

```bash
fly launch
fly deploy
```
