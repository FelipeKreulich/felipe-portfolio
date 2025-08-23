/**
 * Type definitions for environment variables
 * This file extends the NodeJS.ProcessEnv interface
 */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Blog URLs
      NEXT_PUBLIC_BLOG_URL_DEV?: string
      NEXT_PUBLIC_BLOG_URL_PROD?: string
      
      // App URLs
      NEXT_PUBLIC_APP_URL?: string
      NEXT_PUBLIC_APP_URL_DEV?: string
      
      // Environment
      NODE_ENV: 'development' | 'production' | 'test'
      
      // Add other environment variables here as needed
    }
  }
}

export {}
