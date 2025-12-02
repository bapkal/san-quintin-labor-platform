/**
 * API Configuration
 * Gets the backend API URL from environment variables
 * Always prioritizes VITE_API_URL if set
 */
export const getApiUrl = (): string => {
  // Always check VITE_API_URL first - this is the primary source
  // Note: Vite only exposes env vars that start with VITE_
  const apiUrl = import.meta.env.VITE_API_URL;
  
  // Check if VITE_API_URL is set (even if empty string, we want to handle it)
  if (apiUrl !== undefined && apiUrl !== null) {
    const urlString = String(apiUrl).trim();
    
    // If it's a non-empty string, use it
    if (urlString) {
      // Ensure it has the protocol
      if (urlString.startsWith('http://') || urlString.startsWith('https://')) {
        return urlString;
      }
      // If no protocol, assume https for production URLs
      return `https://${urlString}`;
    }
  }
  
  // Only use fallback if VITE_API_URL is truly not set
  // This should only happen in local development without .env file
  if (import.meta.env.DEV) {
    // Development mode - use localhost as fallback
    console.warn('VITE_API_URL not set, using localhost fallback for development');
    return 'http://localhost:8000';
  } else {
    // Production mode - use Railway URL as fallback
    console.warn('VITE_API_URL not set, using Railway URL fallback');
    return 'https://san-quintin-labor-platform-production.up.railway.app';
  }
};

// Get API URL - this will always check VITE_API_URL first
// We call it as a function to ensure it's evaluated fresh each time
export const API_URL = getApiUrl();

