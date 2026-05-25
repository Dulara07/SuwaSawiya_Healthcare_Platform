from sqlalchemy import create_engine, text
from app.config import settings
import sys

print('Using DATABASE_URL:', settings.DATABASE_URL)
try:
    engine = create_engine(settings.DATABASE_URL)
    with engine.connect() as conn:
        res = conn.execute(text('SELECT 1'))
        print('DB OK:', [row for row in res])
except Exception as e:
    print('DB ERROR:', type(e).__name__, e)
    sys.exit(1)
