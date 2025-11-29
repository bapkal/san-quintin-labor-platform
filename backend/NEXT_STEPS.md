# Next Steps - Database Setup

## ✅ Step 1: Create Database Tables (REQUIRED)

1. **Go to your Supabase project dashboard**
2. **Click "SQL Editor"** in the left sidebar
3. **Click "New Query"**
4. **Open the file `supabase_schema.sql`** from this directory
5. **Copy the ENTIRE contents** of `supabase_schema.sql`
6. **Paste it into the SQL Editor**
7. **Click "Run"** (or press Cmd/Ctrl + Enter)
8. **You should see**: "Success. No rows returned"

This creates all 9 tables:

- users
- workers
- growers
- jobs
- applications
- contracts
- voice_messages
- analytics_logs
- demand_forecast

## ✅ Step 2: Seed Database with Jobs

Once tables are created, run:

```bash
cd backend
python seed_database.py
```

This will:

- Generate 50 jobs using your Poisson process
- Insert them into Supabase
- Create a test grower account

## ✅ Step 3: Start the Backend Server

```bash
cd backend
uvicorn main:app --reload --port 8000
```

## ✅ Step 4: Test the API

1. **Health check**: Visit `http://localhost:8000/health`

   - Should show database connected and job count

2. **API docs**: Visit `http://localhost:8000/docs`

   - Interactive API documentation

3. **Get jobs**: Visit `http://localhost:8000/jobs`
   - Should return your generated jobs

## ✅ Step 5: Start Frontend

In a new terminal:

```bash
npm run dev
```

Your frontend should now connect to the backend and display jobs from Supabase!

## Troubleshooting

**"Table does not exist" error:**

- Make sure you ran the SQL schema in Supabase SQL Editor

**"Connection timeout":**

- Check your Supabase project is active
- Verify your SUPABASE_URL is correct

**"No jobs showing":**

- Run `python seed_database.py` again
- Or call `POST /jobs/regenerate` endpoint

