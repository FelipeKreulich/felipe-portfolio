/**
 * Configuration file for environment variables
 * This file centralizes all environment-specific configuration
 */

export const config = {
  // Blog URLs
  blog: {
    url: process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_BLOG_URL_PROD || ''
      : process.env.NEXT_PUBLIC_BLOG_URL_DEV || 'http://192.168.1.138:3000/blog'
  },
  
  // Environment
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // App URLs
  app: {
    baseUrl: process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_APP_URL || ''
      : process.env.NEXT_PUBLIC_APP_URL_DEV || 'http://192.168.1.138:3000'
  }
} as const;

// Type for the config object
export type Config = typeof config;
