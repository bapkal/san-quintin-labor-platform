"""
Supabase database client setup.
"""
from supabase import create_client, Client
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from backend directory
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

# Get Supabase credentials from environment
SUPABASE_URL = os.getenv("SUPABASE_URL", "").strip()
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "").strip()

# Remove quotes if present
SUPABASE_URL = SUPABASE_URL.strip('"').strip("'")
SUPABASE_KEY = SUPABASE_KEY.strip('"').strip("'")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError(
        f"SUPABASE_URL and SUPABASE_KEY must be set in .env file at {env_path}.\n"
        "Get these from your Supabase project: Settings → API\n"
        "Format:\n"
        "SUPABASE_URL=https://your-project.supabase.co\n"
        "SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\n"
        f"Current values: URL={'SET' if SUPABASE_URL else 'MISSING'}, KEY={'SET' if SUPABASE_KEY else 'MISSING'}"
    )

# Validate URL format
if not SUPABASE_URL.startswith("https://") or ".supabase.co" not in SUPABASE_URL:
    raise ValueError(
        f"Invalid SUPABASE_URL format. Should be: https://your-project.supabase.co\n"
        f"Got: {SUPABASE_URL[:50]}..."
    )

# Validate key format (should start with eyJ for JWT, or be a valid Supabase key)
if not (SUPABASE_KEY.startswith("eyJ") or SUPABASE_KEY.startswith("sb_")):
    raise ValueError(
        f"Invalid SUPABASE_KEY format.\n"
        f"Expected: JWT token starting with 'eyJ' OR Supabase key starting with 'sb_'\n"
        f"Make sure you're using the 'anon public' key from Settings → API\n"
        f"Got: {SUPABASE_KEY[:30]}...\n"
        f"Full key length: {len(SUPABASE_KEY)} characters"
    )

# Create Supabase client
try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception as e:
    raise ValueError(
        f"Failed to create Supabase client. Error: {str(e)}\n"
        "Please verify:\n"
        "1. Your SUPABASE_URL is correct (https://your-project.supabase.co)\n"
        "2. Your SUPABASE_KEY is the 'anon public' key (starts with eyJ)\n"
        "3. Both values in .env have no extra spaces or quotes\n"
        f"URL: {SUPABASE_URL[:30]}...\n"
        f"KEY: {SUPABASE_KEY[:30]}..."
    )

