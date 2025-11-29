# Database Setup Guide

## Step-by-Step Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name**: Mexico Labor Project
   - **Database Password**: (save this!)
   - **Region**: Choose closest to you
4. Wait for project to be created (~2 minutes)

### 2. Get Your API Credentials

1. Go to **Settings → API** in your Supabase dashboard
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 3. Create Database Schema

1. Go to **SQL Editor** in Supabase dashboard
2. Click **New Query**
3. Copy and paste the entire contents of `supabase_schema.sql`
4. Click **Run** (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned"

### 4. Set Up Environment Variables

1. In the `backend` directory, create a `.env` file:
```bash
cd backend
touch .env
```

2. Add your credentials:
```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your-anon-key-here
```

Replace with your actual values from Step 2.

### 5. Install Dependencies

```bash
pip install -r requirements.txt
```

### 6. Seed Database (Optional)

Generate initial jobs using Poisson process:

```bash
python seed_database.py
```

This creates:
- 50 jobs using Poisson process (30 min arrival rate)
- Test grower account

### 7. Run the Server

```bash
uvicorn main:app --reload --port 8000
```

### 8. Verify Setup

1. Visit `http://localhost:8000/health` - should show database connected
2. Visit `http://localhost:8000/docs` - see API documentation
3. Try `GET /jobs` - should return jobs from Supabase

## Troubleshooting

**"Database disconnected" error:**
- Check your `.env` file has correct SUPABASE_URL and SUPABASE_KEY
- Make sure you ran the SQL schema in Supabase SQL Editor

**"Table does not exist" error:**
- Go back to Supabase SQL Editor and run `supabase_schema.sql` again

**No jobs showing:**
- Run `python seed_database.py` to generate initial jobs
- Or call `POST /jobs/regenerate` endpoint

## Next Steps

- Your frontend should now connect to `http://localhost:8000`
- All data is stored in Supabase (persistent, not in-memory)
- You can view data in Supabase dashboard → Table Editor

