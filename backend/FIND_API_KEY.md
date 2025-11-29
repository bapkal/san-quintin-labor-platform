# How to Find Your Supabase API Key

## Step-by-Step:

1. **Go to your Supabase project dashboard**

   - Visit [supabase.com](https://supabase.com)
   - Select your project

2. **Navigate to Settings → API**

   - Click on the gear icon (⚙️) in the left sidebar
   - Click "API" in the settings menu

3. **Find the "Project API keys" section**

   - You'll see two keys:
     - **anon public** (this is what you need!)
     - **service_role** (secret - don't use this)

4. **Copy the "anon public" key**

   - It should look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNj...`
   - It's a LONG string starting with `eyJ`
   - This is a JWT token

5. **Also copy the Project URL**
   - It looks like: `https://xxxxx.supabase.co`

## Your .env file should look like:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNj...
```

## ⚠️ Common Mistakes:

- ❌ Using "sb*publishable*" key (wrong format)
- ❌ Using service_role key (too powerful, should be secret)
- ❌ Using database password (not needed for API)
- ✅ Using "anon public" key (correct!)

## If you can't find it:

The key might be in a different location depending on your Supabase version:

- Try: **Project Settings → API → Project API keys**
- Or: **Settings → API → anon public**

The key should be **very long** (hundreds of characters) and start with `eyJ`.

