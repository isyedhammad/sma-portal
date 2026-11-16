/**
 * Directorate General of Mines & Minerals, Government of the Punjab
 * SMA Licensing & Quasi-Judicial Hearing Management System
 * 
 * Cloud Database Configuration Guide
 * -----------------------------------
 * This portal supports central real-time cloud database storage (Supabase or Firebase Firestore).
 * 
 * 1. For Supabase:
 *    - Sign up at https://supabase.com and create a new project (e.g., "punjab-mines-sma").
 *    - In the SQL Editor, run the provided SQL script to create the 'leases' and 'hearings' tables.
 *    - Copy your Project URL and Anon Public Key.
 *    - Add them to your .env file or paste them into the "Cloud Synced" settings modal in the web app header.
 * 
 * 2. For Firebase Firestore:
 *    - Create a project at https://console.firebase.google.com
 *    - Enable Cloud Firestore in test or production mode.
 *    - Copy your Project ID and Web API Key into .env or the in-app Cloud Settings modal.
 * 
 * 3. Fallback / Offline Mode:
 *    - If no cloud credentials are provided, the application operates in resilient central cache
 *      mode seeded with authentic Punjab Small Scale Mining leases (1,836 records),
 *      and automatically syncs when cloud credentials are provided.
 */

export const cloudDatabaseConfig = {
  // Provider: 'supabase' | 'firebase' | 'local'
  provider: 'supabase',
  
  // Supabase Configuration
  supabase: {
    url: process.env.VITE_SUPABASE_URL || '',
    anonKey: process.env.VITE_SUPABASE_ANON_KEY || ''
  },
  
  // Firebase Configuration
  firebase: {
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || '',
    apiKey: process.env.VITE_FIREBASE_API_KEY || ''
  }
};
