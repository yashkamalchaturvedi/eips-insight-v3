// This file is used only when the app is deployed to Netlify without a backend

// Flag to determine if we're in the Netlify environment
export const isNetlifyEnvironment = import.meta.env.VITE_NETLIFY_DEPLOYMENT === 'true';

// Base URL for API requests in development (when not on Netlify)
export const apiBaseUrl = isNetlifyEnvironment ? '' : '/api';
