# Deployment Checklist

Quick checklist for deploying the Mexico Labor Project.

## Pre-Deployment

- [ ] Supabase project created
- [ ] Database schema applied (`backend/supabase_schema.sql`)
- [ ] Supabase API keys copied (URL + anon key)
- [ ] Code pushed to GitHub/GitLab

## Backend Deployment

### Choose Platform:
- [ ] Railway (easiest)
- [ ] Render
- [ ] Fly.io
- [ ] Docker/Other

### Steps:
- [ ] Deploy backend to chosen platform
- [ ] Set environment variables:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_KEY`
  - [ ] `ALLOWED_ORIGINS` (add frontend URL after deployment)
- [ ] Test backend health: `https://your-backend-url.com/health`
- [ ] Test API docs: `https://your-backend-url.com/docs`
- [ ] Copy backend URL for frontend config

## Frontend Deployment

### Choose Platform:
- [ ] Vercel (recommended)
- [ ] Netlify
- [ ] GitHub Pages
- [ ] Other

### Steps:
- [ ] Deploy frontend to chosen platform
- [ ] Set environment variables:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
  - [ ] `VITE_API_URL` (your backend URL)
- [ ] Test frontend loads
- [ ] Test login/signup
- [ ] Test job browsing
- [ ] Copy frontend URL

## Post-Deployment

- [ ] Update backend `ALLOWED_ORIGINS` with frontend URL
- [ ] Test full flow:
  - [ ] Worker can sign up
  - [ ] Worker can browse jobs
  - [ ] Worker can apply to job
  - [ ] Grower can sign up
  - [ ] Grower can post job
  - [ ] Admin can view stats
- [ ] Check browser console for errors
- [ ] Test on mobile device (if applicable)
- [ ] Set up custom domain (optional)
- [ ] Enable monitoring/error tracking (optional)

## Environment Variables Reference

### Backend
```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJ...
ALLOWED_ORIGINS=https://your-frontend.vercel.app
PORT=8000
```

### Frontend
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_API_URL=https://your-backend.railway.app
```

## Troubleshooting

- **CORS errors?** → Update `ALLOWED_ORIGINS` in backend
- **API not working?** → Check `VITE_API_URL` in frontend
- **Database errors?** → Verify Supabase keys and schema
- **Build fails?** → Check Node.js/Python versions match platform

## Quick Commands

```bash
# Test backend locally
cd backend
uvicorn main:app --reload

# Test frontend locally
npm run dev

# Build frontend
npm run build

# Deploy to Railway
railway up

# Deploy to Vercel
vercel
```

