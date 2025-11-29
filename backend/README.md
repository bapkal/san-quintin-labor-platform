# Mexico Labor Project - Backend API

FastAPI backend for the mobile-based employment system for agricultural day laborers in Baja California.

## Features

- **Poisson Process Job Generation**: Uses constant rate Poisson process to simulate job arrivals
- **Supabase Integration**: Direct database access using Supabase Python client
- **RESTful API**: Full CRUD operations for jobs and contracts
- **Statistics Dashboard**: Admin endpoints for analytics and forecasting

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Set Up Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to **Settings → API** to get your:
   - Project URL
   - Anon/Public Key
3. Go to **SQL Editor** and run the schema from `supabase_schema.sql`
4. Create a `.env` file in the `backend` directory:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your-anon-key-here
```

### 3. Seed the Database (Optional)

Generate initial jobs using the Poisson process:

```bash
python seed_database.py
```

This will:
- Generate 50 jobs using Poisson process (30 min arrival rate)
- Insert them into Supabase
- Create a test grower account

### 4. Run the Server

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Jobs
- `GET /jobs` - Get all jobs (with optional filters: `crop_type`, `status`, `limit`)
- `GET /jobs/{job_id}` - Get a specific job
- `POST /jobs` - Create a new job posting
- `DELETE /jobs/{job_id}` - Delete a job
- `POST /jobs/regenerate` - Regenerate jobs using Poisson process

### Contracts
- `GET /contracts` - Get all contracts (with optional filters: `worker_id`, `status`)
- `GET /contracts/{contract_id}` - Get a specific contract
- `POST /contracts` - Create a new contract (job application)
- `PATCH /contracts/{contract_id}` - Update contract status

### Statistics
- `GET /stats` - Get dashboard statistics (jobs, applications, forecasts)

### Health
- `GET /health` - Health check endpoint
- `GET /` - API information

## Database Schema

The database schema is defined in `supabase_schema.sql`. Key tables:

- **users** - Base user table (workers, growers, admins)
- **workers** - Worker-specific fields (literacy, language preferences)
- **growers** - Grower/farm information
- **jobs** - Job postings with Poisson arrival times
- **applications** - Job applications with voice recordings
- **contracts** - Signed contracts between workers and growers
- **analytics_logs** - Event tracking for research evaluation
- **demand_forecast** - Stored Poisson process forecasts

## Poisson Process Integration

The system uses a Poisson process to generate realistic job arrivals:

1. **Job Generation**: `data_generator.py` uses NumPy to generate exponential inter-arrival times
2. **Database Insertion**: Jobs are inserted directly into Supabase with arrival times
3. **Forecast Storage**: Each generation run stores metadata in `demand_forecast` table

To regenerate jobs:
```bash
POST /jobs/regenerate?num_jobs=100&arrival_rate_minutes=45
```

## Environment Variables

Create a `.env` file with:

```env
SUPABASE_URL=your-project-url
SUPABASE_KEY=your-anon-key
```

## Development

- The backend uses Supabase Python client for all database operations
- No ORM needed - direct table access via `supabase.table()`
- All job generation uses your Poisson process function
- Statistics are calculated from real database queries
