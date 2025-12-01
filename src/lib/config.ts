/**
 * Configuration utilities for API endpoints
 */

// Get API URL from environment variable, fallback to localhost for development
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Get full API endpoint URL
 */
export function getApiUrl(endpoint: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_URL}/${cleanEndpoint}`;
}

