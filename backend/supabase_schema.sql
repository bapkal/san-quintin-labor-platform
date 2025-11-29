-- Supabase Database Schema
-- Run this in your Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Base Table)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role TEXT NOT NULL CHECK (role IN ('worker', 'grower', 'admin')),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Workers Table
CREATE TABLE IF NOT EXISTS workers (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    literacy_level TEXT CHECK (literacy_level IN ('low', 'medium', 'high')),
    preferred_language TEXT,
    prefers_voice_input BOOLEAN DEFAULT FALSE,
    age INTEGER,
    gender TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Growers Table
CREATE TABLE IF NOT EXISTS growers (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    farm_name TEXT NOT NULL,
    location TEXT,
    contact_person TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Jobs Table (Core Posting Table)
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    grower_id UUID REFERENCES growers(user_id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    crop_type TEXT NOT NULL CHECK (crop_type IN ('Tomato', 'Strawberry', 'Other')),
    pay_rate_mxn NUMERIC(10, 2) NOT NULL,
    quantity_units INTEGER NOT NULL,
    unit_type TEXT NOT NULL,
    workers_requested INTEGER NOT NULL,
    start_date DATE NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'cancelled')),
    service_time_mins NUMERIC(10, 2),
    arrival_time_poisson NUMERIC(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES workers(user_id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    audio_url TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT
);

-- 6. Contracts Table
CREATE TABLE IF NOT EXISTS contracts (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES workers(user_id) ON DELETE CASCADE,
    application_id INTEGER REFERENCES applications(id) ON DELETE SET NULL,
    signed_at TIMESTAMP WITH TIME ZONE,
    benefit_enrolled BOOLEAN DEFAULT FALSE,
    contract_pdf_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'signed', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Voice Messages Table
CREATE TABLE IF NOT EXISTS voice_messages (
    id SERIAL PRIMARY KEY,
    worker_id UUID REFERENCES workers(user_id) ON DELETE CASCADE,
    application_id INTEGER REFERENCES applications(id) ON DELETE SET NULL,
    audio_url TEXT NOT NULL,
    duration_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Analytics Logs (For Evaluation + Research)
CREATE TABLE IF NOT EXISTS analytics_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    job_id INTEGER REFERENCES jobs(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- 9. Demand Forecast Table
CREATE TABLE IF NOT EXISTS demand_forecast (
    id SERIAL PRIMARY KEY,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    num_jobs INTEGER NOT NULL,
    arrival_rate_minutes NUMERIC(10, 2) NOT NULL,
    forecast_json JSONB,
    summary_json JSONB
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_jobs_grower_id ON jobs(grower_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_start_date ON jobs(start_date);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_worker_id ON applications(worker_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_contracts_job_id ON contracts(job_id);
CREATE INDEX IF NOT EXISTS idx_contracts_worker_id ON contracts(worker_id);
CREATE INDEX IF NOT EXISTS idx_analytics_logs_user_id ON analytics_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_logs_event_type ON analytics_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_logs_timestamp ON analytics_logs(timestamp);

