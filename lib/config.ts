/**
 * Configuration file for environment variables
 * This file centralizes all environment-specific configuration
 */

export const config = {
  // Blog URLs
  blog: {
    url: process.env.NEXT_PUBLIC_BLOG_URL || 'https://kreulich-blog.vercel.app'
  },
  
  // Environment
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // App URLs
  app: {
    baseUrl: process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_APP_URL || 'http://felipe-kreulich.vercel.app'
      : process.env.NEXT_PUBLIC_APP_URL_DEV || 'http://192.168.56.1:3000'
  }
} as const;

// Type for the config object
export type Config = typeof config;
