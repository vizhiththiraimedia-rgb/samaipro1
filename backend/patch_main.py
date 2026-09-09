import os

filepath = r'C:\Users\ASUS\Desktop\xampp\htdocs\samai\backend\main.py'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

migration_code = """
    # --- AUTO MIGRATION FOR ACCESS KEYS ---
    try:
        from sqlalchemy import text
        _db = SessionLocal()
        # For Postgres and SQLite compatibility, we try them one by one
        cols = [
            "api_credit_balance INTEGER DEFAULT 0",
            "service_tier VARCHAR(50) DEFAULT 'free'",
            "key_type VARCHAR(20) DEFAULT 'staff'",
            "duration_label VARCHAR(20)",
            "payment_verified VARCHAR(10) DEFAULT 'false'",
            "telegram_chat_id VARCHAR(50)"
        ]
        for col in cols:
            try:
                _db.execute(text(f"ALTER TABLE access_keys ADD COLUMN {col}"))
                _db.commit()
            except Exception as e:
                _db.rollback()
        _db.close()
    except Exception:
        pass
    # --------------------------------------
"""

if "# --- AUTO MIGRATION FOR ACCESS KEYS ---" not in content:
    # Insert it right at the beginning of startup_event()
    target = "async def startup_event():\n"
    content = content.replace(target, target + migration_code)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added migration to main.py")
else:
    print("Migration already exists")
