"""
SAM AI - WSGI Entry Point for cPanel Passenger

Usage: Deploy this file to your cPanel Python app directory.
Passenger will use this to serve the FastAPI application.
"""

import os
import sys

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main_production import app

# WSGI application object
application = app

# For health checks and Passenger compatibility
def health_check():
    return {"status": "healthy", "service": "SAM AI API"}
