from .settings import *
import os

# Production settings
DEBUG = False

ALLOWED_HOSTS = [
    '.render.com',
    'localhost',
    '127.0.0.1',
    'job-tracker-backend.onrender.com',  # Replace with your actual Render URL
]

# Database for production (using PostgreSQL on Render)
import dj_database_url
DATABASES['default'] = dj_database_url.parse(os.environ.get('DATABASE_URL'))

# CORS settings for production
CORS_ALLOWED_ORIGINS = [
    "https://your-app-name.vercel.app",  # We'll update this after deploying frontend
    "http://localhost:3000",  # Keep for development
]

CORS_ALLOW_CREDENTIALS = True

# Security settings
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')