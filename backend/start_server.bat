@echo off
call venv\Scripts\activate
uvicorn main_production:app --host 0.0.0.0 --port 8000
