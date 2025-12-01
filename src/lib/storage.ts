import { supabase } from './supabase';

/**
 * Upload audio file to Supabase storage bucket
 * @param file - Audio blob or File object
 * @param fileName - Name for the file (will be prefixed with timestamp)
 * @param bucketName - Storage bucket name (default: 'voice-applications')
 * @returns Public URL of the uploaded file
 */
export async function uploadAudioFile(
  file: Blob | File,
  fileName: string = 'recording',
  bucketName: string = 'voice-applications'
): Promise<string> {
  try {
    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const fileExtension = file instanceof File ? file.name.split('.').pop() || 'webm' : 'webm';
    const uniqueFileName = `${timestamp}-${fileName}.${fileExtension}`;

    // Convert blob to File if needed
    const fileToUpload = file instanceof File 
      ? file 
      : new File([file], uniqueFileName, { type: 'audio/webm' });

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(uniqueFileName, fileToUpload, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading audio:', error);
      throw new Error(`Failed to upload audio: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    if (!urlData?.publicUrl) {
      throw new Error('Failed to get public URL for uploaded file');
    }

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadAudioFile:', error);
    throw error;
  }
}

/**
 * Get audio file URL from Supabase storage
 */
export function getAudioUrl(filePath: string, bucketName: string = 'voice-applications'): string {
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);
  return data.publicUrl;
}

