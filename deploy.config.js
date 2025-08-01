/**
 * Deployment configuration for different environments
 */

const deployConfig = {
  development: {
    buildCommand: 'npm run build',
    outputDir: 'dist',
    envFile: '.env.development',
    sourcemap: true,
    minify: false,
  },
  
  staging: {
    buildCommand: 'npm run build:staging',
    outputDir: 'dist',
    envFile: '.env.staging',
    sourcemap: true,
    minify: true,
  },
  
  production: {
    buildCommand: 'npm run build:production',
    outputDir: 'dist',
    envFile: '.env.production',
    sourcemap: false,
    minify: true,
  },
  
  // Coolify specific configuration
  coolify: {
    buildCommand: 'npm run deploy:build',
    outputDir: 'dist',
    port: 4173,
    healthCheck: '/health',
    staticFiles: true,
    gzip: true,
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
};

module.exports = deployConfig;