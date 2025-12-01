# Voice Applications Feature

## Overview

The application now supports both **voice** and **text** applications. Workers can apply to jobs using voice recordings (uploaded to Supabase storage) or text messages. Growers and admins can view and manage all applications through a dedicated Applications page.

## Features Implemented

### 1. Voice Application Upload
- Workers can record voice applications using the microphone
- Audio files are uploaded to Supabase storage bucket: `voice-applications`
- Files are automatically named with timestamps for uniqueness
- Public URLs are stored in the database for playback

### 2. Text Applications
- Workers can submit text-based applications with notes
- Text is stored in the `notes` field of the applications table

### 3. Applications Management Page
- **Growers**: See applications for their own jobs only
- **Admins**: See all applications from all growers
- Filter by status: All, Pending, Accepted, Rejected
- View worker information (name, phone)
- Play voice recordings directly in the browser
- Download audio files
- Accept or reject applications

## Setup Required

### 1. Supabase Storage Bucket

Make sure you have a storage bucket named `voice-applications` in your Supabase project:

1. Go to Supabase Dashboard → Storage
2. Create a new bucket called `voice-applications`
3. Set it to **Public** (or configure RLS policies as needed)
4. Enable file uploads

### 2. Storage Policies (Optional but Recommended)

For production, set up Row Level Security policies:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Users can upload voice applications"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'voice-applications');

-- Allow authenticated users to read
CREATE POLICY "Users can read voice applications"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'voice-applications');
```

## How It Works

### For Workers

1. **Voice Application:**
   - Click "Apply with Voice" on a job card
   - Record your message
   - Click "Stop" when done
   - Audio is automatically uploaded to Supabase
   - Application is created with the audio URL

2. **Text Application:**
   - Click "Apply with Text" on a job card
   - Type your application message
   - Click "Submit Application"
   - Application is created with the text notes

3. **Quick Apply:**
   - Click "Quick Apply" for a simple application without voice or text

### For Growers/Admins

1. Navigate to **Applications** tab in the navbar
2. View all applications for your jobs (growers) or all jobs (admins)
3. Filter by status using the tabs
4. For each application:
   - See worker name and phone
   - Play voice recordings (if provided)
   - Read text applications (if provided)
   - Accept or reject pending applications

## API Endpoints

### New Endpoints

- `GET /applications` - Get applications
  - Query params: `grower_id`, `job_id`, `status`
  - Returns: List of applications with job and worker details

- `PATCH /applications/{application_id}` - Update application status
  - Body: `{ "status": "accepted" | "rejected" }`

### Updated Endpoints

- `POST /contracts` - Now accepts:
  - `audio_url` (optional) - URL of uploaded voice recording
  - `notes` (optional) - Text application message

## Database Schema

The `applications` table already has the required fields:
- `audio_url` - Stores the Supabase storage URL
- `notes` - Stores text application content
- `status` - 'pending', 'accepted', 'rejected'

## File Structure

### New Files
- `src/lib/storage.ts` - Supabase storage utilities
- `src/pages/ApplicationsPage.tsx` - Applications management page

### Updated Files
- `src/components/JobCard.tsx` - Added text application option
- `src/pages/JobsPage.tsx` - Updated to upload audio and send notes
- `src/components/Navbar.tsx` - Added Applications link
- `src/App.tsx` - Added Applications route
- `backend/main.py` - Added applications endpoints
- `backend/models.py` - Added ApplicationResponse model

## Testing

1. **Test Voice Application:**
   - As a worker, apply to a job with voice
   - Check Supabase Storage → `voice-applications` bucket
   - Verify file is uploaded
   - As a grower, view the application and play the audio

2. **Test Text Application:**
   - As a worker, apply to a job with text
   - As a grower, view the application and read the notes

3. **Test Application Management:**
   - As a grower, view applications for your jobs
   - As an admin, view all applications
   - Accept/reject applications
   - Verify status updates correctly

## Troubleshooting

### Audio Upload Fails
- Check Supabase storage bucket exists and is public
- Verify storage policies allow uploads
- Check browser console for errors
- Ensure microphone permissions are granted

### Applications Not Showing
- Verify user is logged in as grower or admin
- Check backend logs for query errors
- Verify database relationships (jobs → growers, applications → workers)

### Audio Won't Play
- Check audio URL is valid
- Verify Supabase storage bucket is public
- Check browser console for CORS errors

## Future Enhancements

- Audio transcription (convert voice to text)
- Application notifications
- Bulk accept/reject
- Application search and filters
- Export applications to CSV/PDF

